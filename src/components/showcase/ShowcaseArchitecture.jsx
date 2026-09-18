import React from 'react';
import { motion } from 'framer-motion';
import { Layers, MapPin, Cpu, ShieldAlert, Wrench, Clock, FileCheck, Server, Database, Cloud } from 'lucide-react';

const STEPS = [
  { num: '01', title: 'Data Collection', desc: 'IoT methane sensors, drone imagery, DGMS logbooks, CCTV video streams', icon: Layers },
  { num: '02', title: 'GIS Mapping', desc: 'Real-time opencast spatial location, sector elevation & red-zone contour overlays', icon: MapPin },
  { num: '03', title: 'AI Intelligence', desc: 'Neural classification, risk scoring, geotechnical anomaly detection & LLM extraction', icon: Cpu },
  { num: '04', title: 'Human Verification', desc: 'Statutory Mine Manager / Safety Officer verifies AI findings before dispatch', icon: ShieldAlert },
  { num: '05', title: 'Action Management', desc: 'Automated work order creation with named owner, statutory deadline & priority', icon: Wrench },
  { num: '06', title: 'Monitoring & Escalation', desc: 'Autonomous SLA tracking, progress audits, and automated escalation on breach', icon: Clock },
  { num: '07', title: 'Closure & Reporting', desc: 'Post-action photographic verification, DGMS Form-IV generation & sealed audit trail', icon: FileCheck },
];

const STACK_LAYERS = [
  {
    layer: 'Frontend Client Layer',
    tech: ['React 18', 'TypeScript', 'Tailwind CSS', 'Lenis Smooth Scroll', 'Three.js / R3F WebGL', 'Framer Motion'],
    role: 'Awwwards-grade responsive cockpit, offline PWA field application, and low-latency 3D spatial mine map.',
  },
  {
    layer: 'Backend Microservices',
    tech: ['Python 3.11', 'FastAPI', 'High-throughput REST APIs', 'WebSockets', 'Celery Task Queue'],
    role: 'Asynchronous event-driven ingestion engine capable of handling parallel telemetry streams from remote mine sensors.',
  },
  {
    layer: 'AI / Machine Learning Core',
    tech: ['Computer Vision (YOLOv8/ResNet)', 'NLP OCR Engine', 'DGMS Geotechnical Risk Models', 'LLM Copilot'],
    role: 'Real-time slope deformation analysis, statutory document extraction, and predictive hazard severity scoring.',
  },
  {
    layer: 'Data & Vector Persistence',
    tech: ['PostgreSQL (TimescaleDB)', 'pgvector / Vector Database', 'Redis Cache', 'Encrypted S3 Storage'],
    role: 'Time-series sensor telemetry, indexed regulatory precedents, semantic inspection embeddings, and audit logs.',
  },
  {
    layer: 'Infrastructure & Security',
    tech: ['Docker Containers', 'Kubernetes', 'Private On-Premise / Cloud Deployment', 'RBAC & TLS 1.3'],
    role: 'Air-gapped capability for sensitive PSU mining infrastructure (Coal India / SCCL) with strict role segregation.',
  },
  {
    layer: 'Visualization & Analytics',
    tech: ['Interactive GIS Mine Mapping', 'DGMS Statutory Register Export', 'Live Anomaly Heatmaps'],
    role: 'High-density telemetry HUDs for pit overmen, subsidiary directors, and regional DGMS inspectors.',
  },
];

export default function ShowcaseArchitecture() {
  return (
    <section id="architecture" className="relative w-full py-24 md:py-36 bg-[#070708] border-b border-[#24272d]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="mb-16">
          <div className="flex items-center gap-2 mb-3 font-mono text-xs text-[#f5a524] uppercase tracking-widest">
            <span>05 // How It Works & Architecture</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-[#edeef0] uppercase leading-[0.98]">
            The 7 Implementation Steps <br />
            <span className="text-[#8b9099] font-normal">& System Blueprint.</span>
          </h2>
        </div>

        {/* 7 Implementation Steps: Horizontal Blueprint Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3 mb-24">
          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="p-5 bg-[#0d0e10] border border-[#24272d] hover:border-[#f5a524]/60 transition-colors rounded-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4 font-mono text-xs text-[#f5a524]">
                    <span>{step.num}</span>
                    <Icon className="w-4 h-4 text-[#8b9099]" />
                  </div>
                  <h3 className="font-display text-sm font-bold text-[#edeef0] uppercase tracking-tight mb-2">
                    {step.title}
                  </h3>
                </div>
                <p className="font-sans text-[11px] text-[#8b9099] leading-relaxed pt-3 border-t border-[#24272d]/60">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Tech Stack: Clean Architecture Ledger (Not a generic logo wall) */}
        <div>
          <div className="flex items-center justify-between mb-8 pb-3 border-b border-[#24272d]">
            <h3 className="font-display text-xl font-bold text-[#edeef0] uppercase tracking-tight">
              Enterprise Technology Stack
            </h3>
            <span className="font-mono text-xs text-[#8b9099] uppercase">Modular · Resilient · Air-Gapped Ready</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {STACK_LAYERS.map((layer) => (
              <div
                key={layer.layer}
                className="p-6 bg-[#0d0e10] border border-[#24272d] rounded-sm hover:border-[#8b9099]/40 transition-colors"
              >
                <div className="font-mono text-xs text-[#f5a524] uppercase tracking-wider mb-2">
                  {layer.layer}
                </div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {layer.tech.map((t) => (
                    <span
                      key={t}
                      className="font-mono text-[11px] px-2 py-0.5 rounded-sm bg-[#16181c] border border-[#24272d] text-[#edeef0]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <p className="font-sans text-xs text-[#8b9099] leading-relaxed">
                  {layer.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
