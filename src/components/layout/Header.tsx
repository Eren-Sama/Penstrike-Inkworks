'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  List, 
  X, 
  BookOpen, 
  CaretDown, 
  Sparkle,
  PencilLine,
  Palette,
  Headphones,
  Globe,
  FileText,
  Megaphone,
  SignOut,
  Gear,
  ChartBar,
  Heart,
  ShoppingCart,
  Wallet,
  ClockCounterClockwise,
  Star,
  User,
  BookmarkSimple,
  Shield,
  type Icon
} from '@phosphor-icons/react';
import { cn, slugify } from '@/lib/utils';
import { useAuth } from '@/lib/auth/AuthContext';

interface NavChild {
  href: string;
  label: string;
  icon: Icon;
}

interface NavLink {
  href: string;
  label: string;
  hasDropdown?: boolean;
  children?: NavChild[];
}

interface HeaderProps {
  transparent?: boolean;
}

export function Header({ transparent = false }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, signOut, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Hide header on auth pages (login/signup) and admin pages
  const isAuthPage = pathname === '/login' || pathname === '/signup';
  const isAdminPage = pathname?.startsWith('/admin');
  
  const handleSignOut = async () => {
    await signOut();
    setProfileOpen(false);
    router.push('/');
    router.refresh();
  };

  useEffect(() => {
    // Sync with page mount timing (50ms)
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setProfileOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  // Reset mobile services dropdown when menu closes
  useEffect(() => {
    if (!mobileMenuOpen) {
      setMobileServicesOpen(false);
    }
  }, [mobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-profile-menu]')) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const toggleMobileServices = useCallback(() => {
    setMobileServicesOpen(prev => !prev);
  }, []);

  // Determine if current user is an author
  const isAuthorAccount = user?.account_type === 'author' || user?.role === 'author';

  // Reader navigation (default)
  const readerNavLinks: NavLink[] = [
    { href: '/about', label: 'About' },
    {
      href: '/services',
      label: 'Services',
      hasDropdown: true,
      children: [
        { href: '/services/editing', label: 'Editing & Proofreading', icon: PencilLine },
        { href: '/services/cover-design', label: 'Cover Design', icon: Palette },
        { href: '/services/audiobooks', label: 'AI Audiobooks', icon: Headphones },
        { href: '/services/distribution', label: 'Distribution', icon: Globe },
        { href: '/services/formatting', label: 'Formatting', icon: FileText },
        { href: '/services/marketing', label: 'Marketing', icon: Megaphone },
      ],
    },
    { href: '/bookstore', label: 'Bookstore' },
    { href: '/authors', label: 'Authors' },
    { href: '/community', label: 'Community' },
    { href: '/pricing', label: 'Pricing' },
  ];

  // Author navigation (reduced, author-focused)
  const authorNavLinks: NavLink[] = [
    { href: '/about', label: 'About' },
    { href: '/author', label: 'Dashboard' },
    { href: '/author/manuscripts', label: 'My Books' },
    {
      href: '/services',
      label: 'Services',
      hasDropdown: true,
      children: [
        { href: '/services/editing', label: 'Editing & Proofreading', icon: PencilLine },
        { href: '/services/cover-design', label: 'Cover Design', icon: Palette },
        { href: '/services/audiobooks', label: 'AI Audiobooks', icon: Headphones },
        { href: '/services/distribution', label: 'Distribution', icon: Globe },
        { href: '/services/formatting', label: 'Formatting', icon: FileText },
        { href: '/services/marketing', label: 'Marketing', icon: Megaphone },
      ],
    },
    { href: '/community', label: 'Community' },
  ];

  // Admin navigation (admin-focused)
  const adminNavLinks: NavLink[] = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/users', label: 'Users' },
    { href: '/admin/authors', label: 'Authors' },
    { href: '/admin/manuscripts', label: 'Manuscripts' },
    { href: '/admin/books', label: 'Books' },
    { href: '/admin/orders', label: 'Orders' },
    { href: '/admin/analytics', label: 'Analytics' },
  ];

  // Use admin nav if admin, author nav if author, otherwise reader nav
  const navLinks: NavLink[] = isAdmin ? adminNavLinks : (isAuthorAccount ? authorNavLinks : readerNavLinks);

  // Always show visible navbar - slightly transparent when at top
  const showSolidBg = scrolled || !transparent;

  // Don't render header on auth or admin pages
  if (isAuthPage || isAdminPage) {
    return null;
  }

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50',
          'transition-all duration-500 ease-smooth',
          showSolidBg 
            ? 'bg-white border-b border-gray-200 shadow-md'
            : 'bg-white/90 backdrop-blur-lg border-b border-gray-200/50',
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
        )}
      >
        <nav className="container-editorial">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link 
              href="/" 
              className="group flex items-center gap-3 transition-transform duration-300 hover:scale-[1.02]"
            >
              <div className={cn(
                "relative p-2 rounded-xl transition-all duration-300",
                "bg-gradient-to-br from-amber-100 to-orange-100",
                "group-hover:from-amber-200 group-hover:to-orange-200",
                "group-hover:shadow-lg"
              )}>
                <BookOpen 
                  weight="duotone"
                  className="h-6 w-6 text-gray-800 transition-colors duration-300"
                />
                <Sparkle 
                  weight="fill"
                  className="absolute -top-1 -right-1 h-3 w-3 text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl font-bold tracking-tight text-gray-800">
                  Penstrike
                </span>
                <span className="text-xs font-medium tracking-widest uppercase text-gray-500">
                  Inkworks
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <div key={link.href} className="relative group">
                  {link.hasDropdown ? (
                    <button
                      className={cn(
                        "flex items-center gap-1.5 px-4 py-2.5 rounded-xl",
                        "text-sm font-medium transition-all duration-300",
                        "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      )}
                      onMouseEnter={() => setServicesOpen(true)}
                      onMouseLeave={() => setServicesOpen(false)}
                    >
                      <span>{link.label}</span>
                      <CaretDown 
                        weight="bold"
                        className={cn(
                          "h-4 w-4 transition-transform duration-300",
                          servicesOpen && "rotate-180"
                        )} 
                      />
                    </button>
                  ) : (
                    <Link
                      href={link.href}
                      className={cn(
                        "px-4 py-2.5 rounded-xl text-sm font-medium",
                        "transition-all duration-300",
                        "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      )}
                    >
                      {link.label}
                    </Link>
                  )}

                  {/* Elegant Dropdown Menu */}
                  {link.hasDropdown && link.children && (
                    <div
                      className={cn(
                        'absolute top-full left-1/2 -translate-x-1/2 w-64 pt-3',
                        'opacity-0 invisible translate-y-2',
                        'group-hover:opacity-100 group-hover:visible group-hover:translate-y-0',
                        'transition-all duration-300 ease-smooth'
                      )}
                      onMouseEnter={() => setServicesOpen(true)}
                      onMouseLeave={() => setServicesOpen(false)}
                    >
                      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-2 overflow-hidden">
                        {link.children.map((child, idx) => {
                          const IconComponent = child.icon;
                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl",
                                "text-sm text-gray-600 transition-all duration-200",
                                "hover:bg-gray-100 hover:text-gray-900",
                                "group/item"
                              )}
                              style={{ animationDelay: `${idx * 50}ms` }}
                            >
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center group-hover/item:from-amber-200 group-hover/item:to-orange-200 group-hover/item:scale-110 transition-all duration-200">
                                <IconComponent weight="duotone" className="h-4 w-4 text-amber-600" />
                              </div>
                              <span className="font-medium">{child.label}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Auth Buttons / User Profile */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Show user profile if user exists */}
              {user ? (
                <div className="flex items-center gap-3">
                  {/* Cart Icon - Reader only (not for authors or admins) */}
                  {!isAdmin && user.account_type !== 'author' && (
                    <Link
                      href="/cart"
                      className="relative p-2.5 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
                    >
                      <ShoppingCart weight="duotone" className="h-5 w-5" />
                    </Link>
                  )}
                  
                  {/* Profile Menu Button */}
                  <div className="relative" data-profile-menu>
                    <button
                      onClick={() => setProfileOpen(!profileOpen)}
                      className={cn(
                        "flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-full transition-all duration-300 group",
                        "border-2 hover:shadow-md",
                        profileOpen 
                          ? "bg-amber-50 border-amber-300 shadow-md" 
                          : "bg-white border-gray-200 hover:border-gray-300"
                      )}
                    >
                      {/* Avatar */}
                      {user.avatar_url ? (
                        <img 
                          src={user.avatar_url} 
                          alt={user.full_name || 'Profile'}
                          className="w-8 h-8 rounded-full object-cover shadow-sm group-hover:shadow-md transition-shadow"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 flex items-center justify-center text-white font-semibold text-sm shadow-sm group-hover:shadow-md transition-shadow">
                          {user.full_name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                      )}
                      
                      {/* Caret */}
                      <CaretDown 
                        weight="bold"
                        className={cn(
                          "h-3.5 w-3.5 text-gray-400 transition-all duration-300",
                          profileOpen ? "rotate-180 text-amber-600" : "group-hover:text-gray-600"
                        )}
                      />
                    </button>

                    {/* Profile Dropdown - Animated & Clean */}
                    <div 
                      className={cn(
                        "absolute top-full right-0 mt-2 w-72 rounded-2xl bg-white shadow-2xl border border-gray-100 overflow-hidden z-50",
                        "transition-all duration-300 ease-out origin-top-right",
                        profileOpen 
                          ? "opacity-100 scale-100 translate-y-0 visible" 
                          : "opacity-0 scale-95 -translate-y-2 invisible pointer-events-none"
                      )}
                    >
                      {/* User Header */}
                      <div className="p-4 bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          {user.avatar_url ? (
                            <img 
                              src={user.avatar_url} 
                              alt={user.full_name || 'Profile'}
                              className="w-12 h-12 rounded-xl object-cover shadow-lg"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-amber-500/20">
                              {user.full_name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 truncate">
                              {user.full_name || 'User'}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {user.email || ''}
                            </p>
                          </div>
                          <span className={cn(
                            "px-2 py-1 text-xs font-medium rounded-full capitalize",
                            isAdmin ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-700"
                          )}>
                            {isAdmin ? 'Admin' : user.account_type}
                          </span>
                        </div>
                      </div>
                      
                      {/* Menu Items */}
                      <div className="p-2">
                        {isAdmin ? (
                          /* Admin-specific menu items */
                          <>
                            <Link
                              href="/admin"
                              onClick={() => setProfileOpen(false)}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-amber-700 hover:bg-amber-50 hover:text-amber-800 transition-all duration-200 group/item"
                            >
                              <Shield weight="duotone" className="h-5 w-5 text-amber-500 group-hover/item:text-amber-600 transition-colors" />
                              <span>Admin Dashboard</span>
                            </Link>
                            <Link
                              href="/admin/users"
                              onClick={() => setProfileOpen(false)}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 group/item"
                            >
                              <User weight="regular" className="h-5 w-5 text-gray-400 group-hover/item:text-gray-600 transition-colors" />
                              <span>Manage Users</span>
                            </Link>
                            <Link
                              href="/admin/manuscripts"
                              onClick={() => setProfileOpen(false)}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 group/item"
                            >
                              <BookOpen weight="regular" className="h-5 w-5 text-gray-400 group-hover/item:text-gray-600 transition-colors" />
                              <span>Review Manuscripts</span>
                            </Link>
                            <Link
                              href="/admin/settings"
                              onClick={() => setProfileOpen(false)}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 group/item"
                            >
                              <Gear weight="regular" className="h-5 w-5 text-gray-400 group-hover/item:text-gray-600 transition-colors" />
                              <span>Admin Settings</span>
                            </Link>
                          </>
                        ) : (
                          /* Regular user menu items */
                          <>
                            <Link
                              href={user.account_type === 'author' 
                                ? (user.pen_name ? `/authors/${slugify(user.pen_name)}` : '/author/settings')
                                : '/profile'}
                              onClick={() => setProfileOpen(false)}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 group/item"
                            >
                              <User weight="regular" className="h-5 w-5 text-gray-400 group-hover/item:text-gray-600 transition-colors" />
                              <span>My Profile</span>
                            </Link>
                            
                            {user.account_type === 'author' ? (
                              <>
                                <Link
                                  href="/author/manuscripts"
                                  onClick={() => setProfileOpen(false)}
                                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 group/item"
                                >
                                  <BookOpen weight="regular" className="h-5 w-5 text-gray-400 group-hover/item:text-gray-600 transition-colors" />
                                  <span>My Books</span>
                                </Link>
                              </>
                            ) : (
                              <>
                                <Link
                                  href="/orders"
                                  onClick={() => setProfileOpen(false)}
                                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 group/item"
                                >
                                  <ClockCounterClockwise weight="regular" className="h-5 w-5 text-gray-400 group-hover/item:text-gray-600 transition-colors" />
                                  <span>Order History</span>
                                </Link>
                                <Link
                                  href="/wishlist"
                                  onClick={() => setProfileOpen(false)}
                                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 group/item"
                                >
                                  <Heart weight="regular" className="h-5 w-5 text-gray-400 group-hover/item:text-gray-600 transition-colors" />
                                  <span>Wishlist</span>
                                </Link>
                              </>
                            )}
                            
                            {user.account_type !== 'author' && (
                              <Link
                                href="/bookmarks"
                                onClick={() => setProfileOpen(false)}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 group/item"
                              >
                                <BookmarkSimple weight="regular" className="h-5 w-5 text-gray-400 group-hover/item:text-gray-600 transition-colors" />
                                <span>Bookmarks</span>
                              </Link>
                            )}
                            
                            <Link
                              href={user.account_type === 'author' ? '/author/settings' : '/settings'}
                              onClick={() => setProfileOpen(false)}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 group/item"
                            >
                              <Gear weight="regular" className="h-5 w-5 text-gray-400 group-hover/item:text-gray-600 transition-colors" />
                              <span>Settings</span>
                            </Link>
                          </>
                        )}
                      </div>

                      {/* Sign Out */}
                      <div className="p-2 border-t border-gray-100">
                        <button
                          onClick={handleSignOut}
                          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-200 group/item"
                        >
                          <SignOut weight="regular" className="h-5 w-5 group-hover/item:scale-110 transition-transform" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : loading ? (
                /* Loading skeleton */
                <div className="flex items-center gap-2 px-3 py-2">
                  <div className="w-9 h-9 rounded-full animate-pulse" style={{ backgroundColor: '#E5E7EB' }} />
                  <div className="w-16 h-3 rounded animate-pulse" style={{ backgroundColor: '#E5E7EB' }} />
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    className={cn(
                      "px-5 py-2.5 rounded-xl text-sm font-semibold",
                      "transition-all duration-300",
                      "text-ink-800 hover:text-ink-900 hover:bg-ink-100"
                    )}
                  >
                    Sign In
                  </Link>
                  <Link 
                    href="/signup" 
                    className={cn(
                      "group relative px-6 py-2.5 rounded-xl text-sm font-semibold",
                      "bg-ink-900 text-white",
                      "transition-all duration-300",
                      "hover:bg-ink-800 hover:shadow-lg",
                      "overflow-hidden"
                    )}
                  >
                    <span className="relative z-10">Start Publishing</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className={cn(
                "lg:hidden p-2.5 rounded-xl transition-all duration-300",
                "text-gray-700 hover:bg-gray-100"
              )}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              <div className="relative w-6 h-6">
                <List 
                  weight="bold"
                  className={cn(
                    "absolute inset-0 h-6 w-6 transition-all duration-300",
                    mobileMenuOpen ? "opacity-0 rotate-90" : "opacity-100 rotate-0"
                  )} 
                />
                <X 
                  weight="bold"
                  className={cn(
                    "absolute inset-0 h-6 w-6 transition-all duration-300",
                    mobileMenuOpen ? "opacity-100 rotate-0" : "opacity-0 -rotate-90"
                  )} 
                />
              </div>
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className={cn(
          "lg:hidden fixed top-16 left-0 right-0 bottom-0",
          "bg-white",
          "overflow-hidden z-40",
          "transition-all duration-400 ease-smooth",
          mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        )}>
          <div className="h-full flex flex-col">
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="container-editorial py-4">
                {/* User Card (if logged in) - at the top */}
                {user && (
                  <div className={cn(
                    "mb-4 p-4 rounded-2xl bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 border border-amber-200/50 transition-all duration-500",
                    mobileMenuOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                  )}>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-orange-500/30">
                          {user.full_name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 truncate text-lg">{user.full_name || 'User'}</p>
                        <p className="text-sm text-gray-500 truncate">{user.email || ''}</p>
                      </div>
                      <span className="px-3 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white capitalize shadow-md shadow-amber-500/20">
                        {user.account_type}
                      </span>
                    </div>
                  </div>
                )}

                {/* Navigation Section */}
                <div className="mb-4">
                  <p className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Navigation</p>
                  <div className="space-y-1">
                    {navLinks.map((link, idx) => (
                      <div 
                        key={link.href}
                        className={cn(
                          "transition-all duration-500",
                          mobileMenuOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                        )}
                        style={{ transitionDelay: mobileMenuOpen ? `${idx * 40}ms` : '0ms' }}
                      >
                        {link.hasDropdown ? (
                          <>
                            <button
                              onClick={toggleMobileServices}
                              className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 active:bg-gray-100 transition-all duration-200"
                            >
                              <span>{link.label}</span>
                              <CaretDown 
                                weight="bold"
                                className={cn(
                                  "h-5 w-5 text-gray-400 transition-transform duration-300",
                                  mobileServicesOpen && "rotate-180 text-amber-500"
                                )} 
                              />
                            </button>
                            <div className={cn(
                              "overflow-hidden transition-all duration-400 ease-smooth",
                              mobileServicesOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
                            )}>
                              <div className="py-2 px-2 grid grid-cols-2 gap-2">
                                {link.children?.map((child, childIdx) => {
                                  const IconComponent = child.icon;
                                  return (
                                    <Link
                                      key={child.href}
                                      href={child.href}
                                      className={cn(
                                        "flex flex-col items-center gap-2 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 active:bg-gray-200 transition-all duration-200",
                                        mobileServicesOpen ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                                      )}
                                      style={{ transitionDelay: mobileServicesOpen ? `${childIdx * 30}ms` : '0ms' }}
                                      onClick={() => setMobileMenuOpen(false)}
                                    >
                                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center shadow-sm">
                                        <IconComponent weight="duotone" className="h-5 w-5 text-amber-600" />
                                      </div>
                                      <span className="text-xs font-semibold text-gray-700 text-center">{child.label}</span>
                                    </Link>
                                  );
                                })}
                              </div>
                            </div>
                          </>
                        ) : (
                          <Link
                            href={link.href}
                            className="block px-4 py-3.5 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 active:bg-gray-100 transition-all duration-200"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {link.label}
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Profile Section (if logged in) */}
                {user && (
                  <div className={cn(
                    "mb-4 transition-all duration-500",
                    mobileMenuOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                  )}
                  style={{ transitionDelay: mobileMenuOpen ? '200ms' : '0ms' }}
                  >
                    <p className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      {isAdmin ? 'Admin' : 'Account'}
                    </p>
                    <div className="grid grid-cols-2 gap-2 px-2">
                      {isAdmin ? (
                        /* Admin-specific mobile menu items */
                        <>
                          <Link
                            href="/admin"
                            className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 hover:border-amber-300 transition-all"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <Shield weight="duotone" className="h-5 w-5 text-amber-500" />
                            <span className="text-sm font-semibold text-amber-700">Dashboard</span>
                          </Link>
                          <Link
                            href="/admin/users"
                            className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 hover:border-blue-200 transition-all"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <User weight="duotone" className="h-5 w-5 text-blue-500" />
                            <span className="text-sm font-semibold text-gray-700">Users</span>
                          </Link>
                          <Link
                            href="/admin/manuscripts"
                            className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-100 hover:border-purple-200 transition-all"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <BookOpen weight="duotone" className="h-5 w-5 text-purple-500" />
                            <span className="text-sm font-semibold text-gray-700">Manuscripts</span>
                          </Link>
                          <Link
                            href="/admin/settings"
                            className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-gray-50 to-slate-50 border border-gray-200 hover:border-gray-300 transition-all"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <Gear weight="duotone" className="h-5 w-5 text-gray-500" />
                            <span className="text-sm font-semibold text-gray-700">Settings</span>
                          </Link>
                        </>
                      ) : (
                        /* Regular user mobile menu items */
                        <>
                          <Link
                            href={user.account_type === 'author' 
                              ? (user.pen_name ? `/authors/${slugify(user.pen_name)}` : '/author/settings')
                              : '/profile'}
                            className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-100 hover:border-purple-200 transition-all"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <User weight="duotone" className="h-5 w-5 text-purple-500" />
                            <span className="text-sm font-semibold text-gray-700">Profile</span>
                          </Link>
                          
                          {user.account_type === 'author' ? (
                            <>
                              <Link
                                href="/author/manuscripts"
                                className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 hover:border-blue-200 transition-all"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                <BookOpen weight="duotone" className="h-5 w-5 text-blue-500" />
                                <span className="text-sm font-semibold text-gray-700">My Books</span>
                              </Link>
                            </>
                          ) : (
                            <>
                              <Link
                                href="/orders"
                                className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 hover:border-amber-200 transition-all"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                <ClockCounterClockwise weight="duotone" className="h-5 w-5 text-amber-500" />
                                <span className="text-sm font-semibold text-gray-700">Orders</span>
                              </Link>
                              <Link
                                href="/wishlist"
                                className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-100 hover:border-pink-200 transition-all"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                <Heart weight="duotone" className="h-5 w-5 text-pink-500" />
                                <span className="text-sm font-semibold text-gray-700">Wishlist</span>
                              </Link>
                              <Link
                                href="/bookmarks"
                                className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 hover:border-emerald-200 transition-all"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                <BookmarkSimple weight="duotone" className="h-5 w-5 text-emerald-500" />
                                <span className="text-sm font-semibold text-gray-700">Bookmarks</span>
                              </Link>
                              <Link
                                href="/cart"
                                className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-100 hover:border-violet-200 transition-all"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                <ShoppingCart weight="duotone" className="h-5 w-5 text-violet-500" />
                                <span className="text-sm font-semibold text-gray-700">Cart</span>
                              </Link>
                            </>
                          )}
                          
                          <Link
                            href={user.account_type === 'author' ? '/author/settings' : '/settings'}
                            className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-gray-50 to-slate-50 border border-gray-200 hover:border-gray-300 transition-all"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <Gear weight="duotone" className="h-5 w-5 text-gray-500" />
                            <span className="text-sm font-semibold text-gray-700">Settings</span>
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Fixed Bottom Actions */}
            <div className="flex-shrink-0 p-4 border-t border-gray-100 bg-white safe-area-inset-bottom">
              {user ? (
                <div className="space-y-3">
                  {user.account_type === 'author' && (
                    <Link
                      href="/author/manuscripts/new"
                      className="flex items-center justify-center gap-2 w-full px-4 py-3.5 rounded-xl font-bold bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white shadow-lg shadow-orange-500/30 hover:shadow-xl active:scale-[0.98] transition-all"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Sparkle weight="fill" className="h-5 w-5" />
                      Start Publishing
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleSignOut();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3.5 rounded-xl text-red-600 font-semibold bg-red-50 hover:bg-red-100 active:bg-red-200 transition-all"
                  >
                    <SignOut weight="bold" className="h-5 w-5" />
                    Sign Out
                  </button>
                </div>
              ) : loading ? (
                <div className="flex justify-center py-4">
                  <div className="w-8 h-8 rounded-full border-2 border-gray-200 border-t-amber-500 animate-spin" />
                </div>
              ) : (
                <div className="space-y-3">
                  <Link
                    href="/signup?role=author"
                    className="flex items-center justify-center gap-2 w-full px-4 py-3.5 rounded-xl font-bold bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-lg hover:shadow-xl active:scale-[0.98] transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Sparkle weight="fill" className="h-5 w-5" />
                    Start Publishing
                  </Link>
                  <Link
                    href="/login"
                    className="flex items-center justify-center w-full px-4 py-3.5 rounded-xl text-gray-700 font-semibold border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 active:bg-gray-100 transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      
      {/* Backdrop for mobile menu */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
