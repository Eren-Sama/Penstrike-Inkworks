/**
 * Real Data Queries - Books
 * Supabase implementations for book data
 */

import { createClient } from '@/lib/supabase/client';
import type { Book, BookListItem, Review, RelatedBook, Genre } from '../types';

/**
 * Get all books for the bookstore listing
 * Returns published books with author info, ratings computed from reviews
 */
export async function getBooks(): Promise<BookListItem[]> {
  const supabase = createClient();
  
  // Query published books with author info
  const { data: books, error } = await supabase
    .from('books')
    .select(`
      id,
      title,
      description,
      cover_image,
      price,
      genre,
      tags,
      status,
      published_at,
      created_at,
      author:profiles!books_author_id_fkey (
        id,
        full_name,
        pen_name,
        avatar_url,
        is_verified
      )
    `)
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error) {
    console.error('[getBooks] Supabase error:', error);
    return [];
  }

  if (!books || books.length === 0) {
    return [];
  }

  // Get review stats for all books in one query
  const bookIds = books.map(b => b.id);
  const { data: reviewStats } = await supabase
    .from('reviews')
    .select('book_id, rating')
    .in('book_id', bookIds);

  // Calculate average ratings and counts per book
  const ratingsByBook = new Map<string, { sum: number; count: number }>();
  if (reviewStats) {
    for (const review of reviewStats) {
      const existing = ratingsByBook.get(review.book_id) || { sum: 0, count: 0 };
      existing.sum += review.rating;
      existing.count += 1;
      ratingsByBook.set(review.book_id, existing);
    }
  }

  // Transform to BookListItem format
  return books.map((book): BookListItem => {
    const ratings = ratingsByBook.get(book.id);
    const averageRating = ratings ? Math.round((ratings.sum / ratings.count) * 10) / 10 : 0;
    const reviewCount = ratings?.count || 0;
    
    // Parse genre - could be string or array in DB
    const genreArray = Array.isArray(book.genre) 
      ? book.genre 
      : book.genre 
        ? [book.genre] 
        : [];

    // Determine if bestseller (more than 10 reviews with 4.5+ rating)
    const isBestseller = reviewCount >= 10 && averageRating >= 4.5;
    
    // Determine if new (published in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const isNew = book.published_at 
      ? new Date(book.published_at) > thirtyDaysAgo 
      : false;

    // Generate cover gradient based on genre or random
    const gradients = [
      'from-emerald-600 to-teal-800',
      'from-amber-500 to-orange-700',
      'from-blue-600 to-indigo-800',
      'from-rose-500 to-pink-700',
      'from-purple-600 to-violet-800',
      'from-ink-700 to-ink-900',
    ];
    const gradientIndex = book.id.charCodeAt(0) % gradients.length;
    const coverGradient = gradients[gradientIndex];

    // Supabase returns joined relations as arrays, get first item
    const authorArray = book.author as unknown as Array<{ id: string; full_name: string; pen_name: string | null; avatar_url: string | null; is_verified: boolean }> | null;
    const author = Array.isArray(authorArray) ? authorArray[0] : null;

    return {
      id: book.id,
      title: book.title,
      author: {
        id: author?.id || '',
        penName: author?.pen_name || author?.full_name || 'Unknown Author',
        name: author?.full_name || 'Unknown Author',
        avatar: author?.avatar_url || null,
        isVerified: author?.is_verified || false,
      },
      coverImage: book.cover_image,
      coverGradient,
      genre: genreArray,
      averageRating,
      reviewCount,
      description: book.description || '',
      formats: [
        { format: 'EBOOK', price: book.price || 9.99 },
        { format: 'PAPERBACK', price: (book.price || 9.99) + 7 },
      ],
      isBestseller,
      isNew,
    };
  });
}

/**
 * Get a single book by ID with full details
 */
export async function getBookById(id: string): Promise<Book | null> {
  const supabase = createClient();
  
  const { data: book, error } = await supabase
    .from('books')
    .select(`
      id,
      title,
      description,
      cover_image,
      price,
      genre,
      tags,
      status,
      published_at,
      page_count,
      isbn,
      language,
      author:profiles!books_author_id_fkey (
        id,
        full_name,
        pen_name,
        avatar_url,
        bio,
        is_verified
      )
    `)
    .eq('id', id)
    .single();

  if (error || !book) {
    console.error('[getBookById] Supabase error:', error);
    return null;
  }

  // Get review stats
  const { data: reviews } = await supabase
    .from('reviews')
    .select('rating')
    .eq('book_id', id);

  const reviewCount = reviews?.length || 0;
  const averageRating = reviews && reviews.length > 0
    ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10
    : 0;

  // Get author's book count - handle Supabase joined relation (can be array or object)
  const authorRaw = book.author as unknown;
  const author = Array.isArray(authorRaw) 
    ? (authorRaw as Array<{ id: string; full_name: string; pen_name: string | null; avatar_url: string | null; bio: string | null; is_verified: boolean }>)[0] 
    : authorRaw as { id: string; full_name: string; pen_name: string | null; avatar_url: string | null; bio: string | null; is_verified: boolean } | null;
  
  let authorBooksCount = 0;
  if (author?.id) {
    const { count } = await supabase
      .from('books')
      .select('id', { count: 'exact', head: true })
      .eq('author_id', author.id)
      .eq('status', 'published');
    authorBooksCount = count || 0;
  }

  // Get follower count for author
  let followersCount = 0;
  if (author?.id) {
    const { count } = await supabase
      .from('follows')
      .select('id', { count: 'exact', head: true })
      .eq('following_id', author.id);
    followersCount = count || 0;
  }

  const genreArray = Array.isArray(book.genre) 
    ? book.genre 
    : book.genre 
      ? [book.genre] 
      : [];

  const gradients = [
    'from-emerald-600 to-teal-800',
    'from-amber-500 to-orange-700',
    'from-blue-600 to-indigo-800',
    'from-rose-500 to-pink-700',
    'from-purple-600 to-violet-800',
    'from-ink-700 to-ink-900',
  ];
  const gradientIndex = book.id.charCodeAt(0) % gradients.length;

  const isBestseller = reviewCount >= 10 && averageRating >= 4.5;
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const isNew = book.published_at 
    ? new Date(book.published_at) > thirtyDaysAgo 
    : false;

  return {
    id: book.id,
    title: book.title,
    author: {
      id: author?.id || '',
      penName: author?.pen_name || author?.full_name || 'Unknown Author',
      name: author?.full_name || 'Unknown Author',
      avatar: author?.avatar_url || null,
      bio: author?.bio || undefined,
      booksCount: authorBooksCount,
      followersCount,
      isVerified: author?.is_verified || false,
    },
    coverImage: book.cover_image,
    coverGradient: gradients[gradientIndex],
    genre: genreArray,
    averageRating,
    reviewCount,
    description: book.description || '',
    formats: [
      { format: 'EBOOK', price: book.price || 9.99, available: true },
      { format: 'PAPERBACK', price: (book.price || 9.99) + 7, available: true },
    ],
    isBestseller,
    isNew,
    publishedDate: book.published_at || undefined,
    pageCount: book.page_count || undefined,
    language: book.language || 'English',
    isbn: book.isbn || undefined,
    publisher: 'Penstrike Publishing',
    previewAvailable: true,
    sampleChapters: 3,
  };
}

/**
 * Get reviews for a book
 */
export async function getBookReviews(bookId: string): Promise<Review[]> {
  const supabase = createClient();
  
  const { data: reviews, error } = await supabase
    .from('reviews')
    .select(`
      id,
      rating,
      title,
      content,
      created_at,
      is_verified_purchase,
      user:profiles!reviews_user_id_fkey (
        full_name,
        avatar_url
      )
    `)
    .eq('book_id', bookId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[getBookReviews] Supabase error:', error);
    return [];
  }

  return (reviews || []).map((review): Review => {
    const userRaw = review.user as unknown;
    const user = Array.isArray(userRaw) 
      ? (userRaw as Array<{ full_name: string | null; avatar_url: string | null }>)[0]
      : userRaw as { full_name: string | null; avatar_url: string | null } | null;
    return {
      id: review.id,
      user: {
        name: user?.full_name || 'Anonymous',
        avatar: user?.avatar_url || null,
      },
      rating: review.rating,
      title: review.title || '',
      content: review.content || '',
      date: review.created_at,
      helpful: 0, // Would need a separate helpful_votes table
      verified: review.is_verified_purchase || false,
    };
  });
}

/**
 * Get related books for a book detail page
 * Returns books in same genre, excluding the current book
 */
export async function getRelatedBooks(bookId: string): Promise<RelatedBook[]> {
  const supabase = createClient();
  
  // First get the current book's genre
  const { data: currentBook } = await supabase
    .from('books')
    .select('genre')
    .eq('id', bookId)
    .single();

  if (!currentBook?.genre) {
    return [];
  }

  // Get books in same genre
  const { data: books, error } = await supabase
    .from('books')
    .select(`
      id,
      title,
      price,
      cover_image,
      author:profiles!books_author_id_fkey (
        full_name,
        pen_name
      )
    `)
    .eq('status', 'published')
    .neq('id', bookId)
    .limit(4);

  if (error || !books) {
    return [];
  }

  // Get ratings for related books
  const bookIds = books.map(b => b.id);
  const { data: reviewStats } = await supabase
    .from('reviews')
    .select('book_id, rating')
    .in('book_id', bookIds);

  const ratingsByBook = new Map<string, { sum: number; count: number }>();
  if (reviewStats) {
    for (const review of reviewStats) {
      const existing = ratingsByBook.get(review.book_id) || { sum: 0, count: 0 };
      existing.sum += review.rating;
      existing.count += 1;
      ratingsByBook.set(review.book_id, existing);
    }
  }

  const gradients = [
    'from-emerald-600 to-teal-800',
    'from-amber-500 to-orange-700',
    'from-blue-600 to-indigo-800',
    'from-rose-500 to-pink-700',
  ];

  return books.map((book, index): RelatedBook => {
    const ratings = ratingsByBook.get(book.id);
    const rating = ratings ? Math.round((ratings.sum / ratings.count) * 10) / 10 : 0;
    const authorRaw = book.author as unknown;
    const author = Array.isArray(authorRaw) 
      ? (authorRaw as Array<{ full_name: string | null; pen_name: string | null }>)[0]
      : authorRaw as { full_name: string | null; pen_name: string | null } | null;

    return {
      id: book.id,
      title: book.title,
      author: author?.pen_name || author?.full_name || 'Unknown',
      price: book.price || 9.99,
      rating,
      coverGradient: gradients[index % gradients.length],
    };
  });
}

/**
 * Get all genres with book counts
 */
export async function getGenres(): Promise<Genre[]> {
  const supabase = createClient();
  
  // Get all published books to count genres
  const { data: books, error } = await supabase
    .from('books')
    .select('genre')
    .eq('status', 'published');

  if (error || !books) {
    console.error('[getGenres] Supabase error:', error);
    return [];
  }

  // Count books per genre
  const genreCounts = new Map<string, number>();
  for (const book of books) {
    const genres = Array.isArray(book.genre) 
      ? book.genre 
      : book.genre 
        ? [book.genre] 
        : [];
    
    for (const genre of genres) {
      const current = genreCounts.get(genre) || 0;
      genreCounts.set(genre, current + 1);
    }
  }

  // Build genre list matching Genre type (name + count only)
  const genres: Genre[] = [];
  for (const [name, count] of genreCounts.entries()) {
    genres.push({
      name,
      count,
    });
  }

  // Sort by count descending
  return genres.sort((a, b) => b.count - a.count);
}
