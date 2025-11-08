"use client";

import React, { useState, useEffect } from "react";
import { Mail, Lock, Eye, EyeOff, Activity } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL ;

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get('error');
    if (error) {
      switch (error) {
        case 'auth_failed':
          setError('Google authentication failed. Please try again.');
          break;
        case 'user_creation_failed':
          setError('Failed to create account. Please try again.');
          break;
        case 'no_code':
          setError('Authentication cancelled or failed.');
          break;
        default:
          setError('Authentication failed. Please try again.');
      }
    }
  }, [searchParams]);

  // Handle Google OAuth callback with instant updates
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session');
    
    if (sessionId) {
      console.log("Google OAuth successful, session:", sessionId);
      
      localStorage.setItem('recent_login', JSON.stringify({
        authenticated: true,
        session_id: sessionId,
      }));
      
      window.dispatchEvent(new Event('userLoggedIn'));
      router.push('/analyze');
    }
  }, [router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      console.log("Attempting login with:", { email });

      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ 
          email: email.trim(), 
          password,
          remember 
        }),
      });

      console.log("Login response status:", res.status);

      if (!res.ok) {
        let errorData;
        try {
          errorData = await res.json();
          console.log("Error response:", errorData);
        } catch (parseError) {
          console.log("Could not parse error response");
        }
        
        setError(errorData?.detail || errorData?.error || `Login failed (${res.status})`);
        setLoading(false);
        return;
      }

      const userData = await res.json();
      console.log("Login successful:", userData);
      
      localStorage.setItem('recent_login', JSON.stringify({
        authenticated: true,
        user_id: userData.user_id,
        user_name: userData.user_name || userData.user_id?.split('@')[0],
        session_id: userData.session_id
      }));

      window.dispatchEvent(new Event('userLoggedIn'));

      setTimeout(() => {
        router.push('/analyze');
      }, 100);
      
    } catch (err) {
      console.error("Login error:", err);
      setError("Network error while logging in. Check if backend is running.");
      setLoading(false);
    }
  }

  const handleGoogleLogin = async () => {
    const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;
    window.location.href = `${API_BASE}/api/auth/google`;
  };

  return (
    <main className="min-h-screen w-full bg-gray-950 text-gray-200 flex items-center justify-center p-4">
      {/* Enhanced background effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md">
        {/* Enhanced Card */}
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-black/60 p-6 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.6)] ring-1 ring-white/10 backdrop-blur">
           <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Welcome to DataPulse</h1>
            <p className="text-gray-400 text-sm">Sign in to continue to your dashboard</p>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-200">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/20 to-cyan-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 z-10" />
                <input
                  id="email"
                  type="email"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="relative w-full rounded-xl border border-white/10 bg-black/60 pl-10 pr-3 py-3 text-sm text-white outline-none transition-all focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20 placeholder:text-gray-500 backdrop-blur"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-200">Password</label>
              <div className="relative group">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/20 to-cyan-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 z-10" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="relative w-full rounded-xl border border-white/10 bg-black/60 pl-10 pr-10 py-3 text-sm text-white outline-none transition-all focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20 placeholder:text-gray-500 backdrop-blur"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors z-10"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Options */}
            <div className="flex items-center justify-between text-sm">
              <label className="inline-flex select-none items-center gap-2 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded border transition-all ${remember ? 'bg-cyan-500 border-cyan-500' : 'border-white/20 bg-black/40'}`}>
                    {remember && (
                      <svg className="w-3 h-3 text-black mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-gray-300">Remember me</span>
              </label>
            
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-black shadow-lg ring-1 ring-cyan-500/30 transition-all hover:bg-cyan-400 disabled:opacity-60 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                  Logging in...
                </div>
              ) : (
                "Log in"
              )}
            </button>

            {/* Divider */}
            <div className="relative py-2">
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t border-white/10" />
              <div className="relative mx-auto w-fit bg-black px-3 text-xs text-gray-400">OR</div>
            </div>

            {/* Google Button */}
            <div className="flex justify-center">
              <button 
                type="button" 
                onClick={handleGoogleLogin}
                className="inline-flex items-center justify-center gap-3 rounded-xl bg-black/40 px-4 py-3 text-sm font-semibold text-gray-200 ring-1 ring-inset ring-white/10 transition-all hover:bg-white/5 hover:ring-white/20 w-full max-w-xs transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <GoogleIcon className="h-5 w-5" /> 
                <span>Continue with Google</span>
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-xl bg-red-500/10 p-4 border border-red-500/20 backdrop-blur">
                <p className="text-sm text-red-400 text-center font-medium">{error}</p>
              </div>
            )}

            {/* Sign Up Link */}
            <div className="text-center pt-4 border-t border-white/10">
              <p className="text-sm text-gray-400">
                Need an account?{" "}
                <a href="/signup" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
                  Sign up now
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

function GoogleIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303C33.692 32.91 29.222 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.153 7.957 3.043l5.657-5.657C34.604 6.053 29.604 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.651-.389-3.917z"/>
      <path fill="#FF3D00" d="M6.306 14.691l6.571 4.818C14.4 16.076 18.834 12 24 12c3.059 0 5.842 1.153 7.957 3.043l5.657-5.657C34.604 6.053 29.604 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
      <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.193l-6.197-5.238C29.165 35.671 26.744 36 24 36c-5.202 0-9.66-3.07-11.322-7.438l-6.54 5.036C9.457 39.556 16.227 44 24 44z"/>
      <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.03 12.03 0 0 1-4.093 5.569l.003-.002 6.197 5.238C35.122 40.016 40 36 42.651 30.651c1.017-2.197 1.597-4.656 1.597-7.317 0-1.341-.138-2.651-.389-3.917z"/>
    </svg>
  );
}