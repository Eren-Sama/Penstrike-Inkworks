'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  BookmarkSimple,
  Trash,
  BookOpen,
  Star,
  Eye,
  SpinnerGap,
  MagnifyingGlass,
  SortAscending,
  GridFour,
  Rows,
  Clock,
  Calendar,
  FolderOpen,
  Plus,
  Check,
  Tag,
  DotsThree,
  PencilSimple,
  FolderSimplePlus,
  X
} from '@phosphor-icons/react';
import { cn, formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui';
import { useAuth } from '@/lib/auth/AuthContext';
import { toast } from 'sonner';
import {
  getBookmarkItems,
  getBookmarkFolders,
  removeBookmark,
  updateBookmark,
  type BookmarkItem,
  type BookmarkFolder
} from '@/lib/data';

type SortOption = 'added-desc' | 'added-asc' | 'title-asc' | 'title-desc' | 'rating-desc';

const folderColors: Record<string, { bg: string; text: string; border: string }> = {
  amber: { bg: 'bg-amber-100', text: 'text-amber-600', border: 'border-amber-200' },
  blue: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' },
  green: { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-200' },
  red: { bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-200' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200' },
};

export default function BookmarksPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [folders, setFolders] = useState<BookmarkFolder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('added-desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  // Load bookmarks and folders from data layer
  const loadBookmarks = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const [bookmarkItems, bookmarkFolders] = await Promise.all([
        getBookmarkItems(),
        getBookmarkFolders()
      ]);
      setBookmarks(bookmarkItems);
      setFolders(bookmarkFolders);
    } catch (error) {
      console.error('Failed to load bookmarks:', error);
      toast.error('Failed to load bookmarks');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Load bookmarks when user is available
  useEffect(() => {
    if (user && !authLoading) {
      loadBookmarks();
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [user, authLoading, loadBookmarks]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/bookmarks');
    }
  }, [user, authLoading, router]);

  const filteredBookmarks = bookmarks
    .filter((item) => {
      const matchesFolder = selectedFolder === 'all' || item.category === selectedFolder;
      const matchesSearch = 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.author.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFolder && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'added-desc':
          return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
        case 'added-asc':
          return new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime();
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'title-desc':
          return b.title.localeCompare(a.title);
        case 'rating-desc':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

  const handleRemove = async (id: string) => {
    try {
      await removeBookmark(id);
      setBookmarks(prev => prev.filter(item => item.id !== id));
      toast.success('Bookmark removed');
    } catch (error) {
      console.error('Failed to remove bookmark:', error);
      toast.error('Failed to remove bookmark');
    }
  };

  const handleMoveToFolder = async (bookmarkId: string, folderId: string) => {
    try {
      await updateBookmark(bookmarkId, { folder: folderId });
      setBookmarks(prev => prev.map(item => 
        item.id === bookmarkId ? { ...item, category: folderId } : item
      ));
      const folder = folders.find(f => f.id === folderId);
      toast.success(`Moved to ${folder?.name}`);
    } catch (error) {
      console.error('Failed to move bookmark:', error);
      toast.error('Failed to move bookmark');
    }
  };

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
    
    const colors = ['amber', 'blue', 'green', 'red', 'purple'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    const newFolder: BookmarkFolder = {
      id: newFolderName.toLowerCase().replace(/\s+/g, '-'),
      name: newFolderName,
      color: randomColor,
      count: 0,
    };
    
    setFolders(prev => [...prev, newFolder]);
    setNewFolderName('');
    setShowNewFolderModal(false);
    toast.success('Folder created');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getFormatBadge = (format: string) => {
    const formats: Record<string, { bg: string; text: string }> = {
      ebook: { bg: 'bg-blue-100', text: 'text-blue-700' },
      paperback: { bg: 'bg-amber-100', text: 'text-amber-700' },
      hardcover: { bg: 'bg-purple-100', text: 'text-purple-700' },
      audiobook: { bg: 'bg-green-100', text: 'text-green-700' },
    };
    return formats[format] || formats.ebook;
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-parchment-50 to-cream-100 flex items-center justify-center">
        <SpinnerGap weight="bold" className="h-8 w-8 animate-spin text-accent-yellow" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-parchment-50 to-cream-100 py-24">
      <div className="container-editorial max-w-7xl mx-auto px-4 sm:px-6">
        <div className={`transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-amber-100">
                <BookmarkSimple weight="duotone" className="h-8 w-8 text-amber-600" />
              </div>
              <div>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-ink-900">My Bookmarks</h1>
                <p className="text-ink-600 text-sm sm:text-base">{bookmarks.length} saved books • {folders.length - 1} folders</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar - Folders */}
            <div className="lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-2xl border border-parchment-200 shadow-card p-4 sticky top-24">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-ink-900">Folders</h3>
                  <button
                    onClick={() => setShowNewFolderModal(true)}
                    className="p-1.5 rounded-lg hover:bg-parchment-100 text-ink-500 hover:text-ink-700 transition-colors"
                  >
                    <Plus weight="bold" className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="space-y-1">
                  {folders.map((folder) => {
                    const colors = folderColors[folder.color] || folderColors.amber;
                    const count = folder.id === 'all' 
                      ? bookmarks.length 
                      : bookmarks.filter(b => b.category === folder.id).length;
                    
                    return (
                      <button
                        key={folder.id}
                        onClick={() => setSelectedFolder(folder.id)}
                        className={cn(
                          'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all',
                          selectedFolder === folder.id
                            ? `${colors.bg} ${colors.text}`
                            : 'text-ink-600 hover:bg-parchment-100'
                        )}
                      >
                        <FolderOpen 
                          weight={selectedFolder === folder.id ? 'duotone' : 'regular'}
                          className="h-5 w-5 flex-shrink-0" 
                        />
                        <span className="flex-1 font-medium text-sm truncate">{folder.name}</span>
                        <span className={cn(
                          'text-xs px-2 py-0.5 rounded-full',
                          selectedFolder === folder.id
                            ? 'bg-white/50'
                            : 'bg-parchment-100'
                        )}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Filters & Sort */}
              <div className="bg-white rounded-2xl border border-parchment-200 shadow-card p-4 mb-6">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex-1 min-w-[200px] relative">
                    <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-ink-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search bookmarks..."
                      className="input w-full pl-10"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <SortAscending weight="bold" className="h-4 w-4 text-ink-400" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortOption)}
                      className="input pr-8 text-sm"
                    >
                      <option value="added-desc">Recently Added</option>
                      <option value="added-asc">Oldest First</option>
                      <option value="title-asc">Title: A-Z</option>
                      <option value="title-desc">Title: Z-A</option>
                      <option value="rating-desc">Highest Rated</option>
                    </select>
                  </div>
                  
                  <div className="flex border border-parchment-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={cn(
                        'p-2 transition-colors',
                        viewMode === 'grid' ? 'bg-ink-900 text-white' : 'bg-white text-ink-600 hover:bg-parchment-100'
                      )}
                    >
                      <GridFour weight="bold" className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={cn(
                        'p-2 transition-colors',
                        viewMode === 'list' ? 'bg-ink-900 text-white' : 'bg-white text-ink-600 hover:bg-parchment-100'
                      )}
                    >
                      <Rows weight="bold" className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Empty State */}
              {bookmarks.length === 0 ? (
                <div className="bg-white rounded-2xl border border-parchment-200 shadow-card p-12 text-center">
                  <BookmarkSimple weight="duotone" className="h-16 w-16 text-parchment-300 mx-auto mb-4" />
                  <h2 className="font-serif text-xl font-bold text-ink-900 mb-2">No bookmarks yet</h2>
                  <p className="text-ink-600 mb-6">Start saving books to read later</p>
                  <Link href="/bookstore">
                    <Button className="btn-accent">
                      <BookOpen weight="duotone" className="h-4 w-4" />
                      Browse Books
                    </Button>
                  </Link>
                </div>
              ) : filteredBookmarks.length === 0 ? (
                <div className="bg-white rounded-2xl border border-parchment-200 shadow-card p-12 text-center">
                  <MagnifyingGlass weight="duotone" className="h-16 w-16 text-parchment-300 mx-auto mb-4" />
                  <h2 className="font-serif text-xl font-bold text-ink-900 mb-2">No matches found</h2>
                  <p className="text-ink-600">Try a different search term or folder</p>
                </div>
              ) : viewMode === 'grid' ? (
                /* Grid View */
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filteredBookmarks.map((item, index) => (
                    <div 
                      key={item.id}
                      className="group bg-white rounded-2xl border border-parchment-200 shadow-card overflow-hidden hover:shadow-lg hover:border-parchment-300 transition-all"
                      style={{
                        opacity: mounted ? 1 : 0,
                        transform: mounted ? 'translateY(0)' : 'translateY(8px)',
                        transition: `all 0.3s ease ${index * 50}ms`
                      }}
                    >
                      {/* Book Cover */}
                      <div className="aspect-[3/2] bg-gradient-to-br from-parchment-100 to-parchment-200 relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <BookOpen weight="duotone" className="h-12 w-12 text-parchment-400" />
                        </div>
                        
                        {/* Reading Progress */}
                        {item.readingProgress && (
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-parchment-300">
                            <div 
                              className="h-full bg-green-500 transition-all"
                              style={{ width: `${item.readingProgress}%` }}
                            />
                          </div>
                        )}
                        
                        {/* Hover Actions */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                          <button 
                            onClick={() => handleRemove(item.id)}
                            className="p-2.5 bg-white rounded-full shadow-lg hover:scale-110 transition-transform"
                          >
                            <Trash weight="bold" className="h-5 w-5 text-red-500" />
                          </button>
                          <Link 
                            href={`/book/${item.id}`}
                            className="p-2.5 bg-white rounded-full shadow-lg hover:scale-110 transition-transform"
                          >
                            <Eye weight="bold" className="h-5 w-5 text-ink-700" />
                          </Link>
                        </div>
                        
                        {/* Format Badge */}
                        <div className={cn(
                          'absolute top-3 right-3 px-2 py-1 text-xs font-medium rounded-lg capitalize',
                          getFormatBadge(item.format).bg,
                          getFormatBadge(item.format).text
                        )}>
                          {item.format}
                        </div>
                      </div>
                      
                      {/* Book Info */}
                      <div className="p-4">
                        <div className="flex items-center gap-2 text-xs text-ink-400 mb-2">
                          <Clock weight="bold" className="h-3.5 w-3.5" />
                          <span>{formatDate(item.addedAt)}</span>
                          {item.readingProgress && (
                            <>
                              <span>•</span>
                              <span className="text-green-600 font-medium">{item.readingProgress}% read</span>
                            </>
                          )}
                        </div>
                        
                        <h3 className="font-semibold text-ink-900 line-clamp-1 group-hover:text-accent-amber transition-colors mb-1">
                          {item.title}
                        </h3>
                        <Link href={`/authors/${item.authorId}`} className="text-sm text-ink-600 hover:text-accent-amber block mb-3">
                          by {item.author}
                        </Link>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <Star weight="fill" className="h-4 w-4 text-accent-yellow" />
                            <span className="text-sm font-medium text-ink-900">{item.rating}</span>
                            <span className="text-xs text-ink-400">({item.reviewCount})</span>
                          </div>
                          <span className="font-bold text-ink-900">{formatCurrency(item.price)}</span>
                        </div>
                        
                        {item.notes && (
                          <div className="mt-3 p-2.5 bg-parchment-50 rounded-lg border border-parchment-200">
                            <p className="text-xs text-ink-600 line-clamp-2 italic">"{item.notes}"</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* List View */
                <div className="space-y-3">
                  {filteredBookmarks.map((item, index) => (
                    <div 
                      key={item.id}
                      className="group bg-white rounded-2xl border border-parchment-200 shadow-card overflow-hidden hover:shadow-lg hover:border-parchment-300 transition-all p-4 flex gap-4"
                      style={{
                        opacity: mounted ? 1 : 0,
                        transform: mounted ? 'translateY(0)' : 'translateY(8px)',
                        transition: `all 0.3s ease ${index * 30}ms`
                      }}
                    >
                      {/* Book Cover */}
                      <div className="w-20 h-28 bg-gradient-to-br from-parchment-100 to-parchment-200 rounded-lg flex-shrink-0 flex items-center justify-center relative overflow-hidden">
                        <BookOpen weight="duotone" className="h-8 w-8 text-parchment-400" />
                        {item.readingProgress && (
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-parchment-300">
                            <div 
                              className="h-full bg-green-500"
                              style={{ width: `${item.readingProgress}%` }}
                            />
                          </div>
                        )}
                      </div>
                      
                      {/* Book Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <h3 className="font-semibold text-ink-900 truncate group-hover:text-accent-amber transition-colors">
                              {item.title}
                            </h3>
                            <Link href={`/authors/${item.authorId}`} className="text-sm text-ink-600 hover:text-accent-amber">
                              by {item.author}
                            </Link>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <button 
                              onClick={() => handleRemove(item.id)}
                              className="p-2 rounded-lg text-ink-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                            >
                              <Trash weight="bold" className="h-4 w-4" />
                            </button>
                            <Link 
                              href={`/book/${item.id}`}
                              className="p-2 rounded-lg text-ink-400 hover:text-ink-700 hover:bg-parchment-100 transition-colors"
                            >
                              <Eye weight="bold" className="h-4 w-4" />
                            </Link>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-sm">
                          <div className="flex items-center gap-1">
                            <Star weight="fill" className="h-4 w-4 text-accent-yellow" />
                            <span className="font-medium text-ink-900">{item.rating}</span>
                          </div>
                          <span className="font-bold text-ink-900">{formatCurrency(item.price)}</span>
                          <span className={cn(
                            'px-2 py-0.5 text-xs font-medium rounded-md capitalize',
                            getFormatBadge(item.format).bg,
                            getFormatBadge(item.format).text
                          )}>
                            {item.format}
                          </span>
                          {item.readingProgress && (
                            <span className="text-xs text-green-600 font-medium">{item.readingProgress}% read</span>
                          )}
                        </div>
                        
                        {item.notes && (
                          <p className="text-xs text-ink-500 mt-2 italic line-clamp-1">"{item.notes}"</p>
                        )}
                        
                        <div className="flex items-center gap-2 mt-2 text-xs text-ink-400">
                          <Calendar weight="bold" className="h-3.5 w-3.5" />
                          <span>Added {formatDate(item.addedAt)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* New Folder Modal */}
      {showNewFolderModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-xl font-bold text-ink-900">Create New Folder</h3>
              <button
                onClick={() => setShowNewFolderModal(false)}
                className="p-2 rounded-lg hover:bg-parchment-100 text-ink-500"
              >
                <X weight="bold" className="h-5 w-5" />
              </button>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-ink-700 mb-2">Folder Name</label>
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="e.g., Summer Reading"
                className="input w-full"
                autoFocus
              />
            </div>
            
            <div className="flex gap-3">
              <Button
                onClick={() => setShowNewFolderModal(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateFolder}
                disabled={!newFolderName.trim()}
                className="btn-accent flex-1"
              >
                <FolderSimplePlus weight="bold" className="h-4 w-4" />
                Create Folder
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
