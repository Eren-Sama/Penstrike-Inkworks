'use client';

/**
 * AdminGuard Component
 * 
 * Client-side guard that prevents non-admin users from accessing admin routes.
 * This works in conjunction with server-side checks in admin actions.
 * 
 * In mock mode, shows mock admin UI.
 * In real mode, checks actual user role from AuthContext.
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { isUsingMockData } from '@/lib/env';
import { Shield, SpinnerGap, WarningCircle } from '@phosphor-icons/react';

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();
  const [mockMode] = useState(isUsingMockData());
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    // In mock mode, always allow access (mock admin user)
    if (mockMode) {
      setAuthorized(true);
      return;
    }

    // Wait for auth to load
    if (loading) return;

    // Check if user is admin
    if (!user) {
      // Not logged in - redirect to login
      router.replace('/login?redirect=/admin&error=admin_required');
      return;
    }

    if (!isAdmin) {
      // Not an admin - redirect to home with error
      router.replace('/?error=unauthorized');
      return;
    }

    // User is admin
    setAuthorized(true);
  }, [user, loading, isAdmin, router, mockMode]);

  // Loading state
  if (loading || authorized === null) {
    return (
      <div className="min-h-screen bg-parchment-50 flex items-center justify-center">
        <div className="text-center">
          <SpinnerGap weight="bold" className="h-8 w-8 animate-spin text-accent-yellow mx-auto mb-4" />
          <p className="text-ink-600">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Unauthorized (should redirect, but show message just in case)
  if (!authorized) {
    return (
      <div className="min-h-screen bg-parchment-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-error/20 flex items-center justify-center">
            <WarningCircle weight="duotone" className="h-8 w-8 text-error" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-ink-900 mb-2">Access Denied</h1>
          <p className="text-ink-600 mb-6">
            You don&apos;t have permission to access the admin panel.
          </p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-ink-900 text-white rounded-lg hover:bg-ink-800 transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  // Show mock mode indicator if applicable
  if (mockMode) {
    return (
      <>
        {/* Mock mode banner */}
        <div className="fixed bottom-4 right-4 z-50 px-4 py-2 bg-amber-500 text-white text-sm font-medium rounded-lg shadow-lg flex items-center gap-2">
          <Shield weight="fill" className="h-4 w-4" />
          <span>Demo Admin Mode</span>
        </div>
        {children}
      </>
    );
  }

  return <>{children}</>;
}
