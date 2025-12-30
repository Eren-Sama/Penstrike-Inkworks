'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Image,
  Sparkle,
  MagicWand,
  DownloadSimple,
  ArrowsClockwise,
  Heart,
  CheckCircle,
  Palette,
  TextT,
  Stack,
  BookOpen,
  Feather,
  Sword,
  Rocket,
  Skull,
  type Icon
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';

const styles: { id: string; name: string; icon: Icon; color: string }[] = [
  { id: 'modern', name: 'Modern Minimalist', icon: Palette, color: 'from-slate-500 to-slate-700' },
  { id: 'fantasy', name: 'Epic Fantasy', icon: Sword, color: 'from-purple-500 to-indigo-600' },
  { id: 'romance', name: 'Romantic', icon: Heart, color: 'from-pink-500 to-rose-500' },
  { id: 'thriller', name: 'Dark Thriller', icon: Skull, color: 'from-gray-700 to-gray-900' },
  { id: 'scifi', name: 'Sci-Fi', icon: Rocket, color: 'from-cyan-500 to-blue-600' },
  { id: 'literary', name: 'Literary Fiction', icon: Feather, color: 'from-amber-500 to-orange-600' },
];

const colorSchemes = [
  { id: 'warm', name: 'Warm', colors: ['#F59E0B', '#EF4444', '#F97316'] },
  { id: 'cool', name: 'Cool', colors: ['#3B82F6', '#6366F1', '#8B5CF6'] },
  { id: 'nature', name: 'Nature', colors: ['#10B981', '#059669', '#14B8A6'] },
  { id: 'dark', name: 'Dark', colors: ['#1F2937', '#374151', '#4B5563'] },
  { id: 'pastel', name: 'Pastel', colors: ['#F9A8D4', '#A5B4FC', '#99F6E4'] },
];

export default function CoverDesignerPage() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('modern');
  const [selectedColors, setSelectedColors] = useState('warm');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCovers, setGeneratedCovers] = useState<number[]>([]);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedCovers([1, 2, 3, 4]);
      setIsGenerating(false);
    }, 2000);
  };

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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
              <Image weight="duotone" className="h-5 w-5 text-white" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-ink-900">AI Cover Designer</h1>
          </div>
          <p className="text-ink-600 mt-1">Generate stunning book covers in seconds</p>
        </div>
        <span className="px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-semibold">
          5 credits/generation
        </span>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Settings Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Book Details */}
          <div className="rounded-2xl bg-white border border-parchment-200 shadow-card p-6">
            <h2 className="font-serif text-lg font-bold text-ink-900 mb-4 flex items-center gap-2">
              <TextT weight="duotone" className="h-5 w-5 text-ink-400" />
              Book Details
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-2">Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Your book title"
                  className="input w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-2">Author Name *</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Author name"
                  className="input w-full"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-ink-700 mb-2">Subtitle (Optional)</label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="A captivating subtitle"
                  className="input w-full"
                />
              </div>
            </div>
          </div>

          {/* Style Selection */}
          <div className="rounded-2xl bg-white border border-parchment-200 shadow-card p-6">
            <h2 className="font-serif text-lg font-bold text-ink-900 mb-4 flex items-center gap-2">
              <Stack weight="duotone" className="h-5 w-5 text-ink-400" />
              Cover Style
            </h2>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {styles.map((style) => {
                const StyleIcon = style.icon;
                return (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyle(style.id)}
                    className={cn(
                      'p-4 rounded-xl border-2 transition-all duration-300 text-center group',
                      selectedStyle === style.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-parchment-200 hover:border-parchment-300'
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 mx-auto mb-2 rounded-lg bg-gradient-to-br flex items-center justify-center",
                      style.color,
                      "group-hover:scale-110 transition-transform duration-300"
                    )}>
                      <StyleIcon weight="duotone" className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xs font-medium text-ink-700">{style.name}</span>
                    {selectedStyle === style.id && (
                      <CheckCircle weight="fill" className="h-4 w-4 text-purple-500 mx-auto mt-2" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Scheme */}
          <div className="rounded-2xl bg-white border border-parchment-200 shadow-card p-6">
            <h2 className="font-serif text-lg font-bold text-ink-900 mb-4 flex items-center gap-2">
              <Palette weight="duotone" className="h-5 w-5 text-ink-400" />
              Color Scheme
            </h2>
            <div className="flex flex-wrap gap-3">
              {colorSchemes.map((scheme) => (
                <button
                  key={scheme.id}
                  onClick={() => setSelectedColors(scheme.id)}
                  className={cn(
                    'px-4 py-3 rounded-xl border-2 transition-all duration-300 flex items-center gap-3',
                    selectedColors === scheme.id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-parchment-200 hover:border-parchment-300'
                  )}
                >
                  <div className="flex -space-x-1">
                    {scheme.colors.map((color, i) => (
                      <div
                        key={i}
                        className="w-5 h-5 rounded-full border-2 border-white"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-ink-700">{scheme.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Prompt */}
          <div className="rounded-2xl bg-white border border-parchment-200 shadow-card p-6">
            <h2 className="font-serif text-lg font-bold text-ink-900 mb-4 flex items-center gap-2">
              <MagicWand weight="duotone" className="h-5 w-5 text-ink-400" />
              Custom Description (Optional)
            </h2>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe specific elements you want on your cover... (e.g., 'A mysterious castle on a cliff at sunset with a dragon silhouette in the sky')"
              className="textarea w-full h-24"
            />
          </div>

          {/* Generate Button */}
          <Button 
            variant="primary" 
            className="w-full gap-2 h-14 text-lg"
            onClick={handleGenerate}
            disabled={!title || !author || isGenerating}
          >
            {isGenerating ? (
              <>
                <ArrowsClockwise weight="bold" className="h-5 w-5 animate-spin" />
                Generating Covers...
              </>
            ) : (
              <>
                <Sparkle weight="duotone" className="h-5 w-5" />
                Generate 4 Cover Variations
              </>
            )}
          </Button>
        </div>

        {/* Preview Panel */}
        <div className="space-y-6">
          {/* Preview */}
          <div className="rounded-2xl bg-white border border-parchment-200 shadow-card p-6">
            <h3 className="font-serif text-lg font-bold text-ink-900 mb-4">Preview</h3>
            <div className="aspect-[2/3] rounded-xl bg-gradient-to-br from-purple-600 to-indigo-700 flex flex-col items-center justify-center text-white p-6 text-center">
              <BookOpen weight="duotone" className="h-12 w-12 mb-4 opacity-50" />
              <h4 className="font-serif text-xl font-bold mb-2">{title || 'Your Title'}</h4>
              {subtitle && <p className="text-sm opacity-80 mb-4">{subtitle}</p>}
              <p className="text-sm">{author || 'Author Name'}</p>
            </div>
          </div>

          {/* Generated Covers */}
          {generatedCovers.length > 0 && (
            <div className="rounded-2xl bg-white border border-parchment-200 shadow-card p-6">
              <h3 className="font-serif text-lg font-bold text-ink-900 mb-4">Generated Covers</h3>
              <div className="grid grid-cols-2 gap-3">
                {generatedCovers.map((_, index) => (
                  <div
                    key={index}
                    className="aspect-[2/3] rounded-xl bg-gradient-to-br from-ink-700 to-ink-900 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-purple-500 transition-all animate-fade-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <span className="text-white/50 text-xs">Cover {index + 1}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" className="flex-1 gap-2">
                  <Heart weight="duotone" className="h-4 w-4" />
                  Save
                </Button>
                <Button variant="primary" className="flex-1 gap-2">
                  <DownloadSimple weight="bold" className="h-4 w-4" />
                  Download
                </Button>
              </div>
            </div>
          )}

          {/* Tips */}
          <div className="rounded-2xl bg-purple-50 border border-purple-200 p-6">
            <h3 className="font-serif text-lg font-bold text-purple-900 mb-3">Pro Tips</h3>
            <ul className="space-y-2 text-sm text-purple-700">
              <li>• Keep titles short for better readability</li>
              <li>• Choose colors that match your genre</li>
              <li>• High contrast improves thumbnail visibility</li>
              <li>• Test on both light and dark backgrounds</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
