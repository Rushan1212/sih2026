import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-[#0D0D0D] text-[#8A8A8A] border-t border-[#242424] pt-16 pb-12 px-6">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* 3-Column Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
          
          {/* Left Column: Logo + Built for India's Coal Sector */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-[#F5A623]"></div>
              <span className="font-headline text-2xl tracking-wider text-white">
                COALGUARD <span className="text-[#F5A623]">AI</span>
              </span>
            </div>
            <p className="text-xs text-[#8A8A8A] uppercase tracking-wider font-mono">
              Built for India's coal sector
            </p>
          </div>

          {/* Center Column: 4 Navigation Links */}
          <div className="flex flex-wrap md:justify-center gap-6 text-xs uppercase tracking-wider font-sans">
            <a href="#problem" className="hover:text-white transition-colors">Problem</a>
            <a href="#platform" className="hover:text-white transition-colors">Platform</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          </div>

          {/* Right Column: Digital India Initiative + CIL, DGMS Text Logos */}
          <div className="md:text-right space-y-2">
            <div className="text-xs font-mono text-[#8A8A8A] uppercase tracking-wider">
              A Digital India Initiative
            </div>
            <div className="flex items-center md:justify-end gap-3 text-xs font-headline text-white tracking-widest uppercase">
              <span className="px-2 py-1 bg-[#161616] border border-[#2A2A2A]">COAL INDIA (CIL)</span>
              <span className="px-2 py-1 bg-[#161616] border border-[#2A2A2A]">DGMS CMR 2017</span>
            </div>
          </div>

        </div>

        {/* Bottom Thin Amber Line + Copyright */}
        <div className="pt-8 border-t border-[#F5A623]/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#8A8A8A]">
          <div>
            © {new Date().getFullYear()} CoalGuard AI Technologies. All rights reserved.
          </div>
          <div>
            Ministry of Coal Alignment • Government of India
          </div>
        </div>

      </div>
    </footer>
  );
}
