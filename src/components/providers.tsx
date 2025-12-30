'use client';

import { ThemeProvider } from 'next-themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { useState } from 'react';
import { AuthProvider } from '@/lib/auth/AuthContext';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <Toaster
            position="top-right"
            expand={false}
            richColors
            closeButton
            toastOptions={{
            style: {
              fontFamily: 'var(--font-sans)',
            },
            classNames: {
              toast: 'bg-white border-parchment-200',
              title: 'text-ink-900 font-medium',
              description: 'text-ink-600',
              actionButton: 'bg-ink-900 text-white',
              cancelButton: 'bg-parchment-200 text-ink-700',
            },
          }}
        />
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
