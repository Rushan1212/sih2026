import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Metrics() {
  const sectionRef = useRef(null);
  const num1Ref = useRef(null);
  const num2Ref = useRef(null);
  const num3Ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Metric 1: 542+
      const counter1 = { val: 0 };
      gsap.to(counter1, {
        val: 542,
        duration: 2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
          once: true,
        },
        onUpdate: () => {
          if (num1Ref.current) num1Ref.current.innerText = Math.round(counter1.val).toString();
        }
      });

      // Metric 2: 98.2%
      const counter2 = { val: 0 };
      gsap.to(counter2, {
        val: 98.2,
        duration: 2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
          once: true,
        },
        onUpdate: () => {
          if (num2Ref.current) num2Ref.current.innerText = counter2.val.toFixed(1);
        }
      });

      // Metric 3: 60%
      const counter3 = { val: 0 };
      gsap.to(counter3, {
        val: 60,
        duration: 2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
          once: true,
        },
        onUpdate: () => {
          if (num3Ref.current) num3Ref.current.innerText = Math.round(counter3.val).toString();
        }
      });

      // Section cards entrance animation
      gsap.from(".metric-card", {
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: "power3.out",
        force3D: true,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        }
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="metrics" 
      ref={sectionRef} 
      className="min-h-screen w-full bg-[#0B0B0D] text-white flex items-center justify-center px-6 sm:px-12 border-t border-amber/20 relative overflow-hidden py-24"
    >
      {/* Background Ambience */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] opacity-20 pointer-events-none rounded-full blur-[160px]"
        style={{
          background: 'radial-gradient(circle, #F5A623 0%, rgba(245, 166, 35, 0.1) 60%, transparent 100%)',
        }}
      />
      <div className="absolute inset-0 bg-spatial-grid opacity-20 pointer-events-none" />

      <div className="max-w-5xl mx-auto w-full relative z-10">
        
        {/* 2x2 Grid of 4 Massive Spatial Numbers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 text-center md:text-left">
          
          {/* Stat 1: 542+ */}
          <div className="metric-card glass-card-dark p-8 sm:p-10 rounded-2xl border-l-4 border-amber shadow-antigravity group will-change-transform gpu-composite">
            <div className="font-headline text-7xl sm:text-8xl lg:text-[120px] font-bold text-amber tracking-tight leading-none group-hover:scale-105 transition-transform duration-300 origin-left">
              <span ref={num1Ref}>0</span>+
            </div>
            <div className="font-sans text-sm text-[#8A8A93] uppercase tracking-wider font-medium pt-3 group-hover:text-white transition-colors">
              Mine Sites Ready for Integration
            </div>
          </div>

          {/* Stat 2: 98.2% */}
          <div className="metric-card glass-card-dark p-8 sm:p-10 rounded-2xl border-l-4 border-amber shadow-antigravity group will-change-transform gpu-composite">
            <div className="font-headline text-7xl sm:text-8xl lg:text-[120px] font-bold text-amber tracking-tight leading-none group-hover:scale-105 transition-transform duration-300 origin-left">
              <span ref={num2Ref}>0.0</span>%
            </div>
            <div className="font-sans text-sm text-[#8A8A93] uppercase tracking-wider font-medium pt-3 group-hover:text-white transition-colors">
              Compliance Rate Achieved
            </div>
          </div>

          {/* Stat 3: 60% */}
          <div className="metric-card glass-card-dark p-8 sm:p-10 rounded-2xl border-l-4 border-amber shadow-antigravity group will-change-transform gpu-composite">
            <div className="font-headline text-7xl sm:text-8xl lg:text-[120px] font-bold text-amber tracking-tight leading-none group-hover:scale-105 transition-transform duration-300 origin-left">
              <span ref={num3Ref}>0</span>%
            </div>
            <div className="font-sans text-sm text-[#8A8A93] uppercase tracking-wider font-medium pt-3 group-hover:text-white transition-colors">
              Reduction in Incident Reporting Lag
            </div>
          </div>

          {/* Stat 4: < 2hrs */}
          <div className="metric-card glass-card-dark p-8 sm:p-10 rounded-2xl border-l-4 border-amber shadow-antigravity group will-change-transform gpu-composite">
            <div className="font-headline text-7xl sm:text-8xl lg:text-[120px] font-bold text-amber tracking-tight leading-none group-hover:scale-105 transition-transform duration-300 origin-left">
              &lt; 2hrs
            </div>
            <div className="font-sans text-sm text-[#8A8A8A] uppercase tracking-wider font-medium pt-3 group-hover:text-white transition-colors">
              Average Report Generation Time
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
