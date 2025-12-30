/**
 * Real Data Queries - Wishlist
 * Supabase query implementations for wishlist data
 */

import { createClient } from '@/lib/supabase/client';

export interface WishlistItem {
  id: string;
  title: string;
  author: string;
  authorId: string;
  cover: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  addedAt: string;
  inStock: boolean;
  format: 'ebook' | 'paperback' | 'hardcover' | 'audiobook';
  notifyPrice: boolean;
}

/**
 * Get current user's wishlist items
 */
export async function getWishlistItems(): Promise<WishlistItem[]> {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return [];
  }

  const { data: wishlistItems, error } = await supabase
    .from('wishlists')
    .select(`
      id,
      created_at,
      book:books!wishlists_book_id_fkey (
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

  if (error || !wishlistItems) {
    console.error('[getWishlistItems] Supabase error:', error);
    return [];
  }

  // Get ratings for all books
  const bookIds = wishlistItems
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

  return wishlistItems.map((item): WishlistItem => {
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
      inStock: true, // Would need inventory tracking
      format: 'ebook', // Default format
      notifyPrice: false, // Would need notification preferences table
    };
  });
}

/**
 * Add book to wishlist
 */
export async function addToWishlist(bookId: string): Promise<boolean> {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.error('[addToWishlist] No authenticated user');
    return false;
  }

  const { error } = await supabase
    .from('wishlists')
    .insert({
      user_id: user.id,
      book_id: bookId,
    });

  if (error) {
    // Unique constraint violation means already in wishlist
    if (error.code === '23505') {
      console.warn('[addToWishlist] Book already in wishlist');
      return true;
    }
    console.error('[addToWishlist] Error:', error);
    return false;
  }

  return true;
}

/**
 * Remove book from wishlist
 */
export async function removeFromWishlist(wishlistItemId: string): Promise<boolean> {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return false;
  }

  const { error } = await supabase
    .from('wishlists')
    .delete()
    .eq('id', wishlistItemId)
    .eq('user_id', user.id);

  if (error) {
    console.error('[removeFromWishlist] Error:', error);
    return false;
  }

  return true;
}

/**
 * Remove book from wishlist by book ID
 */
export async function removeBookFromWishlist(bookId: string): Promise<boolean> {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return false;
  }

  const { error } = await supabase
    .from('wishlists')
    .delete()
    .eq('book_id', bookId)
    .eq('user_id', user.id);

  if (error) {
    console.error('[removeBookFromWishlist] Error:', error);
    return false;
  }

  return true;
}

/**
 * Check if a book is in user's wishlist
 */
export async function isBookInWishlist(bookId: string): Promise<boolean> {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return false;
  }

  const { data, error } = await supabase
    .from('wishlists')
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
 * Get wishlist item count
 */
export async function getWishlistCount(): Promise<number> {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return 0;
  }

  const { count, error } = await supabase
    .from('wishlists')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id);

  if (error) {
    console.error('[getWishlistCount] Error:', error);
    return 0;
  }

  return count || 0;
}

/**
 * Move wishlist item to cart
 */
export async function moveWishlistToCart(wishlistItemId: string, bookId: string, format: string = 'EBOOK'): Promise<boolean> {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return false;
  }

  // Add to cart
  const { error: cartError } = await supabase
    .from('cart_items')
    .upsert({
      user_id: user.id,
      book_id: bookId,
      format,
      quantity: 1,
    }, {
      onConflict: 'user_id,book_id,format',
    });

  if (cartError) {
    console.error('[moveWishlistToCart] Cart error:', cartError);
    return false;
  }

  // Remove from wishlist
  const { error: wishlistError } = await supabase
    .from('wishlists')
    .delete()
    .eq('id', wishlistItemId)
    .eq('user_id', user.id);

  if (wishlistError) {
    console.error('[moveWishlistToCart] Wishlist error:', wishlistError);
    // Item is in cart, so return success anyway
  }

  return true;
}
