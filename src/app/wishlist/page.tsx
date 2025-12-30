'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Heart,
  ShoppingCart,
  Trash,
  BookOpen,
  Star,
  Eye,
  SpinnerGap,
  MagnifyingGlass,
  SortAscending,
  GridFour,
  Rows,
  Share,
  Gift,
  Bell,
  BellSlash,
  ArrowRight,
  Check
} from '@phosphor-icons/react';
import { cn, formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui';
import { useAuth } from '@/lib/auth/AuthContext';
import { toast } from 'sonner';
import {
  getWishlistItems,
  removeFromWishlist,
  addToCart,
  type WishlistItem
} from '@/lib/data';

type SortOption = 'added-desc' | 'added-asc' | 'price-asc' | 'price-desc' | 'rating-desc';

export default function WishlistPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('added-desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  // Load wishlist items from data layer
  const loadWishlist = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const items = await getWishlistItems();
      setWishlist(items);
    } catch (error) {
      console.error('Failed to load wishlist:', error);
      toast.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Load wishlist when user is available
  useEffect(() => {
    if (user && !authLoading) {
      loadWishlist();
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [user, authLoading, loadWishlist]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/wishlist');
    }
  }, [user, authLoading, router]);

  const filteredAndSortedWishlist = wishlist
    .filter((item) => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'added-desc':
          return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
        case 'added-asc':
          return new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime();
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'rating-desc':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

  const handleRemove = async (id: string) => {
    try {
      await removeFromWishlist(id);
      setWishlist(prev => prev.filter(item => item.id !== id));
      toast.success('Removed from wishlist');
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
      toast.error('Failed to remove item');
    }
  };

  const handleAddToCart = async (item: WishlistItem) => {
    if (!item.inStock) {
      toast.error('This item is currently out of stock');
      return;
    }
    
    setAddingToCart(item.id);
    try {
      await addToCart(item.id, item.format.toUpperCase(), 1);
      toast.success(`${item.title} added to cart!`);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast.error('Failed to add to cart');
    } finally {
      setAddingToCart(null);
    }
  };

  const handleAddAllToCart = async () => {
    const inStockItems = wishlist.filter(item => item.inStock);
    if (inStockItems.length === 0) {
      toast.error('No items in stock to add');
      return;
    }
    
    try {
      for (const item of inStockItems) {
        await addToCart(item.id, item.format.toUpperCase(), 1);
      }
      toast.success(`${inStockItems.length} items added to cart!`);
      router.push('/cart');
    } catch (error) {
      console.error('Failed to add all to cart:', error);
      toast.error('Failed to add items to cart');
    }
  };

  const handleToggleNotify = (id: string) => {
    setWishlist(prev => prev.map(item => 
      item.id === id ? { ...item, notifyPrice: !item.notifyPrice } : item
    ));
    const item = wishlist.find(i => i.id === id);
    toast.success(item?.notifyPrice 
      ? 'Price notifications disabled' 
      : 'You\'ll be notified of price drops'
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const inStockCount = wishlist.filter(item => item.inStock).length;
  const totalValue = wishlist.reduce((sum, item) => sum + item.price, 0);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-parchment-50 to-cream-100 flex items-center justify-center">
        <SpinnerGap weight="bold" className="h-8 w-8 animate-spin text-accent-yellow" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-parchment-50 to-cream-100 py-24">
      <div className="container-editorial max-w-6xl mx-auto">
        <div className={`transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-red-100">
                <Heart weight="duotone" className="h-8 w-8 text-red-500" />
              </div>
              <div>
                <h1 className="font-serif text-3xl font-bold text-ink-900">My Wishlist</h1>
                <p className="text-ink-600">{wishlist.length} items • {inStockCount} in stock</p>
              </div>
            </div>
            
            {wishlist.length > 0 && (
              <div className="flex gap-3">
                <Button onClick={handleAddAllToCart} className="btn-accent">
                  <ShoppingCart weight="bold" className="h-4 w-4" />
                  Add All to Cart ({formatCurrency(totalValue)})
                </Button>
                <Button className="btn-secondary">
                  <Share weight="bold" className="h-4 w-4" />
                  Share
                </Button>
              </div>
            )}
          </div>

          {/* Filters & Sort */}
          {wishlist.length > 0 && (
            <div className="bg-white rounded-2xl border border-parchment-200 shadow-card p-4 mb-6 flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[200px] relative">
                <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-ink-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search wishlist..."
                  className="input w-full pl-10"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <SortAscending weight="bold" className="h-4 w-4 text-ink-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="input pr-8 text-sm"
                >
                  <option value="added-desc">Recently Added</option>
                  <option value="added-asc">Oldest First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating-desc">Highest Rated</option>
                </select>
              </div>
              
              <div className="flex border border-parchment-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'p-2 transition-colors',
                    viewMode === 'grid' ? 'bg-ink-900 text-white' : 'bg-white text-ink-600 hover:bg-parchment-100'
                  )}
                >
                  <GridFour weight="bold" className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    'p-2 transition-colors',
                    viewMode === 'list' ? 'bg-ink-900 text-white' : 'bg-white text-ink-600 hover:bg-parchment-100'
                  )}
                >
                  <Rows weight="bold" className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Empty State */}
          {wishlist.length === 0 ? (
            <div className="bg-white rounded-2xl border border-parchment-200 shadow-card p-12 text-center">
              <Heart weight="duotone" className="h-16 w-16 text-parchment-300 mx-auto mb-4" />
              <h2 className="font-serif text-xl font-bold text-ink-900 mb-2">Your wishlist is empty</h2>
              <p className="text-ink-600 mb-6">Save books you love for later</p>
              <Link href="/bookstore">
                <Button className="btn-accent">
                  <BookOpen weight="duotone" className="h-4 w-4" />
                  Discover Books
                </Button>
              </Link>
            </div>
          ) : filteredAndSortedWishlist.length === 0 ? (
            <div className="bg-white rounded-2xl border border-parchment-200 shadow-card p-12 text-center">
              <MagnifyingGlass weight="duotone" className="h-16 w-16 text-parchment-300 mx-auto mb-4" />
              <h2 className="font-serif text-xl font-bold text-ink-900 mb-2">No matches found</h2>
              <p className="text-ink-600">Try a different search term</p>
            </div>
          ) : viewMode === 'grid' ? (
            /* Grid View */
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAndSortedWishlist.map((item, index) => (
                <div 
                  key={item.id}
                  className="group bg-white rounded-2xl border border-parchment-200 shadow-card overflow-hidden hover:shadow-lg transition-all"
                  style={{
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? 'translateY(0)' : 'translateY(8px)',
                    transition: `all 0.3s ease ${index * 50}ms`
                  }}
                >
                  {/* Book Cover */}
                  <div className="aspect-[2/3] bg-gradient-to-br from-parchment-200 to-parchment-300 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <BookOpen weight="duotone" className="h-16 w-16 text-parchment-400" />
                    </div>
                    
                    {/* Sale Badge */}
                    {item.originalPrice && (
                      <div className="absolute top-3 left-3 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-lg">
                        {Math.round((1 - item.price / item.originalPrice) * 100)}% OFF
                      </div>
                    )}
                    
                    {/* Out of Stock Overlay */}
                    {!item.inStock && (
                      <div className="absolute inset-0 bg-ink-900/60 flex items-center justify-center">
                        <span className="px-3 py-1.5 bg-white rounded-full text-sm font-medium text-ink-700">
                          Out of Stock
                        </span>
                      </div>
                    )}
                    
                    {/* Hover Actions */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                      <button 
                        onClick={() => handleRemove(item.id)}
                        className="p-2.5 bg-white rounded-full shadow-lg hover:scale-110 transition-transform"
                      >
                        <Trash weight="bold" className="h-5 w-5 text-red-500" />
                      </button>
                      <Link 
                        href={`/book/${item.id}`}
                        className="p-2.5 bg-white rounded-full shadow-lg hover:scale-110 transition-transform"
                      >
                        <Eye weight="bold" className="h-5 w-5 text-ink-700" />
                      </Link>
                      <button 
                        onClick={() => handleToggleNotify(item.id)}
                        className="p-2.5 bg-white rounded-full shadow-lg hover:scale-110 transition-transform"
                      >
                        {item.notifyPrice ? (
                          <Bell weight="fill" className="h-5 w-5 text-accent-yellow" />
                        ) : (
                          <BellSlash weight="bold" className="h-5 w-5 text-ink-400" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  {/* Book Info */}
                  <div className="p-4">
                    <p className="text-xs text-ink-400 mb-1">Added {formatDate(item.addedAt)}</p>
                    <h3 className="font-medium text-ink-900 line-clamp-1 group-hover:text-accent-amber transition-colors">
                      {item.title}
                    </h3>
                    <Link href={`/authors/${item.authorId}`} className="text-sm text-ink-600 hover:text-accent-amber">
                      {item.author}
                    </Link>
                    
                    <div className="flex items-center gap-2 mt-2">
                      <Star weight="fill" className="h-4 w-4 text-accent-yellow" />
                      <span className="text-sm font-medium text-ink-900">{item.rating}</span>
                      <span className="text-xs text-ink-400">({item.reviewCount})</span>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-baseline gap-2">
                        <span className="font-serif font-bold text-ink-900">{formatCurrency(item.price)}</span>
                        {item.originalPrice && (
                          <span className="text-sm text-ink-400 line-through">{formatCurrency(item.originalPrice)}</span>
                        )}
                      </div>
                      <span className="text-xs px-2 py-0.5 bg-parchment-100 rounded-full text-ink-600 capitalize">
                        {item.format}
                      </span>
                    </div>
                    
                    <button
                      onClick={() => handleAddToCart(item)}
                      disabled={!item.inStock || addingToCart === item.id}
                      className={cn(
                        'w-full mt-3 py-2 rounded-xl font-medium flex items-center justify-center gap-2 transition-all',
                        item.inStock 
                          ? 'bg-ink-900 text-white hover:bg-ink-800' 
                          : 'bg-parchment-100 text-ink-400 cursor-not-allowed'
                      )}
                    >
                      {addingToCart === item.id ? (
                        <SpinnerGap weight="bold" className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <ShoppingCart weight="bold" className="h-4 w-4" />
                          {item.inStock ? 'Add to Cart' : 'Notify Me'}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="space-y-4">
              {filteredAndSortedWishlist.map((item, index) => (
                <div 
                  key={item.id}
                  className="bg-white rounded-2xl border border-parchment-200 shadow-card p-4 flex gap-4 hover:shadow-lg transition-all"
                  style={{
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? 'translateY(0)' : 'translateY(8px)',
                    transition: `all 0.3s ease ${index * 50}ms`
                  }}
                >
                  {/* Book Cover */}
                  <div className="w-20 h-28 flex-shrink-0 bg-gradient-to-br from-parchment-200 to-parchment-300 rounded-lg relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <BookOpen weight="duotone" className="h-8 w-8 text-parchment-400" />
                    </div>
                    {item.originalPrice && (
                      <div className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded">
                        SALE
                      </div>
                    )}
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <Link href={`/book/${item.id}`} className="font-medium text-ink-900 hover:text-accent-amber transition-colors">
                          {item.title}
                        </Link>
                        <p className="text-sm text-ink-600">{item.author}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <div className="flex items-center gap-1">
                            <Star weight="fill" className="h-3.5 w-3.5 text-accent-yellow" />
                            <span className="text-sm text-ink-700">{item.rating}</span>
                          </div>
                          <span className="text-xs px-2 py-0.5 bg-parchment-100 rounded-full text-ink-600 capitalize">
                            {item.format}
                          </span>
                          {!item.inStock && (
                            <span className="text-xs px-2 py-0.5 bg-red-100 rounded-full text-red-600">
                              Out of Stock
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-baseline gap-2 justify-end">
                          <span className="font-serif font-bold text-ink-900">{formatCurrency(item.price)}</span>
                          {item.originalPrice && (
                            <span className="text-sm text-ink-400 line-through">{formatCurrency(item.originalPrice)}</span>
                          )}
                        </div>
                        <p className="text-xs text-ink-400 mt-0.5">Added {formatDate(item.addedAt)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 mt-3">
                      <button
                        onClick={() => handleAddToCart(item)}
                        disabled={!item.inStock || addingToCart === item.id}
                        className={cn(
                          'px-4 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-all',
                          item.inStock 
                            ? 'bg-ink-900 text-white hover:bg-ink-800' 
                            : 'bg-parchment-100 text-ink-400 cursor-not-allowed'
                        )}
                      >
                        {addingToCart === item.id ? (
                          <SpinnerGap weight="bold" className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <ShoppingCart weight="bold" className="h-4 w-4" />
                            Add to Cart
                          </>
                        )}
                      </button>
                      
                      <button
                        onClick={() => handleToggleNotify(item.id)}
                        className="p-1.5 rounded-lg text-ink-500 hover:bg-parchment-100 transition-colors"
                        title={item.notifyPrice ? 'Notifications on' : 'Notify on price drop'}
                      >
                        {item.notifyPrice ? (
                          <Bell weight="fill" className="h-5 w-5 text-accent-yellow" />
                        ) : (
                          <Bell weight="duotone" className="h-5 w-5" />
                        )}
                      </button>
                      
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="p-1.5 rounded-lg text-ink-500 hover:text-red-500 hover:bg-red-50 transition-colors"
                        title="Remove from wishlist"
                      >
                        <Trash weight="duotone" className="h-5 w-5" />
                      </button>
                      
                      <Link 
                        href={`/book/${item.id}`}
                        className="ml-auto flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700"
                      >
                        View Details
                        <ArrowRight weight="bold" className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Gift Idea Banner */}
          {wishlist.length > 0 && (
            <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-purple-100">
                  <Gift weight="duotone" className="h-6 w-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-purple-900">Share your wishlist</h3>
                  <p className="text-sm text-purple-700">
                    Let friends and family know what books you'd love to receive!
                  </p>
                </div>
                <Button className="bg-purple-600 text-white hover:bg-purple-700">
                  <Share weight="bold" className="h-4 w-4" />
                  Share Wishlist
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
