/**
 * Real Data Queries - My Books (Author's Published Books)
 */

import { createClient } from '@/lib/supabase/client';
import type { MyBook } from '../mock/myBooks';

/**
 * Get all books owned by the currently logged-in author
 * Returns empty array if no books exist or user is not authenticated
 */
export async function getMyBooks(): Promise<MyBook[]> {
  const supabase = createClient();
  
  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    console.error('[getMyBooks] Auth error:', authError);
    return [];
  }

  // Query author's books with aggregate stats
  const { data: books, error } = await supabase
    .from('books')
    .select(`
      id,
      title,
      description,
      cover_image,
      genre,
      status,
      price,
      published_at,
      created_at
    `)
    .eq('author_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[getMyBooks] Supabase error:', error);
    return [];
  }

  if (!books || books.length === 0) {
    return [];
  }

  // Get book IDs for aggregate queries
  const bookIds = books.map(b => b.id);

  // Get review stats for all books
  const { data: reviewStats } = await supabase
    .from('reviews')
    .select('book_id, rating')
    .in('book_id', bookIds);

  // Get purchase stats for all books
  const { data: purchaseStats } = await supabase
    .from('purchases')
    .select('book_id, quantity, total_amount')
    .in('book_id', bookIds)
    .eq('status', 'completed');

  // Aggregate review data by book
  const reviewsByBook: Record<string, { count: number; totalRating: number }> = {};
  reviewStats?.forEach(r => {
    if (!reviewsByBook[r.book_id]) {
      reviewsByBook[r.book_id] = { count: 0, totalRating: 0 };
    }
    reviewsByBook[r.book_id].count++;
    reviewsByBook[r.book_id].totalRating += r.rating;
  });

  // Aggregate purchase data by book
  const salesByBook: Record<string, { count: number; revenue: number }> = {};
  purchaseStats?.forEach(p => {
    if (!salesByBook[p.book_id]) {
      salesByBook[p.book_id] = { count: 0, revenue: 0 };
    }
    salesByBook[p.book_id].count += p.quantity || 1;
    salesByBook[p.book_id].revenue += p.total_amount || 0;
  });

  // Map database status to MyBook status
  const mapStatus = (status: string): MyBook['status'] => {
    switch (status?.toUpperCase()) {
      case 'PUBLISHED': return 'PUBLISHED';
      case 'IN_REVIEW':
      case 'REVIEW':
      case 'PENDING': return 'IN_REVIEW';
      case 'ARCHIVED': return 'ARCHIVED';
      default: return 'DRAFT';
    }
  };

  // Generate cover color based on genre/id
  const coverColors = [
    'from-purple-600 to-indigo-700',
    'from-blue-600 to-purple-700',
    'from-rose-600 to-purple-700',
    'from-emerald-600 to-teal-700',
    'from-amber-600 to-orange-700',
    'from-cyan-600 to-blue-700',
  ];

  return books.map((book, index): MyBook => {
    const reviews = reviewsByBook[book.id] || { count: 0, totalRating: 0 };
    const sales = salesByBook[book.id] || { count: 0, revenue: 0 };
    const avgRating = reviews.count > 0 ? reviews.totalRating / reviews.count : 0;

    return {
      id: book.id,
      title: book.title,
      description: book.description || '',
      coverImage: book.cover_image,
      coverColor: coverColors[index % coverColors.length],
      genre: book.genre || 'Uncategorized',
      status: mapStatus(book.status),
      publishedDate: book.published_at,
      price: book.price || 0,
      totalSales: sales.count,
      totalRevenue: sales.revenue,
      rating: Math.round(avgRating * 10) / 10,
      reviewCount: reviews.count,
      formats: ['EBOOK'], // Default to ebook, could expand based on book_formats table
    };
  });
}
