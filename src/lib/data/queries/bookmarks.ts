/**
 * Real Data Queries - Bookmarks
 * Supabase query implementations for bookmarks data
 */

import { createClient } from '@/lib/supabase/client';

export interface BookmarkItem {
  id: string;
  title: string;
  author: string;
  authorId: string;
  cover: string;
  price: number;
  rating: number;
  reviewCount: number;
  addedAt: string;
  category: string;
  notes?: string;
  readingProgress?: number;
  format: 'ebook' | 'paperback' | 'hardcover' | 'audiobook';
}

export interface BookmarkFolder {
  id: string;
  name: string;
  color: string;
  count: number;
}

/**
 * Get current user's bookmark folders
 */
export async function getBookmarkFolders(): Promise<BookmarkFolder[]> {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return [];
  }

  // Get custom folders
  const { data: folders, error } = await supabase
    .from('bookmark_folders')
    .select('id, name, color')
    .eq('user_id', user.id)
    .order('name');

  if (error) {
    console.error('[getBookmarkFolders] Error:', error);
  }

  // Get bookmark counts per folder
  const { data: bookmarks } = await supabase
    .from('bookmarks')
    .select('folder')
    .eq('user_id', user.id);

  const folderCounts = new Map<string, number>();
  let totalCount = 0;
  if (bookmarks) {
    for (const b of bookmarks) {
      const folder = b.folder || 'all';
      folderCounts.set(folder, (folderCounts.get(folder) || 0) + 1);
      totalCount++;
    }
  }

  // Build result with "All Bookmarks" first
  const result: BookmarkFolder[] = [
    { id: 'all', name: 'All Bookmarks', color: 'amber', count: totalCount },
  ];

  if (folders) {
    for (const folder of folders) {
      result.push({
        id: folder.id,
        name: folder.name,
        color: folder.color || 'blue',
        count: folderCounts.get(folder.name) || 0,
      });
    }
  }

  return result;
}

/**
 * Get current user's bookmarks, optionally filtered by folder
 */
export async function getBookmarkItems(folderId?: string): Promise<BookmarkItem[]> {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return [];
  }

  let query = supabase
    .from('bookmarks')
    .select(`
      id,
      created_at,
      folder,
      notes,
      book:books!bookmarks_book_id_fkey (
        id,
        title,
        price,
        cover_image,
        author:profiles!books_author_id_fkey (
          id,
          full_name,
          pen_name
        )
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  // Filter by folder if not "all"
  if (folderId && folderId !== 'all') {
    // Need to get folder name from ID
    const { data: folder } = await supabase
      .from('bookmark_folders')
      .select('name')
      .eq('id', folderId)
      .single();
    
    if (folder) {
      query = query.eq('folder', folder.name);
    }
  }

  const { data: bookmarkItems, error } = await query;

  if (error || !bookmarkItems) {
    console.error('[getBookmarkItems] Error:', error);
    return [];
  }

  // Get ratings for all books
  const bookIds = bookmarkItems
    .map(item => {
      const book = item.book as unknown;
      const bookData = Array.isArray(book) ? book[0] : book;
      return (bookData as { id: string } | null)?.id;
    })
    .filter((id): id is string => !!id);

  const { data: reviews } = await supabase
    .from('reviews')
    .select('book_id, rating')
    .in('book_id', bookIds);

  const ratingsByBook = new Map<string, { sum: number; count: number }>();
  if (reviews) {
    for (const review of reviews) {
      const existing = ratingsByBook.get(review.book_id) || { sum: 0, count: 0 };
      existing.sum += review.rating;
      existing.count += 1;
      ratingsByBook.set(review.book_id, existing);
    }
  }

  return bookmarkItems.map((item): BookmarkItem => {
    const bookRaw = item.book as unknown;
    const book = Array.isArray(bookRaw)
      ? (bookRaw as Array<{ id: string; title: string; price: number; cover_image: string | null; author: unknown }>)[0]
      : bookRaw as { id: string; title: string; price: number; cover_image: string | null; author: unknown } | null;

    const authorRaw = book?.author as unknown;
    const author = Array.isArray(authorRaw)
      ? (authorRaw as Array<{ id: string; full_name: string | null; pen_name: string | null }>)[0]
      : authorRaw as { id: string; full_name: string | null; pen_name: string | null } | null;

    const bookId = book?.id || '';
    const stats = ratingsByBook.get(bookId) || { sum: 0, count: 0 };
    const rating = stats.count > 0 ? Math.round((stats.sum / stats.count) * 10) / 10 : 0;

    return {
      id: item.id,
      title: book?.title || 'Unknown Book',
      author: author?.pen_name || author?.full_name || 'Unknown Author',
      authorId: author?.id || '',
      cover: book?.cover_image || '',
      price: book?.price || 9.99,
      rating,
      reviewCount: stats.count,
      addedAt: item.created_at,
      category: item.folder || 'all',
      notes: item.notes || undefined,
      format: 'ebook',
    };
  });
}

/**
 * Add book to bookmarks
 */
export async function addBookmark(bookId: string, folder: string = 'all', notes?: string): Promise<boolean> {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.error('[addBookmark] No authenticated user');
    return false;
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
      console.warn('[addBookmark] Book already bookmarked');
      return true;
    }
    console.error('[addBookmark] Error:', error);
    return false;
  }

  return true;
}

/**
 * Remove bookmark
 */
export async function removeBookmark(bookmarkId: string): Promise<boolean> {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return false;
  }

  const { error } = await supabase
    .from('bookmarks')
    .delete()
    .eq('id', bookmarkId)
    .eq('user_id', user.id);

  if (error) {
    console.error('[removeBookmark] Error:', error);
    return false;
  }

  return true;
}

/**
 * Update bookmark (move to folder, update notes)
 */
export async function updateBookmark(bookmarkId: string, updates: { folder?: string; notes?: string }): Promise<boolean> {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return false;
  }

  const { error } = await supabase
    .from('bookmarks')
    .update(updates)
    .eq('id', bookmarkId)
    .eq('user_id', user.id);

  if (error) {
    console.error('[updateBookmark] Error:', error);
    return false;
  }

  return true;
}

/**
 * Check if a book is bookmarked
 */
export async function isBookBookmarked(bookId: string): Promise<boolean> {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return false;
  }

  const { data, error } = await supabase
    .from('bookmarks')
    .select('id')
    .eq('user_id', user.id)
    .eq('book_id', bookId)
    .single();

  if (error || !data) {
    return false;
  }

  return true;
}

/**
 * Get bookmark count
 */
export async function getBookmarkCount(): Promise<number> {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return 0;
  }

  const { count, error } = await supabase
    .from('bookmarks')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id);

  if (error) {
    console.error('[getBookmarkCount] Error:', error);
    return 0;
  }

  return count || 0;
}

/**
 * Create a new bookmark folder
 */
export async function createBookmarkFolder(name: string, color: string = 'blue'): Promise<string | null> {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from('bookmark_folders')
    .insert({
      user_id: user.id,
      name,
      color,
    })
    .select('id')
    .single();

  if (error) {
    console.error('[createBookmarkFolder] Error:', error);
    return null;
  }

  return data?.id || null;
}

/**
 * Update bookmark folder
 */
export async function updateBookmarkFolder(folderId: string, updates: { name?: string; color?: string }): Promise<boolean> {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return false;
  }

  const { error } = await supabase
    .from('bookmark_folders')
    .update(updates)
    .eq('id', folderId)
    .eq('user_id', user.id);

  if (error) {
    console.error('[updateBookmarkFolder] Error:', error);
    return false;
  }

  return true;
}

/**
 * Delete bookmark folder
 */
export async function deleteBookmarkFolder(folderId: string): Promise<boolean> {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return false;
  }

  // First update bookmarks in this folder to 'all'
  const { data: folder } = await supabase
    .from('bookmark_folders')
    .select('name')
    .eq('id', folderId)
    .single();

  if (folder) {
    await supabase
      .from('bookmarks')
      .update({ folder: 'all' })
      .eq('user_id', user.id)
      .eq('folder', folder.name);
  }

  const { error } = await supabase
    .from('bookmark_folders')
    .delete()
    .eq('id', folderId)
    .eq('user_id', user.id);

  if (error) {
    console.error('[deleteBookmarkFolder] Error:', error);
    return false;
  }

  return true;
}
