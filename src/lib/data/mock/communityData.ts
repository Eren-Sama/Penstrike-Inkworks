/**
 * Mock data for Community pages
 * ONLY rendered when NEXT_PUBLIC_USE_MOCK_DATA=true
 */

export interface CommunityStat {
  label: string;
  value: string;
  icon: string; // Icon name for lookup
}

export interface CommunityCategory {
  name: string;
  description: string;
  posts: number;
  gradient: string;
}

export interface FeaturedMember {
  name: string;
  books: number;
  genre: string;
  avatar: string;
}

export interface SuccessStory {
  quote: string;
  author: string;
  achievement: string;
}

// Mock data for demo mode
export const mockCommunityStats: CommunityStat[] = [
  { label: 'Community Members', value: '12,500+', icon: 'Users' },
  { label: 'Discussions', value: '45,000+', icon: 'MessageSquare' },
  { label: 'Books Published', value: '8,200+', icon: 'BookOpen' },
  { label: 'Success Stories', value: '500+', icon: 'Award' },
];

export const mockCommunityCategories: CommunityCategory[] = [
  {
    name: 'Writing Craft',
    description: 'Tips, techniques, and discussions about the art of writing',
    posts: 12500,
    gradient: 'from-blue-500 to-indigo-600',
  },
  {
    name: 'Marketing & Promotion',
    description: 'Strategies to market your book and build your audience',
    posts: 8300,
    gradient: 'from-purple-500 to-pink-600',
  },
  {
    name: 'Cover Design',
    description: 'Feedback and discussions about book covers',
    posts: 5600,
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    name: 'Genre Discussions',
    description: 'Connect with authors in your genre',
    posts: 15200,
    gradient: 'from-orange-500 to-amber-600',
  },
  {
    name: 'Publishing Journey',
    description: 'Share experiences and get advice on the publishing process',
    posts: 9800,
    gradient: 'from-rose-500 to-red-600',
  },
  {
    name: 'Feedback & Critiques',
    description: 'Get constructive feedback on your work',
    posts: 7400,
    gradient: 'from-teal-500 to-cyan-600',
  },
];

export const mockFeaturedMembers: FeaturedMember[] = [
  { name: 'Sarah Mitchell', books: 12, genre: 'Romance', avatar: 'SM' },
  { name: 'James Chen', books: 8, genre: 'Thriller', avatar: 'JC' },
  { name: 'Emily Rodriguez', books: 15, genre: 'Fantasy', avatar: 'ER' },
  { name: 'Michael Brooks', books: 6, genre: 'Sci-Fi', avatar: 'MB' },
];

export const mockSuccessStories: SuccessStory[] = [
  {
    quote: "The community helped me refine my craft and find my voice. My debut novel hit the bestseller list within a month!",
    author: "Maria Santos",
    achievement: "USA Today Bestseller",
  },
  {
    quote: "Getting feedback from experienced authors transformed my writing. The support here is incredible.",
    author: "David Park",
    achievement: "10,000+ copies sold",
  },
  {
    quote: "From a first-time author to running a successful series - this community made it possible.",
    author: "Rachel Thompson",
    achievement: "12-book series published",
  },
];

// Empty state for real mode (no community backend yet)
export const emptyCommunityStats: CommunityStat[] = [
  { label: 'Community Members', value: '0', icon: 'Users' },
  { label: 'Discussions', value: '0', icon: 'MessageSquare' },
  { label: 'Books Published', value: '0', icon: 'BookOpen' },
  { label: 'Success Stories', value: '0', icon: 'Award' },
];

export const emptyCommunityCategories: CommunityCategory[] = [
  {
    name: 'Writing Craft',
    description: 'Tips, techniques, and discussions about the art of writing',
    posts: 0,
    gradient: 'from-blue-500 to-indigo-600',
  },
  {
    name: 'Marketing & Promotion',
    description: 'Strategies to market your book and build your audience',
    posts: 0,
    gradient: 'from-purple-500 to-pink-600',
  },
  {
    name: 'Cover Design',
    description: 'Feedback and discussions about book covers',
    posts: 0,
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    name: 'Genre Discussions',
    description: 'Connect with authors in your genre',
    posts: 0,
    gradient: 'from-orange-500 to-amber-600',
  },
  {
    name: 'Publishing Journey',
    description: 'Share experiences and get advice on the publishing process',
    posts: 0,
    gradient: 'from-rose-500 to-red-600',
  },
  {
    name: 'Feedback & Critiques',
    description: 'Get constructive feedback on your work',
    posts: 0,
    gradient: 'from-teal-500 to-cyan-600',
  },
];

export const emptyFeaturedMembers: FeaturedMember[] = [];

export const emptySuccessStories: SuccessStory[] = [];
