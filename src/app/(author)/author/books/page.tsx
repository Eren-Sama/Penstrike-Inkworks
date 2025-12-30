'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  MagnifyingGlass,
  Funnel,
  Star,
  CurrencyDollar,
  TrendUp,
  Clock,
  CheckCircle,
  WarningCircle,
  Eye,
  Archive,
  SpinnerGap
} from '@phosphor-icons/react';
import { cn, formatCurrency } from '@/lib/utils';
import { getMyBooks, type MyBook } from '@/lib/data';

const statusConfig: Record<string, { color: string; icon: typeof Clock; label: string }> = {
  DRAFT: { color: 'bg-ink-200 text-ink-700', icon: Clock, label: 'Draft' },
  IN_REVIEW: { color: 'bg-blue-100 text-blue-700', icon: WarningCircle, label: 'In Review' },
  PUBLISHED: { color: 'bg-success/20 text-success', icon: CheckCircle, label: 'Published' },
  ARCHIVED: { color: 'bg-parchment-200 text-parchment-700', icon: Archive, label: 'Archived' },
};

const formatBadgeColors: Record<string, string> = {
  EBOOK: 'bg-blue-100 text-blue-700',
  PAPERBACK: 'bg-amber-100 text-amber-700',
  HARDCOVER: 'bg-rose-100 text-rose-700',
  AUDIOBOOK: 'bg-purple-100 text-purple-700',
};

export default function MyBooksPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [books, setBooks] = useState<MyBook[]>([]);
  const [loading, setLoading] = useState(true);

  // Load books from data layer
  const loadBooks = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getMyBooks();
      setBooks(data);
    } catch (error) {
      console.error('Failed to load books:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.genre.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || book.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate summary stats
  const totalBooks = books.length;
  const publishedBooks = books.filter(b => b.status === 'PUBLISHED').length;
  const totalSales = books.reduce((sum, b) => sum + b.totalSales, 0);
  const totalRevenue = books.reduce((sum, b) => sum + b.totalRevenue, 0);

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
      <div>
        <h1 className="font-serif text-2xl font-bold text-ink-900">My Books</h1>
        <p className="text-ink-600">View and manage your published books.</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent-yellow/10">
              <BookOpen weight="duotone" className="h-5 w-5 text-accent-yellow" />
            </div>
            <div>
              <p className="text-sm text-ink-500">Total Books</p>
              <p className="text-xl font-bold text-ink-900">{totalBooks}</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <CheckCircle weight="duotone" className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-ink-500">Published</p>
              <p className="text-xl font-bold text-ink-900">{publishedBooks}</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100">
              <TrendUp weight="duotone" className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-ink-500">Total Sales</p>
              <p className="text-xl font-bold text-ink-900">{totalSales.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-100">
              <CurrencyDollar weight="duotone" className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-ink-500">Total Revenue</p>
              <p className="text-xl font-bold text-ink-900">{formatCurrency(totalRevenue)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
            <input
              type="text"
              placeholder="Search books..."
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
              <option value="IN_REVIEW">In Review</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Books List */}
      {filteredBooks.length === 0 ? (
        <div className="card p-12 text-center">
          <BookOpen weight="duotone" className="h-16 w-16 text-parchment-300 mx-auto mb-4" />
          <h2 className="font-serif text-xl font-semibold text-ink-900 mb-2">
            No books found
          </h2>
          <p className="text-ink-600 mb-6">
            {searchQuery || statusFilter !== 'all' 
              ? 'Try adjusting your filters.' 
              : 'You haven\'t published any books yet. Start by creating a manuscript!'}
          </p>
          {!searchQuery && statusFilter === 'all' && (
            <Link 
              href="/author/manuscripts/new"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-accent-yellow text-ink-900 font-medium rounded-lg hover:bg-accent-warm transition-colors"
            >
              <BookOpen weight="bold" className="h-4 w-4" />
              Create Manuscript
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBooks.map((book) => {
            const status = statusConfig[book.status];
            const StatusIcon = status?.icon || Clock;
            
            return (
              <div 
                key={book.id} 
                className="card p-6 hover:border-ink-300 transition-colors"
              >
                <div className="flex gap-6">
                  {/* Book Cover */}
                  <div className={cn(
                    'w-24 h-36 rounded-lg flex-shrink-0 flex items-center justify-center bg-gradient-to-br',
                    book.coverColor
                  )}>
                    {book.coverImage ? (
                      <img 
                        src={book.coverImage} 
                        alt={book.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <BookOpen weight="duotone" className="h-10 w-10 text-white/50" />
                    )}
                  </div>

                  {/* Book Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-serif text-lg font-semibold text-ink-900 truncate">
                            {book.title}
                          </h3>
                          <span className={cn(
                            'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium flex-shrink-0',
                            status?.color
                          )}>
                            <StatusIcon className="h-3 w-3" />
                            {status?.label}
                          </span>
                        </div>
                        <p className="text-sm text-ink-500">{book.genre}</p>
                      </div>
                      
                      {/* View Button */}
                      {book.status === 'PUBLISHED' && (
                        <Link
                          href={`/bookstore/${book.id}`}
                          className="flex items-center gap-2 px-3 py-1.5 text-sm text-ink-600 hover:text-ink-900 hover:bg-parchment-100 rounded-lg transition-colors"
                        >
                          <Eye weight="bold" className="h-4 w-4" />
                          View in Store
                        </Link>
                      )}
                    </div>

                    <p className="text-ink-600 mb-4 line-clamp-2 text-sm">{book.description}</p>

                    {/* Formats */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {book.formats.map((format) => (
                        <span
                          key={format}
                          className={cn(
                            'px-2 py-0.5 rounded text-xs font-medium',
                            formatBadgeColors[format]
                          )}
                        >
                          {format.charAt(0) + format.slice(1).toLowerCase()}
                        </span>
                      ))}
                    </div>

                    {/* Stats Row */}
                    <div className="flex flex-wrap items-center gap-6 text-sm">
                      {book.status === 'PUBLISHED' && (
                        <>
                          <div className="flex items-center gap-1.5">
                            <CurrencyDollar weight="duotone" className="h-4 w-4 text-ink-400" />
                            <span className="text-ink-700 font-medium">{formatCurrency(book.price)}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <TrendUp weight="duotone" className="h-4 w-4 text-ink-400" />
                            <span className="text-ink-600">{book.totalSales.toLocaleString()} sales</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Star weight="fill" className="h-4 w-4 text-accent-yellow" />
                            <span className="text-ink-700 font-medium">{book.rating > 0 ? book.rating.toFixed(1) : '–'}</span>
                            <span className="text-ink-500">({book.reviewCount} reviews)</span>
                          </div>
                          {book.publishedDate && (
                            <span className="text-ink-500">
                              Published {new Date(book.publishedDate).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric', 
                                year: 'numeric' 
                              })}
                            </span>
                          )}
                        </>
                      )}
                      {book.status !== 'PUBLISHED' && book.price > 0 && (
                        <div className="flex items-center gap-1.5">
                          <CurrencyDollar weight="duotone" className="h-4 w-4 text-ink-400" />
                          <span className="text-ink-600">Planned price: {formatCurrency(book.price)}</span>
                        </div>
                      )}
                    </div>
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
