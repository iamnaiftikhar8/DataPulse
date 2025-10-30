"use client";

import React, { useState, useEffect } from "react";
import { Mail, Lock } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      console.log("Attempting login with:", { email }); // Debug log

      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        credentials: "include", // Important for cookies
        body: JSON.stringify({ 
          email: email.trim(), 
          password,
          remember 
        }),
      });

      console.log("Login response status:", res.status); // Debug log

      if (!res.ok) {
        let errorData;
        try {
          errorData = await res.json();
          console.log("Error response:", errorData); // Debug log
        } catch (parseError) {
          console.log("Could not parse error response");
        }
        
        setError(errorData?.detail || errorData?.error || `Login failed (${res.status})`);
        setLoading(false);
        return;
      }

      // Login successful
      const userData = await res.json();
      console.log("Login successful:", userData); // Debug log
      
      // Redirect to analyze page
      router.push('/analyze');
      
    } catch (err) {
      console.error("Login error:", err);
      setError("Network error while logging in. Check if backend is running.");
      setLoading(false);
    }
  }

  const handleGoogleLogin = async () => {
    window.location.href = `${API_BASE}/api/auth/google`;
  };

  return (
    <main className="relative min-h-screen w-full bg-black text-gray-200">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_40%_at_50%_-10%,rgba(56,189,248,.18),transparent_60%)]" />

      <section className="mx-auto grid min-h-[calc(100vh-0px)] w-full max-w-6xl place-items-center px-6 py-12">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-black/60 p-6 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.6)] ring-1 ring-white/10 backdrop-blur">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500 font-bold text-black">D</span>
              <span className="text-base font-semibold text-white">DataPulse</span>
            </div>
            <a href="/signup" className="text-sm text-gray-300 hover:text-white">
              Need an account? <span className="text-cyan-400">Sign up</span>
            </a>
          </div>

          {/* Title */}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">Welcome back</h1>
            <p className="mt-1 text-sm text-gray-400">Sign in to continue to your dashboard.</p>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="mt-8 space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-200">Email</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ID@gmail.com"
                  className="w-full rounded-xl border border-white/10 bg-black/40 pl-10 pr-3 py-2 text-sm text-white outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20 placeholder:text-gray-500"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-200">Password</label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-white/10 bg-black/40 pl-10 pr-3 py-2 text-sm text-white outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20 placeholder:text-gray-500"
                  required
                />
              </div>
            </div>

            {/* Options */}
            <div className="flex items-center justify-between text-sm">
              <label className="inline-flex select-none items-center gap-2">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded border-white/10 bg-black/40 text-cyan-500 focus:ring-cyan-400/30"
                />
                <span className="text-gray-300">Remember me</span>
              </label>
              <a href="/forgot-password" className="text-cyan-400 hover:text-cyan-300">Forgot password?</a>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-black shadow ring-1 ring-white/10 transition-colors hover:bg-cyan-400 disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Log in"}
            </button>

            {/* Divider */}
            <div className="relative py-2">
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t border-white/10" />
              <div className="relative mx-auto w-fit bg-black px-3 text-xs text-gray-400">Or continue with</div>
            </div>

            {/* Google button */}
            <div className="flex justify-center">
              <button 
                type="button" 
                onClick={handleGoogleLogin}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-black/40 px-4 py-3 text-sm font-semibold text-gray-200 ring-1 ring-inset ring-white/10 transition hover:bg-white/5"
              >
                <GoogleIcon className="h-4 w-4" /> Google
              </button>
            </div>

            {error && (
              <div className="rounded-lg bg-red-500/10 p-3 border border-red-500/20">
                <p className="text-sm text-red-400 text-center">{error}</p>
              </div>
            )}
          </form>

          <p className="mt-6 text-center text-xs text-gray-500">
            By continuing you agree to our{" "}
            <a href="#" className="text-gray-300 underline decoration-white/20 hover:text-white">Terms</a> and{" "}
            <a href="#" className="text-gray-300 underline decoration-white/20 hover:text-white">Privacy Policy</a>.
          </p>
        </div>
      </section>
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