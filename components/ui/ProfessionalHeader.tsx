'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { Menu, X, LogOut, User, Crown, Loader, BarChart3, Zap, Shield, Star } from 'lucide-react';

export default function ProfessionalHeader() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  const nav = [
    { name: 'Home', href: '/', icon: BarChart3 },
    { name: 'Analyze', href: '/analyze', icon: Zap },
    { name: 'Features', href: '/features', icon: Star },
    { name: 'Pricing', href: '/pricing', icon: Crown },
    { name: 'About', href: '/about', icon: Shield },
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check if user is logged in
  const checkAuthStatus = async () => {
    try {
      setAuthLoading(true);
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";
      const response = await fetch(`${API_BASE}/api/auth/me`, {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const userData = await response.json();
        setUserInfo(userData);
      } else {
        setUserInfo(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUserInfo(null);
    } finally {
      setAuthLoading(false);
    }
  };

  // Refresh auth status on mount and when pathname changes
  useEffect(() => {
    checkAuthStatus();
  }, [pathname]);

  // Listen for login events
  useEffect(() => {
    const handleLoginSuccess = () => {
      checkAuthStatus();
    };

    window.addEventListener('userLoggedIn', handleLoginSuccess);
    return () => {
      window.removeEventListener('userLoggedIn', handleLoginSuccess);
    };
  }, []);

  const handleLogout = async () => {
    setLoading(true);
    
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";
      
      const response = await fetch(`${API_BASE}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        setUserInfo(null);
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = '/login';
      } else {
        console.error('Logout failed');
        setLoading(false);
      }
    } catch (error) {
      console.error('Logout error:', error);
      setLoading(false);
    }
  };

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname?.startsWith(href);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'border-b border-white/10 bg-black/95 backdrop-blur-xl shadow-2xl shadow-cyan-500/5' 
        : 'border-b border-white/5 bg-black/80 backdrop-blur-md'
    }`}>
      {/* Premium gradient accent line */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent" />

      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
       {/* Premium Enterprise Logo */}
<Link
  href="/"
  className="group relative flex items-center gap-4 rounded-xl px-4 py-3 transition-all duration-500 hover:bg-gradient-to-r hover:from-white/5 hover:to-white/2"
  aria-label="DataPulse Enterprise Home"
>
  <div className="relative">
    {/* Main logo container with sophisticated gradient */}
    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-gray-900 via-black to-gray-900 shadow-2xl border border-gray-700/60">
      {/* Inner shine effect */}
      <div className="absolute inset-1 rounded-lg bg-gradient-to-br from-white/5 to-transparent" />
      
      {/* Icon with sophisticated styling */}
      <div className="relative z-10">
        <BarChart3 className="h-6 w-6 text-gray-200 drop-shadow-lg" />
      </div>
      
      {/* Subtle corner accents */}
      <div className="absolute top-0 left-0 h-2 w-2 border-t border-l border-cyan-400/40 rounded-tl" />
      <div className="absolute top-0 right-0 h-2 w-2 border-t border-r border-blue-400/40 rounded-tr" />
      <div className="absolute bottom-0 left-0 h-2 w-2 border-b border-l border-cyan-400/30 rounded-bl" />
      <div className="absolute bottom-0 right-0 h-2 w-2 border-b border-r border-blue-400/30 rounded-br" />
    </div>
    
    {/* Sophisticated glow effect on hover */}
    <div className="absolute -inset-2 rounded-xl bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 blur-lg transition-all duration-700" />
  </div>
  
  {/* Text container with premium typography */}
  <div className="flex flex-col items-start space-y-1.5">
    {/* Main brand name with animated gradient */}
    <div className="flex items-baseline gap-2">
      <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-cyan-400 to-white bg-clip-text text-transparent bg-[length:200%_200%] animate-gradient-x">
        DataPulse
      </span>
      {/* Sophisticated dot separator */}
      <div className="h-1 w-1 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400 animate-pulse" />
    </div>
    
    {/* Professional tagline */}
    <div className="flex items-center gap-2">
      <div className="h-px w-3 bg-gradient-to-r from-cyan-400/50 to-blue-400/50" />
      <span className="text-xs font-medium text-gray-400 tracking-wider uppercase">
        AI Analytics Platform
      </span>
      <div className="h-px w-3 bg-gradient-to-r from-blue-400/50 to-cyan-400/50" />
    </div>
  </div>
  
  {/* Elegant hover underline */}
  <div className="absolute -bottom-1 left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
</Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <div className="ml-8 flex items-center gap-1">
              {nav.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={[
                      'group relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200',
                      active
                        ? 'bg-gradient-to-r from-cyan-500/10 to-blue-500/10 text-cyan-400 shadow-lg shadow-cyan-500/10 border border-cyan-500/20'
                        : 'text-gray-400 hover:text-white hover:bg-white/5',
                    ].join(' ')}
                    aria-current={active ? 'page' : undefined}
                  >
                    <Icon className={`h-4 w-4 transition-colors ${
                      active ? 'text-cyan-400' : 'text-gray-500 group-hover:text-cyan-400'
                    }`} />
                    {item.name}
                    {/* Active indicator */}
                    {active && (
                      <div className="absolute -bottom-1 left-1/2 h-0.5 w-6 -translate-x-1/2 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden items-center gap-3 lg:flex">
            {authLoading ? (
              <div className="flex items-center gap-2 rounded-xl bg-white/5 px-4 py-2.5 text-sm text-gray-400 border border-white/10">
                <Loader className="h-4 w-4 animate-spin" />
                <span>Loading...</span>
              </div>
            ) : userInfo ? (
              <div className="flex items-center gap-3">
                {/* User Profile */}
                <div className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-2.5 border border-white/10 backdrop-blur-sm">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30">
                    <User className="h-4 w-4 text-cyan-400" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-white">
                      {userInfo.user_name || userInfo.user_id?.split('@')[0]}
                    </span>
                   
                  </div>
                  {userInfo.is_premium && (
                    <Crown className="h-4 w-4 text-amber-400" />
                  )}
                </div>
                
                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  disabled={loading}
                  className="flex items-center gap-2 rounded-xl bg-white/5 px-4 py-2.5 text-sm font-semibold text-gray-400 border border-white/10 transition-all duration-200 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 disabled:opacity-50"
                >
                  <LogOut className="h-4 w-4" />
                  {loading ? '...' : 'Logout'}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="rounded-xl bg-white/5 px-6 py-2.5 text-sm font-semibold text-gray-300 border border-white/10 transition-all duration-200 hover:bg-white/10 hover:text-white hover:border-white/20"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="rounded-xl bg-gradient-to-r px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition-all duration-200 hover:bg-white/10 hover:text-white hover:shadow-cyan-500/40 hover:border-white/20 "
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center justify-center rounded-xl p-2.5 text-gray-400 transition-all duration-200 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {open && (
          <div className="lg:hidden">
            <div className="mt-2 rounded-2xl border border-white/10 bg-black/95 p-4 shadow-2xl backdrop-blur-xl">
              {/* Navigation Links */}
              <div className="space-y-2">
                {nav.map((item) => {
                  const active = isActive(item.href);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={[
                        'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200',
                        active
                          ? 'bg-gradient-to-r from-cyan-500/10 to-blue-500/10 text-cyan-400 border border-cyan-500/20'
                          : 'text-gray-400 hover:text-white hover:bg-white/5',
                      ].join(' ')}
                      aria-current={active ? 'page' : undefined}
                    >
                      <Icon className="h-4 w-4" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>

              {/* Auth Section */}
              <div className="mt-4 border-t border-white/10 pt-4">
                {authLoading ? (
                  <div className="flex items-center justify-center gap-2 rounded-xl bg-white/5 px-4 py-3 text-sm text-gray-400">
                    <Loader className="h-4 w-4 animate-spin" />
                    <span>Checking auth...</span>
                  </div>
                ) : userInfo ? (
                  <div className="space-y-3">
                    {/* User Info */}
                    <div className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3 border border-white/10">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30">
                        <User className="h-5 w-5 text-cyan-400" />
                      </div>
                      <div className="flex flex-col flex-1">
                        <span className="text-sm font-semibold text-white">
                          {userInfo.user_name || userInfo.user_id?.split('@')[0]}
                        </span>
                        <span className="text-xs text-gray-400">
                          {userInfo.user_id}
                        </span>
                        
                      </div>
                      {userInfo.is_premium && (
                        <Crown className="h-5 w-5 text-amber-400" />
                      )}
                    </div>
                    
                    {/* Logout Button */}
                    <button
                      onClick={handleLogout}
                      disabled={loading}
                      className="flex w-full items-center gap-2 rounded-xl bg-white/5 px-4 py-3 text-sm font-semibold text-gray-400 border border-white/10 transition-all duration-200 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 disabled:opacity-50"
                    >
                      <LogOut className="h-4 w-4" />
                      {loading ? 'Logging out...' : 'Sign Out'}
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      href="/login"
                      onClick={() => setOpen(false)}
                      className="rounded-xl bg-white/5 px-4 py-3 text-center text-sm font-semibold text-gray-300 border border-white/10 transition-all duration-200 hover:bg-white/10 hover:text-white"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setOpen(false)}
                      className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition-all duration-200 hover:from-cyan-400 hover:to-blue-500"
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}