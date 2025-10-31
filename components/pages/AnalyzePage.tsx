// components/pages/AnalyzePage.tsx - COMPLETE VERSION
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { UploadCloud, FileSpreadsheet, RotateCcw, User, LogOut, Crown, AlertTriangle } from 'lucide-react';
import jsPDF from 'jspdf';
import AnalysisResultModal from '@/components/pages/AnalysisResultModal';
import type { AnalysisResult, DetailedSummary } from '@/src/types';

type Status = 'idle' | 'uploading' | 'analyzing' | 'done';

interface UserInfo {
  user_id: string;
  session_id: string;
  authenticated: boolean;
  user_name?: string;
  email?: string;
  is_premium?: boolean;
}

interface UsageStats {
  can_generate: boolean;
  today_used: number;
  daily_limit: number;
  is_premium: boolean;
  next_available: string | null;
  reason: string;
}

export default function AnalyzePage() {
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [progress, setProgress] = useState(0);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null);
  const [showUsageModal, setShowUsageModal] = useState(false);
  
  const [goal] = useState('improve profitability');
  const [audience] = useState<'executive' | 'analyst' | 'product' | 'sales'>('executive');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const inFlight = useRef(false);

  // Enhanced authentication check
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Check usage stats when user info changes
  useEffect(() => {
    if (userInfo?.authenticated) {
      fetchUsageStats();
    }
  }, [userInfo]);


  useEffect(() => {
  // Check if we have a session cookie but userInfo is null (Google OAuth case)
  const checkSessionCookie = () => {
    if (!userInfo && document.cookie.includes('dp_session_id')) {
      console.log('🔄 Session cookie found but userInfo null, retrying auth check...');
      // Retry auth check after a delay
      setTimeout(() => {
        checkAuthStatus();
      }, 1000);
    }
  };

  // Check after component mounts
  checkSessionCookie();
}, [userInfo]);


const checkAuthStatus = async () => {
  try {
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://test-six-fawn-47.vercel.app";
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
      
      // Wait 2 seconds before redirecting to give Google OAuth time to set cookies
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    }
  } catch (error) {
    console.error('Auth check failed:', error);
    setUserInfo(null);
    
    // Wait 2 seconds before redirecting on network errors
    setTimeout(() => {
      window.location.href = '/login';
    }, 2000);
  }
};

  const fetchUsageStats = async () => {
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://test-six-fawn-47.vercel.app";
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
          can_generate: true,
          today_used: 0,
          daily_limit: 1,
          is_premium: false,
          next_available: null,
          reason: 'ERROR'
        });
      }
    } catch (error) {
      console.error('💥 Fetch usage stats failed:', error);
      // Set default stats on error
      setUsageStats({
        can_generate: true,
        today_used: 0,
        daily_limit: 1,
        is_premium: false,
        next_available: null,
        reason: 'ERROR'
      });
    }
  };

  const handleLogout = async () => {
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://test-six-fawn-47.vercel.app";
      await fetch(`${API_BASE}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      setUserInfo(null);
      setUsageStats(null);
      resetAll();
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const redirectToPricing = () => {
    window.location.href = '/pricing';
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

// In AnalyzePage.tsx - ADD this function
const retryAuthCheck = async () => {
  console.log('🔄 Retrying authentication check...');
  await checkAuthStatus();
  
  // If still not authenticated after retry, show message
  if (!userInfo) {
    console.log('❌ Still not authenticated after retry');
  }
};

function onBrowseClick() {
  // Check authentication first
  if (!userInfo?.authenticated) {
    console.log('User not authenticated, checking if this is a Google OAuth user...');
    
    // Check if we have a session cookie (Google OAuth case)
    if (document.cookie.includes('dp_session_id')) {
      console.log('🔄 Session cookie found, retrying auth check...');
      retryAuthCheck();
      return;
    }
    
    // No session cookie, redirect to login
    window.location.href = '/login';
    return;
  }

  // Check usage limits
  if (usageStats && !usageStats.can_generate) {
    setShowUsageModal(true);
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

  async function sendToBackend(selected: File) {
    if (inFlight.current) return;
    inFlight.current = true;

    // Check authentication
    if (!userInfo?.authenticated) {
      alert('Please log in first to generate a report.');
      inFlight.current = false;
      return;
    }

    // Check usage limits
    if (usageStats && !usageStats.can_generate) {
      setShowUsageModal(true);
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
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://test-six-fawn-47.vercel.app";
      
      const r1 = await fetch(`${API_BASE}/api/analyze`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
        headers: {
          'X-Idempotency-Key': idem,
        },
      });

      // Enhanced error handling
      if (r1.status === 401) {
        clearInterval(tick);
        inFlight.current = false;
        setStatus('idle');
        setProgress(0);
        setUserInfo(null);
        alert('Session expired. Please log in again.');
        window.location.href = '/login';
        return;
      }

      if (r1.status === 402) {
        let pay = null;
        try { pay = await r1.json(); } catch {}
        clearInterval(tick);
        inFlight.current = false;
        setStatus('idle');
        setProgress(0);
        
        // Show usage modal with proper message
        setShowUsageModal(true);
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
      
      // Refresh usage stats after successful report generation
      await fetchUsageStats();
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

    // Check authentication
    if (!userInfo?.authenticated) {
      alert('Please log in first to generate a report.');
      window.location.href = '/login';
      return;
    }

    // Check usage limits
    if (usageStats && !usageStats.can_generate) {
      setShowUsageModal(true);
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
    
    // Check authentication
    if (!userInfo?.authenticated) {
      alert('Please log in first to generate a report.');
      window.location.href = '/login';
      return;
    }

    // Check usage limits
    if (usageStats && !usageStats.can_generate) {
      setShowUsageModal(true);
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

  // Text-only PDF export
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
    if (k.rows_per_day) addText(`Rows per Day: ${k.rows_per_day}`);

    // AI Summary
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
        if (ai.recommendations.short_term?.length) {
          addH3('Short-term Recommendations (0-3 months)');
          addList(ai.recommendations.short_term);
        }
        
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
    }

    doc.save('DataPulse-Complete-Report.pdf');
  }

  const canReset = status !== 'idle' || file !== null || progress > 0;

  return (
    <main className="min-h-screen bg-black text-gray-200">
      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Header */}
        <header className="mb-8 flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Analytics</h1>
            <p className="mt-1 text-sm text-gray-400">Upload data • Analyze • AI summary • View Results</p>
          </div>

          <div className="flex items-center gap-4">
            {/* User Info & Usage Stats */}
            {userInfo && (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  
                  <div className="text-xs text-gray-400">
                    {usageStats ? (
                      <span>
                        {usageStats.is_premium ? (
                          <span className="flex items-center gap-1 text-amber-400">
                            <Crown className="h-3 w-3" />
                            Premium • Reports: {usageStats.today_used}/∞
                          </span>
                        ) : (
                          <span>
  Reports: {usageStats.today_used}/{usageStats.daily_limit}
  {!usageStats.can_generate && usageStats.next_available && (
    <span className="text-orange-400">
      • Next: Tomorrow at {new Date(usageStats.next_available).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
    </span>
  )}
                      </span>
                        )}
                      </span>
                    ) : (
                      'Loading...'
                    )}
                  </div>
                </div>
               
              </div>
            )}

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
          </div>
        </header>

        {/* Usage Limit Warning */}
        {usageStats && !usageStats.can_generate && (
          <div className="mb-6 rounded-lg border border-orange-500/30 bg-orange-500/10 p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-orange-400" />
              <div className="flex-1">
                <h3 className="font-medium text-orange-300">Daily Report Limit Reached</h3>
                <p className="text-sm text-orange-200">
                  You've used your free report for today. 
                  {usageStats.next_available && (
                    <> Next report available at {new Date(usageStats.next_available).toLocaleTimeString()}. </>
                  )}
                  Upgrade to premium for unlimited reports.
                </p>
              </div>
              <button
                onClick={redirectToPricing}
                className="rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-black transition hover:bg-amber-400"
              >
                Upgrade Now
              </button>
            </div>
          </div>
        )}

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
              'mt-4 flex h-56 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center outline-none transition',
              dragOver ? 'border-cyan-400/70 bg-white/[0.04]' : 'border-white/15 bg-white/[0.02] hover:bg-white/[0.04]',
              usageStats && !usageStats.can_generate ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
            ].join(' ')}
            onClick={onBrowseClick}
          >
            <UploadCloud className="mb-3 h-9 w-9 text-gray-400" />
            <p className="text-[15px] font-semibold text-gray-200">Drag & drop your Excel/CSV here</p>
            <p className="mt-1 text-sm text-gray-500">or click to browse</p>

            <button
              type="button"
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

        {/* Enhanced Professional Progress Section */}
<section className="mt-6 rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.02] to-white/[0.01] p-6 backdrop-blur-sm">
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className={`rounded-lg p-2 ${
        status === 'done' ? 'bg-emerald-500/20' : 
        status === 'analyzing' ? 'bg-cyan-500/20' : 
        status === 'uploading' ? 'bg-blue-500/20' : 
        'bg-gray-500/20'
      }`}>
        {status === 'done' ? (
          <svg className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : status === 'analyzing' ? (
          <svg className="h-4 w-4 animate-spin text-cyan-400" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        ) : status === 'uploading' ? (
          <svg className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        ) : (
          <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
        )}
      </div>
      <div>
        <h2 className="text-sm font-semibold text-white">AI Analysis Progress</h2>
        <p className="mt-0.5 text-xs text-gray-400">
          {status === 'done' ? 'Analysis complete and ready' :
           status === 'analyzing' ? 'Processing data with AI algorithms' :
           status === 'uploading' ? 'Securely uploading your file' :
           'Awaiting file upload to begin'}
        </p>
      </div>
    </div>
    
    <div className="text-right">
      <span className="text-lg font-bold text-white">{progress}%</span>
      <div className="text-xs text-gray-400 mt-0.5">
        {status === 'done' ? 'Complete' : 'In Progress'}
      </div>
    </div>
  </div>

  {/* Enhanced Progress Bar */}
  <div className="mt-4">
    <div className="flex justify-between text-xs text-gray-400 mb-2">
      <span>0%</span>
      <span>50%</span>
      <span>100%</span>
    </div>
    
    <div className="relative">
      {/* Background Track with subtle gradient */}
      <div className="h-3 w-full rounded-full bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden">
        {/* Animated shimmer effect for active states */}
        {status !== 'idle' && status !== 'done' && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
        )}
      </div>
      
      {/* Progress Fill */}
      <div 
        className={`absolute top-0 left-0 h-3 rounded-full transition-all duration-500 ease-out ${
          status === 'done' 
            ? 'bg-gradient-to-r from-emerald-400 to-emerald-500 shadow-lg shadow-emerald-500/25' 
            : 'bg-gradient-to-r from-cyan-400 via-violet-500 to-purple-500 shadow-lg shadow-cyan-500/25'
        }`}
        style={{ width: `${progress}%` }}
      >
        {/* Progress glow effect */}
        <div className={`absolute inset-0 rounded-full ${
          status === 'done' 
            ? 'bg-emerald-400 animate-pulse-glow' 
            : 'bg-cyan-400 animate-pulse-glow'
        }`} />
      </div>
      
      {/* Progress indicator dot */}
      {progress > 0 && progress < 100 && (
        <div 
          className={`absolute top-1/2 w-4 h-4 rounded-full border-2 border-white shadow-lg -translate-y-1/2 ${
            status === 'done' ? 'bg-emerald-400' : 'bg-cyan-400'
          }`}
          style={{ left: `calc(${progress}% - 8px)` }}
        >
          <div className="absolute inset-0 rounded-full bg-white animate-ping opacity-20" />
        </div>
      )}
    </div>
  </div>

  {/* Status Details */}
  <div className="mt-4 flex items-center justify-between text-xs">
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-1.5">
        <div className={`w-2 h-2 rounded-full ${
          status === 'uploading' ? 'bg-blue-400 animate-pulse' : 'bg-gray-600'
        }`} />
        <span className={status === 'uploading' ? 'text-blue-300' : 'text-gray-500'}>
          Upload
        </span>
      </div>
      
      <div className="flex items-center gap-1.5">
        <div className={`w-2 h-2 rounded-full ${
          status === 'analyzing' ? 'bg-cyan-400 animate-pulse' : 'bg-gray-600'
        }`} />
        <span className={status === 'analyzing' ? 'text-cyan-300' : 'text-gray-500'}>
          Analysis
        </span>
      </div>
      
      <div className="flex items-center gap-1.5">
        <div className={`w-2 h-2 rounded-full ${
          status === 'done' ? 'bg-emerald-400' : 'bg-gray-600'
        }`} />
        <span className={status === 'done' ? 'text-emerald-300' : 'text-gray-500'}>
          Complete
        </span>
      </div>
    </div>
    
    {/* Time estimate - you can make this dynamic based on file size */}
    <div className="text-gray-400">
      {status === 'uploading' && '≈ 10s remaining'}
      {status === 'analyzing' && '≈ 30s remaining'}
      {status === 'done' && 'Ready to view'}
    </div>
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

      {/* Usage Limit Modal */}
      {showUsageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-md rounded-2xl border border-orange-500/30 bg-gray-900 p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-orange-400" />
              <h3 className="text-lg font-semibold text-white">Daily Limit Reached</h3>
            </div>
            
            <p className="text-gray-300 mb-2">
              You've used your free report for today.
            </p>
            
            {usageStats?.next_available && (
              <p className="text-sm text-orange-300 mb-4">
                Next report available: {new Date(usageStats.next_available).toLocaleString()}
              </p>
            )}

            <p className="text-gray-400 text-sm mb-6">
              Upgrade to premium for unlimited reports and advanced features.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowUsageModal(false)}
                className="flex-1 rounded-lg bg-gray-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-600"
              >
                Maybe Later
              </button>
              <button
                onClick={redirectToPricing}
                className="flex-1 rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-black transition hover:bg-amber-400"
              >
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}