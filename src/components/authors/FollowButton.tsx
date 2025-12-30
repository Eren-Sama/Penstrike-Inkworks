'use client';

import { useState, useEffect, useTransition } from 'react';
import { Check, Spinner, Plus, Minus, UserPlus } from '@phosphor-icons/react';
import { useAuth } from '@/lib/auth/AuthContext';
import { Button } from '@/components/ui';
import { createClient } from '@/lib/supabase/client';

interface FollowButtonProps {
  targetUserId: string;
  targetName: string;
  initialFollowerCount: number;
  initialIsFollowing?: boolean;
  variant?: 'primary' | 'accent' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  className?: string;
}

export function FollowButton({
  targetUserId,
  targetName,
  initialFollowerCount,
  initialIsFollowing = false,
  variant = 'outline',
  size = 'md',
  showCount = false,
  className = '',
}: FollowButtonProps) {
  const { user } = useAuth();
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [followerCount, setFollowerCount] = useState(initialFollowerCount);
  const [isPending, startTransition] = useTransition();
  const [isHovered, setIsHovered] = useState(false);

  // Check actual follow state on mount
  useEffect(() => {
    if (!user || user.id === targetUserId) return;

    const checkFollowState = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('follows')
        .select('id')
        .eq('follower_id', user.id)
        .eq('following_id', targetUserId)
        .single();
      
      setIsFollowing(!!data);
    };

    checkFollowState();
  }, [user, targetUserId]);

  // Can't follow yourself
  if (user?.id === targetUserId) {
    return null;
  }

  const handleClick = () => {
    if (!user) {
      // Redirect to login
      window.location.href = `/login?redirect=/authors/${targetUserId}`;
      return;
    }

    // Optimistic update
    const newIsFollowing = !isFollowing;
    setIsFollowing(newIsFollowing);
    setFollowerCount(prev => newIsFollowing ? prev + 1 : prev - 1);

    startTransition(async () => {
      const supabase = createClient();
      
      if (newIsFollowing) {
        const { error } = await supabase
          .from('follows')
          .insert({
            follower_id: user!.id,
            following_id: targetUserId,
          });
        
        if (error && error.code !== '23505') {
          // Revert on error (unless already following)
          setIsFollowing(false);
          setFollowerCount(prev => prev - 1);
        }
      } else {
        const { error } = await supabase
          .from('follows')
          .delete()
          .eq('follower_id', user!.id)
          .eq('following_id', targetUserId);
        
        if (error) {
          // Revert on error
          setIsFollowing(true);
          setFollowerCount(prev => prev + 1);
        }
      }
    });
  };

  const buttonContent = () => {
    if (isPending) {
      return (
        <>
          <Spinner className="h-4 w-4 animate-spin" />
          <span className="sr-only">Loading...</span>
        </>
      );
    }

    if (isFollowing) {
      // Show "Unfollow" on hover, otherwise "Following"
      if (isHovered) {
        return (
          <>
            <Minus weight="bold" className="h-4 w-4" />
            <span>Unfollow</span>
          </>
        );
      }
      return (
        <>
          <Check weight="bold" className="h-4 w-4" />
          <span>Following</span>
        </>
      );
    }

    return (
      <>
        <Plus weight="bold" className="h-4 w-4" />
        <span>Follow</span>
      </>
    );
  };

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <Button
        variant="outline"
        size={size}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        disabled={isPending}
        className={`gap-2 font-medium transition-all duration-200 min-w-[110px] justify-center ${
          isFollowing && isHovered 
            ? 'border-ink-300 text-ink-700 hover:bg-ink-50' 
            : isFollowing
            ? 'border-ink-200 bg-ink-50 text-ink-700 hover:bg-ink-100'
            : 'border-ink-200 text-ink-700 hover:bg-ink-50 hover:border-ink-300'
        }`}
      >
        {buttonContent()}
      </Button>
      {showCount && (
        <span className="text-sm text-ink-500 font-medium">
          {formatFollowerCount(followerCount)} followers
        </span>
      )}
    </div>
  );
}

function formatFollowerCount(count: number): string {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return count.toString();
}

/**
 * Compact follow button for cards/lists
 */
export function FollowButtonCompact({
  targetUserId,
  initialIsFollowing = false,
  className = '',
}: {
  targetUserId: string;
  initialIsFollowing?: boolean;
  className?: string;
}) {
  const { user } = useAuth();
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isPending, startTransition] = useTransition();

  // Check actual follow state on mount
  useEffect(() => {
    if (!user || user.id === targetUserId) return;

    const checkFollowState = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('follows')
        .select('id')
        .eq('follower_id', user.id)
        .eq('following_id', targetUserId)
        .single();
      
      setIsFollowing(!!data);
    };

    checkFollowState();
  }, [user, targetUserId]);

  if (user?.id === targetUserId) {
    return null;
  }

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      window.location.href = `/login?redirect=/authors/${targetUserId}`;
      return;
    }

    const newIsFollowing = !isFollowing;
    setIsFollowing(newIsFollowing);

    startTransition(async () => {
      const supabase = createClient();
      
      if (newIsFollowing) {
        const { error } = await supabase
          .from('follows')
          .insert({
            follower_id: user!.id,
            following_id: targetUserId,
          });
        
        if (error && error.code !== '23505') {
          setIsFollowing(false);
        }
      } else {
        const { error } = await supabase
          .from('follows')
          .delete()
          .eq('follower_id', user!.id)
          .eq('following_id', targetUserId);
        
        if (error) {
          setIsFollowing(true);
        }
      }
    });
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={`p-2 rounded-full transition-all duration-200 ${
        isFollowing 
          ? 'bg-emerald-100 text-emerald-600 hover:bg-red-100 hover:text-red-600' 
          : 'bg-parchment-100 text-ink-500 hover:bg-accent-yellow/20 hover:text-accent-yellow'
      } ${className}`}
      title={isFollowing ? 'Unfollow' : 'Follow'}
    >
      {isPending ? (
        <Spinner className="h-4 w-4 animate-spin" />
      ) : isFollowing ? (
        <Check weight="bold" className="h-4 w-4" />
      ) : (
        <UserPlus weight="fill" className="h-4 w-4" />
      )}
    </button>
  );
}
