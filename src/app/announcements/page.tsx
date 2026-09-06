'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Bell,
  AlertTriangle,
  CheckCircle2,
  Shield,
  HardHat,
  Plus,
  Search,
  Filter,
  MapPin,
  Clock,
  Volume2,
  Image as ImageIcon,
  Check,
  Send,
  X,
  FileText,
  Radio,
  ExternalLink,
  ChevronDown,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  getUnifiedFeed,
  broadcastAnnouncement,
  acknowledgeAnnouncement,
  verifyHazardReport,
  ANNOUNCEMENT_CHANGE_EVENT,
} from '../../services/announcements';
import { SafetyAnnouncement, ReportVerification, AnnouncementSeverity } from '../../types/announcements';
import { HazardReport } from '../../types/hazard';
import { DB_CHANGE_EVENT } from '../../services/db';
import { AudioVoiceMemoPlayer } from '../../components/field/AudioVoiceMemoPlayer';
import { soundManager } from '../../utils/sound';

interface AnnouncementsPageProps {
  onNavigate?: (route: string) => void;
}

export default function AnnouncementsPage({ onNavigate }: AnnouncementsPageProps) {
  const { user, isAuthority, isEmployee, isAuthenticated } = useAuth();

  const [announcements, setAnnouncements] = useState<SafetyAnnouncement[]>([]);
  const [hazardReports, setHazardReports] = useState<HazardReport[]>([]);
  const [verifications, setVerifications] = useState<Record<string, ReportVerification>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'announcements' | 'hazards' | 'critical'>('all');

  // Modals
  const [broadcastModalOpen, setBroadcastModalOpen] = useState<boolean>(false);
  const [verifyModalReport, setVerifyModalReport] = useState<HazardReport | null>(null);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  // Form states for broadcasting
  const [broadcastTitle, setBroadcastTitle] = useState<string>('');
  const [broadcastContent, setBroadcastContent] = useState<string>('');
  const [broadcastSeverity, setBroadcastSeverity] = useState<AnnouncementSeverity>('warning');
  const [broadcastClause, setBroadcastClause] = useState<string>('CMR 2017 Reg 106');
  const [isBroadcasting, setIsBroadcasting] = useState<boolean>(false);

  // Form state for verification
  const [verifyNotes, setVerifyNotes] = useState<string>('');
  const [verifyDirective, setVerifyDirective] = useState<'monitor' | 'remediate' | 'evacuate_bench' | 'resolved'>('remediate');

  const navigateTo = (route: string) => {
    if (onNavigate) {
      onNavigate(route);
    } else if (typeof window !== 'undefined') {
      window.location.hash = route.replace(/^\//, '');
      if (window.history.pushState) {
        window.history.pushState(null, '', route);
      }
    }
  };

  // Refresh feed from IndexedDB and local storage
  const loadFeed = useCallback(async () => {
    try {
      const data = await getUnifiedFeed();
      setAnnouncements(data.announcements);
      setHazardReports(data.hazardReports);
      setVerifications(data.verifications);
    } catch (e) {
      console.error('Failed to load announcements feed:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFeed();

    const handleMutations = () => {
      loadFeed();
    };

    window.addEventListener(ANNOUNCEMENT_CHANGE_EVENT, handleMutations);
    window.addEventListener(DB_CHANGE_EVENT, handleMutations);

    return () => {
      window.removeEventListener(ANNOUNCEMENT_CHANGE_EVENT, handleMutations);
      window.removeEventListener(DB_CHANGE_EVENT, handleMutations);
    };
  }, [loadFeed]);

  // Handle Broadcast Submission (Authority only)
  const handleBroadcastSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastContent.trim() || isBroadcasting) return;

    soundManager.playClick();
    setIsBroadcasting(true);

    try {
      await broadcastAnnouncement({
        title: broadcastTitle.trim(),
        content: broadcastContent.trim(),
        severity: broadcastSeverity,
        statutoryClause: broadcastClause.trim() || undefined,
        collieryId: user?.user_metadata.colliery_id || 'all_open_pits',
        collieryName: user?.user_metadata.colliery_name || 'All Colliery Benches',
        author: {
          id: user?.id || 'auth-officer',
          name: user?.user_metadata?.full_name || user?.email || 'DGMS Directorate',
          designation: user?.user_metadata?.designation || 'Statutory Safety Director',
          role: 'authority',
          badge: user?.user_metadata?.badge_number || 'DGMS-DIR-9921',
        },
      });

      soundManager.playSuccess();
      setBroadcastTitle('');
      setBroadcastContent('');
      setBroadcastModalOpen(false);
      await loadFeed();
    } catch (err) {
      console.error('Failed to broadcast announcement:', err);
    } finally {
      setIsBroadcasting(false);
    }
  };

  // Handle Acknowledgment (Employee)
  const handleAcknowledge = async (announcementId: string) => {
    soundManager.playClick();
    const ackUser = {
      userId: user?.id || `anon-emp-${Date.now()}`,
      userName: user?.user_metadata?.full_name || user?.email || 'Colliery Field Inspector',
      userDesignation: user?.user_metadata?.designation || 'Shift Overman',
      badge: user?.user_metadata?.badge_number || 'EMP-DGMS-000',
      timestamp: Date.now(),
    };

    await acknowledgeAnnouncement(announcementId, ackUser);
    soundManager.playSuccess();
    await loadFeed();
  };

  // Handle Verification (Authority)
  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyModalReport) return;

    soundManager.playClick();
    const verification: ReportVerification = {
      reportId: verifyModalReport.id,
      verifiedBy: user?.user_metadata?.full_name || user?.email || 'DGMS Directorate',
      verifierDesignation: user?.user_metadata?.designation || 'Director of Mine Safety',
      verifierBadge: user?.user_metadata?.badge_number || 'DGMS-DIR-9921',
      verifiedAt: Date.now(),
      actionDirective: verifyDirective,
      authorityNotes: verifyNotes.trim() || 'DGMS statutory inspection verified and archived.',
      statutoryHash: `0x${Math.random().toString(16).substring(2, 10).toUpperCase()}`,
    };

    await verifyHazardReport(verification);
    soundManager.playSuccess();
    setVerifyModalReport(null);
    setVerifyNotes('');
    await loadFeed();
  };

  // Filtered lists
  const filteredAnnouncements = announcements.filter((a) => {
    if (activeFilter === 'hazards') return false;
    if (activeFilter === 'critical' && a.severity !== 'critical') return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return a.title.toLowerCase().includes(q) || a.content.toLowerCase().includes(q) || a.collieryName.toLowerCase().includes(q);
  });

  const filteredHazardReports = hazardReports.filter((h) => {
    if (activeFilter === 'announcements') return false;
    if (activeFilter === 'critical' && h.type !== 'rockfall' && h.type !== 'crack') return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return h.type.toLowerCase().includes(q) || (h.description && h.description.toLowerCase().includes(q)) || h.id.toLowerCase().includes(q);
  });

  const totalItems = filteredAnnouncements.length + filteredHazardReports.length;

  return (
    <div className="min-h-screen bg-coal text-offwhite font-sans selection:bg-amber selection:text-coal relative overflow-x-clip pb-16">
      {/* Antigravity Ambient Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-amber/[0.035] blur-[180px] pointer-events-none rounded-full z-0" />
      <div className="fixed bottom-0 right-0 w-[800px] h-[500px] bg-[#2D3561]/25 blur-[200px] pointer-events-none rounded-full z-0" />

      {/* Top Tactical Command Header */}
      <header className="sticky top-0 z-40 bg-coal/90 backdrop-blur-md border-b border-amber/15 px-4 lg:px-8 xl:px-10 py-3 transition-all">
        <div className="w-full max-w-[1780px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Left: Brand & Title */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                navigateTo('/');
              }}
              className="flex items-center gap-2 group text-left"
            >
              <span className="w-7 h-7 rounded-lg bg-amber/15 border border-amber/40 flex items-center justify-center text-amber text-sm font-bold group-hover:rotate-45 transition-transform duration-300 shadow-amber-glow">
                ◆
              </span>
              <div>
                <h1 className="font-display font-bold text-sm lg:text-base text-offwhite tracking-wide">
                  COALGUARD // ANNOUNCEMENTS
                </h1>
                <p className="text-[10px] font-mono text-dim">
                  DGMS Statutory Directive Board & Committed Field Feed
                </p>
              </div>
            </button>
          </div>

          {/* Right: Quick Links, Role Badge, Broadcast Button */}
          <div className="flex items-center gap-2.5 overflow-x-auto w-full sm:w-auto justify-end pb-1 sm:pb-0">
            {/* Nav to Field App */}
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                navigateTo('/field-capture');
              }}
              className="px-3 py-1.5 rounded-lg bg-graphite/80 hover:bg-graphite border border-dim/20 hover:border-amber/30 text-offwhite text-xs font-mono transition-all flex items-center gap-1.5"
            >
              <span>Field App</span>
            </button>

            {/* Nav to Outbox */}
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                navigateTo('/hazard-outbox');
              }}
              className="px-3 py-1.5 rounded-lg bg-graphite/80 hover:bg-graphite border border-dim/20 hover:border-amber/30 text-offwhite text-xs font-mono transition-all flex items-center gap-1.5"
            >
              <span>Outbox</span>
            </button>

            {/* User Profile or Login Button */}
            {isAuthenticated && user ? (
              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  navigateTo('/login');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono border transition-all ${
                  isAuthority
                    ? 'bg-amber/15 border-amber/40 text-amber'
                    : 'bg-teal/15 border-teal/40 text-teal'
                }`}
                title="Click to manage profile or switch role"
              >
                {isAuthority ? <Shield className="w-3.5 h-3.5 text-amber" /> : <HardHat className="w-3.5 h-3.5 text-teal" />}
                <span className="font-bold truncate max-w-[120px]">{user.user_metadata?.full_name || user.email}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  navigateTo('/login');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber text-coal font-mono font-bold text-xs hover:bg-amber/90 transition-transform active:scale-95 shadow-amber-glow"
              >
                <span>Login</span>
              </button>
            )}

            {/* Authority Broadcast Action */}
            {isAuthority && (
              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setBroadcastModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber text-coal font-mono font-bold text-xs hover:bg-amber/90 transition-transform active:scale-95 shadow-amber-glow"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Broadcast Alert</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Feed Area */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 py-6 md:py-8 space-y-6">
        {/* Banner with Live Count */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber/15 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-teal animate-pulse" />
              <span className="text-xs font-mono text-teal uppercase tracking-wider font-semibold">
                Centralized Operations Registry
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-offwhite tracking-tight">
              Statutory Bulletins & Committed Hazards
            </h2>
            <p className="text-xs text-dim font-mono mt-0.5">
              Every field inspector report committed to <code className="text-amber">MineSafetyDB</code> is preserved here for statutory inspection and compliance verification.
            </p>
          </div>

          {/* Quick Authority Banner Indicator */}
          {isAuthority && (
            <div className="px-3.5 py-2 rounded-xl bg-amber/10 border border-amber/30 text-amber text-xs font-mono flex items-center gap-2 self-start md:self-auto">
              <Shield className="w-4 h-4 text-amber" />
              <span>Authority Mode: You can endorse hazard logs & post safety orders.</span>
            </div>
          )}
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-graphite/40 border border-dim/20 rounded-2xl p-3 backdrop-blur-md">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-dim absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reports, pit names, clauses..."
              className="w-full bg-coal/70 border border-dim/30 rounded-xl pl-9 pr-3 py-2 text-xs text-offwhite placeholder:text-dim/50 focus:outline-none focus:border-amber font-mono"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                setActiveFilter('all');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                activeFilter === 'all'
                  ? 'bg-amber text-coal font-bold shadow-amber-glow'
                  : 'text-dim hover:text-offwhite'
              }`}
            >
              All Registry ({announcements.length + hazardReports.length})
            </button>

            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                setActiveFilter('hazards');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                activeFilter === 'hazards'
                  ? 'bg-amber text-coal font-bold shadow-amber-glow'
                  : 'text-dim hover:text-offwhite'
              }`}
            >
              Committed Hazards ({hazardReports.length})
            </button>

            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                setActiveFilter('announcements');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                activeFilter === 'announcements'
                  ? 'bg-amber text-coal font-bold shadow-amber-glow'
                  : 'text-dim hover:text-offwhite'
              }`}
            >
              Official Bulletins ({announcements.length})
            </button>

            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                setActiveFilter('critical');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                activeFilter === 'critical'
                  ? 'bg-red-500/20 text-red-400 border border-red-500/40 font-bold'
                  : 'text-dim hover:text-offwhite'
              }`}
            >
              Critical Only
            </button>
          </div>
        </div>

        {/* Feed Cards List */}
        {totalItems === 0 ? (
          <div className="border border-dashed border-dim/30 rounded-2xl p-12 text-center bg-graphite/20">
            <Bell className="w-12 h-12 text-dim/50 mx-auto mb-3" />
            <h4 className="text-base font-display font-semibold text-offwhite mb-1">
              No Matching Registry Records Found
            </h4>
            <p className="text-xs text-dim max-w-sm mx-auto mb-5 font-mono">
              Try changing the search query or log a new hazard report via the Field App.
            </p>
            <button
              type="button"
              onClick={() => navigateTo('/field-capture')}
              className="px-5 py-2.5 rounded-xl bg-amber text-coal font-mono font-bold text-xs shadow-amber-glow hover:bg-amber/90 transition-transform active:scale-95"
            >
              + Capture Field Hazard
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Render Official Bulletins */}
            {filteredAnnouncements.map((ann) => (
              <AnnouncementCard
                key={ann.id}
                announcement={ann}
                isAuthority={isAuthority}
                isEmployee={isEmployee}
                currentUserId={user?.id}
                onAcknowledge={() => handleAcknowledge(ann.id)}
              />
            ))}

            {/* Render Committed Hazard Reports */}
            {filteredHazardReports.map((report) => (
              <CommittedHazardCard
                key={report.id}
                report={report}
                verification={verifications[report.id]}
                isAuthority={isAuthority}
                onVerifyClick={() => {
                  soundManager.playClick();
                  setVerifyModalReport(report);
                }}
                onImageClick={(url) => setExpandedImage(url)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modal 1: Authority Broadcast Alert */}
      {broadcastModalOpen && (
        <div className="fixed inset-0 z-50 bg-coal/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-lg w-full bg-graphite border border-amber/30 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-dim/20 pb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-amber" />
                <h3 className="text-base font-display font-bold text-offwhite">
                  Broadcast Statutory Directive
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setBroadcastModalOpen(false)}
                className="text-dim hover:text-offwhite font-mono text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBroadcastSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono text-amber uppercase mb-1 font-semibold">
                  Directive Title / Subject
                </label>
                <input
                  type="text"
                  required
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  placeholder="e.g. Monsoon Highwall Water Drainage Stoppage Order"
                  className="w-full bg-coal/70 border border-dim/30 rounded-xl px-3 py-2 text-xs text-offwhite placeholder:text-dim/50 focus:outline-none focus:border-amber font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-offwhite/80 mb-1">
                    Statutory Severity
                  </label>
                  <select
                    value={broadcastSeverity}
                    onChange={(e) => setBroadcastSeverity(e.target.value as AnnouncementSeverity)}
                    className="w-full bg-coal/70 border border-dim/30 rounded-xl px-2.5 py-2 text-xs text-offwhite focus:outline-none focus:border-amber font-mono"
                  >
                    <option value="critical">Critical (Immediate Action)</option>
                    <option value="warning">Warning (Precautionary)</option>
                    <option value="info">Informational Bulletin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-offwhite/80 mb-1">
                    Statutory DGMS Clause
                  </label>
                  <input
                    type="text"
                    value={broadcastClause}
                    onChange={(e) => setBroadcastClause(e.target.value)}
                    placeholder="e.g. CMR 2017 Reg 106"
                    className="w-full bg-coal/70 border border-dim/30 rounded-xl px-3 py-2 text-xs text-offwhite placeholder:text-dim/50 focus:outline-none focus:border-amber font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-amber uppercase mb-1 font-semibold">
                  Directive Content & Mandatory Instructions
                </label>
                <textarea
                  required
                  rows={4}
                  value={broadcastContent}
                  onChange={(e) => setBroadcastContent(e.target.value)}
                  placeholder="Detail the mandatory compliance instructions for shift managers, pit overmen, and equipment operators..."
                  className="w-full bg-coal/70 border border-dim/30 rounded-xl p-3 text-xs text-offwhite placeholder:text-dim/50 focus:outline-none focus:border-amber font-sans"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setBroadcastModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-dim/30 text-dim hover:text-offwhite font-mono text-xs"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isBroadcasting}
                  className="px-5 py-2 rounded-xl bg-amber text-coal font-mono font-bold text-xs hover:bg-amber/90 transition-transform active:scale-95 shadow-amber-glow flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isBroadcasting ? 'Broadcasting...' : 'Broadcast Directive'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Authority Verification of Hazard Report */}
      {verifyModalReport && (
        <div className="fixed inset-0 z-50 bg-coal/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-lg w-full bg-graphite border border-teal/40 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-dim/20 pb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-teal" />
                <h3 className="text-base font-display font-bold text-offwhite">
                  Statutory Verification & Sign-Off
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setVerifyModalReport(null)}
                className="text-dim hover:text-offwhite font-mono text-sm"
              >
                ✕
              </button>
            </div>

            <div>
              <p className="text-xs text-dim mb-2 font-mono">
                Authorizing report <code className="text-amber">{verifyModalReport.id}</code> (
                {verifyModalReport.type.toUpperCase()})
              </p>
              {verifyModalReport.description && (
                <p className="text-xs bg-coal/60 p-2.5 rounded-lg border border-dim/20 text-offwhite/90 mb-4">
                  "{verifyModalReport.description}"
                </p>
              )}
            </div>

            <form onSubmit={handleVerifySubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono text-teal uppercase mb-1 font-semibold">
                  Mandatory Remediation Directive
                </label>
                <select
                  value={verifyDirective}
                  onChange={(e) => setVerifyDirective(e.target.value as any)}
                  className="w-full bg-coal/70 border border-dim/30 rounded-xl px-3 py-2 text-xs text-offwhite focus:outline-none focus:border-teal font-mono"
                >
                  <option value="remediate">Dispatch Engineering & Shoring Crew</option>
                  <option value="monitor">Continuous InSAR & Seismic Monitoring</option>
                  <option value="evacuate_bench">Bench Evacuation & HEMM Stoppage</option>
                  <option value="resolved">Verified Inspected & Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-teal uppercase mb-1 font-semibold">
                  Statutory Director Remarks
                </label>
                <textarea
                  rows={3}
                  value={verifyNotes}
                  onChange={(e) => setVerifyNotes(e.target.value)}
                  placeholder="Official DGMS endorsement notes (e.g. Remediation crew deployed as per CMR Reg 106)..."
                  className="w-full bg-coal/70 border border-dim/30 rounded-xl p-3 text-xs text-offwhite placeholder:text-dim/50 focus:outline-none focus:border-teal font-sans"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setVerifyModalReport(null)}
                  className="px-4 py-2 rounded-xl border border-dim/30 text-dim hover:text-offwhite font-mono text-xs"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal text-coal font-mono font-bold text-xs hover:bg-teal/90 transition-transform active:scale-95 shadow-md flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Sign & Endorse Report</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Full-screen Image View Modal */}
      {expandedImage && (
        <div className="fixed inset-0 z-50 bg-coal/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-3xl w-full bg-graphite border border-amber/30 rounded-2xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-3 border-b border-dim/20 bg-coal/80">
              <span className="text-xs font-mono text-amber">Full-Resolution Field Photo Evidence</span>
              <button
                type="button"
                onClick={() => setExpandedImage(null)}
                className="text-dim hover:text-offwhite font-mono text-sm px-2"
              >
                ✕ Close
              </button>
            </div>
            <img src={expandedImage} alt="Hazard Evidence" className="w-full max-h-[75vh] object-contain bg-black" />
          </div>
        </div>
      )}
    </div>
  );
}

// Sub-Component 1: Official Safety Directive Announcement Card
function AnnouncementCard({
  announcement,
  isAuthority,
  isEmployee,
  currentUserId,
  onAcknowledge,
}: {
  announcement: SafetyAnnouncement;
  isAuthority: boolean;
  isEmployee: boolean;
  currentUserId?: string;
  onAcknowledge: () => void;
}) {
  const isAcked = announcement.acknowledgments.some((a) => a.userId === currentUserId);

  const getSeverityStyle = (severity: AnnouncementSeverity) => {
    switch (severity) {
      case 'critical':
        return 'border-red-500/50 bg-red-500/10 text-red-400';
      case 'warning':
        return 'border-amber/40 bg-amber/10 text-amber';
      case 'info':
      default:
        return 'border-teal/40 bg-teal/10 text-teal';
    }
  };

  return (
    <div className="bg-graphite/50 border border-dim/20 hover:border-amber/30 rounded-2xl p-5 backdrop-blur-md transition-all space-y-3">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold border ${getSeverityStyle(announcement.severity)}`}>
            {announcement.severity.toUpperCase()} DIRECTIVE
          </span>

          {announcement.statutoryClause && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono text-offwhite/80 bg-coal border border-dim/30">
              {announcement.statutoryClause}
            </span>
          )}

          <span className="text-[11px] font-mono text-dim">
            {announcement.collieryName}
          </span>
        </div>

        <span className="text-[11px] font-mono text-dim flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {new Date(announcement.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
        </span>
      </div>

      {/* Subject */}
      <h3 className="text-base font-display font-bold text-white tracking-tight">
        {announcement.title}
      </h3>

      {/* Content */}
      <p className="text-xs text-offwhite/90 font-sans leading-relaxed bg-coal/50 p-3 rounded-xl border border-dim/20">
        {announcement.content}
      </p>

      {/* Footer Info & Acknowledgment Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-dim/15 text-[11px] font-mono">
        <div className="flex items-center gap-2 text-dim">
          <Shield className="w-3.5 h-3.5 text-amber" />
          <span>
            Issued by: <strong className="text-offwhite">{announcement.author.name}</strong> ({announcement.author.badge})
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-dim">
            {announcement.acknowledgments.length} Shift Acknowledgment{announcement.acknowledgments.length === 1 ? '' : 's'}
          </span>

          {/* Employee Acknowledge Button */}
          {isEmployee && (
            <button
              type="button"
              onClick={onAcknowledge}
              disabled={isAcked}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                isAcked
                  ? 'bg-teal/20 text-teal border border-teal/40 cursor-default'
                  : 'bg-amber text-coal hover:bg-amber/90 active:scale-95 shadow-amber-glow'
              }`}
            >
              {isAcked ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Acknowledged</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Acknowledge Order</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Sub-Component 2: Committed Hazard Report Card
function CommittedHazardCard({
  report,
  verification,
  isAuthority,
  onVerifyClick,
  onImageClick,
}: {
  report: HazardReport;
  verification?: ReportVerification;
  isAuthority: boolean;
  onVerifyClick: () => void;
  onImageClick: (url: string) => void;
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

  const getHazardBadge = (type: string) => {
    switch (type) {
      case 'crack':
        return '⚡ Highwall Crack / Shear';
      case 'rockfall':
        return '🪨 Rockfall / Overburden Slip';
      case 'leak':
        return '💧 Seepage & Fluid Ingress';
      case 'equipment_failure':
        return '🚜 HEMM Machine Failure';
      default:
        return '⚠️ General Mine Hazard';
    }
  };

  return (
    <div className="bg-graphite/40 border border-dim/20 hover:border-amber/30 rounded-2xl p-5 backdrop-blur-md transition-all space-y-3">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold bg-amber/15 text-amber border border-amber/30">
            FIELD HAZARD LOG
          </span>
          <span className="font-semibold text-sm text-offwhite font-display">
            {getHazardBadge(report.type)}
          </span>
          <span className="text-[11px] font-mono text-dim">
            ID: {report.id.substring(0, 16)}...
          </span>
        </div>

        <div className="flex items-center gap-2">
          {verification ? (
            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-teal/15 text-teal border border-teal/40">
              <CheckCircle2 className="w-3 h-3" />
              <span>DGMS ENDORSED ({verification.statutoryHash})</span>
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber/10 text-amber/80 border border-amber/20">
              PENDING STATUTORY REVIEW
            </span>
          )}
          <span className="text-[11px] font-mono text-dim">
            {new Date(report.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
          </span>
        </div>
      </div>

      {/* Description / Field Observation */}
      {report.description ? (
        <p className="text-xs text-offwhite/90 font-sans leading-relaxed bg-coal/50 p-3 rounded-xl border border-dim/20">
          {report.description}
        </p>
      ) : (
        <p className="text-xs text-dim italic">
          No written remarks attached. See optical photo evidence and voice note below.
        </p>
      )}

      {/* Media Attachments: Image thumbnail + Voice Memo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {imageUrl && (
          <div
            onClick={() => onImageClick(imageUrl)}
            className="relative h-32 rounded-xl overflow-hidden border border-dim/30 cursor-pointer group bg-coal"
          >
            <img src={imageUrl} alt="Optical Evidence" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            <div className="absolute inset-0 bg-coal/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-offwhite text-xs font-mono gap-1">
              <ImageIcon className="w-4 h-4 text-amber" />
              <span>Click to Expand</span>
            </div>
          </div>
        )}

        {report.audioBlob && (
          <div className="flex flex-col justify-center">
            <AudioVoiceMemoPlayer audioBlob={report.audioBlob} title="Inspector Voice Note" />
          </div>
        )}
      </div>

      {/* Telemetry & GPS Coordinates */}
      <div className="bg-coal/70 rounded-xl p-2.5 border border-dim/15 font-mono text-[11px] flex flex-wrap items-center justify-between gap-2">
        {report.coordinates ? (
          <div className="flex items-center gap-1.5 text-teal">
            <MapPin className="w-3.5 h-3.5" />
            <span>
              {report.coordinates.latitude.toFixed(5)}° N, {report.coordinates.longitude.toFixed(5)}° E
            </span>
            <span className="text-dim text-[10px]">(±{report.coordinates.accuracy}m fix)</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-amber">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{report.geoWarning || 'GPS fix unavailable in deep pit'}</span>
          </div>
        )}

        <div className="text-[10px] text-dim">
          Storage: IndexedDB [MineSafetyDB] • Outbox: {report.syncStatus.toUpperCase()}
        </div>
      </div>

      {/* Authority Verification Endorsement Box (if verified) */}
      {verification && (
        <div className="bg-teal/10 border border-teal/30 rounded-xl p-3 text-xs space-y-1">
          <div className="flex items-center justify-between font-mono text-[11px] text-teal font-bold">
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" />
              Statutory Endorsement: {verification.actionDirective.toUpperCase()}
            </span>
            <span>Ref: {verification.statutoryHash}</span>
          </div>
          <p className="text-[11px] text-offwhite/90">"{verification.authorityNotes}"</p>
          <div className="text-[10px] font-mono text-dim">
            Signed by {verification.verifiedBy} ({verification.verifierBadge}) on {new Date(verification.verifiedAt).toLocaleTimeString()}
          </div>
        </div>
      )}

      {/* Authority Sign-Off Action */}
      {isAuthority && !verification && (
        <div className="flex items-center justify-end pt-1">
          <button
            type="button"
            onClick={onVerifyClick}
            className="px-4 py-1.5 rounded-lg bg-teal text-coal font-mono font-bold text-xs hover:bg-teal/90 transition-transform active:scale-95 shadow-md flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Verify & Endorse Report</span>
          </button>
        </div>
      )}
    </div>
  );
}

