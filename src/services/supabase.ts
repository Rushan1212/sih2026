import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Storage keys for runtime Supabase credentials (allows setting via UI or .env)
 */
export const SUPABASE_CUSTOM_URL_KEY = 'sb-custom-url';
export const SUPABASE_CUSTOM_ANON_KEY = 'sb-custom-anon-key';

/**
 * Resolves the Supabase URL from Vite env vars or runtime localStorage override
 */
export function getSupabaseUrl(): string {
  if (typeof window !== 'undefined') {
    const custom = localStorage.getItem(SUPABASE_CUSTOM_URL_KEY);
    if (custom && custom.trim()) return custom.trim();
  }
  const envUrl = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_SUPABASE_URL : '';
  return (envUrl || '').trim();
}

/**
 * Resolves the Supabase Anon Key from Vite env vars or runtime localStorage override
 */
export function getSupabaseAnonKey(): string {
  if (typeof window !== 'undefined') {
    const custom = localStorage.getItem(SUPABASE_CUSTOM_ANON_KEY);
    if (custom && custom.trim()) return custom.trim();
  }
  const envKey = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_SUPABASE_ANON_KEY : '';
  return (envKey || '').trim();
}

/**
 * Checks whether valid Supabase credentials are configured
 */
export function isSupabaseConfigured(): boolean {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();
  return (
    Boolean(url) &&
    Boolean(key) &&
    !url.includes('placeholder') &&
    !key.includes('placeholder') &&
    url.startsWith('https://')
  );
}

/**
 * Creates or retrieves the singleton Supabase client
 */
let cachedClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();

  if (cachedClient) {
    return cachedClient;
  }

  const effectiveUrl = url || 'https://placeholder.supabase.co';
  const effectiveKey = key || 'placeholder-anon-key';

  cachedClient = createClient(effectiveUrl, effectiveKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });

  return cachedClient;
}

/**
 * Sets runtime custom Supabase credentials and reinitializes the client
 */
export function setCustomSupabaseCredentials(url: string, anonKey: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(SUPABASE_CUSTOM_URL_KEY, url.trim());
    localStorage.setItem(SUPABASE_CUSTOM_ANON_KEY, anonKey.trim());
  }
  cachedClient = null;
  getSupabaseClient();
}

/**
 * Clears custom credentials
 */
export function clearCustomSupabaseCredentials(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SUPABASE_CUSTOM_URL_KEY);
    localStorage.removeItem(SUPABASE_CUSTOM_ANON_KEY);
  }
  cachedClient = null;
  getSupabaseClient();
}

export const supabase = getSupabaseClient();

