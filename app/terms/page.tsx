"use client";

import Link from 'next/link';
import { ChevronLeft, FileText, Shield, Lock, Users, Globe, CreditCard } from 'lucide-react';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-4xl border border-white/15 rounded-2xl bg-gradient-to-br from-black/80 to-gray-900/60 backdrop-blur-xl shadow-2xl shadow-cyan-500/10">
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 bg-gradient-to-r from-cyan-500/5 to-blue-500/5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg shadow-lg">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Terms of Service</h1>
                <p className="text-sm text-gray-400">
                  Effective {new Date().toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
            <Link 
              href="/signup" 
              className="inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-all duration-200"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to Sign Up
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-track-white/5 scrollbar-thumb-cyan-500/30 hover:scrollbar-thumb-cyan-500/50">
          <div className="space-y-6">
            
            {/* Introduction */}
            <section className="group p-5 rounded-xl bg-white/3 border border-white/5 hover:border-cyan-500/20 transition-all duration-300">
              <h2 className="font-semibold text-white mb-3 flex items-center gap-2 text-base">
                <Globe className="h-4 w-4 text-cyan-400" />
                Introduction
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                These Terms of Service govern your use of DataPulse AI Analytics Platform. 
                By accessing our services, you agree to comply with these terms.
              </p>
            </section>

            {/* Account Registration */}
            <section className="group p-5 rounded-xl bg-white/3 border border-white/5 hover:border-cyan-500/20 transition-all duration-300">
              <h2 className="font-semibold text-white mb-3 flex items-center gap-2 text-base">
                <Users className="h-4 w-4 text-cyan-400" />
                1. Account Registration
              </h2>
              <div className="space-y-3 text-gray-300 text-sm">
                <p className="leading-relaxed">
                  <strong className="text-white">Eligibility:</strong> Must be 18+ years old to use DataPulse.
                </p>
                <p className="leading-relaxed">
                  <strong className="text-white">Security:</strong> You are responsible for maintaining account confidentiality.
                </p>
                <p className="leading-relaxed">
                  <strong className="text-white">Accuracy:</strong> Provide accurate and complete registration information.
                </p>
              </div>
            </section>

            {/* Service Usage */}
            <section className="group p-5 rounded-xl bg-white/3 border border-white/5 hover:border-cyan-500/20 transition-all duration-300">
              <h2 className="font-semibold text-white mb-3 text-base">2. Service Usage</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 rounded-lg p-4 border border-cyan-500/20">
                  <h3 className="text-white font-medium mb-2 text-sm">Free Tier</h3>
                  <ul className="text-gray-300 text-xs space-y-1.5">
                    <li className="flex items-center gap-2">• 1 AI report per 24h</li>
                    <li className="flex items-center gap-2">• Basic analytics features</li>
                    <li className="flex items-center gap-2">• 7-day file retention</li>
                    <li className="flex items-center gap-2">• Standard support</li>
                  </ul>
                </div>
                <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-lg p-4 border border-blue-500/20">
                  <h3 className="text-white font-medium mb-2 text-sm">Premium Tier</h3>
                  <ul className="text-gray-300 text-xs space-y-1.5">
                    <li className="flex items-center gap-2">• Unlimited report generation</li>
                    <li className="flex items-center gap-2">• Advanced AI insights</li>
                    <li className="flex items-center gap-2">• 30-day file retention</li>
                    <li className="flex items-center gap-2">• Priority support</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-white font-medium mb-2 text-sm">Prohibited Activities</h3>
                <ul className="text-gray-300 text-xs space-y-1.5 ml-1">
                  <li className="flex items-center gap-2">• Upload malicious files or code</li>
                  <li className="flex items-center gap-2">• Reverse engineer the platform</li>
                  <li className="flex items-center gap-2">• Use for illegal activities</li>
                  <li className="flex items-center gap-2">• Share account credentials</li>
                </ul>
              </div>
            </section>

            {/* Data Privacy */}
            <section className="group p-5 rounded-xl bg-white/3 border border-white/5 hover:border-cyan-500/20 transition-all duration-300">
              <h2 className="font-semibold text-white mb-3 flex items-center gap-2 text-base">
                <Lock className="h-4 w-4 text-green-400" />
                3. Data Privacy & Security
              </h2>
              <div className="space-y-3 text-gray-300 text-sm">
                <p className="leading-relaxed">
                  <strong className="text-white">Data Processing:</strong> We process data solely to provide AI analytics services with encrypted storage.
                </p>
                <p className="leading-relaxed">
                  <strong className="text-white">Data Retention:</strong> Files auto-delete after 7 days (Free) or 30 days (Premium).
                </p>
                <p className="leading-relaxed">
                  <strong className="text-white">Confidentiality:</strong> We don't share your data with third parties except as required by law.
                </p>
              </div>
            </section>

            {/* Intellectual Property */}
            <section className="group p-5 rounded-xl bg-white/3 border border-white/5 hover:border-cyan-500/20 transition-all duration-300">
              <h2 className="font-semibold text-white mb-3 text-base">4. Intellectual Property</h2>
              <div className="space-y-3 text-gray-300 text-sm">
                <p className="leading-relaxed">
                  <strong className="text-white">Your Data:</strong> You retain all rights to uploaded data.
                </p>
                <p className="leading-relaxed">
                  <strong className="text-white">Our Technology:</strong> DataPulse AI algorithms and platform are IP protected.
                </p>
                <p className="leading-relaxed">
                  <strong className="text-white">AI Output:</strong> Generated reports are for internal business use.
                </p>
              </div>
            </section>

            {/* Payments & Refunds */}
            <section className="group p-5 rounded-xl bg-white/3 border border-white/5 hover:border-cyan-500/20 transition-all duration-300">
              <h2 className="font-semibold text-white mb-3 flex items-center gap-2 text-base">
                <CreditCard className="h-4 w-4 text-amber-400" />
                5. Payments & Refunds
              </h2>
              <div className="space-y-3 text-gray-300 text-sm">
                <p className="leading-relaxed">
                  <strong className="text-white">Subscription:</strong> Monthly billing with cancel-anytime flexibility.
                </p>
                <p className="leading-relaxed">
                  <strong className="text-white">Refunds:</strong> No Refunding policy.
                </p>
                <p className="leading-relaxed">
                  <strong className="text-white">Taxes:</strong> You are responsible for applicable taxes.
                </p>
              </div>
            </section>

            {/* Liability */}
            <section className="group p-5 rounded-xl bg-white/3 border border-white/5 hover:border-cyan-500/20 transition-all duration-300">
              <h2 className="font-semibold text-white mb-3 flex items-center gap-2 text-base">
                <Shield className="h-4 w-4 text-red-400" />
                6. Limitation of Liability
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed mb-3">
                DataPulse is provided "as is" without warranties. We are not liable for:
              </p>
              <ul className="text-gray-300 text-xs space-y-1.5 ml-1">
                <li className="flex items-center gap-2">• Business decisions based on AI insights</li>
                <li className="flex items-center gap-2">• Service interruptions beyond our control</li>
                <li className="flex items-center gap-2">• Data loss due to user error</li>
                <li className="flex items-center gap-2">• Third-party integration issues</li>
              </ul>
            </section>

            {/* Contact */}
            <section className="group p-5 rounded-xl bg-white/3 border border-white/5 hover:border-cyan-500/20 transition-all duration-300">
              <h2 className="font-semibold text-white mb-3 text-base">7. Contact Information</h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                For questions about these Terms:{" "}
                <span className="text-cyan-400 font-medium">legal@datapulse.com</span>
              </p>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 bg-gradient-to-r from-cyan-500/5 to-blue-500/5">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <p className="text-xs text-gray-400 text-center sm:text-left">
              By using DataPulse, you agree to our Terms of Service
            </p>
            <div className="flex gap-4">
              <Link 
                href="/privacy" 
                className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors duration-200 font-medium"
              >
                Privacy Policy
              </Link>
              <div className="h-4 w-px bg-white/20"></div>
              <Link 
                href="/signup" 
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200 font-medium"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}