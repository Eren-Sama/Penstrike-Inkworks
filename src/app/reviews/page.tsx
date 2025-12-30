'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Star,
  PencilSimple,
  Trash,
  BookOpen,
  Clock,
  CheckCircle,
  Eye,
  SpinnerGap,
  MagnifyingGlass,
  SortAscending,
  ThumbsUp,
  ChatDots,
  Plus,
  ArrowRight,
  Warning,
  CaretDown
} from '@phosphor-icons/react';
import { cn, formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui';
import { useAuth } from '@/lib/auth/AuthContext';
import { toast } from 'sonner';
import {
  getUserReviews,
  getPendingReviewBooks,
  deleteReview,
  type UserReview as Review,
  type PendingReviewBook
} from '@/lib/data';

type TabType = 'published' | 'drafts' | 'pending';

export default function ReviewsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [pendingBooks, setPendingBooks] = useState<PendingReviewBook[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('published');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedReview, setExpandedReview] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<string | null>(null);

  // Load reviews and pending books from data layer
  const loadReviews = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const [userReviews, pending] = await Promise.all([
        getUserReviews(),
        getPendingReviewBooks()
      ]);
      setReviews(userReviews);
      setPendingBooks(pending);
    } catch (error) {
      console.error('Failed to load reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Load reviews when user is available
  useEffect(() => {
    if (user && !authLoading) {
      loadReviews();
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [user, authLoading, loadReviews]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/reviews');
    }
  }, [user, authLoading, router]);

  const publishedReviews = reviews.filter(r => r.status === 'published');
  const draftReviews = reviews.filter(r => r.status === 'draft');

  const filteredContent = (() => {
    if (activeTab === 'pending') {
      return pendingBooks.filter(book =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    const reviewList = activeTab === 'published' ? publishedReviews : draftReviews;
    return reviewList.filter(review =>
      review.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  })();

  const handleDeleteReview = async (id: string) => {
    try {
      await deleteReview(id);
      setReviews(prev => prev.filter(r => r.id !== id));
      setDeleteModal(null);
      toast.success('Review deleted');
    } catch (error) {
      console.error('Failed to delete review:', error);
      toast.error('Failed to delete review');
    }
  };

  const handlePublishDraft = (id: string) => {
    setReviews(prev => prev.map(r => 
      r.id === id ? { ...r, status: 'published' as const, createdAt: new Date().toISOString() } : r
    ));
    toast.success('Review published!');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const renderStars = (rating: number, size: 'sm' | 'md' = 'md') => {
    const starSize = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            weight={star <= rating ? 'fill' : 'regular'}
            className={cn(starSize, star <= rating ? 'text-accent-yellow' : 'text-parchment-300')}
          />
        ))}
      </div>
    );
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-parchment-50 to-cream-100 flex items-center justify-center">
        <SpinnerGap weight="bold" className="h-8 w-8 animate-spin text-accent-yellow" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-parchment-50 to-cream-100 py-24">
      <div className="container-editorial max-w-5xl mx-auto">
        <div className={`transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-accent-yellow/20">
                <Star weight="duotone" className="h-8 w-8 text-accent-yellow" />
              </div>
              <div>
                <h1 className="font-serif text-3xl font-bold text-ink-900">My Reviews</h1>
                <p className="text-ink-600">{publishedReviews.length} published • {draftReviews.length} drafts</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl border border-parchment-200 shadow-card p-4">
              <p className="text-ink-600 text-sm">Total Reviews</p>
              <p className="font-serif text-2xl font-bold text-ink-900">{reviews.length}</p>
            </div>
            <div className="bg-white rounded-xl border border-parchment-200 shadow-card p-4">
              <p className="text-ink-600 text-sm">Helpful Votes</p>
              <p className="font-serif text-2xl font-bold text-ink-900">
                {reviews.reduce((sum, r) => sum + r.helpfulCount, 0)}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-parchment-200 shadow-card p-4">
              <p className="text-ink-600 text-sm">Avg. Rating Given</p>
              <div className="flex items-center gap-2">
                <p className="font-serif text-2xl font-bold text-ink-900">
                  {(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length || 0).toFixed(1)}
                </p>
                <Star weight="fill" className="h-5 w-5 text-accent-yellow" />
              </div>
            </div>
            <div className="bg-white rounded-xl border border-parchment-200 shadow-card p-4">
              <p className="text-ink-600 text-sm">Awaiting Review</p>
              <p className="font-serif text-2xl font-bold text-accent-amber">{pendingBooks.length}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {[
              { id: 'published' as TabType, label: 'Published', count: publishedReviews.length },
              { id: 'drafts' as TabType, label: 'Drafts', count: draftReviews.length },
              { id: 'pending' as TabType, label: 'Awaiting Review', count: pendingBooks.length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all flex items-center gap-2',
                  activeTab === tab.id
                    ? 'bg-ink-900 text-white'
                    : 'bg-white text-ink-600 hover:bg-parchment-100 border border-parchment-200'
                )}
              >
                {tab.label}
                <span className={cn(
                  'px-2 py-0.5 text-xs rounded-full',
                  activeTab === tab.id ? 'bg-white/20' : 'bg-parchment-100'
                )}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="bg-white rounded-2xl border border-parchment-200 shadow-card p-4 mb-6">
            <div className="relative">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-ink-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={activeTab === 'pending' ? 'Search books...' : 'Search your reviews...'}
                className="input w-full pl-10"
              />
            </div>
          </div>

          {/* Content */}
          {activeTab === 'pending' ? (
            /* Pending Reviews */
            <div className="space-y-4">
              {(filteredContent as PendingReviewBook[]).length === 0 ? (
                <div className="bg-white rounded-2xl border border-parchment-200 shadow-card p-12 text-center">
                  <CheckCircle weight="duotone" className="h-16 w-16 text-emerald-400 mx-auto mb-4" />
                  <h2 className="font-serif text-xl font-bold text-ink-900 mb-2">All caught up!</h2>
                  <p className="text-ink-600 mb-6">You've reviewed all your recent purchases</p>
                  <Link href="/orders">
                    <Button className="btn-secondary">
                      View Order History
                    </Button>
                  </Link>
                </div>
              ) : (
                (filteredContent as PendingReviewBook[]).map((book, index) => (
                  <div 
                    key={book.id}
                    className="bg-white rounded-2xl border border-parchment-200 shadow-card p-4 flex gap-4 hover:shadow-lg transition-all"
                    style={{
                      opacity: mounted ? 1 : 0,
                      transform: mounted ? 'translateY(0)' : 'translateY(8px)',
                      transition: `all 0.3s ease ${index * 50}ms`
                    }}
                  >
                    <div className="w-16 h-24 flex-shrink-0 bg-gradient-to-br from-parchment-200 to-parchment-300 rounded-lg flex items-center justify-center">
                      <BookOpen weight="duotone" className="h-8 w-8 text-parchment-400" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-ink-900">{book.title}</h3>
                      <p className="text-sm text-ink-600">{book.author}</p>
                      <p className="text-xs text-ink-400 mt-1">
                        Purchased {formatDate(book.purchasedAt)}
                      </p>
                    </div>
                    
                    <Link href={`/reviews/write?book=${book.id}`}>
                      <Button className="btn-accent">
                        <PencilSimple weight="bold" className="h-4 w-4" />
                        Write Review
                      </Button>
                    </Link>
                  </div>
                ))
              )}
            </div>
          ) : (
            /* Published/Draft Reviews */
            <div className="space-y-4">
              {(filteredContent as Review[]).length === 0 ? (
                <div className="bg-white rounded-2xl border border-parchment-200 shadow-card p-12 text-center">
                  <Star weight="duotone" className="h-16 w-16 text-parchment-300 mx-auto mb-4" />
                  <h2 className="font-serif text-xl font-bold text-ink-900 mb-2">
                    {activeTab === 'published' ? 'No published reviews yet' : 'No drafts'}
                  </h2>
                  <p className="text-ink-600 mb-6">
                    {activeTab === 'published' 
                      ? 'Share your thoughts on books you\'ve read' 
                      : 'Your saved review drafts will appear here'}
                  </p>
                  {pendingBooks.length > 0 && (
                    <Button onClick={() => setActiveTab('pending')} className="btn-accent">
                      <Plus weight="bold" className="h-4 w-4" />
                      Write a Review
                    </Button>
                  )}
                </div>
              ) : (
                (filteredContent as Review[]).map((review, index) => {
                  const isExpanded = expandedReview === review.id;
                  
                  return (
                    <div 
                      key={review.id}
                      className="bg-white rounded-2xl border border-parchment-200 shadow-card overflow-hidden hover:shadow-lg transition-all"
                      style={{
                        opacity: mounted ? 1 : 0,
                        transform: mounted ? 'translateY(0)' : 'translateY(8px)',
                        transition: `all 0.3s ease ${index * 50}ms`
                      }}
                    >
                      <div className="p-6">
                        <div className="flex gap-4">
                          {/* Book Cover */}
                          <div className="w-16 h-24 flex-shrink-0 bg-gradient-to-br from-parchment-200 to-parchment-300 rounded-lg flex items-center justify-center">
                            <BookOpen weight="duotone" className="h-8 w-8 text-parchment-400" />
                          </div>
                          
                          {/* Review Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <Link 
                                  href={`/book/${review.bookId}`}
                                  className="text-sm text-ink-500 hover:text-accent-amber transition-colors"
                                >
                                  {review.bookTitle} by {review.bookAuthor}
                                </Link>
                                <h3 className="font-medium text-ink-900 mt-1">{review.title}</h3>
                                <div className="flex items-center gap-3 mt-1">
                                  {renderStars(review.rating, 'sm')}
                                  <span className="text-xs text-ink-400">
                                    {formatDate(review.createdAt)}
                                    {review.updatedAt && ' (edited)'}
                                  </span>
                                </div>
                              </div>
                              
                              {review.status === 'draft' && (
                                <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                                  Draft
                                </span>
                              )}
                            </div>
                            
                            <p className={cn(
                              'text-ink-700 mt-3 text-sm',
                              !isExpanded && 'line-clamp-2'
                            )}>
                              {review.content}
                            </p>
                            
                            {review.content.length > 150 && (
                              <button
                                onClick={() => setExpandedReview(isExpanded ? null : review.id)}
                                className="text-sm text-emerald-600 hover:text-emerald-700 mt-2 flex items-center gap-1"
                              >
                                {isExpanded ? 'Show less' : 'Read more'}
                                <CaretDown className={cn('h-3 w-3 transition-transform', isExpanded && 'rotate-180')} />
                              </button>
                            )}
                            
                            {/* Stats & Actions */}
                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-parchment-100">
                              {review.status === 'published' ? (
                                <div className="flex items-center gap-4 text-sm text-ink-500">
                                  <div className="flex items-center gap-1.5">
                                    <ThumbsUp weight="duotone" className="h-4 w-4" />
                                    <span>{review.helpfulCount} helpful</span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <ChatDots weight="duotone" className="h-4 w-4" />
                                    <span>{review.commentsCount} comments</span>
                                  </div>
                                </div>
                              ) : (
                                <button
                                  onClick={() => handlePublishDraft(review.id)}
                                  className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                                >
                                  <CheckCircle weight="bold" className="h-4 w-4" />
                                  Publish Review
                                </button>
                              )}
                              
                              <div className="flex items-center gap-2">
                                <Link 
                                  href={`/reviews/edit/${review.id}`}
                                  className="p-2 rounded-lg text-ink-500 hover:bg-parchment-100 transition-colors"
                                >
                                  <PencilSimple weight="bold" className="h-4 w-4" />
                                </Link>
                                <button
                                  onClick={() => setDeleteModal(review.id)}
                                  className="p-2 rounded-lg text-ink-500 hover:text-red-500 hover:bg-red-50 transition-colors"
                                >
                                  <Trash weight="bold" className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {deleteModal && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl p-6 max-w-md w-full animate-fade-up">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-xl bg-red-100">
                    <Warning weight="fill" className="h-6 w-6 text-red-600" />
                  </div>
                  <h2 className="font-serif text-xl font-bold text-ink-900">Delete Review</h2>
                </div>
                <p className="text-ink-600 mb-6">
                  Are you sure you want to delete this review? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <Button 
                    onClick={() => setDeleteModal(null)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={() => handleDeleteReview(deleteModal)}
                    className="bg-red-600 text-white hover:bg-red-700 flex-1"
                  >
                    <Trash weight="bold" className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Tip Banner */}
          <div className="mt-8 p-4 bg-emerald-50 rounded-xl flex items-start gap-3">
            <Star weight="fill" className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-emerald-900 font-medium">Writing great reviews</p>
              <p className="text-sm text-emerald-700">
                Helpful reviews explain what you liked or disliked and why. Your honest feedback helps other readers discover great books!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
