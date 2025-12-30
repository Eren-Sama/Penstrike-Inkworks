'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  ChartBar,
  TrendUp,
  TrendDown,
  Users,
  BookOpen,
  CurrencyDollar,
  Calendar,
  DownloadSimple,
  Eye,
  Star,
  Globe,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  CaretDown,
  SpinnerGap
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';
import {
  getAuthorAnalyticsStats,
  getTopBooks,
  getReaderDemographics,
  getRecentActivity,
  getReadingMetrics,
  type AnalyticsStat,
  type TopBook,
  type ReaderDemographic,
  type RecentActivityItem,
  type ReadingMetric,
} from '@/lib/data';

const timeRanges = ['7 days', '30 days', '90 days', '12 months', 'All time'];

// Icon mappings (icons can't be stored in data layer)
const statIconMap: Record<string, typeof CurrencyDollar> = {
  CurrencyDollar,
  BookOpen,
  Users,
  Star,
};

const metricIconMap: Record<string, typeof Clock> = {
  Clock,
  BookOpen,
  Eye,
  Users,
};

export default function AuthorAnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30 days');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AnalyticsStat[]>([]);
  const [topBooks, setTopBooks] = useState<TopBook[]>([]);
  const [demographics, setDemographics] = useState<ReaderDemographic[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivityItem[]>([]);
  const [readingMetrics, setReadingMetrics] = useState<ReadingMetric[]>([]);

  // Load analytics data from data layer
  const loadAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const [statsData, booksData, demoData, activityData, metricsData] = await Promise.all([
        getAuthorAnalyticsStats(),
        getTopBooks(),
        getReaderDemographics(),
        getRecentActivity(),
        getReadingMetrics(),
      ]);
      setStats(statsData);
      setTopBooks(booksData);
      setDemographics(demoData);
      setRecentActivity(activityData);
      setReadingMetrics(metricsData);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <SpinnerGap weight="bold" className="h-8 w-8 animate-spin text-accent-yellow" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-ink-900">Analytics</h1>
          <p className="text-ink-600 mt-1">Track your book performance and reader engagement</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="select"
          >
            {timeRanges.map(range => (
              <option key={range} value={range}>{range}</option>
            ))}
          </select>
          <Button variant="outline" className="gap-2">
            <DownloadSimple weight="bold" className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const IconComponent = statIconMap[stat.iconName] || CurrencyDollar;
          return (
            <div key={stat.label} className="rounded-2xl bg-white border border-parchment-200 shadow-card p-6 animate-fade-up" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-ink-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-ink-900 mt-1">{stat.value}</p>
                  <p className={cn(
                    'text-sm mt-1 flex items-center gap-1',
                    stat.up ? 'text-emerald-600' : 'text-rose-600'
                  )}>
                    {stat.up ? <ArrowUpRight weight="bold" className="h-4 w-4" /> : <ArrowDownRight weight="bold" className="h-4 w-4" />}
                    {stat.change} vs last period
                  </p>
                </div>
                <div className={cn('w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center', stat.color)}>
                  <IconComponent weight="duotone" className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <div className="lg:col-span-2 rounded-2xl bg-white border border-parchment-200 shadow-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-xl font-bold text-ink-900">Sales Overview</h2>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                Revenue
              </span>
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                Sales
              </span>
            </div>
          </div>
          <div className="h-64 bg-parchment-50 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <ChartBar weight="duotone" className="h-12 w-12 text-ink-300 mx-auto mb-2" />
              <p className="text-sm text-ink-500">{topBooks.length > 0 ? 'Sales chart visualization' : 'No sales data available'}</p>
            </div>
          </div>
        </div>

        {/* Top Books */}
        <div className="rounded-2xl bg-white border border-parchment-200 shadow-card p-6">
          <h2 className="font-serif text-xl font-bold text-ink-900 mb-6">Top Performing Books</h2>
          {topBooks.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen weight="duotone" className="h-12 w-12 text-parchment-300 mx-auto mb-3" />
              <p className="text-sm text-ink-500">No book sales yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {topBooks.map((book, index) => (
                <div key={book.title} className="p-4 rounded-xl bg-parchment-50 animate-fade-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-ink-900">{book.title}</h3>
                    <span className={cn(
                      'text-xs font-medium flex items-center gap-1',
                      book.trend > 0 ? 'text-emerald-600' : 'text-rose-600'
                    )}>
                      {book.trend > 0 ? <TrendUp weight="bold" className="h-3 w-3" /> : <TrendDown weight="bold" className="h-3 w-3" />}
                      {book.trend > 0 ? '+' : ''}{book.trend}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-ink-500">{book.sales.toLocaleString()} sales</span>
                    <span className="font-semibold text-emerald-600">${book.revenue.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Reader Demographics */}
        <div className="rounded-2xl bg-white border border-parchment-200 shadow-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-xl font-bold text-ink-900">Reader Demographics</h2>
            <Globe weight="duotone" className="h-5 w-5 text-ink-400" />
          </div>
          {demographics.length === 0 ? (
            <div className="text-center py-8">
              <Globe weight="duotone" className="h-12 w-12 text-parchment-300 mx-auto mb-3" />
              <p className="text-sm text-ink-500">No reader data yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {demographics.map((country, index) => (
                <div key={country.country} className="flex items-center gap-3 animate-fade-up" style={{ animationDelay: `${index * 50}ms` }}>
                  <span className="text-xl">{country.flag}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-ink-900">{country.country}</span>
                      <span className="text-sm text-ink-500">{country.readers}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-parchment-200 overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
                        style={{ width: `${country.readers}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="rounded-2xl bg-white border border-parchment-200 shadow-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-xl font-bold text-ink-900">Recent Activity</h2>
            <Clock weight="duotone" className="h-5 w-5 text-ink-400" />
          </div>
          {recentActivity.length === 0 ? (
            <div className="text-center py-8">
              <Clock weight="duotone" className="h-12 w-12 text-parchment-300 mx-auto mb-3" />
              <p className="text-sm text-ink-500">No recent activity</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-3 animate-fade-up" style={{ animationDelay: `${index * 50}ms` }}>
                  <div className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center',
                    activity.type === 'sale' ? 'bg-emerald-100' : 'bg-amber-100'
                  )}>
                    {activity.type === 'sale' ? (
                      <CurrencyDollar weight="duotone" className="h-5 w-5 text-emerald-600" />
                    ) : (
                      <Star weight="fill" className="h-5 w-5 text-amber-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink-900 truncate">{activity.book}</p>
                    <p className="text-xs text-ink-500">{activity.time}</p>
                  </div>
                  {activity.type === 'sale' ? (
                    <span className="text-sm font-semibold text-emerald-600">{activity.amount}</span>
                  ) : (
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} weight="fill" className={cn('h-3 w-3', i < (activity.rating || 0) ? 'fill-amber-400 text-amber-400' : 'text-gray-300')} />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reading Metrics */}
      <div className="rounded-2xl bg-white border border-parchment-200 shadow-card p-6">
        <h2 className="font-serif text-xl font-bold text-ink-900 mb-6">Reading Engagement</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {readingMetrics.map((metric, index) => {
            const MetricIcon = metricIconMap[metric.iconName] || Clock;
            return (
              <div key={metric.label} className="text-center p-4 rounded-xl bg-parchment-50 animate-fade-up" style={{ animationDelay: `${index * 100}ms` }}>
                <MetricIcon weight="duotone" className="h-8 w-8 text-ink-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-ink-900">{metric.value}</p>
                <p className="text-sm text-ink-600">{metric.label}</p>
                <p className="text-xs text-emerald-600 mt-1">{metric.change}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
