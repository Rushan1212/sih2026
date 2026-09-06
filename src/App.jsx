import React, { useState, useEffect, useCallback } from 'react';
import RootPage from './app/page';
import FieldCapturePage from './app/field-capture/page';
import HazardOutboxPage from './app/hazard-outbox/page';
import DashboardPage from './app/dashboard/page';
import LoginPage from './app/login/page';
import AnnouncementsPage from './app/announcements/page';
import UsersPage from './app/users/page';
import { AuthProvider, useAuth } from './context/AuthContext';
import { preExistingMines, buildCuratedMineTelemetry } from './data/mineRecords';
import {
  checkRouteAccess,
  normalizeRoute,
  setPostLoginRedirect,
} from './middleware/authMiddleware';

/**
 * Parses the current pathname and hash into a canonical application route.
 */
function getCanonicalRoute() {
  if (typeof window === 'undefined') return '/';
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase().replace(/^#\/?/, '');

  if (
    path.includes('field-capture') ||
    path.includes('capture') ||
    hash === 'field-capture' ||
    hash === 'capture'
  ) {
    return '/field-capture';
  }

  if (
    path.includes('hazard-outbox') ||
    path.includes('outbox') ||
    hash === 'hazard-outbox' ||
    hash === 'outbox'
  ) {
    return '/hazard-outbox';
  }

  if (path.includes('announcements') || hash === 'announcements') {
    return '/announcements';
  }

  if (path.includes('users') || hash === 'users') {
    return '/users';
  }

  if (path.includes('login') || hash === 'login') {
    return '/login';
  }

  if (path.includes('dashboard') || hash === 'dashboard') {
    return '/dashboard';
  }

  return '/';
}

// ============================================================================
// ERROR BOUNDARY (Guards against unhandled runtime crashes)
// ============================================================================
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('KhanijAI ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    if (typeof window !== 'undefined') {
      window.location.hash = '';
      if (window.history.pushState) window.history.pushState(null, '', '/');
      window.location.reload();
    }
  };

  handleClearCache = () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch (e) {}
      window.location.href = '/';
    }
  };

  render() {
    if (this.state.hasError) {
      const errorMsg =
        this.state.error?.message || String(this.state.error || 'Unknown runtime exception');

      return (
        <div className="min-h-screen bg-[#0A0A10] text-[#E0E0EC] flex flex-col items-center justify-center p-6 text-center font-mono selection:bg-amber selection:text-coal">
          <div className="p-8 max-w-xl w-full bg-[#12121E]/95 border border-amber/30 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-2xl space-y-5 text-left">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-amber/15 border border-amber/40 flex items-center justify-center text-amber text-xl font-bold shadow-[0_0_20px_rgba(245,166,35,0.2)]">
                ⚠
              </span>
              <div>
                <h1 className="text-amber text-lg font-bold tracking-tight">SYSTEM RECOVERY</h1>
                <p className="text-xs text-dim">Telemetry runtime caught an unexpected exception</p>
              </div>
            </div>

            <div className="p-3.5 bg-black/40 border border-red-500/20 rounded-xl font-mono text-xs text-red-300 break-words">
              {errorMsg}
            </div>

            <div className="flex flex-wrap gap-2.5 pt-1">
              <button
                type="button"
                onClick={this.handleReset}
                className="flex-1 min-w-[130px] px-4 py-2.5 bg-amber text-coal font-bold rounded-xl hover:bg-amber/90 transition-all uppercase text-xs tracking-wider text-center shadow-amber-glow"
              >
                Retry View
              </button>
              <button
                type="button"
                onClick={this.handleGoHome}
                className="flex-1 min-w-[130px] px-4 py-2.5 bg-white/[0.08] hover:bg-white/[0.14] text-offwhite font-bold rounded-xl border border-white/[0.1] transition-all uppercase text-xs tracking-wider text-center"
              >
                Return to Home
              </button>
              <button
                type="button"
                onClick={this.handleClearCache}
                className="px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-300 font-bold rounded-xl border border-red-500/30 transition-all uppercase text-xs tracking-wider text-center"
                title="Clear local state & storage"
              >
                Reset Storage
              </button>
            </div>

            {this.state.error?.stack && (
              <details className="mt-2 text-[11px] text-dim font-mono border-t border-white/[0.06] pt-3">
                <summary className="cursor-pointer hover:text-offwhite select-none">
                  Diagnostic Stack Trace
                </summary>
                <pre className="mt-2 p-3 bg-black/50 rounded-lg overflow-x-auto text-[10px] text-dim/80 whitespace-pre-wrap">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ============================================================================
// MAIN APP ROUTER COMPONENT WITH DGMS AUTHENTICATION MIDDLEWARE
// ============================================================================
function AppRouter() {
  const { isAuthenticated, role, isLoading } = useAuth();
  const [currentRoute, setCurrentRoute] = useState(getCanonicalRoute);
  const [selectedMine, setSelectedMine] = useState(() => {
    return buildCuratedMineTelemetry(preExistingMines[0]);
  });

  const navigate = useCallback((route) => {
    const rawTarget = route.startsWith('/') ? route : `/${route}`;
    const targetRoute = normalizeRoute(rawTarget);

    // Run DGMS Authentication & Role Middleware
    const access = checkRouteAccess(targetRoute, { isAuthenticated, role });

    if (!access.allowed) {
      if (access.reason === 'unauthenticated') {
        setPostLoginRedirect(targetRoute, access.message);
        setCurrentRoute('/login');
        if (typeof window !== 'undefined') {
          try {
            window.history.pushState(null, '', '/login');
          } catch (e) {}
          window.location.hash = 'login';
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        return;
      }

      if (access.reason === 'unauthorized') {
        const fallback = access.redirect || '/dashboard';
        setCurrentRoute(fallback);
        if (typeof window !== 'undefined') {
          try {
            window.history.pushState(null, '', fallback);
          } catch (e) {}
          window.location.hash = fallback.replace(/^\//, '');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        return;
      }
    }

    setCurrentRoute(targetRoute);

    if (typeof window !== 'undefined') {
      try {
        window.history.pushState(null, '', targetRoute);
      } catch (e) {
        // Fallback for sandboxed or restricted origins
      }

      if (targetRoute === '/') {
        window.location.hash = '';
      } else {
        window.location.hash = targetRoute.replace(/^\//, '');
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [isAuthenticated, role]);

  // Keep route synced with popstate (browser back/forward) and hash changes
  useEffect(() => {
    const handleLocationChange = () => {
      const canonical = getCanonicalRoute();
      const access = checkRouteAccess(canonical, { isAuthenticated, role });

      if (!access.allowed) {
        if (access.reason === 'unauthenticated') {
          setPostLoginRedirect(canonical, access.message);
          setCurrentRoute('/login');
          if (window.location.hash !== 'login' && window.location.hash !== '#login') {
            window.location.hash = 'login';
          }
          return;
        }

        if (access.reason === 'unauthorized') {
          const fallback = access.redirect || '/dashboard';
          setCurrentRoute(fallback);
          window.location.hash = fallback.replace(/^\//, '');
          return;
        }
      }

      setCurrentRoute(canonical);
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, [isAuthenticated, role]);

  // Reactive auth status change watcher:
  // If user logs out or session expires while on a protected route, immediately redirect to /login
  useEffect(() => {
    if (isLoading) return;

    const access = checkRouteAccess(currentRoute, { isAuthenticated, role });
    if (!access.allowed) {
      if (access.reason === 'unauthenticated') {
        setPostLoginRedirect(currentRoute, access.message);
        navigate('/login');
      } else if (access.reason === 'unauthorized') {
        navigate(access.redirect || '/dashboard');
      }
    }
  }, [currentRoute, isAuthenticated, role, isLoading, navigate]);

  // Synchronous Security Defense:
  // Strictly prevent any protected route component from rendering if access is denied
  const accessCheck = checkRouteAccess(currentRoute, { isAuthenticated, role });
  if (!accessCheck.allowed) {
    if (accessCheck.reason === 'unauthenticated') {
      return <LoginPage onNavigate={navigate} />;
    }
    return (
      <DashboardPage
        onNavigate={navigate}
        selectedMine={selectedMine}
        onSelectMine={setSelectedMine}
      />
    );
  }

  // Dispatch to the matching authorized route's page.tsx
  switch (currentRoute) {
    case '/field-capture':
    case '/capture':
      return <FieldCapturePage onNavigate={navigate} />;

    case '/hazard-outbox':
    case '/outbox':
      return <HazardOutboxPage onNavigate={navigate} />;

    case '/announcements':
      return <AnnouncementsPage onNavigate={navigate} />;

    case '/users':
      return <UsersPage onNavigate={navigate} />;

    case '/login':
      return <LoginPage onNavigate={navigate} />;

    case '/dashboard':
      return (
        <DashboardPage
          onNavigate={navigate}
          selectedMine={selectedMine}
          onSelectMine={setSelectedMine}
        />
      );

    case '/':
    default:
      return (
        <RootPage
          onNavigate={navigate}
          onExplorePlatform={() => navigate('/dashboard')}
          selectedMine={selectedMine}
          onSelectMine={setSelectedMine}
        />
      );
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </ErrorBoundary>
  );
}

