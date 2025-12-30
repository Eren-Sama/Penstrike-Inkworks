/**
 * Mock My Books Data
 * For author's "My Books" page showing their published books
 */

export interface MyBook {
  id: string;
  title: string;
  description: string;
  coverImage?: string;
  coverColor: string;
  genre: string;
  status: 'DRAFT' | 'IN_REVIEW' | 'PUBLISHED' | 'ARCHIVED';
  publishedDate?: string;
  price: number;
  totalSales: number;
  totalRevenue: number;
  rating: number;
  reviewCount: number;
  formats: ('EBOOK' | 'PAPERBACK' | 'HARDCOVER' | 'AUDIOBOOK')[];
}

export const mockMyBooks: MyBook[] = [
  {
    id: '1',
    title: 'The First Shadow',
    description: 'An epic tale of light and darkness in a world where shadows hold ancient secrets. Follow the journey of a young mage who discovers their destiny lies in mastering the forbidden art of shadow magic.',
    coverColor: 'from-purple-600 to-indigo-700',
    genre: 'Fantasy',
    status: 'PUBLISHED',
    publishedDate: '2023-03-15',
    price: 16.99,
    totalSales: 3420,
    totalRevenue: 58091.80,
    rating: 4.9,
    reviewCount: 892,
    formats: ['EBOOK', 'PAPERBACK', 'HARDCOVER', 'AUDIOBOOK'],
  },
  {
    id: '2',
    title: 'Echoes of the Void',
    description: 'The sequel to The First Shadow. As the kingdom crumbles, our heroes must venture into the Void itself to confront an ancient evil awakening.',
    coverColor: 'from-blue-600 to-purple-700',
    genre: 'Fantasy',
    status: 'PUBLISHED',
    publishedDate: '2023-09-22',
    price: 17.99,
    totalSales: 2890,
    totalRevenue: 52000.10,
    rating: 4.8,
    reviewCount: 654,
    formats: ['EBOOK', 'PAPERBACK', 'AUDIOBOOK'],
  },
  {
    id: '3',
    title: 'The Crimson Throne',
    description: 'A gripping tale of political intrigue, forbidden romance, and the price of power. When a lowborn spy infiltrates the royal court, she discovers secrets that could topple an empire.',
    coverColor: 'from-rose-600 to-purple-700',
    genre: 'Fantasy Romance',
    status: 'PUBLISHED',
    publishedDate: '2024-02-14',
    price: 18.99,
    totalSales: 3100,
    totalRevenue: 58869.00,
    rating: 4.9,
    reviewCount: 723,
    formats: ['EBOOK', 'PAPERBACK', 'HARDCOVER'],
  },
  {
    id: '4',
    title: 'Whispers of Eternity',
    description: 'A standalone novel exploring the mysteries of time and memory. When a historian discovers she can hear the whispers of the past, she uncovers a conspiracy spanning centuries.',
    coverColor: 'from-emerald-600 to-teal-700',
    genre: 'Mystery Fantasy',
    status: 'PUBLISHED',
    publishedDate: '2024-08-01',
    price: 15.99,
    totalSales: 2450,
    totalRevenue: 39175.50,
    rating: 4.7,
    reviewCount: 412,
    formats: ['EBOOK', 'PAPERBACK'],
  },
  {
    id: '5',
    title: 'The Shattered Crown',
    description: 'The explosive conclusion to the Midnight Realms trilogy. All paths converge as heroes and villains alike must face their ultimate destinies in a battle that will reshape reality itself.',
    coverColor: 'from-amber-600 to-orange-700',
    genre: 'Fantasy',
    status: 'IN_REVIEW',
    price: 19.99,
    totalSales: 0,
    totalRevenue: 0,
    rating: 0,
    reviewCount: 0,
    formats: ['EBOOK', 'PAPERBACK', 'HARDCOVER', 'AUDIOBOOK'],
  },
  {
    id: '6',
    title: 'Untitled New Project',
    description: 'A work in progress exploring new themes and characters in a fresh setting.',
    coverColor: 'from-slate-500 to-slate-700',
    genre: 'Fantasy',
    status: 'DRAFT',
    price: 0,
    totalSales: 0,
    totalRevenue: 0,
    rating: 0,
    reviewCount: 0,
    formats: [],
  },
];

// Empty state for real mode when author has no books
export const emptyMyBooks: MyBook[] = [];
