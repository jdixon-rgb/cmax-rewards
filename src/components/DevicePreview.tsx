'use client';

import { useState } from 'react';
import { Monitor, Smartphone } from 'lucide-react';

type View = 'mobile' | 'desktop';

export default function DevicePreview() {
  const [view, setView] = useState<View>('mobile');

  return (
    <div className="min-h-dvh bg-[#111] flex flex-col items-center justify-center relative">
      {/* Toggle Bar */}
      <div className="fixed top-6 right-6 z-50 flex items-center gap-1 bg-[#1a1a1a] border border-[#333] rounded-full p-1 shadow-lg">
        <button
          onClick={() => setView('mobile')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wider transition-all ${
            view === 'mobile'
              ? 'bg-[#b8b455] text-black'
              : 'text-[#777] hover:text-white'
          }`}
        >
          <Smartphone size={14} />
          MOBILE
        </button>
        <button
          onClick={() => setView('desktop')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wider transition-all ${
            view === 'desktop'
              ? 'bg-[#b8b455] text-black'
              : 'text-[#777] hover:text-white'
          }`}
        >
          <Monitor size={14} />
          DESKTOP
        </button>
      </div>

      {/* Version */}
      <div className="fixed bottom-4 right-6 z-50 text-[10px] text-[#555] font-mono">
        v1.3.0
      </div>

      {/* Mobile View */}
      {view === 'mobile' && (
        <div className="flex items-center justify-center py-12 transition-all duration-500 animate-fade-in">
          {/* Phone Frame */}
          <div className="relative">
            {/* Outer bezel */}
            <div className="relative w-[395px] h-[852px] bg-[#1a1a1a] rounded-[50px] border-[3px] border-[#333] shadow-2xl overflow-hidden">
              {/* Notch / Dynamic Island */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20">
                <div className="w-[126px] h-[34px] bg-black rounded-b-[18px] flex items-center justify-center">
                  <div className="w-[10px] h-[10px] rounded-full bg-[#1a1a1a] border border-[#333]" />
                </div>
              </div>

              {/* Status bar area */}
              <div className="absolute top-0 left-0 right-0 h-[50px] bg-black z-10 flex items-end justify-between px-8 pb-1">
                <span className="text-[11px] font-semibold text-white/80">9:41</span>
                <div className="flex items-center gap-1">
                  <svg width="16" height="11" viewBox="0 0 16 11" fill="white" opacity="0.8">
                    <rect x="0" y="4" width="3" height="7" rx="0.5" />
                    <rect x="4.5" y="2.5" width="3" height="8.5" rx="0.5" />
                    <rect x="9" y="1" width="3" height="10" rx="0.5" />
                    <rect x="13.5" y="0" width="2.5" height="11" rx="0.5" opacity="0.3" />
                  </svg>
                  <svg width="24" height="11" viewBox="0 0 24 11" fill="none" stroke="white" strokeWidth="1" opacity="0.8">
                    <rect x="0.5" y="0.5" width="20" height="10" rx="2" />
                    <rect x="21" y="3" width="2" height="5" rx="0.5" fill="white" opacity="0.4" />
                    <rect x="1.5" y="1.5" width="14" height="8" rx="1" fill="white" opacity="0.8" />
                  </svg>
                </div>
              </div>

              {/* Home indicator */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[134px] h-[5px] bg-white/30 rounded-full z-10" />

              {/* iframe */}
              <iframe
                src="/?embedded=true"
                className="w-[389px] h-[844px] border-0 bg-black rounded-[47px]"
                style={{ margin: '3px' }}
                title="CMAX Rewards Mobile Preview"
              />
            </div>
          </div>
        </div>
      )}

      {/* Desktop View */}
      {view === 'desktop' && (
        <div className="w-full h-dvh animate-fade-in">
          <iframe
            src="/?embedded=true"
            className="w-full h-full border-0 bg-black"
            title="CMAX Rewards Desktop Preview"
          />
        </div>
      )}
    </div>
  );
}
