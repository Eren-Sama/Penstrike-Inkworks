'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Users,
  BookOpen,
  FileText,
  ArrowUpRight,
  Clock,
  CheckCircle,
  WarningCircle,
  ShoppingBag,
  ChartBar,
  ArrowsClockwise,
  Shield,
  SpinnerGap,
  type Icon
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';
import { isUsingMockData } from '@/lib/env';
import { 
  getAdminStats, 
  getVerificationQueue,
  getManuscriptQueue,
  type AdminStats,
  type VerificationQueueItem,
  type ManuscriptQueueItem
} from '@/lib/actions/admin';

// Mock data for demo mode only
const mockStats: AdminStats = {
  totalUsers: 1250,
  totalAuthors: 156,
  verifiedAuthors: 89,
  pendingVerifications: 12,
  totalBooks: 387,
  publishedBooks: 312,
  pendingManuscripts: 23,
  totalOrders: 4567,
};

const statusColors: Record<string, { bg: string; text: string; icon: Icon }> = {
  verified: { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: CheckCircle },
  pending: { bg: 'bg-amber-100', text: 'text-amber-700', icon: Clock },
  unverified: { bg: 'bg-parchment-100', text: 'text-ink-600', icon: WarningCircle },
  submitted: { bg: 'bg-blue-100', text: 'text-blue-700', icon: ArrowsClockwise },
  in_review: { bg: 'bg-purple-100', text: 'text-purple-700', icon: Clock },
};

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [pendingAuthors, setPendingAuthors] = useState<VerificationQueueItem[]>([]);
  const [pendingManuscripts, setPendingManuscripts] = useState<ManuscriptQueueItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const isMockMode = isUsingMockData();

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (isMockMode) {
        // Use mock data
        setStats(mockStats);
        setPendingAuthors([]);
        setPendingManuscripts([]);
      } else {
        // Fetch real data
        const [statsRes, authorsRes, manuscriptsRes] = await Promise.all([
          getAdminStats(),
          getVerificationQueue(),
          getManuscriptQueue(),
        ]);

        if (statsRes.success && statsRes.data) {
          setStats(statsRes.data);
        } else {
          setError(statsRes.success ? 'No stats data' : statsRes.error);
        }

        if (authorsRes.success && authorsRes.data) {
          // Filter to only pending verification requests
          setPendingAuthors(authorsRes.data.filter(a => a.verification_requested && !a.is_verified).slice(0, 5));
        }

        if (manuscriptsRes.success && manuscriptsRes.data) {
          setPendingManuscripts(manuscriptsRes.data.slice(0, 5));
        }
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, [isMockMode]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <SpinnerGap weight="bold" className="h-8 w-8 animate-spin text-accent-yellow" />
      </div>
    );
  }

  const statCards = stats ? [
    {
      label: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      gradient: 'from-blue-500 to-indigo-600',
      bgGradient: 'from-blue-50 to-indigo-50',
      href: '/admin/users',
    },
    {
      label: 'Authors',
      value: `${stats.verifiedAuthors}/${stats.totalAuthors}`,
      subLabel: 'verified',
      icon: Shield,
      gradient: 'from-emerald-500 to-teal-600',
      bgGradient: 'from-emerald-50 to-teal-50',
      href: '/admin/authors',
    },
    {
      label: 'Published Books',
      value: stats.publishedBooks.toLocaleString(),
      icon: BookOpen,
      gradient: 'from-accent-yellow to-accent-amber',
      bgGradient: 'from-accent-yellow/10 to-accent-amber/10',
      href: '/admin/books',
    },
    {
      label: 'Pending Reviews',
      value: stats.pendingManuscripts.toString(),
      icon: FileText,
      gradient: 'from-rose-500 to-pink-600',
      bgGradient: 'from-rose-50 to-pink-50',
      href: '/admin/manuscripts',
    },
  ] : [];

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-ink-900">Admin Dashboard</h1>
          <p className="text-ink-600 mt-1">Welcome back. Here&apos;s what&apos;s happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2" onClick={loadDashboardData}>
            <ArrowsClockwise weight="bold" className="h-4 w-4" />
            Refresh
          </Button>
          <Link href="/admin/reports">
            <Button variant="primary" className="gap-2">
              <ChartBar weight="duotone" className="h-4 w-4" />
              View Reports
            </Button>
          </Link>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-red-700 text-sm">
          <strong>Error:</strong> {error}
          <button onClick={() => setError(null)} className="ml-2 text-red-500 hover:text-red-700">
            Dismiss
          </button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Link
            key={stat.label}
            href={stat.href}
            className={`relative p-6 rounded-2xl bg-gradient-to-br ${stat.bgGradient} border border-white/50 shadow-card hover:shadow-elegant transition-all duration-500 hover:-translate-y-1 overflow-hidden animate-fade-up group`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Background Icon */}
            <stat.icon weight="light" className="absolute -right-4 -bottom-4 h-32 w-32 text-ink-900/5" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-md`}>
                  <stat.icon weight="duotone" className="h-6 w-6 text-white" />
                </div>
                <ArrowUpRight weight="bold" className="h-5 w-5 text-ink-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-3xl font-bold text-ink-900 mb-1">{stat.value}</p>
              <p className="text-sm text-ink-600">{stat.label}</p>
              {stat.subLabel && <p className="text-xs text-ink-500">{stat.subLabel}</p>}
            </div>
          </Link>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Pending Author Verifications */}
        <div className="rounded-2xl bg-white border border-parchment-200 shadow-card overflow-hidden">
          <div className="p-6 border-b border-parchment-100 flex items-center justify-between bg-gradient-to-r from-parchment-50 to-white">
            <div>
              <h2 className="font-serif text-xl font-bold text-ink-900">Pending Verifications</h2>
              <p className="text-sm text-ink-500 mt-1">Authors requesting verification</p>
            </div>
            <Link 
              href="/admin/authors?status=pending" 
              className="inline-flex items-center gap-1 text-sm font-semibold text-accent-warm hover:text-accent-amber transition-colors"
            >
              View All <ArrowUpRight weight="bold" className="h-4 w-4" />
            </Link>
          </div>
          <div className="divide-y divide-parchment-100">
            {pendingAuthors.length === 0 ? (
              <div className="p-8 text-center text-ink-500">
                <CheckCircle weight="duotone" className="h-12 w-12 mx-auto mb-3 text-emerald-500" />
                <p className="font-medium">All caught up!</p>
                <p className="text-sm">No pending verification requests</p>
              </div>
            ) : (
              pendingAuthors.map((author) => (
                <div key={author.id} className="p-4 hover:bg-parchment-50/50 transition-colors flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {author.avatar_url ? (
                      <img src={author.avatar_url} alt={author.display_name} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-semibold">
                        {author.display_name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-ink-900">{author.display_name}</p>
                      <p className="text-sm text-ink-500">{author.book_count} books</p>
                    </div>
                  </div>
                  <Link 
                    href="/admin/authors" 
                    className="px-3 py-1.5 text-sm font-medium bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors"
                  >
                    Review
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pending Manuscripts */}
        <div className="rounded-2xl bg-white border border-parchment-200 shadow-card overflow-hidden">
          <div className="p-6 border-b border-parchment-100 flex items-center justify-between bg-gradient-to-r from-parchment-50 to-white">
            <div>
              <h2 className="font-serif text-xl font-bold text-ink-900">Pending Manuscripts</h2>
              <p className="text-sm text-ink-500 mt-1">Books awaiting review</p>
            </div>
            <Link 
              href="/admin/manuscripts" 
              className="inline-flex items-center gap-1 text-sm font-semibold text-accent-warm hover:text-accent-amber transition-colors"
            >
              View All <ArrowUpRight weight="bold" className="h-4 w-4" />
            </Link>
          </div>
          <div className="divide-y divide-parchment-100">
            {pendingManuscripts.length === 0 ? (
              <div className="p-8 text-center text-ink-500">
                <CheckCircle weight="duotone" className="h-12 w-12 mx-auto mb-3 text-emerald-500" />
                <p className="font-medium">All caught up!</p>
                <p className="text-sm">No manuscripts pending review</p>
              </div>
            ) : (
              pendingManuscripts.map((manuscript) => {
                const status = statusColors[manuscript.status] || statusColors.submitted;
                const StatusIcon = status.icon;
                return (
                  <div key={manuscript.id} className="p-4 hover:bg-parchment-50/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-ink-900 truncate">{manuscript.title}</p>
                        <p className="text-sm text-ink-500">by {manuscript.author_name}</p>
                      </div>
                      <span className={cn(
                        'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold capitalize',
                        status.bg, status.text
                      )}>
                        <StatusIcon className="h-3 w-3" />
                        {manuscript.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-ink-500">
                      <span>{manuscript.genre || 'Uncategorized'}</span>
                      {manuscript.submitted_at && (
                        <span>Submitted {new Date(manuscript.submitted_at).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats Row */}
      {stats && (
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="card p-4 text-center">
            <p className="text-sm text-ink-500">Total Orders</p>
            <p className="text-2xl font-bold text-ink-900">{stats.totalOrders.toLocaleString()}</p>
          </div>
          <div className="card p-4 text-center">
            <p className="text-sm text-ink-500">Pending Author Verifications</p>
            <p className="text-2xl font-bold text-amber-600">{stats.pendingVerifications}</p>
          </div>
          <div className="card p-4 text-center">
            <p className="text-sm text-ink-500">Total Books</p>
            <p className="text-2xl font-bold text-ink-900">{stats.totalBooks.toLocaleString()}</p>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="rounded-2xl bg-white border border-parchment-200 shadow-card p-6">
        <h2 className="font-serif text-xl font-bold text-ink-900 mb-6">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {([
            { 
              href: '/admin/manuscripts', 
              icon: FileText, 
              title: 'Review Manuscripts', 
              count: `${stats?.pendingManuscripts || 0} pending`,
              gradient: 'from-rose-500 to-pink-600',
              bg: 'hover:bg-rose-50'
            },
            { 
              href: '/admin/authors', 
              icon: Shield, 
              title: 'Author Verifications', 
              count: `${stats?.pendingVerifications || 0} pending`,
              gradient: 'from-blue-500 to-indigo-600',
              bg: 'hover:bg-blue-50'
            },
            { 
              href: '/admin/reports', 
              icon: WarningCircle, 
              title: 'View Reports', 
              count: 'Analytics & insights',
              gradient: 'from-amber-500 to-orange-600',
              bg: 'hover:bg-amber-50'
            },
            { 
              href: '/admin/orders', 
              icon: ShoppingBag, 
              title: 'Manage Orders', 
              count: `${stats?.totalOrders || 0} total`,
              gradient: 'from-emerald-500 to-teal-600',
              bg: 'hover:bg-emerald-50'
            },
          ] as { href: string; icon: Icon; title: string; count: string; gradient: string; bg: string }[]).map((action, index) => (
            <Link 
              key={index}
              href={action.href} 
              className={`flex items-center gap-4 p-4 rounded-xl border border-parchment-200 ${action.bg} transition-all duration-300 hover:-translate-y-1 hover:shadow-card animate-fade-up`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center shadow-md`}>
                <action.icon weight="duotone" className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-ink-900">{action.title}</p>
                <p className="text-sm text-ink-500">{action.count}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
