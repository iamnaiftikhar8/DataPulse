import React from "react";
import Link from "next/link";
import { BarChart3, FileSpreadsheet, CalendarCheck2, Sparkles } from "lucide-react";

export default function HomePage() {
  const benefits = [
    {
      icon: <BarChart3 className="h-5 w-5" aria-hidden />,
      title: "Interactive Visualizations",
      desc: "Create dynamic dashboards that bring your data to life.",
    },
    {
      icon: <CalendarCheck2 className="h-5 w-5" aria-hidden />,
      title: "Automated Workflows",
      desc: "Automate repetitive tasks and streamline data processing.",
    },
    {
      icon: <FileSpreadsheet className="h-5 w-5" aria-hidden />,
      title: "Seamless Reporting",
      desc: "Generate comprehensive reports with a few clicks.",
    },
  ];

  const impact = [
    {
      stat: "20%",
      title: "Operational Efficiency",
      desc: "Retail teams streamlined ops with automated workflows.",
    },
    {
      stat: "30%",
      title: "Marketing ROI",
      desc: "Startups optimized campaigns with advanced analytics.",
    },
    {
      stat: "15%",
      title: "Customer Satisfaction",
      desc: "Service teams improved real-time feedback analysis.",
    },
  ];

  return (
    <main className="min-h-screen w-full bg-black text-gray-200">
      {/* --- Page background ornaments --- */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
      >
        {/* radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(55%_45%_at_50%_-10%,rgba(56,189,248,.24),transparent_60%)]" />
        {/* soft lines */}
        <div className="absolute left-1/2 top-0 h-[60vh] w-[70vw] -translate-x-1/2 bg-[conic-gradient(from_180deg_at_50%_0%,rgba(124,58,237,.08),transparent_25%)] blur-3xl" />
      </div>

      {/* --- Hero --- */}
      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-8 sm:p-12 md:p-16">
            {/* decorative ring */}
            <div
              aria-hidden
              className="pointer-events-none absolute -right-20 -top-28 h-64 w-64 rounded-full border-2 border-cyan-400/30 blur-[1px]"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -left-24 -bottom-28 h-64 w-64 rounded-full border-2 border-violet-400/25 blur-[1px]"
            />

            <p className="mx-auto mb-4 w-fit rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs font-medium text-gray-300">
              AI-powered analytics platform
            </p>

            <h1 className="mx-auto max-w-3xl text-center text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              Unlock the Power of Your Data with{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-400 bg-clip-text text-transparent">
                DataPulse
              </span>
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-6 text-gray-300">
              Transform complex data into clear, actionable insights. 
            </p>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/analyze"
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 px-5 py-3 text-sm font-semibold text-black shadow ring-1 ring-white/10 transition-colors hover:from-cyan-400 hover:to-violet-400"
              >
                Try It Now
              </Link>

              
            </div>
          </div>
        </div>
      </section>

      {/* --- Benefits --- */}
      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-white">Why choose DataPulse</h2>
          <p className="mx-auto mt-2 max-w-3xl text-sm text-gray-300">
            Empower your business to make data-driven decisions with an intuitive, modern analytics stack.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
          {benefits.map((b) => (
            <article
              key={b.title}
              className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.6)] transition-transform hover:-translate-y-1"
            >
              <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.06] ring-1 ring-inset ring-white/10 group-hover:bg-white/[0.08]">
                {b.icon}
              </div>
              <h3 className="text-base font-semibold text-white">{b.title}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-300">{b.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* --- Impact --- */}
      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-white">Proven impact</h2>
          <p className="mx-auto mt-2 max-w-3xl text-sm text-gray-300">
            Companies achieve measurable outcomes with DataPulse.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
          {impact.map((card) => (
            <article
              key={card.title}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.6)]"
            >
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-cyan-400">{card.stat}</span>
                <Sparkles className="h-4 w-4 text-cyan-400" aria-hidden />
              </div>
              <h3 className="mt-2 text-sm font-semibold text-white">{card.title}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-300">{card.desc}</p>
            </article>
          ))}
        </div>
      </section>

   {/* --- Footer --- */}
<footer className="border-t border-white/10 bg-black/20 backdrop-blur-sm">
  <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <div className="flex flex-col items-center justify-between gap-6 lg:flex-row">
      {/* Left side - Brand and copyright */}
      <div className="flex flex-col items-center gap-2 text-center lg:items-start lg:text-left">
        <div className="flex items-center gap-2">
         
          <span className="text-sm font-semibold text-white">DataPulse</span>
        </div>
        <p className="text-xs text-gray-400">
          © {new Date().getFullYear()} DataPulse. All rights reserved.
        </p>
      </div>

      {/* Center - Navigation links */}
      <div className="flex flex-wrap items-center justify-center gap-6 text-xs">
        <a 
          href="/analyze" 
          className="text-gray-400 hover:text-cyan-400 transition-colors duration-200"
        >
          Analyze
        </a>
     
        <a 
          href="/pricing" 
          className="text-gray-400 hover:text-cyan-400 transition-colors duration-200"
        >
          Pricing
        </a>
        <a 
          href="/contact" 
          className="text-gray-400 hover:text-cyan-400 transition-colors duration-200"
        >
          Contact Us
        </a>
        <a 
          href="/about" 
          className="text-gray-400 hover:text-cyan-400 transition-colors duration-200"
        >
          About
        </a>
      </div>

      {/* Right side - Legal links */}
      <div className="flex items-center gap-4 text-xs">
        <a 
          href="/privacy" 
          className="text-gray-400 hover:text-cyan-400 transition-colors duration-200"
        >
          Privacy
        </a>
        <a 
          href="/terms" 
          className="text-gray-400 hover:text-cyan-400 transition-colors duration-200"
        >
          Terms
        </a>
      
      </div>
    </div>
  </div>
</footer>
    </main>
  );
}
