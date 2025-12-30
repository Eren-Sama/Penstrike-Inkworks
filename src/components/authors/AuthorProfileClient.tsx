'use client';

import { useState, ReactNode } from 'react';
import {
  Star,
  ShareNetwork as Share2,
  MapPin,
  CalendarBlank,
  Check,
  Plus,
  Minus,
  Spinner,
  BookOpen,
  Users,
  ChatCircle,
  PencilSimple,
  Globe,
  TwitterLogo,
  InstagramLogo,
  FacebookLogo,
  LinkedinLogo,
  BookBookmark,
} from '@phosphor-icons/react';
import Link from 'next/link';
import { AuthorAvatar } from './AuthorAvatar';
import { VerifiedBadge } from './VerifiedBadge';
import { Button } from '@/components/ui';
import { useAuth } from '@/lib/auth/AuthContext';
import { FollowProvider, useFollow } from './FollowContext';

// ============================================================================
// TYPES
// ============================================================================

interface AuthorStats {
  books: number;
  followers: number;
  avgRating: number;
  reviews: number;
}

interface SocialLinks {
  website?: string;
  twitter?: string;
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  goodreads?: string;
}

interface AuthorForClient {
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
  stats: AuthorStats;
  socialLinks?: SocialLinks;
}

// ============================================================================
// FOLLOW BUTTON COMPONENT (uses context)
// ============================================================================

interface FollowButtonProps {
  variant: 'hero' | 'sidebar';
}

function FollowButton({ variant }: FollowButtonProps) {
  const { isFollowing, isLoading, isPending, canFollow, toggleFollow } = useFollow();
  const [isHovered, setIsHovered] = useState(false);

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

  if (variant === 'sidebar') {
    return (
      <button
        onClick={toggleFollow}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        disabled={isPending || isLoading}
        className={`inline-flex items-center justify-center gap-2 w-full px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 disabled:opacity-50 ${
          isFollowing
            ? isHovered
              ? 'bg-red-500/20 text-red-300 border border-red-500/30'
              : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
            : 'bg-accent-yellow text-ink-900 hover:bg-accent-amber'
        }`}
      >
        {buttonContent()}
      </button>
    );
  }

  // Hero variant - brand styling
  return (
    <button
      onClick={toggleFollow}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={isPending || isLoading}
      className={`inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 disabled:opacity-50 ${
        isFollowing
          ? isHovered
            ? 'bg-red-50 text-red-600 border border-red-200'
            : 'bg-white text-ink-700 border border-parchment-300 hover:border-ink-300'
          : 'bg-accent-yellow text-ink-900 hover:bg-accent-amber shadow-sm'
      }`}
    >
      {buttonContent()}
    </button>
  );
}

// ============================================================================
// STATS ROW COMPONENT (uses context for follower count)
// ============================================================================

interface StatsRowProps {
  stats: AuthorStats;
}

function StatsRow({ stats }: StatsRowProps) {
  const { followerCount, formatCount } = useFollow();

  return (
    <div className="flex items-center justify-center md:justify-start gap-8">
      <div className="text-center md:text-left">
        <div className="text-2xl font-bold text-white">{stats.books}</div>
        <div className="text-xs text-parchment-400 mt-0.5">Books</div>
      </div>
      <div className="w-px h-8 bg-white/20" />
      <div className="text-center md:text-left">
        <div className="text-2xl font-bold text-white transition-all duration-300">
          {formatCount(followerCount)}
        </div>
        <div className="text-xs text-parchment-400 mt-0.5">Followers</div>
      </div>
      {stats.avgRating > 0 && (
        <>
          <div className="w-px h-8 bg-white/20" />
          <div className="text-center md:text-left">
            <div className="text-2xl font-bold text-white flex items-center gap-1">
              {stats.avgRating}
              <Star weight="fill" className="h-4 w-4 text-accent-yellow" />
            </div>
            <div className="text-xs text-parchment-400 mt-0.5">Rating</div>
          </div>
        </>
      )}
    </div>
  );
}

// ============================================================================
// AUTHOR INFO CARD (sidebar)
// ============================================================================

interface AuthorInfoCardProps {
  joinedDate: string;
  genre: string | null;
  socialLinks?: SocialLinks;
  avgRating?: number;
  reviews?: number;
}

export function AuthorInfoCard({ joinedDate, genre, socialLinks, avgRating = 0, reviews = 0 }: AuthorInfoCardProps) {
  // Check if any social links actually exist
  const hasSocialLinks = socialLinks && Object.entries(socialLinks).some(
    ([, value]) => value && typeof value === 'string' && value.trim().length > 0
  );

  return (
    <div className="bg-white rounded-2xl border border-parchment-200 p-6 animate-fade-up">
      <h3 className="text-base font-semibold text-ink-900 mb-5">Author Info</h3>
      <div className="space-y-4">
        {/* Rating Section */}
        {avgRating > 0 && (
          <div className="flex items-center justify-between pb-4 border-b border-parchment-100">
            <div className="flex items-center gap-2">
              <Star weight="fill" className="h-5 w-5 text-accent-yellow" />
              <span className="text-lg font-bold text-ink-900">{avgRating}</span>
            </div>
            <span className="text-sm text-ink-500">{reviews.toLocaleString()} reviews</span>
          </div>
        )}

        {/* Joined Date */}
        <div className="flex items-center gap-3 text-ink-600">
          <CalendarBlank weight="duotone" className="h-5 w-5 text-ink-400" />
          <span>Joined {joinedDate}</span>
        </div>

        {/* Genre - only if set */}
        {genre && genre.trim() && (
          <div className="flex items-center gap-3 text-ink-600">
            <BookOpen weight="duotone" className="h-5 w-5 text-ink-400" />
            <span>{genre}</span>
          </div>
        )}

        {/* Social Links - only if any exist */}
        {hasSocialLinks && (
          <div className="pt-4 mt-4 border-t border-parchment-200 flex flex-wrap gap-2">
            {socialLinks?.website && socialLinks.website.trim() && (
              <a
                href={socialLinks.website}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg text-ink-400 hover:text-ink-900 hover:bg-parchment-100 transition-all"
                title="Website"
              >
                <Globe weight="duotone" className="h-5 w-5" />
              </a>
            )}
            {socialLinks?.twitter && socialLinks.twitter.trim() && (
              <a
                href={`https://twitter.com/${socialLinks.twitter.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg text-ink-400 hover:text-ink-900 hover:bg-parchment-100 transition-all"
                title="Twitter / X"
              >
                <TwitterLogo weight="duotone" className="h-5 w-5" />
              </a>
            )}
            {socialLinks?.instagram && socialLinks.instagram.trim() && (
              <a
                href={`https://instagram.com/${socialLinks.instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg text-ink-400 hover:text-ink-900 hover:bg-parchment-100 transition-all"
                title="Instagram"
              >
                <InstagramLogo weight="duotone" className="h-5 w-5" />
              </a>
            )}
            {socialLinks?.facebook && socialLinks.facebook.trim() && (
              <a
                href={`https://facebook.com/${socialLinks.facebook}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg text-ink-400 hover:text-ink-900 hover:bg-parchment-100 transition-all"
                title="Facebook"
              >
                <FacebookLogo weight="duotone" className="h-5 w-5" />
              </a>
            )}
            {socialLinks?.linkedin && socialLinks.linkedin.trim() && (
              <a
                href={`https://linkedin.com/in/${socialLinks.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg text-ink-400 hover:text-ink-900 hover:bg-parchment-100 transition-all"
                title="LinkedIn"
              >
                <LinkedinLogo weight="duotone" className="h-5 w-5" />
              </a>
            )}
            {socialLinks?.goodreads && socialLinks.goodreads.trim() && (
              <a
                href={`https://goodreads.com/${socialLinks.goodreads}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg text-ink-400 hover:text-ink-900 hover:bg-parchment-100 transition-all"
                title="Goodreads"
              >
                <BookBookmark weight="duotone" className="h-5 w-5" />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// STAY UPDATED CTA (sidebar - uses context)
// ============================================================================

interface AuthorFollowCTAProps {
  authorName: string;
}

export function AuthorFollowCTA({ authorName }: AuthorFollowCTAProps) {
  const { canFollow } = useFollow();

  if (!canFollow) return null;

  return (
    <div className="bg-gradient-to-br from-ink-900 to-ink-800 rounded-2xl p-5 animate-fade-up" style={{ animationDelay: '100ms' }}>
      <h3 className="text-sm font-semibold text-white mb-2">Stay Updated</h3>
      <p className="text-parchment-300 text-sm leading-relaxed mb-4">
        Get notified when {authorName.split(' ')[0]} publishes new work.
      </p>
      <FollowButton variant="sidebar" />
    </div>
  );
}

// ============================================================================
// AUTHOR STATS CARD (legacy support - now uses context internally)
// ============================================================================

interface AuthorStatsCardProps {
  authorId: string;
  stats: AuthorStats;
  joinedDate: string;
}

export function AuthorStatsCard({ stats, joinedDate }: AuthorStatsCardProps) {
  const { followerCount, formatCount } = useFollow();

  return (
    <div className="bg-white rounded-2xl border border-parchment-100 p-6 animate-fade-up">
      <h3 className="font-serif text-lg font-bold text-ink-900 mb-5">Author Stats</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-ink-500">
            <BookOpen weight="duotone" className="h-5 w-5" />
            <span>Books Published</span>
          </div>
          <span className="font-bold text-ink-900">{stats.books}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-ink-500">
            <Users weight="duotone" className="h-5 w-5" />
            <span>Followers</span>
          </div>
          <span className="font-bold text-ink-900 transition-all duration-300">
            {formatCount(followerCount)}
          </span>
        </div>
        {stats.avgRating > 0 && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-ink-500">
              <Star weight="duotone" className="h-5 w-5" />
              <span>Avg Rating</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Star weight="fill" className="h-4 w-4 text-accent-yellow" />
              <span className="font-bold text-ink-900">{stats.avgRating}</span>
            </div>
          </div>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-ink-500">
            <ChatCircle weight="duotone" className="h-5 w-5" />
            <span>Total Reviews</span>
          </div>
          <span className="font-bold text-ink-900">{stats.reviews.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-ink-500">
            <CalendarBlank weight="duotone" className="h-5 w-5" />
            <span>Member Since</span>
          </div>
          <span className="font-bold text-ink-900">{joinedDate}</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN WRAPPER COMPONENT
// ============================================================================

interface AuthorProfileClientWrapperProps {
  author: AuthorForClient;
  children?: ReactNode;
}

/**
 * AuthorProfileClientWrapper - Premium author profile layout
 * 
 * Wraps entire page in FollowProvider for single source of truth.
 * All follow-related components consume context.
 */
export function AuthorProfileClientWrapper({ author, children }: AuthorProfileClientWrapperProps) {
  const { user } = useAuth();
  
  // Determine if current user is viewing their own profile
  // user.account_type is the role field from UserProfile
  const isOwnProfile = user?.id === author.id;
  const isAuthor = user?.account_type === 'author';
  const showEditButton = isOwnProfile && isAuthor;

  return (
    <FollowProvider
      authorId={author.id}
      initialFollowerCount={author.stats.followers}
    >
      {/* Hero Section - Clean branded design */}
      <section className="relative overflow-hidden">
        {/* Background with subtle gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-ink-900 via-ink-800 to-ink-900" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-1/4 w-64 h-64 bg-accent-yellow/30 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="py-12 md:py-16">
            <div className="max-w-3xl mx-auto">
              
              {/* Main Hero Layout - Horizontal on desktop */}
              <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
                
                {/* Avatar */}
                <div className="flex-shrink-0 animate-fade-up">
                  <AuthorAvatar
                    authorId={author.id}
                    authorAvatar={author.avatar}
                    authorName={author.name}
                    gradient={author.gradient}
                    size="lg"
                    isVerified={author.isVerified}
                  />
                </div>

                {/* Info */}
                <div className="flex-1 text-center md:text-left">
                  {/* Name + Verified Badge */}
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-2 animate-fade-up" style={{ animationDelay: '50ms' }}>
                    <h1 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-white">
                      {author.name}
                    </h1>
                    {author.isVerified && (
                      <VerifiedBadge size="md" showTooltip />
                    )}
                  </div>

                  {/* Meta: Genre + Location */}
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-3 animate-fade-up" style={{ animationDelay: '100ms' }}>
                    {author.genre && author.genre.trim() && (
                      <span className="px-2.5 py-1 rounded-full bg-white/10 text-parchment-200 text-xs font-medium">
                        {author.genre}
                      </span>
                    )}
                    {author.location && author.location.trim() && (
                      <div className="flex items-center gap-1 text-parchment-300 text-sm">
                        <MapPin weight="fill" className="h-3.5 w-3.5" />
                        <span>{author.location}</span>
                      </div>
                    )}
                  </div>

                  {/* Short Bio */}
                  <p className="text-parchment-200 text-sm md:text-base leading-relaxed mb-4 line-clamp-2 animate-fade-up" style={{ animationDelay: '150ms' }}>
                    {author.bio.split('\n\n')[0]}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 animate-fade-up" style={{ animationDelay: '200ms' }}>
                    {!isOwnProfile && (
                      <FollowButton variant="hero" />
                    )}
                    
                    <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-parchment-200 hover:text-white hover:bg-white/10 transition-all">
                      <Share2 weight="bold" className="h-4 w-4" />
                      Share
                    </button>

                    {showEditButton && (
                      <Link href="/author/settings">
                        <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-parchment-200 hover:text-white hover:bg-white/10 transition-all">
                          <PencilSimple weight="bold" className="h-4 w-4" />
                          Edit Profile
                        </button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              {/* Stats Strip */}
              <div className="mt-8 pt-6 border-t border-white/10 animate-fade-up" style={{ animationDelay: '250ms' }}>
                <StatsRow stats={author.stats} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Render children (main content grid) */}
      {children}
    </FollowProvider>
  );
}
