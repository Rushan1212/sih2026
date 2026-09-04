import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  Smartphone, 
  Workflow, 
  Layers, 
  Truck 
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const solutions = [
  {
    icon: ShieldCheck,
    title: 'AI Compliance Engine',
    description: 'Continuously correlates sensor streams, ventilation logs, and bench slopes to flag violations against Coal Mines Regulations (CMR) 2017 in real time.',
  },
  {
    icon: LayoutDashboard,
    title: 'Real-Time Dashboards',
    description: 'Unified command interface providing pit managers, subsidiary executives, and regulatory inspectors synchronized access to active operations.',
  },
  {
    icon: Smartphone,
    title: 'Geo-Tagged Mobile Inspector',
    description: 'Ruggedized mobile logging with GPS geofencing and biometric signatures. Functions seamlessly in deep underground seams without cellular network.',
  },
  {
    icon: Workflow,
    title: 'Automated Statutory Workflows',
    description: 'Instantly compiles and digitally routes DGMS Form-IV, Form-24, and monthly safety audit reports, eliminating paper backlogs entirely.',
  },
  {
    icon: Layers,
    title: 'GIS Lidar & Audit Trail',
    description: 'Combines drone photogrammetry and optical character recognition (OCR) to digitize 50-year legacy mine records into an immutable compliance ledger.',
  },
  {
    icon: Truck,
    title: 'Contractor & Fleet Tracking',
    description: 'Automated RFID and ANPR gate monitoring that verifies heavy machinery fitness, driver vocational passports, and mandatory PPE compliance.',
  },
];

export default function SolutionGrid() {
  const sectionRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gridRef.current?.querySelectorAll('.solution-card');
      if (cards && cards.length > 0) {
        gsap.fromTo(
          cards,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.15,
            ease: 'power2.out',
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
      className="py-32 px-6 bg-[#0D0D0D] border-t border-[#F5A623]/20"
    >
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="max-w-2xl mb-20">
          <div className="text-xs uppercase tracking-widest text-[#F5A623] font-bold mb-3">
            The Solution
          </div>
          <h2 className="text-4xl sm:text-6xl font-headline tracking-tight uppercase leading-[0.95] text-white">
            Comprehensive <br />
            <span className="text-[#F5A623]">Platform Governance.</span>
          </h2>
          <p className="text-[#8A8A8A] text-base font-light mt-4">
            A unified operating system engineered specifically for the regulatory, environmental, and physical safety demands of Indian coal mining.
          </p>
        </div>

        {/* 3-Column Grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {solutions.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="solution-card coal-card p-8 bg-[#161616] border-l-2 border-[#F5A623] flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 bg-[#0D0D0D] border border-[#242424] flex items-center justify-center text-[#F5A623] mb-6">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-headline tracking-wide uppercase text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-[#8A8A8A] text-sm leading-relaxed font-light">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
