/**
 * Data Abstraction Layer
 * 
 * This module provides a single entry point for all data access.
 * The frontend should ONLY import from '@/lib/data'.
 * 
 * Toggle between mock and real data using:
 *   NEXT_PUBLIC_USE_MOCK_DATA=true  → Mock data (development)
 *   NEXT_PUBLIC_USE_MOCK_DATA=false → Real Supabase queries (production)
 * 
 * PRODUCTION SAFETY:
 * - Build fails if mock mode is enabled in production
 * - Runtime warning logs if mock mode detected
 */

import { isUsingMockData } from '@/lib/env';
import type { ShippingOption } from './types';

// Re-export types for consumers
export type {
  Book,
  BookListItem,
  BookFormat,
  BookAuthor,
  Review,
  ReviewUser,
  RelatedBook,
  Genre,
  AuthorProfile,
  AuthorBookItem,
  AdminAuthor,
  OrderItem,
  ShippingOption,
  EarningsSummary,
  Transaction,
  BookEarning,
  PayoutRecord,
} from './types';

// Import mock data
import {
  mockBooks,
  mockBookDetail,
  mockReviews,
  mockRelatedBooks,
  getGenresFromBooks,
  mockAuthorProfile,
  mockAuthorBooks,
  mockAdminAuthors,
  mockOrderItems,
  shippingOptions as mockShippingOptions,
  mockEarningsSummary,
  mockTransactions,
  mockBookEarnings,
  mockPayoutHistory,
  mockWishlistItems,
  mockBookmarkFolders,
  mockBookmarkItems,
  mockUserOrders,
  mockUserReviews,
  mockPendingReviewBooks,
  mockDashboardStats,
  mockRecentSales,
  mockDashboardManuscripts,
  mockAICredits,
  mockAdminUsers,
  // New mock data for mode-aware pages
  mockFeaturedAuthors,
  mockAuthorManuscripts,
  mockAnalyticsStats,
  mockTopBooks,
  mockReaderDemographics,
  mockRecentActivity,
  mockReadingMetrics,
  emptyAnalyticsStats,
  emptyReadingMetrics,
  // Profile page mock data
  mockAchievements,
  mockReadingStreak,
  mockContinueReading,
  mockProfileStats,
  emptyAchievements,
  emptyReadingStreak,
  emptyProfileStats,
  // AI Studio mock data
  mockAICreditsState,
  emptyAICreditsState,
  // Community mock data
  mockCommunityStats,
  mockCommunityCategories,
  mockFeaturedMembers,
  mockSuccessStories,
  emptyCommunityStats,
  emptyCommunityCategories,
  emptyFeaturedMembers,
  emptySuccessStories,
  // My Books mock data (author's books page)
  mockMyBooks,
  emptyMyBooks,
  // Author Private Profile mock data (author's own profile page)
  mockAuthorPrivateProfile,
  emptyAuthorPrivateProfile,
} from './mock';

// Import query functions (stubs for now)
import * as queries from './queries';

// Re-export types from mock that are needed
import type {
  Book,
  BookListItem,
  Review,
  RelatedBook,
  Genre,
  AuthorProfile,
  AuthorBookItem,
  AdminAuthor,
  OrderItem,
  EarningsSummary,
  Transaction,
  BookEarning,
  PayoutRecord,
} from './types';

// ============================================================================
// PRODUCTION SAFETY GUARDS
// ============================================================================

/**
 * Check if we're in production with mock data enabled
 * This is a critical error that should never happen
 */
function checkProductionSafety(): void {
  const isProduction = process.env.NODE_ENV === 'production';
  const isMockMode = isUsingMockData();
  
  if (isProduction && isMockMode) {
    // This will be caught at build time
    throw new Error(
      '❌ CRITICAL: Mock data mode is enabled in production!\n' +
      'This is a configuration error. Set NEXT_PUBLIC_USE_MOCK_DATA=false for production builds.'
    );
  }
  
  // Runtime warning for non-production environments
  if (isMockMode && typeof window !== 'undefined') {
    console.warn(
      '⚠️ [Penstrike] Running in MOCK DATA mode. Data is not real.\n' +
      'Set NEXT_PUBLIC_USE_MOCK_DATA=false to use real database.'
    );
  }
}

// Run safety check on module load
checkProductionSafety();

// ============================================================================
// BOOKS DATA FUNCTIONS
// ============================================================================

/**
 * Get all books for the bookstore listing
 */
export async function getBooks(): Promise<BookListItem[]> {
  if (isUsingMockData()) {
    return Promise.resolve(mockBooks);
  }
  return queries.getBooks();
}

/**
 * Get a single book by ID with full details
 */
export async function getBookById(id: string): Promise<Book | null> {
  if (isUsingMockData()) {
    // In mock mode, return the mock detail for any ID
    // In real mode, this would query by actual ID
    return Promise.resolve(mockBookDetail);
  }
  return queries.getBookById(id);
}

/**
 * Get reviews for a book
 */
export async function getBookReviews(bookId: string): Promise<Review[]> {
  if (isUsingMockData()) {
    return Promise.resolve(mockReviews);
  }
  return queries.getBookReviews(bookId);
}

/**
 * Get related books for a book detail page
 */
export async function getRelatedBooks(bookId: string): Promise<RelatedBook[]> {
  if (isUsingMockData()) {
    return Promise.resolve(mockRelatedBooks);
  }
  return queries.getRelatedBooks(bookId);
}

/**
 * Get all genres with book counts
 */
export async function getGenres(): Promise<Genre[]> {
  if (isUsingMockData()) {
    return Promise.resolve(getGenresFromBooks(mockBooks));
  }
  return queries.getGenres();
}

// ============================================================================
// AUTHORS DATA FUNCTIONS
// ============================================================================

/**
 * Get author profile by ID or pen_name slug
 */
export async function getAuthorProfile(idOrSlug: string): Promise<AuthorProfile | null> {
  if (isUsingMockData()) {
    return Promise.resolve(mockAuthorProfile);
  }
  return queries.getAuthorProfile(idOrSlug);
}

/**
 * Get books by author
 */
export async function getAuthorBooks(authorId: string): Promise<AuthorBookItem[]> {
  if (isUsingMockData()) {
    return Promise.resolve(mockAuthorBooks);
  }
  return queries.getAuthorBooks(authorId);
}

/**
 * Get all authors for admin panel
 */
export async function getAdminAuthors(): Promise<AdminAuthor[]> {
  if (isUsingMockData()) {
    return Promise.resolve(mockAdminAuthors);
  }
  return queries.getAdminAuthors();
}

// Re-export types for featured authors, manuscripts, and analytics
export type { FeaturedAuthor } from './mock';
export type { AuthorManuscript } from './mock';
export type { AnalyticsStat, TopBook, ReaderDemographic, RecentActivityItem, ReadingMetric } from './mock';

/**
 * Get featured authors for public authors listing page
 * REAL MODE: Returns authors from database (empty if none exist)
 * DEMO MODE: Returns mock featured authors
 */
export async function getFeaturedAuthors(): Promise<import('./mock').FeaturedAuthor[]> {
  if (isUsingMockData()) {
    return Promise.resolve(mockFeaturedAuthors);
  }
  return queries.getFeaturedAuthors();
}

/**
 * Get manuscripts for current author's manuscripts page
 * REAL MODE: Returns manuscripts from database (empty if none exist)
 * DEMO MODE: Returns mock manuscripts
 */
export async function getAuthorManuscripts(): Promise<import('./mock').AuthorManuscript[]> {
  if (isUsingMockData()) {
    return Promise.resolve(mockAuthorManuscripts);
  }
  return queries.getAuthorManuscripts();
}

// Re-export MyBook type
export type { MyBook } from './mock';

/**
 * Get books owned by the current author for "My Books" page
 * REAL MODE: Returns author's books from database (empty if none exist)
 * DEMO MODE: Returns mock author books
 */
export async function getMyBooks(): Promise<import('./mock').MyBook[]> {
  if (isUsingMockData()) {
    return Promise.resolve(mockMyBooks);
  }
  return queries.getMyBooks();
}

// Re-export AuthorPrivateProfile type
export type { AuthorPrivateProfile } from './mock';

/**
 * Get the current author's private profile for editing
 * REAL MODE: Returns author's profile from database (null if not found)
 * DEMO MODE: Returns mock author private profile
 */
export async function getAuthorPrivateProfile(): Promise<import('./mock').AuthorPrivateProfile | null> {
  if (isUsingMockData()) {
    return Promise.resolve(mockAuthorPrivateProfile);
  }
  return queries.getAuthorPrivateProfile();
}

/**
 * Get analytics stats for author analytics page
 * REAL MODE: Returns calculated stats from database (zeros if no data)
 * DEMO MODE: Returns mock analytics stats
 */
export async function getAuthorAnalyticsStats(): Promise<import('./mock').AnalyticsStat[]> {
  if (isUsingMockData()) {
    return Promise.resolve(mockAnalyticsStats);
  }
  return queries.getAuthorAnalyticsStats();
}

/**
 * Get top performing books for author analytics page
 * REAL MODE: Returns top books from database (empty if none)
 * DEMO MODE: Returns mock top books
 */
export async function getTopBooks(): Promise<import('./mock').TopBook[]> {
  if (isUsingMockData()) {
    return Promise.resolve(mockTopBooks);
  }
  return queries.getTopBooks();
}

/**
 * Get reader demographics for author analytics page
 * REAL MODE: Returns demographics from database (empty if no data)
 * DEMO MODE: Returns mock demographics
 */
export async function getReaderDemographics(): Promise<import('./mock').ReaderDemographic[]> {
  if (isUsingMockData()) {
    return Promise.resolve(mockReaderDemographics);
  }
  return queries.getReaderDemographics();
}

/**
 * Get recent activity for author analytics page
 * REAL MODE: Returns recent activity from database (empty if none)
 * DEMO MODE: Returns mock recent activity
 */
export async function getRecentActivity(): Promise<import('./mock').RecentActivityItem[]> {
  if (isUsingMockData()) {
    return Promise.resolve(mockRecentActivity);
  }
  return queries.getRecentActivity();
}

/**
 * Get reading metrics for author analytics page
 * REAL MODE: Returns reading metrics from database (zeros if no data)
 * DEMO MODE: Returns mock reading metrics
 */
export async function getReadingMetrics(): Promise<import('./mock').ReadingMetric[]> {
  if (isUsingMockData()) {
    return Promise.resolve(mockReadingMetrics);
  }
  return queries.getReadingMetrics();
}

import type { AdminUser } from './mock';

/**
 * Get all users for admin panel
 */
export async function getAdminUsers(): Promise<AdminUser[]> {
  if (isUsingMockData()) {
    return Promise.resolve(mockAdminUsers);
  }
  return queries.getAdminUsers();
}

// Re-export AdminUser type
export type { AdminUser } from './mock';

// ============================================================================
// CART/ORDER DATA FUNCTIONS
// ============================================================================

/**
 * Get checkout items (current cart)
 */
export async function getCheckoutItems(): Promise<OrderItem[]> {
  if (isUsingMockData()) {
    return Promise.resolve(mockOrderItems);
  }
  return queries.getCheckoutItems();
}

/**
 * Add item to cart
 */
export async function addToCart(bookId: string, format: string = 'EBOOK', quantity: number = 1): Promise<boolean> {
  if (isUsingMockData()) {
    console.log('[Mock] addToCart called:', { bookId, format, quantity });
    return Promise.resolve(true);
  }
  return queries.addToCart(bookId, format, quantity);
}

/**
 * Update cart item quantity
 */
export async function updateCartItemQuantity(itemId: string, quantity: number): Promise<boolean> {
  if (isUsingMockData()) {
    console.log('[Mock] updateCartItemQuantity called:', { itemId, quantity });
    return Promise.resolve(true);
  }
  return queries.updateCartItemQuantity(itemId, quantity);
}

/**
 * Remove item from cart
 */
export async function removeFromCart(itemId: string): Promise<boolean> {
  if (isUsingMockData()) {
    console.log('[Mock] removeFromCart called:', { itemId });
    return Promise.resolve(true);
  }
  return queries.removeFromCart(itemId);
}

/**
 * Clear entire cart
 */
export async function clearCart(): Promise<boolean> {
  if (isUsingMockData()) {
    console.log('[Mock] clearCart called');
    return Promise.resolve(true);
  }
  return queries.clearCart();
}

/**
 * Get cart item count for badge display
 */
export async function getCartCount(): Promise<number> {
  if (isUsingMockData()) {
    return Promise.resolve(mockOrderItems.length);
  }
  return queries.getCartCount();
}

/**
 * Get shipping options
 * Note: This is static data, same for mock and real
 */
export function getShippingOptions(): ShippingOption[] {
  return mockShippingOptions;
}

// ============================================================================
// AUTHOR DASHBOARD DATA FUNCTIONS
// ============================================================================

import type { DashboardStat, RecentSale, DashboardManuscript, AICredits } from './mock';

/**
 * Get author dashboard stats
 */
export async function getAuthorDashboardStats(): Promise<DashboardStat[]> {
  if (isUsingMockData()) {
    return Promise.resolve(mockDashboardStats);
  }
  // Real implementation would aggregate from multiple sources
  return queries.getAuthorDashboardStats();
}

/**
 * Get recent sales for author dashboard
 */
export async function getRecentSales(): Promise<RecentSale[]> {
  if (isUsingMockData()) {
    return Promise.resolve(mockRecentSales);
  }
  return queries.getRecentSales();
}

/**
 * Get manuscripts for author dashboard
 */
export async function getDashboardManuscripts(): Promise<DashboardManuscript[]> {
  if (isUsingMockData()) {
    return Promise.resolve(mockDashboardManuscripts);
  }
  return queries.getDashboardManuscripts();
}

/**
 * Get AI credits for author
 */
export async function getAICredits(): Promise<AICredits> {
  if (isUsingMockData()) {
    return Promise.resolve(mockAICredits);
  }
  return queries.getAICredits();
}

// ============================================================================
// ROYALTIES DATA FUNCTIONS
// ============================================================================

/**
 * Get earnings summary for current author
 */
export async function getEarningsSummary(): Promise<EarningsSummary> {
  if (isUsingMockData()) {
    return Promise.resolve(mockEarningsSummary);
  }
  return queries.getEarningsSummary();
}

/**
 * Get recent transactions for current author
 */
export async function getTransactions(): Promise<Transaction[]> {
  if (isUsingMockData()) {
    return Promise.resolve(mockTransactions);
  }
  return queries.getTransactions();
}

/**
 * Get earnings per book for current author
 */
export async function getBookEarnings(): Promise<BookEarning[]> {
  if (isUsingMockData()) {
    return Promise.resolve(mockBookEarnings);
  }
  return queries.getBookEarnings();
}

/**
 * Get payout history for current author
 */
export async function getPayoutHistory(): Promise<PayoutRecord[]> {
  if (isUsingMockData()) {
    return Promise.resolve(mockPayoutHistory);
  }
  return queries.getPayoutHistory();
}

// ============================================================================
// USER ORDERS DATA FUNCTIONS
// ============================================================================

// Re-export order types
export type { UserOrder } from './queries';
export type { MockOrder, MockOrderItem } from './mock';

// Re-export dashboard types
export type { DashboardStat, RecentSale, DashboardManuscript, AICredits } from './mock';

/**
 * Get user's order history (full order format for orders page)
 */
export async function getFullUserOrders(): Promise<import('./mock').MockOrder[]> {
  if (isUsingMockData()) {
    return Promise.resolve(mockUserOrders);
  }
  // For real data, we would aggregate purchases into orders
  // For now, return the simple format transformed
  const orders = await queries.getUserOrders();
  // Group by date (simplified - real implementation would use order_id)
  return orders.map((order, index) => ({
    id: order.id,
    orderNumber: `PI-${new Date(order.purchasedAt).toISOString().slice(0,10).replace(/-/g, '')}-${index + 1000}`,
    date: order.purchasedAt,
    status: order.status as 'processing' | 'shipped' | 'delivered' | 'cancelled',
    items: [{
      id: order.id,
      bookId: order.bookId,
      title: order.bookTitle,
      author: order.bookAuthor,
      authorId: order.bookAuthor.toLowerCase().replace(/\s+/g, '-'),
      coverUrl: order.bookCover,
      format: order.format as 'ebook' | 'paperback' | 'hardcover' | 'audiobook',
      price: order.amount,
      quantity: 1,
    }],
    subtotal: order.amount,
    shipping: 0,
    discount: 0,
    total: order.amount,
    paymentMethod: 'Card',
  }));
}

/**
 * Get user's order history (simple format)
 */
export async function getUserOrders(): Promise<import('./queries').UserOrder[]> {
  if (isUsingMockData()) {
    // Return mock orders mapped to UserOrder format
    return Promise.resolve(mockUserOrders.flatMap(order => 
      order.items.map(item => ({
        id: item.id,
        bookId: item.bookId,
        bookTitle: item.title,
        bookAuthor: item.author,
        bookCover: item.coverUrl || '',
        amount: item.price * item.quantity,
        currency: 'USD',
        status: order.status,
        purchasedAt: order.date,
        format: item.format,
      }))
    ));
  }
  return queries.getUserOrders();
}

/**
 * Get a specific order by ID
 */
export async function getOrderById(orderId: string): Promise<import('./queries').UserOrder | null> {
  if (isUsingMockData()) {
    // Find matching order in mock data and convert to UserOrder format
    const order = mockUserOrders.find(o => o.id === orderId);
    if (!order) return Promise.resolve(null);
    // Return first item as UserOrder format (simplified)
    const item = order.items[0];
    return Promise.resolve({
      id: order.id,
      bookId: item.bookId,
      bookTitle: item.title,
      bookAuthor: item.author,
      bookCover: item.coverUrl || '',
      amount: item.price * item.quantity,
      currency: 'USD',
      status: order.status,
      purchasedAt: order.date,
      format: item.format,
    });
  }
  return queries.getOrderById(orderId);
}

/**
 * Create a purchase after payment
 */
export async function createPurchase(
  bookId: string,
  amount: number,
  paymentProvider: string,
  transactionId: string
): Promise<string | null> {
  if (isUsingMockData()) {
    console.log('[Mock] createPurchase called:', { bookId, amount, paymentProvider });
    return Promise.resolve('mock-purchase-id');
  }
  return queries.createPurchase(bookId, amount, paymentProvider, transactionId);
}

/**
 * Check if user owns a book
 */
export async function userOwnsBook(bookId: string): Promise<boolean> {
  if (isUsingMockData()) {
    // Check if book exists in mock orders
    return Promise.resolve(mockUserOrders.some(order => 
      order.items.some(item => item.bookId === bookId)
    ));
  }
  return queries.userOwnsBook(bookId);
}

/**
 * Get user's order count
 */
export async function getUserOrderCount(): Promise<number> {
  if (isUsingMockData()) {
    return Promise.resolve(mockUserOrders.length);
  }
  return queries.getUserOrderCount();
}

// ============================================================================
// WISHLIST DATA FUNCTIONS
// ============================================================================

// Re-export wishlist item type
export type { WishlistItem } from './queries';

/**
 * Get current user's wishlist items
 */
export async function getWishlistItems(): Promise<import('./queries').WishlistItem[]> {
  if (isUsingMockData()) {
    // Return mock wishlist data
    return Promise.resolve(mockWishlistItems);
  }
  return queries.getWishlistItems();
}

/**
 * Add book to wishlist
 */
export async function addToWishlist(bookId: string): Promise<boolean> {
  if (isUsingMockData()) {
    console.log('[Mock] addToWishlist called:', { bookId });
    return Promise.resolve(true);
  }
  return queries.addToWishlist(bookId);
}

/**
 * Remove item from wishlist
 */
export async function removeFromWishlist(wishlistItemId: string): Promise<boolean> {
  if (isUsingMockData()) {
    console.log('[Mock] removeFromWishlist called:', { wishlistItemId });
    return Promise.resolve(true);
  }
  return queries.removeFromWishlist(wishlistItemId);
}

/**
 * Remove book from wishlist by book ID
 */
export async function removeBookFromWishlist(bookId: string): Promise<boolean> {
  if (isUsingMockData()) {
    console.log('[Mock] removeBookFromWishlist called:', { bookId });
    return Promise.resolve(true);
  }
  return queries.removeBookFromWishlist(bookId);
}

/**
 * Check if a book is in user's wishlist
 */
export async function isBookInWishlist(bookId: string): Promise<boolean> {
  if (isUsingMockData()) {
    // Check if book exists in mock wishlist (by id or title-based matching)
    return Promise.resolve(mockWishlistItems.some(item => item.id === bookId));
  }
  return queries.isBookInWishlist(bookId);
}

/**
 * Get wishlist item count
 */
export async function getWishlistCount(): Promise<number> {
  if (isUsingMockData()) {
    return Promise.resolve(mockWishlistItems.length);
  }
  return queries.getWishlistCount();
}

/**
 * Move wishlist item to cart
 */
export async function moveWishlistToCart(wishlistItemId: string, bookId: string, format: string = 'EBOOK'): Promise<boolean> {
  if (isUsingMockData()) {
    console.log('[Mock] moveWishlistToCart called:', { wishlistItemId, bookId, format });
    return Promise.resolve(true);
  }
  return queries.moveWishlistToCart(wishlistItemId, bookId, format);
}

// ============================================================================
// BOOKMARKS DATA FUNCTIONS
// ============================================================================

// Re-export bookmark types
export type { BookmarkItem, BookmarkFolder } from './queries';

/**
 * Get user's bookmark folders
 */
export async function getBookmarkFolders(): Promise<import('./queries').BookmarkFolder[]> {
  if (isUsingMockData()) {
    return Promise.resolve(mockBookmarkFolders);
  }
  return queries.getBookmarkFolders();
}

/**
 * Get user's bookmarks
 */
export async function getBookmarkItems(folderId?: string): Promise<import('./queries').BookmarkItem[]> {
  if (isUsingMockData()) {
    if (folderId && folderId !== 'all') {
      return Promise.resolve(mockBookmarkItems.filter(item => item.category === folderId));
    }
    return Promise.resolve(mockBookmarkItems);
  }
  return queries.getBookmarkItems(folderId);
}

/**
 * Add book to bookmarks
 */
export async function addBookmark(bookId: string, folder: string = 'all', notes?: string): Promise<boolean> {
  if (isUsingMockData()) {
    console.log('[Mock] addBookmark called:', { bookId, folder, notes });
    return Promise.resolve(true);
  }
  return queries.addBookmark(bookId, folder, notes);
}

/**
 * Remove bookmark
 */
export async function removeBookmark(bookmarkId: string): Promise<boolean> {
  if (isUsingMockData()) {
    console.log('[Mock] removeBookmark called:', { bookmarkId });
    return Promise.resolve(true);
  }
  return queries.removeBookmark(bookmarkId);
}

/**
 * Update bookmark (folder, notes)
 */
export async function updateBookmark(bookmarkId: string, updates: { folder?: string; notes?: string }): Promise<boolean> {
  if (isUsingMockData()) {
    console.log('[Mock] updateBookmark called:', { bookmarkId, updates });
    return Promise.resolve(true);
  }
  return queries.updateBookmark(bookmarkId, updates);
}

/**
 * Check if a book is bookmarked
 */
export async function isBookBookmarked(bookId: string): Promise<boolean> {
  if (isUsingMockData()) {
    // Check if book exists in mock bookmarks (by id or title-based matching)
    return Promise.resolve(mockBookmarkItems.some(item => item.id === bookId));
  }
  return queries.isBookBookmarked(bookId);
}

/**
 * Get bookmark count
 */
export async function getBookmarkCount(): Promise<number> {
  if (isUsingMockData()) {
    return Promise.resolve(mockBookmarkItems.length);
  }
  return queries.getBookmarkCount();
}

/**
 * Create bookmark folder
 */
export async function createBookmarkFolder(name: string, color: string = 'blue'): Promise<string | null> {
  if (isUsingMockData()) {
    console.log('[Mock] createBookmarkFolder called:', { name, color });
    return Promise.resolve('mock-folder-id');
  }
  return queries.createBookmarkFolder(name, color);
}

/**
 * Update bookmark folder
 */
export async function updateBookmarkFolder(folderId: string, updates: { name?: string; color?: string }): Promise<boolean> {
  if (isUsingMockData()) {
    console.log('[Mock] updateBookmarkFolder called:', { folderId, updates });
    return Promise.resolve(true);
  }
  return queries.updateBookmarkFolder(folderId, updates);
}

/**
 * Delete bookmark folder
 */
export async function deleteBookmarkFolder(folderId: string): Promise<boolean> {
  if (isUsingMockData()) {
    console.log('[Mock] deleteBookmarkFolder called:', { folderId });
    return Promise.resolve(true);
  }
  return queries.deleteBookmarkFolder(folderId);
}

// ============================================================================
// USER REVIEWS DATA FUNCTIONS
// ============================================================================

// Re-export review types
export type { UserReview, PendingReviewBook } from './queries';

/**
 * Get current user's reviews
 */
export async function getUserReviews(): Promise<import('./queries').UserReview[]> {
  if (isUsingMockData()) {
    return Promise.resolve(mockUserReviews);
  }
  return queries.getUserReviews();
}

/**
 * Get books user purchased but hasn't reviewed
 */
export async function getPendingReviewBooks(): Promise<import('./queries').PendingReviewBook[]> {
  if (isUsingMockData()) {
    return Promise.resolve(mockPendingReviewBooks);
  }
  return queries.getPendingReviewBooks();
}

/**
 * Submit a new review
 */
export async function submitReview(
  bookId: string,
  rating: number,
  title: string,
  content: string
): Promise<string | null> {
  if (isUsingMockData()) {
    console.log('[Mock] submitReview called:', { bookId, rating, title });
    return Promise.resolve('mock-review-id');
  }
  return queries.submitReview(bookId, rating, title, content);
}

/**
 * Update an existing review
 */
export async function updateReview(
  reviewId: string,
  updates: { rating?: number; title?: string; content?: string }
): Promise<boolean> {
  if (isUsingMockData()) {
    console.log('[Mock] updateReview called:', { reviewId, updates });
    return Promise.resolve(true);
  }
  return queries.updateReview(reviewId, updates);
}

/**
 * Delete a review
 */
export async function deleteReview(reviewId: string): Promise<boolean> {
  if (isUsingMockData()) {
    console.log('[Mock] deleteReview called:', { reviewId });
    return Promise.resolve(true);
  }
  return queries.deleteReview(reviewId);
}

/**
 * Get user's review for a specific book
 */
export async function getUserReviewForBook(bookId: string): Promise<import('./queries').UserReview | null> {
  if (isUsingMockData()) {
    // Find matching review in mock data
    const review = mockUserReviews.find(r => r.bookId === bookId);
    return Promise.resolve(review || null);
  }
  return queries.getUserReviewForBook(bookId);
}

/**
 * Check if user has reviewed a book
 */
export async function hasUserReviewedBook(bookId: string): Promise<boolean> {
  if (isUsingMockData()) {
    // Check if user has reviewed this book in mock data
    return Promise.resolve(mockUserReviews.some(review => review.bookId === bookId));
  }
  return queries.hasUserReviewedBook(bookId);
}

/**
 * Get user's review count
 */
export async function getUserReviewCount(): Promise<number> {
  if (isUsingMockData()) {
    return Promise.resolve(mockUserReviews.length);
  }
  return queries.getUserReviewCount();
}

// ============================================================================
// STORAGE FUNCTIONS
// ============================================================================

/**
 * Storage upload functions for avatars and book covers
 * These are server actions that handle file validation and uploads
 */
export {
  uploadAvatarImage,
  uploadBookCoverImage,
  deleteAvatarImage,
  deleteBookCoverImage,
} from './storage';

// ============================================================================
// PROFILE DATA FUNCTIONS
// ============================================================================

import type { ProfileAchievement, ReadingStreak, ContinueReading, ProfileStats } from './mock';

export type { ProfileAchievement, ReadingStreak, ContinueReading, ProfileStats };

/**
 * Get user's achievements
 * REAL MODE: Returns empty/locked achievements (no backend yet)
 */
export async function getUserAchievements(): Promise<ProfileAchievement[]> {
  if (isUsingMockData()) {
    return Promise.resolve(mockAchievements);
  }
  // Real mode: return empty/locked achievements
  return Promise.resolve(emptyAchievements);
}

/**
 * Get user's reading streak
 * REAL MODE: Returns zero streak (no backend yet)
 */
export async function getUserReadingStreak(): Promise<ReadingStreak> {
  if (isUsingMockData()) {
    return Promise.resolve(mockReadingStreak);
  }
  // Real mode: return zero streak
  return Promise.resolve(emptyReadingStreak);
}

/**
 * Get user's continue reading list
 * REAL MODE: Returns empty array (no backend yet)
 */
export async function getContinueReading(): Promise<ContinueReading[]> {
  if (isUsingMockData()) {
    return Promise.resolve(mockContinueReading);
  }
  // Real mode: return empty array
  return Promise.resolve([]);
}

/**
 * Get profile stats (followers, following, etc)
 * REAL MODE: Returns zero stats (no backend yet)
 */
export async function getProfileStats(): Promise<ProfileStats> {
  if (isUsingMockData()) {
    return Promise.resolve(mockProfileStats);
  }
  // Real mode: return zero stats
  return Promise.resolve(emptyProfileStats);
}

// ============================================================================
// AI STUDIO DATA FUNCTIONS
// ============================================================================

import type { AICreditsState } from './mock';

export type { AICreditsState };

/**
 * Get AI credits state
 * REAL MODE: Returns unavailable/zero credits (no backend yet)
 */
export async function getAICreditsState(): Promise<AICreditsState> {
  if (isUsingMockData()) {
    return Promise.resolve(mockAICreditsState);
  }
  // Real mode: return unavailable state
  return Promise.resolve(emptyAICreditsState);
}

// ============================================================================
// COMMUNITY DATA FUNCTIONS
// ============================================================================

import type { CommunityStat, CommunityCategory, FeaturedMember, SuccessStory } from './mock';

export type { CommunityStat, CommunityCategory, FeaturedMember, SuccessStory };

/**
 * Get community stats
 * REAL MODE: Returns zero stats (no backend yet)
 */
export async function getCommunityStats(): Promise<CommunityStat[]> {
  if (isUsingMockData()) {
    return Promise.resolve(mockCommunityStats);
  }
  // Real mode: return zero stats
  return Promise.resolve(emptyCommunityStats);
}

/**
 * Get community categories
 * REAL MODE: Returns categories with zero post counts (no backend yet)
 */
export async function getCommunityCategories(): Promise<CommunityCategory[]> {
  if (isUsingMockData()) {
    return Promise.resolve(mockCommunityCategories);
  }
  // Real mode: return empty categories
  return Promise.resolve(emptyCommunityCategories);
}

/**
 * Get featured community members
 * REAL MODE: Returns empty array (no backend yet)
 */
export async function getCommunityFeaturedMembers(): Promise<FeaturedMember[]> {
  if (isUsingMockData()) {
    return Promise.resolve(mockFeaturedMembers);
  }
  // Real mode: return empty array
  return Promise.resolve(emptyFeaturedMembers);
}

/**
 * Get success stories
 * REAL MODE: Returns empty array (no backend yet)
 */
export async function getCommunitySuccessStories(): Promise<SuccessStory[]> {
  if (isUsingMockData()) {
    return Promise.resolve(mockSuccessStories);
  }
  // Real mode: return empty array
  return Promise.resolve(emptySuccessStories);
}

// ============================================================================
// UTILITY EXPORTS
// ============================================================================

/**
 * Check if currently using mock data
 * UI can use this to show a "demo mode" indicator if needed
 */
export { isUsingMockData } from '@/lib/env';

// ============================================================================
// DIRECT MOCK EXPORTS (for components that need synchronous access)
// These will be removed when we implement real queries
// ============================================================================

export {
  mockBooks,
  mockBookDetail,
  mockReviews,
  mockRelatedBooks,
  getGenresFromBooks,
  mockAuthorProfile,
  mockAuthorBooks,
  mockAdminAuthors,
  mockOrderItems,
  mockShippingOptions as shippingOptions,
  mockEarningsSummary,
  mockTransactions,
  mockBookEarnings,
  mockPayoutHistory,
};
