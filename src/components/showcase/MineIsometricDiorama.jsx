import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { FileText, CheckCircle2, Video, AlertTriangle, Cpu, ArrowUpRight } from 'lucide-react';
import { useShowcaseStore } from '../../store/useShowcaseStore';

export default function MineIsometricDiorama({ onNodeSelect }) {
  const pointer = useShowcaseStore((s) => s.pointer);
  const prefersReducedMotion = useShowcaseStore((s) => s.prefersReducedMotion);

  // Parallax offsets for floating panels based on pointer position
  const pFactor = prefersReducedMotion ? 0 : 1;
  const p1 = { x: pointer.x * 14 * pFactor, y: pointer.y * -10 * pFactor };
  const p2 = { x: pointer.x * -18 * pFactor, y: pointer.y * -14 * pFactor };
  const p3 = { x: pointer.x * 12 * pFactor, y: pointer.y * 16 * pFactor };
  const p4 = { x: pointer.x * -15 * pFactor, y: pointer.y * 12 * pFactor };

  return (
    <div className="relative w-full h-full min-h-[580px] lg:min-h-[720px] flex items-center justify-center select-none overflow-visible">
      {/* 01: Ambient Hex-Grid Ground Plane */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, rgba(245, 165, 36, 0.08) 0%, transparent 70%), 
            repeating-linear-gradient(60deg, rgba(36, 39, 45, 0.4) 0px, rgba(36, 39, 45, 0.4) 1px, transparent 1px, transparent 40px),
            repeating-linear-gradient(120deg, rgba(36, 39, 45, 0.4) 0px, rgba(36, 39, 45, 0.4) 1px, transparent 1px, transparent 40px)`,
          backgroundSize: '100% 100%, 46px 80px, 46px 80px',
        }}
      />

      {/* Center SVG Isometric Mine Diorama Graphic (Faceted rock, cut benches, conveyor, pithead, trucks) */}
      <div className="relative w-[520px] sm:w-[640px] lg:w-[740px] aspect-[16/11] flex items-center justify-center">
        <svg
          viewBox="0 0 800 560"
          className="w-full h-full drop-shadow-[0_25px_60px_rgba(0,0,0,0.95)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Strata rock gradients */}
            <linearGradient id="benchTop" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1e2229" />
              <stop offset="100%" stopColor="#101215" />
            </linearGradient>
            <linearGradient id="benchFace" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#121418" />
              <stop offset="100%" stopColor="#070809" />
            </linearGradient>
            <linearGradient id="deepPit" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0a0b0d" />
              <stop offset="100%" stopColor="#030304" />
            </linearGradient>
            <linearGradient id="amberWindowGlow" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f5a524" />
              <stop offset="100%" stopColor="#ffd08a" />
            </linearGradient>
            <linearGradient id="laserBeam" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#f5a524" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#f5a524" stopOpacity="0" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Hex ground rim highlight */}
          <polygon
            points="400,60 680,190 680,410 400,540 120,410 120,190"
            fill="#090a0d"
            stroke="#24272d"
            strokeWidth="1.5"
            strokeDasharray="6 6"
          />

          {/* Faceted Open-Pit Benches (Spiraling down into the coal seam) */}
          {/* Level 0: Outer pit rim */}
          <polygon
            points="400,90 650,205 650,380 400,490 150,380 150,205"
            fill="url(#benchTop)"
            stroke="#2e343d"
            strokeWidth="1.2"
          />
          {/* Level 0 Wall */}
          <polygon
            points="150,205 400,90 400,120 150,235"
            fill="#14171d"
          />
          <polygon
            points="400,90 650,205 650,235 400,120"
            fill="#0e1014"
          />

          {/* Level 1 Cut Bench */}
          <polygon
            points="400,130 610,225 610,360 400,455 190,360 190,225"
            fill="url(#benchFace)"
            stroke="#24272d"
            strokeWidth="1"
          />
          {/* Contour Glow Rule */}
          <path
            d="M 190,225 L 400,130 L 610,225"
            stroke="#f5a524"
            strokeWidth="1.2"
            strokeOpacity="0.45"
          />

          {/* Level 2 Cut Bench & Haul Road Spiral */}
          <polygon
            points="400,170 570,245 570,340 400,420 230,340 230,245"
            fill="url(#benchTop)"
            stroke="#1c1f24"
            strokeWidth="1"
          />
          {/* Active Haul Road track (1-in-16 gradient) */}
          <path
            d="M 230,245 C 310,220 490,230 570,280 C 570,320 450,390 350,390 C 270,390 260,330 330,300"
            stroke="#3a404a"
            strokeWidth="8"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 230,245 C 310,220 490,230 570,280 C 570,320 450,390 350,390 C 270,390 260,330 330,300"
            stroke="#f5a524"
            strokeWidth="1.2"
            strokeDasharray="4 8"
            strokeOpacity="0.7"
            fill="none"
          />

          {/* Level 3 Deep Extraction Sump / Pit Floor */}
          <polygon
            points="400,210 520,265 520,320 400,380 280,320 280,265"
            fill="url(#deepPit)"
            stroke="#f5a524"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />

          {/* Surface Conveyor Belt leading from Pit to Processing */}
          <line x1="330" y1="310" x2="220" y2="150" stroke="#16181c" strokeWidth="9" strokeLinecap="square" />
          <line x1="330" y1="310" x2="220" y2="150" stroke="#f5a524" strokeWidth="2" strokeDasharray="3 4" strokeOpacity="0.8" />
          {/* Conveyor Support Gantries */}
          <line x1="280" y1="230" x2="280" y2="270" stroke="#4a525d" strokeWidth="2" />
          <line x1="240" y1="180" x2="240" y2="220" stroke="#4a525d" strokeWidth="2" />

          {/* Pithead Processing Building with Warm Lit Windows */}
          <g transform="translate(180, 110)">
            {/* Base structure */}
            <polygon points="40,25 90,0 90,45 40,70" fill="#1b1e24" stroke="#2e343d" strokeWidth="1" />
            <polygon points="0,0 40,25 40,70 0,45" fill="#252a33" stroke="#2e343d" strokeWidth="1" />
            <polygon points="0,0 50,-25 90,0 40,25" fill="#323844" stroke="#404756" strokeWidth="1" />
            {/* Warm Lit Amber Windows */}
            <rect x="8" y="16" width="10" height="7" rx="1" fill="url(#amberWindowGlow)" filter="url(#glow)" />
            <rect x="22" y="24" width="10" height="7" rx="1" fill="url(#amberWindowGlow)" filter="url(#glow)" />
            <rect x="52" y="32" width="12" height="8" rx="1" fill="url(#amberWindowGlow)" filter="url(#glow)" opacity="0.9" />
            {/* Radio / DGMS Antenna Mast */}
            <line x1="50" y1="-25" x2="50" y2="-55" stroke="#8b9099" strokeWidth="1.5" />
            <circle cx="50" cy="-55" r="2.5" fill="#f5a524" filter="url(#glow)" className="animate-pulse" />
          </g>

          {/* Miniature Mining Excavator on Level 1 Bench */}
          <g transform="translate(480, 240)">
            {/* Tracks */}
            <rect x="0" y="8" width="24" height="6" rx="2" fill="#121316" stroke="#f5a524" strokeWidth="0.8" />
            {/* Cab */}
            <polygon points="6,8 20,4 22,0 6,0" fill="#f5a524" />
            {/* Boom & Dipper */}
            <path d="M 18,2 L 34,-12 L 40,-2" stroke="#f5a524" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            {/* Bucket */}
            <polygon points="40,-2 46,-4 44,4 38,4" fill="#edeef0" />
          </g>

          {/* Miniature Haul Truck (CAT 777D Dumper) on Haul Road */}
          <g transform="translate(360, 355)">
            {/* Chassis & Wheels */}
            <circle cx="6" cy="10" r="3.5" fill="#070708" stroke="#f5a524" strokeWidth="1" />
            <circle cx="22" cy="10" r="3.5" fill="#070708" stroke="#f5a524" strokeWidth="1" />
            {/* Dump Body (Tilted back) */}
            <polygon points="0,4 20,4 24,-2 4,-2" fill="#f5a524" />
            {/* Cab with Headlights */}
            <polygon points="20,4 26,4 26,0 22,-2" fill="#edeef0" />
            <line x1="26" y1="3" x2="38" y2="7" stroke="url(#laserBeam)" strokeWidth="3" />
          </g>

          {/* Central Seam Telemetry Scanner Pulse Ring */}
          <g transform="translate(400, 300)">
            <ellipse cx="0" cy="0" rx="45" ry="22" stroke="#f5a524" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.6" className="animate-spin" style={{ animationDuration: '18s' }} />
            <circle cx="0" cy="0" r="3.5" fill="#f5a524" filter="url(#glow)" />
          </g>

          {/* 03: Animated SVG Dashed Connector Lines to the 4 Floating Panels */}
          {/* Line 1: Pithead to Panel 1 (Geological Reports - Top Right) */}
          <path
            d="M 270,120 C 360,80 520,70 640,95"
            stroke="#f5a524"
            strokeWidth="1.2"
            strokeDasharray="4 4"
            className="opacity-75"
            fill="none"
          />
          <circle cx="640" cy="95" r="3" fill="#f5a524" />

          {/* Line 2: Cut Bench 2 to Panel 2 (Inspection Log - Mid Right) */}
          <path
            d="M 520,265 C 570,270 610,250 670,250"
            stroke="#2fbf71"
            strokeWidth="1.2"
            strokeDasharray="4 4"
            className="opacity-75"
            fill="none"
          />
          <circle cx="670" cy="250" r="3" fill="#2fbf71" />

          {/* Line 3: Haul Truck to Panel 3 (CCTV Feed - Bottom Left) */}
          <path
            d="M 360,365 C 280,390 190,390 120,400"
            stroke="#38bdf8"
            strokeWidth="1.2"
            strokeDasharray="4 4"
            className="opacity-75"
            fill="none"
          />
          <circle cx="120" cy="400" r="3" fill="#38bdf8" />

          {/* Line 4: Deep Pit Sump to Panel 4 (Compliance Checklist - Bottom Right) */}
          <path
            d="M 430,370 C 490,410 560,430 630,440"
            stroke="#f5a524"
            strokeWidth="1.2"
            strokeDasharray="4 4"
            className="opacity-75"
            fill="none"
          />
          <circle cx="630" cy="440" r="3" fill="#f5a524" />
        </svg>
      </div>

      {/* 04: FLOATING TELEMETRY PANELS (Drift on pointer parallax, animate in on load) */}
      {/* Panel 1: Geological reports (Top Right) */}
      <motion.div
        style={{ transform: `translate3d(${p1.x}px, ${p1.y}px, 0)` }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute top-4 right-1 sm:right-4 lg:right-8 z-20 w-56 sm:w-64 p-3 bg-[#0d0e10]/92 border border-[#24272d] rounded-xs backdrop-blur-md shadow-2xl pointer-events-auto hover:border-[#f5a524]/60 transition-colors"
      >
        <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#24272d]">
          <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#f5a524] uppercase font-bold tracking-wider">
            <FileText className="w-3.5 h-3.5" />
            <span>Geological Reports</span>
          </div>
          <span className="font-mono text-[9px] text-[#8b9099]">CMR-47</span>
        </div>
        <div className="pt-2 space-y-1 font-mono text-[11px] text-[#edeef0]">
          <div className="flex justify-between">
            <span className="text-[#8b9099]">Strata Seam:</span>
            <span className="font-semibold text-[#f5a524]">Seam XI (8.4m)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#8b9099]">Lithology:</span>
            <span>Bituminous / Arenite</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#8b9099]">RQD Index:</span>
            <span className="text-[#2fbf71]">84% · Stable</span>
          </div>
        </div>
      </motion.div>

      {/* Panel 2: Inspection log with green ticks (Mid Right) */}
      <motion.div
        style={{ transform: `translate3d(${p2.x}px, ${p2.y}px, 0)` }}
        initial={{ opacity: 0, x: 25 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.35 }}
        className="absolute top-1/2 -translate-y-8 right-0 sm:right-2 lg:right-4 z-20 w-60 sm:w-68 p-3 bg-[#0d0e10]/92 border border-[#24272d] rounded-xs backdrop-blur-md shadow-2xl pointer-events-auto hover:border-[#2fbf71]/60 transition-colors"
      >
        <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#24272d]">
          <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#2fbf71] uppercase font-bold tracking-wider">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Inspection Log</span>
          </div>
          <span className="font-mono text-[9px] px-1.5 py-0.5 rounded-xs bg-[#2fbf71]/15 text-[#2fbf71] font-bold">
            DGMS SIGNED
          </span>
        </div>
        <ul className="pt-2 space-y-1.5 font-mono text-[10px] text-[#edeef0]">
          <li className="flex items-center gap-1.5">
            <span className="text-[#2fbf71]">✓</span>
            <span>Daily Shift Round (Section 17)</span>
          </li>
          <li className="flex items-center gap-1.5">
            <span className="text-[#2fbf71]">✓</span>
            <span>Haul Road Gradient 1:16 Verified</span>
          </li>
          <li className="flex items-center gap-1.5">
            <span className="text-[#2fbf71]">✓</span>
            <span>Dumper Rear-Cam & Radar Check</span>
          </li>
        </ul>
      </motion.div>

      {/* Panel 3: CCTV Feed (Bottom Left) */}
      <motion.div
        style={{ transform: `translate3d(${p3.x}px, ${p3.y}px, 0)` }}
        initial={{ opacity: 0, x: -25 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="absolute bottom-10 left-1 sm:left-4 lg:left-6 z-20 w-60 sm:w-68 p-3 bg-[#0d0e10]/92 border border-[#24272d] rounded-xs backdrop-blur-md shadow-2xl pointer-events-auto hover:border-[#38bdf8]/60 transition-colors"
      >
        <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-[#24272d]">
          <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#38bdf8] uppercase font-bold tracking-wider">
            <Video className="w-3.5 h-3.5" />
            <span>CCTV Feed</span>
          </div>
          <span className="font-mono text-[9px] text-[#38bdf8] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] animate-ping" />
            LIVE
          </span>
        </div>
        {/* Simulated CCTV Viewfinder */}
        <div className="relative mt-2 h-20 bg-[#070708] border border-[#24272d] rounded-xs overflow-hidden flex flex-col justify-between p-1.5">
          <div className="absolute inset-0 opacity-15 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,#fff_2px,#fff_3px)]" />
          <div className="relative z-10 flex justify-between font-mono text-[8px] text-[#8b9099]">
            <span>CAM-04 · SOUTH PIT RAMP</span>
            <span>25 FPS</span>
          </div>
          <div className="relative z-10 flex items-center justify-center">
            <div className="px-2 py-0.5 border border-[#f5a524] rounded-xs font-mono text-[9px] text-[#f5a524] bg-[#f5a524]/10">
              [HEMM-772 · CAT 777D]
            </div>
          </div>
          <div className="relative z-10 flex justify-between font-mono text-[8px] text-[#2fbf71]">
            <span>SPEED: 18 KM/H</span>
            <span>HAUL SAFE</span>
          </div>
        </div>
      </motion.div>

      {/* Panel 4: Compliance Checklist & Amber Warning (Bottom Right) */}
      <motion.div
        style={{ transform: `translate3d(${p4.x}px, ${p4.y}px, 0)` }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.65 }}
        className="absolute bottom-4 right-1 sm:right-6 lg:right-12 z-20 w-60 sm:w-68 p-3 bg-[#0d0e10]/92 border border-[#24272d] rounded-xs backdrop-blur-md shadow-2xl pointer-events-auto hover:border-[#f5a524]/60 transition-colors border-l-3 border-l-[#f5a524]"
      >
        <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-[#24272d]">
          <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#f5a524] uppercase font-bold tracking-wider">
            <AlertTriangle className="w-3.5 h-3.5 text-[#f5a524]" />
            <span>Compliance Checklist</span>
          </div>
          <span className="font-mono text-[9px] text-[#f5a524] font-bold">
            MANDATORY
          </span>
        </div>
        <div className="pt-2 space-y-1 font-mono text-[10px] text-[#edeef0]">
          <div className="flex justify-between">
            <span className="text-[#8b9099]">HEMM Pre-Shift Log:</span>
            <span className="text-[#2fbf71]">Signed</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#8b9099]">Safety Committee:</span>
            <span>Quarterly (250+ crew)</span>
          </div>
          <div className="flex justify-between pt-1 border-t border-[#24272d]">
            <span className="text-[#8b9099]">Form M Statutory:</span>
            <span className="text-[#f5a524]">Due 31 Jan</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
