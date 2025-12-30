'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  Star, 
  BookOpen, 
  Headphones, 
  Book, 
  ShoppingCart,
  Heart,
  ShareNetwork,
  CaretDown,
  Play,
  Quotes
} from '@phosphor-icons/react';
import { cn, formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui';
import { getBookById, getBookReviews, isUsingMockData } from '@/lib/data';
import type { Book as BookType, Review } from '@/lib/data';

// Type for the book detail page
interface BookDetailAuthor {
  id: string;
  penName: string;
  name: string;
  bio: string;
  profileImage: string | null;
}

interface BookDetail {
  id: string;
  title: string;
  subtitle: string;
  author: BookDetailAuthor;
  description: string;
  blurb: string;
  genre: string[];
  language: string;
  pageCount: number;
  publishedAt: string;
  isbn: string;
  coverImage: string | null;
  formats: { format: string; price: number; available: boolean }[];
  averageRating: number;
  reviewCount: number;
}

// Fallback mock data for demo mode (matches data layer format)
const fallbackMockBook: BookDetail = {
  id: '1',
  title: 'The Midnight Garden',
  subtitle: 'A Tale of Magic and Mystery',
  author: {
    id: 'author1',
    penName: 'J.K. Writer',
    name: 'James Writer',
    bio: 'A passionate storyteller with a love for fantasy and adventure. Author of the bestselling "Chronicles of Eldoria" series.',
    profileImage: null,
  },
  description: `In the heart of Victorian London, young botanist Eleanor discovers a garden that only blooms at midnight. As she unravels its secrets, she finds herself entangled in a world of ancient magic, forbidden love, and dangerous conspiracies.

A beautifully crafted tale that weaves together history, romance, and the supernatural in a story that will captivate readers from the first page to the last.

What begins as a simple curiosity becomes an obsession that will change Eleanor's life forever. With richly drawn characters and atmospheric prose, The Midnight Garden is a testament to the power of wonder and the courage it takes to follow your heart into the unknown.`,
  blurb: 'Some gardens hold secrets that were never meant to be found...',
  genre: ['Fantasy', 'Historical Fiction'],
  language: 'English',
  pageCount: 384,
  publishedAt: '2024-03-15',
  isbn: '978-1-234567-89-0',
  coverImage: null,
  formats: [
    { format: 'PAPERBACK', price: 16.99, available: true },
    { format: 'HARDCOVER', price: 24.99, available: true },
    { format: 'EBOOK', price: 9.99, available: true },
    { format: 'AUDIOBOOK', price: 19.99, available: true },
  ],
  averageRating: 4.8,
  reviewCount: 127,
};

const fallbackMockReviews: Review[] = [
  {
    id: 'r1',
    rating: 5,
    title: 'Absolutely enchanting!',
    content: 'I was completely transported to Victorian London. The characters are beautifully developed and the magical elements are woven seamlessly into the historical setting. Could not put it down!',
    verified: true,
    helpful: 23,
    date: '2024-04-10',
    user: { name: 'Emily R.', avatar: null },
  },
  {
    id: 'r2',
    rating: 5,
    title: 'A modern classic',
    content: 'The prose is gorgeous and the story is captivating. This book reminded me why I fell in love with reading.',
    verified: true,
    helpful: 15,
    date: '2024-04-08',
    user: { name: 'Michael T.', avatar: null },
  },
  {
    id: 'r3',
    rating: 4,
    title: 'Beautiful but slow start',
    content: 'The writing is exquisite and the world-building is masterful. It took me a few chapters to get into it, but once I did, I was hooked.',
    verified: false,
    helpful: 8,
    date: '2024-04-05',
    user: { name: 'Sarah K.', avatar: null },
  },
];

export default function BookDetailPage({ params }: { params: { id: string } }) {
  const [book, setBook] = useState<BookDetail | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFormat, setSelectedFormat] = useState(fallbackMockBook.formats[0]);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    async function fetchBook() {
      setLoading(true);
      try {
        const [bookData, reviewData] = await Promise.all([
          getBookById(params.id),
          getBookReviews(params.id),
        ]);
        
        if (bookData) {
          // Transform to expected shape
          setBook({
            id: bookData.id,
            title: bookData.title,
            subtitle: bookData.subtitle || '',
            author: {
              id: bookData.author.id,
              penName: bookData.author.penName,
              name: bookData.author.name,
              bio: bookData.author.bio || '',
              profileImage: bookData.author.avatar || null,
            },
            description: bookData.description,
            blurb: '', // Book type doesn't have blurb, use empty or extract from description
            genre: bookData.genre,
            language: bookData.language || 'English',
            pageCount: bookData.pageCount || 0,
            publishedAt: bookData.publishedDate || new Date().toISOString(),
            isbn: bookData.isbn || '',
            coverImage: bookData.coverImage,
            formats: bookData.formats.map(f => ({
              format: f.format,
              price: f.price,
              available: f.available ?? true,
            })),
            averageRating: bookData.averageRating,
            reviewCount: bookData.reviewCount,
          });
          setSelectedFormat({
            format: bookData.formats[0].format,
            price: bookData.formats[0].price,
            available: bookData.formats[0].available ?? true,
          });
          setReviews(reviewData);
        } else if (isUsingMockData()) {
          // In demo mode, show fallback
          setBook(fallbackMockBook);
          setReviews(fallbackMockReviews);
        } else {
          // Real mode, book not found
          setBook(null);
        }
      } catch (error) {
        console.error('Error fetching book:', error);
        if (isUsingMockData()) {
          setBook(fallbackMockBook);
          setReviews(fallbackMockReviews);
        }
      } finally {
        setLoading(false);
      }
    }
    
    fetchBook();
  }, [params.id]);

  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-parchment-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-parchment-200 border-t-amber-500"></div>
      </div>
    );
  }

  if (!book) {
    notFound();
  }

  const formatIcons: Record<string, typeof Book> = {
    PAPERBACK: Book,
    HARDCOVER: Book,
    EBOOK: BookOpen,
    AUDIOBOOK: Headphones,
  };

  return (
    <div className="pt-20 min-h-screen bg-parchment-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-parchment-200">
        <div className="container-editorial py-4">
          <nav className="text-sm text-ink-500">
            <Link href="/bookstore" className="hover:text-ink-900">Bookstore</Link>
            <span className="mx-2">/</span>
            <span className="text-ink-900">{book.title}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <section className="section">
        <div className="container-editorial">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Left Column - Cover & Preview */}
            <div className="lg:col-span-1">
              <div className="sticky top-28">
                {/* Cover */}
                <div className="aspect-book bg-gradient-to-br from-ink-800 to-ink-900 rounded-lg shadow-book flex items-center justify-center mb-6">
                  <div className="text-center p-8">
                    <BookOpen weight="duotone" className="h-24 w-24 text-parchment-400 mx-auto mb-4" />
                    <p className="text-parchment-300 font-serif text-lg">{book.title}</p>
                  </div>
                </div>

                {/* Preview Buttons */}
                <div className="flex gap-3">
                  <button className="btn-outline flex-1 text-sm">
                    <BookOpen weight="bold" className="mr-2 h-4 w-4" />
                    Read Preview
                  </button>
                  {book.formats.some(f => f.format === 'AUDIOBOOK') && (
                    <button className="btn-outline flex-1 text-sm">
                      <Play weight="fill" className="mr-2 h-4 w-4" />
                      Listen
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Middle Column - Book Info */}
            <div className="lg:col-span-1">
              {/* Title & Author */}
              <div className="mb-6">
                <p className="text-sm text-ink-500 mb-1">{book.genre.join(' • ')}</p>
                <h1 className="font-serif text-3xl font-bold text-ink-900 mb-2">
                  {book.title}
                </h1>
                {book.subtitle && (
                  <p className="text-lg text-ink-600 mb-3">{book.subtitle}</p>
                )}
                <Link 
                  href={`/author/${book.author.id}`}
                  className="text-accent-warm hover:text-accent-amber transition-colors"
                >
                  by {book.author.penName}
                </Link>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        'h-5 w-5',
                        i < Math.round(book.averageRating)
                          ? 'fill-accent-yellow text-accent-yellow'
                          : 'text-parchment-300'
                      )}
                    />
                  ))}
                </div>
                <span className="font-semibold text-ink-900">{book.averageRating}</span>
                <Link href="#reviews" className="text-sm text-ink-500 hover:text-ink-900">
                  {book.reviewCount} reviews
                </Link>
              </div>

              {/* Blurb */}
              <div className="mb-6 p-4 bg-parchment-100 rounded-lg border-l-4 border-accent-yellow">
                <Quotes weight="duotone" className="h-6 w-6 text-accent-yellow mb-2" />
                <p className="font-serif text-lg italic text-ink-700">{book.blurb}</p>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h2 className="font-serif text-lg font-semibold text-ink-900 mb-3">About this book</h2>
                <div className={cn(
                  'prose-editorial text-ink-700',
                  !showFullDescription && 'line-clamp-4'
                )}>
                  {book.description.split('\n\n').map((p, i) => (
                    <p key={i} className="mb-3">{p}</p>
                  ))}
                </div>
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="text-sm text-accent-warm hover:text-accent-amber mt-2 flex items-center gap-1"
                >
                  {showFullDescription ? 'Show less' : 'Read more'}
                  <CaretDown weight="bold" className={cn('h-4 w-4 transition-transform', showFullDescription && 'rotate-180')} />
                </button>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-white rounded-lg border border-parchment-200">
                <div>
                  <p className="text-sm text-ink-500">Pages</p>
                  <p className="font-medium text-ink-900">{book.pageCount}</p>
                </div>
                <div>
                  <p className="text-sm text-ink-500">Language</p>
                  <p className="font-medium text-ink-900">{book.language}</p>
                </div>
                <div>
                  <p className="text-sm text-ink-500">Published</p>
                  <p className="font-medium text-ink-900">{new Date(book.publishedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                </div>
                <div>
                  <p className="text-sm text-ink-500">ISBN</p>
                  <p className="font-medium text-ink-900 text-xs">{book.isbn}</p>
                </div>
              </div>
            </div>

            {/* Right Column - Purchase */}
            <div className="lg:col-span-1">
              <div className="card p-6 sticky top-28">
                <h2 className="font-serif text-lg font-semibold text-ink-900 mb-4">
                  Choose your format
                </h2>

                {/* Format Selection */}
                <div className="space-y-3 mb-6">
                  {book.formats.map((format) => {
                    const Icon = formatIcons[format.format];
                    return (
                      <button
                        key={format.format}
                        onClick={() => setSelectedFormat(format)}
                        className={cn(
                          'w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all',
                          selectedFormat.format === format.format
                            ? 'border-ink-900 bg-ink-50'
                            : 'border-parchment-200 hover:border-ink-300'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="h-5 w-5 text-ink-600" />
                          <span className="font-medium text-ink-900 capitalize">
                            {format.format.toLowerCase()}
                          </span>
                        </div>
                        <span className="font-semibold text-ink-900">
                          {formatCurrency(format.price)}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Quantity (for physical books) */}
                {['PAPERBACK', 'HARDCOVER'].includes(selectedFormat.format) && (
                  <div className="flex items-center gap-3 mb-6">
                    <label className="text-sm text-ink-600">Quantity:</label>
                    <select
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="input w-20 py-2"
                    >
                      {Array.from({ length: 10 }).map((_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Add to Cart */}
                <Button variant="primary" className="w-full mb-3">
                  <ShoppingCart weight="bold" className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>

                {/* Secondary Actions */}
                <div className="flex gap-3">
                  <Button variant="ghost" className="flex-1">
                    <Heart weight="bold" className="mr-2 h-4 w-4" />
                    Wishlist
                  </Button>
                  <Button variant="ghost" className="flex-1">
                    <ShareNetwork weight="bold" className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                </div>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t border-parchment-200">
                  <p className="text-xs text-ink-500 text-center">
                    Secure checkout • Instant digital delivery • 30-day refund policy
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Author Section */}
          <div className="mt-16 p-8 bg-white rounded-lg border border-parchment-200">
            <h2 className="font-serif text-2xl font-bold text-ink-900 mb-6">About the Author</h2>
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 rounded-full bg-parchment-200 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-serif text-ink-500">
                  {book.author.penName.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="font-serif text-xl font-semibold text-ink-900 mb-2">
                  {book.author.penName}
                </h3>
                <p className="text-ink-600 mb-4">{book.author.bio}</p>
                <Link href={`/author/${book.author.id}`} className="link">
                  View all books by this author →
                </Link>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div id="reviews" className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-serif text-2xl font-bold text-ink-900">
                Customer Reviews
              </h2>
              <Button variant="outline">Write a Review</Button>
            </div>

            {/* Rating Summary */}
            <div className="grid md:grid-cols-3 gap-8 mb-8 p-6 bg-white rounded-lg border border-parchment-200">
              <div className="text-center">
                <p className="text-5xl font-serif font-bold text-ink-900 mb-2">
                  {book.averageRating}
                </p>
                <div className="flex items-center justify-center gap-1 mb-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        'h-5 w-5',
                        i < Math.round(book.averageRating)
                          ? 'fill-accent-yellow text-accent-yellow'
                          : 'text-parchment-300'
                      )}
                    />
                  ))}
                </div>
                <p className="text-sm text-ink-500">{book.reviewCount} reviews</p>
              </div>
              
              <div className="col-span-2 space-y-2">
                {[5, 4, 3, 2, 1].map((stars) => (
                  <div key={stars} className="flex items-center gap-3">
                    <span className="text-sm text-ink-600 w-8">{stars} ★</span>
                    <div className="flex-1 h-2 bg-parchment-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-accent-yellow rounded-full"
                        style={{ width: stars === 5 ? '75%' : stars === 4 ? '20%' : '5%' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Review List */}
            <div className="space-y-6">
              {reviews.length === 0 ? (
                <div className="p-8 bg-white rounded-lg border border-parchment-200 text-center">
                  <Star weight="duotone" className="h-12 w-12 text-parchment-300 mx-auto mb-3" />
                  <p className="text-ink-500">No reviews yet. Be the first to review this book!</p>
                </div>
              ) : (
                reviews.map((review) => (
                  <div key={review.id} className="p-6 bg-white rounded-lg border border-parchment-200">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={cn(
                                  'h-4 w-4',
                                  i < review.rating
                                    ? 'fill-accent-yellow text-accent-yellow'
                                    : 'text-parchment-300'
                                )}
                              />
                            ))}
                          </div>
                          {review.verified && (
                            <span className="badge-success text-xs">Verified Purchase</span>
                          )}
                        </div>
                        <h4 className="font-semibold text-ink-900">{review.title}</h4>
                      </div>
                      <span className="text-sm text-ink-500">
                        {new Date(review.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-ink-700 mb-4">{review.content}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-ink-500">By {review.user.name}</p>
                      <button className="text-sm text-ink-500 hover:text-ink-900">
                        Helpful ({review.helpful})
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {reviews.length > 0 && (
              <div className="mt-8 text-center">
                <Button variant="outline">Load More Reviews</Button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
