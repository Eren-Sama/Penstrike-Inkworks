'use client';

import { useState, useEffect, useTransition } from 'react';
import {
  Star,
  ShareNetwork as Share2,
  Trophy as Award,
  MapPin,
  CalendarBlank,
  Check,
  Plus,
  Minus,
  Spinner,
} from '@phosphor-icons/react';
import { AuthorAvatar } from './AuthorAvatar';
import { VerifiedBadge } from './VerifiedBadge';
import { Button } from '@/components/ui';
import { useAuth } from '@/lib/auth/AuthContext';
import { createClient } from '@/lib/supabase/client';

interface AuthorProfileHeroProps {
  author: {
    id: string;
    name: string;
    bio: string;
    avatar?: string | null;
    gradient: string;
    genre: string | null;
    location?: string;
    joinedDate: string;
    isVerified: boolean;
    awards?: string[];
    stats: {
      books: number;
      followers: number;
      avgRating: number;
    };
  };
}

export function AuthorProfileHero({ author }: AuthorProfileHeroProps) {
  const { user } = useAuth();
  const [followerCount, setFollowerCount] = useState(author.stats.followers);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isHovered, setIsHovered] = useState(false);

  // Check actual follow state on mount
  useEffect(() => {
    if (!user || user.id === author.id) return;

    const checkFollowState = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('follows')
        .select('id')
        .eq('follower_id', user.id)
        .eq('following_id', author.id)
        .single();
      
      setIsFollowing(!!data);
    };

    checkFollowState();
  }, [user, author.id]);

  const handleFollow = () => {
    if (!user) {
      window.location.href = `/login?redirect=/authors/${author.id}`;
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
            follower_id: user.id,
            following_id: author.id,
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
          .eq('follower_id', user.id)
          .eq('following_id', author.id);
        
        if (error) {
          // Revert on error
          setIsFollowing(true);
          setFollowerCount(prev => prev + 1);
        }
      }
    });
  };

  // Can't follow yourself
  const canFollow = !user || user.id !== author.id;

  const formatCount = (count: number): string => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const renderFollowButton = () => {
    if (!canFollow) return null;

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
      <Button
        variant="outline"
        size="lg"
        onClick={handleFollow}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        disabled={isPending}
        className={`gap-2 font-medium transition-all duration-200 min-w-[120px] justify-center bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm ${
          isFollowing && isHovered 
            ? 'border-white/50' 
            : ''
        }`}
      >
        {buttonContent()}
      </Button>
    );
  };

  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${author.gradient}`} />
      <div className="absolute inset-0 bg-ink-900/50" />
      
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-accent-yellow/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="py-20 md:py-28">
          <div className="max-w-5xl mx-auto">
            {/* Main Hero Content */}
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-10 lg:gap-16">
              
              {/* Left: Avatar + Quick Stats */}
              <div className="flex flex-col items-center animate-fade-up">
                {/* Large Avatar */}
                <div className="relative mb-6">
                  <AuthorAvatar
                    authorId={author.id}
                    authorAvatar={author.avatar}
                    authorName={author.name}
                    gradient={author.gradient}
                    size="lg"
                    isVerified={author.isVerified}
                  />
                  {/* Verified badge overlay */}
                  {author.isVerified && (
                    <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1.5 shadow-lg">
                      <VerifiedBadge size="lg" showTooltip />
                    </div>
                  )}
                </div>
                
                {/* Compact Stats under avatar - LIVE follower count */}
                <div className="flex items-center gap-6 text-white/90">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{author.stats.books}</div>
                    <div className="text-xs text-white/70 uppercase tracking-wide">Books</div>
                  </div>
                  <div className="w-px h-8 bg-white/20" />
                  <div className="text-center">
                    <div className="text-2xl font-bold transition-all duration-300">{formatCount(followerCount)}</div>
                    <div className="text-xs text-white/70 uppercase tracking-wide">Followers</div>
                  </div>
                  {author.stats.avgRating > 0 && (
                    <>
                      <div className="w-px h-8 bg-white/20" />
                      <div className="text-center">
                        <div className="text-2xl font-bold flex items-center gap-1">
                          <Star weight="fill" className="h-5 w-5 text-accent-yellow" />
                          {author.stats.avgRating}
                        </div>
                        <div className="text-xs text-white/70 uppercase tracking-wide">Rating</div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Right: Author Info */}
              <div className="flex-1 text-center lg:text-left">
                {/* Awards badges */}
                {author.awards && author.awards.length > 0 && (
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-5 animate-fade-up">
                    {author.awards.map((award) => (
                      <span
                        key={award}
                        className="px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-white text-xs font-medium flex items-center gap-1.5 border border-white/10"
                      >
                        <Award weight="fill" className="h-3.5 w-3.5 text-accent-yellow" />
                        {award}
                      </span>
                    ))}
                  </div>
                )}

                {/* Name + Verified */}
                <div className="flex items-center justify-center lg:justify-start gap-3 mb-3 animate-fade-up" style={{ animationDelay: '100ms' }}>
                  <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight">
                    {author.name}
                  </h1>
                  {author.isVerified && (
                    <VerifiedBadge size="lg" className="hidden lg:inline-flex" />
                  )}
                </div>

                {/* Genre + Location */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-6 animate-fade-up" style={{ animationDelay: '150ms' }}>
                  {author.genre && author.genre.trim() ? (
                    <span className="px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium">
                      {author.genre} Author
                    </span>
                  ) : (
                    <span className="px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium">
                      Author
                    </span>
                  )}
                  {author.location && author.location.trim() && (
                    <div className="flex items-center gap-1.5 text-white/80">
                      <MapPin weight="fill" className="h-4 w-4" />
                      <span className="text-sm">{author.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 text-white/70">
                    <CalendarBlank weight="fill" className="h-4 w-4" />
                    <span className="text-sm">Joined {author.joinedDate}</span>
                  </div>
                </div>

                {/* Short bio excerpt */}
                <p className="text-white/85 text-lg leading-relaxed mb-8 max-w-2xl animate-fade-up line-clamp-3" style={{ animationDelay: '200ms' }}>
                  {author.bio.split('\n\n')[0]}
                </p>

                {/* Action buttons */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 animate-fade-up" style={{ animationDelay: '250ms' }}>
                  {renderFollowButton()}
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="border-white/40 text-white hover:bg-white/10 gap-2 backdrop-blur-sm"
                  >
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
