import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Shield,
  HeartHandshake,
  DollarSign,
  Leaf,
  FileText,
  SlidersHorizontal,
  CheckCircle2,
  AlertCircle,
  TrendingDown,
  Clock,
  Award,
  Eye,
  CheckSquare,
} from 'lucide-react';

const BENEFIT_AXES = [
  {
    axis: 'Social',
    title: 'Workforce Safety & Life Protection',
    desc: 'Heightened safety vigilance at the pit face, faster emergency dispatch, and prevention of preventable opencast fatalities.',
    icon: HeartHandshake,
    badge: 'HUMAN FACTOR',
  },
  {
    axis: 'Economic',
    title: 'Administrative & Asset Optimization',
    desc: 'Dramatically cuts non-productive paperwork hours and shields operations against costly DGMS Section 22 stop-work orders.',
    icon: DollarSign,
    badge: 'COST REDUCTION',
  },
  {
    axis: 'Environmental',
    title: 'Continuous Seam & Air Monitoring',
    desc: 'Real-time telemetry tracking of PM10 haul-road particulate, methane dissipation, and overburden sump runoff.',
    icon: Leaf,
    badge: 'GREEN MINING',
  },
  {
    axis: 'Governance',
    title: 'Ministry & DGMS Audit Readiness',
    desc: 'Permanent, unalterable digital paper trail ensuring 100% compliance readiness for statutory inspections.',
    icon: FileText,
    badge: 'STATUTORY TRANSPARENCY',
  },
  {
    axis: 'Operational',
    title: 'Zero Latency From Pit to Boardroom',
    desc: 'Compresses information transmission latency from weeks of physical registers down to real-time synchronized dashboards.',
    icon: SlidersHorizontal,
    badge: 'SPEED & RIGOR',
  },
];

const TARGET_KPIS = [
  { metric: 'Reduced Overdue Actions', desc: 'Accelerates hazard correction cycles via automated statutory SLA clocks', icon: TrendingDown },
  { metric: 'Faster Inspection Processing', desc: 'Cuts multimodal evidence synthesis from days to instantaneous digital workflows', icon: Clock },
  { metric: 'Improved Audit Readiness', desc: 'Pre-formatted DGMS CMR 2017 Form-IV/24 registers instantly exportable', icon: Award },
  { metric: 'Better Compliance Visibility', desc: 'Full GIS spatial tracking of high-risk red zones across mine sectors', icon: Eye },
  { metric: 'Higher Verified Closure Rate', desc: 'Zero unverified checkboxes—every single action requires photographic validation', icon: CheckSquare },
];

export default function ShowcaseImpact() {
  const [sliderPosition, setSliderPosition] = useState(50);

  return (
    <section id="impact" className="relative w-full py-24 md:py-36 bg-[#070708] border-b border-[#24272d]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="mb-16">
          <div className="flex items-center gap-2 mb-3 font-mono text-xs text-[#f5a524] uppercase tracking-widest">
            <span>07 // Transformative Operational Impact</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-[#edeef0] uppercase leading-[0.98]">
            Before vs After <br />
            <span className="text-[#f5a524]">The Paradigm Shift.</span>
          </h2>
        </div>

        {/* Interactive Before -> After Comparison Transformation Container */}
        <div className="mb-24 p-6 sm:p-10 bg-[#0d0e10] border border-[#24272d] rounded-sm relative">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#24272d] flex-wrap gap-4">
            <span className="font-mono text-xs text-[#8b9099] uppercase tracking-wider">
              Governance Transformation Comparison
            </span>
            <div className="flex items-center gap-4 font-mono text-xs">
              <span className="text-[#e0523f] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#e0523f]" /> BEFORE: Reactive Failure
              </span>
              <span className="text-[#24272d]">|</span>
              <span className="text-[#2fbf71] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#2fbf71]" /> AFTER: Connected Intelligence
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* BEFORE */}
            <div className="p-6 bg-[#16181c]/60 border border-[#e0523f]/30 rounded-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs font-bold text-[#e0523f] uppercase tracking-wider">
                  The Traditional Reality
                </span>
                <AlertCircle className="w-4 h-4 text-[#e0523f]" />
              </div>
              <ul className="space-y-3 font-mono text-xs text-[#8b9099]">
                <li className="flex items-center gap-2 text-[#edeef0]">
                  <span className="text-[#e0523f]">✕</span> Manual handwritten paper logbooks & registers
                </li>
                <li className="flex items-center gap-2 text-[#edeef0]">
                  <span className="text-[#e0523f]">✕</span> Delayed hazard alerts after escalation occurred
                </li>
                <li className="flex items-center gap-2 text-[#edeef0]">
                  <span className="text-[#e0523f]">✕</span> Scattered documents in disconnected offices
                </li>
                <li className="flex items-center gap-2 text-[#edeef0]">
                  <span className="text-[#e0523f]">✕</span> Unresolved, unassigned statutory safety actions
                </li>
                <li className="flex items-center gap-2 text-[#edeef0]">
                  <span className="text-[#e0523f]">✕</span> Limited boardroom visibility into emerging risks
                </li>
              </ul>
            </div>

            {/* AFTER */}
            <div className="p-6 bg-[#16181c] border border-[#2fbf71]/40 rounded-sm shadow-[0_0_30px_rgba(47,191,113,0.1)]">
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs font-bold text-[#2fbf71] uppercase tracking-wider">
                  With CoalGuard AI (DataMiners)
                </span>
                <CheckCircle2 className="w-4 h-4 text-[#2fbf71]" />
              </div>
              <ul className="space-y-3 font-mono text-xs text-[#edeef0]">
                <li className="flex items-center gap-2">
                  <span className="text-[#2fbf71]">✓</span> Unified real-time digital intelligence cockpit
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#2fbf71]">✓</span> Predictive risk-based alerts 48 hours in advance
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#2fbf71]">✓</span> Automated multimodal evidence OCR & GIS mapping
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#2fbf71]">✓</span> 100% owned, dated actions tracked to verified closure
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#2fbf71]">✓</span> Complete statutory visibility from pit face to boardroom
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 5 Benefit Axes */}
        <div className="mb-24">
          <div className="mb-10">
            <h3 className="font-display text-2xl font-bold text-[#edeef0] uppercase tracking-tight mb-2">
              Five Dimensional Benefit Axes
            </h3>
            <p className="font-sans text-xs text-[#8b9099]">
              Holistic value created across human, regulatory, and corporate tiers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BENEFIT_AXES.map((b) => {
              const Icon = b.icon;
              return (
                <div
                  key={b.axis}
                  className="p-6 bg-[#0d0e10] border border-[#24272d] hover:border-[#f5a524]/60 transition-colors rounded-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono text-xs font-bold text-[#f5a524]">
                        {b.axis.toUpperCase()} AXIS
                      </span>
                      <Icon className="w-4 h-4 text-[#8b9099]" />
                    </div>
                    <h4 className="font-display text-base font-bold text-[#edeef0] uppercase tracking-tight mb-2">
                      {b.title}
                    </h4>
                    <p className="font-sans text-xs text-[#8b9099] leading-relaxed">
                      {b.desc}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-[#24272d]/60 font-mono text-[10px] text-[#8b9099] uppercase">
                    {b.badge}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Target KPIs: Explicitly Labeled as PILOT HYPOTHESES */}
        <div className="p-8 sm:p-10 bg-[#16181c] border border-[#24272d] rounded-sm">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6 pb-4 border-b border-[#24272d]">
            <div>
              <h3 className="font-display text-xl font-bold text-[#edeef0] uppercase tracking-tight">
                Target KPI Evaluation Framework
              </h3>
              <p className="font-sans text-xs text-[#8b9099]">
                Measurable operational outcomes targeted during the pilot deployment phase.
              </p>
            </div>
            <span className="font-mono text-xs px-3 py-1 bg-[#f5a524]/10 border border-[#f5a524]/30 text-[#f5a524] rounded-sm uppercase tracking-wider font-bold">
              [PILOT HYPOTHESES — RIGOROUS EVALUATION CRITERIA]
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {TARGET_KPIS.map((kpi, idx) => {
              const Icon = kpi.icon;
              return (
                <div key={idx} className="p-4 bg-[#0d0e10] border border-[#24272d] rounded-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3 text-[#f5a524]">
                      <span className="font-mono text-xs">HYPOTHESIS 0{idx + 1}</span>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="font-display text-sm font-bold text-[#edeef0] uppercase tracking-tight mb-2">
                      {kpi.metric}
                    </div>
                  </div>
                  <p className="font-sans text-[11px] text-[#8b9099] leading-relaxed pt-3 border-t border-[#24272d]/60">
                    {kpi.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pull Quotes */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 bg-[#0d0e10] border-l-2 border-[#f5a524]">
            <p className="font-display text-xl sm:text-2xl font-bold text-[#edeef0] uppercase tracking-tight mb-2">
              "Every issue becomes visible, accountable, and measurable."
            </p>
            <div className="font-mono text-xs text-[#8b9099]">— CoalGuard Governance Standard</div>
          </div>
          <div className="p-8 bg-[#0d0e10] border-l-2 border-[#2fbf71]">
            <p className="font-display text-xl sm:text-2xl font-bold text-[#edeef0] uppercase tracking-tight mb-2">
              "From pit face to boardroom."
            </p>
            <div className="font-mono text-xs text-[#8b9099]">— Seamless Operational Continuity</div>
          </div>
        </div>
      </div>
    </section>
  );
}
