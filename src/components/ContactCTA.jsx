import React, { useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function ContactCTA({ onOpenDemo }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <section 
      id="contact"
      className="py-32 px-6 bg-[#0D0D0D] border-t border-[#F5A623]/20 text-center"
    >
      <div className="max-w-3xl mx-auto">
        
        <div className="text-xs uppercase tracking-widest text-[#F5A623] font-bold mb-4">
          Enterprise Deployment
        </div>

        <h2 className="text-4xl sm:text-6xl md:text-7xl font-headline tracking-tight uppercase leading-[0.95] text-white mb-6">
          Ready to Govern <br />
          <span className="text-[#F5A623]">Your Coalfields?</span>
        </h2>

        <p className="text-[#8A8A8A] text-base sm:text-lg max-w-xl mx-auto font-light leading-relaxed mb-10">
          Deploy CoalGuard AI across your mining blocks in under 14 days with zero disruption to active shift rosters.
        </p>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row justify-center gap-3 max-w-md mx-auto mb-8">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter official email..."
              className="px-4 py-3.5 bg-[#161616] border border-[#242424] text-white placeholder-[#8A8A8A] text-sm focus:outline-none focus:border-[#F5A623] transition-colors flex-1"
            />
            <button
              type="submit"
              className="px-6 py-3.5 bg-[#F5A623] text-[#0D0D0D] font-bold text-xs uppercase tracking-wider hover:bg-[#FFA826] active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <div className="p-6 bg-[#161616] border-l-2 border-[#F5A623] max-w-md mx-auto text-left mb-8 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#F5A623] mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-sm font-bold text-white uppercase font-headline tracking-wider">
                Request Dispatched
              </div>
              <p className="text-xs text-[#8A8A8A] mt-1">
                Our deployment directorate will contact <span className="text-white">{email}</span> within 4 business hours.
              </p>
            </div>
          </div>
        )}

        <div className="text-xs text-[#8A8A8A] uppercase tracking-wider">
          Or reach us directly at <a href="mailto:gov@coalguard.ai" className="text-[#F5A623] hover:underline">gov@coalguard.ai</a>
        </div>

      </div>
    </section>
  );
}
