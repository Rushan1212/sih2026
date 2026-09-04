import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Building2, 
  Mail, 
  User, 
  Phone, 
  CheckCircle2, 
  FileCheck2, 
  ArrowRight,
  Layers,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../utils/sound';

export default function DemoRequestModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    designation: 'Chief Safety Officer / GM',
    organization: 'Bharat Coking Coal Limited (BCCL)',
    email: '',
    phone: '',
    pitCount: '10 - 25 Mine Sites',
  });
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    soundManager.playSuccess();
    setSubmitted(true);
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#F5A623', '#FFD60A', '#FFFFFF', '#30D158'],
    });
  };

  const subsidiaries = [
    'Bharat Coking Coal Limited (BCCL)',
    'Eastern Coalfields Limited (ECL)',
    'Central Coalfields Limited (CCL)',
    'Western Coalfields Limited (WCL)',
    'South Eastern Coalfields Limited (SECL)',
    'Mahanadi Coalfields Limited (MCL)',
    'Northern Coalfields Limited (NCL)',
    'Singareni Collieries Company Ltd (SCCL)',
    'Neyveli Lignite Corporation (NLC)',
    'Captive Commercial Coal Mine Operator',
    'Ministry of Coal / Regulatory Authority',
  ];

  return (
    <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-coal-950/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl glass-card rounded-2xl border border-amber/40 shadow-[0_0_80px_rgba(245,166,35,0.25)] p-6 sm:p-8 my-auto overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-coal-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-coal-900 border border-amber text-amber shadow-md">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-display font-bold text-white uppercase tracking-wide">
                Schedule Operational Briefing
              </h3>
              <p className="text-xs font-mono text-coal-400">
                14-Day Rapid Pilot Deployment for CIL Subsidiaries & Mining Operators
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-2 rounded-lg bg-coal-900 border border-coal-700 text-coal-400 hover:text-white hover:border-amber transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4 my-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Name */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-coal-300 uppercase tracking-wider">
                  Full Name & Rank
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-coal-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder="Er. Rajeshwar Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-coal-900/90 border border-coal-700 text-white placeholder-coal-500 text-xs font-mono focus:outline-none focus:border-amber transition-colors"
                  />
                </div>
              </div>

              {/* Designation */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-coal-300 uppercase tracking-wider">
                  Official Designation
                </label>
                <input
                  type="text"
                  required
                  placeholder="Chief Safety Officer / GM Ops"
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-coal-900/90 border border-coal-700 text-white placeholder-coal-500 text-xs font-mono focus:outline-none focus:border-amber transition-colors"
                />
              </div>

              {/* Organization */}
              <div className="sm:col-span-2 space-y-1">
                <label className="text-[11px] font-mono text-coal-300 uppercase tracking-wider">
                  Subsidiary / Mining Enterprise
                </label>
                <select
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-coal-900 border border-coal-700 text-white text-xs font-mono focus:outline-none focus:border-amber transition-colors"
                >
                  {subsidiaries.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-coal-300 uppercase tracking-wider">
                  Official Gov / Corporate Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-coal-400 absolute left-3 top-3.5" />
                  <input
                    type="email"
                    required
                    placeholder="officer@coalindia.in"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-coal-900/90 border border-coal-700 text-white placeholder-coal-500 text-xs font-mono focus:outline-none focus:border-amber transition-colors"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-coal-300 uppercase tracking-wider">
                  Contact Mobile
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-coal-400 absolute left-3 top-3.5" />
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-coal-900/90 border border-coal-700 text-white placeholder-coal-500 text-xs font-mono focus:outline-none focus:border-amber transition-colors"
                  />
                </div>
              </div>

            </div>

            <div className="pt-2">
              <button
                type="submit"
                onMouseEnter={() => soundManager.playHover()}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber to-amber-electric text-coal-950 font-display font-bold text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(245,166,35,0.4)] hover:shadow-[0_0_40px_rgba(245,166,35,0.6)] hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
              >
                <span>Confirm Briefing & Request Pilot Kit</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        ) : (
          <div className="py-8 text-center space-y-4 animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            
            <h3 className="text-2xl font-display font-bold text-white">
              Briefing Request Registered
            </h3>
            
            <p className="text-xs font-mono text-coal-300 max-w-md mx-auto leading-relaxed">
              Thank you, <span className="text-white font-bold">{formData.name}</span>. The Govtech Deployment Directorate for <span className="text-amber">{formData.organization}</span> has received your pilot dossier. Our technical team will reach out at <span className="text-white">{formData.email}</span> within 4 business hours.
            </p>

            <div className="p-4 rounded-xl bg-coal-900 border border-coal-800 text-left text-xs font-mono max-w-md mx-auto space-y-1.5">
              <div className="text-amber font-bold flex items-center gap-1.5">
                <FileCheck2 className="w-4 h-4" />
                <span>INCLUDED PILOT DELIVERABLES:</span>
              </div>
              <div className="text-coal-300">• DGMS Form 24 & Form IV Automated Generator</div>
              <div className="text-coal-300">• 5 Ruggedized Field Inspector Android APKs</div>
              <div className="text-coal-300">• Dedicated GIS Satellite Seam Elevation Dashboard</div>
            </div>

            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-coal-900 border border-coal-700 text-amber hover:border-amber text-xs font-mono"
            >
              Close Window
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
