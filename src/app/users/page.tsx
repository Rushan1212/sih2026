'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Shield,
  HardHat,
  UserPlus,
  Trash2,
  Copy,
  Check,
  Search,
  Users,
  Building2,
  BadgeCheck,
  Mail,
  Lock,
  Phone,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Filter,
  X,
  Radio,
  Database,
  Terminal,
  Clock,
  RefreshCw,
  CheckCircle2,
  Key,
  Laptop,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole, CreateUserParams, StoredUserAccount } from '../../types/auth';
import { soundManager } from '../../utils/sound';
import { SUPABASE_SETUP_SQL } from '../../data/supabaseSql';
import {
  getSupabaseUrl,
  getSupabaseAnonKey,
  setCustomSupabaseCredentials,
  clearCustomSupabaseCredentials,
  isSupabaseConfigured,
} from '../../services/supabase';

interface UsersPageProps {
  onNavigate?: (route: string) => void;
}

const COLLIERIES = [
  { id: 'bccl_moonidih', name: 'BCCL Moonidih Deep Seam & Lodna (Jharia Basin)' },
  { id: 'ecl_kenda', name: 'ECL Kenda Area & Raniganj Historic Deep Pit' },
  { id: 'secl_gevra', name: 'SECL Gevra & Dipka Mega Opencast Super Pit' },
  { id: 'mcl_talcher', name: 'MCL Bhubaneswari & Ananta Opencast (Talcher)' },
  { id: 'dgms_central_hq', name: 'DGMS Central Statutory Directorate (Dhanbad HQ)' },
];

export default function UsersPage({ onNavigate }: UsersPageProps) {
  const {
    user,
    isAuthority,
    isAuthenticated,
    registeredUsers,
    createUser,
    deleteUser,
    isLoading,
    isSupabaseLive,
    loginRecords,
    fetchLoginRecords,
    refreshUsers,
  } = useAuth();

  // Navigation & Sub-Tabs
  const [activeMainTab, setActiveMainTab] = useState<'directory' | 'logins' | 'supabase_sql'>('directory');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'authority' | 'employee'>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isRefreshingLogs, setIsRefreshingLogs] = useState(false);

  // Supabase Runtime Config State
  const [configUrl, setConfigUrl] = useState(getSupabaseUrl());
  const [configAnonKey, setConfigAnonKey] = useState(getSupabaseAnonKey());
  const [configSaveSuccess, setConfigSaveSuccess] = useState(false);

  // Form State for creating new user
  const [newRole, setNewRole] = useState<UserRole>('employee');
  const [newFullName, setNewFullName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('colliery123');
  const [newDesignation, setNewDesignation] = useState('');
  const [newCollieryId, setNewCollieryId] = useState(COLLIERIES[0].id);
  const [newBadgeNumber, setNewBadgeNumber] = useState('');
  const [newPhone, setNewPhone] = useState('');

  // Auto fetch login records when switching to logins tab
  useEffect(() => {
    if (activeMainTab === 'logins') {
      fetchLoginRecords();
    }
  }, [activeMainTab, fetchLoginRecords]);

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

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCopyCredentials = (acc: StoredUserAccount) => {
    soundManager.playClick();
    const text = `CoalGuard AI Credentials:\nEmail: ${acc.email}\nPassword: ${acc.password}\nRole: ${acc.role.toUpperCase()}\nBadge: ${acc.metadata.badge_number}`;
    navigator.clipboard.writeText(text);
    setCopiedId(acc.id);
    showToast(`Copied credentials for ${acc.metadata.full_name}`);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleCopySql = () => {
    soundManager.playClick();
    navigator.clipboard.writeText(SUPABASE_SETUP_SQL);
    setCopiedSql(true);
    showToast('Copied complete Supabase SQL script to clipboard!');
    setTimeout(() => setCopiedSql(false), 3000);
  };

  const handleRefreshLogs = async () => {
    soundManager.playClick();
    setIsRefreshingLogs(true);
    await fetchLoginRecords();
    await refreshUsers();
    setIsRefreshingLogs(false);
    showToast('Refreshed audit logs and user registry from Supabase');
  };

  const handleSaveSupabaseConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playClick();
    setCustomSupabaseCredentials(configUrl, configAnonKey);
    setConfigSaveSuccess(true);
    await refreshUsers();
    await fetchLoginRecords();
    showToast('Supabase credentials saved. Live sync active!');
    setTimeout(() => {
      setConfigSaveSuccess(false);
      setIsConfigModalOpen(false);
    }, 1200);
  };

  const handleResetSupabaseConfig = async () => {
    soundManager.playClick();
    clearCustomSupabaseCredentials();
    setConfigUrl('');
    setConfigAnonKey('');
    await refreshUsers();
    showToast('Reset custom Supabase credentials to environment defaults');
  };

  const generateBadge = (role: UserRole) => {
    soundManager.playClick();
    const prefix = role === 'authority' ? 'DGMS-DIR' : 'EMP-BCCL';
    const num = Math.floor(1000 + Math.random() * 9000);
    setNewBadgeNumber(`${prefix}-${num}`);
  };

  const handleOpenCreateModal = () => {
    soundManager.playClick();
    setFormError(null);
    setNewRole('employee');
    setNewFullName('');
    setNewEmail('');
    setNewPassword('colliery123');
    setNewDesignation('');
    setNewCollieryId(COLLIERIES[0].id);
    setNewBadgeNumber(`EMP-BCCL-${Math.floor(1000 + Math.random() * 9000)}`);
    setNewPhone('');
    setIsCreateModalOpen(true);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!newFullName.trim()) {
      setFormError('Full name is required.');
      return;
    }
    if (!newEmail.trim()) {
      setFormError('Email address is required.');
      return;
    }

    const collieryObj = COLLIERIES.find((c) => c.id === newCollieryId);
    const collieryName = collieryObj ? collieryObj.name : 'DGMS Colliery';

    try {
      const payload: CreateUserParams = {
        fullName: newFullName.trim(),
        email: newEmail.trim().toLowerCase(),
        password: newPassword.trim() || 'colliery123',
        role: newRole,
        designation:
          newDesignation.trim() ||
          (newRole === 'authority' ? 'DGMS Statutory Safety Officer' : 'Senior Shift Overman'),
        collieryId: newCollieryId,
        collieryName,
        badgeNumber:
          newBadgeNumber.trim() ||
          `${newRole === 'authority' ? 'DGMS' : 'EMP'}-${Math.floor(1000 + Math.random() * 9000)}`,
        phone: newPhone.trim() || undefined,
      };

      await createUser(payload);
      setIsCreateModalOpen(false);
      showToast(`Provisioned new ${newRole.toUpperCase()} account for ${newFullName} (Synced with Supabase)`);
    } catch (err: any) {
      setFormError(err.message || 'Failed to provision account.');
    }
  };

  const handleDeleteUser = async (targetUser: StoredUserAccount) => {
    soundManager.playClick();
    if (user && targetUser.id === user.id) {
      alert('Cannot delete your own active administrative account.');
      return;
    }

    if (
      window.confirm(
        `Are you sure you want to deactivate and remove ${targetUser.metadata.full_name} (${targetUser.email}) from the colliery registry?`
      )
    ) {
      try {
        await deleteUser(targetUser.id);
        showToast(`Deactivated account for ${targetUser.metadata.full_name}`);
      } catch (err: any) {
        alert(err.message || 'Could not delete user.');
      }
    }
  };

  // Filtered users list
  const filteredUsers = useMemo(() => {
    return registeredUsers.filter((u) => {
      const matchesRole = roleFilter === 'all' || u.role === roleFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        u.metadata.full_name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.metadata.designation.toLowerCase().includes(q) ||
        u.metadata.badge_number.toLowerCase().includes(q) ||
        u.metadata.colliery_name.toLowerCase().includes(q);

      return matchesRole && matchesSearch;
    });
  }, [registeredUsers, roleFilter, searchQuery]);

  const authoritiesCount = registeredUsers.filter((u) => u.role === 'authority').length;
  const employeesCount = registeredUsers.filter((u) => u.role === 'employee').length;

  return (
    <div className="min-h-screen bg-[#0C0C14] text-[#E0E0EC] font-sans selection:bg-amber selection:text-coal relative overflow-x-clip flex flex-col justify-between">
      {/* Antigravity Ambient Lighting */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-amber/[0.035] blur-[180px] pointer-events-none rounded-full z-0" />
      <div className="fixed bottom-0 right-0 w-[700px] h-[500px] bg-[#2D3561]/25 blur-[200px] pointer-events-none rounded-full z-0" />

      {/* Top Header */}
      <header className="relative z-10 px-4 sm:px-8 py-3.5 flex items-center justify-between border-b border-amber/15 bg-coal/85 backdrop-blur-md">
        <div className="flex items-center gap-3">
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
            <span className="font-display font-extrabold text-lg text-white">
              Khanij<span className="text-amber">AI</span>
            </span>
          </button>
          <span className="text-white/20">|</span>
          <span className="text-xs font-mono text-dim flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-amber" />
            Statutory Personnel & Supabase Governance
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Supabase Status Pill */}
          <button
            type="button"
            onClick={() => setIsConfigModalOpen(true)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono border transition-all ${
              isSupabaseConfigured()
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25'
                : 'bg-amber/15 border-amber/30 text-amber hover:bg-amber/25'
            }`}
            title="Click to view or edit Supabase database connection"
          >
            <span className={`w-2 h-2 rounded-full ${isSupabaseConfigured() ? 'bg-emerald-400 animate-pulse' : 'bg-amber'}`} />
            <span className="font-bold">{isSupabaseConfigured() ? 'Supabase Live' : 'Supabase Cache'}</span>
            <Database className="w-3 h-3 ml-0.5 opacity-80" />
          </button>

          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              navigateTo('/announcements');
            }}
            className="text-xs font-mono text-dim hover:text-amber transition-colors hidden sm:inline"
          >
            Directives Feed →
          </button>
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              navigateTo('/');
            }}
            className="text-xs font-mono px-3 py-1.5 rounded-lg border border-white/[0.1] hover:border-amber/40 text-dim hover:text-offwhite transition-colors"
          >
            ← Colliery Overview
          </button>
        </div>
      </header>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#161626] border border-amber/40 text-offwhite px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 font-mono text-xs animate-in slide-in-from-top-2">
          <Sparkles className="w-4 h-4 text-amber flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="relative z-10 max-w-7xl mx-auto w-full px-4 py-8 flex-1">
        {/* Security Guard Check */}
        {!isAuthenticated ? (
          <div className="max-w-md mx-auto my-12 p-8 rounded-3xl bg-[#12121E]/90 border border-amber/30 text-center space-y-5 shadow-2xl backdrop-blur-xl">
            <div className="w-14 h-14 rounded-2xl bg-amber/15 border border-amber/30 text-amber flex items-center justify-center mx-auto shadow-inner">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-display">Directorate Access Restricted</h2>
              <p className="text-xs text-dim font-mono mt-1.5 leading-relaxed">
                Personnel provisioning is protected under CMR 2017 Regulation 14. You must authenticate with an authorized DGMS Authority credential to access this registry.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigateTo('/login')}
              className="w-full py-3 rounded-xl bg-amber hover:bg-amber/90 text-coal font-mono font-bold text-xs uppercase tracking-wider shadow-amber-glow transition-all"
            >
              Sign In with Authority Account →
            </button>
          </div>
        ) : !isAuthority ? (
          <div className="max-w-lg mx-auto my-12 p-8 rounded-3xl bg-[#1A1218]/90 border border-red-500/30 text-center space-y-5 shadow-2xl backdrop-blur-xl">
            <div className="w-14 h-14 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-400 flex items-center justify-center mx-auto shadow-inner">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/20 text-red-300 font-bold uppercase tracking-wider">
                Access Denied • Insufficient Privilege
              </span>
              <h2 className="text-xl font-bold text-white font-display mt-2">
                Authority Permissions Required
              </h2>
              <p className="text-xs text-dim font-mono mt-1.5 leading-relaxed">
                Your current session ({user?.user_metadata.full_name} • {user?.user_metadata.designation}) is authenticated as a Field Employee. Personnel provisioning is restricted to Directorate Authorities only.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigateTo('/field-capture')}
                className="flex-1 py-2.5 rounded-xl bg-teal/20 hover:bg-teal/30 border border-teal/40 text-teal font-mono text-xs font-bold transition-all"
              >
                Go to Field Capture →
              </button>
              <button
                type="button"
                onClick={() => navigateTo('/login')}
                className="flex-1 py-2.5 rounded-xl bg-amber text-coal font-mono text-xs font-bold hover:bg-amber/90 transition-all shadow-amber-glow"
              >
                Switch to Authority Account
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Top Stat Ribbon */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              <div className="p-4 rounded-2xl bg-[#12121E]/80 border border-amber/20 backdrop-blur-xl shadow-lg">
                <div className="flex items-center justify-between text-dim text-xs font-mono">
                  <span>Registered Personnel</span>
                  <Users className="w-4 h-4 text-amber" />
                </div>
                <div className="text-2xl font-bold font-mono text-white mt-2">
                  {registeredUsers.length}
                </div>
                <div className="text-[10px] text-dim font-mono mt-0.5">
                  Synced with Supabase <code className="text-amber">public.users</code>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#12121E]/80 border border-amber/20 backdrop-blur-xl shadow-lg">
                <div className="flex items-center justify-between text-dim text-xs font-mono">
                  <span>DGMS Authorities</span>
                  <Shield className="w-4 h-4 text-amber" />
                </div>
                <div className="text-2xl font-bold font-mono text-amber mt-2">
                  {authoritiesCount}
                </div>
                <div className="text-[10px] text-dim font-mono mt-0.5">
                  Statutory Directorate Tier
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#12121E]/80 border border-teal/20 backdrop-blur-xl shadow-lg">
                <div className="flex items-center justify-between text-dim text-xs font-mono">
                  <span>Field Inspectors</span>
                  <HardHat className="w-4 h-4 text-teal" />
                </div>
                <div className="text-2xl font-bold font-mono text-teal mt-2">
                  {employeesCount}
                </div>
                <div className="text-[10px] text-dim font-mono mt-0.5">
                  {employeesCount === 0
                    ? 'No mock accounts • Ready for creation'
                    : 'Active pit inspectors'}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#12121E]/80 border border-emerald-500/20 backdrop-blur-xl shadow-lg flex flex-col justify-between">
                <div className="flex items-center justify-between text-dim text-xs font-mono">
                  <span>Login Audit Logs</span>
                  <Clock className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-bold font-mono text-emerald-400 mt-2">
                  {loginRecords.length} Events
                </div>
                <div className="text-[10px] text-dim font-mono mt-0.5">
                  Tracked in Supabase <code className="text-emerald-400">user_logins</code>
                </div>
              </div>
            </div>

            {/* Main Tabs Navigation */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setActiveMainTab('directory');
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                    activeMainTab === 'directory'
                      ? 'bg-amber text-coal shadow-amber-glow'
                      : 'text-dim hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Personnel Directory ({registeredUsers.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setActiveMainTab('logins');
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                    activeMainTab === 'logins'
                      ? 'bg-amber text-coal shadow-amber-glow'
                      : 'text-dim hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Live Supabase Login Records ({loginRecords.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setActiveMainTab('supabase_sql');
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                    activeMainTab === 'supabase_sql'
                      ? 'bg-amber text-coal shadow-amber-glow'
                      : 'text-dim hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Supabase SQL Queries (Editor)</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleRefreshLogs}
                  disabled={isRefreshingLogs}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/[0.1] hover:border-amber/40 text-xs font-mono text-dim hover:text-offwhite transition-all disabled:opacity-50"
                  title="Synchronize registry & login audit trail with Supabase"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-amber ${isRefreshingLogs ? 'animate-spin' : ''}`} />
                  <span>Sync Supabase</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsConfigModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/[0.1] hover:border-teal/40 text-xs font-mono text-teal hover:bg-teal/10 transition-all"
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>DB Config</span>
                </button>
              </div>
            </div>

            {/* TAB 1: PERSONNEL DIRECTORY */}
            {activeMainTab === 'directory' && (
              <div className="space-y-6">
                {/* Action & Filter Bar */}
                <div className="p-4 rounded-2xl bg-[#12121E]/80 border border-amber/20 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex flex-1 w-full md:w-auto items-center gap-3">
                    {/* Search */}
                    <div className="relative flex-1 max-w-md">
                      <Search className="w-4 h-4 text-dim absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by name, email, badge #, or colliery..."
                        className="w-full bg-coal/70 border border-dim/30 rounded-xl pl-9 pr-4 py-2 text-xs font-mono text-offwhite placeholder:text-dim/50 focus:outline-none focus:border-amber"
                      />
                    </div>

                    {/* Filter Pills */}
                    <div className="flex items-center gap-1.5 p-1 bg-coal/60 rounded-xl border border-dim/20">
                      <button
                        type="button"
                        onClick={() => setRoleFilter('all')}
                        className={`px-3 py-1 text-xs font-mono rounded-lg transition-all ${
                          roleFilter === 'all'
                            ? 'bg-amber text-coal font-bold shadow-amber-glow'
                            : 'text-dim hover:text-offwhite'
                        }`}
                      >
                        All ({registeredUsers.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setRoleFilter('authority')}
                        className={`px-2.5 py-1 text-xs font-mono rounded-lg transition-all flex items-center gap-1 ${
                          roleFilter === 'authority'
                            ? 'bg-amber/20 border border-amber/40 text-amber font-bold'
                            : 'text-dim hover:text-offwhite'
                        }`}
                      >
                        <Shield className="w-3 h-3" />
                        <span>Auth ({authoritiesCount})</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setRoleFilter('employee')}
                        className={`px-2.5 py-1 text-xs font-mono rounded-lg transition-all flex items-center gap-1 ${
                          roleFilter === 'employee'
                            ? 'bg-teal/20 border border-teal/40 text-teal font-bold'
                            : 'text-dim hover:text-offwhite'
                        }`}
                      >
                        <HardHat className="w-3 h-3" />
                        <span>Emp ({employeesCount})</span>
                      </button>
                    </div>
                  </div>

                  {/* Primary CTA: Create User */}
                  <button
                    type="button"
                    onClick={handleOpenCreateModal}
                    className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-amber text-coal font-mono font-bold text-xs uppercase tracking-wider hover:bg-amber/90 transition-all shadow-amber-glow flex items-center justify-center gap-2 active:scale-95"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Provision New User</span>
                  </button>
                </div>

                {/* Users Directory List */}
                <div className="space-y-3">
                  {filteredUsers.length === 0 ? (
                    <div className="p-12 text-center rounded-2xl bg-[#12121E]/60 border border-white/[0.06] space-y-3">
                      <Users className="w-8 h-8 text-dim mx-auto" />
                      <div className="text-sm font-bold text-offwhite font-mono">No matching personnel found</div>
                      <p className="text-xs text-dim font-mono max-w-sm mx-auto">
                        No user account matches &ldquo;{searchQuery}&rdquo;. Click &ldquo;Provision New User&rdquo; above to register an authorized colliery inspector.
                      </p>
                    </div>
                  ) : (
                    filteredUsers.map((acc) => {
                      const isSelf = user && acc.id === user.id;

                      return (
                        <div
                          key={acc.id}
                          className="p-4 sm:p-5 rounded-2xl bg-[#12121E]/90 border border-white/[0.08] hover:border-amber/30 transition-all backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-md group"
                        >
                          <div className="flex items-start gap-3.5 min-w-0">
                            <div
                              className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 border mt-0.5 ${
                                acc.role === 'authority'
                                  ? 'bg-amber/15 border-amber/40 text-amber shadow-[0_0_15px_rgba(245,166,35,0.15)]'
                                  : 'bg-teal/15 border-teal/40 text-teal'
                              }`}
                            >
                              {acc.role === 'authority' ? (
                                <Shield className="w-5 h-5" />
                              ) : (
                                <HardHat className="w-5 h-5" />
                              )}
                            </div>

                            <div className="min-w-0 space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-display font-bold text-sm text-white">
                                  {acc.metadata.full_name}
                                </span>
                                <span
                                  className={`text-[9px] font-mono px-2 py-0.2 rounded-full uppercase tracking-wider font-bold border ${
                                    acc.role === 'authority'
                                      ? 'bg-amber/20 border-amber/40 text-amber'
                                      : 'bg-teal/20 border-teal/40 text-teal'
                                  }`}
                                >
                                  {acc.role}
                                </span>
                                {isRoot && (
                                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber text-coal font-bold">
                                    ROOT DIRECTOR
                                  </span>
                                )}
                                {isSelf && (
                                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-offwhite font-bold">
                                    YOU
                                  </span>
                                )}
                              </div>

                              <div className="text-xs font-mono text-dim">
                                {acc.metadata.designation}
                              </div>

                              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-mono text-dim/80 pt-0.5">
                                <span className="flex items-center gap-1">
                                  <Mail className="w-3 h-3 text-amber" />
                                  <span className="text-offwhite">{acc.email}</span>
                                </span>
                                <span className="flex items-center gap-1">
                                  <BadgeCheck className="w-3 h-3 text-teal" />
                                  <span className="text-amber">{acc.metadata.badge_number}</span>
                                </span>
                                <span className="flex items-center gap-1">
                                  <Building2 className="w-3 h-3 text-dim" />
                                  <span className="truncate max-w-[220px]">{acc.metadata.colliery_name}</span>
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 self-end md:self-center">
                            <button
                              type="button"
                              onClick={() => handleCopyCredentials(acc)}
                              className="px-3 py-1.5 rounded-xl border border-white/[0.1] hover:border-amber/40 hover:bg-white/[0.04] text-xs font-mono text-dim hover:text-offwhite flex items-center gap-1.5 transition-all"
                              title="Copy Login Credentials"
                            >
                              {copiedId === acc.id ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-teal" />
                                  <span className="text-teal">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Copy Creds</span>
                                </>
                              )}
                            </button>

                            {!isSelf && (
                              <button
                                type="button"
                                onClick={() => handleDeleteUser(acc)}
                                className="p-2 rounded-xl border border-red-500/20 hover:border-red-500/50 hover:bg-red-500/10 text-dim hover:text-red-400 transition-all"
                                title="Deactivate & remove inspector account"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: LIVE SUPABASE LOGIN RECORDS */}
            {activeMainTab === 'logins' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-[#12121E]/80 border border-emerald-500/20 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-bold text-white font-display flex items-center gap-2">
                      <Clock className="w-4 h-4 text-emerald-400" />
                      <span>Statutory Access Audit Trail (<code className="text-emerald-400 font-mono">public.user_logins</code>)</span>
                    </div>
                    <p className="text-xs text-dim font-mono mt-0.5">
                      Every inspector & authority login is stored in Supabase with timestamp, role verification, and device platform.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleRefreshLogs}
                    disabled={isRefreshingLogs}
                    className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold flex items-center gap-2 transition-all disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingLogs ? 'animate-spin' : ''}`} />
                    <span>Refresh Audit Logs</span>
                  </button>
                </div>

                {loginRecords.length === 0 ? (
                  <div className="p-12 text-center rounded-2xl bg-[#12121E]/60 border border-white/[0.06] space-y-3">
                    <Clock className="w-8 h-8 text-dim mx-auto" />
                    <div className="text-sm font-bold text-offwhite font-mono">No Login Records Found Yet</div>
                    <p className="text-xs text-dim font-mono max-w-md mx-auto">
                      Login events will appear here in real-time as users sign in. Sign in or switch accounts on the login page to generate statutory audit logs.
                    </p>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-white/[0.08] bg-[#12121E]/80 overflow-hidden backdrop-blur-xl shadow-xl">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs font-mono">
                        <thead className="bg-coal/90 border-b border-white/[0.08] text-[11px] text-dim uppercase tracking-wider">
                          <tr>
                            <th className="py-3 px-4">Timestamp</th>
                            <th className="py-3 px-4">User & Role</th>
                            <th className="py-3 px-4">Badge # / Colliery</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4">Client Platform</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.04]">
                          {loginRecords.map((log, idx) => {
                            const isSuccess = log.status === 'success';
                            const dateObj = new Date(log.login_timestamp);
                            const formattedTime = !isNaN(dateObj.getTime())
                              ? dateObj.toLocaleString('en-IN', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  second: '2-digit',
                                })
                              : log.login_timestamp;

                            return (
                              <tr key={log.id || `log-${idx}`} className="hover:bg-white/[0.02] transition-colors">
                                <td className="py-3 px-4 text-dim whitespace-nowrap">
                                  <div className="text-offwhite font-semibold">{formattedTime}</div>
                                  <div className="text-[10px] text-dim/70">
                                    {log.login_timestamp.split('T')[0]}
                                  </div>
                                </td>

                                <td className="py-3 px-4">
                                  <div className="font-bold text-white flex items-center gap-1.5">
                                    <span>{log.full_name}</span>
                                    <span
                                      className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                                        log.role === 'authority'
                                          ? 'bg-amber/20 text-amber border border-amber/30'
                                          : 'bg-teal/20 text-teal border border-teal/30'
                                      }`}
                                    >
                                      {log.role}
                                    </span>
                                  </div>
                                  <div className="text-dim text-[11px]">{log.email}</div>
                                </td>

                                <td className="py-3 px-4">
                                  <div className="text-amber font-semibold">{log.badge_number || 'DGMS-UNASSIGNED'}</div>
                                  <div className="text-dim/80 text-[11px] truncate max-w-[200px]">
                                    {log.colliery_name || 'DGMS Central Directorate'}
                                  </div>
                                </td>

                                <td className="py-3 px-4 whitespace-nowrap">
                                  {isSuccess ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                      <CheckCircle2 className="w-3 h-3" />
                                      <span>SUCCESS</span>
                                    </span>
                                  ) : (
                                    <div>
                                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                                        <AlertTriangle className="w-3 h-3" />
                                        <span>FAILED</span>
                                      </span>
                                      {log.failure_reason && (
                                        <div className="text-[10px] text-red-300 mt-0.5">{log.failure_reason}</div>
                                      )}
                                    </div>
                                  )}
                                </td>

                                <td className="py-3 px-4 text-dim text-[11px] max-w-[220px] truncate">
                                  <div className="flex items-center gap-1 text-offwhite/80">
                                    <Laptop className="w-3 h-3 text-amber flex-shrink-0" />
                                    <span className="truncate">{log.user_agent ? log.user_agent.split(' ')[0] : 'Web Portal'}</span>
                                  </div>
                                  <div className="text-[10px] text-dim/60 truncate">IP: {log.ip_address || 'client-side'}</div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: SUPABASE SQL QUERIES & EDITOR GUIDE */}
            {activeMainTab === 'supabase_sql' && (
              <div className="space-y-5">
                <div className="p-5 rounded-2xl bg-[#12121E]/90 border border-amber/30 backdrop-blur-xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-white font-display text-base font-bold">
                      <Terminal className="w-4 h-4 text-amber" />
                      <span>Ready-to-Paste Supabase SQL Script</span>
                    </div>
                    <p className="text-xs font-mono text-dim max-w-2xl leading-relaxed">
                      Copy the complete query script below, open your Supabase project dashboard, navigate to <strong>SQL Editor</strong> &rarr; <strong>New Query</strong>, paste the script, and click <strong>Run</strong>.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopySql}
                    className="px-5 py-2.5 rounded-xl bg-amber text-coal font-mono font-bold text-xs uppercase tracking-wider hover:bg-amber/90 transition-all shadow-amber-glow flex items-center gap-2 active:scale-95 flex-shrink-0"
                  >
                    {copiedSql ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>COPIED TO CLIPBOARD!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>COPY ALL SQL QUERIES</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Instructions Steps */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-xl bg-coal/70 border border-white/[0.08] font-mono text-xs space-y-1">
                    <div className="text-amber font-bold">1. Open Supabase SQL Editor</div>
                    <p className="text-dim text-[11px] leading-snug">
                      Go to your project at <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" className="text-teal underline">supabase.com/dashboard</a> and click the &ldquo;SQL Editor&rdquo; icon in the left sidebar.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-coal/70 border border-white/[0.08] font-mono text-xs space-y-1">
                    <div className="text-amber font-bold">2. Paste & Run Script</div>
                    <p className="text-dim text-[11px] leading-snug">
                      Paste the queries below into the editor window and press &ldquo;Run&rdquo;. It creates <code className="text-offwhite">users</code>, <code className="text-offwhite">user_logins</code>, and RLS policies.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-coal/70 border border-white/[0.08] font-mono text-xs space-y-1">
                    <div className="text-amber font-bold">3. Connect App</div>
                    <p className="text-dim text-[11px] leading-snug">
                      Add your Supabase URL & Anon Key to your <code className="text-offwhite">.env</code> file or paste them in the &ldquo;DB Config&rdquo; modal above!
                    </p>
                  </div>
                </div>

                {/* SQL Code Block */}
                <div className="rounded-2xl border border-white/[0.1] bg-[#0A0A12] overflow-hidden shadow-2xl">
                  <div className="px-4 py-2.5 bg-coal/90 border-b border-white/[0.08] flex items-center justify-between text-xs font-mono text-dim">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber/60" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
                      <span className="ml-2 font-bold text-offwhite">supabase_schema.sql</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopySql}
                      className="text-amber hover:underline flex items-center gap-1 text-[11px]"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedSql ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="p-4 text-xs font-mono text-emerald-300/90 overflow-x-auto max-h-[480px] leading-relaxed selection:bg-amber selection:text-coal">
                    {SUPABASE_SETUP_SQL}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Supabase Connection Config Modal */}
      {isConfigModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-lg w-full rounded-3xl bg-[#12121E] border border-amber/30 p-6 shadow-2xl space-y-5 text-left font-mono">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2.5">
                <Database className="w-5 h-5 text-amber" />
                <h3 className="font-display font-bold text-base text-white">
                  Supabase Live Connection
                </h3>
              </div>
              <button
                onClick={() => setIsConfigModalOpen(false)}
                className="p-1 rounded-lg text-dim hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-dim leading-relaxed">
              Connect the web application directly to your live Supabase project. Users and login records will automatically synchronize in real-time.
            </p>

            <form onSubmit={handleSaveSupabaseConfig} className="space-y-4">
              <div>
                <label className="block text-[11px] text-offwhite/80 mb-1 font-semibold">
                  Supabase Project URL (<code className="text-amber">VITE_SUPABASE_URL</code>)
                </label>
                <input
                  type="url"
                  value={configUrl}
                  onChange={(e) => setConfigUrl(e.target.value)}
                  placeholder="https://your-project-id.supabase.co"
                  className="w-full bg-coal border border-dim/30 rounded-xl px-3.5 py-2.5 text-xs text-offwhite font-mono focus:outline-none focus:border-amber"
                />
              </div>

              <div>
                <label className="block text-[11px] text-offwhite/80 mb-1 font-semibold">
                  Supabase Anon Key (<code className="text-amber">VITE_SUPABASE_ANON_KEY</code>)
                </label>
                <input
                  type="password"
                  value={configAnonKey}
                  onChange={(e) => setConfigAnonKey(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  className="w-full bg-coal border border-dim/30 rounded-xl px-3.5 py-2.5 text-xs text-offwhite font-mono focus:outline-none focus:border-amber"
                />
              </div>

              {configSaveSuccess && (
                <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Connection details saved! Re-testing connection...</span>
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleResetSupabaseConfig}
                  className="px-4 py-2.5 rounded-xl border border-white/[0.1] hover:bg-white/[0.04] text-dim hover:text-offwhite text-xs transition-colors"
                >
                  Clear Overrides
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber hover:bg-amber/90 text-coal font-bold text-xs uppercase tracking-wider shadow-amber-glow transition-all active:scale-95"
                >
                  Save & Connect →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Provision New User Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-xl w-full rounded-3xl bg-[#12121E] border border-amber/30 p-6 sm:p-8 shadow-2xl space-y-5 text-left my-8">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber/15 border border-amber/30 text-amber flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-white">
                    Provision Statutory Personnel
                  </h3>
                  <p className="text-xs font-mono text-dim">
                    Assigns colliery credentials and commits record to Supabase
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 rounded-lg text-dim hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-mono flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              {/* Role Selection */}
              <div>
                <label className="block text-[11px] font-mono text-offwhite/80 mb-1.5">
                  Statutory Persona Role *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setNewRole('employee');
                      generateBadge('employee');
                    }}
                    className={`p-3 rounded-xl border text-left font-mono transition-all flex items-center gap-2.5 ${
                      newRole === 'employee'
                        ? 'bg-teal/20 border-teal text-teal font-bold shadow-[0_0_15px_rgba(45,212,191,0.15)]'
                        : 'bg-coal/60 border-dim/20 text-dim hover:text-offwhite'
                    }`}
                  >
                    <HardHat className="w-4 h-4" />
                    <div>
                      <div className="text-xs">Field Employee</div>
                      <div className="text-[9px] text-dim">Pit Inspector / Overman</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setNewRole('authority');
                      generateBadge('authority');
                    }}
                    className={`p-3 rounded-xl border text-left font-mono transition-all flex items-center gap-2.5 ${
                      newRole === 'authority'
                        ? 'bg-amber/20 border-amber text-amber font-bold shadow-[0_0_15px_rgba(245,166,35,0.15)]'
                        : 'bg-coal/60 border-dim/20 text-dim hover:text-offwhite'
                    }`}
                  >
                    <Shield className="w-4 h-4" />
                    <div>
                      <div className="text-xs">DGMS Authority</div>
                      <div className="text-[9px] text-dim">Statutory Safety Officer</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-[11px] font-mono text-offwhite/80 mb-1 flex items-center gap-1.5">
                  <span>Inspector / Officer Full Name *</span>
                </label>
                <input
                  type="text"
                  required
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  placeholder="e.g. Ramesh Chandra Mahato"
                  className="w-full bg-coal border border-dim/30 rounded-xl px-3.5 py-2.5 text-xs text-offwhite font-mono focus:outline-none focus:border-amber"
                />
              </div>

              {/* Email & Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-offwhite/80 mb-1 flex items-center gap-1.5">
                    <Mail className="w-3 h-3 text-amber" />
                    <span>Operational Email *</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="e.g. ramesh.mahato@bccl.co.in"
                    className="w-full bg-coal border border-dim/30 rounded-xl px-3.5 py-2.5 text-xs text-offwhite font-mono focus:outline-none focus:border-amber"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-offwhite/80 mb-1 flex items-center gap-1.5">
                    <Lock className="w-3 h-3 text-amber" />
                    <span>Access Key / Password</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="colliery123"
                    className="w-full bg-coal border border-dim/30 rounded-xl px-3.5 py-2.5 text-xs text-offwhite font-mono focus:outline-none focus:border-amber"
                  />
                </div>
              </div>

              {/* Designation & Colliery */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-offwhite/80 mb-1">
                    Official Designation
                  </label>
                  <input
                    type="text"
                    value={newDesignation}
                    onChange={(e) => setNewDesignation(e.target.value)}
                    placeholder={
                      newRole === 'authority'
                        ? 'DGMS Deputy Director'
                        : 'Senior Shift Overman & Bench Inspector'
                    }
                    className="w-full bg-coal border border-dim/30 rounded-xl px-3.5 py-2.5 text-xs text-offwhite font-mono focus:outline-none focus:border-amber"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-offwhite/80 mb-1">
                    Assigned Colliery Basin
                  </label>
                  <select
                    value={newCollieryId}
                    onChange={(e) => setNewCollieryId(e.target.value)}
                    className="w-full bg-coal border border-dim/30 rounded-xl px-3 py-2.5 text-xs text-offwhite font-mono focus:outline-none focus:border-amber"
                  >
                    {COLLIERIES.map((c) => (
                      <option key={c.id} value={c.id} className="bg-coal text-offwhite">
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Badge Number & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-mono text-offwhite/80 flex items-center gap-1.5">
                      <BadgeCheck className="w-3 h-3 text-amber" />
                      <span>Statutory Badge #</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => generateBadge(newRole)}
                      className="text-[10px] text-amber hover:underline font-mono"
                    >
                      Regenerate
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={newBadgeNumber}
                    onChange={(e) => setNewBadgeNumber(e.target.value)}
                    className="w-full bg-coal border border-dim/30 rounded-xl px-3.5 py-2.5 text-xs text-offwhite font-mono focus:outline-none focus:border-amber"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-offwhite/80 mb-1 flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-dim" />
                    <span>Emergency Contact Phone</span>
                  </label>
                  <input
                    type="tel"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+91 94311 00000"
                    className="w-full bg-coal border border-dim/30 rounded-xl px-3.5 py-2.5 text-xs text-offwhite font-mono focus:outline-none focus:border-amber"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center gap-3 pt-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-white/[0.1] hover:bg-white/[0.05] text-offwhite font-mono text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-3 rounded-xl bg-amber hover:bg-amber/90 text-coal font-mono font-bold text-xs uppercase tracking-wider shadow-amber-glow transition-all active:scale-95 disabled:opacity-50"
                >
                  {isLoading ? 'COMMITTING TO SUPABASE...' : 'COMMIT & PROVISION →'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-10 px-6 py-4 text-center text-[11px] font-mono text-dim/60 border-t border-amber/10">
        DGMS Coal Mines Regulations 2017 • Central Statutory Personnel Directory • Live Supabase Database Synchronized
      </footer>
    </div>
  );
}
