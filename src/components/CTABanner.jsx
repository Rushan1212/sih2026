import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  ArrowUpRight, 
  ShieldCheck, 
  Sparkles, 
  Terminal, 
  CheckCircle2, 
  Building2, 
  Mail, 
  Radio 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../utils/sound';

gsap.registerPlugin(ScrollTrigger);

export default function CTABanner({ onOpenDemo, onOpenSimulator }) {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');
  const [subsidiary, setSubsidiary] = useState('BCCL');

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { scale: 0.92, opacity: 0, y: 50, force3D: true },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          force3D: true,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleQuickSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    soundManager.playSuccess();
    setSubmitted(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#F5A623', '#FFD60A', '#FFFFFF'],
    });
  };

  return (
    <section 
      ref={sectionRef} 
      className="relative bg-coal-950 text-white py-28 px-4 sm:px-6 lg:px-8 border-t border-coal-800 overflow-hidden"
    >
      {/* Intense Glowing Radial Background Background */}
      <div className="absolute inset-0 bg-radial-gradient from-amber/20 via-coal-950/80 to-coal-950 pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-amber/15 blur-[160px] rounded-full pointer-events-none"></div>
      <div className="absolute inset-0 bg-radar-grid-amber opacity-30 pointer-events-none"></div>

      <div 
        ref={contentRef}
        className="max-w-5xl mx-auto relative z-10 glass-panel-amber rounded-3xl p-8 sm:p-14 border border-amber/40 shadow-[0_0_80px_rgba(245,166,35,0.2)] text-center"
      >
        {/* Top War Room Alert Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-coal-900 border border-amber/40 text-amber font-mono text-xs uppercase tracking-wider mb-6 shadow-lg">
          <Radio className="w-3.5 h-3.5 text-safety-yellow animate-pulse" />
          <span>GOVERNMENT OF INDIA & CIL SUBSIDIARY ONBOARDING</span>
        </div>

        {/* Large Scaling Headline */}
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-extrabold uppercase tracking-tight text-white mb-6 leading-tight">
          Ready to Transform <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber via-safety-yellow to-amber-glow text-glow-amber">
            Mine Governance?
          </span>
        </h2>

        <p className="text-coal-200 text-sm sm:text-lg max-w-2xl mx-auto font-light leading-relaxed mb-10">
          Deploy CoalGuard AI across your opencast or underground coal blocks in under 14 days. Full integration with DGMS statutory reporting portals and zero disruption to active shift rosters.
        </p>

        {!submitted ? (
          <div className="max-w-xl mx-auto space-y-6">
            {/* Quick Dispatch Form */}
            <form onSubmit={handleQuickSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="official.email@coalindia.in"
                className="flex-1 px-4 py-3.5 rounded-xl bg-coal-900/90 border border-coal-700 text-white placeholder-coal-500 text-sm font-mono focus:outline-none focus:border-amber transition-colors"
              />
              <button
                type="submit"
                onMouseEnter={() => soundManager.playHover()}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber to-amber-electric text-coal-950 font-display font-bold text-base tracking-wider uppercase shadow-[0_0_30px_rgba(245,166,35,0.4)] hover:shadow-[0_0_45px_rgba(245,166,35,0.7)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <span>Request Briefing</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </form>

            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-coal-300">
              <button
                type="button"
                onClick={() => {
                  soundManager.playAlert();
                  onOpenSimulator();
                }}
                className="text-amber hover:underline flex items-center gap-1.5"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Or launch Interactive War Room Incident Simulator &rarr;</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-coal-900/90 border border-emerald-500/50 max-w-lg mx-auto text-center space-y-3 animate-in fade-in zoom-in duration-300">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h3 className="text-xl font-display font-bold text-white">
              Operational Briefing Scheduled
            </h3>
            <p className="text-xs font-mono text-coal-300">
              Our Govtech Deployment Directorate has dispatched an encrypted briefing kit and compliance checklist to <span className="text-amber">{email}</span>.
            </p>
          </div>
        )}

        {/* Security / Compliance Badges */}
        <div className="mt-10 pt-8 border-t border-coal-800/80 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-coal-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-amber" />
            DGMS CMR 2017 Pre-Approved
          </span>
          <span className="text-coal-700">•</span>
          <span className="flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-safety-yellow" />
            GeM Portal Registered
          </span>
          <span className="text-coal-700">•</span>
          <span>14-Day Pilot Integration</span>
        </div>

        {/* Tactical corner HUD markers */}
        <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-amber"></div>
        <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-amber"></div>
        <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-amber"></div>
        <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-amber"></div>
      </div>
    </section>
  );
}
