// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;
const IS_MOCK_MODE = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

// Only initialize Sentry if DSN is provided and not in mock mode
if (SENTRY_DSN && !IS_MOCK_MODE) {
  Sentry.init({
    dsn: SENTRY_DSN,

    // Adjust this value in production, or use tracesSampler for greater control
    tracesSampleRate: 0.1,

    // Setting this option to true will print useful information to the console while you're setting up Sentry.
    debug: false,

    // Filter out sensitive data before sending to Sentry
    beforeSend(event) {
      // Remove any potential PII from the event
      if (event.user) {
        // Hash or remove user identifiers
        event.user = {
          id: event.user.id ? hashUserId(String(event.user.id)) : undefined,
          // Don't send email, username, or ip_address
        };
      }

      // Remove any sensitive headers
      if (event.request?.headers) {
        delete event.request.headers['authorization'];
        delete event.request.headers['cookie'];
        delete event.request.headers['x-api-key'];
        delete event.request.headers['x-supabase-auth'];
      }

      // Remove any potentially sensitive data from extras
      if (event.extra) {
        const sensitiveKeys = ['token', 'key', 'password', 'secret', 'auth'];
        for (const key of Object.keys(event.extra)) {
          if (sensitiveKeys.some(s => key.toLowerCase().includes(s))) {
            delete event.extra[key];
          }
        }
      }

      return event;
    },

    // Ignore certain errors that are not actionable
    ignoreErrors: [
      // Network errors
      'Network request failed',
      'Failed to fetch',
      'ECONNREFUSED',
      'ENOTFOUND',
      // Supabase rate limits (handled gracefully)
      'rate limit exceeded',
    ],

    // Tag environment
    initialScope: {
      tags: {
        environment: process.env.NODE_ENV,
        mock_mode: IS_MOCK_MODE ? 'true' : 'false',
      },
    },
  });
}

/**
 * Simple hash function to anonymize user IDs
 */
function hashUserId(userId: string): string {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    const char = userId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return `user_${Math.abs(hash).toString(16)}`;
}
