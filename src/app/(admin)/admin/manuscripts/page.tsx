'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  MagnifyingGlass,
  Funnel,
  FileText,
  Clock,
  CheckCircle,
  WarningCircle,
  XCircle,
  Eye,
  DownloadSimple,
  DotsThreeVertical,
  CaretLeft,
  CaretRight,
  Chat,
  SpinnerGap,
  Play,
  ArrowRight,
  Prohibit
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';
import { isUsingMockData } from '@/lib/env';
import {
  getManuscriptQueue,
  startManuscriptReview,
  approveManuscript,
  rejectManuscript,
  publishBook,
  unpublishBook,
  type ManuscriptQueueItem
} from '@/lib/actions/admin';

// Mock manuscripts data
const mockManuscripts = [
  {
    id: '1',
    title: 'The Last Horizon',
    author: { name: 'A.M. Sterling', email: 'sterling@example.com' },
    genre: ['Science Fiction', 'Adventure'],
    wordCount: 95000,
    status: 'REVIEW',
    submittedAt: '2024-12-20',
    assignedEditor: null,
    priority: 'high',
  },
  {
    id: '2',
    title: 'Shadows of the Past',
    author: { name: 'K. Thompson', email: 'thompson@example.com' },
    genre: ['Thriller', 'Mystery'],
    wordCount: 78000,
    status: 'REVIEW',
    submittedAt: '2024-12-19',
    assignedEditor: null,
    priority: 'normal',
  },
  {
    id: '3',
    title: 'Beneath the Stars',
    author: { name: 'J. Rivera', email: 'rivera@example.com' },
    genre: ['Romance'],
    wordCount: 62000,
    status: 'EDITING',
    submittedAt: '2024-12-15',
    assignedEditor: 'Sarah Editor',
    priority: 'normal',
  },
  {
    id: '4',
    title: 'The Crystal Key',
    author: { name: 'M. Foster', email: 'foster@example.com' },
    genre: ['Fantasy', 'Young Adult'],
    wordCount: 88000,
    status: 'APPROVED',
    submittedAt: '2024-12-10',
    assignedEditor: 'James Wilson',
    priority: 'normal',
  },
  {
    id: '5',
    title: 'Dark Echoes',
    author: { name: 'R. Blake', email: 'blake@example.com' },
    genre: ['Horror'],
    wordCount: 72000,
    status: 'REJECTED',
    submittedAt: '2024-12-08',
    assignedEditor: 'Sarah Editor',
    priority: 'low',
    rejectionReason: 'Content quality does not meet publishing standards.',
  },
];

const statusConfig: Record<string, { color: string; icon: any; label: string }> = {
  draft: { color: 'bg-parchment-200 text-ink-600', icon: Clock, label: 'Draft' },
  submitted: { color: 'bg-blue-100 text-blue-700', icon: ArrowRight, label: 'Submitted' },
  pending: { color: 'bg-accent-yellow/20 text-accent-warm', icon: WarningCircle, label: 'Pending Review' },
  in_review: { color: 'bg-blue-100 text-blue-700', icon: FileText, label: 'In Review' },
  approved: { color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle, label: 'Approved' },
  rejected: { color: 'bg-error/20 text-error', icon: XCircle, label: 'Rejected' },
  published: { color: 'bg-success/20 text-success', icon: CheckCircle, label: 'Published' },
  archived: { color: 'bg-parchment-300 text-ink-500', icon: Prohibit, label: 'Archived' },
  // Legacy uppercase status mapping
  DRAFT: { color: 'bg-parchment-200 text-ink-600', icon: Clock, label: 'Draft' },
  REVIEW: { color: 'bg-accent-yellow/20 text-accent-warm', icon: WarningCircle, label: 'Pending Review' },
  EDITING: { color: 'bg-blue-100 text-blue-700', icon: FileText, label: 'In Editing' },
  APPROVED: { color: 'bg-success/20 text-success', icon: CheckCircle, label: 'Approved' },
  REJECTED: { color: 'bg-error/20 text-error', icon: XCircle, label: 'Rejected' },
  PUBLISHED: { color: 'bg-success/20 text-success', icon: CheckCircle, label: 'Published' },
};

// Unified manuscript type for display
interface DisplayManuscript {
  id: string;
  title: string;
  author: { name: string; email: string };
  genre: string[];
  wordCount: number;
  status: string;
  submittedAt: string;
  assignedEditor: string | null;
  priority: string;
  rejectionReason?: string;
}

export default function AdminManuscriptsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [manuscripts, setManuscripts] = useState<DisplayManuscript[]>([]);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isMockMode = isUsingMockData();

  // Load manuscripts data
  const loadManuscripts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (isMockMode) {
        // Use mock data
        setManuscripts(mockManuscripts);
      } else {
        // Use real manuscript queue from server actions
        const result = await getManuscriptQueue();
        if (result.success && result.data) {
          setManuscripts(result.data.map(m => ({
            id: m.id,
            title: m.title,
            author: { name: m.author_name, email: m.author_email },
            genre: [], // Would come from book metadata
            wordCount: 0, // Would come from book metadata
            status: m.status,
            submittedAt: m.submitted_at ? new Date(m.submitted_at).toLocaleDateString() : '',
            assignedEditor: m.reviewer_name || null,
            priority: 'normal',
            rejectionReason: m.rejection_reason || undefined,
          })));
        } else {
          setError(result.success ? 'No data' : result.error);
        }
      }
    } catch (error) {
      console.error('Failed to load manuscripts:', error);
      setError('Failed to load manuscripts');
    } finally {
      setLoading(false);
    }
  }, [isMockMode]);

  useEffect(() => {
    loadManuscripts();
  }, [loadManuscripts]);

  // Start review action
  const handleStartReview = async (bookId: string) => {
    if (isMockMode) {
      setManuscripts(prev => prev.map(m =>
        m.id === bookId ? { ...m, status: 'in_review' } : m
      ));
      return;
    }

    setActionLoading(bookId);
    const result = await startManuscriptReview(bookId);
    if (result.success) {
      await loadManuscripts();
    } else {
      setError(result.error);
    }
    setActionLoading(null);
  };

  // Approve action
  const handleApprove = async (bookId: string) => {
    if (isMockMode) {
      setManuscripts(prev => prev.map(m =>
        m.id === bookId ? { ...m, status: 'approved' } : m
      ));
      return;
    }

    setActionLoading(bookId);
    const result = await approveManuscript(bookId);
    if (result.success) {
      await loadManuscripts();
    } else {
      setError(result.error);
    }
    setActionLoading(null);
  };

  // Reject action
  const handleReject = async (bookId: string) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;

    if (isMockMode) {
      setManuscripts(prev => prev.map(m =>
        m.id === bookId ? { ...m, status: 'rejected', rejectionReason: reason } : m
      ));
      return;
    }

    setActionLoading(bookId);
    const result = await rejectManuscript(bookId, reason);
    if (result.success) {
      await loadManuscripts();
    } else {
      setError(result.error);
    }
    setActionLoading(null);
  };

  // Publish action
  const handlePublish = async (bookId: string) => {
    if (isMockMode) {
      setManuscripts(prev => prev.map(m =>
        m.id === bookId ? { ...m, status: 'published' } : m
      ));
      return;
    }

    setActionLoading(bookId);
    const result = await publishBook(bookId);
    if (result.success) {
      await loadManuscripts();
    } else {
      setError(result.error);
    }
    setActionLoading(null);
  };

  // Unpublish action
  const handleUnpublish = async (bookId: string) => {
    const reason = prompt('Enter reason for unpublishing:');
    if (!reason) return;

    if (isMockMode) {
      setManuscripts(prev => prev.map(m =>
        m.id === bookId ? { ...m, status: 'draft' } : m
      ));
      return;
    }

    setActionLoading(bookId);
    const result = await unpublishBook(bookId, reason);
    if (result.success) {
      await loadManuscripts();
    } else {
      setError(result.error);
    }
    setActionLoading(null);
  };

  const filteredManuscripts = manuscripts.filter(ms => {
    const matchesSearch = ms.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ms.author.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ms.status === statusFilter || ms.status.toUpperCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = manuscripts.filter(m => m.status === 'submitted' || m.status === 'REVIEW' || m.status === 'pending').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <SpinnerGap weight="bold" className="h-8 w-8 animate-spin text-accent-yellow" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-ink-900">Manuscripts</h1>
          <p className="text-ink-600">Review and manage submitted manuscripts.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <DownloadSimple weight="bold" className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
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

      {/* Stats */}
      <div className="grid sm:grid-cols-5 gap-4">
        <div className="card p-4">
          <p className="text-2xl font-bold text-ink-900">{manuscripts.length}</p>
          <p className="text-sm text-ink-500">Total</p>
        </div>
        <div className="card p-4 border-l-4 border-accent-yellow">
          <p className="text-2xl font-bold text-accent-warm">{pendingCount}</p>
          <p className="text-sm text-ink-500">Pending Review</p>
        </div>
        <div className="card p-4">
          <p className="text-2xl font-bold text-blue-600">
            {manuscripts.filter(m => m.status === 'in_review' || m.status === 'EDITING').length}
          </p>
          <p className="text-sm text-ink-500">In Review</p>
        </div>
        <div className="card p-4">
          <p className="text-2xl font-bold text-success">
            {manuscripts.filter(m => m.status === 'approved' || m.status === 'APPROVED').length}
          </p>
          <p className="text-sm text-ink-500">Approved</p>
        </div>
        <div className="card p-4">
          <p className="text-2xl font-bold text-error">
            {manuscripts.filter(m => m.status === 'rejected' || m.status === 'REJECTED').length}
          </p>
          <p className="text-sm text-ink-500">Rejected</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
            <input
              type="text"
              placeholder="Search manuscripts or authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10 w-full"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input py-2"
            >
              <option value="all">All Status</option>
              <option value="submitted">Submitted</option>
              <option value="in_review">In Review</option>
              <option value="approved">Approved</option>
              <option value="published">Published</option>
              <option value="rejected">Rejected</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Manuscripts Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-parchment-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-ink-600 uppercase tracking-wider">
                  Manuscript
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-ink-600 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-ink-600 uppercase tracking-wider">
                  Genre
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-ink-600 uppercase tracking-wider">
                  Words
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-ink-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-ink-600 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-parchment-200">
              {filteredManuscripts.map((ms) => {
                const status = statusConfig[ms.status];
                const StatusIcon = status?.icon || Clock;
                
                return (
                  <tr key={ms.id} className="hover:bg-parchment-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-12 bg-gradient-to-br from-ink-700 to-ink-900 rounded flex items-center justify-center flex-shrink-0">
                          <FileText weight="duotone" className="h-5 w-5 text-parchment-400" />
                        </div>
                        <div>
                          <Link 
                            href={`/admin/manuscripts/${ms.id}`}
                            className="font-medium text-ink-900 hover:text-accent-warm"
                          >
                            {ms.title}
                          </Link>
                          {ms.priority === 'high' && (
                            <span className="ml-2 text-xs text-error font-medium">URGENT</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-ink-900">{ms.author.name}</p>
                      <p className="text-xs text-ink-500">{ms.author.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {ms.genre.map((g) => (
                          <span 
                            key={g} 
                            className="text-xs bg-parchment-200 text-ink-600 px-2 py-0.5 rounded"
                          >
                            {g}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-ink-600">
                      {ms.wordCount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={cn(
                        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium',
                        status?.color
                      )}>
                        <StatusIcon weight="fill" className="h-3 w-3" />
                        {status?.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-ink-600">
                      {new Date(ms.submittedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="relative">
                        <button
                          onClick={() => setActiveMenu(activeMenu === ms.id ? null : ms.id)}
                          className="p-2 hover:bg-parchment-100 rounded-lg transition-colors"
                        >
                          <DotsThreeVertical weight="bold" className="h-4 w-4 text-ink-500" />
                        </button>
                        
                        {activeMenu === ms.id && (
                          <>
                            <div 
                              className="fixed inset-0 z-10"
                              onClick={() => setActiveMenu(null)}
                            />
                            <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-parchment-200 z-20">
                              <Link
                                href={`/admin/manuscripts/${ms.id}`}
                                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-ink-700 hover:bg-parchment-100"
                                onClick={() => setActiveMenu(null)}
                              >
                                <Eye weight="duotone" className="h-4 w-4" />
                                Review Manuscript
                              </Link>
                              <button
                                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-ink-700 hover:bg-parchment-100"
                                onClick={() => setActiveMenu(null)}
                              >
                                <DownloadSimple weight="bold" className="h-4 w-4" />
                                Download File
                              </button>
                              <button
                                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-ink-700 hover:bg-parchment-100"
                                onClick={() => setActiveMenu(null)}
                              >
                                <Chat weight="duotone" className="h-4 w-4" />
                                Send Feedback
                              </button>
                              
                              {/* Start Review - for submitted manuscripts */}
                              {(ms.status === 'submitted' || ms.status === 'pending') && (
                                <button
                                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-blue-600 hover:bg-parchment-100"
                                  onClick={() => { setActiveMenu(null); handleStartReview(ms.id); }}
                                  disabled={actionLoading === ms.id}
                                >
                                  {actionLoading === ms.id ? (
                                    <SpinnerGap className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Play weight="fill" className="h-4 w-4" />
                                  )}
                                  Start Review
                                </button>
                              )}
                              
                              {/* Approve/Reject - for manuscripts in review */}
                              {(ms.status === 'REVIEW' || ms.status === 'in_review') && (
                                <>
                                  <button
                                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-success hover:bg-parchment-100"
                                    onClick={() => { setActiveMenu(null); handleApprove(ms.id); }}
                                    disabled={actionLoading === ms.id}
                                  >
                                    {actionLoading === ms.id ? (
                                      <SpinnerGap className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <CheckCircle weight="fill" className="h-4 w-4" />
                                    )}
                                    Approve
                                  </button>
                                  <button
                                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-error hover:bg-parchment-100"
                                    onClick={() => { setActiveMenu(null); handleReject(ms.id); }}
                                    disabled={actionLoading === ms.id}
                                  >
                                    <XCircle weight="fill" className="h-4 w-4" />
                                    Reject
                                  </button>
                                </>
                              )}
                              
                              {/* Publish - for approved manuscripts */}
                              {(ms.status === 'approved' || ms.status === 'APPROVED') && (
                                <button
                                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-success hover:bg-parchment-100"
                                  onClick={() => { setActiveMenu(null); handlePublish(ms.id); }}
                                  disabled={actionLoading === ms.id}
                                >
                                  {actionLoading === ms.id ? (
                                    <SpinnerGap className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <CheckCircle weight="fill" className="h-4 w-4" />
                                  )}
                                  Publish
                                </button>
                              )}
                              
                              {/* Unpublish - for published manuscripts */}
                              {(ms.status === 'published' || ms.status === 'PUBLISHED') && (
                                <button
                                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-error hover:bg-parchment-100"
                                  onClick={() => { setActiveMenu(null); handleUnpublish(ms.id); }}
                                  disabled={actionLoading === ms.id}
                                >
                                  {actionLoading === ms.id ? (
                                    <SpinnerGap className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Prohibit weight="fill" className="h-4 w-4" />
                                  )}
                                  Unpublish
                                </button>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-parchment-200 flex items-center justify-between">
          <p className="text-sm text-ink-500">
            Showing {filteredManuscripts.length} manuscripts
          </p>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded border border-parchment-200 hover:bg-parchment-100 disabled:opacity-50">
              <CaretLeft weight="bold" className="h-4 w-4" />
            </button>
            <span className="text-sm text-ink-600">Page 1</span>
            <button className="p-2 rounded border border-parchment-200 hover:bg-parchment-100">
              <CaretRight weight="bold" className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
