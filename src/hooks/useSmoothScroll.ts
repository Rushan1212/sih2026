import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useShowcaseStore } from '../store/useShowcaseStore';

gsap.registerPlugin(ScrollTrigger);

let globalLenis: Lenis | null = null;
let isTickerAttached = false;

export function getGlobalLenis(): Lenis | null {
  return globalLenis;
}

export function useSmoothScroll() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check user preference for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    useShowcaseStore.getState().setPrefersReducedMotion(prefersReducedMotion);

    // Detect mobile or low performance device
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
      window.innerWidth < 768;
    useShowcaseStore.getState().setLowPowerMode(isMobile);

    if (prefersReducedMotion) {
      const handleScroll = () => {
        const total = document.documentElement.scrollHeight - window.innerHeight;
        const progress = total > 0 ? window.scrollY / total : 0;
        useShowcaseStore.getState().setScrollProgress(progress);
        ScrollTrigger.update();
      };
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }

    // Reuse existing global Lenis singleton if already instantiated
    if (!globalLenis) {
      globalLenis = new Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential deceleration
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 0.95,
        touchMultiplier: 1.5,
      });

      // Connect Lenis to ScrollTrigger
      globalLenis.on('scroll', (e: any) => {
        ScrollTrigger.update();
        useShowcaseStore.getState().setScrollProgress(e.progress);
      });

      if (!isTickerAttached) {
        const updateTicker = (time: number) => {
          if (globalLenis) {
            globalLenis.raf(time * 1000);
          }
        };
        gsap.ticker.add(updateTicker);
        gsap.ticker.lagSmoothing(0);
        isTickerAttached = true;
      }
    }

    // Global pointer tracking for 3D parallax
    const handlePointerMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      useShowcaseStore.getState().setPointer({ x, y });
    };
    window.addEventListener('mousemove', handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
    };
  }, []);

  return globalLenis;
}
