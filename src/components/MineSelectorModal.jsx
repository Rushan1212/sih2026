import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Building2,
  MapPin,
  Flame,
  Activity,
  Truck,
  ArrowRight,
  PlusCircle,
  CheckCircle2,
  X,
  Filter,
  Layers,
  Sparkles,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import { preExistingMines, buildCuratedMineTelemetry } from '../data/mineRecords';
import { soundManager } from '../utils/sound';

export default function MineSelectorModal({ isOpen, onClose, onSelectMine }) {
  const [activeTab, setActiveTab] = useState('browse'); // 'browse' or 'custom'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');

  // Custom Form State
  const [customMine, setCustomMine] = useState({
    name: '',
    owner: 'ECL',
    state: 'West Bengal',
    type: 'UG',
    production: '1.25',
    lat: '23.6700',
    lng: '87.1500',
    activeWorkers: '1450',
    activeHEMM: '64',
    complianceRate: '98.5',
  });

  const companies = ['ALL', 'ECL', 'BCCL', 'CCL', 'SECL', 'MCL', 'NCL', 'WCL', 'SCCL', 'Captive'];
  const mineTypes = ['ALL', 'UG', 'OC', 'Mixed'];

  // Lock body scroll when modal is active so background doesn't scroll
  useEffect(() => {
    if (isOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [isOpen]);

  // Handle ESC key listener to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filteredMines = useMemo(() => {
    return preExistingMines.filter((mine) => {
      const matchesSearch =
        mine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mine.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mine.state.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCompany =
        selectedCompany === 'ALL'
          ? true
          : selectedCompany === 'Captive'
          ? mine.sector === 'Private' ||
            mine.sector === 'State Govt' ||
            ['CESC', 'SAIL', 'TSL', 'NTPC', 'RRVUNL', 'BLMCL'].includes(mine.owner)
          : mine.owner === selectedCompany;

      const matchesType = selectedType === 'ALL' ? true : mine.type === selectedType;

      return matchesSearch && matchesCompany && matchesType;
    });
  }, [searchQuery, selectedCompany, selectedType]);

  if (!isOpen || typeof document === 'undefined') return null;

  const handlePickMine = (mineRecord) => {
    soundManager.playClick();
    const curatedData = buildCuratedMineTelemetry(mineRecord);
    onSelectMine(curatedData);
    onClose();
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    soundManager.playSuccess();
    const parsedMine = {
      name: customMine.name || 'Custom Pit Working',
      owner: customMine.owner || 'Coal India Subsidiary',
      state: customMine.state || 'Jharkhand',
      type: customMine.type,
      production: parseFloat(customMine.production) || 1.0,
      lat: parseFloat(customMine.lat) || 23.68,
      lng: parseFloat(customMine.lng) || 86.85,
      activeWorkers: parseInt(customMine.activeWorkers, 10) || 1200,
      activeHEMM: parseInt(customMine.activeHEMM, 10) || 80,
      complianceRate: parseFloat(customMine.complianceRate) || 98.4,
      sector: 'Custom Entry',
      mineral: 'Coal',
      basin: `${customMine.owner} Mining Sector`,
    };
    const curatedData = buildCuratedMineTelemetry(parsedMine);
    onSelectMine(curatedData);
    onClose();
  };

  return createPortal(
    <AnimatePresence>
      <div
        onClick={onClose}
        className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 md:p-6 bg-black/85 backdrop-blur-2xl cursor-pointer"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 99999,
        }}
      >
        {/* Ambient background glow */}
        <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-amber/[0.04] blur-[160px] pointer-events-none rounded-full" />

        {/* Modal Container: Screen-Centric, max-h 90vh, flex-col with pinned header */}
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-5xl max-h-[90vh] flex flex-col bg-[#0F0F1A] border border-white/[0.09] rounded-3xl shadow-[0_30px_90px_rgba(0,0,0,0.85)] font-mono text-xs text-offwhite cursor-default overflow-hidden"
        >
          {/* Top Header - PINNED AT TOP */}
          <div className="p-5 sm:p-7 pb-4 border-b border-white/[0.08] space-y-4 shrink-0 bg-[#0F0F1A]">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber/10 border border-amber/30 text-amber text-[11px] font-mono font-semibold">
                  <Compass className="w-3.5 h-3.5" />
                  <span>COLLIERY & SUBSIDIARY ONBOARDING</span>
                </div>
                <h2 className="font-display font-extrabold text-xl sm:text-2xl md:text-3xl text-white tracking-tight">
                  Select Mine or Company to Explore
                </h2>
                <p className="text-dim text-xs font-sans font-normal max-w-xl leading-relaxed">
                  Launch the KhanijAI command dashboard for an existing Coal India colliery or curate a
                  custom mining block.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="hidden sm:inline text-[10px] text-dim px-2 py-0.5 rounded border border-white/[0.08]">
                  ESC TO CLOSE
                </span>
                <button
                  onClick={() => {
                    soundManager.playClick();
                    onClose();
                  }}
                  className="w-8 h-8 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] text-dim hover:text-white flex items-center justify-center transition-colors border border-white/[0.08]"
                  title="Close modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* View Switcher Tabs (Browse Registry vs Custom Form) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-1.5 bg-black/40 rounded-2xl border border-white/[0.06] w-full max-w-md">
              <button
                onClick={() => {
                  soundManager.playHover();
                  setActiveTab('browse');
                }}
                className={`flex-1 py-2 px-3 rounded-xl text-[11px] sm:text-xs font-mono font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                  activeTab === 'browse'
                    ? 'bg-amber text-coal font-bold shadow-[0_0_18px_rgba(245,166,35,0.3)]'
                    : 'text-dim hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Pre-Existing Records</span>
              </button>

              <button
                onClick={() => {
                  soundManager.playHover();
                  setActiveTab('custom');
                }}
                className={`flex-1 py-2 px-3 rounded-xl text-[11px] sm:text-xs font-mono font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                  activeTab === 'custom'
                    ? 'bg-amber text-coal font-bold shadow-[0_0_18px_rgba(245,166,35,0.3)]'
                    : 'text-dim hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Curate Custom Mine</span>
              </button>
            </div>
          </div>

          {/* Scrollable Body Content */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 custom-scrollbar">
            {/* ===================================================================== */}
            {/* TAB 1: BROWSE PRE-EXISTING MINE RECORDS */}
            {/* ===================================================================== */}
            {activeTab === 'browse' && (
              <div className="space-y-6">
                {/* Search & Filters */}
                <div className="space-y-4">
                  {/* Search Bar */}
                  <div className="relative w-full">
                    <Search className="w-4 h-4 text-dim absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Search by mine name, owner (ECL, BCCL, SECL...), or state..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#141424] border border-white/[0.08] focus:border-amber text-white text-xs sm:text-sm font-mono placeholder:text-dim/60 focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Company Filter Pills */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono">
                    <span className="text-dim text-[11px] uppercase tracking-wider pr-1 shrink-0">
                      Company:
                    </span>
                    {companies.map((comp) => (
                      <button
                        key={comp}
                        onClick={() => {
                          soundManager.playHover();
                          setSelectedCompany(comp);
                        }}
                        className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap shrink-0 ${
                          selectedCompany === comp
                            ? 'bg-amber/20 border border-amber text-amber font-bold'
                            : 'bg-white/[0.04] border border-white/[0.06] text-dim hover:text-white'
                        }`}
                      >
                        {comp}
                      </button>
                    ))}
                  </div>

                  {/* Mine Type Filter */}
                  <div className="flex items-center gap-2 text-xs font-mono overflow-x-auto pb-1">
                    <span className="text-dim text-[11px] uppercase tracking-wider pr-1 shrink-0">
                      Working Type:
                    </span>
                    {mineTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() => {
                          soundManager.playHover();
                          setSelectedType(type);
                        }}
                        className={`px-3 py-1 rounded-lg transition-all whitespace-nowrap shrink-0 ${
                          selectedType === type
                            ? 'bg-teal/20 border border-teal text-teal font-bold'
                            : 'bg-white/[0.03] border border-white/[0.06] text-dim hover:text-white'
                        }`}
                      >
                        {type === 'ALL'
                          ? 'All Types'
                          : type === 'UG'
                          ? 'Underground (UG)'
                          : type === 'OC'
                          ? 'Opencast (OC)'
                          : 'Mixed Working'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mine Records Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredMines.length > 0 ? (
                    filteredMines.map((mine, idx) => (
                      <div
                        key={`${mine.name}-${idx}`}
                        onClick={() => handlePickMine(mine)}
                        className="p-5 rounded-2xl bg-[#141424]/90 border border-white/[0.07] hover:border-amber/50 hover:bg-[#18182D] transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-3 group shadow-sm hover:shadow-amber-glow/10"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="px-2.5 py-0.5 rounded-md bg-amber/15 border border-amber/30 text-amber text-[10px] font-mono font-bold">
                              {mine.owner}
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-white/[0.05] border border-white/[0.08] text-dim text-[10px] font-mono">
                              {mine.type === 'UG'
                                ? 'Underground'
                                : mine.type === 'OC'
                                ? 'Opencast'
                                : 'Mixed Working'}
                            </span>
                          </div>

                          <h4 className="font-display font-bold text-base text-white group-hover:text-amber transition-colors line-clamp-1">
                            {mine.name}
                          </h4>

                          <div className="flex items-center gap-1.5 text-xs text-dim font-mono">
                            <MapPin className="w-3 h-3 text-dim shrink-0" />
                            <span className="line-clamp-1">{mine.state}</span>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono">
                          <div>
                            <span className="text-dim text-[10px] block">ANNUAL PROD</span>
                            <span className="text-teal font-bold">{mine.production} MT</span>
                          </div>
                          <div className="flex items-center gap-1 text-amber text-xs font-bold group-hover:translate-x-1 transition-transform">
                            <span>Select</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-12 text-center text-dim font-mono text-xs space-y-2">
                      <p>No verified mine records matching "{searchQuery}".</p>
                      <button
                        onClick={() => setActiveTab('custom')}
                        className="text-amber hover:underline font-bold"
                      >
                        + Add "{searchQuery}" as a custom colliery
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ===================================================================== */}
            {/* TAB 2: REGISTER / CURATE CUSTOM MINE RECORD */}
            {/* ===================================================================== */}
            {activeTab === 'custom' && (
              <form onSubmit={handleCustomSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {/* Mine Name */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-dim uppercase">
                      Mine / Colliery Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sonepur Bazari Extension"
                      value={customMine.name}
                      onChange={(e) => setCustomMine({ ...customMine, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#141424] border border-white/[0.08] focus:border-amber text-white text-xs font-mono focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Owner / Subsidiary */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-dim uppercase">Company Owner *</label>
                    <select
                      value={customMine.owner}
                      onChange={(e) => setCustomMine({ ...customMine, owner: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#141424] border border-white/[0.08] focus:border-amber text-white text-xs font-mono focus:outline-none transition-colors"
                    >
                      <option value="ECL">Eastern Coalfields Limited (ECL)</option>
                      <option value="BCCL">Bharat Coking Coal Limited (BCCL)</option>
                      <option value="CCL">Central Coalfields Limited (CCL)</option>
                      <option value="SECL">South Eastern Coalfields Limited (SECL)</option>
                      <option value="MCL">Mahanadi Coalfields Limited (MCL)</option>
                      <option value="NCL">Northern Coalfields Limited (NCL)</option>
                      <option value="WCL">Western Coalfields Limited (WCL)</option>
                      <option value="SCCL">Singareni Collieries (SCCL)</option>
                      <option value="Captive">Captive / Private Mining Block</option>
                    </select>
                  </div>

                  {/* State / UT */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-dim uppercase">
                      State / Union Territory *
                    </label>
                    <select
                      value={customMine.state}
                      onChange={(e) => setCustomMine({ ...customMine, state: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#141424] border border-white/[0.08] focus:border-amber text-white text-xs font-mono focus:outline-none transition-colors"
                    >
                      <option value="West Bengal">West Bengal</option>
                      <option value="Jharkhand">Jharkhand</option>
                      <option value="Chhattisgarh">Chhattisgarh</option>
                      <option value="Odisha">Odisha</option>
                      <option value="Madhya Pradesh">Madhya Pradesh</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Telangana">Telangana</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                      <option value="Assam">Assam</option>
                    </select>
                  </div>

                  {/* Type of Mine */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-dim uppercase">Type of Working *</label>
                    <select
                      value={customMine.type}
                      onChange={(e) => setCustomMine({ ...customMine, type: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#141424] border border-white/[0.08] focus:border-amber text-white text-xs font-mono focus:outline-none transition-colors"
                    >
                      <option value="UG">Deep Underground (UG)</option>
                      <option value="OC">Opencast Bench (OC)</option>
                      <option value="Mixed">Mixed (UG & OC Combined)</option>
                    </select>
                  </div>

                  {/* Annual Production */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-dim uppercase">
                      Annual Production (MT/year)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="e.g. 2.4"
                      value={customMine.production}
                      onChange={(e) => setCustomMine({ ...customMine, production: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#141424] border border-white/[0.08] focus:border-amber text-white text-xs font-mono focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Coordinates */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-dim uppercase">Latitude & Longitude</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Lat: 23.68"
                        value={customMine.lat}
                        onChange={(e) => setCustomMine({ ...customMine, lat: e.target.value })}
                        className="w-full px-3 py-3 rounded-xl bg-[#141424] border border-white/[0.08] text-white text-xs font-mono"
                      />
                      <input
                        type="text"
                        placeholder="Lng: 87.12"
                        value={customMine.lng}
                        onChange={(e) => setCustomMine({ ...customMine, lng: e.target.value })}
                        className="w-full px-3 py-3 rounded-xl bg-[#141424] border border-white/[0.08] text-white text-xs font-mono"
                      />
                    </div>
                  </div>

                  {/* Active Workforce */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-dim uppercase">
                      Shift Personnel Muster
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 1450"
                      value={customMine.activeWorkers}
                      onChange={(e) => setCustomMine({ ...customMine, activeWorkers: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#141424] border border-white/[0.08] text-white text-xs font-mono"
                    />
                  </div>

                  {/* Active HEMM Machinery */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-dim uppercase">HEMM Machinery Count</label>
                    <input
                      type="number"
                      placeholder="e.g. 84"
                      value={customMine.activeHEMM}
                      onChange={(e) => setCustomMine({ ...customMine, activeHEMM: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#141424] border border-white/[0.08] text-white text-xs font-mono"
                    />
                  </div>

                  {/* Baseline Compliance Target */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-dim uppercase">
                      Baseline CMR 2017 Score (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="e.g. 98.4"
                      value={customMine.complianceRate}
                      onChange={(e) => setCustomMine({ ...customMine, complianceRate: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#141424] border border-white/[0.08] text-white text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-white/[0.08] flex justify-end">
                  <button
                    type="submit"
                    className="px-8 py-3.5 rounded-xl bg-amber text-coal font-bold text-xs font-mono tracking-wider uppercase hover:bg-amber/90 transition-all shadow-[0_0_25px_rgba(245,166,35,0.3)] flex items-center gap-2"
                  >
                    <span>Curate Mock Telemetry & Launch Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}
