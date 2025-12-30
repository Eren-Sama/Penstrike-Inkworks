// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
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

    // Enable replay only in production
    replaysOnErrorSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,

    integrations: [
      Sentry.replayIntegration({
        // Mask all text and block all media to protect PII
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],

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
      }

      // Filter out breadcrumbs that might contain sensitive data
      if (event.breadcrumbs) {
        event.breadcrumbs = event.breadcrumbs.filter(breadcrumb => {
          // Filter out console logs that might contain sensitive data
          if (breadcrumb.category === 'console' && breadcrumb.message) {
            const msg = breadcrumb.message.toLowerCase();
            if (msg.includes('token') || msg.includes('key') || msg.includes('password')) {
              return false;
            }
          }
          return true;
        });
      }

      return event;
    },

    // Ignore certain errors that are not actionable
    ignoreErrors: [
      // Browser extensions
      'top.GLOBALS',
      'originalCreateNotification',
      'canvas.contentDocument',
      'MyApp_RemoveAllHighlights',
      'http://tt.teletrax.com',
      // Common browser errors
      'ResizeObserver loop limit exceeded',
      'ResizeObserver loop completed with undelivered notifications',
      // Network errors that user can retry
      'Network request failed',
      'Failed to fetch',
      'Load failed',
    ],

    // Tag mock mode errors if they somehow get through
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
