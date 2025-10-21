// components/pages/AnalysisResultModal.tsx - COMPLETE ENHANCED VERSION
'use client';

import React from 'react';
import { Download, X, AlertTriangle, TrendingUp, Rocket, Lightbulb, Target, BarChart3 } from 'lucide-react';
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
/*function ProLineChart({
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
*/
// -----------------------------
// Card primitives
// -----------------------------
const Card: React.FC<React.PropsWithChildren<{ title: string; className?: string }>> = ({ title, className = '', children }) => (
  <div className={`rounded-2xl border border-white/10 bg-black/50 p-6 ${className}`}>
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
// AI Summary Section Components
// -----------------------------
const SectionHeader: React.FC<{ icon: React.ReactNode; title: string; subtitle?: string }> = ({ icon, title, subtitle }) => (
  <div className="flex items-center gap-3 mb-4">
    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/10">
      {icon}
    </div>
    <div>
      <h4 className="text-sm text-justify font-semibold text-white">{title}</h4>
      {subtitle && <p className="text-xs text-justify text-gray-400 mt-1">{subtitle}</p>}
    </div>
  </div>
);

const InsightItem: React.FC<{ 
  icon: React.ReactNode; 
  title: string; 
  items: string[]; 
  color?: string;
  badge?: string;
}> = ({ icon, title, items, color = "gray", badge }) => (
  <div className="mb-6 last:mb-0">
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        {icon}
        <h5 className="text-xs font-semibold text-white">{title}</h5>
      </div>
      {badge && (
        <span className={`text-xs px-2 py-1 rounded-full bg-${color}-500/20 text-${color}-400 border border-${color}-500/30`}>
          {badge}
        </span>
      )}
    </div>
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="flex items-start gap-3 group">
          <div className={`w-1.5 h-1.5 rounded-full bg-${color}-400 mt-2 flex-shrink-0`} />
          <p className="text-sm text-gray-200 group-hover:text-white transition-colors flex-1">{item}</p>
        </div>
      ))}
    </div>
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
  const ai = data?.detailed_summary ?? ({} as any);

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
        {/*(data as any).charts && (
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
        )*/}

        {/* Enhanced AI Insights */}
        <div className="mt-8">
          <Card title="AI Executive Summary" className="bg-gradient-to-br from-white/[0.03] to-white/[0.01]">
            {/* Executive Overview */}
            <SectionHeader 
              icon={<BarChart3 className="h-4 w-4 text-cyan-400" />} 
              title="Executive Overview" 
              subtitle="High-level business insights and data significance"
            />
            <div className="bg-white/5 rounded-lg p-4 mb-6">
              <p className="text-sm text-justify leading-6 text-gray-200 whitespace-pre-wrap">
                {aiParagraph}
              </p>
            </div>

            {/* Data Quality Assessment */}
            {ai?.data_quality_assessment && (
              <>
                <SectionHeader 
                  icon={<AlertTriangle className="h-4 w-4 text-amber-400" />} 
                  title="Data Quality Assessment" 
                  subtitle="Reliability and completeness evaluation"
                />
                <div className="bg-gradient-to-r from-amber-500/10 to-transparent rounded-lg p-4 mb-6 border-l-4 border-amber-400">
                  <p className="text-sm text-justify leading-6 text-gray-200">
                    {ai.data_quality_assessment}
                  </p>
                </div>
              </>
            )}

            {/* Key Trends & Business Implications - Side by Side */}
            <div className="grid gap-6 md:grid-cols-2 mb-6">
              {/* Key Trends */}
              {ai?.key_trends?.length ? (
                <div className="bg-gradient-to-br from-cyan-500/5 to-transparent rounded-xl p-4 border border-cyan-500/20">
                  <InsightItem
                    icon={<TrendingUp className="h-4 w-4 text-cyan-400" />}
                    title="Key Trends & Patterns"
                    items={ai.key_trends}
                    color="cyan"
                    badge="Patterns"
                  />
                </div>
              ) : null}

              {/* Business Implications */}
              {ai?.business_implications?.length ? (
                <div className="bg-gradient-to-br from-purple-500/5 to-transparent rounded-xl p-4 border border-purple-500/20">
                  <InsightItem
                    icon={<Target className="h-4 w-4 text-purple-400" />}
                    title="Business Implications"
                    items={ai.business_implications}
                    color="purple"
                    badge="Impact"
                  />
                </div>
              ) : null}
            </div>

            {/* Strategic Recommendations */}
            {(ai?.recommendations?.short_term?.length || ai?.recommendations?.long_term?.length) && (
              <>
                <SectionHeader 
                  icon={<Lightbulb className="h-4 w-4 text-blue-400" />} 
                  title="Strategic Recommendations" 
                  subtitle="Actionable insights for business improvement"
                />
                <div className="grid gap-4 mb-6">
                  {/* Short-term Recommendations */}
                  {ai.recommendations?.short_term?.length ? (
                    <div className="bg-gradient-to-r from-blue-500/10 to-transparent rounded-xl p-4 border-l-4 border-blue-400">
                      <InsightItem
                        icon={<Rocket className="h-4 w-4 text-blue-400" />}
                        title="Short-term Actions (0-3 months)"
                        items={ai.recommendations.short_term}
                        color="blue"
                        badge="Quick Start"
                      />
                    </div>
                  ) : null}

                  {/* Long-term Recommendations */}
                  {ai.recommendations?.long_term?.length ? (
                    <div className="bg-gradient-to-r from-violet-500/10 to-transparent rounded-xl p-4 border-l-4 border-violet-400">
                      <InsightItem
                        icon={<BarChart3 className="h-4 w-4 text-violet-400" />}
                        title="Long-term Strategies (3-12 months)"
                        items={ai.recommendations.long_term}
                        color="violet"
                        badge="Strategic"
                      />
                    </div>
                  ) : null}
                </div>
              </>
            )}

            {/* Quick Wins & Risk Alerts - Side by Side */}
            <div className="grid gap-6 md:grid-cols-2 mb-6">
              {/* Quick Wins */}
              {ai?.action_items_quick_wins?.length ? (
                <div className="bg-gradient-to-br from-emerald-500/5 to-transparent rounded-xl p-4 border border-emerald-500/20">
                  <InsightItem
                    icon={<Rocket className="h-4 w-4 text-emerald-400" />}
                    title="Immediate Quick Wins"
                    items={ai.action_items_quick_wins}
                    color="emerald"
                    badge="High Impact"
                  />
                </div>
              ) : null}

              {/* Risk Alerts */}
              {ai?.risk_alerts?.length ? (
                <div className="bg-gradient-to-br from-rose-500/5 to-transparent rounded-xl p-4 border border-rose-500/20">
                  <InsightItem
                    icon={<AlertTriangle className="h-4 w-4 text-rose-400" />}
                    title="Risk Alerts & Considerations"
                    items={ai.risk_alerts}
                    color="rose"
                    badge="Attention"
                  />
                </div>
              ) : null}
            </div>

            {/* Predictive Insights & Industry Comparison - Side by Side */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Predictive Insights */}
              {ai?.predictive_insights?.length ? (
                <div className="bg-gradient-to-br from-amber-500/5 to-transparent rounded-xl p-4 border border-amber-500/20">
                  <InsightItem
                    icon={<TrendingUp className="h-4 w-4 text-amber-400" />}
                    title="Predictive Insights"
                    items={ai.predictive_insights}
                    color="amber"
                    badge="Future"
                  />
                </div>
              ) : null}

              {/* Industry Comparison */}
              {ai?.industry_comparison && (
                <div className="bg-gradient-to-br from-indigo-500/5 to-transparent rounded-xl p-4 border border-indigo-500/20">
                  <SectionHeader 
                    icon={<BarChart3 className="h-4 w-4 text-indigo-400" />} 
                    title="Industry Benchmarking" 
                  />
                  <p className="text-sm text-justify leading-6 text-gray-200 mt-3">
                    {ai.industry_comparison}
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}