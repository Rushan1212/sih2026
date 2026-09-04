import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  ShieldCheck, 
  Activity, 
  Gauge, 
  Radio, 
  Sparkles, 
  ChevronRight,
  RefreshCw,
  Cpu
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function Hero({ onOpenDemo, onOpenVideo }) {
  const containerRef = useRef(null);
  const cockpitRef = useRef(null);
  const stat1Ref = useRef(null);
  const stat2Ref = useRef(null);
  const stat3Ref = useRef(null);
  
  const [tilt, setTilt] = useState({ rotateX: 6, rotateY: -8 });
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Headline words animate in with staggered Y reveal
      gsap.from(".word", {
        y: 80,
        opacity: 0,
        stagger: 0.12,
        duration: 0.9,
        ease: "power3.out"
      });

      // 2. Amber line under headline draws left to right
      gsap.from(".divider", {
        scaleX: 0,
        duration: 1.2,
        transformOrigin: "left",
        ease: "power2.out",
        delay: 0.8
      });

      // 3. Subheadline and buttons fade up with 0.4s delay
      gsap.from(".hero-sub", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.4,
        ease: "power3.out"
      });

      gsap.from(".hero-btns", {
        y: 20,
        opacity: 0,
        duration: 0.7,
        delay: 0.5,
        ease: "power3.out"
      });

      // 4. Floating 3D Cockpit entrance animation
      gsap.from(".cockpit-container", {
        y: 60,
        opacity: 0,
        duration: 1.1,
        delay: 0.7,
        ease: "power3.out"
      });

      // 5. Stats bottom container fade
      gsap.from(".hero-stats", {
        opacity: 0,
        y: 20,
        duration: 0.8,
        delay: 0.9,
        ease: "power3.out"
      });

      // 6. Stats count up from 0 on page load
      const counter1 = { val: 0 };
      gsap.to(counter1, {
        val: 542,
        duration: 1.8,
        delay: 0.8,
        ease: "power2.out",
        onUpdate: () => {
          if (stat1Ref.current) stat1Ref.current.innerText = Math.round(counter1.val).toString();
        }
      });

      const counter2 = { val: 0 };
      gsap.to(counter2, {
        val: 98,
        duration: 1.8,
        delay: 0.8,
        ease: "power2.out",
        onUpdate: () => {
          if (stat2Ref.current) stat2Ref.current.innerText = Math.round(counter2.val).toString();
        }
      });

      const counter3 = { val: 0 };
      gsap.to(counter3, {
        val: 12,
        duration: 1.8,
        delay: 0.8,
        ease: "power2.out",
        onUpdate: () => {
          if (stat3Ref.current) stat3Ref.current.innerText = Math.round(counter3.val).toString();
        }
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Antigravity 3D mouse parallax tilt for the floating cockpit
  const handleMouseMove = (e) => {
    if (!cockpitRef.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = cockpitRef.current.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    
    // Smooth tilt angles
    const rotX = -(y / rect.height) * 16;
    const rotY = (x / rect.width) * 18;
    setTilt({ rotateX: rotX, rotateY: rotY });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 6, rotateY: -8 });
  };

  const triggerSensorSweep = () => {
    setScanning(true);
    setTimeout(() => setScanning(false), 2400);
  };

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="min-h-screen bg-[#0B0B0D] flex flex-col justify-between pt-36 pb-16 px-6 relative overflow-hidden"
    >
      {/* Subtle spatial coal grain & ambient depth glow */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-25 z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='coalGrain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23coalGrain)' opacity='0.5'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />
      
      {/* Soft layered spatial amber aura */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[650px] h-[400px] bg-amber/8 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute top-1/2 right-1/4 w-[350px] h-[350px] bg-amber/5 blur-[120px] pointer-events-none rounded-full" />

      {/* Centered Hero Content */}
      <div className="max-w-5xl mx-auto text-center my-auto flex flex-col items-center relative z-10 w-full">
        
        {/* Subtle Spatial Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#141418]/80 border border-amber/25 text-amber text-[11px] font-mono tracking-widest uppercase mb-6 shadow-amber-subtle">
          <span className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse"></span>
          <span>AUTONOMOUS COAL GOVERNANCE PLATFORM</span>
        </div>

        {/* Single Large Headline - each word wrapped in span.word with overflow:hidden parent */}
        <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-headline tracking-tight text-white uppercase leading-[0.95] mb-2">
          <span className="inline-block overflow-hidden py-1">
            <span className="word inline-block mr-3 sm:mr-5">Every</span>
          </span>
          <span className="inline-block overflow-hidden py-1">
            <span className="word inline-block mr-3 sm:mr-5">Mine.</span>
          </span>
          <br className="hidden sm:inline" />
          <span className="inline-block overflow-hidden py-1">
            <span className="word inline-block mr-3 sm:mr-5 text-[#F5A623]">Governed.</span>
          </span>
          <br className="hidden md:inline" />
          <span className="inline-block overflow-hidden py-1">
            <span className="word inline-block mr-3 sm:mr-5">In</span>
          </span>
          <span className="inline-block overflow-hidden py-1">
            <span className="word inline-block mr-3 sm:mr-5">Real</span>
          </span>
          <span className="inline-block overflow-hidden py-1">
            <span className="word inline-block">Time.</span>
          </span>
        </h1>

        {/* Thin animated amber horizontal line */}
        <div className="divider w-32 sm:w-48 h-[2px] bg-[#F5A623] my-6 origin-left shadow-[0_0_12px_rgba(245,166,35,0.45)]" />

        {/* Subheadline (max 12 words) */}
        <p className="hero-sub text-lg sm:text-xl text-[#8A8A93] max-w-xl mx-auto font-light leading-relaxed mb-10">
          AI-powered compliance and continuous safety governance for India's coal mining sector.
        </p>

        {/* Two Buttons Only */}
        <div className="hero-btns flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-16">
          <button
            onClick={onOpenDemo}
            className="w-full sm:w-auto px-8 py-4 bg-[#F5A623] text-[#0B0B0D] font-bold text-xs uppercase tracking-wider hover:bg-[#FFA826] active:scale-95 transition-all shadow-[0_0_30px_rgba(245,166,35,0.3)] hover:shadow-[0_0_45px_rgba(245,166,35,0.5)]"
          >
            Request Demo
          </button>
          
          <button
            onClick={onOpenVideo}
            className="w-full sm:w-auto px-8 py-4 bg-transparent border border-[#383842] text-white hover:border-[#F5A623] hover:text-[#F5A623] font-bold text-xs uppercase tracking-wider transition-all"
          >
            Watch Overview
          </button>
        </div>

        {/* ─── ANTIGRAVITY SPATIAL 3D FLOATING COCKPIT ─── */}
        <div className="cockpit-container w-full max-w-4xl perspective-1200 my-4">
          <div 
            ref={cockpitRef}
            className="preserve-3d relative w-full glass-spatial rounded-2xl p-5 sm:p-7 border border-amber/25 shadow-floating transition-transform duration-500 ease-out"
            style={{
              transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
            }}
          >
            {/* Top Cockpit Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-coal-border/70 text-xs font-mono">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="text-white font-bold tracking-wider">SEAM 04 // JHARIA EAST COMMAND COCKPIT</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={triggerSensorSweep}
                  className="px-2.5 py-1 rounded bg-[#1C1C24] border border-amber/30 text-[10px] text-amber hover:text-white hover:border-amber transition-all flex items-center gap-1.5"
                >
                  <RefreshCw className={`w-3 h-3 ${scanning ? 'animate-spin' : ''}`} />
                  <span>{scanning ? 'SWEEPING SENSORS...' : 'SWEEP SENSORS'}</span>
                </button>
                <span className="text-emerald-400 text-[10px] font-mono bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
                  DGMS GREEN
                </span>
              </div>
            </div>

            {/* Main Spatial Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-5">
              
              {/* Telemetry Card 1: Gas Waveform */}
              <div 
                className="preserve-3d bg-[#14141A]/90 p-4 rounded-xl border border-coal-border/60 hover:border-amber/40 transition-all text-left relative overflow-hidden group shadow-glass"
                style={{ transform: 'translateZ(25px)' }}
              >
                <div className="flex items-center justify-between text-[10px] font-mono text-[#8A8A93] uppercase mb-2">
                  <span>Methane CH4 Index</span>
                  <Gauge className="w-3.5 h-3.5 text-amber" />
                </div>
                <div className="text-2xl font-headline tracking-wider text-white flex items-baseline gap-2">
                  <span>0.06%</span>
                  <span className="text-xs font-mono text-emerald-400 font-bold">NOMINAL</span>
                </div>
                <div className="w-full bg-[#0D0D10] h-1.5 rounded-full mt-3 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-amber w-[28%] transition-all duration-700"></div>
                </div>
                <span className="text-[9px] font-mono text-[#8A8A93] block mt-2">THRESHOLD: &lt; 0.75% CMR REG 137</span>
              </div>

              {/* Telemetry Card 2: Lidar Slope Stability */}
              <div 
                className="preserve-3d bg-[#14141A]/90 p-4 rounded-xl border border-coal-border/60 hover:border-amber/40 transition-all text-left relative overflow-hidden group shadow-glass"
                style={{ transform: 'translateZ(40px)' }}
              >
                <div className="flex items-center justify-between text-[10px] font-mono text-[#8A8A93] uppercase mb-2">
                  <span>Bench Slope Stability</span>
                  <Activity className="w-3.5 h-3.5 text-amber" />
                </div>
                <div className="text-2xl font-headline tracking-wider text-white flex items-baseline gap-2">
                  <span className="text-amber">99.82%</span>
                  <span className="text-xs font-mono text-amber font-bold">LOCKED</span>
                </div>
                <div className="w-full bg-[#0D0D10] h-1.5 rounded-full mt-3 overflow-hidden">
                  <div className="h-full bg-amber w-[99%]"></div>
                </div>
                <span className="text-[9px] font-mono text-[#8A8A93] block mt-2">LIDAR RADAR STRAIN: &lt; 2.1mm</span>
              </div>

              {/* Telemetry Card 3: DGMS Form Sync */}
              <div 
                className="preserve-3d bg-[#14141A]/90 p-4 rounded-xl border border-coal-border/60 hover:border-amber/40 transition-all text-left relative overflow-hidden group shadow-glass"
                style={{ transform: 'translateZ(25px)' }}
              >
                <div className="flex items-center justify-between text-[10px] font-mono text-[#8A8A93] uppercase mb-2">
                  <span>Statutory DGMS Conformity</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="text-2xl font-headline tracking-wider text-white flex items-baseline gap-2">
                  <span>FORM 24</span>
                  <span className="text-xs font-mono text-emerald-400 font-bold">AUTO-COMPILED</span>
                </div>
                <div className="w-full bg-[#0D0D10] h-1.5 rounded-full mt-3 overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[100%]"></div>
                </div>
                <span className="text-[9px] font-mono text-[#8A8A93] block mt-2">DGMS PORTAL DIRECT SYNC: ACTIVE</span>
              </div>

            </div>

            {/* Scanning Laser Sweep Effect */}
            {scanning && (
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-amber/15 to-transparent h-20 w-full animate-bounce z-20"></div>
            )}
          </div>
        </div>

      </div>

      {/* Bottom Thin Horizontal Line with 3 Simple Stats counting up on load */}
      <div className="hero-stats max-w-4xl mx-auto w-full pt-8 border-t border-[#26262E] relative z-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-xs uppercase tracking-widest text-[#8A8A93]">
          <div>
            <span ref={stat1Ref} className="text-white font-bold text-sm block sm:inline mr-2 font-mono">0</span>
            <span>Mine Sites</span>
          </div>
          <div className="hidden sm:block text-[#383842]">|</div>
          <div>
            <span className="text-[#F5A623] font-bold text-sm block sm:inline mr-2 font-mono">
              <span ref={stat2Ref}>0</span>%
            </span>
            <span>Compliance Rate</span>
          </div>
          <div className="hidden sm:block text-[#383842]">|</div>
          <div>
            <span ref={stat3Ref} className="text-white font-bold text-sm block sm:inline mr-2 font-mono">0</span>
            <span>Subsidiaries</span>
          </div>
        </div>
      </div>

    </section>
  );
}
