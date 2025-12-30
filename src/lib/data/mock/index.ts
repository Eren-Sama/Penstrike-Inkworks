/**
 * Mock Data Index
 * Re-exports all mock data for easy importing
 */

// Books
export {
  mockBooks,
  mockBookDetail,
  mockReviews,
  mockRelatedBooks,
  getGenresFromBooks,
} from './books';

// Authors
export {
  mockAuthorProfile,
  mockAuthorBooks,
  mockAdminAuthors,
} from './authors';

// Cart/Orders
export {
  mockOrderItems,
  shippingOptions,
} from './cart';

// Wishlist
export {
  mockWishlistItems,
} from './wishlist';

// Bookmarks
export {
  mockBookmarkFolders,
  mockBookmarkItems,
} from './bookmarks';

// Orders
export {
  mockUserOrders,
  type MockOrder,
  type MockOrderItem,
} from './orders';

// Reviews
export {
  mockUserReviews,
  mockPendingReviewBooks,
} from './reviews';

// Author Dashboard
export {
  mockDashboardStats,
  mockRecentSales,
  mockDashboardManuscripts,
  mockAICredits,
  type DashboardStat,
  type RecentSale,
  type DashboardManuscript,
  type AICredits,
} from './authorDashboard';

// Admin Users
export {
  mockAdminUsers,
  type AdminUser,
} from './adminUsers';

// Royalties
export {
  mockEarningsSummary,
  mockTransactions,
  mockBookEarnings,
  mockPayoutHistory,
} from './royalties';

// Featured Authors (for authors listing page)
export {
  mockFeaturedAuthors,
  type FeaturedAuthor,
} from './featuredAuthors';

// Author Manuscripts (for manuscripts page)
export {
  mockAuthorManuscripts,
  type AuthorManuscript,
} from './authorManuscripts';

// Author Analytics (for analytics page)
export {
  mockAnalyticsStats,
  mockTopBooks,
  mockReaderDemographics,
  mockRecentActivity,
  mockReadingMetrics,
  emptyAnalyticsStats,
  emptyReadingMetrics,
  type AnalyticsStat,
  type TopBook,
  type ReaderDemographic,
  type RecentActivityItem,
  type ReadingMetric,
} from './authorAnalytics';

// Profile Data (for profile page)
export {
  mockAchievements,
  mockReadingStreak,
  mockContinueReading,
  mockProfileStats,
  emptyAchievements,
  emptyReadingStreak,
  emptyProfileStats,
  type ProfileAchievement,
  type ReadingStreak,
  type ContinueReading,
  type ProfileStats,
} from './profileData';

// AI Studio Data (for ai-studio page)
export {
  mockAICreditsState,
  emptyAICreditsState,
  type AICreditsState,
} from './aiStudioData';

// Community Data (for community pages)
export {
  mockCommunityStats,
  mockCommunityCategories,
  mockFeaturedMembers,
  mockSuccessStories,
  emptyCommunityStats,
  emptyCommunityCategories,
  emptyFeaturedMembers,
  emptySuccessStories,
  type CommunityStat,
  type CommunityCategory,
  type FeaturedMember,
  type SuccessStory,
} from './communityData';

// My Books Data (for author's My Books page)
export {
  mockMyBooks,
  emptyMyBooks,
  type MyBook,
} from './myBooks';

// Author Private Profile Data (for author's profile page)
export {
  mockAuthorPrivateProfile,
  emptyAuthorPrivateProfile,
  type AuthorPrivateProfile,
} from './authorPrivateProfile';

