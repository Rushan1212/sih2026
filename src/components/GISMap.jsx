import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, ShieldCheck, Activity, Gauge } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const coalfields = [
  { id: 'dhanbad', name: 'Dhanbad (BCCL)', subsidiary: 'BCCL', x: 550, y: 310, delay: '0s', compliance: '99.4%', ch4: '0.06%', pits: 34 },
  { id: 'ranchi', name: 'Ranchi (CCL)', subsidiary: 'CCL', x: 520, y: 325, delay: '0.3s', compliance: '98.9%', ch4: '0.04%', pits: 28 },
  { id: 'asansol', name: 'Asansol (ECL)', subsidiary: 'ECL', x: 590, y: 315, delay: '0.6s', compliance: '98.7%', ch4: '0.08%', pits: 22 },
  { id: 'korba', name: 'Korba (SECL)', subsidiary: 'SECL', x: 470, y: 350, delay: '0.2s', compliance: '99.6%', ch4: '0.03%', pits: 42 },
  { id: 'bilaspur', name: 'Bilaspur (SECL)', subsidiary: 'SECL', x: 450, y: 365, delay: '0.5s', compliance: '99.1%', ch4: '0.05%', pits: 18 },
  { id: 'singrauli', name: 'Singrauli (NCL)', subsidiary: 'NCL', x: 460, y: 280, delay: '0.8s', compliance: '99.3%', ch4: '0.04%', pits: 30 },
  { id: 'talcher', name: 'Talcher (MCL)', subsidiary: 'MCL', x: 530, y: 380, delay: '0.1s', compliance: '99.7%', ch4: '0.02%', pits: 36 },
  { id: 'sambalpur', name: 'Sambalpur (MCL)', subsidiary: 'MCL', x: 505, y: 375, delay: '0.4s', compliance: '99.2%', ch4: '0.05%', pits: 20 },
  { id: 'nagpur', name: 'Nagpur (WCL)', subsidiary: 'WCL', x: 380, y: 395, delay: '0.7s', compliance: '98.5%', ch4: '0.07%', pits: 26 },
  { id: 'chandrapur', name: 'Chandrapur (WCL)', subsidiary: 'WCL', x: 395, y: 420, delay: '0.2s', compliance: '98.8%', ch4: '0.06%', pits: 16 },
  { id: 'godavari', name: 'Godavari (SCCL)', subsidiary: 'SCCL', x: 400, y: 465, delay: '0.9s', compliance: '99.5%', ch4: '0.03%', pits: 38 },
  { id: 'kothagudem', name: 'Kothagudem (SCCL)', subsidiary: 'SCCL', x: 410, y: 485, delay: '0.4s', compliance: '99.0%', ch4: '0.04%', pits: 24 },
  { id: 'neyveli', name: 'Neyveli (NLC)', subsidiary: 'NLC', x: 370, y: 580, delay: '0.6s', compliance: '99.8%', ch4: '0.01%', pits: 14 },
];

export default function GISMap() {
  const sectionRef = useRef(null);
  const mapContainerRef = useRef(null);
  const [selectedSite, setSelectedSite] = useState(coalfields[0]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        mapContainerRef.current,
        { opacity: 0, y: 40, scale: 0.98, force3D: true },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: 'power3.out',
          force3D: true,
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
      ref={sectionRef} 
      className="py-32 px-6 bg-[#0B0B0D] text-white border-t border-amber/20 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-spatial-grid opacity-20 pointer-events-none" />
      
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left Side: Text Details */}
        <div className="lg:col-span-5 space-y-6">
          <div className="text-xs uppercase tracking-widest text-[#F5A623] font-bold font-mono">
            MINE NETWORK
          </div>
          <h2 className="text-4xl sm:text-6xl font-headline tracking-tight uppercase leading-[0.95] text-white">
            542 sites. <br />
            <span className="text-[#F5A623]">One command center.</span>
          </h2>
          <p className="text-[#8A8A93] text-sm sm:text-base leading-relaxed font-light">
            Every opencast pit and underground seam in India visualized in real time. Continuous statutory reporting from field officers directly into central DGMS dashboard.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-[#141418] border border-[#26262E]">
              <div className="font-headline text-3xl text-amber">12</div>
              <div className="text-xs text-[#8A8A93] font-mono uppercase mt-1">Subsidiaries</div>
            </div>
            <div className="p-4 rounded-xl bg-[#141418] border border-[#26262E]">
              <div className="font-headline text-3xl text-emerald-400">100%</div>
              <div className="text-xs text-[#8A8A93] font-mono uppercase mt-1">Digitized Logs</div>
            </div>
          </div>

          {/* Floating Spatial Inspection Dossier for Selected Site */}
          <div className="p-4 rounded-xl glass-spatial border-amber/30 text-xs font-mono space-y-2 mt-4 shadow-glass animate-in fade-in duration-300">
            <div className="flex items-center justify-between text-amber font-bold">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                {selectedSite.name}
              </span>
              <span className="text-emerald-400">{selectedSite.compliance} DGMS SYNC</span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-coal-border/80 text-[11px] text-[#8A8A93]">
              <div>ACTIVE SEAMS: <span className="text-white font-bold">{selectedSite.pits} Pits</span></div>
              <div>METHANE CH4: <span className="text-white font-bold">{selectedSite.ch4}</span></div>
            </div>
          </div>
        </div>

        {/* Right Side: Flat SVG Map with Pulsing Dots and Connecting Lines */}
        <div 
          ref={mapContainerRef} 
          className="lg:col-span-7 glass-card-dark p-6 sm:p-10 border-l-4 border-amber relative shadow-floating rounded-2xl flex flex-col items-center will-change-transform gpu-composite"
        >
          <svg 
            viewBox="120 90 620 600" 
            className="w-full max-w-lg h-auto drop-shadow-2xl"
          >
            {/* Indian State Borders / Outline */}
            <path
              d="M 330 110 
                 C 350 115, 380 130, 400 150 
                 C 420 170, 440 190, 470 200 
                 C 500 210, 540 210, 560 220 
                 C 590 230, 620 250, 650 260 
                 C 660 270, 640 290, 620 300 
                 C 610 320, 600 340, 590 360 
                 C 580 390, 550 420, 530 450 
                 C 500 480, 470 510, 430 540 
                 C 390 580, 360 620, 350 660 
                 C 340 640, 320 600, 300 560 
                 C 280 520, 260 480, 250 440 
                 C 240 400, 220 360, 210 320 
                 C 200 290, 210 260, 230 240 
                 C 250 220, 280 200, 300 170 
                 C 310 140, 320 120, 330 110 Z"
              fill="#0D0D10"
              stroke="#2A2A34"
              strokeWidth="1.5"
            />

            {/* Coal Belt Region Polygon (Jharkhand, Odisha, Chhattisgarh, MP, WB) filled with #1C1C1E */}
            <path
              d="M 440 260 
                 L 570 270 
                 L 610 320 
                 L 550 410 
                 L 430 390 
                 L 420 310 Z"
              fill="#181820"
              stroke="#F5A623"
              strokeOpacity="0.35"
              strokeWidth="1"
            />

            {/* Thin Connecting Lines between Coalfield Sites (amber, opacity: 0.2) */}
            <g stroke="#F5A623" strokeOpacity="0.25" strokeWidth="1.2" fill="none">
              <path d="M 550 310 L 590 315 L 530 380 L 470 350 L 460 280 L 520 325 L 550 310" />
              <path d="M 470 350 L 450 365 L 380 395 L 395 420 L 400 465 L 370 580" />
              <path d="M 505 375 L 530 380" />
              <path d="M 400 465 L 410 485" />
            </g>

            {/* 13 Pulsing Amber Dots on Major Coalfields */}
            {coalfields.map((site) => {
              const isSelected = selectedSite.id === site.id;
              return (
                <g 
                  key={site.id} 
                  transform={`translate(${site.x}, ${site.y})`}
                  className="cursor-pointer group"
                  onClick={() => setSelectedSite(site)}
                >
                  <circle
                    r={isSelected ? 10 : 8}
                    fill="none"
                    stroke="#F5A623"
                    strokeWidth={isSelected ? 2 : 1.5}
                    className="pulse-dot"
                    style={{ animationDelay: site.delay }}
                  />
                  <circle
                    r={isSelected ? 4.5 : 3.5}
                    fill="#F5A623"
                  />
                  <text
                    x="10"
                    y="3"
                    fill={isSelected ? '#FFFFFF' : '#8A8A93'}
                    fontSize="10"
                    fontFamily="Space Grotesk, sans-serif"
                    fontWeight={isSelected ? '700' : '500'}
                  >
                    {site.name}
                  </text>
                </g>
              );
            })}
          </svg>

          <div className="mt-4 text-center text-xs uppercase tracking-widest text-[#8A8A93] font-mono">
            CLICK ANY COALFIELD TO INSPECT LIVE PIT TELEMETRY
          </div>
        </div>

      </div>
    </section>
  );
}
