import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Cpu, 
  MapPin, 
  Zap, 
  LayoutGrid, 
  Map, 
  Lock,
  ArrowUpRight
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const marqueeTags = [
  'AI Risk Detection',
  'GSAP Geo-Tagged Inspections',
  'Automated DGMS Reports',
  'Contractor Compliance',
  'Real-Time Dashboards',
  'Offline Mobile Sync',
  'Blockchain Audit Trail',
  'GIS Mine Mapping',
];

const cards = [
  {
    icon: Cpu,
    title: 'AI Compliance Engine',
    description: 'Detects recurring violations, flags high-risk zones, and predicts compliance failures before they occur.',
    tag: 'NEURAL PREDICTION',
  },
  {
    icon: MapPin,
    title: 'Geo-Tagged Mobile App',
    description: 'Field officers log inspections with GPS coordinates, photos, and timestamps. Works fully offline.',
    tag: 'SUB-METER GPS',
  },
  {
    icon: Zap,
    title: 'Automated Workflows',
    description: 'Alerts, escalations, digital approvals, and statutory report generation — zero manual effort.',
    tag: 'DGMS FORM IV & 24',
  },
  {
    icon: LayoutGrid,
    title: 'Regulatory Dashboards',
    description: 'Separate views for mine officials, corporate heads, and DGMS regulators. Role-based access.',
    tag: 'MULTI-TIER ACCESS',
  },
  {
    icon: Map,
    title: 'GIS Mine Mapping',
    description: 'Visual mine site map across India. Click any site for live compliance status and incident history.',
    tag: 'LIDAR DRONE MESH',
  },
  {
    icon: Lock,
    title: 'Blockchain Audit Trail',
    description: 'Every action timestamped and tamper-proof. Full evidentiary trail for regulatory review.',
    tag: 'IMMUTABLE LEDGER',
  },
];

export default function SolutionMarquee() {
  const sectionRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cardEls = gridRef.current?.querySelectorAll('.solution-card');
      if (cardEls && cardEls.length > 0) {
        gsap.fromTo(
          cardEls,
          { y: 60, opacity: 0, scale: 0.95, force3D: true },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            stagger: 0.12,
            ease: 'power3.out',
            force3D: true,
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 80%',
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
      id="platform"
      ref={sectionRef} 
      className="relative bg-[#0B0B0D] text-white py-20 border-t border-amber/20 overflow-hidden"
    >
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber/5 blur-[160px] pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto px-6 mb-16 relative z-10">
        <div className="max-w-2xl">
          <div className="text-xs uppercase tracking-widest text-[#F5A623] font-bold mb-3 font-mono">
            THE PLATFORM
          </div>
          <h2 className="text-4xl sm:text-6xl font-headline tracking-tight uppercase leading-[0.95] text-white">
            One system. <br />
            <span className="text-[#F5A623]">Every compliance need.</span>
          </h2>
        </div>
      </div>

      {/* Infinite Horizontal Marquee */}
      <div className="w-full overflow-hidden py-4 border-y border-[#26262E] bg-[#0B0B0D] mb-20 select-none relative z-10">
        <div className="animate-marquee flex items-center gap-6 will-change-transform gpu-layer">
          {[...marqueeTags, ...marqueeTags, ...marqueeTags].map((tag, idx) => (
            <div
              key={idx}
              className="px-4 py-2 rounded-full border border-amber/35 bg-[#141418] text-xs font-mono text-amber tracking-wider uppercase whitespace-nowrap flex items-center gap-3 shadow-amber-subtle hover:border-amber transition-colors"
            >
              <span>{tag}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse"></span>
            </div>
          ))}
        </div>
      </div>

      {/* 3-Column Antigravity Feature Card Grid */}
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {cards.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="solution-card glass-card-dark p-8 rounded-xl flex flex-col justify-between group will-change-transform gpu-composite"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-lg bg-[#101014] border border-[#2A2A34] group-hover:border-amber/60 flex items-center justify-center text-amber transition-all shadow-md group-hover:scale-110">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono uppercase text-[#8A8A93] group-hover:text-amber transition-colors">
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-headline tracking-wide uppercase text-white mb-3 group-hover:text-amber transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-[#8A8A93] text-sm leading-relaxed font-light">
                    {item.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-[#22222A] flex items-center justify-between text-xs font-mono text-[#8A8A93]">
                  <span className="group-hover:text-white transition-colors">EXPLORE CAPABILITY</span>
                  <ArrowUpRight className="w-4 h-4 text-amber group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
}
