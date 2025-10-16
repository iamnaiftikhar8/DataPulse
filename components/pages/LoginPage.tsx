"use client";

import React, { useState } from "react";
import { Github, Grid3X3, Mail, Lock } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

const LOGIN_URL = "/api/auth/login"; // with rewrites → same-origin proxy to FastAPI

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(LOGIN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // If you're NOT using rewrites (cross-origin), uncomment:
        // credentials: "include",
        body: JSON.stringify({ email, password, remember }),
      });

      if (!res.ok) {
        // prefer detail, fall back to error or statusText
        let msg = "Login failed";
        try {
          const data = await res.json();
          msg = (data?.detail || data?.error || res.statusText || msg) as string;
        } catch { /* ignore parse errors */ }
        setError(msg);
        setLoading(false);
        return;
      }

      // success → go to next/dashboard
      router.replace(next);
    } catch (err) {
      console.error(err);
      setError("Network error while logging in.");
      setLoading(false);
    }
  }

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
                  placeholder="you@gmail.com"
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

            {/* Social buttons (stubbed) */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => alert("GitHub OAuth not yet wired")}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-black/40 px-4 py-3 text-sm font-semibold text-gray-200 ring-1 ring-inset ring-white/10 transition hover:bg-white/5"
              >
                <Github className="h-4 w-4" aria-hidden /> GitHub
              </button>
              <button
                type="button"
                onClick={() => alert("SSO/SAML not yet wired")}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-black/40 px-4 py-3 text-sm font-semibold text-gray-200 ring-1 ring-inset ring-white/10 transition hover:bg-white/5"
              >
                <Grid3X3 className="h-4 w-4" aria-hidden /> SSO / SAML
              </button>
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}
          </form>

          <p className="mt-6 text-center text-xs text-gray-500">
            By continuing you agree to our{" "}
            <a href="#" className="text-gray-300 underline decoration-white/20 hover:text-white">Terms</a> and{" "}
            <a href="#" className="text-gray-300 underline decoration-white/20 hover:text-white">Privacy Policy</a>.
          </p>
        </div>
      </section>

      {/* Autofill styling */}
      <style jsx global>{`
        html, body { color-scheme: dark; }
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        textarea:-webkit-autofill,
        select:-webkit-autofill {
          -webkit-text-fill-color: #e5e7eb;
          caret-color: #e5e7eb;
          -webkit-box-shadow: 0 0 0px 1000px rgba(0,0,0,.4) inset !important;
          box-shadow: 0 0 0px 1000px rgba(0,0,0,.4) inset !important;
          border: 1px solid rgba(255,255,255,.1) !important;
        }
        input:-moz-autofill,
        textarea:-moz-autofill,
        select:-moz-autofill {
          box-shadow: 0 0 0px 1000px rgba(0,0,0,.4) inset !important;
          -moz-text-fill-color: #e5e7eb;
          caret-color: #e5e7eb;
          border: 1px solid rgba(255,255,255,.1) !important;
        }
      `}</style>
    </main>
  );
}
