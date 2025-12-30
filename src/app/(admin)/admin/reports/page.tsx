'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  MagnifyingGlass,
  Funnel,
  Warning,
  Eye,
  CheckCircle,
  XCircle,
  Flag,
  Chat,
  CaretLeft,
  CaretRight,
  Shield,
  Users,
  BookmarkSimple
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';

const reports = [
  { id: 1, type: 'content', item: 'The Dark Secrets', reporter: 'user@example.com', reason: 'Inappropriate content', status: 'pending', date: '2024-12-19' },
  { id: 2, type: 'author', item: 'J. Blackwood', reporter: 'reader@example.com', reason: 'Spam behavior', status: 'pending', date: '2024-12-19' },
  { id: 3, type: 'review', item: 'Review on "Rising Dawn"', reporter: 'author@example.com', reason: 'Fake review', status: 'resolved', date: '2024-12-18' },
  { id: 4, type: 'content', item: 'Hidden Truths', reporter: 'user2@example.com', reason: 'Copyright violation', status: 'pending', date: '2024-12-18' },
  { id: 5, type: 'author', item: 'Anonymous Writer', reporter: 'admin@example.com', reason: 'Multiple accounts', status: 'resolved', date: '2024-12-17' },
  { id: 6, type: 'content', item: 'Forbidden Tales', reporter: 'reader3@example.com', reason: 'Misleading description', status: 'dismissed', date: '2024-12-16' },
];

const typeConfig: Record<string, { bg: string; text: string; icon: typeof Flag }> = {
  content: { bg: 'bg-rose-100', text: 'text-rose-700', icon: BookmarkSimple },
  author: { bg: 'bg-purple-100', text: 'text-purple-700', icon: Users },
  review: { bg: 'bg-blue-100', text: 'text-blue-700', icon: Chat },
};

const statusConfig: Record<string, { bg: string; text: string }> = {
  pending: { bg: 'bg-amber-100', text: 'text-amber-700' },
  resolved: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  dismissed: { bg: 'bg-gray-100', text: 'text-gray-700' },
};

export default function AdminReportsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.reason.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || report.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const pendingCount = reports.filter(r => r.status === 'pending').length;

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-ink-900">Reports & Moderation</h1>
          <p className="text-ink-600 mt-1">Review and manage reported content</p>
        </div>
        {pendingCount > 0 && (
          <span className="px-4 py-2 rounded-full bg-rose-100 text-rose-700 text-sm font-semibold inline-flex items-center gap-2">
            <Warning className="h-4 w-4" />
            {pendingCount} Pending Review
          </span>
        )}
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Reports', value: reports.length, icon: Flag, color: 'from-rose-500 to-pink-600' },
          { label: 'Pending', value: pendingCount, icon: Warning, color: 'from-amber-500 to-orange-600' },
          { label: 'Resolved', value: reports.filter(r => r.status === 'resolved').length, icon: CheckCircle, color: 'from-emerald-500 to-teal-600' },
          { label: 'Dismissed', value: reports.filter(r => r.status === 'dismissed').length, icon: XCircle, color: 'from-gray-500 to-slate-600' },
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
            placeholder="Search reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-12 w-full"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="select w-full sm:w-40"
        >
          <option value="all">All Types</option>
          <option value="content">Content</option>
          <option value="author">Author</option>
          <option value="review">Review</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="select w-full sm:w-40"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="resolved">Resolved</option>
          <option value="dismissed">Dismissed</option>
        </select>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.map((report, index) => {
          const type = typeConfig[report.type];
          const status = statusConfig[report.status];
          const TypeIcon = type.icon;
          return (
            <div
              key={report.id}
              className="rounded-2xl bg-white border border-parchment-200 shadow-card p-6 hover:shadow-elegant transition-all duration-300 animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', type.bg)}>
                  <TypeIcon className={cn('h-6 w-6', type.text)} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-ink-900">{report.item}</h3>
                      <p className="text-sm text-ink-600 mt-1">{report.reason}</p>
                      <p className="text-xs text-ink-500 mt-2">Reported by: {report.reporter} • {report.date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        'px-3 py-1 rounded-full text-xs font-semibold capitalize',
                        type.bg, type.text
                      )}>
                        {report.type}
                      </span>
                      <span className={cn(
                        'px-3 py-1 rounded-full text-xs font-semibold capitalize',
                        status.bg, status.text
                      )}>
                        {report.status}
                      </span>
                    </div>
                  </div>
                </div>

                {report.status === 'pending' && (
                  <div className="flex items-center gap-2 lg:ml-auto">
                    <button className="p-2 rounded-lg text-ink-500 hover:bg-parchment-100 transition-colors" title="View Details">
                      <Eye className="h-5 w-5" />
                    </button>
                    <button className="p-2 rounded-lg text-emerald-600 hover:bg-emerald-100 transition-colors" title="Resolve">
                      <CheckCircle className="h-5 w-5" />
                    </button>
                    <button className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors" title="Dismiss">
                      <XCircle className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2">
        <button className="p-2 rounded-lg border border-parchment-200 text-ink-500 hover:bg-parchment-50 transition-colors">
          <CaretLeft weight="bold" className="h-4 w-4" />
        </button>
        <button className="px-3 py-1 rounded-lg bg-ink-900 text-white text-sm font-medium">1</button>
        <button className="p-2 rounded-lg border border-parchment-200 text-ink-500 hover:bg-parchment-50 transition-colors">
          <CaretRight weight="bold" className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
