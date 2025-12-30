// This file configures the initialization of Sentry for edge features (Middleware, Edge Routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
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

    // Filter sensitive data
    beforeSend(event) {
      // Remove headers that might contain auth tokens
      if (event.request?.headers) {
        delete event.request.headers['authorization'];
        delete event.request.headers['cookie'];
      }
      return event;
    },

    // Tag environment
    initialScope: {
      tags: {
        environment: process.env.NODE_ENV,
        mock_mode: IS_MOCK_MODE ? 'true' : 'false',
        runtime: 'edge',
      },
    },
  });
}
