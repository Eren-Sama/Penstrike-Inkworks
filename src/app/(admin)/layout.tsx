'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SquaresFour,
  Users,
  BookOpen,
  FileText,
  ChartBar,
  Gear,
  Shield,
  Bell,
  SignOut,
  List,
  X,
  CaretDown,
  CurrencyDollar,
  Flag,
  type Icon
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { useAuth } from '@/lib/auth/AuthContext';
import { isUsingMockData } from '@/lib/env';

const navigation: { name: string; href: string; icon: Icon }[] = [
  { name: 'Dashboard', href: '/admin', icon: SquaresFour },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Authors', href: '/admin/authors', icon: Shield },
  { name: 'Manuscripts', href: '/admin/manuscripts', icon: FileText },
  { name: 'Books', href: '/admin/books', icon: BookOpen },
  { name: 'Orders', href: '/admin/orders', icon: CurrencyDollar },
  { name: 'Reports', href: '/admin/reports', icon: Flag },
  { name: 'Analytics', href: '/admin/analytics', icon: ChartBar },
  { name: 'Settings', href: '/admin/settings', icon: Gear },
];

// Mock admin data (used in mock mode only)
const mockAdmin = {
  name: 'Admin User',
  email: 'admin@penstrike.com',
  role: 'SUPER_ADMIN',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const isMockMode = isUsingMockData();

  // Get admin display info
  const adminInfo = isMockMode ? mockAdmin : {
    name: user?.full_name || user?.pen_name || 'Admin',
    email: user?.email || '',
    role: 'ADMIN',
  };

  return (
    <AdminGuard>
      <div className="min-h-screen bg-parchment-50">
        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-ink-900/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={cn(
          'fixed top-0 left-0 bottom-0 w-64 bg-ink-900 z-50 transform transition-transform duration-300 lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}>
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-ink-800">
            <Link href="/admin" className="flex items-center gap-2">
              <Shield weight="duotone" className="h-6 w-6 text-accent-yellow" />
              <span className="text-white font-serif text-lg font-bold">Admin Panel</span>
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
                (item.href !== '/admin' && pathname.startsWith(item.href));
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

          {/* Visit Site Link */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-ink-800">
            <Link 
              href="/"
              className="flex items-center gap-3 px-4 py-3 text-parchment-400 hover:text-white transition-colors"
            >
              <BookOpen weight="duotone" className="h-5 w-5" />
              <span className="font-medium">Visit Site</span>
            </Link>
          </div>
        </aside>

        {/* Main content area */}
        <div className="lg:pl-64">
          {/* Top header */}
          <header className="sticky top-0 z-30 bg-white border-b border-parchment-200">
            <div className="flex items-center justify-between h-16 px-4 lg:px-8">
              {/* Mobile menu button */}
              <button
                className="lg:hidden p-2 text-ink-600 hover:text-ink-900"
                onClick={() => setSidebarOpen(true)}
              >
                <List weight="bold" className="h-6 w-6" />
              </button>

              {/* Page title */}
              <div className="hidden lg:flex items-center gap-2">
                <Shield weight="duotone" className="h-5 w-5 text-ink-500" />
                <span className="text-sm font-medium text-ink-500">Super Admin</span>
              </div>

              {/* Right side */}
              <div className="flex items-center gap-4">
                {/* Notifications */}
                <button className="relative p-2 text-ink-600 hover:text-ink-900">
                  <Bell weight="duotone" className="h-5 w-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full" />
                </button>

                {/* User menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-3 p-2 hover:bg-parchment-100 rounded-lg transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-error/20 flex items-center justify-center">
                      <Shield weight="duotone" className="h-4 w-4 text-error" />
                    </div>
                    <div className="hidden sm:block text-left">
                      <p className="text-sm font-medium text-ink-900">{adminInfo.name}</p>
                      <p className="text-xs text-ink-500">{adminInfo.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin'}</p>
                    </div>
                    <CaretDown weight="bold" className="hidden sm:block h-4 w-4 text-ink-500" />
                  </button>

                  {/* Dropdown */}
                  {userMenuOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setUserMenuOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-parchment-200 z-50">
                        <div className="p-4 border-b border-parchment-200">
                          <p className="font-medium text-ink-900">{adminInfo.name}</p>
                          <p className="text-sm text-ink-500">{adminInfo.email}</p>
                        </div>
                        <div className="p-2">
                          <Link
                            href="/admin/settings"
                            className="flex items-center gap-3 px-3 py-2 text-sm text-ink-700 hover:bg-parchment-100 rounded-lg"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <Gear weight="duotone" className="h-4 w-4" />
                            Settings
                          </Link>
                        </div>
                        <div className="p-2 border-t border-parchment-200">
                          <button
                            onClick={() => {
                              setUserMenuOpen(false);
                              signOut();
                            }}
                            className="flex items-center gap-3 w-full px-3 py-2 text-sm text-error hover:bg-parchment-100 rounded-lg"
                          >
                            <SignOut weight="duotone" className="h-4 w-4" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="p-4 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </AdminGuard>
  );
}
