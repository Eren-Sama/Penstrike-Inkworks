/**
 * Mock Author Dashboard Data
 * Extracted from author dashboard page
 */

// Types for dashboard data (icons are added by the page component)
export interface DashboardStat {
  label: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  iconName: 'CurrencyDollar' | 'BookOpen' | 'Users' | 'Star';
  gradient: string;
  bgGradient: string;
}

export interface RecentSale {
  title: string;
  format: string;
  amount: number;
  date: string;
  iconName: 'Moon' | 'Sparkle' | 'SunHorizon';
  color: string;
}

export interface DashboardManuscript {
  id: string;
  title: string;
  status: string;
  progress: number;
  lastUpdated: string;
  iconName: 'Diamond' | 'Leaf' | 'SunHorizon';
  color: string;
}

export interface AICredits {
  used: number;
  total: number;
  resetDate: string;
}

export const mockDashboardStats: DashboardStat[] = [
  {
    label: 'Total Earnings',
    value: '$12,456',
    change: '+12.5%',
    changeType: 'positive',
    iconName: 'CurrencyDollar',
    gradient: 'from-emerald-500 to-teal-600',
    bgGradient: 'from-emerald-50 to-teal-50',
  },
  {
    label: 'Books Published',
    value: '4',
    change: '+1 this month',
    changeType: 'positive',
    iconName: 'BookOpen',
    gradient: 'from-accent-yellow to-accent-amber',
    bgGradient: 'from-accent-yellow/10 to-accent-amber/10',
  },
  {
    label: 'Total Readers',
    value: '24.5K',
    change: '+8.2%',
    changeType: 'positive',
    iconName: 'Users',
    gradient: 'from-blue-500 to-indigo-600',
    bgGradient: 'from-blue-50 to-indigo-50',
  },
  {
    label: 'Avg Rating',
    value: '4.7',
    change: '+0.2',
    changeType: 'positive',
    iconName: 'Star',
    gradient: 'from-amber-500 to-orange-600',
    bgGradient: 'from-amber-50 to-orange-50',
  },
];

export const mockRecentSales: RecentSale[] = [
  { title: 'The Midnight Garden', format: 'eBook', amount: 9.99, date: '2 hours ago', iconName: 'Moon', color: 'from-indigo-500 to-purple-600' },
  { title: 'Shadows of Tomorrow', format: 'Paperback', amount: 16.99, date: '5 hours ago', iconName: 'Moon', color: 'from-gray-700 to-gray-900' },
  { title: 'The Midnight Garden', format: 'Audiobook', amount: 19.99, date: '1 day ago', iconName: 'Moon', color: 'from-indigo-500 to-purple-600' },
  { title: 'Echoes of Eternity', format: 'eBook', amount: 8.99, date: '2 days ago', iconName: 'Sparkle', color: 'from-violet-500 to-fuchsia-600' },
];

export const mockDashboardManuscripts: DashboardManuscript[] = [
  { 
    id: '1',
    title: 'The Crystal Kingdom', 
    status: 'REVIEW', 
    progress: 100,
    lastUpdated: '2 days ago',
    iconName: 'Diamond',
    color: 'from-cyan-500 to-blue-600'
  },
  { 
    id: '2',
    title: 'Whispers in the Wind', 
    status: 'EDITING', 
    progress: 65,
    lastUpdated: '1 week ago',
    iconName: 'Leaf',
    color: 'from-emerald-500 to-green-600'
  },
  { 
    id: '3',
    title: 'Beyond the Horizon', 
    status: 'DRAFT', 
    progress: 30,
    lastUpdated: '3 weeks ago',
    iconName: 'SunHorizon',
    color: 'from-orange-500 to-rose-500'
  },
];

export const mockAICredits: AICredits = {
  used: 75,
  total: 100,
  resetDate: 'Jan 1, 2025',
};
