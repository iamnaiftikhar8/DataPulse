'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, LogOut, User, Crown, BarChart3, Zap, Shield, Star, FileText, Settings, ChevronDown, MailIcon } from 'lucide-react';

// HARDCODED BACKEND URL
const BACKEND_URL = 'https://test-six-fawn-47.vercel.app';

export default function ProfessionalHeader() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [scrolled, setScrolled] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const nav = [
    { name: 'Home', href: '/', icon: BarChart3 },
    { name: 'Analyze', href: '/analyze', icon: Zap },
    { name: 'Features', href: '/features', icon: Star },
    { name: 'Pricing', href: '/pricing', icon: Crown },
    { name: 'About', href: '/about', icon: Shield },
    { name: 'Contact', href: '/contact', icon: MailIcon }
  ];

  const profileMenuItems = [
    { name: 'My Profile', href: '/profile', icon: User, description: 'View and edit your profile' },
    { name: 'Analysis History', href: '/profile#reports', icon: FileText, description: 'View your past reports' },
    { name: 'Account Settings', href: '/profile#settings', icon: Settings, description: 'Manage preferences' }
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ⚡ INSTANT AUTH CHECK - No loading states
  const checkAuthStatusFast = async () => {
    try {
      console.log("🔄 Quick auth check:", `${BACKEND_URL}/api/auth/quick-check`);
      
      const quickResponse = await fetch(`${BACKEND_URL}/api/auth/quick-check`, {
        method: 'GET',
        credentials: 'include',
      });

      const quickData = await quickResponse.json();
      
      if (quickData.authenticated) {
        setUserInfo({
          authenticated: true,
          user_id: quickData.user_id,
          session_id: quickData.session_id,
          user_name: quickData.user_id?.split('@')[0]
        });
        console.log('✅ Quick auth successful');
        // Background update without waiting
        fetchFullUserInfo(quickData.user_id);
      } else {
        setUserInfo(null);
        console.log('❌ Quick auth failed - user not authenticated');
      }
    } catch (error) {
      console.error('💥 Fast auth check failed:', error);
      // Silent fallback - don't show errors to user
    }
  };

  // Get full user info in background (silent)
  const fetchFullUserInfo = async (userId: string) => {
    try {
      console.log("🔄 Fetching full user info:", `${BACKEND_URL}/api/auth/me`);
      
      const response = await fetch(`${BACKEND_URL}/api/auth/me`, {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const fullUserData = await response.json();
        setUserInfo(fullUserData);
        console.log('✅ Full user info loaded');
      }
    } catch (error) {
      // Silent fail - user already has basic info
      console.error('💥 Full user info fetch failed:', error);
    }
  };

  // ⚡ IMMEDIATE auth check on mount
  useEffect(() => {
    checkAuthStatusFast();
  }, []);

  // ⚡ INSTANT update on route changes
  useEffect(() => {
    if (pathname !== '/login' && pathname !== '/signup') {
      checkAuthStatusFast();
    }
  }, [pathname]);

  // ⚡ INSTANT LOGOUT - No loading, immediate redirect
  const handleLogout = async () => {
    try {
      console.log("🚪 Logging out via:", `${BACKEND_URL}/api/auth/logout`);
      
      // Immediate UI update and redirect
      setUserInfo(null);
      localStorage.removeItem('recent_login');
      
      // Trigger logout event for other components
      window.dispatchEvent(new Event('userLoggedOut'));
      
      // 🔄 IMMEDIATE REDIRECT TO HOME PAGE
      window.location.href = '/';
      
      // Background logout (non-blocking)
      fetch(`${BACKEND_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      }).catch(error => {
        console.error('💥 Background logout failed:', error);
      });
      
    } catch (error) {
      console.error('💥 Logout error:', error);
      // Still redirect on error
      window.location.href = '/';
    }
  };

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname?.startsWith(href);

  // ⚡ INSTANT NAVIGATION - No delays
  const handleProfileItemClick = (href: string) => {
    setProfileDropdownOpen(false);
    window.location.href = href;
  };

  const handleProfileButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setProfileDropdownOpen(!profileDropdownOpen);
  };

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
          {/* Logo Section */}
          <div className="flex items-center">
            <Link
              href="/"
              className="group relative flex items-center gap-3 rounded-xl px-3 py-2 transition-all duration-500 hover:bg-gradient-to-r hover:from-white/5 hover:to-white/2"
              aria-label="DataPulse Enterprise Home"
            >
              <div className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gray-900 via-black to-gray-900 shadow-2xl border border-gray-700/60">
                  <div className="absolute inset-1 rounded-lg bg-gradient-to-br from-white/5 to-transparent" />
                  <div className="relative z-10">
                    <BarChart3 className="h-5 w-5 text-gray-200 drop-shadow-lg" />
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-start">
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-cyan-400 to-white bg-clip-text text-transparent">
                    DataPulse
                  </span>
                </div>
                <span className="text-xs font-medium text-gray-400 tracking-wider uppercase hidden sm:block">
                  AI Analytics
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation - Centered */}
          <div className="hidden lg:flex flex-1 justify-center">
            <div className="flex items-center gap-1">
              {nav.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={[
                      'group relative flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 mx-1',
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
                    {active && (
                      <div className="absolute -bottom-1 left-1/2 h-0.5 w-6 -translate-x-1/2 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Desktop Auth Section - Right Aligned */}
          <div className="flex items-center gap-3">
            {userInfo ? (
              <div className="flex items-center gap-3">
                {/* Profile Dropdown */}
                <div className="hidden lg:block relative" ref={dropdownRef}>
                  <button
                    onClick={handleProfileButtonClick}
                    className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-2 border border-white/10 transition-all duration-200 hover:bg-white/10 hover:border-white/20 group"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 group-hover:from-cyan-500/30 group-hover:to-blue-500/30">
                      <User className="h-4 w-4 text-cyan-400" />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-semibold text-white">
                        {userInfo.user_name}
                      </span>
                    </div>
                    <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                      profileDropdownOpen ? 'rotate-180' : ''
                    }`} />
                    {userInfo.is_premium && (
                      <Crown className="h-4 w-4 text-amber-400" />
                    )}
                  </button>

                  {/* Dropdown Menu */}
                  {profileDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl border border-white/10 bg-black/95 backdrop-blur-xl shadow-2xl shadow-cyan-500/5 p-2 z-50">
                      {/* User Info Header */}
                      <div className="p-4 border-b border-white/10">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30">
                            <User className="h-5 w-5 text-cyan-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate">
                              {userInfo.user_name}
                            </p>
                            <p className="text-xs text-gray-400 truncate">
                              {userInfo.email}
                            </p>
                          </div>
                          {userInfo.is_premium && (
                            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/20 border border-amber-500/30">
                              <Crown className="h-3 w-3 text-amber-400" />
                              <span className="text-xs font-medium text-amber-400">Premium</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        {profileMenuItems.map((item) => (
                          <button
                            key={item.name}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleProfileItemClick(item.href);
                            }}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-300 transition-all duration-200 hover:bg-white/10 hover:text-white group/menu-item w-full text-left"
                          >
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 group-hover/menu-item:bg-cyan-500/20 transition-colors duration-200">
                              <item.icon className="h-4 w-4 text-gray-400 group-hover/menu-item:text-cyan-400 transition-colors duration-200" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{item.name}</p>
                              <p className="text-xs text-gray-500 group-hover/menu-item:text-gray-400">
                                {item.description}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>

                      {/* Logout Section */}
                      <div className="p-2 border-t border-white/10">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setProfileDropdownOpen(false);
                            handleLogout();
                          }}
                          className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 transition-all duration-200 hover:bg-red-500/10 hover:text-red-400"
                        >
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5">
                            <LogOut className="h-4 w-4" />
                          </div>
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Logout Button - Fallback for smaller screens */}
                <button
                  onClick={handleLogout}
                  className="lg:hidden flex items-center gap-2 rounded-xl bg-white/5 px-4 py-2.5 text-sm font-semibold text-gray-400 border border-white/10 transition-all duration-200 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="rounded-xl bg-white/5 px-4 py-2.5 text-sm font-semibold text-gray-300 border border-white/10 transition-all duration-200 hover:bg-white/10 hover:text-white hover:border-white/20"
                >
                  <span className="hidden sm:inline">Sign In</span>
                  <span className="sm:hidden">Login</span>
                </Link>
                <Link
                  href="/signup"
                  className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition-all duration-200 hover:from-cyan-400 hover:to-blue-500"
                >
                  <span className="hidden sm:inline">Get Started</span>
                  <span className="sm:hidden">Sign Up</span>
                </Link>
              </div>
            )}

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
        </div>

        {/* Mobile Navigation */}
        {open && (
          <div className="lg:hidden border-t border-white/10 pt-4 pb-4">
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

            <div className="mt-4 border-t border-white/10 pt-4">
              {userInfo ? (
                <div className="space-y-3">
                  {/* Mobile Profile Links */}
                  <div className="space-y-2">
                    {profileMenuItems.map((item) => (
                      <button
                        key={item.name}
                        onClick={() => {
                          setOpen(false);
                          window.location.href = item.href;
                        }}
                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200 w-full text-left"
                      >
                        <item.icon className="h-4 w-4" />
                        {item.name}
                      </button>
                    ))}
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-xl bg-white/5 px-4 py-3 text-sm font-semibold text-gray-400 border border-white/10 transition-all duration-200 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
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
        )}
      </nav>
    </header>
  );
}