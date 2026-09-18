import React, { useRef, useEffect, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useShowcaseStore } from '../../store/useShowcaseStore';
import { ChevronDown, ArrowDown, ArrowUp, FastForward, CheckCircle2, Shield, Play } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const STATION_FRAMES = [1, 40, 80, 120, 160, 200, 240];
const TOTAL_FRAMES = 240;

// Verified DGMS CMR 2017 Statutory Content for the 7 Tunnel Stations
const STATIONS = [
  {
    station: 1,
    frame: 1,
    navLabel: 'Scale',
    statutory: 'Mines Act 1952 · DGMS Dhanbad',
    heading: 'The scale of the problem',
    idea: 'India moved over a billion tonnes of coal last year, and every tonne of it is governed by a paper trail.',
    supporting: [
      'National production reached 1,047.52 million tonnes in FY 2024-25, crossing one billion tonnes for the first time, with captive and commercial mines producing 210.46 MT (up 10.22% YoY).',
      'The statutory reality: mandatory daily manager rounds under Section 17, unannounced DGMS Dhanbad inspections, and Form M annual returns due every 31 January.',
      'A strict two-hour fatal-accident reporting clock ticks against manual, siloed registers scattered across shifts.'
    ],
    ruleType: 'flag' // Amber accent
  },
  {
    station: 2,
    frame: 40,
    navLabel: 'Failures',
    statutory: 'CMR 2017 · Reg. 47 & 104',
    heading: 'What breaks',
    idea: 'Five systemic failures fracture safety: fragmented data, manual reporting, delayed risk detection, poor accountability, and reactive governance.',
    supporting: [
      'Hazards like roof falls, gas inundations, machinery failures, and fires develop silently between periodic inspection rounds.',
      'Under the Mines Act, both lease holder and contractor bear strict liability — the owner cannot transfer statutory responsibility to a contractor.',
      'The problem is not lack of data. It is lack of connected, actionable intelligence.'
    ],
    ruleType: 'flag'
  },
  {
    station: 3,
    frame: 80,
    navLabel: 'Inputs',
    statutory: 'CMR 2017 · Pre-Shift Machinery Standard',
    heading: 'What the mine already knows',
    idea: 'Documents, worker and contractor records, CCTV and field evidence, inspection reports, HEMM pre-shift checklists, statutory registers.',
    supporting: [
      'Operator-signed pre-shift inspections before HEMM enters the active zone, maintained HEMM logbooks, proximity detection, and capped 1-in-16 haul road gradients.',
      'Worker certification records and quarterly Safety Committee proceedings for operations with 250+ miners.',
      'All of it exists. None of it connects.'
    ],
    ruleType: 'flag'
  },
  {
    station: 4,
    frame: 120,
    navLabel: 'Closed Loop',
    statutory: 'Mines Act · Section 17 Hard Gate',
    heading: 'The closed loop',
    idea: 'A 7-stage workflow linking frontline observation directly to audited statutory remediation.',
    stages: [
      { name: 'Field Evidence', type: 'amber' },
      { name: 'AI Analysis', type: 'amber' },
      { name: 'Risk Detection', type: 'amber' },
      { name: 'Officer Verification', type: 'green', isGate: true },
      { name: 'Corrective Action', type: 'green' },
      { name: 'Escalation', type: 'green' },
      { name: 'Closure Verification', type: 'green' }
    ],
    supporting: [
      'Officer verification is a hard statutory gate, not an optional step: a mine manager certified under Section 17 of the Mines Act, 1952 carries ultimate responsibility that cannot be delegated to a model.',
      'Amber lights for active detection; green signals verified, logged compliance closure.'
    ],
    ruleType: 'verified' // Green accent
  },
  {
    station: 5,
    frame: 160,
    navLabel: 'USPs',
    statutory: 'Edge Architecture · 5 Core USPs',
    heading: 'What makes it different',
    idea: 'Engineered specifically for mining realities across five architectural differentiators.',
    usps: [
      { name: 'Risk-to-Action', desc: 'Every issue becomes an owned, dated, and tracked corrective action.' },
      { name: 'AI Evidence Intelligence', desc: 'Reads documents and field evidence, not just clean electronic forms.' },
      { name: 'Predictive Risk Monitoring', desc: 'Preempts acute hazards before statutory thresholds breach.' },
      { name: 'Closed-Loop Compliance', desc: 'Ensures no detected issue is archived without verified sign-off.' },
      { name: 'Offline Field Communication', desc: 'Stores field data underground, syncs on reconnect — the tunnel you are standing in has no signal, which is exactly why this matters.' }
    ],
    supporting: [],
    ruleType: 'verified'
  },
  {
    station: 6,
    frame: 200,
    navLabel: 'Risks Answered',
    statutory: 'Operational Feasibility Matrix',
    heading: 'Risks, answered',
    idea: 'Five operational challenges resolved through disciplined engineering mitigations.',
    pairs: [
      { risk: 'Data quality', mitigation: 'Validation and standardization at intake' },
      { risk: 'Legacy systems', mitigation: 'API integration rather than replacement' },
      { risk: 'AI accuracy', mitigation: 'Human-in-the-loop officer verification before critical decisions' },
      { risk: 'Adoption', mitigation: 'Pilot first, scale after proving value' },
      { risk: 'Security', mitigation: 'Role-based access, encryption, tamper-proof audit logs' }
    ],
    footerCadence: 'Pilot → Validate → Improve → Scale',
    supporting: [],
    ruleType: 'verified'
  },
  {
    station: 7,
    frame: 240,
    navLabel: 'Arrival',
    statutory: 'CoalGuard AI · Operational Verification',
    heading: 'Arrival',
    idea: 'We don’t just detect problems. We turn them into verified actions.',
    supporting: [
      'Every issue becomes visible, accountable, and measurable.',
      'Pilot hypothesis: Targets measurable hazard escalation compression and zero unverified audit blind spots across shifts.'
    ],
    isArrival: true,
    ruleType: 'verified'
  }
];

// Per-station wall-mounted survey plate layouts & directional scrim gradients
const STATION_LAYOUTS = [
  // Station 1: Left-anchored bottom (frame light is centre-top)
  {
    wrapperClass: 'items-start justify-end pb-14 md:pb-20 pl-6 md:pl-16 pr-6',
    cardWidth: 'max-w-xl',
    scrimGradient: 'linear-gradient(90deg, rgba(7, 7, 8, 0.96) 0%, rgba(7, 7, 8, 0.88) 65%, rgba(7, 7, 8, 0.0) 100%)',
    align: 'text-left',
  },
  // Station 2: Right-anchored top (frame light is center)
  {
    wrapperClass: 'items-end justify-start pt-24 md:pt-28 pr-6 md:pr-16 pl-6',
    cardWidth: 'max-w-xl',
    scrimGradient: 'linear-gradient(270deg, rgba(7, 7, 8, 0.96) 0%, rgba(7, 7, 8, 0.88) 65%, rgba(7, 7, 8, 0.0) 100%)',
    align: 'text-left',
  },
  // Station 3: Left-anchored low and wide (frame light is center-right)
  {
    wrapperClass: 'items-start justify-end pb-14 md:pb-20 pl-6 md:pl-16 pr-6',
    cardWidth: 'max-w-2xl',
    scrimGradient: 'linear-gradient(60deg, rgba(7, 7, 8, 0.96) 0%, rgba(7, 7, 8, 0.88) 70%, rgba(7, 7, 8, 0.0) 100%)',
    align: 'text-left',
  },
  // Station 4: Right-anchored, wide (frame light is centre-left lamp)
  {
    wrapperClass: 'items-end justify-end pb-14 md:pb-20 pr-6 md:pr-16 pl-6',
    cardWidth: 'max-w-2xl',
    scrimGradient: 'linear-gradient(270deg, rgba(7, 7, 8, 0.96) 0%, rgba(7, 7, 8, 0.88) 70%, rgba(7, 7, 8, 0.0) 100%)',
    align: 'text-left',
  },
  // Station 5: Left-anchored top (frame light is upper-center)
  {
    wrapperClass: 'items-start justify-start pt-20 md:pt-24 pl-6 md:pl-16 pr-6',
    cardWidth: 'max-w-2xl',
    scrimGradient: 'linear-gradient(90deg, rgba(7, 7, 8, 0.96) 0%, rgba(7, 7, 8, 0.88) 70%, rgba(7, 7, 8, 0.0) 100%)',
    align: 'text-left',
  },
  // Station 6: Right-anchored top (frame light is center)
  {
    wrapperClass: 'items-end justify-start pt-20 md:pt-24 pr-6 md:pr-16 pl-6',
    cardWidth: 'max-w-2xl',
    scrimGradient: 'linear-gradient(270deg, rgba(7, 7, 8, 0.96) 0%, rgba(7, 7, 8, 0.88) 70%, rgba(7, 7, 8, 0.0) 100%)',
    align: 'text-left',
  },
  // Station 7: Centered Payoff (reserved for arrival alone)
  {
    wrapperClass: 'items-center justify-end pb-16 md:pb-22 px-6',
    cardWidth: 'max-w-2xl',
    scrimGradient: 'radial-gradient(ellipse at center, rgba(7, 7, 8, 0.96) 0%, rgba(7, 7, 8, 0.88) 60%, rgba(7, 7, 8, 0.0) 100%)',
    align: 'text-center',
  },
];

export default function TunnelScrollytelling({ onExplorePlatform, onOpenVideo }) {
  const containerRef = useRef(null);
  const pinWrapperRef = useRef(null);
  const canvasRef = useRef(null);

  const [loadProgress, setLoadProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [activeStationIndex, setActiveStationIndex] = useState(0);
  const [transitionStatus, setTransitionStatus] = useState('SETTLED');

  // Hardware-accelerated bitmap cache & RAF proxy
  const bitmapsCacheRef = useRef(new Map()); // Map<number, ImageBitmap>
  const isTransitioningRef = useRef(false);
  const pendingDirectionRef = useRef(0);
  const currentFrameRef = useRef(1);
  const lastDrawnFrameRef = useRef(-1);
  const frameProxyRef = useRef({ frame: 1 });
  const rafIdRef = useRef(0);
  const lastFlickTimeRef = useRef(0);
  const touchStartYRef = useRef(0);
  const canvasDimensionsRef = useRef({ w: 0, h: 0, dpr: 1 });

  const prefersReducedMotion = useShowcaseStore((s) => s.prefersReducedMotion);

  // Helper to get formatted frame file path
  // Uses 960x540 mobile set on screens < 768px or for memory conservation
  const getFramePath = useCallback((frameNum) => {
    const padded = String(frameNum).padStart(4, '0');
    const isMobile = typeof window !== 'undefined' && (window.innerWidth < 768 || window.devicePixelRatio > 2);
    return isMobile ? `/frames/mobile/frame_${padded}.webp` : `/frames/frame_${padded}.webp`;
  }, []);

  // Integer-rounded cover-fit draw function using decoded ImageBitmap
  const drawFrameBitmap = useCallback((frameNum) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Use alpha: false and desynchronized: true for direct zero-latency compositor output
    const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
    if (!ctx) return;

    const bitmap = bitmapsCacheRef.current.get(frameNum);
    if (!bitmap) return;

    const canvasW = canvasDimensionsRef.current.w || canvas.width;
    const canvasH = canvasDimensionsRef.current.h || canvas.height;
    const imgW = bitmap.width || 1920;
    const imgH = bitmap.height || 1080;

    const canvasRatio = canvasW / canvasH;
    const imgRatio = imgW / imgH;

    let drawW, drawH;
    if (canvasRatio > imgRatio) {
      drawW = canvasW;
      drawH = canvasW / imgRatio;
    } else {
      drawH = canvasH;
      drawW = canvasH * imgRatio;
    }

    // Scale up by 6% to push the bottom-right watermark outside the visible canvas
    const scale = 1.06;
    drawW *= scale;
    drawH *= scale;

    // Subpixel drawImage forces bilinear resampling on every frame; round to whole integers
    const drawX = Math.round((canvasW - drawW) / 2);
    const drawY = Math.round((canvasH - drawH) / 2 - canvasH * 0.015);
    const roundedW = Math.round(drawW);
    const roundedH = Math.round(drawH);

    ctx.drawImage(bitmap, drawX, drawY, roundedW, roundedH);
    lastDrawnFrameRef.current = frameNum;
    currentFrameRef.current = frameNum;
  }, []);

  // Dedicated single requestAnimationFrame loop reading from GSAP proxy object
  useEffect(() => {
    let active = true;

    const renderLoop = () => {
      if (!active) return;
      const targetFrame = Math.round(frameProxyRef.current.frame);

      // Only draw if target frame changed since last render
      if (targetFrame !== lastDrawnFrameRef.current) {
        drawFrameBitmap(targetFrame);
      }

      rafIdRef.current = requestAnimationFrame(renderLoop);
    };

    rafIdRef.current = requestAnimationFrame(renderLoop);

    return () => {
      active = false;
      cancelAnimationFrame(rafIdRef.current);
    };
  }, [drawFrameBitmap]);

  // Debounced resize handler: sets canvas width/height once, never per-frame
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const isMobile = window.innerWidth < 768;
    // Cap backing store: max 1.5x on mobile to avoid GPU fill-rate penalty, max 2.0x on desktop
    const dpr = isMobile ? Math.min(window.devicePixelRatio || 1, 1.5) : Math.min(window.devicePixelRatio || 1, 2.0);
    const w = Math.round(window.innerWidth * dpr);
    const h = Math.round(window.innerHeight * dpr);

    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      canvasDimensionsRef.current = { w, h, dpr };
    }

    drawFrameBitmap(currentFrameRef.current);
  }, [drawFrameBitmap]);

  // Decode off the main thread: fetch blob and convert via createImageBitmap()
  const loadBitmapFrame = useCallback(async (frameNum) => {
    if (bitmapsCacheRef.current.has(frameNum)) {
      return bitmapsCacheRef.current.get(frameNum);
    }
    try {
      const url = getFramePath(frameNum);
      const res = await fetch(url);
      if (!res.ok) return null;
      const blob = await res.blob();
      // Decodes on worker thread; zero-copy GPU uploadable bitmap
      const bitmap = await createImageBitmap(blob);
      bitmapsCacheRef.current.set(frameNum, bitmap);
      return bitmap;
    } catch (err) {
      return null;
    }
  }, [getFramePath]);

  // Preload priority frames with a concurrency pool of 10
  useEffect(() => {
    let isCancelled = false;

    async function preloadFramesConcurrently() {
      // Priority 1: Key station frames + first 40 frames
      const priorityFrames = Array.from(
        new Set([...STATION_FRAMES, ...Array.from({ length: 40 }, (_, i) => i + 1)])
      );

      let loadedCount = 0;
      const POOL_SIZE = 10;

      // Concurrent queue worker
      let queueIdx = 0;
      const worker = async () => {
        while (queueIdx < priorityFrames.length) {
          if (isCancelled) return;
          const frameNum = priorityFrames[queueIdx++];
          await loadBitmapFrame(frameNum);
          loadedCount++;
          const pct = Math.round((loadedCount / priorityFrames.length) * 100);
          setLoadProgress(pct);
        }
      };

      const workers = Array.from({ length: Math.min(POOL_SIZE, priorityFrames.length) }, () => worker());
      await Promise.all(workers);

      if (!isCancelled) {
        setIsReady(true);
        handleResize();
        drawFrameBitmap(1);
      }

      // Priority 2: Background idle-load remaining frames
      const remainingFrames = Array.from({ length: TOTAL_FRAMES }, (_, i) => i + 1)
        .filter((f) => !bitmapsCacheRef.current.has(f));

      let remIdx = 0;
      const bgWorker = async () => {
        while (remIdx < remainingFrames.length) {
          if (isCancelled) return;
          const frameNum = remainingFrames[remIdx++];
          await loadBitmapFrame(frameNum);
          // Yield slightly between frames to prevent thread contention
          await new Promise((r) => setTimeout(r, 8));
        }
      };

      const bgWorkers = Array.from({ length: 4 }, () => bgWorker());
      await Promise.all(bgWorkers);
    }

    preloadFramesConcurrently();

    // Debounce resize listener
    let resizeTimer;
    const onResizeDebounced = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(handleResize, 120);
    };

    window.addEventListener('resize', onResizeDebounced);

    return () => {
      isCancelled = true;
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', onResizeDebounced);
      // Close bitmaps on unmount to free GPU memory
      bitmapsCacheRef.current.forEach((bitmap) => {
        if (bitmap && typeof bitmap.close === 'function') {
          bitmap.close();
        }
      });
      bitmapsCacheRef.current.clear();
    };
  }, [loadBitmapFrame, handleResize, drawFrameBitmap]);

  // Transition between stations with weighted 900ms power3.out ease driving the proxy object
  const goToStation = useCallback((targetStationIndex) => {
    if (targetStationIndex < 0 || targetStationIndex >= STATION_FRAMES.length) return;
    if (targetStationIndex === activeStationIndex && !isTransitioningRef.current) return;

    isTransitioningRef.current = true;
    setTransitionStatus('TRAVERSING');

    const startFrame = currentFrameRef.current;
    const endFrame = STATION_FRAMES[targetStationIndex];
    frameProxyRef.current.frame = startFrame;

    gsap.killTweensOf(frameProxyRef.current);

    gsap.to(frameProxyRef.current, {
      frame: endFrame,
      duration: 0.9,
      ease: 'power3.out',
      onComplete: () => {
        frameProxyRef.current.frame = endFrame;
        drawFrameBitmap(endFrame);
        setActiveStationIndex(targetStationIndex);
        isTransitioningRef.current = false;
        setTransitionStatus('SETTLED');

        // Check if a gesture was queued during transition
        if (pendingDirectionRef.current !== 0) {
          const nextTarget = targetStationIndex + pendingDirectionRef.current;
          pendingDirectionRef.current = 0;
          if (nextTarget >= 0 && nextTarget < STATION_FRAMES.length) {
            goToStation(nextTarget);
          }
        }
      },
    });
  }, [activeStationIndex, drawFrameBitmap]);

  // Input gesture handling (Wheel, Momentum filter, Touch, Keyboard)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check if container is currently pinned/in active viewport
    const handleWheel = (e) => {
      const rect = container.getBoundingClientRect();
      const inView = rect.top <= 10 && rect.bottom >= window.innerHeight - 10;

      if (!inView) return;

      // Trackpad momentum & threshold filter:
      // Ignore weak momentum drift
      if (Math.abs(e.deltaY) < 18) return;

      const now = Date.now();
      const timeSinceLastFlick = now - lastFlickTimeRef.current;

      // If transition is in progress, queue at most ONE gesture
      if (isTransitioningRef.current) {
        if (timeSinceLastFlick > 350) {
          pendingDirectionRef.current = e.deltaY > 0 ? 1 : -1;
          lastFlickTimeRef.current = now;
        }
        e.preventDefault();
        return;
      }

      // Momentum cooldown: ignore rapid repeated events within 400ms of a previous gesture
      if (timeSinceLastFlick < 400) {
        e.preventDefault();
        return;
      }

      if (e.deltaY > 0) {
        // Scrolling Down
        if (activeStationIndex < STATION_FRAMES.length - 1) {
          e.preventDefault();
          lastFlickTimeRef.current = now;
          goToStation(activeStationIndex + 1);
        }
        // If at last station (index 6), don't preventDefault -> let page naturally scroll down to next section
      } else {
        // Scrolling Up
        if (activeStationIndex > 0) {
          e.preventDefault();
          lastFlickTimeRef.current = now;
          goToStation(activeStationIndex - 1);
        }
        // If at station 0, don't preventDefault -> let page naturally scroll up to hero
      }
    };

    // Keyboard navigation
    const handleKeyDown = (e) => {
      const rect = container.getBoundingClientRect();
      const inView = rect.top <= 50 && rect.bottom >= window.innerHeight - 50;
      if (!inView) return;

      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        if (activeStationIndex < STATION_FRAMES.length - 1) {
          e.preventDefault();
          goToStation(activeStationIndex + 1);
        }
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        if (activeStationIndex > 0) {
          e.preventDefault();
          goToStation(activeStationIndex - 1);
        }
      } else if (e.key === 'Escape') {
        // Skip tunnel section on Escape
        const nextElem = container.nextElementSibling;
        if (nextElem) {
          nextElem.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    // Touch Swipe navigation for mobile
    const handleTouchStart = (e) => {
      touchStartYRef.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e) => {
      const rect = container.getBoundingClientRect();
      const inView = rect.top <= 20 && rect.bottom >= window.innerHeight - 20;
      if (!inView) return;

      const delta = touchStartYRef.current - e.changedTouches[0].clientY;
      if (Math.abs(delta) < 40) return;

      if (delta > 0) {
        // Swipe Up / Scroll Down
        if (activeStationIndex < STATION_FRAMES.length - 1) {
          goToStation(activeStationIndex + 1);
        }
      } else {
        // Swipe Down / Scroll Up
        if (activeStationIndex > 0) {
          goToStation(activeStationIndex - 1);
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [activeStationIndex, goToStation]);

  // Setup GSAP Pin for the 7 stations
  useEffect(() => {
    if (prefersReducedMotion) return;

    const container = containerRef.current;
    const pinWrapper = pinWrapperRef.current;
    if (!container || !pinWrapper) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: 'bottom bottom',
        pin: pinWrapper,
        pinSpacing: true,
        anticipatePin: 1,
      });
    }, container);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  const currentStationData = STATIONS[activeStationIndex] || STATIONS[0];

  return (
    <section
      id="tunnel-scrollytelling"
      ref={containerRef}
      data-transitioning={transitionStatus === 'TRAVERSING' ? 'true' : 'false'}
      className="relative w-full bg-[#070708] border-b border-[#24272d]"
      style={{ height: '700vh' }} // 7 x 100vh scroll distance
    >
      {/* Pinned Viewport Container (100vh) */}
      <div
        ref={pinWrapperRef}
        className="relative w-full h-screen overflow-hidden flex flex-col justify-between"
        style={{ willChange: 'transform' }}
      >
        {/* Full-Bleed Canvas Frame Scrubbing (Promoted to own compositor layer) */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover z-0"
          style={{ transform: 'translateZ(0)', willChange: 'transform' }}
        />

        {/* Brand Amber Warmth Grading & Vignette (Warms cold grey source + masks watermark) */}
        <div
          className="absolute inset-0 pointer-events-none z-[1]"
          style={{
            background:
              'radial-gradient(ellipse at 45% 45%, rgba(245, 165, 36, 0.06) 0%, rgba(13, 14, 16, 0.50) 65%, rgba(7, 7, 8, 0.95) 100%)',
          }}
        />

        {/* Dedicated Bottom-Right Corner Scrim Mask to completely hide the 4-point sparkle watermark */}
        <div
          className="absolute bottom-0 right-0 w-80 h-60 pointer-events-none z-[2]"
          style={{
            background: 'radial-gradient(ellipse at bottom right, rgba(7, 7, 8, 0.98) 25%, transparent 75%)',
          }}
        />

        {/* Loading Progress Bar Screen (shows while Priority 1 frames decode) */}
        {!isReady && (
          <div className="absolute inset-0 z-50 bg-[#070708] flex flex-col items-center justify-center p-8">
            <div className="w-full max-w-md space-y-4 text-center">
              <div className="flex items-center justify-between font-mono text-xs text-[#8b9099] uppercase tracking-wider">
                <span>PRELOADING COAL SEAM TELEMETRY</span>
                <span className="text-[#f5a524] font-bold">{loadProgress}%</span>
              </div>
              {/* Thin amber progress rule (No spinner) */}
              <div className="w-full h-[2px] bg-[#24272d] overflow-hidden rounded-full">
                <div
                  className="h-full bg-[#f5a524] transition-all duration-150 ease-out"
                  style={{ width: `${loadProgress}%` }}
                />
              </div>
              <p className="font-mono text-[11px] text-[#8b9099]">
                Decoding 240-frame excavation traversal footage...
              </p>
            </div>
          </div>
        )}

        {/* Top Header: Clean Station Indicator Bar (Named Station Labels) */}
        <header className="relative z-10 w-full px-6 md:px-12 pt-6 flex items-center justify-between flex-wrap gap-4 bg-gradient-to-b from-[#070708]/90 to-transparent">
          {/* Station Identity & Progress Rule */}
          <div className="flex items-center gap-3 font-mono text-xs">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                currentStationData.ruleType === 'verified' ? 'bg-[#38bdf8]' : 'bg-[#f5a524]'
              } animate-pulse`}
            />
            <span className="font-bold text-[#edeef0] uppercase tracking-wider">
              {currentStationData.heading}
            </span>
            <span className="text-[#24272d]">|</span>
            <span className="text-[#8b9099] uppercase">
              Station {activeStationIndex + 1} of 7
            </span>
          </div>

          {/* Named Station Navigation Indicators */}
          <nav
            aria-label="Tunnel traversal stations"
            className="flex items-center gap-1 bg-[#16181c]/90 border border-[#24272d] p-1 rounded-sm backdrop-blur-md"
          >
            {STATIONS.map((st, idx) => {
              const isActive = activeStationIndex === idx;
              return (
                <button
                  key={st.station}
                  onClick={() => goToStation(idx)}
                  className={`px-2.5 py-1 rounded-sm font-mono text-[11px] font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-[#f5a524] text-[#070708] shadow-[0_0_12px_rgba(245,165,36,0.35)]'
                      : 'text-[#8b9099] hover:text-[#edeef0] hover:bg-[#24272d]'
                  }`}
                  aria-label={`Jump to station ${idx + 1}: ${st.navLabel}`}
                  aria-current={isActive ? 'step' : undefined}
                >
                  <span className="opacity-60 mr-1">{idx + 1}</span>
                  <span>{st.navLabel}</span>
                </button>
              );
            })}
          </nav>
        </header>

        {/* Wall-Mounted Statutory Notice / Survey Board (Varying per-station layout) */}
        {(() => {
          const currentLayout = STATION_LAYOUTS[activeStationIndex] || STATION_LAYOUTS[0];
          const isVerified = currentStationData.ruleType === 'verified';
          const accentColor = isVerified ? '#2fbf71' : '#f5a524';

          return (
            <div
              className={`relative z-10 w-full flex-1 flex flex-col pointer-events-none ${currentLayout.wrapperClass}`}
            >
              {/* Wall-Mounted Statutory Plate / Inspection Board */}
              <div
                className={`relative p-6 sm:p-8 rounded-[2px] shadow-2xl space-y-4 pointer-events-auto border transition-all duration-300 ${currentLayout.cardWidth} ${
                  isVerified
                    ? 'border-[#2fbf71]/40 border-t-2 border-t-[#2fbf71]'
                    : 'border-[#f5a524]/40 border-t-2 border-t-[#f5a524]'
                }`}
                style={{
                  background: currentLayout.scrimGradient,
                  backdropFilter: 'blur(12px) saturate(0.8)',
                  WebkitBackdropFilter: 'blur(12px) saturate(0.8)',
                  clipPath: transitionStatus === 'TRAVERSING' ? 'inset(0 100% 0 0)' : 'inset(0 0% 0 0)',
                  transition: 'clip-path 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                {/* Survey Plate Corner Ticks ┌ ┐ └ ┘ */}
                <div className="absolute -top-[1px] -left-[1px] w-2.5 h-2.5 border-t-2 border-l-2 border-[#8b9099]/70 pointer-events-none" />
                <div className="absolute -top-[1px] -right-[1px] w-2.5 h-2.5 border-t-2 border-r-2 border-[#8b9099]/70 pointer-events-none" />
                <div className="absolute -bottom-[1px] -left-[1px] w-2.5 h-2.5 border-b-2 border-l-2 border-[#8b9099]/70 pointer-events-none" />
                <div className="absolute -bottom-[1px] -right-[1px] w-2.5 h-2.5 border-b-2 border-r-2 border-[#8b9099]/70 pointer-events-none" />

                {/* Hairline Statutory Rule with Regulation Reference */}
                <div className="flex items-center justify-between gap-4 font-mono text-xs pb-1 border-b border-[#24272d]">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: accentColor }}
                    />
                    <span
                      className="font-bold uppercase tracking-widest text-[11px]"
                      style={{ color: accentColor }}
                    >
                      {currentStationData.statutory}
                    </span>
                  </div>
                  <span className="text-[#8b9099] uppercase text-[10px] tracking-wider">
                    STATION 0{activeStationIndex + 1} / 07
                  </span>
                </div>

                {/* Station Title (Archivo Variable Expanded Signage) */}
                <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black text-[#edeef0] uppercase tracking-tight leading-none">
                  {currentStationData.heading}
                </h2>

                {/* Core Idea (Inter Tight, High Contrast) */}
                <p className="font-sans text-sm sm:text-base font-medium text-[#f3f4f6] leading-relaxed">
                  {currentStationData.idea}
                </p>

                {/* Station 4 Specific: 7-Stage Rail Sequence */}
                {currentStationData.stages && (
                  <div className="pt-2 space-y-2">
                    <div className="font-mono text-[10px] text-[#8b9099] uppercase tracking-wider">
                      STATUTORY GOVERNANCE RAIL:
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5 p-2.5 bg-[#070708]/85 border border-[#24272d] rounded-[2px]">
                      {currentStationData.stages.map((stage, sIdx) => (
                        <div key={stage.name} className="flex items-center gap-1.5">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] font-mono text-[10px] font-bold uppercase tracking-wider ${
                              stage.type === 'green'
                                ? 'bg-[#2fbf71]/15 text-[#2fbf71] border border-[#2fbf71]/40'
                                : 'bg-[#f5a524]/15 text-[#f5a524] border border-[#f5a524]/40'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                stage.type === 'green' ? 'bg-[#2fbf71]' : 'bg-[#f5a524]'
                              }`}
                            />
                            {stage.name}
                            {stage.isGate && (
                              <span className="ml-1 px-1 py-[1px] bg-[#e0523f]/20 text-[#f87171] text-[8px] font-extrabold rounded-[1px]">
                                HARD GATE
                              </span>
                            )}
                          </span>
                          {sIdx < currentStationData.stages.length - 1 && (
                            <span className="text-[#4b5563] text-xs">→</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Station 5 Specific: 5 Core USPs */}
                {currentStationData.usps && (
                  <div className="grid grid-cols-1 gap-2 pt-2">
                    {currentStationData.usps.map((usp) => (
                      <div
                        key={usp.name}
                        className="p-2 bg-[#070708]/80 border border-[#24272d] rounded-[2px] font-sans text-xs"
                      >
                        <span className="font-bold text-[#f5a524] mr-2 font-mono uppercase tracking-wider">
                          {usp.name}:
                        </span>
                        <span className="text-[#d1d5db]">{usp.desc}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Station 6 Specific: Facing Pairs */}
                {currentStationData.pairs && (
                  <div className="space-y-2 pt-2">
                    <div className="grid grid-cols-1 gap-1.5">
                      {currentStationData.pairs.map((p) => (
                        <div
                          key={p.risk}
                          className="flex items-center justify-between p-2 bg-[#070708]/80 border border-[#24272d] rounded-[2px] font-mono text-xs"
                        >
                          <span className="text-[#f87171] uppercase tracking-wide font-bold">
                            {p.risk}
                          </span>
                          <span className="text-[#6b7280]">→</span>
                          <span className="text-[#2fbf71] font-sans font-medium text-right text-xs">
                            {p.mitigation}
                          </span>
                        </div>
                      ))}
                    </div>
                    {currentStationData.footerCadence && (
                      <div className="text-center font-mono text-xs font-bold text-[#f5a524] py-1 tracking-widest uppercase bg-[#f5a524]/10 border border-[#f5a524]/20 rounded-[2px]">
                        {currentStationData.footerCadence}
                      </div>
                    )}
                  </div>
                )}

                {/* Station 7 Specific: Dual Action CTAs */}
                {currentStationData.isArrival && (
                  <div className="pt-3 flex flex-wrap justify-center gap-3">
                    <button
                      type="button"
                      onClick={onExplorePlatform}
                      className="px-6 py-3 bg-[#f5a524] text-[#070708] font-mono font-bold text-xs uppercase tracking-wider rounded-[2px] hover:bg-[#ffd08a] transition-all flex items-center gap-2 shadow-[0_0_24px_rgba(245,165,36,0.3)] cursor-pointer"
                    >
                      <Shield className="w-4 h-4" />
                      <span>Explore the Platform</span>
                    </button>
                    <button
                      type="button"
                      onClick={onOpenVideo}
                      className="px-6 py-3 bg-[#16181c] text-[#edeef0] border border-[#24272d] font-mono font-bold text-xs uppercase tracking-wider rounded-[2px] hover:bg-[#24272d] transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <Play className="w-4 h-4 text-[#f5a524] fill-[#f5a524]" />
                      <span>Watch the Demo</span>
                    </button>
                  </div>
                )}

                {/* Supporting Lines (Max 3 lines, strict regulatory facts) */}
                {currentStationData.supporting && currentStationData.supporting.length > 0 && (
                  <ul className="space-y-1.5 pt-1 text-xs text-[#9ca3af] leading-normal font-sans">
                    {currentStationData.supporting.map((line, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-[#f5a524] mt-0.5">•</span>
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Bottom Card Navigation Prompt */}
                <div className="pt-3 border-t border-[#24272d] flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-[#8b9099]">
                  <div className="flex items-center gap-2">
                    <ArrowDown className="w-3.5 h-3.5 text-[#f5a524] animate-bounce" />
                    <span>SCROLL WHEEL / ARROW DOWN TO ADVANCE</span>
                  </div>
                  <span className="text-[#8b9099] text-[10px]">
                    {currentStationData.statutory.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Bottom Bar: Clean Guidance / Skip Affordance (No leaked debug scaffolding) */}
        <footer className="relative z-10 w-full px-6 md:px-12 py-4 bg-gradient-to-t from-[#070708] to-transparent flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-[#8b9099]">
          <div className="flex items-center gap-4">
            <span className="text-[#edeef0]">DGMS CMR 2017 OPERATIONAL AUDIT</span>
            <span className="text-[#24272d]">|</span>
            <span>FIRST-PERSON TUNNEL TRAVERSAL</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => {
                const nextElem = containerRef.current?.nextElementSibling;
                if (nextElem) nextElem.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-[#8b9099] hover:text-[#f5a524] transition-colors flex items-center gap-1 text-[11px]"
            >
              <span>Skip tunnel traversal [Esc]</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </footer>

        {/* Optional Development Debug Overlay (Active strictly when ?debug=1 is in URL) */}
        {typeof window !== 'undefined' && window.location.search.includes('debug=1') && (
          <aside className="absolute bottom-16 left-6 z-50 p-3 bg-[#070708]/95 border border-[#e0523f] rounded font-mono text-[10px] text-[#8b9099] space-y-1">
            <div className="text-[#f5a524] font-bold">[DEV DEBUG HUD ?debug=1]</div>
            <div>STATUS: {transitionStatus}</div>
            <div>FRAME: {STATION_FRAMES[activeStationIndex]} / 240</div>
            <div>INPUT LOCK: {isTransitioningRef.current ? 'LOCKED' : 'READY'}</div>
            <div>GESTURE QUEUE: {pendingDirectionRef.current}</div>
          </aside>
        )}
      </div>
    </section>
  );
}
