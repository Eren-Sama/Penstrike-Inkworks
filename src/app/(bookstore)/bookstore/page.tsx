'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { 
  MagnifyingGlass, 
  FunnelSimple, 
  SquaresFour, 
  ListBullets, 
  Star, 
  BookOpen, 
  Headphones, 
  Book,
  Heart,
  ShoppingCart,
  X,
  Sparkle,
  Fire,
  Clock,
  TrendUp,
  BookmarkSimple,
  ArrowRight,
  CaretDown,
  SpinnerGap
} from '@phosphor-icons/react';
import { cn, formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui';
import { VerifiedBadge } from '@/components/authors/VerifiedBadge';
import { useAuth } from '@/lib/auth/AuthContext';
import { toast } from 'sonner';
import { getBooks, getGenresFromBooks, addToWishlist, removeFromWishlist, addToCart as addToCartData } from '@/lib/data';
import type { BookListItem, Genre } from '@/lib/data';

export default function BookstorePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState<BookListItem[]>([]);
  const [genres, setGenres] = useState<Genre[]>([{ name: 'All Genres', count: 0 }]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All Genres');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('popular');
  const [showFilters, setShowFilters] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);

  // Load books from data layer
  const loadBooks = useCallback(async () => {
    try {
      setLoading(true);
      const bookData = await getBooks();
      setBooks(bookData);
      setGenres(getGenresFromBooks(bookData));
    } catch (error) {
      console.error('Failed to load books:', error);
      toast.error('Failed to load books');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.penName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre =
      selectedGenre === 'All Genres' || book.genre.includes(selectedGenre);
    return matchesSearch && matchesGenre;
  });

  const sortedBooks = [...filteredBooks].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return a.isNew ? -1 : 1;
      case 'rating':
        return b.averageRating - a.averageRating;
      case 'price-low':
        return Math.min(...a.formats.map(f => f.price)) - Math.min(...b.formats.map(f => f.price));
      case 'price-high':
        return Math.min(...b.formats.map(f => f.price)) - Math.min(...a.formats.map(f => f.price));
      default:
        return b.reviewCount - a.reviewCount;
    }
  });

  const getLowestPrice = (formats: { price: number }[]) => {
    return Math.min(...formats.map((f) => f.price));
  };

  const toggleWishlist = async (bookId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error('Please sign in to add to wishlist');
      return;
    }
    
    try {
      if (wishlist.includes(bookId)) {
        await removeFromWishlist(bookId);
        setWishlist(prev => prev.filter(id => id !== bookId));
        toast.success('Removed from wishlist');
      } else {
        await addToWishlist(bookId);
        setWishlist(prev => [...prev, bookId]);
        toast.success('Added to wishlist');
      }
    } catch (error) {
      console.error('Failed to update wishlist:', error);
      toast.error('Failed to update wishlist');
    }
  };

  const addToCart = async (bookId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error('Please sign in to add to cart');
      return;
    }
    
    try {
      await addToCartData(bookId, 'EBOOK', 1);
      toast.success('Added to cart');
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast.error('Failed to add to cart');
    }
  };

  const featuredBooks = books.filter(b => b.isBestseller).slice(0, 4);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-parchment-50 to-cream-100 flex items-center justify-center">
        <SpinnerGap weight="bold" className="h-8 w-8 animate-spin text-accent-yellow" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-parchment-50 to-cream-100">
      {/* Hero Section - Warm Parchment Theme */}
      <section className="relative overflow-hidden bg-gradient-to-br from-parchment-100 via-cream-100 to-parchment-200 border-b border-parchment-200">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-yellow/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-parchment-300/30 rounded-full blur-3xl" />
        </div>
        <div className="absolute inset-0 bg-grid opacity-20" />
        
        <div className="container-editorial relative z-10 py-16 lg:py-20">
          <div className={`max-w-3xl transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-parchment-300 shadow-sm mb-6">
              <BookOpen weight="duotone" className="h-4 w-4 text-accent-warm" />
              <span className="text-sm font-medium text-ink-700">Curated Collection</span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-ink-900 mb-6 leading-tight">
              Discover Your Next{' '}
              <span className="text-gradient-gold">Great Read</span>
            </h1>
            <p className="text-lg md:text-xl text-ink-600 mb-8 max-w-2xl">
              Explore exceptional books from independent authors. From bestselling fiction to thought-provoking non-fiction, find stories that resonate.
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-xl">
              <MagnifyingGlass weight="bold" className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-ink-400" />
              <input
                type="text"
                placeholder="Search by title, author, or genre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white text-ink-900 placeholder-ink-400 border border-parchment-300 shadow-card focus:ring-2 focus:ring-accent-yellow focus:border-accent-yellow focus:outline-none transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="py-12 bg-white border-b border-parchment-200">
        <div className="container-editorial">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-accent-yellow/30 to-accent-amber/20">
                <Fire weight="fill" className="h-5 w-5 text-accent-warm" />
              </div>
              <div>
                <h2 className="font-serif text-2xl font-bold text-ink-900">Bestsellers</h2>
                <p className="text-sm text-ink-500">Top picks from our collection</p>
              </div>
            </div>
            <Link href="#all-books" className="text-sm font-semibold text-ink-700 hover:text-accent-warm flex items-center gap-1.5 transition-colors">
              View All <ArrowRight weight="bold" className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
            {featuredBooks.map((book, index) => (
              <Link
                key={book.id}
                href={`/book/${book.id}`}
                className="group"
                style={{ 
                  opacity: mounted ? 1 : 0, 
                  transform: mounted ? 'translateY(0)' : 'translateY(16px)',
                  transition: `all 0.5s ease ${index * 100}ms`
                }}
              >
                <div className="relative bg-white rounded-2xl border border-parchment-200 shadow-card hover:shadow-elegant overflow-hidden transition-all duration-300 group-hover:-translate-y-1">
                  {/* Bestseller Badge */}
                  <div className="absolute top-3 left-3 z-10 px-2.5 py-1 bg-gradient-to-r from-accent-yellow to-accent-amber text-ink-900 text-xs font-bold rounded-full flex items-center gap-1 shadow-sm">
                    <Fire weight="fill" className="h-3 w-3" />
                    Bestseller
                  </div>
                  
                  {/* Cover */}
                  <div className={`aspect-[3/4] bg-gradient-to-br ${book.coverGradient} flex items-center justify-center relative overflow-hidden`}>
                    <BookOpen weight="duotone" className="h-16 w-16 text-white/20" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-white font-serif font-bold text-base line-clamp-2 drop-shadow-md">
                        {book.title}
                      </p>
                    </div>
                    
                    {/* Hover Actions */}
                    <div className="absolute inset-0 bg-ink-900/70 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-4">
                      <button
                        onClick={(e) => toggleWishlist(book.id, e)}
                        className={cn(
                          "p-3 rounded-full transition-all transform hover:scale-110",
                          wishlist.includes(book.id) 
                            ? "bg-accent-yellow text-ink-900" 
                            : "bg-white/20 text-white hover:bg-white/30"
                        )}
                      >
                        <Heart weight={wishlist.includes(book.id) ? "fill" : "regular"} className="h-5 w-5" />
                      </button>
                      <button
                        onClick={(e) => addToCart(book.id, e)}
                        className="p-3 rounded-full bg-accent-yellow text-ink-900 hover:bg-accent-amber transition-all transform hover:scale-110"
                      >
                        <ShoppingCart weight="bold" className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <div className="flex items-center gap-1 mb-1.5">
                      <p className="text-sm text-ink-500">{book.author.penName}</p>
                      {book.author.isVerified && <VerifiedBadge size="sm" />}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Star weight="fill" className="h-4 w-4 text-accent-yellow" />
                        <span className="text-sm font-semibold text-ink-800">{book.averageRating}</span>
                        <span className="text-xs text-ink-400">({book.reviewCount})</span>
                      </div>
                      <p className="font-serif font-bold text-ink-900">
                        {formatCurrency(getLowestPrice(book.formats))}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section id="all-books" className="py-12">
        <div className="container-editorial">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar - Desktop */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24 space-y-6">
                {/* Categories */}
                <div className="bg-white rounded-2xl border border-parchment-200 shadow-card overflow-hidden">
                  <div className="px-5 py-4 bg-gradient-to-r from-parchment-100 to-cream-100 border-b border-parchment-200">
                    <h3 className="font-serif text-lg font-bold text-ink-900">Categories</h3>
                  </div>
                  <nav className="p-3">
                    {genres.map((genre) => (
                      <button
                        key={genre.name}
                        onClick={() => setSelectedGenre(genre.name)}
                        className={cn(
                          'w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all duration-200',
                          selectedGenre === genre.name
                            ? 'bg-gradient-to-r from-accent-yellow to-accent-amber text-ink-900 font-semibold shadow-sm'
                            : 'text-ink-600 hover:bg-parchment-100'
                        )}
                      >
                        <span>{genre.name}</span>
                        <span className={cn(
                          'text-xs px-2 py-0.5 rounded-full',
                          selectedGenre === genre.name
                            ? 'bg-ink-900/10'
                            : 'bg-parchment-100 text-ink-500'
                        )}>
                          {genre.count}
                        </span>
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Format Filter */}
                <div className="bg-white rounded-2xl border border-parchment-200 shadow-card overflow-hidden">
                  <div className="px-5 py-4 bg-gradient-to-r from-parchment-100 to-cream-100 border-b border-parchment-200">
                    <h3 className="font-serif text-lg font-bold text-ink-900">Format</h3>
                  </div>
                  <div className="p-4 space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" className="w-4 h-4 rounded border-parchment-300 text-accent-yellow focus:ring-accent-yellow" defaultChecked />
                      <Book weight="duotone" className="h-4 w-4 text-ink-400 group-hover:text-accent-warm transition-colors" />
                      <span className="text-sm text-ink-600 group-hover:text-ink-900 transition-colors">Print Books</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" className="w-4 h-4 rounded border-parchment-300 text-accent-yellow focus:ring-accent-yellow" defaultChecked />
                      <BookOpen weight="duotone" className="h-4 w-4 text-ink-400 group-hover:text-accent-warm transition-colors" />
                      <span className="text-sm text-ink-600 group-hover:text-ink-900 transition-colors">eBooks</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" className="w-4 h-4 rounded border-parchment-300 text-accent-yellow focus:ring-accent-yellow" defaultChecked />
                      <Headphones weight="duotone" className="h-4 w-4 text-ink-400 group-hover:text-accent-warm transition-colors" />
                      <span className="text-sm text-ink-600 group-hover:text-ink-900 transition-colors">Audiobooks</span>
                    </label>
                  </div>
                </div>

                {/* Price Range */}
                <div className="bg-white rounded-2xl border border-parchment-200 shadow-card overflow-hidden">
                  <div className="px-5 py-4 bg-gradient-to-r from-parchment-100 to-cream-100 border-b border-parchment-200">
                    <h3 className="font-serif text-lg font-bold text-ink-900">Price Range</h3>
                  </div>
                  <div className="p-4 space-y-3">
                    {['Under ₹500', '₹500 - ₹1000', '₹1000 - ₹1500', 'Over ₹1500'].map((range, i) => (
                      <label key={range} className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 rounded border-parchment-300 text-accent-yellow focus:ring-accent-yellow" 
                          defaultChecked={i < 3} 
                        />
                        <span className="text-sm text-ink-600 group-hover:text-ink-900 transition-colors">{range}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Mobile Filter Button */}
            <div className="lg:hidden flex items-center gap-3 mb-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border border-parchment-200 text-ink-700 shadow-sm"
              >
                <FunnelSimple weight="bold" className="h-5 w-5" />
                <span className="font-medium">Filters</span>
                {selectedGenre !== 'All Genres' && (
                  <span className="px-2 py-0.5 bg-accent-yellow text-ink-900 text-xs font-bold rounded-full">1</span>
                )}
              </button>
              
              <div className="flex-1 relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full appearance-none px-4 py-2.5 pr-10 bg-white rounded-xl border border-parchment-200 text-ink-700 shadow-sm font-medium"
                >
                  <option value="popular">Most Popular</option>
                  <option value="newest">Newest</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
                <CaretDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400 pointer-events-none" />
              </div>
            </div>

            {/* Mobile Filters Drawer */}
            {showFilters && (
              <div className="fixed inset-0 z-50 lg:hidden">
                <div className="absolute inset-0 bg-ink-900/50" onClick={() => setShowFilters(false)} />
                <div className="absolute right-0 top-0 bottom-0 w-80 bg-white overflow-y-auto">
                  <div className="sticky top-0 bg-white border-b border-parchment-200 px-5 py-4 flex items-center justify-between">
                    <h3 className="font-serif text-xl font-bold text-ink-900">Filters</h3>
                    <button 
                      onClick={() => setShowFilters(false)}
                      className="p-2 rounded-lg hover:bg-parchment-100 transition-colors"
                    >
                      <X className="h-5 w-5 text-ink-600" />
                    </button>
                  </div>
                  
                  <div className="p-5 space-y-6">
                    <div>
                      <h4 className="font-semibold text-ink-900 mb-3">Categories</h4>
                      <div className="space-y-1">
                        {genres.map((genre) => (
                          <button
                            key={genre.name}
                            onClick={() => {
                              setSelectedGenre(genre.name);
                              setShowFilters(false);
                            }}
                            className={cn(
                              'w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-colors',
                              selectedGenre === genre.name
                                ? 'bg-gradient-to-r from-accent-yellow to-accent-amber text-ink-900 font-semibold'
                                : 'text-ink-600 hover:bg-parchment-100'
                            )}
                          >
                            <span>{genre.name}</span>
                            <span className="text-xs">{genre.count}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Books Content */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="hidden lg:flex items-center justify-between mb-6 bg-white rounded-2xl border border-parchment-200 shadow-card p-4">
                <div className="flex items-center gap-4">
                  <p className="text-ink-600">
                    Showing <span className="font-bold text-ink-900">{sortedBooks.length}</span> books
                  </p>
                  {selectedGenre !== 'All Genres' && (
                    <button
                      onClick={() => setSelectedGenre('All Genres')}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-parchment-100 hover:bg-parchment-200 rounded-full text-sm text-ink-700 transition-colors"
                    >
                      {selectedGenre}
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="appearance-none px-4 py-2 pr-9 bg-parchment-50 rounded-xl border border-parchment-200 text-ink-700 text-sm font-medium cursor-pointer"
                    >
                      <option value="popular">Most Popular</option>
                      <option value="newest">Newest</option>
                      <option value="rating">Highest Rated</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                    </select>
                    <CaretDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400 pointer-events-none" />
                  </div>

                  <div className="flex items-center bg-parchment-50 rounded-xl border border-parchment-200 p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={cn(
                        'p-2 rounded-lg transition-all',
                        viewMode === 'grid' 
                          ? 'bg-gradient-to-r from-accent-yellow to-accent-amber text-ink-900 shadow-sm' 
                          : 'text-ink-500 hover:text-ink-700'
                      )}
                    >
                      <SquaresFour weight="bold" className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={cn(
                        'p-2 rounded-lg transition-all',
                        viewMode === 'list' 
                          ? 'bg-gradient-to-r from-accent-yellow to-accent-amber text-ink-900 shadow-sm' 
                          : 'text-ink-500 hover:text-ink-700'
                      )}
                    >
                      <ListBullets weight="bold" className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Books Grid */}
              {sortedBooks.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-parchment-200 shadow-card">
                  <BookOpen weight="duotone" className="h-16 w-16 text-parchment-300 mx-auto mb-4" />
                  <h3 className="font-serif text-xl text-ink-700 mb-2">No books found</h3>
                  <p className="text-ink-500 mb-6">Try adjusting your search or filters</p>
                  <Button 
                    onClick={() => { setSearchQuery(''); setSelectedGenre('All Genres'); }}
                    className="btn-accent"
                  >
                    Clear Filters
                  </Button>
                </div>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
                  {sortedBooks.map((book, index) => (
                    <Link
                      key={book.id}
                      href={`/book/${book.id}`}
                      className="group"
                      style={{ 
                        opacity: mounted ? 1 : 0, 
                        transform: mounted ? 'translateY(0)' : 'translateY(16px)',
                        transition: `all 0.5s ease ${index * 50}ms`
                      }}
                    >
                      <div className="relative bg-white rounded-2xl border border-parchment-200 shadow-card hover:shadow-elegant overflow-hidden transition-all duration-300 group-hover:-translate-y-1 group-hover:border-accent-yellow/50">
                        {/* Badges */}
                        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
                          {book.isBestseller && (
                            <span className="px-2.5 py-1 bg-gradient-to-r from-accent-yellow to-accent-amber text-ink-900 text-xs font-bold rounded-full flex items-center gap-1 shadow-sm">
                              <Fire weight="fill" className="h-3 w-3" />
                              Bestseller
                            </span>
                          )}
                          {book.isNew && (
                            <span className="px-2.5 py-1 bg-ink-800 text-white text-xs font-bold rounded-full flex items-center gap-1 shadow-sm">
                              <Sparkle weight="fill" className="h-3 w-3" />
                              New
                            </span>
                          )}
                        </div>
                        
                        {/* Cover */}
                        <div className={`aspect-[3/4] bg-gradient-to-br ${book.coverGradient} flex items-center justify-center relative overflow-hidden`}>
                          <BookOpen weight="duotone" className="h-16 w-16 text-white/20" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                          <div className="absolute bottom-4 left-4 right-4">
                            <p className="text-white font-serif font-bold text-sm line-clamp-2 drop-shadow-md">
                              {book.title}
                            </p>
                          </div>
                          
                          {/* Hover Actions */}
                          <div className="absolute inset-0 bg-ink-900/70 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-4">
                            <button
                              onClick={(e) => toggleWishlist(book.id, e)}
                              className={cn(
                                "p-3 rounded-full transition-all transform hover:scale-110",
                                wishlist.includes(book.id) 
                                  ? "bg-accent-yellow text-ink-900" 
                                  : "bg-white/20 text-white hover:bg-white/30"
                              )}
                            >
                              <Heart weight={wishlist.includes(book.id) ? "fill" : "regular"} className="h-5 w-5" />
                            </button>
                            <button
                              onClick={(e) => addToCart(book.id, e)}
                              className="p-3 rounded-full bg-accent-yellow text-ink-900 hover:bg-accent-amber transition-all transform hover:scale-110"
                            >
                              <ShoppingCart weight="bold" className="h-5 w-5" />
                            </button>
                          </div>
                        </div>

                        {/* Info */}
                        <div className="p-4">
                          <h3 className="font-serif font-bold text-ink-900 line-clamp-1 group-hover:text-accent-warm transition-colors mb-1">
                            {book.title}
                          </h3>
                          <div className="flex items-center gap-1 mb-2.5">
                            <p className="text-sm text-ink-500">{book.author.penName}</p>
                            {book.author.isVerified && <VerifiedBadge size="sm" />}
                          </div>
                          
                          {/* Rating */}
                          <div className="flex items-center gap-1.5 mb-3">
                            <Star weight="fill" className="h-4 w-4 text-accent-yellow" />
                            <span className="text-sm font-semibold text-ink-800">{book.averageRating}</span>
                            <span className="text-xs text-ink-400">({book.reviewCount})</span>
                          </div>

                          {/* Price & Formats */}
                          <div className="flex items-center justify-between pt-3 border-t border-parchment-100">
                            <div className="flex items-center gap-1.5">
                              {book.formats.some(f => f.format === 'PAPERBACK' || f.format === 'HARDCOVER') && (
                                <Book weight="duotone" className="h-4 w-4 text-ink-400" />
                              )}
                              {book.formats.some(f => f.format === 'EBOOK') && (
                                <BookOpen weight="duotone" className="h-4 w-4 text-ink-400" />
                              )}
                              {book.formats.some(f => f.format === 'AUDIOBOOK') && (
                                <Headphones weight="duotone" className="h-4 w-4 text-ink-400" />
                              )}
                            </div>
                            <p className="font-serif font-bold text-lg text-ink-900">
                              {formatCurrency(getLowestPrice(book.formats))}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                /* List View */
                <div className="space-y-4">
                  {sortedBooks.map((book, index) => (
                    <Link
                      key={book.id}
                      href={`/book/${book.id}`}
                      className="group block"
                      style={{ 
                        opacity: mounted ? 1 : 0, 
                        transform: mounted ? 'translateY(0)' : 'translateY(16px)',
                        transition: `all 0.5s ease ${index * 50}ms`
                      }}
                    >
                      <div className="flex gap-5 p-4 bg-white rounded-2xl border border-parchment-200 shadow-card hover:shadow-elegant hover:border-accent-yellow/50 transition-all">
                        {/* Cover */}
                        <div className={`w-24 h-36 flex-shrink-0 rounded-xl bg-gradient-to-br ${book.coverGradient} flex items-center justify-center relative overflow-hidden`}>
                          <BookOpen weight="duotone" className="h-8 w-8 text-white/20" />
                          {book.isBestseller && (
                            <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-accent-yellow text-ink-900 text-[10px] font-bold rounded-full">
                              <Fire weight="fill" className="h-2.5 w-2.5" />
                            </div>
                          )}
                        </div>
                        
                        {/* Info */}
                        <div className="flex-1 min-w-0 py-1">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="font-serif font-bold text-ink-900 group-hover:text-accent-warm transition-colors mb-1">
                                {book.title}
                              </h3>
                              <div className="flex items-center gap-1">
                                <p className="text-sm text-ink-500">{book.author.penName}</p>
                                {book.author.isVerified && <VerifiedBadge size="sm" />}
                              </div>
                            </div>
                            <p className="font-serif font-bold text-lg text-ink-900 flex-shrink-0">
                              {formatCurrency(getLowestPrice(book.formats))}
                            </p>
                          </div>
                          
                          <p className="text-sm text-ink-600 mt-2 line-clamp-2">{book.description}</p>
                          
                          <div className="flex items-center gap-4 mt-3">
                            <div className="flex items-center gap-1.5">
                              <Star weight="fill" className="h-4 w-4 text-accent-yellow" />
                              <span className="text-sm font-semibold text-ink-800">{book.averageRating}</span>
                              <span className="text-xs text-ink-400">({book.reviewCount} reviews)</span>
                            </div>
                            <div className="flex items-center gap-2 text-ink-400">
                              {book.formats.some(f => f.format === 'PAPERBACK' || f.format === 'HARDCOVER') && (
                                <span className="flex items-center gap-1 text-xs"><Book weight="duotone" className="h-3.5 w-3.5" /> Print</span>
                              )}
                              {book.formats.some(f => f.format === 'EBOOK') && (
                                <span className="flex items-center gap-1 text-xs"><BookOpen weight="duotone" className="h-3.5 w-3.5" /> eBook</span>
                              )}
                              {book.formats.some(f => f.format === 'AUDIOBOOK') && (
                                <span className="flex items-center gap-1 text-xs"><Headphones weight="duotone" className="h-3.5 w-3.5" /> Audio</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
