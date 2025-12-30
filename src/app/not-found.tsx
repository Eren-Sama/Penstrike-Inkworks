import Link from 'next/link';
import { BookOpenText, House, MagnifyingGlass } from '@phosphor-icons/react/dist/ssr';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-parchment-50 px-4">
      <div className="text-center max-w-md">
        {/* 404 illustration */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-parchment-200">
              <BookOpenText weight="duotone" className="h-12 w-12 text-ink-400" />
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-accent-yellow px-3 py-1 text-xs font-bold text-ink-900">
              404
            </div>
          </div>
        </div>

        {/* Error message */}
        <h1 className="mb-2 font-serif text-3xl font-semibold text-ink-900">
          Page Not Found
        </h1>
        <p className="mb-8 text-ink-600">
          The page you're looking for doesn't exist or has been moved. 
          Perhaps you can find what you're looking for on our homepage or in our bookstore.
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-md bg-ink-900 px-6 py-3 text-sm font-medium text-parchment-50 transition-colors hover:bg-ink-800"
          >
            <House weight="bold" className="h-4 w-4" />
            Go Home
          </Link>
          <Link
            href="/bookstore"
            className="inline-flex items-center gap-2 rounded-md border border-ink-300 px-6 py-3 text-sm font-medium text-ink-900 transition-colors hover:bg-parchment-100"
          >
            <MagnifyingGlass weight="bold" className="h-4 w-4" />
            Browse Books
          </Link>
        </div>

        {/* Decorative quote */}
        <div className="mt-12 border-t border-parchment-200 pt-8">
          <blockquote className="text-sm italic text-ink-500">
            "Not all those who wander are lost, but you might be on the wrong page."
          </blockquote>
        </div>
      </div>
    </div>
  );
}
