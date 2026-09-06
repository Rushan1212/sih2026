'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  AlertTriangle,
  Camera,
  Mic,
  MicOff,
  Navigation,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileText,
  Radio,
  MapPin,
  Copy,
  ExternalLink,
  X,
  Eye,
  ChevronRight,
  Layers,
  RefreshCw,
  Shield,
  Sliders,
  Check,
  Info,
} from 'lucide-react';
import { HazardReport, HazardType, HazardCoordinates, HazardSeverity } from '../../types/hazard';
import { saveHazardReport } from '../../services/db';
import { useMediaRecorder } from '../../hooks/useMediaRecorder';
import { LiveCameraViewfinder } from './LiveCameraViewfinder';
import { AudioVoiceMemoPlayer } from './AudioVoiceMemoPlayer';
import { soundManager } from '../../utils/sound';
import { useAuth } from '../../context/AuthContext';

interface HazardCaptureViewProps {
  onReportSaved?: (reportId: string) => void;
  onNavigateToOutbox?: () => void;
}

interface StatutoryHazardDefinition {
  type: HazardType;
  label: string;
  icon: string;
  badgeColor: string;
  shortDesc: string;
  cmrClause: string;
  statutoryRule: string;
  defaultSeverity: HazardSeverity;
  precautions: string[];
  recommendedRemediation: string;
}

const STATUTORY_HAZARDS: StatutoryHazardDefinition[] = [
  {
    type: 'crack',
    label: 'Highwall Crack / Tension Shear',
    icon: '⚡',
    badgeColor: 'border-amber/40 text-amber bg-amber/10',
    shortDesc: 'Tension crack in bench crest or haul road shoulder',
    cmrClause: 'CMR 2017 Regulation 106(3) & DGMS Tech Circular 04/2019',
    statutoryRule:
      'Stability of Benches in Opencast Mines: Continuous geotechnical monitoring required for tension fractures along crest lines and highwall berm shoulders.',
    defaultSeverity: 'high',
    precautions: [
      'Immediately withdraw all HEMM dumpers and personnel to minimum 1.5x bench height distance.',
      'Install displacement tell-tales or digital crack extensometer markers across the fracture.',
      'Notify Colliery Geotechnical Survey Officer and Shift Overman for slope stability review.',
    ],
    recommendedRemediation:
      'Install geotechnical slope extensometer, compact fracture with clay seal, and restrict heavy dumpers within 20m of crest.',
  },
  {
    type: 'rockfall',
    label: 'Rockfall / Slope Failure',
    icon: '🪨',
    badgeColor: 'border-red-500/40 text-red-400 bg-red-500/10',
    shortDesc: 'Loose overburden slip, toe heave, or overhang face fall',
    cmrClause: 'CMR 2017 Regulation 108 & 112',
    statutoryRule:
      'Precautions Against Loose Stones & Overhanging Faces: Strict prohibition of working under unscaled overhangs or within the trajectory of loose bench boulders.',
    defaultSeverity: 'critical',
    precautions: [
      'Sound audible pit siren warning and cordon off the lower bench toe area.',
      'Suspend hydraulic shovel and drilling operations directly below the unstable face.',
      'Deploy specialized hydraulic rock-breaker or scaling dozer operated strictly from safe crest level.',
    ],
    recommendedRemediation:
      'Execute hydraulic face scaling, remove dangerous overhangs, and reconstruct safety berm to minimum 1.5m height before resuming work.',
  },
  {
    type: 'leak',
    label: 'Fluid / Strata Inundation',
    icon: '💧',
    badgeColor: 'border-teal/40 text-teal bg-teal/10',
    shortDesc: 'Strata water ingress, acid drainage, or sump overflow',
    cmrClause: 'CMR 2017 Regulation 147',
    statutoryRule:
      'Precautions Against Inundation from Surface & Strata Water Ingress: Mandatory sump dewatering capacity and perimeter diversion channels.',
    defaultSeverity: 'medium',
    precautions: [
      'Verify main pit sump water level and test standby dewatering pump turbine readiness.',
      'Collect water sample for pH testing to detect sudden Acid Mine Drainage (AMD) ingress.',
      'Inspect surface catchment diversion bunds to prevent flash-flood rainwater breach.',
    ],
    recommendedRemediation:
      'Activate auxiliary 150 HP diesel slurry pump and clear sediment silt from perimeter diversion culvert.',
  },
  {
    type: 'equipment_failure',
    label: 'HEMM / Equipment Fault',
    icon: '🚜',
    badgeColor: 'border-orange-500/40 text-orange-400 bg-orange-500/10',
    shortDesc: 'Dragline, shovel, dump truck brake or hydraulic failure',
    cmrClause: 'CMR 2017 Regulation 181 & 182',
    statutoryRule:
      'Haul Road Standards & Safe Operation of Heavy Earth Moving Machinery: Braking efficiency, steering fail-safes, and fire suppression compliance.',
    defaultSeverity: 'high',
    precautions: [
      'Execute Lockout/Tagout (LOTO) protocol on defective equipment at designated safety berm.',
      'Position reflective hazard triangles and heavy-duty wheel chocks on down-grade gradient.',
      'Inspect automatic fire detection and suppression system (AFDSS) cylinder pressure.',
    ],
    recommendedRemediation:
      'Tow unit by certified recovery prime-mover to central workshop for hydraulic brake line overhaul.',
  },
  {
    type: 'gas_ventilation',
    label: 'Inflammable Gas / Ventilation Bleed',
    icon: '☣️',
    badgeColor: 'border-purple-500/40 text-purple-400 bg-purple-500/10',
    shortDesc: 'Methane (CH4) seep, CO threshold breach, or airflow block',
    cmrClause: 'CMR 2017 Regulation 133 & 140',
    statutoryRule:
      'Environmental Mine Atmosphere & Inflammable Gas Monitoring: General body air methane must not exceed statutory limit (0.5% in opencast/deep pit).',
    defaultSeverity: 'critical',
    precautions: [
      'De-energize all non-flameproof electrical switchgear in the return airway zone.',
      'Withdraw all crew members to fresh intake air with personal self-rescuers equipped.',
      'Conduct multi-gas detector test for %CH4, CO (ppm), and oxygen depletion.',
    ],
    recommendedRemediation:
      'Reposition auxiliary ventilation ducting and activate high-velocity fan to dilute gas concentration below 0.2%.',
  },
  {
    type: 'dust_blasting',
    label: 'Respirable Dust & Blast Perimeter',
    icon: '💨',
    badgeColor: 'border-yellow-500/40 text-yellow-400 bg-yellow-500/10',
    shortDesc: 'Dust suppression failure or blasting danger zone alert',
    cmrClause: 'CMR 2017 Regulation 113 & 123',
    statutoryRule:
      'Airborne Respirable Dust Control & Blasting Danger Zone Clearance: Mandatory water mist spraying and 500m blast cordon.',
    defaultSeverity: 'medium',
    precautions: [
      'Engage pressurized water mist tankers on active haulage corridors.',
      'Verify red blast perimeter flags and post sentries at all quarry approach tracks.',
      'Audit personal dust respirators (EN149 FFP3) on all drilling and crushing operators.',
    ],
    recommendedRemediation:
      'Dispatch continuous water bowser spraying and deploy bio-degradable chemical dust binding agents.',
  },
];

const COLLIERY_PRESETS = [
  { id: 'custom', name: '📍 Live Device GPS Fix (Auto-Detected)', lat: 0, lng: 0 },
  { id: 'bccl_moonidih', name: 'BCCL Moonidih Deep Seam (Jharia Basin)', lat: 23.7431, lng: 86.3512 },
  { id: 'ecl_jhanjhara', name: 'ECL Jhanjhara Project (Raniganj Basin)', lat: 23.6680, lng: 87.2963 },
  { id: 'secl_gevra', name: 'SECL Gevra Super Pit (Korba Basin)', lat: 22.3392, lng: 82.6021 },
  { id: 'mcl_talcher', name: 'MCL Bhubaneswari Opencast (Talcher)', lat: 20.9634, lng: 85.2145 },
  { id: 'dgms_dhanbad', name: 'DGMS Central Directorate (Dhanbad HQ)', lat: 23.8142, lng: 86.4412 },
];

const FIELD_OBSERVATION_PRESETS = [
  'Tension crack observed along Bench #4 crest; 14mm expansion noted over 2h interval near shovel loading zone.',
  'Loose overburden boulders dislodged on upper haul road berm; immediate face scaling required.',
  'Strata water seepage pooling near pit sump drainage channel; pump dewatering recommended.',
  'Dump truck hydraulic steering pressure drop; equipment tagged out at safety bay.',
  'Elevated methane (0.28% Vol) detected near fresh coal rib exposure; ventilation ducting adjusted.',
  'Excessive respirable dust plume on haul corridor; water tanker suppression requested.',
];

export const HazardCaptureView: React.FC<HazardCaptureViewProps> = ({
  onReportSaved,
  onNavigateToOutbox,
}) => {
  const { user } = useAuth();

  // Form State
  const [hazardType, setHazardType] = useState<HazardType>('crack');
  const [severity, setSeverity] = useState<HazardSeverity>('high');
  const [description, setDescription] = useState<string>('');
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [savedSuccessId, setSavedSuccessId] = useState<string | null>(null);

  // Modal States
  const [inspectingStatutoryHazard, setInspectingStatutoryHazard] = useState<StatutoryHazardDefinition | null>(null);
  const [modalSeverity, setModalSeverity] = useState<HazardSeverity>('high');
  const [isPreviewImageModalOpen, setIsPreviewImageModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Geolocation State
  const [coords, setCoords] = useState<HazardCoordinates | null>(null);
  const [geoWarning, setGeoWarning] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [selectedCollieryPreset, setSelectedCollieryPreset] = useState<string>('custom');

  // MediaRecorder Voice Memo Hook
  const {
    isRecording,
    recordingDuration,
    audioBlob,
    audioUrl,
    audioLevels,
    error: audioError,
    startRecording,
    stopRecording,
    resetRecording,
  } = useMediaRecorder();

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Screen-centric modal viewport scroll-lock & Escape key handler
  useEffect(() => {
    const isModalOpen = Boolean(inspectingStatutoryHazard || isPreviewImageModalOpen);
    if (!isModalOpen || typeof document === 'undefined') return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setInspectingStatutoryHazard(null);
        setIsPreviewImageModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [inspectingStatutoryHazard, isPreviewImageModalOpen]);

  /**
   * Real Geolocation Acquisition with graceful degradation
   */
  const captureDeviceLocation = useCallback((): Promise<{
    coords: HazardCoordinates | null;
    warning?: string;
  }> => {
    return new Promise((resolve) => {
      if (typeof navigator === 'undefined' || !navigator.geolocation) {
        const warning = 'Geolocation API not supported on this device/browser.';
        setGeoWarning(warning);
        resolve({ coords: null, warning });
        return;
      }

      setIsLocating(true);
      setGeoWarning(null);

      const geoOptions: PositionOptions = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000,
      };

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newCoords: HazardCoordinates = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracy: Math.round(pos.coords.accuracy),
            altitude: pos.coords.altitude ? Math.round(pos.coords.altitude) : null,
          };
          setCoords(newCoords);
          setGeoWarning(null);
          setIsLocating(false);
          resolve({ coords: newCoords });
        },
        (err) => {
          let warning = 'Satellite lock timed out in pit cut. Submitting with colliery baseline.';
          if (err.code === err.PERMISSION_DENIED) {
            warning = 'Location permission disabled. Tap "Basin Presets" to calibrate coordinates.';
          }
          setGeoWarning(warning);
          setIsLocating(false);
          resolve({ coords: null, warning });
        },
        geoOptions
      );
    });
  }, []);

  // Auto-acquire GPS on mount
  useEffect(() => {
    captureDeviceLocation();
  }, [captureDeviceLocation]);

  // Handle Colliery Basin manual calibration
  const handleCollieryPresetChange = (presetId: string) => {
    soundManager.playClick();
    setSelectedCollieryPreset(presetId);

    if (presetId === 'custom') {
      captureDeviceLocation();
    } else {
      const preset = COLLIERY_PRESETS.find((p) => p.id === presetId);
      if (preset && preset.lat !== 0) {
        setCoords({
          latitude: preset.lat,
          longitude: preset.lng,
          accuracy: 5,
          altitude: 185,
        });
        setGeoWarning(`Calibrated using ${preset.name} baseline benchmark`);
        showToast(`GPS calibrated to ${preset.name}`);
      }
    }
  };

  const handleCopyCoords = () => {
    if (!coords) return;
    soundManager.playClick();
    navigator.clipboard.writeText(`${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)}`);
    showToast(`Copied GPS coordinates: ${coords.latitude.toFixed(5)}°N, ${coords.longitude.toFixed(5)}°E`);
  };

  // Optical Media Handlers
  const handleImageCaptured = (blob: Blob) => {
    setImageBlob(blob);
    showToast('Photo evidence attached to incident report');
  };

  const handleImageCleared = () => {
    setImageBlob(null);
    setIsPreviewImageModalOpen(false);
  };

  // Open Statutory Classification Modal
  const handleOpenStatutoryModal = (hazard: StatutoryHazardDefinition) => {
    soundManager.playClick();
    setInspectingStatutoryHazard(hazard);
    setModalSeverity(hazard.defaultSeverity);
  };

  // Apply Statutory Modal selections to the field form
  const handleApplyStatutoryModal = () => {
    if (!inspectingStatutoryHazard) return;
    soundManager.playSuccess();

    setHazardType(inspectingStatutoryHazard.type);
    setSeverity(modalSeverity);

    // If description is empty or doesn't include remediation, append recommended remediation
    if (!description.includes(inspectingStatutoryHazard.recommendedRemediation)) {
      setDescription((prev) => {
        const separator = prev.trim().length > 0 ? '\n\n' : '';
        return `${prev}${separator}[CMR 2017 Action Protocol]: ${inspectingStatutoryHazard.recommendedRemediation}`;
      });
    }

    setInspectingStatutoryHazard(null);
    showToast(`Applied ${inspectingStatutoryHazard.label} statutory classification`);
  };

  const handleApplyObservationPreset = (presetText: string) => {
    soundManager.playClick();
    setDescription((prev) => (prev ? `${prev} ${presetText}` : presetText));
  };

  // Save Report into IndexedDB
  const handleSaveReport = async (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playClick();

    if (isRecording) {
      stopRecording();
    }

    setIsSaving(true);

    try {
      let finalCoords = coords;
      let finalWarning = geoWarning || undefined;

      if (!finalCoords) {
        const geoResult = await captureDeviceLocation();
        finalCoords = geoResult.coords;
        if (geoResult.warning) finalWarning = geoResult.warning;
      }

      const activeStatutory = STATUTORY_HAZARDS.find((h) => h.type === hazardType);

      const reportId =
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `hz-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

      const newReport: HazardReport = {
        id: reportId,
        timestamp: Date.now(),
        type: hazardType,
        severity,
        statutoryClause: activeStatutory?.cmrClause,
        description: description.trim() || undefined,
        coordinates: finalCoords,
        geoWarning: finalWarning,
        imageBlob: imageBlob || undefined,
        audioBlob: audioBlob || undefined,
        syncStatus: 'pending',
        retryCount: 0,
      };

      await saveHazardReport(newReport);

      soundManager.playSuccess();
      setSavedSuccessId(reportId);

      if (onReportSaved) {
        onReportSaved(reportId);
      }
    } catch (err: any) {
      console.error('Failed to save hazard report:', err);
      soundManager.playAlert();
      alert(`Storage error: ${err.message || 'Could not write to local outbox.'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogAnother = () => {
    soundManager.playClick();
    setSavedSuccessId(null);
    setDescription('');
    setImageBlob(null);
    resetRecording();
    captureDeviceLocation();
  };

  const activeHazardDef = STATUTORY_HAZARDS.find((h) => h.type === hazardType);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 md:py-8 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#161626] border border-amber/40 text-offwhite px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2.5 font-mono text-xs animate-in slide-in-from-top-2">
          <Sparkles className="w-4 h-4 text-amber flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber/15 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-block w-2 h-2 rounded-full bg-amber animate-pulse" />
            <span className="text-xs font-mono text-amber uppercase tracking-wider font-semibold">
              Mission-Critical Field Module • CMR 2017 Protocol
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-offwhite tracking-tight">
            Offline Geo-Tagged Hazard Logging
          </h2>
        </div>

        {onNavigateToOutbox && (
          <button
            type="button"
            onClick={onNavigateToOutbox}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#141422] hover:bg-[#1c1c30] border border-amber/30 text-amber text-xs font-mono transition-all self-start sm:self-auto shadow-sm"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Persistent Outbox Queue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Success View */}
      {savedSuccessId ? (
        <div className="bg-[#12121E]/95 border border-teal/40 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-amber-glow text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-teal/15 border border-teal/30 text-teal flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-8 h-8 text-teal" />
          </div>

          <div>
            <h3 className="text-xl md:text-2xl font-display font-bold text-offwhite">
              Incident Committed to Local MineSafetyDB
            </h3>
            <p className="text-sm text-dim max-w-md mx-auto mt-2 font-mono">
              Report ID: <span className="text-amber font-bold">{savedSuccessId}</span>
            </p>
            <p className="text-xs text-dim/80 max-w-lg mx-auto mt-1">
              Data, optical photo, and audio voice memo have been securely saved offline in IndexedDB. When network reconnects, background runner will upload the report to the colliery server.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleLogAnother}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber text-coal font-mono font-bold text-xs uppercase tracking-wider hover:bg-amber/90 transition-transform active:scale-95 shadow-amber-glow"
            >
              + Log Another Hazard
            </button>
            {onNavigateToOutbox && (
              <button
                type="button"
                onClick={onNavigateToOutbox}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-coal border border-amber/30 text-amber font-mono font-bold text-xs uppercase tracking-wider hover:bg-amber/10 transition-colors"
              >
                Inspect Outbox Queue →
              </button>
            )}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSaveReport} className="space-y-6">
          {/* Section 1: Statutory Classification Block (Clicking opens CMR 2017 Modal) */}
          <div className="bg-[#12121E]/80 border border-amber/20 rounded-2xl p-4 md:p-6 backdrop-blur-md shadow-xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.06] pb-3">
              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-amber font-bold flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  1. Statutory Classification (CMR 2017)
                </label>
                <p className="text-[11px] text-dim font-mono mt-0.5">
                  Click on any category to view mandatory DGMS safety regulations & field protocol modal.
                </p>
              </div>

              {activeHazardDef && (
                <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-amber/15 border border-amber/30 text-amber font-semibold self-start sm:self-auto">
                  Selected: {activeHazardDef.cmrClause.split('&')[0].trim()}
                </span>
              )}
            </div>

            {/* Classification Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
              {STATUTORY_HAZARDS.map((h) => {
                const isSelected = hazardType === h.type;

                return (
                  <div
                    key={h.type}
                    onClick={() => handleOpenStatutoryModal(h)}
                    className={`text-left p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer relative group flex flex-col justify-between ${
                      isSelected
                        ? 'border-amber bg-amber/15 shadow-[0_0_20px_rgba(245,166,35,0.15)] ring-1 ring-amber/50'
                        : 'border-white/[0.08] bg-coal/50 hover:border-amber/40 hover:bg-coal/80'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{h.icon}</span>
                          <span className="font-bold text-xs font-mono text-offwhite group-hover:text-amber transition-colors">
                            {h.label}
                          </span>
                        </div>
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-amber animate-ping" />
                        )}
                      </div>

                      <p className="text-[11px] text-dim leading-snug">
                        {h.shortDesc}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-amber">
                      <span className="truncate max-w-[170px]">{h.cmrClause.split('&')[0]}</span>
                      <span className="flex items-center gap-1 font-bold group-hover:translate-x-0.5 transition-transform">
                        <span>Modal</span>
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Severity Rating Bar */}
            <div className="pt-2 border-t border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs font-mono text-dim flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-amber" />
                <span>Statutory Hazard Severity Level:</span>
              </span>

              <div className="flex items-center gap-1.5">
                {(['low', 'medium', 'high', 'critical'] as HazardSeverity[]).map((lvl) => {
                  const isCur = severity === lvl;
                  const colorMap = {
                    low: 'text-teal border-teal/30 hover:bg-teal/10',
                    medium: 'text-amber border-amber/30 hover:bg-amber/10',
                    high: 'text-orange-400 border-orange-500/30 hover:bg-orange-500/10',
                    critical: 'text-red-400 border-red-500/40 hover:bg-red-500/10',
                  };
                  const activeBg = {
                    low: 'bg-teal text-coal font-bold shadow-sm',
                    medium: 'bg-amber text-coal font-bold shadow-amber-glow',
                    high: 'bg-orange-500 text-coal font-bold shadow-sm',
                    critical: 'bg-red-500 text-white font-bold animate-pulse shadow-sm',
                  };

                  return (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => {
                        soundManager.playClick();
                        setSeverity(lvl);
                      }}
                      className={`px-3 py-1 text-[11px] font-mono uppercase rounded-lg border transition-all ${
                        isCur ? activeBg[lvl] : colorMap[lvl]
                      }`}
                    >
                      {lvl}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 2: Media Capture (Optical Imagery & Native Voice Memo) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 2A: Optical Imagery */}
            <div className="bg-[#12121E]/80 border border-white/[0.08] rounded-2xl p-4 md:p-6 backdrop-blur-md flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-mono uppercase tracking-wider text-amber font-bold flex items-center gap-2">
                    <Camera className="w-4 h-4" />
                    2A. Optical Hazard Imagery
                  </label>
                  {imageBlob && (
                    <button
                      type="button"
                      onClick={() => setIsPreviewImageModalOpen(true)}
                      className="text-[10px] font-mono text-teal hover:underline flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Inspect Evidence Fullscreen</span>
                    </button>
                  )}
                </div>

                <LiveCameraViewfinder
                  imageBlob={imageBlob}
                  onImageCaptured={handleImageCaptured}
                  onImageCleared={handleImageCleared}
                />
              </div>

              {imageBlob && (
                <div className="mt-3 p-2 bg-coal/70 rounded-xl border border-dim/20 flex items-center justify-between text-xs font-mono text-dim">
                  <span>Visual record attached</span>
                  <button
                    type="button"
                    onClick={() => setIsPreviewImageModalOpen(true)}
                    className="text-amber hover:underline text-[11px]"
                  >
                    View Zoom & Watermark →
                  </button>
                </div>
              )}
            </div>

            {/* 2B: Audio Voice Memo */}
            <div className="bg-[#12121E]/80 border border-white/[0.08] rounded-2xl p-4 md:p-6 backdrop-blur-md flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-mono uppercase tracking-wider text-amber font-bold flex items-center gap-2">
                    <Mic className="w-4 h-4" />
                    2B. Voice Note Field Memo
                  </label>
                  <span className="text-[10px] font-mono text-dim">
                    {audioBlob ? 'Recorded' : 'MediaRecorder Audio'}
                  </span>
                </div>

                {!audioBlob ? (
                  <div className="border border-dashed border-dim/30 rounded-xl p-5 bg-coal/40 text-center">
                    {isRecording ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                          <span className="text-red-400 font-mono text-sm font-bold">
                            RECORDING AUDIO [{recordingDuration}s]
                          </span>
                        </div>

                        {/* Audio Waveform */}
                        <div className="flex items-center justify-center gap-1.5 h-10 px-4">
                          {audioLevels.map((val, idx) => (
                            <div
                              key={idx}
                              className="w-2 bg-amber rounded-full transition-all duration-75"
                              style={{ height: `${Math.min(36, val)}px` }}
                            />
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            soundManager.playClick();
                            stopRecording();
                          }}
                          className="px-5 py-2.5 rounded-full bg-red-500 hover:bg-red-600 text-white font-mono text-xs font-bold flex items-center gap-2 mx-auto transition-transform active:scale-95 shadow-lg"
                        >
                          <MicOff className="w-4 h-4" />
                          STOP RECORDING
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="w-12 h-12 rounded-xl bg-amber/10 border border-amber/20 text-amber flex items-center justify-center mx-auto shadow-inner">
                          <Mic className="w-6 h-6" />
                        </div>
                        <p className="text-xs text-dim max-w-xs mx-auto font-sans">
                          Dictate geological crack measurements, rock stability notes, or blast perimeter status hands-free.
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            soundManager.playClick();
                            startRecording();
                          }}
                          className="px-4 py-2.5 rounded-xl bg-amber/15 hover:bg-amber/25 border border-amber/30 text-amber text-xs font-mono font-bold flex items-center gap-2 mx-auto transition-all active:scale-95 shadow-sm"
                        >
                          <Mic className="w-3.5 h-3.5" />
                          Record Audio Memo
                        </button>
                      </div>
                    )}

                    {audioError && (
                      <p className="mt-2 text-xs text-red-400 font-mono">{audioError}</p>
                    )}
                  </div>
                ) : (
                  <AudioVoiceMemoPlayer
                    audioBlob={audioBlob}
                    onDiscard={() => {
                      soundManager.playClick();
                      resetRecording();
                    }}
                    title="Captured Voice Memo"
                  />
                )}
              </div>

              <div className="mt-3 text-[11px] font-mono text-dim/70 flex items-center justify-between">
                <span>Native audio/webm streaming</span>
                {audioBlob && <span className="text-teal font-semibold">✓ Ready for Outbox</span>}
              </div>
            </div>
          </div>

          {/* Section 3: High-Accuracy Spatial Geo-Tagging & Basin Presets */}
          <div className="bg-[#12121E]/80 border border-white/[0.08] rounded-2xl p-4 md:p-6 backdrop-blur-md shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-xs font-mono uppercase tracking-wider text-amber font-bold flex items-center gap-2">
                <Navigation className="w-4 h-4" />
                3. High-Accuracy Spatial Geo-Tagging
              </label>

              <div className="flex items-center gap-2">
                {coords && (
                  <button
                    type="button"
                    onClick={handleCopyCoords}
                    className="px-2.5 py-1 text-xs font-mono text-dim hover:text-amber bg-coal/70 rounded-lg border border-dim/20 flex items-center gap-1 transition-colors"
                    title="Copy coordinates"
                  >
                    <Copy className="w-3 h-3 text-amber" />
                    <span>Copy Lat/Lng</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    captureDeviceLocation();
                  }}
                  disabled={isLocating}
                  className="px-2.5 py-1 text-xs font-mono text-amber hover:underline flex items-center gap-1 bg-amber/10 rounded-lg border border-amber/30 transition-colors"
                >
                  <RefreshCw className={`w-3 h-3 ${isLocating ? 'animate-spin' : ''}`} />
                  <span>{isLocating ? 'Acquiring GNSS...' : 'Re-acquire GPS'}</span>
                </button>
              </div>
            </div>

            {coords ? (
              <div className="space-y-3">
                <div className="bg-coal/70 border border-teal/30 rounded-xl p-4 grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs shadow-inner">
                  <div>
                    <span className="text-[10px] text-dim block">LATITUDE</span>
                    <span className="text-teal font-bold text-sm">
                      {coords.latitude.toFixed(6)}° N
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-dim block">LONGITUDE</span>
                    <span className="text-teal font-bold text-sm">
                      {coords.longitude.toFixed(6)}° E
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-dim block">ACCURACY FIX</span>
                    <span className="text-offwhite font-semibold">±{coords.accuracy} meters</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-dim block">ALTITUDE</span>
                    <span className="text-offwhite font-semibold">
                      {coords.altitude !== null ? `${coords.altitude} m RL` : 'Surface / Bench'}
                    </span>
                  </div>
                </div>

                {/* Satellite Maps Pinpoint Link */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1 text-xs font-mono text-dim">
                  <span className="text-[11px]">GNSS telemetry locked to device sensor array.</span>
                  <a
                    href={`https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber hover:underline flex items-center gap-1.5 self-start sm:self-auto font-semibold"
                  >
                    <span>View Exact Satellite Map Location</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="bg-amber/10 border border-amber/30 rounded-xl p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h5 className="text-xs font-semibold text-amber font-mono">
                    {geoWarning || 'Acquiring GNSS fix from pit satellite array...'}
                  </h5>
                  <p className="text-[11px] text-dim">
                    Deep open-pit strata can shield satellite signal. You can calibrate coordinates using the Basin Preset dropdown below.
                  </p>
                </div>
              </div>
            )}

            {/* Colliery Recalibration Dropdown */}
            <div className="pt-2 border-t border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-[11px] font-mono text-dim">
                Pit Basin Calibration Preset:
              </span>
              <select
                value={selectedCollieryPreset}
                onChange={(e) => handleCollieryPresetChange(e.target.value)}
                className="bg-coal border border-dim/30 rounded-xl px-3 py-1.5 text-xs font-mono text-offwhite focus:outline-none focus:border-amber"
              >
                {COLLIERY_PRESETS.map((p) => (
                  <option key={p.id} value={p.id} className="bg-coal text-offwhite">
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Section 4: Operational Observations & 1-Tap Quick Phrasing Chips */}
          <div className="bg-[#12121E]/80 border border-white/[0.08] rounded-2xl p-4 md:p-6 backdrop-blur-md shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase tracking-wider text-amber font-bold">
                4. Operational Observations & Remediation Notes
              </label>
              <span className="text-[10px] font-mono text-dim">Industrial Tablet Optimized</span>
            </div>

            {/* Quick 1-Tap Field Presets */}
            <div>
              <span className="text-[10px] font-mono text-dim uppercase tracking-wider block mb-1.5">
                Quick-Insert Field Phrases:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {FIELD_OBSERVATION_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyObservationPreset(preset)}
                    className="px-2.5 py-1 text-[11px] font-mono rounded-lg bg-white/[0.04] hover:bg-amber/15 hover:text-amber border border-white/[0.08] hover:border-amber/30 text-dim text-left transition-colors"
                  >
                    + {preset.split(';')[0]}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Record geological strata observations, bench crack width, rock stability notes, or specific stop-work directives..."
              rows={4}
              className="w-full bg-coal/80 border border-dim/30 rounded-xl p-3.5 text-xs text-offwhite placeholder:text-dim/50 focus:outline-none focus:border-amber font-mono transition-colors"
            />
          </div>

          {/* Submit Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2 text-xs font-mono text-dim">
              <ShieldCheck className="w-4 h-4 text-teal" />
              <span>Offline Durable Write: MineSafetyDB IndexedDB Store</span>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-amber hover:bg-amber/90 text-coal font-mono font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2.5 shadow-amber-glow transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isSaving ? (
                <>
                  <span className="w-4 h-4 border-2 border-coal border-t-transparent rounded-full animate-spin" />
                  <span>COMMITTING TO OUTBOX...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>COMMIT HAZARD REPORT (OFFLINE)</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* CMR 2017 STATUTORY REGULATION SCREEN-CENTRIC MODAL */}
      {inspectingStatutoryHazard && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 md:p-6 overflow-y-auto bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
          {/* Backdrop Dismiss Layer */}
          <div
            className="fixed inset-0 bg-black/85 backdrop-blur-md -z-10 cursor-pointer"
            onClick={() => setInspectingStatutoryHazard(null)}
            aria-hidden="true"
          />

          {/* Screen-Centric Dialog Card */}
          <div className="relative my-auto w-full max-w-2xl max-h-[85vh] sm:max-h-[88vh] bg-[#12121E] border border-amber/40 rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden ring-1 ring-white/[0.08] animate-in zoom-in-95 duration-200 text-left">
            {/* Fixed Sticky Header */}
            <div className="flex-shrink-0 p-5 sm:p-6 border-b border-white/[0.08] flex items-start justify-between bg-[#12121E]">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{inspectingStatutoryHazard.icon}</span>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-bold text-white font-display">
                      {inspectingStatutoryHazard.label}
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber/20 text-amber font-bold border border-amber/30">
                      CMR 2017
                    </span>
                  </div>
                  <p className="text-xs text-amber font-mono mt-0.5">
                    {inspectingStatutoryHazard.cmrClause}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setInspectingStatutoryHazard(null)}
                className="p-1.5 rounded-lg hover:bg-white/[0.08] text-dim hover:text-white transition-colors"
                title="Close modal (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Modal Content Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
              {/* Legal Mandate */}
              <div className="p-3.5 rounded-xl bg-coal/70 border border-dim/20 space-y-1">
                <span className="text-[10px] font-mono uppercase text-dim tracking-wider font-semibold block">
                  Statutory Regulatory Standard
                </span>
                <p className="text-xs text-offwhite/90 leading-relaxed font-mono">
                  {inspectingStatutoryHazard.statutoryRule}
                </p>
              </div>

              {/* Mandatory Precautions Checklist */}
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-wider text-amber font-bold flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-teal" />
                  Mandatory Field Precaution Checklist
                </span>
                <div className="space-y-2">
                  {inspectingStatutoryHazard.precautions.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs font-mono text-offwhite flex items-start gap-2.5"
                    >
                      <span className="w-5 h-5 rounded bg-teal/15 text-teal border border-teal/30 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-snug">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Remediation */}
              <div className="p-3.5 rounded-xl bg-amber/10 border border-amber/25 space-y-1">
                <span className="text-[10px] font-mono uppercase text-amber tracking-wider font-bold block">
                  Recommended Engineering Remediation
                </span>
                <p className="text-xs text-offwhite/90 font-mono">
                  {inspectingStatutoryHazard.recommendedRemediation}
                </p>
              </div>

              {/* Severity Picker in Modal */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-mono text-dim block">
                  Assessed Severity Rating:
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {(['low', 'medium', 'high', 'critical'] as HazardSeverity[]).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setModalSeverity(lvl)}
                      className={`py-2 text-xs font-mono uppercase rounded-xl border transition-all font-bold ${
                        modalSeverity === lvl
                          ? 'bg-amber text-coal border-amber shadow-amber-glow'
                          : 'border-dim/20 bg-coal text-dim hover:text-offwhite'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Fixed Sticky Action Footer */}
            <div className="flex-shrink-0 p-4 sm:p-5 border-t border-white/[0.08] bg-[#12121E]/95 backdrop-blur-sm flex items-center gap-3">
              <button
                type="button"
                onClick={() => setInspectingStatutoryHazard(null)}
                className="flex-1 py-3 rounded-xl border border-white/[0.1] hover:bg-white/[0.05] text-offwhite font-mono text-xs transition-colors"
              >
                Close Without Applying
              </button>

              <button
                type="button"
                onClick={handleApplyStatutoryModal}
                className="flex-1 py-3 rounded-xl bg-amber hover:bg-amber/90 text-coal font-mono font-bold text-xs uppercase tracking-wider shadow-amber-glow transition-all active:scale-95"
              >
                Apply Classification & Pre-fill Protocol →
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* FULLSCREEN OPTICAL EVIDENCE SCREEN-CENTRIC MODAL */}
      {isPreviewImageModalOpen && imageBlob && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 md:p-6 overflow-y-auto bg-black/90 backdrop-blur-xl animate-in fade-in duration-200">
          {/* Backdrop Dismiss Layer */}
          <div
            className="fixed inset-0 bg-black/90 backdrop-blur-lg -z-10 cursor-pointer"
            onClick={() => setIsPreviewImageModalOpen(false)}
            aria-hidden="true"
          />

          {/* Screen-Centric Dialog Card */}
          <div className="relative my-auto w-full max-w-3xl max-h-[88vh] bg-[#12121E] border border-amber/40 rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden ring-1 ring-white/[0.08] animate-in zoom-in-95 duration-200 text-left">
            {/* Sticky Header */}
            <div className="flex-shrink-0 p-4 sm:p-5 border-b border-white/[0.08] flex items-center justify-between bg-[#12121E]">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-amber" />
                <h3 className="text-base font-bold text-white font-mono">
                  Optical Evidence Inspection
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsPreviewImageModalOpen(false)}
                className="p-1 rounded-lg hover:bg-white/[0.08] text-dim hover:text-white transition-colors"
                title="Close modal (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              <div className="relative rounded-2xl overflow-hidden border border-white/[0.1] bg-black flex items-center justify-center min-h-[220px] max-h-[55vh]">
                <img
                  src={URL.createObjectURL(imageBlob)}
                  alt="Captured Hazard Evidence"
                  className="w-full h-full max-h-[55vh] object-contain mx-auto"
                />
                <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-xl bg-black/80 backdrop-blur-md border border-white/[0.1] flex items-center justify-between text-[11px] font-mono text-offwhite">
                  <span>Timestamp: {new Date().toLocaleTimeString('en-IN')}</span>
                  {coords && (
                    <span className="text-amber">
                      GPS: {coords.latitude.toFixed(5)}°N, {coords.longitude.toFixed(5)}°E
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Fixed Action Footer */}
            <div className="flex-shrink-0 p-4 sm:p-5 border-t border-white/[0.08] bg-[#12121E]/95 backdrop-blur-sm flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleImageCleared}
                className="px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-mono text-xs transition-colors"
              >
                Discard Photo
              </button>
              <button
                type="button"
                onClick={() => setIsPreviewImageModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-amber text-coal font-mono font-bold text-xs uppercase hover:bg-amber/90 transition-all shadow-amber-glow"
              >
                Keep Evidence
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
