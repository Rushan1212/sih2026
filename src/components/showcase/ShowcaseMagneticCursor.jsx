'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useShowcaseStore } from '../../store/useShowcaseStore';
import { Lock } from 'lucide-react';

export default function ShowcaseMagneticCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const [cursorState, setCursorState] = useState({
    isInteractive: false,
    isTunnel: false,
    tunnelStation: '',
    isLocked: false,
  });

  const prefersReducedMotion = useShowcaseStore((s) => s.prefersReducedMotion);

  useEffect(() => {
    // Disable entirely on touch / coarse pointer devices and under reduced motion
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!hasFinePointer || prefersReducedMotion) {
      return;
    }

    setMounted(true);
    document.documentElement.classList.add('custom-cursor-active');

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let rafId = 0;
    let activeMagneticElem = null;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Magnetic pull: check primary buttons with [data-magnetic="true"]
      const magneticButtons = document.querySelectorAll('[data-magnetic="true"]');
      let foundMagnetic = null;

      magneticButtons.forEach((btn) => {
        const rect = btn.getBoundingClientRect();
        const btnCenterX = rect.left + rect.width / 2;
        const btnCenterY = rect.top + rect.height / 2;
        const dist = Math.hypot(mouseX - btnCenterX, mouseY - btnCenterY);

        if (dist < 48) {
          foundMagnetic = btn;
          // Pull button toward pointer up to ~8px
          const pullX = Math.max(-8, Math.min(8, (mouseX - btnCenterX) * 0.22));
          const pullY = Math.max(-8, Math.min(8, (mouseY - btnCenterY) * 0.22));
          btn.style.transform = `translate3d(${pullX}px, ${pullY}px, 0)`;
          btn.style.transition = 'transform 0.1s ease-out';
        } else if (btn === activeMagneticElem && dist >= 48) {
          btn.style.transform = 'translate3d(0, 0, 0)';
          btn.style.transition = 'transform 0.25s ease-out';
        }
      });

      activeMagneticElem = foundMagnetic;

      // Contextual detection: Interactive element, Tunnel section, Locked transition
      const target = e.target;
      const isButton = target.closest('button') || target.closest('a') || target.dataset.magnetic === 'true';
      const tunnelSection = target.closest('#tunnel-scrollytelling');

      let stationName = '';
      let isTransitioning = false;

      if (tunnelSection) {
        const activeNavBtn = tunnelSection.querySelector('nav button[aria-current="step"]');
        stationName = activeNavBtn ? activeNavBtn.textContent?.trim() || '' : 'TUNNEL';
        isTransitioning = tunnelSection.getAttribute('data-transitioning') === 'true';
      }

      setCursorState({
        isInteractive: !!isButton,
        isTunnel: !!tunnelSection,
        tunnelStation: stationName,
        isLocked: isTransitioning,
      });
    };

    // Dedicated requestAnimationFrame loop for hardware-accelerated zero-lag tracking
    const renderCursor = () => {
      if (dotRef.current) {
        // Zero lag: direct translate3d from latest pointer position
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }

      if (ringRef.current) {
        // 0.15 lerp per frame gives precision motion to outer ring
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }

      rafId = requestAnimationFrame(renderCursor);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    rafId = requestAnimationFrame(renderCursor);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId);
      document.documentElement.classList.remove('custom-cursor-active');
      if (activeMagneticElem) {
        activeMagneticElem.style.transform = 'translate3d(0, 0, 0)';
      }
    };
  }, [prefersReducedMotion]);

  if (!mounted || prefersReducedMotion) {
    return null;
  }

  const { isInteractive, isTunnel, tunnelStation, isLocked } = cursorState;

  return (
    <div className="fixed inset-0 pointer-events-none z-[99999] overflow-hidden">
      {/* 01: Zero-Lag Amber Reticle Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 -ml-[3px] -mt-[3px] pointer-events-none will-change-transform z-10"
        style={{ transform: 'translate3d(-100px, -100px, 0)' }}
      >
        <div
          className={`w-1.5 h-1.5 rounded-full bg-[#f5a524] transition-transform duration-150 ease-out ${
            isInteractive ? 'scale-0' : isTunnel ? 'scale-75 bg-[#38bdf8]' : 'scale-100'
          }`}
        />
      </div>

      {/* 02: 0.15 Lerp Outer Precision Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 -ml-[16px] -mt-[16px] pointer-events-none will-change-transform z-0"
        style={{ transform: 'translate3d(-100px, -100px, 0)' }}
      >
        <div
          className={`relative flex items-center justify-center transition-all duration-200 ease-out ${
            isLocked
              ? 'opacity-40 scale-75'
              : isInteractive
              ? 'w-10 h-10 -ml-1 -mt-1 rounded-full border-2 border-[#f5a524] bg-[#f5a524]/10 scale-110'
              : isTunnel
              ? 'w-8 h-8 rounded-none border border-[#38bdf8]/60 bg-[#38bdf8]/5'
              : 'w-8 h-8 rounded-full border border-[#8b9099]/40 bg-transparent'
          }`}
        >
          {/* Tunnel Section Crosshair & Station Tag */}
          {isTunnel && !isInteractive && (
            <>
              {/* Thin Crosshairs */}
              <div className="absolute w-3.5 h-[1px] bg-[#38bdf8]/80" />
              <div className="absolute h-3.5 w-[1px] bg-[#38bdf8]/80" />

              {/* Station Identity Badge beside cursor */}
              {tunnelStation && (
                <div className="absolute left-10 top-0 whitespace-nowrap px-1.5 py-0.5 bg-[#070708]/90 border border-[#38bdf8]/40 rounded-xs font-mono text-[9px] text-[#38bdf8] font-bold uppercase tracking-wider">
                  {tunnelStation}
                </div>
              )}
            </>
          )}

          {/* Locked Transition State Indicator */}
          {isLocked && (
            <div className="absolute -top-3 -right-3 p-1 bg-[#070708] border border-[#f5a524]/50 rounded-xs">
              <Lock className="w-2.5 h-2.5 text-[#f5a524]" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
