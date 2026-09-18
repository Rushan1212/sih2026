import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Scale, 
  ClipboardCheck, 
  Truck, 
  AlertOctagon, 
  Wind, 
  Users, 
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Layers
} from 'lucide-react';
import { soundManager } from '../utils/sound';

gsap.registerPlugin(ScrollTrigger);

const featureModules = [
  {
    id: '01',
    title: 'Statutory Compliance Tracking',
    act: 'Mines Act 1952 // CMR 2017',
    description: 'Autonomous mapping of daily pit logs against 400+ statutory clauses in the Coal Mines Regulations (2017). Flags impending regulatory expirations, ventilation violations, and blast zone clearances.',
    icon: Scale,
    highlight: 'DGMS Form 24, IV, V Auto-Compiled',
    stats: '100% Clause Coverage',
  },
  {
    id: '02',
    title: 'Smart Inspection Management',
    act: 'Geo-Fenced Verification',
    description: 'Dynamic digital inspection rosters enforce mandatory physical presence of safety officers in active hazard zones. Eliminates proxy inspections with biometric authentication and timestamped lidar proof.',
    icon: ClipboardCheck,
    highlight: 'GPS Sub-meter Boundary Lock',
    stats: 'Zero Proxy Sign-offs',
  },
  {
    id: '03',
    title: 'Contractor & Fleet Monitoring',
    act: 'RFID & ANPR Integration',
    description: 'Continuous tracking of heavy earth-moving machinery (HEMM), dumpers, and third-party contractor personnel. Automatically verifies driver safety certifications, vehicle fitness, and speed limit conformity.',
    icon: Truck,
    highlight: 'HEMM Fleet & Driver Telemetry',
    stats: '4,200+ Vehicles Tracked',
  },
  {
    id: '04',
    title: 'Grievance & SOS Emergency Dispatch',
    act: 'Zero-Delay Safety Channel',
    description: 'Direct, tamper-proof emergency broadcast protocol connecting underground refuge chambers to surface war rooms. Includes an encrypted whistle-blower channel for reporting concealed safety hazards.',
    icon: AlertOctagon,
    highlight: 'Sub-second Emergency Broadcast',
    stats: '< 1.8s SOS Dispatch',
  },
  {
    id: '05',
    title: 'Environmental & Gas Telemetry',
    act: 'Continuous Sensor Stream',
    description: 'Real-time telemetry ingestion from multi-gas sensors (Methane CH4, Carbon Monoxide CO, O2 deficiency, toxic SOx) and ambient air quality monitors (PM2.5/PM10 dust levels at pit edges).',
    icon: Wind,
    highlight: 'CH4, CO, O2, PM2.5 Micro-Surge Alerts',
    stats: '24/7 Sensor Mesh',
  },
  {
    id: '06',
    title: 'Labour & Workforce Safety Matrix',
    act: 'DGMS Vocational Training Passports',
    description: 'Biometric shift muster linked to DGMS safety training certifications (VT Passports). Restricts pit entry to unauthorized or uncertified personnel and tracks continuous fatigue indices.',
    icon: Users,
    highlight: 'Biometric Gate & Seam Access',
    stats: '250,000+ Workers Protected',
  },
];

export default function FeatureDeepDive() {
  const sectionRef = useRef(null);
  const gridRef = useRef(null);
  const [activeFeature, setActiveFeature] = useState(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gridRef.current?.querySelectorAll('.feature-card');
      if (cards && cards.length > 0) {
        gsap.fromTo(
          cards,
          {
            y: 60,
            opacity: 0,
            scale: 0.95,
            force3D: true,
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            stagger: 0.12,
            ease: 'power2.out',
            force3D: true,
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 78%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="features"
      ref={sectionRef} 
      className="relative bg-coal-950 text-white py-24 px-4 sm:px-6 lg:px-8 border-t border-coal-800 overflow-hidden"
    >
      {/* Ambience */}
      <div className="absolute inset-0 bg-radar-grid-amber opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-amber/5 blur-[140px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-6 border-b border-coal-800">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-coal-900 border border-amber/30 text-amber font-mono text-xs uppercase tracking-wider mb-4">
              <Layers className="w-3.5 h-3.5" />
              <span>Full Operational Capability</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-display font-extrabold uppercase tracking-tight">
              Enterprise Governance <span className="text-amber text-glow-amber">Feature Deep Dive</span>
            </h2>
          </div>
          <p className="text-coal-400 text-sm max-w-md font-mono">
            // Six unified pillars covering every regulatory, environmental, and physical safety requirement of Indian mining law.
          </p>
        </div>

        {/* 3x2 Staggered Feature Cards Grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featureModules.map((module) => {
            const Icon = module.icon;
            return (
              <div
                key={module.id}
                onMouseEnter={() => soundManager.playHover()}
                className="feature-card glass-card rounded-2xl p-6 sm:p-8 border border-coal-700/80 hover:border-amber hover:shadow-amber-glow transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between group relative overflow-hidden will-change-transform gpu-composite"
              >
                {/* Top Subtle Amber Line Accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber to-amber-electric opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-coal-900 border border-coal-700 text-amber flex items-center justify-center group-hover:scale-110 group-hover:border-amber/60 transition-all shadow-md">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="font-mono text-xs text-amber font-semibold px-2.5 py-1 rounded bg-amber/10 border border-amber/20">
                      MOD-0{module.id}
                    </span>
                  </div>

                  {/* Title & Tag */}
                  <div className="text-[10px] font-mono text-coal-400 tracking-wider uppercase mb-1">
                    {module.act}
                  </div>
                  <h3 className="text-xl font-display font-bold text-white group-hover:text-amber transition-colors mb-3">
                    {module.title}
                  </h3>

                  <p className="text-coal-300 text-xs sm:text-sm leading-relaxed mb-6 font-light">
                    {module.description}
                  </p>
                </div>

                {/* Footer Highlights */}
                <div className="pt-4 border-t border-coal-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-coal-400">{module.highlight}</span>
                    <span className="text-emerald-400 font-bold">{module.stats}</span>
                  </div>
                </div>

                {/* Corner HUD Markers */}
                <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-amber/30"></div>
                <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-amber/30"></div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
