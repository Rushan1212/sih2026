import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  Radio,
  Flame,
  Truck,
  FileText,
  MapPin,
  Download,
  Lock,
  Volume2,
  VolumeX,
  ArrowLeft,
  Play,
  Users,
  Gauge,
  Check,
  Building2,
  UserCheck,
  ChevronRight,
  ExternalLink,
  ShieldAlert,
  Compass,
  Cpu,
  RefreshCw,
  Sparkles,
  Zap,
  Layers,
  BarChart3,
  Waves,
  Clock,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../utils/sound';
import StatutoryAlertModal from './StatutoryAlertModal';

// Complete Subsidiary Telemetry & Regulatory Presets
const subsidiariesData = {
  bccl: {
    id: 'bccl',
    name: 'Bharat Coking Coal Limited (BCCL)',
    shortName: 'BCCL',
    location: 'Dhanbad, Jharkhand',
    coordinates: '23.7420° N, 86.4172° E',
    basin: 'Jharia Coalfield',
    pitName: 'Moonidih Deep Seam & Lodna Colliery',
    type: 'Deep Underground & Opencast Bench',
    complianceRate: 98.4,
    complianceGrade: 'A+ Statutory Compliant',
    methaneLevel: '0.06% Vol',
    methaneStatus: 'Optimal Safe',
    methaneLimit: '0.75% Vol',
    slopeStability: '99.8%',
    slopeFOS: '1.36',
    activeWorkers: '2,410 on-site',
    activeHEMM: '148 units',
    ventilationCFM: '142,000 CFM',
    ambientTemp: '27.4°C',
    coLevel: '0 ppm',
    activeAlerts: [
      { id: 'a1', severity: 'warning', text: 'Seam IV East Face: Optical CH4 sensor node #JH-402 reading 0.06% Vol (Well below 0.75% statutory limit)', time: '4m ago', clause: 'CMR 2017 Reg 137' },
      { id: 'a2', severity: 'info', text: 'Sub-surface main ventilation exhaust fan #3 synced with Central DGMS Node', time: '18m ago', clause: 'CMR 2017 Reg 138' },
    ],
    telemetryNodes: [
      { id: 'N-101', name: 'Seam IV East Working Face', type: 'Infrared Optical CH4 / CO Multi-Gas', value: '0.06% Vol', status: 'Optimal', health: '99.4%' },
      { id: 'N-102', name: 'Moonidih Shaft Incline Intake', type: 'Ultrasonic Air Velocity Anemometer', value: '142,000 CFM', status: 'Optimal', health: '98.8%' },
      { id: 'N-103', name: 'Underground Sub-station Bus #2', type: 'Intrinsically Safe Power Link', value: '6.6 kV Sealed', status: 'Optimal', health: '100%' },
      { id: 'N-104', name: 'Emergency Refuge Chamber #02', type: 'Atmospheric Life Support Telemetry', value: 'O2: 20.9% | CO: 0ppm', status: 'Optimal', health: '100%' },
    ],
    recentForms: [
      { id: 'F4-2025-081', type: 'DGMS Form-IV', title: 'Monthly Seam Air Quality & Gas Survey', date: '04 Sep 2025', status: 'Verified', hash: '0x7F9A...B301' },
      { id: 'F24-2025-144', type: 'DGMS Form-24', title: 'Shift Overman Statutory Inspection Registry', date: '04 Sep 2025', status: 'Digitally Signed', hash: '0x3C4D...E892' },
    ],
  },
  ecl: {
    id: 'ecl',
    name: 'Eastern Coalfields Limited (ECL)',
    shortName: 'ECL',
    location: 'Asansol, West Bengal',
    coordinates: '23.6210° N, 87.1240° E',
    basin: 'Raniganj Coalfield',
    pitName: 'Kenda Area Colliery & Deep Incline',
    type: 'Historic Seam & Deep Pit Working',
    complianceRate: 97.9,
    complianceGrade: 'A Statutory Compliant',
    methaneLevel: '0.08% Vol',
    methaneStatus: 'Optimal Safe',
    methaneLimit: '0.75% Vol',
    slopeStability: '99.5%',
    slopeFOS: '1.31',
    activeWorkers: '1,890 on-site',
    activeHEMM: '112 units',
    ventilationCFM: '128,000 CFM',
    ambientTemp: '28.1°C',
    coLevel: '0 ppm',
    activeAlerts: [
      { id: 'a3', severity: 'info', text: 'Kenda Deep Incline: Barometric pressure transducer calibration verified at 101.4 kPa', time: '12m ago', clause: 'CMR 2017 Reg 139' },
    ],
    telemetryNodes: [
      { id: 'N-201', name: 'Kenda Seam 7 Working Face', type: 'Catalytic Bead Multi-Gas Analyser', value: '0.08% Vol', status: 'Optimal', health: '97.2%' },
      { id: 'N-202', name: 'Main Return Airway Shaft', type: 'Continuous Exhaust Velocity Meter', value: '128,000 CFM', status: 'Optimal', health: '99.1%' },
      { id: 'N-203', name: 'Haulage Roadway Junction B', type: 'Intrinsically Safe Telemetry Link', value: 'Telemetry Locked', status: 'Optimal', health: '98.5%' },
    ],
    recentForms: [
      { id: 'F4-2025-067', type: 'DGMS Form-IV', title: 'Underground Working Ventilation Statement', date: '03 Sep 2025', status: 'Verified', hash: '0x992B...C104' },
      { id: 'F5-2025-019', type: 'DGMS Form-V', title: 'Quarterly Electrical Clearance Certificate', date: '01 Sep 2025', status: 'Approved', hash: '0x1A8F...77D0' },
    ],
  },
  secl: {
    id: 'secl',
    name: 'South Eastern Coalfields Limited (SECL)',
    shortName: 'SECL',
    location: 'Korba & Bilaspur, Chhattisgarh',
    coordinates: '22.3595° N, 82.7501° E',
    basin: 'Korba & Raigarh Basin',
    pitName: 'Gevra & Dipka Mega Opencast Super Pit',
    type: 'Mega Opencast Pit (Asia\'s Largest)',
    complianceRate: 99.4,
    complianceGrade: 'A+ Statutory Compliant',
    methaneLevel: '0.03% Vol',
    methaneStatus: 'Nominal Surface',
    methaneLimit: '0.75% Vol',
    slopeStability: '99.9%',
    slopeFOS: '1.44',
    activeWorkers: '4,120 on-site',
    activeHEMM: '386 units',
    ventilationCFM: 'Surface Airflow (Opencast)',
    ambientTemp: '31.2°C',
    coLevel: '0 ppm',
    activeAlerts: [
      { id: 'a4', severity: 'warning', text: 'Gevra Bench 12B: Radar micro-strain displacement checked: 1.2mm (Tolerance: < 5.0mm)', time: '8m ago', clause: 'CMR 2017 Reg 106' },
      { id: 'a5', severity: 'info', text: 'HEMM Fleet automated geo-fence compliance: 99.8% on Haul Road 4', time: '22m ago', clause: 'Mines Act Section 22A' },
    ],
    telemetryNodes: [
      { id: 'N-301', name: 'Gevra Bench 12B InSAR Radar', type: 'Sub-mm Slope Stability InSAR Radar', value: '1.2mm Strain', status: 'Optimal', health: '100%' },
      { id: 'N-302', name: 'Haul Road ANPR Entry Gate 01', type: 'RFID & Biometric ANPR Gate', value: '386 Fleet Synced', status: 'Optimal', health: '99.5%' },
      { id: 'N-303', name: 'Blast Zone Perimeter East', type: 'Seismograph Ground Vibration Monitor', value: 'PPV: 2.1 mm/s', status: 'Optimal', health: '100%' },
      { id: 'N-304', name: 'Weighbridge Automated Scale', type: 'Digital Tare & Overload Telemetry', value: 'Overload: 0%', status: 'Optimal', health: '100%' },
    ],
    recentForms: [
      { id: 'F106-2025-302', type: 'DGMS Form-IV', title: 'Opencast Slope Stability & Bench Profile Audit', date: '04 Sep 2025', status: 'Verified', hash: '0x55E1...890C' },
      { id: 'F24-2025-412', type: 'DGMS Form-24', title: 'HEMM Operator Safety Passport Ledger', date: '04 Sep 2025', status: 'Digitally Signed', hash: '0x99D2...31F8' },
    ],
  },
  mcl: {
    id: 'mcl',
    name: 'Mahanadi Coalfields Limited (MCL)',
    shortName: 'MCL',
    location: 'Angul & Sambalpur, Odisha',
    coordinates: '20.9509° N, 85.2166° E',
    basin: 'Talcher & Ib Valley Basin',
    pitName: 'Bhubaneswari & Ananta Opencast Pit',
    type: 'High-Volume Mechanized Opencast',
    complianceRate: 99.1,
    complianceGrade: 'A+ Statutory Compliant',
    methaneLevel: '0.02% Vol',
    methaneStatus: 'Nominal Surface',
    methaneLimit: '0.75% Vol',
    slopeStability: '99.8%',
    slopeFOS: '1.41',
    activeWorkers: '3,240 on-site',
    activeHEMM: '290 units',
    ventilationCFM: 'Surface Airflow (Opencast)',
    ambientTemp: '29.5°C',
    coLevel: '0 ppm',
    activeAlerts: [
      { id: 'a6', severity: 'info', text: 'Bhubaneswari Pit Gate #3: Automated RFID driver vocational passport verification verified', time: '14m ago', clause: 'DGMS Circular 04/2022' },
    ],
    telemetryNodes: [
      { id: 'N-401', name: 'Talcher Bench Crest #4', type: 'LiDAR Terrain Slope Profiler', value: 'FOS: 1.41 Nominal', status: 'Optimal', health: '99.0%' },
      { id: 'N-402', name: 'Crusher Conveyor Line 2', type: 'Thermal Bearing Temperature Monitor', value: '64°C (Safe < 85°C)', status: 'Optimal', health: '98.6%' },
      { id: 'N-403', name: 'Pit Ambient Dust Monitor', type: 'Continuous Laser PM2.5 / PM10 Head', value: 'PM10: 74 µg/m³', status: 'Optimal', health: '99.2%' },
    ],
    recentForms: [
      { id: 'F4-2025-119', type: 'DGMS Form-IV', title: 'Monthly Environmental Dust & Water Return', date: '03 Sep 2025', status: 'Verified', hash: '0x811A...09F3' },
    ],
  },
  ncl: {
    id: 'ncl',
    name: 'Northern Coalfields Limited (NCL)',
    shortName: 'NCL',
    location: 'Singrauli, MP & UP Border',
    coordinates: '24.1997° N, 82.6644° E',
    basin: 'Singrauli Coal Basin',
    pitName: 'Jayant & Nigahi Opencast Project',
    type: 'Continuous Heavy Dragline Working',
    complianceRate: 98.8,
    complianceGrade: 'A Statutory Compliant',
    methaneLevel: '0.04% Vol',
    methaneStatus: 'Nominal Surface',
    methaneLimit: '0.75% Vol',
    slopeStability: '99.7%',
    slopeFOS: '1.38',
    activeWorkers: '2,980 on-site',
    activeHEMM: '310 units',
    ventilationCFM: 'Surface Airflow',
    ambientTemp: '30.1°C',
    coLevel: '0 ppm',
    activeAlerts: [
      { id: 'a7', severity: 'info', text: 'Jayant Heavy Dragline #04 telemetry connected to Singrauli Central Dispatch', time: '30m ago', clause: 'CMR 2017 Reg 106' },
    ],
    telemetryNodes: [
      { id: 'N-501', name: 'Jayant Dragline 04', type: 'Heavy Equipment Telemetry Node', value: 'Cycle: 42s', status: 'Optimal', health: '99.4%' },
      { id: 'N-502', name: 'Nigahi Overburden Dump', type: 'Wireless Inclinometer Array', value: 'Zero Tilt', status: 'Optimal', health: '100%' },
    ],
    recentForms: [
      { id: 'F24-2025-288', type: 'DGMS Form-24', title: 'Heavy Dragline Bi-weekly Maintenance Log', date: '02 Sep 2025', status: 'Verified', hash: '0x43D9...71A2' },
    ],
  },
  wcl: {
    id: 'wcl',
    name: 'Western Coalfields Limited (WCL)',
    shortName: 'WCL',
    location: 'Chandrapur & Nagpur, Maharashtra',
    coordinates: '19.9615° N, 79.2961° E',
    basin: 'Wardha Valley Coalfield',
    pitName: 'Durgapur & Chandrapur Deep Pit',
    type: 'Semi-Deep Incline & Opencast',
    complianceRate: 98.2,
    complianceGrade: 'A Statutory Compliant',
    methaneLevel: '0.05% Vol',
    methaneStatus: 'Optimal Safe',
    methaneLimit: '0.75% Vol',
    slopeStability: '99.6%',
    slopeFOS: '1.35',
    activeWorkers: '1,650 on-site',
    activeHEMM: '94 units',
    ventilationCFM: '115,000 CFM',
    ambientTemp: '28.9°C',
    coLevel: '0 ppm',
    activeAlerts: [
      { id: 'a8', severity: 'info', text: 'Chandrapur Incline: Dewatering sump pump nominal — water level down 4.2m', time: '11m ago', clause: 'CMR 2017 Reg 144' },
    ],
    telemetryNodes: [
      { id: 'N-601', name: 'Durgapur Sump Pump 01', type: 'Submersible Flow Telemetry', value: 'Flow: 3,200 LPM', status: 'Optimal', health: '98.5%' },
      { id: 'N-602', name: 'Incline Tunnel 2 Sensor', type: 'CO & Toxic Gas Analyzer', value: 'CO: 0 ppm', status: 'Optimal', health: '99.1%' },
    ],
    recentForms: [
      { id: 'F4-2025-052', type: 'DGMS Form-IV', title: 'Incline Dewatering & Seam Stability Log', date: '01 Sep 2025', status: 'Verified', hash: '0x66B0...E124' },
    ],
  },
};

// Emergency War Room Scenarios
const simulationScenarios = [
  {
    id: 'methane_spike',
    title: 'Methane (CH4) Surge in Jharia Seam #4',
    subsidiary: 'BCCL Dhanbad',
    zone: 'Underground Seam IV (East District)',
    hazard: 'Explosive Gas Accumulation',
    icon: Flame,
    color: '#FF3B30',
    initialReading: '0.85% Vol (Statutory Limit: 0.75%)',
    clause: 'CMR 2017 Regulation 137 (Ventilation Standards)',
    steps: [
      { step: '0.0s', action: 'Telemetry Ingestion', detail: 'Optical CH4 sensor node #JH-402 reports 0.85% Vol surge' },
      { step: '0.4s', action: 'Neural Risk Classification', detail: 'AI maps to CMR 2017 Reg 137. Threat Level: CRITICAL 4' },
      { step: '0.9s', action: 'Autonomous Lockdown', detail: 'Section power cut off. Geo-fence alarm broadcast to 42 workers' },
      { step: '1.6s', action: 'DGMS Statutory Filing', detail: 'Automated Form-IV Incident Notice generated & signed digitally' },
    ],
  },
  {
    id: 'slope_failure',
    title: 'Bench Slope Micro-Shift at Korba Mega Pit',
    subsidiary: 'SECL Chhattisgarh',
    zone: 'Gevra Opencast Bench 12B',
    hazard: 'Overburden Rock Mass Instability',
    icon: Activity,
    color: '#FF9500',
    initialReading: '18.4mm displacement over 3 hours',
    clause: 'CMR 2017 Regulation 106 (Workings of Opencast Mines)',
    steps: [
      { step: '0.0s', action: 'Drone Lidar & Radar Match', detail: 'Sub-centimeter bench surface strain flagged in Sector 12B' },
      { step: '0.5s', action: 'Slope Stability Quotient (FOS)', detail: 'Factor of Safety calculated at 1.08 (Critical threshold < 1.20)' },
      { step: '1.1s', action: 'HEMM Fleet Rerouting', detail: '7 Haul trucks auto-diverted away from toe-drop zone' },
      { step: '1.8s', action: 'Executive War Room Broadcast', detail: 'Alert sent to Mine Agent and DGMS Regional Inspector' },
    ],
  },
  {
    id: 'contractor_violation',
    title: 'Uncertified Dumper Entry at Talcher',
    subsidiary: 'MCL Sambalpur',
    zone: 'Bhubaneswari Incline Pit Gate #3',
    hazard: 'Unauthorized Machinery & Uncertified Driver',
    icon: Truck,
    color: '#FFD60A',
    initialReading: 'RFID ANPR mismatch: VT Safety Passport Expired',
    clause: 'Mines Act 1952 Section 22A & Vocational Rules',
    steps: [
      { step: '0.0s', action: 'Gate ANPR & RFID Scan', detail: 'Dumper #OD-19-K-8422 flagged at automated weighbridge' },
      { step: '0.3s', action: 'Database Cross-Verification', detail: 'Driver VT safety passport lapsed 18 days ago' },
      { step: '0.8s', action: 'Boom Barrier Auto-Lock', detail: 'Physical gate barrier locked. Security overman alerted' },
      { step: '1.4s', action: 'Contractor Penalty Ledger', detail: 'Contractor compliance rating penalized -5% in central ERP' },
    ],
  },
];

// Antigravity Staggered Motion Variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const cardItemVariants = {
  hidden: { opacity: 0, y: 35, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function ExploreDashboard({ onBackToLanding, onOpenDemoModal, selectedMine, onChangeMine }) {
  const [activeCustomMine, setActiveCustomMine] = useState(selectedMine || null);
  const [selectedSub, setSelectedSub] = useState('bccl');
  const [activeTab, setActiveTab] = useState('telemetry'); // telemetry, gis, compliance, fleet, simulator
  const [selectedRole, setSelectedRole] = useState('manager'); // inspector, manager, authority
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  // Antigravity Scroll & Motion Parallax Hooks
  const { scrollY, scrollYProgress } = useScroll();
  const smoothScrollProgress = useSpring(scrollYProgress, { damping: 28, stiffness: 220 });

  const orb1Y = useTransform(scrollY, [0, 1500], [0, -160]);
  const orb2Y = useTransform(scrollY, [0, 1500], [0, 180]);
  const orb3Y = useTransform(scrollY, [0, 1500], [0, -110]);
  const bannerScale = useTransform(scrollY, [0, 450], [1, 0.98]);
  const bannerRotateX = useTransform(scrollY, [0, 450], [0, 3]);
  const bannerOpacity = useTransform(scrollY, [0, 600], [1, 0.9]);

  // Spatial Seam Depth Tracker (Surface 0m to Deep Face -380m)
  const [seamDepth, setSeamDepth] = useState(0);
  useEffect(() => {
    return scrollY.on('change', (latest) => {
      const depth = Math.min(380, Math.round((latest / 1100) * 380));
      setSeamDepth(depth);
    });
  }, [scrollY]);

  // Interactive Simulation state
  const [activeSim, setActiveSim] = useState(simulationScenarios[0]);
  const [simRunning, setSimRunning] = useState(false);
  const [simStepIndex, setSimStepIndex] = useState(0);
  const [simFinished, setSimFinished] = useState(false);

  // Form Generator Modal state
  const [generatedForm, setGeneratedForm] = useState(null);
  const [formModalOpen, setFormModalOpen] = useState(false);

  // Statutory Shift Alert Modal state
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [alertStates, setAlertStates] = useState({});

  useEffect(() => {
    if (selectedMine) {
      setActiveCustomMine(selectedMine);
    }
  }, [selectedMine]);

  const sub = activeCustomMine || subsidiariesData[selectedSub] || subsidiariesData.bccl;

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }) + ' IST'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSubChange = (subKey) => {
    soundManager.playClick();
    setSelectedSub(subKey);
    setActiveCustomMine(null);
  };

  const handleTabChange = (tabKey) => {
    soundManager.playHover();
    setActiveTab(tabKey);
  };

  const handleRoleChange = (roleKey) => {
    soundManager.playClick();
    setSelectedRole(roleKey);
  };

  const toggleMute = () => {
    soundManager.muted = !muted;
    setMuted(!muted);
  };

  const handleStartSimulation = () => {
    soundManager.playAlert();
    setSimRunning(true);
    setSimStepIndex(0);
    setSimFinished(false);

    activeSim.steps.forEach((_, idx) => {
      setTimeout(() => {
        setSimStepIndex(idx + 1);
        soundManager.playHover();
        if (idx === activeSim.steps.length - 1) {
          setSimRunning(false);
          setSimFinished(true);
          soundManager.playSuccess();
          try {
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.7 },
              colors: ['#F5A623', '#00C9A7', '#FFFFFF'],
            });
          } catch (e) {}
        }
      }, (idx + 1) * 800);
    });
  };

  const handleGenerateForm = (formType) => {
    soundManager.playClick();
    const formRecord = {
      type: formType,
      id: `${formType}-${Date.now().toString().slice(-6)}`,
      subsidiary: sub.name,
      pit: sub.pitName,
      location: sub.location,
      timestamp: new Date().toISOString(),
      signee:
        selectedRole === 'inspector'
          ? 'R.K. Singh (Statutory Safety Officer)'
          : selectedRole === 'manager'
          ? 'A.K. Sharma (Mine Agent & General Manager)'
          : 'Central DGMS Regional Inspectorate',
      hash: '0x' + Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      status: 'VERIFIED & DIGITALLY SEALED',
    };
    setGeneratedForm(formRecord);
    setFormModalOpen(true);
  };

  const handleOpenAlert = (alertItem) => {
    soundManager.playClick();
    setSelectedAlert(alertItem);
  };

  const handleUpdateAlertState = (alertId, newState) => {
    setAlertStates((prev) => ({
      ...prev,
      [alertId]: {
        ...(prev[alertId] || {}),
        ...newState,
      },
    }));
  };

  return (
    <div className="min-h-screen bg-[#0A0A10] text-offwhite font-sans antialiased relative selection:bg-amber selection:text-coal overflow-x-hidden dot-grid-amber">
      {/* 1. Global Scroll Progress Laser Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-amber via-teal to-amber origin-left z-[9999] pointer-events-none shadow-[0_0_12px_rgba(245,166,35,0.7)]"
        style={{ scaleX: smoothScrollProgress }}
      />

      {/* 2. Weightless Parallax Ambient Lighting Blobs (Antigravity Spatial Atmosphere) */}
      <motion.div
        style={{ y: orb1Y }}
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-amber/[0.04] blur-[160px] pointer-events-none rounded-full"
      />
      <motion.div
        style={{ y: orb2Y }}
        className="fixed bottom-10 right-10 w-[600px] h-[400px] bg-[#2D3561]/25 blur-[180px] pointer-events-none rounded-full"
      />
      <motion.div
        style={{ y: orb3Y }}
        className="fixed top-1/3 left-10 w-[500px] h-[350px] bg-teal/[0.025] blur-[170px] pointer-events-none rounded-full"
      />

      {/* Floating Spatial Micro-Particles */}
      <motion.div
        animate={{ y: [0, -25, 0], x: [0, 10, 0], opacity: [0.2, 0.5, 0.2] }}
        transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
        className="fixed top-1/4 right-1/4 w-1.5 h-1.5 rounded-full bg-amber/40 blur-[1px] pointer-events-none"
      />
      <motion.div
        animate={{ y: [0, -20, 0], x: [0, -12, 0], opacity: [0.15, 0.45, 0.15] }}
        transition={{ repeat: Infinity, duration: 10, ease: 'easeInOut', delay: 2 }}
        className="fixed top-2/3 left-1/5 w-2 h-2 rounded-full bg-teal/30 blur-[1px] pointer-events-none"
      />

      {/* ========================================================================= */}
      {/* 1. TOP COMMAND HEADER — Soft Glassmorphism, Generous Breathing Room */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-50 bg-[#0D0D16]/90 backdrop-blur-xl border-b border-white/[0.08] px-6 sm:px-12 py-4 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-5">
          {/* Left: Return to Overview + Brand */}
          <div className="flex items-center gap-4 sm:gap-6">
            <button
              onClick={() => {
                soundManager.playClick();
                onBackToLanding();
              }}
              className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-[#141422] border border-white/[0.1] hover:border-amber/60 text-offwhite hover:text-amber text-xs font-mono transition-all duration-200 shadow-sm group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Overview</span>
            </button>

            <div className="h-6 w-[1px] bg-white/[0.1] hidden sm:block" />

            <div className="flex items-center gap-2.5">
              <span className="text-amber font-mono text-base animate-pulse">◆</span>
              <span className="font-display font-extrabold text-xl tracking-tight text-white">
                Khanij<span className="text-amber">AI</span>
              </span>
              <span className="ml-1 px-3 py-1 rounded-full bg-amber/15 border border-amber/35 text-amber text-[11px] font-mono tracking-wider uppercase font-semibold shadow-sm">
                Operations Radar
              </span>
            </div>
          </div>

          {/* Center: Active Colliery Switcher & Subsidiary Quick Pills */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundManager.playClick();
                if (onChangeMine) onChangeMine();
              }}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber/10 border border-amber/30 text-amber hover:bg-amber/20 hover:border-amber/60 text-xs font-mono font-medium transition-all duration-200 shadow-sm group"
              title="Click to browse 50+ pre-existing mines or curate custom mine telemetry"
            >
              <Building2 className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
              <span className="font-semibold max-w-[140px] sm:max-w-[200px] truncate">
                {sub.name.replace(/\[.*?\]/, '').trim()}
              </span>
              <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded-full bg-amber/20 font-bold uppercase tracking-wider">
                Change Mine ↗
              </span>
            </button>

            {/* Quick subsidiary switcher pills */}
            <div className="hidden xl:flex items-center gap-1.5 p-1 bg-[#12121E]/90 backdrop-blur-md rounded-2xl border border-white/[0.08] shadow-inner">
              {Object.keys(subsidiariesData).map((subKey) => {
                const item = subsidiariesData[subKey];
                const isSelected = !activeCustomMine && selectedSub === subKey;
                return (
                  <button
                    key={subKey}
                    onClick={() => handleSubChange(subKey)}
                    className={`px-3 py-1 rounded-xl text-xs font-mono font-medium transition-all duration-200 whitespace-nowrap ${
                      isSelected
                        ? 'bg-amber text-coal font-bold shadow-[0_0_20px_rgba(245,166,35,0.35)] scale-[1.02]'
                        : 'text-dim hover:text-offwhite hover:bg-white/[0.05]'
                    }`}
                  >
                    {item.shortName}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Seam Depth Tracker + Live Telemetry Status + Tactical Audio + Request Briefing */}
          <div className="flex items-center gap-3 font-mono text-xs">
            {/* Real-Time Seam Depth HUD (Antigravity Vertical Spatial Sensor) */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#141422] border border-amber/25 text-amber shadow-sm">
              <Compass className="w-3.5 h-3.5 text-amber animate-spin" style={{ animationDuration: '14s' }} />
              <span className="text-dim text-[11px]">DATUM: 0m</span>
              <span className="text-white/20">|</span>
              <span className="text-dim text-[11px]">SEAM:</span>
              <span className="text-amber font-bold">-{seamDepth}m</span>
            </div>

            <div className="hidden sm:flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-[#141422] border border-teal/30 text-teal shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-teal animate-pulse" />
              <span className="font-medium">CMR-2017</span>
              <span className="text-white/20">|</span>
              <span className="text-offwhite font-mono text-[11px]">{currentTime}</span>
            </div>

            <button
              onClick={() => {
                const first = sub.activeAlerts?.[0];
                if (first) handleOpenAlert(first);
              }}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#141422] border border-amber/30 text-amber hover:bg-amber/15 hover:border-amber/60 transition-all shadow-sm group"
              title="Click to inspect latest statutory shift alert modal"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber animate-pulse" />
              <span className="font-bold">
                {sub.activeAlerts?.length || 0} Alerts
              </span>
            </button>

            <button
              onClick={toggleMute}
              className="p-2.5 rounded-xl bg-[#141422] border border-white/[0.08] text-dim hover:text-amber hover:border-amber/40 transition-all duration-200"
              title={muted ? 'Unmute tactical audio' : 'Mute tactical audio'}
            >
              {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber" />}
            </button>

            <button
              onClick={onOpenDemoModal}
              className="px-4 py-2 rounded-xl bg-amber text-coal font-bold text-xs tracking-wider hover:bg-amber/90 transition-all duration-200 shadow-[0_0_25px_rgba(245,166,35,0.25)] font-mono"
            >
              Briefing
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. SUB-HEADER: LUXURIOUS MINE IDENTITY BANNER (Antigravity 3D Perspective) */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto w-full px-6 sm:px-12 pt-8 sm:pt-12 pb-4">
        <motion.div
          style={{ scale: bannerScale, rotateX: bannerRotateX, opacity: bannerOpacity }}
          className="perspective-1000 preserve-3d p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-graphite/90 via-[#161628]/90 to-graphite/90 border border-white/[0.08] backdrop-blur-2xl shadow-[0_25px_70px_rgba(0,0,0,0.45)] relative overflow-hidden flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 transition-colors hover:border-amber/30"
        >
          {/* Ambient Corner Glow inside Banner */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber/[0.04] blur-3xl pointer-events-none rounded-full" />

          {/* Mine Details */}
          <div className="space-y-3 relative z-10 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono">
              <motion.span
                animate={{ y: [0, -3, 0] }}
                transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber/10 border border-amber/30 text-amber font-semibold shadow-[0_0_15px_rgba(245,166,35,0.12)]"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>{sub.name}</span>
              </motion.span>
              <span className="text-dim flex items-center gap-1">
                <MapPin className="w-3 h-3 text-dim" />
                <span>{sub.location}</span>
              </span>
              <span className="text-dim">({sub.coordinates})</span>

              {sub.production && (
                <span className="px-2.5 py-0.5 rounded-full bg-teal/15 border border-teal/30 text-teal text-[11px] font-semibold">
                  Prod: {sub.production}
                </span>
              )}

              <button
                onClick={() => {
                  soundManager.playClick();
                  if (onChangeMine) onChangeMine();
                }}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/[0.05] hover:bg-amber/15 border border-white/[0.1] hover:border-amber/40 text-offwhite hover:text-amber transition-colors font-medium cursor-pointer text-[11px]"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Switch Mine / Company</span>
              </button>
            </div>

            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight leading-tight">
              {sub.pitName}
            </h1>

            <p className="text-dim text-sm sm:text-base leading-relaxed max-w-xl font-normal">
              Continuous DGMS CMR 2017 sub-surface telemetric feed across {sub.basin}. Real-time monitoring of ventilation velocity, methane gas, and bench slope profiling.
            </p>
          </div>

          {/* Role Perspective Switcher — Plush Tactile Switcher */}
          <div className="relative z-10 space-y-2.5 w-full lg:w-auto">
            <div className="text-[11px] font-mono text-dim uppercase tracking-wider font-semibold">
              Select Operational Role:
            </div>
            <div className="flex flex-wrap items-center gap-2 p-1.5 bg-[#0D0D14]/90 rounded-2xl border border-white/[0.08] shadow-inner">
              {[
                { key: 'manager', label: 'Mine Manager', icon: Gauge },
                { key: 'inspector', label: 'Field Inspector', icon: ShieldCheck },
                { key: 'authority', label: 'DGMS Authority', icon: Lock },
              ].map((role) => {
                const Icon = role.icon;
                const isRoleActive = selectedRole === role.key;
                return (
                  <button
                    key={role.key}
                    onClick={() => handleRoleChange(role.key)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-medium transition-all duration-200 ${
                      isRoleActive
                        ? 'bg-amber text-coal font-bold shadow-[0_0_20px_rgba(245,166,35,0.3)]'
                        : 'text-dim hover:text-offwhite hover:bg-white/[0.05]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{role.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ========================================================================= */}
      {/* 3. MAIN DASHBOARD CONTENT (Matching Spacious 'py-10 space-y-12' Layout) */}
      {/* ========================================================================= */}
      <main className="max-w-7xl mx-auto w-full px-6 sm:px-12 py-8 sm:py-12 space-y-12">
        {/* TOP KPI CARDS — Antigravity 3D Floating Cards, Staggered Scroll Entrance */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
        >
          {/* Card 1: Statutory Compliance Rate */}
          <motion.div
            variants={cardItemVariants}
            whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.25, ease: 'easeOut' } }}
            className="preserve-3d relative group p-7 sm:p-8 rounded-3xl bg-[#131322]/80 border border-white/[0.08] hover:border-amber/40 backdrop-blur-2xl shadow-[0_16px_40px_rgba(0,0,0,0.35)] hover:shadow-[0_25px_60px_rgba(245,166,35,0.12)] flex flex-col justify-between transition-colors duration-300 overflow-hidden"
          >
            <div className="absolute -inset-px bg-gradient-to-b from-amber/[0.06] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl" />
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-mono text-dim uppercase tracking-wider">CMR 2017 Compliance</span>
              <span className="w-2.5 h-2.5 rounded-full bg-teal animate-pulse" />
            </div>
            <div className="space-y-1">
              <div className="font-display font-extrabold text-4xl sm:text-5xl text-amber tracking-tight">
                {sub.complianceRate}%
              </div>
              <div className="text-xs text-teal font-mono font-medium pt-1">
                {sub.complianceGrade}
              </div>
            </div>
            <div className="w-full bg-coal/80 h-2 rounded-full mt-6 overflow-hidden p-0.5 border border-white/[0.04]">
              <div
                className="bg-gradient-to-r from-amber to-amber/80 h-full rounded-full transition-all duration-700"
                style={{ width: `${sub.complianceRate}%` }}
              />
            </div>
          </motion.div>

          {/* Card 2: Gas & Atmospheric Methane (CH4) */}
          <motion.div
            variants={cardItemVariants}
            whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.25, ease: 'easeOut' } }}
            className="preserve-3d relative group p-7 sm:p-8 rounded-3xl bg-[#131322]/80 border border-white/[0.08] hover:border-amber/40 backdrop-blur-2xl shadow-[0_16px_40px_rgba(0,0,0,0.35)] hover:shadow-[0_25px_60px_rgba(245,166,35,0.12)] flex flex-col justify-between transition-colors duration-300 overflow-hidden"
          >
            <div className="absolute -inset-px bg-gradient-to-b from-amber/[0.06] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl" />
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-mono text-dim uppercase tracking-wider">Methane (CH4) Level</span>
              <div className="w-8 h-8 rounded-xl bg-amber/10 border border-amber/20 flex items-center justify-center text-amber">
                <Flame className="w-4 h-4" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="font-display font-extrabold text-4xl sm:text-5xl text-white tracking-tight">
                {sub.methaneLevel}
              </div>
              <div className="text-xs text-dim font-mono pt-1">
                Status: <span className="text-teal font-semibold">{sub.methaneStatus}</span> (Limit: {sub.methaneLimit})
              </div>
            </div>
            <div className="text-xs font-mono text-dim pt-4 mt-2 border-t border-white/[0.06] flex items-center justify-between">
              <span>Ventilation:</span>
              <span className="text-offwhite font-medium">{sub.ventilationCFM}</span>
            </div>
          </motion.div>

          {/* Card 3: Slope Stability (FOS) */}
          <motion.div
            variants={cardItemVariants}
            whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.25, ease: 'easeOut' } }}
            className="preserve-3d relative group p-7 sm:p-8 rounded-3xl bg-[#131322]/80 border border-white/[0.08] hover:border-teal/40 backdrop-blur-2xl shadow-[0_16px_40px_rgba(0,0,0,0.35)] hover:shadow-[0_25px_60px_rgba(0,201,167,0.12)] flex flex-col justify-between transition-colors duration-300 overflow-hidden"
          >
            <div className="absolute -inset-px bg-gradient-to-b from-teal/[0.06] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl" />
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-mono text-dim uppercase tracking-wider">Slope Stability</span>
              <div className="w-8 h-8 rounded-xl bg-teal/10 border border-teal/20 flex items-center justify-center text-teal">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="font-display font-extrabold text-4xl sm:text-5xl text-white tracking-tight">
                {sub.slopeStability}
              </div>
              <div className="text-xs text-dim font-mono pt-1">
                Factor of Safety: <span className="text-amber font-semibold">{sub.slopeFOS} FOS (Safe &gt; 1.20)</span>
              </div>
            </div>
            <div className="text-xs font-mono text-dim pt-4 mt-2 border-t border-white/[0.06] flex items-center justify-between">
              <span>InSAR Radar:</span>
              <span className="text-teal font-medium">Sub-mm Strain Nominal</span>
            </div>
          </motion.div>

          {/* Card 4: Active Fleet & Shift Muster */}
          <motion.div
            variants={cardItemVariants}
            whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.25, ease: 'easeOut' } }}
            className="preserve-3d relative group p-7 sm:p-8 rounded-3xl bg-[#131322]/80 border border-white/[0.08] hover:border-amber/40 backdrop-blur-2xl shadow-[0_16px_40px_rgba(0,0,0,0.35)] hover:shadow-[0_25px_60px_rgba(245,166,35,0.12)] flex flex-col justify-between transition-colors duration-300 overflow-hidden"
          >
            <div className="absolute -inset-px bg-gradient-to-b from-amber/[0.06] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl" />
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-mono text-dim uppercase tracking-wider">Workforce & HEMM</span>
              <div className="w-8 h-8 rounded-xl bg-amber/10 border border-amber/20 flex items-center justify-center text-amber">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="font-display font-extrabold text-4xl sm:text-5xl text-white tracking-tight">
                {sub.activeWorkers.split(' ')[0]}
              </div>
              <div className="text-xs text-dim font-mono pt-1">
                Active Personnel (100% VT Passports)
              </div>
            </div>
            <div className="text-xs font-mono text-dim pt-4 mt-2 border-t border-white/[0.06] flex items-center justify-between">
              <span>HEMM Dumpers:</span>
              <span className="text-amber font-bold">{sub.activeHEMM}</span>
            </div>
          </motion.div>
        </motion.div>

        {/* WORKSPACE NAVIGATION BAR — Plush Pill Switcher with Framer Motion layoutId */}
        <div className="p-2 bg-[#12121E]/90 border border-white/[0.08] rounded-2xl backdrop-blur-xl flex items-center gap-2 overflow-x-auto shadow-lg relative">
          {[
            { key: 'telemetry', label: 'Live Telemetry Mesh', icon: Radio },
            { key: 'gis', label: 'GIS Basin Radar', icon: MapPin },
            { key: 'compliance', label: 'DGMS CMR 2017 Matrix', icon: FileText },
            { key: 'fleet', label: 'HEMM Fleet & Muster', icon: Truck },
            { key: 'simulator', label: 'Incident War Room', icon: Flame },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`relative flex items-center gap-2.5 px-5 py-3 rounded-xl text-xs sm:text-sm font-mono transition-colors duration-200 whitespace-nowrap ${
                  isActive ? 'text-coal font-bold' : 'text-dim hover:text-offwhite hover:bg-white/[0.04]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeWorkspaceTab"
                    className="absolute inset-0 bg-amber rounded-xl shadow-[0_0_25px_rgba(245,166,35,0.35)]"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <Icon className={`w-4 h-4 relative z-10 ${isActive ? 'text-coal' : 'text-amber'}`} />
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* WORKSPACE CONTENT AREA WITH FLUID ANTIGRAVITY MOTION */}
        <AnimatePresence mode="wait">
          {/* ===================================================================== */}
          {/* TAB 1: LIVE TELEMETRY MESH */}
          {/* ===================================================================== */}
          {activeTab === 'telemetry' && (
            <motion.div
              key="telemetry"
              initial={{ opacity: 0, y: 22, filter: 'blur(6px)', scale: 0.985 }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
              exit={{ opacity: 0, y: -18, filter: 'blur(6px)', scale: 0.985 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              {/* Left 60%: Sensor Mesh Nodes */}
              <div className="lg:col-span-7 space-y-6">
                <div className="flex items-center justify-between px-1">
                  <div>
                    <h3 className="font-display font-bold text-2xl text-white flex items-center gap-2.5">
                      <span>Active Telemetry Sensor Mesh</span>
                      <span className="w-2.5 h-2.5 rounded-full bg-teal animate-ping" />
                    </h3>
                    <p className="text-xs text-dim font-mono mt-1">
                      Continuous sub-second telemetry sampling across statutory mine faces
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#161626] border border-white/[0.08] text-xs font-mono text-dim flex items-center gap-1.5 shadow-sm">
                    <Activity className="w-3.5 h-3.5 text-amber" />
                    <span>Refresh: 1000ms</span>
                  </span>
                </div>

                {/* Staggered Telemetry Nodes */}
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="space-y-4"
                >
                  {sub.telemetryNodes.map((node) => (
                    <motion.div
                      key={node.id}
                      variants={cardItemVariants}
                      whileHover={{ y: -4, scale: 1.015, transition: { duration: 0.2, ease: 'easeOut' } }}
                      className="preserve-3d p-6 rounded-2xl bg-[#131320]/80 border border-white/[0.07] hover:border-amber/40 backdrop-blur-xl transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group shadow-sm hover:shadow-[0_12px_30px_rgba(0,0,0,0.4)]"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#18182A] border border-amber/20 flex items-center justify-center text-amber font-mono font-bold text-sm group-hover:border-amber/60 group-hover:scale-105 transition-all shadow-inner">
                          {node.id.split('-')[1]}
                        </div>
                        <div>
                          <div className="font-display font-bold text-lg text-white group-hover:text-amber transition-colors flex items-center gap-2">
                            <span>{node.name}</span>
                          </div>
                          <div className="text-xs font-mono text-dim mt-0.5">
                            {node.type} · System Integrity: <span className="text-offwhite font-medium">{node.health}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-left sm:text-right w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-white/[0.06]">
                        <div className="font-mono font-bold text-base text-offwhite group-hover:text-amber transition-colors">
                          {node.value}
                        </div>
                        <div className="text-xs font-mono text-teal flex items-center gap-1.5 justify-start sm:justify-end mt-0.5">
                          <span className="w-2 h-2 rounded-full bg-teal animate-pulse" />
                          <span>{node.status}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                {/* 60s Live Waveform Chart */}
                <div className="p-7 sm:p-8 rounded-3xl bg-[#131320]/80 border border-white/[0.08] backdrop-blur-xl shadow-lg space-y-4 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-60 h-60 bg-amber/[0.03] blur-3xl pointer-events-none rounded-full" />
                  <div className="flex justify-between items-center text-xs font-mono relative z-10">
                    <span className="text-amber font-bold flex items-center gap-2">
                      <Activity className="w-4 h-4 animate-pulse" />
                      <span>CH4 & AIRFLOW CONTINUOUS 60s WAVEFORM</span>
                    </span>
                    <span className="text-dim">STATUTORY PROTOCOL // REG 137</span>
                  </div>

                  <div className="h-32 w-full flex items-end gap-2 pt-6 relative z-10">
                    {[42, 45, 43, 48, 50, 46, 44, 49, 52, 47, 43, 41, 46, 48, 50, 53, 51, 47, 45, 49, 52, 48, 44, 46, 49, 53, 55, 51, 48, 46, 47, 50].map((h, i) => (
                      <motion.div
                        key={i}
                        animate={{ height: [`${h}%`, `${h + (i % 3 === 0 ? 9 : -6)}%`, `${h}%`] }}
                        transition={{ duration: 2.8, repeat: Infinity, delay: i * 0.04 }}
                        className="flex-1 bg-gradient-to-t from-amber/25 via-amber/60 to-amber rounded-t-md hover:brightness-125 transition-all shadow-[0_0_8px_rgba(245,166,35,0.2)] cursor-pointer"
                        title={`Timestamp T-${60 - i * 2}s: ${h}% Vol`}
                      />
                    ))}
                  </div>

                  <div className="flex justify-between text-xs font-mono text-dim pt-3 border-t border-white/[0.06] relative z-10">
                    <span>-60s (Seam Sensor Ingestion)</span>
                    <span>-30s</span>
                    <span className="text-teal font-semibold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-teal animate-pulse" />
                      <span>LIVE NOW (0s)</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Right 40%: Statutory Alerts & Role Actions */}
              <div className="lg:col-span-5 space-y-6">
                <div className="flex items-center justify-between px-1">
                  <div>
                    <h3 className="font-display font-bold text-2xl text-white">
                      Statutory Shift Alerts
                    </h3>
                    <p className="text-dim text-xs font-mono mt-0.5">
                      Click any alert to open live DGMS statutory action modal
                    </p>
                  </div>
                  {(() => {
                    const alerts = sub.activeAlerts || [];
                    const resolvedCount = alerts.filter((a) => alertStates[a.id]?.acknowledged).length;
                    const isAllResolved = resolvedCount === alerts.length && alerts.length > 0;
                    return isAllResolved ? (
                      <span className="px-3 py-1 rounded-full bg-teal/15 text-teal border border-teal/40 text-xs font-mono font-medium flex items-center gap-1.5 shadow-[0_0_12px_rgba(0,229,255,0.2)]">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>All {alerts.length} Cleared & Sealed</span>
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-amber/15 text-amber border border-amber/40 text-xs font-mono font-medium flex items-center gap-1.5 shadow-[0_0_12px_rgba(245,166,35,0.2)]">
                        <span className="w-2 h-2 rounded-full bg-amber animate-pulse" />
                        <span>{alerts.length - resolvedCount} Pending Review</span>
                      </span>
                    );
                  })()}
                </div>

                <div className="space-y-4">
                  {(sub.activeAlerts || []).map((alert) => {
                    const st = alertStates[alert.id] || {};
                    const isAck = Boolean(st.acknowledged);
                    const isDisp = Boolean(st.dispatched);
                    const isCritical = alert.severity === 'critical';

                    const cardBorder = isAck
                      ? 'border-teal/40 hover:border-teal/70 shadow-[0_0_20px_rgba(0,229,255,0.12)]'
                      : isDisp
                      ? 'border-amber/50 hover:border-amber/80 shadow-[0_0_20px_rgba(245,166,35,0.15)]'
                      : isCritical
                      ? 'border-red-500/40 hover:border-red-500/70 shadow-[0_0_20px_rgba(239,68,68,0.15)]'
                      : 'border-amber/25 hover:border-amber/60';

                    return (
                      <motion.div
                        key={alert.id}
                        whileHover={{ y: -3, scale: 1.01, transition: { duration: 0.2 } }}
                        onClick={() => handleOpenAlert(alert)}
                        className={`p-6 rounded-2xl bg-[#131320]/90 border ${cardBorder} backdrop-blur-xl shadow-md space-y-3.5 transition-all cursor-pointer group relative overflow-hidden`}
                      >
                        {/* Interactive Top Accent Line on Hover */}
                        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className={`font-bold flex items-center gap-2 ${isAck ? 'text-teal' : isCritical ? 'text-red-400' : 'text-amber'}`}>
                            {isAck ? (
                              <CheckCircle2 className="w-4 h-4 text-teal" />
                            ) : isDisp ? (
                              <Radio className="w-4 h-4 text-amber animate-pulse" />
                            ) : (
                              <AlertTriangle className="w-4 h-4 text-amber" />
                            )}
                            <span>{alert.clause}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-white/[0.05] border border-white/[0.08] text-dim font-normal">
                              REF #{alert.id.toUpperCase()}
                            </span>
                          </span>
                          <span className="text-dim flex items-center gap-1">
                            <Clock className="w-3 h-3 text-dim" />
                            <span>{alert.time}</span>
                          </span>
                        </div>

                        <p className="text-offwhite text-xs sm:text-sm leading-relaxed font-sans font-normal group-hover:text-white transition-colors">
                          {alert.text}
                        </p>

                        <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono">
                          {isAck ? (
                            <span className="text-teal flex items-center gap-1.5 font-semibold">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                              <span>Statutorily Sealed ({st.hash ? st.hash.slice(0, 10) + '...' : 'Signed'})</span>
                            </span>
                          ) : isDisp ? (
                            <span className="text-amber flex items-center gap-1.5 font-semibold">
                              <span className="w-2 h-2 rounded-full bg-amber animate-ping" />
                              <span>Rapid Response Unit Deployed</span>
                            </span>
                          ) : (
                            <span className="text-dim flex items-center gap-1.5 font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse" />
                              <span>Pending Biometric Sign-off</span>
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenAlert(alert);
                            }}
                            className={`font-semibold flex items-center gap-1 px-3 py-1.5 rounded-xl border text-xs transition-all ${
                              isAck
                                ? 'bg-teal/10 border-teal/30 text-teal hover:bg-teal/20'
                                : 'bg-amber/10 border-amber/30 text-amber hover:bg-amber/20 hover:border-amber/50'
                            }`}
                          >
                            <span>{isAck ? 'View Audit Seal' : isDisp ? 'Inspect Dispatch' : 'Inspect & Sign'}</span>
                            <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Plush Role Action Card */}
                <motion.div
                  whileHover={{ y: -4, transition: { duration: 0.25 } }}
                  className="p-8 rounded-3xl bg-gradient-to-br from-[#161628] to-[#12121E] border border-amber/30 backdrop-blur-xl shadow-lg space-y-4 relative overflow-hidden"
                >
                  <div className="flex items-center gap-3 text-sm font-mono text-amber font-bold">
                    <ShieldCheck className="w-5 h-5" />
                    <span>ACTION SUITE // {selectedRole.toUpperCase()}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-dim leading-relaxed">
                    {selectedRole === 'inspector' &&
                      'Sub-meter geo-fenced inspection mode active. Biometric digital signing enabled for underground and surface statutory inspection rosters.'}
                    {selectedRole === 'manager' &&
                      'Colliery executive oversight enabled. 24/7 automated DGMS telemetry stream active at 99.8% uptime SLA across all active pits.'}
                    {selectedRole === 'authority' &&
                      'Central regulatory portal connected. Immediate statutory notice verification and blockchain evidentiary ledger accessible for legal audit.'}
                  </p>
                  <div className="pt-3 flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => handleGenerateForm('FORM-IV')}
                      className="flex-1 py-3 px-4 rounded-xl bg-amber text-coal font-bold text-xs font-mono hover:bg-amber/90 transition-colors shadow-sm"
                    >
                      Compile Form-IV Notice
                    </button>
                    <button
                      onClick={() => handleGenerateForm('FORM-24')}
                      className="flex-1 py-3 px-4 rounded-xl bg-coal/80 border border-white/[0.12] text-offwhite font-mono text-xs hover:border-amber hover:text-amber transition-colors"
                    >
                      Muster Log (Form-24)
                    </button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* ===================================================================== */}
          {/* TAB 2: GIS BASIN RADAR (Continuous 360 Rotating Radar Beam) */}
          {/* ===================================================================== */}
          {activeTab === 'gis' && (
            <motion.div
              key="gis"
              initial={{ opacity: 0, y: 22, filter: 'blur(6px)', scale: 0.985 }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
              exit={{ opacity: 0, y: -18, filter: 'blur(6px)', scale: 0.985 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="p-8 sm:p-10 rounded-3xl bg-[#131320]/80 border border-white/[0.08] backdrop-blur-xl shadow-xl space-y-6"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="font-display font-bold text-2xl text-white flex items-center gap-3">
                    <span>National Coalfield Telemetry Radar</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber animate-ping" />
                  </h3>
                  <p className="text-xs sm:text-sm text-dim font-mono mt-1">
                    INTERACTIVE SATELLITE BASIN OVERLAY · 6 MAJOR COAL INDIA SUBSIDIARIES
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber shadow-[0_0_10px_#F5A623]" />
                    <span>Selected: {sub.shortName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-teal animate-pulse" />
                    <span>Mesh Active</span>
                  </div>
                </div>
              </div>

              {/* Plush SVG Map Container with Continuous Radar Sweep */}
              <div className="w-full bg-[#0E0E18] rounded-2xl p-8 sm:p-12 border border-white/[0.06] flex flex-col items-center justify-center relative shadow-inner overflow-hidden">
                <svg viewBox="180 80 400 400" className="w-full max-w-2xl h-auto drop-shadow-2xl">
                  {/* Radar Gradient Definitions */}
                  <defs>
                    <linearGradient id="radarSweepGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#F5A623" stopOpacity="0.85" />
                      <stop offset="60%" stopColor="#00C9A7" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#00C9A7" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Concentric Spatial Sonar Rings */}
                  <circle cx="390" cy="260" r="75" fill="none" stroke="rgba(245,166,35,0.14)" strokeDasharray="4 4" />
                  <circle cx="390" cy="260" r="145" fill="none" stroke="rgba(245,166,35,0.09)" strokeDasharray="6 6" />
                  <circle cx="390" cy="260" r="215" fill="none" stroke="rgba(245,166,35,0.05)" />

                  {/* Continuous 360 Rotating Radar Sweep Beam */}
                  <motion.line
                    x1="390"
                    y1="260"
                    x2="595"
                    y2="260"
                    stroke="url(#radarSweepGradient)"
                    strokeWidth="2.5"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 6.5, ease: 'linear' }}
                    style={{ transformOrigin: '390px 260px' }}
                  />

                  {/* Simplified India Geo Boundary */}
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
                    fill="#141424"
                    stroke="rgba(245,166,35,0.35)"
                    strokeWidth="1.5"
                  />

                  {/* Telemetry Links */}
                  <path
                    d="M 420 220 L 440 210 L 430 280 L 370 280 L 360 240 L 340 300 Z"
                    fill="none"
                    stroke="rgba(245,166,35,0.25)"
                    strokeWidth="1.5"
                    strokeDasharray="6 6"
                  />

                  {/* 6 Regional Nodes with Animated Sonar Ripples */}
                  {[
                    { key: 'bccl', cx: 420, cy: 220, name: 'BCCL (Dhanbad)' },
                    { key: 'ecl', cx: 440, cy: 210, name: 'ECL (Raniganj)' },
                    { key: 'mcl', cx: 430, cy: 280, name: 'MCL (Talcher)' },
                    { key: 'secl', cx: 370, cy: 280, name: 'SECL (Korba)' },
                    { key: 'ncl', cx: 360, cy: 240, name: 'NCL (Singrauli)' },
                    { key: 'wcl', cx: 340, cy: 300, name: 'WCL (Wardha)' },
                  ].map((node) => {
                    const isSelected = selectedSub === node.key;
                    return (
                      <g
                        key={node.key}
                        className="cursor-pointer transition-all group"
                        onClick={() => handleSubChange(node.key)}
                      >
                        {isSelected && (
                          <>
                            <motion.circle
                              cx={node.cx}
                              cy={node.cy}
                              fill="none"
                              stroke="#F5A623"
                              strokeWidth="1.5"
                              animate={{ r: [8, 32], opacity: [0.9, 0] }}
                              transition={{ repeat: Infinity, duration: 2, ease: 'easeOut' }}
                            />
                            <motion.circle
                              cx={node.cx}
                              cy={node.cy}
                              fill="none"
                              stroke="#00C9A7"
                              strokeWidth="1"
                              animate={{ r: [6, 22], opacity: [0.8, 0] }}
                              transition={{ repeat: Infinity, duration: 2, delay: 0.5, ease: 'easeOut' }}
                            />
                          </>
                        )}
                        <circle
                          cx={node.cx}
                          cy={node.cy}
                          r={isSelected ? '9' : '6'}
                          fill={isSelected ? '#F5A623' : '#00C9A7'}
                          stroke="#0D0D18"
                          strokeWidth="2.5"
                          className="group-hover:scale-125 transition-transform"
                        />
                        <text
                          x={node.cx + 14}
                          y={node.cy + 4}
                          fill={isSelected ? '#F5A623' : '#E8E6E1'}
                          fontSize="11"
                          fontFamily="JetBrains Mono, monospace"
                          fontWeight={isSelected ? 'bold' : 'normal'}
                        >
                          {node.name}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                <div className="text-xs font-mono text-dim text-center mt-6 pt-4 border-t border-white/[0.06] w-full max-w-xl">
                  CLICK ANY REGIONAL NODE TO REDIRECT LOCAL SEAM TELEMETRY AND REGULATORY METRICS
                </div>
              </div>
            </motion.div>
          )}

          {/* ===================================================================== */}
          {/* TAB 3: DGMS CMR 2017 STATUTORY MATRIX */}
          {/* ===================================================================== */}
          {activeTab === 'compliance' && (
            <motion.div
              key="compliance"
              initial={{ opacity: 0, y: 22, filter: 'blur(6px)', scale: 0.985 }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
              exit={{ opacity: 0, y: -18, filter: 'blur(6px)', scale: 0.985 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              {/* Left 60%: Regulations Checklist */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <h3 className="font-display font-bold text-2xl text-white flex items-center gap-2.5">
                    <span>DGMS Coal Mines Regulations (CMR 2017) Audit</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-teal animate-pulse" />
                  </h3>
                  <p className="text-xs text-dim font-mono mt-1">
                    Active statutory compliance checklist automatically audited by neural risk classifier
                  </p>
                </div>

                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="space-y-4"
                >
                  {[
                    { reg: 'CMR 2017 Regulation 137', title: 'Underground Ventilation Standards', status: 'COMPLIANT', detail: 'CH4 concentration < 0.75% Vol; continuous face air velocity > 15m/min verified across all working seams.' },
                    { reg: 'CMR 2017 Regulation 106', title: 'Workings of Opencast Benches', status: 'COMPLIANT', detail: 'Bench height does not exceed maximum digging reach of excavator; Factor of Safety (FOS) > 1.20 maintained.' },
                    { reg: 'CMR 2017 Regulation 24', title: 'Statutory Shift Inspection Roster', status: 'COMPLIANT', detail: 'Overman and sirdar daily statutory inspection logged with sub-meter geo-coordinates and digital timestamp.' },
                    { reg: 'Mines Act Section 22A', title: 'HEMM Operator Safety Passports', status: 'COMPLIANT', detail: '100% active machinery operators possess valid DGMS Vocational Training (VT) credentials.' },
                    { reg: 'CMR 2017 Regulation 152', title: 'Deep Hole Blasting Safety Perimeter', status: 'COMPLIANT', detail: '500m danger zone acoustic siren and electronic seismic lockdown operational before blasting operations.' },
                  ].map((item, idx) => (
                    <motion.div
                      key={idx}
                      variants={cardItemVariants}
                      whileHover={{ y: -4, scale: 1.01, transition: { duration: 0.2 } }}
                      className="p-6 rounded-2xl bg-[#131320]/80 border border-white/[0.07] hover:border-amber/40 backdrop-blur-xl space-y-2.5 shadow-sm transition-colors"
                    >
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-amber font-bold tracking-wide flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-amber" />
                          <span>{item.reg}</span>
                        </span>
                        <span className="px-3 py-1 rounded-full bg-teal/10 text-teal border border-teal/30 font-bold text-[11px] flex items-center gap-1 shadow-sm">
                          <Check className="w-3 h-3 text-teal" />
                          <span>{item.status}</span>
                        </span>
                      </div>
                      <div className="font-display font-bold text-lg text-white">
                        {item.title}
                      </div>
                      <p className="text-xs sm:text-sm text-dim leading-relaxed font-normal">
                        {item.detail}
                      </p>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* Right 40%: Statutory Returns & Blockchain Proof */}
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <h3 className="font-display font-bold text-2xl text-white">
                    Blockchain Evidentiary Ledger
                  </h3>
                  <p className="text-xs text-dim font-mono mt-1">
                    Cryptographically sealed statutory returns admissible in statutory inquiries
                  </p>
                </div>

                <div className="space-y-4">
                  {sub.recentForms.map((form) => (
                    <motion.div
                      key={form.id}
                      whileHover={{ y: -3, scale: 1.01, transition: { duration: 0.2 } }}
                      className="p-6 rounded-2xl bg-[#131320]/80 border border-white/[0.08] hover:border-amber/40 backdrop-blur-xl transition-all duration-300 space-y-3 shadow-sm"
                    >
                      <div className="flex justify-between items-center text-xs font-mono">
                        <span className="text-amber font-bold">{form.type}</span>
                        <span className="text-dim">{form.date}</span>
                      </div>
                      <div className="font-display font-bold text-base text-white">
                        {form.title}
                      </div>
                      <div className="flex justify-between items-center text-xs font-mono pt-3 border-t border-white/[0.06]">
                        <span className="text-teal font-medium flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5" />
                          <span>{form.status}</span>
                        </span>
                        <span className="text-dim text-[11px]">SEAL: {form.hash}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Instant Generator Card */}
                <motion.div
                  whileHover={{ y: -4, transition: { duration: 0.25 } }}
                  className="p-8 rounded-3xl bg-gradient-to-br from-[#161628] to-[#12121E] border border-amber/30 backdrop-blur-xl text-center space-y-4 shadow-lg relative overflow-hidden"
                >
                  <div className="w-12 h-12 rounded-2xl bg-amber/10 border border-amber/30 flex items-center justify-center text-amber mx-auto shadow-inner">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h4 className="font-display font-bold text-xl text-white">
                    Compile Statutory Return
                  </h4>
                  <p className="text-xs sm:text-sm text-dim leading-relaxed max-w-sm mx-auto">
                    Aggregate telemetry readings into officially compliant DGMS Form-IV / Form-24 notices with cryptographic timestamps.
                  </p>
                  <button
                    onClick={() => handleGenerateForm('FORM-IV')}
                    className="w-full py-3.5 bg-amber text-coal font-bold text-xs font-mono rounded-xl hover:bg-amber/90 transition-all shadow-[0_0_25px_rgba(245,166,35,0.25)] flex items-center justify-center gap-2"
                  >
                    <span>Compile Form-IV Incident / Air Survey</span>
                    <span>→</span>
                  </button>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* ===================================================================== */}
          {/* TAB 4: HEMM FLEET & WORKFORCE MUSTER */}
          {/* ===================================================================== */}
          {activeTab === 'fleet' && (
            <motion.div
              key="fleet"
              initial={{ opacity: 0, y: 22, filter: 'blur(6px)', scale: 0.985 }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
              exit={{ opacity: 0, y: -18, filter: 'blur(6px)', scale: 0.985 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              {/* Left 60%: Machinery Roster */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <h3 className="font-display font-bold text-2xl text-white flex items-center gap-2.5">
                    <span>Active Heavy Earthmoving Machinery ({sub.activeHEMM})</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-teal animate-pulse" />
                  </h3>
                  <p className="text-xs text-dim font-mono mt-1">
                    RFID & ANPR telemetry monitoring dumper speeds, operator passports, and bench zoning
                  </p>
                </div>

                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="space-y-3"
                >
                  {[
                    { id: 'DMP-014', model: 'CAT 777D 100T Heavy Dumper', operator: 'S.K. Mahato (VT-2024-81)', speed: '24 km/h', limit: '30 km/h', status: 'Nominal', zone: 'Haul Road 3' },
                    { id: 'SHV-002', model: 'Komatsu PC3000 Hydraulic Shovel', operator: 'V.K. Soren (VT-2023-19)', speed: '0 km/h', limit: '10 km/h', status: 'Excavating', zone: 'Bench 12B Face' },
                    { id: 'DRL-008', model: 'Atlas Copco Blast Hole Drill Rig', operator: 'M.P. Yadav (VT-2025-02)', speed: '0 km/h', limit: '5 km/h', status: 'Drilling', zone: 'Bench 14 East' },
                    { id: 'DMP-089', model: 'BEML BH100 Heavy Haul Dumper', operator: 'A.K. Mishra (VT-2024-99)', speed: '27 km/h', limit: '30 km/h', status: 'Nominal', zone: 'Weighbridge Gate' },
                  ].map((machinery) => (
                    <motion.div
                      key={machinery.id}
                      variants={cardItemVariants}
                      whileHover={{ y: -3, scale: 1.01, transition: { duration: 0.2 } }}
                      className="p-5 rounded-2xl bg-[#131320]/80 border border-white/[0.07] hover:border-amber/40 backdrop-blur-xl flex items-center justify-between text-xs font-mono shadow-sm transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="text-white font-bold text-sm flex items-center gap-2.5">
                          <span className="text-amber">{machinery.id}</span>
                          <span className="text-white/20">·</span>
                          <span>{machinery.model}</span>
                        </div>
                        <div className="text-dim text-xs">
                          Operator: <span className="text-offwhite">{machinery.operator}</span> · Zone: {machinery.zone}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-teal font-bold text-sm">{machinery.speed}</div>
                        <div className="text-[11px] text-dim">Limit: {machinery.limit}</div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* Right 40%: Shift Safety Muster */}
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <h3 className="font-display font-bold text-2xl text-white">
                    Biometric Shift Safety Muster
                  </h3>
                  <p className="text-xs text-dim font-mono mt-1">
                    Muster records linked with DGMS safety certifications
                  </p>
                </div>

                <div className="p-7 sm:p-8 rounded-3xl bg-[#131320]/80 border border-white/[0.08] backdrop-blur-xl space-y-4 font-mono text-xs shadow-lg">
                  <div className="flex justify-between pb-3 border-b border-white/[0.06]">
                    <span className="text-dim">TOTAL SHIFT MUSTER</span>
                    <span className="text-amber font-bold text-sm">{sub.activeWorkers}</span>
                  </div>
                  <div className="flex justify-between pb-3 border-b border-white/[0.06]">
                    <span className="text-dim">VT SAFETY PASSPORTS</span>
                    <span className="text-teal font-bold text-sm flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5" />
                      <span>100% Certified</span>
                    </span>
                  </div>
                  <div className="flex justify-between pb-3 border-b border-white/[0.06]">
                    <span className="text-dim">AVERAGE FATIGUE INDEX</span>
                    <span className="text-white font-bold">0.14 (Optimal Low)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dim">OFFLINE EDGE SYNC</span>
                    <span className="text-offwhite">14 Records Synced</span>
                  </div>
                </div>

                <motion.div
                  whileHover={{ y: -3, transition: { duration: 0.2 } }}
                  className="p-6 rounded-2xl bg-[#151526]/80 border border-white/[0.07] backdrop-blur-xl flex items-center gap-4 text-xs shadow-sm"
                >
                  <UserCheck className="w-8 h-8 text-teal shrink-0" />
                  <p className="text-dim leading-relaxed">
                    Automated boom barriers block pit access to uncertified or fatigued personnel in accordance with DGMS circular guidelines.
                  </p>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* ===================================================================== */}
          {/* TAB 5: INCIDENT WAR ROOM SIMULATOR */}
          {/* ===================================================================== */}
          {activeTab === 'simulator' && (
            <motion.div
              key="simulator"
              initial={{ opacity: 0, y: 22, filter: 'blur(6px)', scale: 0.985 }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
              exit={{ opacity: 0, y: -18, filter: 'blur(6px)', scale: 0.985 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="p-8 sm:p-10 rounded-3xl bg-[#131320]/80 border border-amber/30 backdrop-blur-xl shadow-2xl space-y-8"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
                <div>
                  <div className="flex items-center gap-2.5 text-xs font-mono text-amber font-bold mb-1.5">
                    <Flame className="w-4 h-4 animate-pulse" />
                    <span>EMERGENCY WAR ROOM SIMULATOR</span>
                  </div>
                  <h3 className="font-display font-bold text-2xl sm:text-3xl text-white">
                    Autonomous Incident Containment Engine
                  </h3>
                </div>

                <button
                  onClick={handleStartSimulation}
                  disabled={simRunning}
                  className={`px-7 py-3.5 rounded-xl font-mono text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-2.5 ${
                    simRunning
                      ? 'bg-coal border border-amber/50 text-amber animate-pulse'
                      : 'bg-amber text-coal hover:bg-amber/90 shadow-[0_0_30px_rgba(245,166,35,0.3)] hover:scale-105 active:scale-95'
                  }`}
                >
                  <Play className="w-4 h-4" />
                  <span>{simRunning ? 'Executing Containment...' : 'Trigger Live Simulation'}</span>
                </button>
              </div>

              {/* Scenario Selector Cards with 3D Float */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {simulationScenarios.map((scenario) => {
                  const isScenarioSelected = activeSim.id === scenario.id;
                  const Icon = scenario.icon;
                  return (
                    <motion.div
                      key={scenario.id}
                      whileHover={{ y: -5, scale: 1.02, transition: { duration: 0.2 } }}
                      onClick={() => {
                        if (!simRunning) {
                          soundManager.playClick();
                          setActiveSim(scenario);
                          setSimStepIndex(0);
                          setSimFinished(false);
                        }
                      }}
                      className={`p-6 rounded-2xl border transition-all cursor-pointer ${
                        isScenarioSelected
                          ? 'bg-graphite/90 border-amber shadow-[0_0_30px_rgba(245,166,35,0.25)] scale-[1.02]'
                          : 'bg-[#12121E] border-white/[0.06] hover:border-white/[0.2]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 mb-2">
                        <Icon className="w-5 h-5" style={{ color: scenario.color }} />
                        <span className="font-display font-bold text-base text-white">
                          {scenario.title.split(' at ')[0].split(' in ')[0]}
                        </span>
                      </div>
                      <div className="text-xs font-mono text-dim">
                        {scenario.hazard}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Active Simulation Step Sequence */}
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs font-mono pb-3 border-b border-white/[0.08]">
                  <span className="text-amber font-bold flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-amber" />
                    <span>CONTAINMENT PROTOCOL: {activeSim.clause}</span>
                  </span>
                  <span className="text-dim">
                    PROGRESS: {simStepIndex} / {activeSim.steps.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {activeSim.steps.map((step, idx) => {
                    const isStepComplete = simStepIndex > idx;
                    const isStepActive = simStepIndex === idx && simRunning;
                    return (
                      <motion.div
                        key={idx}
                        initial={false}
                        animate={{
                          backgroundColor: isStepComplete ? '#18182A' : isStepActive ? '#221A12' : '#10101C',
                          borderColor: isStepComplete ? 'rgba(0,201,167,0.4)' : isStepActive ? 'rgba(245,166,35,0.6)' : 'rgba(255,255,255,0.06)',
                        }}
                        className="p-5 rounded-2xl border flex items-center justify-between transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <span className="font-mono text-xs text-amber font-bold w-12">
                            {step.step}
                          </span>
                          <div>
                            <div className="font-display font-bold text-sm text-white">
                              {step.action}
                            </div>
                            <div className="text-xs text-dim font-mono mt-0.5">
                              {step.detail}
                            </div>
                          </div>
                        </div>

                        <div>
                          {isStepComplete ? (
                            <span className="px-3 py-1 rounded-full bg-teal/15 text-teal border border-teal/40 text-[11px] font-mono font-bold flex items-center gap-1.5 shadow-sm">
                              <Check className="w-3.5 h-3.5" />
                              <span>CONTAINED</span>
                            </span>
                          ) : isStepActive ? (
                            <span className="px-3 py-1 rounded-full bg-amber/15 text-amber border border-amber/40 text-[11px] font-mono font-bold animate-pulse">
                              EXECUTING...
                            </span>
                          ) : (
                            <span className="text-[11px] font-mono text-dim">QUEUED</span>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {simFinished && (
                  <motion.div
                    initial={{ opacity: 0, y: 12, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 200 }}
                    className="p-6 rounded-2xl bg-teal/10 border border-teal/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-teal shadow-[0_0_30px_rgba(0,201,167,0.15)]"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 shrink-0" />
                      <span className="font-medium">
                        HAZARD AUTONOMOUSLY CONTAINED IN 1.6 SECONDS · CENTRAL DGMS FILING DISPATCHED
                      </span>
                    </div>
                    <button
                      onClick={() => handleGenerateForm('FORM-IV')}
                      className="px-5 py-2.5 bg-teal text-coal font-bold rounded-xl hover:bg-teal/90 transition-all shadow-sm flex items-center gap-1.5"
                    >
                      <span>View Generated Form-IV</span>
                      <span>→</span>
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ========================================================================= */}
      {/* 4. MODAL: OFFICIAL DGMS STATUTORY ELECTRONIC FORM PREVIEW */}
      {/* ========================================================================= */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {formModalOpen && generatedForm && (
              <div
                onClick={() => setFormModalOpen(false)}
                className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl cursor-pointer"
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
                <motion.div
                  onClick={(e) => e.stopPropagation()}
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#12121E] border border-amber/40 rounded-3xl p-8 sm:p-10 shadow-[0_25px_70px_rgba(0,0,0,0.8)] space-y-6 font-mono text-xs cursor-default"
                >
                  {/* Header */}
                  <div className="flex justify-between items-start pb-4 border-b border-white/[0.08]">
                    <div>
                      <span className="text-amber text-[11px] font-bold tracking-widest uppercase">
                        GOVERNMENT OF INDIA // MINISTRY OF COAL // DGMS
                      </span>
                      <h3 className="font-display font-bold text-2xl text-white mt-1">
                        {generatedForm.type} Statutory Electronic Filing
                      </h3>
                    </div>
                    <button
                      onClick={() => setFormModalOpen(false)}
                      className="text-dim hover:text-white text-xl p-1"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Form Metadata */}
                  <div className="grid grid-cols-2 gap-4 p-5 bg-[#161628] rounded-2xl border border-white/[0.06]">
                    <div>
                      <span className="text-dim text-[10px]">RECORD ID</span>
                      <div className="text-white font-bold">{generatedForm.id}</div>
                    </div>
                    <div>
                      <span className="text-dim text-[10px]">SUBSIDIARY</span>
                      <div className="text-amber font-bold">{generatedForm.subsidiary}</div>
                    </div>
                    <div>
                      <span className="text-dim text-[10px]">COLLIERY / PIT LOCATION</span>
                      <div className="text-offwhite">{generatedForm.pit}</div>
                    </div>
                    <div>
                      <span className="text-dim text-[10px]">TIMESTAMP (IST)</span>
                      <div className="text-offwhite">{generatedForm.timestamp}</div>
                    </div>
                  </div>

                  {/* Content Body */}
                  <div className="p-5 bg-coal/80 rounded-2xl border border-white/[0.06] space-y-2 text-offwhite text-xs leading-relaxed">
                    <p>
                      This return is electronically generated in compliance with the{' '}
                      <strong className="text-amber font-semibold">Coal Mines Regulations (2017)</strong> and the{' '}
                      <strong className="text-amber font-semibold">Mines Act (1952)</strong>. All telemetry readings
                      (Atmospheric Methane CH4, Continuous Face Ventilation CFM, and InSAR Slope Stability)
                      have been cryptographically verified against the Central DGMS CMR Registry.
                    </p>
                    <div className="pt-2 text-teal font-bold flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      <span>STATUS: {generatedForm.status}</span>
                    </div>
                  </div>

                  {/* Digital Signature & Blockchain Seal */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pt-3 border-t border-white/[0.08]">
                    <div>
                      <span className="text-[10px] text-dim block uppercase">Authorized Signee</span>
                      <span className="text-white font-bold">{generatedForm.signee}</span>
                      <span className="text-[10px] text-dim block mt-0.5">BLOCKCHAIN SEAL: {generatedForm.hash}</span>
                    </div>
                    <button
                      onClick={() => {
                        soundManager.playSuccess();
                        const recordBlob = new Blob([JSON.stringify(generatedForm, null, 2)], { type: 'application/json' });
                        const link = document.createElement('a');
                        link.href = URL.createObjectURL(recordBlob);
                        link.download = `${generatedForm.id}_Official_DGMS_Filing.json`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        setFormModalOpen(false);
                      }}
                      className="flex items-center gap-2 px-5 py-2.5 bg-amber text-coal font-bold rounded-xl hover:bg-amber/90 transition-colors shadow-sm"
                    >
                      <Download className="w-4 h-4" />
                      <span>Export Statutory Record (.JSON)</span>
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}

      {/* ========================================================================= */}
      {/* 5. MODAL: STATUTORY SHIFT ALERT WORKING DISPATCH & ACTION SUITE */}
      {/* ========================================================================= */}
      <StatutoryAlertModal
        alert={selectedAlert}
        sub={sub}
        selectedRole={selectedRole}
        isOpen={Boolean(selectedAlert)}
        onClose={() => setSelectedAlert(null)}
        alertState={alertStates}
        onUpdateAlertState={handleUpdateAlertState}
        onGenerateForm={handleGenerateForm}
      />
    </div>
  );
}
