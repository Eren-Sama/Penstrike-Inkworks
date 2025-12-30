// Shared TypeScript types for Penstrike Inkworks

// ===========================================
// USER TYPES
// ===========================================

export type UserRole = 'READER' | 'AUTHOR' | 'EDITOR' | 'ADMIN' | 'SUPER_ADMIN';
export type UserStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'DEACTIVATED';
export type ComplianceStatus = 'INCOMPLETE' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  firstName: string | null;
  lastName: string | null;
  avatar: string | null;
  createdAt: Date;
  lastLoginAt: Date | null;
}

export interface AuthorProfile {
  id: string;
  userId: string;
  penName: string | null;
  bio: string | null;
  website: string | null;
  socialLinks: Record<string, string> | null;
  profileImage: string | null;
  coverImage: string | null;
  complianceStatus: ComplianceStatus;
  contractSigned: boolean;
  idVerified: boolean;
}

export interface AuthUser extends User {
  authorProfile?: AuthorProfile | null;
}

// ===========================================
// MANUSCRIPT TYPES
// ===========================================

export type ManuscriptStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'REVISION_REQUESTED'
  | 'EDITING'
  | 'DESIGN'
  | 'PROOFING'
  | 'APPROVED'
  | 'PUBLISHED'
  | 'REJECTED'
  | 'ARCHIVED';

export interface Manuscript {
  id: string;
  authorId: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  content: ManuscriptContent | null;
  wordCount: number;
  pageCount: number;
  genre: string[];
  keywords: string[];
  targetAudience: string | null;
  language: string;
  status: ManuscriptStatus;
  currentVersion: number;
  submittedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ManuscriptContent {
  chapters: Chapter[];
  frontMatter?: FrontMatter;
  backMatter?: BackMatter;
}

export interface Chapter {
  id: string;
  number: number;
  title: string;
  content: string;
  wordCount: number;
}

export interface FrontMatter {
  dedication?: string;
  acknowledgements?: string;
  preface?: string;
}

export interface BackMatter {
  aboutAuthor?: string;
  alsoBy?: string[];
  notes?: string;
}

export interface ManuscriptVersion {
  id: string;
  manuscriptId: string;
  version: number;
  content: ManuscriptContent;
  wordCount: number;
  changeLog: string | null;
  fileUrl: string | null;
  createdAt: Date;
}

export interface ManuscriptFeedback {
  id: string;
  manuscriptId: string;
  editorId: string;
  type: 'comment' | 'revision_request' | 'approval';
  content: string;
  chapter: number | null;
  pageNumber: number | null;
  resolved: boolean;
  createdAt: Date;
}

// ===========================================
// BOOK TYPES
// ===========================================

export type BookStatus =
  | 'DRAFT'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'PUBLISHED'
  | 'OUT_OF_PRINT'
  | 'REMOVED';

export type BookFormat = 'PAPERBACK' | 'HARDCOVER' | 'EBOOK' | 'AUDIOBOOK';

export interface Book {
  id: string;
  authorId: string;
  manuscriptId: string | null;
  isbn: string | null;
  title: string;
  subtitle: string | null;
  description: string;
  blurb: string | null;
  genre: string[];
  subGenre: string[];
  keywords: string[];
  language: string;
  pageCount: number | null;
  wordCount: number | null;
  coverImage: string | null;
  status: BookStatus;
  publishedAt: Date | null;
  previewText: string | null;
  previewAudio: string | null;
  createdAt: Date;
  updatedAt: Date;
  author?: AuthorProfile;
  formats?: BookFormatPrice[];
}

export interface BookFormatPrice {
  id: string;
  bookId: string;
  format: BookFormat;
  price: number;
  currency: string;
  available: boolean;
}

export interface BookWithDetails extends Book {
  author: AuthorProfile & { user: Pick<User, 'firstName' | 'lastName'> };
  formats: BookFormatPrice[];
  averageRating?: number;
  reviewCount?: number;
}

// ===========================================
// ORDER TYPES
// ===========================================

export type OrderStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'PAID'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED';

export interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  status: OrderStatus;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  currency: string;
  stripePaymentId: string | null;
  shippingAddress: ShippingAddress | null;
  trackingNumber: string | null;
  createdAt: Date;
  paidAt: Date | null;
  shippedAt: Date | null;
  deliveredAt: Date | null;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  bookId: string;
  format: BookFormat;
  quantity: number;
  unitPrice: number;
  total: number;
  downloadUrl: string | null;
  book?: Book;
}

export interface ShippingAddress {
  name: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  phone?: string;
}

// ===========================================
// REVIEW TYPES
// ===========================================

export interface Review {
  id: string;
  userId: string;
  bookId: string;
  rating: number;
  title: string | null;
  content: string | null;
  verified: boolean;
  approved: boolean;
  helpfulCount: number;
  createdAt: Date;
  user?: Pick<User, 'firstName' | 'lastName' | 'avatar'>;
}

// ===========================================
// ROYALTY & PAYOUT TYPES
// ===========================================

export type PayoutStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export interface Royalty {
  id: string;
  authorId: string;
  periodStart: Date;
  periodEnd: Date;
  grossSales: number;
  platformFee: number;
  printingCost: number;
  netRoyalty: number;
  breakdown: RoyaltyBreakdown;
}

export interface RoyaltyBreakdown {
  byBook: { bookId: string; title: string; amount: number }[];
  byFormat: { format: BookFormat; amount: number }[];
}

export interface Payout {
  id: string;
  authorId: string;
  amount: number;
  currency: string;
  status: PayoutStatus;
  periodStart: Date;
  periodEnd: Date;
  processedAt: Date | null;
  failureReason: string | null;
}

// ===========================================
// AI SERVICE TYPES
// ===========================================

export type AIServiceType =
  | 'GRAMMAR_CHECK'
  | 'TONE_REFINEMENT'
  | 'BLURB_GENERATION'
  | 'METADATA_OPTIMIZATION'
  | 'COVER_GENERATION'
  | 'AUDIOBOOK_GENERATION';

export interface AIUsageLog {
  id: string;
  authorId: string;
  serviceType: AIServiceType;
  inputTokens: number | null;
  outputTokens: number | null;
  cost: number | null;
  success: boolean;
  createdAt: Date;
}

export interface AIGrammarResult {
  corrections: {
    original: string;
    suggestion: string;
    reason: string;
    position: { start: number; end: number };
  }[];
  overallScore: number;
}

export interface AIBlurbResult {
  blurb: string;
  alternatives: string[];
}

export interface AICoverPrompt {
  style?: 'photographic' | 'illustrated' | 'minimalist' | 'typographic' | 'modern';
  mood?: string;
  elements?: string[];
  colors?: string[];
  genre?: string[];
}

export interface AICoverResult {
  imageUrl: string;
  prompt: string;
}

export interface AIAudiobookConfig {
  voiceId: string;
  emotionalIntensity?: 'subtle' | 'moderate' | 'dramatic';
  paceWPM: number;
  pauseLength?: 'short' | 'medium' | 'long';
}

// ===========================================
// NOTIFICATION TYPES
// ===========================================

export type NotificationType =
  | 'SYSTEM'
  | 'MANUSCRIPT_UPDATE'
  | 'REVIEW_RECEIVED'
  | 'SALE_MADE'
  | 'PAYOUT_PROCESSED'
  | 'COMPLIANCE_UPDATE';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link: string | null;
  read: boolean;
  createdAt: Date;
}

// ===========================================
// API TYPES
// ===========================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// ===========================================
// FORM TYPES
// ===========================================

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: 'READER' | 'AUTHOR';
}

export interface AuthorProfileFormData {
  penName: string;
  bio: string;
  website?: string;
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    facebook?: string;
    goodreads?: string;
  };
}

export interface ManuscriptFormData {
  title: string;
  subtitle?: string;
  description?: string;
  genre: string[];
  keywords: string[];
  targetAudience?: string;
  language: string;
}

export interface BookFormData extends ManuscriptFormData {
  blurb?: string;
  formats: {
    format: BookFormat;
    price: number;
    available: boolean;
  }[];
}
