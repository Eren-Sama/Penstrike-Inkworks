'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SquaresFour,
  BookOpen,
  FileText,
  ChartBar,
  CurrencyDollar,
  List,
  X,
  Sparkle,
  House,
  User,
  type Icon
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

const navigation: { name: string; href: string; icon: Icon }[] = [
  { name: 'Dashboard', href: '/author', icon: SquaresFour },
  { name: 'Manuscripts', href: '/author/manuscripts', icon: FileText },
  { name: 'My Books', href: '/author/books', icon: BookOpen },
  { name: 'Analytics', href: '/author/analytics', icon: ChartBar },
  { name: 'Royalties', href: '/author/royalties', icon: CurrencyDollar },
  { name: 'AI Studio', href: '/author/ai-studio', icon: Sparkle },
  { name: 'Profile', href: '/author/profile', icon: User },
];

export default function AuthorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-parchment-50 -mt-16 lg:-mt-20">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-ink-900/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - starts below main navbar */}
      <aside className={cn(
        'fixed top-16 lg:top-20 left-0 bottom-0 w-64 bg-ink-900 z-40 transform transition-transform duration-300 lg:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-ink-800">
          <Link href="/author" className="flex items-center gap-2">
            <span className="text-accent-yellow font-serif text-xl font-bold">Penstrike</span>
          </Link>
          <button 
            className="lg:hidden text-parchment-400 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X weight="bold" className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/author' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                  isActive
                    ? 'bg-accent-yellow/10 text-accent-yellow'
                    : 'text-parchment-400 hover:bg-ink-800 hover:text-white'
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon weight="duotone" className="h-5 w-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Back to Bookstore link at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-ink-800">
          <Link
            href="/bookstore"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-parchment-400 hover:bg-ink-800 hover:text-white transition-colors"
          >
            <House weight="duotone" className="h-5 w-5" />
            <span className="font-medium">Back to Bookstore</span>
          </Link>
        </div>
      </aside>

      {/* Main content area */}
      <div className="lg:pl-64 pt-16 lg:pt-20">
        {/* Mobile menu button - only visible on mobile */}
        <div className="lg:hidden sticky top-16 z-30 bg-white border-b border-parchment-200">
          <div className="flex items-center h-12 px-4">
            <button
              className="p-2 text-ink-600 hover:text-ink-900"
              onClick={() => setSidebarOpen(true)}
            >
              <List weight="bold" className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Page content */}
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
