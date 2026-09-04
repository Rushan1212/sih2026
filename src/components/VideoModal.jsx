import React from 'react';
import { X, Play, ShieldCheck, Layers, Cpu } from 'lucide-react';

export default function VideoModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D0D0D]/85 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-[#161616] p-8 border-l-2 border-[#F5A623] shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-[#8A8A8A] hover:text-white p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-xs uppercase tracking-widest text-[#F5A623] font-bold mb-2">
          Architecture Overview
        </div>
        <h3 className="text-2xl font-headline uppercase text-white tracking-wide mb-6">
          CoalGuard AI Platform Walkthrough
        </h3>

        {/* Minimalist Visual Mock Video Player Screen */}
        <div className="w-full h-64 bg-[#0D0D0D] border border-[#242424] flex flex-col items-center justify-center relative p-6 text-center">
          <div className="w-14 h-14 bg-[#F5A623] flex items-center justify-center mb-4">
            <Play className="w-6 h-6 text-[#0D0D0D] fill-current ml-1" />
          </div>
          <div className="text-sm font-headline uppercase tracking-wider text-white">
            DGMS Compliant Closed-Loop Architecture
          </div>
          <p className="text-xs text-[#8A8A8A] max-w-md mt-2">
            Edge-to-cloud telemetry, offline GPS inspection verification, and automated statutory Form IV compilation.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6 text-center text-xs text-[#8A8A8A]">
          <div className="p-3 bg-[#0D0D0D] border border-[#242424]">
            <span className="text-white font-bold block mb-1">01. Edge Capture</span>
            <span>Offline Mobile</span>
          </div>
          <div className="p-3 bg-[#0D0D0D] border border-[#242424]">
            <span className="text-[#F5A623] font-bold block mb-1">02. Neural Match</span>
            <span>CMR 2017 Rules</span>
          </div>
          <div className="p-3 bg-[#0D0D0D] border border-[#242424]">
            <span className="text-white font-bold block mb-1">03. Auto Export</span>
            <span>DGMS Portals</span>
          </div>
        </div>

      </div>
    </div>
  );
}
