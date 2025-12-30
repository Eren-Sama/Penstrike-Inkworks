'use client';

import { SealCheck } from '@phosphor-icons/react';

interface VerifiedBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showTooltip?: boolean;
}

/**
 * Verified Author Badge
 * Displays a gold/yellow verified badge next to author names
 * Only shown for authors with is_verified = true
 */
export function VerifiedBadge({ 
  size = 'md', 
  className = '',
  showTooltip = true,
}: VerifiedBadgeProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  return (
    <span 
      className={`inline-flex items-center ${className}`}
      title={showTooltip ? 'Verified Author' : undefined}
    >
      <SealCheck 
        weight="fill" 
        className={`${sizeClasses[size]} text-amber-500`} 
      />
    </span>
  );
}

/**
 * Verified Badge with label (for profile pages)
 */
export function VerifiedBadgeWithLabel({ 
  className = '',
}: { 
  className?: string;
}) {
  return (
    <span 
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-medium ${className}`}
    >
      <SealCheck weight="fill" className="h-3.5 w-3.5" />
      Verified Author
    </span>
  );
}
