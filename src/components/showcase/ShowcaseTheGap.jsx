import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, AlertCircle, CheckCircle2, FileSpreadsheet, Clock, EyeOff, UserX, Database } from 'lucide-react';

const FAILURES = [
  {
    code: 'GAP // 01',
    title: 'Fragmented Data',
    desc: 'Information scattered across disconnected legacy systems, paper logbooks, and isolated spreadsheets.',
    icon: Database,
  },
  {
    code: 'GAP // 02',
    title: 'Manual Reporting',
    desc: 'Time-consuming manual documentation, slow statutory Form-IV/24 filing, and sluggish physical follow-ups.',
    icon: Clock,
  },
  {
    code: 'GAP // 03',
    title: 'Delayed Risk Detection',
    desc: 'Emerging slope slips and gas accumulation identified only after critical escalation or dangerous incidents occur.',
    icon: AlertCircle,
  },
  {
    code: 'GAP // 04',
    title: 'Poor Accountability',
    desc: 'Difficult to track individual ownership, statutory deadlines, and follow-through across shifting multi-tier hierarchies.',
    icon: UserX,
  },
  {
    code: 'GAP // 05',
    title: 'Reactive Governance',
    desc: 'Limited predictive visibility into systemic blindspots, leaving leadership firefighting past failures.',
    icon: EyeOff,
  },
];

export default function ShowcaseTheGap() {
  return (
    <section id="the-gap" className="relative w-full py-24 md:py-36 bg-[#0d0e10] border-b border-[#24272d] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Index Badge */}
        <div className="flex items-center gap-3 mb-10">
          <span className="font-mono text-xs text-[#f5a524] uppercase tracking-widest">02 // The Systemic Gap</span>
          <div className="h-[1px] w-16 bg-[#24272d]" />
          <span className="font-mono text-xs text-[#8b9099] uppercase">The Five Operational Failures</span>
        </div>

        {/* The Emotional Hinge: Thesis Line at Display Size */}
        <div className="mb-20">
          <h2 className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-[-0.04em] leading-[0.98] text-[#edeef0] max-w-5xl uppercase">
            The problem is not lack of data.{' '}
            <span className="text-[#f5a524]">
              It is lack of connected, actionable intelligence.
            </span>
          </h2>
        </div>

        {/* The 5 Failures Ledger: Structured Striation Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-px bg-[#24272d] border border-[#24272d] mb-20">
          {FAILURES.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.code}
                className="bg-[#0d0e10] p-6 sm:p-8 flex flex-col justify-between hover:bg-[#16181c] transition-colors duration-200 group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-6">
                    <span className="font-mono text-[11px] text-[#8b9099] group-hover:text-[#f5a524] transition-colors">
                      {item.code}
                    </span>
                    <Icon className="w-4 h-4 text-[#8b9099] group-hover:text-[#f5a524] transition-colors" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-[#edeef0] uppercase tracking-tight mb-3">
                    {item.title}
                  </h3>
                  <p className="font-sans text-xs sm:text-sm text-[#8b9099] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-[#24272d]/60 font-mono text-[10px] text-[#e0523f] uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#e0523f]" />
                  <span>Unresolved Risk</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* The Transformation Flow: IN -> THROUGH -> OUT */}
        <div className="p-8 sm:p-12 bg-[#16181c] border border-[#24272d] rounded-sm relative overflow-hidden">
          <div className="font-mono text-xs uppercase tracking-widest text-[#f5a524] mb-8">
            Operational Intelligence Transformation Architecture
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative items-center">
            {/* IN */}
            <div className="p-6 bg-[#0d0e10] border border-[#24272d] rounded-sm">
              <div className="font-mono text-xs uppercase text-[#8b9099] mb-2 flex items-center justify-between">
                <span>STAGE 1: INPUT STREAM</span>
                <span className="text-[#edeef0] font-bold">IN</span>
              </div>
              <div className="text-sm font-semibold text-[#edeef0] mb-4">Raw Operational Evidence</div>
              <ul className="space-y-2 font-mono text-xs text-[#8b9099]">
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-[#f5a524]" />
                  <span>Statutory DGMS Documents & Forms</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-[#f5a524]" />
                  <span>Worker & Contractor Safety Rosters</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-[#f5a524]" />
                  <span>CCTV Feeds & Drone Photogrammetry</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-[#f5a524]" />
                  <span>Shift Inspection Logbooks</span>
                </li>
              </ul>
            </div>

            {/* THROUGH */}
            <div className="p-6 bg-[#070708] border-2 border-[#f5a524]/60 rounded-sm relative shadow-[0_0_30px_rgba(245,165,36,0.12)]">
              <div className="font-mono text-xs uppercase text-[#f5a524] mb-2 flex items-center justify-between">
                <span>STAGE 2: CORE ENGINE</span>
                <span className="text-[#f5a524] font-bold">THROUGH</span>
              </div>
              <div className="text-base font-bold text-[#edeef0] mb-2">DataMiners Intelligence</div>
              <p className="font-sans text-xs text-[#8b9099] mb-4">
                Unified governance intelligence connecting telemetry, computer vision, and statutory rules.
              </p>
              <div className="font-mono text-[11px] text-[#ffd08a] bg-[#f5a524]/10 p-2.5 rounded border border-[#f5a524]/20">
                Rule Engine CMR 2017 · OCR · Anomaly Scoring
              </div>
            </div>

            {/* OUT */}
            <div className="p-6 bg-[#0d0e10] border border-[#24272d] rounded-sm">
              <div className="font-mono text-xs uppercase text-[#8b9099] mb-2 flex items-center justify-between">
                <span>STAGE 3: EXECUTION</span>
                <span className="text-[#2fbf71] font-bold">OUT</span>
              </div>
              <div className="text-sm font-semibold text-[#edeef0] mb-4">Accountable Action & Audit</div>
              <ul className="space-y-2 font-mono text-xs text-[#8b9099]">
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-[#2fbf71]" />
                  <span>Personalized Authority Risk Dashboard</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-[#2fbf71]" />
                  <span>Real-Time Statutory Smart Alerts</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-[#2fbf71]" />
                  <span>Automated DGMS Compliance Filings</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-[#2fbf71]" />
                  <span>Tamper-Proof Verified Audit Trail</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
