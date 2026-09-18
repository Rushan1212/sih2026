import React from 'react';
import { motion } from 'framer-motion';
import { Shield, ArrowRight, CheckCircle2, AlertOctagon, Scale, TrendingUp } from 'lucide-react';

const RISK_MITIGATION_PAIRS = [
  {
    risk: 'Data Quality & Inconsistency',
    riskDetail: 'Incomplete shift logs, erratic sensor telemetry, and mismatched handwritten formats.',
    mitigation: 'Automated Data Validation & Standardization',
    mitigationDetail: 'Multi-stage ingestion sanitization, schema validation rules, and automated missing-value telemetry checks.',
  },
  {
    risk: 'Legacy System Incompatibility',
    riskDetail: 'Decades of disconnected siloed software, physical paper logbooks, and proprietary SCADA formats.',
    mitigation: 'Connect Rather Than Replace Strategy',
    mitigationDetail: 'Modular non-invasive REST/Webhook adapters and OCR digitizers that integrate on top of existing mining tools.',
  },
  {
    risk: 'AI False Positives & Misclassification',
    riskDetail: 'Erroneous alerts causing alarm fatigue or unnecessary mine excavation stoppages.',
    mitigation: 'Mandatory Human-in-the-Loop Protocol',
    mitigationDetail: 'Licensed DGMS Officer verification is strictly mandatory before any high-severity action order or mechanical dispatch.',
  },
  {
    risk: 'User Resistance & Adoption Friction',
    riskDetail: 'Field staff and shift overmen resistant to abrupt statutory workflow disruptions.',
    mitigation: 'Staged Pilot-First Rollout',
    mitigationDetail: 'Begin with non-intrusive parallel pilot on single bench; iterate on direct overman feedback before subsidiary scale-up.',
  },
  {
    risk: 'Operational & Governance Data Security',
    riskDetail: 'Vulnerability of sensitive national coal reserve telemetry, safety violation logs, and production audits.',
    mitigation: 'Granular RBAC, TLS 1.3 & Immutable Logs',
    mitigationDetail: 'Role-based access control matching DGMS statutory hierarchy, end-to-end field encryption, and tamper-proof audit trails.',
  },
];

const FEASIBILITY_AXES = [
  { axis: 'Technological', desc: 'Built with battle-tested AI/ML computer vision, PostgreSQL, and resilient REST/WebSocket APIs.' },
  { axis: 'Operational', desc: 'Seamlessly embeds into standard DGMS CMR 2017 shift inspections and overman safety routines.' },
  { axis: 'Economic', desc: 'Drastically reduces administrative manual paperwork hours and avoids millions in statutory penalty shutdowns.' },
  { axis: 'Scalable', desc: 'Modular microservice architecture expands frictionlessly from a single pilot pit to regional subsidiary grids.' },
];

export default function ShowcaseOperationsRisk() {
  return (
    <section id="operations" className="relative w-full py-24 md:py-36 bg-[#0d0e10] border-b border-[#24272d]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-16">
          <div>
            <div className="flex items-center gap-2 mb-3 font-mono text-xs text-[#f5a524] uppercase tracking-widest">
              <span>06 // Operational Feasibility & Risk Matrix</span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-[#edeef0] uppercase leading-[0.98]">
              Built for Real Opencast Operations.
            </h2>
          </div>
          {/* Rollout Path Pill */}
          <div className="flex items-center gap-2 font-mono text-xs text-[#edeef0] bg-[#16181c] border border-[#24272d] px-4 py-2 rounded-sm">
            <span className="text-[#8b9099]">Rollout Path:</span>
            <span className="text-[#f5a524]">Pilot</span>
            <ArrowRight className="w-3 h-3 text-[#8b9099]" />
            <span className="text-[#f5a524]">Validate</span>
            <ArrowRight className="w-3 h-3 text-[#8b9099]" />
            <span className="text-[#f5a524]">Improve</span>
            <ArrowRight className="w-3 h-3 text-[#8b9099]" />
            <span className="text-[#2fbf71]">Scale</span>
          </div>
        </div>

        {/* Paired Risk <-> Mitigation Layout (The pairing is the argument) */}
        <div className="space-y-4 mb-20">
          {RISK_MITIGATION_PAIRS.map((pair, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#24272d] border border-[#24272d] rounded-sm overflow-hidden"
            >
              {/* Risk Side (Left) */}
              <div className="p-6 sm:p-8 bg-[#16181c] flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 font-mono text-xs text-[#e0523f] uppercase tracking-wider mb-2">
                    <AlertOctagon className="w-3.5 h-3.5" />
                    <span>Identified Risk // 0{idx + 1}</span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-[#edeef0] uppercase tracking-tight mb-2">
                    {pair.risk}
                  </h3>
                  <p className="font-sans text-xs text-[#8b9099] leading-relaxed">
                    {pair.riskDetail}
                  </p>
                </div>
              </div>

              {/* Mitigation Side (Right) */}
              <div className="p-6 sm:p-8 bg-[#0d0e10] flex flex-col justify-between border-t md:border-t-0 md:border-l border-[#24272d]">
                <div>
                  <div className="flex items-center gap-2 font-mono text-xs text-[#2fbf71] uppercase tracking-wider mb-2">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Engineered Mitigation</span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-[#edeef0] uppercase tracking-tight mb-2">
                    {pair.mitigation}
                  </h3>
                  <p className="font-sans text-xs text-[#8b9099] leading-relaxed">
                    {pair.mitigationDetail}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 4 Feasibility Axes */}
        <div className="p-8 sm:p-12 bg-[#16181c] border border-[#24272d] rounded-sm">
          <div className="font-mono text-xs uppercase tracking-widest text-[#f5a524] mb-6">
            Multi-Dimensional Feasibility Pillars
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEASIBILITY_AXES.map((axis) => (
              <div key={axis.axis} className="space-y-2">
                <div className="font-mono text-sm font-bold text-[#edeef0] uppercase tracking-wider flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#f5a524]" />
                  <span>{axis.axis}</span>
                </div>
                <p className="font-sans text-xs text-[#8b9099] leading-relaxed">
                  {axis.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
