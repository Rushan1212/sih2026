import React from 'react';
import { motion } from 'framer-motion';
import { Play, ArrowRight, Activity, Compass, ShieldAlert } from 'lucide-react';
import MineIsometricDiorama from './MineIsometricDiorama';

export default function ShowcaseHero({ onExplorePlatform, onOpenVideo, onNodeSelect }) {
  return (
    <section className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-[#0d0e10] border-b border-[#24272d]">
      {/* Subtle Strata Hairline Grid Background */}
      <div className="absolute inset-0 strata-grid opacity-30 pointer-events-none z-0" />

      {/* Top Header / Quiet Juror Metadata Header */}
      <header className="relative z-20 w-full px-6 md:px-12 pt-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#24272d]/60 pb-4 bg-[#0d0e10]/80 backdrop-blur-md">
        {/* Project & Team Identity */}
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#f5a524] animate-pulse" />
          <div className="flex flex-col">
            <span className="font-mono text-xs font-bold tracking-wider text-[#edeef0] uppercase">
              CoalGuard AI <span className="text-[#8b9099] font-normal">/ DataMiners</span>
            </span>
            <span className="font-mono text-[10px] text-[#8b9099] uppercase tracking-wider">
              Team: Cache Me I U Can
            </span>
          </div>
        </div>

        {/* SIH Hackathon Jury Telemetry (Quiet, genuine instrument readings) */}
        <div className="hidden lg:flex items-center gap-6 font-mono text-xs text-[#8b9099]">
          <div className="flex items-center gap-2">
            <span className="text-[#edeef0] font-semibold">PS: SIH26024</span>
            <span className="text-[#24272d]">|</span>
            <span>Smart Automation</span>
            <span className="text-[#24272d]">|</span>
            <span>Software Category</span>
          </div>
        </div>

        {/* Quick Nav Links */}
        <div className="flex items-center gap-4 font-mono text-xs">
          <a
            href="#the-loop"
            className="hidden sm:inline-block text-[#8b9099] hover:text-[#edeef0] transition-colors"
          >
            03 // Workflow
          </a>
          <a
            href="#impact"
            className="hidden sm:inline-block text-[#8b9099] hover:text-[#edeef0] transition-colors"
          >
            07 // Impact
          </a>
          <button
            onClick={onExplorePlatform}
            className="px-3.5 py-1.5 rounded-xs bg-[#16181c] border border-[#24272d] hover:border-[#f5a524]/60 text-[#edeef0] transition-colors flex items-center gap-1.5"
          >
            <span>Live Platform</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#f5a524]" />
          </button>
        </div>
      </header>

      {/* Main Hero Body: Split Composition with Dominant Headline and Diorama Anchor */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 py-8 lg:py-12 flex-1 flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Left Column: Oversized Dominant Typography & Quiet Body */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center space-y-6">
          {/* Statutory Context Pill (JetBrains Mono for genuine regulation tag) */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xs bg-[#16181c]/90 border border-[#24272d] font-mono text-[11px] text-[#8b9099] w-fit">
            <Activity className="w-3.5 h-3.5 text-[#f5a524]" />
            <span className="text-[#edeef0] font-semibold">DGMS CMR 2017</span>
            <span className="text-[#24272d]">·</span>
            <span>STATUTORY COMPLIANCE COCKPIT</span>
          </div>

          {/* Headline: Archivo Variable-Width Display (Oversized, tight tracking, tight leading) */}
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-[5.4rem] font-black tracking-[-0.04em] leading-[0.92] text-[#edeef0] uppercase drop-shadow-md">
            Every Mine.<br />
            Every Rule.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#edeef0] via-[#ffd08a] to-[#f5a524]">
              One Action.
            </span>
          </h1>

          {/* Body: Inter Tight (Quiet, generous leading, strictly under 70 characters measure) */}
          <p className="font-sans text-sm sm:text-base text-[#8b9099] leading-relaxed max-w-[56ch]">
            An intelligent governance platform for Indian coal excavation. Unifying daily manager rounds,
            contractor records, CCTV streams, and machinery logbooks into closed-loop statutory action — 
            turning data that already exists into compliance that actually happens.
          </p>

          {/* Scale Anchor (Stakes established once in the opening) */}
          <div className="p-3 bg-[#16181c]/70 border border-[#24272d] rounded-xs font-sans text-xs text-[#9ca3af] max-w-[56ch] flex items-center gap-3">
            <div className="font-mono text-base font-black text-[#f5a524] shrink-0">
              1,047 MT
            </div>
            <div>
              India's coal output crossed 1 billion tonnes in FY 24-25. Every single tonne is governed by statutory paper trails.
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={onExplorePlatform}
              data-magnetic="true"
              className="px-6 py-3.5 rounded-xs bg-[#f5a524] text-[#070708] font-mono font-bold text-xs uppercase tracking-wider hover:bg-[#ffd08a] transition-all duration-200 flex items-center gap-2.5 shadow-[0_0_24px_rgba(245,165,36,0.25)] cursor-pointer"
            >
              <span>Explore the Platform</span>
              <ArrowRight className="w-4 h-4 text-[#070708]" />
            </button>

            <button
              onClick={onOpenVideo}
              data-magnetic="true"
              className="px-5 py-3.5 rounded-xs bg-[#16181c]/90 border border-[#24272d] hover:border-[#f5a524]/60 text-[#edeef0] font-mono text-xs uppercase tracking-wider transition-all duration-200 flex items-center gap-2.5 backdrop-blur-md cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 text-[#f5a524] fill-[#f5a524]" />
              <span>Watch the Demo (2 Min)</span>
            </button>
          </div>
        </div>

        {/* Right Column: Dark Isometric Mine Diorama with Drifting Floating Telemetry Cards */}
        <div className="w-full lg:w-1/2 h-[480px] sm:h-[560px] lg:h-[620px] relative flex items-center justify-center">
          <MineIsometricDiorama onNodeSelect={onNodeSelect} />
        </div>
      </div>

      {/* Bottom Telemetry Ticker Strip (JetBrains Mono used purely for genuine instrument readouts) */}
      <footer className="relative z-10 w-full px-6 md:px-12 py-3 border-t border-[#24272d]/70 bg-[#070708]/85 backdrop-blur-md flex flex-wrap items-center justify-between gap-4 font-mono text-[11px] text-[#8b9099]">
        <div className="flex items-center gap-4">
          <span className="text-[#edeef0]">LAT 23°47'N · LON 86°25'E</span>
          <span className="hidden sm:inline text-[#24272d]">|</span>
          <span className="hidden sm:inline text-[#8b9099]">DHANBAD BASIN · SEAM XI BENCH 4</span>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#2fbf71]" />
            <span className="text-[#edeef0]">DGMS CMR TELEMETRY PIPELINE ONLINE</span>
          </div>
          <div className="hidden md:flex items-center gap-1.5 text-[#8b9099]">
            <Compass className="w-3.5 h-3.5 text-[#f5a524]" />
            <span>SCROLL TO DESCEND INTO EXCAVATION</span>
          </div>
        </div>
      </footer>
    </section>
  );
}
