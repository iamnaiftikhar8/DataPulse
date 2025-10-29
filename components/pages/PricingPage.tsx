'use client';

import React, { useMemo, useState } from 'react';
import { Check, Sparkles, BadgePercent, TrendingUp, Crown, Zap } from 'lucide-react';

type PlanKey = 'starter' | 'pro' | 'enterprise';

type BasePlan = {
  key: PlanKey;
  name: string;
  highlighted?: boolean;
  badge?: string;
  cta: { label: string; href: string };
  features: string[];
};

type PricePlan = BasePlan & {
  monthlyPrice: number;
  custom?: false;
};
type CustomPlan = BasePlan & { custom: true };
type Plan = PricePlan | CustomPlan;

export default function PricingPage() {
  const [yearly, setYearly] = useState(false);

  const plans = useMemo(
    () =>
      [
        {
          key: 'starter',
          name: 'Starter',
          monthlyPrice: 0,
          cta: { label: 'Get started', href: '#' },
          features: ['1 Report per day', 'Basic visualizations', 'Community support'],
        },
        {
          key: 'pro',
          name: 'Pro',
          monthlyPrice: 10,
          highlighted: true,
          badge: 'Most popular',
          cta: { label: 'Upgrade', href: '#' },
          features: [

            'Unlimited data points',
            'Advanced visualizations',
            'Priority support',
            'API access',
          ],
        },
        {
          key: 'enterprise',
          name: 'Enterprise',
          custom: true,
          cta: { label: 'Contact sales', href: '#' },
          features: [
            'Custom data points',
            'Dedicated support',
            'Onboarding assistance',
            'Custom integrations',
          ],
        },
      ] satisfies readonly Plan[],
    []
  );

  const priceFor = (p: Plan) => {
    if ('custom' in p && p.custom) return 'Custom';
    if (p.monthlyPrice === 0) return 'Free';
    if (yearly) {
      const discounted = Math.round(p.monthlyPrice * 12 * 0.8); // 20% off annually
      return `$${discounted}/yr`;
    }
    return `$${p.monthlyPrice}/mo`;
  };

  return (
    <main className="min-h-screen w-full bg-black text-gray-200">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_-10%,rgba(56,189,248,.20),transparent_60%)]" />
        <div className="mx-auto max-w-5xl px-6 py-20 text-center sm:py-24">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-3 py-1 text-xs text-gray-300">
            <TrendingUp className="h-3.5 w-3.5" />
            Predictable pricing, scale as you grow
          </div>

          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Choose the plan that fits your team
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-[15px] text-gray-400">
            Start free, then upgrade for advanced analytics, API access, and priority support.
          </p>

          {/* Billing toggle */}
          <div
            className="mx-auto mt-6 flex w-fit items-center gap-3 rounded-xl border border-white/10 bg-black/60 p-1 text-sm"
            role="group"
            aria-label="Billing period"
          >
            <button
              onClick={() => setYearly(false)}
              aria-pressed={!yearly}
              className={`rounded-lg px-3 py-1.5 transition-colors ${
                !yearly ? 'bg-cyan-500 text-black' : 'text-gray-300 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              aria-pressed={yearly}
              className={`group relative rounded-lg px-3 py-1.5 transition-colors ${
                yearly ? 'bg-cyan-500 text-black' : 'text-gray-300 hover:text-white'
              }`}
            >
              Yearly
              <span className="ml-2 inline-flex items-center gap-1 rounded-md bg-cyan-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-cyan-300 ring-1 ring-inset ring-cyan-400/20">
                <BadgePercent className="h-3 w-3" />
                20% off
              </span>
            </button>
          </div>
          <p className="sr-only" aria-live="polite">
            Billing set to {yearly ? 'yearly (20% off)' : 'monthly'}.
          </p>
        </div>
      </section>

      {/* PLANS – NEW CARD DESIGN */}
      <section className="mx-auto max-w-6xl px-6 pb-18 md:pb-20">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {plans.map((plan) => {
            const isPro = !!plan.highlighted;

            return (
              <article key={plan.key} className="relative">
                {/* Gradient border wrapper */}
                <div
                  className={[
                    'group rounded-3xl p-[1px] transition-transform',
                    isPro
                      ? 'bg-gradient-to-b from-cyan-400/50 via-cyan-500/20 to-transparent'
                      : 'bg-gradient-to-b from-white/15 via-white/5 to-transparent',
                    'hover:-translate-y-[3px]',
                  ].join(' ')}
                >
                  {/* Glass card */}
                  <div className="relative rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_20px_80px_-32px_rgba(0,0,0,0.6)] ring-1 ring-inset ring-white/5">
                    {/* Corner glow accent */}
                    <div
                      aria-hidden
                      className={[
                        'pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full blur-2xl transition-opacity',
                        isPro ? 'bg-cyan-400/30 opacity-70 group-hover:opacity-100' : 'bg-white/10 opacity-40',
                      ].join(' ')}
                    />

                    {/* Badge */}
                    {isPro && (
                      <span className="absolute -top-2 right-4 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-cyan-500 to-sky-500 px-2 py-1 text-[10px] font-bold text-black shadow-md">
                        <Crown className="h-3.5 w-3.5" />
                        {plan.badge ?? 'Popular'}
                      </span>
                    )}

                    {/* Title & Price */}
                    <div className="mb-4 flex items-start justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-300">{plan.name}</h3>
                        <div className="mt-1 flex items-baseline gap-2">
                          <div className="text-3xl font-extrabold text-white">{priceFor(plan)}</div>
                          {'custom' in plan ? null : yearly ? (
                            <span className="text-xs text-gray-500">billed annually</span>
                          ) : (plan as PricePlan).monthlyPrice > 0 ? (
                            <span className="text-xs text-gray-500">billed monthly</span>
                          ) : null}
                        </div>
                      </div>

                      {/* Micro icon capsule */}
                      <div
                        className={[
                          'hidden rounded-xl px-2 py-1 text-[10px] font-semibold sm:inline-flex items-center gap-1 ring-1 ring-inset',
                          isPro
                            ? 'bg-cyan-500/15 text-cyan-200 ring-cyan-400/25'
                            : 'bg-white/5 text-gray-300 ring-white/10',
                        ].join(' ')}
                      >
                        <Zap className="h-3.5 w-3.5" />
                        {isPro ? 'Full power' : 'Core'}
                      </div>
                    </div>

                    {/* CTA */}
                    <a
                      href={plan.cta.href}
                      className={[
                        'inline-flex w-full items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold shadow-md ring-1 ring-inset transition',
                        isPro
                          ? 'bg-cyan-500 text-black ring-white/10 hover:bg-cyan-400'
                          : 'bg-white/[0.06] text-white ring-white/10 hover:bg-white/[0.1]',
                      ].join(' ')}
                    >
                      {plan.cta.label}
                    </a>

                    {/* Divider */}
                    <div className="my-5 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                    {/* Feature list */}
                    <ul className="space-y-3 text-sm text-gray-300">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-3">
                          <span
                            className={[
                              'mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-md ring-1 ring-inset',
                              isPro
                                ? 'bg-cyan-500/20 text-cyan-100 ring-cyan-400/30'
                                : 'bg-white/[0.06] text-gray-200 ring-white/10',
                            ].join(' ')}
                          >
                            <Check className="h-3.5 w-3.5" aria-hidden />
                          </span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Soft bottom glow (on hover) */}
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-x-0 -bottom-8 h-24 translate-y-1/2 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(56,189,248,.18),transparent_70%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* COMPARISON (unchanged) */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/40 ring-1 ring-white/5">
          <div className="grid grid-cols-4 border-b border-white/10 bg-white/[0.02] px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
            <div>Feature</div>
            <div className="text-center">Starter</div>
            <div className="text-center">Pro</div>
            <div className="text-center">Enterprise</div>
          </div>

          {[
            { label: 'Data points', vals: ['500', 'Unlimited', 'Custom'] },
            { label: 'Visualizations', vals: ['Basic', 'Advanced', 'Advanced + Custom'] },
            { label: 'Support', vals: ['Community', 'Priority', 'Dedicated'] },
            { label: 'API Access', vals: ['—', 'Yes', 'Yes'] },
            { label: 'Onboarding', vals: ['—', '—', 'Assistance'] },
            { label: 'Integrations', vals: ['—', 'Standard', 'Custom'] },
          ].map((row, idx) => (
            <div
              key={row.label}
              className={`grid grid-cols-4 items-center px-4 py-3 text-sm ${
                idx % 2 ? 'bg-white/[0.01]' : ''
              }`}
            >
              <div className="py-1 text-gray-400">{row.label}</div>
              {row.vals.map((v, i) => (
                <div key={i} className="text-center text-gray-300">
                  {v === 'Yes' ? (
                    <span className="inline-flex items-center justify-center rounded-md bg-cyan-500/15 px-2 py-0.5 text-xs font-semibold text-cyan-300 ring-1 ring-inset ring-cyan-400/20">
                      Yes
                    </span>
                  ) : v === '—' ? (
                    <span className="text-gray-600">—</span>
                  ) : (
                    <span>{v}</span>
                  )}
                </div>
              ))}
            </div>
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
