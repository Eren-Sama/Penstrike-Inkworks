/**
 * Mock Data - Author Analytics
 * Demo data for author analytics page
 */

export interface AnalyticsStat {
  label: string;
  value: string;
  change: string;
  up: boolean;
  iconName: 'CurrencyDollar' | 'BookOpen' | 'Users' | 'Star';
  color: string;
}

export interface TopBook {
  title: string;
  sales: number;
  revenue: number;
  trend: number;
}

export interface ReaderDemographic {
  country: string;
  readers: number;
  flag: string;
}

export interface RecentActivityItem {
  type: 'sale' | 'review';
  book: string;
  time: string;
  amount?: string;
  rating?: number;
}

export interface ReadingMetric {
  label: string;
  value: string;
  change: string;
  iconName: 'Clock' | 'BookOpen' | 'Eye' | 'Users';
}

export const mockAnalyticsStats: AnalyticsStat[] = [
  { label: 'Total Revenue', value: '$14,102', change: '+18%', up: true, iconName: 'CurrencyDollar', color: 'from-emerald-500 to-teal-600' },
  { label: 'Total Sales', value: '2,142', change: '+12%', up: true, iconName: 'BookOpen', color: 'from-blue-500 to-indigo-600' },
  { label: 'Unique Readers', value: '8,432', change: '+24%', up: true, iconName: 'Users', color: 'from-purple-500 to-pink-600' },
  { label: 'Avg. Rating', value: '4.7', change: '-0.1', up: false, iconName: 'Star', color: 'from-amber-500 to-orange-600' },
];

export const mockTopBooks: TopBook[] = [
  { title: 'The Crystal Kingdom', sales: 1250, revenue: 8750, trend: 12 },
  { title: 'The Hidden Path', sales: 892, revenue: 5352, trend: -3 },
];

export const mockReaderDemographics: ReaderDemographic[] = [
  { country: 'United States', readers: 45, flag: '🇺🇸' },
  { country: 'United Kingdom', readers: 22, flag: '🇬🇧' },
  { country: 'Canada', readers: 12, flag: '🇨🇦' },
  { country: 'Australia', readers: 8, flag: '🇦🇺' },
  { country: 'Germany', readers: 6, flag: '🇩🇪' },
  { country: 'Other', readers: 7, flag: '🌍' },
];

export const mockRecentActivity: RecentActivityItem[] = [
  { type: 'sale', book: 'The Crystal Kingdom', time: '2 min ago', amount: '$14.99' },
  { type: 'review', book: 'The Crystal Kingdom', time: '15 min ago', rating: 5 },
  { type: 'sale', book: 'The Hidden Path', time: '1 hour ago', amount: '$12.99' },
  { type: 'sale', book: 'The Crystal Kingdom', time: '3 hours ago', amount: '$14.99' },
  { type: 'review', book: 'The Hidden Path', time: '5 hours ago', rating: 4 },
];

export const mockReadingMetrics: ReadingMetric[] = [
  { label: 'Avg. Read Time', value: '4.2 hours', change: '+15%', iconName: 'Clock' },
  { label: 'Pages Read', value: '892K', change: '+22%', iconName: 'BookOpen' },
  { label: 'Completion Rate', value: '78%', change: '+5%', iconName: 'Eye' },
  { label: 'Return Readers', value: '62%', change: '+8%', iconName: 'Users' },
];

// Empty analytics for real mode when no data exists
export const emptyAnalyticsStats: AnalyticsStat[] = [
  { label: 'Total Revenue', value: '$0', change: '0%', up: true, iconName: 'CurrencyDollar', color: 'from-emerald-500 to-teal-600' },
  { label: 'Total Sales', value: '0', change: '0%', up: true, iconName: 'BookOpen', color: 'from-blue-500 to-indigo-600' },
  { label: 'Unique Readers', value: '0', change: '0%', up: true, iconName: 'Users', color: 'from-purple-500 to-pink-600' },
  { label: 'Avg. Rating', value: '-', change: '0', up: true, iconName: 'Star', color: 'from-amber-500 to-orange-600' },
];

export const emptyReadingMetrics: ReadingMetric[] = [
  { label: 'Avg. Read Time', value: '0 hours', change: '0%', iconName: 'Clock' },
  { label: 'Pages Read', value: '0', change: '0%', iconName: 'BookOpen' },
  { label: 'Completion Rate', value: '0%', change: '0%', iconName: 'Eye' },
  { label: 'Return Readers', value: '0%', change: '0%', iconName: 'Users' },
];
