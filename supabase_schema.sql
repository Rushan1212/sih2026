-- ============================================================================
-- KHANIJAI // COALGUARD SAFETY INTELLIGENCE PLATFORM
-- SUPABASE DATABASE SCHEMA: USERS, ROLES & STATUTORY LOGIN AUDIT LOGS
-- ============================================================================
-- Copy and paste this entire script into your Supabase SQL Editor and click "Run".
-- This provisions the full database tables, constraints, security policies,
-- realtime streams, and initial root DGMS Director seed data.
-- ============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 2. TABLE: public.users
-- Central statutory registry of all authorized mine personnel and inspectors
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY DEFAULT ('usr-' || substr(md5(random()::text), 1, 12)),
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL DEFAULT 'colliery123',
    role TEXT NOT NULL CHECK (role IN ('authority', 'employee')),
    full_name TEXT NOT NULL,
    designation TEXT NOT NULL,
    colliery_id TEXT,
    colliery_name TEXT,
    badge_number TEXT NOT NULL UNIQUE,
    phone TEXT,
    avatar_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by TEXT DEFAULT 'system_root'
);

-- ============================================================================
-- 3. TABLE: public.user_logins
-- Immutable statutory audit trail recording every user login event
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.user_logins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    email TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('authority', 'employee')),
    full_name TEXT NOT NULL,
    designation TEXT,
    colliery_id TEXT,
    colliery_name TEXT,
    badge_number TEXT,
    login_timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ip_address TEXT DEFAULT 'client-side',
    user_agent TEXT,
    status TEXT NOT NULL DEFAULT 'success' CHECK (status IN ('success', 'failed')),
    failure_reason TEXT,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- ============================================================================
-- 4. PERFORMANCE INDEXES
-- Optimized for high-frequency queries, audit searches, and realtime feeds
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_badge_number ON public.users(badge_number);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON public.users(is_active);

CREATE INDEX IF NOT EXISTS idx_user_logins_user_id ON public.user_logins(user_id);
CREATE INDEX IF NOT EXISTS idx_user_logins_email ON public.user_logins(email);
CREATE INDEX IF NOT EXISTS idx_user_logins_role ON public.user_logins(role);
CREATE INDEX IF NOT EXISTS idx_user_logins_timestamp ON public.user_logins(login_timestamp DESC);

-- ============================================================================
-- 5. AUTOMATIC TIMESTAMP TRIGGER
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_users_updated_at ON public.users;
CREATE TRIGGER tr_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- Ensures safe browser access while protecting audit immutability
-- ============================================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_logins ENABLE ROW LEVEL SECURITY;

-- Policies for public.users:
-- Allow authenticated & anon client to read active users for directory & authentication
DROP POLICY IF EXISTS "Allow public read users" ON public.users;
CREATE POLICY "Allow public read users"
    ON public.users
    FOR SELECT
    USING (true);

-- Allow inserting users (Authority user provisioning workflow)
DROP POLICY IF EXISTS "Allow insert users" ON public.users;
CREATE POLICY "Allow insert users"
    ON public.users
    FOR INSERT
    WITH CHECK (true);

-- Allow updating users
DROP POLICY IF EXISTS "Allow update users" ON public.users;
CREATE POLICY "Allow update users"
    ON public.users
    FOR UPDATE
    USING (true);

-- Allow deleting users
DROP POLICY IF EXISTS "Allow delete users" ON public.users;
CREATE POLICY "Allow delete users"
    ON public.users
    FOR DELETE
    USING (true);

-- Policies for public.user_logins:
-- Allow inserting login audit logs on every sign-in
DROP POLICY IF EXISTS "Allow insert login records" ON public.user_logins;
CREATE POLICY "Allow insert login records"
    ON public.user_logins
    FOR INSERT
    WITH CHECK (true);

-- Allow reading login records
DROP POLICY IF EXISTS "Allow read login records" ON public.user_logins;
CREATE POLICY "Allow read login records"
    ON public.user_logins
    FOR SELECT
    USING (true);

-- ============================================================================
-- 7. ENABLE REALTIME STREAMING (Optional)
-- Allows the web app to receive instant notifications when users or logins change
-- ============================================================================
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.users;
        ALTER PUBLICATION supabase_realtime ADD TABLE public.user_logins;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        NULL;
END $$;

-- ============================================================================
-- 8. INITIAL SEED DATA
-- Provisions root DGMS Statutory Safety Director
-- and logs the initial genesis session record
-- ============================================================================
INSERT INTO public.users (
    id,
    email,
    password,
    role,
    full_name,
    designation,
    colliery_id,
    colliery_name,
    badge_number,
    phone,
    avatar_url,
    is_active,
    created_at,
    created_by
)
VALUES (
    'usr-director-root',
    'director@dgms.gov.in',
    'password123',
    'authority',
    'Statutory Safety Director',
    'DGMS Statutory Safety Director',
    'dgms_central_hq',
    'Directorate General of Mines Safety (DGMS HQ)',
    'DGMS-DIR-0001',
    '+91 326 220 1234',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    true,
    NOW(),
    'system_genesis'
)
ON CONFLICT (email) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    designation = EXCLUDED.designation,
    badge_number = EXCLUDED.badge_number,
    is_active = true;

-- Seed initial genesis login audit log
INSERT INTO public.user_logins (
    user_id,
    email,
    role,
    full_name,
    designation,
    colliery_id,
    colliery_name,
    badge_number,
    login_timestamp,
    status,
    metadata
)
VALUES (
    'usr-director-root',
    'director@dgms.gov.in',
    'authority',
    'Statutory Safety Director',
    'DGMS Statutory Safety Director',
    'dgms_central_hq',
    'Directorate General of Mines Safety (DGMS HQ)',
    'DGMS-DIR-0001',
    NOW(),
    'success',
    '{"event": "system_bootstrap", "environment": "production"}'::jsonb
);

-- ============================================================================
-- 9. HELPER QUERY: Verify everything is provisioned properly
-- ============================================================================
SELECT 'users' AS table_name, count(*) AS total_rows FROM public.users
UNION ALL
SELECT 'user_logins' AS table_name, count(*) AS total_rows FROM public.user_logins;

