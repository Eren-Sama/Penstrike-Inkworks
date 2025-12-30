-- =============================================
-- STEP 4 (OPTIONAL): Run this to create books and other tables
-- =============================================

-- Books table
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

-- Enable RLS
ALTER TABLE books ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Published books are viewable by everyone" ON books;
DROP POLICY IF EXISTS "Authors can insert their own books" ON books;
DROP POLICY IF EXISTS "Authors can update their own books" ON books;
DROP POLICY IF EXISTS "Authors can delete their own books" ON books;

CREATE POLICY "Published books are viewable by everyone" 
  ON books FOR SELECT 
  USING (status = 'published' OR auth.uid() = author_id);

CREATE POLICY "Authors can insert their own books" 
  ON books FOR INSERT 
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update their own books" 
  ON books FOR UPDATE 
  USING (auth.uid() = author_id);

CREATE POLICY "Authors can delete their own books" 
  ON books FOR DELETE 
  USING (auth.uid() = author_id);

-- Wishlists table
CREATE TABLE IF NOT EXISTS wishlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  UNIQUE(user_id, book_id)
);

ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own wishlist" ON wishlists;
DROP POLICY IF EXISTS "Users can add to their own wishlist" ON wishlists;
DROP POLICY IF EXISTS "Users can remove from their own wishlist" ON wishlists;

CREATE POLICY "Users can view their own wishlist" 
  ON wishlists FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add to their own wishlist" 
  ON wishlists FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove from their own wishlist" 
  ON wishlists FOR DELETE 
  USING (auth.uid() = user_id);

-- Follows table
CREATE TABLE IF NOT EXISTS follows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  follower_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  CHECK (follower_id != following_id),
  UNIQUE(follower_id, following_id)
);

ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Follows are viewable by everyone" ON follows;
DROP POLICY IF EXISTS "Users can follow others" ON follows;
DROP POLICY IF EXISTS "Users can unfollow" ON follows;

CREATE POLICY "Follows are viewable by everyone" 
  ON follows FOR SELECT 
  USING (true);

CREATE POLICY "Users can follow others" 
  ON follows FOR INSERT 
  WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow" 
  ON follows FOR DELETE 
  USING (auth.uid() = follower_id);

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

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_books_updated_at
  BEFORE UPDATE ON books
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
