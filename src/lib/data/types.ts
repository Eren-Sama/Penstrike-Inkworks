/**
 * Shared data types for the data abstraction layer
 * These types define the contract between mock and real data sources
 */

// Book-related types
export interface BookFormat {
  format: 'HARDCOVER' | 'PAPERBACK' | 'EBOOK' | 'AUDIOBOOK';
  price: number;
  available?: boolean;
  duration?: string;
  narrator?: string;
}

export interface BookAuthor {
  id: string;
  penName: string;
  name: string;
  avatar?: string | null;
  bio?: string;
  booksCount?: number;
  followersCount?: number;
  isVerified?: boolean;
}

export interface Book {
  id: string;
  title: string;
  subtitle?: string;
  author: BookAuthor;
  coverImage: string | null;
  coverGradient: string;
  genre: string[];
  averageRating: number;
  reviewCount: number;
  description: string;
  formats: BookFormat[];
  isBestseller: boolean;
  isNew: boolean;
  publishedDate?: string;
  pageCount?: number;
  language?: string;
  isbn?: string;
  publisher?: string;
  previewAvailable?: boolean;
  sampleChapters?: number;
}

export interface BookListItem {
  id: string;
  title: string;
  author: BookAuthor;
  coverImage: string | null;
  coverGradient: string;
  genre: string[];
  averageRating: number;
  reviewCount: number;
  description: string;
  formats: BookFormat[];
  isBestseller: boolean;
  isNew: boolean;
}

// Review types
export interface ReviewUser {
  name: string;
  avatar: string | null;
}

export interface Review {
  id: string;
  user: ReviewUser;
  rating: number;
  title: string;
  content: string;
  date: string;
  helpful: number;
  verified: boolean;
}

// Author types
export interface AuthorProfile {
  id: string;
  name: string;
  genre: string | null; // null if author hasn't set a genre (no fake defaults)
  avatar: string | null;
  gradient: string;
  followers: string;
  joinedDate: string;
  bio: string;
  isVerified: boolean;
  location?: string; // Author's location (city, country)
  stats: {
    books: number;
    reviews: number;
    avgRating: number;
    followers: number;
  };
  awards: string[];
  socialLinks: {
    website?: string;
    twitter?: string;
    instagram?: string;
    facebook?: string;
    linkedin?: string;
    goodreads?: string;
  };
}

export interface AuthorBookItem {
  id: string;
  title: string;
  price: number;
  rating: number;
  reviews: number;
  coverColor: string;
  bestseller: boolean;
}

// Admin author type
export interface AdminAuthor {
  id: number;
  name: string;
  email: string;
  joined: string;
  books: number;
  sales: number;
  status: 'verified' | 'pending' | 'suspended';
  avatar: string;
}

// Order/Cart types
export interface OrderItem {
  id: string;
  bookId: string;
  title: string;
  author: string;
  format: string;
  price: number;
  quantity: number;
  coverGradient: string;
}

export interface ShippingOption {
  id: string;
  name: string;
  price: number;
  days: string;
}

// Royalties types
export interface EarningsSummary {
  totalEarnings: number;
  availableBalance: number;
  pendingPayout: number;
  thisMonth: number;
  lastMonth: number;
  changePercent: number;
}

export interface Transaction {
  id: number;
  type: 'sale' | 'payout';
  book?: string;
  format?: string;
  description?: string;
  amount: number;
  date: string;
  status?: string;
}

export interface BookEarning {
  id: number;
  title: string;
  totalSales: number;
  totalEarnings: number;
  thisMonth: number;
}

export interface PayoutRecord {
  id: number;
  amount: number;
  date: string;
  method: string;
  status: string;
}

// Genre type
export interface Genre {
  name: string;
  count: number;
}

// Related book type (simplified for listings)
export interface RelatedBook {
  id: string;
  title: string;
  author: string;
  price: number;
  rating: number;
  coverGradient: string;
}
