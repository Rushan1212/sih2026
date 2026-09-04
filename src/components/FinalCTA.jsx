import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function FinalCTA({ onOpenDemo }) {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Headline and button scale from 0.9 -> 1, opacity 0 -> 1 on scroll
      gsap.fromTo(
        contentRef.current,
        { scale: 0.9, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="contact"
      ref={sectionRef} 
      className="min-h-screen bg-[#0D0D0D] text-white flex flex-col justify-center items-center py-24 px-6 border-t border-[#F5A623]/20 relative overflow-hidden text-center"
    >
      {/* Background coal texture */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20 z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='coalGrainCTA'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23coalGrainCTA)' opacity='0.5'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />

      <div 
        ref={contentRef}
        className="max-w-3xl mx-auto flex flex-col items-center relative z-10 space-y-6"
      >
        <h2 className="text-5xl sm:text-7xl md:text-8xl font-headline tracking-tight uppercase leading-[0.95] text-white">
          Ready to govern <br />
          <span className="text-[#F5A623]">every mine?</span>
        </h2>

        <p className="text-[#8A8A8A] text-base sm:text-xl font-light leading-relaxed max-w-lg">
          Request a briefing for your subsidiary.
        </p>

        <div className="pt-4">
          <button
            onClick={onOpenDemo}
            className="px-10 py-5 bg-[#F5A623] text-[#0D0D0D] font-headline text-xl sm:text-2xl uppercase tracking-wider hover:bg-[#FFA826] active:scale-95 transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(245,166,35,0.25)]"
          >
            <span>Schedule Briefing</span>
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </div>

    </section>
  );
}
