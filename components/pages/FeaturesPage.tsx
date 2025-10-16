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
      icon: <FileSpreadsheet className="h-5 w-5" aria-hidden />,
      title: "File Upload",
      kicker: "CSV & XLSX with drag-and-drop",
      points: [
        "Drag files or click to browse",
        "Type & size validation",
        "Secure, client-side preview",
      ],
    },
    {
      icon: <ScanSearch className="h-5 w-5" aria-hidden />,
      title: "Data Profiling",
      kicker: "Rows, columns, types & missing",
      points: [
        "Row/column counts & schema detection",
        "Type inference & outlier hints",
        "Missing values, min/max, uniques",
      ],
    },
    {
      icon: <Gauge className="h-5 w-5" aria-hidden />,
      title: "Smart KPIs",
      kicker: "Totals, averages & growth rates",
      points: ["Totals, means & medians", "MoM/YoY growth", "Top categories"],
    },
    {
      icon: (
        <div className="flex items-center gap-1">
          <LineChart className="h-5 w-5" aria-hidden />
        </div>
      ),
      title: "Interactive Charts",
      kicker: "Recharts: line",
      points: ["Tooltips & legends", "Series toggles", "Export images/PDF"],
    },
    {
      icon: <BrainCircuit className="h-5 w-5" aria-hidden />,
      title: "AI Insights",
      kicker: "Executive summary in plain English",
      points: ["Highlights & anomalies", "Drivers & trends", "Next best actions"],
      note: (
        <div className="mt-3 rounded-lg border border-cyan-400/30 bg-cyan-400/10 px-3 py-2 text-xs text-cyan-100">
          <div className="mb-1 flex items-center gap-2 font-semibold text-cyan-200">
            <Sparkles className="h-4 w-4" />
            Example Insight
          </div>
          “Revenue rose 12.4% MoM led by EMEA; inventory turnover improved 18%.”
        </div>
      ),
    },
  ];

  return (
    <main className="min-h-screen w-full bg-black text-gray-200">
      {/* Ambient background */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(55%_45%_at_50%_-10%,rgba(56,189,248,.18),transparent_60%)]" />
        <div className="absolute left-1/2 top-0 h-[60vh] w-[70vw] -translate-x-1/2 bg-[conic-gradient(from_180deg_at_50%_0%,rgba(124,58,237,.08),transparent_25%)] blur-3xl" />
      </div>

      {/* HERO */}
      <section className="px-4 pb-4 pt-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-8 sm:p-12 md:p-16">
            {/* subtle outline orbs */}
            <div
              aria-hidden
              className="pointer-events-none absolute -right-24 -top-28 h-64 w-64 rounded-full border-2 border-cyan-400/25 blur-[1px]"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -left-28 -bottom-28 h-64 w-64 rounded-full border-2 border-violet-400/20 blur-[1px]"
            />

            <p className="mx-auto mb-4 w-fit rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[11px] font-medium text-gray-300">
              End-to-end analytics for modern teams
            </p>

            <h1 className="mx-auto max-w-3xl text-center text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              From <span className="text-cyan-400">data</span> to{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-400 bg-clip-text text-transparent">
                decisions
              </span>{" "}
              in minutes
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-6 text-gray-300">
              Upload. Profile. Visualize. Explain. A tightly integrated stack to help you ship
              accurate insights—fast.
            </p>

            {/* trust strip */}
            <div className="mx-auto mt-7 grid max-w-3xl grid-cols-2 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-3 sm:grid-cols-4">
              {["Secure", "Scalable", "Audited", "Blazing-fast"].map((t) => (
                <div
                  key={t}
                  className="flex items-center justify-center gap-2 rounded-xl bg-white/[0.04] px-3 py-2 text-[11px] text-gray-300 ring-1 ring-inset ring-white/10"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" />
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE SUITE */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <header className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">DataPulse Feature Suite</h2>
           
          </div>
         
        </header>

        {/* Equal-height, aligned cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <article
              key={f.title}
              className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.6)] transition-transform hover:-translate-y-[2px]"
            >
              {/* icon + titles */}
              <div className="mb-4 flex items-start gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.06] ring-1 ring-inset ring-white/10 group-hover:bg-white/[0.08]">
                  {f.icon}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">{f.title}</h3>
                  <p className="text-[12px] text-cyan-300">{f.kicker}</p>
                </div>
              </div>

              {/* bullets grow to fill */}
              <ul className="mb-4 list-disc space-y-1 pl-5 text-sm text-gray-300">
                {f.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>

              {/* optional note keeps cards same height via mt-auto spacer */}
              {f.note ? (
                f.note
              ) : (
                <div className="mt-auto h-0" aria-hidden />
              )}
            </article>
          ))}
        </div>
      </section>

    

      {/* FOOTER */}
      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-8 text-xs text-gray-400 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-end gap-4 sm:flex-row">
            <p>© {new Date().getFullYear()} DataPulse - All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
