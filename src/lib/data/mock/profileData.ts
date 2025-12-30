/**
 * Mock data for Profile page
 * ONLY rendered when NEXT_PUBLIC_USE_MOCK_DATA=true
 */

export interface ProfileAchievement {
  icon: string; // Icon name for lookup
  label: string;
  desc: string;
  progress: number;
}

export interface ReadingStreak {
  currentStreak: number;
  bestStreak: number;
  percentile: string;
}

export interface ContinueReading {
  id: string;
  title: string;
  author: string;
  cover: string;
  progress: number;
  isAudiobook: boolean;
  currentChapter?: string;
  duration?: string;
}

export interface ProfileStats {
  followers: number;
  following: number;
  reviews: number;
  booksRead: number;
}

// Mock data for demo mode
export const mockAchievements: ProfileAchievement[] = [
  { icon: 'Books', label: 'Bookworm', desc: '100+ books read', progress: 100 },
  { icon: 'Star', label: 'Top Reviewer', desc: '50+ reviews', progress: 78 },
  { icon: 'Fire', label: 'Streak Master', desc: '30 day streak', progress: 77 },
  { icon: 'Users', label: 'Influencer', desc: '1K followers', progress: 100 },
];

export const mockReadingStreak: ReadingStreak = {
  currentStreak: 23,
  bestStreak: 45,
  percentile: 'Top 10%',
};

export const mockContinueReading: ContinueReading[] = [
  { id: '1', title: 'The Seven Husbands of Evelyn Hugo', author: 'Taylor Jenkins Reid', cover: '/api/placeholder/80/120', progress: 67, isAudiobook: false, currentChapter: 'Chapter 18: The Truth' },
  { id: '2', title: 'Dune', author: 'Frank Herbert', cover: '/api/placeholder/80/120', progress: 34, isAudiobook: true, duration: '4h 23m remaining' },
  { id: '3', title: 'A Court of Thorns and Roses', author: 'Sarah J. Maas', cover: '/api/placeholder/80/120', progress: 89, isAudiobook: false, currentChapter: 'Chapter 42: The Rescue' },
];

export const mockProfileStats: ProfileStats = {
  followers: 1247,
  following: 342,
  reviews: 89,
  booksRead: 156
};

// Empty state for real mode (no backend data yet)
export const emptyAchievements: ProfileAchievement[] = [
  { icon: 'Books', label: 'Bookworm', desc: '100+ books read', progress: 0 },
  { icon: 'Star', label: 'Top Reviewer', desc: '50+ reviews', progress: 0 },
  { icon: 'Fire', label: 'Streak Master', desc: '30 day streak', progress: 0 },
  { icon: 'Users', label: 'Influencer', desc: '1K followers', progress: 0 },
];

export const emptyReadingStreak: ReadingStreak = {
  currentStreak: 0,
  bestStreak: 0,
  percentile: '',
};

export const emptyProfileStats: ProfileStats = {
  followers: 0,
  following: 0,
  reviews: 0,
  booksRead: 0
};
