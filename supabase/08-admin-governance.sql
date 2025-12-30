-- =============================================
-- PENSTRIKE INKWORKS - ADMIN GOVERNANCE SCHEMA
-- Phase 8: Admin Role Hardening, Author Verification, Publishing Governance
-- Last updated: December 31, 2025
-- 
-- ⚠️ IMPORTANT: Run this file in TWO STEPS in Supabase:
-- STEP 1: Run ONLY Section 1 and Section 3 (enum additions) first and COMMIT
-- STEP 2: Run the rest of the file AFTER the first commit completes
-- 
-- OR use the split files:
-- - 08a-admin-governance-enums.sql (run first)
-- - 08b-admin-governance-tables.sql (run second)
-- =============================================

-- =============================================
-- SECTION 1: ROLE ENUM (Replaces account_type for governance)
-- ⚠️ RUN THIS FIRST, THEN COMMIT BEFORE CONTINUING
-- =============================================

-- Create new role enum with admin support
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('reader', 'author', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- =============================================
-- SECTION 3: BOOK STATUS ENUM UPDATE (must be committed before use)
-- ⚠️ RUN THIS WITH SECTION 1, THEN COMMIT BEFORE CONTINUING
-- =============================================

-- Add new values to existing enum (these need to commit before being used)
ALTER TYPE book_status ADD VALUE IF NOT EXISTS 'submitted';
ALTER TYPE book_status ADD VALUE IF NOT EXISTS 'in_review';
ALTER TYPE book_status ADD VALUE IF NOT EXISTS 'approved';
ALTER TYPE book_status ADD VALUE IF NOT EXISTS 'archived';

-- =============================================
-- ⚠️ STOP HERE - COMMIT THE ABOVE CHANGES FIRST
-- Then run everything below in a new query
-- =============================================

-- =============================================
-- SECTION 2: PROFILE COLUMNS
-- =============================================

-- Add role column to profiles (coexists with account_type initially)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'role') THEN
    ALTER TABLE profiles ADD COLUMN role user_role DEFAULT 'reader' NOT NULL;
  END IF;
END $$;

-- Migrate existing account_type to role (preserves reader/author, no one becomes admin by default)
UPDATE profiles SET role = account_type::text::user_role WHERE role = 'reader' AND account_type = 'author';

-- Add verification request fields
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'verification_requested') THEN
    ALTER TABLE profiles ADD COLUMN verification_requested BOOLEAN DEFAULT false NOT NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'verification_requested_at') THEN
    ALTER TABLE profiles ADD COLUMN verification_requested_at TIMESTAMPTZ;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'verification_notes') THEN
    ALTER TABLE profiles ADD COLUMN verification_notes TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'verified_at') THEN
    ALTER TABLE profiles ADD COLUMN verified_at TIMESTAMPTZ;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'verified_by') THEN
    ALTER TABLE profiles ADD COLUMN verified_by UUID REFERENCES profiles(id);
  END IF;
END $$;

-- Index for verification queue
CREATE INDEX IF NOT EXISTS profiles_verification_requested_idx ON profiles(verification_requested) WHERE verification_requested = true;

-- Add publishing governance columns to books
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'books' AND column_name = 'submitted_at') THEN
    ALTER TABLE books ADD COLUMN submitted_at TIMESTAMPTZ;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'books' AND column_name = 'reviewed_at') THEN
    ALTER TABLE books ADD COLUMN reviewed_at TIMESTAMPTZ;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'books' AND column_name = 'reviewed_by') THEN
    ALTER TABLE books ADD COLUMN reviewed_by UUID REFERENCES profiles(id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'books' AND column_name = 'review_notes') THEN
    ALTER TABLE books ADD COLUMN review_notes TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'books' AND column_name = 'rejection_reason') THEN
    ALTER TABLE books ADD COLUMN rejection_reason TEXT;
  END IF;
END $$;

-- =============================================
-- SECTION 4: ADMIN AUDIT LOG TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS admin_audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  admin_id UUID NOT NULL REFERENCES profiles(id) ON DELETE SET NULL,
  action_type TEXT NOT NULL,
  target_type TEXT NOT NULL, -- 'profile', 'book', 'order', etc.
  target_id UUID NOT NULL,
  old_value JSONB,
  new_value JSONB,
  notes TEXT,
  ip_address INET
);

-- Indexes for audit log
CREATE INDEX IF NOT EXISTS audit_log_admin_idx ON admin_audit_log(admin_id);
CREATE INDEX IF NOT EXISTS audit_log_target_idx ON admin_audit_log(target_type, target_id);
CREATE INDEX IF NOT EXISTS audit_log_created_idx ON admin_audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS audit_log_action_idx ON admin_audit_log(action_type);

-- Enable RLS on audit log
ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view/insert audit logs
DROP POLICY IF EXISTS "Admins can view audit logs" ON admin_audit_log;
DROP POLICY IF EXISTS "Admins can insert audit logs" ON admin_audit_log;

CREATE POLICY "Admins can view audit logs" 
  ON admin_audit_log FOR SELECT 
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can insert audit logs" 
  ON admin_audit_log FOR INSERT 
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- =============================================
-- SECTION 5: ADMIN-PROTECTED RLS POLICIES
-- =============================================

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profile update policy - prevent authors from modifying admin-controlled fields
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

CREATE POLICY "Users can update their own profile - restricted" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    -- Prevent role escalation
    AND (
      role = (SELECT role FROM profiles WHERE id = auth.uid())
      OR is_admin()
    )
    -- Prevent is_verified modification by non-admins
    AND (
      is_verified = (SELECT is_verified FROM profiles WHERE id = auth.uid())
      OR is_admin()
    )
  );

-- Admin can update any profile
DROP POLICY IF EXISTS "Admins can update any profile" ON profiles;
CREATE POLICY "Admins can update any profile" 
  ON profiles FOR UPDATE 
  USING (is_admin());

-- Book publishing policy - authors can only publish if approved
DROP POLICY IF EXISTS "Authors can update their own books" ON books;

CREATE POLICY "Authors can update their own books - restricted" 
  ON books FOR UPDATE 
  USING (auth.uid() = author_id OR is_admin())
  WITH CHECK (
    -- Author can modify own books
    (auth.uid() = author_id AND (
      -- Can edit drafts freely
      status IN ('draft')
      -- Can submit drafts for review
      OR (status = 'submitted' AND (SELECT status FROM books WHERE id = books.id) = 'draft')
      -- Cannot modify approved/published books (except to archive)
    ))
    -- Admins can do anything
    OR is_admin()
  );

-- Admin can manage all books
DROP POLICY IF EXISTS "Admins can manage books" ON books;
CREATE POLICY "Admins can manage books" 
  ON books FOR ALL 
  USING (is_admin());

-- =============================================
-- SECTION 6: VERIFICATION QUEUE VIEW
-- =============================================

CREATE OR REPLACE VIEW verification_queue AS
SELECT 
  p.id,
  p.email,
  COALESCE(p.pen_name, p.full_name) as display_name,
  p.avatar_url,
  p.bio,
  p.primary_genre,
  p.is_verified,
  p.verification_requested,
  p.verification_requested_at,
  p.created_at as joined_at,
  (SELECT COUNT(*) FROM books WHERE author_id = p.id) as book_count,
  (SELECT COUNT(*) FROM books WHERE author_id = p.id AND status = 'published') as published_count
FROM profiles p
WHERE p.role = 'author' OR p.account_type = 'author'
ORDER BY p.verification_requested DESC, p.verification_requested_at ASC;

-- =============================================
-- SECTION 7: MANUSCRIPT REVIEW QUEUE VIEW
-- =============================================

CREATE OR REPLACE VIEW manuscript_review_queue AS
SELECT 
  b.id,
  b.title,
  b.slug,
  b.description,
  b.genre,
  b.status,
  b.created_at,
  b.submitted_at,
  b.reviewed_at,
  b.review_notes,
  b.rejection_reason,
  p.id as author_id,
  COALESCE(p.pen_name, p.full_name) as author_name,
  p.email as author_email,
  p.is_verified as author_verified,
  reviewer.id as reviewer_id,
  COALESCE(reviewer.pen_name, reviewer.full_name) as reviewer_name
FROM books b
JOIN profiles p ON b.author_id = p.id
LEFT JOIN profiles reviewer ON b.reviewed_by = reviewer.id
WHERE b.status IN ('submitted', 'in_review', 'pending')
ORDER BY 
  CASE b.status 
    WHEN 'submitted' THEN 1 
    WHEN 'in_review' THEN 2 
    WHEN 'pending' THEN 3 
  END,
  b.submitted_at ASC;

-- =============================================
-- SECTION 8: ADMIN STATS FUNCTION
-- =============================================

CREATE OR REPLACE FUNCTION get_admin_stats()
RETURNS TABLE (
  total_users BIGINT,
  total_authors BIGINT,
  verified_authors BIGINT,
  pending_verifications BIGINT,
  total_books BIGINT,
  published_books BIGINT,
  pending_manuscripts BIGINT,
  total_orders BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COUNT(*) FROM profiles)::BIGINT as total_users,
    (SELECT COUNT(*) FROM profiles WHERE role = 'author' OR account_type = 'author')::BIGINT as total_authors,
    (SELECT COUNT(*) FROM profiles WHERE is_verified = true)::BIGINT as verified_authors,
    (SELECT COUNT(*) FROM profiles WHERE verification_requested = true AND is_verified = false)::BIGINT as pending_verifications,
    (SELECT COUNT(*) FROM books)::BIGINT as total_books,
    (SELECT COUNT(*) FROM books WHERE status = 'published')::BIGINT as published_books,
    (SELECT COUNT(*) FROM books WHERE status IN ('submitted', 'in_review', 'pending'))::BIGINT as pending_manuscripts,
    (SELECT COUNT(*) FROM purchases)::BIGINT as total_orders;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- DONE! Admin governance schema complete.
-- =============================================
