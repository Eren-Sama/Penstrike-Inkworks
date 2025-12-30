'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  FileText,
  User,
  Calendar,
  BookOpen,
  CheckCircle,
  XCircle,
  ChatCircle,
  DownloadSimple,
  Clock,
  Tag
} from '@phosphor-icons/react';
import { Button } from '@/components/ui';

// Mock manuscript data
const manuscript = {
  id: 1,
  title: 'The Last Horizon',
  author: 'A.M. Sterling',
  email: 'am.sterling@example.com',
  submitted: '2024-12-17',
  wordCount: 95000,
  genre: 'Science Fiction',
  status: 'REVIEW',
  synopsis: `In a world where the sun is dying and humanity has retreated underground, one scientist discovers a way to reignite the star. But the solution requires a sacrifice that could tear apart the fabric of society itself.

Dr. Elena Vasquez has spent her entire career studying the dying sun, watching as its light grows dimmer each year. When she stumbles upon an ancient technology that could save humanity, she faces an impossible choice: save billions of lives at the cost of destroying the very essence of what makes us human.

As factions form and civil war looms, Elena must navigate a treacherous political landscape while racing against time to implement her discovery. But some secrets are better left buried, and the truth behind the sun's demise may be more terrifying than anyone imagined.`,
  chapters: [
    { number: 1, title: 'The Fading Light', wordCount: 4500 },
    { number: 2, title: 'Underground', wordCount: 5200 },
    { number: 3, title: 'The Discovery', wordCount: 4800 },
    { number: 4, title: 'Whispers of Hope', wordCount: 5100 },
    { number: 5, title: 'The Council', wordCount: 4900 },
  ],
  reviews: [
    { reviewer: 'Editor A', date: '2024-12-18', comment: 'Compelling premise with strong world-building. Recommend approval with minor revisions.', rating: 4 },
  ]
};

export default function ManuscriptReviewPage() {
  const [feedback, setFeedback] = useState('');
  const [decision, setDecision] = useState<'approve' | 'reject' | null>(null);

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/manuscripts"
          className="p-2 rounded-lg border border-parchment-200 text-ink-500 hover:bg-parchment-50 transition-colors"
        >
          <ArrowLeft weight="bold" className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <h1 className="font-serif text-3xl font-bold text-ink-900">{manuscript.title}</h1>
          <p className="text-ink-600 mt-1">Manuscript Review</p>
        </div>
        <span className="px-4 py-2 rounded-full bg-amber-100 text-amber-700 text-sm font-semibold">
          {manuscript.status}
        </span>
      </div>

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

          {/* Chapter List */}
          <div className="rounded-2xl bg-white border border-parchment-200 shadow-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-xl font-bold text-ink-900">Chapters</h2>
              <Button variant="outline" className="gap-2">
                <DownloadSimple weight="bold" className="h-4 w-4" />
                Download Full Manuscript
              </Button>
            </div>
            <div className="space-y-3">
              {manuscript.chapters.map((chapter, index) => (
                <div 
                  key={chapter.number}
                  className="flex items-center justify-between p-4 rounded-xl bg-parchment-50 hover:bg-parchment-100 transition-colors animate-fade-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-full bg-ink-900 text-white text-sm font-medium flex items-center justify-center">
                      {chapter.number}
                    </span>
                    <span className="font-medium text-ink-900">{chapter.title}</span>
                  </div>
                  <span className="text-sm text-ink-500">{chapter.wordCount.toLocaleString()} words</span>
                </div>
              ))}
            </div>
          </div>

          {/* Review Feedback */}
          <div className="rounded-2xl bg-white border border-parchment-200 shadow-card p-6">
            <h2 className="font-serif text-xl font-bold text-ink-900 mb-4">Your Review</h2>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Write your feedback for the author..."
              className="textarea w-full h-32 mb-4"
            />
            <div className="flex gap-4">
              <Button 
                variant="primary" 
                className={`flex-1 gap-2 ${decision === 'approve' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`}
                onClick={() => setDecision('approve')}
              >
                <CheckCircle weight="fill" className="h-5 w-5" />
                Approve Manuscript
              </Button>
              <Button 
                variant="outline" 
                className={`flex-1 gap-2 ${decision === 'reject' ? 'border-rose-500 text-rose-600' : ''}`}
                onClick={() => setDecision('reject')}
              >
                <XCircle weight="fill" className="h-5 w-5" />
                Reject
              </Button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Author Info */}
          <div className="rounded-2xl bg-white border border-parchment-200 shadow-card p-6">
            <h3 className="font-serif text-lg font-bold text-ink-900 mb-4">Author Information</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-yellow to-accent-amber flex items-center justify-center text-white font-semibold">
                  {manuscript.author.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-semibold text-ink-900">{manuscript.author}</p>
                  <p className="text-sm text-ink-500">{manuscript.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Manuscript Details */}
          <div className="rounded-2xl bg-white border border-parchment-200 shadow-card p-6">
            <h3 className="font-serif text-lg font-bold text-ink-900 mb-4">Details</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-ink-600">
                <Calendar weight="duotone" className="h-5 w-5 text-ink-400" />
                <span>Submitted: {manuscript.submitted}</span>
              </div>
              <div className="flex items-center gap-3 text-ink-600">
                <BookOpen weight="duotone" className="h-5 w-5 text-ink-400" />
                <span>{manuscript.wordCount.toLocaleString()} words</span>
              </div>
              <div className="flex items-center gap-3 text-ink-600">
                <Tag weight="duotone" className="h-5 w-5 text-ink-400" />
                <span>{manuscript.genre}</span>
              </div>
              <div className="flex items-center gap-3 text-ink-600">
                <FileText weight="duotone" className="h-5 w-5 text-ink-400" />
                <span>{manuscript.chapters.length} chapters</span>
              </div>
            </div>
          </div>

          {/* Previous Reviews */}
          {manuscript.reviews.length > 0 && (
            <div className="rounded-2xl bg-white border border-parchment-200 shadow-card p-6">
              <h3 className="font-serif text-lg font-bold text-ink-900 mb-4">Previous Reviews</h3>
              <div className="space-y-4">
                {manuscript.reviews.map((review, index) => (
                  <div key={index} className="p-4 rounded-xl bg-parchment-50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-ink-900">{review.reviewer}</span>
                      <span className="text-xs text-ink-500">{review.date}</span>
                    </div>
                    <p className="text-sm text-ink-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
