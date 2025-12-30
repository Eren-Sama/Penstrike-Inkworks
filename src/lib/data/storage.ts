'use server';

/**
 * Storage Upload Functions
 * 
 * These server actions handle file uploads to Supabase Storage.
 * They enforce:
 * - Authentication
 * - Ownership validation
 * - MIME type validation
 * - File size limits
 * - Safe file naming
 */

import { createClient } from '@/lib/supabase/server';
import { isUsingMockData } from '@/lib/env';

// Allowed image MIME types (no GIF - only static images)
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// File size limits
const AVATAR_MAX_SIZE = 2 * 1024 * 1024; // 2MB
const BOOK_COVER_MAX_SIZE = 5 * 1024 * 1024; // 5MB

// Allowed extensions (must match MIME types)
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];

interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Validate file before upload
 */
function validateFile(
  file: File,
  maxSize: number,
  allowedTypes: string[]
): { valid: boolean; error?: string } {
  // Check file exists
  if (!file || file.size === 0) {
    return { valid: false, error: 'No file provided' };
  }

  // Check file size
  if (file.size > maxSize) {
    const maxMB = Math.round(maxSize / 1024 / 1024);
    return { valid: false, error: `File too large. Maximum size is ${maxMB}MB` };
  }

  // Check MIME type
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Invalid file type. Only images are allowed' };
  }

  // Check file extension
  const ext = file.name.split('.').pop()?.toLowerCase();
  if (!ext || !ALLOWED_EXTENSIONS.includes(ext)) {
    return { valid: false, error: 'Invalid file extension' };
  }

  return { valid: true };
}

/**
 * Sanitize filename to prevent path traversal attacks
 */
function sanitizeExtension(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  // Only allow specific extensions
  if (ext && ALLOWED_EXTENSIONS.includes(ext)) {
    // Normalize jpeg to jpg
    return ext === 'jpeg' ? 'jpg' : ext;
  }
  return 'jpg'; // Default to jpg if invalid
}

/**
 * Upload a user's avatar image
 * 
 * - Only the authenticated user can upload their own avatar
 * - File path is: {userId}.{extension}
 * - Overwrites existing avatar (upsert)
 * - Updates profile.avatar_url in database
 */
export async function uploadAvatarImage(formData: FormData): Promise<UploadResult> {
  // In mock mode, return a fake success
  if (isUsingMockData()) {
    console.log('[Mock] uploadAvatarImage called');
    return { 
      success: true, 
      url: '/api/placeholder/200/200' 
    };
  }

  const supabase = await createClient();
  
  // Verify authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { success: false, error: 'Not authenticated' };
  }

  // Get file from form data
  const file = formData.get('file') as File | null;
  if (!file) {
    return { success: false, error: 'No file provided' };
  }

  // Validate file
  const validation = validateFile(file, AVATAR_MAX_SIZE, ALLOWED_IMAGE_TYPES);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  // Create safe file path: {userId}.{extension}
  const ext = sanitizeExtension(file.name);
  const filePath = `${user.id}.${ext}`;

  try {
    // Upload to Supabase Storage (avatars bucket)
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { 
        upsert: true,
        contentType: file.type 
      });

    if (uploadError) {
      console.error('[uploadAvatarImage] Upload error:', uploadError);
      return { success: false, error: 'Failed to upload image' };
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    // Update profile with new avatar URL
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ 
        avatar_url: publicUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('[uploadAvatarImage] Profile update error:', updateError);
      return { success: false, error: 'Failed to update profile' };
    }

    return { success: true, url: publicUrl };
  } catch (error) {
    console.error('[uploadAvatarImage] Unexpected error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Upload a book cover image
 * 
 * - Only the book's author can upload its cover
 * - File path is: {bookId}.{extension}
 * - Overwrites existing cover (upsert)
 * - Updates book.cover_image in database
 */
export async function uploadBookCoverImage(
  bookId: string,
  formData: FormData
): Promise<UploadResult> {
  // In mock mode, return a fake success
  if (isUsingMockData()) {
    console.log('[Mock] uploadBookCoverImage called for book:', bookId);
    return { 
      success: true, 
      url: '/api/placeholder/300/400' 
    };
  }

  // Validate bookId format (must be UUID)
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(bookId)) {
    return { success: false, error: 'Invalid book ID' };
  }

  const supabase = await createClient();
  
  // Verify authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { success: false, error: 'Not authenticated' };
  }

  // Verify book ownership
  const { data: book, error: bookError } = await supabase
    .from('books')
    .select('id, author_id')
    .eq('id', bookId)
    .single();

  if (bookError || !book) {
    return { success: false, error: 'Book not found' };
  }

  if (book.author_id !== user.id) {
    return { success: false, error: 'Not authorized to modify this book' };
  }

  // Get file from form data
  const file = formData.get('file') as File | null;
  if (!file) {
    return { success: false, error: 'No file provided' };
  }

  // Validate file
  const validation = validateFile(file, BOOK_COVER_MAX_SIZE, ALLOWED_IMAGE_TYPES);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  // Create safe file path: {bookId}.{extension}
  const ext = sanitizeExtension(file.name);
  const filePath = `${bookId}.${ext}`;

  try {
    // Upload to Supabase Storage (book-covers bucket)
    const { error: uploadError } = await supabase.storage
      .from('book-covers')
      .upload(filePath, file, { 
        upsert: true,
        contentType: file.type 
      });

    if (uploadError) {
      console.error('[uploadBookCoverImage] Upload error:', uploadError);
      return { success: false, error: 'Failed to upload image' };
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('book-covers')
      .getPublicUrl(filePath);

    // Update book with new cover URL
    const { error: updateError } = await supabase
      .from('books')
      .update({ 
        cover_image: publicUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', bookId)
      .eq('author_id', user.id); // Double-check ownership

    if (updateError) {
      console.error('[uploadBookCoverImage] Book update error:', updateError);
      return { success: false, error: 'Failed to update book' };
    }

    return { success: true, url: publicUrl };
  } catch (error) {
    console.error('[uploadBookCoverImage] Unexpected error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Delete a user's avatar image
 */
export async function deleteAvatarImage(): Promise<UploadResult> {
  // In mock mode, return a fake success
  if (isUsingMockData()) {
    console.log('[Mock] deleteAvatarImage called');
    return { success: true };
  }

  const supabase = await createClient();
  
  // Verify authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { success: false, error: 'Not authenticated' };
  }

  try {
    // List all files for this user to find their avatar
    const { data: files } = await supabase.storage
      .from('avatars')
      .list('', { search: user.id });

    if (files && files.length > 0) {
      // Delete all files matching this user's ID
      const filesToDelete = files
        .filter(f => f.name.startsWith(user.id))
        .map(f => f.name);

      if (filesToDelete.length > 0) {
        await supabase.storage
          .from('avatars')
          .remove(filesToDelete);
      }
    }

    // Clear avatar_url in profile
    await supabase
      .from('profiles')
      .update({ 
        avatar_url: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

    return { success: true };
  } catch (error) {
    console.error('[deleteAvatarImage] Error:', error);
    return { success: false, error: 'Failed to delete avatar' };
  }
}

/**
 * Delete a book's cover image
 */
export async function deleteBookCoverImage(bookId: string): Promise<UploadResult> {
  // In mock mode, return a fake success
  if (isUsingMockData()) {
    console.log('[Mock] deleteBookCoverImage called for book:', bookId);
    return { success: true };
  }

  // Validate bookId format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(bookId)) {
    return { success: false, error: 'Invalid book ID' };
  }

  const supabase = await createClient();
  
  // Verify authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { success: false, error: 'Not authenticated' };
  }

  // Verify book ownership
  const { data: book } = await supabase
    .from('books')
    .select('id, author_id')
    .eq('id', bookId)
    .single();

  if (!book || book.author_id !== user.id) {
    return { success: false, error: 'Not authorized' };
  }

  try {
    // List all files for this book
    const { data: files } = await supabase.storage
      .from('book-covers')
      .list('', { search: bookId });

    if (files && files.length > 0) {
      const filesToDelete = files
        .filter(f => f.name.startsWith(bookId))
        .map(f => f.name);

      if (filesToDelete.length > 0) {
        await supabase.storage
          .from('book-covers')
          .remove(filesToDelete);
      }
    }

    // Clear cover_image in book record
    await supabase
      .from('books')
      .update({ 
        cover_image: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', bookId)
      .eq('author_id', user.id);

    return { success: true };
  } catch (error) {
    console.error('[deleteBookCoverImage] Error:', error);
    return { success: false, error: 'Failed to delete cover image' };
  }
}
