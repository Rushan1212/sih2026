import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useShowcaseStore } from '../../store/useShowcaseStore';
import {
  Camera,
  Cpu,
  AlertTriangle,
  UserCheck,
  Wrench,
  TrendingUp,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const STAGES = [
  {
    step: '01',
    title: 'Field Evidence',
    subtitle: 'Raw Multimodal Capture',
    desc: 'Automated ingestion of CCTV footage, drone photogrammetry, methane telemetry, and inspector voice memos directly from the pit face.',
    statutoryRef: 'DGMS CMR 2017 Reg 38(1)',
    nodeStatus: 'risk',
    statusLabel: 'UNVERIFIED HAZARD',
    officer: 'Pit Overman / Surveyor',
    icon: Camera,
  },
  {
    step: '02',
    title: 'AI Analysis',
    subtitle: 'Computer Vision & NLP OCR',
    desc: 'Multimodal neural network extracts text from handwritten logbooks, correlates gas telemetry spikes, and inspects bench slope fractures.',
    statutoryRef: 'Automated Extraction Engine',
    nodeStatus: 'risk',
    statusLabel: 'PROCESSING ANOMALY',
    officer: 'DataMiners Core ML',
    icon: Cpu,
  },
  {
    step: '03',
    title: 'Risk Detection',
    subtitle: 'Predictive Severity Scoring',
    desc: 'System classifies hazard into critical red-zones: slope instability, explosive dust accumulation, or ventilation shortfall with statutory escalation clocks.',
    statutoryRef: 'DGMS Danger Matrix Level 4',
    nodeStatus: 'risk',
    statusLabel: 'RISK ESCALATED // RED',
    officer: 'Predictive Risk Models',
    icon: AlertTriangle,
  },
  {
    step: '04',
    title: 'Officer Verification',
    subtitle: 'Human-in-the-Loop Validation',
    desc: 'Licensed DGMS Mine Manager or Safety Officer reviews AI evidence on a mobile/desktop terminal, confirming or refining risk parameters before mechanical dispatch.',
    statutoryRef: 'Statutory Verification Sign-off',
    nodeStatus: 'verifying',
    statusLabel: 'OFFICER REVIEWING // AMBER',
    officer: 'First-Class Mine Manager',
    icon: UserCheck,
  },
  {
    step: '05',
    title: 'Corrective Action',
    subtitle: 'Accountable Work Order Dispatch',
    desc: 'Issue is converted into a personalized, dated task with named shift engineer ownership, required machinery, and enforceable statutory deadlines.',
    statutoryRef: 'Work Order #CG-2026-0884',
    nodeStatus: 'actioned',
    statusLabel: 'ENGINEERING DISPATCHED',
    officer: 'Shift In-Charge / Heavy Earth Moving Mech',
    icon: Wrench,
  },
  {
    step: '06',
    title: 'Escalation Monitoring',
    subtitle: 'Autonomous Deadline Enforcement',
    desc: 'System tracks physical progress. If a statutory deadline approaches without verified photographic proof, the alert automatically escalates to Area GM and DGMS portal.',
    statutoryRef: 'CMR Reg 42 Escalation Protocol',
    nodeStatus: 'actioned',
    statusLabel: 'SLA CLOCK ACTIVE',
    officer: 'Area General Manager',
    icon: TrendingUp,
  },
  {
    step: '07',
    title: 'Closure Verification',
    subtitle: 'Tamper-Proof Compliance Audit',
    desc: 'Field inspector uploads re-inspection photographic evidence. AI verifies slope stabilization or gas dissipation. Only then is the statutory action certified closed.',
    statutoryRef: 'Form-IV Verified Audit Seal',
    nodeStatus: 'closed',
    statusLabel: 'AUDIT VERIFIED // CLOSED',
    officer: 'DGMS Regional Inspector',
    icon: CheckCircle,
  },
];

export default function ShowcaseTheLoop() {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const activeStage = useShowcaseStore((s) => s.activeWorkflowStage);
  const setActiveWorkflowStage = useShowcaseStore((s) => s.setActiveWorkflowStage);
  const prefersReducedMotion = useShowcaseStore((s) => s.prefersReducedMotion);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const ctx = gsap.context(() => {
      // Calculate total horizontal scroll distance
      const scrollWidth = track.scrollWidth - window.innerWidth + 120;

      gsap.to(track, {
        x: -scrollWidth,
        ease: 'none',
        force3D: true,
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: `+=${scrollWidth * 1.5}`,
          scrub: 0.8,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            const index = Math.min(
              STAGES.length - 1,
              Math.floor(self.progress * STAGES.length)
            );
            setActiveWorkflowStage(index);
          },
        },
      });
    }, container);

    return () => ctx.revert();
  }, [setActiveWorkflowStage, prefersReducedMotion]);

  const handleStepClick = (index) => {
    setActiveWorkflowStage(index);
  };

  return (
    <section
      id="the-loop"
      ref={containerRef}
      className="relative w-full min-h-screen bg-[#070708] border-b border-[#24272d] overflow-hidden flex flex-col justify-between py-12"
    >
      {/* Section Header with Keyboard Controls */}
      <div className="max-w-7xl w-full mx-auto px-6 md:px-12 flex flex-wrap items-center justify-between gap-4 z-10">
        <div>
          <div className="flex items-center gap-2 mb-2 font-mono text-xs text-[#f5a524] uppercase tracking-widest">
            <span>03 // The Loop</span>
            <span className="text-[#8b9099]">·</span>
            <span>Closed-Loop Governance Workflow</span>
          </div>
          <h2 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-[#edeef0] uppercase">
            From Field Evidence to Verified Closure
          </h2>
        </div>

        {/* Interactive Stage Scrub Controls (Keyboard Accessible) */}
        <div className="flex items-center gap-2 bg-[#16181c] p-1.5 rounded border border-[#24272d]">
          <span className="font-mono text-xs text-[#8b9099] px-2 hidden sm:inline">
            Stage {activeStage + 1} of 7:
          </span>
          <button
            onClick={() => handleStepClick(Math.max(0, activeStage - 1))}
            disabled={activeStage === 0}
            className="p-1.5 rounded hover:bg-[#24272d] text-[#edeef0] disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            aria-label="Previous Workflow Stage"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1 px-1">
            {STAGES.map((s, idx) => (
              <button
                key={s.step}
                onClick={() => handleStepClick(idx)}
                className={`w-6 h-6 rounded font-mono text-[11px] font-bold transition-all ${
                  activeStage === idx
                    ? 'bg-[#f5a524] text-[#070708] shadow-[0_0_12px_rgba(245,165,36,0.5)]'
                    : 'text-[#8b9099] hover:text-[#edeef0] hover:bg-[#24272d]'
                }`}
                aria-label={`Jump to Stage ${s.step}: ${s.title}`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
          <button
            onClick={() => handleStepClick(Math.min(STAGES.length - 1, activeStage + 1))}
            disabled={activeStage === STAGES.length - 1}
            className="p-1.5 rounded hover:bg-[#24272d] text-[#edeef0] disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            aria-label="Next Workflow Stage"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Track of 7 Stages */}
      <div className="w-full overflow-x-auto lg:overflow-visible py-8 no-scrollbar">
        <div
          ref={trackRef}
          className="flex items-stretch gap-6 px-6 md:px-12 w-max min-w-full will-change-transform gpu-accelerated"
        >
          {STAGES.map((stage, idx) => {
            const Icon = stage.icon;
            const isActive = activeStage === idx;
            const isClosed = stage.nodeStatus === 'closed' || (activeStage >= 6 && idx <= activeStage);
            const isRisk = stage.nodeStatus === 'risk' && activeStage < 3;

            return (
              <div
                key={stage.step}
                onClick={() => handleStepClick(idx)}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleStepClick(idx);
                  }
                }}
                className={`w-[320px] sm:w-[380px] p-8 rounded-sm transition-all duration-300 flex flex-col justify-between cursor-pointer border will-change-transform gpu-composite ${
                  isActive
                    ? 'bg-[#16181c] border-[#f5a524] shadow-[0_0_40px_rgba(245,165,36,0.15)] scale-[1.02]'
                    : 'bg-[#0d0e10] border-[#24272d] hover:border-[#8b9099]/40 opacity-75 hover:opacity-100'
                }`}
              >
                <div>
                  {/* Step Header */}
                  <div className="flex items-center justify-between gap-2 mb-6">
                    <span className="font-mono text-sm font-bold text-[#f5a524]">
                      STAGE // {stage.step}
                    </span>
                    <div
                      className={`p-2 rounded ${
                        isActive ? 'bg-[#f5a524]/20 text-[#f5a524]' : 'bg-[#16181c] text-[#8b9099]'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="font-display text-2xl font-bold text-[#edeef0] uppercase tracking-tight mb-1">
                    {stage.title}
                  </h3>
                  <div className="font-mono text-xs text-[#8b9099] mb-4">{stage.subtitle}</div>

                  {/* Body description */}
                  <p className="font-sans text-xs sm:text-sm text-[#8b9099] leading-relaxed mb-6">
                    {stage.desc}
                  </p>
                </div>

                <div>
                  {/* Statutory & Authority Metadata */}
                  <div className="space-y-2 pt-4 border-t border-[#24272d] font-mono text-[11px]">
                    <div className="flex items-center justify-between text-[#8b9099]">
                      <span>Statutory Trigger:</span>
                      <span className="text-[#edeef0]">{stage.statutoryRef}</span>
                    </div>
                    <div className="flex items-center justify-between text-[#8b9099]">
                      <span>Responsible Officer:</span>
                      <span className="text-[#edeef0] truncate max-w-[170px]">{stage.officer}</span>
                    </div>
                  </div>

                  {/* Telemetry Status Signal */}
                  <div
                    className={`mt-4 pt-3 border-t border-[#24272d] flex items-center justify-between font-mono text-[10px] uppercase font-bold tracking-wider ${
                      isClosed
                        ? 'text-[#2fbf71]'
                        : isRisk
                        ? 'text-[#e0523f]'
                        : 'text-[#f5a524]'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full animate-pulse ${
                          isClosed ? 'bg-[#2fbf71]' : isRisk ? 'bg-[#e0523f]' : 'bg-[#f5a524]'
                        }`}
                      />
                      <span>{isClosed ? 'VERIFIED CLOSED' : stage.statusLabel}</span>
                    </div>
                    <span>SEAM TELEMETRY</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Instructions */}
      <div className="max-w-7xl w-full mx-auto px-6 md:px-12 flex items-center justify-between text-mono text-xs text-[#8b9099] pt-4">
        <span>INTERACTIVE WORKFLOW // RISK NODES IN 3D SCENE TRANSITION WITH SCROLL PROGRESS</span>
        <div className="flex items-center gap-2">
          <span>STAGE {activeStage + 1} OF 7 ACTIVE</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#f5a524]" />
        </div>
      </div>
    </section>
  );
}
