'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowUp,
  ArrowDown,
  ChatCircle,
  Share,
  Bookmark,
  DotsThree,
  Fire,
  Sparkle,
  Clock,
  TrendUp,
  MagnifyingGlass,
  CaretLeft,
  PlusCircle,
  User,
  Heart,
  Eye,
  PushPin,
  Medal,
  SpinnerGap,
  Flag,
  BookmarkSimple
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';
import { useAuth } from '@/lib/auth/AuthContext';
import { toast } from 'sonner';

interface Post {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
    badge?: string;
    isAuthor: boolean;
    booksCount?: number;
  };
  votes: number;
  userVote: 'up' | 'down' | null;
  comments: number;
  views: number;
  createdAt: string;
  isPinned?: boolean;
  isHot?: boolean;
  flair?: string;
  saved: boolean;
}

const categoryInfo: Record<string, { name: string; description: string; gradient: string; rules: string[] }> = {
  'writing-craft': {
    name: 'Writing Craft',
    description: 'Tips, techniques, and discussions about the art of writing',
    gradient: 'from-blue-500 to-indigo-600',
    rules: [
      'Be constructive and respectful in all feedback',
      'Credit sources when sharing writing tips',
      'No self-promotion without contributing to the discussion',
      'Use appropriate flairs for your posts'
    ]
  },
  'marketing-&-promotion': {
    name: 'Marketing & Promotion',
    description: 'Strategies to market your book and build your audience',
    gradient: 'from-purple-500 to-pink-600',
    rules: [
      'Share actual results and experiences, not just theory',
      'No spam or excessive self-promotion',
      'Include budget context when sharing strategies',
      'Be honest about affiliate links'
    ]
  },
  'cover-design': {
    name: 'Cover Design',
    description: 'Feedback and discussions about book covers',
    gradient: 'from-emerald-500 to-teal-600',
    rules: [
      'Always provide constructive feedback',
      'Include genre context when requesting feedback',
      'Credit designers when sharing covers',
      'No design theft or plagiarism discussions'
    ]
  },
  'genre-discussions': {
    name: 'Genre Discussions',
    description: 'Connect with authors in your genre',
    gradient: 'from-orange-500 to-amber-600',
    rules: [
      'Respect all genres - no genre bashing',
      'Use genre-specific flairs',
      'Avoid spoilers without warnings',
      'Stay on topic for the genre'
    ]
  },
  'publishing-journey': {
    name: 'Publishing Journey',
    description: 'Share experiences and get advice on the publishing process',
    gradient: 'from-rose-500 to-red-600',
    rules: [
      'Be transparent about your experiences',
      'No shaming of publishing paths (indie vs traditional)',
      'Protect privacy - blur sensitive info in screenshots',
      'Verify claims before sharing as facts'
    ]
  },
  'feedback-&-critiques': {
    name: 'Feedback & Critiques',
    description: 'Get constructive feedback on your work',
    gradient: 'from-teal-500 to-cyan-600',
    rules: [
      'Request specific feedback, not just "thoughts?"',
      'Accept criticism gracefully',
      'Critique the work, not the author',
      'Maximum 3000 words for critique requests'
    ]
  },
};

const mockPosts: Post[] = [
  {
    id: '1',
    title: 'How I went from 0 to 10,000 readers in 6 months - A complete breakdown',
    content: 'After years of struggle, I finally cracked the code. Here\'s everything I learned about building an audience...',
    author: {
      name: 'WriterJane',
      badge: 'Top Contributor',
      isAuthor: true,
      booksCount: 8
    },
    votes: 2847,
    userVote: null,
    comments: 342,
    views: 15600,
    createdAt: '2025-01-10T08:30:00Z',
    isPinned: true,
    isHot: true,
    flair: 'Success Story',
    saved: false
  },
  {
    id: '2',
    title: 'The "Show Don\'t Tell" advice is often misunderstood - here\'s what it really means',
    content: 'I see so many new writers get confused by this advice. Let me break it down with examples from bestsellers...',
    author: {
      name: 'ProseWizard',
      isAuthor: true,
      booksCount: 12
    },
    votes: 1923,
    userVote: 'up',
    comments: 256,
    views: 8900,
    createdAt: '2025-01-11T14:20:00Z',
    isHot: true,
    flair: 'Discussion',
    saved: true
  },
  {
    id: '3',
    title: 'Weekly Writing Prompt Thread - January 2025',
    content: 'Share your responses to this week\'s prompt: "The letter arrived exactly 50 years late..."',
    author: {
      name: 'ModTeam',
      badge: 'Moderator',
      isAuthor: false
    },
    votes: 892,
    userVote: null,
    comments: 547,
    views: 12300,
    createdAt: '2025-01-06T00:00:00Z',
    isPinned: true,
    flair: 'Weekly Thread',
    saved: false
  },
  {
    id: '4',
    title: 'I just hit "Publish" on my first book and I\'m terrified',
    content: 'Three years of work, countless revisions, and now it\'s out there. Anyone else feel this mix of excitement and dread?',
    author: {
      name: 'NervousNewbie42',
      isAuthor: true,
      booksCount: 1
    },
    votes: 1456,
    userVote: null,
    comments: 198,
    views: 4500,
    createdAt: '2025-01-12T10:15:00Z',
    flair: 'Milestone',
    saved: false
  },
  {
    id: '5',
    title: 'Unpopular opinion: Writing to market is not "selling out"',
    content: 'There seems to be this notion that writing for commercial appeal means sacrificing artistry. I disagree and here\'s why...',
    author: {
      name: 'GenrePro',
      isAuthor: true,
      booksCount: 15
    },
    votes: 1102,
    userVote: 'down',
    comments: 423,
    views: 7800,
    createdAt: '2025-01-11T16:45:00Z',
    flair: 'Hot Take',
    saved: false
  },
  {
    id: '6',
    title: 'Resources that actually helped me improve my dialogue',
    content: 'After reading dozens of craft books, these are the ones that made a real difference in my dialogue writing...',
    author: {
      name: 'DialogueDiva',
      isAuthor: true,
      booksCount: 5
    },
    votes: 876,
    userVote: null,
    comments: 89,
    views: 3200,
    createdAt: '2025-01-10T20:30:00Z',
    flair: 'Resources',
    saved: false
  },
];

const flairColors: Record<string, string> = {
  'Success Story': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Discussion': 'bg-blue-100 text-blue-700 border-blue-200',
  'Weekly Thread': 'bg-purple-100 text-purple-700 border-purple-200',
  'Milestone': 'bg-amber-100 text-amber-700 border-amber-200',
  'Hot Take': 'bg-red-100 text-red-700 border-red-200',
  'Resources': 'bg-teal-100 text-teal-700 border-teal-200',
  'Question': 'bg-indigo-100 text-indigo-700 border-indigo-200',
  'Feedback Request': 'bg-pink-100 text-pink-700 border-pink-200',
};

type SortOption = 'hot' | 'new' | 'top' | 'rising';

export default function CategoryPage() {
  const params = useParams();
  const { user } = useAuth();
  const categorySlug = params.category as string;
  const category = categoryInfo[categorySlug] || {
    name: categorySlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    description: 'Community discussions',
    gradient: 'from-gray-500 to-gray-600',
    rules: []
  };

  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [sortBy, setSortBy] = useState<SortOption>('hot');
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleVote = (postId: string, direction: 'up' | 'down') => {
    if (!user) {
      toast.error('Please sign in to vote');
      return;
    }
    
    setPosts(prev => prev.map(post => {
      if (post.id !== postId) return post;
      
      let newVotes = post.votes;
      let newUserVote: 'up' | 'down' | null = direction;
      
      if (post.userVote === direction) {
        newVotes -= direction === 'up' ? 1 : -1;
        newUserVote = null;
      } else if (post.userVote) {
        newVotes += direction === 'up' ? 2 : -2;
      } else {
        newVotes += direction === 'up' ? 1 : -1;
      }
      
      return { ...post, votes: newVotes, userVote: newUserVote };
    }));
  };

  const handleSave = (postId: string) => {
    if (!user) {
      toast.error('Please sign in to save posts');
      return;
    }
    
    setPosts(prev => prev.map(post => {
      if (post.id !== postId) return post;
      const newSaved = !post.saved;
      toast.success(newSaved ? 'Post saved' : 'Post unsaved');
      return { ...post, saved: newSaved };
    }));
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  const sortedPosts = [...posts]
    .filter(post => 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      // Always show pinned posts first
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      
      if (sortBy === 'hot') {
        const scoreA = a.votes + a.comments * 2;
        const scoreB = b.votes + b.comments * 2;
        return scoreB - scoreA;
      }
      if (sortBy === 'new') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'top') {
        return b.votes - a.votes;
      }
      return 0;
    });

  const sortOptions: { id: SortOption; label: string; icon: typeof Fire }[] = [
    { id: 'hot', label: 'Hot', icon: Fire },
    { id: 'new', label: 'New', icon: Sparkle },
    { id: 'top', label: 'Top', icon: TrendUp },
    { id: 'rising', label: 'Rising', icon: Clock },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-parchment-50 to-cream-100">
      {/* Category Header */}
      <div className={cn('bg-gradient-to-br text-white', category.gradient)}>
        <div className="container mx-auto px-4 py-8">
          <div className={`transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <Link 
              href="/community" 
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
            >
              <CaretLeft weight="bold" className="h-4 w-4" />
              Back to Community
            </Link>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">
                  {category.name}
                </h1>
                <p className="text-white/80">{category.description}</p>
              </div>
              
              <div className="flex items-center gap-3">
                <Link href={`/community/${categorySlug}/submit`}>
                  <Button className="bg-white text-ink-900 hover:bg-white/90">
                    <PlusCircle weight="bold" className="h-5 w-5" />
                    Create Post
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Sort & Search Bar */}
            <div className={`flex flex-col sm:flex-row gap-4 mb-6 transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              {/* Sort Options */}
              <div className="flex items-center gap-1 bg-white rounded-xl border border-parchment-200 p-1">
                {sortOptions.map(option => (
                  <button
                    key={option.id}
                    onClick={() => setSortBy(option.id)}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                      sortBy === option.id
                        ? 'bg-ink-900 text-white'
                        : 'text-ink-600 hover:bg-parchment-100'
                    )}
                  >
                    <option.icon weight={sortBy === option.id ? 'fill' : 'regular'} className="h-4 w-4" />
                    {option.label}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative flex-1">
                <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-ink-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search posts..."
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-parchment-200 focus:border-accent-yellow focus:ring-2 focus:ring-accent-yellow/20 outline-none transition-all"
                />
              </div>
            </div>

            {/* Posts List */}
            <div className="space-y-4">
              {sortedPosts.map((post, index) => (
                <article
                  key={post.id}
                  className={cn(
                    'bg-white rounded-2xl border border-parchment-200 hover:border-parchment-300 hover:shadow-lg transition-all',
                    post.isPinned && 'ring-2 ring-accent-yellow/50'
                  )}
                  style={{
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? 'translateY(0)' : 'translateY(12px)',
                    transition: `all 0.4s ease ${(index + 2) * 60}ms`
                  }}
                >
                  <div className="flex">
                    {/* Vote Column */}
                    <div className="flex flex-col items-center p-4 bg-parchment-50/50 rounded-l-2xl border-r border-parchment-100">
                      <button
                        onClick={() => handleVote(post.id, 'up')}
                        className={cn(
                          'p-1.5 rounded-lg transition-all',
                          post.userVote === 'up'
                            ? 'text-orange-500 bg-orange-100'
                            : 'text-ink-400 hover:text-orange-500 hover:bg-orange-50'
                        )}
                      >
                        <ArrowUp weight="bold" className="h-5 w-5" />
                      </button>
                      <span className={cn(
                        'font-bold text-sm my-1',
                        post.userVote === 'up' && 'text-orange-500',
                        post.userVote === 'down' && 'text-blue-500',
                        !post.userVote && 'text-ink-700'
                      )}>
                        {formatNumber(post.votes)}
                      </span>
                      <button
                        onClick={() => handleVote(post.id, 'down')}
                        className={cn(
                          'p-1.5 rounded-lg transition-all',
                          post.userVote === 'down'
                            ? 'text-blue-500 bg-blue-100'
                            : 'text-ink-400 hover:text-blue-500 hover:bg-blue-50'
                        )}
                      >
                        <ArrowDown weight="bold" className="h-5 w-5" />
                      </button>
                    </div>

                    {/* Post Content */}
                    <div className="flex-1 p-4">
                      {/* Meta */}
                      <div className="flex flex-wrap items-center gap-2 text-xs text-ink-500 mb-2">
                        {post.isPinned && (
                          <span className="flex items-center gap-1 text-emerald-600 font-medium">
                            <PushPin weight="fill" className="h-3 w-3" />
                            Pinned
                          </span>
                        )}
                        {post.isHot && (
                          <span className="flex items-center gap-1 text-orange-500 font-medium">
                            <Fire weight="fill" className="h-3 w-3" />
                            Hot
                          </span>
                        )}
                        {post.flair && (
                          <span className={cn(
                            'px-2 py-0.5 rounded-full text-xs font-medium border',
                            flairColors[post.flair] || 'bg-gray-100 text-gray-700 border-gray-200'
                          )}>
                            {post.flair}
                          </span>
                        )}
                        <span>Posted by</span>
                        <Link href="#" className="font-medium text-ink-700 hover:text-accent-warm transition-colors flex items-center gap-1">
                          {post.author.isAuthor && <Medal weight="fill" className="h-3 w-3 text-accent-yellow" />}
                          {post.author.name}
                          {post.author.badge && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent-yellow/20 text-accent-warm">
                              {post.author.badge}
                            </span>
                          )}
                        </Link>
                        <span>•</span>
                        <span>{formatTime(post.createdAt)}</span>
                        <span className="flex items-center gap-1">
                          <Eye weight="regular" className="h-3 w-3" />
                          {formatNumber(post.views)}
                        </span>
                      </div>

                      {/* Title */}
                      <Link href={`/community/${categorySlug}/post/${post.id}`}>
                        <h2 className="font-serif text-lg font-bold text-ink-900 hover:text-accent-warm transition-colors mb-2 line-clamp-2">
                          {post.title}
                        </h2>
                      </Link>

                      {/* Content Preview */}
                      <p className="text-ink-600 text-sm line-clamp-2 mb-3">
                        {post.content}
                      </p>

                      {/* Actions */}
                      <div className="flex items-center gap-4">
                        <Link 
                          href={`/community/${categorySlug}/post/${post.id}`}
                          className="flex items-center gap-1.5 text-ink-500 hover:text-ink-700 transition-colors text-sm font-medium"
                        >
                          <ChatCircle weight="regular" className="h-4 w-4" />
                          {post.comments} Comments
                        </Link>
                        <button className="flex items-center gap-1.5 text-ink-500 hover:text-ink-700 transition-colors text-sm font-medium">
                          <Share weight="regular" className="h-4 w-4" />
                          Share
                        </button>
                        <button 
                          onClick={() => handleSave(post.id)}
                          className={cn(
                            'flex items-center gap-1.5 transition-colors text-sm font-medium',
                            post.saved ? 'text-accent-yellow' : 'text-ink-500 hover:text-ink-700'
                          )}
                        >
                          <BookmarkSimple weight={post.saved ? 'fill' : 'regular'} className="h-4 w-4" />
                          {post.saved ? 'Saved' : 'Save'}
                        </button>
                        <button className="flex items-center gap-1.5 text-ink-500 hover:text-ink-700 transition-colors text-sm font-medium ml-auto">
                          <DotsThree weight="bold" className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Load More */}
            <div className="mt-8 text-center">
              <Button variant="outline" className="px-8">
                Load More Posts
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:w-80 space-y-6">
            {/* About */}
            <div className={`bg-white rounded-2xl border border-parchment-200 overflow-hidden transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className={cn('p-4 text-white bg-gradient-to-br', category.gradient)}>
                <h3 className="font-serif text-lg font-bold">About {category.name}</h3>
              </div>
              <div className="p-4">
                <p className="text-ink-600 text-sm mb-4">{category.description}</p>
                <div className="flex items-center gap-4 text-sm text-ink-500 mb-4">
                  <span className="font-medium">12.5K members</span>
                  <span>•</span>
                  <span>45 online</span>
                </div>
                <Link href={`/community/${categorySlug}/submit`}>
                  <Button className="btn-accent w-full">
                    Create Post
                  </Button>
                </Link>
              </div>
            </div>

            {/* Community Rules */}
            <div className={`bg-white rounded-2xl border border-parchment-200 p-4 transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <h3 className="font-serif text-lg font-bold text-ink-900 mb-4">Community Rules</h3>
              <ol className="space-y-3">
                {category.rules.map((rule, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-parchment-100 text-ink-600 flex items-center justify-center text-xs font-bold">
                      {i + 1}
                    </span>
                    <span className="text-ink-600">{rule}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Flairs */}
            <div className={`bg-white rounded-2xl border border-parchment-200 p-4 transition-all duration-700 delay-400 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <h3 className="font-serif text-lg font-bold text-ink-900 mb-4">Post Flairs</h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(flairColors).map(([flair, color]) => (
                  <span key={flair} className={cn('px-3 py-1 rounded-full text-xs font-medium border', color)}>
                    {flair}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
