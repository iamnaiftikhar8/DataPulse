'use client';

import React, { useState } from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setNotice(null);

    if (!name || !email || !message) {
      setNotice('Please fill in your name, email, and message.');
      return;
    }

    setLoading(true);
    try {
      // Optional: send to your API (uncomment when you add the API route)
      // await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ name, email, subject, message }),
      // });

      setNotice('Message sent. We’ll get back to you shortly.');
      setName(''); setEmail(''); setSubject(''); setMessage('');
    } catch {
      setNotice('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-gray-200">
      <section className="mx-auto w-full max-w-6xl px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Contact Us</h1>
          <p className="mt-2 max-w-3xl text-[15px] text-gray-400">
            We&apos;re here to help. Reach out to us with any questions or inquiries.
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-2">
          {/* Left: form */}
          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300"> Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">Subject</label>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter the subject"
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">Message</label>
              <textarea
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your message"
                className="w-full resize-y rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20"
              />
            </div>

            {notice && (
              <p className="text-sm text-gray-300">
                {notice}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center rounded-xl bg-cyan-500 px-5 py-2 text-sm font-semibold text-black shadow ring-1 ring-white/10 transition-colors hover:bg-cyan-400 disabled:opacity-60"
            >
              {loading ? 'Sending…' : 'Send Message'}
            </button>
          </form>

          {/* Right: alternative contact */}
          <aside>
            <h2 className="mb-6 text-xl font-semibold text-white">
              Alternative Contact Methods
            </h2>

            <ul className="space-y-5">
              <li className="flex items-start gap-4">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 ring-1 ring-white/10">
                  <Phone className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">Phone</p>
                  <p className="text-sm text-gray-400">+1 (555) 123-4567</p>
                </div>
              </li>

              <li className="flex items-start gap-4">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 ring-1 ring-white/10">
                  <Mail className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">Email</p>
                  <p className="text-sm text-gray-400">support@datapulse.com</p>
                </div>
              </li>

              <li className="flex items-start gap-4">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 ring-1 ring-white/10">
                  <MapPin className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">Address</p>
                  <p className="text-sm text-gray-400">
                    123 Innovation Drive, Tech City, CA 90210
                  </p>
                </div>
              </li>
            </ul>
          </aside>
        </div>
      </section>
    </main>
  );
}
