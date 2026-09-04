import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Smartphone, 
  Cpu, 
  FileCheck2, 
  CheckCircle, 
  ArrowRight, 
  Sparkles,
  MapPin,
  ShieldCheck,
  AlertTriangle,
  Radio,
  Clock
} from 'lucide-react';
import { soundManager } from '../utils/sound';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    step: '01',
    phase: 'EDGE CAPTURE',
    title: 'Field Officers Log Geo-Tagged Inspections',
    subtitle: 'Cryptographic GPS lock & tamper-proof mobile workflow',
    description: 'Safety overmen and DGMS inspectors conduct physical rounds inside opencast benches and deep seams using ruggedized mobile devices. Every entry is stamped with sub-meter satellite coordinates, biometric signatures, and offline cryptographic proof.',
    details: [
      'Sub-meter GPS geofencing prevents fake or remote log filings',
      'Mandatory photo evidence with AI metadata verification',
      'Offline store-and-forward architecture with automatic cloud sync',
    ],
    icon: Smartphone,
    color: '#F5A623',
    badge: 'MIL-SPEC EDGE INPUT',
    telemetry: 'LAT: 23.7957° N // LON: 86.4304° E // GPS LOCK: 100%',
  },
  {
    step: '02',
    phase: 'NEURAL EVALUATION',
    title: 'AI Engine Processes Streams & Flags Violations',
    subtitle: 'Continuous multimodal risk detection & DGMS rulebook matching',
    description: 'Within 2 seconds of ingestion, CoalGuard’s neural engine evaluates sensor feeds, drone photogrammetry, and inspection logs against the Coal Mines Regulations (CMR) 2017. Anomalies, gas build-ups, or uninspected benches trigger automated emergency protocols.',
    details: [
      'Multi-gas ppm threshold validation (CH4, CO, Dust PM2.5/10)',
      'Lidar overburden slope shift detection and bench hazard mapping',
      'Instant SMS, radio, and push notification dispatches to pit overmen',
    ],
    icon: Cpu,
    color: '#FFD60A',
    badge: 'REAL-TIME INFERENCE',
    telemetry: 'INFERENCE LATENCY: 2.1s // CMR 2017 MATCH: 100%',
  },
  {
    step: '03',
    phase: 'STATUTORY AUDIT & COMMAND',
    title: 'Command War Room & Auto-Generated Statutory Filings',
    subtitle: 'Zero-delay executive dashboards and instant DGMS exports',
    description: 'Mine Managers, Subsidiary GMs, and Ministry officials access synchronized war-room dashboards. Statutory forms (DGMS Form-IV, Form-24, Monthly Safety Audit) are automatically compiled, digitally signed, and submitted with one click.',
    details: [
      'One-click statutory export to DGMS national compliance portal',
      'Live subsidiary-wide risk ranking and contractor safety scores',
      'Immutable cryptographic audit ledger ready for parliamentary queries',
    ],
    icon: FileCheck2,
    color: '#30D158',
    badge: 'STATUTORY CONFORMITY',
    telemetry: 'AUDIT GENERATION: 0.4s // DIGITAL SIGNATURE: VALID',
  },
];

export default function HowItWorksTimeline() {
  const sectionRef = useRef(null);
  const stepsRef = useRef([]);
  const lineRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate the vertical connecting line
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 60%',
              end: 'bottom 80%',
              scrub: 1,
            },
          }
        );
      }

      // Animate alternating step cards
      stepsRef.current.forEach((card, index) => {
        if (!card) return;
        const isEven = index % 2 === 0;

        gsap.fromTo(
          card,
          {
            x: isEven ? -60 : 60,
            opacity: 0,
            rotateY: isEven ? -8 : 8,
          },
          {
            x: 0,
            opacity: 1,
            rotateY: 0,
            duration: 0.9,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="workflow"
      ref={sectionRef} 
      className="relative bg-coal-950 text-white py-24 px-4 sm:px-6 lg:px-8 border-t border-coal-800 overflow-hidden"
    >
      {/* Ambience & Grid */}
      <div className="absolute inset-0 bg-radar-grid opacity-20 pointer-events-none"></div>
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-amber/5 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-coal-900 border border-amber/30 text-amber font-mono text-xs uppercase tracking-wider mb-4 shadow-[0_0_15px_rgba(245,166,35,0.15)]">
            <Radio className="w-3.5 h-3.5 text-amber animate-pulse" />
            <span>Autonomous Closed-Loop Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-extrabold uppercase tracking-tight">
            How <span className="text-amber text-glow-amber">CoalGuard</span> Works
          </h2>
          <p className="mt-4 text-coal-300 text-sm sm:text-base font-light">
            A seamless three-step pipeline transforming chaotic pit-head logs into real-time statutory intelligence.
          </p>
        </div>

        {/* Timeline Container with Center Connecting Line */}
        <div className="relative">
          
          {/* Vertical Glowing Connecting Spine */}
          <div className="hidden md:block absolute left-1/2 top-8 bottom-8 -translate-x-1/2 w-1 bg-coal-800 z-0">
            <div 
              ref={lineRef}
              className="w-full h-full bg-gradient-to-b from-amber via-safety-yellow to-emerald-400 origin-top shadow-[0_0_15px_#F5A623]"
            ></div>
          </div>

          {/* Steps List */}
          <div className="space-y-16 sm:space-y-24">
            {steps.map((item, idx) => {
              const Icon = item.icon;
              const isEven = idx % 2 === 0;

              return (
                <div
                  key={item.step}
                  className={`relative flex flex-col md:flex-row items-center gap-8 ${
                    isEven ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Step Content Card */}
                  <div 
                    ref={(el) => (stepsRef.current[idx] = el)}
                    className="w-full md:w-[calc(50%-40px)] glass-card p-6 sm:p-8 rounded-2xl border border-coal-700/80 hover:border-amber/50 relative shadow-2xl group transition-all"
                  >
                    {/* Glowing Top Border */}
                    <div 
                      className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
                      style={{ backgroundColor: item.color }}
                    ></div>

                    {/* Step Pill */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span 
                          className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold"
                          style={{ backgroundColor: `${item.color}20`, color: item.color, border: `1px solid ${item.color}40` }}
                        >
                          STEP {item.step} // {item.phase}
                        </span>
                        <span className="text-[10px] font-mono text-coal-400">
                          {item.badge}
                        </span>
                      </div>
                      <span className="font-bebas text-3xl text-coal-500/40 group-hover:text-amber/40 transition-colors">
                        0{idx + 1}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-display font-bold text-white mb-1">
                      {item.title}
                    </h3>
                    <div className="text-xs font-mono text-amber mb-3">
                      // {item.subtitle}
                    </div>

                    <p className="text-coal-300 text-xs sm:text-sm leading-relaxed mb-6 font-light">
                      {item.description}
                    </p>

                    {/* Key Details */}
                    <div className="space-y-2 pt-4 border-t border-coal-800">
                      {item.details.map((d, dIdx) => (
                        <div key={dIdx} className="flex items-start gap-2 text-xs text-coal-200">
                          <CheckCircle className="w-3.5 h-3.5 text-amber mt-0.5 flex-shrink-0" />
                          <span>{d}</span>
                        </div>
                      ))}
                    </div>

                    {/* Telemetry Footer */}
                    <div className="mt-4 pt-3 border-t border-coal-800/80 flex items-center justify-between text-[10px] font-mono text-coal-400">
                      <span className="truncate">{item.telemetry}</span>
                      <span className="text-emerald-400 flex items-center gap-1 flex-shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                        LIVE
                      </span>
                    </div>

                    {/* Reticle */}
                    <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-amber/30"></div>
                  </div>

                  {/* Center Node Icon (Desktop) */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-14 h-14 rounded-2xl bg-coal-900 border-2 border-amber items-center justify-center text-amber z-10 shadow-[0_0_20px_rgba(245,166,35,0.4)]">
                    <Icon className="w-6 h-6" />
                  </div>

                  {/* Empty Spacer Column on alternating side */}
                  <div className="hidden md:block w-full md:w-[calc(50%-40px)]"></div>

                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
