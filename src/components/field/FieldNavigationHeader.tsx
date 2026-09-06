import React from 'react';
import {
  Wifi,
  WifiOff,
  RefreshCw,
  Camera,
  Layers,
  LayoutDashboard,
  Home,
  Shield,
  HardHat,
  Bell,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useSyncEngine } from '../../hooks/useSyncEngine';
import { useAuth } from '../../context/AuthContext';
import { soundManager } from '../../utils/sound';

interface FieldNavigationHeaderProps {
  currentRoute: 'capture' | 'outbox' | 'dashboard' | 'landing' | 'announcements';
  onNavigate: (route: string) => void;
}

export const FieldNavigationHeader: React.FC<FieldNavigationHeaderProps> = ({
  currentRoute,
  onNavigate,
}) => {
  const {
    isOnline,
    isSyncing,
    pendingCount,
    isSimulatedOffline,
    toggleSimulatedOffline,
    triggerSync,
  } = useSyncEngine();

  const { user, isAuthority, isAuthenticated } = useAuth();

  const [muted, setMuted] = React.useState<boolean>(soundManager.muted);

  const handleMuteToggle = () => {
    const isNowMuted = soundManager.toggleMute();
    setMuted(isNowMuted);
  };

  return (
    <header className="sticky top-0 z-40 bg-coal/90 backdrop-blur-md border-b border-amber/15 px-4 lg:px-8 xl:px-10 py-3 transition-all">
      <div className="w-full max-w-[1780px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Brand & Status HUD */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-amber/15 border border-amber/40 flex items-center justify-center text-amber text-sm font-bold shadow-amber-glow">
              ◆
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-bold text-sm lg:text-base text-offwhite tracking-wide">
                  COALGUARD // FIELD PWA
                </h1>
                <span className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber/15 text-amber border border-amber/30">
                  CMR 2017 REG 113
                </span>
              </div>
              <p className="text-[11px] font-mono text-dim">
                Pit Autonomous Mode • High-Accuracy Telemetry
              </p>
            </div>
          </div>

          {/* Connection HUD Pill */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleSimulatedOffline}
              type="button"
              title="Click to toggle simulated pit cellular deadzone"
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono border transition-all cursor-pointer ${
                isOnline
                  ? 'bg-teal/10 border-teal/40 text-teal hover:bg-teal/20'
                  : 'bg-amber/15 border-amber/40 text-amber hover:bg-amber/25'
              }`}
            >
              {isOnline ? (
                <>
                  <Wifi className="w-3.5 h-3.5 animate-pulse text-teal" />
                  <span className="font-semibold">ONLINE</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber" />
                  <span className="font-semibold">OFFLINE QUEUE</span>
                </>
              )}
              {isSimulatedOffline && (
                <span className="text-[9px] bg-amber/30 px-1 rounded text-amber">
                  SIM
                </span>
              )}
            </button>

            {/* Syncing Indicator */}
            {isSyncing && (
              <div className="flex items-center gap-1 text-xs font-mono text-amber animate-pulse">
                <RefreshCw className="w-3 h-3 animate-spin text-amber" />
                <span className="hidden sm:inline">SYNCING...</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Route Switcher & Actions */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto justify-center md:justify-end pb-1 md:pb-0">
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              onNavigate('/field-capture');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              currentRoute === 'capture'
                ? 'bg-amber text-coal shadow-amber-glow font-bold'
                : 'bg-graphite/60 text-offwhite hover:bg-graphite border border-dim/20 hover:border-amber/40'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Hazard Capture</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              onNavigate('/hazard-outbox');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all relative ${
              currentRoute === 'outbox'
                ? 'bg-amber text-coal shadow-amber-glow font-bold'
                : 'bg-graphite/60 text-offwhite hover:bg-graphite border border-dim/20 hover:border-amber/40'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Outbox</span>
            {pendingCount > 0 && (
              <span
                className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  currentRoute === 'outbox'
                    ? 'bg-coal text-amber'
                    : 'bg-amber text-coal'
                }`}
              >
                {pendingCount}
              </span>
            )}
          </button>

          {/* Announcements & Committed Feed */}
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              onNavigate('/announcements');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              currentRoute === 'announcements'
                ? 'bg-amber text-coal shadow-amber-glow font-bold'
                : 'bg-graphite/60 text-offwhite hover:bg-graphite border border-dim/20 hover:border-amber/40'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Feed</span>
          </button>

          {/* Quick link to Central DGMS Dashboard */}
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              onNavigate('/dashboard');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-dim hover:text-offwhite bg-coal/60 hover:bg-coal border border-dim/20 hover:border-amber/20 transition-all"
            title="Go to DGMS Exploration Dashboard"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-teal" />
            <span className="hidden sm:inline">DGMS Hub</span>
          </button>

          {/* User Profile / Login Pill */}
          {isAuthenticated && user ? (
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                onNavigate('/login');
              }}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-mono border transition-all ${
                isAuthority
                  ? 'bg-amber/15 border-amber/40 text-amber'
                  : 'bg-teal/15 border-teal/40 text-teal'
              }`}
              title="Click to view statutory profile or switch persona"
            >
              {isAuthority ? <Shield className="w-3 h-3 text-amber" /> : <HardHat className="w-3 h-3 text-teal" />}
              <span className="truncate max-w-[85px] font-bold">{user.user_metadata?.full_name || user.email}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                onNavigate('/login');
              }}
              className="px-2.5 py-1.5 rounded-lg text-xs font-mono text-amber border border-amber/40 hover:bg-amber/15 transition-all font-bold"
            >
              Login
            </button>
          )}

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={handleMuteToggle}
            className="p-1.5 rounded-lg text-dim hover:text-offwhite hover:bg-graphite/50 transition-colors"
            title={muted ? 'Unmute tactical audio' : 'Mute tactical audio'}
          >
            {muted ? (
              <VolumeX className="w-4 h-4 text-dim" />
            ) : (
              <Volume2 className="w-4 h-4 text-amber" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

