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
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur">
      {/* subtle gradient glow line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-cyan-500/50 via-purple-500/40 to-cyan-500/50" />

      <nav className="mx-auto max-w-7xl px-4 text-gray-200 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Brand */}
           <Link
            href="/"
            className="group relative inline-flex items-center gap-2 rounded-xl px-2 py-1 transition-transform duration-200 hover:scale-[1.02]"
            aria-label="Go to home"
          >
            <span className="relative text-2xl font-bold leading-none">
              <span className="logo-anim logo-glow">DataPulse</span>
              {/* tiny accent dot */}
              <span className="absolute -right-2 top-0.5 h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_2px_rgba(34,211,238,0.6)]" />
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center gap-2">
              {nav.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={[
                      'group relative rounded-xl px-4 py-2 text-sm font-medium ring-1 ring-inset transition-colors',
                      active
                        ? 'bg-gradient-to-r from-cyan-500 to-violet-500 text-black ring-white/10 shadow-[0_8px_24px_-12px_rgba(56,189,248,0.45)]'
                        : 'bg-white/[0.02] text-gray-300 ring-white/10 hover:bg-white/[0.06] hover:text-white',
                    ].join(' ')}
                    aria-current={active ? 'page' : undefined}
                  >
                    {item.name}
                    {/* hover underline */}
                    {!active && (
                      <span className="pointer-events-none absolute inset-x-2 -bottom-0.5 h-px bg-gradient-to-r from-cyan-400/70 to-purple-400/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Desktop auth */}
          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/login"
              className="rounded-xl bg-white/[0.02] px-4 py-2 text-sm font-semibold text-gray-300 ring-1 ring-inset ring-white/10 transition hover:bg-white/[0.06] hover:text-white"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 px-5 py-2 text-sm font-semibold text-black ring-1 ring-inset ring-white/10 transition hover:from-cyan-400 hover:to-violet-400"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center justify-center rounded-lg p-2 text-gray-300 transition-colors hover:bg-white/[0.06] hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 md:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile sheet */}
        {open && (
          <div className="md:hidden">
            <div className="mt-2 rounded-2xl border border-white/10 bg-black/90 p-2 shadow-xl backdrop-blur">
              {nav.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={[
                      'block w-full rounded-xl px-4 py-3 text-sm font-medium ring-1 ring-inset transition-colors',
                      active
                        ? 'bg-gradient-to-r from-cyan-500 to-violet-500 text-black ring-white/10'
                        : 'bg-white/[0.02] text-gray-300 ring-white/10 hover:bg-white/[0.06] hover:text-white',
                    ].join(' ')}
                    aria-current={active ? 'page' : undefined}
                  >
                    {item.name}
                  </Link>
                );
              })}

              <div className="mt-2 grid grid-cols-2 gap-2 border-t border-white/10 pt-3">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="rounded-xl bg-white/[0.02] px-4 py-3 text-center text-sm font-semibold text-gray-300 ring-1 ring-inset ring-white/10 transition hover:bg-white/[0.06] hover:text-white"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setOpen(false)}
                  className="rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 px-4 py-3 text-center text-sm font-semibold text-black ring-1 ring-inset ring-white/10 transition hover:from-cyan-400 hover:to-violet-400"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
