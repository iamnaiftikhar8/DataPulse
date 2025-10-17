//components/pages/AnalyzePage
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { UploadCloud, FileSpreadsheet, Download, RotateCcw } from 'lucide-react';
import { toPng } from 'dom-to-image-more';
import jsPDF from 'jspdf';
import type { AnalysisResult } from '@/src/types';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend,
  CartesianGrid, ReferenceLine, Brush, BarChart, Bar, PieChart, Pie, Cell, Label
} from 'recharts';

type Status = 'idle' | 'uploading' | 'analyzing' | 'done';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';

const palette = {
  bg: '#0C0D10',
  grid: 'rgba(255,255,255,0.06)',
  axis: 'rgba(255,255,255,0.70)',
  ticks: 'rgba(255,255,255,0.65)',
  tooltipBg: 'rgba(10,10,12,0.92)',
  tooltipBorder: 'rgba(255,255,255,0.12)',
  a1: '#7DD3FC',
  a2: '#A78BFA',
  a3: '#34D399',
  a4: '#FBBF24',
  a5: '#F87171',
};

const fmt = {
  n: (v: number | string) => {
    const x = Number(v);
    if (Number.isNaN(x)) return String(v ?? '-');
    if (Math.abs(x) >= 1_000_000) return (x / 1_000_000).toFixed(2) + 'M';
    if (Math.abs(x) >= 1_000) return (x / 1_000).toFixed(1) + 'k';
    return Intl.NumberFormat().format(x);
  },
};

const CardTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-md px-3 py-2 text-xs shadow-lg"
      style={{
        background: palette.tooltipBg,
        border: `1px solid ${palette.tooltipBorder}`,
        color: 'white',
        backdropFilter: 'blur(6px)',
      }}
    >
      <div className="mb-1 font-medium">x: {String(label)}</div>
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full" style={{ background: p.color || p.stroke }} />
          <span className="opacity-80">{p.name ?? p.dataKey}:</span>
          <span className="font-mono">{fmt.n(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

/* ---------- UI primitives ---------- */
const Section: React.FC<React.PropsWithChildren<{ title: string; subtitle?: string }>> = ({ title, subtitle, children }) => (
  <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 ring-1 ring-white/5">
    <div>
      <h2 className="text-lg font-bold text-white">{title}</h2>
      {subtitle ? <p className="mt-1 text-sm text-gray-400">{subtitle}</p> : null}
    </div>
    <div className="mt-4">{children}</div>
  </section>
);

const Stat: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
    <div className="text-[11px] uppercase tracking-wide text-gray-400">{label}</div>
    <div className="mt-1 text-xl font-bold text-white">{value}</div>
  </div>
);

/* ---------- Charts ---------- */
function LinePanel({ data, name = 'Series', dataKey = 'y' }: { data?: any[]; name?: string; dataKey?: string }) {
  const axisStyle = { fontSize: 12, fill: palette.ticks };
  const arr = data ?? [];
  const avg = arr.length ? arr.reduce((s, d) => s + (Number(d?.[dataKey]) || 0), 0) / arr.length : 0;
  const gradId = React.useId();

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={arr} margin={{ top: 12, right: 24, bottom: 8, left: 8 }}>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={palette.a1} stopOpacity={0.9} />
              <stop offset="100%" stopColor={palette.a1} stopOpacity={0.15} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={palette.grid} vertical={false} />
          <XAxis dataKey="x" tick={axisStyle} axisLine={{ stroke: palette.grid }} tickLine={{ stroke: palette.grid }} />
          <YAxis tick={axisStyle} axisLine={{ stroke: palette.grid }} tickLine={{ stroke: palette.grid }}>
            <Label value={name} position="insideLeft" angle={-90} fill={palette.axis} style={{ fontSize: 11 }} />
          </YAxis>
          <Tooltip content={<CardTooltip />} />
          <Legend verticalAlign="top" height={24} wrapperStyle={{ color: 'white', fontSize: 12 }} iconType="circle" />
          <ReferenceLine y={avg} stroke={palette.axis} strokeDasharray="3 3" />
          <Line type="monotone" name={name} dataKey={dataKey} stroke={`url(#${gradId})`} strokeWidth={2.2} dot={false} activeDot={{ r: 4 }} />
          <Brush height={18} travellerWidth={10} stroke={palette.axis} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function BarPanel({ data, name = 'Value', dataKey = 'value', nameKey = 'name' }: { data?: any[]; name?: string; dataKey?: string; nameKey?: string }) {
  const axisStyle = { fontSize: 12, fill: palette.ticks };
  const gradId = React.useId();

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data ?? []} margin={{ top: 12, right: 24, bottom: 8, left: 8 }}>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={palette.a2} stopOpacity={0.95} />
              <stop offset="100%" stopColor={palette.a2} stopOpacity={0.2} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={palette.grid} vertical={false} />
          <XAxis dataKey={nameKey} tick={axisStyle} axisLine={{ stroke: palette.grid }} tickLine={{ stroke: palette.grid }} />
          <YAxis tick={axisStyle} axisLine={{ stroke: palette.grid }} tickLine={{ stroke: palette.grid }} />
          <Tooltip content={<CardTooltip />} />
          <Legend verticalAlign="top" height={24} wrapperStyle={{ color: 'white', fontSize: 12 }} iconType="circle" />
          <Bar dataKey={dataKey} name={name} fill={`url(#${gradId})`} radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function PiePanel({ data, dataKey = 'value', nameKey = 'name', donut = true }: { data?: any[]; dataKey?: string; nameKey?: string; donut?: boolean }) {
  const colors = [palette.a1, palette.a2, palette.a3, palette.a4, palette.a5];
  const arr = data ?? [];
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={{ top: 12, right: 24, bottom: 8, left: 8 }}>
          <Tooltip content={<CardTooltip />} />
          <Legend verticalAlign="top" height={24} wrapperStyle={{ color: 'white', fontSize: 12 }} iconType="circle" />
          <Pie
            data={arr}
            dataKey={dataKey}
            nameKey={nameKey}
            outerRadius={110}
            innerRadius={donut ? 60 : 0}
            paddingAngle={2}
            stroke={palette.bg}
            strokeOpacity={0.6}
            label={({ name, value }: any) => `${name} (${fmt.n(value)})`}
          >
            {arr.map((_: any, i: number) => <Cell key={i} fill={colors[i % colors.length]} />)}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ---------- Main Page ---------- */
export default function AnalyzePage() {
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const reportRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // OPTIONAL: ensure a server session exists if the cookie is missing
  useEffect(() => {
    (async () => {
      try {
        await fetch(`${API_BASE}/api/session/start`, {
          method: 'POST',
          credentials: 'include',
        });
      } catch {}
    })();
  }, []);

  function resetAll() {
    setFile(null);
    setResult(null);
    setProgress(0);
    setStatus('idle');
    setDragOver(false);
    if (inputRef.current) inputRef.current.value = '';
  }

  async function sendToBackend(selected: File) {
    setStatus('analyzing');
    setProgress(8);

    const form = new FormData();
    form.append('file', selected);

    const tick = setInterval(() => setProgress(p => (p < 92 ? p + 4 : p)), 250);

    try {
      const r = await fetch(`${API_BASE}/api/analyze`, {
        method: 'POST',
        body: form,
        credentials: 'include', // IMPORTANT: send dp_session_id cookie
      });
      if (!r.ok) throw new Error(await r.text().catch(() => 'Analyze failed'));
      const data = (await r.json()) as AnalysisResult;
      setResult(data);
      setProgress(100);
      setStatus('done');
    } catch (e) {
      console.error(e);
      alert('Analyze failed');
      setStatus('idle');
      setProgress(0);
    } finally {
      clearInterval(tick);
    }
  }

  function onFilesSelected(filesList: FileList | null) {
    const f = filesList?.[0];
    if (!f) return;
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
    if (e.dataTransfer.files?.length) onFilesSelected(e.dataTransfer.files);
  }
  function onDragOver(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(true);
  }
  function onDragLeave() {
    setDragOver(false);
  }

  // Export: text-only executive PDF (includes full KPIs)
  function exportPdfTextOnly() {
    if (!result) return;

    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const pageW = doc.internal.pageSize.getWidth();
    let y = 14;

    const H1 = (t: string) => { doc.setFont('helvetica','bold'); doc.setFontSize(16); doc.text(t, 12, y); y += 8; };
    const H2 = (t: string) => { doc.setFont('helvetica','bold'); doc.setFontSize(12); doc.text(t, 12, y); y += 6; };
    const P  = (t: string) => {
      doc.setFont('helvetica','normal'); doc.setFontSize(11);
      const lines: string[] = doc.splitTextToSize(t, pageW - 24) as string[];
      for (const ln of lines) { if (y > 282) { doc.addPage(); y = 14; } doc.text(ln, 12, y); y += 6; }
      y += 1;
    };
    const KV = (label: string, value: unknown, opts?: {suffix?: string}) => {
      const v = value === null || value === undefined || value === '' ? '-' :
                typeof value === 'number' ? (Number.isFinite(value) ? String(value) : '-') :
                String(value);
      P(`${label}: ${v}${opts?.suffix ?? ''}`);
    };

    H1('DataPulse Analysis Report');

    // Profiling
    const p = result.profiling ?? {};
    H2('Profiling');
    KV('Rows', (p as any).rows);
    KV('Columns', (p as any).columns);
    KV('Missing Values (total)', (p as any).missing_total);
    if ((p as any)?.numeric_columns?.length !== undefined) {
      KV('Numeric Columns', (p as any).numeric_columns.length);
    }

    // KPIs
    const k: any = result.kpis ?? {};
    H2('Key Performance Indicators');
    KV('Total Rows', k.total_rows ?? (p as any).rows);
    KV('Total Columns', k.total_columns ?? (p as any).columns);
    if (typeof k.missing_pct === 'number') KV('Missing %', k.missing_pct, { suffix: '%' });
    KV('Duplicates', k.duplicate_rows);
    KV('Outliers (IQR)', k.outliers_total);
    if (typeof k.rows_per_day === 'number') KV('Rows / Day', k.rows_per_day.toFixed(1));
    if (k.worst_outlier_column) KV('Worst Outlier Column', k.worst_outlier_column);
    if (Array.isArray(k.suspected_keys) && k.suspected_keys.length) KV('Suspected Keys', k.suspected_keys.join(', '));
    if (k.time && (k.time.min_date || k.time.max_date)) {
      KV('Date Coverage', `${k.time.min_date ?? '?'} → ${k.time.max_date ?? '?'}`);
    }

    // AI Summary
    const ai = (result as any).detailed_summary ?? null;
    H2('AI Executive Summary');
    const para = ai?.executive_overview ?? (result as any).insights?.summary ?? '';
    if (para) P(para);
    if (Array.isArray(ai?.key_trends) && ai.key_trends.length) {
      H2('Key Trends');
      (ai.key_trends as string[]).forEach((t) => P(`• ${t}`));
    }
    if (Array.isArray(ai?.action_items_quick_wins) && ai.action_items_quick_wins.length) {
      H2('Quick Wins');
      (ai.action_items_quick_wins as string[]).forEach((t) => P(`• ${t}`));
    }

    doc.save('DataPulse-Report.pdf');
  }

  // Export: panel image -> PDF
  async function exportPdf() {
    const el = reportRef.current;
    if (!el) return alert('Nothing to export yet.');

    const dataUrl = await toPng(el, {
      cacheBust: true,
      bgcolor: '#0b0b0b',
      style: { backgroundImage: 'none', filter: 'none' },
      width: el.scrollWidth,
      height: el.scrollHeight,
      quality: 1,
      pixelRatio: 2,
    });

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();

    const img = new Image();
    img.src = dataUrl;
    await img.decode();

    const imgWmm = pageW;
    const imgHmm = (img.height * imgWmm) / img.width;

    let y = 0;
    pdf.addImage(dataUrl, 'PNG', 0, y, imgWmm, imgHmm);

    for (let remaining = imgHmm - pageH; remaining > 0; remaining -= pageH) {
      pdf.addPage();
      y -= pageH;
      pdf.addImage(dataUrl, 'PNG', 0, y, imgWmm, imgHmm);
    }

    pdf.save('DataPulse-Report.pdf');
  }

  const canReset = status !== 'idle' || file !== null || progress > 0;

  return (
    <main className="relative min-h-screen w-full bg-black text-gray-200">
      <div className="mx-auto max-w-6xl px-6 py-10 sm:py-12">
        {/* Header */}
        <header className="mb-8 flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Analytics</h1>
            <p className="mt-1 text-sm text-gray-400">Analyze your data with AI-powered insights and generate reports.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={exportPdf}
              disabled={!result}
              className={[
                'inline-flex items-center gap-2 rounded-md px-3 py-2 text-xs font-medium ring-1 ring-inset transition',
                result
                  ? 'bg-gradient-to-r from-cyan-500 to-violet-500 text-black ring-white/10 hover:from-cyan-400 hover:to-violet-400'
                  : 'cursor-not-allowed bg-white/5 text-gray-500 ring-white/10',
              ].join(' ')}
            >
              <Download className="h-4 w-4" /> Export PDF
            </button>
            <button
              type="button"
              onClick={resetAll}
              disabled={!canReset}
              className={[
                'inline-flex items-center gap-2 rounded-md px-3 py-2 text-xs font-medium ring-1 ring-inset transition',
                canReset
                  ? 'bg-white/10 text-gray-200 ring-white/15 hover:bg-white/20'
                  : 'cursor-not-allowed bg-white/5 text-gray-500 ring-white/10',
              ].join(' ')}
            >
              <RotateCcw className="h-4 w-4" /> Reset
            </button>
          </div>
        </header>

        {/* Upload & Progress */}
        <div className="grid gap-6 md:grid-cols-2">
          <Section title="File Upload" subtitle="Upload an Excel/CSV and we’ll analyze it.">
            <div
              onDrop={onDrop}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && inputRef.current?.click()}
              className={[
                'flex h-48 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center outline-none transition',
                dragOver ? 'border-cyan-400/70 bg-white/[0.04]' : 'border-white/15 bg-white/[0.02] hover:bg-white/[0.04]',
              ].join(' ')}
            >
              <UploadCloud className="mb-3 h-9 w-9 text-gray-400" />
              <p className="text-[15px] font-semibold text-gray-200">Drag and drop your Excel/CSV here</p>
              <p className="mt-1 text-sm text-gray-500">Or click to browse</p>

              <button
                onClick={() => inputRef.current?.click()}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white/[0.06] px-4 py-2 text-sm font-medium text-white ring-1 ring-inset ring-white/10 transition hover:bg-white/[0.1]"
              >
                <FileSpreadsheet className="h-4 w-4" />
                Browse Files
              </button>

              <input
                ref={inputRef}
                type="file"
                accept=".xls,.xlsx,.csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv"
                className="hidden"
                onChange={(e) => onFilesSelected(e.target.files)}
              />
            </div>

            {file && (
              <div className="mt-4 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-gray-300">
                <span className="font-medium text-white">{file.name}</span>
                <span className="ml-2 text-gray-500">({Math.round(file.size / 1024)} KB)</span>
              </div>
            )}
          </Section>

          <Section title="AI Analysis Progress" subtitle="We’ll process your file and compute KPIs.">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">{progress}%</span>
              <span className="text-xs text-gray-400">
                {status === 'done' ? 'Analysis complete.' : status === 'analyzing' ? 'Analyzing data…' : status === 'uploading' ? 'Uploading…' : 'Waiting for file…'}
              </span>
            </div>
            <div className="mt-2 h-2 w-full rounded-full bg-white/10">
              <div
                className={[
                  'h-2 rounded-full transition-[width] duration-200 ease-out',
                  status === 'done' ? 'bg-emerald-500' : 'bg-gradient-to-r from-cyan-500 to-violet-500',
                ].join(' ')}
                style={{ width: `${progress}%` }}
              />
            </div>
          </Section>
        </div>

        {/* RESULTS */}
        <div ref={reportRef} className="mt-8 space-y-8">
          {/* PROFILING */}
          <Section title="Profiling" subtitle="Dataset shape and data types.">
            {result ? (
              <>
                <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
                  <Stat label="Rows" value={result.profiling?.rows ?? '-'} />
                  <Stat label="Columns" value={result.profiling?.columns ?? '-'} />
                  <Stat label="Missing Values" value={result.profiling?.missing_total ?? 0} />
                  <Stat label="Numeric Columns" value={(result.profiling as any)?.numeric_columns?.length ?? 0} />
                </div>

                {result.profiling?.dtypes && (
                  <div className="mt-4 overflow-x-auto rounded-lg border border-white/10 bg-black/40">
                    <table className="min-w-full text-left text-xs">
                      <thead className="bg-white/5 text-gray-300">
                        <tr>
                          <th className="px-3 py-2 font-semibold">Column</th>
                          <th className="px-3 py-2 font-semibold">Type</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10 text-gray-200">
                        {Object.entries(result.profiling.dtypes).slice(0, 30).map(([col, t]) => (
                          <tr key={col}>
                            <td className="px-3 py-2">{col}</td>
                            <td className="px-3 py-2 text-gray-400">{String(t)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="px-3 py-2 text-[11px] text-gray-500">Showing up to 30 columns.</div>
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-gray-500">No data yet. Upload a file to see profiling.</p>
            )}
          </Section>

          {/* KPIs */}
          <Section title="KPIs" subtitle="Quality checks, cardinality, time coverage, and more.">
            {result ? (
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                <Stat label="Total Rows" value={result.kpis?.total_rows ?? result.profiling?.rows ?? '-'} />
                <Stat label="Total Columns" value={result.kpis?.total_columns ?? result.profiling?.columns ?? '-'} />
                <Stat label="Missing %" value={result.kpis?.missing_pct != null ? `${result.kpis?.missing_pct}%` : '-'} />
                <Stat label="Duplicates" value={result.kpis?.duplicate_rows ?? 0} />
                <Stat label="Outliers (IQR)" value={result.kpis?.outliers_total ?? 0} />
                <Stat label="Rows/Day" value={result.kpis?.rows_per_day ?? '-'} />
              </div>
            ) : (
              <p className="text-sm text-gray-500">KPIs will appear after analysis.</p>
            )}
          </Section>

          {/* CHARTS */}
          <Section title="Charts" subtitle="Trends, distribution and composition.">
            {result?.charts ? (
              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-black/50 p-5">
                  <h3 className="mb-3 text-sm font-semibold text-white">Trend</h3>
                  <LinePanel data={result.charts.line} name="Trend" />
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/50 p-5">
                  <h3 className="mb-3 text-sm font-semibold text-white">Top Categories</h3>
                  <BarPanel data={result.charts.bar} name="Value" />
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/50 p-5 md:col-span-2">
                  <h3 className="mb-3 text-sm font-semibold text-white">Composition</h3>
                  <PiePanel data={result.charts.pie} />
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Charts will appear after analysis.</p>
            )}
          </Section>

          {/* AI SUMMARY */}
          <Section title="AI Executive Summary" subtitle="One-paragraph overview, trends, and quick wins.">
            {result ? (
              <div className="rounded-2xl border border-white/10 bg-black/50 p-5">
                <p className="text-sm leading-6 text-gray-200 whitespace-pre-wrap">
                  {(result as any)?.detailed_summary?.executive_overview ??
                    (result as any)?.insights?.summary ??
                    'No AI summary was returned from the backend for this file.'}
                </p>

                {(result as any)?.detailed_summary?.key_trends?.length ? (
                  <div className="mt-4">
                    <h4 className="text-xs font-semibold text-gray-400">Key Trends</h4>
                    <ul className="mt-1 list-disc pl-5 text-sm text-gray-200">
                      {(result as any).detailed_summary.key_trends.map((t: string, i: number) => <li key={i}>{t}</li>)}
                    </ul>
                  </div>
                ) : null}

                {(result as any)?.detailed_summary?.action_items_quick_wins?.length ? (
                  <div className="mt-4">
                    <h4 className="text-xs font-semibold text-gray-400">Quick Wins</h4>
                    <ul className="mt-1 list-disc pl-5 text-sm text-gray-200">
                      {(result as any).detailed_summary.action_items_quick_wins.map((t: string, i: number) => <li key={i}>{t}</li>)}
                    </ul>
                  </div>
                ) : null}

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    onClick={exportPdf}
                    className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-violet-500 px-4 py-2 text-sm font-semibold text-black ring-1 ring-inset ring-white/10 hover:from-cyan-400 hover:to-violet-400"
                  >
                    <Download className="h-4 w-4" />
                    Export Panel as PDF (Image)
                  </button>
                  <button
                    onClick={exportPdfTextOnly}
                    className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-inset ring-white/15 hover:bg-white/20"
                  >
                    <Download className="h-4 w-4" />
                    Export Executive PDF (Text)
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">AI summary will appear after analysis.</p>
            )}
          </Section>
        </div>
      </div>
    </main>
  );
}
