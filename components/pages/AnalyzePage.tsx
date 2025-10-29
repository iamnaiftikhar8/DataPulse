// components/pages/AnalyzePage.tsx - ENHANCED VERSION
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { UploadCloud, FileSpreadsheet, RotateCcw, User, LogOut } from 'lucide-react';
import jsPDF from 'jspdf';
import AnalysisResultModal from '@/components/pages/AnalysisResultModal';
import type { AnalysisResult, DetailedSummary } from '@/src/types';

type Status = 'idle' | 'uploading' | 'analyzing' | 'done';

interface UserInfo {
  user_id: string;
  session_id: string;
  authenticated: boolean;
}

export default function AnalyzePage() {
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [progress, setProgress] = useState(0);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  
  const [goal] = useState('improve profitability');
  const [audience] = useState<'executive' | 'analyst' | 'product' | 'sales'>('executive');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const inFlight = useRef(false);
// Add this state variable
  const [usageStats, setUsageStats] = useState<{
  today_usage: number;
  daily_limit: number;
  remaining: number;
} | null>(null);

  // ENHANCED: Check authentication status on component mount
 useEffect(() => {
  if (userInfo?.authenticated) {
    fetchUsageStats();
  }
}, [userInfo]);

// Update your fetchUsageStats function
const fetchUsageStats = async () => {
  try {
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";
    console.log('🔍 Fetching usage stats...');
    
    const response = await fetch(`${API_BASE}/api/usage/stats`, {
      method: 'GET',
      credentials: 'include',
    });
    
    if (response.ok) {
      const stats = await response.json();
      console.log('✅ Usage stats received:', stats);
      setUsageStats(stats);
    } else {
      console.warn('❌ Failed to fetch usage stats:', response.status);
      // Set default stats as fallback
      setUsageStats({
        today_usage: 0,
        daily_limit: 40,
        remaining: 40
      });
    }
  } catch (error) {
    console.error('💥 Fetch usage stats failed:', error);
    // Set default stats on error
    setUsageStats({
      today_usage: 0,
      daily_limit: 40,
      remaining: 40
    });
  }
};

  // ENHANCED: Function to check authentication status
  const checkAuthStatus = async () => {
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";
      const response = await fetch(`${API_BASE}/api/auth/me`, {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const userData = await response.json();
        setUserInfo(userData);
        console.log('✅ User authenticated:', userData);
      } else {
        console.log('❌ User not authenticated');
        setUserInfo(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUserInfo(null);
    }
  };

  // ENHANCED: Ensure session exists
  useEffect(() => {
    (async () => {
      try {
        const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";
        await fetch(`${API_BASE}/api/session/start`, {
          method: 'POST',
          credentials: 'include',
        });
        // Re-check auth status after session start
        checkAuthStatus();
      } catch (error) {
        console.error('Session start failed:', error);
      }
    })();
  }, []);

  // ENHANCED: Logout function
  const handleLogout = async () => {
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";
      await fetch(`${API_BASE}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      setUserInfo(null);
      resetAll();
      // Optional: Redirect to login page
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

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
    inputRef.current?.click();
  }

  // Stable idempotency key from file bytes
  async function fileSha256Hex(f: File) {
    const buf = await f.arrayBuffer();
    const hash = await crypto.subtle.digest('SHA-256', buf);
    return [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // ENHANCED: Backend function with better auth handling
  async function sendToBackend(selected: File) {
    if (inFlight.current) return;
    inFlight.current = true;

    // Check auth status before proceeding
    if (!userInfo?.authenticated) {
      alert('Please log in first to generate a report.');
      inFlight.current = false;
      return;
    }

  // Check if user has remaining reports
  if (usageStats && usageStats.remaining <= 0) {
    alert(`You've used all ${usageStats.daily_limit} free reports today. Please upgrade to continue.`);
    // Redirect to pricing page
    window.location.href = '/pricing';
    inFlight.current = false;
    return;
  }
    setStatus('analyzing');
    setProgress(10);

    const tick = setInterval(() => setProgress(p => (p < 92 ? p + 5 : p)), 200);

    try {
      const formData = new FormData();
      formData.append('file', selected);

      const idem = await fileSha256Hex(selected);
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";
      
      const r1 = await fetch(`${API_BASE}/api/analyze`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
        headers: {
          'X-Idempotency-Key': idem,
        },
      });

      // Enhanced auth error handling
      if (r1.status === 401) {
        clearInterval(tick);
        inFlight.current = false;
        setStatus('idle');
        setProgress(0);
        setUserInfo(null); // Clear user info on auth failure
        alert('Session expired. Please log in again.');
        return;
      }

      if (r1.status === 402) {
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
         
      // Redirect to pricing page
        window.location.href = '/pricing';
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
        const r2 = await fetch(`${API_BASE}/api/ai-summary`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            upload_id: uploadHandle,
            business_goal: goal,
            audience,
          }),
        });

        if (r2.ok) {
          const data = await r2.json();
          
          if (data) {
            detailedNormalized = {
              executive_overview: data.executive_overview ?? '',
              data_quality_assessment: data.data_quality_assessment ?? '',
              key_trends: Array.isArray(data.key_trends) ? data.key_trends : [],
              business_implications: Array.isArray(data.business_implications) ? data.business_implications : [],
              recommendations: data.recommendations || { short_term: [], long_term: [] },
              action_items_quick_wins: Array.isArray(data.action_items_quick_wins) ? data.action_items_quick_wins : [],
              risk_alerts: Array.isArray(data.risk_alerts) ? data.risk_alerts : [],
              predictive_insights: Array.isArray(data.predictive_insights) ? data.predictive_insights : [],
              industry_comparison: data.industry_comparison ?? '',
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
    const f = filesList?.[0];
    if (!f) return;
    if (inFlight.current) return;

    // Check authentication before file processing
    if (!userInfo?.authenticated) {
      alert('Please log in first to generate a report.');
      return;
    }

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
    
    // Check authentication before processing drop
    if (!userInfo?.authenticated) {
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
// Text-only PDF export (for the modal) - COMPLETE VERSION
function exportPdfTextOnly() {
  if (!result) return;

  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  let y = 14;

  const addTitle = (t: string) => { 
    doc.setFont('Times new Roman', 'bold'); 
    doc.setFontSize(16); 
    doc.text(t, 12, y); 
    y += 8; 
  };
  
  const addH2 = (t: string) => { 
    doc.setFont('Times new Roman', 'bold'); 
    doc.setFontSize(12); 
    doc.text(t, 12, y); 
    y += 6; 
  };
  
  const addH3 = (t: string) => { 
    doc.setFont('Times new Roman', 'bold'); 
    doc.setFontSize(11); 
    doc.text(t, 12, y); 
    y += 5; 
  };
  
  const addText = (t: string) => {
    if (!t) return;
    doc.setFont('Times new Roman', 'normal'); 
    doc.setFontSize(11);
    const lines = doc.splitTextToSize(t, pageW - 24);
    for (const line of lines) {
      if (y > 282) { doc.addPage(); y = 14; }
      doc.text(line, 12, y); 
      y += 6;
    }
    y += 1;
  };
  
  const addList = (items: string[]) => { 
    if (!items?.length) return;
    items.forEach(it => addText(`• ${it}`)); 
  };

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
  //if (k.rows_per_day) addText(`Rows per Day: ${k.rows_per_day}`);

  // Time analysis if available
  if (k.time?.date_column) {
    addH3('Time Analysis');
    addText(`Date Column: ${k.time.date_column}`);
    addText(`Date Range: ${k.time.min_date} to ${k.time.max_date}`);
    if (k.time.days_covered) addText(`Days Covered: ${k.time.days_covered}`);
  }

  // High-variance columns if available
  const topVariance = (k as any)?.top_variance_numeric_cols;
  if (Array.isArray(topVariance) && topVariance.length) {
    addH3('High Variance Columns');
    addText(topVariance.join(', '));
  }

  // AI Summary - COMPLETE VERSION WITH ALL SECTIONS
  const ai = result.detailed_summary ?? {} as any;
  const aiParagraph = ai?.executive_overview ?? result.insights?.summary ?? '';

  if (aiParagraph || Object.keys(ai).length > 0) {
    addH2('AI Executive Summary');
    
    // Executive Overview
    if (aiParagraph) {
      addH3('Executive Overview');
      addText(aiParagraph);
    }

    // Data Quality Assessment
    if (ai?.data_quality_assessment) {
      addH3('Data Quality Assessment');
      addText(ai.data_quality_assessment);
    }

    // Key Trends
    if (ai?.key_trends?.length) {
      addH3('Key Trends & Patterns');
      addList(ai.key_trends);
    }

    // Business Implications
    if (ai?.business_implications?.length) {
      addH3('Business Implications');
      addList(ai.business_implications);
    }

    // Strategic Recommendations
    if (ai?.recommendations) {
      // Short-term recommendations
      if (ai.recommendations.short_term?.length) {
        addH3('Short-term Recommendations (0-3 months)');
        addList(ai.recommendations.short_term);
      }
      
      // Long-term recommendations
      if (ai.recommendations.long_term?.length) {
        addH3('Long-term Strategies (3-12 months)');
        addList(ai.recommendations.long_term);
      }
    }

    // Quick Wins
    if (ai?.action_items_quick_wins?.length) {
      addH3('Immediate Quick Wins');
      addList(ai.action_items_quick_wins);
    }

    // Risk Alerts
    if (ai?.risk_alerts?.length) {
      addH3('Risk Alerts & Considerations');
      addList(ai.risk_alerts);
    }

    // Predictive Insights
    if (ai?.predictive_insights?.length) {
      addH3('Predictive Insights');
      addList(ai.predictive_insights);
    }

    // Industry Comparison
    if (ai?.industry_comparison) {
      addH3('Industry Benchmarking');
      addText(ai.industry_comparison);
    }

    // Additional sections that might exist
    if (ai?.anomalies_detected?.length) {
      addH3('Anomalies Detected');
      addList(ai.anomalies_detected);
    }

    if (ai?.success_metrics?.length) {
      addH3('Success Metrics');
      addList(ai.success_metrics);
    }

    if (ai?.next_steps?.length) {
      addH3('Recommended Next Steps');
      addList(ai.next_steps);
    }
  }

 
  doc.save('DataPulse-Complete-Report.pdf');
}

  const canReset = status !== 'idle' || file !== null || progress > 0;

  return (
    <main className="min-h-screen bg-black text-gray-200">
      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Header */}
        <header className="mb-8 flex items-end justify-between">
          <div className="pt-8"> {/* Add this line */}

          <div>
            
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Analytics</h1>
            <p className="mt-1 text-sm text-gray-400">Upload data • analyze • AI summary • view results</p>
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
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && inputRef.current?.click()}
            className={[
              'mt-4 flex h-56 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center outline-none transition',
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