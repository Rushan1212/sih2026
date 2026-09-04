import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Brain, 
  LayoutDashboard, 
  Smartphone, 
  Workflow, 
  Layers, 
  CheckCircle2, 
  ShieldCheck, 
  Cpu, 
  Sparkles,
  ArrowRight,
  Database,
  MapPin,
  Flame,
  Radio,
  ScanLine
} from 'lucide-react';
import { soundManager } from '../utils/sound';

gsap.registerPlugin(ScrollTrigger);

const solutionPanels = [
  {
    id: '01',
    category: 'INTELLIGENT HAZARD DETECTION',
    title: 'AI Compliance & Anomaly Engine',
    subtitle: 'Continuous neural surveillance across opencast and deep underground pits',
    description: 'Neural models ingest multi-gas sensor streams (CH4, CO, O2), pit bench slope lidar, and CCTV streams to detect micro-variations 48 hours before statutory thresholds are breached.',
    features: [
      'Multi-Gas CH4/CO Surge Prediction with 99.4% accuracy',
      'Overburden Bench Slope Shift Radar & Lidar Ingestion',
      'Automated violation tagging matching Coal Mines Regulations 2017',
    ],
    icon: Brain,
    accentColor: '#F5A623',
    badge: 'NEURAL CORE v4.2',
    metric: '< 2.4s',
    metricLabel: 'Anomaly to DGMS Alert Dispatch',
    previewType: 'engine',
  },
  {
    id: '02',
    category: 'COMMAND & CONTROL',
    title: 'Real-Time Multi-Tier Dashboards',
    subtitle: 'Synchronized visibility for Pit Managers, Subsidiary Directors, and DGMS Officials',
    description: 'Unified single-pane-of-glass architecture tailored with role-based access. Mine overmen see live shift telemetries, corporate sees subsidiary benchmarks, and regulators get instant compliance audits.',
    features: [
      'Role-based views for 12 Subsidiaries (BCCL, CCL, SECL, MCL...)',
      'One-click statutory export to DGMS national portal',
      'Live equipment RFID fleet telemetry & dispatch authorization',
    ],
    icon: LayoutDashboard,
    accentColor: '#FFD60A',
    badge: 'MULTI-TIER ARCHITECTURE',
    metric: '100%',
    metricLabel: 'Real-Time Sync across 500+ Pits',
    previewType: 'dashboard',
  },
  {
    id: '03',
    category: 'FIELD TELEMETRY & EDGE',
    title: 'Geo-Tagged Mobile Field Inspector',
    subtitle: 'Cryptographically verified mobile inspections with full offline sync',
    description: 'Designed for extreme field conditions inside deep pits with zero cellular coverage. Field officers complete guided checklists, take geotagged tamper-proof photos, and sign with biometric verification.',
    features: [
      'Sub-meter GPS & Geo-fence enforcement inside pits',
      'Offline cryptographic ledger with zero data loss',
      'Biometric fingerprint & facial verification for shift handovers',
    ],
    icon: Smartphone,
    accentColor: '#F5A623',
    badge: 'MIL-SPEC MOBILE EDGE',
    metric: '0.0s',
    metricLabel: 'Data Loss on Remote Offline Shifts',
    previewType: 'mobile',
  },
  {
    id: '04',
    category: 'PROCESS AUTOMATION',
    title: 'Automated Governance Workflows',
    subtitle: 'Instant chain-of-command escalations and digital statutory registers',
    description: 'Eliminates paper bottleneck. When a gas surge or slope anomaly occurs, digital work orders, emergency muster call-outs, and statutory DGMS Form-IV reports are automatically populated and routed.',
    features: [
      'Automated Form-IV, Form-24, and Form-V statutory generation',
      'Multi-level escalation matrices with SMS & satellite dispatch',
      'Digital signature pipeline compliant with IT Act & DGMS guidelines',
    ],
    icon: Workflow,
    accentColor: '#FF9F0A',
    badge: 'AUTONOMOUS PIPELINES',
    metric: '92%',
    metricLabel: 'Reduction in Manual Form Filing Time',
    previewType: 'workflow',
  },
  {
    id: '05',
    category: 'GEOSPATIAL & AUDIT LEDGER',
    title: 'GIS Lidar & Immutable Audit Trail',
    subtitle: 'Drone photogrammetry combined with cryptographic compliance logs',
    description: 'Combines satellite remote sensing, weekly drone Lidar scans for excavation boundary adherence, and OCR scanning that digitizes legacy mine books into searchable, immutable compliance logs.',
    features: [
      'High-resolution GIS 3D elevation maps with leasehold boundaries',
      'OCR digitizer for 50-year-old physical seam registers',
      'Cryptographic tamper-evident audit ledger for Ministry of Coal reviews',
    ],
    icon: Layers,
    accentColor: '#F5A623',
    badge: 'GIS + LEDGER TECH',
    metric: '50+ Yrs',
    metricLabel: 'Legacy Logs Digitized & Searchable',
    previewType: 'gis',
  },
];

export default function SolutionHorizontal() {
  const sectionRef = useRef(null);
  const triggerRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const track = trackRef.current;
      if (!track) return;

      const totalPanels = solutionPanels.length;
      
      // Calculate scroll distance
      const getScrollAmount = () => {
        return track.scrollWidth - window.innerWidth;
      };

      const tween = gsap.to(track, {
        x: () => -getScrollAmount(),
        ease: 'none',
        scrollTrigger: {
          trigger: triggerRef.current,
          start: 'top top',
          end: () => `+=${getScrollAmount() * 1.2}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="solution"
      ref={sectionRef} 
      className="relative bg-coal-950 text-white overflow-hidden border-t border-coal-800"
    >
      <div ref={triggerRef} className="h-screen w-full flex flex-col justify-between py-12">
        
        {/* Section Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-coal-800">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber/10 border border-amber/30 text-amber font-mono text-xs uppercase tracking-wider mb-2">
                <Cpu className="w-3.5 h-3.5" />
                <span>Next-Gen Govtech Architecture</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold uppercase tracking-tight">
                The Complete <span className="text-glow-amber text-amber">CoalGuard</span> Ecosystem
              </h2>
            </div>

            <div className="flex items-center gap-3 font-mono text-xs text-coal-400">
              <span className="hidden sm:inline">SCROLL HORIZONTALLY TO EXPLORE</span>
              <div className="flex items-center gap-1 text-amber">
                <span>[ 01 — 05 ]</span>
                <ArrowRight className="w-4 h-4 animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Horizontal Track Container */}
        <div className="relative w-full overflow-hidden flex-1 flex items-center my-auto">
          <div 
            ref={trackRef} 
            className="flex gap-8 px-8 sm:px-16 w-max will-change-transform py-4"
          >
            {solutionPanels.map((panel, idx) => {
              const Icon = panel.icon;
              return (
                <div
                  key={panel.id}
                  className="w-[85vw] sm:w-[620px] lg:w-[680px] h-[480px] glass-card rounded-2xl p-6 sm:p-8 flex flex-col justify-between relative border border-coal-700/80 hover:border-amber/60 transition-all group overflow-hidden"
                >
                  {/* Glowing Top Border Accent */}
                  <div 
                    className="absolute top-0 left-0 right-0 h-1.5 transition-all duration-300 group-hover:h-2"
                    style={{ backgroundColor: panel.accentColor }}
                  ></div>

                  {/* Background Watermark Number */}
                  <span className="absolute -bottom-6 -right-4 font-bebas text-9xl text-coal-800/20 select-none pointer-events-none group-hover:text-coal-700/30 transition-colors">
                    {panel.id}
                  </span>

                  {/* Panel Top Meta */}
                  <div className="flex items-start justify-between relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-coal-900 border border-amber/30 text-amber shadow-lg group-hover:scale-110 transition-transform">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[11px] font-mono text-amber tracking-widest uppercase">
                          {panel.category}
                        </span>
                        <div className="text-[10px] font-mono text-coal-400">
                          {panel.badge}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-mono font-bold text-white group-hover:text-amber transition-colors">
                        {panel.metric}
                      </div>
                      <div className="text-[10px] font-mono text-coal-400">
                        {panel.metricLabel}
                      </div>
                    </div>
                  </div>

                  {/* Title & Core Copy */}
                  <div className="space-y-3 relative z-10 my-2">
                    <h3 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-wide">
                      {panel.title}
                    </h3>
                    <p className="text-xs sm:text-sm font-mono text-amber-glow">
                      // {panel.subtitle}
                    </p>
                    <p className="text-coal-300 text-xs sm:text-sm leading-relaxed">
                      {panel.description}
                    </p>
                  </div>

                  {/* Tactical Feature Bullets */}
                  <div className="space-y-2 relative z-10 pt-3 border-t border-coal-800/80">
                    {panel.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2.5 text-xs text-coal-200">
                        <CheckCircle2 className="w-4 h-4 text-amber flex-shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Interactive Status Footer Bar */}
                  <div className="flex items-center justify-between pt-3 text-[11px] font-mono text-coal-400 relative z-10">
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      SYSTEM MODULE VALIDATED
                    </span>
                    <span className="text-coal-500 font-mono">
                      PANEL {panel.id} / 05
                    </span>
                  </div>

                  {/* Corner reticles */}
                  <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-amber/40"></div>
                  <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-amber/40"></div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section Bottom Track Indicator */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-4">
          <div className="flex items-center justify-between text-xs font-mono text-coal-400">
            <span className="text-amber">LIVE WORKSPACE MESH</span>
            <span className="text-coal-400">DRAG / SCROLL DOWN FOR QUANTIFIED METRICS</span>
          </div>
        </div>

      </div>
    </section>
  );
}
