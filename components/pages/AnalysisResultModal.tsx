// components/pages/AnalysisResultModal.tsx - FIXED VERSION
'use client';

import React from 'react';
import { Download, X } from 'lucide-react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend,
  CartesianGrid, ReferenceLine, Brush, BarChart, Bar, PieChart, Pie, Cell, Label
} from 'recharts';

// Use the shared type so page.tsx and this modal agree.
import type { AnalysisResult } from '@/src/types';

// -----------------------------
// Theme + helpers
// -----------------------------
const palette = {
  bg: "#0C0D10",
  panel: "#111318",
  grid: "rgba(255,255,255,0.06)",
  axis: "rgba(255,255,255,0.65)",
  ticks: "rgba(255,255,255,0.55)",
  tooltipBg: "rgba(10,10,12,0.9)",
  tooltipBorder: "rgba(255,255,255,0.1)",

  accent1: "#7DD3FC",
  accent2: "#A78BFA",
  accent3: "#34D399",
  accent4: "#FBBF24",
  accent5: "#F87171",
};
const seriesOrder = [palette.accent1, palette.accent2, palette.accent3, palette.accent4, palette.accent5];

const fmt = {
  n: (v: number | string) => {
    const x = Number(v);
    if (Number.isNaN(x)) return String(v ?? "-");
    if (Math.abs(x) >= 1_000_000) return (x / 1_000_000).toFixed(2) + "M";
    if (Math.abs(x) >= 1_000) return (x / 1_000).toFixed(1) + "k";
    return Intl.NumberFormat().format(x);
  },
  pct: (v: number) => `${(v * 100).toFixed(1)}%`,
};

// -----------------------------
// Tooltip
// -----------------------------
const CardTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-md px-3 py-2 text-xs shadow-lg"
      style={{
        background: palette.tooltipBg,
        border: `1px solid ${palette.tooltipBorder}`,
        color: "white",
        backdropFilter: "blur(6px)",
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

// -----------------------------
// Small sparkline
// -----------------------------
function Sparkline({ data, dataKey = 'y' }: { data: any[]; dataKey?: string }) {
  return (
    <div className="h-10 w-24">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Tooltip content={<CardTooltip />} />
          <Line type="monotone" dataKey={dataKey} dot={false} stroke={palette.accent3} strokeOpacity={0.9} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// -----------------------------
// Charts
// -----------------------------
function ProLineChart({
  data,
  dataKey = "y",
  name = "Series",
  syncId = "main-sync",
  showMean = true,
}: { data: { x: number | string; [k: string]: any }[]; dataKey?: string; name?: string; syncId?: string; showMean?: boolean; }) {
  const gradId = React.useId();
  const avg = data?.length ? data.reduce((s, d) => s + (Number(d?.[dataKey]) || 0), 0) / data.length : 0;
  const axisStyle = { fontSize: 12, fill: palette.ticks };

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} syncId={syncId} margin={{ top: 12, right: 24, bottom: 8, left: 8 }}>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={palette.accent1} stopOpacity={0.9} />
              <stop offset="100%" stopColor={palette.accent1} stopOpacity={0.15} />
            </linearGradient>
          </defs>

          <CartesianGrid stroke={palette.grid} vertical={false} />
          <XAxis dataKey="x" tick={axisStyle} axisLine={{ stroke: palette.grid }} tickLine={{ stroke: palette.grid }} />
          <YAxis tick={axisStyle} axisLine={{ stroke: palette.grid }} tickLine={{ stroke: palette.grid }}>
            <Label value={name} position="insideLeft" angle={-90} fill={palette.axis} style={{ fontSize: 11 }} />
          </YAxis>

          <Tooltip content={<CardTooltip />} />
          <Legend verticalAlign="top" height={24} wrapperStyle={{ color: 'white', fontSize: 12 }} iconType="circle" />
          {showMean && <ReferenceLine y={avg} stroke={palette.axis} strokeDasharray="3 3" />}

          <Line
            type="monotone"
            name={name}
            dataKey={dataKey}
            stroke={`url(#${gradId})`}
            strokeWidth={2.2}
            dot={false}
            activeDot={{ r: 4 }}
          />
          <Brush height={18} travellerWidth={10} stroke={palette.axis} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function ProBarChart({
  data,
  dataKey = "value",
  nameKey = "name",
  name = "Value",
  syncId = "main-sync",
}: { data: { name: string; value: number }[]; dataKey?: string; nameKey?: string; name?: string; syncId?: string; }) {
  const gradId = React.useId();
  const axisStyle = { fontSize: 12, fill: palette.ticks };

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} syncId={syncId} margin={{ top: 12, right: 24, bottom: 8, left: 8 }}>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={palette.accent2} stopOpacity={0.95} />
              <stop offset="100%" stopColor={palette.accent2} stopOpacity={0.2} />
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

function ProPieChart({
  data,
  dataKey = "value",
  nameKey = "name",
  donut = true,
}: { data: { name: string; value: number }[]; dataKey?: string; nameKey?: string; donut?: boolean; }) {
  const colors = seriesOrder;

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={{ top: 12, right: 24, bottom: 8, left: 8 }}>
          <Tooltip content={<CardTooltip />} />
          <Legend verticalAlign="top" height={24} wrapperStyle={{ color: 'white', fontSize: 12 }} iconType="circle" />
          <Pie
            data={data}
            dataKey={dataKey}
            nameKey={nameKey}
            outerRadius={100}
            innerRadius={donut ? 55 : 0}
            paddingAngle={2}
            stroke={palette.bg}
            strokeOpacity={0.6}
            label={({ name, value }: any) => `${name} (${value})`}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={colors[i % colors.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

// -----------------------------
// Card primitives
// -----------------------------
const Card: React.FC<React.PropsWithChildren<{ title: string }>> = ({ title, children }) => (
  <div className="rounded-2xl border border-white/10 bg-black/50 p-6">
    <h3 className="text-sm font-semibold text-white">{title}</h3>
    <div className="mt-3">{children}</div>
  </div>
);

const Stat: React.FC<{ label: string; value: React.ReactNode; right?: React.ReactNode }> = ({ label, value, right }) => (
  <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] p-3">
    <div>
      <div className="text-[11px] uppercase tracking-wide text-gray-400">{label}</div>
      <div className="mt-1 text-xl font-bold text-white">{value}</div>
    </div>
    {right}
  </div>
);

// -----------------------------
// MAIN COMPONENT
// -----------------------------
type Props = {
  open: boolean;
  onClose: () => void;
  data: AnalysisResult;
  onExportPdf: () => void;
};

export default function AnalysisResultModal({ open, onClose, data, onExportPdf }: Props) {
  if (!open) return null;

  const p = data?.profiling ?? {};
  const k = data?.kpis ?? {};
  const ai = data?.detailed_summary ?? null;

  const aiParagraph =
    ai?.executive_overview ??
    data?.insights?.summary ??
    'No AI summary was returned from the backend for this file.';

  // Render helper for missing_pct which could be number | null
  const renderMissingPct = (val: number | null | undefined) =>
    typeof val === 'number' ? `${val}%` : '-';

  // Extra/optional fields coming from backend but not present in the shared type
  const topVariance =
    Array.isArray((k as any)?.top_variance_numeric_cols) ? (k as any).top_variance_numeric_cols as string[] : null;

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-[min(1100px,92vw)] max-h-[92vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#0C0D10] p-6 shadow-xl">
        {/* Header */}
        <div className="pt-4 mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-white">Analysis Results</h2>
            <p className="text-xs text-gray-400">Profiling • KPIs • Charts • AI Insights</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onExportPdf}
              className="inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-2 text-xs font-medium text-white ring-1 ring-inset ring-white/15 transition hover:bg-white/20"
            >
              <Download className="h-4 w-4" /> Export PDF
            </button>
            <button
              onClick={onClose}
              className="inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-2 text-xs font-medium text-white ring-1 ring-inset ring-white/15 transition hover:bg-white/20"
            >
              <X className="h-4 w-4" /> Close
            </button>
          </div>
        </div>

        {/* Top grid: Profiling & KPIs */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Profiling */}
          <Card title="Profiling">
            <div className="grid grid-cols-2 gap-3">
              <Stat label="Rows" value={(p as any).rows ?? '-'} right={<Sparkline data={(data as any).charts?.line ?? []} />} />
              <Stat label="Columns" value={(p as any).columns ?? '-'} />
              <Stat label="Missing Values" value={(p as any).missing_total ?? 0} />
              <Stat label="Numeric Columns" value={(p as any).numeric_columns?.length ?? 0} />
            </div>
            {(p as any).numeric_columns?.length ? (
              <p className="mt-3 text-xs text-gray-300">
                <span className="text-gray-400">Top Numeric Columns: </span>
                {(p as any).numeric_columns.slice(0, 8).join(', ')}
              </p>
            ) : null}
          </Card>

          {/* KPIs */}
          <Card title="KPIs">
            <div className="grid gap-3 sm:grid-cols-2">
              <Stat label="Total Rows" value={(k as any).total_rows ?? (p as any).rows ?? '-'} />
              <Stat label="Total Columns" value={(k as any).total_columns ?? (p as any).columns ?? '-'} />
              <Stat
                label="Missing %"
                value={renderMissingPct((k as any).missing_pct)}
                right={<Sparkline data={(data as any).charts?.line ?? []} />}
              />
              <Stat label="Duplicates" value={(k as any).duplicate_rows ?? 0} />
              <Stat label="Outliers" value={(k as any).outliers_total ?? 0} />
              <Stat label="Rows / Day" value={(k as any).rows_per_day ?? '-'} />
            </div>

            {k?.time?.date_column ? (
              <p className="mt-3 text-xs text-gray-300">
                <span className="text-gray-400">Date Window:</span> {k.time.min_date} → {k.time.max_date}
                {typeof k.time.days_covered === 'number' ? ` (${k.time.days_covered} days)` : ''}
              </p>
            ) : null}

            {topVariance?.length ? (
              <p className="mt-2 text-xs text-gray-300">
                <span className="text-gray-400">High-variance columns:</span> {topVariance.join(', ')}
              </p>
            ) : null}
          </Card>
        </div>

        {/* Charts */}
        {(data as any).charts && (
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <Card title="Trend">
              <ProLineChart data={(data as any).charts.line} name="Trend" />
            </Card>
            <Card title="Top Categories">
              <ProBarChart data={(data as any).charts.bar} name="Value" />
            </Card>
            <Card title="Composition">
              <ProPieChart data={(data as any).charts.pie} />
            </Card>
          </div>
        )}

        {/* AI Insights */}
        <div className="mt-6">
          <Card title="AI Executive Summary">
            <p className="text-sm leading-6 text-gray-200 whitespace-pre-wrap">{aiParagraph}</p>

            {ai?.key_trends?.length ? (
              <div className="mt-4">
                <h4 className="text-xs font-semibold text-gray-400">Key Trends</h4>
                <ul className="mt-1 list-disc pl-5 text-sm text-gray-200">
                  {ai.key_trends.map((t: string, i: number) => <li key={i}>{t}</li>)}
                </ul>
              </div>
            ) : null}

            {ai?.action_items_quick_wins?.length ? (
              <div className="mt-4">
                <h4 className="text-xs font-semibold text-gray-400">Quick Wins</h4>
                <ul className="mt-1 list-disc pl-5 text-sm text-gray-200">
                  {ai.action_items_quick_wins.map((t: string, i: number) => <li key={i}>{t}</li>)}
                </ul>
              </div>
            ) : null}
          </Card>
        </div>
      </div>
    </div>
  );
}