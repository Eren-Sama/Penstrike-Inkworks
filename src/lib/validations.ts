import { z } from 'zod';

// ===========================================
// AUTH SCHEMAS
// ===========================================

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  role: z.enum(['READER', 'AUTHOR']).default('READER'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// ===========================================
// AUTHOR PROFILE SCHEMAS
// ===========================================

export const authorProfileSchema = z.object({
  penName: z.string().min(2, 'Pen name must be at least 2 characters').optional(),
  bio: z.string().max(2000, 'Bio must be less than 2000 characters').optional(),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  socialLinks: z.object({
    twitter: z.string().optional(),
    instagram: z.string().optional(),
    facebook: z.string().optional(),
    goodreads: z.string().optional(),
  }).optional(),
});

export const authorComplianceSchema = z.object({
  legalName: z.string().min(2, 'Legal name is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  address: z.object({
    street: z.string().min(1, 'Street address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    country: z.string().min(1, 'Country is required'),
    zipCode: z.string().min(1, 'ZIP code is required'),
  }),
  phone: z.string().min(10, 'Valid phone number is required'),
  taxId: z.string().min(1, 'Tax ID is required'),
  taxCountry: z.string().min(1, 'Tax country is required'),
});

export const bankDetailsSchema = z.object({
  accountName: z.string().min(1, 'Account name is required'),
  accountNumber: z.string().min(1, 'Account number is required'),
  routingNumber: z.string().min(1, 'Routing number is required'),
  bankName: z.string().min(1, 'Bank name is required'),
  accountType: z.enum(['checking', 'savings']),
});

// ===========================================
// MANUSCRIPT SCHEMAS
// ===========================================

export const manuscriptSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  subtitle: z.string().max(200, 'Subtitle must be less than 200 characters').optional(),
  description: z.string().max(5000, 'Description must be less than 5000 characters').optional(),
  genre: z.array(z.string()).min(1, 'At least one genre is required'),
  keywords: z.array(z.string()).optional(),
  targetAudience: z.string().optional(),
  language: z.string().default('en'),
});

export const chapterSchema = z.object({
  title: z.string().min(1, 'Chapter title is required'),
  content: z.string().min(1, 'Chapter content is required'),
});

// ===========================================
// BOOK SCHEMAS
// ===========================================

export const bookSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  subtitle: z.string().max(200, 'Subtitle must be less than 200 characters').optional(),
  description: z.string().min(50, 'Description must be at least 50 characters').max(5000),
  blurb: z.string().max(500, 'Blurb must be less than 500 characters').optional(),
  genre: z.array(z.string()).min(1, 'At least one genre is required'),
  subGenre: z.array(z.string()).optional(),
  keywords: z.array(z.string()).optional(),
  language: z.string().default('en'),
});

export const bookFormatPriceSchema = z.object({
  format: z.enum(['PAPERBACK', 'HARDCOVER', 'EBOOK', 'AUDIOBOOK']),
  price: z.number().min(0.99, 'Price must be at least $0.99').max(999.99, 'Price must be less than $1000'),
  available: z.boolean().default(true),
});

export const bookPricingSchema = z.object({
  formats: z.array(bookFormatPriceSchema).min(1, 'At least one format is required'),
});

// ===========================================
// ORDER SCHEMAS
// ===========================================

export const shippingAddressSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  street: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  country: z.string().min(1, 'Country is required'),
  zipCode: z.string().min(1, 'ZIP code is required'),
  phone: z.string().optional(),
});

export const cartItemSchema = z.object({
  bookId: z.string().min(1),
  format: z.enum(['PAPERBACK', 'HARDCOVER', 'EBOOK', 'AUDIOBOOK']),
  quantity: z.number().min(1).max(10),
});

export const checkoutSchema = z.object({
  items: z.array(cartItemSchema).min(1, 'Cart cannot be empty'),
  shippingAddress: shippingAddressSchema.optional(),
});

// ===========================================
// REVIEW SCHEMAS
// ===========================================

export const reviewSchema = z.object({
  bookId: z.string().min(1),
  rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
  title: z.string().max(100, 'Title must be less than 100 characters').optional(),
  content: z.string().max(2000, 'Review must be less than 2000 characters').optional(),
});

// ===========================================
// AI SERVICE SCHEMAS
// ===========================================

export const aiGrammarCheckSchema = z.object({
  text: z.string().min(1, 'Text is required').max(50000, 'Text must be less than 50000 characters'),
});

export const aiBlurbGenerationSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(50),
  genre: z.array(z.string()),
  tone: z.enum(['professional', 'casual', 'dramatic', 'mysterious', 'humorous']).optional(),
});

export const aiCoverGenerationSchema = z.object({
  title: z.string().min(1),
  genre: z.string().min(1),
  style: z.enum(['photographic', 'illustrated', 'minimalist', 'typographic']),
  mood: z.string().min(1),
  elements: z.array(z.string()).optional(),
  colors: z.array(z.string()).optional(),
});

export const aiAudiobookConfigSchema = z.object({
  voiceId: z.string().min(1),
  emotionalIntensity: z.enum(['subtle', 'moderate', 'dramatic']),
  paceWPM: z.number().min(100).max(250),
  pauseLength: z.enum(['short', 'medium', 'long']),
});

// ===========================================
// CONTACT SCHEMA
// ===========================================

export const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
});

// ===========================================
// TYPE EXPORTS
// ===========================================

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type AuthorProfileInput = z.infer<typeof authorProfileSchema>;
export type AuthorComplianceInput = z.infer<typeof authorComplianceSchema>;
export type BankDetailsInput = z.infer<typeof bankDetailsSchema>;
export type ManuscriptInput = z.infer<typeof manuscriptSchema>;
export type BookInput = z.infer<typeof bookSchema>;
export type BookFormatPriceInput = z.infer<typeof bookFormatPriceSchema>;
export type ShippingAddressInput = z.infer<typeof shippingAddressSchema>;
export type CartItemInput = z.infer<typeof cartItemSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
