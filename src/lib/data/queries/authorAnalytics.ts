/**
 * Author Analytics Queries
 * Real implementations for author analytics page
 */

import { createClient } from '@/lib/supabase/client';
import type { 
  AnalyticsStat, 
  TopBook, 
  ReaderDemographic, 
  RecentActivityItem, 
  ReadingMetric 
} from '../mock/authorAnalytics';
import { emptyAnalyticsStats, emptyReadingMetrics } from '../mock/authorAnalytics';

/**
 * Get analytics stats for current author
 */
export async function getAuthorAnalyticsStats(): Promise<AnalyticsStat[]> {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return emptyAnalyticsStats;
  }

  // Get author's books
  const { data: books } = await supabase
    .from('books')
    .select('id')
    .eq('author_id', user.id);

  if (!books || books.length === 0) {
    return emptyAnalyticsStats;
  }

  const bookIds = books.map(b => b.id);

  // Get purchases/sales for author's books
  const { data: purchases } = await supabase
    .from('purchases')
    .select('amount, created_at')
    .in('book_id', bookIds)
    .eq('payment_status', 'completed');

  // Calculate totals
  let totalRevenue = 0;
  let totalSales = 0;

  if (purchases) {
    totalSales = purchases.length;
    totalRevenue = purchases.reduce((sum, p) => sum + Number(p.amount), 0) * 0.70; // 70% royalty
  }

  // Format values
  const formatCurrency = (amount: number): string => {
    return '$' + amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  return [
    { 
      label: 'Total Revenue', 
      value: formatCurrency(totalRevenue), 
      change: '0%', 
      up: true, 
      iconName: 'CurrencyDollar', 
      color: 'from-emerald-500 to-teal-600' 
    },
    { 
      label: 'Total Sales', 
      value: totalSales.toLocaleString(), 
      change: '0%', 
      up: true, 
      iconName: 'BookOpen', 
      color: 'from-blue-500 to-indigo-600' 
    },
    { 
      label: 'Unique Readers', 
      value: totalSales.toLocaleString(), // Simplified: 1 reader per sale
      change: '0%', 
      up: true, 
      iconName: 'Users', 
      color: 'from-purple-500 to-pink-600' 
    },
    { 
      label: 'Avg. Rating', 
      value: '-', 
      change: '0', 
      up: true, 
      iconName: 'Star', 
      color: 'from-amber-500 to-orange-600' 
    },
  ];
}

/**
 * Get top performing books for current author
 */
export async function getTopBooks(): Promise<TopBook[]> {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return [];
  }

  // Get author's books with sales aggregation
  const { data: books } = await supabase
    .from('books')
    .select('id, title')
    .eq('author_id', user.id);

  if (!books || books.length === 0) {
    return [];
  }

  const results: TopBook[] = [];

  for (const book of books) {
    const { data: purchases } = await supabase
      .from('purchases')
      .select('amount')
      .eq('book_id', book.id)
      .eq('payment_status', 'completed');

    if (purchases && purchases.length > 0) {
      const sales = purchases.length;
      const revenue = purchases.reduce((sum, p) => sum + Number(p.amount), 0) * 0.70;
      
      results.push({
        title: book.title,
        sales,
        revenue: Math.round(revenue),
        trend: 0, // Would need historical data for trend
      });
    }
  }

  // Sort by sales and return top 5
  return results.sort((a, b) => b.sales - a.sales).slice(0, 5);
}

/**
 * Get reader demographics for current author
 */
export async function getReaderDemographics(): Promise<ReaderDemographic[]> {
  // Would need user location data - return empty for now
  return [];
}

/**
 * Get recent activity for current author
 */
export async function getRecentActivity(): Promise<RecentActivityItem[]> {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return [];
  }

  // Get author's books
  const { data: books } = await supabase
    .from('books')
    .select('id, title')
    .eq('author_id', user.id);

  if (!books || books.length === 0) {
    return [];
  }

  const bookIds = books.map(b => b.id);
  const bookTitles = new Map(books.map(b => [b.id, b.title]));

  // Get recent purchases
  const { data: purchases } = await supabase
    .from('purchases')
    .select('book_id, amount, created_at')
    .in('book_id', bookIds)
    .eq('payment_status', 'completed')
    .order('created_at', { ascending: false })
    .limit(10);

  if (!purchases) {
    return [];
  }

  // Format time ago
  const formatTimeAgo = (dateStr: string): string => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  return purchases.map((p): RecentActivityItem => ({
    type: 'sale',
    book: bookTitles.get(p.book_id) || 'Unknown',
    time: formatTimeAgo(p.created_at),
    amount: `$${Number(p.amount).toFixed(2)}`,
  }));
}

/**
 * Get reading metrics for current author
 */
export async function getReadingMetrics(): Promise<ReadingMetric[]> {
  // Would need reading progress tracking - return empty metrics for now
  return emptyReadingMetrics;
}
