import { UserRole } from '../types/auth';

/**
 * Public routes that do not require an active authenticated session.
 * As per DGMS security standards, only the public landing page ('/') and
 * the login portal ('/login') are accessible without credentials.
 */
export const PUBLIC_ROUTES = ['/', '/login'] as const;

/**
 * Core protected mining operations routes requiring active login credentials.
 */
export const PROTECTED_ROUTES = [
  '/field-capture',
  '/hazard-outbox',
  '/announcements',
  '/dashboard',
  '/users',
] as const;

/**
 * Route aliases mapped to canonical routes.
 */
export const ROUTE_ALIASES: Record<string, string> = {
  '/capture': '/field-capture',
  '/outbox': '/hazard-outbox',
  'capture': '/field-capture',
  'outbox': '/hazard-outbox',
  'field-capture': '/field-capture',
  'hazard-outbox': '/hazard-outbox',
  'announcements': '/announcements',
  'dashboard': '/dashboard',
  'users': '/users',
  'login': '/login',
};

/**
 * Routes restricted to specific authority roles.
 */
export const ROLE_RESTRICTIONS: Record<string, UserRole[]> = {
  '/users': ['authority'],
};

export interface RouteAccessResult {
  allowed: boolean;
  canonicalRoute: string;
  redirect?: string;
  reason?: 'unauthenticated' | 'unauthorized' | 'none';
  message?: string;
}

const POST_LOGIN_REDIRECT_KEY = 'coalguard_post_login_redirect';
const AUTH_REDIRECT_NOTICE_KEY = 'coalguard_auth_redirect_notice';

/**
 * Normalizes any route string, pathname, or hash fragment into a clean canonical route.
 */
export function normalizeRoute(raw: string): string {
  if (!raw) return '/';
  const clean = raw.trim().toLowerCase().replace(/^#\/?/, '').replace(/^\//, '');

  if (ROUTE_ALIASES[clean]) {
    return ROUTE_ALIASES[clean];
  }

  const slashPath = `/${clean}`;
  if (ROUTE_ALIASES[slashPath]) {
    return ROUTE_ALIASES[slashPath];
  }

  if (clean === '' || clean === 'home') {
    return '/';
  }

  // Check prefix matches
  if (clean.startsWith('field-capture') || clean.startsWith('capture')) {
    return '/field-capture';
  }
  if (clean.startsWith('hazard-outbox') || clean.startsWith('outbox')) {
    return '/hazard-outbox';
  }
  if (clean.startsWith('announcements')) {
    return '/announcements';
  }
  if (clean.startsWith('users')) {
    return '/users';
  }
  if (clean.startsWith('login')) {
    return '/login';
  }
  if (clean.startsWith('dashboard')) {
    return '/dashboard';
  }

  return '/';
}

/**
 * Checks whether a given canonical route is open to public unauthenticated access.
 */
export function isPublicRoute(route: string): boolean {
  const canonical = normalizeRoute(route);
  return canonical === '/' || canonical === '/login';
}

/**
 * Evaluates route access against user authentication and authorization credentials.
 */
export function checkRouteAccess(
  rawRoute: string,
  auth: { isAuthenticated: boolean; role?: UserRole | null }
): RouteAccessResult {
  const canonicalRoute = normalizeRoute(rawRoute);

  // 1. Public route check
  if (isPublicRoute(canonicalRoute)) {
    return {
      allowed: true,
      canonicalRoute,
      reason: 'none',
    };
  }

  // 2. Unauthenticated check (no login)
  if (!auth.isAuthenticated) {
    return {
      allowed: false,
      canonicalRoute,
      redirect: '/login',
      reason: 'unauthenticated',
      message: `Authentication Required: Please sign in with verified Coal India credentials to access ${canonicalRoute}.`,
    };
  }

  // 3. Role-based check
  const requiredRoles = ROLE_RESTRICTIONS[canonicalRoute];
  if (requiredRoles && (!auth.role || !requiredRoles.includes(auth.role))) {
    return {
      allowed: false,
      canonicalRoute,
      redirect: '/dashboard',
      reason: 'unauthorized',
      message: `Access Denied: The route ${canonicalRoute} requires Authority-level (DGMS / Colliery Director) privileges.`,
    };
  }

  // 4. Authorized and permitted
  return {
    allowed: true,
    canonicalRoute,
    reason: 'none',
  };
}

/**
 * Stores the intended target route and an alert notice into sessionStorage for post-login return.
 */
export function setPostLoginRedirect(route: string, notice?: string): void {
  if (typeof window === 'undefined') return;
  try {
    const canonical = normalizeRoute(route);
    if (!isPublicRoute(canonical)) {
      sessionStorage.setItem(POST_LOGIN_REDIRECT_KEY, canonical);
      if (notice) {
        sessionStorage.setItem(AUTH_REDIRECT_NOTICE_KEY, notice);
      }
    }
  } catch (e) {
    // SessionStorage may be restricted in sandboxed iframes
  }
}

/**
 * Retrieves and clears the stored post-login redirect destination.
 */
export function consumePostLoginRedirect(): { redirect: string | null; notice: string | null } {
  if (typeof window === 'undefined') return { redirect: null, notice: null };
  try {
    const redirect = sessionStorage.getItem(POST_LOGIN_REDIRECT_KEY);
    const notice = sessionStorage.getItem(AUTH_REDIRECT_NOTICE_KEY);
    sessionStorage.removeItem(POST_LOGIN_REDIRECT_KEY);
    sessionStorage.removeItem(AUTH_REDIRECT_NOTICE_KEY);
    return { redirect, notice };
  } catch (e) {
    return { redirect: null, notice: null };
  }
}

/**
 * Peeks at any active redirect notice without consuming it.
 */
export function peekAuthRedirectNotice(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return sessionStorage.getItem(AUTH_REDIRECT_NOTICE_KEY);
  } catch (e) {
    return null;
  }
}

