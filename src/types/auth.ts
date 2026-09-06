/**
 * Supabase-Compatible Authentication & Identity Types
 * Designed for 1:1 drop-in replacement with @supabase/supabase-js
 */

export type UserRole = 'authority' | 'employee';

export interface SupabaseUserMetadata {
  full_name: string;
  role: UserRole;
  designation: string; // e.g. "DGMS Director of Mine Safety" or "Senior Shift Overman"
  colliery_id: string; // e.g. "bccl_moonidih"
  colliery_name: string; // e.g. "BCCL Moonidih Colliery"
  badge_number: string; // e.g. "DGMS-STAT-9921" or "EMP-BCCL-408"
  avatar_url?: string;
  phone?: string;
}

export interface SupabaseUser {
  id: string; // UUIDv4
  aud: string; // "authenticated"
  role: UserRole;
  email: string;
  email_confirmed_at: string;
  phone?: string;
  confirmed_at: string;
  last_sign_in_at: string;
  app_metadata: {
    provider: 'email';
    providers: ['email'];
    role: UserRole;
  };
  user_metadata: SupabaseUserMetadata;
  created_at: string;
  updated_at: string;
}

export interface SupabaseSession {
  access_token: string;
  token_type: 'bearer';
  expires_in: number;
  expires_at: number;
  refresh_token: string;
  user: SupabaseUser;
}

export interface AuthState {
  user: SupabaseUser | null;
  session: SupabaseSession | null;
  isLoading: boolean;
  role: UserRole | null;
  isAuthority: boolean;
  isEmployee: boolean;
}

export interface StoredUserAccount {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  metadata: SupabaseUserMetadata;
  createdAt: string;
  createdBy: string; // e.g. "root_director" or admin user ID
}

export interface CreateUserParams {
  email: string;
  password: string;
  role: UserRole;
  fullName: string;
  designation: string;
  collieryId: string;
  collieryName: string;
  badgeNumber: string;
  phone?: string;
}

export interface UserLoginRecord {
  id: string;
  user_id: string;
  email: string;
  role: UserRole;
  full_name: string;
  designation?: string;
  colliery_id?: string;
  colliery_name?: string;
  badge_number?: string;
  login_timestamp: string;
  ip_address?: string;
  user_agent?: string;
  status: 'success' | 'failed';
  failure_reason?: string;
  metadata?: Record<string, any>;
}

export interface SupabaseUserRow {
  id: string;
  email: string;
  password?: string;
  role: UserRole;
  full_name: string;
  designation: string;
  colliery_id?: string;
  colliery_name?: string;
  badge_number: string;
  phone?: string;
  avatar_url?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
}


