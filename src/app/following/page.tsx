'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Users,
  MagnifyingGlass,
  BookOpen,
  Star,
  UserMinus,
  ArrowLeft,
  SpinnerGap,
  Heart,
  Trophy,
  CaretRight,
  Funnel,
  SortAscending
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';
import { useAuth } from '@/lib/auth/AuthContext';
import { toast } from 'sonner';

interface FollowedAuthor {
  id: string;
  name: string;
  penName?: string;
  avatar?: string;
  bio: string;
  genre: string;
  booksCount: number;
  followersCount: string;
  rating: number;
  followedAt: string;
  latestBook?: {
    title: string;
    publishedAt: string;
  };
  isBestseller: boolean;
}

const mockFollowedAuthors: FollowedAuthor[] = [
  {
    id: '1',
    name: 'A.M. Sterling',
    bio: 'Award-winning author of the Midnight Realms series. Known for intricate world-building and unforgettable characters.',
    genre: 'Fantasy',
    booksCount: 12,
    followersCount: '45.2K',
    rating: 4.9,
    followedAt: '2024-01-10T10:30:00Z',
    latestBook: {
      title: 'The Midnight Garden',
      publishedAt: '2024-01-05',
    },
    isBestseller: true,
  },
  {
    id: '2',
    name: 'James Morrison',
    bio: 'Former FBI agent turned thriller writer. His novels are praised for their authentic portrayals of criminal investigations.',
    genre: 'Thriller',
    booksCount: 8,
    followersCount: '32.1K',
    rating: 4.8,
    followedAt: '2023-12-15T14:20:00Z',
    latestBook: {
      title: 'Silent Echoes',
      publishedAt: '2023-12-01',
    },
    isBestseller: true,
  },
  {
    id: '3',
    name: 'Elena Rodriguez',
    bio: 'Bestselling romance author with a talent for creating swoon-worthy love stories that capture the heart.',
    genre: 'Romance',
    booksCount: 15,
    followersCount: '67.8K',
    rating: 4.7,
    followedAt: '2023-11-20T09:15:00Z',
    latestBook: {
      title: 'Hearts in Bloom',
      publishedAt: '2024-02-14',
    },
    isBestseller: true,
  },
  {
    id: '4',
    name: 'Michael Chen',
    bio: 'Visionary sci-fi author exploring the intersection of technology and humanity.',
    genre: 'Science Fiction',
    booksCount: 6,
    followersCount: '28.3K',
    rating: 4.9,
    followedAt: '2023-10-05T16:45:00Z',
    isBestseller: false,
  },
  {
    id: '5',
    name: 'Sarah Williams',
    penName: 'S.W. Dark',
    bio: 'Horror writer who crafts tales that will keep you up at night. Creator of the Shadows series.',
    genre: 'Horror',
    booksCount: 9,
    followersCount: '19.5K',
    rating: 4.6,
    followedAt: '2023-09-12T11:00:00Z',
    latestBook: {
      title: 'Whispers in the Dark',
      publishedAt: '2023-10-31',
    },
    isBestseller: false,
  },
];

const genreColors: Record<string, string> = {
  'Fantasy': 'from-purple-500 to-indigo-600',
  'Thriller': 'from-rose-500 to-red-600',
  'Romance': 'from-pink-500 to-rose-600',
  'Science Fiction': 'from-blue-500 to-cyan-600',
  'Horror': 'from-gray-700 to-gray-900',
  'Mystery': 'from-amber-500 to-orange-600',
  'Non-Fiction': 'from-emerald-500 to-teal-600',
};

export default function FollowingPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [authors, setAuthors] = useState<FollowedAuthor[]>(mockFollowedAuthors);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'name' | 'books'>('recent');
  const [filterGenre, setFilterGenre] = useState<string>('all');

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/following');
    }
  }, [user, authLoading, router]);

  const handleUnfollow = (authorId: string, authorName: string) => {
    setAuthors(prev => prev.filter(a => a.id !== authorId));
    toast.success(`Unfollowed ${authorName}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const filteredAuthors = authors
    .filter(author => {
      const matchesSearch = author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        author.genre.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGenre = filterGenre === 'all' || author.genre === filterGenre;
      return matchesSearch && matchesGenre;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'books') return b.booksCount - a.booksCount;
      return new Date(b.followedAt).getTime() - new Date(a.followedAt).getTime();
    });

  const uniqueGenres = [...new Set(authors.map(a => a.genre))];

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-parchment-50 to-cream-100 flex items-center justify-center">
        <SpinnerGap weight="bold" className="h-8 w-8 animate-spin text-accent-yellow" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-parchment-50 to-cream-100">
      {/* Header */}
      <div className="bg-gradient-to-br from-pink-50 via-parchment-50 to-rose-50 border-b border-parchment-200">
        <div className="container-editorial py-12">
          <div className={`transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-ink-500 mb-6">
              <Link href="/settings" className="hover:text-ink-700 transition-colors">
                Settings
              </Link>
              <CaretRight weight="bold" className="h-3 w-3" />
              <span className="text-ink-700">Following</span>
            </div>

            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                    <Heart weight="fill" className="h-6 w-6 text-white" />
                  </div>
                  <h1 className="font-serif text-3xl md:text-4xl font-bold text-ink-900">
                    Authors You Follow
                  </h1>
                </div>
                <p className="text-ink-600">
                  Stay updated with your favorite authors and their latest releases
                </p>
              </div>

              <div className="flex items-center gap-3 text-ink-600">
                <Users weight="duotone" className="h-5 w-5 text-pink-500" />
                <span className="font-medium">{authors.length} Authors</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-editorial py-8">
        <div className={`max-w-5xl mx-auto transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            {/* Search */}
            <div className="relative flex-1">
              <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-ink-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search authors..."
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-parchment-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none transition-all"
              />
            </div>

            {/* Genre Filter */}
            <select
              value={filterGenre}
              onChange={(e) => setFilterGenre(e.target.value)}
              className="px-4 py-3 rounded-xl bg-white border border-parchment-200 focus:border-pink-400 outline-none transition-all min-w-[150px]"
            >
              <option value="all">All Genres</option>
              {uniqueGenres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'recent' | 'name' | 'books')}
              className="px-4 py-3 rounded-xl bg-white border border-parchment-200 focus:border-pink-400 outline-none transition-all min-w-[150px]"
            >
              <option value="recent">Recently Followed</option>
              <option value="name">Name A-Z</option>
              <option value="books">Most Books</option>
            </select>
          </div>

          {/* Authors List */}
          {filteredAuthors.length === 0 ? (
            <div className="bg-white rounded-3xl border border-parchment-200 p-16 text-center">
              <div className="w-20 h-20 rounded-full bg-pink-100 flex items-center justify-center mx-auto mb-6">
                <Heart weight="duotone" className="h-10 w-10 text-pink-400" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-ink-900 mb-3">No authors found</h2>
              <p className="text-ink-500 mb-8 max-w-md mx-auto">
                {searchQuery || filterGenre !== 'all'
                  ? 'Try adjusting your search or filters'
                  : "You haven't followed any authors yet. Discover amazing authors in our bookstore!"}
              </p>
              <Link href="/authors">
                <Button className="btn-accent">
                  <Users weight="duotone" className="h-5 w-5" />
                  Discover Authors
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAuthors.map((author, index) => {
                const gradientColor = genreColors[author.genre] || 'from-gray-500 to-gray-600';
                
                return (
                  <div
                    key={author.id}
                    className="bg-white rounded-2xl border border-parchment-200 p-6 hover:shadow-lg hover:border-parchment-300 transition-all group"
                    style={{
                      opacity: mounted ? 1 : 0,
                      transform: mounted ? 'translateY(0)' : 'translateY(12px)',
                      transition: `all 0.4s ease ${index * 60}ms`
                    }}
                  >
                    <div className="flex flex-col sm:flex-row gap-5">
                      {/* Author Avatar */}
                      <Link href={`/authors/${author.id}`} className="flex-shrink-0">
                        <div className={cn(
                          'w-20 h-20 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg group-hover:scale-105 transition-transform',
                          `bg-gradient-to-br ${gradientColor}`
                        )}>
                          {author.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      </Link>

                      {/* Author Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                          <div>
                            <Link 
                              href={`/authors/${author.id}`}
                              className="font-serif text-xl font-bold text-ink-900 hover:text-accent-warm transition-colors"
                            >
                              {author.name}
                            </Link>
                            {author.penName && (
                              <span className="text-ink-500 text-sm ml-2">({author.penName})</span>
                            )}
                            <div className="flex items-center gap-3 mt-1">
                              <span className={cn(
                                'text-xs font-medium px-2.5 py-1 rounded-full',
                                'bg-gradient-to-r text-white',
                                gradientColor
                              )}>
                                {author.genre}
                              </span>
                              {author.isBestseller && (
                                <span className="flex items-center gap-1 text-xs font-medium text-amber-600">
                                  <Trophy weight="fill" className="h-3.5 w-3.5" />
                                  Bestseller
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <button
                            onClick={() => handleUnfollow(author.id, author.name)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 border border-red-200 hover:border-red-300 transition-all"
                          >
                            <UserMinus weight="bold" className="h-4 w-4" />
                            Unfollow
                          </button>
                        </div>

                        <p className="text-ink-600 text-sm mb-3 line-clamp-2">{author.bio}</p>

                        {/* Stats */}
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          <span className="flex items-center gap-1.5 text-ink-600">
                            <BookOpen weight="duotone" className="h-4 w-4 text-ink-400" />
                            {author.booksCount} books
                          </span>
                          <span className="flex items-center gap-1.5 text-ink-600">
                            <Users weight="duotone" className="h-4 w-4 text-ink-400" />
                            {author.followersCount} followers
                          </span>
                          <span className="flex items-center gap-1.5 text-ink-600">
                            <Star weight="fill" className="h-4 w-4 text-amber-400" />
                            {author.rating}
                          </span>
                          <span className="text-ink-400 text-xs">
                            Following since {formatDate(author.followedAt)}
                          </span>
                        </div>

                        {/* Latest Book */}
                        {author.latestBook && (
                          <div className="mt-4 p-3 bg-parchment-50 rounded-xl border border-parchment-100">
                            <p className="text-xs text-ink-500 mb-1">Latest Release</p>
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-ink-900">{author.latestBook.title}</span>
                              <span className="text-xs text-ink-500">{formatDate(author.latestBook.publishedAt)}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Discover More CTA */}
          {filteredAuthors.length > 0 && (
            <div className={`mt-12 text-center transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <p className="text-ink-500 mb-4">Looking for more amazing authors?</p>
              <Link href="/authors">
                <Button className="btn-secondary">
                  <Users weight="duotone" className="h-5 w-5" />
                  Discover More Authors
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
