import React, { useState, useEffect, useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useMotionValue,
  animate,
  AnimatePresence,
} from 'framer-motion';

// ============================================================================
// HELPER COMPONENT: ANIMATED NUMBER COUNTER (useMotionValue + animate)
// ============================================================================
function AnimatedCounter({ value, duration = 2, prefix = '', suffix = '' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const count = useMotionValue(0);
  const [displayValue, setDisplayValue] = useState('0');

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, value, {
        duration,
        ease: [0.16, 1, 0.3, 1],
        onUpdate: (latest) => {
          if (value % 1 === 0) {
            setDisplayValue(Math.round(latest).toLocaleString('en-IN'));
          } else {
            setDisplayValue(latest.toFixed(1));
          }
        },
      });
      return controls.stop;
    }
  }, [isInView, value, duration, count]);

  return (
    <span ref={ref}>
      {prefix}
      {displayValue}
      {suffix}
    </span>
  );
}

// ============================================================================
// GLOBAL SCROLL PROGRESS BAR (Fixed at top, z-index 9999, height 3px, amber)
// ============================================================================
function GlobalProgressBar() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] bg-amber origin-left z-[9999] pointer-events-none"
      style={{ scaleX: scrollYProgress }}
    />
  );
}

// ============================================================================
// NAVBAR COMPONENT
// ============================================================================
function Navbar({ onOpenDemo }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Platform', href: '#platform' },
    { label: 'Compliance', href: '#crisis' },
    { label: 'AI Engine', href: '#ai-engine' },
    { label: 'Field App', href: '#perspectives' },
    { label: 'Contact', href: '#cta' },
  ];

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4"
      animate={{
        backgroundColor: scrolled ? 'rgba(13, 13, 13, 0.95)' : 'rgba(13, 13, 13, 0)',
        backdropFilter: scrolled ? 'blur(12px)' : 'blur(0px)',
        borderBottom: scrolled ? '1px solid rgba(245, 166, 35, 0.12)' : '1px solid rgba(245, 166, 35, 0)',
      }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo: amber ◆ + "KhanijAI" */}
        <a href="#" className="flex items-center gap-2.5 group">
          <span className="text-amber text-xl transform group-hover:rotate-45 transition-transform duration-300">
            ◆
          </span>
          <span className="font-display font-extrabold text-2xl tracking-tight text-white">
            Khanij<span className="text-amber">AI</span>
          </span>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-dim hover:text-offwhite transition-colors duration-200 tracking-wide"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA Button Right */}
        <div className="hidden md:block">
          <motion.button
            onClick={onOpenDemo}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="px-5 py-2 text-xs font-semibold uppercase tracking-wider text-amber border border-amber rounded-[8px] hover:bg-amber hover:text-coal transition-colors duration-200"
          >
            Request Demo
          </motion.button>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-offwhite p-1 focus:outline-none"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden mt-3 p-5 bg-graphite border border-amber/10 rounded-[8px] space-y-4"
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm text-offwhite/80 hover:text-amber transition-colors"
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDemo();
              }}
              className="w-full py-2.5 text-xs font-semibold uppercase tracking-wider text-coal bg-amber rounded-[8px]"
            >
              Request Demo
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

// ============================================================================
// SECTION 1 — HERO (VIDEO 1: hero-bg.mp4)
// ============================================================================
function HeroSection({ onOpenDemo, onOpenVideo }) {
  const heroRef = useRef(null);
  const [videoError, setVideoError] = useState(false);

  // Framer Motion scroll transforms for Video 1 and Hero Text
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const videoScale = useTransform(scrollYProgress, [0, 0.4], [1, 1.2]);
  const videoOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  const textY = useTransform(scrollYProgress, [0, 0.3], [0, -120]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  const headlineLines = [
    { text: 'Every Mine.', color: 'text-offwhite', size: 'text-5xl sm:text-7xl lg:text-7xl' },
    { text: 'Every Compliance.', color: 'text-offwhite', size: 'text-5xl sm:text-7xl lg:text-7xl' },
    { text: 'One Intelligence.', color: 'text-amber', size: 'text-6xl sm:text-8xl lg:text-8xl' },
  ];

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen w-full flex flex-col justify-between pt-32 pb-0 overflow-hidden bg-coal"
    >
      {/* VIDEO 1 — HERO BACKGROUND */}
      <motion.div
        style={{ scale: videoScale, opacity: videoOpacity }}
        className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
      >
        {!videoError ? (
          <video
            src="/hero-bg.mp4"
            autoPlay
            muted
            loop
            playsInline
            onError={() => setVideoError(true)}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          // Graceful animated CSS fallback if video fails to load
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-coal via-graphite to-coal animate-pulse" />
        )}

        {/* Layer 1: Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/45 to-[#0D0D0D]" />

        {/* Layer 2: Amber Grid Pattern (1px lines, 40px grid, opacity 8%, amber color) */}
        <div className="absolute inset-0 hero-amber-grid pointer-events-none" />
      </motion.div>

      {/* Layer 3: Hero Text Content (Positioned Center-Left) */}
      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="relative z-10 max-w-7xl mx-auto px-6 w-full my-auto py-12"
      >
        {/* Top Left Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-[8px] border border-amber/40 bg-coal/70 backdrop-blur-md text-amber text-xs font-mono tracking-wide mb-8"
        >
          <span>🇮🇳</span>
          <span>Built for Coal India Ecosystem</span>
        </motion.div>

        {/* Headline — Each line is a separate motion.div */}
        <div className="space-y-1 mb-6">
          {headlineLines.map((line, idx) => (
            <motion.div
              key={line.text}
              initial={{ opacity: 0, y: 60, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{
                duration: 0.85,
                delay: 0.2 + idx * 0.2,
                ease: [0.16, 1, 0.3, 1],
              }}
              className={`font-display font-extrabold ${line.size} ${line.color} tracking-tight leading-[0.98]`}
            >
              {line.text}
            </motion.div>
          ))}
        </div>

        {/* Subtext (Inter 400, max 520px, delay 0.8s) */}
        <motion.p
          initial={{ opacity: 0, y: 30, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.7, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-base sm:text-lg text-offwhite/85 max-w-[520px] font-normal leading-relaxed mb-10"
        >
          KhanijAI brings real-time AI governance to India's coal mining sector — from pit face to boardroom.
        </motion.p>

        {/* Two CTA Buttons (Delay 1.1s) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center gap-4 mb-14"
        >
          <motion.button
            onClick={onOpenDemo}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="px-7 py-3.5 bg-amber text-coal font-semibold text-sm rounded-[8px] tracking-wide hover:bg-amber/90 transition-colors shadow-[0_0_30px_rgba(245,166,35,0.25)]"
          >
            Explore Platform →
          </motion.button>

          <motion.button
            onClick={onOpenVideo}
            whileHover={{ scale: 1.04, borderColor: '#F5A623', color: '#F5A623' }}
            whileTap={{ scale: 0.96 }}
            className="px-7 py-3.5 border border-offwhite/30 text-offwhite font-medium text-sm rounded-[8px] tracking-wide transition-all"
          >
            Watch Demo ▶
          </motion.button>
        </motion.div>

        {/* Bottom Stats Row (3 items, delay 1.4s) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-6 sm:gap-10 text-xs sm:text-sm font-display tracking-wider text-offwhite/80"
        >
          <div>
            <span className="font-extrabold text-white text-base mr-2">321</span>
            <span>Active Mines</span>
          </div>
          <div className="w-[1px] h-4 bg-amber/50" />
          <div>
            <span className="font-extrabold text-white text-base mr-2">48</span>
            <span>Subsidiaries</span>
          </div>
          <div className="w-[1px] h-4 bg-amber/50" />
          <div>
            <span className="font-extrabold text-white text-base mr-2">6</span>
            <span>States</span>
          </div>
        </motion.div>
      </motion.div>

      {/* SCROLLING TICKER AT VERY BOTTOM OF HERO */}
      <div className="relative z-10 w-full overflow-hidden py-3 bg-black/80 border-y border-amber/10 select-none">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="flex items-center gap-8 whitespace-nowrap text-xs font-mono text-amber tracking-wider"
        >
          <span>Mine JH-047 · Compliance: 96% · 3 Inspections Pending ⬥ Mine OD-112 · Last Alert: 2h ago · ACTIVE ⬥ Mine CG-088 · Air Quality: NORMAL ⬥ Mine MP-034 · Safety Score: 91% · COMPLIANT ⬥ Mine WB-019 · Production: 847 MT today ⬥</span>
          <span>Mine JH-047 · Compliance: 96% · 3 Inspections Pending ⬥ Mine OD-112 · Last Alert: 2h ago · ACTIVE ⬥ Mine CG-088 · Air Quality: NORMAL ⬥ Mine MP-034 · Safety Score: 91% · COMPLIANT ⬥ Mine WB-019 · Production: 847 MT today ⬥</span>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================================================
// SECTION 2 — THE CRISIS
// ============================================================================
function CrisisSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const painPoints = [
    'Fragmented systems across subsidiaries',
    '48-hour average delay in incident reporting',
    'No predictive risk detection',
    'Zero real-time regulatory visibility',
  ];

  return (
    <section
      id="crisis"
      ref={ref}
      className="py-32 px-6 bg-graphite dot-grid-amber relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Side (60% width) */}
        <div className="lg:col-span-7 space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-xs font-mono text-amber tracking-widest uppercase font-bold"
          >
            THE PROBLEM
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 40, filter: 'blur(6px)' }}
            animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-extrabold text-4xl sm:text-6xl text-offwhite leading-[1.05] tracking-tight"
          >
            ₹4,200 Cr lost annually <br />
            <span className="text-amber">to compliance gaps</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-dim text-base sm:text-lg leading-relaxed max-w-xl font-normal"
          >
            India's coal sector relies on decentralized manual logs across dozens of subsidiary hubs. Over 100+ operational pits remain vulnerable to delayed statutory submissions and silent structural hazards.
          </motion.p>

          {/* 4 Pain Points */}
          <div className="space-y-3 pt-4">
            {painPoints.map((point, idx) => (
              <motion.div
                key={point}
                initial={{ opacity: 0, x: -40 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center text-offwhite text-sm sm:text-base font-normal"
              >
                <span className="text-red-500 font-bold font-mono text-lg mr-3">×</span>
                <span>{point}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Side (40% width) — 3 Stacked Stat Cards */}
        <div className="lg:col-span-5 space-y-4">
          {/* Card 1 */}
          <motion.div
            initial={{ opacity: 0, x: 60, scale: 0.9 }}
            animate={isInView ? { opacity: 1, x: 0, scale: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="bg-slate border-l-[3px] border-amber rounded-[8px] p-6 shadow-lg"
          >
            <div className="font-display font-extrabold text-5xl sm:text-6xl text-amber leading-none mb-2">
              <AnimatedCounter value={73} suffix="%" />
            </div>
            <div className="text-sm font-medium text-offwhite/90">
              Mines still on paper reporting
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            initial={{ opacity: 0, x: 60, scale: 0.9 }}
            animate={isInView ? { opacity: 1, x: 0, scale: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="bg-slate border-l-[3px] border-amber rounded-[8px] p-6 shadow-lg"
          >
            <div className="font-display font-extrabold text-5xl sm:text-6xl text-amber leading-none mb-2">
              <AnimatedCounter value={48} suffix="hrs" />
            </div>
            <div className="text-sm font-medium text-offwhite/90">
              Avg delay in incident reporting
            </div>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            initial={{ opacity: 0, x: 60, scale: 0.9 }}
            animate={isInView ? { opacity: 1, x: 0, scale: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="bg-slate border-l-[3px] border-amber rounded-[8px] p-6 shadow-lg"
          >
            <div className="font-display font-extrabold text-5xl sm:text-6xl text-amber leading-none mb-2">
              <AnimatedCounter value={840} prefix="₹" suffix="Cr" />
            </div>
            <div className="text-sm font-medium text-offwhite/90">
              Annual regulatory fines
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// SECTION 3 — HORIZONTAL SCROLL MODULES (600vh wrapper, sticky 100vh)
// ============================================================================
function HorizontalModulesSection() {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // Transform scroll progress 0 -> 1 into horizontal translation 0% -> -78%
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-78%']);

  const modules = [
    {
      num: '01',
      name: 'Compliance Tracker',
      desc: 'Live statutory checklist mapping with DGMS CMR 2017 rulesets.',
      status: 'Live',
      statusType: 'amber',
      iconKind: 'radar',
    },
    {
      num: '02',
      name: 'Inspection Monitor',
      desc: 'Real-time officer presence validation with geo-stamped timestamps.',
      status: 'Live',
      statusType: 'amber',
      iconKind: 'aperture',
    },
    {
      num: '03',
      name: 'AI Risk Engine',
      desc: 'Neural classification of micro-seismic shifts and ventilation drops.',
      status: 'Live',
      statusType: 'amber',
      iconKind: 'neural',
    },
    {
      num: '04',
      name: 'Geo-Tagged Field App',
      desc: 'Sub-meter mobile logging with zero-connectivity edge caching.',
      status: 'Live',
      statusType: 'amber',
      iconKind: 'geopin',
    },
    {
      num: '05',
      name: 'GIS Mine Mapping',
      desc: 'Dynamic satellite terrain mesh overlay with 3D slope profiling.',
      status: 'Beta',
      statusType: 'teal',
      iconKind: 'topo',
    },
    {
      num: '06',
      name: 'Workflow & Escalation',
      desc: 'Hierarchical incident routing from pit overman to subsidiary MD.',
      status: 'Live',
      statusType: 'amber',
      iconKind: 'escalate',
    },
    {
      num: '07',
      name: 'OCR Digitization',
      desc: 'Instant legacy logbook scan and structured key-value ingestion.',
      status: 'Beta',
      statusType: 'teal',
      iconKind: 'ocr',
    },
    {
      num: '08',
      name: 'Blockchain Audit Trail',
      desc: 'Cryptographically sealed records admissible in statutory tribunals.',
      status: 'Beta',
      statusType: 'teal',
      iconKind: 'chain',
    },
    {
      num: '09',
      name: 'Multilingual Chatbot',
      desc: 'Voice-to-text safety queries in Hindi, Bengali, and Odia.',
      status: 'Upcoming',
      statusType: 'slate',
      iconKind: 'chat',
    },
    {
      num: '10',
      name: 'Unified Dashboard',
      desc: 'Consolidated executive radar integrating 12 subsidiaries.',
      status: 'Live',
      statusType: 'amber',
      iconKind: 'grid',
    },
  ];

  return (
    <section
      id="platform"
      ref={sectionRef}
      className="relative h-[600vh] bg-coal"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center px-6 md:px-16">
        {/* Title Pinned Above Cards */}
        <div className="max-w-7xl mx-auto w-full mb-10">
          <div className="text-xs font-mono text-amber uppercase tracking-widest font-bold mb-2">
            SYSTEM ARCHITECTURE
          </div>
          <h2 className="font-display font-extrabold text-4xl sm:text-5xl text-white tracking-tight">
            One Platform. <span className="text-amber">Ten Capabilities.</span>
          </h2>
        </div>

        {/* Horizontal Container */}
        <div className="w-full overflow-hidden">
          <motion.div
            style={{ x }}
            className="flex gap-6 pl-4 pr-32"
          >
            {modules.map((item) => (
              <motion.div
                key={item.num}
                whileHover={{
                  borderColor: 'rgba(245,166,35,0.4)',
                  y: -8,
                  boxShadow: '0 20px 60px rgba(245,166,35,0.08)',
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="w-[380px] h-[480px] shrink-0 bg-graphite border border-white/[0.06] rounded-[8px] p-8 flex flex-col justify-between transition-colors relative group"
              >
                {/* Card Top: Number + CSS-Drawn Icon */}
                <div>
                  <div className="flex items-start justify-between mb-8">
                    <span className="font-mono text-amber font-normal text-5xl leading-none">
                      {item.num}
                    </span>
                    
                    {/* CSS-Drawn Icon */}
                    <div className="w-12 h-12 rounded-[8px] bg-coal border border-amber/20 flex items-center justify-center text-amber relative overflow-hidden group-hover:border-amber/50 transition-colors">
                      {item.iconKind === 'radar' && (
                        <div className="w-6 h-6 rounded-full border border-amber/60 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-amber" />
                        </div>
                      )}
                      {item.iconKind === 'aperture' && (
                        <div className="w-6 h-6 border-2 border-amber/70 border-dashed rounded-full" />
                      )}
                      {item.iconKind === 'neural' && (
                        <div className="relative w-6 h-6 flex items-center justify-center">
                          <div className="w-3 h-3 bg-amber/80 rotate-45" />
                        </div>
                      )}
                      {item.iconKind === 'geopin' && (
                        <div className="w-4 h-5 border-2 border-amber rounded-t-full relative">
                          <div className="w-1.5 h-1.5 bg-amber rounded-full mx-auto mt-1" />
                        </div>
                      )}
                      {item.iconKind === 'topo' && (
                        <div className="w-6 h-4 border-t-2 border-b-2 border-amber/70" />
                      )}
                      {item.iconKind === 'escalate' && (
                        <div className="w-5 h-5 flex flex-col justify-between">
                          <div className="w-full h-1 bg-amber" />
                          <div className="w-3/4 h-1 bg-amber" />
                          <div className="w-1/2 h-1 bg-amber" />
                        </div>
                      )}
                      {item.iconKind === 'ocr' && (
                        <div className="w-5 h-6 border border-amber/70 p-1 flex flex-col gap-1">
                          <div className="w-full h-0.5 bg-amber" />
                          <div className="w-full h-0.5 bg-amber" />
                        </div>
                      )}
                      {item.iconKind === 'chain' && (
                        <div className="w-6 h-3 border-2 border-amber/80 rounded-full" />
                      )}
                      {item.iconKind === 'chat' && (
                        <div className="w-6 h-5 border border-amber/70 rounded-tl-lg rounded-tr-lg rounded-br-lg" />
                      )}
                      {item.iconKind === 'grid' && (
                        <div className="w-5 h-5 grid grid-cols-2 gap-1">
                          <div className="bg-amber/70" />
                          <div className="bg-amber/70" />
                          <div className="bg-amber/70" />
                          <div className="bg-amber/70" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Module Name */}
                  <h3 className="font-display font-bold text-2xl text-white mb-3">
                    {item.name}
                  </h3>

                  {/* Description */}
                  <p className="text-dim text-[15px] font-normal leading-relaxed line-clamp-2">
                    {item.desc}
                  </p>
                </div>

                {/* Card Bottom: Status Pill */}
                <div className="pt-6 border-t border-white/[0.06] flex items-center justify-between">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-[8px] tracking-wider uppercase ${
                      item.statusType === 'amber'
                        ? 'bg-amber text-coal'
                        : item.statusType === 'teal'
                        ? 'bg-teal text-coal'
                        : 'bg-slate text-offwhite'
                    }`}
                  >
                    {item.status}
                  </span>
                  <span className="text-dim text-xs font-mono">MODULE_VER_{item.num}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// SECTION 4 — AI ENGINE (Terminal Typewriter + 3 Capability Cards)
// ============================================================================
function AIEngineSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  // Typewriter line list
  const terminalLines = [
    { text: '> Initializing KhanijAI Engine v2.4...', color: 'text-dim', pause: 800 },
    { text: '> Scanning Mine #JH-047...', color: 'text-dim', pause: 600 },
    { text: '> ⚠ Ventilation check OVERDUE — 3 days', color: 'text-amber', pause: 400 },
    { text: '> Escalating to Safety Officer: R.K. Singh', color: 'text-dim', pause: 400 },
    { text: '> ✓ Alert dispatched — 09:42:17 IST', color: 'text-teal', pause: 1000 },
    { text: '> Scanning Mine #OD-112...', color: 'text-dim', pause: 500 },
    { text: '> ✓ All compliance checks passed', color: 'text-teal', pause: 2000 },
  ];

  const [visibleLines, setVisibleLines] = useState([]);

  useEffect(() => {
    if (!isInView) return;

    let isMounted = true;
    let currentLine = 0;

    const playSequence = () => {
      if (!isMounted) return;

      if (currentLine < terminalLines.length) {
        setVisibleLines((prev) => [...prev, terminalLines[currentLine]]);
        const pauseTime = terminalLines[currentLine].pause;
        currentLine++;
        setTimeout(playSequence, pauseTime);
      } else {
        // Clear and loop after 2 seconds
        setTimeout(() => {
          if (!isMounted) return;
          setVisibleLines([]);
          currentLine = 0;
          playSequence();
        }, 2000);
      }
    };

    const timer = setTimeout(playSequence, 400);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [isInView]);

  return (
    <section
      id="ai-engine"
      ref={sectionRef}
      className="py-32 px-6 bg-coal dot-grid-amber relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <div className="text-xs font-mono text-amber uppercase tracking-widest font-bold mb-2">
            INTELLIGENCE CORE
          </div>
          <h2 className="font-display font-extrabold text-4xl sm:text-6xl text-white tracking-tight">
            Autonomous Predictive <span className="text-amber">Oversight.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          {/* LEFT 50% — TERMINAL WINDOW */}
          <div className="lg:col-span-6 bg-[#0A0A0A] border border-amber/30 rounded-[8px] shadow-amber-glow p-6 flex flex-col justify-between min-h-[420px] font-mono text-sm">
            {/* Title Bar */}
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                  <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                  <span className="w-3 h-3 rounded-full bg-[#27C93F]" />
                </div>
                <span className="text-dim text-xs">khanijai-engine-core ~ bash - 80x24</span>
              </div>

              {/* Typewriter Output */}
              <div className="space-y-2 font-mono text-sm leading-relaxed">
                {visibleLines.map((line, idx) => (
                  <div key={idx} className={line.color}>
                    {line.text}
                  </div>
                ))}
                {/* Blinking Amber Cursor */}
                <div className="inline-block text-amber font-bold terminal-cursor">|</div>
              </div>
            </div>

            <div className="pt-4 mt-6 border-t border-white/[0.06] text-xs text-dim flex items-center justify-between">
              <span>STATUS: LIVE STREAMING</span>
              <span className="text-teal">CONNECTED TO DGMS CMR MESH</span>
            </div>
          </div>

          {/* RIGHT 50% — 3 AI CAPABILITY CARDS */}
          <div className="lg:col-span-6 flex flex-col justify-between gap-4">
            {/* Card 1 */}
            <motion.div
              initial={{ opacity: 0, x: 80 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="bg-graphite border-l-2 border-amber rounded-[8px] p-6 shadow-md"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-display font-bold text-xl sm:text-2xl text-white">
                  Anomaly Detection
                </h3>
                <span className="text-amber font-display font-bold text-lg">
                  99.2% accuracy
                </span>
              </div>
              <p className="text-dim text-sm sm:text-base leading-relaxed">
                Spots operational deviations before they become statutory violations.
              </p>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              initial={{ opacity: 0, x: 80 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="bg-graphite border-l-2 border-amber rounded-[8px] p-6 shadow-md"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-display font-bold text-xl sm:text-2xl text-white">
                  Predictive Alerts
                </h3>
                <span className="text-amber font-display font-bold text-lg">
                  14-day forecast
                </span>
              </div>
              <p className="text-dim text-sm sm:text-base leading-relaxed">
                Risk prediction for every mine site updated every 6 hours.
              </p>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              initial={{ opacity: 0, x: 80 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="bg-graphite border-l-2 border-amber rounded-[8px] p-6 shadow-md"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-display font-bold text-xl sm:text-2xl text-white">
                  Pattern Recognition
                </h3>
                <span className="text-amber font-display font-bold text-lg">
                  ↓ 67% repeat violations
                </span>
              </div>
              <p className="text-dim text-sm sm:text-base leading-relaxed">
                Identifies recurring failures across contractor networks and mine sites.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// SECTION 5 — DASHBOARD (VIDEO 2: dashboard.mp4)
// ============================================================================
function DashboardSection({ onOpenDemo }) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { threshold: 0.3, once: true });
  const [videoError, setVideoError] = useState(false);

  const bullets = [
    'Real-time pit-to-port production & safety telemetry',
    'Automated statutory Form-IV and Form-24 generation',
    'Multi-tier role permissions for Mine, Area, & Ministry',
    'Sub-second emergency alert broadcast network',
  ];

  return (
    <section
      ref={sectionRef}
      className="py-32 px-6 bg-graphite relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Side: Text Content */}
        <div className="lg:col-span-5 space-y-6">
          <div className="text-xs font-mono text-amber uppercase tracking-widest font-bold">
            COMMAND HUB
          </div>
          <h2 className="font-display font-extrabold text-4xl sm:text-5xl text-white tracking-tight leading-[1.05]">
            Your entire mine. <br />
            <span className="text-amber">One command centre.</span>
          </h2>

          <div className="space-y-3 pt-2">
            {bullets.map((bullet, idx) => (
              <motion.div
                key={bullet}
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-start text-offwhite/90 text-sm sm:text-base"
              >
                <span className="text-amber font-bold mr-3 mt-0.5">✓</span>
                <span>{bullet}</span>
              </motion.div>
            ))}
          </div>

          <div className="pt-4">
            <motion.button
              onClick={onOpenDemo}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="px-6 py-3 border border-amber text-amber hover:bg-amber hover:text-coal font-semibold text-sm rounded-[8px] tracking-wide transition-colors"
            >
              See Live Dashboard →
            </motion.button>
          </div>
        </div>

        {/* Right Side: Monitor Mockup with VIDEO 2 */}
        <div className="lg:col-span-7 relative">
          {/* Framer Motion Monitor Frame with rotateX entrance + continuous slow float */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0, rotateX: 12 }}
            animate={
              isInView
                ? {
                    scale: 1,
                    opacity: 1,
                    rotateX: 0,
                    y: [-4, 4, -4],
                  }
                : {}
            }
            transition={{
              duration: 0.9,
              ease: [0.16, 1, 0.3, 1],
              y: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
            }}
            className="relative"
            style={{ perspective: 1200 }}
          >
            {/* Monitor Outer Bezel */}
            <div className="bg-[#0A0A0E] p-3 rounded-2xl border-2 border-amber/20 shadow-monitor-glow">
              {/* Top Camera Dot */}
              <div className="w-2 h-2 rounded-full bg-[#1C1C24] mx-auto mb-2" />

              {/* Inner Screen Area with VIDEO 2 */}
              <div className="w-full aspect-video bg-coal rounded-xl overflow-hidden relative">
                {!videoError ? (
                  <video
                    src="/dashboard.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                    onError={() => setVideoError(true)}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  // Fallback animated visual if video is unavailable
                  <div className="w-full h-full bg-gradient-to-br from-coal via-slate to-coal p-6 flex flex-col justify-between">
                    <div className="flex justify-between items-center text-xs font-mono text-amber">
                      <span>KHANIJ_AI_LIVE_STREAM</span>
                      <span>DGMS_STATION_SYNCED</span>
                    </div>
                    <div className="text-center font-display font-extrabold text-3xl text-white">
                      LIVE PIT RADAR 04
                    </div>
                    <div className="h-2 bg-amber/30 rounded-full overflow-hidden">
                      <div className="h-full bg-amber w-3/4 animate-pulse" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Stand (Trapezoid shape using CSS clip-path) */}
            <div className="w-28 h-6 bg-[#20202E] mx-auto monitor-stand-base" />
            <div className="w-44 h-2 bg-[#161622] rounded-full mx-auto" />

            {/* 3 Floating Data Cards around Monitor (Spring physics entrance) */}
            {isInView && (
              <>
                {/* Floating Card 1 (Top Left) */}
                <motion.div
                  initial={{ opacity: 0, x: -60, y: 20 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 25, delay: 0.6 }}
                  className="absolute -top-4 -left-4 sm:-left-8 bg-coal/90 border border-teal/40 text-teal p-3 rounded-[8px] text-xs font-mono shadow-2xl backdrop-blur-md"
                >
                  <span className="block text-[10px] text-dim uppercase">SYSTEM RATE</span>
                  <span className="font-bold text-sm">Compliance: 94%</span>
                </motion.div>

                {/* Floating Card 2 (Top Right) */}
                <motion.div
                  initial={{ opacity: 0, x: 60, y: -20 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 25, delay: 0.8 }}
                  className="absolute -top-6 -right-4 sm:-right-6 bg-coal/90 border border-amber/40 text-amber p-3 rounded-[8px] text-xs font-mono shadow-2xl backdrop-blur-md"
                >
                  <span className="block text-[10px] text-dim uppercase">CONNECTED NODES</span>
                  <span className="font-bold text-sm">Active Mines: 321</span>
                </motion.div>

                {/* Floating Card 3 (Bottom Right) */}
                <motion.div
                  initial={{ opacity: 0, x: 60, y: 40 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 25, delay: 1.0 }}
                  className="absolute -bottom-6 -right-2 sm:-right-4 bg-coal/90 border border-red-500/40 text-red-400 p-3 rounded-[8px] text-xs font-mono shadow-2xl backdrop-blur-md"
                >
                  <span className="block text-[10px] text-dim uppercase">STATUTORY FLAGS</span>
                  <span className="font-bold text-sm">Alerts: 3 Pending</span>
                </motion.div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// SECTION 6 — GIS MAP (Interactive SVG India Map with 6 Pulsing Mine Nodes)
// ============================================================================
function GISMapSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });
  const [hoveredMine, setHoveredMine] = useState(null);

  const mines = [
    { id: 'dhanbad', name: 'Dhanbad (BCCL)', state: 'Jharkhand', compliance: '96.4%', inspection: '2h ago', cx: 420, cy: 220 },
    { id: 'angul', name: 'Angul (MCL)', state: 'Odisha', compliance: '98.1%', inspection: '35m ago', cx: 430, cy: 280 },
    { id: 'korba', name: 'Korba (SECL)', state: 'Chhattisgarh', compliance: '94.8%', inspection: '1h ago', cx: 370, cy: 280 },
    { id: 'singrauli', name: 'Singrauli (NCL)', state: 'Madhya Pradesh', compliance: '99.0%', inspection: '10m ago', cx: 360, cy: 240 },
    { id: 'asansol', name: 'Asansol (ECL)', state: 'West Bengal', compliance: '95.2%', inspection: '4h ago', cx: 440, cy: 210 },
    { id: 'nagpur', name: 'Nagpur (WCL)', state: 'Maharashtra', compliance: '97.6%', inspection: '1h ago', cx: 340, cy: 300 },
  ];

  return (
    <section
      ref={sectionRef}
      className="py-32 px-6 bg-coal relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Stat Panel */}
        <div className="lg:col-span-5 space-y-8">
          <div>
            <div className="text-xs font-mono text-amber uppercase tracking-widest font-bold mb-2">
              MINE NETWORK
            </div>
            <h2 className="font-display font-extrabold text-4xl sm:text-5xl text-white tracking-tight">
              Sub-Surface Telemetry <br />
              <span className="text-amber">Across India.</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="p-5 bg-graphite rounded-[8px] border border-white/[0.06]">
              <div className="font-display font-extrabold text-4xl sm:text-5xl text-amber">
                <AnimatedCounter value={321} />
              </div>
              <div className="text-xs font-mono text-dim uppercase mt-1">
                Active Mine Sites
              </div>
            </div>

            <div className="p-5 bg-graphite rounded-[8px] border border-white/[0.06]">
              <div className="font-display font-extrabold text-4xl sm:text-5xl text-amber">
                <AnimatedCounter value={6} />
              </div>
              <div className="text-xs font-mono text-dim uppercase mt-1">
                States Monitored
              </div>
            </div>

            <div className="p-5 bg-graphite rounded-[8px] border border-white/[0.06]">
              <div className="font-display font-extrabold text-4xl sm:text-5xl text-amber">
                <AnimatedCounter value={48} />
              </div>
              <div className="text-xs font-mono text-dim uppercase mt-1">
                Subsidiaries
              </div>
            </div>

            <div className="p-5 bg-graphite rounded-[8px] border border-white/[0.06]">
              <div className="font-display font-extrabold text-4xl sm:text-5xl text-amber">
                24/7
              </div>
              <div className="text-xs font-mono text-dim uppercase mt-1">
                Live Monitoring
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive SVG India Map */}
        <div className="lg:col-span-7 bg-graphite border border-white/[0.06] rounded-[8px] p-6 sm:p-10 relative flex flex-col items-center">
          <svg
            viewBox="180 80 400 400"
            className="w-full max-w-lg h-auto drop-shadow-2xl"
          >
            {/* Simplified India Geo Outline */}
            <path
              d="M 330 110 
                 C 350 115, 380 130, 400 150 
                 C 420 170, 440 190, 470 200 
                 C 500 210, 540 210, 560 220 
                 C 590 230, 620 250, 650 260 
                 C 660 270, 640 290, 620 300 
                 C 610 320, 600 340, 590 360 
                 C 580 390, 550 420, 530 450 
                 C 500 480, 470 510, 430 540 
                 C 390 580, 360 620, 350 660 
                 C 340 640, 320 600, 300 560 
                 C 280 520, 260 480, 250 440 
                 C 240 400, 220 360, 210 320 
                 C 200 290, 210 260, 230 240 
                 C 250 220, 280 200, 300 170 
                 C 310 140, 320 120, 330 110 Z"
              fill="transparent"
              stroke="rgba(245,166,35,0.25)"
              strokeWidth="1.5"
            />

            {/* Connecting Telemetry Path */}
            <path
              d="M 420 220 L 440 210 L 430 280 L 370 280 L 360 240 L 340 300"
              fill="none"
              stroke="rgba(245,166,35,0.18)"
              strokeWidth="1"
              strokeDasharray="4 4"
            />

            {/* 6 Mine Location Dots */}
            {mines.map((mine) => (
              <g
                key={mine.id}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredMine(mine)}
                onMouseLeave={() => setHoveredMine(null)}
              >
                {/* Pulse Ring 1 */}
                <motion.circle
                  cx={mine.cx}
                  cy={mine.cy}
                  r={6}
                  fill="none"
                  stroke="#F5A623"
                  strokeWidth="1.5"
                  animate={{ scale: [1, 3], opacity: [0.6, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
                />

                {/* Pulse Ring 2 (delay 0.7s) */}
                <motion.circle
                  cx={mine.cx}
                  cy={mine.cy}
                  r={6}
                  fill="none"
                  stroke="#F5A623"
                  strokeWidth="1.5"
                  animate={{ scale: [1, 3], opacity: [0.6, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.7, ease: 'easeOut' }}
                />

                {/* Pulse Ring 3 (delay 1.4s) */}
                <motion.circle
                  cx={mine.cx}
                  cy={mine.cy}
                  r={6}
                  fill="none"
                  stroke="#F5A623"
                  strokeWidth="1.5"
                  animate={{ scale: [1, 3], opacity: [0.6, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1.4, ease: 'easeOut' }}
                />

                {/* Inner Circle */}
                <circle cx={mine.cx} cy={mine.cy} r={6} fill="#F5A623" />
              </g>
            ))}
          </svg>

          {/* Hover Tooltip Card (AnimatePresence) */}
          <AnimatePresence>
            {hoveredMine && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 10 }}
                className="absolute bottom-6 bg-coal border border-amber/40 p-4 rounded-[8px] shadow-xl text-xs font-mono min-w-[220px]"
              >
                <div className="text-amber font-bold text-sm mb-1">{hoveredMine.name}</div>
                <div className="text-offwhite">State: {hoveredMine.state}</div>
                <div className="text-teal font-medium">Compliance: {hoveredMine.compliance}</div>
                <div className="text-dim">Last Inspection: {hoveredMine.inspection}</div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-4 text-center text-xs font-mono text-dim uppercase">
            HOVER ANY RADAR NODE TO INSPECT SUBSIDIARY STATUS
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// SECTION 7 — THREE PERSPECTIVES (Sticky 400vh Wrapper, 3 Phases)
// ============================================================================
function PerspectivesSection() {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const [phase, setPhase] = useState(1);

  useEffect(() => {
    return scrollYProgress.on('change', (val) => {
      if (val < 0.33) {
        setPhase(1);
      } else if (val < 0.66) {
        setPhase(2);
      } else {
        setPhase(3);
      }
    });
  }, [scrollYProgress]);

  const perspectives = {
    1: {
      role: 'FIELD INSPECTOR',
      headline: 'File reports from 200 metres underground.',
      body: 'Designed for subterranean seams and deep open-cast benches. Field officers capture tamper-proof statutory forms offline, syncing automatically the instant surface signal connects.',
      features: ['Geo-tagged reports', 'Offline-first edge sync', 'Hindi & regional voice input'],
    },
    2: {
      role: 'MINE MANAGER',
      headline: 'Your entire mine. One command centre.',
      body: 'Monitor pit face extraction schedules, ventilation sensor tolerances, and contractor manpower registries from a singular executive control pane.',
      features: ['Live compliance score', 'Auto-generated DGMS reports', 'Contractor SLA alerts'],
    },
    3: {
      role: 'REGULATORY AUTHORITY',
      headline: 'Oversight without the paperwork.',
      body: 'Review real-time mine safety metrics and statutory registers without 4-week compiling backlogs. Every entry is backed by an immutable blockchain evidentiary trail.',
      features: ['All-mine centralized live feed', 'Blockchain audit trail', 'One-click statutory export'],
    },
  };

  const current = perspectives[phase];

  return (
    <section
      id="perspectives"
      ref={sectionRef}
      className="relative h-[400vh] bg-graphite"
    >
      <div className="sticky top-0 h-screen w-full flex items-center px-6 md:px-16 overflow-hidden">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Side: Text Changes per Phase */}
          <div className="lg:col-span-6 space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={phase}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-4"
              >
                <div className="text-xs font-mono text-amber tracking-widest uppercase font-bold">
                  PERSPECTIVE 0{phase} // {current.role}
                </div>

                <h2 className="font-display font-extrabold text-4xl sm:text-5xl text-white tracking-tight leading-[1.05]">
                  {current.headline}
                </h2>

                <p className="text-dim text-base sm:text-lg leading-relaxed font-normal">
                  {current.body}
                </p>

                <div className="space-y-2 pt-2">
                  {current.features.map((feat) => (
                    <div key={feat} className="flex items-center text-offwhite text-sm font-medium">
                      <span className="text-amber mr-3">✓</span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* 3 Horizontal Progress Pills */}
            <div className="flex items-center gap-3 pt-6">
              {[1, 2, 3].map((p) => (
                <motion.div
                  key={p}
                  animate={{
                    width: phase === p ? 120 : 32,
                    backgroundColor: phase === p ? '#F5A623' : '#2D3561',
                  }}
                  transition={{ duration: 0.3 }}
                  className="h-2 rounded-full cursor-pointer"
                  onClick={() => setPhase(p)}
                />
              ))}
            </div>
          </div>

          {/* Right Side: CSS-Drawn UI Mockups */}
          <div className="lg:col-span-6 flex justify-center">
            <AnimatePresence mode="wait">
              {phase === 1 && (
                /* Phase 1: Phone Mockup */
                <motion.div
                  key="phone"
                  initial={{ opacity: 0, scale: 0.9, rotateY: 10 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 0.9, rotateY: -10 }}
                  transition={{ duration: 0.5 }}
                  className="w-[280px] h-[520px] bg-coal border-4 border-[#222230] rounded-[36px] p-4 shadow-2xl relative flex flex-col justify-between"
                >
                  <div className="w-24 h-4 bg-[#222230] rounded-full mx-auto mb-4" />
                  <div className="space-y-3 font-mono text-xs">
                    <div className="p-3 bg-graphite rounded-[8px] border border-amber/20">
                      <div className="text-amber font-bold">FORM 24 VERIFICATION</div>
                      <div className="text-dim text-[10px]">PIT_LOC: SEAM_04_SOUTH</div>
                    </div>
                    <div className="p-3 bg-graphite rounded-[8px] border border-white/[0.06]">
                      <div className="text-offwhite">OFFLINE SYNC: 14 RECORDS PENDING</div>
                    </div>
                    <div className="p-3 bg-graphite rounded-[8px] border border-teal/30 text-teal">
                      <div>GPS ACCURACY: ±0.8 METRES</div>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-amber/20 border border-amber flex items-center justify-center mx-auto text-amber text-xs font-bold">
                    MIC
                  </div>
                </motion.div>
              )}

              {phase === 2 && (
                /* Phase 2: Desktop Dashboard Mockup */
                <motion.div
                  key="desktop"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                  className="w-full max-w-md bg-coal border border-white/[0.08] rounded-[8px] p-6 shadow-2xl space-y-4 font-mono text-xs"
                >
                  <div className="flex justify-between items-center pb-3 border-b border-white/[0.08]">
                    <span className="text-amber font-bold">EXECUTIVE MINE CONSOLE</span>
                    <span className="text-teal">STATUS: 98.4% SAFE</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-graphite rounded-[8px]">
                      <div className="text-dim">METHANE (CH4)</div>
                      <div className="text-white font-bold text-lg">0.04%</div>
                    </div>
                    <div className="p-3 bg-graphite rounded-[8px]">
                      <div className="text-dim">BENCH STABILITY</div>
                      <div className="text-amber font-bold text-lg">99.8%</div>
                    </div>
                  </div>
                  <div className="p-3 bg-graphite rounded-[8px]">
                    <div className="text-dim mb-1">CONTRACTOR SAFETY INDEX</div>
                    <div className="w-full bg-coal h-2 rounded-full overflow-hidden">
                      <div className="bg-amber h-full w-4/5" />
                    </div>
                  </div>
                </motion.div>
              )}

              {phase === 3 && (
                /* Phase 3: Regulatory Portal Mockup */
                <motion.div
                  key="regulatory"
                  initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 0.9, rotateY: 10 }}
                  transition={{ duration: 0.5 }}
                  className="w-full max-w-md bg-[#0D0D14] border border-amber/30 rounded-[8px] p-6 shadow-2xl space-y-4 font-mono text-xs"
                >
                  <div className="flex justify-between items-center text-amber font-bold pb-2 border-b border-amber/20">
                    <span>DGMS CENTRAL REGULATORY REGISTRY</span>
                    <span>CMR 2017</span>
                  </div>
                  <div className="space-y-2">
                    <div className="p-2.5 bg-graphite rounded-[8px] flex justify-between">
                      <span className="text-offwhite">BCCL / DHANBAD</span>
                      <span className="text-teal">AUDIT PASSED</span>
                    </div>
                    <div className="p-2.5 bg-graphite rounded-[8px] flex justify-between">
                      <span className="text-offwhite">MCL / ANGUL</span>
                      <span className="text-teal">AUDIT PASSED</span>
                    </div>
                    <div className="p-2.5 bg-graphite rounded-[8px] flex justify-between">
                      <span className="text-offwhite">SECL / KORBA</span>
                      <span className="text-amber">ACTION ASSIGNED</span>
                    </div>
                  </div>
                  <div className="text-[10px] text-dim text-right pt-2 border-t border-white/[0.06]">
                    LEDGER_HASH: 0x89F2...C41D
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// SECTION 8 — COMPLIANCE METER
// ============================================================================
function ComplianceMeterSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  // Circle stroke calculations
  // radius = 120, circumference = 2 * Math.PI * 120 ≈ 754
  // target offset = 754 * (1 - 0.943) = 43
  const strokeDashoffset = useMotionValue(754);

  useEffect(() => {
    if (isInView) {
      animate(strokeDashoffset, 43, {
        duration: 2,
        ease: 'easeOut',
      });
    }
  }, [isInView, strokeDashoffset]);

  const metrics = [
    { stat: '2.3M+', label: 'Compliance records digitized' },
    { stat: '47 sec', label: 'Avg incident-to-alert time' },
    { stat: '99.8%', label: 'System uptime SLA' },
    { stat: '₹0', label: 'Paper forms used post-deployment' },
  ];

  return (
    <section
      ref={sectionRef}
      className="py-32 px-6 bg-coal relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* SVG Arc Compliance Dial */}
        <div className="relative w-[280px] h-[280px] flex items-center justify-center mb-6">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 260 260">
            {/* Background Ring */}
            <circle
              cx="130"
              cy="130"
              r="120"
              fill="none"
              stroke="#1A1A2E"
              strokeWidth="12"
            />
            {/* Animated Amber Progress Ring */}
            <motion.circle
              cx="130"
              cy="130"
              r="120"
              fill="none"
              stroke="#F5A623"
              strokeWidth="12"
              strokeDasharray="754"
              style={{ strokeDashoffset }}
              strokeLinecap="round"
            />
          </svg>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="font-display font-extrabold text-5xl sm:text-6xl text-amber leading-none">
              <AnimatedCounter value={94.3} suffix="%" />
            </div>
          </div>
        </div>

        <div className="text-dim text-sm uppercase tracking-wider font-mono mb-16">
          Platform Compliance Rate
        </div>

        {/* 4 Metric Cards in a Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {metrics.map((item, idx) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="bg-graphite border border-amber/10 rounded-[8px] p-6 text-left"
            >
              <div className="font-display font-extrabold text-3xl sm:text-4xl text-white mb-2">
                {item.stat}
              </div>
              <div className="text-dim text-sm font-normal">
                {item.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// SECTION 9 — TRUST BAR
// ============================================================================
function TrustBarSection() {
  const logos = ['CIL', 'BCCL', 'ECL', 'CCL', 'WCL', 'MCL', 'SCCL', 'NCL', 'DGMS'];

  return (
    <section className="py-20 bg-graphite border-t border-amber/10 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-6 mb-10 text-center">
        <h3 className="font-display font-bold text-2xl sm:text-3xl text-offwhite">
          Trusted across the Coal India ecosystem
        </h3>
      </div>

      {/* Horizontal Scrolling Logo Marquee (Text-Only, 30s loop) */}
      <div className="w-full overflow-hidden flex items-center">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="flex items-center whitespace-nowrap"
        >
          {[...logos, ...logos, ...logos].map((logo, idx) => (
            <span
              key={idx}
              className="font-display font-bold text-lg text-dim hover:text-amber transition-colors mx-8"
            >
              {logo}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ============================================================================
// SECTION 10 — CTA & FOOTER
// ============================================================================
function CTAAndFooterSection({ onOpenDemo, onOpenVideo }) {
  const ctaRef = useRef(null);
  const isInView = useInView(ctaRef, { once: true, margin: '-50px' });

  return (
    <div className="bg-coal text-offwhite border-t border-white/[0.06]">
      {/* CTA Section */}
      <section
        id="cta"
        ref={ctaRef}
        className="py-32 px-6 flex flex-col items-center text-center relative overflow-hidden"
      >
        {/* Above Headline: 3 Animated Connection Lines */}
        <div className="w-48 h-12 mb-6">
          <svg className="w-full h-full" viewBox="0 0 200 60">
            <motion.path
              d="M 20 10 L 100 50 L 180 10"
              fill="none"
              stroke="#F5A623"
              strokeWidth="2"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={isInView ? { pathLength: 1, opacity: 0.6 } : {}}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
            />
          </svg>
        </div>

        <h2 className="font-display font-extrabold text-5xl sm:text-6xl text-white tracking-tight leading-[1.05] max-w-2xl mb-4">
          Ready to govern smarter?
        </h2>

        <p className="text-dim text-base sm:text-lg max-w-md mb-10 font-normal">
          Deploy KhanijAI across your mining block or subsidiary in under 14 days.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <motion.button
            onClick={onOpenDemo}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="px-8 py-4 bg-amber text-coal font-semibold text-sm rounded-[8px] tracking-wide hover:bg-amber/90 transition-colors shadow-[0_0_30px_rgba(245,166,35,0.25)]"
          >
            Request Subsidiary Briefing →
          </motion.button>

          <motion.button
            onClick={onOpenVideo}
            whileHover={{ scale: 1.04, borderColor: '#F5A623', color: '#F5A623' }}
            whileTap={{ scale: 0.96 }}
            className="px-8 py-4 border border-offwhite/30 text-offwhite font-medium text-sm rounded-[8px] tracking-wide transition-all"
          >
            Watch Overview ▶
          </motion.button>
        </div>
      </section>

      {/* 4-Column Footer */}
      <footer className="border-t border-white/[0.08] pt-16 pb-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16 text-sm">
          {/* Col 1 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-amber text-lg">◆</span>
              <span className="font-display font-extrabold text-xl text-white">
                Khanij<span className="text-amber">AI</span>
              </span>
            </div>
            <p className="text-dim leading-relaxed text-xs">
              Autonomous smart governance & compliance monitoring infrastructure for India's coal mining sector.
            </p>
          </div>

          {/* Col 2 */}
          <div className="space-y-3">
            <div className="font-display font-bold text-white uppercase text-xs tracking-wider">
              Platform
            </div>
            <ul className="space-y-2 text-xs text-dim">
              <li><a href="#platform" className="hover:text-amber transition-colors">Overview</a></li>
              <li><a href="#perspectives" className="hover:text-amber transition-colors">Field Mobile App</a></li>
              <li><a href="#ai-engine" className="hover:text-amber transition-colors">AI Risk Engine</a></li>
              <li><a href="#platform" className="hover:text-amber transition-colors">Blockchain Ledger</a></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-3">
            <div className="font-display font-bold text-white uppercase text-xs tracking-wider">
              Compliance
            </div>
            <ul className="space-y-2 text-xs text-dim">
              <li><a href="#crisis" className="hover:text-amber transition-colors">DGMS CMR 2017</a></li>
              <li><a href="#crisis" className="hover:text-amber transition-colors">Form-IV Automation</a></li>
              <li><a href="#crisis" className="hover:text-amber transition-colors">Environmental Clearance</a></li>
              <li><a href="#crisis" className="hover:text-amber transition-colors">Safety Standard SOPs</a></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="space-y-3">
            <div className="font-display font-bold text-white uppercase text-xs tracking-wider">
              Subsidiaries
            </div>
            <ul className="space-y-2 text-xs text-dim">
              <li><span>BCCL Dhanbad</span></li>
              <li><span>CCL Ranchi</span></li>
              <li><span>MCL Sambalpur</span></li>
              <li><span>SECL Bilaspur</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="max-w-7xl mx-auto pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-dim">
          <div>Make in India 🇮🇳 · Built for the Coal India ecosystem · © 2025 KhanijAI</div>
          <div>Ministry of Coal Alignment</div>
        </div>
      </footer>
    </div>
  );
}

// ============================================================================
// DEMO REQUEST & VIDEO MODAL (Comfortable, softly rounded, plush dark design)
// ============================================================================
function DemoModal({ isOpen, onClose }) {
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-lg bg-graphite border border-amber/30 rounded-[8px] p-8 shadow-2xl relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-dim hover:text-white text-xl"
        >
          ✕
        </button>

        {!submitted ? (
          <div>
            <h3 className="font-display font-extrabold text-2xl text-white mb-2">
              Request KhanijAI Executive Briefing
            </h3>
            <p className="text-dim text-sm mb-6">
              Connect your subsidiary pit data or schedule a demonstration with our governance deployment team.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
              className="space-y-4 text-sm"
            >
              <div>
                <label className="block text-xs font-mono text-dim uppercase mb-1">Official Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. R.K. Sharma"
                  className="w-full bg-coal border border-white/[0.1] rounded-[8px] px-4 py-2.5 text-offwhite focus:border-amber focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-dim uppercase mb-1">Subsidiary / Block</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. BCCL / Coal India Ltd"
                  className="w-full bg-coal border border-white/[0.1] rounded-[8px] px-4 py-2.5 text-offwhite focus:border-amber focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-dim uppercase mb-1">Government / Corporate Email</label>
                <input
                  required
                  type="email"
                  placeholder="name@coalindia.in"
                  className="w-full bg-coal border border-white/[0.1] rounded-[8px] px-4 py-2.5 text-offwhite focus:border-amber focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber text-coal font-bold text-sm rounded-[8px] hover:bg-amber/90 transition-colors uppercase tracking-wider mt-4"
              >
                Submit Briefing Request
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center py-8 space-y-3">
            <div className="text-amber text-4xl">✓</div>
            <h4 className="font-display font-bold text-2xl text-white">Briefing Request Received</h4>
            <p className="text-dim text-sm">
              Our technical liaison team will coordinate with your subsidiary office within 24 hours.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="mt-4 px-6 py-2 border border-amber text-amber text-xs font-semibold rounded-[8px]"
            >
              Close Window
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

function VideoModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-4xl bg-graphite border border-amber/30 rounded-[8px] p-4 shadow-2xl relative"
      >
        <div className="flex justify-between items-center mb-3 px-2">
          <div className="text-xs font-mono text-amber">KHANIJ_AI_PLATFORM_OVERVIEW</div>
          <button
            onClick={onClose}
            className="text-dim hover:text-white text-xl"
          >
            ✕
          </button>
        </div>

        <div className="aspect-video w-full bg-black rounded-[8px] overflow-hidden">
          <video
            src="/dashboard.mp4"
            autoPlay
            controls
            loop
            className="w-full h-full object-cover"
          />
        </div>
      </motion.div>
    </div>
  );
}

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================
export default function App() {
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-coal text-offwhite font-sans antialiased selection:bg-amber selection:text-coal relative">
      {/* 1. Global Scroll Progress Bar */}
      <GlobalProgressBar />

      {/* 2. Top Navbar */}
      <Navbar onOpenDemo={() => setDemoModalOpen(true)} />

      {/* Main Sections */}
      <main>
        {/* Section 1: Hero (with VIDEO 1: hero-bg.mp4) */}
        <HeroSection
          onOpenDemo={() => setDemoModalOpen(true)}
          onOpenVideo={() => setVideoModalOpen(true)}
        />

        {/* Section 2: The Crisis */}
        <CrisisSection />

        {/* Section 3: Horizontal Scroll Modules (600vh sticky) */}
        <HorizontalModulesSection />

        {/* Section 4: AI Engine (Typewriter terminal + cards) */}
        <AIEngineSection />

        {/* Section 5: Dashboard (with VIDEO 2: dashboard.mp4 in monitor) */}
        <DashboardSection onOpenDemo={() => setDemoModalOpen(true)} />

        {/* Section 6: GIS Map (Interactive India map + pulsing nodes) */}
        <GISMapSection />

        {/* Section 7: Three Perspectives (Sticky 400vh wrapper) */}
        <PerspectivesSection />

        {/* Section 8: Compliance Meter (SVG dial + stats) */}
        <ComplianceMeterSection />

        {/* Section 9: Trust Bar (Marquee) */}
        <TrustBarSection />

        {/* Section 10: CTA + Footer */}
        <CTAAndFooterSection
          onOpenDemo={() => setDemoModalOpen(true)}
          onOpenVideo={() => setVideoModalOpen(true)}
        />
      </main>

      {/* Interactive Modals */}
      <DemoModal isOpen={demoModalOpen} onClose={() => setDemoModalOpen(false)} />
      <VideoModal isOpen={videoModalOpen} onClose={() => setVideoModalOpen(false)} />
    </div>
  );
}
