/**
 * Real Data Queries - Authors
 * Supabase query implementations for author data
 * 
 * CANONICAL DATA SOURCE: All profile data comes from dedicated columns.
 * The social_links JSONB field is DEPRECATED and should not be read.
 */

import { createClient } from '@/lib/supabase/client';
import type { AuthorProfile, AuthorBookItem, AdminAuthor } from '../types';

/**
 * Generate slug from text for URL matching
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}

/**
 * Check if a string looks like a UUID
 */
function isUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

/**
 * Helper: Convert empty string to undefined (for clean data)
 */
function emptyToUndefined(value: string | null | undefined): string | undefined {
  if (!value || value.trim() === '') return undefined;
  return value.trim();
}

/**
 * Get author profile by ID or pen_name slug
 * Supports both UUID and slug-based lookup
 * 
 * READS FROM: Canonical columns only (not JSONB)
 */
export async function getAuthorProfile(idOrSlug: string): Promise<AuthorProfile | null> {
  const supabase = createClient();
  
  // Define the canonical fields to select (NO social_links JSONB)
  const profileSelect = `
    id,
    full_name,
    pen_name,
    avatar_url,
    bio,
    location,
    primary_genre,
    is_verified,
    website,
    twitter,
    instagram,
    facebook,
    linkedin,
    goodreads,
    created_at
  `;
  
  let profile;
  let error;

  // First, try to find by UUID if it looks like one
  if (isUUID(idOrSlug)) {
    const result = await supabase
      .from('profiles')
      .select(profileSelect)
      .eq('id', idOrSlug)
      .eq('account_type', 'author')
      .single();
    profile = result.data;
    error = result.error;
  }
  
  // If not found by UUID or not a UUID, try to find by pen_name slug
  if (!profile) {
    const { data: authors, error: listError } = await supabase
      .from('profiles')
      .select(profileSelect)
      .eq('account_type', 'author')
      .not('pen_name', 'is', null);
    
    if (listError || !authors) {
      console.error('[getAuthorProfile] Error fetching authors:', listError);
      return null;
    }

    // Find author by slug match
    profile = authors.find(a => a.pen_name && slugify(a.pen_name) === idOrSlug.toLowerCase());
    
    if (!profile) {
      console.error('[getAuthorProfile] No author found for:', idOrSlug);
      return null;
    }
  }

  if (error && !profile) {
    console.error('[getAuthorProfile] Supabase error:', error);
    return null;
  }

  const authorId = profile.id;

  // Get author's books with stats
  const { data: books } = await supabase
    .from('books')
    .select('id, genre')
    .eq('author_id', authorId)
    .eq('status', 'published');

  const bookCount = books?.length || 0;

  // Genre: Use profile.primary_genre (canonical) - NO FALLBACKS OR DEFAULTS
  // If author hasn't set a genre, it stays null/undefined
  const displayGenre = emptyToUndefined(profile.primary_genre) || null;

  // Get review stats for author's books
  const bookIds = books?.map(b => b.id) || [];
  let totalReviews = 0;
  let totalRating = 0;
  if (bookIds.length > 0) {
    const { data: reviews } = await supabase
      .from('reviews')
      .select('rating')
      .in('book_id', bookIds);
    
    if (reviews) {
      totalReviews = reviews.length;
      totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    }
  }
  const avgRating = totalReviews > 0 ? Math.round((totalRating / totalReviews) * 10) / 10 : 0;

  // Get follower count
  const { count: followersCount } = await supabase
    .from('follows')
    .select('id', { count: 'exact', head: true })
    .eq('following_id', authorId);

  const followers = followersCount || 0;

  // Generate gradient based on author ID
  const gradients = [
    'from-emerald-600 to-teal-800',
    'from-amber-500 to-orange-700',
    'from-blue-600 to-indigo-800',
    'from-rose-500 to-pink-700',
    'from-purple-600 to-violet-800',
  ];
  const gradientIndex = authorId.charCodeAt(0) % gradients.length;

  // Format followers for display
  const formatFollowers = (count: number): string => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  return {
    id: profile.id,
    name: profile.pen_name || profile.full_name || 'Unknown Author',
    // Genre from canonical column - null if not set (no fake defaults)
    genre: displayGenre,
    avatar: profile.avatar_url || null,
    gradient: gradients[gradientIndex],
    followers: formatFollowers(followers),
    joinedDate: profile.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Unknown',
    bio: profile.bio || 'No bio available.',
    // Location from canonical column
    location: emptyToUndefined(profile.location),
    // Verification from canonical boolean column (admin-controlled)
    isVerified: profile.is_verified === true,
    stats: {
      books: bookCount,
      reviews: totalReviews,
      avgRating,
      followers,
    },
    awards: [], // Would need a separate awards table
    // Social links from canonical columns (not JSONB)
    socialLinks: {
      website: emptyToUndefined(profile.website),
      twitter: emptyToUndefined(profile.twitter),
      instagram: emptyToUndefined(profile.instagram),
      facebook: emptyToUndefined(profile.facebook),
      linkedin: emptyToUndefined(profile.linkedin),
      goodreads: emptyToUndefined(profile.goodreads),
    },
  };
}

/**
 * Get books by author (supports both UUID and pen_name slug)
 */
export async function getAuthorBooks(idOrSlug: string): Promise<AuthorBookItem[]> {
  const supabase = createClient();
  
  let authorId = idOrSlug;
  
  // If it's not a UUID, resolve the slug to get the author ID
  if (!isUUID(idOrSlug)) {
    const { data: authors } = await supabase
      .from('profiles')
      .select('id, pen_name')
      .eq('account_type', 'author')
      .not('pen_name', 'is', null);
    
    const author = authors?.find(a => a.pen_name && slugify(a.pen_name) === idOrSlug.toLowerCase());
    if (!author) {
      console.error('[getAuthorBooks] No author found for slug:', idOrSlug);
      return [];
    }
    authorId = author.id;
  }
  
  const { data: books, error } = await supabase
    .from('books')
    .select('id, title, price, cover_image')
    .eq('author_id', authorId)
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error || !books) {
    console.error('[getAuthorBooks] Supabase error:', error);
    return [];
  }

  // Get review stats for all books
  const bookIds = books.map(b => b.id);
  const { data: reviews } = await supabase
    .from('reviews')
    .select('book_id, rating')
    .in('book_id', bookIds);

  const reviewsByBook = new Map<string, { count: number; sum: number }>();
  if (reviews) {
    for (const review of reviews) {
      const existing = reviewsByBook.get(review.book_id) || { count: 0, sum: 0 };
      existing.count += 1;
      existing.sum += review.rating;
      reviewsByBook.set(review.book_id, existing);
    }
  }

  const coverColors = [
    'from-emerald-600 to-teal-800',
    'from-amber-500 to-orange-700',
    'from-blue-600 to-indigo-800',
    'from-rose-500 to-pink-700',
  ];

  return books.map((book, index): AuthorBookItem => {
    const stats = reviewsByBook.get(book.id) || { count: 0, sum: 0 };
    const rating = stats.count > 0 ? Math.round((stats.sum / stats.count) * 10) / 10 : 0;
    const isBestseller = stats.count >= 10 && rating >= 4.5;

    return {
      id: book.id,
      title: book.title,
      price: book.price || 9.99,
      rating,
      reviews: stats.count,
      coverColor: coverColors[index % coverColors.length],
      bestseller: isBestseller,
    };
  });
}

/**
 * Get all authors for admin panel
 */
export async function getAdminAuthors(): Promise<AdminAuthor[]> {
  const supabase = createClient();
  
  // Get all profiles that have books (i.e., are authors)
  const { data: authors, error } = await supabase
    .from('profiles')
    .select(`
      id,
      full_name,
      pen_name,
      email,
      avatar_url,
      created_at,
      books:books!books_author_id_fkey (id)
    `)
    .order('created_at', { ascending: false });

  if (error || !authors) {
    console.error('[getAdminAuthors] Supabase error:', error);
    return [];
  }

  // Filter to only profiles with books
  const authorsWithBooks = authors.filter(a => {
    const books = a.books as unknown as Array<{ id: string }> | null;
    return books && books.length > 0;
  });

  // Get purchase counts for sales data
  const authorIds = authorsWithBooks.map(a => a.id);
  const { data: purchases } = await supabase
    .from('purchases')
    .select(`
      book_id,
      books:books!purchases_book_id_fkey (author_id)
    `)
    .in('books.author_id', authorIds);

  // Count sales per author
  const salesByAuthor = new Map<string, number>();
  if (purchases) {
    for (const purchase of purchases) {
      const book = purchase.books as unknown as { author_id: string } | null;
      if (book?.author_id) {
        salesByAuthor.set(book.author_id, (salesByAuthor.get(book.author_id) || 0) + 1);
      }
    }
  }

  return authorsWithBooks.map((author, index): AdminAuthor => {
    const books = author.books as unknown as Array<{ id: string }> | null;
    return {
      id: index + 1, // AdminAuthor expects numeric id
      name: author.pen_name || author.full_name || 'Unknown',
      email: author.email || '',
      joined: author.created_at ? new Date(author.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Unknown',
      books: books?.length || 0,
      sales: salesByAuthor.get(author.id) || 0,
      status: 'verified', // Would need a status field in profiles table
      avatar: author.avatar_url || '',
    };
  });
}

import type { AdminUser } from '../mock';

/**
 * Get all users for admin panel
 */
export async function getAdminUsers(): Promise<AdminUser[]> {
  const supabase = createClient();
  
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select(`
      id,
      full_name,
      email,
      role,
      avatar_url,
      created_at
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching admin users:', error);
    return [];
  }

  return (profiles || []).map((profile): AdminUser => ({
    id: profile.id,
    name: profile.full_name || 'Unknown',
    email: profile.email || '',
    role: (profile.role as AdminUser['role']) || 'READER',
    status: 'ACTIVE', // Would need a status field in profiles table
    joinedAt: profile.created_at ? new Date(profile.created_at).toISOString().split('T')[0] : '',
    ordersCount: 0, // Would need to join with orders table
    avatar: profile.avatar_url || null,
  }));
}
