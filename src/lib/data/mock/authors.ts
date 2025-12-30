/**
 * Mock Authors Data
 * Extracted from author detail and admin pages
 */

import type { AuthorProfile, AuthorBookItem, AdminAuthor } from '../types';

export const mockAuthorProfile: AuthorProfile = {
  id: '1',
  name: 'A.M. Sterling',
  genre: 'Fantasy',
  avatar: null, // Demo: shows fallback initials
  gradient: 'from-purple-500 to-indigo-600',
  followers: '45.2K',
  joinedDate: 'March 2021',
  bio: `A.M. Sterling is the award-winning author of the Midnight Realms series, which has captivated millions of readers worldwide. Known for intricate world-building and unforgettable characters, Sterling's works have been translated into 27 languages.

Before becoming a full-time author, Sterling worked as a historian, a background that deeply influences the richly detailed historical fantasy worlds found in their books. When not writing, Sterling can be found exploring ancient castles, tending to a growing collection of rare books, or getting lost in the mountains.

Sterling's debut novel, "The First Shadow," won the Nebula Award for Best Fantasy Novel and has been optioned for a major streaming series.`,
  location: 'Portland, Oregon',
  isVerified: true,
  stats: {
    books: 12,
    reviews: 15420,
    avgRating: 4.9,
    followers: 45200,
  },
  awards: [
    'Nebula Award Winner',
    'Hugo Award Nominee',
    'NYT Bestselling Author',
  ],
  socialLinks: {
    website: 'https://amsterling.com',
    twitter: 'amsterling',
    instagram: 'amsterlingauthor',
    facebook: 'amsterlingbooks',
  },
};

export const mockAuthorBooks: AuthorBookItem[] = [
  {
    id: '1',
    title: 'The First Shadow',
    price: 16.99,
    rating: 4.9,
    reviews: 3420,
    coverColor: 'from-purple-600 to-indigo-700',
    bestseller: true,
  },
  {
    id: '2',
    title: 'Echoes of the Void',
    price: 17.99,
    rating: 4.8,
    reviews: 2890,
    coverColor: 'from-blue-600 to-purple-700',
    bestseller: true,
  },
  {
    id: '3',
    title: 'The Crimson Throne',
    price: 18.99,
    rating: 4.9,
    reviews: 3100,
    coverColor: 'from-rose-600 to-purple-700',
    bestseller: true,
  },
  {
    id: '4',
    title: 'Whispers of Eternity',
    price: 15.99,
    rating: 4.7,
    reviews: 2450,
    coverColor: 'from-emerald-600 to-teal-700',
    bestseller: false,
  },
];

export const mockAdminAuthors: AdminAuthor[] = [
  { id: 1, name: 'A.M. Sterling', email: 'am@example.com', joined: '2024-01-15', books: 4, sales: 12450, status: 'verified', avatar: 'AS' },
  { id: 2, name: 'K. Thompson', email: 'kt@example.com', joined: '2024-03-22', books: 2, sales: 5230, status: 'verified', avatar: 'KT' },
  { id: 3, name: 'J. Rivera', email: 'jr@example.com', joined: '2024-06-10', books: 1, sales: 890, status: 'pending', avatar: 'JR' },
  { id: 4, name: 'S. Parker', email: 'sp@example.com', joined: '2024-07-05', books: 3, sales: 8900, status: 'verified', avatar: 'SP' },
  { id: 5, name: 'M. Chen', email: 'mc@example.com', joined: '2024-08-18', books: 0, sales: 0, status: 'pending', avatar: 'MC' },
  { id: 6, name: 'L. Adams', email: 'la@example.com', joined: '2024-09-02', books: 2, sales: 3420, status: 'verified', avatar: 'LA' },
  { id: 7, name: 'R. Hayes', email: 'rh@example.com', joined: '2024-10-11', books: 5, sales: 21000, status: 'verified', avatar: 'RH' },
  { id: 8, name: 'E. Nakamura', email: 'en@example.com', joined: '2024-11-25', books: 0, sales: 0, status: 'pending', avatar: 'EN' },
];
