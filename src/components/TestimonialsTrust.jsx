import React from 'react';
import { Quote, Shield, Award, CheckCircle2, Building2, Landmark, Radio } from 'lucide-react';
import { soundManager } from '../utils/sound';

const testimonials = [
  {
    id: 1,
    quote: 'CoalGuard cut our statutory filing time from 14 days to under 40 minutes while eliminating inspection blind spots across underground seams in Jharia.',
    author: 'Rajeshwar Sharma',
    role: 'Chief Safety Officer',
    organization: 'Bharat Coking Coal Limited (BCCL)',
    location: 'Dhanbad Mining Area',
    impact: '96% Drop in Filing Overheads',
    badge: 'UNDERGROUND OPERATIONS',
  },
  {
    id: 2,
    quote: 'The automated GIS bench slope alerts and real-time gas sensor integration prevented two major slope hazard events within our first quarter in the mega opencast pit.',
    author: 'Er. Debabrata Jena',
    role: 'Director of Technical Operations',
    organization: 'Mahanadi Coalfields Limited (MCL)',
    location: 'Sambalpur & Talcher Pit',
    impact: '2 Catastrophic Incidents Prevented',
    badge: 'MEGA OPENCAST SEAMS',
  },
  {
    id: 3,
    quote: 'Finally, an Indian-tailored govtech solution that seamlessly bridges field officers in remote open-cast pits with corporate HQ and DGMS oversight in real time.',
    author: 'Smt. Ananya Sengupta',
    role: 'General Manager - Statutory Compliance',
    organization: 'Central Coalfields Limited (CCL)',
    location: 'Ranchi Headquarters',
    impact: '100% DGMS Form-24 Conformity',
    badge: 'REGULATORY COMPLIANCE',
  },
  {
    id: 4,
    quote: 'The offline cryptographic mobile ledger ensures that zero inspection logs are lost even when teams operate 400 meters below the surface with zero GSM network.',
    author: 'K. Venkateshwar Rao',
    role: 'Superintendent of Mine Safety',
    organization: 'Singareni Collieries Company Ltd (SCCL)',
    location: 'Godavari Valley Coalfields',
    impact: 'Zero Data Loss on 2,400+ Shifts',
    badge: 'OFFLINE EDGE MOBILITY',
  },
];

const regulatoryPartners = [
  { name: 'MINISTRY OF COAL', sub: 'Govt. of India Aligned', type: 'GOV_MANDATE' },
  { name: 'DGMS', sub: 'Directorate General of Mines Safety', type: 'STATUTORY_NORM' },
  { name: 'COAL INDIA LIMITED', sub: 'CIL Maharatna Ecosystem', type: 'ENTERPRISE_DEPLOY' },
  { name: 'CMPDIL', sub: 'Central Mine Planning & Design', type: 'GIS_PARTNER' },
  { name: 'SCCL', sub: 'Singareni Collieries Co.', type: 'COLLIERY_NETWORK' },
  { name: 'NLC INDIA', sub: 'Neyveli Lignite Corp', type: 'LIGNITE_OPERATIONS' },
];

export default function TestimonialsTrust() {
  return (
    <section 
      id="testimonials"
      className="relative bg-coal-950 text-white py-24 px-4 sm:px-6 lg:px-8 border-t border-coal-800 overflow-hidden"
    >
      {/* Ambience */}
      <div className="absolute inset-0 bg-radar-grid opacity-20 pointer-events-none"></div>
      <div className="absolute top-1/2 right-10 w-[500px] h-[500px] bg-amber/5 blur-[160px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-coal-900 border border-amber/30 text-amber font-mono text-xs uppercase tracking-wider mb-4 shadow-[0_0_15px_rgba(245,166,35,0.15)]">
            <Award className="w-4 h-4 text-safety-yellow" />
            <span>Field-Verified Operational Impact</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-extrabold uppercase tracking-tight">
            Trusted by India’s Leading <span className="text-amber text-glow-amber">Mine Officials & Regulators</span>
          </h2>
          <p className="mt-4 text-coal-300 text-sm sm:text-base font-light">
            Real operational transformations from executive safety officers, pit overmen, and general managers across national coal basins.
          </p>
        </div>

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {testimonials.map((t) => (
            <div
              key={t.id}
              onMouseEnter={() => soundManager.playHover()}
              className="glass-card rounded-2xl p-6 sm:p-7 border border-coal-700/80 hover:border-amber/60 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 group relative shadow-xl"
            >
              {/* Top Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-amber opacity-40 group-hover:opacity-100 transition-opacity"></div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <Quote className="w-8 h-8 text-amber/40 group-hover:text-amber transition-colors" />
                  <span className="text-[10px] font-mono text-amber font-bold px-2 py-0.5 rounded bg-amber/10 border border-amber/20">
                    {t.badge}
                  </span>
                </div>

                <p className="text-coal-200 text-xs sm:text-sm leading-relaxed mb-6 font-light italic">
                  "{t.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-coal-800">
                <div className="text-xs font-mono text-emerald-400 font-bold mb-2">
                  ✓ {t.impact}
                </div>
                <div className="font-display font-bold text-white text-base">
                  {t.author}
                </div>
                <div className="text-xs text-amber font-mono mt-0.5">
                  {t.role}
                </div>
                <div className="text-[11px] text-coal-400 font-mono mt-0.5">
                  {t.organization} • {t.location}
                </div>
              </div>

              {/* Reticles */}
              <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-amber/30"></div>
            </div>
          ))}
        </div>

        {/* Regulatory Authorities & Enterprise Badges Bar */}
        <div className="pt-10 border-t border-coal-800">
          <div className="text-center mb-6">
            <span className="text-xs font-mono text-coal-400 uppercase tracking-widest flex items-center justify-center gap-2">
              <Shield className="w-3.5 h-3.5 text-amber" />
              ALIGNED WITH NATIONAL GOVERNANCE FRAMEWORKS & STATUTORY BODIES
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {regulatoryPartners.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-coal-900/90 border border-coal-800 hover:border-amber/40 flex flex-col items-center text-center justify-center transition-all group shadow-md"
              >
                <div className="text-sm font-display font-bold text-white group-hover:text-amber transition-colors tracking-wide">
                  {item.name}
                </div>
                <div className="text-[10px] font-mono text-coal-400 mt-1 leading-tight">
                  {item.sub}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
