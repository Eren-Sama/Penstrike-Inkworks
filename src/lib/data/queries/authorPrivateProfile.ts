/**
 * Real Data Queries - Author Private Profile
 * For author's own profile page (private, editable)
 */

import { createClient } from '@/lib/supabase/client';
import type { AuthorPrivateProfile } from '../mock/authorPrivateProfile';

/**
 * Get the current author's private profile
 * Returns null if not authenticated or not an author
 */
export async function getAuthorPrivateProfile(): Promise<AuthorPrivateProfile | null> {
  const supabase = createClient();
  
  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    console.error('[getAuthorPrivateProfile] Auth error:', authError);
    return null;
  }

  // Get profile data
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    console.error('[getAuthorPrivateProfile] Profile error:', profileError);
    return null;
  }

  // Get author's book stats
  const { data: books } = await supabase
    .from('books')
    .select('id, price')
    .eq('author_id', user.id);

  const bookIds = books?.map(b => b.id) || [];

  // Get sales stats
  let totalSales = 0;
  let totalRevenue = 0;
  if (bookIds.length > 0) {
    const { data: purchases } = await supabase
      .from('purchases')
      .select('quantity, total_amount')
      .in('book_id', bookIds)
      .eq('status', 'completed');

    purchases?.forEach(p => {
      totalSales += p.quantity || 1;
      totalRevenue += p.total_amount || 0;
    });
  }

  // Get review stats
  let totalReviews = 0;
  let avgRating = 0;
  if (bookIds.length > 0) {
    const { data: reviews } = await supabase
      .from('reviews')
      .select('rating')
      .in('book_id', bookIds);

    if (reviews && reviews.length > 0) {
      totalReviews = reviews.length;
      avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    }
  }

  // Get follower count (if follows table exists)
  let followers = 0;
  try {
    const { count } = await supabase
      .from('follows')
      .select('*', { count: 'exact', head: true })
      .eq('following_id', user.id);
    followers = count || 0;
  } catch {
    // follows table may not exist
  }

  // Parse genres from profile or set default
  const genres = profile.genres 
    ? (Array.isArray(profile.genres) ? profile.genres : [profile.genres])
    : [];

  // Parse social links
  const socialLinks = profile.social_links || {};

  // Generate avatar gradient based on user id
  const gradients = [
    'from-purple-500 to-indigo-600',
    'from-blue-500 to-cyan-600',
    'from-emerald-500 to-teal-600',
    'from-amber-500 to-orange-600',
    'from-rose-500 to-pink-600',
  ];
  const gradientIndex = user.id.charCodeAt(0) % gradients.length;

  return {
    id: profile.id,
    penName: profile.pen_name || profile.full_name || 'Author',
    bio: profile.bio || '',
    genres,
    socialLinks: {
      website: socialLinks.website,
      twitter: socialLinks.twitter,
      instagram: socialLinks.instagram,
      facebook: socialLinks.facebook,
    },
    avatar: profile.avatar_url,
    avatarGradient: gradients[gradientIndex],
    joinedDate: new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    verified: profile.verified || false,
    stats: {
      totalBooks: books?.length || 0,
      totalSales,
      totalRevenue,
      avgRating: Math.round(avgRating * 10) / 10,
      totalReviews,
      followers,
    },
  };
}
