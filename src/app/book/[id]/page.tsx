'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  Star,
  Heart,
  ShoppingCart,
  BookOpen,
  Book,
  Headphones,
  ArrowLeft,
  Share,
  Eye,
  Clock,
  Fire,
  Sparkle,
  CheckCircle,
  CaretDown,
  CaretUp,
  ChatDots,
  ThumbsUp,
  Quotes,
  Globe,
  Shield,
  Truck,
  Gift,
  Lightning,
  User,
  SpinnerGap
} from '@phosphor-icons/react';
import { cn, formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui';
import { VerifiedBadge } from '@/components/authors/VerifiedBadge';
import { useAuth } from '@/lib/auth/AuthContext';
import { toast } from 'sonner';
import { 
  getBookById, 
  getBookReviews, 
  getRelatedBooks,
  addToCart as addToCartData,
  addToWishlist,
  removeFromWishlist,
  type Book as BookType,
  type Review,
  type RelatedBook
} from '@/lib/data';

export default function BookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [book, setBook] = useState<BookType | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedBooks, setRelatedBooks] = useState<RelatedBook[]>([]);
  const [selectedFormat, setSelectedFormat] = useState<string>('PAPERBACK');
  const [quantity, setQuantity] = useState(1);
  const [inWishlist, setInWishlist] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');
  const [adding, setAdding] = useState(false);

  const bookId = params.id as string;

  // Load book data from data layer
  const loadBook = useCallback(async () => {
    try {
      setLoading(true);
      const [bookData, reviewsData, relatedData] = await Promise.all([
        getBookById(bookId),
        getBookReviews(bookId),
        getRelatedBooks(bookId)
      ]);
      
      if (!bookData) {
        router.push('/bookstore');
        return;
      }
      
      setBook(bookData);
      setReviews(reviewsData);
      setRelatedBooks(relatedData);
    } catch (error) {
      console.error('Failed to load book:', error);
      toast.error('Failed to load book');
    } finally {
      setLoading(false);
    }
  }, [bookId, router]);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    loadBook();
  }, [loadBook]);

  if (loading || !book) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-parchment-50 to-cream-100 flex items-center justify-center">
        <SpinnerGap weight="bold" className="h-8 w-8 animate-spin text-accent-yellow" />
      </div>
    );
  }

  const selectedFormatData = book.formats.find(f => f.format === selectedFormat);

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please sign in to add to cart');
      router.push('/login?redirect=/book/' + book.id);
      return;
    }
    
    setAdding(true);
    try {
      await addToCartData(book.id, selectedFormat, quantity);
      toast.success(`${book.title} added to cart!`);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast.error('Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = () => {
    if (!user) {
      toast.error('Please sign in to continue');
      router.push('/login?redirect=/book/' + book.id);
      return;
    }
    router.push('/checkout');
  };

  const toggleWishlist = async () => {
    if (!user) {
      toast.error('Please sign in to save to wishlist');
      return;
    }
    
    try {
      if (inWishlist) {
        await removeFromWishlist(book.id);
        setInWishlist(false);
        toast.success('Removed from wishlist');
      } else {
        await addToWishlist(book.id);
        setInWishlist(true);
        toast.success('Added to wishlist');
      }
    } catch (error) {
      console.error('Failed to update wishlist:', error);
      toast.error('Failed to update wishlist');
    }
  };

  const formatIcon = (format: string) => {
    switch (format) {
      case 'AUDIOBOOK': return Headphones;
      case 'EBOOK': return BookOpen;
      default: return Book;
    }
  };

  const renderStars = (rating: number) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          weight={star <= Math.round(rating) ? 'fill' : 'regular'}
          className={cn('h-4 w-4', star <= Math.round(rating) ? 'text-accent-yellow' : 'text-parchment-300')}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-parchment-50 to-cream-100">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-parchment-200">
        <div className="container-editorial py-4">
          <div className={`flex items-center gap-2 text-sm transition-all duration-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
            <Link href="/bookstore" className="flex items-center gap-1.5 text-ink-500 hover:text-ink-700 transition-colors">
              <ArrowLeft weight="bold" className="h-4 w-4" />
              Back to Bookstore
            </Link>
            <span className="text-ink-300">/</span>
            <span className="text-ink-400">{book.genre[0]}</span>
            <span className="text-ink-300">/</span>
            <span className="text-ink-700 font-medium truncate">{book.title}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-editorial py-8 lg:py-12">
        <div className={`transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Left Column - Book Cover */}
            <div className="lg:w-96 flex-shrink-0">
              <div className="sticky top-24 space-y-4">
                {/* Cover */}
                <div className="relative rounded-2xl overflow-hidden shadow-elegant bg-white border border-parchment-200">
                  <div className={`aspect-[2/3] bg-gradient-to-br ${book.coverGradient} flex items-center justify-center relative`}>
                    <BookOpen weight="duotone" className="h-24 w-24 text-white/20" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    
                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {book.isBestseller && (
                        <span className="px-3 py-1.5 bg-gradient-to-r from-accent-yellow to-accent-amber text-ink-900 text-sm font-bold rounded-full flex items-center gap-1.5 shadow-md">
                          <Fire weight="fill" className="h-4 w-4" />
                          Bestseller
                        </span>
                      )}
                      {book.isNew && (
                        <span className="px-3 py-1.5 bg-ink-800 text-white text-sm font-bold rounded-full flex items-center gap-1.5 shadow-md">
                          <Sparkle weight="fill" className="h-4 w-4" />
                          New Release
                        </span>
                      )}
                    </div>
                    
                    {/* Title Overlay */}
                    <div className="absolute bottom-6 left-6 right-6">
                      <h1 className="font-serif text-2xl font-bold text-white drop-shadow-lg">
                        {book.title}
                      </h1>
                      {book.subtitle && (
                        <p className="text-white/80 text-sm mt-1">{book.subtitle}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={toggleWishlist}
                    className={cn(
                      'flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all',
                      inWishlist
                        ? 'bg-accent-yellow/20 text-accent-warm border border-accent-yellow'
                        : 'bg-white text-ink-600 border border-parchment-200 hover:border-accent-yellow hover:text-accent-warm'
                    )}
                  >
                    <Heart weight={inWishlist ? 'fill' : 'regular'} className="h-5 w-5" />
                    {inWishlist ? 'Saved' : 'Save'}
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium bg-white text-ink-600 border border-parchment-200 hover:border-ink-300 transition-all">
                    <Share weight="bold" className="h-5 w-5" />
                    Share
                  </button>
                </div>

                {/* Preview Button */}
                {book.previewAvailable && (
                  <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium bg-parchment-100 text-ink-700 hover:bg-parchment-200 transition-colors">
                    <Eye weight="bold" className="h-5 w-5" />
                    Read Preview ({book.sampleChapters} chapters)
                  </button>
                )}
              </div>
            </div>

            {/* Right Column - Details */}
            <div className="flex-1 min-w-0">
              {/* Header */}
              <div className="mb-6">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {book.genre.map((g) => (
                    <Link
                      key={g}
                      href={`/bookstore?genre=${g}`}
                      className="px-3 py-1 bg-parchment-100 hover:bg-parchment-200 rounded-full text-sm font-medium text-ink-600 transition-colors"
                    >
                      {g}
                    </Link>
                  ))}
                </div>
                
                <h1 className="font-serif text-3xl lg:text-4xl font-bold text-ink-900 mb-2">
                  {book.title}
                </h1>
                {book.subtitle && (
                  <p className="text-lg text-ink-600 mb-4">{book.subtitle}</p>
                )}

                {/* Author Info */}
                <Link
                  href={`/authors/${book.author.id}`}
                  className="inline-flex items-center gap-3 group"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-yellow to-accent-amber flex items-center justify-center text-ink-900 font-bold">
                    {book.author.penName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-ink-500">by</p>
                    <div className="flex items-center gap-1.5">
                      <p className="font-semibold text-ink-900 group-hover:text-accent-warm transition-colors">
                        {book.author.penName}
                      </p>
                      {book.author.isVerified && <VerifiedBadge size="sm" />}
                    </div>
                  </div>
                </Link>
              </div>

              {/* Rating Summary */}
              <div className="flex items-center gap-4 mb-8 pb-8 border-b border-parchment-200">
                <div className="flex items-center gap-2">
                  {renderStars(book.averageRating)}
                  <span className="font-bold text-ink-900 text-lg">{book.averageRating}</span>
                </div>
                <span className="text-ink-400">•</span>
                <Link href="#reviews" className="text-ink-600 hover:text-accent-warm transition-colors">
                  {book.reviewCount} reviews
                </Link>
                <span className="text-ink-400">•</span>
                <span className="text-ink-600">{book.pageCount} pages</span>
              </div>

              {/* Format Selection */}
              <div className="mb-8">
                <h3 className="font-semibold text-ink-900 mb-4">Choose Format</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {book.formats.map((format) => {
                    const Icon = formatIcon(format.format);
                    const isSelected = selectedFormat === format.format;
                    return (
                      <button
                        key={format.format}
                        onClick={() => setSelectedFormat(format.format)}
                        disabled={!format.available}
                        className={cn(
                          'p-4 rounded-xl border-2 text-left transition-all',
                          isSelected
                            ? 'border-accent-yellow bg-accent-yellow/10'
                            : 'border-parchment-200 bg-white hover:border-parchment-300',
                          !format.available && 'opacity-50 cursor-not-allowed'
                        )}
                      >
                        <Icon weight="duotone" className={cn('h-6 w-6 mb-2', isSelected ? 'text-accent-warm' : 'text-ink-400')} />
                        <p className="font-semibold text-ink-900 capitalize text-sm">{format.format.toLowerCase()}</p>
                        <p className="font-bold text-ink-900">{formatCurrency(format.price)}</p>
                      </button>
                    );
                  })}
                </div>
                
                {/* Audiobook Info */}
                {selectedFormat === 'AUDIOBOOK' && selectedFormatData && 'narrator' in selectedFormatData && (
                  <div className="mt-4 p-4 bg-parchment-100 rounded-xl flex items-center gap-4">
                    <Headphones weight="duotone" className="h-8 w-8 text-accent-warm" />
                    <div>
                      <p className="text-sm text-ink-600">Narrated by <span className="font-semibold text-ink-900">{selectedFormatData.narrator}</span></p>
                      <p className="text-sm text-ink-500">{selectedFormatData.duration}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Add to Cart Section */}
              <div className="bg-white rounded-2xl border border-parchment-200 shadow-card p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-ink-500">Selected: {selectedFormat.charAt(0) + selectedFormat.slice(1).toLowerCase()}</p>
                    <p className="font-serif text-3xl font-bold text-ink-900">
                      {formatCurrency(selectedFormatData?.price || 0)}
                    </p>
                  </div>
                  
                  {/* Quantity */}
                  {selectedFormat !== 'EBOOK' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-8 h-8 rounded-lg bg-parchment-100 hover:bg-parchment-200 flex items-center justify-center transition-colors"
                      >
                        <CaretDown weight="bold" className="h-4 w-4 text-ink-600" />
                      </button>
                      <span className="w-10 text-center font-semibold text-ink-900">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-8 h-8 rounded-lg bg-parchment-100 hover:bg-parchment-200 flex items-center justify-center transition-colors"
                      >
                        <CaretUp weight="bold" className="h-4 w-4 text-ink-600" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleAddToCart}
                    disabled={adding}
                    className="flex-1 btn-lg bg-white border-2 border-ink-900 text-ink-900 hover:bg-parchment-100"
                  >
                    <ShoppingCart weight="bold" className="h-5 w-5" />
                    {adding ? 'Adding...' : 'Add to Cart'}
                  </Button>
                  <Button
                    onClick={handleBuyNow}
                    className="flex-1 btn-accent btn-lg"
                  >
                    <Lightning weight="bold" className="h-5 w-5" />
                    Buy Now
                  </Button>
                </div>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t border-parchment-100 grid grid-cols-3 gap-4 text-center">
                  <div>
                    <Truck weight="duotone" className="h-6 w-6 text-accent-warm mx-auto mb-1" />
                    <p className="text-xs text-ink-600">Free Shipping</p>
                  </div>
                  <div>
                    <Shield weight="duotone" className="h-6 w-6 text-accent-warm mx-auto mb-1" />
                    <p className="text-xs text-ink-600">Secure Payment</p>
                  </div>
                  <div>
                    <Gift weight="duotone" className="h-6 w-6 text-accent-warm mx-auto mb-1" />
                    <p className="text-xs text-ink-600">Gift Wrapping</p>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-parchment-200 mb-6">
                <div className="flex gap-6">
                  <button
                    onClick={() => setActiveTab('details')}
                    className={cn(
                      'pb-4 font-semibold text-sm transition-colors relative',
                      activeTab === 'details' ? 'text-ink-900' : 'text-ink-500 hover:text-ink-700'
                    )}
                  >
                    About This Book
                    {activeTab === 'details' && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-yellow" />
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className={cn(
                      'pb-4 font-semibold text-sm transition-colors relative',
                      activeTab === 'reviews' ? 'text-ink-900' : 'text-ink-500 hover:text-ink-700'
                    )}
                  >
                    Reviews ({book.reviewCount})
                    {activeTab === 'reviews' && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-yellow" />
                    )}
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              {activeTab === 'details' ? (
                <div className="space-y-8">
                  {/* Description */}
                  <div>
                    <div
                      className={cn(
                        'prose prose-ink max-w-none',
                        !showFullDescription && 'line-clamp-4'
                      )}
                      dangerouslySetInnerHTML={{ __html: book.description }}
                    />
                    <button
                      onClick={() => setShowFullDescription(!showFullDescription)}
                      className="mt-3 text-accent-warm font-medium flex items-center gap-1 hover:underline"
                    >
                      {showFullDescription ? 'Show less' : 'Read more'}
                      <CaretDown className={cn('h-4 w-4 transition-transform', showFullDescription && 'rotate-180')} />
                    </button>
                  </div>

                  {/* Book Details */}
                  <div className="bg-parchment-50 rounded-2xl p-6">
                    <h3 className="font-serif text-lg font-bold text-ink-900 mb-4">Book Details</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-ink-500">Publisher</span>
                        <span className="text-ink-900 font-medium">{book.publisher}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-ink-500">Language</span>
                        <span className="text-ink-900 font-medium">{book.language}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-ink-500">Pages</span>
                        <span className="text-ink-900 font-medium">{book.pageCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-ink-500">Published</span>
                        <span className="text-ink-900 font-medium">{book.publishedDate ? new Date(book.publishedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A'}</span>
                      </div>
                      <div className="flex justify-between col-span-2">
                        <span className="text-ink-500">ISBN</span>
                        <span className="text-ink-900 font-medium">{book.isbn || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Author Card */}
                  <div className="bg-white rounded-2xl border border-parchment-200 shadow-card p-6">
                    <h3 className="font-serif text-lg font-bold text-ink-900 mb-4">About the Author</h3>
                    <div className="flex gap-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent-yellow to-accent-amber flex items-center justify-center text-ink-900 font-bold text-2xl flex-shrink-0">
                        {book.author.penName.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <Link href={`/authors/${book.author.id}`} className="font-semibold text-ink-900 hover:text-accent-warm transition-colors">
                          {book.author.penName}
                        </Link>
                        <p className="text-sm text-ink-500 mt-1">{book.author.bio}</p>
                        <div className="flex items-center gap-4 mt-3 text-sm">
                          <span className="text-ink-600"><strong className="text-ink-900">{book.author.booksCount || 0}</strong> books</span>
                          <span className="text-ink-600"><strong className="text-ink-900">{(book.author.followersCount || 0).toLocaleString()}</strong> followers</span>
                        </div>
                        <Link href={`/authors/${book.author.id}`} className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-accent-warm hover:underline">
                          View all books <ArrowLeft weight="bold" className="h-3 w-3 rotate-180" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Reviews Tab */
                <div id="reviews" className="space-y-6">
                  {/* Rating Summary */}
                  <div className="bg-parchment-50 rounded-2xl p-6 flex items-center gap-8">
                    <div className="text-center">
                      <p className="font-serif text-5xl font-bold text-ink-900">{book.averageRating}</p>
                      <div className="flex justify-center my-2">{renderStars(book.averageRating)}</div>
                      <p className="text-sm text-ink-500">{book.reviewCount} reviews</p>
                    </div>
                    <div className="flex-1 space-y-2">
                      {[5, 4, 3, 2, 1].map((stars) => {
                        const count = stars === 5 ? 85 : stars === 4 ? 32 : stars === 3 ? 8 : stars === 2 ? 2 : 0;
                        const percentage = (count / book.reviewCount) * 100;
                        return (
                          <div key={stars} className="flex items-center gap-2">
                            <span className="text-sm text-ink-600 w-12">{stars} stars</span>
                            <div className="flex-1 h-2 bg-parchment-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-accent-yellow rounded-full"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-sm text-ink-500 w-8">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Reviews List */}
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="bg-white rounded-2xl border border-parchment-200 shadow-card p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-parchment-200 flex items-center justify-center">
                              <User weight="bold" className="h-5 w-5 text-ink-400" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-ink-900">{review.user.name}</p>
                                {review.verified && (
                                  <span className="flex items-center gap-1 text-xs text-accent-warm">
                                    <CheckCircle weight="fill" className="h-3 w-3" />
                                    Verified
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-ink-500">{new Date(review.date).toLocaleDateString()}</p>
                            </div>
                          </div>
                          {renderStars(review.rating)}
                        </div>
                        <h4 className="font-semibold text-ink-900 mb-2">{review.title}</h4>
                        <p className="text-ink-600 text-sm">{review.content}</p>
                        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-parchment-100">
                          <button className="flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-700 transition-colors">
                            <ThumbsUp weight="regular" className="h-4 w-4" />
                            Helpful ({review.helpful})
                          </button>
                          <button className="flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-700 transition-colors">
                            <ChatDots weight="regular" className="h-4 w-4" />
                            Reply
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button className="w-full btn-secondary">
                    Load More Reviews
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Related Books */}
          <section className="mt-16 pt-16 border-t border-parchment-200">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-serif text-2xl font-bold text-ink-900">You Might Also Like</h2>
              <Link href="/bookstore" className="text-sm font-semibold text-ink-700 hover:text-accent-warm flex items-center gap-1.5 transition-colors">
                Browse More <ArrowLeft weight="bold" className="h-4 w-4 rotate-180" />
              </Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {relatedBooks.map((relBook) => (
                <Link key={relBook.id} href={`/book/${relBook.id}`} className="group">
                  <div className="bg-white rounded-2xl border border-parchment-200 shadow-card overflow-hidden hover:shadow-elegant hover:-translate-y-1 transition-all">
                    <div className={`aspect-[3/4] bg-gradient-to-br ${relBook.coverGradient} flex items-center justify-center`}>
                      <BookOpen weight="duotone" className="h-12 w-12 text-white/20" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-serif font-bold text-ink-900 line-clamp-1 group-hover:text-accent-warm transition-colors">
                        {relBook.title}
                      </h3>
                      <p className="text-sm text-ink-500 mb-2">{relBook.author}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star weight="fill" className="h-4 w-4 text-accent-yellow" />
                          <span className="text-sm font-semibold text-ink-800">{relBook.rating}</span>
                        </div>
                        <p className="font-serif font-bold text-ink-900">{formatCurrency(relBook.price)}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
