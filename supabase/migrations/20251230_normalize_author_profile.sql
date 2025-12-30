-- =============================================
-- MIGRATION: Normalize Author Profile Schema
-- Date: December 30, 2025
-- Purpose: Establish single source of truth for author profile data
-- =============================================

-- =============================================
-- STEP 1: Add Missing Columns to Profiles Table
-- =============================================

-- Add is_verified column (admin-controlled, immune to author save)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false NOT NULL;

-- Add primary_genre column (author-controlled)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS primary_genre TEXT;

-- Ensure location column exists (already should, but be safe)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS location TEXT;

-- Add comments to clarify ownership
COMMENT ON COLUMN profiles.is_verified IS 'Admin-controlled verification status. NOT editable by author.';
COMMENT ON COLUMN profiles.primary_genre IS 'Author-selected primary genre. Editable by author.';
COMMENT ON COLUMN profiles.location IS 'Author location (city, country). Editable by author.';
COMMENT ON COLUMN profiles.social_links IS 'DEPRECATED: Social links now stored in dedicated columns. Kept for backward compatibility during migration.';

-- =============================================
-- STEP 2: Migrate Data from JSONB to Columns
-- =============================================

-- Migrate is_verified from social_links JSONB to dedicated column
UPDATE profiles
SET is_verified = COALESCE((social_links->>'is_verified')::boolean, false)
WHERE social_links IS NOT NULL 
  AND social_links->>'is_verified' IS NOT NULL
  AND is_verified = false;

-- Migrate genre from social_links JSONB to primary_genre column
UPDATE profiles
SET primary_genre = social_links->>'genre'
WHERE social_links IS NOT NULL 
  AND social_links->>'genre' IS NOT NULL
  AND social_links->>'genre' != ''
  AND (primary_genre IS NULL OR primary_genre = '');

-- Migrate location from social_links JSONB to location column (if location column is empty)
UPDATE profiles
SET location = social_links->>'location'
WHERE social_links IS NOT NULL 
  AND social_links->>'location' IS NOT NULL
  AND social_links->>'location' != ''
  AND (location IS NULL OR location = '');

-- Migrate social links from JSONB to individual columns (only if columns are empty)
UPDATE profiles
SET 
  twitter = COALESCE(NULLIF(twitter, ''), social_links->>'twitter'),
  instagram = COALESCE(NULLIF(instagram, ''), social_links->>'instagram'),
  facebook = COALESCE(NULLIF(facebook, ''), social_links->>'facebook'),
  linkedin = COALESCE(NULLIF(linkedin, ''), social_links->>'linkedin'),
  goodreads = COALESCE(NULLIF(goodreads, ''), social_links->>'goodreads')
WHERE social_links IS NOT NULL;

-- =============================================
-- STEP 3: Clean Up Empty String Values
-- =============================================

-- Convert empty strings to NULL for cleaner data
UPDATE profiles SET twitter = NULL WHERE twitter = '';
UPDATE profiles SET instagram = NULL WHERE instagram = '';
UPDATE profiles SET facebook = NULL WHERE facebook = '';
UPDATE profiles SET linkedin = NULL WHERE linkedin = '';
UPDATE profiles SET goodreads = NULL WHERE goodreads = '';
UPDATE profiles SET website = NULL WHERE website = '';
UPDATE profiles SET location = NULL WHERE location = '';
UPDATE profiles SET primary_genre = NULL WHERE primary_genre = '';
UPDATE profiles SET phone = NULL WHERE phone = '';
UPDATE profiles SET bio = NULL WHERE bio = '';

-- =============================================
-- STEP 4: Clear Deprecated JSONB Data
-- =============================================

-- Clear social_links JSONB to prevent stale data (set to empty object)
-- We keep the column for now but clear the data
UPDATE profiles SET social_links = '{}'::jsonb WHERE social_links IS NOT NULL;

-- =============================================
-- STEP 5: Add Indexes for Performance
-- =============================================

CREATE INDEX IF NOT EXISTS profiles_is_verified_idx ON profiles(is_verified) WHERE is_verified = true;
CREATE INDEX IF NOT EXISTS profiles_primary_genre_idx ON profiles(primary_genre) WHERE primary_genre IS NOT NULL;

-- =============================================
-- STEP 6: Verification Query (Run to Confirm Migration)
-- =============================================

-- Run this to verify the migration worked:
-- SELECT id, pen_name, is_verified, primary_genre, location, twitter, instagram, facebook, linkedin, goodreads, website
-- FROM profiles
-- WHERE account_type = 'author';
