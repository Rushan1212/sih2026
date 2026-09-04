import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    step: '01',
    phase: 'FIELD',
    title: 'Mobile Inspection Capture',
    description: 'Officers open the CoalGuard mobile app. Log inspection with geo-tag, photo, timestamp. Even underground, offline. Data syncs on reconnect.',
    badge: 'SUB-METER OFFLINE EDGE',
  },
  {
    step: '02',
    phase: 'INTELLIGENCE',
    title: 'Real-Time Risk Analysis',
    description: 'AI engine receives the report. Cross-references with historical data, statutory requirements, and risk thresholds. Flags anomalies instantly.',
    badge: 'CMR 2017 NEURAL MATCH',
  },
  {
    step: '03',
    phase: 'ACTION',
    title: 'Automated Escalation & Export',
    description: 'Dashboard alerts the right person immediately. Escalation chain triggered. Corrective action assigned and tracked to closure. Report auto-generated.',
    badge: 'DGMS PORTAL SYNCHRONIZED',
  },
];

export default function HowItWorks() {
  const sectionRef = useRef(null);
  const linePathRef = useRef(null);
  const stepCardsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Draw the SVG line as user scrolls
      if (linePathRef.current) {
        const pathLength = linePathRef.current.getTotalLength?.() || 1000;
        gsap.set(linePathRef.current, {
          strokeDasharray: pathLength,
          strokeDashoffset: pathLength,
        });

        gsap.to(linePathRef.current, {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
            end: 'bottom 80%',
            scrub: 1,
          },
        });
      }

      // 2. Each step floats in from its side
      stepCardsRef.current.forEach((el, index) => {
        if (!el) return;
        const isEven = index % 2 === 0;

        gsap.fromTo(
          el,
          {
            x: isEven ? -60 : 60,
            opacity: 0,
            scale: 0.96,
          },
          {
            x: 0,
            opacity: 1,
            scale: 1,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
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
      id="how-it-works"
      ref={sectionRef} 
      className="py-32 px-6 bg-[#0B0B0D] text-white border-t border-amber/20 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-spatial-grid opacity-20 pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-amber/5 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="max-w-2xl mb-24">
          <div className="text-xs uppercase tracking-widest text-[#F5A623] font-bold mb-3 font-mono">
            PROCESS
          </div>
          <h2 className="text-4xl sm:text-6xl font-headline tracking-tight uppercase leading-[0.95] text-white">
            How It <span className="text-[#F5A623]">Works.</span>
          </h2>
          <p className="text-[#8A8A93] text-sm sm:text-base font-light mt-4">
            A continuous three-step closed loop from pit-level data capture to regulatory closure.
          </p>
        </div>

        {/* Timeline with SVG Line */}
        <div className="relative">
          
          {/* Vertical Drawing SVG Line */}
          <div className="hidden md:block absolute left-1/2 top-4 bottom-4 -translate-x-1/2 w-6 h-[calc(100%-32px)] pointer-events-none z-0">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 24 800">
              <line 
                x1="12" y1="0" x2="12" y2="800" 
                stroke="#22222A" strokeWidth="2" 
              />
              <path
                ref={linePathRef}
                d="M 12 0 L 12 800"
                fill="none"
                stroke="#F5A623"
                strokeWidth="2.5"
                filter="drop-shadow(0 0 8px rgba(245, 166, 35, 0.6))"
              />
            </svg>
          </div>

          {/* 3 Alternating Steps */}
          <div className="space-y-16 sm:space-y-24">
            {steps.map((item, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div
                  key={item.step}
                  className={`relative flex flex-col md:flex-row items-center gap-8 ${
                    isEven ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  <div
                    ref={(el) => (stepCardsRef.current[idx] = el)}
                    className="w-full md:w-[calc(50%-40px)] glass-card-dark p-8 sm:p-10 border-l-4 border-amber rounded-2xl relative overflow-hidden shadow-floating group"
                  >
                    {/* Bebas Neue watermark behind text with opacity: 0.06 */}
                    <span 
                      className="absolute -bottom-6 -right-2 font-headline text-[130px] sm:text-[160px] text-amber select-none pointer-events-none leading-none z-0"
                      style={{ opacity: 0.06 }}
                    >
                      {item.step}
                    </span>

                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-headline text-amber tracking-widest">
                          STEP {item.step} // {item.phase}
                        </span>
                        <span className="text-[9px] font-mono text-[#8A8A93] px-2 py-0.5 rounded bg-[#101014] border border-[#26262E]">
                          {item.badge}
                        </span>
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-headline uppercase text-white tracking-wide mb-3 group-hover:text-amber transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-[#8A8A93] text-sm leading-relaxed font-light">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Center Node Indicator with subtle glowing ring */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-9 h-9 rounded-lg bg-[#0B0B0D] border-2 border-amber items-center justify-center text-xs font-headline text-amber z-10 shadow-[0_0_15px_rgba(245,166,35,0.4)]">
                    {item.step}
                  </div>

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
