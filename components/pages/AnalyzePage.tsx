// components/pages/AnalyzePage.tsx - COMPLETE UPDATED VERSION
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { UploadCloud, FileSpreadsheet, RotateCcw, LogIn } from 'lucide-react';
import jsPDF from 'jspdf';
import AnalysisResultModal from '@/components/pages/AnalysisResultModal';
import type { AnalysisResult, DetailedSummary } from '@/src/types';

type Status = 'idle' | 'uploading' | 'analyzing' | 'done';

export default function AnalyzePage() {
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [progress, setProgress] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  
  const [goal] = useState('improve profitability');
  const [audience] = useState<'executive' | 'analyst' | 'product' | 'sales'>('executive');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const inFlight = useRef(false);

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsCheckingAuth(true);
        
        // First check localStorage (for OAuth users)
        const localAuth = localStorage.getItem('isAuthenticated');
        const authToken = localStorage.getItem('authToken');
        
        if (localAuth === 'true' && authToken) {
          console.log('User authenticated via localStorage (OAuth)');
          setIsAuthenticated(true);
          setIsCheckingAuth(false);
          return;
        }

        // If no local auth, check with server session
        const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'https://test-six-fawn-47.vercel.app';
        const sessionResponse = await fetch(`${API_BASE}/api/auth/session`, {
          method: 'GET',
          credentials: 'include',
        });

        if (sessionResponse.ok) {
          const sessionData = await sessionResponse.json();
          if (sessionData.authenticated) {
            console.log('User authenticated via server session');
            localStorage.setItem('isAuthenticated', 'true');
            if (sessionData.token) {
              localStorage.setItem('authToken', sessionData.token);
            }
            setIsAuthenticated(true);
            setIsCheckingAuth(false);
            return;
          }
        }

        // Try to start a session if none exists
        try {
          await fetch(`${API_BASE}/api/session/start`, {
            method: 'POST',
            credentials: 'include',
          });
        } catch (sessionError) {
          console.log('Session start failed, continuing...');
        }

        // If both checks fail, user is not authenticated
        console.log('User not authenticated');
        setIsAuthenticated(false);
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, []);

  function resetAll() {
    setFile(null);
    setResult(null);
    setModalOpen(false);
    setProgress(0);
    setStatus('idle');
    setDragOver(false);
    inFlight.current = false;
    if (inputRef.current) inputRef.current.value = '';
  }

  function onBrowseClick() {
    if (!isAuthenticated) {
      alert('Please log in first to generate a report.');
      return;
    }
    inputRef.current?.click();
  }

  // Stable idempotency key from file bytes
  async function fileSha256Hex(f: File) {
    const buf = await f.arrayBuffer();
    const hash = await crypto.subtle.digest('SHA-256', buf);
    return [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Enhanced backend function with proper auth headers
  async function sendToBackend(selected: File) {
    if (inFlight.current) return;
    if (!isAuthenticated) {
      alert('Please log in first to generate a report.');
      return;
    }

    inFlight.current = true;
    setStatus('analyzing');
    setProgress(10);

    const tick = setInterval(() => setProgress(p => (p < 92 ? p + 5 : p)), 200);

    try {
      // Get auth token from localStorage
      const authToken = localStorage.getItem('authToken');
      
      const formData = new FormData();
      formData.append('file', selected);

      const idem = await fileSha256Hex(selected);
      
      // Prepare headers with authentication
      const headers: HeadersInit = {
        'X-Idempotency-Key': idem,
      };

      // Add auth token if available (for OAuth users)
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const r1 = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
        headers,
        credentials: 'include', // Important for session cookies
      });

      // Handle authentication errors
      if (r1.status === 401) {
        clearInterval(tick);
        inFlight.current = false;
        setStatus('idle');
        setProgress(0);
        setIsAuthenticated(false);
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('authToken');
        alert('Your session has expired. Please log in again to generate a report.');
        return;
      }

      if (r1.status === 402) {
        // paywall branch
        let pay = null;
        try { pay = await r1.json(); } catch {}
        const url = pay?.checkout_url;
        clearInterval(tick);
        inFlight.current = false;
        setStatus('idle');
        setProgress(0);
        if (url) {
          window.location.href = url;
        } else {
          alert('You\'ve used your free report. Please upgrade to continue.');
        }
        return;
      }

      if (!r1.ok) {
        const t = await r1.text().catch(() => '');
        throw new Error(t || `Analyze failed with ${r1.status}`);
      }

      const quick = (await r1.json()) as AnalysisResult & { upload_id?: string; content_hash?: string };

      // AI summary logic
      const uploadHandle = quick.upload_id ?? quick.content_hash;
      let detailedNormalized: DetailedSummary | null = null;
      
      if (uploadHandle) {
        // Prepare headers for AI summary request
        const aiHeaders: HeadersInit = {
          'Content-Type': 'application/json',
        };
        
        if (authToken) {
          aiHeaders['Authorization'] = `Bearer ${authToken}`;
        }

        const r2 = await fetch('/api/ai-summary', {
          method: 'POST',
          headers: aiHeaders,
          credentials: 'include',
          body: JSON.stringify({
            upload_id: uploadHandle,
            business_goal: goal,
            audience,
          }),
        });

        if (r2.ok) {
          const data = await r2.json();
          if (data?.executive_overview || data?.key_trends || data?.action_items_quick_wins) {
            detailedNormalized = {
              executive_overview: data.executive_overview ?? '',
              key_trends: Array.isArray(data.key_trends) ? data.key_trends : [],
              action_items_quick_wins: Array.isArray(data.action_items_quick_wins) ? data.action_items_quick_wins : [],
            };
          } else if (typeof data?.summary === 'string') {
            detailedNormalized = {
              executive_overview: data.summary,
              key_trends: [],
              action_items_quick_wins: [],
            };
          }
        }
      }

      const finalDetailed = detailedNormalized ?? quick.detailed_summary;

      setResult({
        ...quick,
        detailed_summary: finalDetailed,
      });
      setProgress(100);
      setStatus('done');
      setModalOpen(true);
    } catch (e) {
      console.error(e);
      alert('Analyze failed. See console/network for details.');
      setStatus('idle');
      setProgress(0);
    } finally {
      clearInterval(tick);
      inFlight.current = false;
    }
  }

  function onFilesSelected(filesList: FileList | null) {
    if (!isAuthenticated) {
      alert('Please log in first to generate a report.');
      return;
    }

    const f = filesList?.[0];
    if (!f) return;
    if (inFlight.current) return;

    const ok =
      /\.xlsx?$/i.test(f.name) ||
      /\.csv$/i.test(f.name) ||
      f.type.includes('spreadsheet') ||
      f.type.includes('csv');

    if (!ok) {
      alert('Please upload an Excel file (.xls, .xlsx) or CSV.');
      return;
    }
    setFile(f);
    setStatus('uploading');
    setTimeout(() => sendToBackend(f), 300);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    if (!isAuthenticated) {
      alert('Please log in first to generate a report.');
      return;
    }
    if (e.dataTransfer.files?.length) onFilesSelected(e.dataTransfer.files);
  }
  
  function onDragOver(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(true);
  }
  
  function onDragLeave() {
    setDragOver(false);
  }

  // Text-only PDF export (for the modal)
  function exportPdfTextOnly() {
    if (!result) return;

    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const pageW = doc.internal.pageSize.getWidth();
    let y = 14;

    const addTitle = (t: string) => { doc.setFont('helvetica', 'bold'); doc.setFontSize(16); doc.text(t, 12, y); y += 8; };
    const addH2    = (t: string) => { doc.setFont('helvetica', 'bold'); doc.setFontSize(12); doc.text(t, 12, y); y += 6; };
    const addText  = (t: string) => {
      doc.setFont('helvetica', 'normal'); doc.setFontSize(11);
      const lines = doc.splitTextToSize(t, pageW - 24);
      for (const line of lines) {
        if (y > 282) { doc.addPage(); y = 14; }
        doc.text(line, 12, y); y += 6;
      }
      y += 1;
    };
    const addList = (items: string[]) => { items.forEach(it => addText(`• ${it}`)); };

    doc.text('', 0, 0); // ensure font init

    // Title
    addTitle('DataPulse Analysis Report');

    // Profiling
    const p = result.profiling ?? {};
    addH2('Data Profile');
    addText(`Rows: ${p.rows ?? '-'}    Columns: ${p.columns ?? '-'}`);
    addText(`Missing Values: ${p.missing_total ?? 0}`);
    if (p.numeric_columns?.length) addText(`Numeric Columns: ${p.numeric_columns.slice(0, 12).join(', ')}`);

    // KPIs
    const k = result.kpis ?? {};
    addH2('Key Performance Indicators');
    addText(`Total Rows: ${k.total_rows ?? p.rows ?? '-'}`);
    addText(`Total Columns: ${k.total_columns ?? p.columns ?? '-'}`);
    if (typeof k.missing_pct === 'number') addText(`Missing %: ${k.missing_pct}%`);
    if (typeof k.duplicate_rows === 'number') addText(`Duplicates: ${k.duplicate_rows}`);
    if (typeof k.outliers_total === 'number') addText(`Outliers: ${k.outliers_total}`);

    // AI Summary
    const ai = result.detailed_summary ?? null;
    const aiParagraph =
      ai?.executive_overview ??
      result.insights?.summary ??
      '';

    if (aiParagraph || ai?.key_trends?.length || ai?.action_items_quick_wins?.length) {
      addH2('AI Executive Summary');
      if (aiParagraph) addText(aiParagraph);
      if (ai?.key_trends?.length) { addH2('Key Trends'); addList(ai.key_trends); }
      if (ai?.action_items_quick_wins?.length) { addH2('Quick Wins'); addList(ai.action_items_quick_wins); }
    }

    doc.save('DataPulse-Report.pdf');
  }

  const handleLoginRedirect = () => {
    window.location.href = '/login';
  };

  const canReset = status !== 'idle' || file !== null || progress > 0;

  // Show loading state while checking authentication
  if (isCheckingAuth) {
    return (
      <main className="min-h-screen bg-black text-gray-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Checking authentication...</p>
        </div>
      </main>
    );
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-black text-gray-200">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <div className="text-center">
            <div className="mx-auto w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mb-6">
              <LogIn className="h-10 w-10 text-cyan-400" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white mb-4">
              Authentication Required
            </h1>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Please log in to access the analytics dashboard and generate detailed reports.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={handleLoginRedirect}
                className="inline-flex items-center gap-3 rounded-xl bg-cyan-600 px-8 py-4 text-lg font-semibold text-white transition hover:bg-cyan-700 shadow-lg"
              >
                <LogIn className="h-5 w-5" />
                Go to Login
              </button>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-3 rounded-xl bg-white/10 px-6 py-4 text-lg font-semibold text-white transition hover:bg-white/20 ring-1 ring-white/10"
              >
                <RotateCcw className="h-5 w-5" />
                Retry
              </button>
            </div>
            <p className="mt-8 text-sm text-gray-500">
              After logging in with Google or other methods, you'll be able to upload files and generate AI-powered reports.
            </p>
          </div>
        </div>
      </main>
    );
  }

  // Original component JSX for authenticated users
  return (
    <main className="min-h-screen bg-black text-gray-200">
      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Header */}
        <header className="mb-8 flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Analytics</h1>
            <p className="mt-1 text-sm text-gray-400">Upload data → analyze → AI summary → view results.</p>
            <div className="mt-2 flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-emerald-400">Authenticated</span>
            </div>
          </div>
          <button
            type="button"
            onClick={resetAll}
            disabled={!canReset}
            className={[
              'inline-flex items-center gap-2 rounded-md px-3 py-2 text-xs font-medium ring-1 ring-inset transition',
              canReset ? 'bg-white/10 text-gray-200 ring-white/15 hover:bg-white/20'
                       : 'cursor-not-allowed bg-white/5 text-gray-500 ring-white/10',
            ].join(' ')}
          >
            <RotateCcw className="h-4 w-4" /> Reset
          </button>
        </header>

        {/* Uploader */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-sm font-semibold text-gray-300">File Upload</h2>

          <div
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onBrowseClick()}
            className={[
              'mt-4 flex h-56 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center outline-none transition cursor-pointer',
              dragOver ? 'border-cyan-400/70 bg-white/[0.04]' : 'border-white/15 bg-white/[0.02] hover:bg-white/[0.04]',
            ].join(' ')}
          >
            <UploadCloud className="mb-3 h-9 w-9 text-gray-400" />
            <p className="text-[15px] font-semibold text-gray-200">Drag & drop your Excel/CSV here</p>
            <p className="mt-1 text-sm text-gray-500">or click to browse</p>

            <button
              onClick={onBrowseClick}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white/[0.06] px-4 py-2 text-sm font-medium text-white ring-1 ring-inset ring-white/10 transition hover:bg-white/[0.1]"
            >
              <FileSpreadsheet className="h-4 w-4" /> Browse Files
            </button>

            <input
              ref={inputRef}
              type="file"
              accept=".xls,.xlsx,.csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv"
              className="hidden"
              onChange={e => onFilesSelected(e.target.files)}
            />
          </div>

          {file && (
            <div className="mt-4 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-gray-300">
              <span className="font-medium text-white">{file.name}</span>
              <span className="ml-2 text-gray-500">({Math.round(file.size / 1024)} KB)</span>
            </div>
          )}
        </section>

        {/* Progress */}
        <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-300">AI Analysis Progress</h2>
            <span className="text-xs text-gray-400">{progress}%</span>
          </div>

          <div className="mt-2 text-xs text-gray-400">
            {status === 'done' ? 'Analysis complete.' :
             status === 'analyzing' ? 'Analyzing data…' :
             status === 'uploading' ? 'Uploading file…' :
             'Waiting for file…'}
          </div>

          <div className="mt-2 h-2 w-full rounded-full bg-white/10">
            <div
              className={`h-2 rounded-full transition-[width] duration-200 ease-out ${status === 'done' ? 'bg-emerald-500' : 'bg-gradient-to-r from-cyan-500 to-violet-500'}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </section>
      </div>

      {/* Results Modal */}
      <AnalysisResultModal
        open={modalOpen && !!result}
        onClose={() => setModalOpen(false)}
        data={result ?? ({} as AnalysisResult)}
        onExportPdf={exportPdfTextOnly}
      />
    </main>
  );
}