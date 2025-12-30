/**
 * Featured Authors Queries
 * Real implementations for authors listing page
 * 
 * CANONICAL DATA SOURCE: All profile data comes from dedicated columns.
 * The social_links JSONB field is DEPRECATED and should not be read.
 */

import { createClient } from '@/lib/supabase/client';
import type { FeaturedAuthor } from '../mock/featuredAuthors';

/**
 * Helper: Convert empty string to undefined
 */
function emptyToUndefined(value: string | null | undefined): string | undefined {
  if (!value || value.trim() === '') return undefined;
  return value.trim();
}

/**
 * Get featured/all authors for authors listing page
 * In real mode, returns actual authors from database
 * 
 * READS FROM: Canonical columns only (not JSONB)
 */
export async function getFeaturedAuthors(): Promise<FeaturedAuthor[]> {
  const supabase = createClient();
  
  // Query authors with canonical columns (NO social_links JSONB)
  const { data: authors, error } = await supabase
    .from('profiles')
    .select(`
      id,
      full_name,
      pen_name,
      bio,
      avatar_url,
      account_type,
      primary_genre,
      is_verified,
      location
    `)
    .eq('account_type', 'author')
    .limit(20);

  if (error || !authors) {
    console.error('[getFeaturedAuthors] Error:', error);
    return [];
  }

  // Get book counts and ratings for each author
  const authorIds = authors.map(a => a.id);
  
  const { data: bookStats } = await supabase
    .from('books')
    .select('author_id, id')
    .in('author_id', authorIds)
    .eq('status', 'published');

  // Count books per author
  const bookCounts = new Map<string, number>();
  if (bookStats) {
    for (const book of bookStats) {
      bookCounts.set(book.author_id, (bookCounts.get(book.author_id) || 0) + 1);
    }
  }

  // Get follower counts
  const { data: followerStats } = await supabase
    .from('follows')
    .select('following_id')
    .in('following_id', authorIds);

  const followerCounts = new Map<string, number>();
  if (followerStats) {
    for (const follow of followerStats) {
      followerCounts.set(follow.following_id, (followerCounts.get(follow.following_id) || 0) + 1);
    }
  }

  // Format followers for display
  const formatFollowers = (count: number): string => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  // Map to FeaturedAuthor format
  return authors.map((author, index): FeaturedAuthor => {
    const colors = [
      'from-purple-500 to-indigo-600',
      'from-rose-500 to-red-600',
      'from-pink-500 to-rose-600',
      'from-blue-500 to-cyan-600',
      'from-emerald-500 to-teal-600',
      'from-amber-500 to-orange-600',
    ];
    
    // Pen name is the canonical author identity - NEVER show UUID
    const name = author.pen_name || author.full_name || 'Unknown Author';
    const initials = name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();
    
    // Genre from canonical column - null if not set (NO FAKE DEFAULTS)
    const genre = emptyToUndefined(author.primary_genre) || null;
    
    // Verification from canonical boolean column (admin-controlled)
    const isVerified = author.is_verified === true;
    
    return {
      id: author.id,
      name,
      genre,
      books: bookCounts.get(author.id) || 0,
      followers: formatFollowers(followerCounts.get(author.id) || 0),
      rating: 0, // Would need reviews aggregation
      bio: author.bio || '',
      avatar: initials,
      avatarUrl: author.avatar_url || null,
      gradient: colors[index % colors.length],
      bestseller: (bookCounts.get(author.id) || 0) >= 3,
      isVerified,
    };
  });
}
