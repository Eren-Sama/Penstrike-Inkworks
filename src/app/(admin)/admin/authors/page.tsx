'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  MagnifyingGlass,
  Funnel,
  DotsThree,
  CheckCircle,
  XCircle,
  Clock,
  UserPlus,
  EnvelopeSimple,
  BookOpen,
  Eye,
  CaretLeft,
  CaretRight,
  Shield,
  Star,
  SpinnerGap,
  WarningCircle
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';
import { getAdminAuthors, type AdminAuthor } from '@/lib/data';
import { isUsingMockData } from '@/lib/env';
import { 
  getVerificationQueue, 
  approveVerification, 
  rejectVerification,
  revokeVerification,
  type VerificationQueueItem 
} from '@/lib/actions/admin';

const statusConfig: Record<string, { bg: string; text: string; icon: typeof Clock }> = {
  verified: { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: CheckCircle },
  pending: { bg: 'bg-amber-100', text: 'text-amber-700', icon: Clock },
  unverified: { bg: 'bg-parchment-100', text: 'text-ink-600', icon: WarningCircle },
  suspended: { bg: 'bg-rose-100', text: 'text-rose-700', icon: XCircle },
};

// Unified author type for display
interface DisplayAuthor {
  id: string;
  name: string;
  email: string;
  avatar: string; // Initials fallback
  avatarUrl: string | null; // Actual image URL
  books: number;
  sales: number;
  status: 'verified' | 'pending' | 'unverified' | 'suspended';
  joined: string;
  isVerified: boolean;
  verificationRequested: boolean;
}

export default function AdminAuthorsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [authors, setAuthors] = useState<DisplayAuthor[]>([]);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isMockMode = isUsingMockData();

  // Load authors data - supports both mock and real mode
  const loadAuthors = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (isMockMode) {
        // Use mock data layer
        const data = await getAdminAuthors();
        setAuthors(data.map(a => ({
          ...a,
          id: String(a.id), // Convert number to string for consistency
          avatarUrl: a.avatar || null, // Mock data might have avatar URL
          isVerified: a.status === 'verified',
          verificationRequested: a.status === 'pending',
        })));
      } else {
        // Use real verification queue from server actions
        const result = await getVerificationQueue();
        if (result.success && result.data) {
          setAuthors(result.data.map(a => ({
            id: a.id,
            name: a.display_name,
            email: a.email,
            avatar: a.display_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
            avatarUrl: a.avatar_url || null,
            books: a.book_count,
            sales: 0, // Real sales would come from orders
            status: a.is_verified 
              ? 'verified' 
              : a.verification_requested 
                ? 'pending' 
                : 'unverified',
            joined: new Date(a.joined_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
            isVerified: a.is_verified,
            verificationRequested: a.verification_requested,
          })));
        } else {
          setError(result.success ? 'No data' : result.error);
        }
      }
    } catch (error) {
      console.error('Failed to load authors:', error);
      setError('Failed to load authors');
    } finally {
      setLoading(false);
    }
  }, [isMockMode]);

  useEffect(() => {
    loadAuthors();
  }, [loadAuthors]);

  // Handle verification approval
  const handleApprove = async (authorId: string) => {
    if (isMockMode) {
      // Simulate in mock mode
      setAuthors(prev => prev.map(a => 
        a.id === authorId ? { ...a, status: 'verified', isVerified: true, verificationRequested: false } : a
      ));
      return;
    }

    setActionLoading(authorId);
    const result = await approveVerification(authorId);
    if (result.success) {
      await loadAuthors();
    } else {
      setError(result.error);
    }
    setActionLoading(null);
  };

  // Handle verification rejection
  const handleReject = async (authorId: string) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;

    if (isMockMode) {
      setAuthors(prev => prev.map(a => 
        a.id === authorId ? { ...a, status: 'unverified', verificationRequested: false } : a
      ));
      return;
    }

    setActionLoading(authorId);
    const result = await rejectVerification(authorId, reason);
    if (result.success) {
      await loadAuthors();
    } else {
      setError(result.error);
    }
    setActionLoading(null);
  };

  // Handle revoke verification
  const handleRevoke = async (authorId: string) => {
    const reason = prompt('Enter revocation reason:');
    if (!reason) return;

    if (isMockMode) {
      setAuthors(prev => prev.map(a => 
        a.id === authorId ? { ...a, status: 'unverified', isVerified: false } : a
      ));
      return;
    }

    setActionLoading(authorId);
    const result = await revokeVerification(authorId, reason);
    if (result.success) {
      await loadAuthors();
    } else {
      setError(result.error);
    }
    setActionLoading(null);
  };

  const filteredAuthors = authors.filter(author => {
    const matchesSearch = author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      author.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || author.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = authors.filter(a => a.status === 'pending').length;
  const verifiedCount = authors.filter(a => a.status === 'verified').length;
  const totalAuthors = authors.length;

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
          <h1 className="font-serif text-3xl font-bold text-ink-900">Authors</h1>
          <p className="text-ink-600 mt-1">Manage author accounts and applications</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-4 py-2 rounded-full bg-parchment-100 text-ink-700 text-sm font-semibold">
            {totalAuthors} Authors
          </span>
          {pendingCount > 0 && (
            <span className="px-4 py-2 rounded-full bg-amber-100 text-amber-700 text-sm font-semibold">
              {pendingCount} Pending
            </span>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Authors', value: totalAuthors, icon: UserPlus, color: 'from-blue-500 to-indigo-600' },
          { label: 'Verified', value: authors.filter(a => a.status === 'verified').length, icon: Shield, color: 'from-emerald-500 to-teal-600' },
          { label: 'Total Books', value: authors.reduce((sum, a) => sum + a.books, 0), icon: BookOpen, color: 'from-purple-500 to-pink-600' },
          { label: 'Total Sales', value: `$${(authors.reduce((sum, a) => sum + a.sales, 0) / 1000).toFixed(1)}k`, icon: Star, color: 'from-amber-500 to-orange-600' },
        ].map((stat, index) => (
          <div key={stat.label} className="rounded-2xl bg-white border border-parchment-200 shadow-card p-6 animate-fade-up" style={{ animationDelay: `${index * 100}ms` }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-ink-500">{stat.label}</p>
                <p className="text-2xl font-bold text-ink-900 mt-1">{stat.value}</p>
              </div>
              <div className={cn('w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center', stat.color)}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <MagnifyingGlass weight="duotone" className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-ink-400" />
          <input
            type="text"
            placeholder="Search authors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-12 w-full"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="select w-full sm:w-48"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending Approval</option>
          <option value="verified">Verified</option>
          <option value="unverified">Unverified</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-red-700 text-sm">
          <strong>Error:</strong> {error}
          <button 
            onClick={() => setError(null)} 
            className="ml-2 text-red-500 hover:text-red-700"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Authors Table */}
      <div className="rounded-2xl bg-white border border-parchment-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-parchment-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-ink-500 uppercase tracking-wider">Author</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-ink-500 uppercase tracking-wider">Books</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-ink-500 uppercase tracking-wider">Sales</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-ink-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-ink-500 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-ink-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-parchment-100">
              {filteredAuthors.map((author, index) => {
                const status = statusConfig[author.status];
                const StatusIcon = status.icon;
                return (
                  <tr 
                    key={author.id} 
                    className="hover:bg-parchment-50/50 transition-colors animate-fade-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {author.avatarUrl ? (
                          <img 
                            src={author.avatarUrl} 
                            alt={author.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-yellow to-accent-amber flex items-center justify-center text-white font-semibold text-sm">
                            {author.avatar}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-ink-900">{author.name}</p>
                          <p className="text-sm text-ink-500">{author.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-parchment-100 text-ink-700 text-sm font-medium">
                        {author.books}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-semibold text-ink-900">${author.sales.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={cn(
                        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold capitalize',
                        status.bg, status.text
                      )}>
                        <StatusIcon className="h-3 w-3" />
                        {author.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-ink-600">{author.joined}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 rounded-lg text-ink-500 hover:bg-parchment-100 transition-colors" title="View Profile">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-2 rounded-lg text-ink-500 hover:bg-parchment-100 transition-colors" title="Send Message">
                          <EnvelopeSimple weight="duotone" className="h-4 w-4" />
                        </button>
                        
                        {/* Verification Actions - Admin Only */}
                        {author.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => handleApprove(author.id)}
                              disabled={actionLoading === author.id}
                              className="px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors disabled:opacity-50 flex items-center gap-1.5 text-sm font-medium"
                              title="Approve Verification"
                            >
                              {actionLoading === author.id ? (
                                <SpinnerGap className="h-4 w-4 animate-spin" />
                              ) : (
                                <CheckCircle className="h-4 w-4" />
                              )}
                              <span>Approve</span>
                            </button>
                            <button 
                              onClick={() => handleReject(author.id)}
                              disabled={actionLoading === author.id}
                              className="px-3 py-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors disabled:opacity-50 flex items-center gap-1.5 text-sm font-medium"
                              title="Reject Verification"
                            >
                              <XCircle className="h-4 w-4" />
                              <span>Reject</span>
                            </button>
                          </>
                        )}
                        
                        {/* Grant verification for unverified authors */}
                        {author.status === 'unverified' && (
                          <button 
                            onClick={() => handleApprove(author.id)}
                            disabled={actionLoading === author.id}
                            className="px-3 py-1.5 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors disabled:opacity-50 flex items-center gap-1.5 text-sm font-medium"
                            title="Grant Verification"
                          >
                            {actionLoading === author.id ? (
                              <SpinnerGap className="h-4 w-4 animate-spin" />
                            ) : (
                              <Shield className="h-4 w-4" />
                            )}
                            <span>Verify</span>
                          </button>
                        )}
                        
                        {/* Revoke option for verified authors */}
                        {author.status === 'verified' && (
                          <button 
                            onClick={() => handleRevoke(author.id)}
                            disabled={actionLoading === author.id}
                            className="px-3 py-1.5 rounded-lg bg-amber-100 text-amber-700 hover:bg-amber-200 transition-colors disabled:opacity-50 flex items-center gap-1.5 text-sm font-medium"
                            title="Revoke Verification"
                          >
                            {actionLoading === author.id ? (
                              <SpinnerGap className="h-4 w-4 animate-spin" />
                            ) : (
                              <Shield className="h-4 w-4" />
                            )}
                            <span>Revoke</span>
                          </button>
                        )}

                        <button className="p-2 rounded-lg text-ink-500 hover:bg-parchment-100 transition-colors" title="More Options">
                          <DotsThree weight="bold" className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-parchment-100 flex items-center justify-between">
          <p className="text-sm text-ink-600">
            Showing <span className="font-medium">{filteredAuthors.length}</span> of <span className="font-medium">{authors.length}</span> authors
          </p>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg border border-parchment-200 text-ink-500 hover:bg-parchment-50 transition-colors">
              <CaretLeft weight="bold" className="h-4 w-4" />
            </button>
            <button className="px-3 py-1 rounded-lg bg-ink-900 text-white text-sm font-medium">1</button>
            <button className="p-2 rounded-lg border border-parchment-200 text-ink-500 hover:bg-parchment-50 transition-colors">
              <CaretRight weight="bold" className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
