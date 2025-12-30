-- =============================================
-- STEP 7: Add notification_settings and preferences columns to profiles
-- =============================================

-- Add notification_settings column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'notification_settings') THEN
    ALTER TABLE profiles ADD COLUMN notification_settings JSONB DEFAULT '{
      "email_new_releases": true,
      "email_order_updates": true,
      "email_newsletter": false,
      "email_recommendations": true
    }'::jsonb;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'preferences') THEN
    ALTER TABLE profiles ADD COLUMN preferences JSONB DEFAULT '{
      "favorite_genres": [],
      "show_reading_activity": true,
      "show_wishlist_public": false
    }'::jsonb;
  END IF;
END $$;

COMMENT ON COLUMN profiles.notification_settings IS 'User email notification preferences';
COMMENT ON COLUMN profiles.preferences IS 'User reading and display preferences';
