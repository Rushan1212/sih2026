import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Shield,
  HardHat,
  Camera,
  ChevronDown,
  Layers,
  Cpu,
  Radio,
  Bell,
  AlertTriangle,
  Compass,
  Sparkles,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Users,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { soundManager } from '../utils/sound';

export default function Navbar({ onOpenDemo, onExplorePlatform, onNavigate }) {
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null); // 'platform' | 'compliance' | 'access' | null
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSectionOpen, setMobileSectionOpen] = useState('platform'); // Accordion tab in mobile drawer
  const { user, isAuthenticated, isAuthority } = useAuth();
  const navContainerRef = useRef(null);

  // Track window scroll for glassmorphic navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click or ESC key
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navContainerRef.current && !navContainerRef.current.contains(e.target)) {
        setActiveDropdown(null);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveDropdown(null);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [mobileMenuOpen]);

  const handleNav = (route) => {
    soundManager.playClick();
    setActiveDropdown(null);
    setMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(route);
    } else if (typeof window !== 'undefined') {
      window.location.hash = route.replace(/^\//, '');
    }
  };

  const handleHashNav = (hash) => {
    soundManager.playClick();
    setActiveDropdown(null);
    setMobileMenuOpen(false);
    if (typeof window !== 'undefined') {
      const targetElement = document.querySelector(hash);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.hash = hash.replace(/^#/, '');
      }
    }
  };

  const toggleDropdown = (name) => {
    soundManager.playClick();
    setActiveDropdown((prev) => (prev === name ? null : name));
  };

  // --------------------------------------------------------------------------
  // NAV DATA: 3 GROUPED SECTIONS (Platform, Compliance, Access & Portals)
  // --------------------------------------------------------------------------
  const platformItems = [
    {
      title: 'Interactive Mine Radar',
      desc: 'Real-time telemetry, 3D pit bench layers, and gas sensor mesh',
      icon: Radio,
      tag: 'LIVE',
      tagColor: 'bg-amber text-coal font-bold',
      action: () => {
        if (onExplorePlatform) onExplorePlatform();
      },
    },
    {
      title: 'Field Inspector (Offline PWA)',
      desc: 'Sub-meter mobile logging with zero-connectivity edge sync',
      icon: Camera,
      tag: 'PWA',
      tagColor: 'bg-teal/20 border border-teal/40 text-teal',
      action: () => handleNav('/field-capture'),
    },
    {
      title: 'Hazard Outbox Buffer',
      desc: 'Encrypted local statutory queue & urgent incident dispatcher',
      icon: AlertTriangle,
      tag: null,
      action: () => handleNav('/hazard-outbox'),
    },
    {
      title: 'Autonomous System Architecture',
      desc: '10 core interconnected capabilities from pit face to boardroom',
      icon: Layers,
      tag: null,
      action: () => handleHashNav('#platform'),
    },
    {
      title: 'Neural AI Risk Core',
      desc: 'Predictive anomalies, 14-day forecasts, & statutory pattern detection',
      icon: Cpu,
      tag: null,
      action: () => handleHashNav('#ai-engine'),
    },
  ];

  const complianceItems = [
    {
      title: 'DGMS CMR 2017 Framework',
      desc: 'Automated Form-IV / Form-24 generation and regulatory safeguards',
      icon: Shield,
      tag: 'DGMS',
      tagColor: 'bg-amber/15 border border-amber/40 text-amber font-bold',
      action: () => handleHashNav('#crisis'),
    },
    {
      title: 'Statutory Announcements & Feed',
      desc: 'Official gazettes, safety circulars, and real-time mine advisories',
      icon: Bell,
      tag: 'FEED',
      tagColor: 'bg-white/10 text-offwhite',
      action: () => handleNav('/announcements'),
    },
    {
      title: 'Operational Perspectives',
      desc: 'Specialized oversight suites for Inspectors, Managers, & Regulators',
      icon: Compass,
      tag: null,
      action: () => handleHashNav('#perspectives'),
    },
    {
      title: 'Safety Ledger & Metrics',
      desc: 'Cryptographic compliance audit trails & subsidiary benchmarks',
      icon: CheckCircle2,
      tag: null,
      action: () => handleHashNav('#crisis'),
    },
    {
      title: 'Workforce & Credentials',
      desc: 'Statutory officer registries, gas-testing licenses, & shift rosters',
      icon: Users,
      tag: null,
      action: () => handleNav('/users'),
    },
  ];

  return (
    <motion.header
      ref={navContainerRef}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-3 sm:px-6 lg:px-8 py-3"
      style={{
        backgroundColor: activeDropdown || scrolled || mobileMenuOpen ? '#0B0B14' : undefined,
      }}
      animate={{
        backgroundColor: activeDropdown || scrolled || mobileMenuOpen ? '#0B0B14' : 'rgba(11, 11, 20, 0.88)',
        backdropFilter: 'blur(20px)',
        borderBottom: activeDropdown || scrolled || mobileMenuOpen ? '1px solid rgba(245, 166, 35, 0.3)' : '1px solid rgba(255, 255, 255, 0.08)',
      }}
      transition={{ duration: 0.25 }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo: amber ◆ + "KhanijAI" */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            soundManager.playClick();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2.5 group flex-shrink-0"
        >
          <span className="w-8 h-8 rounded-xl bg-amber/15 border border-amber/40 flex items-center justify-center text-amber text-sm font-bold group-hover:rotate-45 transition-transform duration-300 shadow-amber-glow">
            ◆
          </span>
          <span className="font-display font-extrabold text-xl sm:text-2xl tracking-tight text-white">
            Khanij<span className="text-amber">AI</span>
          </span>
        </a>

        {/* ================================================================== */}
        {/* DESKTOP NAV: AT MAX 3 GROUPED DROPDOWNS (Platform, Compliance, Access) */}
        {/* ================================================================== */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
          {/* DROPDOWN 1: PLATFORM */}
          <div className="relative">
            <button
              type="button"
              onClick={() => toggleDropdown('platform')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs lg:text-sm font-medium transition-all ${
                activeDropdown === 'platform'
                  ? 'bg-[#18182A] text-amber border border-amber/40 shadow-amber-glow font-semibold'
                  : 'text-offwhite/90 hover:text-white hover:bg-white/[0.06]'
              }`}
              aria-expanded={activeDropdown === 'platform'}
            >
              <Layers className="w-3.5 h-3.5 text-amber" />
              <span>Platform</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  activeDropdown === 'platform' ? 'rotate-180 text-amber' : 'text-dim'
                }`}
              />
            </button>

            <AnimatePresence>
              {activeDropdown === 'platform' && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.16, ease: 'easeOut' }}
                  style={{ backgroundColor: '#0B0B14' }}
                  className="absolute left-0 mt-2.5 w-[380px] lg:w-[420px] bg-[#0B0B14] border-2 border-amber/40 rounded-2xl p-3 shadow-[0_30px_90px_rgba(0,0,0,0.98),0_0_35px_rgba(245,166,35,0.15)] z-50 space-y-1.5"
                >
                  <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-widest text-amber font-bold border-b border-white/[0.1] bg-[#141424] rounded-lg mb-1.5 flex items-center justify-between shadow-sm">
                    <span>Architecture & Telemetry</span>
                    <span className="text-dim text-[9px]">5 MODULES</span>
                  </div>

                  {platformItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.title}
                        type="button"
                        onClick={() => {
                          setActiveDropdown(null);
                          item.action();
                        }}
                        className="w-full text-left p-2.5 rounded-xl bg-[#121220] hover:bg-[#1C1C32] border border-white/[0.07] hover:border-amber/40 transition-all flex items-start gap-3 group shadow-sm"
                      >
                        <div className="w-8 h-8 rounded-lg bg-[#0A0A12] border border-white/[0.1] group-hover:border-amber/50 flex items-center justify-center text-amber shrink-0 transition-colors mt-0.5 shadow-inner">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white group-hover:text-amber transition-colors truncate">
                              {item.title}
                            </span>
                            {item.tag && (
                              <span
                                className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${item.tagColor}`}
                              >
                                {item.tag}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-dim/90 line-clamp-1 leading-snug mt-0.5 font-sans">
                            {item.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* DROPDOWN 2: COMPLIANCE */}
          <div className="relative">
            <button
              type="button"
              onClick={() => toggleDropdown('compliance')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs lg:text-sm font-medium transition-all ${
                activeDropdown === 'compliance'
                  ? 'bg-[#18182A] text-amber border border-amber/40 shadow-amber-glow font-semibold'
                  : 'text-offwhite/90 hover:text-white hover:bg-white/[0.06]'
              }`}
              aria-expanded={activeDropdown === 'compliance'}
            >
              <Shield className="w-3.5 h-3.5 text-amber" />
              <span>Compliance</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  activeDropdown === 'compliance' ? 'rotate-180 text-amber' : 'text-dim'
                }`}
              />
            </button>

            <AnimatePresence>
              {activeDropdown === 'compliance' && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.16, ease: 'easeOut' }}
                  style={{ backgroundColor: '#0B0B14' }}
                  className="absolute left-0 mt-2.5 w-[380px] lg:w-[420px] bg-[#0B0B14] border-2 border-amber/40 rounded-2xl p-3 shadow-[0_30px_90px_rgba(0,0,0,0.98),0_0_35px_rgba(245,166,35,0.15)] z-50 space-y-1.5"
                >
                  <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-widest text-amber font-bold border-b border-white/[0.1] bg-[#141424] rounded-lg mb-1.5 flex items-center justify-between shadow-sm">
                    <span>Statutory & Regulations</span>
                    <span className="text-dim text-[9px]">DGMS CMR 2017</span>
                  </div>

                  {complianceItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.title}
                        type="button"
                        onClick={() => {
                          setActiveDropdown(null);
                          item.action();
                        }}
                        className="w-full text-left p-2.5 rounded-xl bg-[#121220] hover:bg-[#1C1C32] border border-white/[0.07] hover:border-amber/40 transition-all flex items-start gap-3 group shadow-sm"
                      >
                        <div className="w-8 h-8 rounded-lg bg-[#0A0A12] border border-white/[0.1] group-hover:border-amber/50 flex items-center justify-center text-amber shrink-0 transition-colors mt-0.5 shadow-inner">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white group-hover:text-amber transition-colors truncate">
                              {item.title}
                            </span>
                            {item.tag && (
                              <span
                                className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${item.tagColor}`}
                              >
                                {item.tag}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-dim/90 line-clamp-1 leading-snug mt-0.5 font-sans">
                            {item.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* DROPDOWN 3: ACCESS & PORTALS (Session, Demo, Contact) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => toggleDropdown('access')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs lg:text-sm font-medium transition-all ${
                activeDropdown === 'access'
                  ? 'bg-[#18182A] text-amber border border-amber/40 shadow-amber-glow font-semibold'
                  : 'text-offwhite/90 hover:text-white hover:bg-white/[0.06]'
              }`}
              aria-expanded={activeDropdown === 'access'}
            >
              <User className="w-3.5 h-3.5 text-amber" />
              <span>Access & Portals</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  activeDropdown === 'access' ? 'rotate-180 text-amber' : 'text-dim'
                }`}
              />
            </button>

            <AnimatePresence>
              {activeDropdown === 'access' && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.16, ease: 'easeOut' }}
                  style={{ backgroundColor: '#0B0B14' }}
                  className="absolute right-0 mt-2.5 w-[360px] lg:w-[400px] bg-[#0B0B14] border-2 border-amber/40 rounded-2xl p-3 shadow-[0_30px_90px_rgba(0,0,0,0.98),0_0_35px_rgba(245,166,35,0.15)] z-50 space-y-2"
                >
                  <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-widest text-amber font-bold border-b border-white/[0.1] bg-[#141424] rounded-lg flex items-center justify-between shadow-sm">
                    <span>Identity & Deployment</span>
                    <span className="text-teal font-mono">CONNECTED</span>
                  </div>

                  {/* Persona / Auth Card */}
                  <div className="p-3 rounded-xl bg-[#141424] border border-white/[0.1] hover:border-amber/40 transition-all shadow-sm">
                    {isAuthenticated && user ? (
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-amber/20 border border-amber/50 flex items-center justify-center text-amber shrink-0">
                            {isAuthority ? <Shield className="w-4 h-4" /> : <HardHat className="w-4 h-4" />}
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-white truncate">
                              {user.user_metadata?.full_name || user.email}
                            </div>
                            <div className="text-[10px] font-mono text-amber truncate">
                              Role: {user.role}
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleNav('/login')}
                          className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase rounded-lg bg-[#222238] hover:bg-amber hover:text-coal text-offwhite transition-all shrink-0 border border-white/[0.1]"
                        >
                          Switch
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-white">Statutory Sign-In</div>
                          <p className="text-[11px] text-dim/90 line-clamp-1 mt-0.5">
                            Officer, Mine Manager, or DGMS Inspector
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleNav('/login')}
                          className="px-3 py-1.5 text-xs font-mono font-bold uppercase rounded-lg bg-amber text-coal hover:bg-amber/90 transition-all shrink-0 shadow-amber-glow"
                        >
                          Login →
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Actions in Dropdown */}
                  <div className="space-y-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveDropdown(null);
                        soundManager.playClick();
                        if (onExplorePlatform) onExplorePlatform();
                      }}
                      className="w-full p-2.5 rounded-xl bg-[#141829] border border-amber/40 hover:bg-[#1A2038] transition-all text-left flex items-center justify-between group shadow-sm"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#0B0B14] border border-amber/40 flex items-center justify-center text-amber shrink-0 shadow-inner">
                          <Radio className="w-4 h-4 text-amber animate-pulse" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white group-hover:text-amber transition-colors">
                            Launch Mine Radar
                          </div>
                          <div className="text-[10px] text-dim/90">Interactive pit exploration</div>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-amber group-hover:translate-x-0.5 transition-transform" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveDropdown(null);
                        soundManager.playClick();
                        if (onOpenDemo) onOpenDemo();
                      }}
                      className="w-full p-2.5 rounded-xl bg-[#121220] hover:bg-[#1C1C32] border border-white/[0.07] hover:border-amber/40 transition-all text-left flex items-center justify-between group shadow-sm"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#0A0A12] border border-white/[0.1] group-hover:border-amber/50 flex items-center justify-center text-amber shrink-0 shadow-inner">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white group-hover:text-amber transition-colors">
                            Request Executive Briefing
                          </div>
                          <div className="text-[10px] text-dim/90">14-day subsidiary deployment</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-dim bg-[#1A1A2E] px-2 py-0.5 rounded border border-white/[0.06]">14d SLA</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleHashNav('#cta')}
                      className="w-full p-2.5 rounded-xl bg-[#121220] hover:bg-[#1C1C32] border border-white/[0.07] hover:border-amber/40 transition-all text-left flex items-center justify-between group shadow-sm"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#0A0A12] border border-white/[0.1] group-hover:border-amber/50 flex items-center justify-center text-amber shrink-0 shadow-inner">
                          <ExternalLink className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white group-hover:text-amber transition-colors">
                            DGMS Command Liaison
                          </div>
                          <div className="text-[10px] text-dim/90">Emergency operational contact</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-dim bg-[#1A1A2E] px-2 py-0.5 rounded border border-white/[0.06]">24/7 Desk</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        {/* ================================================================== */}
        {/* DESKTOP RIGHT FLANK: ONE PRIMARY ACTION + AUTH PILL (Saves Space)  */}
        {/* ================================================================== */}
        <div className="hidden sm:flex items-center gap-2 lg:gap-3 flex-shrink-0">
          {/* Direct Explore Platform Button */}
          <motion.button
            type="button"
            onClick={() => {
              soundManager.playClick();
              if (onExplorePlatform) onExplorePlatform();
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-3.5 py-2 text-xs font-bold uppercase tracking-wider bg-amber text-coal rounded-xl hover:bg-amber/90 transition-all font-mono shadow-[0_0_20px_rgba(245,166,35,0.25)] flex items-center gap-1.5"
          >
            <span>Explore Platform</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </motion.button>

          {/* Quick Login / Persona Button */}
          {isAuthenticated && user ? (
            <motion.button
              type="button"
              onClick={() => handleNav('/login')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`px-3 py-2 text-xs font-semibold rounded-xl border font-mono transition-all flex items-center gap-1.5 ${
                isAuthority
                  ? 'bg-amber/15 border-amber/40 text-amber'
                  : 'bg-teal/15 border-teal/40 text-teal'
              }`}
              title="Click to view statutory identity or switch persona"
            >
              {isAuthority ? <Shield className="w-3.5 h-3.5 text-amber" /> : <HardHat className="w-3.5 h-3.5 text-teal" />}
              <span className="truncate max-w-[90px]">{user.user_metadata?.full_name || user.email}</span>
            </motion.button>
          ) : (
            <motion.button
              type="button"
              onClick={() => handleNav('/login')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-amber border border-amber/40 rounded-xl hover:bg-amber/10 transition-colors duration-200 font-mono font-bold"
            >
              Login
            </motion.button>
          )}
        </div>

        {/* ================================================================== */}
        {/* MOBILE HAMBURGER TOGGLE BUTTON                                     */}
        {/* ================================================================== */}
        <div className="flex items-center gap-2 md:hidden">
          {/* Compact Explore button on mobile */}
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              if (onExplorePlatform) onExplorePlatform();
            }}
            className="px-2.5 py-1.5 text-[11px] font-bold uppercase font-mono bg-amber text-coal rounded-lg shadow-amber-glow"
          >
            Radar ↗
          </button>

          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="text-offwhite p-2 rounded-xl border border-white/[0.12] bg-white/[0.04] hover:border-amber transition-colors focus:outline-none"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-amber" />
            ) : (
              <Menu className="w-5 h-5 text-offwhite" />
            )}
          </button>
        </div>
      </div>

      {/* ================================================================== */}
      {/* MOBILE RESPONSIVE DRAWER (Grouped by the 3 Sections)                */}
      {/* ================================================================== */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            style={{ backgroundColor: '#0B0B14' }}
            className="md:hidden mt-3 max-h-[85vh] overflow-y-auto bg-[#0B0B14] border-2 border-amber/40 rounded-2xl shadow-[0_30px_90px_rgba(0,0,0,0.98),0_0_35px_rgba(245,166,35,0.15)] p-4 space-y-4"
          >
            {/* User Session Banner if logged in */}
            {isAuthenticated && user ? (
              <div className="p-3 bg-[#141424] rounded-xl border border-amber/40 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber/20 border border-amber/50 flex items-center justify-center text-amber shrink-0 shadow-inner">
                    {isAuthority ? <Shield className="w-4 h-4" /> : <HardHat className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">
                      {user.user_metadata?.full_name || user.email}
                    </div>
                    <div className="text-[10px] font-mono text-amber">
                      Role: {user.role}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleNav('/login')}
                  className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase bg-amber text-coal rounded-md hover:bg-amber/90 transition-all shadow-amber-glow"
                >
                  Switch
                </button>
              </div>
            ) : (
              <div className="p-3 bg-[#141424] rounded-xl border border-amber/40 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber/20 border border-amber/50 flex items-center justify-center text-amber shrink-0 shadow-inner">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Not Signed In</div>
                    <div className="text-[10px] font-mono text-dim">Authentication required</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleNav('/login')}
                  className="px-3 py-1.5 text-xs font-mono font-bold uppercase bg-amber text-coal rounded-md hover:bg-amber/90 transition-all shadow-amber-glow"
                >
                  Login
                </button>
              </div>
            )}

            {/* SECTION TABS FOR ACCORDION */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-[#141424] rounded-xl border border-white/[0.1] shadow-inner">
              <button
                type="button"
                onClick={() => setMobileSectionOpen('platform')}
                className={`py-1.5 text-xs font-mono font-bold rounded-lg transition-all ${
                  mobileSectionOpen === 'platform'
                    ? 'bg-amber text-coal shadow-amber-glow'
                    : 'text-dim hover:text-offwhite'
                }`}
              >
                Platform
              </button>
              <button
                type="button"
                onClick={() => setMobileSectionOpen('compliance')}
                className={`py-1.5 text-xs font-mono font-bold rounded-lg transition-all ${
                  mobileSectionOpen === 'compliance'
                    ? 'bg-amber text-coal shadow-amber-glow'
                    : 'text-dim hover:text-offwhite'
                }`}
              >
                Compliance
              </button>
              <button
                type="button"
                onClick={() => setMobileSectionOpen('access')}
                className={`py-1.5 text-xs font-mono font-bold rounded-lg transition-all ${
                  mobileSectionOpen === 'access'
                    ? 'bg-amber text-coal shadow-amber-glow'
                    : 'text-dim hover:text-offwhite'
                }`}
              >
                Portals
              </button>
            </div>

            {/* TAB CONTENT 1: PLATFORM */}
            {mobileSectionOpen === 'platform' && (
              <div className="space-y-1.5 pt-1">
                {platformItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.title}
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        item.action();
                      }}
                      className="w-full text-left p-2.5 rounded-xl bg-[#121220] border border-white/[0.08] hover:border-amber/40 hover:bg-[#1C1C32] flex items-center justify-between transition-all shadow-sm"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-[#0A0A12] border border-white/[0.1] flex items-center justify-center text-amber shrink-0 shadow-inner">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-white truncate">
                            {item.title}
                          </div>
                          <div className="text-[10px] text-dim/90 truncate">{item.desc}</div>
                        </div>
                      </div>
                      {item.tag && (
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono ml-2 shrink-0 ${item.tagColor}`}>
                          {item.tag}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* TAB CONTENT 2: COMPLIANCE */}
            {mobileSectionOpen === 'compliance' && (
              <div className="space-y-1.5 pt-1">
                {complianceItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.title}
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        item.action();
                      }}
                      className="w-full text-left p-2.5 rounded-xl bg-[#121220] border border-white/[0.08] hover:border-amber/40 hover:bg-[#1C1C32] flex items-center justify-between transition-all shadow-sm"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-[#0A0A12] border border-white/[0.1] flex items-center justify-center text-amber shrink-0 shadow-inner">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-white truncate">
                            {item.title}
                          </div>
                          <div className="text-[10px] text-dim/90 truncate">{item.desc}</div>
                        </div>
                      </div>
                      {item.tag && (
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono ml-2 shrink-0 ${item.tagColor}`}>
                          {item.tag}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* TAB CONTENT 3: ACCESS & PORTALS */}
            {mobileSectionOpen === 'access' && (
              <div className="space-y-2 pt-1">
                {!isAuthenticated && (
                  <button
                    type="button"
                    onClick={() => handleNav('/login')}
                    className="w-full p-2.5 rounded-xl bg-[#141424] border border-amber/40 hover:bg-[#1C1C32] text-left flex items-center justify-between transition-all shadow-sm"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-amber/20 border border-amber/50 flex items-center justify-center text-amber shrink-0 shadow-inner">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">Login</div>
                        <div className="text-[10px] text-dim/90">Sign in to your account</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-amber font-bold">LOGIN →</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onOpenDemo) onOpenDemo();
                  }}
                  className="w-full p-2.5 rounded-xl bg-[#121220] border border-white/[0.08] hover:border-amber/40 hover:bg-[#1C1C32] text-left flex items-center justify-between transition-all shadow-sm"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#0A0A12] border border-white/[0.1] group-hover:border-amber/50 flex items-center justify-center text-amber shrink-0 shadow-inner">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">Request Executive Briefing</div>
                      <div className="text-[10px] text-dim/90">14-day rollout for subsidiary pits</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-dim bg-[#1A1A2E] px-2 py-0.5 rounded border border-white/[0.06]">Demo</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleHashNav('#cta')}
                  className="w-full p-2.5 rounded-xl bg-[#121220] border border-white/[0.08] hover:border-amber/40 hover:bg-[#1C1C32] text-left flex items-center justify-between transition-all shadow-sm"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#0A0A12] border border-white/[0.1] group-hover:border-amber/50 flex items-center justify-center text-amber shrink-0 shadow-inner">
                      <ExternalLink className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">DGMS Command Liaison</div>
                      <div className="text-[10px] text-dim/90">24/7 regulatory emergency line</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-dim bg-[#1A1A2E] px-2 py-0.5 rounded border border-white/[0.06]">Contact</span>
                </button>
              </div>
            )}

            {/* ACTION LAUNCH BUTTONS */}
            <div className="pt-2 border-t border-white/[0.08] space-y-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onExplorePlatform) onExplorePlatform();
                }}
                className="w-full py-2.5 text-xs font-bold uppercase tracking-wider text-coal bg-amber rounded-xl font-mono shadow-amber-glow flex items-center justify-center gap-1.5 hover:bg-amber/90 transition-all"
              >
                <span>Explore Platform</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => handleNav('/field-capture')}
                className="w-full py-2.5 text-xs font-bold uppercase tracking-wider text-amber border border-amber/40 bg-[#141829] hover:bg-[#1A2038] rounded-xl font-mono flex items-center justify-center gap-1.5 transition-all shadow-sm"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Field Inspector (Offline PWA)</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
