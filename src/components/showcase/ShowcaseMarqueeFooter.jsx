import React from 'react';
import { ArrowRight, ShieldCheck, ExternalLink, Terminal, Github } from 'lucide-react';

export default function ShowcaseMarqueeFooter({ onExplorePlatform }) {
  const marqueeItems = [
    'VISIBLE',
    'ACCOUNTABLE',
    'MEASURABLE',
    'VERIFIED',
    'PILOT → VALIDATE → IMPROVE → SCALE',
    'EVERY MINE',
    'EVERY COMPLIANCE',
    'ONE INTELLIGENCE',
  ];

  return (
    <footer className="relative w-full bg-[#070708] border-t border-[#24272d] overflow-hidden">
      {/* Kinetic Looping Marquee Band (noth.in style oversized kinetic typography) */}
      <div className="py-8 sm:py-12 border-b border-[#24272d] bg-[#0d0e10] overflow-hidden whitespace-nowrap flex select-none">
        <div className="flex animate-marquee items-center gap-8 min-w-full">
          {marqueeItems.concat(marqueeItems).map((item, idx) => (
            <React.Fragment key={idx}>
              <span className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-[#24272d] uppercase hover:text-[#f5a524] transition-colors duration-300">
                {item}
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#f5a524] shrink-0" />
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Main Footer Body */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 sm:py-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          {/* Brand & Mission Statement */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-[#f5a524]" />
              <span className="font-mono text-sm font-bold text-[#edeef0] uppercase tracking-wider">
                CoalGuard AI <span className="text-[#8b9099] font-normal">/ DataMiners</span>
              </span>
            </div>
            <p className="font-sans text-sm text-[#8b9099] max-w-md leading-relaxed">
              Smart India Hackathon 2026 submission for Problem Statement{' '}
              <strong className="text-[#edeef0]">SIH26024</strong>. Built to transform statutory coal mine
              governance from delayed, fragmented paperwork into connected, verified action.
            </p>
            <div className="pt-2 font-mono text-xs text-[#8b9099]">
              Team: <strong className="text-[#edeef0]">Cache Me I U Can</strong> · Smart Automation
            </div>
          </div>

          {/* Quick Platform Routes */}
          <div className="md:col-span-3 space-y-3 font-mono text-xs">
            <div className="text-[#f5a524] uppercase tracking-wider font-bold mb-2">Live Platform</div>
            <ul className="space-y-2 text-[#8b9099]">
              <li>
                <button
                  onClick={onExplorePlatform}
                  className="hover:text-[#edeef0] transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 text-[#f5a524]" />
                  <span>Interactive Cockpit (/dashboard)</span>
                </button>
              </li>
              <li>
                <a href="#the-loop" className="hover:text-[#edeef0] transition-colors">
                  7-Stage Governance Workflow
                </a>
              </li>
              <li>
                <a href="#the-gap" className="hover:text-[#edeef0] transition-colors">
                  The Five Systemic Failures
                </a>
              </li>
              <li>
                <a href="#architecture" className="hover:text-[#edeef0] transition-colors">
                  System Architecture & Stack
                </a>
              </li>
            </ul>
          </div>

          {/* Statutory Governance Compliance */}
          <div className="md:col-span-3 space-y-3 font-mono text-xs">
            <div className="text-[#2fbf71] uppercase tracking-wider font-bold mb-2">Statutory Standard</div>
            <ul className="space-y-2 text-[#8b9099]">
              <li>Ministry of Coal CMR 2017</li>
              <li>DGMS Section 22 Enforcement</li>
              <li>Opencast Bench Reg 38(1)</li>
              <li>Form-IV & Form-24 Audit Logs</li>
              <li className="pt-2 text-[#edeef0] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#2fbf71]" />
                <span>Make in India Initiative</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Hairline & Legal Strip */}
        <div className="pt-8 border-t border-[#24272d] flex flex-wrap items-center justify-between gap-4 font-mono text-[11px] text-[#8b9099]">
          <div>© 2026 DataMiners · Cache Me I U Can · SIH26024</div>
          <div className="flex items-center gap-6">
            <span>Built for Venue Projector Evaluation</span>
            <span className="text-[#24272d]">|</span>
            <span className="text-[#2fbf71]">All Systems Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
