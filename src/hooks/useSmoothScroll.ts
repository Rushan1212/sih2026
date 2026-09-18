import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useShowcaseStore } from '../store/useShowcaseStore';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Enforce global hardware acceleration (GPU layer promotion) across all GSAP tweens
gsap.config({
  force3D: true, // Forces 3D transforms (translate3d/matrix3d) permanently, preventing layer creation/destruction thrashing
  autoSleep: 60,  // Sleeps inactive tweens to release GPU memory
});

gsap.defaults({
  force3D: true, // Default all tweens to hardware-accelerated 3D composition
  ease: 'power2.out',
});

ScrollTrigger.config({
  limitCallbacks: true, // Suppresses excess scroll callbacks during rapid dynamic flings
  syncInterval: 50,     // Low latency ScrollTrigger update synchronization
  ignoreMobileResize: true, // Prevents mobile address bar resize jank
});

let globalLenis: Lenis | null = null;
let isTickerAttached = false;

export function getGlobalLenis(): Lenis | null {
  return globalLenis;
}

/**
 * Hardware-accelerated programmatic scroll to top
 */
export function scrollToTop(duration = 1.1) {
  if (globalLenis) {
    globalLenis.scrollTo(0, {
      duration,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
  } else if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

/**
 * Hardware-accelerated programmatic scroll to any target element or selector
 */
export function scrollToTarget(
  target: string | HTMLElement,
  options?: { offset?: number; duration?: number }
) {
  if (globalLenis) {
    globalLenis.scrollTo(target as any, {
      offset: options?.offset ?? 0,
      duration: options?.duration ?? 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
  } else if (typeof window !== 'undefined') {
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    el?.scrollIntoView({ behavior: 'smooth' });
  }
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
        wheelMultiplier: 1.0,
        touchMultiplier: 1.5,
        infinite: false,
        autoResize: true,
      });

      // Connect Lenis to ScrollTrigger with immediate synchronization
      globalLenis.on('scroll', (e: any) => {
        ScrollTrigger.update();
        useShowcaseStore.getState().setScrollProgress(e.progress);
      });

      if (!isTickerAttached) {
        // High-precision GSAP RAF ticker integration (prevents desync between virtual scroll and transforms)
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

    // Dynamic scroll interceptor for hash anchor links (#the-loop, #impact, etc.)
    // Smoothly glides to targets using Lenis hardware-accelerated easing
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest?.('a[href^="#"]');
      if (!target) return;
      const href = target.getAttribute('href');
      if (!href || href === '#' || href === '#!') return;

      try {
        const element = document.querySelector(href);
        if (element && globalLenis) {
          e.preventDefault();
          globalLenis.scrollTo(element as HTMLElement, {
            offset: -10,
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          });
        }
      } catch (err) {
        // Ignore invalid selectors
      }
    };
    document.addEventListener('click', handleAnchorClick);

    // Global pointer tracking for 3D parallax
    const handlePointerMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      useShowcaseStore.getState().setPointer({ x, y });
    };
    window.addEventListener('mousemove', handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  return globalLenis;
}
