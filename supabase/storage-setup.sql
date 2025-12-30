-- =============================================
-- PENSTRIKE INKWORKS - STORAGE SETUP
-- Run this file in Supabase SQL Editor after schema.sql
-- Last updated: December 29, 2025
-- =============================================

-- =============================================
-- SECTION 1: CREATE STORAGE BUCKETS
-- =============================================

-- Create avatars bucket for user profile pictures
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  2097152, -- 2MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 2097152,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

-- Create book-covers bucket for book cover images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'book-covers',
  'book-covers',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

-- =============================================
-- SECTION 2: STORAGE POLICIES FOR AVATARS
-- =============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;

-- Policy: Anyone can view avatars (public read)
CREATE POLICY "Avatar images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- Policy: Users can only upload their own avatar
-- Path format: {user_id}.{extension} (at bucket root)
CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.uid() IS NOT NULL
  AND name LIKE auth.uid()::text || '.%'
);

-- Policy: Users can only update their own avatar
CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars'
  AND auth.uid() IS NOT NULL
  AND name LIKE auth.uid()::text || '.%'
);

-- Policy: Users can only delete their own avatar
CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars'
  AND auth.uid() IS NOT NULL
  AND name LIKE auth.uid()::text || '.%'
);

-- =============================================
-- SECTION 3: STORAGE POLICIES FOR BOOK COVERS
-- =============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Book covers are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Authors can upload book covers for their books" ON storage.objects;
DROP POLICY IF EXISTS "Authors can update book covers for their books" ON storage.objects;
DROP POLICY IF EXISTS "Authors can delete book covers for their books" ON storage.objects;

-- Policy: Anyone can view book covers (public read)
CREATE POLICY "Book covers are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'book-covers');

-- Policy: Authors can upload covers only for books they own
-- Path format: book-covers/{book_id}.{extension}
-- The book_id must exist in books table with author_id matching current user
CREATE POLICY "Authors can upload book covers for their books"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'book-covers'
  AND auth.uid() IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM public.books
    WHERE books.author_id = auth.uid()
    AND name LIKE books.id::text || '.%'
  )
);

-- Policy: Authors can update covers only for their own books
CREATE POLICY "Authors can update book covers for their books"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'book-covers'
  AND auth.uid() IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM public.books
    WHERE books.author_id = auth.uid()
    AND name LIKE books.id::text || '.%'
  )
);

-- Policy: Authors can delete covers only for their own books
CREATE POLICY "Authors can delete book covers for their books"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'book-covers'
  AND auth.uid() IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM public.books
    WHERE books.author_id = auth.uid()
    AND name LIKE books.id::text || '.%'
  )
);

-- =============================================
-- SECTION 4: VERIFICATION QUERIES
-- =============================================

-- Verify buckets were created
-- SELECT * FROM storage.buckets WHERE id IN ('avatars', 'book-covers');

-- Verify policies exist
-- SELECT policyname, tablename, permissive, roles, cmd, qual, with_check
-- FROM pg_policies 
-- WHERE tablename = 'objects' AND schemaname = 'storage';

-- =============================================
-- DONE! Storage setup complete.
-- =============================================
