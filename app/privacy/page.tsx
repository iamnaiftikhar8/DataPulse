"use client";

import Link from 'next/link';
import { ChevronLeft, Shield, Eye, Database, Server, Mail } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-4xl border border-white/15 rounded-2xl bg-gradient-to-br from-black/80 to-gray-900/60 backdrop-blur-xl shadow-2xl shadow-violet-500/10">
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 bg-gradient-to-r from-violet-500/5 to-purple-500/5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-violet-500 to-purple-500 rounded-lg shadow-lg">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Privacy Policy</h1>
                <p className="text-sm text-gray-400">
                  Last updated: {new Date().toLocaleDateString('en-US', { 
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
        <div className="p-6 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-track-white/5 scrollbar-thumb-violet-500/30 hover:scrollbar-thumb-violet-500/50">
          <div className="space-y-6">
            
            {/* Introduction */}
            <section className="group p-5 rounded-xl bg-white/3 border border-white/5 hover:border-violet-500/20 transition-all duration-300">
              <h2 className="font-semibold text-white mb-3 text-base">Introduction</h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                We take your privacy seriously. This policy explains how we collect, use, and protect 
                your information when you use DataPulse AI Analytics Platform.
              </p>
            </section>

            {/* Information Collection */}
            <section className="group p-5 rounded-xl bg-white/3 border border-white/5 hover:border-violet-500/20 transition-all duration-300">
              <h2 className="font-semibold text-white mb-3 flex items-center gap-2 text-base">
                <Database className="h-4 w-4 text-violet-400" />
                1. Information We Collect
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-white text-sm font-medium mb-2">Personal Information</h3>
                  <ul className="text-gray-300 text-xs space-y-1 ml-4">
                    <li>• Email address and full name</li>
                    <li>• Account preferences</li>
                    <li>• Billing information (Premium)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-white text-sm font-medium mb-2">Uploaded Data</h3>
                  <ul className="text-gray-300 text-xs space-y-1 ml-4">
                    <li>• CSV/Excel files for analysis</li>
                    <li>• File metadata and settings</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-white text-sm font-medium mb-2">Usage Information</h3>
                  <ul className="text-gray-300 text-xs space-y-1 ml-4">
                    <li>• Report generation history</li>
                    <li>• Feature usage patterns</li>
                    <li>• Device and browser information</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Data Usage */}
            <section className="group p-5 rounded-xl bg-white/3 border border-white/5 hover:border-violet-500/20 transition-all duration-300">
              <h2 className="font-semibold text-white mb-3 flex items-center gap-2 text-base">
                <Eye className="h-4 w-4 text-blue-400" />
                2. How We Use Your Information
              </h2>
              <ul className="text-gray-300 text-xs space-y-2 ml-4">
                <li>• Provide AI analytics and generate reports</li>
                <li>• Improve platform algorithms and user experience</li>
                <li>• Send important updates and support responses</li>
                <li>• Protect against fraud and unauthorized access</li>
                <li>• Understand user interaction patterns</li>
              </ul>
            </section>

            {/* Data Storage & Security */}
            <section className="group p-5 rounded-xl bg-white/3 border border-white/5 hover:border-violet-500/20 transition-all duration-300">
              <h2 className="font-semibold text-white mb-3 flex items-center gap-2 text-base">
                <Server className="h-4 w-4 text-green-400" />
                3. Data Storage & Security
              </h2>
              <div className="space-y-3 text-gray-300 text-sm">
                <p className="leading-relaxed">
                  <strong className="text-white">Encryption:</strong> All data encrypted in transit and at rest.
                </p>
                <p className="leading-relaxed">
                  <strong className="text-white">Access Control:</strong> Strict employee access limitations.
                </p>
                <div>
                  <strong className="text-white">Data Retention:</strong>
                  <ul className="text-gray-300 text-xs space-y-1 ml-4 mt-1">
                    <li>• Uploaded files: 7 days (Free) / 30 days (Premium)</li>
                    <li>• Account data: Until deletion request</li>
                    <li>• Usage logs: 12 months for security</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Data Sharing */}
            <section className="group p-5 rounded-xl bg-white/3 border border-white/5 hover:border-violet-500/20 transition-all duration-300">
              <h2 className="font-semibold text-white mb-3 text-base">4. Data Sharing</h2>
              <p className="text-gray-300 text-sm leading-relaxed mb-2">
                We do not sell your personal data. Limited sharing with:
              </p>
              <ul className="text-gray-300 text-xs space-y-1 ml-4">
                <li>• Service providers (cloud infrastructure)</li>
                <li>• Legal requirements</li>
                <li>• Business transfers (merger/acquisition)</li>
              </ul>
            </section>

            {/* User Rights */}
            <section className="group p-5 rounded-xl bg-white/3 border border-white/5 hover:border-violet-500/20 transition-all duration-300">
              <h2 className="font-semibold text-white mb-3 text-base">5. Your Rights</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <h3 className="text-white text-xs font-medium mb-1">Access & Portability</h3>
                  <p className="text-gray-300 text-xs">Request your data in readable format</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <h3 className="text-white text-xs font-medium mb-1">Correction</h3>
                  <p className="text-gray-300 text-xs">Update inaccurate information</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <h3 className="text-white text-xs font-medium mb-1">Deletion</h3>
                  <p className="text-gray-300 text-xs">Delete account and associated data</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <h3 className="text-white text-xs font-medium mb-1">Opt-Out</h3>
                  <p className="text-gray-300 text-xs">Unsubscribe from marketing</p>
                </div>
              </div>
            </section>

            {/* Contact */}
            <section className="group p-5 rounded-xl bg-white/3 border border-white/5 hover:border-violet-500/20 transition-all duration-300">
              <h2 className="font-semibold text-white mb-3 flex items-center gap-2 text-base">
                <Mail className="h-4 w-4 text-amber-400" />
                6. Contact Us
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                Privacy questions? Contact{" "}
                <span className="text-violet-400 font-medium">privacy@datapulse.com</span>
              </p>
              <p className="text-gray-400 text-xs mt-1">
                We respond to legitimate requests within 30 days
              </p>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 bg-gradient-to-r from-violet-500/5 to-purple-500/5">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <p className="text-xs text-gray-400 text-center sm:text-left">
              Protecting your privacy is our priority
            </p>
            <div className="flex gap-4">
              <Link 
                href="/terms" 
                className="text-sm text-violet-400 hover:text-violet-300 transition-colors duration-200 font-medium"
              >
                Terms of Service
              </Link>
              <div className="h-4 w-px bg-white/20"></div>
              <Link 
                href="/signup" 
                className="text-sm text-purple-400 hover:text-purple-300 transition-colors duration-200 font-medium"
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