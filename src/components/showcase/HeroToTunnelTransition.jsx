'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getGlobalLenis } from '../../hooks/useSmoothScroll';
import { useShowcaseStore } from '../../store/useShowcaseStore';
import { ArrowDown, Compass } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function HeroToTunnelTransition() {
  const containerRef = useRef(null);
  const layer1Ref = useRef(null); // Foreground rock ledge / rubble (moves most, yPercent: 70)
  const layer2Ref = useRef(null); // Mid-ground pit rim & haul road (yPercent: 55)
  const layer3Ref = useRef(null); // Narrative headline block (yPercent: 40)
  const layer4Ref = useRef(null); // Far haze & tunnel mouth (lines up with frame 1, yPercent: 10)

  const triggerRef = useRef(null);
  const prefersReducedMotion = useShowcaseStore((s) => s.prefersReducedMotion);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const container = containerRef.current;
    if (!container) return;

    // Reuse existing global Lenis singleton, never instantiate a second one
    const lenis = getGlobalLenis();

    const ctx = gsap.context(() => {
      // Four layers moving at different rates as the transition scrolls:
      //   layer 1 (yPercent -70) — foreground rock ledge / rubble, moves most
      //   layer 2 (yPercent -55) — mid-ground pit rim and haul road
      //   layer 3 (yPercent -40) — narrative headline block
      //   layer 4 (yPercent -10) — far haze & tunnel mouth, nearly static
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0,
          ease: 'none',
          onUpdate: () => {
            // Smoothly sync with ScrollTrigger without fighting wheel events
          },
        },
      });

      triggerRef.current = tl.scrollTrigger;

      tl.to(layer1Ref.current, { yPercent: -70, ease: 'none', force3D: true }, 0)
        .to(layer2Ref.current, { yPercent: -55, ease: 'none', force3D: true }, 0)
        .to(layer3Ref.current, { yPercent: -40, ease: 'none', force3D: true }, 0)
        .to(layer4Ref.current, { yPercent: -10, scale: 1.08, ease: 'none', force3D: true }, 0);
    }, container);

    return () => {
      // Only kill our own tracked ScrollTrigger instance — do not kill other components' triggers
      if (triggerRef.current) {
        triggerRef.current.kill();
        triggerRef.current = null;
      }
      ctx.revert();
    };
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) {
    return (
      <div className="relative w-full py-16 bg-[#070708] border-t border-[#24272d] text-center font-mono text-xs text-[#8b9099]">
        <span>ENTERING UNDERGROUND EXCAVATION TRAVERSAL · CMR 2017 REG. 47</span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[140vh] overflow-hidden bg-[#070708] border-t border-b border-[#24272d] pointer-events-none select-none"
    >
      {/* ========================================================================= */}
      {/* LAYER 4 (yPercent: 10) — Far haze & Tunnel Mouth Portal (Lines up with frame 1) */}
      {/* ========================================================================= */}
      <div
        ref={layer4Ref}
        className="absolute inset-0 w-full h-[120%] -top-[10%] z-[1] will-change-transform flex items-center justify-center"
      >
        {/* The first frame of the tunnel traversal footage as the background anchor */}
        <img
          src="/frames/frame_0001.webp"
          alt="Underground Coal Seam Tunnel Portal"
          className="w-full h-full object-cover brightness-[0.75] contrast-[1.1] scale-105"
          loading="eager"
        />

        {/* Deep atmospheric dust haze & amber grading */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 50% 50%, rgba(245, 165, 36, 0.12) 0%, rgba(13, 14, 16, 0.65) 60%, rgba(7, 7, 8, 0.98) 100%)',
          }}
        />

        {/* Tunnel Portal Vignette Frame */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d0e10] via-transparent to-[#070708]" />
      </div>

      {/* ========================================================================= */}
      {/* LAYER 3 (yPercent: 40) — The Headline & Statutory Telemetry Block */}
      {/* ========================================================================= */}
      <div
        ref={layer3Ref}
        className="absolute inset-0 w-full h-full z-[3] will-change-transform flex flex-col items-center justify-center px-6"
      >
        <div className="max-w-2xl text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[2px] bg-[#070708]/90 border border-[#24272d] font-mono text-[11px] text-[#f5a524]">
            <Compass className="w-3.5 h-3.5" />
            <span>CMR 2017 · REG. 47(1)</span>
            <span className="text-[#8b9099]">·</span>
            <span className="text-[#edeef0]">SEAM XI UNDERGROUND TRAVERSAL</span>
          </div>

          <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black text-[#edeef0] uppercase tracking-[-0.03em] leading-none drop-shadow-2xl">
            Entering The Seam
          </h2>

          <p className="font-sans text-xs sm:text-sm text-[#9ca3af] max-w-md mx-auto leading-relaxed">
            Transitioning from the surface pit rim into the active underground extraction tunnel.
            Where cellular signals terminate and offline statutory governance takes over.
          </p>

          <div className="pt-2 flex items-center justify-center gap-2 font-mono text-[11px] text-[#f5a524]">
            <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
            <span>CONTINUE SCROLLING TO ENTER TRAVERSAL</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* LAYER 2 (yPercent: 55) — Mid-ground Pit Rim, Cut Bench Rock & Railing */}
      {/* ========================================================================= */}
      <div
        ref={layer2Ref}
        className="absolute bottom-0 left-0 right-0 h-[65%] z-[4] will-change-transform pointer-events-none"
      >
        <svg
          viewBox="0 0 1440 400"
          className="w-full h-full object-cover"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          {/* Midground faceted rock rim */}
          <polygon
            points="0,220 280,180 560,240 840,160 1120,220 1440,150 1440,400 0,400"
            fill="#121418"
            stroke="#24272d"
            strokeWidth="1.5"
          />
          {/* Haul Road Safety Berm */}
          <path
            d="M 0,260 Q 360,220 720,280 T 1440,210"
            stroke="#f5a524"
            strokeWidth="2"
            strokeDasharray="8 8"
            opacity="0.4"
          />
          {/* Gantry Silhouettes */}
          <line x1="280" y1="180" x2="280" y2="130" stroke="#3a404a" strokeWidth="2" />
          <line x1="840" y1="160" x2="840" y2="110" stroke="#3a404a" strokeWidth="2" />
        </svg>
      </div>

      {/* ========================================================================= */}
      {/* LAYER 1 (yPercent: 70) — Foreground Rock Ledge & Rubble (Moves Most) */}
      {/* ========================================================================= */}
      <div
        ref={layer1Ref}
        className="absolute bottom-0 left-0 right-0 h-[50%] z-[5] will-change-transform pointer-events-none"
      >
        <svg
          viewBox="0 0 1440 320"
          className="w-full h-full object-cover"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          {/* Jagged foreground rock ledge that slides up past camera */}
          <polygon
            points="0,120 180,60 340,140 520,40 760,130 980,50 1200,120 1440,70 1440,320 0,320"
            fill="#08090a"
            stroke="#1c1f24"
            strokeWidth="2"
          />
          {/* Coal boulders and rubble accents */}
          <polygon points="120,180 160,150 190,190 140,210" fill="#0d0e10" stroke="#f5a524" strokeWidth="0.8" opacity="0.6" />
          <polygon points="860,190 910,160 940,200 890,220" fill="#0d0e10" stroke="#f5a524" strokeWidth="0.8" opacity="0.6" />
          <polygon points="1280,160 1320,130 1350,170 1300,190" fill="#0d0e10" stroke="#f5a524" strokeWidth="0.8" opacity="0.6" />
        </svg>
      </div>
    </div>
  );
}
