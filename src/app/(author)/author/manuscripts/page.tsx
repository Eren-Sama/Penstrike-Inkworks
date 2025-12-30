'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Plus,
  MagnifyingGlass,
  Funnel,
  FileText,
  Clock,
  CheckCircle,
  WarningCircle,
  DotsThreeVertical,
  PencilSimple,
  Trash,
  Eye,
  UploadSimple,
  SpinnerGap
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { Button, Input } from '@/components/ui';
import { getAuthorManuscripts, type AuthorManuscript } from '@/lib/data';

const statusConfig: Record<string, { color: string; icon: typeof Clock; label: string }> = {
  DRAFT: { color: 'bg-ink-200 text-ink-700', icon: Clock, label: 'Draft' },
  EDITING: { color: 'bg-accent-yellow/20 text-accent-warm', icon: PencilSimple, label: 'Editing' },
  REVIEW: { color: 'bg-blue-100 text-blue-700', icon: WarningCircle, label: 'In Review' },
  APPROVED: { color: 'bg-success/20 text-success', icon: CheckCircle, label: 'Approved' },
  PUBLISHED: { color: 'bg-success/20 text-success', icon: CheckCircle, label: 'Published' },
  REJECTED: { color: 'bg-error/20 text-error', icon: WarningCircle, label: 'Rejected' },
};

export default function ManuscriptsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [manuscripts, setManuscripts] = useState<AuthorManuscript[]>([]);
  const [loading, setLoading] = useState(true);

  // Load manuscripts from data layer
  const loadManuscripts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAuthorManuscripts();
      setManuscripts(data);
    } catch (error) {
      console.error('Failed to load manuscripts:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadManuscripts();
  }, [loadManuscripts]);

  const filteredManuscripts = manuscripts.filter(ms => {
    const matchesSearch = ms.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ms.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ms.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
          <p className="text-ink-600">Manage your manuscripts and track their progress.</p>
        </div>
        <Link href="/author/manuscripts/new">
          <Button variant="primary">
            <Plus weight="bold" className="mr-2 h-4 w-4" />
            New Manuscript
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
            <input
              type="text"
              placeholder="Search manuscripts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10 w-full"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Funnel className="h-4 w-4 text-ink-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input py-2"
            >
              <option value="all">All Status</option>
              <option value="DRAFT">Draft</option>
              <option value="EDITING">Editing</option>
              <option value="REVIEW">In Review</option>
              <option value="APPROVED">Approved</option>
              <option value="PUBLISHED">Published</option>
            </select>
          </div>
        </div>
      </div>

      {/* Manuscripts List */}
      {filteredManuscripts.length === 0 ? (
        <div className="card p-12 text-center">
          <FileText weight="duotone" className="h-16 w-16 text-parchment-300 mx-auto mb-4" />
          <h2 className="font-serif text-xl font-semibold text-ink-900 mb-2">
            No manuscripts found
          </h2>
          <p className="text-ink-600 mb-6">
            {searchQuery || statusFilter !== 'all' 
              ? 'Try adjusting your filters.' 
              : 'Start your writing journey by creating your first manuscript.'}
          </p>
          <Link href="/author/manuscripts/new">
            <Button variant="primary">
              <UploadSimple weight="bold" className="mr-2 h-4 w-4" />
              Upload Manuscript
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredManuscripts.map((ms) => {
            const status = statusConfig[ms.status];
            const StatusIcon = status?.icon || Clock;
            
            return (
              <div 
                key={ms.id} 
                className="card p-6 hover:border-ink-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Main Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <Link 
                        href={`/author/manuscripts/${ms.id}`}
                        className="font-serif text-lg font-semibold text-ink-900 hover:text-accent-warm"
                      >
                        {ms.title}
                      </Link>
                      <span className={cn(
                        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium',
                        status?.color
                      )}>
                        <StatusIcon className="h-3 w-3" />
                        {status?.label}
                      </span>
                    </div>
                    <p className="text-ink-600 mb-4 line-clamp-2">{ms.description}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-ink-500">
                      <span>{ms.wordCount.toLocaleString()} words</span>
                      <span>•</span>
                      <span>{ms.genre.join(', ')}</span>
                      <span>•</span>
                      <span>{ms.versions} version{ms.versions !== 1 ? 's' : ''}</span>
                      <span>•</span>
                      <span>Updated {new Date(ms.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="relative">
                    <button
                      onClick={() => setActiveMenu(activeMenu === ms.id ? null : ms.id)}
                      className="p-2 hover:bg-parchment-100 rounded-lg transition-colors"
                    >
                      <DotsThreeVertical weight="bold" className="h-5 w-5 text-ink-500" />
                    </button>

                    {activeMenu === ms.id && (
                      <>
                        <div 
                          className="fixed inset-0 z-10"
                          onClick={() => setActiveMenu(null)}
                        />
                        <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-parchment-200 z-20">
                          <Link
                            href={`/author/manuscripts/${ms.id}`}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-ink-700 hover:bg-parchment-100"
                            onClick={() => setActiveMenu(null)}
                          >
                            <PencilSimple weight="duotone" className="h-4 w-4" />
                            Edit Manuscript
                          </Link>
                          <Link
                            href={`/author/manuscripts/${ms.id}/preview`}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-ink-700 hover:bg-parchment-100"
                            onClick={() => setActiveMenu(null)}
                          >
                            <Eye weight="bold" className="h-4 w-4" />
                            Preview
                          </Link>
                          {ms.status === 'APPROVED' && (
                            <Link
                              href={`/author/manuscripts/${ms.id}/publish`}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-accent-warm hover:bg-parchment-100"
                              onClick={() => setActiveMenu(null)}
                            >
                              <CheckCircle weight="fill" className="h-4 w-4" />
                              Publish Book
                            </Link>
                          )}
                          <button
                            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-error hover:bg-parchment-100"
                            onClick={() => {
                              setActiveMenu(null);
                              // Delete logic would go here
                            }}
                          >
                            <Trash weight="duotone" className="h-4 w-4" />
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
