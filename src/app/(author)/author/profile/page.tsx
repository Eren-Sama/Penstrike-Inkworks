'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  User,
  PencilSimple,
  Globe,
  InstagramLogo,
  XLogo,
  BookOpen,
  Star,
  Users,
  CurrencyDollar,
  TrendUp,
  CheckCircle,
  SpinnerGap,
  Eye,
  ChatCircle
} from '@phosphor-icons/react';
import { cn, formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui';
import { getAuthorPrivateProfile, type AuthorPrivateProfile } from '@/lib/data';

export default function AuthorProfilePage() {
  const [profile, setProfile] = useState<AuthorPrivateProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAuthorPrivateProfile();
      setProfile(data);
    } catch (error) {
      console.error('Failed to load author profile:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <SpinnerGap weight="bold" className="h-8 w-8 animate-spin text-accent-yellow" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="space-y-6">
        <div className="card p-12 text-center">
          <User weight="duotone" className="h-16 w-16 text-parchment-300 mx-auto mb-4" />
          <h2 className="font-serif text-xl font-semibold text-ink-900 mb-2">
            Profile Not Found
          </h2>
          <p className="text-ink-600">
            We couldn't load your author profile. Please try again.
          </p>
        </div>
      </div>
    );
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-ink-900">Author Profile</h1>
          <p className="text-ink-600">Manage your public author information.</p>
        </div>
        <Link href="/author/settings">
          <Button variant="outline" className="gap-2">
            <PencilSimple weight="bold" className="h-4 w-4" />
            Edit Profile
          </Button>
        </Link>
      </div>

      {/* Profile Card */}
      <div className="card p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className={cn(
              'w-24 h-24 md:w-32 md:h-32 rounded-2xl flex items-center justify-center bg-gradient-to-br',
              profile.avatarGradient
            )}>
              {profile.avatar ? (
                <img 
                  src={profile.avatar} 
                  alt={profile.penName}
                  className="w-full h-full object-cover rounded-2xl"
                />
              ) : (
                <span className="text-3xl md:text-4xl font-bold text-white/90">
                  {profile.penName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </span>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="font-serif text-xl md:text-2xl font-bold text-ink-900">
                {profile.penName}
              </h2>
              {profile.verified && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-success/10 text-success text-xs font-medium">
                  <CheckCircle weight="fill" className="h-3 w-3" />
                  Verified
                </span>
              )}
            </div>

            {/* Genres */}
            {profile.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {profile.genres.map((genre) => (
                  <span
                    key={genre}
                    className="px-2.5 py-1 rounded-full bg-parchment-100 text-ink-700 text-sm font-medium"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}

            <p className="text-ink-500 text-sm mb-4">
              Member since {profile.joinedDate}
            </p>

            {/* Social Links */}
            <div className="flex flex-wrap gap-3">
              {profile.socialLinks.website && (
                <a
                  href={profile.socialLinks.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-ink-600 hover:text-accent-warm transition-colors"
                >
                  <Globe weight="duotone" className="h-4 w-4" />
                  Website
                </a>
              )}
              {profile.socialLinks.twitter && (
                <a
                  href={`https://twitter.com/${profile.socialLinks.twitter.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-ink-600 hover:text-accent-warm transition-colors"
                >
                  <XLogo weight="duotone" className="h-4 w-4" />
                  {profile.socialLinks.twitter}
                </a>
              )}
              {profile.socialLinks.instagram && (
                <a
                  href={`https://instagram.com/${profile.socialLinks.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-ink-600 hover:text-accent-warm transition-colors"
                >
                  <InstagramLogo weight="duotone" className="h-4 w-4" />
                  {profile.socialLinks.instagram}
                </a>
              )}
            </div>
          </div>

          {/* Public Profile Link */}
          <div className="flex-shrink-0">
            <Link href={`/authors/${profile.id}`}>
              <Button variant="outline" size="sm" className="gap-2">
                <Eye weight="bold" className="h-4 w-4" />
                View Public Profile
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent-yellow/10">
              <BookOpen weight="duotone" className="h-5 w-5 text-accent-yellow" />
            </div>
            <div>
              <p className="text-sm text-ink-500">Books</p>
              <p className="text-xl font-bold text-ink-900">{profile.stats.totalBooks}</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100">
              <TrendUp weight="duotone" className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-ink-500">Sales</p>
              <p className="text-xl font-bold text-ink-900">{formatNumber(profile.stats.totalSales)}</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-100">
              <CurrencyDollar weight="duotone" className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-ink-500">Revenue</p>
              <p className="text-xl font-bold text-ink-900">{formatCurrency(profile.stats.totalRevenue)}</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-100">
              <Star weight="duotone" className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-ink-500">Avg Rating</p>
              <p className="text-xl font-bold text-ink-900">{profile.stats.avgRating > 0 ? profile.stats.avgRating.toFixed(1) : '–'}</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-100">
              <ChatCircle weight="duotone" className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-ink-500">Reviews</p>
              <p className="text-xl font-bold text-ink-900">{formatNumber(profile.stats.totalReviews)}</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-rose-100">
              <Users weight="duotone" className="h-5 w-5 text-rose-600" />
            </div>
            <div>
              <p className="text-sm text-ink-500">Followers</p>
              <p className="text-xl font-bold text-ink-900">{formatNumber(profile.stats.followers)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bio Section */}
      <div className="card p-6">
        <h3 className="font-serif text-lg font-semibold text-ink-900 mb-4">About</h3>
        {profile.bio ? (
          <div className="prose prose-ink max-w-none">
            {profile.bio.split('\n\n').map((paragraph, index) => (
              <p key={index} className="text-ink-600 mb-4 last:mb-0">
                {paragraph}
              </p>
            ))}
          </div>
        ) : (
          <p className="text-ink-500 italic">No bio added yet. Add one from the settings page.</p>
        )}
      </div>
    </div>
  );
}
