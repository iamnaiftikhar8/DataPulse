import React from "react";
import {
  BrainCircuit,
  FileSpreadsheet,
  ScanSearch,
  Gauge,
  BarChart3,
  LineChart,
  PieChart,
  Sparkles,
  CheckCircle2,
  Shield,
  Zap,
  Database,
  TrendingUp,
} from "lucide-react";

export default function LandingPage() {
  const features: {
    title: string;
    kicker: string;
    icon: React.ReactNode;
    points: string[];
    note?: React.ReactNode;
  }[] = [
    {
      icon: <FileSpreadsheet className="h-6 w-6" aria-hidden />,
      title: "File Upload",
      kicker: "CSV & XLSX with drag-and-drop",
      points: [
        "Drag files or click to browse",
        "Type & size validation",
        "Secure, client-side preview",
      ],
    },
    {
      icon: <ScanSearch className="h-6 w-6" aria-hidden />,
      title: "Data Profiling",
      kicker: "Rows, columns & missing",
      points: [
        "Row/column counts",
        "Numeric Columns",
        "Missing values",
      ],
    },
    {
      icon: <Gauge className="h-6 w-6" aria-hidden />,
      title: "Smart KPIs",
      kicker: "Totals - Rows & Columns, Outliers",
      points: ["Totals - R/C", "Outliers", "Duplicates","Missing %","Rows/Day"],
    },
    {
      icon: (
        <div className="flex items-center gap-1">
          <LineChart className="h-6 w-6" aria-hidden />
        </div>
      ),
      title: "Interactive AI-Powered Visualizations",
      kicker: "Charts: Line, Pie, Scatter, Bar, Histogram",
      points: ["AI Insights", "Visualize best charts based on DataSet", "Export PDF"],
    },
    {
      icon: <BrainCircuit className="h-6 w-6" aria-hidden />,
      title: "AI Insights",
      kicker: "Executive summary in plain English",
      points: ["Executive Overview", "Data Quality Assessment", "Key Trends & Patterns", "Business Implications","Strategic Recommendations",
        "Risk Alerts & Considerations","Predictive Insights"],
      note: (
        <div className="mt-4 rounded-xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 p-4 backdrop-blur-sm">
          <div className="mb-2 flex items-center gap-2 font-semibold text-cyan-300">
            <Sparkles className="h-4 w-4" />
            AI-Generated Insight
          </div>
          <p className="text-sm text-justify text-cyan-100 leading-relaxed">
            "Revenue rose 12.4% led by EMEA expansion; inventory turnover improved 18% indicating enhanced operational efficiency."
          </p>
        </div>
      ),
    },
  ];

  const trustMetrics = [
    { icon: BrainCircuit, label: "AI Powered", value: "Real-Time" },
    { icon: Zap, label: "Processing Speed", value: "< 30s Analysis" },
    { icon: Database, label: "Data Handling", value: "Up to 10MB Files" },
    { icon: TrendingUp, label: "Accuracy", value: "99.9% Reliable" },
  ];

  return (
    <main className="min-h-screen w-full bg-black text-gray-200">
      {/* Enhanced Ambient Background */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(55%_45%_at_50%_-10%,rgba(56,189,248,.15),transparent_60%)]" />
        <div className="absolute left-1/2 top-0 h-[60vh] w-[70vw] -translate-x-1/2 bg-[conic-gradient(from_180deg_at_50%_0%,rgba(124,58,237,.12),transparent_25%)] blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 bg-violet-500/10 blur-[100px]" />
      </div>

      {/* HERO SECTION */}
      <section className="px-6 pb-8 pt-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.02] to-white/[0.01] p-8 backdrop-blur-sm sm:p-12 md:p-16">
            
            {/* Enhanced Background Ornaments */}
            <div
              aria-hidden
              className="pointer-events-none absolute -right-24 -top-28 h-64 w-64 rounded-full border-2 border-cyan-400/30 blur-[2px]"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -left-28 -bottom-28 h-64 w-64 rounded-full border-2 border-violet-400/25 blur-[2px]"
            />

            {/* Hero Content */}
            <div className="text-center">
              <div className="mx-auto mb-6 w-fit rounded-full border border-white/10 bg-black/50 px-4 py-2 backdrop-blur-sm">
                <p className="text-xs font-medium text-gray-300 tracking-wide">
                  END-TO-END ANALYTICS FOR MODERN TEAMS
                </p>
              </div>

            <h1 className="mx-auto max-w-3xl text-center text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                From <span className="text-cyan-400">Data</span> to{" "}
                <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-400 bg-clip-text text-transparent">
                  Decisions
                </span>{" "}
                in Minutes
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-sm leading-8 text-gray-300">
                Upload. Profile. Visualize. Explain - 
                A tightly integrated stack to help you ship
                accurate insights—fast.
              </p>

              {/* Enhanced Trust Metrics */}
              <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-6 sm:grid-cols-4">
                {trustMetrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="flex flex-col items-center rounded-2xl bg-white/[0.03] p-4 ring-1 ring-inset ring-white/10 backdrop-blur-sm"
                  >
                    <metric.icon className="mb-3 h-6 w-6 text-cyan-400" />
                    <div className="text-center">
                      <div className="text-lg font-semibold text-white">{metric.value}</div>
                      <div className="text-xs text-gray-400 mt-1">{metric.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE SUITE */}
      <section className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12">
        <header className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            DataPulse Feature Suite
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">
            Everything you need to transform complex data into clear, actionable insights
          </p>
        </header>

        {/* Enhanced Feature Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="group relative flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-6 shadow-2xl transition-all duration-300 hover:border-cyan-400/30 hover:bg-white/[0.04] hover:shadow-2xl hover:shadow-cyan-500/10"
            >
              {/* Feature Header */}
              <div className="mb-6 flex items-start gap-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-black-500/10 to-blue-500/10 ring-1 ring-inset ring-white/10 group-hover:from-cyan-500/30 group-hover:to-blue-500/30">
                  {feature.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                  <p className="mt-1 text-sm text-cyan-300">{feature.kicker}</p>
                </div>
              </div>

              {/* Feature Points */}
              <ul className="mb-6 space-y-3">
                {feature.points.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-sm text-gray-300">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-cyan-400" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>

              {/* Optional Note */}
              {feature.note && (
                <div className="mt-auto">
                  {feature.note}
                </div>
              )}
            </article>
          ))}
        </div>
      </section>

     

      {/* ENHANCED FOOTER */}
      <footer className="border-t border-white/10 bg-black/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-12">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="text-center sm:text-left">
              <p className="mt-1 text-xs text-gray-400">
              </p>
            </div>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-8">
              <p className="text-xs text-gray-400">
                © {new Date().getFullYear()} DataPulse - All rights reserved.
              </p>
            
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}