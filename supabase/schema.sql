-- =============================================
-- PENSTRIKE INKWORKS - COMPLETE DATABASE SCHEMA
-- Run this entire file in Supabase SQL Editor
-- Last updated: December 27, 2025
-- =============================================

-- =============================================
-- SECTION 1: EXTENSIONS
-- =============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- SECTION 2: ENUMS
-- =============================================

DO $$ BEGIN
    CREATE TYPE account_type AS ENUM ('reader', 'author');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE book_status AS ENUM ('draft', 'pending', 'published', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- =============================================
-- SECTION 3: PROFILES TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  email TEXT NOT NULL,
  username TEXT UNIQUE,
  full_name TEXT,
  pen_name TEXT,
  avatar_url TEXT,
  account_type account_type DEFAULT 'reader' NOT NULL,
  bio TEXT,
  phone TEXT,
  location TEXT,
  -- Social links (canonical columns - single source of truth)
  website TEXT,
  twitter TEXT,
  instagram TEXT,
  facebook TEXT,
  linkedin TEXT,
  goodreads TEXT,
  -- Author-specific fields
  primary_genre TEXT,
  -- Admin-controlled verification (NOT editable by author)
  is_verified BOOLEAN DEFAULT false NOT NULL,
  -- DEPRECATED: social_links JSONB - kept for backward compatibility only
  social_links JSONB DEFAULT '{}'::jsonb,
  -- User preferences
  notification_settings JSONB DEFAULT '{
    "email_new_releases": true,
    "email_order_updates": true,
    "email_newsletter": false,
    "email_recommendations": true
  }'::jsonb,
  preferences JSONB DEFAULT '{
    "favorite_genres": [],
    "show_reading_activity": true,
    "show_wishlist_public": false
  }'::jsonb
);

-- Add columns if they don't exist (for existing databases)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'username') THEN
    ALTER TABLE profiles ADD COLUMN username TEXT UNIQUE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'pen_name') THEN
    ALTER TABLE profiles ADD COLUMN pen_name TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'phone') THEN
    ALTER TABLE profiles ADD COLUMN phone TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'location') THEN
    ALTER TABLE profiles ADD COLUMN location TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'notification_settings') THEN
    ALTER TABLE profiles ADD COLUMN notification_settings JSONB DEFAULT '{}'::jsonb;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'preferences') THEN
    ALTER TABLE profiles ADD COLUMN preferences JSONB DEFAULT '{}'::jsonb;
  END IF;
END $$;

-- Username format constraint
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS username_format;
ALTER TABLE profiles ADD CONSTRAINT username_format 
  CHECK (username IS NULL OR (
    LENGTH(username) >= 3 AND 
    LENGTH(username) <= 20 AND 
    username ~ '^[a-z0-9_]+$'
  ));

-- Indexes
CREATE INDEX IF NOT EXISTS profiles_username_idx ON profiles(username);
CREATE INDEX IF NOT EXISTS profiles_account_type_idx ON profiles(account_type);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

CREATE POLICY "Public profiles are viewable by everyone" 
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" 
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- =============================================
-- SECTION 4: BOOKS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS books (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  cover_image TEXT,
  price DECIMAL(10, 2) DEFAULT 0 NOT NULL,
  currency TEXT DEFAULT 'USD' NOT NULL,
  genre TEXT,
  tags TEXT[] DEFAULT '{}',
  status book_status DEFAULT 'draft' NOT NULL,
  published_at TIMESTAMPTZ,
  page_count INTEGER,
  isbn TEXT,
  language TEXT DEFAULT 'en' NOT NULL,
  file_url TEXT,
  preview_url TEXT
);

-- Indexes
CREATE INDEX IF NOT EXISTS books_author_id_idx ON books(author_id);
CREATE INDEX IF NOT EXISTS books_status_idx ON books(status);
CREATE INDEX IF NOT EXISTS books_slug_idx ON books(slug);
CREATE INDEX IF NOT EXISTS books_genre_idx ON books(genre);

-- Enable RLS
ALTER TABLE books ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Published books are viewable by everyone" ON books;
DROP POLICY IF EXISTS "Authors can insert their own books" ON books;
DROP POLICY IF EXISTS "Authors can update their own books" ON books;
DROP POLICY IF EXISTS "Authors can delete their own books" ON books;

CREATE POLICY "Published books are viewable by everyone" 
  ON books FOR SELECT USING (status = 'published' OR auth.uid() = author_id);

CREATE POLICY "Authors can insert their own books" 
  ON books FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update their own books" 
  ON books FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Authors can delete their own books" 
  ON books FOR DELETE USING (auth.uid() = author_id);

-- =============================================
-- SECTION 5: PURCHASES TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD' NOT NULL,
  payment_status payment_status DEFAULT 'pending' NOT NULL,
  payment_provider TEXT,
  transaction_id TEXT,
  UNIQUE(user_id, book_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS purchases_user_id_idx ON purchases(user_id);
CREATE INDEX IF NOT EXISTS purchases_book_id_idx ON purchases(book_id);

-- Enable RLS
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Users can view their own purchases" ON purchases;
DROP POLICY IF EXISTS "Users can insert their own purchases" ON purchases;
DROP POLICY IF EXISTS "Authors can view purchases of their books" ON purchases;

CREATE POLICY "Users can view their own purchases" 
  ON purchases FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own purchases" 
  ON purchases FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authors can view purchases of their books" 
  ON purchases FOR SELECT USING (
    EXISTS (SELECT 1 FROM books WHERE books.id = purchases.book_id AND books.author_id = auth.uid())
  );

-- =============================================
-- SECTION 6: REVIEWS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  content TEXT,
  is_verified_purchase BOOLEAN DEFAULT false,
  UNIQUE(user_id, book_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS reviews_book_id_idx ON reviews(book_id);
CREATE INDEX IF NOT EXISTS reviews_user_id_idx ON reviews(user_id);

-- Enable RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Reviews are viewable by everyone" ON reviews;
DROP POLICY IF EXISTS "Users can insert their own reviews" ON reviews;
DROP POLICY IF EXISTS "Users can update their own reviews" ON reviews;
DROP POLICY IF EXISTS "Users can delete their own reviews" ON reviews;

CREATE POLICY "Reviews are viewable by everyone" 
  ON reviews FOR SELECT USING (true);

CREATE POLICY "Users can insert their own reviews" 
  ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" 
  ON reviews FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews" 
  ON reviews FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- SECTION 7: WISHLISTS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS wishlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  UNIQUE(user_id, book_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS wishlists_user_id_idx ON wishlists(user_id);
CREATE INDEX IF NOT EXISTS wishlists_book_id_idx ON wishlists(book_id);

-- Enable RLS
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Users can view their own wishlist" ON wishlists;
DROP POLICY IF EXISTS "Users can add to their own wishlist" ON wishlists;
DROP POLICY IF EXISTS "Users can remove from their own wishlist" ON wishlists;

CREATE POLICY "Users can view their own wishlist" 
  ON wishlists FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can add to their own wishlist" 
  ON wishlists FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove from their own wishlist" 
  ON wishlists FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- SECTION 8: BOOKMARKS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  folder TEXT DEFAULT 'all',
  notes TEXT,
  UNIQUE(user_id, book_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS bookmarks_user_id_idx ON bookmarks(user_id);
CREATE INDEX IF NOT EXISTS bookmarks_book_id_idx ON bookmarks(book_id);

-- Enable RLS
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Users can view their own bookmarks" ON bookmarks;
DROP POLICY IF EXISTS "Users can add to their own bookmarks" ON bookmarks;
DROP POLICY IF EXISTS "Users can update their own bookmarks" ON bookmarks;
DROP POLICY IF EXISTS "Users can remove from their own bookmarks" ON bookmarks;

CREATE POLICY "Users can view their own bookmarks" 
  ON bookmarks FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can add to their own bookmarks" 
  ON bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookmarks" 
  ON bookmarks FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can remove from their own bookmarks" 
  ON bookmarks FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- SECTION 9: BOOKMARK FOLDERS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS bookmark_folders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT DEFAULT 'amber',
  UNIQUE(user_id, name)
);

-- Indexes
CREATE INDEX IF NOT EXISTS bookmark_folders_user_id_idx ON bookmark_folders(user_id);

-- Enable RLS
ALTER TABLE bookmark_folders ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Users can view their own folders" ON bookmark_folders;
DROP POLICY IF EXISTS "Users can create their own folders" ON bookmark_folders;
DROP POLICY IF EXISTS "Users can update their own folders" ON bookmark_folders;
DROP POLICY IF EXISTS "Users can delete their own folders" ON bookmark_folders;

CREATE POLICY "Users can view their own folders" 
  ON bookmark_folders FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own folders" 
  ON bookmark_folders FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own folders" 
  ON bookmark_folders FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own folders" 
  ON bookmark_folders FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- SECTION 10: CART ITEMS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1 NOT NULL CHECK (quantity > 0),
  format TEXT DEFAULT 'EBOOK' NOT NULL,
  UNIQUE(user_id, book_id, format)
);

-- Indexes
CREATE INDEX IF NOT EXISTS cart_items_user_id_idx ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS cart_items_book_id_idx ON cart_items(book_id);

-- Enable RLS
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Users can view their own cart" ON cart_items;
DROP POLICY IF EXISTS "Users can add to their own cart" ON cart_items;
DROP POLICY IF EXISTS "Users can update their own cart" ON cart_items;
DROP POLICY IF EXISTS "Users can remove from their own cart" ON cart_items;

CREATE POLICY "Users can view their own cart" 
  ON cart_items FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can add to their own cart" 
  ON cart_items FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cart" 
  ON cart_items FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can remove from their own cart" 
  ON cart_items FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- SECTION 11: FOLLOWS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS follows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  follower_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  CHECK (follower_id != following_id),
  UNIQUE(follower_id, following_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS follows_follower_id_idx ON follows(follower_id);
CREATE INDEX IF NOT EXISTS follows_following_id_idx ON follows(following_id);

-- Enable RLS
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Follows are viewable by everyone" ON follows;
DROP POLICY IF EXISTS "Users can follow others" ON follows;
DROP POLICY IF EXISTS "Users can unfollow" ON follows;

CREATE POLICY "Follows are viewable by everyone" 
  ON follows FOR SELECT USING (true);

CREATE POLICY "Users can follow others" 
  ON follows FOR INSERT WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow" 
  ON follows FOR DELETE USING (auth.uid() = follower_id);

-- =============================================
-- SECTION 12: TRIGGER FUNCTIONS
-- =============================================

-- Updated at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
DROP TRIGGER IF EXISTS update_books_updated_at ON books;
DROP TRIGGER IF EXISTS update_reviews_updated_at ON reviews;
DROP TRIGGER IF EXISTS update_cart_items_updated_at ON cart_items;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_books_updated_at
  BEFORE UPDATE ON books
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at
  BEFORE UPDATE ON cart_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- SECTION 13: AUTO-CREATE PROFILE ON SIGNUP
-- =============================================

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, account_type)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(
      NULLIF(NEW.raw_user_meta_data->>'account_type', '')::account_type,
      'reader'
    )
  );
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    RAISE WARNING 'Error creating profile: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =============================================
-- SECTION 14: HELPER FUNCTIONS
-- =============================================

-- Get book with author info
CREATE OR REPLACE FUNCTION get_book_with_author(book_slug TEXT)
RETURNS TABLE (
  book_id UUID,
  title TEXT,
  description TEXT,
  cover_image TEXT,
  price DECIMAL,
  author_name TEXT,
  author_avatar TEXT,
  author_bio TEXT,
  rating DECIMAL,
  review_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    b.id,
    b.title,
    b.description,
    b.cover_image,
    b.price,
    p.full_name,
    p.avatar_url,
    p.bio,
    COALESCE(AVG(r.rating), 0)::DECIMAL,
    COUNT(r.id)
  FROM books b
  JOIN profiles p ON b.author_id = p.id
  LEFT JOIN reviews r ON b.id = r.book_id
  WHERE b.slug = book_slug AND b.status = 'published'
  GROUP BY b.id, p.full_name, p.avatar_url, p.bio;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- DONE! Schema setup complete.
-- =============================================
