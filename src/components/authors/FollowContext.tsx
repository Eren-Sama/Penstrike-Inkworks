'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useTransition,
  useCallback,
  ReactNode,
} from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { createClient } from '@/lib/supabase/client';

interface FollowContextValue {
  /** Current follower count - single source of truth */
  followerCount: number;
  /** Whether the current user is following this author */
  isFollowing: boolean;
  /** Whether the follow state is being loaded */
  isLoading: boolean;
  /** Whether a follow/unfollow operation is in progress */
  isPending: boolean;
  /** Whether the current user can follow (not the author themselves) */
  canFollow: boolean;
  /** Toggle follow state */
  toggleFollow: () => void;
  /** Format count for display */
  formatCount: (count: number) => string;
}

const FollowContext = createContext<FollowContextValue | null>(null);

interface FollowProviderProps {
  authorId: string;
  initialFollowerCount: number;
  children: ReactNode;
}

/**
 * FollowProvider - Single source of truth for all follow-related state
 * 
 * All components that need follow state MUST consume this context.
 * This eliminates:
 * - Multiple independent useState hooks
 * - Duplicate database queries
 * - Out-of-sync UI states
 * - Negative follower counts
 */
export function FollowProvider({
  authorId,
  initialFollowerCount,
  children,
}: FollowProviderProps) {
  const { user } = useAuth();
  
  // SINGLE source of truth for follower count
  // Initialize from server data, never derived, never negative
  const [followerCount, setFollowerCount] = useState(Math.max(0, initialFollowerCount));
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  // Determine if user can follow (not viewing own profile)
  const canFollow = !user || user.id !== authorId;

  // Check actual follow state on mount - SINGLE query for all consumers
  useEffect(() => {
    if (!user || user.id === authorId) {
      setIsLoading(false);
      return;
    }

    const checkFollowState = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('follows')
        .select('id')
        .eq('follower_id', user.id)
        .eq('following_id', authorId)
        .single();
      
      setIsFollowing(!!data);
      setIsLoading(false);
    };

    checkFollowState();
  }, [user, authorId]);

  // Toggle follow with optimistic updates and rollback guards
  const toggleFollow = useCallback(() => {
    if (!user) {
      window.location.href = `/login?redirect=/authors/${authorId}`;
      return;
    }

    if (user.id === authorId) return; // Can't follow yourself

    const wasFollowing = isFollowing;
    const previousCount = followerCount;

    // Optimistic update with guard against negative
    setIsFollowing(!wasFollowing);
    setFollowerCount(prev => {
      if (!wasFollowing) {
        // Following: increment
        return prev + 1;
      } else {
        // Unfollowing: decrement but never below 0
        return Math.max(0, prev - 1);
      }
    });

    startTransition(async () => {
      const supabase = createClient();
      
      if (!wasFollowing) {
        // Insert follow
        const { error } = await supabase
          .from('follows')
          .insert({
            follower_id: user.id,
            following_id: authorId,
          });
        
        // Rollback on error (ignore duplicate key)
        if (error && error.code !== '23505') {
          setIsFollowing(false);
          setFollowerCount(previousCount);
        }
      } else {
        // Delete follow
        const { error } = await supabase
          .from('follows')
          .delete()
          .eq('follower_id', user.id)
          .eq('following_id', authorId);
        
        // Rollback on error
        if (error) {
          setIsFollowing(true);
          setFollowerCount(previousCount);
        }
      }
    });
  }, [user, authorId, isFollowing, followerCount]);

  // Format count for display - always safe, never negative
  const formatCount = useCallback((count: number): string => {
    const safeCount = Math.max(0, count);
    if (safeCount >= 1000000) return `${(safeCount / 1000000).toFixed(1)}M`;
    if (safeCount >= 1000) return `${(safeCount / 1000).toFixed(1)}K`;
    return safeCount.toString();
  }, []);

  const value: FollowContextValue = {
    followerCount,
    isFollowing,
    isLoading,
    isPending,
    canFollow,
    toggleFollow,
    formatCount,
  };

  return (
    <FollowContext.Provider value={value}>
      {children}
    </FollowContext.Provider>
  );
}

/**
 * Hook to consume follow context
 * Must be used within FollowProvider
 */
export function useFollow(): FollowContextValue {
  const context = useContext(FollowContext);
  if (!context) {
    throw new Error('useFollow must be used within a FollowProvider');
  }
  return context;
}
