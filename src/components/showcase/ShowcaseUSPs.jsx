import React from 'react';
import { motion } from 'framer-motion';
import { Target, FileSearch, LineChart, ShieldCheck, WifiOff, ArrowUpRight } from 'lucide-react';

const USPS = [
  {
    number: '01',
    title: 'Risk-to-Action Pipeline',
    tagline: 'Personalized Authority Cockpit',
    desc: 'Every detected anomaly, sensor threshold violation, or visual crack is immediately synthesized into an owned, dated, and legally accountable action order. No issue remains a passive chart.',
    statutoryDetail: 'DGMS Section 22 Enforcement Compatible',
    metric: '100% Accountable Ownership',
    icon: Target,
  },
  {
    number: '02',
    title: 'AI Evidence Intelligence',
    tagline: 'Multimodal Deep Document & Video Parsing',
    desc: 'Reads unstructured documents, handwritten shift logs, drone orthomosaics, and CCTV stream frames—not merely web form fields. Automatically cross-references observations against DGMS CMR 2017 statutory safety criteria.',
    statutoryDetail: 'OCR + Vision Anomaly Detection',
    metric: 'Multimodal Input Surface',
    icon: FileSearch,
  },
  {
    number: '03',
    title: 'Predictive Risk Monitoring',
    tagline: 'Early Detection Before Mechanical Failure',
    desc: 'Identifies emerging high-risk excavation sectors days before escalation by correlating micro-seismic vibrations, gas sensor shifts, bench slope inclinometers, and rainfall saturation indexes.',
    statutoryDetail: 'CMR Reg 38 Slope Stability Alerting',
    metric: '48h Predictive Warning Window',
    icon: LineChart,
  },
  {
    number: '04',
    title: 'Closed-Loop Compliance',
    tagline: 'Surfaces Risks · Tracks to Verified Closure',
    desc: 'Surfaces risks before they manifest as fatal incidents, and tracks every corrective intervention to verified physical re-inspection. A risk cannot be checked off without photographic evidence and officer sign-off.',
    statutoryDetail: 'Tamper-Proof Audit Trail',
    metric: 'Zero Unverified Checkboxes',
    icon: ShieldCheck,
  },
  {
    number: '05',
    title: 'Offline Field Communication',
    tagline: 'Field Resilience Under Harsh Opencast Conditions',
    desc: 'The field application functions completely offline at remote pit faces with zero cellular reception. Inspect, record audio voice memos, capture geotagged photos, and securely auto-sync the instant connectivity is restored.',
    statutoryDetail: 'IndexedDB PWA Local Storage Engine',
    metric: '100% Offline Operationality',
    icon: WifiOff,
  },
];

export default function ShowcaseUSPs() {
  return (
    <section id="usps" className="relative w-full py-24 md:py-36 bg-[#0d0e10] border-b border-[#24272d]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Sticky Left / Scrolling Right Editorial Pairing */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Sticky Editorial Statement */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="flex items-center gap-2 mb-4 font-mono text-xs text-[#f5a524] uppercase tracking-widest">
              <span>04 // Architectural Differentiators</span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#edeef0] uppercase leading-[0.95] mb-6">
              Five Core <br />
              <span className="text-[#f5a524]">USPs.</span>
            </h2>
            <p className="font-sans text-sm sm:text-base text-[#8b9099] leading-relaxed max-w-md mb-8">
              Built specifically around the operational realities of Indian coal mining: discontinuous
              connectivity, statutory legal accountability, and harsh open-cast environments.
            </p>

            {/* Pull Quote */}
            <div className="p-6 bg-[#16181c] border-l-2 border-[#f5a524] rounded-r-sm">
              <p className="font-display text-lg text-[#edeef0] font-bold uppercase tracking-tight mb-2">
                "We don't just detect problems. We turn them into verified actions."
              </p>
              <div className="font-mono text-xs text-[#8b9099]">— CoalGuard Operational Thesis</div>
            </div>
          </div>

          {/* Right Column: Deep Editorial Ledger (5 Items, Not generic cards) */}
          <div className="lg:col-span-7 space-y-6">
            {USPS.map((usp) => {
              const Icon = usp.icon;
              return (
                <div
                  key={usp.number}
                  className="p-8 sm:p-10 bg-[#16181c] border border-[#24272d] hover:border-[#f5a524]/60 transition-all duration-300 group rounded-sm"
                >
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-[#f5a524] px-2 py-1 bg-[#f5a524]/10 rounded border border-[#f5a524]/20">
                        USP // {usp.number}
                      </span>
                      <span className="font-mono text-xs text-[#8b9099]">{usp.tagline}</span>
                    </div>
                    <Icon className="w-5 h-5 text-[#8b9099] group-hover:text-[#f5a524] transition-colors" />
                  </div>

                  <h3 className="font-display text-2xl font-bold text-[#edeef0] uppercase tracking-tight mb-3">
                    {usp.title}
                  </h3>

                  <p className="font-sans text-sm text-[#8b9099] leading-relaxed mb-6">
                    {usp.desc}
                  </p>

                  <div className="pt-4 border-t border-[#24272d] flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
                    <span className="text-[#edeef0] bg-[#070708] px-2.5 py-1 rounded border border-[#24272d]">
                      {usp.statutoryDetail}
                    </span>
                    <span className="text-[#2fbf71] font-semibold">{usp.metric}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
