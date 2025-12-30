'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Warning, House, ArrowClockwise } from '@phosphor-icons/react';
import * as Sentry from '@sentry/nextjs';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Report error to Sentry (will be no-op if Sentry is not initialized)
    Sentry.captureException(error, {
      tags: {
        component: 'error-boundary',
        digest: error.digest || 'unknown',
      },
    });
    
    // Also log to console for debugging
    console.error('[ErrorBoundary] Application error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-parchment-50 px-4">
      <div className="text-center max-w-md">
        {/* Error icon */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <Warning weight="duotone" className="h-8 w-8 text-red-600" />
        </div>

        {/* Error message */}
        <h1 className="mb-2 font-serif text-2xl font-semibold text-ink-900">
          Something went wrong
        </h1>
        <p className="mb-8 text-ink-600">
          We apologize for the inconvenience. An unexpected error has occurred.
          Please try again or return to the homepage.
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-md bg-ink-900 px-6 py-3 text-sm font-medium text-parchment-50 transition-colors hover:bg-ink-800"
          >
            <ArrowClockwise weight="bold" className="h-4 w-4" />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-md border border-ink-300 px-6 py-3 text-sm font-medium text-ink-900 transition-colors hover:bg-parchment-100"
          >
            <House weight="bold" className="h-4 w-4" />
            Go Home
          </Link>
        </div>

        {/* Error details (development only) */}
        {process.env.NODE_ENV === 'development' && error.message && (
          <details className="mt-8 text-left">
            <summary className="cursor-pointer text-sm text-ink-500 hover:text-ink-700">
              Error details
            </summary>
            <pre className="mt-2 overflow-auto rounded-md bg-ink-100 p-4 text-xs text-ink-700">
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
