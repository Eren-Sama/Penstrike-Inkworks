'use client';

import { useAuth } from '@/lib/auth/AuthContext';
import Image from 'next/image';

interface AuthorAvatarProps {
  authorId: string;
  authorAvatar?: string | null;
  authorName: string;
  gradient: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isVerified?: boolean;
}

const sizeClasses = {
  sm: 'w-12 h-12 text-lg',
  md: 'w-20 h-20 text-2xl',
  lg: 'w-36 h-36 md:w-44 md:h-44 text-5xl md:text-6xl',
  xl: 'w-48 h-48 md:w-56 md:h-56 text-6xl md:text-7xl',
};

const imageSizes = {
  sm: 48,
  md: 80,
  lg: 176,
  xl: 224,
};

/**
 * AuthorAvatar - Client component that handles avatar rendering
 * If the viewer is the same author, it uses their AuthContext avatar_url
 * Otherwise it uses the fetched author.avatar
 * 
 * Verified authors get a premium gold/amber ring around their avatar
 */
export function AuthorAvatar({ 
  authorId, 
  authorAvatar, 
  authorName, 
  gradient,
  size = 'lg',
  isVerified = false,
}: AuthorAvatarProps) {
  const { user } = useAuth();
  
  // Determine the avatar to display
  // If viewer is the author themselves, prefer their AuthContext avatar
  const isSelf = user?.id === authorId;
  const avatarUrl = isSelf && user?.avatar_url ? user.avatar_url : authorAvatar;
  
  const initials = authorName
    .split(' ')
    .map(w => w.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const sizeClass = sizeClasses[size];
  const imageSize = imageSizes[size];

  // Premium verified styling: gold/amber gradient ring with animation
  const borderClass = isVerified 
    ? 'ring-4 ring-amber-400/80 ring-offset-2 ring-offset-ink-900/20 shadow-[0_0_20px_rgba(251,191,36,0.3)]' 
    : 'border-4 border-white/30 shadow-2xl';

  if (avatarUrl) {
    return (
      <div className={`${sizeClass} rounded-2xl overflow-hidden ${borderClass}`}>
        <Image
          src={avatarUrl}
          alt={authorName}
          width={imageSize}
          height={imageSize}
          className="w-full h-full object-cover"
          priority
        />
      </div>
    );
  }

  return (
    <div className={`${sizeClass} rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center ${borderClass}`}>
      <span className="text-white font-bold tracking-tight">
        {initials}
      </span>
    </div>
  );
}

/**
 * AuthorAvatarCard - For use in author cards on listing pages
 * Uses neutral styling without heavy gradients
 * Verified authors get a subtle gold ring
 */
export function AuthorAvatarCard({ 
  authorId, 
  authorAvatar, 
  authorName, 
  gradient,
  size = 'md',
  isVerified = false,
}: AuthorAvatarProps) {
  const { user } = useAuth();
  
  const isSelf = user?.id === authorId;
  const avatarUrl = isSelf && user?.avatar_url ? user.avatar_url : authorAvatar;
  
  const initials = authorName
    .split(' ')
    .map(w => w.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const sizeClass = sizeClasses[size];
  const imageSize = imageSizes[size];

  // Verified styling: gold ring
  const ringClass = isVerified 
    ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-white shadow-lg' 
    : 'ring-4 ring-white shadow-lg';

  if (avatarUrl) {
    return (
      <div className={`${sizeClass} rounded-full overflow-hidden ${ringClass}`}>
        <Image
          src={avatarUrl}
          alt={authorName}
          width={imageSize}
          height={imageSize}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className={`${sizeClass} rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center ${ringClass}`}>
      <span className="text-white font-bold">
        {initials}
      </span>
    </div>
  );
}
