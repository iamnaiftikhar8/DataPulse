'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { Menu, X } from 'lucide-react';

export default function ProfessionalHeader() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  const nav = [
    { name: 'Home', href: '/' },
    { name: 'Analyze', href: '/analyze' },
    { name: 'Features', href: '/features' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname?.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/95 backdrop-blur-xl">
      {/* Enhanced gradient accent line */}
      <div className="h-[3px] w-full bg-gradient-to-r from-cyan-500/80 via-purple-500/60 to-cyan-500/80 shadow-[0_2px_8px_-1px_rgba(34,211,238,0.3)]" />
      
      {/* Subtle bottom glow for depth */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      <nav className="mx-auto max-w-7xl px-4 text-gray-200 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Enhanced Brand */}
          <Link
            href="/"
            className="group relative inline-flex items-center gap-3 rounded-2xl px-3 py-2 transition-all duration-300 hover:scale-[1.02] hover:bg-white/[0.03]"
            aria-label="Go to home"
          >
            <div className="relative">
              <span className="text-2xl font-bold leading-none tracking-tight">
                <span className="logo-anim logo-glow bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
                  DataPulse
                </span>
              </span>
              {/* Enhanced accent dot with glow */}
              <span className="absolute -right-3 top-0.5 h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_15px_3px_rgba(34,211,238,0.7)] animate-pulse" />
            </div>
            {/* Subtle brand separator */}
            <div className="h-6 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />
          </Link>

          {/* Enhanced Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-12 flex items-center gap-1 rounded-2xl bg-white/[0.02] p-1 ring-1 ring-white/10 backdrop-blur-sm">
              {nav.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={[
                      'group relative rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200',
                      active
                        ? 'bg-gradient-to-r from-cyan-500/90 to-violet-500/90 text-white shadow-lg shadow-cyan-500/25'
                        : 'text-gray-300 hover:bg-white/[0.04] hover:text-white',
                    ].join(' ')}
                    aria-current={active ? 'page' : undefined}
                  >
                    {item.name}
                    {/* Enhanced hover effect */}
                    {!active && (
                      <span className="pointer-events-none absolute inset-x-3 -bottom-0.5 h-0.5 bg-gradient-to-r from-cyan-400/50 to-purple-400/50 opacity-0 transition-all duration-300 group-hover:opacity-100" />
                    )}
                    {/* Active state glow */}
                    {active && (
                      <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/20 to-violet-500/20 blur-sm" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Enhanced Desktop Auth */}
          <div className="hidden items-center gap-3 md:flex">
            <div className="rounded-2xl bg-white/[0.02] p-1.5 ring-1 ring-white/10 backdrop-blur-sm">
              <Link
                href="/login"
                className="rounded-xl px-5 py-2.5 text-sm font-semibold text-gray-300 transition-all duration-200 hover:bg-white/[0.06] hover:text-white"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 px-5 py-2.5 text-sm font-semibold text-black shadow-lg shadow-cyan-500/25 transition-all duration-200 hover:from-cyan-400 hover:to-violet-400 hover:shadow-cyan-500/40"
              >
                Sign Up
              </Link>
            </div>
          </div>

          {/* Enhanced Mobile Toggle */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center justify-center rounded-2xl p-2.5 text-gray-300 transition-all duration-200 hover:bg-white/[0.06] hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50 md:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Enhanced Mobile Sheet */}
        {open && (
          <div className="md:hidden">
            <div className="mt-3 rounded-2xl border border-white/10 bg-black/95 p-3 shadow-2xl backdrop-blur-xl ring-1 ring-white/10">
              <div className="space-y-1.5">
                {nav.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={[
                        'group relative block w-full rounded-xl px-4 py-3.5 text-sm font-semibold ring-1 ring-inset transition-all duration-200',
                        active
                          ? 'bg-gradient-to-r from-cyan-500 to-violet-500 text-white shadow-lg shadow-cyan-500/25 ring-white/20'
                          : 'bg-white/[0.02] text-gray-300 ring-white/10 hover:bg-white/[0.06] hover:text-white',
                      ].join(' ')}
                      aria-current={active ? 'page' : undefined}
                    >
                      {item.name}
                      {/* Mobile active state glow */}
                      {active && (
                        <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/20 to-violet-500/20 blur-sm" />
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* Enhanced Mobile Auth */}
              <div className="mt-4 rounded-xl border-t border-white/10 pt-4">
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="rounded-xl bg-white/[0.02] px-4 py-3.5 text-center text-sm font-semibold text-gray-300 ring-1 ring-white/10 transition-all duration-200 hover:bg-white/[0.06] hover:text-white"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setOpen(false)}
                    className="rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 px-4 py-3.5 text-center text-sm font-semibold text-black shadow-lg shadow-cyan-500/25 transition-all duration-200 hover:from-cyan-400 hover:to-violet-400"
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Enhanced bottom separator line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent shadow-[0_1px_2px_-1px_rgba(255,255,255,0.1)]" />
    </header>
  );
}