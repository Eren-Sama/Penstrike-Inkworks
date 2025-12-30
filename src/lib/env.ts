import { z } from 'zod';

/**
 * Environment variable validation schema
 * App will fail fast at startup if any required variable is missing or invalid
 */

// Schema for client-side (public) environment variables
const clientEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .url('NEXT_PUBLIC_SUPABASE_URL must be a valid URL'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .min(1, 'NEXT_PUBLIC_SUPABASE_ANON_KEY is required'),
  NEXT_PUBLIC_USE_MOCK_DATA: z
    .string()
    .transform((val) => val === 'true')
    .pipe(z.boolean())
    .optional()
    .default('false'),
  NEXT_PUBLIC_SENTRY_DSN: z
    .string()
    .url()
    .optional(),
});

// Schema for server-side environment variables (includes client vars)
const serverEnvSchema = clientEnvSchema.extend({
  SUPABASE_SERVICE_ROLE_KEY: z
    .string()
    .min(1, 'SUPABASE_SERVICE_ROLE_KEY is required'),
});

// Type definitions
export type ClientEnv = z.infer<typeof clientEnvSchema>;
export type ServerEnv = z.infer<typeof serverEnvSchema>;

/**
 * Validates and returns client-side environment variables
 * Safe to use in browser and server components
 */
function validateClientEnv(): ClientEnv {
  const result = clientEnvSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_USE_MOCK_DATA: process.env.NEXT_PUBLIC_USE_MOCK_DATA,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  });

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    const errorMessages = Object.entries(errors)
      .map(([key, messages]) => `  ${key}: ${messages?.join(', ')}`)
      .join('\n');
    
    throw new Error(
      `❌ Invalid client environment variables:\n${errorMessages}\n\n` +
      'Please check your .env.local file and ensure all required variables are set.'
    );
  }

  return result.data;
}

/**
 * Validates and returns server-side environment variables
 * Only use in server components, server actions, or API routes
 */
function validateServerEnv(): ServerEnv {
  // Server env validation only runs on the server
  if (typeof window !== 'undefined') {
    throw new Error(
      'validateServerEnv() was called on the client. ' +
      'Server environment variables should only be accessed on the server.'
    );
  }

  const result = serverEnvSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_USE_MOCK_DATA: process.env.NEXT_PUBLIC_USE_MOCK_DATA,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  });

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    const errorMessages = Object.entries(errors)
      .map(([key, messages]) => `  ${key}: ${messages?.join(', ')}`)
      .join('\n');
    
    throw new Error(
      `❌ Invalid server environment variables:\n${errorMessages}\n\n` +
      'Please check your .env.local file and ensure all required variables are set.'
    );
  }

  return result.data;
}

// Lazy-loaded validated environment (validates on first access)
let _clientEnv: ClientEnv | null = null;
let _serverEnv: ServerEnv | null = null;

/**
 * Client environment variables (safe for browser)
 * Validates on first access and caches the result
 */
export function getClientEnv(): ClientEnv {
  if (!_clientEnv) {
    _clientEnv = validateClientEnv();
  }
  return _clientEnv;
}

/**
 * Server environment variables (server-only)
 * Validates on first access and caches the result
 */
export function getServerEnv(): ServerEnv {
  if (!_serverEnv) {
    _serverEnv = validateServerEnv();
  }
  return _serverEnv;
}

/**
 * Check if mock data mode is enabled
 * Safe to use anywhere
 */
export function isUsingMockData(): boolean {
  return getClientEnv().NEXT_PUBLIC_USE_MOCK_DATA;
}
