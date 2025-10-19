// /app/analyze/page.tsx
'use client';

import React, { useRef, useState } from 'react';
import { UploadCloud, FileSpreadsheet, RotateCcw } from 'lucide-react';
import jsPDF from 'jspdf';
import AnalysisResultModal from '@/components/pages/AnalysisResultModal';
import type { AnalysisResult, DetailedSummary } from '@/src/types';

type Status = 'idle' | 'uploading' | 'analyzing' | 'done';

export default function AnalyzePage() {
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [progress, setProgress] = useState(0);

  // optional inputs to guide summary (only needed if your backend uses them)
  const [goal] = useState('improve profitability');
  const [audience] = useState<'executive' | 'analyst' | 'product' | 'sales'>('executive');

  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  // Prevent double submission (drag+drop + change)
  const inFlight = useRef(false);

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

  async function sendToBackend(selected: File) {
    if (inFlight.current) return; // re-entrancy guard
    inFlight.current = true;

    setStatus('analyzing');
    setProgress(10);

    const tick = setInterval(() => setProgress(p => (p < 92 ? p + 5 : p)), 200);

    try {
      // 1) Single upload + quick analysis
      const f1 = new FormData();
      f1.append('file', selected);

      const idem = await fileSha256Hex(selected);
      const r1 = await fetch('/api/analyze', {
        method: 'POST',
        body: f1,
        headers: {
          'X-Idempotency-Key': idem,
        },
      });
       if (r1.status === 401) {
        clearInterval(tick);
        inFlight.current = false;
        setStatus('idle');
        setProgress(0);
        alert('Please log in first to generate a report.');
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
          // redirect to your checkout page
          window.location.href = url;
        } else {
          alert('You’ve used your free report. Please upgrade to continue.');
        }
        return;
      }

      if (!r1.ok) {
        const t = await r1.text().catch(() => '');
        throw new Error(t || `Analyze failed with ${r1.status}`);
      }


      if (!r1.ok) throw new Error(await r1.text());
      const quick = (await r1.json()) as AnalysisResult & { upload_id?: string; content_hash?: string };

      // Prefer server-issued handle; fall back to content_hash if that's what your API uses
      const uploadHandle = quick.upload_id ?? quick.content_hash;

      // 2) AI summary WITHOUT re-uploading the file
      let detailedNormalized: DetailedSummary | null = null;
      if (uploadHandle) {
        const r2 = await fetch('/api/ai-summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            upload_id: uploadHandle,
            business_goal: goal,
            audience,
          }),
        });

        if (r2.ok) {
          const data = await r2.json();
          // If backend already returns DetailedSummary, keep it.
          if (data?.executive_overview || data?.key_trends || data?.action_items_quick_wins) {
            detailedNormalized = {
              executive_overview: data.executive_overview ?? '',
              key_trends: Array.isArray(data.key_trends) ? data.key_trends : [],
              action_items_quick_wins: Array.isArray(data.action_items_quick_wins) ? data.action_items_quick_wins : [],
            };
          } else if (typeof data?.summary === 'string') {
            // Map { summary: "..."} into DetailedSummary
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
    const f = filesList?.[0];
    if (!f) return;
    if (inFlight.current) return; // guard repeated triggers

    const ok =
      /\.xlsx?$/i.test(f.name) ||
      /\.csv$/i.test(f.name) ||
      f.type.includes('spreadsheet') ||
      f.type.includes('csv');
    if (!ok) {
      alert('Please upload an Excel/CSV file.');
      return;
    }
    setFile(f);
    setStatus('uploading');
    setTimeout(() => sendToBackend(f), 300);
  }

  // ======= TEXT-ONLY PDF (no screenshots, avoids html2canvas/dom-to-image) =======
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
    // removed example_avg: not part of your type

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
  // ===============================================================================

  const canReset = status !== 'idle' || file !== null || progress > 0;

  return (
    <main className="min-h-screen bg-black text-gray-200">
      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Header */}
        <header className="mb-8 flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Analytics</h1>
            <p className="mt-1 text-sm text-gray-400">Upload data → analyze → AI summary → export text PDF.</p>
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
            onDrop={e => {
              e.preventDefault();
              setDragOver(false);
              if (e.dataTransfer.files?.length) onFilesSelected(e.dataTransfer.files);
            }}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            role="button"
            tabIndex={0}
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
