/**
 * Real Data Queries - Royalties & Orders
 * Supabase query implementations for author earnings and user orders
 */

import { createClient } from '@/lib/supabase/client';
import type { EarningsSummary, Transaction, BookEarning, PayoutRecord } from '../types';

// Royalty rate (author gets 70% of sale)
const ROYALTY_RATE = 0.70;

/**
 * Get earnings summary for current author
 */
export async function getEarningsSummary(): Promise<EarningsSummary> {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return {
      totalEarnings: 0,
      availableBalance: 0,
      pendingPayout: 0,
      thisMonth: 0,
      lastMonth: 0,
      changePercent: 0,
    };
  }

  // Get all purchases of author's books
  const { data: authorBooks } = await supabase
    .from('books')
    .select('id')
    .eq('author_id', user.id);

  if (!authorBooks || authorBooks.length === 0) {
    return {
      totalEarnings: 0,
      availableBalance: 0,
      pendingPayout: 0,
      thisMonth: 0,
      lastMonth: 0,
      changePercent: 0,
    };
  }

  const bookIds = authorBooks.map(b => b.id);

  // Get all completed purchases for author's books
  const { data: purchases } = await supabase
    .from('purchases')
    .select('amount, created_at, payment_status')
    .in('book_id', bookIds)
    .eq('payment_status', 'completed');

  if (!purchases) {
    return {
      totalEarnings: 0,
      availableBalance: 0,
      pendingPayout: 0,
      thisMonth: 0,
      lastMonth: 0,
      changePercent: 0,
    };
  }

  // Calculate totals
  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

  let totalEarnings = 0;
  let thisMonth = 0;
  let lastMonth = 0;

  for (const purchase of purchases) {
    const earnings = Number(purchase.amount) * ROYALTY_RATE;
    totalEarnings += earnings;

    const purchaseDate = new Date(purchase.created_at);
    if (purchaseDate >= thisMonthStart) {
      thisMonth += earnings;
    } else if (purchaseDate >= lastMonthStart && purchaseDate <= lastMonthEnd) {
      lastMonth += earnings;
    }
  }

  const changePercent = lastMonth > 0 
    ? Math.round(((thisMonth - lastMonth) / lastMonth) * 100) 
    : thisMonth > 0 ? 100 : 0;

  // Simulate available balance and pending (would need payouts table for real tracking)
  const availableBalance = totalEarnings * 0.8; // 80% available
  const pendingPayout = totalEarnings * 0.2; // 20% pending

  return {
    totalEarnings: Math.round(totalEarnings * 100) / 100,
    availableBalance: Math.round(availableBalance * 100) / 100,
    pendingPayout: Math.round(pendingPayout * 100) / 100,
    thisMonth: Math.round(thisMonth * 100) / 100,
    lastMonth: Math.round(lastMonth * 100) / 100,
    changePercent,
  };
}

/**
 * Get recent transactions for current author
 */
export async function getTransactions(): Promise<Transaction[]> {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return [];
  }

  // Get author's books
  const { data: authorBooks } = await supabase
    .from('books')
    .select('id, title')
    .eq('author_id', user.id);

  if (!authorBooks || authorBooks.length === 0) {
    return [];
  }

  const bookIds = authorBooks.map(b => b.id);
  const bookTitles = new Map(authorBooks.map(b => [b.id, b.title]));

  // Get purchases
  const { data: purchases, error } = await supabase
    .from('purchases')
    .select('id, book_id, amount, created_at, payment_status')
    .in('book_id', bookIds)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error || !purchases) {
    console.error('[getTransactions] Error:', error);
    return [];
  }

  return purchases.map((purchase, index): Transaction => ({
    id: index + 1,
    type: 'sale',
    book: bookTitles.get(purchase.book_id) || 'Unknown Book',
    format: 'eBook',
    amount: Math.round(Number(purchase.amount) * ROYALTY_RATE * 100) / 100,
    date: purchase.created_at,
    status: purchase.payment_status,
  }));
}

/**
 * Get earnings per book for current author
 */
export async function getBookEarnings(): Promise<BookEarning[]> {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return [];
  }

  // Get author's books with their purchases
  const { data: authorBooks } = await supabase
    .from('books')
    .select('id, title')
    .eq('author_id', user.id);

  if (!authorBooks || authorBooks.length === 0) {
    return [];
  }

  const bookIds = authorBooks.map(b => b.id);

  // Get all purchases for these books
  const { data: purchases } = await supabase
    .from('purchases')
    .select('book_id, amount, created_at')
    .in('book_id', bookIds)
    .eq('payment_status', 'completed');

  // Aggregate by book
  const earningsByBook = new Map<string, { sales: number; earnings: number; thisMonth: number }>();
  const thisMonthStart = new Date();
  thisMonthStart.setDate(1);
  thisMonthStart.setHours(0, 0, 0, 0);

  if (purchases) {
    for (const purchase of purchases) {
      const existing = earningsByBook.get(purchase.book_id) || { sales: 0, earnings: 0, thisMonth: 0 };
      const earnings = Number(purchase.amount) * ROYALTY_RATE;
      existing.sales += 1;
      existing.earnings += earnings;
      
      if (new Date(purchase.created_at) >= thisMonthStart) {
        existing.thisMonth += earnings;
      }
      
      earningsByBook.set(purchase.book_id, existing);
    }
  }

  return authorBooks.map((book, index): BookEarning => {
    const stats = earningsByBook.get(book.id) || { sales: 0, earnings: 0, thisMonth: 0 };
    return {
      id: index + 1,
      title: book.title,
      totalSales: stats.sales,
      totalEarnings: Math.round(stats.earnings * 100) / 100,
      thisMonth: Math.round(stats.thisMonth * 100) / 100,
    };
  });
}

/**
 * Get payout history for current author
 * Note: This would require a payouts table for real implementation
 */
export async function getPayoutHistory(): Promise<PayoutRecord[]> {
  // Would need a payouts table to track actual payouts
  // For now, return empty array (no payout history in current schema)
  return [];
}

// ============================================================================
// USER ORDER FUNCTIONS
// ============================================================================

export interface UserOrder {
  id: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  bookCover: string;
  amount: number;
  currency: string;
  status: string;
  purchasedAt: string;
  format: string;
}

/**
 * Get current user's order history
 */
export async function getUserOrders(): Promise<UserOrder[]> {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return [];
  }

  const { data: purchases, error } = await supabase
    .from('purchases')
    .select(`
      id,
      amount,
      currency,
      payment_status,
      created_at,
      book:books!purchases_book_id_fkey (
        id,
        title,
        cover_image,
        author:profiles!books_author_id_fkey (
          full_name,
          pen_name
        )
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error || !purchases) {
    console.error('[getUserOrders] Error:', error);
    return [];
  }

  return purchases.map((purchase): UserOrder => {
    const bookRaw = purchase.book as unknown;
    const book = Array.isArray(bookRaw)
      ? (bookRaw as Array<{ id: string; title: string; cover_image: string | null; author: unknown }>)[0]
      : bookRaw as { id: string; title: string; cover_image: string | null; author: unknown } | null;

    const authorRaw = book?.author as unknown;
    const author = Array.isArray(authorRaw)
      ? (authorRaw as Array<{ full_name: string | null; pen_name: string | null }>)[0]
      : authorRaw as { full_name: string | null; pen_name: string | null } | null;

    return {
      id: purchase.id,
      bookId: book?.id || '',
      bookTitle: book?.title || 'Unknown Book',
      bookAuthor: author?.pen_name || author?.full_name || 'Unknown Author',
      bookCover: book?.cover_image || '',
      amount: Number(purchase.amount),
      currency: purchase.currency,
      status: purchase.payment_status,
      purchasedAt: purchase.created_at,
      format: 'eBook',
    };
  });
}

/**
 * Get a specific order by ID
 */
export async function getOrderById(orderId: string): Promise<UserOrder | null> {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return null;
  }

  const { data: purchase, error } = await supabase
    .from('purchases')
    .select(`
      id,
      amount,
      currency,
      payment_status,
      created_at,
      book:books!purchases_book_id_fkey (
        id,
        title,
        cover_image,
        author:profiles!books_author_id_fkey (
          full_name,
          pen_name
        )
      )
    `)
    .eq('id', orderId)
    .eq('user_id', user.id)
    .single();

  if (error || !purchase) {
    return null;
  }

  const bookRaw = purchase.book as unknown;
  const book = Array.isArray(bookRaw)
    ? (bookRaw as Array<{ id: string; title: string; cover_image: string | null; author: unknown }>)[0]
    : bookRaw as { id: string; title: string; cover_image: string | null; author: unknown } | null;

  const authorRaw = book?.author as unknown;
  const author = Array.isArray(authorRaw)
    ? (authorRaw as Array<{ full_name: string | null; pen_name: string | null }>)[0]
    : authorRaw as { full_name: string | null; pen_name: string | null } | null;

  return {
    id: purchase.id,
    bookId: book?.id || '',
    bookTitle: book?.title || 'Unknown Book',
    bookAuthor: author?.pen_name || author?.full_name || 'Unknown Author',
    bookCover: book?.cover_image || '',
    amount: Number(purchase.amount),
    currency: purchase.currency,
    status: purchase.payment_status,
    purchasedAt: purchase.created_at,
    format: 'eBook',
  };
}

/**
 * Create a purchase (called after payment confirmation)
 */
export async function createPurchase(
  bookId: string,
  amount: number,
  paymentProvider: string,
  transactionId: string
): Promise<string | null> {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from('purchases')
    .insert({
      user_id: user.id,
      book_id: bookId,
      amount,
      payment_status: 'completed',
      payment_provider: paymentProvider,
      transaction_id: transactionId,
    })
    .select('id')
    .single();

  if (error) {
    console.error('[createPurchase] Error:', error);
    return null;
  }

  return data?.id || null;
}

/**
 * Check if user owns a book
 */
export async function userOwnsBook(bookId: string): Promise<boolean> {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return false;
  }

  const { data, error } = await supabase
    .from('purchases')
    .select('id')
    .eq('user_id', user.id)
    .eq('book_id', bookId)
    .eq('payment_status', 'completed')
    .single();

  return !error && !!data;
}

/**
 * Get user's order count
 */
export async function getUserOrderCount(): Promise<number> {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return 0;
  }

  const { count, error } = await supabase
    .from('purchases')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id);

  if (error) {
    return 0;
  }

  return count || 0;
}
