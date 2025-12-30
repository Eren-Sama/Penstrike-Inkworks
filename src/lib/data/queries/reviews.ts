/**
 * Real Data Queries - Reviews
 * Supabase query implementations for reviews data
 */

import { createClient } from '@/lib/supabase/client';

export interface UserReview {
  id: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  bookCover: string;
  rating: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  status: 'published' | 'pending' | 'draft';
  helpfulCount: number;
  commentsCount: number;
}

export interface PendingReviewBook {
  id: string;
  title: string;
  author: string;
  cover: string;
  purchasedAt: string;
}

/**
 * Get current user's reviews
 */
export async function getUserReviews(): Promise<UserReview[]> {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return [];
  }

  const { data: reviews, error } = await supabase
    .from('reviews')
    .select(`
      id,
      rating,
      title,
      content,
      created_at,
      updated_at,
      book:books!reviews_book_id_fkey (
        id,
        title,
        cover_image,
        author:profiles!books_author_id_fkey (
          full_name,
          pen_name
        )
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error || !reviews) {
    console.error('[getUserReviews] Error:', error);
    return [];
  }

  return reviews.map((review): UserReview => {
    const bookRaw = review.book as unknown;
    const book = Array.isArray(bookRaw)
      ? (bookRaw as Array<{ id: string; title: string; cover_image: string | null; author: unknown }>)[0]
      : bookRaw as { id: string; title: string; cover_image: string | null; author: unknown } | null;

    const authorRaw = book?.author as unknown;
    const author = Array.isArray(authorRaw)
      ? (authorRaw as Array<{ full_name: string | null; pen_name: string | null }>)[0]
      : authorRaw as { full_name: string | null; pen_name: string | null } | null;

    return {
      id: review.id,
      bookId: book?.id || '',
      bookTitle: book?.title || 'Unknown Book',
      bookAuthor: author?.pen_name || author?.full_name || 'Unknown Author',
      bookCover: book?.cover_image || '',
      rating: review.rating,
      title: review.title || '',
      content: review.content || '',
      createdAt: review.created_at,
      updatedAt: review.updated_at || undefined,
      status: 'published', // All submitted reviews are published
      helpfulCount: 0, // Would need helpful_votes table
      commentsCount: 0, // Would need review_comments table
    };
  });
}

/**
 * Get books the user has purchased but not reviewed
 */
export async function getPendingReviewBooks(): Promise<PendingReviewBook[]> {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return [];
  }

  // Get user's purchased books
  const { data: purchases, error: purchaseError } = await supabase
    .from('purchases')
    .select(`
      created_at,
      book:books!purchases_book_id_fkey (
        id,
        title,
        cover_image,
        author:profiles!books_author_id_fkey (
          full_name,
          pen_name
        )
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (purchaseError || !purchases) {
    console.error('[getPendingReviewBooks] Purchase error:', purchaseError);
    return [];
  }

  // Get user's existing reviews
  const { data: existingReviews } = await supabase
    .from('reviews')
    .select('book_id')
    .eq('user_id', user.id);

  const reviewedBookIds = new Set((existingReviews || []).map(r => r.book_id));

  // Filter to books not yet reviewed
  return purchases
    .filter(purchase => {
      const bookRaw = purchase.book as unknown;
      const book = Array.isArray(bookRaw) ? bookRaw[0] : bookRaw;
      const bookId = (book as { id: string } | null)?.id;
      return bookId && !reviewedBookIds.has(bookId);
    })
    .map((purchase): PendingReviewBook => {
      const bookRaw = purchase.book as unknown;
      const book = Array.isArray(bookRaw)
        ? (bookRaw as Array<{ id: string; title: string; cover_image: string | null; author: unknown }>)[0]
        : bookRaw as { id: string; title: string; cover_image: string | null; author: unknown } | null;

      const authorRaw = book?.author as unknown;
      const author = Array.isArray(authorRaw)
        ? (authorRaw as Array<{ full_name: string | null; pen_name: string | null }>)[0]
        : authorRaw as { full_name: string | null; pen_name: string | null } | null;

      return {
        id: book?.id || '',
        title: book?.title || 'Unknown Book',
        author: author?.pen_name || author?.full_name || 'Unknown Author',
        cover: book?.cover_image || '',
        purchasedAt: purchase.created_at,
      };
    });
}

/**
 * Submit a new review
 */
export async function submitReview(
  bookId: string,
  rating: number,
  title: string,
  content: string
): Promise<string | null> {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.error('[submitReview] No authenticated user');
    return null;
  }

  // Check if user has purchased the book
  const { data: purchase } = await supabase
    .from('purchases')
    .select('id')
    .eq('user_id', user.id)
    .eq('book_id', bookId)
    .single();

  const isVerifiedPurchase = !!purchase;

  const { data, error } = await supabase
    .from('reviews')
    .insert({
      user_id: user.id,
      book_id: bookId,
      rating,
      title,
      content,
      is_verified_purchase: isVerifiedPurchase,
    })
    .select('id')
    .single();

  if (error) {
    if (error.code === '23505') {
      console.warn('[submitReview] User already reviewed this book');
      return null;
    }
    console.error('[submitReview] Error:', error);
    return null;
  }

  return data?.id || null;
}

/**
 * Update an existing review
 */
export async function updateReview(
  reviewId: string,
  updates: { rating?: number; title?: string; content?: string }
): Promise<boolean> {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return false;
  }

  const { error } = await supabase
    .from('reviews')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', reviewId)
    .eq('user_id', user.id);

  if (error) {
    console.error('[updateReview] Error:', error);
    return false;
  }

  return true;
}

/**
 * Delete a review
 */
export async function deleteReview(reviewId: string): Promise<boolean> {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return false;
  }

  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', reviewId)
    .eq('user_id', user.id);

  if (error) {
    console.error('[deleteReview] Error:', error);
    return false;
  }

  return true;
}

/**
 * Get user's review for a specific book
 */
export async function getUserReviewForBook(bookId: string): Promise<UserReview | null> {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return null;
  }

  const { data: review, error } = await supabase
    .from('reviews')
    .select(`
      id,
      rating,
      title,
      content,
      created_at,
      updated_at,
      book:books!reviews_book_id_fkey (
        id,
        title,
        cover_image,
        author:profiles!books_author_id_fkey (
          full_name,
          pen_name
        )
      )
    `)
    .eq('user_id', user.id)
    .eq('book_id', bookId)
    .single();

  if (error || !review) {
    return null;
  }

  const bookRaw = review.book as unknown;
  const book = Array.isArray(bookRaw)
    ? (bookRaw as Array<{ id: string; title: string; cover_image: string | null; author: unknown }>)[0]
    : bookRaw as { id: string; title: string; cover_image: string | null; author: unknown } | null;

  const authorRaw = book?.author as unknown;
  const author = Array.isArray(authorRaw)
    ? (authorRaw as Array<{ full_name: string | null; pen_name: string | null }>)[0]
    : authorRaw as { full_name: string | null; pen_name: string | null } | null;

  return {
    id: review.id,
    bookId: book?.id || '',
    bookTitle: book?.title || 'Unknown Book',
    bookAuthor: author?.pen_name || author?.full_name || 'Unknown Author',
    bookCover: book?.cover_image || '',
    rating: review.rating,
    title: review.title || '',
    content: review.content || '',
    createdAt: review.created_at,
    updatedAt: review.updated_at || undefined,
    status: 'published',
    helpfulCount: 0,
    commentsCount: 0,
  };
}

/**
 * Check if user has reviewed a book
 */
export async function hasUserReviewedBook(bookId: string): Promise<boolean> {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return false;
  }

  const { data, error } = await supabase
    .from('reviews')
    .select('id')
    .eq('user_id', user.id)
    .eq('book_id', bookId)
    .single();

  return !error && !!data;
}

/**
 * Get review count for user
 */
export async function getUserReviewCount(): Promise<number> {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return 0;
  }

  const { count, error } = await supabase
    .from('reviews')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id);

  if (error) {
    console.error('[getUserReviewCount] Error:', error);
    return 0;
  }

  return count || 0;
}
