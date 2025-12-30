/**
 * Mock Books Data
 * Extracted from bookstore and book detail pages
 */

import type { Book, BookListItem, Review, RelatedBook, Genre } from '../types';

export const mockBooks: BookListItem[] = [
  {
    id: '1',
    title: 'The Midnight Garden',
    author: { id: 'a1', penName: 'Victoria Ashford', name: 'Victoria Ashford', isVerified: true },
    coverImage: null,
    coverGradient: 'from-ink-700 to-ink-900',
    genre: ['Fantasy', 'Historical Fiction'],
    averageRating: 4.8,
    reviewCount: 127,
    description: 'A mesmerizing tale of secrets, magic, and forbidden love in Victorian England.',
    formats: [
      { format: 'PAPERBACK', price: 16.99 },
      { format: 'EBOOK', price: 9.99 },
      { format: 'AUDIOBOOK', price: 19.99 },
    ],
    isBestseller: true,
    isNew: false,
  },
  {
    id: '2',
    title: 'Echoes of Tomorrow',
    author: { id: 'a2', penName: 'Marcus Chen', name: 'Marcus Chen', isVerified: true },
    coverImage: null,
    coverGradient: 'from-amber-700 to-amber-900',
    genre: ['Science Fiction'],
    averageRating: 4.5,
    reviewCount: 89,
    description: 'In a world where memories can be traded, one man discovers his past was never his own.',
    formats: [
      { format: 'PAPERBACK', price: 18.99 },
      { format: 'EBOOK', price: 11.99 },
    ],
    isBestseller: false,
    isNew: true,
  },
  {
    id: '3',
    title: 'The Art of Stillness',
    author: { id: 'a3', penName: 'Elena Ramirez', name: 'Elena Ramirez', isVerified: false },
    coverImage: null,
    coverGradient: 'from-accent-warm to-accent-amber',
    genre: ['Non-Fiction', 'Self-Help'],
    averageRating: 4.9,
    reviewCount: 234,
    description: 'Discover the transformative power of mindfulness in our chaotic modern world.',
    formats: [
      { format: 'HARDCOVER', price: 22.99 },
      { format: 'EBOOK', price: 8.99 },
    ],
    isBestseller: true,
    isNew: false,
  },
  {
    id: '4',
    title: 'Whispers in the Dark',
    author: { id: 'a4', penName: 'James Blackwood', name: 'James Blackwood', isVerified: false },
    coverImage: null,
    coverGradient: 'from-parchment-600 to-parchment-800',
    genre: ['Mystery', 'Thriller'],
    averageRating: 4.6,
    reviewCount: 156,
    description: 'A chilling thriller that will keep you guessing until the very last page.',
    formats: [
      { format: 'PAPERBACK', price: 14.99 },
      { format: 'EBOOK', price: 7.99 },
      { format: 'AUDIOBOOK', price: 17.99 },
    ],
    isBestseller: false,
    isNew: false,
  },
  {
    id: '5',
    title: 'Love in Paris',
    author: { id: 'a5', penName: 'Sophie Dubois', name: 'Sophie Dubois', isVerified: true },
    coverImage: null,
    coverGradient: 'from-cream-500 to-parchment-600',
    genre: ['Romance'],
    averageRating: 4.3,
    reviewCount: 312,
    description: 'A heartwarming romance set against the backdrop of the City of Light.',
    formats: [
      { format: 'PAPERBACK', price: 12.99 },
      { format: 'EBOOK', price: 5.99 },
    ],
    isBestseller: true,
    isNew: false,
  },
  {
    id: '6',
    title: 'Code of Honor',
    author: { id: 'a6', penName: 'Alexander Stone', name: 'Alexander Stone', isVerified: false },
    coverImage: null,
    coverGradient: 'from-ink-600 to-ink-800',
    genre: ['Action', 'Adventure'],
    averageRating: 4.7,
    reviewCount: 98,
    description: 'An explosive military thriller that explores the bonds of brotherhood and sacrifice.',
    formats: [
      { format: 'HARDCOVER', price: 26.99 },
      { format: 'PAPERBACK', price: 17.99 },
      { format: 'EBOOK', price: 10.99 },
      { format: 'AUDIOBOOK', price: 24.99 },
    ],
    isBestseller: false,
    isNew: true,
  },
  {
    id: '7',
    title: 'The Last Kingdom',
    author: { id: 'a7', penName: 'Raven Blackwell', name: 'Raven Blackwell', isVerified: true },
    coverImage: null,
    coverGradient: 'from-accent-yellow to-accent-warm',
    genre: ['Fantasy', 'Adventure'],
    averageRating: 4.6,
    reviewCount: 203,
    description: 'An epic fantasy saga of fallen empires and rising heroes.',
    formats: [
      { format: 'HARDCOVER', price: 24.99 },
      { format: 'EBOOK', price: 12.99 },
    ],
    isBestseller: true,
    isNew: false,
  },
  {
    id: '8',
    title: 'Digital Minds',
    author: { id: 'a2', penName: 'Marcus Chen', name: 'Marcus Chen', isVerified: true },
    coverImage: null,
    coverGradient: 'from-parchment-500 to-cream-700',
    genre: ['Science Fiction', 'Thriller'],
    averageRating: 4.4,
    reviewCount: 67,
    description: 'When AI becomes sentient, humanity faces its greatest challenge.',
    formats: [
      { format: 'PAPERBACK', price: 15.99 },
      { format: 'EBOOK', price: 9.99 },
    ],
    isBestseller: false,
    isNew: true,
  },
];

export const mockBookDetail: Book = {
  id: '1',
  title: 'The Midnight Garden',
  subtitle: 'A Novel of Secrets and Enchantment',
  author: {
    id: 'a1',
    penName: 'Victoria Ashford',
    name: 'Victoria Ashford',
    avatar: null,
    bio: 'Victoria Ashford is an award-winning author of literary fiction and fantasy. Her works have been translated into 27 languages.',
    booksCount: 12,
    followersCount: 45200,
    isVerified: true,
  },
  coverImage: null,
  coverGradient: 'from-ink-700 to-ink-900',
  genre: ['Fantasy', 'Historical Fiction'],
  publishedDate: '2024-01-15',
  pageCount: 384,
  language: 'English',
  isbn: '978-0-123456-78-9',
  publisher: 'Penstrike Publishing',
  averageRating: 4.8,
  reviewCount: 127,
  description: `<p>In the heart of Victorian England, a young botanist discovers a secret garden that blooms only at midnight. But the flowers hold more than beauty—they hold memories, secrets, and the power to change the past.</p>
  <p>Eleanor Blackwood has always been drawn to the mysterious estate on the edge of town. When she finally gains access to its legendary gardens, she discovers that each flower contains the memory of someone who has passed through its gates. As she tends to the garden, she begins to uncover the truth about her own family's dark history.</p>
  <p>Weaving together themes of love, loss, and the enduring power of nature, <em>The Midnight Garden</em> is a sweeping tale of one woman's journey to heal the wounds of the past and find her place in a world where magic still exists—if only you know where to look.</p>`,
  formats: [
    { format: 'HARDCOVER', price: 26.99, available: true },
    { format: 'PAPERBACK', price: 16.99, available: true },
    { format: 'EBOOK', price: 9.99, available: true },
    { format: 'AUDIOBOOK', price: 19.99, available: true, duration: '12 hours 45 minutes', narrator: 'Emma Thompson' },
  ],
  isBestseller: true,
  isNew: false,
  previewAvailable: true,
  sampleChapters: 3,
};

export const mockReviews: Review[] = [
  {
    id: '1',
    user: { name: 'Sarah M.', avatar: null },
    rating: 5,
    title: 'A masterpiece of magical realism',
    content: 'I was completely captivated from the first page. Victoria Ashford has created something truly magical here. The prose is beautiful, the characters are deeply complex, and the story will stay with you long after you finish.',
    date: '2024-01-20',
    helpful: 42,
    verified: true,
  },
  {
    id: '2',
    user: { name: 'Michael R.', avatar: null },
    rating: 4,
    title: 'Beautiful and haunting',
    content: 'The world-building is exceptional and the garden itself becomes a character. My only critique is that the middle section dragged a bit, but the ending more than made up for it.',
    date: '2024-01-18',
    helpful: 28,
    verified: true,
  },
  {
    id: '3',
    user: { name: 'Emma L.', avatar: null },
    rating: 5,
    title: 'Could not put it down',
    content: 'This book made me cry, laugh, and gasp in surprise. The twist at the end was perfectly executed. Highly recommend!',
    date: '2024-01-16',
    helpful: 35,
    verified: true,
  },
];

export const mockRelatedBooks: RelatedBook[] = [
  { id: '2', title: 'Whispers of the Moon', author: 'Victoria Ashford', price: 14.99, rating: 4.6, coverGradient: 'from-amber-700 to-amber-900' },
  { id: '3', title: 'The Secret Keeper', author: 'Eleanor Grey', price: 12.99, rating: 4.5, coverGradient: 'from-parchment-600 to-parchment-800' },
  { id: '4', title: 'Garden of Echoes', author: 'Margaret Stone', price: 15.99, rating: 4.7, coverGradient: 'from-accent-warm to-accent-amber' },
  { id: '5', title: 'Victorian Dreams', author: 'Charlotte Blake', price: 11.99, rating: 4.4, coverGradient: 'from-ink-600 to-ink-800' },
];

// Helper to generate genres from books
export function getGenresFromBooks(books: BookListItem[]): Genre[] {
  const genreCounts = new Map<string, number>();
  
  books.forEach(book => {
    book.genre.forEach(g => {
      genreCounts.set(g, (genreCounts.get(g) || 0) + 1);
    });
  });
  
  const genres: Genre[] = [
    { name: 'All Genres', count: books.length },
    ...Array.from(genreCounts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count),
  ];
  
  return genres;
}
