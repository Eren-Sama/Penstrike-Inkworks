'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  FileText,
  Eye,
  PencilLine,
  DownloadSimple,
  BookOpen,
  Calendar,
  Tag,
  ChartBar,
  CurrencyDollar,
  Users,
  Star,
  TrendUp,
  Chat,
  ShareNetwork
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';

// Mock manuscript data
const manuscript = {
  id: 1,
  title: 'The Crystal Kingdom',
  status: 'PUBLISHED',
  wordCount: 88000,
  publishedDate: '2024-12-10',
  genre: ['Fantasy', 'Adventure'],
  synopsis: `In the heart of a world where magic flows like rivers, young Aria discovers she is the heir to a kingdom that exists beyond the veil of reality. As dark forces gather to claim the Crystal Throne, she must embrace her destiny and unite the fractured realms.

With only a mysterious guide and an ancient artifact to aid her, Aria embarks on a journey through enchanted forests, treacherous mountains, and cities that float among the clouds. Along the way, she will forge unlikely alliances, face impossible choices, and discover that the greatest magic of all lies within.`,
  stats: {
    sales: 1250,
    revenue: 8750,
    readers: 3420,
    rating: 4.7,
    reviews: 156
  },
  recentReviews: [
    { author: 'BookLover123', rating: 5, text: 'Absolutely enchanting! Couldn\'t put it down.', date: '2024-12-18' },
    { author: 'FantasyFan', rating: 4, text: 'Great world-building and characters. Excited for the sequel!', date: '2024-12-15' },
  ]
};

const statusConfig: Record<string, { bg: string; text: string }> = {
  DRAFT: { bg: 'bg-gray-100', text: 'text-gray-700' },
  EDITING: { bg: 'bg-blue-100', text: 'text-blue-700' },
  REVIEW: { bg: 'bg-amber-100', text: 'text-amber-700' },
  PUBLISHED: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
};

export default function ManuscriptDetailPage() {
  const status = statusConfig[manuscript.status];

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link 
          href="/author/manuscripts"
          className="p-2 rounded-lg border border-parchment-200 text-ink-500 hover:bg-parchment-50 transition-colors"
        >
          <ArrowLeft weight="bold" className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-3xl font-bold text-ink-900">{manuscript.title}</h1>
            <span className={cn(
              'px-3 py-1 rounded-full text-xs font-semibold',
              status.bg, status.text
            )}>
              {manuscript.status}
            </span>
          </div>
          <p className="text-ink-600 mt-1">{manuscript.wordCount.toLocaleString()} words • Published {manuscript.publishedDate}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <ShareNetwork weight="duotone" className="h-4 w-4" />
            Share
          </Button>
          <Button variant="primary" className="gap-2">
            <ChartBar weight="duotone" className="h-4 w-4" />
            Analytics
          </Button>
        </div>
      </div>

      {/* Stats */}
      {manuscript.status === 'PUBLISHED' && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { label: 'Total Sales', value: manuscript.stats.sales.toLocaleString(), icon: BookOpen, color: 'from-blue-500 to-indigo-600' },
            { label: 'Revenue', value: `$${manuscript.stats.revenue.toLocaleString()}`, icon: CurrencyDollar, color: 'from-emerald-500 to-teal-600' },
            { label: 'Readers', value: manuscript.stats.readers.toLocaleString(), icon: Users, color: 'from-purple-500 to-pink-600' },
            { label: 'Rating', value: manuscript.stats.rating.toString(), icon: Star, color: 'from-amber-500 to-orange-600' },
            { label: 'Reviews', value: manuscript.stats.reviews.toString(), icon: Chat, color: 'from-rose-500 to-red-600' },
          ].map((stat, index) => (
            <div key={stat.label} className="rounded-2xl bg-white border border-parchment-200 shadow-card p-5 animate-fade-up" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-ink-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-ink-900 mt-1">{stat.value}</p>
                </div>
                <div className={cn('w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center', stat.color)}>
                  <stat.icon weight="duotone" className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Synopsis */}
          <div className="rounded-2xl bg-white border border-parchment-200 shadow-card p-6">
            <h2 className="font-serif text-xl font-bold text-ink-900 mb-4">Synopsis</h2>
            <div className="prose prose-ink max-w-none">
              {manuscript.synopsis.split('\n\n').map((paragraph, i) => (
                <p key={i} className="text-ink-700 leading-relaxed mb-4">{paragraph}</p>
              ))}
            </div>
          </div>

          {/* Recent Reviews */}
          {manuscript.status === 'PUBLISHED' && (
            <div className="rounded-2xl bg-white border border-parchment-200 shadow-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif text-xl font-bold text-ink-900">Recent Reviews</h2>
                <Link href="/author/analytics" className="text-sm text-accent-amber hover:underline">View All</Link>
              </div>
              <div className="space-y-4">
                {manuscript.recentReviews.map((review, index) => (
                  <div key={index} className="p-4 rounded-xl bg-parchment-50 animate-fade-up" style={{ animationDelay: `${index * 100}ms` }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-ink-900">{review.author}</span>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} weight="fill" className={cn('h-4 w-4', i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300')} />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-ink-600">{review.text}</p>
                    <p className="text-xs text-ink-400 mt-2">{review.date}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="rounded-2xl bg-white border border-parchment-200 shadow-card p-6">
            <h3 className="font-serif text-lg font-bold text-ink-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start gap-3">
                <Eye weight="bold" className="h-5 w-5" />
                Preview Book
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3">
                <DownloadSimple weight="bold" className="h-5 w-5" />
                Download Manuscript
              </Button>
              <Link href="/author/ai-studio/cover" className="block">
                <Button variant="outline" className="w-full justify-start gap-3">
                  <FileText weight="duotone" className="h-5 w-5" />
                  Generate New Cover
                </Button>
              </Link>
              <Link href="/author/analytics" className="block">
                <Button variant="outline" className="w-full justify-start gap-3">
                  <ChartBar weight="duotone" className="h-5 w-5" />
                  View Analytics
                </Button>
              </Link>
            </div>
          </div>

          {/* Details */}
          <div className="rounded-2xl bg-white border border-parchment-200 shadow-card p-6">
            <h3 className="font-serif text-lg font-bold text-ink-900 mb-4">Details</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-ink-600">
                <Calendar weight="duotone" className="h-5 w-5 text-ink-400" />
                <span>Published: {manuscript.publishedDate}</span>
              </div>
              <div className="flex items-center gap-3 text-ink-600">
                <BookOpen weight="duotone" className="h-5 w-5 text-ink-400" />
                <span>{manuscript.wordCount.toLocaleString()} words</span>
              </div>
              <div className="flex items-start gap-3 text-ink-600">
                <Tag weight="duotone" className="h-5 w-5 text-ink-400 mt-0.5" />
                <div className="flex flex-wrap gap-2">
                  {manuscript.genre.map((g) => (
                    <span key={g} className="px-2 py-1 rounded bg-parchment-100 text-ink-700 text-xs">{g}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sales Chart Placeholder */}
          {manuscript.status === 'PUBLISHED' && (
            <div className="rounded-2xl bg-white border border-parchment-200 shadow-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-lg font-bold text-ink-900">Sales Trend</h3>
                <TrendUp weight="duotone" className="h-5 w-5 text-emerald-500" />
              </div>
              <div className="h-32 bg-parchment-50 rounded-xl flex items-center justify-center">
                <p className="text-sm text-ink-500">Sales chart visualization</p>
              </div>
              <p className="text-sm text-emerald-600 mt-3 font-medium">↑ 12% from last month</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
