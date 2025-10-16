import React from "react";
import Link from "next/link";
import {
  BarChart3,
  Users,
  ShieldCheck,
  ArrowRight,
  Linkedin,
  Twitter,
} from "lucide-react";

// app/about/page.tsx (App Router) or pages/about.tsx (Pages Router)
export default function AboutPage() {
  const values = [
    {
      icon: <BarChart3 className="h-5 w-5" aria-hidden />,
      title: "Data-Driven",
      desc:
        "We use data to guide decisions, measure impact, and continuously improve outcomes.",
    },
    {
      icon: <Users className="h-5 w-5" aria-hidden />,
      title: "Customer-Centric",
      desc:
        "We obsess over customer outcomes and craft experiences that feel effortless.",
    },
    {
      icon: <ShieldCheck className="h-5 w-5" aria-hidden />,
      title: "Integrity",
      desc:
        "We act with transparency, keep promises, and safeguard your data end-to-end.",
    },
  ];

  const team = [
    { name: "Saqib Altaf", role: "CEO" },
    { name: "Amna", role: "CTO" },
  ];

  return (
    <main className="min-h-screen w-full bg-black text-gray-200">
      {/* Background ornaments */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(55%_45%_at_50%_-10%,rgba(56,189,248,.22),transparent_60%)]" />
        <div className="absolute left-1/2 top-0 h-[60vh] w-[70vw] -translate-x-1/2 bg-[conic-gradient(from_180deg_at_50%_0%,rgba(124,58,237,.08),transparent_25%)] blur-3xl" />
      </div>

      {/* Hero */}
      <section className="px-4 pt-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center sm:p-12 md:p-16">
            {/* decorative rings */}
            <div
              aria-hidden
              className="pointer-events-none absolute -right-20 -top-28 h-64 w-64 rounded-full border-2 border-cyan-400/30 blur-[1px]"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -left-24 -bottom-28 h-64 w-64 rounded-full border-2 border-violet-400/25 blur-[1px]"
            />

           
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              About{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-400 bg-clip-text text-transparent">
                DataPulse
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-gray-300">
              Empowering teams to make better decisions with AI-powered analytics, secure automation, and
              beautiful visualizations.
            </p>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/analyze"
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 px-5 py-3 text-sm font-semibold text-black shadow ring-1 ring-white/10 transition-colors hover:from-cyan-400 hover:to-violet-400"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/[0.08]"
              >
                Talk to Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Story + Mission */}
      <section className="mx-auto max-w-6xl gap-6 px-4 py-14 sm:grid sm:grid-cols-2 sm:px-6 lg:px-8">
        <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.6)]">
          <h2 className="text-lg font-semibold text-white">Our Story</h2>
          <p className="mt-3 text-sm leading-6 text-gray-300">
            Founded in 2024 by a small team of data enthusiasts, DataPulse set out to
            remove the friction between data and decisions. Today, we help teams of all sizes
            turn raw data into clear, actionable insight—fast, secure, and delightful to use.
          </p>
        </article>
        <article className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-7 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.6)] sm:mt-0">
          <h2 className="text-lg font-semibold text-white">Our Mission</h2>
          <p className="mt-3 text-sm leading-6 text-gray-300">
            We exist to empower every team to make smarter decisions. By combining AI-assisted
            analysis, automation, and intuitive visualization, we make sophisticated analytics
            accessible—without sacrificing security or flexibility.
          </p>
        </article>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-6xl px-4 pb-8 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold text-white">Our Values</h2>
        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
          {values.map((v) => (
            <article
              key={v.title}
              className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.6)] transition-transform hover:-translate-y-1"
            >
              <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.06] ring-1 ring-inset ring-white/10 group-hover:bg-white/[0.08]">
                {v.icon}
              </div>
              <h3 className="text-base font-semibold text-white">{v.title}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-300">{v.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-white">Meet the Team</h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-gray-300">
            A small, focused group building the future of data analytics.
          </p>
        </div>

        <ul className="mt-10 grid grid-cols-2 gap-8 sm:grid-cols-4">
          {team.map((member) => (
            <li key={member.name} className="text-center">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-slate-900 to-black text-2xl font-semibold ring-1 ring-white/10">
                {initials(member.name)}
              </div>
              <div className="mt-3 font-medium text-white">{member.name}</div>
              <div className="text-xs text-gray-400">{member.role}</div>
            </li>
          ))}
        </ul>

        {/* Socials */}
        <div className="mt-10 flex items-center justify-center gap-5 text-gray-400">
          <a href="#" aria-label="Twitter" className="transition-colors hover:text-white">
            <Twitter className="h-5 w-5" />
          </a>
          <a href="#" aria-label="LinkedIn" className="transition-colors hover:text-white">
            <Linkedin className="h-5 w-5" />
          </a>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/10 bg-white/[0.03]">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-white">Ready to partner with us?</h3>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-gray-300">
            See how DataPulse can fit your stack and accelerate your data journey.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link
              href="/analyze"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 px-5 py-3 text-sm font-semibold text-black shadow ring-1 ring-white/10 transition-colors hover:from-cyan-400 hover:to-violet-400"
            >
              Try the Demo
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/[0.08]"
            >
              Contact Sales
            </Link>
          </div>
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

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("");
}
