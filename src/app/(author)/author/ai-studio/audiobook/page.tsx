'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Microphone,
  Play,
  Pause,
  UploadSimple,
  DownloadSimple,
  ArrowsClockwise,
  CheckCircle,
  Clock,
  SpeakerHigh,
  User,
  Sparkle,
  FileText
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';

const voices = [
  { id: 'david', name: 'David', type: 'Male', accent: 'American', style: 'Warm & Engaging', color: 'from-blue-500 to-indigo-600' },
  { id: 'sophia', name: 'Sophia', type: 'Female', accent: 'British', style: 'Elegant & Clear', color: 'from-purple-500 to-pink-500' },
  { id: 'michael', name: 'Michael', type: 'Male', accent: 'British', style: 'Deep & Authoritative', color: 'from-slate-600 to-slate-800' },
  { id: 'emma', name: 'Emma', type: 'Female', accent: 'American', style: 'Friendly & Natural', color: 'from-amber-500 to-orange-500' },
  { id: 'james', name: 'James', type: 'Male', accent: 'Australian', style: 'Casual & Relaxed', color: 'from-emerald-500 to-teal-600' },
  { id: 'olivia', name: 'Olivia', type: 'Female', accent: 'Irish', style: 'Melodic & Soothing', color: 'from-rose-500 to-pink-600' },
];

const manuscripts = [
  { id: 1, title: 'The Crystal Kingdom', wordCount: 88000, chapters: 24 },
  { id: 2, title: 'Whispers in the Dark', wordCount: 65000, chapters: 18 },
  { id: 3, title: 'Rising Dawn', wordCount: 42000, chapters: 12 },
];

export default function AudiobookCreatorPage() {
  const [selectedManuscript, setSelectedManuscript] = useState<number | null>(null);
  const [selectedVoice, setSelectedVoice] = useState('sophia');
  const [speed, setSpeed] = useState(1.0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);

  const handleGenerate = () => {
    if (!selectedManuscript) return;
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 3000);
  };

  const estimatedTime = selectedManuscript 
    ? Math.round((manuscripts.find(m => m.id === selectedManuscript)?.wordCount || 0) / 150 / 60) 
    : 0;

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link 
          href="/author/ai-studio"
          className="p-2 rounded-lg border border-parchment-200 text-ink-500 hover:bg-parchment-50 transition-colors"
        >
          <ArrowLeft weight="bold" className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center">
              <Microphone weight="duotone" className="h-5 w-5 text-white" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-ink-900">AI Audiobook Creator</h1>
          </div>
          <p className="text-ink-600 mt-1">Transform your manuscript into a professional audiobook</p>
        </div>
        <span className="px-4 py-2 rounded-full bg-rose-100 text-rose-700 text-sm font-semibold">
          20 credits/book
        </span>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Select Manuscript */}
          <div className="rounded-2xl bg-white border border-parchment-200 shadow-card p-6">
            <h2 className="font-serif text-lg font-bold text-ink-900 mb-4 flex items-center gap-2">
              <FileText weight="duotone" className="h-5 w-5 text-ink-400" />
              Select Manuscript
            </h2>
            <div className="space-y-3">
              {manuscripts.map((ms, index) => (
                <button
                  key={ms.id}
                  onClick={() => setSelectedManuscript(ms.id)}
                  className={cn(
                    'w-full p-4 rounded-xl border-2 transition-all duration-300 text-left flex items-center justify-between animate-fade-up',
                    selectedManuscript === ms.id
                      ? 'border-rose-500 bg-rose-50'
                      : 'border-parchment-200 hover:border-parchment-300'
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div>
                    <h3 className="font-semibold text-ink-900">{ms.title}</h3>
                    <p className="text-sm text-ink-500">{ms.wordCount.toLocaleString()} words • {ms.chapters} chapters</p>
                  </div>
                  {selectedManuscript === ms.id && (
                    <CheckCircle weight="fill" className="h-5 w-5 text-rose-500" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Voice Selection */}
          <div className="rounded-2xl bg-white border border-parchment-200 shadow-card p-6">
            <h2 className="font-serif text-lg font-bold text-ink-900 mb-4 flex items-center gap-2">
              <User weight="duotone" className="h-5 w-5 text-ink-400" />
              Choose Narrator Voice
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {voices.map((voice, index) => (
                <button
                  key={voice.id}
                  onClick={() => setSelectedVoice(voice.id)}
                  className={cn(
                    'p-4 rounded-xl border-2 transition-all duration-300 text-left animate-fade-up',
                    selectedVoice === voice.id
                      ? 'border-rose-500 bg-rose-50'
                      : 'border-parchment-200 hover:border-parchment-300'
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-ink-900">{voice.name}</span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setPlayingVoice(playingVoice === voice.id ? null : voice.id);
                      }}
                      className="p-1.5 rounded-lg bg-parchment-100 hover:bg-parchment-200 transition-colors"
                    >
                      {playingVoice === voice.id ? (
                        <Pause weight="fill" className="h-4 w-4 text-ink-700" />
                      ) : (
                        <Play weight="fill" className="h-4 w-4 text-ink-700" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-ink-500">{voice.type} • {voice.accent}</p>
                  <p className="text-xs text-ink-400 mt-1">{voice.style}</p>
                  {selectedVoice === voice.id && (
                    <CheckCircle weight="fill" className="h-4 w-4 text-rose-500 mt-2" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Speed Control */}
          <div className="rounded-2xl bg-white border border-parchment-200 shadow-card p-6">
            <h2 className="font-serif text-lg font-bold text-ink-900 mb-4 flex items-center gap-2">
              <SpeakerHigh weight="duotone" className="h-5 w-5 text-ink-400" />
              Narration Speed
            </h2>
            <div className="flex items-center gap-4">
              <span className="text-sm text-ink-500">0.5x</span>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="flex-1 h-2 bg-parchment-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
              />
              <span className="text-sm text-ink-500">2x</span>
              <span className="ml-4 px-3 py-1 rounded-lg bg-parchment-100 text-ink-900 font-medium">
                {speed}x
              </span>
            </div>
          </div>

          {/* Generate Button */}
          <Button 
            variant="primary" 
            className="w-full gap-2 h-14 text-lg bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700"
            onClick={handleGenerate}
            disabled={!selectedManuscript || isGenerating}
          >
            {isGenerating ? (
              <>
                <ArrowsClockwise weight="bold" className="h-5 w-5 animate-spin" />
                Creating Audiobook...
              </>
            ) : (
              <>
                <Sparkle weight="duotone" className="h-5 w-5" />
                Create Audiobook
              </>
            )}
          </Button>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Summary */}
          <div className="rounded-2xl bg-white border border-parchment-200 shadow-card p-6">
            <h3 className="font-serif text-lg font-bold text-ink-900 mb-4">Summary</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-parchment-100">
                <span className="text-ink-600">Manuscript</span>
                <span className="font-medium text-ink-900">
                  {selectedManuscript ? manuscripts.find(m => m.id === selectedManuscript)?.title : 'Not selected'}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-parchment-100">
                <span className="text-ink-600">Voice</span>
                <span className="font-medium text-ink-900">
                  {voices.find(v => v.id === selectedVoice)?.name}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-parchment-100">
                <span className="text-ink-600">Speed</span>
                <span className="font-medium text-ink-900">{speed}x</span>
              </div>
              {selectedManuscript && (
                <div className="flex items-center justify-between py-2">
                  <span className="text-ink-600">Est. Length</span>
                  <span className="font-medium text-ink-900">~{estimatedTime} hours</span>
                </div>
              )}
            </div>
          </div>

          {/* Processing Time */}
          <div className="rounded-2xl bg-rose-50 border border-rose-200 p-6">
            <div className="flex items-center gap-2 mb-2">
              <Clock weight="duotone" className="h-5 w-5 text-rose-600" />
              <span className="font-semibold text-rose-900">Processing Time</span>
            </div>
            <p className="text-sm text-rose-700">
              Audiobook generation typically takes 2-4 hours for full-length novels. You'll receive an email when it's ready.
            </p>
          </div>

          {/* Credits Info */}
          <div className="rounded-2xl bg-white border border-parchment-200 shadow-card p-6">
            <h3 className="font-serif text-lg font-bold text-ink-900 mb-4">Credits</h3>
            <div className="flex items-center justify-between mb-3">
              <span className="text-ink-600">Your Balance</span>
              <span className="font-bold text-ink-900">24 credits</span>
            </div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-ink-600">This Audiobook</span>
              <span className="font-bold text-rose-600">-20 credits</span>
            </div>
            <div className="h-px bg-parchment-200 my-3" />
            <div className="flex items-center justify-between">
              <span className="text-ink-600">Remaining</span>
              <span className="font-bold text-ink-900">4 credits</span>
            </div>
          </div>

          {/* Features */}
          <div className="rounded-2xl bg-white border border-parchment-200 shadow-card p-6">
            <h3 className="font-serif text-lg font-bold text-ink-900 mb-4">What You Get</h3>
            <ul className="space-y-3">
              {[
                'Professional AI narration',
                'Chapter markers included',
                'MP3 & M4B formats',
                'Retail-quality audio',
                'Unlimited revisions',
              ].map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-ink-600">
                  <CheckCircle weight="fill" className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
