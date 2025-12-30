import type { Metadata } from 'next';
import { Inter, Playfair_Display, Cormorant_Garamond } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageTransitionWrapper, ScrollToTop, MainContent } from '@/components/ui/PageTransition';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Penstrike Inkworks | Author-First Publishing Platform',
    template: '%s | Penstrike Inkworks',
  },
  description:
    'Penstrike Inkworks is an author-first publishing platform. Create, edit, design, publish, and sell your books while retaining 100% ownership of your work.',
  keywords: [
    'publishing platform',
    'self-publishing',
    'author platform',
    'book publishing',
    'ebook publishing',
    'audiobook creation',
    'AI publishing tools',
    'author royalties',
    'sustainable publishing',
  ],
  authors: [{ name: 'Penstrike Inkworks' }],
  creator: 'Penstrike Inkworks',
  publisher: 'Penstrike Inkworks',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://penstrike.com',
    siteName: 'Penstrike Inkworks',
    title: 'Penstrike Inkworks | Author-First Publishing Platform',
    description:
      'Create, edit, design, publish, and sell your books while retaining 100% ownership.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Penstrike Inkworks',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Penstrike Inkworks | Author-First Publishing Platform',
    description:
      'Create, edit, design, publish, and sell your books while retaining 100% ownership.',
    images: ['/og-image.jpg'],
    creator: '@penstrike',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} ${cormorant.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-parchment-50 font-sans antialiased">
        <Providers>
          <ScrollToTop />
          <Header />
          <PageTransitionWrapper>
            <MainContent>
              {children}
            </MainContent>
          </PageTransitionWrapper>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
