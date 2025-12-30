'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  Gear,
  BookOpen,
  Heart,
  Star,
  Clock,
  ShoppingBag,
  Bookmark,
  Users,
  Headphones,
  ArrowRight,
  PencilSimple,
  MapPin,
  Calendar,
  CheckCircle,
  Fire,
  Trophy,
  ChartLine,
  Books,
  ChatCircle,
  Eye,
  CaretRight,
  Play,
  Pause,
  SpeakerHigh,
  Export,
  DotsThree,
  Envelope,
  Globe,
  ArrowLeft
} from '@phosphor-icons/react';
import { cn, formatCurrency, slugify } from '@/lib/utils';
import { Button } from '@/components/ui';
import { useAuth } from '@/lib/auth/AuthContext';
import {
  getWishlistItems,
  getBookmarkItems,
  getFullUserOrders,
  getUserReviews,
  getUserAchievements,
  getUserReadingStreak,
  getContinueReading,
  getProfileStats,
} from '@/lib/data';
import type { 
  WishlistItem, 
  BookmarkItem, 
  UserReview, 
  MockOrder, 
  ProfileAchievement, 
  ReadingStreak, 
  ContinueReading as ContinueReadingType, 
  ProfileStats 
} from '@/lib/data';

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'reviews' | 'wishlist' | 'orders' | 'reading'>('reviews');
  
  // Data state - fetched from data layer
  const [stats, setStats] = useState<ProfileStats>({ followers: 0, following: 0, reviews: 0, booksRead: 0 });
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [orders, setOrders] = useState<MockOrder[]>([]);
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [continueReading, setContinueReading] = useState<ContinueReadingType[]>([]);
  const [achievements, setAchievements] = useState<ProfileAchievement[]>([]);
  const [readingStreak, setReadingStreak] = useState<ReadingStreak>({ currentStreak: 0, bestStreak: 0, percentile: '' });
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/profile');
    }
    // Authors should never see the reader profile - redirect to their public author page
    if (!loading && user && user.account_type === 'author') {
      // If author has pen_name, redirect to their public author page; otherwise send to settings
      const authorPage = user.pen_name 
        ? `/authors/${slugify(user.pen_name)}`
        : '/author/settings';
      router.replace(authorPage);
    }
  }, [user, loading, router]);

  // Fetch profile data from data layer
  useEffect(() => {
    async function fetchProfileData() {
      if (!user) return;
      
      setDataLoading(true);
      try {
        const [
          wishlistData, 
          bookmarkData, 
          orderData, 
          reviewData,
          achievementsData,
          streakData,
          continueReadingData,
          statsData,
        ] = await Promise.all([
          getWishlistItems(),
          getBookmarkItems(),
          getFullUserOrders(),
          getUserReviews(),
          getUserAchievements(),
          getUserReadingStreak(),
          getContinueReading(),
          getProfileStats(),
        ]);
        
        setWishlist(wishlistData);
        setBookmarks(bookmarkData);
        setOrders(orderData);
        setReviews(reviewData);
        setAchievements(achievementsData);
        setReadingStreak(streakData);
        setContinueReading(continueReadingData);
        
        // Merge stats with review/order counts
        setStats({
          ...statsData,
          reviews: statsData.reviews || reviewData.length,
          booksRead: statsData.booksRead || orderData.length,
        });
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setDataLoading(false);
      }
    }
    
    fetchProfileData();
  }, [user]);

  if (loading || dataLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-200 border-t-amber-500"></div>
      </div>
    );
  }

  // Authors should never render this page - redirect is handled in useEffect
  if (!user || user.account_type === 'author') return null;

  const tabs = [
    { id: 'reviews', label: 'Reviews', icon: Star, count: reviews.length },
    { id: 'wishlist', label: 'Wishlist', icon: Heart, count: wishlist.length },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, count: orders.length },
    { id: 'reading', label: 'Reading', icon: BookOpen, count: continueReading.length },
  ];

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  // Color palette for book covers - generates consistent color based on string
  const bookCoverColors = [
    'from-rose-500 to-pink-600',
    'from-violet-500 to-purple-600',
    'from-blue-500 to-indigo-600',
    'from-emerald-500 to-teal-600',
    'from-amber-500 to-orange-600',
    'from-cyan-500 to-sky-600',
    'from-fuchsia-500 to-pink-600',
    'from-lime-500 to-green-600',
  ];

  const getBookColor = (str: string): string => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return bookCoverColors[Math.abs(hash) % bookCoverColors.length];
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section with Profile - No cover banner */}
      <section className="relative bg-white border-b border-gray-200 shadow-sm pt-8 pb-8">
        <div className="relative container mx-auto px-4 sm:px-6">
          <div className={`max-w-4xl mx-auto transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {/* Profile Card */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
              {/* Avatar */}
              <div className="relative group flex-shrink-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 p-1 shadow-xl shadow-orange-500/30">
                  <div className="relative w-full h-full rounded-xl bg-white overflow-hidden">
                    {user.avatar_url ? (
                      <Image
                        src={user.avatar_url}
                        alt={user.full_name || 'Profile'}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-3xl sm:text-4xl font-bold bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 bg-clip-text text-transparent">
                          {user.full_name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {user.full_name || 'Bibliophile'}
                  </h1>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 text-orange-700 text-xs font-semibold w-fit mx-auto sm:mx-0 border border-orange-200/50">
                    <CheckCircle weight="fill" className="h-3.5 w-3.5 text-orange-500" />
                    Reader
                  </span>
                </div>
                
                {user.username && (
                  <p className="text-gray-500 text-sm mt-1 font-medium">@{user.username}</p>
                )}
                
                {user.bio && (
                  <p className="text-gray-600 mt-2 max-w-lg text-sm leading-relaxed">{user.bio}</p>
                )}
                
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-3 text-sm text-gray-600">
                  {user.location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin weight="fill" className="h-4 w-4 text-orange-400" />
                      {user.location}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <Calendar weight="fill" className="h-4 w-4 text-orange-400" />
                    Joined {new Date(user.created_at || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </span>
                </div>

                {/* Stats - Inline */}
                <div className="flex items-center justify-center sm:justify-start gap-6 mt-5">
                  <button className="group text-center">
                    <span className="block text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">{formatNumber(stats.followers)}</span>
                    <span className="text-xs text-gray-500 font-medium">Followers</span>
                  </button>
                  <div className="w-px h-8 bg-gray-200" />
                  <button className="group text-center">
                    <span className="block text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">{formatNumber(stats.following)}</span>
                    <span className="text-xs text-gray-500 font-medium">Following</span>
                  </button>
                  <div className="w-px h-8 bg-gray-200" />
                  <div className="text-center">
                    <span className="block text-xl font-bold text-gray-900">{stats.booksRead}</span>
                    <span className="text-xs text-gray-500 font-medium">Books Read</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0 pt-3">
                <Link href="/settings">
                  <Button variant="outline" size="sm" className="gap-2 border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 hover:text-gray-900 shadow-sm">
                    <PencilSimple weight="bold" className="h-4 w-4" />
                    <span className="hidden sm:inline">Edit Profile</span>
                  </Button>
                </Link>
                <Button variant="outline" size="sm" className="gap-2 border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 hover:text-gray-900 shadow-sm">
                  <Export weight="bold" className="h-4 w-4" />
                  <span className="hidden sm:inline">Share</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 sm:px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Sidebar */}
            <div className={`lg:col-span-4 xl:col-span-3 space-y-6 transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              {/* Reading Streak Card - Vibrant gradient */}
              <div className="bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 rounded-2xl p-5 text-white shadow-lg shadow-orange-500/25 relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
                <div className="relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Fire weight="fill" className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <p className="text-4xl font-bold text-white drop-shadow-sm">{readingStreak.currentStreak}</p>
                      <p className="text-white/90 text-sm font-medium">Day Streak</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/20 text-sm">
                    <span className="text-white/80 font-medium">Best: {readingStreak.bestStreak} days</span>
                    {readingStreak.percentile && (
                      <span className="flex items-center gap-1.5 text-white font-semibold bg-white/20 px-2.5 py-1 rounded-full">
                        <Trophy weight="fill" className="h-4 w-4" />
                        {readingStreak.percentile}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Achievements */}
              <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Trophy weight="fill" className="h-5 w-5 text-orange-500" />
                  Achievements
                </h3>
                <div className="space-y-3">
                  {achievements.map((badge, i) => {
                    // Map icon names to components
                    const iconMap: Record<string, typeof Books> = { Books, Star, Fire, Users };
                    const IconComponent = iconMap[badge.icon] || Books;
                    return (
                      <div 
                        key={i} 
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-orange-50 transition-colors cursor-pointer group"
                      >
                        <div className={cn(
                          'w-10 h-10 rounded-xl flex items-center justify-center transition-colors',
                          badge.progress === 100 
                            ? 'bg-gradient-to-br from-orange-500 to-amber-500 shadow-md shadow-orange-500/20' 
                            : 'bg-gray-100 group-hover:bg-orange-100'
                        )}>
                          <IconComponent weight="fill" className={cn(
                            'h-5 w-5',
                            badge.progress === 100 ? 'text-white' : 'text-gray-400 group-hover:text-orange-500'
                          )} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900">{badge.label}</p>
                          <p className="text-xs text-gray-500">{badge.desc}</p>
                        </div>
                        {badge.progress === 100 ? (
                          <CheckCircle weight="fill" className="h-5 w-5 text-emerald-500" />
                        ) : (
                          <span className="text-xs font-semibold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">{badge.progress}%</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bookmarked */}
              <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Bookmark weight="fill" className="h-5 w-5 text-orange-500" />
                    Bookmarked
                  </h3>
                  <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full">{bookmarks.length}</span>
                </div>
                <div className="space-y-2">
                  {bookmarks.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">No bookmarks yet</p>
                  ) : (
                    bookmarks.slice(0, 3).map((book) => (
                      <div key={book.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-orange-50 transition-colors cursor-pointer group">
                        <div className={`w-10 h-14 rounded-lg bg-gradient-to-br ${getBookColor(book.title)} flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-sm`}>
                          {book.title.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm truncate group-hover:text-orange-600 transition-colors">{book.title}</p>
                          <p className="text-gray-500 text-xs truncate">{book.author}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                {bookmarks.length > 0 && (
                  <Link href="/bookmarks" className="flex items-center justify-center gap-1.5 mt-4 text-sm text-orange-600 hover:text-orange-700 font-semibold group">
                    View All
                    <ArrowRight weight="bold" className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                )}
              </div>

              {/* Continue Listening - Premium Audio Player */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-5 shadow-xl">
                {/* Ambient glow */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-violet-500/30 rounded-full blur-3xl" />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl" />
                
                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/30">
                        <Headphones weight="fill" className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-sm font-semibold text-white">Now Playing</span>
                    </div>
                    <span className="text-xs font-medium text-violet-300 bg-violet-500/20 px-2.5 py-1 rounded-full border border-violet-500/30">Audiobook</span>
                  </div>
                  
                  {continueReading.filter(b => b.isAudiobook).length > 0 ? (
                    (() => {
                      const audiobook = continueReading.filter(b => b.isAudiobook)[0];
                      return (
                        <div>
                          {/* Book Info Row */}
                          <div className="flex items-center gap-4 mb-5">
                            <div className="relative group">
                              <div className="w-16 h-20 rounded-xl bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center text-white font-bold text-2xl shadow-xl shadow-violet-500/30 ring-2 ring-white/10">
                                {audiobook.title.charAt(0)}
                              </div>
                              {/* Animated playing indicator */}
                              <div className="absolute -bottom-1 -right-1 flex gap-0.5 items-end h-3 p-1 rounded bg-white/10 backdrop-blur-sm">
                                <span className="w-0.5 h-full bg-violet-400 rounded-full animate-pulse" style={{animationDelay: '0ms'}} />
                                <span className="w-0.5 h-2/3 bg-violet-400 rounded-full animate-pulse" style={{animationDelay: '150ms'}} />
                                <span className="w-0.5 h-full bg-violet-400 rounded-full animate-pulse" style={{animationDelay: '300ms'}} />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-white truncate text-base">{audiobook.title}</p>
                              <p className="text-slate-400 text-sm truncate">{audiobook.author}</p>
                              <div className="flex items-center gap-3 mt-2">
                                <div className="flex items-center gap-1">
                                  <Clock weight="fill" className="h-3 w-3 text-slate-500" />
                                  <span className="text-xs text-slate-500">{audiobook.duration || 'In progress'}</span>
                                </div>
                                {audiobook.currentChapter && (
                                  <>
                                    <span className="text-slate-600">•</span>
                                    <span className="text-xs text-violet-400 font-medium">{audiobook.currentChapter}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {/* Progress Bar */}
                          <div className="mb-5">
                            <div className="h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-violet-500 via-purple-500 to-violet-400 rounded-full relative" style={{ width: `${audiobook.progress}%` }}>
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg shadow-violet-500/50" />
                              </div>
                            </div>
                            <div className="flex justify-between text-xs mt-2">
                              <span className="text-slate-500">-</span>
                              <span className="text-violet-400 font-medium">{audiobook.progress}%</span>
                              <span className="text-slate-500">-</span>
                            </div>
                          </div>
                          
                          {/* Controls */}
                          <div className="flex items-center justify-center gap-3">
                            <button className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all border border-white/5">
                              <ArrowLeft weight="bold" className="h-4 w-4" />
                            </button>
                            <button className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500 flex items-center justify-center text-white shadow-xl shadow-violet-500/40 hover:shadow-violet-500/50 hover:scale-105 transition-all">
                              <Play weight="fill" className="h-6 w-6 ml-0.5" />
                            </button>
                            <button className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all border border-white/5">
                              <ArrowRight weight="bold" className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })()
                  ) : (
                    <div className="text-center py-6">
                      <Headphones weight="duotone" className="h-10 w-10 text-slate-500 mx-auto mb-2" />
                      <p className="text-slate-400 text-sm">No audiobooks in progress</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className={`lg:col-span-8 xl:col-span-9 transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              {/* Tabs */}
              <div className="flex gap-1 p-1.5 bg-gray-100 rounded-xl mb-6 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm whitespace-nowrap transition-all flex-1 justify-center',
                      activeTab === tab.id
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    )}
                  >
                    <tab.icon weight={activeTab === tab.id ? 'fill' : 'regular'} className={cn('h-4 w-4', activeTab === tab.id && 'text-orange-500')} />
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className={cn(
                      'text-xs px-1.5 py-0.5 rounded-full font-semibold',
                      activeTab === tab.id ? 'bg-orange-100 text-orange-600' : 'bg-gray-200 text-gray-500'
                    )}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="space-y-4">
                {activeTab === 'reviews' && (
                  <div className="space-y-4">
                    {reviews.length === 0 ? (
                      <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
                        <Star weight="duotone" className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No reviews yet. Share your thoughts on books you&apos;ve read!</p>
                      </div>
                    ) : (
                      reviews.map((review, idx) => (
                        <div 
                          key={review.id} 
                          className="bg-white rounded-2xl border border-gray-200 p-5 hover:border-orange-200 hover:shadow-md hover:shadow-orange-500/5 transition-all"
                          style={{ animationDelay: `${idx * 50}ms` }}
                        >
                          <div className="flex gap-4">
                            <div className={`w-14 h-20 rounded-xl bg-gradient-to-br ${getBookColor(review.bookTitle)} flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-md`}>
                              {review.bookTitle.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  <h4 className="font-semibold text-gray-900">{review.bookTitle}</h4>
                                  <div className="flex items-center gap-3 mt-1.5">
                                    <div className="flex">
                                      {[...Array(5)].map((_, i) => (
                                        <Star
                                          key={i}
                                          weight="fill"
                                          className={cn('h-4 w-4', i < review.rating ? 'text-amber-400' : 'text-gray-200')}
                                        />
                                      ))}
                                    </div>
                                    <span className="text-gray-400 text-xs">{new Date(review.createdAt).toLocaleDateString()}</span>
                                  </div>
                                </div>
                              </div>
                              <p className="text-gray-600 mt-3 text-sm leading-relaxed">{review.content}</p>
                              <div className="flex items-center gap-4 mt-4 text-sm">
                                <button className="flex items-center gap-1.5 text-gray-400 hover:text-rose-500 transition-colors">
                                  <Heart weight="regular" className="h-4 w-4" />
                                  <span>{review.helpfulCount || 0}</span>
                                </button>
                                <button className="flex items-center gap-1.5 text-gray-400 hover:text-orange-500 transition-colors">
                                  <ChatCircle weight="regular" className="h-4 w-4" />
                                  <span>Reply</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {activeTab === 'wishlist' && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {wishlist.length === 0 ? (
                      <div className="col-span-2 bg-white rounded-2xl border border-gray-200 p-8 text-center">
                        <Heart weight="duotone" className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">Your wishlist is empty. Browse the bookstore to find books you love!</p>
                      </div>
                    ) : (
                      wishlist.map((item, idx) => (
                        <div 
                          key={item.id} 
                          className="bg-white rounded-2xl border border-gray-200 p-4 hover:border-orange-200 hover:shadow-md hover:shadow-orange-500/5 transition-all group"
                          style={{ animationDelay: `${idx * 50}ms` }}
                        >
                          <div className="flex gap-4">
                            <div className={`w-14 h-20 rounded-xl bg-gradient-to-br ${getBookColor(item.title)} flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-md`}>
                              {item.title.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-orange-600 transition-colors">{item.title}</h4>
                              <p className="text-gray-500 text-sm mt-0.5">{item.author}</p>
                              <p className="text-orange-600 font-bold mt-2">{formatCurrency(item.price)}</p>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-4">
                            <Button size="sm" className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-md shadow-orange-500/20">
                              Add to Cart
                            </Button>
                            <Button size="sm" variant="ghost" className="!p-2.5 text-rose-400 hover:text-rose-500 hover:bg-rose-50">
                              <Heart weight="fill" className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {activeTab === 'orders' && (
                  <div className="space-y-4">
                    {orders.length === 0 ? (
                      <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
                        <ShoppingBag weight="duotone" className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No orders yet. Start shopping in the bookstore!</p>
                      </div>
                    ) : (
                      orders.map((order, idx) => (
                        <div 
                          key={order.id} 
                          className="bg-white rounded-2xl border border-gray-200 p-5 hover:border-orange-200 hover:shadow-md hover:shadow-orange-500/5 transition-all"
                          style={{ animationDelay: `${idx * 50}ms` }}
                        >
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-sm text-gray-400 font-medium">Order #{order.orderNumber || order.id}</span>
                            <span className={cn(
                              'px-2.5 py-1 rounded-full text-xs font-semibold',
                              order.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                            )}>
                              {order.status}
                            </span>
                          </div>
                          {order.items.map((item) => (
                            <div key={item.id} className="flex gap-4">
                              <div className={`w-14 h-20 rounded-xl bg-gradient-to-br ${getBookColor(item.title)} flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-md`}>
                                {item.title.charAt(0)}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900">{item.title}</h4>
                                <p className="text-gray-500 text-sm mt-1">{new Date(order.date).toLocaleDateString()}</p>
                                <p className="text-orange-600 font-bold mt-2">{formatCurrency(item.price)}</p>
                              </div>
                              <Button variant="outline" size="sm" className="self-center gap-1.5 border-gray-300 text-gray-700 hover:border-orange-300 hover:text-orange-600 hover:bg-orange-50">
                                Details
                                <CaretRight weight="bold" className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      ))
                    )}
                  </div>
                )}

                {activeTab === 'reading' && (
                  <div className="space-y-4">
                    {continueReading.length === 0 ? (
                      <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
                        <BookOpen weight="duotone" className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No books in progress. Start reading to track your progress!</p>
                      </div>
                    ) : (
                      continueReading.map((book, idx) => (
                        <div 
                          key={book.id} 
                          className="bg-white rounded-2xl border border-gray-200 p-5 hover:border-orange-200 hover:shadow-md hover:shadow-orange-500/5 transition-all"
                          style={{ animationDelay: `${idx * 50}ms` }}
                        >
                          <div className="flex gap-4">
                            <div className={`w-14 h-20 rounded-xl bg-gradient-to-br ${getBookColor(book.title)} flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-md`}>
                              {book.title.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-gray-900 truncate">{book.title}</h4>
                                {book.isAudiobook && (
                                  <Headphones weight="fill" className="h-4 w-4 text-purple-500 flex-shrink-0" />
                                )}
                              </div>
                              <p className="text-gray-500 text-sm">{book.author}</p>
                              <p className="text-gray-400 text-xs mt-1">
                                {book.isAudiobook ? book.duration : book.currentChapter}
                              </p>
                              <div className="flex items-center gap-3 mt-3">
                                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"
                                    style={{ width: `${book.progress}%` }}
                                  />
                                </div>
                                <span className="text-xs font-semibold text-orange-600">{book.progress}%</span>
                              </div>
                            </div>
                            <Button size="sm" className="self-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-md shadow-orange-500/20">
                              {book.isAudiobook ? (
                                <>
                                  <Play weight="fill" className="h-4 w-4" />
                                  <span className="hidden sm:inline">Listen</span>
                                </>
                              ) : (
                                <>
                                  <BookOpen weight="bold" className="h-4 w-4" />
                                  <span className="hidden sm:inline">Continue</span>
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
