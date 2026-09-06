'use client';

import React, { useState, useEffect } from 'react';
import {
  Shield,
  HardHat,
  Lock,
  Mail,
  User,
  Building2,
  BadgeCheck,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  LogOut,
  ChevronRight,
  Compass,
  AlertTriangle,
  Users,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole, StoredUserAccount } from '../../types/auth';
import { soundManager } from '../../utils/sound';
import {
  consumePostLoginRedirect,
  peekAuthRedirectNotice,
} from '../../middleware/authMiddleware';

interface LoginPageProps {
  onNavigate?: (route: string) => void;
}

export default function LoginPage({ onNavigate }: LoginPageProps) {
  const {
    user,
    role,
    isAuthority,
    isAuthenticated,
    registeredUsers,
    login,
    loginAsDemo,
    logout,
    isLoading,
    isSupabaseLive,
  } = useAuth();

  const [selectedRole, setSelectedRole] = useState<UserRole>('authority');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [authNotice, setAuthNotice] = useState<string | null>(() => peekAuthRedirectNotice());

  const provisionedAuthorities = registeredUsers.filter((u) => u.role === 'authority');
  const provisionedEmployees = registeredUsers.filter((u) => u.role === 'employee');

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

  const handleRoleSelect = (newRole: UserRole) => {
    soundManager.playClick();
    setSelectedRole(newRole);
    setLoginError(null);
    setEmail('');
    setPassword('');
  };

  const handleSelectAccount = (acc: StoredUserAccount) => {
    soundManager.playClick();
    setEmail(acc.email);
    setPassword(acc.password);
  };

  const handleDemoSignIn = async (demoRole: UserRole) => {
    soundManager.playClick();
    setLoginError(null);
    try {
      await loginAsDemo(demoRole);
      const postRedirect = consumePostLoginRedirect();
      if (postRedirect.redirect) {
        navigateTo(postRedirect.redirect);
      } else if (demoRole === 'authority') {
        navigateTo('/users');
      } else {
        navigateTo('/field-capture');
      }
    } catch (err: any) {
      setLoginError(err.message || 'Failed to authenticate.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playClick();
    setLoginError(null);

    try {
      await login({
        email: email.trim(),
        password,
        role: selectedRole,
      });

      const postRedirect = consumePostLoginRedirect();
      if (postRedirect.redirect) {
        navigateTo(postRedirect.redirect);
      } else if (selectedRole === 'authority') {
        navigateTo('/users');
      } else {
        navigateTo('/field-capture');
      }
    } catch (err: any) {
      setLoginError(err.message || 'Authentication failed. Please verify credentials.');
    }
  };


  return (
    <div className="min-h-screen bg-coal text-offwhite font-sans selection:bg-amber selection:text-coal relative overflow-x-clip flex flex-col justify-between">
      {/* Antigravity Ambient Lighting & 3D Grid */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-amber/[0.035] blur-[180px] pointer-events-none rounded-full z-0" />
      <div className="fixed bottom-0 right-0 w-[700px] h-[500px] bg-[#2D3561]/25 blur-[200px] pointer-events-none rounded-full z-0" />

      {/* Top Breadcrumb Header */}
      <header className="relative z-10 px-6 py-4 flex items-center justify-between border-b border-amber/15 bg-coal/70 backdrop-blur-md">
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
          <span className="text-xs font-mono text-dim">Statutory Identity Gateway</span>
        </div>

        <button
          type="button"
          onClick={() => {
            soundManager.playClick();
            navigateTo('/');
          }}
          className="text-xs font-mono text-dim hover:text-amber transition-colors"
        >
          ← Return to Overview
        </button>
      </header>

      {/* Main Container */}
      <main className="relative z-10 max-w-xl mx-auto w-full px-4 py-8 md:py-12">
        {/* If Already Logged In */}
        {isAuthenticated && user ? (
          <div className="bg-graphite/70 border border-teal/40 rounded-3xl p-6 md:p-8 backdrop-blur-2xl shadow-amber-glow text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-teal/15 border border-teal/30 text-teal flex items-center justify-center mx-auto shadow-inner">
              {isAuthority ? <Shield className="w-8 h-8 text-teal" /> : <HardHat className="w-8 h-8 text-teal" />}
            </div>

            <div>
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-teal/15 border border-teal/30 text-teal uppercase tracking-wider font-semibold">
                ACTIVE STATUTORY SESSION
              </span>
              <h2 className="text-2xl font-display font-bold text-white mt-2">
                {user.user_metadata.full_name}
              </h2>
              <p className="text-xs font-mono text-dim mt-1">
                {user.user_metadata.designation} • {user.user_metadata.badge_number}
              </p>
              <p className="text-xs text-offwhite/80 mt-1 font-mono">
                {user.user_metadata.colliery_name}
              </p>
            </div>

            <div className="bg-coal/60 rounded-xl p-3 border border-dim/20 text-left font-mono text-xs space-y-1">
              <div className="text-[10px] text-dim uppercase">SUPABASE SESSION ADAPTER</div>
              <div className="text-teal font-semibold">User ID: {user.id}</div>
              <div className="text-offwhite/80">Role Authority: {user.role.toUpperCase()}</div>
              <div className="text-[10px] text-dim truncate">Store: localStorage[sb-coalguard-auth-token]</div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {isAuthority ? (
                <button
                  type="button"
                  onClick={() => navigateTo('/users')}
                  className="px-5 py-3 rounded-xl bg-amber text-coal font-mono font-bold text-xs hover:bg-amber/90 transition-transform active:scale-95 shadow-amber-glow flex items-center justify-center gap-2"
                >
                  <Users className="w-4 h-4" />
                  <span>Personnel Registry (/users)</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => navigateTo('/field-capture')}
                  className="px-5 py-3 rounded-xl bg-amber text-coal font-mono font-bold text-xs hover:bg-amber/90 transition-transform active:scale-95 shadow-amber-glow flex items-center justify-center gap-2"
                >
                  <span>Field Hazard Capture</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              <button
                type="button"
                onClick={logout}
                className="px-5 py-3 rounded-xl bg-coal hover:bg-red-500/10 border border-dim/30 hover:border-red-500/40 text-dim hover:text-red-400 font-mono text-xs transition-colors flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Terminate Session</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-graphite/70 border border-amber/25 rounded-3xl p-6 md:p-8 backdrop-blur-2xl shadow-2xl space-y-6">
            {/* Title */}
            <div className="text-center space-y-1">
              <h2 className="text-2xl md:text-3xl font-display font-extrabold text-offwhite tracking-tight">
                DGMS CoalGuard Gateway
              </h2>
              <div className="flex items-center justify-center gap-2 text-xs font-mono text-dim">
                <span className={`w-2 h-2 rounded-full ${isSupabaseLive ? 'bg-emerald-400 animate-pulse' : 'bg-amber'}`} />
                <span>
                  {isSupabaseLive
                    ? 'Live Supabase DB Connected (public.users & user_logins)'
                    : 'Supabase Offline-First Mode (Syncs automatically)'}
                </span>
              </div>
            </div>

            {/* Authentication Required Middleware Notice */}
            {authNotice && (
              <div className="p-3.5 bg-amber/15 border border-amber/40 rounded-2xl text-xs text-amber font-mono flex items-start gap-2.5 shadow-[0_0_20px_rgba(245,166,35,0.15)] animate-in fade-in">
                <Lock className="w-4 h-4 text-amber flex-shrink-0 mt-0.5" />
                <div className="space-y-1 text-left">
                  <div className="font-bold uppercase tracking-wider text-[10px] text-amber flex items-center justify-between">
                    <span>Access Guard // Authentication Required</span>
                    <button
                      type="button"
                      onClick={() => setAuthNotice(null)}
                      className="text-amber/70 hover:text-amber text-xs font-bold"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="text-offwhite/90 text-xs leading-relaxed">{authNotice}</p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {loginError && (
              <div className="p-3.5 bg-red-500/15 border border-red-500/30 rounded-xl text-xs text-red-300 font-mono flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            {/* Role Switcher Tabs */}
            <div>
              <label className="block text-[11px] font-mono text-amber uppercase tracking-wider font-semibold mb-2 text-center">
                Select Your Operational Persona
              </label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-coal/80 rounded-2xl border border-dim/20">
                <button
                  type="button"
                  onClick={() => handleRoleSelect('authority')}
                  className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs font-mono font-bold transition-all ${
                    selectedRole === 'authority'
                      ? 'bg-amber text-coal shadow-amber-glow'
                      : 'text-dim hover:text-offwhite'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  <span>Authority (DGMS)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleSelect('employee')}
                  className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs font-mono font-bold transition-all ${
                    selectedRole === 'employee'
                      ? 'bg-teal text-coal shadow-inner'
                      : 'text-dim hover:text-offwhite'
                  }`}
                >
                  <HardHat className="w-4 h-4" />
                  <span>Employee (Pit Team)</span>
                </button>
              </div>
            </div>

            {/* Role Specific Guidance & Quick Login */}
            {selectedRole === 'authority' ? (
              <div className="bg-coal/50 border border-amber/20 rounded-2xl p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-amber font-semibold flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5" />
                    DGMS Authority Credentials
                  </span>
                  <span className="text-[10px] font-mono text-dim">
                    {provisionedAuthorities.length > 0 ? `${provisionedAuthorities.length} registered` : 'Statutory Directorate'}
                  </span>
                </div>

                {provisionedAuthorities.length > 0 ? (
                  <div className="space-y-1.5">
                    <div className="text-[10px] font-mono text-dim uppercase">Registered Authorities:</div>
                    {provisionedAuthorities.map((auth) => (
                      <button
                        key={auth.id}
                        type="button"
                        onClick={() => handleSelectAccount(auth)}
                        className="w-full text-left p-2.5 rounded-xl bg-graphite hover:bg-[#232338] border border-amber/30 hover:border-amber transition-all flex items-center justify-between group"
                      >
                        <div>
                          <div className="text-xs font-semibold text-offwhite group-hover:text-amber font-mono">
                            {auth.metadata.full_name} ({auth.metadata.badge_number})
                          </div>
                          <div className="text-[10px] text-dim font-mono">{auth.email}</div>
                        </div>
                        <span className="text-[10px] font-mono text-amber">Select →</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-amber/10 border border-amber/25 space-y-1 text-left">
                    <div className="text-xs font-bold text-amber font-mono flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5" />
                      <span>DGMS Statutory Authority Access</span>
                    </div>
                    <p className="text-[11px] text-dim font-mono leading-relaxed">
                      Enter your authorized DGMS credentials below to sign in with administrative privileges.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-coal/50 border border-teal/20 rounded-2xl p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-teal font-semibold flex items-center gap-1.5">
                    <HardHat className="w-3.5 h-3.5" />
                    Field Inspector Registry Status
                  </span>
                  <span className="text-[10px] font-mono text-dim">
                    {provisionedEmployees.length} registered
                  </span>
                </div>

                {provisionedEmployees.length === 0 ? (
                  <div className="p-3 rounded-xl bg-amber/10 border border-amber/25 space-y-2 text-left">
                    <div className="text-xs font-bold text-amber font-mono flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>No Mock Users Pre-loaded</span>
                    </div>
                    <p className="text-[11px] text-dim font-mono leading-relaxed">
                      As requested, mock employee accounts have been excluded. A DGMS Authority must first create your inspector profile in the <strong>/users</strong> route.
                    </p>
                    <button
                      type="button"
                      onClick={() => handleRoleSelect('authority')}
                      className="text-xs font-mono text-amber hover:underline font-bold flex items-center gap-1"
                    >
                      <span>Switch to Authority to sign in & provision personnel →</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <div className="text-[10px] font-mono text-dim uppercase">Provisioned Inspectors:</div>
                    {provisionedEmployees.map((emp) => (
                      <button
                        key={emp.id}
                        type="button"
                        onClick={() => handleSelectAccount(emp)}
                        className="w-full text-left p-2.5 rounded-xl bg-graphite hover:bg-[#232338] border border-teal/30 hover:border-teal transition-all flex items-center justify-between group"
                      >
                        <div>
                          <div className="text-xs font-semibold text-offwhite group-hover:text-teal font-mono">
                            {emp.metadata.full_name} ({emp.metadata.badge_number})
                          </div>
                          <div className="text-[10px] text-dim font-mono">{emp.email}</div>
                        </div>
                        <span className="text-[10px] font-mono text-teal">Select →</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Separator */}
            <div className="flex items-center gap-3 text-dim font-mono text-[11px]">
              <div className="h-[1px] flex-1 bg-dim/20" />
              <span>OR ENTER STATUTORY CREDENTIALS</span>
              <div className="h-[1px] flex-1 bg-dim/20" />
            </div>

            {/* Standard Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono text-offwhite/80 mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3 h-3 text-amber" />
                  Operational Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    selectedRole === 'authority'
                      ? 'authority@dgms.gov.in'
                      : 'inspector@colliery.gov.in'
                  }
                  className="w-full bg-coal/70 border border-dim/30 rounded-xl px-3.5 py-2.5 text-xs text-offwhite placeholder:text-dim/50 focus:outline-none focus:border-amber font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-offwhite/80 mb-1.5 flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-amber" />
                  Statutory Access Key / Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-coal/70 border border-dim/30 rounded-xl px-3.5 py-2.5 text-xs text-offwhite placeholder:text-dim/50 focus:outline-none focus:border-amber font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-amber hover:bg-amber/90 text-coal font-mono font-bold text-xs tracking-wider uppercase transition-all shadow-amber-glow active:scale-95 disabled:opacity-50 mt-2"
              >
                {isLoading
                  ? 'VERIFYING CREDENTIALS...'
                  : `AUTHENTICATE AS ${selectedRole.toUpperCase()}`}
              </button>
            </form>

            {/* Statutory Guidance Banner */}
            <div className="text-center pt-2 border-t border-white/[0.06]">
              <p className="text-[11px] font-mono text-dim leading-relaxed">
                🔒 Public self-registration is disabled under CMR 2017 Regulation 14. Inspector accounts are provisioned exclusively by Authorities via{' '}
                <button
                  type="button"
                  onClick={() => handleRoleSelect('authority')}
                  className="text-amber underline hover:text-white font-semibold"
                >
                  Personnel Registry (/users)
                </button>
                .
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-4 text-center text-[11px] font-mono text-dim/60 border-t border-amber/10">
        Compliant with Mines Act 1952 & Coal Mines Regulations 2017 • Supabase Auth Session Provider
      </footer>
    </div>
  );
}
