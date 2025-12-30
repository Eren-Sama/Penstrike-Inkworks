/**
 * Mock Royalties Data
 * Extracted from author royalties page
 */

import type { EarningsSummary, Transaction, BookEarning, PayoutRecord } from '../types';

export const mockEarningsSummary: EarningsSummary = {
  totalEarnings: 12456.78,
  availableBalance: 3245.50,
  pendingPayout: 890.25,
  thisMonth: 1523.40,
  lastMonth: 1289.15,
  changePercent: 18.2,
};

export const mockTransactions: Transaction[] = [
  { id: 1, type: 'sale', book: 'The Midnight Garden', format: 'eBook', amount: 6.99, date: '2024-12-22' },
  { id: 2, type: 'sale', book: 'Shadows of Tomorrow', format: 'Paperback', amount: 11.89, date: '2024-12-22' },
  { id: 3, type: 'payout', description: 'Bank Transfer', amount: -500.00, date: '2024-12-15', status: 'completed' },
  { id: 4, type: 'sale', book: 'The Midnight Garden', format: 'Audiobook', amount: 13.99, date: '2024-12-20' },
  { id: 5, type: 'sale', book: 'Echoes of Eternity', format: 'eBook', amount: 5.59, date: '2024-12-19' },
  { id: 6, type: 'payout', description: 'Bank Transfer', amount: -750.00, date: '2024-11-15', status: 'completed' },
];

export const mockBookEarnings: BookEarning[] = [
  { id: 1, title: 'The Midnight Garden', totalSales: 342, totalEarnings: 4523.45, thisMonth: 523.20 },
  { id: 2, title: 'Shadows of Tomorrow', totalSales: 198, totalEarnings: 2876.30, thisMonth: 389.50 },
  { id: 3, title: 'Echoes of Eternity', totalSales: 156, totalEarnings: 1567.80, thisMonth: 287.90 },
  { id: 4, title: 'Whispers of Dawn', totalSales: 89, totalEarnings: 934.23, thisMonth: 145.60 },
];

export const mockPayoutHistory: PayoutRecord[] = [
  { id: 1, amount: 500.00, date: '2024-12-15', method: 'Bank Transfer', status: 'completed' },
  { id: 2, amount: 750.00, date: '2024-11-15', method: 'Bank Transfer', status: 'completed' },
  { id: 3, amount: 600.00, date: '2024-10-15', method: 'Bank Transfer', status: 'completed' },
  { id: 4, amount: 450.00, date: '2024-09-15', method: 'PayPal', status: 'completed' },
];
