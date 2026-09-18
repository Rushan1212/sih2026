import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, ShieldAlert, CheckCircle2, Activity, ArrowRight, ExternalLink } from 'lucide-react';

export default function ShowcaseTelemetryModal({ isOpen, onClose, selectedNode, onExplorePlatform }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-[#070708]/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl bg-[#0d0e10] border border-[#24272d] rounded-sm shadow-2xl overflow-hidden"
        >
          {/* Top Window Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#24272d] bg-[#16181c]">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#f5a524] animate-pulse" />
              <span className="font-mono text-xs uppercase font-bold text-[#edeef0] tracking-wider">
                {selectedNode ? `TELEMETRY BEACON // ${selectedNode.hazardCode}` : 'COALGUARD AI // MISSION BRIEFING'}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded text-[#8b9099] hover:text-[#edeef0] hover:bg-[#24272d] transition-colors"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6 sm:p-8 space-y-6">
            {selectedNode ? (
              // Specific Node Detail
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className={`font-mono text-xs px-2.5 py-1 rounded font-bold uppercase ${
                      selectedNode.status === 'closed'
                        ? 'bg-[#2fbf71]/15 text-[#2fbf71]'
                        : selectedNode.status === 'risk'
                        ? 'bg-[#e0523f]/15 text-[#e0523f]'
                        : 'bg-[#f5a524]/15 text-[#f5a524]'
                    }`}
                  >
                    STATUS: {selectedNode.status.toUpperCase()}
                  </span>
                  <span className="font-mono text-xs text-[#8b9099]">
                    Bench Level {selectedNode.benchLevel} · Open-Pit
                  </span>
                </div>

                <h3 className="font-display text-2xl font-bold text-[#edeef0] uppercase tracking-tight mb-2">
                  {selectedNode.title}
                </h3>

                <p className="font-sans text-sm text-[#8b9099] leading-relaxed mb-6">
                  Monitored under statutory regulation {selectedNode.hazardCode}. Continuous telemetry streams
                  cross-checked against DGMS slope stability standards and environmental thresholds.
                </p>

                <div className="p-4 bg-[#16181c] border border-[#24272d] rounded-sm font-mono text-xs space-y-2 text-[#8b9099]">
                  <div className="flex justify-between">
                    <span>Spatial Coordinates:</span>
                    <span className="text-[#edeef0]">
                      [{selectedNode.position.map((p) => p.toFixed(2)).join(', ')}]
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Statutory Ownership:</span>
                    <span className="text-[#edeef0]">First-Class Mine Overman</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Enforcement Action:</span>
                    <span className="text-[#f5a524]">Closed-Loop Verification Mandatory</span>
                  </div>
                </div>
              </div>
            ) : (
              // Standard Video / Platform Briefing
              <div>
                <div className="aspect-video w-full bg-[#070708] border border-[#24272d] rounded-sm relative overflow-hidden flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-[#f5a524]/15 border border-[#f5a524] flex items-center justify-center mb-4 text-[#f5a524]">
                    <Play className="w-6 h-6 ml-0.5 fill-[#f5a524]" />
                  </div>
                  <h4 className="font-display text-lg font-bold text-[#edeef0] uppercase tracking-tight mb-1">
                    System Architecture & Field Workflow Walkthrough
                  </h4>
                  <p className="font-mono text-xs text-[#8b9099] max-w-sm">
                    Interactive simulation of India's first closed-loop AI compliance platform for coal mines.
                  </p>
                </div>
              </div>
            )}

            {/* Action Row */}
            <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-[#24272d]">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-[#16181c] border border-[#24272d] hover:bg-[#24272d] text-[#8b9099] hover:text-[#edeef0] font-mono text-xs transition-colors rounded-sm"
              >
                Close Window
              </button>
              <button
                onClick={() => {
                  onClose();
                  onExplorePlatform();
                }}
                className="px-5 py-2 bg-[#f5a524] hover:bg-[#ffd08a] text-[#070708] font-mono font-bold text-xs uppercase tracking-wider transition-colors rounded-sm flex items-center gap-1.5"
              >
                <span>Launch Interactive Cockpit</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
