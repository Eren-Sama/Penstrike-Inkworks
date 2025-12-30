'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowUp,
  ArrowDown,
  ChatCircle,
  Share,
  BookmarkSimple,
  DotsThree,
  CaretLeft,
  Medal,
  Eye,
  Clock,
  Flag,
  PaperPlaneRight,
  CaretDown,
  CaretUp,
  Heart,
  Warning
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';
import { useAuth } from '@/lib/auth/AuthContext';
import { toast } from 'sonner';

interface Comment {
  id: string;
  content: string;
  author: {
    name: string;
    badge?: string;
    isAuthor: boolean;
    isOP?: boolean;
  };
  votes: number;
  userVote: 'up' | 'down' | null;
  createdAt: string;
  replies: Comment[];
  collapsed: boolean;
}

const mockPost = {
  id: '1',
  title: 'How I went from 0 to 10,000 readers in 6 months - A complete breakdown',
  content: `After years of struggle, I finally cracked the code. Here's everything I learned about building an audience as an indie author.

## The Foundation

When I started, I made every mistake in the book. I wrote what I thought was literary genius, but nobody cared. It wasn't until I understood that **writing is only half the battle** that things started to change.

## What Actually Worked

### 1. Genre Awareness
I stopped fighting against market expectations and started understanding what readers in my genre actually wanted. This doesn't mean selling out—it means respecting your readers.

### 2. Consistent Release Schedule
I committed to releasing a new book every 3-4 months. This kept my readers engaged and the algorithm happy.

### 3. Building an Email List from Day One
This was the game-changer. I started collecting emails before my first book even launched. By the time I hit publish, I had 500 subscribers ready to buy.

### 4. Engaging with Other Authors
The writing community is incredibly supportive. I joined critique groups, attended (virtual) conferences, and made genuine connections. Many of those authors cross-promoted my work.

### 5. Investing in Covers and Editing
I know it's expensive, but professional covers and editing made a massive difference. Readers do judge books by their covers.

## The Numbers Breakdown

- Month 1: 47 readers
- Month 2: 183 readers  
- Month 3: 672 readers
- Month 4: 2,341 readers
- Month 5: 5,892 readers
- Month 6: 10,234 readers

## Key Takeaways

1. **Patience is crucial** - Growth is slow at first, then exponential
2. **Quality compounds** - Each good book helps sell all your other books
3. **Community matters** - You can't do this alone
4. **Keep writing** - The best marketing is your next book

Happy to answer any questions in the comments!`,
  author: {
    name: 'WriterJane',
    badge: 'Top Contributor',
    isAuthor: true,
    booksCount: 8
  },
  votes: 2847,
  userVote: null as 'up' | 'down' | null,
  comments: 342,
  views: 15600,
  createdAt: '2025-01-10T08:30:00Z',
  flair: 'Success Story',
  saved: false
};

const mockComments: Comment[] = [
  {
    id: 'c1',
    content: 'This is incredibly helpful! I\'m just starting out and the email list advice is exactly what I needed. Can you share what lead magnets worked best for you?',
    author: {
      name: 'AspiringAuthor23',
      isAuthor: true
    },
    votes: 234,
    userVote: null,
    createdAt: '2025-01-10T09:15:00Z',
    collapsed: false,
    replies: [
      {
        id: 'c1r1',
        content: 'Great question! I found that a free prequel novella worked best. It gave readers a taste of my writing style and world. Also tried a "deleted scenes" collection which readers loved.',
        author: {
          name: 'WriterJane',
          badge: 'Top Contributor',
          isAuthor: true,
          isOP: true
        },
        votes: 187,
        userVote: 'up',
        createdAt: '2025-01-10T09:45:00Z',
        collapsed: false,
        replies: []
      },
      {
        id: 'c1r2',
        content: 'Adding to this - character art and maps also work really well for fantasy authors!',
        author: {
          name: 'FantasyFan',
          isAuthor: true
        },
        votes: 56,
        userVote: null,
        createdAt: '2025-01-10T10:30:00Z',
        collapsed: false,
        replies: []
      }
    ]
  },
  {
    id: 'c2',
    content: 'The "writing to market" advice is often controversial, but you\'ve explained it perfectly. It\'s not about being inauthentic—it\'s about understanding your readers.',
    author: {
      name: 'ProseWizard',
      badge: 'Veteran Author',
      isAuthor: true
    },
    votes: 156,
    userVote: null,
    createdAt: '2025-01-10T11:20:00Z',
    collapsed: false,
    replies: [
      {
        id: 'c2r1',
        content: 'Exactly! There\'s a sweet spot between pure art and pure commerce. Find the overlap between what you love to write and what readers want to read.',
        author: {
          name: 'WriterJane',
          badge: 'Top Contributor',
          isAuthor: true,
          isOP: true
        },
        votes: 89,
        userVote: null,
        createdAt: '2025-01-10T11:45:00Z',
        collapsed: false,
        replies: []
      }
    ]
  },
  {
    id: 'c3',
    content: 'How much did you spend on advertising? I feel like everyone glosses over the financial investment required.',
    author: {
      name: 'BudgetWriter',
      isAuthor: false
    },
    votes: 423,
    userVote: null,
    createdAt: '2025-01-10T12:00:00Z',
    collapsed: false,
    replies: [
      {
        id: 'c3r1',
        content: 'Fair point! I spent about $500 total on ads in those 6 months, mostly on Amazon and Facebook. But honestly, the organic strategies (newsletter swaps, social media engagement) gave me better ROI. I\'ll do a separate post breaking down the marketing budget.',
        author: {
          name: 'WriterJane',
          badge: 'Top Contributor',
          isAuthor: true,
          isOP: true
        },
        votes: 312,
        userVote: null,
        createdAt: '2025-01-10T12:30:00Z',
        collapsed: false,
        replies: []
      }
    ]
  },
  {
    id: 'c4',
    content: 'Saved this post! Starting my journey next month and this gives me so much hope. 🙏',
    author: {
      name: 'DreamChaser',
      isAuthor: false
    },
    votes: 78,
    userVote: null,
    createdAt: '2025-01-10T14:15:00Z',
    collapsed: false,
    replies: []
  }
];

export default function PostPage() {
  const params = useParams();
  const { user } = useAuth();
  const categorySlug = params.category as string;
  
  const [post, setPost] = useState(mockPost);
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [sortBy, setSortBy] = useState<'best' | 'new' | 'top'>('best');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handlePostVote = (direction: 'up' | 'down') => {
    if (!user) {
      toast.error('Please sign in to vote');
      return;
    }
    
    setPost(prev => {
      let newVotes = prev.votes;
      let newUserVote: 'up' | 'down' | null = direction;
      
      if (prev.userVote === direction) {
        newVotes -= direction === 'up' ? 1 : -1;
        newUserVote = null;
      } else if (prev.userVote) {
        newVotes += direction === 'up' ? 2 : -2;
      } else {
        newVotes += direction === 'up' ? 1 : -1;
      }
      
      return { ...prev, votes: newVotes, userVote: newUserVote };
    });
  };

  const handleCommentVote = (commentId: string, direction: 'up' | 'down') => {
    if (!user) {
      toast.error('Please sign in to vote');
      return;
    }

    const updateVotes = (cmts: Comment[]): Comment[] => {
      return cmts.map(comment => {
        if (comment.id === commentId) {
          let newVotes = comment.votes;
          let newUserVote: 'up' | 'down' | null = direction;
          
          if (comment.userVote === direction) {
            newVotes -= direction === 'up' ? 1 : -1;
            newUserVote = null;
          } else if (comment.userVote) {
            newVotes += direction === 'up' ? 2 : -2;
          } else {
            newVotes += direction === 'up' ? 1 : -1;
          }
          
          return { ...comment, votes: newVotes, userVote: newUserVote };
        }
        return { ...comment, replies: updateVotes(comment.replies) };
      });
    };

    setComments(prev => updateVotes(prev));
  };

  const handleSubmitComment = () => {
    if (!user) {
      toast.error('Please sign in to comment');
      return;
    }
    
    if (!newComment.trim()) return;
    
    const newCmt: Comment = {
      id: `c${Date.now()}`,
      content: newComment,
      author: {
        name: user.full_name || 'Anonymous',
        isAuthor: user.account_type === 'author'
      },
      votes: 1,
      userVote: 'up',
      createdAt: new Date().toISOString(),
      collapsed: false,
      replies: []
    };
    
    setComments(prev => [newCmt, ...prev]);
    setNewComment('');
    toast.success('Comment posted!');
  };

  const handleSubmitReply = (parentId: string) => {
    if (!user) {
      toast.error('Please sign in to reply');
      return;
    }
    
    if (!replyContent.trim()) return;
    
    const newReply: Comment = {
      id: `r${Date.now()}`,
      content: replyContent,
      author: {
        name: user.full_name || 'Anonymous',
        isAuthor: user.account_type === 'author'
      },
      votes: 1,
      userVote: 'up',
      createdAt: new Date().toISOString(),
      collapsed: false,
      replies: []
    };
    
    const addReply = (cmts: Comment[]): Comment[] => {
      return cmts.map(comment => {
        if (comment.id === parentId) {
          return { ...comment, replies: [...comment.replies, newReply] };
        }
        return { ...comment, replies: addReply(comment.replies) };
      });
    };
    
    setComments(prev => addReply(prev));
    setReplyingTo(null);
    setReplyContent('');
    toast.success('Reply posted!');
  };

  const toggleCollapse = (commentId: string) => {
    const toggle = (cmts: Comment[]): Comment[] => {
      return cmts.map(comment => {
        if (comment.id === commentId) {
          return { ...comment, collapsed: !comment.collapsed };
        }
        return { ...comment, replies: toggle(comment.replies) };
      });
    };
    setComments(prev => toggle(prev));
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
  };

  const renderComment = (comment: Comment, depth: number = 0) => {
    const maxDepth = 4;
    const isDeep = depth >= maxDepth;
    
    return (
      <div 
        key={comment.id} 
        className={cn(
          'relative',
          depth > 0 && 'pl-6 border-l-2 border-parchment-200 ml-4'
        )}
      >
        {comment.collapsed ? (
          <button
            onClick={() => toggleCollapse(comment.id)}
            className="flex items-center gap-2 py-2 text-sm text-ink-500 hover:text-ink-700"
          >
            <CaretDown weight="bold" className="h-4 w-4" />
            <span className="font-medium">{comment.author.name}</span>
            <span>• {formatNumber(comment.votes)} points • {comment.replies.length} replies</span>
          </button>
        ) : (
          <div className="py-3">
            {/* Comment Header */}
            <div className="flex items-center gap-2 text-xs mb-2">
              <button
                onClick={() => toggleCollapse(comment.id)}
                className="text-ink-400 hover:text-ink-600"
              >
                <CaretUp weight="bold" className="h-3 w-3" />
              </button>
              <Link href="#" className="font-medium text-ink-700 hover:text-accent-warm flex items-center gap-1">
                {comment.author.isAuthor && <Medal weight="fill" className="h-3 w-3 text-accent-yellow" />}
                {comment.author.name}
                {comment.author.badge && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent-yellow/20 text-accent-warm">
                    {comment.author.badge}
                  </span>
                )}
                {comment.author.isOP && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-600">
                    OP
                  </span>
                )}
              </Link>
              <span className="text-ink-400">•</span>
              <span className="text-ink-400">{formatTime(comment.createdAt)}</span>
            </div>

            {/* Comment Content */}
            <p className="text-ink-700 text-sm mb-2 whitespace-pre-wrap">{comment.content}</p>

            {/* Comment Actions */}
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleCommentVote(comment.id, 'up')}
                  className={cn(
                    'p-1 rounded transition-colors',
                    comment.userVote === 'up' ? 'text-orange-500' : 'text-ink-400 hover:text-orange-500'
                  )}
                >
                  <ArrowUp weight="bold" className="h-4 w-4" />
                </button>
                <span className={cn(
                  'font-medium',
                  comment.userVote === 'up' && 'text-orange-500',
                  comment.userVote === 'down' && 'text-blue-500'
                )}>
                  {formatNumber(comment.votes)}
                </span>
                <button
                  onClick={() => handleCommentVote(comment.id, 'down')}
                  className={cn(
                    'p-1 rounded transition-colors',
                    comment.userVote === 'down' ? 'text-blue-500' : 'text-ink-400 hover:text-blue-500'
                  )}
                >
                  <ArrowDown weight="bold" className="h-4 w-4" />
                </button>
              </div>
              <button
                onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                className="text-ink-500 hover:text-ink-700 font-medium"
              >
                Reply
              </button>
              <button className="text-ink-500 hover:text-ink-700">Share</button>
              <button className="text-ink-500 hover:text-ink-700">Report</button>
            </div>

            {/* Reply Form */}
            {replyingTo === comment.id && (
              <div className="mt-3 bg-parchment-50 rounded-xl p-3 border border-parchment-200">
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder={`Reply to ${comment.author.name}...`}
                  className="w-full p-3 rounded-lg border border-parchment-200 focus:border-accent-yellow focus:ring-2 focus:ring-accent-yellow/20 outline-none resize-none text-sm"
                  rows={3}
                />
                <div className="flex justify-end gap-2 mt-2">
                  <Button variant="ghost" size="sm" onClick={() => setReplyingTo(null)}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={() => handleSubmitReply(comment.id)}>
                    Reply
                  </Button>
                </div>
              </div>
            )}

            {/* Nested Replies */}
            {comment.replies.length > 0 && (
              <div className="mt-3 space-y-0">
                {isDeep ? (
                  <Link 
                    href="#" 
                    className="text-sm text-accent-warm hover:underline"
                  >
                    Continue this thread →
                  </Link>
                ) : (
                  comment.replies.map(reply => renderComment(reply, depth + 1))
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const categoryName = categorySlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className="min-h-screen bg-gradient-to-b from-parchment-50 to-cream-100">
      {/* Header */}
      <div className="bg-white border-b border-parchment-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <Link 
              href={`/community/${categorySlug}`}
              className="flex items-center gap-2 text-ink-500 hover:text-ink-700 transition-colors"
            >
              <CaretLeft weight="bold" className="h-5 w-5" />
              <span className="font-medium">{categoryName}</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Post */}
          <article className={`bg-white rounded-2xl border border-parchment-200 overflow-hidden transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="flex">
              {/* Vote Column */}
              <div className="flex flex-col items-center p-4 bg-parchment-50/50 border-r border-parchment-100">
                <button
                  onClick={() => handlePostVote('up')}
                  className={cn(
                    'p-2 rounded-lg transition-all',
                    post.userVote === 'up'
                      ? 'text-orange-500 bg-orange-100'
                      : 'text-ink-400 hover:text-orange-500 hover:bg-orange-50'
                  )}
                >
                  <ArrowUp weight="bold" className="h-6 w-6" />
                </button>
                <span className={cn(
                  'font-bold text-lg my-1',
                  post.userVote === 'up' && 'text-orange-500',
                  post.userVote === 'down' && 'text-blue-500',
                  !post.userVote && 'text-ink-700'
                )}>
                  {formatNumber(post.votes)}
                </span>
                <button
                  onClick={() => handlePostVote('down')}
                  className={cn(
                    'p-2 rounded-lg transition-all',
                    post.userVote === 'down'
                      ? 'text-blue-500 bg-blue-100'
                      : 'text-ink-400 hover:text-blue-500 hover:bg-blue-50'
                  )}
                >
                  <ArrowDown weight="bold" className="h-6 w-6" />
                </button>
              </div>

              {/* Post Content */}
              <div className="flex-1 p-6">
                {/* Meta */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-ink-500 mb-4">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 font-medium">
                    {post.flair}
                  </span>
                  <span>Posted by</span>
                  <Link href="#" className="font-medium text-ink-700 hover:text-accent-warm transition-colors flex items-center gap-1">
                    <Medal weight="fill" className="h-3 w-3 text-accent-yellow" />
                    {post.author.name}
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent-yellow/20 text-accent-warm">
                      {post.author.badge}
                    </span>
                  </Link>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock weight="regular" className="h-3 w-3" />
                    {formatTime(post.createdAt)}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Eye weight="regular" className="h-3 w-3" />
                    {formatNumber(post.views)} views
                  </span>
                </div>

                {/* Title */}
                <h1 className="font-serif text-2xl md:text-3xl font-bold text-ink-900 mb-6">
                  {post.title}
                </h1>

                {/* Content */}
                <div className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-ink-900 prose-p:text-ink-700 prose-strong:text-ink-900 prose-li:text-ink-700">
                  {post.content.split('\n').map((paragraph, i) => {
                    if (paragraph.startsWith('## ')) {
                      return <h2 key={i} className="text-xl font-bold mt-6 mb-3">{paragraph.replace('## ', '')}</h2>;
                    }
                    if (paragraph.startsWith('### ')) {
                      return <h3 key={i} className="text-lg font-bold mt-4 mb-2">{paragraph.replace('### ', '')}</h3>;
                    }
                    if (paragraph.startsWith('- ')) {
                      return <li key={i} className="ml-4">{paragraph.replace('- ', '')}</li>;
                    }
                    if (paragraph.trim() === '') return <br key={i} />;
                    return <p key={i} className="mb-3" dangerouslySetInnerHTML={{ 
                      __html: paragraph
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\*(.*?)\*/g, '<em>$1</em>')
                    }} />;
                  })}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-4 mt-8 pt-4 border-t border-parchment-200">
                  <span className="flex items-center gap-1.5 text-ink-600 font-medium">
                    <ChatCircle weight="regular" className="h-5 w-5" />
                    {post.comments} Comments
                  </span>
                  <button className="flex items-center gap-1.5 text-ink-500 hover:text-ink-700 transition-colors font-medium">
                    <Share weight="regular" className="h-5 w-5" />
                    Share
                  </button>
                  <button 
                    onClick={() => {
                      setPost(prev => ({ ...prev, saved: !prev.saved }));
                      toast.success(post.saved ? 'Post unsaved' : 'Post saved');
                    }}
                    className={cn(
                      'flex items-center gap-1.5 transition-colors font-medium',
                      post.saved ? 'text-accent-yellow' : 'text-ink-500 hover:text-ink-700'
                    )}
                  >
                    <BookmarkSimple weight={post.saved ? 'fill' : 'regular'} className="h-5 w-5" />
                    {post.saved ? 'Saved' : 'Save'}
                  </button>
                  <button className="flex items-center gap-1.5 text-ink-500 hover:text-ink-700 transition-colors font-medium">
                    <Flag weight="regular" className="h-5 w-5" />
                    Report
                  </button>
                </div>
              </div>
            </div>
          </article>

          {/* Comment Form */}
          <div className={`mt-6 bg-white rounded-2xl border border-parchment-200 p-6 transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <h3 className="font-serif text-lg font-bold text-ink-900 mb-4">Add a Comment</h3>
            {user ? (
              <>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="What are your thoughts?"
                  className="w-full p-4 rounded-xl border border-parchment-200 focus:border-accent-yellow focus:ring-2 focus:ring-accent-yellow/20 outline-none resize-none"
                  rows={4}
                />
                <div className="flex justify-end mt-3">
                  <Button onClick={handleSubmitComment}>
                    <PaperPlaneRight weight="bold" className="h-4 w-4" />
                    Post Comment
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-8 bg-parchment-50 rounded-xl">
                <p className="text-ink-600 mb-4">Sign in to join the discussion</p>
                <Link href="/login">
                  <Button>Sign In</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Comments */}
          <div className={`mt-6 bg-white rounded-2xl border border-parchment-200 p-6 transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-lg font-bold text-ink-900">
                Comments ({comments.length})
              </h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'best' | 'new' | 'top')}
                className="px-3 py-1.5 rounded-lg border border-parchment-200 text-sm focus:border-accent-yellow outline-none"
              >
                <option value="best">Best</option>
                <option value="new">New</option>
                <option value="top">Top</option>
              </select>
            </div>

            <div className="space-y-2">
              {comments.map(comment => renderComment(comment))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
