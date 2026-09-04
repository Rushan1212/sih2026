import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Shield, Zap, TrendingUp, Network, Crosshair, Award, Radio } from 'lucide-react';
import { soundManager } from '../utils/sound';

gsap.registerPlugin(ScrollTrigger);

const statsData = [
  {
    targetValue: 500,
    prefix: '',
    suffix: '+',
    decimals: 0,
    label: 'Mine Sites Ready for Integration',
    subtext: 'Opencast & underground seams mapped across national coal basins',
    icon: Network,
    highlight: 'ALL 8 BASINS COVERED',
  },
  {
    targetValue: 98.2,
    prefix: '',
    suffix: '%',
    decimals: 1,
    label: 'Compliance Rate Achieved',
    subtext: 'Zero-tolerance alignment with DGMS CMR 2017 statutory norms',
    icon: Shield,
    highlight: 'STATUTORY CONFORMITY',
  },
  {
    targetValue: 60,
    prefix: '',
    suffix: '%',
    decimals: 0,
    label: 'Reduction in Reporting Delays',
    subtext: 'From 45-day paper cycles down to instant cryptographic submission',
    icon: TrendingUp,
    highlight: 'TIME-TO-AUDIT OPTIMIZED',
  },
  {
    targetValue: 12,
    prefix: '',
    suffix: '',
    decimals: 0,
    label: 'Real-Time across Subsidiaries',
    subtext: 'BCCL, ECL, CCL, WCL, SECL, MCL, NCL, CMPDIL, SCCL & more',
    icon: Zap,
    highlight: 'UNIFIED COMMAND LAYER',
  },
];

const subsidiaries = [
  'BHARAT COKING COAL (BCCL)',
  'EASTERN COALFIELDS (ECL)',
  'CENTRAL COALFIELDS (CCL)',
  'WESTERN COALFIELDS (WCL)',
  'SOUTH EASTERN COALFIELDS (SECL)',
  'MAHANADI COALFIELDS (MCL)',
  'NORTHERN COALFIELDS (NCL)',
  'SINGARENI COLLIERIES (SCCL)',
  'CMPDIL EXPLORATION HQ',
  'NEYVELI LIGNITE (NLC)',
];

export default function StatsBlueprint() {
  const sectionRef = useRef(null);
  const countersRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      countersRef.current.forEach((el, index) => {
        if (!el) return;
        const stat = statsData[index];

        const counterObj = { val: 0 };
        gsap.to(counterObj, {
          val: stat.targetValue,
          duration: 2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            once: true,
          },
          onUpdate: () => {
            if (el) {
              el.innerText = stat.decimals > 0
                ? counterObj.val.toFixed(stat.decimals)
                : Math.round(counterObj.val).toString();
            }
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="stats"
      ref={sectionRef} 
      className="relative bg-coal-950 text-white py-24 px-4 sm:px-6 lg:px-8 border-t border-coal-800 overflow-hidden"
    >
      {/* Blueprint Grid Overlay */}
      <div className="absolute inset-0 bg-radar-grid opacity-30 pointer-events-none"></div>
      <div className="absolute -top-32 right-10 w-96 h-96 bg-amber/10 blur-[130px] rounded-full pointer-events-none"></div>

      {/* Crosshair Tactical Background Decors */}
      <div className="absolute top-8 right-8 text-coal-600 hidden md:block">
        <Crosshair className="w-12 h-12 opacity-20" />
      </div>
      <div className="absolute bottom-8 left-8 text-coal-600 hidden md:block">
        <Crosshair className="w-12 h-12 opacity-20" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-coal-900 border border-amber/30 text-amber font-mono text-xs uppercase tracking-wider mb-4 shadow-[0_0_15px_rgba(245,166,35,0.15)]">
            <Award className="w-4 h-4 text-safety-yellow" />
            <span>National Scale Benchmarks</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-extrabold tracking-tight uppercase leading-tight">
            Engineered for the Scale of <span className="text-amber text-glow-amber">India’s Mining Sector.</span>
          </h2>
          <p className="mt-4 text-coal-300 text-sm sm:text-base font-light">
            Field-tested metrics designed to transform public sector governance, reduce statutory liabilities, and protect over 250,000 mine workers.
          </p>
        </div>

        {/* 4 Stat Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="glass-card rounded-2xl p-6 sm:p-8 border border-coal-700/80 hover:border-amber/60 flex flex-col justify-between relative group transition-all duration-300 hover:-translate-y-1 shadow-xl"
              >
                {/* HUD Reticle */}
                <div className="absolute top-2 right-2 text-coal-600 group-hover:text-amber transition-colors font-mono text-[10px]">
                  [0{idx + 1}]
                </div>

                <div>
                  <div className="w-12 h-12 rounded-xl bg-coal-900 border border-coal-700 text-amber flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-amber/50 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>

                  <div className="text-[10px] font-mono text-amber tracking-widest uppercase mb-1">
                    {stat.highlight}
                  </div>

                  {/* Large Counter */}
                  <div className="flex items-baseline gap-1 my-2">
                    <span
                      ref={(el) => (countersRef.current[idx] = el)}
                      className="text-4xl sm:text-5xl font-mono font-extrabold text-white group-hover:text-amber transition-colors"
                    >
                      0
                    </span>
                    <span className="text-3xl font-mono font-bold text-amber">
                      {stat.suffix}
                    </span>
                  </div>

                  <h3 className="text-lg font-display font-bold text-white mt-3">
                    {stat.label}
                  </h3>
                </div>

                <p className="text-xs text-coal-400 mt-4 pt-4 border-t border-coal-800 leading-relaxed font-mono">
                  {stat.subtext}
                </p>

                {/* Corner accents */}
                <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-amber/30"></div>
                <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-amber/30"></div>
              </div>
            );
          })}
        </div>

        {/* Subsidiary Ticker Bar */}
        <div className="mt-16 pt-8 border-t border-coal-800">
          <div className="flex items-center gap-2 mb-4 text-xs font-mono text-coal-400">
            <Radio className="w-3.5 h-3.5 text-amber animate-pulse" />
            <span className="uppercase tracking-widest text-amber">ACTIVE SUBSIDIARY ARCHITECTURE MATRIX:</span>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {subsidiaries.map((sub, sIdx) => (
              <span
                key={sIdx}
                className="px-3 py-1.5 rounded-lg bg-coal-900/90 border border-coal-800 text-coal-300 font-mono text-xs hover:border-amber/40 hover:text-white transition-colors flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                {sub}
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
