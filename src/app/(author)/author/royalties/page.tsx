'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  CurrencyDollar,
  TrendUp,
  TrendDown,
  DownloadSimple,
  Calendar,
  BookOpen,
  CreditCard,
  ArrowUpRight,
  Check,
  Clock,
  WarningCircle,
  SpinnerGap
} from '@phosphor-icons/react';
import { cn, formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui';
import { 
  getEarningsSummary, 
  getTransactions, 
  getBookEarnings, 
  getPayoutHistory,
  type EarningsSummary,
  type Transaction,
  type BookEarning,
  type PayoutRecord
} from '@/lib/data';

export default function RoyaltiesPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'payouts'>('overview');
  const [dateRange, setDateRange] = useState('30');
  const [loading, setLoading] = useState(true);
  const [earningsSummary, setEarningsSummary] = useState<EarningsSummary | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [bookEarnings, setBookEarnings] = useState<BookEarning[]>([]);
  const [payoutHistory, setPayoutHistory] = useState<PayoutRecord[]>([]);

  // Load royalties data
  const loadRoyaltiesData = useCallback(async () => {
    try {
      setLoading(true);
      const [summary, transactions, earnings, payouts] = await Promise.all([
        getEarningsSummary(),
        getTransactions(),
        getBookEarnings(),
        getPayoutHistory(),
      ]);
      setEarningsSummary(summary);
      setRecentTransactions(transactions);
      setBookEarnings(earnings);
      setPayoutHistory(payouts);
    } catch (error) {
      console.error('Failed to load royalties data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRoyaltiesData();
  }, [loadRoyaltiesData]);

  if (loading || !earningsSummary) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <SpinnerGap weight="bold" className="h-8 w-8 animate-spin text-accent-yellow" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-ink-900">Royalties & Earnings</h1>
          <p className="text-ink-600">Track your book sales and manage payouts.</p>
        </div>
        <div className="flex gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="input py-2"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
            <option value="all">All time</option>
          </select>
          <Button variant="outline">
            <DownloadSimple weight="bold" className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
              <CurrencyDollar weight="duotone" className="h-5 w-5 text-success" />
            </div>
            <span className={cn(
              'text-sm font-medium flex items-center gap-1',
              earningsSummary.changePercent >= 0 ? 'text-success' : 'text-error'
            )}>
              {earningsSummary.changePercent >= 0 ? (
                <TrendUp weight="bold" className="h-4 w-4" />
              ) : (
                <TrendDown weight="bold" className="h-4 w-4" />
              )}
              {Math.abs(earningsSummary.changePercent)}%
            </span>
          </div>
          <p className="text-2xl font-bold text-ink-900 mb-1">
            {formatCurrency(earningsSummary.totalEarnings)}
          </p>
          <p className="text-sm text-ink-500">Total Earnings</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-accent-yellow/20 rounded-lg flex items-center justify-center">
              <CreditCard weight="duotone" className="h-5 w-5 text-accent-warm" />
            </div>
          </div>
          <p className="text-2xl font-bold text-ink-900 mb-1">
            {formatCurrency(earningsSummary.availableBalance)}
          </p>
          <p className="text-sm text-ink-500">Available Balance</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock weight="duotone" className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-ink-900 mb-1">
            {formatCurrency(earningsSummary.pendingPayout)}
          </p>
          <p className="text-sm text-ink-500">Pending Payout</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-parchment-200 rounded-lg flex items-center justify-center">
              <Calendar weight="duotone" className="h-5 w-5 text-ink-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-ink-900 mb-1">
            {formatCurrency(earningsSummary.thisMonth)}
          </p>
          <p className="text-sm text-ink-500">This Month</p>
        </div>
      </div>

      {/* Request Payout Button */}
      <div className="card p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="font-semibold text-ink-900">Ready to withdraw?</h3>
          <p className="text-sm text-ink-600">
            You have {formatCurrency(earningsSummary.availableBalance)} available for payout.
            Minimum payout is $50.
          </p>
        </div>
        <Button variant="primary" disabled={earningsSummary.availableBalance < 50}>
          Request Payout
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-b border-parchment-200">
        <nav className="flex gap-8">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'transactions', label: 'Transactions' },
            { id: 'payouts', label: 'Payout History' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={cn(
                'pb-4 text-sm font-medium transition-colors relative',
                activeTab === tab.id
                  ? 'text-ink-900'
                  : 'text-ink-500 hover:text-ink-700'
              )}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-ink-900" />
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="card">
          <div className="p-6 border-b border-parchment-200">
            <h2 className="font-serif text-lg font-semibold text-ink-900">Earnings by Book</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-parchment-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-ink-600 uppercase tracking-wider">
                    Book
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-ink-600 uppercase tracking-wider">
                    Total Sales
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-ink-600 uppercase tracking-wider">
                    Total Earnings
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-ink-600 uppercase tracking-wider">
                    This Month
                  </th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-parchment-200">
                {bookEarnings.map((book) => (
                  <tr key={book.id} className="hover:bg-parchment-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-14 bg-gradient-to-br from-ink-800 to-ink-900 rounded flex items-center justify-center">
                          <BookOpen weight="duotone" className="h-4 w-4 text-parchment-400" />
                        </div>
                        <p className="font-medium text-ink-900">{book.title}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-ink-600">
                      {book.totalSales}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-ink-900">
                      {formatCurrency(book.totalEarnings)}
                    </td>
                    <td className="px-6 py-4 text-right text-success font-medium">
                      +{formatCurrency(book.thisMonth)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-sm text-accent-warm hover:text-accent-amber">
                        View details →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'transactions' && (
        <div className="card">
          <div className="p-6 border-b border-parchment-200">
            <h2 className="font-serif text-lg font-semibold text-ink-900">Recent Transactions</h2>
          </div>
          <div className="divide-y divide-parchment-200">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center',
                    tx.type === 'sale' ? 'bg-success/10' : 'bg-parchment-200'
                  )}>
                    {tx.type === 'sale' ? (
                      <ArrowUpRight weight="bold" className="h-5 w-5 text-success" />
                    ) : (
                      <CreditCard weight="duotone" className="h-5 w-5 text-ink-500" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-ink-900">
                      {tx.type === 'sale' ? tx.book : tx.description}
                    </p>
                    <p className="text-sm text-ink-500">
                      {tx.type === 'sale' ? tx.format : (tx as any).status}
                      {' • '}
                      {new Date(tx.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p className={cn(
                  'font-semibold',
                  tx.amount >= 0 ? 'text-success' : 'text-ink-900'
                )}>
                  {tx.amount >= 0 ? '+' : ''}{formatCurrency(tx.amount)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'payouts' && (
        <div className="card">
          <div className="p-6 border-b border-parchment-200">
            <h2 className="font-serif text-lg font-semibold text-ink-900">Payout History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-parchment-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-ink-600 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-ink-600 uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-ink-600 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-ink-600 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-parchment-200">
                {payoutHistory.map((payout) => (
                  <tr key={payout.id} className="hover:bg-parchment-50 transition-colors">
                    <td className="px-6 py-4 text-ink-900">
                      {new Date(payout.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-ink-600">
                      {payout.method}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-ink-900">
                      {formatCurrency(payout.amount)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={cn(
                        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium',
                        payout.status === 'completed'
                          ? 'bg-success/20 text-success'
                          : payout.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-error/20 text-error'
                      )}>
                        {payout.status === 'completed' && <Check weight="bold" className="h-3 w-3" />}
                        {payout.status === 'pending' && <Clock weight="duotone" className="h-3 w-3" />}
                        {payout.status === 'failed' && <WarningCircle weight="duotone" className="h-3 w-3" />}
                        {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
