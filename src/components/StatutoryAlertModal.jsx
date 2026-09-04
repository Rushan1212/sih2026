import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  Flame,
  Radio,
  FileText,
  Download,
  Lock,
  Check,
  Users,
  Activity,
  Send,
  RefreshCw,
  Sparkles,
  Clock,
  MapPin,
  Cpu,
  ExternalLink,
  ShieldAlert,
  Volume2,
  VolumeX,
  ChevronRight,
  Printer,
  Compass,
  ArrowRight,
  Info,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../utils/sound';

/**
 * Derives rich, realistic statutory metadata from any alert object & active colliery
 */
function resolveAlertDetails(alert, sub, selectedRole) {
  if (!alert) return null;

  const text = (alert.text || '').toLowerCase();
  const clause = (alert.clause || '').toLowerCase();

  let category = 'Gas & Atmospheric Monitoring';
  let parameterName = 'Inflammable Gas (CH4)';
  let currentValue = '0.06% Vol';
  let statutoryLimit = '0.75% Vol (CMR 2017 Reg 137)';
  let margin = '92% Safety Buffer';
  let sensorNode = 'JH-402 (Dual Optical NDIR)';
  let sensorType = 'Infrared Dual-Beam Absorption';
  let calibrationStatus = 'Optimal (Drift < 0.002%)';
  let mandate = 'Mandatory continuous automatic recording at underground working faces & return airways.';
  let penalty = 'Immediate section isolation if sustained > 0.75% Vol; statutory Form-IV filing mandatory.';
  let defaultSteps = [
    { title: 'Optical Sensor Redundancy Cross-Check', detail: 'Primary NDIR node cross-validated with galvanic backup sensor', checked: true },
    { title: 'Shift Overman Underground Physical Audit', detail: 'Overman physical verification with Flame Safety Lamp & multi-gas probe', checked: false },
    { title: 'Auxiliary Ventilation CFM Verification', detail: 'Verify main exhaust airway airflow velocity exceeds 120,000 CFM', checked: false },
    { title: 'Central DGMS CMR Blockchain Sync', detail: 'Broadcast cryptographically signed log to Regional Inspectorate ledger', checked: false },
  ];

  // 1. Ventilation / Fan / Airflow check
  if (
    clause.includes('138') ||
    clause.includes('139') ||
    text.includes('ventilation') ||
    text.includes('fan') ||
    text.includes('cfm') ||
    text.includes('airflow') ||
    text.includes('incline fan')
  ) {
    category = 'Mine Ventilation & Exhaust Airway';
    parameterName = 'Shaft Incline Airflow Velocity';
    currentValue = '142,000 CFM';
    statutoryLimit = '120,000 CFM Minimum (CMR Reg 138)';
    margin = '+18.3% Airflow Surplus';
    sensorNode = 'UF-301 (Ultrasonic Transit-Time Vane)';
    sensorType = 'Ultrasonic Continuous Anemometer Head';
    calibrationStatus = 'Calibrated against DGMS Reference Head';
    mandate = 'Continuous mechanical ventilation delivering not less than 6 m³/min per person employed underground.';
    penalty = 'Instant audible strobe alarm and auxiliary standby fan auto-start within 60 seconds.';
    defaultSteps = [
      { title: 'Ultrasonic Airflow Velocity Verification', detail: 'Confirm intake volume matches 142,000 CFM baseline across incline shafts', checked: true },
      { title: 'Auxiliary Standby Fan Power Bus Check', detail: 'Verify dual 6.6 kV backup substation switchgear ready for auto-throwover', checked: false },
      { title: 'Airway Barometric Pressure Differential', detail: 'Confirm differential water gauge exceeds 85mm WG at airlock doors', checked: false },
      { title: 'Digital Shift Ventilation Log Sign-off', detail: 'Overman biometric countersignature in DGMS Form-IV registry', checked: false },
    ];
  }
  // 2. Opencast Geotechnical Stability (Note: don't match "benchmarks", match "bench crest" or "slope")
  else if (
    clause.includes('106') ||
    text.includes('slope') ||
    text.includes('insar') ||
    text.includes('bench crest') ||
    text.includes('bench 1') ||
    text.includes('bench 2') ||
    text.includes('strain displacement') ||
    text.includes('radar micro-strain')
  ) {
    category = 'Opencast Geotechnical Stability';
    parameterName = 'Bench Micro-Strain Displacement';
    currentValue = '1.2mm Strain';
    statutoryLimit = '5.0mm Cumulative Threshold (CMR Reg 106)';
    margin = '76% Stability Margin (FOS 1.44)';
    sensorNode = 'InSAR-GB-12B (Sub-mm Ground Radar)';
    sensorType = 'Continuous Interferometric Synthetic Aperture Radar';
    calibrationStatus = 'Active 24/7 Sub-mm Sweep';
    mandate = 'Continuous automated slope stability radar monitoring of active bench crests and haul road berms.';
    penalty = 'Autonomous haul truck re-routing required if velocity exceeds 2.5mm/hr.';
    defaultSteps = [
      { title: 'InSAR Sub-mm Doppler Radar Sweep', detail: 'Cross-reference slope displacement vectors with LiDAR point cloud', checked: true },
      { title: 'HEMM Berm & Haul Road Visual Inspection', detail: 'Pit Overman on-site inspection of tension cracks along Bench 12B', checked: false },
      { title: 'Slope Factor of Safety (FOS) Recalibration', detail: 'Verify geotechnical FOS remains above statutory 1.30 benchmark', checked: false },
      { title: 'Autonomous Fleet Route Confirmation', detail: 'Confirm all heavy dumpers maintain minimum 15m berm clearance', checked: false },
    ];
  }
  // 3. Machinery & Personnel Safety
  else if (
    clause.includes('22a') ||
    text.includes('rfid') ||
    text.includes('passport') ||
    text.includes('driver') ||
    text.includes('weighbridge') ||
    text.includes('fleet') ||
    text.includes('gate')
  ) {
    category = 'Machinery & Personnel Safety (Mines Act 22A)';
    parameterName = 'Automated RFID & Safety Passport Check';
    currentValue = '99.8% Fleet Verified';
    statutoryLimit = '100% Mandatory Verification';
    margin = 'Zero Uncertified Gate Passages';
    sensorNode = 'ANPR-GATE-03 (RFID & Optical OCR)';
    sensorType = 'Dual RFID Long-Range & OCR License Scanner';
    calibrationStatus = 'Certified 99.9% Read Accuracy';
    mandate = 'Strict prohibition of any uncertified operator or machinery without active DGMS safety passport.';
    penalty = 'Automated boom barrier interlock and immediate security dispatch to entry gate.';
    defaultSteps = [
      { title: 'Automated ANPR & RFID Gate Interlock', detail: 'Cross-check machine registration against Central DGMS Equipment Portal', checked: true },
      { title: 'Driver Vocational Training (VT) Passport Audit', detail: 'Verify annual medical clearance & biometric driver authorization', checked: false },
      { title: 'Weighbridge Tare & Overload Check', detail: 'Ensure axle loads remain within statutory gross vehicle weight limits', checked: false },
      { title: 'Contractor Compliance Record Sync', detail: 'Log pass receipt into central ERP safety compliance ledger', checked: false },
    ];
  }
  // 4. Hydrology & Sump Dewatering
  else if (
    clause.includes('144') ||
    text.includes('sump') ||
    text.includes('dewatering') ||
    text.includes('water')
  ) {
    category = 'Mine Incline Dewatering & Hydrology';
    parameterName = 'Underground Sump Water Elevation';
    currentValue = '-4.2m Water Level (Drawdown Nominal)';
    statutoryLimit = '-2.0m Max Allowable Head (CMR Reg 144)';
    margin = '2.2m Safety Inundation Margin';
    sensorNode = 'SW-204 (Submersible Hydrostatic Transducer)';
    sensorType = 'Ceramic Piezoresistive Pressure Head';
    calibrationStatus = 'Telemetry Continuous Heartbeat Normal';
    mandate = 'Adequate provision for preventing danger from inrush of water into underground workings.';
    penalty = 'Automatic activation of emergency dewatering pumps #2 and #4 upon high-water alarm.';
    defaultSteps = [
      { title: 'Hydrostatic Transducer Tele-Check', detail: 'Confirm water head drawdown rate at 3,200 Liters/Minute', checked: true },
      { title: 'Emergency Sump Pump Auto-Switch Test', detail: 'Verify dual submersible 150 kW pumps responsive to SCADA control', checked: false },
      { title: 'Barrier Pillar Hydro-Geological Survey', detail: 'Confirm zero seepage along adjacent flooded abandoned workings', checked: false },
      { title: 'Statutory Sump Registry Clearance', detail: 'Record pump running hours and discharge volume in statutory ledger', checked: false },
    ];
  }

  // Generate unique statutory alert reference code
  const refCode = `DGMS/ALT-${(alert.id || '01').toUpperCase()}/${sub.shortName || 'CIL'}-2025`;

  return {
    refCode,
    category,
    parameterName,
    currentValue,
    statutoryLimit,
    margin,
    sensorNode,
    sensorType,
    calibrationStatus,
    mandate,
    penalty,
    defaultSteps,
  };
}

export default function StatutoryAlertModal({
  alert,
  sub,
  selectedRole = 'manager',
  isOpen,
  onClose,
  alertState = {},
  onUpdateAlertState,
  onGenerateForm,
}) {
  const [details, setDetails] = useState(null);
  const [checklist, setChecklist] = useState([]);
  const [notes, setNotes] = useState('');
  const [isAcknowledged, setIsAcknowledged] = useState(false);
  const [isDispatched, setIsDispatched] = useState(false);
  const [signedHash, setSignedHash] = useState('');
  const [signedAt, setSignedAt] = useState('');
  const [signedBy, setSignedBy] = useState('');
  const [activeTab, setActiveTab] = useState('overview'); // overview, checklist, notes

  // Lock body scroll when modal is active to keep viewport fixed and screen-centric
  useEffect(() => {
    if (isOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [isOpen]);

  // Initialize or synchronize modal state whenever active alert changes
  useEffect(() => {
    if (!alert || !sub) return;

    const meta = resolveAlertDetails(alert, sub, selectedRole);
    setDetails(meta);

    const existing = alertState[alert.id] || {};

    if (existing.checklist) {
      setChecklist(existing.checklist);
    } else if (meta?.defaultSteps) {
      setChecklist(meta.defaultSteps);
    }

    setNotes(
      existing.notes ||
        `Field inspection confirmed nominal for ${alert.clause || 'statutory benchmark'}. Telemetry verified against DGMS statutory threshold. Operating within legal tolerance bounds.`
    );
    setIsAcknowledged(Boolean(existing.acknowledged));
    setIsDispatched(Boolean(existing.dispatched));
    setSignedHash(existing.hash || '');
    setSignedAt(existing.signedAt || '');
    setSignedBy(existing.signedBy || '');
  }, [alert?.id, sub?.id, selectedRole]);

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

  if (!isOpen || !alert || !sub || !details || typeof document === 'undefined') return null;

  const isWarning = alert.severity === 'warning';
  const isCritical = alert.severity === 'critical';
  const accentColor = isCritical ? '#EF4444' : isWarning ? '#F5A623' : '#00E5FF';
  const accentBorder = isCritical ? 'border-red-500/40' : isWarning ? 'border-amber/40' : 'border-teal/40';
  const accentBg = isCritical ? 'bg-red-500/10' : isWarning ? 'bg-amber/10' : 'bg-teal/10';
  const accentText = isCritical ? 'text-red-400' : isWarning ? 'text-amber' : 'text-teal';

  // Toggle checklist step
  const handleToggleStep = (index) => {
    soundManager.playClick();
    const updated = checklist.map((item, i) =>
      i === index ? { ...item, checked: !item.checked } : item
    );
    setChecklist(updated);
    if (onUpdateAlertState) {
      onUpdateAlertState(alert.id, { checklist: updated });
    }
  };

  // Add quick tag to field notes
  const handleAddPresetTag = (tagText) => {
    soundManager.playClick();
    const newNotes = notes ? `${notes} [${tagText}]` : `[${tagText}]`;
    setNotes(newNotes);
    if (onUpdateAlertState) {
      onUpdateAlertState(alert.id, { notes: newNotes });
    }
  };

  // Acknowledge & Biometrically Sign Alert
  const handleAcknowledge = () => {
    soundManager.playSuccess();
    const nowStr =
      new Date().toLocaleTimeString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }) + ' IST';
    const fakeHash =
      '0x' +
      Math.random().toString(16).slice(2, 10).toUpperCase() +
      '...' +
      Math.random().toString(16).slice(2, 6).toUpperCase();

    let signeeTitle = 'Er. R. K. Mahato (Overman Cert #DGMS-2018-4491)';
    if (selectedRole === 'manager')
      signeeTitle = 'Er. S. Sengupta (Mine Manager First Class Cert #DGMS-2015-1102)';
    if (selectedRole === 'authority')
      signeeTitle = 'Shri V. Sharma (DGMS Deputy Director of Mines Safety)';

    const completedChecklist = checklist.map((s) => ({ ...s, checked: true }));
    setChecklist(completedChecklist);
    setIsAcknowledged(true);
    setSignedHash(fakeHash);
    setSignedAt(nowStr);
    setSignedBy(signeeTitle);

    if (onUpdateAlertState) {
      onUpdateAlertState(alert.id, {
        acknowledged: true,
        hash: fakeHash,
        signedAt: nowStr,
        signedBy: signeeTitle,
        checklist: completedChecklist,
        notes,
      });
    }

    try {
      confetti({
        particleCount: 45,
        spread: 55,
        origin: { y: 0.6 },
        colors: ['#F5A623', '#00C9A7', '#FFFFFF', '#FFD60A'],
      });
    } catch (e) {}
  };

  // Dispatch Response Team
  const handleDispatchCrew = () => {
    soundManager.playAlert();
    setIsDispatched(true);
    if (onUpdateAlertState) {
      onUpdateAlertState(alert.id, {
        dispatched: true,
        dispatchedCrew: 'Rapid Response Rescue Team Alpha (4 Overmen & 1 Safety Officer)',
      });
    }
  };

  // Download official incident dossier JSON
  const handleExportDossier = () => {
    soundManager.playSuccess();
    const incidentData = {
      statutoryRecordType: 'DGMS_CMR_2017_STATUTORY_ALERT_DOSSIER',
      statutoryReference: details.refCode,
      colliery: {
        subsidiary: sub.name,
        collieryName: sub.pitName || sub.name,
        location: sub.location,
        coordinates: sub.coordinates,
        basin: sub.basin,
        workingType: sub.type,
      },
      alertContext: {
        id: alert.id,
        severity: alert.severity,
        clause: alert.clause,
        description: alert.text,
        reportedTime: alert.time,
        category: details.category,
      },
      sensorTelemetry: {
        parameter: details.parameterName,
        currentValue: details.currentValue,
        statutoryLimit: details.statutoryLimit,
        margin: details.margin,
        sensorNode: details.sensorNode,
        sensorType: details.sensorType,
        calibrationStatus: details.calibrationStatus,
      },
      statutoryComplianceChecklist: checklist,
      fieldInspectorNotes: notes,
      resolutionState: {
        isAcknowledged,
        signedAt: signedAt || new Date().toISOString(),
        signedBy: signedBy || 'DGMS Authorized Signee',
        cryptographicHash: signedHash || '0x4F9A...B301',
        dispatchedCrew: isDispatched ? 'Rapid Response Team Alpha' : 'Standby',
      },
      regulatoryStatute: {
        governingLaw: 'Coal Mines Regulations 2017 & Mines Act 1952',
        clause: details.mandate,
        enforcementThreshold: details.penalty,
      },
    };

    const blob = new Blob([JSON.stringify(incidentData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${details.refCode.replace(/[/\\?%*:|"<>]/g, '_')}_Dossier.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const completedCount = checklist.filter((c) => c.checked).length;
  const progressPercent = Math.round((completedCount / (checklist.length || 1)) * 100);

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
        {/* Ambient Radial Flare */}
        <div
          className="fixed inset-0 pointer-events-none opacity-25"
          style={{
            background: `radial-gradient(circle 650px at 50% 45%, ${accentColor}25, transparent 75%)`,
          }}
        />

        {/* Modal Container: Screen-Centric, Spacious 5xl Width, Pinned Header & Footer, Scrollable Body */}
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className={`relative w-full max-w-5xl max-h-[92vh] flex flex-col bg-[#0E0E18] border ${accentBorder} rounded-3xl shadow-[0_30px_90px_rgba(0,0,0,0.95)] font-mono text-xs text-offwhite cursor-default overflow-hidden`}
        >
          {/* 1. Header (Fixed at top of modal) */}
          <div className="p-5 sm:p-7 pb-4 border-b border-white/[0.08] space-y-4 shrink-0 bg-[#0E0E18]">
            {/* Top Bar: Reference ID & Close Button */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex items-center gap-3 flex-wrap">
                <span
                  className={`px-3 py-1 rounded-full ${accentBg} ${accentText} border ${accentBorder} text-[11px] font-bold tracking-wider uppercase flex items-center gap-1.5`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isCritical
                        ? 'bg-red-500 animate-ping'
                        : isWarning
                        ? 'bg-amber animate-pulse'
                        : 'bg-teal'
                    }`}
                  />
                  <span>{details.refCode}</span>
                </span>

                <span className="px-2.5 py-0.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-dim text-[10px]">
                  {sub.shortName} // {sub.pitName ? sub.pitName.split('&')[0] : 'Colliery Face'}
                </span>

                <span className="text-dim text-[11px] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-dim" />
                  <span>Reported {alert.time}</span>
                </span>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <span className="hidden sm:inline text-[10px] text-dim px-2 py-0.5 rounded border border-white/[0.08]">
                  ESC TO CLOSE
                </span>
                <button
                  onClick={() => {
                    soundManager.playClick();
                    onClose();
                  }}
                  className="w-8 h-8 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-dim hover:text-white flex items-center justify-center transition-colors border border-white/[0.08]"
                  title="Close modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Title & Statutory Heading */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-amber text-[11px] font-bold uppercase tracking-widest">
                <ShieldCheck className="w-3.5 h-3.5 text-amber" />
                <span>MINISTRY OF COAL & DGMS STATUTORY COMPLIANCE DISPATCH</span>
              </div>
              <h2 className="font-display font-bold text-lg sm:text-2xl text-white tracking-tight">
                {alert.clause}: {details.category}
              </h2>
              <p className="text-offwhite/90 text-xs sm:text-sm leading-relaxed font-sans font-normal pt-0.5">
                {alert.text}
              </p>
            </div>

            {/* Dynamic Status Notification Banner */}
            {isAcknowledged ? (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-2xl bg-teal/10 border border-teal/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-teal"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-teal/20 flex items-center justify-center text-teal shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs uppercase tracking-wide flex items-center gap-2">
                      <span>STATUTORILY CLOSED & DIGITALLY SEALED</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-teal/20 rounded border border-teal/30">
                        VERIFIED
                      </span>
                    </div>
                    <div className="text-[10px] text-teal/80 font-mono">
                      Signed by {signedBy || 'Safety Overman'} at {signedAt} • Seal: {signedHash}
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleExportDossier}
                  className="px-3.5 py-1.5 rounded-xl bg-teal text-coal font-bold text-xs hover:bg-teal/90 transition-colors flex items-center gap-1.5 shrink-0 self-end sm:self-auto shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Dossier</span>
                </button>
              </motion.div>
            ) : isDispatched ? (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-2xl bg-amber/10 border border-amber/40 flex items-center justify-between gap-3 text-amber"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber/20 flex items-center justify-center text-amber shrink-0 animate-pulse">
                    <Radio className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs uppercase tracking-wide">
                      RAPID RESPONSE TEAM ALPHA DISPATCHED
                    </div>
                    <div className="text-[10px] text-amber/80 font-mono">
                      Underground Overman Crew en route • Radio Link CH-04 Locked • ETA: 2m 45s
                    </div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-amber/20 text-amber text-[10px] font-bold animate-pulse">
                  ACTIVE DEPLOYMENT
                </span>
              </motion.div>
            ) : (
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between gap-3 text-dim">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber shrink-0" />
                  <span className="text-[11px]">
                    Requires Overman digital endorsement within{' '}
                    <strong className="text-amber font-bold">15 minutes</strong> under CMR 2017
                    Chapter XI.
                  </span>
                </div>
                <span className="text-[10px] text-dim shrink-0 font-mono">
                  STATUS: PENDING ENDORSEMENT
                </span>
              </div>
            )}

            {/* High-End Segmented Selector Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-1.5 bg-[#121220] rounded-2xl border border-white/[0.08]">
              {[
                { id: 'overview', label: 'Telemetry & Statute', num: '1', icon: Activity },
                { id: 'checklist', label: `Action Protocol (${completedCount}/${checklist.length})`, num: '2', icon: CheckCircle2 },
                { id: 'notes', label: 'Field Overman Log', num: '3', icon: FileText },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      soundManager.playHover();
                      setActiveTab(tab.id);
                    }}
                    className={`flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl text-xs font-mono font-medium transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-amber text-coal font-bold shadow-[0_0_18px_rgba(245,166,35,0.3)] scale-[1.01]'
                        : 'text-dim hover:text-offwhite hover:bg-white/[0.05]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-coal' : 'text-amber'}`} />
                    <span className="truncate">{tab.num}. {tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Scrollable Body Area */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-4">
            {/* Tab 1: Telemetry & Statute Snapshot */}
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* Telemetry Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  <div className="p-4 rounded-2xl bg-[#141424] border border-white/[0.06] space-y-1.5 flex flex-col justify-between">
                    <span className="text-dim text-[10px] uppercase font-mono tracking-wider block">
                      Parameter
                    </span>
                    <div className="text-white font-bold text-sm leading-snug">
                      {details.parameterName}
                    </div>
                    <span className="text-teal text-xs font-mono font-medium block">
                      {details.currentValue}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#141424] border border-white/[0.06] space-y-1.5 flex flex-col justify-between">
                    <span className="text-dim text-[10px] uppercase font-mono tracking-wider block">
                      Statutory Ceiling
                    </span>
                    <div className="text-amber font-bold text-sm leading-snug">
                      {details.statutoryLimit}
                    </div>
                    <span className="text-dim text-[10px] font-mono block">Max Permissible</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#141424] border border-white/[0.06] space-y-1.5 flex flex-col justify-between">
                    <span className="text-dim text-[10px] uppercase font-mono tracking-wider block">
                      Safety Margin
                    </span>
                    <div className="text-teal font-bold text-sm leading-snug">
                      {details.margin}
                    </div>
                    <span className="text-dim text-[10px] font-mono block">Optimal Clearance</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#141424] border border-white/[0.06] space-y-1.5 flex flex-col justify-between">
                    <span className="text-dim text-[10px] uppercase font-mono tracking-wider block">
                      Sensor Transducer
                    </span>
                    <div className="text-offwhite font-bold text-sm leading-snug">
                      {details.sensorNode}
                    </div>
                    <span className="text-dim text-[10px] font-mono block">
                      {details.calibrationStatus}
                    </span>
                  </div>
                </div>

                {/* Statute Legal Details Box */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#121220] border border-white/[0.08] space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-amber font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-amber" />
                      <span>Statutory Mandate: {alert.clause}</span>
                    </span>
                    <span className="text-dim text-[11px] font-mono">CMR 2017 Official Standard</span>
                  </div>
                  <p className="text-offwhite/85 text-xs sm:text-sm leading-relaxed font-sans font-normal">
                    {details.mandate}
                  </p>
                  <div className="p-3 rounded-xl bg-coal/60 border border-white/[0.04] text-[11px] text-dim flex items-center gap-2">
                    <Info className="w-4 h-4 text-amber shrink-0" />
                    <span>
                      <strong className="text-white font-semibold">Enforcement Threshold: </strong>
                      {details.penalty}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Tab 2: Interactive Statutory Action Protocol Checklist */}
            {activeTab === 'checklist' && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-bold text-sm">Statutory Clearance Checklist</h4>
                    <p className="text-dim text-[11px]">
                      Click each step to physically confirm on-site statutory compliance.
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-amber font-mono font-bold text-sm">{progressPercent}%</span>
                    <span className="text-dim text-[10px] block font-mono">
                      {completedCount} of {checklist.length} CLEARED
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-1.5 rounded-full bg-white/[0.08] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.3 }}
                    className="h-full bg-gradient-to-r from-amber to-teal rounded-full"
                  />
                </div>

                {/* Clickable Step List */}
                <div className="space-y-2.5">
                  {checklist.map((item, idx) => (
                    <motion.div
                      key={idx}
                      onClick={() => handleToggleStep(idx)}
                      whileHover={{ scale: 1.01 }}
                      className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                        item.checked
                          ? 'bg-teal/5 border-teal/30 text-white'
                          : 'bg-[#141424] border-white/[0.08] text-offwhite hover:border-amber/40'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                          item.checked
                            ? 'bg-teal text-coal'
                            : 'border border-white/30 text-transparent'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>

                      <div className="flex-1 space-y-0.5">
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-xs font-bold ${
                              item.checked ? 'text-teal' : 'text-white'
                            }`}
                          >
                            Step {idx + 1}: {item.title}
                          </span>
                          <span className="text-[10px] font-mono text-dim">
                            {item.checked ? 'COMPLETED' : 'PENDING'}
                          </span>
                        </div>
                        <p className="text-dim text-[11px] font-sans leading-relaxed font-normal">
                          {item.detail}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Tab 3: Shift Overman Field Log & Interactive Notes */}
            {activeTab === 'notes' && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-bold text-sm">Shift In-Charge Incident Entry</h4>
                    <p className="text-dim text-[11px]">
                      Recorded by {selectedRole.toUpperCase()} under DGMS statutory shift inspection
                      logs.
                    </p>
                  </div>
                  <span className="text-amber text-[10px] font-mono bg-amber/10 px-2.5 py-1 rounded border border-amber/30">
                    BIOMETRIC DIGITAL LOG
                  </span>
                </div>

                {/* Editable Textarea */}
                <div className="relative">
                  <textarea
                    value={notes}
                    onChange={(e) => {
                      setNotes(e.target.value);
                      if (onUpdateAlertState) {
                        onUpdateAlertState(alert.id, { notes: e.target.value });
                      }
                    }}
                    rows={4}
                    className="w-full p-4 rounded-2xl bg-[#141424] border border-white/[0.12] text-offwhite text-xs font-mono leading-relaxed focus:outline-none focus:border-amber transition-colors resize-none placeholder-dim"
                    placeholder="Enter statutory notes, overman findings, or remedial actions..."
                  />
                </div>

                {/* Quick Preset Tags */}
                <div className="space-y-1.5">
                  <span className="text-dim text-[10px] uppercase font-mono block">
                    Quick Insert Statutory Observation Tags:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'Sensors Nominal',
                      'Ventilation 142k CFM OK',
                      'Face Cleared',
                      'FOS > 1.35 Confirmed',
                      'Timbering Sound',
                      'DGMS Form-IV Drafted',
                    ].map((tag) => (
                      <button
                        key={tag}
                        onClick={() => handleAddPresetTag(tag)}
                        className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-amber/10 hover:border-amber/40 border border-white/[0.08] text-dim hover:text-amber text-xs font-mono transition-all"
                      >
                        + {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* 3. Footer Action Suite: Fixed at bottom of modal with responsive non-overlapping layout */}
          <div className="p-4 sm:p-5 border-t border-white/[0.08] bg-[#0A0A12]/98 backdrop-blur-xl shrink-0 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3.5">
            {/* Left: Statutory Filing Utilities */}
            <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
              <button
                onClick={handleExportDossier}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-offwhite hover:text-white font-mono text-xs flex items-center justify-center gap-2 transition-colors whitespace-nowrap shadow-sm"
                title="Export complete statutory incident dossier JSON"
              >
                <Download className="w-3.5 h-3.5 text-amber shrink-0" />
                <span>Export Dossier (.JSON)</span>
              </button>

              {onGenerateForm && (
                <button
                  onClick={() => {
                    soundManager.playClick();
                    onClose();
                    onGenerateForm('FORM-IV');
                  }}
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-offwhite hover:text-white font-mono text-xs flex items-center justify-center gap-2 transition-colors whitespace-nowrap shadow-sm"
                  title="Open official DGMS electronic Form-IV generator"
                >
                  <FileText className="w-3.5 h-3.5 text-teal shrink-0" />
                  <span>Draft Form-IV</span>
                </button>
              )}
            </div>

            {/* Right: Operational Actions */}
            <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
              {!isDispatched && (
                <button
                  onClick={handleDispatchCrew}
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-[#181828] hover:bg-[#222238] border border-amber/30 text-amber font-mono text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm whitespace-nowrap"
                >
                  <Radio className="w-3.5 h-3.5 text-amber shrink-0" />
                  <span>Dispatch Response Team</span>
                </button>
              )}

              <button
                onClick={handleAcknowledge}
                className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl font-bold font-mono text-xs flex items-center justify-center gap-2 transition-all shadow-md whitespace-nowrap ${
                  isAcknowledged
                    ? 'bg-teal/20 text-teal border border-teal/40 hover:bg-teal/30'
                    : 'bg-amber text-coal hover:bg-amber/90 shadow-[0_0_15px_rgba(245,166,35,0.3)]'
                }`}
              >
                {isAcknowledged ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Re-verify Seal</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5 shrink-0" />
                    <span>Sign with Biometric Key</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}
