/**
 * Mock Data - Reviews
 * Demo data for reviews page
 */

import type { UserReview, PendingReviewBook } from '../queries/reviews';

export const mockUserReviews: UserReview[] = [
  {
    id: '1',
    bookId: 'midnight-garden',
    bookTitle: 'The Midnight Garden',
    bookAuthor: 'Elena Vasquez',
    bookCover: '/books/midnight-garden.jpg',
    rating: 5,
    title: 'A masterpiece of magical realism',
    content: 'Elena Vasquez has crafted something truly special here. The Midnight Garden weaves together themes of love, loss, and redemption with prose so beautiful it feels like poetry. The way she describes the garden scenes made me feel like I was actually there, smelling the night-blooming jasmine and hearing the whisper of leaves. I couldn\'t put it down and finished it in one sitting.',
    createdAt: '2024-01-15T10:30:00Z',
    status: 'published',
    helpfulCount: 42,
    commentsCount: 5,
  },
  {
    id: '2',
    bookId: 'digital-horizons',
    bookTitle: 'Digital Horizons',
    bookAuthor: 'Marcus Chen',
    bookCover: '/books/digital-horizons.jpg',
    rating: 4,
    title: 'Thought-provoking sci-fi',
    content: 'A compelling exploration of AI ethics and human consciousness. Chen raises important questions about our technological future without being preachy. The only reason I\'m not giving it 5 stars is the slightly rushed ending. Otherwise, highly recommended for anyone interested in where technology is taking us.',
    createdAt: '2024-01-10T14:20:00Z',
    status: 'published',
    helpfulCount: 18,
    commentsCount: 2,
  },
  {
    id: '3',
    bookId: 'art-stillness',
    bookTitle: 'The Art of Stillness',
    bookAuthor: 'Kenji Tanaka',
    bookCover: '/books/art-stillness.jpg',
    rating: 5,
    title: 'Changed my perspective on life',
    content: 'This book came into my life at exactly the right moment. Tanaka\'s gentle wisdom and practical exercises for finding peace in a chaotic world are invaluable. I\'ve already re-read it twice and given copies to several friends.',
    createdAt: '2024-01-05T09:15:00Z',
    updatedAt: '2024-01-08T11:00:00Z',
    status: 'published',
    helpfulCount: 67,
    commentsCount: 12,
  },
  {
    id: '4',
    bookId: 'silent-echoes',
    bookTitle: 'Silent Echoes',
    bookAuthor: 'James Morrison',
    bookCover: '/books/silent-echoes.jpg',
    rating: 3,
    title: 'Good but not great',
    content: 'The premise was interesting and the first half kept me engaged, but it lost steam in the second act. The twist was somewhat predictable. Still a decent read if you\'re into psychological thrillers.',
    createdAt: '2023-12-28T16:45:00Z',
    status: 'draft',
    helpfulCount: 0,
    commentsCount: 0,
  },
];

export const mockPendingReviewBooks: PendingReviewBook[] = [
  {
    id: 'whispers-wind',
    title: 'Whispers in the Wind',
    author: 'Sarah Mitchell',
    cover: '/books/whispers-wind.jpg',
    purchasedAt: '2024-01-10T14:20:00Z',
  },
  {
    id: 'last-sunset',
    title: 'The Last Sunset',
    author: 'Amara Okonkwo',
    cover: '/books/last-sunset.jpg',
    purchasedAt: '2024-01-03T09:00:00Z',
  },
];
