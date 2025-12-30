/**
 * Query Stubs Index
 * Re-exports all real data query functions
 */

export {
  getBooks,
  getBookById,
  getBookReviews,
  getRelatedBooks,
  getGenres,
} from './books';

export {
  getAuthorProfile,
  getAuthorBooks,
  getAdminAuthors,
  getAdminUsers,
} from './authors';

export {
  getCheckoutItems,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
  getCartCount,
} from './cart';

export {
  getEarningsSummary,
  getTransactions,
  getBookEarnings,
  getPayoutHistory,
  getUserOrders,
  getOrderById,
  createPurchase,
  userOwnsBook,
  getUserOrderCount,
} from './royalties';
export type { UserOrder } from './royalties';

export {
  getWishlistItems,
  addToWishlist,
  removeFromWishlist,
  removeBookFromWishlist,
  isBookInWishlist,
  getWishlistCount,
  moveWishlistToCart,
} from './wishlist';
export type { WishlistItem } from './wishlist';

export {
  getBookmarkFolders,
  getBookmarkItems,
  addBookmark,
  removeBookmark,
  updateBookmark,
  isBookBookmarked,
  getBookmarkCount,
  createBookmarkFolder,
  updateBookmarkFolder,
  deleteBookmarkFolder,
} from './bookmarks';
export type { BookmarkItem, BookmarkFolder } from './bookmarks';

export {
  getUserReviews,
  getPendingReviewBooks,
  submitReview,
  updateReview,
  deleteReview,
  getUserReviewForBook,
  hasUserReviewedBook,
  getUserReviewCount,
} from './reviews';
export type { UserReview, PendingReviewBook } from './reviews';

export {
  getAuthorDashboardStats,
  getRecentSales,
  getDashboardManuscripts,
  getAICredits,
} from './authorDashboard';

export {
  getFeaturedAuthors,
} from './featuredAuthors';

export {
  getAuthorManuscripts,
} from './authorManuscripts';

export {
  getAuthorAnalyticsStats,
  getTopBooks,
  getReaderDemographics,
  getRecentActivity,
  getReadingMetrics,
} from './authorAnalytics';

export {
  getMyBooks,
} from './myBooks';

export {
  getAuthorPrivateProfile,
} from './authorPrivateProfile';

export {
  getFollowState,
  followUser,
  unfollowUser,
  getFollowing,
  getFollowers,
} from './follows';
export type { FollowState } from './follows';
