/**
 * Mock Author Private Profile Data
 * For author's private profile page (editable by the author)
 */

export interface AuthorPrivateProfile {
  id: string;
  penName: string;
  bio: string;
  genres: string[];
  socialLinks: {
    website?: string;
    twitter?: string;
    instagram?: string;
    facebook?: string;
  };
  avatar?: string;
  avatarGradient: string;
  joinedDate: string;
  verified: boolean;
  stats: {
    totalBooks: number;
    totalSales: number;
    totalRevenue: number;
    avgRating: number;
    totalReviews: number;
    followers: number;
  };
}

export const mockAuthorPrivateProfile: AuthorPrivateProfile = {
  id: '1',
  penName: 'A.M. Sterling',
  bio: `A.M. Sterling is the award-winning author of the Midnight Realms series, which has captivated millions of readers worldwide. Known for intricate world-building and unforgettable characters, Sterling's works have been translated into 27 languages.

Before becoming a full-time author, Sterling worked as a historian, a background that deeply influences the richly detailed historical fantasy worlds found in their books. When not writing, Sterling can be found exploring ancient castles, tending to a growing collection of rare books, or getting lost in the mountains.

Sterling's debut novel, "The First Shadow," won the Nebula Award for Best Fantasy Novel and has been optioned for a major streaming series.`,
  genres: ['Fantasy', 'Historical Fiction', 'Mystery'],
  socialLinks: {
    website: 'https://amsterling.com',
    twitter: '@amsterling',
    instagram: '@amsterlingauthor',
  },
  avatarGradient: 'from-purple-500 to-indigo-600',
  joinedDate: 'March 2021',
  verified: true,
  stats: {
    totalBooks: 6,
    totalSales: 11860,
    totalRevenue: 208136.40,
    avgRating: 4.8,
    totalReviews: 2681,
    followers: 45200,
  },
};

// Empty state for real mode when profile is not found
export const emptyAuthorPrivateProfile: AuthorPrivateProfile = {
  id: '',
  penName: '',
  bio: '',
  genres: [],
  socialLinks: {},
  avatarGradient: 'from-gray-400 to-gray-500',
  joinedDate: '',
  verified: false,
  stats: {
    totalBooks: 0,
    totalSales: 0,
    totalRevenue: 0,
    avgRating: 0,
    totalReviews: 0,
    followers: 0,
  },
};
