import React, { useState } from 'react';
import { X, CheckCircle2 } from 'lucide-react';

export default function DemoModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subsidiary: 'Bharat Coking Coal Limited (BCCL)',
    phone: '',
  });
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
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
    'Private / Captive Coal Mine Operator',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D0D0D]/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-[#161616] p-8 sm:p-10 border-l-2 border-[#F5A623] shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-[#8A8A8A] hover:text-white p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-xs uppercase tracking-widest text-[#F5A623] font-bold mb-2">
          Enterprise Pilot
        </div>
        <h3 className="text-3xl font-headline uppercase text-white tracking-wide mb-2">
          Request Demonstration
        </h3>
        <p className="text-[#8A8A8A] text-xs leading-relaxed mb-6 font-light">
          14-day zero-disruption integration trial for Indian coal mining subsidiaries.
        </p>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="text-[11px] uppercase tracking-wider text-[#8A8A8A] block mb-1.5">
                Full Name & Rank
              </label>
              <input
                type="text"
                required
                placeholder="Er. Rajeshwar Sharma"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#0D0D0D] border border-[#242424] text-white text-xs focus:outline-none focus:border-[#F5A623]"
              />
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-wider text-[#8A8A8A] block mb-1.5">
                Official Email
              </label>
              <input
                type="email"
                required
                placeholder="officer@coalindia.in"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#0D0D0D] border border-[#242424] text-white text-xs focus:outline-none focus:border-[#F5A623]"
              />
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-wider text-[#8A8A8A] block mb-1.5">
                Mining Subsidiary
              </label>
              <select
                value={formData.subsidiary}
                onChange={(e) => setFormData({ ...formData, subsidiary: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#0D0D0D] border border-[#242424] text-white text-xs focus:outline-none focus:border-[#F5A623]"
              >
                {subsidiaries.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-wider text-[#8A8A8A] block mb-1.5">
                Contact Phone
              </label>
              <input
                type="tel"
                required
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#0D0D0D] border border-[#242424] text-white text-xs focus:outline-none focus:border-[#F5A623]"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-[#F5A623] text-[#0D0D0D] font-bold text-xs uppercase tracking-wider hover:bg-[#FFA826] transition-all"
              >
                Schedule Briefing
              </button>
            </div>
          </form>
        ) : (
          <div className="py-6 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-[#F5A623] mx-auto" />
            <h4 className="text-xl font-headline uppercase text-white">Briefing Registered</h4>
            <p className="text-xs text-[#8A8A8A]">
              Thank you. Our deployment directorate has dispatched documentation to <span className="text-white">{formData.email}</span>.
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2 bg-[#242424] text-white text-xs uppercase tracking-wider"
            >
              Close
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
