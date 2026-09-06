import React, { useState, useEffect } from 'react';
import {
  Layers,
  RefreshCw,
  Wifi,
  WifiOff,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Trash2,
  Plus,
  Play,
  Image as ImageIcon,
  MapPin,
  FileText,
  AlertOctagon,
  ArrowUpRight,
  Shield,
  ChevronDown,
} from 'lucide-react';
import { useSyncEngine } from '../../hooks/useSyncEngine';
import { HazardReport, SyncStatus } from '../../types/hazard';
import { AudioVoiceMemoPlayer } from './AudioVoiceMemoPlayer';
import { soundManager } from '../../utils/sound';

interface HazardOutboxViewProps {
  onNavigateToCapture?: () => void;
}

export const HazardOutboxView: React.FC<HazardOutboxViewProps> = ({
  onNavigateToCapture,
}) => {
  const {
    reports,
    pendingCount,
    syncingCount,
    syncedCount,
    failedCount,
    totalCount,
    isOnline,
    isSyncing,
    isSimulatedOffline,
    lastSyncTime,
    triggerSync,
    toggleSimulatedOffline,
    toggleSimulatedFailure,
    removeReport,
    clearAllSynced,
  } = useSyncEngine();

  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'synced'>('all');
  const [selectedImageModal, setSelectedImageModal] = useState<string | null>(null);
  const [isFailureSimulated, setIsFailureSimulated] = useState<boolean>(false);

  const handleToggleFailure = () => {
    soundManager.playClick();
    const nextVal = !isFailureSimulated;
    setIsFailureSimulated(nextVal);
    toggleSimulatedFailure(nextVal);
  };

  const filteredReports = reports.filter((r) => {
    if (activeFilter === 'pending') return r.syncStatus === 'pending' || r.syncStatus === 'syncing' || r.syncStatus === 'failed';
    if (activeFilter === 'synced') return r.syncStatus === 'synced';
    return true;
  });

  const formatTimestamp = (ts: number) => {
    const d = new Date(ts);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-8 space-y-6">
      {/* Header & Quick Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber/15 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-amber animate-pulse" />
            <span className="text-xs font-mono text-amber uppercase tracking-wider font-semibold">
              Persistent Storage // IndexedDB
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-offwhite tracking-tight">
            MineSafetyDB Outbox & Sync Engine
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {onNavigateToCapture && (
            <button
              type="button"
              onClick={onNavigateToCapture}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber text-coal font-mono font-bold text-xs hover:bg-amber/90 transition-transform active:scale-95 shadow-amber-glow"
            >
              <Plus className="w-4 h-4" />
              <span>Capture Hazard</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              triggerSync();
            }}
            disabled={isSyncing || !isOnline}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-xs font-bold border transition-all ${
              isSyncing
                ? 'bg-amber/20 border-amber text-amber'
                : !isOnline
                ? 'bg-coal border-dim/30 text-dim cursor-not-allowed'
                : 'bg-graphite/80 hover:bg-graphite border-amber/30 hover:border-amber text-amber active:scale-95'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-amber' : ''}`} />
            <span>{isSyncing ? 'Syncing Outbox...' : 'Trigger Sync Now'}</span>
          </button>
        </div>
      </div>

      {/* Metrics Row (4 Floating Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {/* Card 1: Total Queue */}
        <div className="bg-graphite/50 border border-dim/20 rounded-xl p-4 backdrop-blur-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono text-dim uppercase">Total in Outbox</span>
            <Layers className="w-4 h-4 text-dim" />
          </div>
          <div className="text-2xl font-display font-bold text-offwhite font-mono">
            {totalCount}
          </div>
          <span className="text-[10px] text-dim/80 font-mono">Store: hazard_outbox</span>
        </div>

        {/* Card 2: Pending Uploads */}
        <div className="bg-graphite/50 border border-amber/30 rounded-xl p-4 backdrop-blur-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono text-amber uppercase">Pending Dispatch</span>
            <Clock className="w-4 h-4 text-amber" />
          </div>
          <div className="text-2xl font-display font-bold text-amber font-mono">
            {pendingCount}
          </div>
          <span className="text-[10px] text-amber/80 font-mono">
            {isOnline ? 'Awaiting runner cycle' : 'Queued (cellular down)'}
          </span>
        </div>

        {/* Card 3: Synced to DGMS Node */}
        <div className="bg-graphite/50 border border-teal/30 rounded-xl p-4 backdrop-blur-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono text-teal uppercase">Synced to Cloud</span>
            <CheckCircle2 className="w-4 h-4 text-teal" />
          </div>
          <div className="text-2xl font-display font-bold text-teal font-mono">
            {syncedCount}
          </div>
          <span className="text-[10px] text-teal/80 font-mono">DGMS Ingestion 200 OK</span>
        </div>

        {/* Card 4: Network Status & Sim Mode */}
        <div className="bg-graphite/50 border border-dim/20 rounded-xl p-4 backdrop-blur-md flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono text-dim uppercase">Pit Uplink</span>
            {isOnline ? <Wifi className="w-4 h-4 text-teal" /> : <WifiOff className="w-4 h-4 text-amber" />}
          </div>
          <div className="text-sm font-bold font-mono">
            {isOnline ? (
              <span className="text-teal">ONLINE UPLINK</span>
            ) : (
              <span className="text-amber">AUTONOMOUS OFFLINE</span>
            )}
          </div>
          <span className="text-[10px] text-dim font-mono">
            {lastSyncTime ? `Last sync: ${new Date(lastSyncTime).toLocaleTimeString()}` : 'Background poll: 7s'}
          </span>
        </div>
      </div>

      {/* Pit Simulation Controls Bar */}
      <div className="bg-coal/60 border border-amber/20 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2 text-offwhite/90">
          <Shield className="w-4 h-4 text-amber" />
          <span className="font-semibold">Field Inspector Test Harness:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Simulate Offline Toggle */}
          <button
            type="button"
            onClick={toggleSimulatedOffline}
            className={`px-3 py-1.5 rounded-lg border transition-all ${
              isSimulatedOffline
                ? 'bg-amber/20 border-amber text-amber font-bold'
                : 'bg-graphite/60 border-dim/30 text-dim hover:text-offwhite'
            }`}
          >
            {isSimulatedOffline ? 'Simulating Pit Deadzone (OFFLINE)' : 'Simulate Deadzone'}
          </button>

          {/* Simulate Failure 503 Toggle */}
          <button
            type="button"
            onClick={handleToggleFailure}
            className={`px-3 py-1.5 rounded-lg border transition-all ${
              isFailureSimulated
                ? 'bg-red-500/20 border-red-500 text-red-400 font-bold'
                : 'bg-graphite/60 border-dim/30 text-dim hover:text-offwhite'
            }`}
          >
            {isFailureSimulated ? 'Simulating DGMS 503' : 'Simulate Repeater Error'}
          </button>

          {/* Prune Synced Records */}
          {syncedCount > 0 && (
            <button
              type="button"
              onClick={clearAllSynced}
              className="px-3 py-1.5 rounded-lg bg-coal border border-dim/30 hover:border-red-500/40 text-dim hover:text-red-400 transition-colors flex items-center gap-1.5"
              title="Delete all synced records from local IndexedDB"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Prune Synced ({syncedCount})</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-dim/20 pb-2">
        <button
          type="button"
          onClick={() => {
            soundManager.playClick();
            setActiveFilter('all');
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
            activeFilter === 'all'
              ? 'bg-amber/15 text-amber border border-amber/30 font-bold'
              : 'text-dim hover:text-offwhite'
          }`}
        >
          All Items ({totalCount})
        </button>

        <button
          type="button"
          onClick={() => {
            soundManager.playClick();
            setActiveFilter('pending');
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
            activeFilter === 'pending'
              ? 'bg-amber/15 text-amber border border-amber/30 font-bold'
              : 'text-dim hover:text-offwhite'
          }`}
        >
          Pending / Syncing ({pendingCount})
        </button>

        <button
          type="button"
          onClick={() => {
            soundManager.playClick();
            setActiveFilter('synced');
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
            activeFilter === 'synced'
              ? 'bg-amber/15 text-amber border border-amber/30 font-bold'
              : 'text-dim hover:text-offwhite'
          }`}
        >
          Synced ({syncedCount})
        </button>
      </div>

      {/* Outbox Report List */}
      {filteredReports.length === 0 ? (
        <div className="border border-dashed border-dim/30 rounded-2xl p-12 text-center bg-graphite/20">
          <Layers className="w-12 h-12 text-dim/50 mx-auto mb-3" />
          <h4 className="text-base font-display font-semibold text-offwhite mb-1">
            Outbox Queue is Empty
          </h4>
          <p className="text-xs text-dim max-w-sm mx-auto mb-5 font-mono">
            {activeFilter === 'pending'
              ? 'All captured hazard records have synced with DGMS Cloud Gateway.'
              : 'No hazard records logged in MineSafetyDB yet.'}
          </p>
          {onNavigateToCapture && (
            <button
              type="button"
              onClick={onNavigateToCapture}
              className="px-5 py-2.5 rounded-xl bg-amber text-coal font-mono font-bold text-xs shadow-amber-glow hover:bg-amber/90 transition-transform active:scale-95"
            >
              + Log First Hazard Report
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredReports.map((report) => (
            <OutboxReportCard
              key={report.id}
              report={report}
              onDelete={() => removeReport(report.id)}
              onPreviewImage={(url) => setSelectedImageModal(url)}
            />
          ))}
        </div>
      )}

      {/* Image Full-Size Modal */}
      {selectedImageModal && (
        <div className="fixed inset-0 z-50 bg-coal/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-3xl w-full bg-graphite border border-amber/30 rounded-2xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-3 border-b border-dim/20 bg-coal/80">
              <span className="text-xs font-mono text-amber">Full-Resolution Hazard Evidence</span>
              <button
                type="button"
                onClick={() => setSelectedImageModal(null)}
                className="text-dim hover:text-offwhite font-mono text-sm px-2"
              >
                ✕ Close
              </button>
            </div>
            <img
              src={selectedImageModal}
              alt="Hazard Full View"
              className="w-full max-h-[75vh] object-contain bg-black"
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Individual Report Card Sub-Component
function OutboxReportCard({
  report,
  onDelete,
  onPreviewImage,
}: {
  report: HazardReport;
  onDelete: () => void;
  onPreviewImage: (url: string) => void;
}) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    let url: string | null = null;
    if (report.imageBlob) {
      url = URL.createObjectURL(report.imageBlob);
      setImageUrl(url);
    }
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [report.imageBlob]);

  const getStatusBadge = (status: SyncStatus, retries: number) => {
    switch (status) {
      case 'synced':
        return (
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono bg-teal/15 text-teal border border-teal/30">
            <CheckCircle2 className="w-3 h-3" />
            <span>SYNCED</span>
          </span>
        );
      case 'syncing':
        return (
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono bg-amber/20 text-amber border border-amber/40 animate-pulse">
            <RefreshCw className="w-3 h-3 animate-spin" />
            <span>TRANSMITTING...</span>
          </span>
        );
      case 'failed':
        return (
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono bg-red-500/15 text-red-400 border border-red-500/30">
            <AlertOctagon className="w-3 h-3" />
            <span>FAILED (Retry {retries})</span>
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono bg-amber/10 text-amber border border-amber/30">
            <Clock className="w-3 h-3" />
            <span>PENDING {retries > 0 ? `(Retried ${retries}x)` : ''}</span>
          </span>
        );
    }
  };

  const getHazardLabel = (type: string) => {
    switch (type) {
      case 'crack':
        return '⚡ Highwall Tension Crack';
      case 'rockfall':
        return '🪨 Rockfall / Overburden Slip';
      case 'leak':
        return '💧 Fluid / Seepage Fault';
      case 'equipment_failure':
        return '🚜 HEMM Machine Failure';
      default:
        return '⚠️ General Mine Hazard';
    }
  };

  return (
    <div className="bg-graphite/40 border border-dim/20 hover:border-amber/30 rounded-2xl p-5 backdrop-blur-md transition-all flex flex-col justify-between">
      <div>
        {/* Top bar: Type + Status */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="font-semibold text-sm text-offwhite font-display">
            {getHazardLabel(report.type)}
          </span>
          {getStatusBadge(report.syncStatus, report.retryCount)}
        </div>

        {/* ID & Timestamp */}
        <div className="flex items-center justify-between text-[11px] font-mono text-dim mb-3 pb-2 border-b border-dim/15">
          <span>ID: {report.id.substring(0, 14)}...</span>
          <span>{new Date(report.timestamp).toLocaleTimeString()}</span>
        </div>

        {/* Media Preview: Image thumbnail + Voice Memo */}
        <div className="space-y-3 mb-3">
          {imageUrl && (
            <div
              onClick={() => onPreviewImage(imageUrl)}
              className="relative h-32 rounded-xl overflow-hidden border border-dim/30 cursor-pointer group bg-coal"
            >
              <img
                src={imageUrl}
                alt="Evidence"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-coal/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-offwhite text-xs font-mono gap-1">
                <ImageIcon className="w-4 h-4 text-amber" />
                <span>Click to Expand</span>
              </div>
            </div>
          )}

          {report.audioBlob && (
            <AudioVoiceMemoPlayer
              audioBlob={report.audioBlob}
              title="Inspector Voice Note"
            />
          )}
        </div>

        {/* Description / Notes */}
        {report.description && (
          <p className="text-xs text-offwhite/90 bg-coal/50 p-2.5 rounded-lg border border-dim/20 mb-3 font-sans leading-relaxed">
            {report.description}
          </p>
        )}

        {/* Coordinates Telemetry */}
        <div className="bg-coal/70 rounded-lg p-2.5 border border-dim/15 font-mono text-[11px] space-y-1 mb-3">
          {report.coordinates ? (
            <div className="flex items-center justify-between text-teal">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {report.coordinates.latitude.toFixed(5)}° N, {report.coordinates.longitude.toFixed(5)}° E
              </span>
              <span className="text-dim text-[10px]">±{report.coordinates.accuracy}m fix</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-amber">
              <AlertTriangle className="w-3 h-3 text-amber" />
              <span>{report.geoWarning || 'GPS fix unavailable (Logged as pit zone)'}</span>
            </div>
          )}
        </div>

        {/* Diagnostic error message if failed */}
        {report.errorMessage && (
          <div className="text-[11px] font-mono text-red-400 bg-red-500/10 border border-red-500/20 p-2 rounded mb-3">
            Last failure: {report.errorMessage}
          </div>
        )}
      </div>

      {/* Card Footer: Synced timestamp or Prune / Delete action */}
      <div className="flex items-center justify-between pt-2 border-t border-dim/15 text-[11px] font-mono text-dim">
        <span>
          {report.syncedTimestamp
            ? `Ack at: ${new Date(report.syncedTimestamp).toLocaleTimeString()}`
            : `Retries: ${report.retryCount}`}
        </span>

        <button
          type="button"
          onClick={() => {
            soundManager.playClick();
            onDelete();
          }}
          className="hover:text-red-400 transition-colors p-1 flex items-center gap-1 text-dim"
          title="Delete from local device outbox"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Remove</span>
        </button>
      </div>
    </div>
  );
}

