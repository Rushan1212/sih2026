import React, { useState, useEffect } from 'react';
import { 
  X, 
  Terminal, 
  AlertTriangle, 
  Flame, 
  Activity, 
  Truck, 
  CheckCircle2, 
  FileText, 
  Radio, 
  ShieldAlert,
  Play,
  RotateCcw,
  Download,
  Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../utils/sound';

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
      { step: '0.3s', action: 'Database Cross-Verification', detail: 'Driver driver VT safety passport lapsed 18 days ago' },
      { step: '0.8s', action: 'Boom Barrier Auto-Lock', detail: 'Physical gate barrier locked. Security overman alerted' },
      { step: '1.4s', action: 'Contractor Penalty Ledger', detail: 'Contractor compliance rating penalized -5% in central ERP' },
    ],
  },
];

export default function WarRoomSimulatorModal({ isOpen, onClose }) {
  const [activeScenario, setActiveScenario] = useState(simulationScenarios[0]);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSteps, setCompletedSteps] = useState(0);
  const [simCompleted, setSimCompleted] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsRunning(false);
      setCompletedSteps(0);
      setSimCompleted(false);
    }
  }, [isOpen]);

  const handleStartSimulation = () => {
    soundManager.playAlert();
    setIsRunning(true);
    setCompletedSteps(0);
    setSimCompleted(false);

    activeScenario.steps.forEach((_, idx) => {
      setTimeout(() => {
        setCompletedSteps(idx + 1);
        soundManager.playHover();
        if (idx === activeScenario.steps.length - 1) {
          setIsRunning(false);
          setSimCompleted(true);
          soundManager.playSuccess();
          confetti({
            particleCount: 70,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#F5A623', '#FFD60A', '#30D158'],
          });
        }
      }, (idx + 1) * 700);
    });
  };

  const handleSelectScenario = (scen) => {
    soundManager.playClick();
    setActiveScenario(scen);
    setIsRunning(false);
    setCompletedSteps(0);
    setSimCompleted(false);
  };

  if (!isOpen) return null;

  const Icon = activeScenario.icon;

  return (
    <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-coal-950/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl glass-card rounded-2xl border border-amber/50 shadow-[0_0_80px_rgba(245,166,35,0.25)] p-6 sm:p-8 my-auto overflow-hidden">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-coal-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-coal-900 border border-amber text-amber shadow-md">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-display font-bold text-white uppercase tracking-wide">
                  War Room Incident Simulator
                </h3>
                <span className="text-[10px] font-mono font-bold bg-amber text-coal-950 px-2 py-0.5 rounded">
                  LIVE INTERACTIVE
                </span>
              </div>
              <p className="text-xs font-mono text-coal-400">
                Experience how CoalGuard AI autonomously intercepts, contains, and logs statutory hazards in under 2 seconds.
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

        {/* Scenario Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-6">
          {simulationScenarios.map((scen) => {
            const isSelected = scen.id === activeScenario.id;
            const ScenIcon = scen.icon;
            return (
              <button
                key={scen.id}
                onClick={() => handleSelectScenario(scen)}
                className={`p-3.5 rounded-xl border text-left transition-all relative ${
                  isSelected
                    ? 'bg-coal-900 border-amber shadow-[0_0_15px_rgba(245,166,35,0.3)]'
                    : 'bg-coal-900/50 border-coal-800 text-coal-400 hover:border-coal-700 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-amber font-bold">
                    {scen.subsidiary}
                  </span>
                  <ScenIcon className="w-4 h-4" style={{ color: scen.color }} />
                </div>
                <div className="text-xs font-display font-bold text-white line-clamp-1">
                  {scen.title}
                </div>
                <div className="text-[10px] font-mono text-coal-400 mt-1">
                  {scen.hazard}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Scenario Dossier */}
        <div className="glass-panel rounded-xl p-5 border border-coal-700/80 mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="text-xs font-mono text-amber tracking-wider uppercase">
                TARGET PIT // {activeScenario.zone}
              </div>
              <div className="text-lg font-display font-bold text-white mt-0.5">
                {activeScenario.title}
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-mono text-coal-400 block">INITIAL TELEMETRY SPIKE</span>
              <span className="text-xs font-mono font-bold text-white" style={{ color: activeScenario.color }}>
                {activeScenario.initialReading}
              </span>
            </div>
          </div>

          <div className="text-xs font-mono text-coal-300 bg-coal-900/90 p-2.5 rounded-lg border border-coal-800 flex items-center justify-between">
            <span className="text-coal-400">STATUTORY LEGAL CONFORMITY:</span>
            <span className="text-amber font-semibold">{activeScenario.clause}</span>
          </div>

          {/* Execution Pipeline Steps */}
          <div className="space-y-3 pt-2">
            {activeScenario.steps.map((st, idx) => {
              const isDone = completedSteps > idx;
              const isCurrent = completedSteps === idx && isRunning;
              return (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border transition-all flex items-start justify-between gap-3 text-xs font-mono ${
                    isDone
                      ? 'bg-coal-900 border-emerald-500/50 text-white shadow-sm'
                      : isCurrent
                      ? 'bg-coal-900 border-amber text-white animate-pulse'
                      : 'bg-coal-900/30 border-coal-800/60 text-coal-400'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5">
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <span className="w-4 h-4 rounded-full border border-coal-600 flex items-center justify-center text-[9px] text-coal-400">
                          {idx + 1}
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="font-bold flex items-center gap-2">
                        <span>{st.action}</span>
                        {isDone && <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400">EXECUTED</span>}
                      </div>
                      <div className="text-[11px] text-coal-300 mt-0.5">
                        {st.detail}
                      </div>
                    </div>
                  </div>

                  <span className="text-coal-400 text-[10px] flex-shrink-0 font-mono">
                    +{st.step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="text-xs font-mono text-coal-400 flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-amber" />
            <span>AI Risk Interception Rate: 99.98% Guaranteed</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {!simCompleted ? (
              <button
                onClick={handleStartSimulation}
                disabled={isRunning}
                className={`w-full sm:w-auto px-6 py-3 rounded-xl font-display font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 transition-all ${
                  isRunning
                    ? 'bg-coal-800 text-coal-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-amber to-amber-electric text-coal-950 hover:shadow-amber-glow hover:scale-105 active:scale-95'
                }`}
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{isRunning ? 'Simulating Interception...' : 'Trigger Live Hazard Test'}</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleStartSimulation}
                  className="px-4 py-2.5 rounded-xl bg-coal-900 border border-coal-700 text-coal-200 hover:text-white hover:border-amber text-xs font-mono flex items-center gap-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Rerun Test</span>
                </button>
                <button
                  onClick={() => {
                    soundManager.playSuccess();
                    alert('DGMS Form-IV Report generated and downloaded as encrypted PDF.');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 text-coal-950 font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-emerald-400 transition-colors shadow-lg"
                >
                  <Download className="w-4 h-4" />
                  <span>Download DGMS Form-IV PDF</span>
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
