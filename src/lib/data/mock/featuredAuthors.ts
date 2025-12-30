/**
 * Mock Data - Featured Authors
 * Demo data for authors listing page
 */

export interface FeaturedAuthor {
  id: string;
  name: string;
  genre: string | null; // null if author hasn't set a genre
  books: number;
  followers: string;
  rating: number;
  bio: string;
  avatar: string; // Initials for fallback
  avatarUrl: string | null; // Actual avatar URL
  gradient: string;
  bestseller: boolean;
  isVerified: boolean;
}

export const mockFeaturedAuthors: FeaturedAuthor[] = [
  {
    id: '1',
    name: 'A.M. Sterling',
    genre: 'Fantasy',
    books: 12,
    followers: '45.2K',
    rating: 4.9,
    bio: 'Award-winning author of the Midnight Realms series. Known for intricate world-building and unforgettable characters.',
    avatar: 'AS',
    avatarUrl: null,
    gradient: 'from-purple-500 to-indigo-600',
    bestseller: true,
    isVerified: true,
  },
  {
    id: '2',
    name: 'James Morrison',
    genre: 'Thriller',
    books: 8,
    followers: '32.1K',
    rating: 4.8,
    bio: 'Former FBI agent turned thriller writer. His novels are praised for their authentic portrayals of criminal investigations.',
    avatar: 'JM',
    avatarUrl: null,
    gradient: 'from-rose-500 to-red-600',
    bestseller: true,
    isVerified: true,
  },
  {
    id: '3',
    name: 'Elena Rodriguez',
    genre: 'Romance',
    books: 15,
    followers: '67.8K',
    rating: 4.7,
    bio: 'Bestselling romance author with a talent for creating swoon-worthy love stories that capture the heart.',
    avatar: 'ER',
    avatarUrl: null,
    gradient: 'from-pink-500 to-rose-600',
    bestseller: true,
    isVerified: true,
  },
  {
    id: '4',
    name: 'Michael Chen',
    genre: 'Science Fiction',
    books: 6,
    followers: '28.3K',
    rating: 4.9,
    bio: 'Visionary sci-fi author exploring the intersection of technology and humanity. Winner of the Hugo Award.',
    avatar: 'MC',
    avatarUrl: null,
    gradient: 'from-blue-500 to-cyan-600',
    bestseller: false,
    isVerified: false,
  },
  {
    id: '5',
    name: 'Sarah Brooks',
    genre: 'Mystery',
    books: 10,
    followers: '41.5K',
    rating: 4.6,
    bio: 'Master of cozy mysteries with a knack for creating compelling amateur sleuths and charming small-town settings.',
    avatar: 'SB',
    avatarUrl: null,
    gradient: 'from-emerald-500 to-teal-600',
    bestseller: true,
    isVerified: true,
  },
  {
    id: '6',
    name: 'David Park',
    genre: 'Literary Fiction',
    books: 4,
    followers: '19.7K',
    rating: 4.8,
    bio: 'Acclaimed literary author known for his poetic prose and deeply moving explorations of the human condition.',
    avatar: 'DP',
    avatarUrl: null,
    gradient: 'from-amber-500 to-orange-600',
    bestseller: false,
    isVerified: false,
  },
];
