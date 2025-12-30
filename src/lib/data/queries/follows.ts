/**
 * Follow System Queries
 * Real implementations for follow/unfollow functionality
 */

import { createClient } from '@/lib/supabase/client';

export interface FollowState {
  isFollowing: boolean;
  followerCount: number;
}

/**
 * Check if current user is following a target user
 * Returns follow state including follower count
 */
export async function getFollowState(targetUserId: string): Promise<FollowState> {
  const supabase = createClient();
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  
  // Get follower count for target
  const { count: followerCount } = await supabase
    .from('follows')
    .select('id', { count: 'exact', head: true })
    .eq('following_id', targetUserId);

  // Check if current user follows target
  let isFollowing = false;
  if (user) {
    const { data: follow } = await supabase
      .from('follows')
      .select('id')
      .eq('follower_id', user.id)
      .eq('following_id', targetUserId)
      .single();
    
    isFollowing = !!follow;
  }

  return {
    isFollowing,
    followerCount: followerCount || 0,
  };
}

/**
 * Follow a user
 */
export async function followUser(targetUserId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Must be logged in to follow' };
  }

  // Can't follow yourself
  if (user.id === targetUserId) {
    return { success: false, error: 'Cannot follow yourself' };
  }

  const { error } = await supabase
    .from('follows')
    .insert({
      follower_id: user.id,
      following_id: targetUserId,
    });

  if (error) {
    // Handle duplicate follow
    if (error.code === '23505') {
      return { success: true }; // Already following
    }
    console.error('[followUser] Error:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Unfollow a user
 */
export async function unfollowUser(targetUserId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Must be logged in to unfollow' };
  }

  const { error } = await supabase
    .from('follows')
    .delete()
    .eq('follower_id', user.id)
    .eq('following_id', targetUserId);

  if (error) {
    console.error('[unfollowUser] Error:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Get list of users that a user is following
 */
export async function getFollowing(userId: string, limit = 20): Promise<Array<{
  id: string;
  name: string;
  avatarUrl: string | null;
  accountType: 'reader' | 'author';
}>> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('follows')
    .select(`
      following:profiles!follows_following_id_fkey (
        id,
        pen_name,
        full_name,
        avatar_url,
        account_type
      )
    `)
    .eq('follower_id', userId)
    .limit(limit);

  if (error || !data) {
    console.error('[getFollowing] Error:', error);
    return [];
  }

  return data.map(item => {
    const profile = item.following as unknown as {
      id: string;
      pen_name: string | null;
      full_name: string | null;
      avatar_url: string | null;
      account_type: 'reader' | 'author';
    };
    return {
      id: profile.id,
      name: profile.pen_name || profile.full_name || 'Unknown',
      avatarUrl: profile.avatar_url,
      accountType: profile.account_type,
    };
  });
}

/**
 * Get list of followers for a user
 */
export async function getFollowers(userId: string, limit = 20): Promise<Array<{
  id: string;
  name: string;
  avatarUrl: string | null;
  accountType: 'reader' | 'author';
}>> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('follows')
    .select(`
      follower:profiles!follows_follower_id_fkey (
        id,
        pen_name,
        full_name,
        avatar_url,
        account_type
      )
    `)
    .eq('following_id', userId)
    .limit(limit);

  if (error || !data) {
    console.error('[getFollowers] Error:', error);
    return [];
  }

  return data.map(item => {
    const profile = item.follower as unknown as {
      id: string;
      pen_name: string | null;
      full_name: string | null;
      avatar_url: string | null;
      account_type: 'reader' | 'author';
    };
    return {
      id: profile.id,
      name: profile.pen_name || profile.full_name || 'Unknown',
      avatarUrl: profile.avatar_url,
      accountType: profile.account_type,
    };
  });
}
