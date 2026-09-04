import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Layers, 
  FileText, 
  EyeOff, 
  Flame, 
  Clock,
  AlertTriangle
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const cardsData = [
  {
    number: '01',
    title: 'Fragmented Systems',
    description: '100+ mine sites across 12 subsidiaries operate in complete operational silos with zero unified executive oversight.',
    icon: Layers,
    hazardTag: '14 DISCONNECTED ERPS',
  },
  {
    number: '02',
    title: 'Paper-Based Compliance',
    description: 'Statutory Form-IV and Form-24 registers filed on physical logbooks cause weeks of critical reporting delays to DGMS.',
    icon: FileText,
    hazardTag: '45-DAY AUDIT BACKLOG',
  },
  {
    number: '03',
    title: 'No Real-Time Visibility',
    description: 'Hazardous field incidents, ventilation shifts, and pit disruptions are reported days after they occur without live verification.',
    icon: EyeOff,
    hazardTag: '82% BLIND FIELD SHIFTS',
  },
  {
    number: '04',
    title: 'Undetected Violations',
    description: 'Recurring safety failures and micro-slips in overburden bench slopes go unnoticed until catastrophic stop-work orders.',
    icon: Flame,
    hazardTag: '340+ UNREPORTED SURGES',
  },
  {
    number: '05',
    title: 'Regulatory Lag',
    description: 'DGMS monthly safety and compliance reports take 3 to 4 weeks to compile manually, incurring heavy compliance fines.',
    icon: Clock,
    hazardTag: '180+ MAN-HOURS WASTED',
  },
];

export default function ProblemPinned() {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = cardsRef.current.filter(Boolean);
      if (cards.length === 0) return;

      // Initial card states in 3D spatial space
      gsap.set(cards, { xPercent: 100, opacity: 0, rotateY: 15, scale: 0.95 });
      gsap.set(cards[0], { xPercent: 0, opacity: 1, rotateY: 0, scale: 1 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: `+=${cards.length * 850}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      cards.forEach((card, i) => {
        if (i === 0) return;

        // Slide out previous card to left with 3D rotation
        tl.to(cards[i - 1], {
          xPercent: -100,
          opacity: 0,
          rotateY: -15,
          scale: 0.95,
          duration: 0.8,
          ease: "power2.inOut"
        }, `step-${i}`)
        // Slide in current card from right
        .fromTo(card, 
          { xPercent: 100, opacity: 0, rotateY: 15, scale: 0.95 },
          { xPercent: 0, opacity: 1, rotateY: 0, scale: 1, duration: 0.8, ease: "power2.inOut" },
          `step-${i}`
        );
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="problem"
      ref={sectionRef} 
      className="h-screen w-full bg-[#0B0B0D] text-white flex items-center justify-center px-6 sm:px-12 border-t border-amber/20 relative overflow-hidden"
    >
      {/* Subtle spatial background lines */}
      <div className="absolute inset-0 bg-spatial-grid opacity-30 pointer-events-none" />
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-danger/5 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center h-full py-12 relative z-10">
        
        {/* Left Side (40%): Static, never changes */}
        <div className="lg:col-span-5 flex flex-col justify-center space-y-6 lg:border-r lg:border-amber/20 lg:pr-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-danger/10 border border-danger/30 text-danger text-xs uppercase tracking-widest font-mono font-bold w-max">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>THE CRISIS</span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-headline tracking-tight uppercase leading-[0.95] text-white">
            India's mines <br />
            run on paper. <br />
            <span className="text-[#F5A623]">That's the problem.</span>
          </h2>
          <p className="text-[#8A8A93] text-sm leading-relaxed max-w-sm font-light">
            Siloed paper registers create dangerous blindspots between pit overmen, subsidiary management, and central regulators.
          </p>

          <div className="p-4 rounded-xl bg-[#141418] border border-[#26262E] text-xs font-mono text-[#8A8A93] space-y-2 max-w-sm">
            <div className="flex items-center justify-between">
              <span>UNIFIED DGMS MESH</span>
              <span className="text-danger font-bold">DISCONNECTED</span>
            </div>
            <div className="w-full bg-[#22222A] h-1.5 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-amber to-danger h-full w-[88%]"></div>
            </div>
          </div>
        </div>

        {/* Right Side (60%): 5 Swapping Spatial Glass Cards */}
        <div className="lg:col-span-7 relative h-[380px] sm:h-[340px] flex items-center justify-center perspective-1200 overflow-hidden">
          {cardsData.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={card.number}
                ref={(el) => (cardsRef.current[idx] = el)}
                className="absolute inset-0 w-full h-full glass-card-dark p-8 sm:p-10 border-l-4 border-amber flex flex-col justify-between shadow-floating rounded-xl"
              >
                {/* Top: Icon + Number + Tag */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#101014] border border-[#26262E] flex items-center justify-center text-amber shadow-md">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded bg-amber/10 border border-amber/20 text-amber font-bold">
                      {card.hazardTag}
                    </span>
                  </div>
                  <span className="font-headline text-4xl sm:text-5xl text-amber tracking-wider leading-none">
                    {card.number}
                  </span>
                </div>

                {/* Center: Title + 2-Line Description */}
                <div className="my-auto space-y-3">
                  <h3 className="text-2xl sm:text-3xl font-headline tracking-wide uppercase text-white">
                    {card.title}
                  </h3>
                  <p className="text-[#8A8A93] text-sm sm:text-base leading-relaxed font-light">
                    {card.description}
                  </p>
                </div>

                {/* Bottom Tag */}
                <div className="flex items-center justify-between text-xs uppercase tracking-widest text-amber font-mono pt-3 border-t border-[#22222A]">
                  <span>GOVERNANCE VECTOR 0{idx + 1}</span>
                  <span className="text-[#8A8A93]">SCROLL FOR NEXT</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
