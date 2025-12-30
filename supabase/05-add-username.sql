-- =============================================
-- MIGRATION: Add username column to profiles
-- =============================================

-- Add username column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'username') THEN
    ALTER TABLE profiles ADD COLUMN username TEXT UNIQUE;
  END IF;
END $$;

-- Create index for faster username lookups
CREATE INDEX IF NOT EXISTS profiles_username_idx ON profiles (username);

-- Add constraint for username format (optional, can be enforced at application level)
-- Only allows lowercase alphanumeric and underscores, 3-20 characters
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS username_format;
ALTER TABLE profiles ADD CONSTRAINT username_format 
  CHECK (username IS NULL OR (
    LENGTH(username) >= 3 AND 
    LENGTH(username) <= 20 AND 
    username ~ '^[a-z0-9_]+$'
  ));

COMMENT ON COLUMN profiles.username IS 'Unique username for the user, 3-20 characters, lowercase alphanumeric and underscores only';
