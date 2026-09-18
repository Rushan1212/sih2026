import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  MapPin, 
  Radio, 
  Activity, 
  Gauge, 
  ShieldCheck, 
  AlertTriangle, 
  Layers, 
  Crosshair,
  Compass,
  Maximize2,
  CheckCircle2
} from 'lucide-react';
import { soundManager } from '../utils/sound';

gsap.registerPlugin(ScrollTrigger);

const mineSites = [
  {
    id: 'jharia',
    name: 'Jharia Coalfield (Moonidih & Lodna)',
    subsidiary: 'BCCL',
    location: 'Dhanbad, Jharkhand',
    coordinates: '23.7420° N, 86.4172° E',
    type: 'Deep Underground & Opencast',
    status: 'ACTIVE_MONITORING',
    compliance: '99.1%',
    methane: '0.06% Vol (Safe)',
    slopeStability: '99.8%',
    activeInspections: 18,
    svgPos: { x: 550, y: 310 }, // Relative position on India SVG viewBox
    severity: 'nominal',
  },
  {
    id: 'raniganj',
    name: 'Raniganj Coalfield (Kenda Area)',
    subsidiary: 'ECL',
    location: 'Asansol, West Bengal',
    coordinates: '23.6210° N, 87.1240° E',
    type: 'Historic Seam & Deep Pit',
    status: 'ACTIVE_MONITORING',
    compliance: '98.7%',
    methane: '0.08% Vol (Safe)',
    slopeStability: '99.5%',
    activeInspections: 14,
    svgPos: { x: 590, y: 320 },
    severity: 'nominal',
  },
  {
    id: 'korba',
    name: 'Korba Super Pit (Gevra & Dipka)',
    subsidiary: 'SECL',
    location: 'Korba, Chhattisgarh',
    coordinates: '22.3595° N, 82.7501° E',
    type: 'Mega Opencast Pit (Asia Largest)',
    status: 'HIGH_PRODUCTION',
    compliance: '99.4%',
    methane: '0.04% Vol (Safe)',
    slopeStability: '99.9%',
    activeInspections: 32,
    svgPos: { x: 470, y: 350 },
    severity: 'nominal',
  },
  {
    id: 'singrauli',
    name: 'Singrauli Coalfield (Jayant & Nigahi)',
    subsidiary: 'NCL',
    location: 'Singrauli, MP & UP Border',
    coordinates: '24.1997° N, 82.6644° E',
    type: 'Continuous Heavy Opencast',
    status: 'ACTIVE_MONITORING',
    compliance: '98.9%',
    methane: '0.05% Vol (Safe)',
    slopeStability: '99.7%',
    activeInspections: 22,
    svgPos: { x: 460, y: 280 },
    severity: 'nominal',
  },
  {
    id: 'talcher',
    name: 'Talcher Basin (Bhubaneswari & Ananta)',
    subsidiary: 'MCL',
    location: 'Angul, Odisha',
    coordinates: '20.9509° N, 85.2166° E',
    type: 'High-Volume Opencast',
    status: 'OPTIMAL_CADENCE',
    compliance: '99.6%',
    methane: '0.03% Vol (Safe)',
    slopeStability: '99.8%',
    activeInspections: 26,
    svgPos: { x: 530, y: 380 },
    severity: 'nominal',
  },
  {
    id: 'wardha',
    name: 'Wardha Valley (Chandrapur Area)',
    subsidiary: 'WCL',
    location: 'Chandrapur, Maharashtra',
    coordinates: '19.9615° N, 79.2961° E',
    type: 'Underground & Opencast Benches',
    status: 'ACTIVE_MONITORING',
    compliance: '98.4%',
    methane: '0.07% Vol (Safe)',
    slopeStability: '99.4%',
    activeInspections: 12,
    svgPos: { x: 380, y: 400 },
    severity: 'nominal',
  },
  {
    id: 'singareni',
    name: 'Godavari Valley (Kothagudem & Ramagundam)',
    subsidiary: 'SCCL',
    location: 'Bhadradri Kothagudem, Telangana',
    coordinates: '17.5540° N, 80.6174° E',
    type: 'Hybrid Continuous Longwall',
    status: 'ACTIVE_MONITORING',
    compliance: '99.2%',
    methane: '0.05% Vol (Safe)',
    slopeStability: '99.6%',
    activeInspections: 19,
    svgPos: { x: 390, y: 460 },
    severity: 'nominal',
  },
  {
    id: 'neyveli',
    name: 'Neyveli Lignite Basins (Mine I & II)',
    subsidiary: 'NLC',
    location: 'Cuddalore, Tamil Nadu',
    coordinates: '11.5996° N, 79.4862° E',
    type: 'Specialized Surface Lignite',
    status: 'OPTIMAL_CADENCE',
    compliance: '99.5%',
    methane: '0.02% Vol (Safe)',
    slopeStability: '99.9%',
    activeInspections: 15,
    svgPos: { x: 370, y: 580 },
    severity: 'nominal',
  },
];

const subsidiariesList = ['ALL', 'BCCL', 'ECL', 'SECL', 'NCL', 'MCL', 'WCL', 'SCCL', 'NLC'];

export default function GISMapPreview() {
  const sectionRef = useRef(null);
  const mapSvgRef = useRef(null);
  const [selectedSite, setSelectedSite] = useState(mineSites[0]);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [hoveredSite, setHoveredSite] = useState(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Map and lines entrance animation
      const paths = mapSvgRef.current?.querySelectorAll('.telemetry-line');
      const dots = mapSvgRef.current?.querySelectorAll('.mine-dot');

      if (paths && dots) {
        gsap.fromTo(
          paths,
          { strokeDashoffset: 1000, opacity: 0, force3D: true },
          {
            strokeDashoffset: 0,
            opacity: 0.8,
            duration: 1.8,
            ease: 'power2.inOut',
            force3D: true,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
            },
          }
        );

        gsap.fromTo(
          dots,
          { scale: 0, opacity: 0, force3D: true },
          {
            scale: 1,
            opacity: 1,
            duration: 0.6,
            stagger: 0.08,
            ease: 'back.out(2)',
            force3D: true,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const filteredSites = activeFilter === 'ALL'
    ? mineSites
    : mineSites.filter((s) => s.subsidiary === activeFilter);

  const displayedSite = hoveredSite || selectedSite;

  return (
    <section 
      id="gis-map"
      ref={sectionRef} 
      className="relative bg-coal-950 text-white py-24 px-4 sm:px-6 lg:px-8 border-t border-coal-800 overflow-hidden"
    >
      {/* Background Grid & Radar Sweep */}
      <div className="absolute inset-0 bg-radar-grid opacity-20 pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/3 w-[600px] h-[600px] bg-amber/5 blur-[160px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-coal-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-coal-900 border border-amber/30 text-amber font-mono text-xs uppercase tracking-wider mb-4">
              <Compass className="w-3.5 h-3.5 text-amber animate-spin-slow" />
              <span>National Geospatial Command</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-display font-extrabold uppercase tracking-tight">
              Monitor Every Site Across India from <span className="text-amber text-glow-amber">One Command Center.</span>
            </h2>
          </div>
          
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-coal-900/80 px-4 py-2 rounded-xl border border-coal-700">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>8 MAJOR COAL BASINS LINKED VIA SATELLITE MESH</span>
          </div>
        </div>

        {/* Subsidiary Filter Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 text-xs font-mono scrollbar-none">
          <span className="text-coal-400 mr-2 flex items-center gap-1 font-bold">
            <Crosshair className="w-3.5 h-3.5 text-amber" /> FILTER:
          </span>
          {subsidiariesList.map((sub) => (
            <button
              key={sub}
              onClick={() => {
                soundManager.playClick();
                setActiveFilter(sub);
              }}
              className={`px-3 py-1.5 rounded-lg transition-all uppercase tracking-wider whitespace-nowrap ${
                activeFilter === sub
                  ? 'bg-amber text-coal-950 font-bold shadow-[0_0_15px_rgba(245,166,35,0.4)]'
                  : 'bg-coal-900/80 border border-coal-800 text-coal-300 hover:text-white hover:border-amber/40'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>

        {/* Main Interactive War Room Map Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Vector Map (7 cols) */}
          <div className="lg:col-span-7 glass-panel rounded-2xl p-4 sm:p-6 border border-coal-700/80 relative overflow-hidden shadow-2xl">
            {/* Top HUD bar inside map card */}
            <div className="flex items-center justify-between pb-4 border-b border-coal-800 text-xs font-mono text-coal-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber animate-pulse"></span>
                <span className="text-white font-bold">INDIA COALFIELDS GEOSPATIAL RADAR</span>
              </div>
              <span>PROJECTION: EPSG:4326 // WGS 84</span>
            </div>

            {/* India Map SVG Container */}
            <div className="relative w-full h-[460px] sm:h-[520px] flex items-center justify-center my-2">
              
              <svg 
                ref={mapSvgRef}
                viewBox="100 80 650 620" 
                className="w-full h-full max-h-[500px] drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]"
              >
                <defs>
                  {/* Glowing Radar Sweep Linear Gradient */}
                  <linearGradient id="laserGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F5A623" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#FFD60A" stopOpacity="0.2" />
                  </linearGradient>

                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>

                {/* India Stylized Tactical Border Silhouette */}
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
                  fill="#111116"
                  stroke="#2E2E38"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  className="transition-all"
                />

                {/* Secondary Tactical Elevation Ribbons */}
                <path
                  d="M 440 260 Q 520 290 580 320 T 520 420 Q 420 440 370 410"
                  fill="none"
                  stroke="rgba(245, 166, 35, 0.15)"
                  strokeWidth="1.5"
                />
                <path
                  d="M 460 300 Q 540 340 540 400 T 400 470"
                  fill="none"
                  stroke="rgba(255, 214, 10, 0.12)"
                  strokeWidth="1.5"
                />

                {/* Telemetry Interconnecting Laser Splines */}
                <path
                  className="telemetry-line"
                  d="M 550 310 L 590 320 L 530 380 L 470 350 L 460 280 L 550 310 Z"
                  fill="none"
                  stroke="url(#laserGrad)"
                  strokeWidth="1.8"
                  strokeDasharray="6 3"
                  filter="url(#glow)"
                />
                <path
                  className="telemetry-line"
                  d="M 470 350 L 380 400 L 390 460 L 370 580"
                  fill="none"
                  stroke="url(#laserGrad)"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />

                {/* Pulsing Mine Site Nodes */}
                {filteredSites.map((site) => {
                  const isSelected = displayedSite?.id === site.id;
                  return (
                    <g
                      key={site.id}
                      className="mine-dot cursor-pointer group"
                      transform={`translate(${site.svgPos.x}, ${site.svgPos.y})`}
                      onClick={() => {
                        soundManager.playClick();
                        setSelectedSite(site);
                      }}
                      onMouseEnter={() => {
                        soundManager.playHover();
                        setHoveredSite(site);
                      }}
                      onMouseLeave={() => setHoveredSite(null)}
                    >
                      {/* Outer Radar Ripple Ring */}
                      <circle
                        r={isSelected ? 16 : 10}
                        fill="none"
                        stroke="#F5A623"
                        strokeWidth="1.5"
                        className="animate-ping opacity-60 origin-center"
                      />

                      {/* Middle Halo */}
                      <circle
                        r={isSelected ? 9 : 6}
                        fill={isSelected ? '#F5A623' : '#FFD60A'}
                        opacity={isSelected ? 0.9 : 0.7}
                        filter="url(#glow)"
                      />

                      {/* Center Point */}
                      <circle
                        r={isSelected ? 4 : 2.5}
                        fill="#0A0A0C"
                      />

                      {/* Site Callout Label on Hover/Select */}
                      <text
                        x="14"
                        y="4"
                        fill={isSelected ? '#FFFFFF' : '#9B9BAA'}
                        fontSize={isSelected ? '12' : '10'}
                        fontFamily="JetBrains Mono, monospace"
                        fontWeight={isSelected ? 'bold' : 'normal'}
                        className="select-none pointer-events-none drop-shadow"
                      >
                        {site.subsidiary} ({site.name.split(' ')[0]})
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Floating Coordinates overlay */}
              <div className="absolute bottom-3 left-3 bg-coal-900/90 border border-coal-800 px-3 py-1.5 rounded text-[10px] font-mono text-coal-400 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>GEO-FENCE: ACTIVE // SATELLITE LOCK: 12 BANDS</span>
              </div>
            </div>

            {/* Hint bar */}
            <div className="text-center pt-2 text-[11px] font-mono text-coal-400 border-t border-coal-800">
              Click or hover on any mine cluster to inspect live statutory telemetry & gas metrics.
            </div>
          </div>

          {/* Right Column: Live Pit Telemetry Dossier (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="glass-card rounded-2xl p-6 sm:p-7 border border-amber/40 shadow-2xl relative">
              {/* Card Header */}
              <div className="flex items-start justify-between pb-4 border-b border-coal-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber text-coal-950">
                      {displayedSite.subsidiary}
                    </span>
                    <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      {displayedSite.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-display font-bold text-white mt-2">
                    {displayedSite.name}
                  </h3>
                  <p className="text-xs font-mono text-coal-400 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-amber" />
                    {displayedSite.location}
                  </p>
                </div>
              </div>

              {/* Key Coordinates & Seam Type */}
              <div className="grid grid-cols-2 gap-3 py-4 border-b border-coal-800 text-xs font-mono">
                <div className="bg-coal-900/80 p-2.5 rounded-lg border border-coal-800">
                  <div className="text-coal-400 text-[10px]">SEAM TOPOLOGY</div>
                  <div className="text-white font-semibold mt-0.5">{displayedSite.type}</div>
                </div>
                <div className="bg-coal-900/80 p-2.5 rounded-lg border border-coal-800">
                  <div className="text-coal-400 text-[10px]">GPS COORDINATES</div>
                  <div className="text-amber font-semibold mt-0.5 text-[11px]">{displayedSite.coordinates}</div>
                </div>
              </div>

              {/* Live Sensor Metrics Grid */}
              <div className="space-y-3 py-4 border-b border-coal-800">
                <div className="text-xs font-mono text-coal-400 uppercase tracking-wider flex items-center justify-between">
                  <span>LIVE DGMS TELEMETRY STREAM</span>
                  <span className="text-amber">2.4s REFRESH</span>
                </div>

                {/* Metric 1: Compliance */}
                <div className="flex items-center justify-between text-xs font-mono bg-coal-900/60 p-2.5 rounded-lg border border-coal-800">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="text-coal-300">Statutory Compliance</span>
                  </div>
                  <span className="text-emerald-400 font-bold text-sm">{displayedSite.compliance}</span>
                </div>

                {/* Metric 2: Methane Gas */}
                <div className="flex items-center justify-between text-xs font-mono bg-coal-900/60 p-2.5 rounded-lg border border-coal-800">
                  <div className="flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-amber" />
                    <span className="text-coal-300">Methane (CH4) Index</span>
                  </div>
                  <span className="text-white font-bold text-sm">{displayedSite.methane}</span>
                </div>

                {/* Metric 3: Slope Stability */}
                <div className="flex items-center justify-between text-xs font-mono bg-coal-900/60 p-2.5 rounded-lg border border-coal-800">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-safety-yellow" />
                    <span className="text-coal-300">Bench Slope Stability</span>
                  </div>
                  <span className="text-safety-yellow font-bold text-sm">{displayedSite.slopeStability}</span>
                </div>
              </div>

              {/* Active Shifts and Status */}
              <div className="pt-4 flex items-center justify-between text-xs font-mono text-coal-400">
                <div>
                  <span>ACTIVE SHIFT AUDITORS: </span>
                  <span className="text-white font-bold">{displayedSite.activeInspections} In Pit</span>
                </div>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  NO VIOLATIONS
                </span>
              </div>

              {/* Reticle */}
              <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-amber"></div>
              <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-amber"></div>
            </div>

            {/* Quick Summary Pill */}
            <div className="p-4 rounded-xl bg-coal-900/80 border border-coal-800 text-xs font-mono text-coal-300 flex items-center justify-between">
              <span className="text-coal-400">DGMS NATIONAL CLEARANCE:</span>
              <span className="text-amber font-bold">100% GREEN // CMR 2017 VALIDATED</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
