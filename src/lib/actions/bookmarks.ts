'use server';

import { createClient } from '@/lib/supabase/server';

// Get user's bookmarks
export async function getBookmarks(folderId?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated', bookmarks: [] };
  }

  let query = supabase
    .from('bookmarks')
    .select(`
      *,
      book:books (
        id,
        title,
        slug,
        price,
        cover_image,
        genre,
        author:profiles (
          full_name,
          pen_name
        )
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (folderId && folderId !== 'all') {
    query = query.eq('folder', folderId);
  }

  const { data: bookmarks, error } = await query;

  if (error) {
    return { error: error.message, bookmarks: [] };
  }

  return { bookmarks: bookmarks || [] };
}

// Add bookmark
export async function addBookmark(bookId: string, folder: string = 'all', notes?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  const { error } = await supabase
    .from('bookmarks')
    .insert({
      user_id: user.id,
      book_id: bookId,
      folder,
      notes,
    });

  if (error) {
    if (error.code === '23505') {
      return { error: 'Already bookmarked' };
    }
    return { error: error.message };
  }

  return { success: true };
}

// Remove bookmark
export async function removeBookmark(bookmarkId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  const { error } = await supabase
    .from('bookmarks')
    .delete()
    .eq('id', bookmarkId)
    .eq('user_id', user.id);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

// Update bookmark (move to folder, add notes)
export async function updateBookmark(bookmarkId: string, updates: { folder?: string; notes?: string }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  const { error } = await supabase
    .from('bookmarks')
    .update(updates)
    .eq('id', bookmarkId)
    .eq('user_id', user.id);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

// Check if a book is bookmarked
export async function isBookmarked(bookId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { bookmarked: false };
  }

  const { data } = await supabase
    .from('bookmarks')
    .select('id')
    .eq('user_id', user.id)
    .eq('book_id', bookId)
    .single();

  return { bookmarked: !!data, bookmarkId: data?.id };
}

// Get bookmark folders
export async function getBookmarkFolders() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { folders: [] };
  }

  const { data: folders, error } = await supabase
    .from('bookmark_folders')
    .select('*')
    .eq('user_id', user.id)
    .order('name');

  if (error) {
    return { folders: [] };
  }

  return { folders: folders || [] };
}

// Create folder
export async function createBookmarkFolder(name: string, color: string = 'amber') {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  const { data, error } = await supabase
    .from('bookmark_folders')
    .insert({
      user_id: user.id,
      name,
      color,
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  return { success: true, folder: data };
}

// Delete folder
export async function deleteBookmarkFolder(folderId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  // Move bookmarks to 'all' folder before deleting
  await supabase
    .from('bookmarks')
    .update({ folder: 'all' })
    .eq('user_id', user.id)
    .eq('folder', folderId);

  const { error } = await supabase
    .from('bookmark_folders')
    .delete()
    .eq('id', folderId)
    .eq('user_id', user.id);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
