'use client';

import React from 'react';

export default function ScreenLoader() {
  return (
    <div
      className="
        fixed inset-0 z-[80]
        flex flex-col items-center justify-center gap-6
        bg-black/80 backdrop-blur-sm
      "
    >
      {/* animated concentric ring */}
      <div className="relative h-24 w-24">
        <div className="absolute inset-0 rounded-full border-2 border-white/10" />
        <div className="absolute inset-0 animate-spin-slow rounded-full border-2 border-transparent border-t-cyan-400" />
        <div className="absolute inset-2 animate-spin-slower rounded-full border-2 border-transparent border-t-purple-400" />
      </div>

      {/* brand + dots */}
      <div className="text-center">
        <div className="text-2xl font-semibold logo-anim logo-glow">DataPulse</div>
        <div className="mt-2 flex items-center justify-center gap-1 text-sm text-gray-300">
          <span className="animate-bounce [animation-delay:-0.2s]">•</span>
          <span className="animate-bounce [animation-delay:-0.1s]">•</span>
          <span className="animate-bounce">•</span>
        </div>
      </div>
    </div>
  );
}
