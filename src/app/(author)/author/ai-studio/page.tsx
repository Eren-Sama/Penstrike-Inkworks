'use client';

import { useState, useEffect } from 'react';
import {
  Sparkle,
  MagicWand,
  BookOpen,
  Image,
  Headphones,
  FileText,
  ArrowRight,
  Check,
  CircleNotch,
  Copy,
  ArrowsClockwise
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { Button, Textarea, Input } from '@/components/ui';
import { getAICreditsState } from '@/lib/data';
import type { AICreditsState } from '@/lib/data';

const aiTools = [
  {
    id: 'grammar',
    name: 'Grammar & Style Check',
    description: 'AI-powered proofreading to polish your prose',
    icon: FileText,
    credits: 1,
  },
  {
    id: 'blurb',
    name: 'Blurb Generator',
    description: 'Create compelling book descriptions that sell',
    icon: BookOpen,
    credits: 2,
  },
  {
    id: 'cover',
    name: 'Cover Design',
    description: 'Generate professional book cover concepts',
    icon: Image,
    credits: 5,
  },
  {
    id: 'audiobook',
    name: 'Audiobook Preview',
    description: 'Create AI-narrated audio previews',
    icon: Headphones,
    credits: 10,
  },
];

const voices = [
  { id: 'james', name: 'James', description: 'Warm male narrator', sample: true },
  { id: 'emma', name: 'Emma', description: 'Clear female narrator', sample: true },
  { id: 'oliver', name: 'Oliver', description: 'British male narrator', sample: true },
  { id: 'sophia', name: 'Sophia', description: 'American female narrator', sample: true },
  { id: 'william', name: 'William', description: 'Deep male narrator', sample: true },
];

const coverStyles = [
  'Minimalist',
  'Illustrated',
  'Photographic',
  'Typography-focused',
  'Fantasy/Epic',
  'Romance',
  'Thriller/Mystery',
  'Vintage/Retro',
];

export default function AIStudioPage() {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [aiCredits, setAiCredits] = useState<AICreditsState>({ creditsUsed: 0, totalCredits: 0, isAvailable: false });
  
  // Form states
  const [textInput, setTextInput] = useState('');
  const [blurbInput, setBlurbInput] = useState({ title: '', genre: '', synopsis: '' });
  const [coverInput, setCoverInput] = useState({ title: '', genre: '', style: '', mood: '' });
  const [selectedVoice, setSelectedVoice] = useState('james');

  // Fetch AI credits from data layer
  useEffect(() => {
    async function fetchCredits() {
      const credits = await getAICreditsState();
      setAiCredits(credits);
    }
    fetchCredits();
  }, []);

  // Use credits from state (data layer aware)
  const creditsUsed = aiCredits.creditsUsed;
  const totalCredits = aiCredits.totalCredits;
  const creditsAvailable = aiCredits.isAvailable;
  const remainingCredits = totalCredits - creditsUsed;

  const handleProcess = async () => {
    // Check if AI credits are available
    if (!creditsAvailable || remainingCredits <= 0) {
      setResult('AI features are not yet available. Please check back later or upgrade your plan.');
      return;
    }
    
    setIsProcessing(true);
    setResult(null);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock results
    if (selectedTool === 'grammar') {
      setResult('Your text has been analyzed. Found 3 grammar suggestions and 2 style improvements. The overall readability score is 85/100.');
    } else if (selectedTool === 'blurb') {
      setResult(`In the shadows of ${blurbInput.title || 'an unnamed tale'}, secrets lurk and destinies intertwine. When fate brings together unlikely heroes, they must face impossible choices that will determine the course of history.\n\nA gripping ${blurbInput.genre || 'story'} that will keep you on the edge of your seat until the very last page.`);
    } else if (selectedTool === 'cover') {
      setResult('Cover concepts generated! View 4 unique design variations based on your specifications.');
    } else if (selectedTool === 'audiobook') {
      setResult('Audio preview generated! 5-minute sample narrated by ' + voices.find(v => v.id === selectedVoice)?.name + '.');
    }
    
    setIsProcessing(false);
  };

  const renderToolContent = () => {
    switch (selectedTool) {
      case 'grammar':
        return (
          <div className="space-y-4">
            <Textarea
              label="Paste your text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Paste a paragraph or chapter for AI analysis..."
              rows={10}
            />
            <p className="text-sm text-ink-500">
              Tip: For best results, submit 500-2000 words at a time.
            </p>
          </div>
        );
      
      case 'blurb':
        return (
          <div className="space-y-4">
            <Input
              label="Book Title"
              value={blurbInput.title}
              onChange={(e) => setBlurbInput(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter your book title"
            />
            <Input
              label="Genre"
              value={blurbInput.genre}
              onChange={(e) => setBlurbInput(prev => ({ ...prev, genre: e.target.value }))}
              placeholder="e.g., Fantasy, Romance, Thriller"
            />
            <Textarea
              label="Brief Synopsis"
              value={blurbInput.synopsis}
              onChange={(e) => setBlurbInput(prev => ({ ...prev, synopsis: e.target.value }))}
              placeholder="Describe your book's main plot, characters, and themes..."
              rows={5}
            />
          </div>
        );
      
      case 'cover':
        return (
          <div className="space-y-4">
            <Input
              label="Book Title"
              value={coverInput.title}
              onChange={(e) => setCoverInput(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter your book title"
            />
            <Input
              label="Genre"
              value={coverInput.genre}
              onChange={(e) => setCoverInput(prev => ({ ...prev, genre: e.target.value }))}
              placeholder="e.g., Fantasy, Romance, Thriller"
            />
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-2">
                Cover Style
              </label>
              <div className="flex flex-wrap gap-2">
                {coverStyles.map((style) => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => setCoverInput(prev => ({ ...prev, style }))}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                      coverInput.style === style
                        ? 'bg-ink-900 text-white'
                        : 'bg-parchment-200 text-ink-700 hover:bg-parchment-300'
                    )}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>
            <Textarea
              label="Mood / Keywords"
              value={coverInput.mood}
              onChange={(e) => setCoverInput(prev => ({ ...prev, mood: e.target.value }))}
              placeholder="Describe the mood, key imagery, or specific elements you want..."
              rows={3}
            />
          </div>
        );
      
      case 'audiobook':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-3">
                Select Voice
              </label>
              <div className="grid sm:grid-cols-2 gap-3">
                {voices.map((voice) => (
                  <button
                    key={voice.id}
                    type="button"
                    onClick={() => setSelectedVoice(voice.id)}
                    className={cn(
                      'p-4 rounded-lg border-2 text-left transition-all',
                      selectedVoice === voice.id
                        ? 'border-ink-900 bg-ink-50'
                        : 'border-parchment-200 hover:border-ink-300'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-ink-900">{voice.name}</p>
                        <p className="text-sm text-ink-500">{voice.description}</p>
                      </div>
                      {selectedVoice === voice.id && (
                        <Check weight="bold" className="h-5 w-5 text-ink-900" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <Textarea
              label="Sample Text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Paste a sample chapter or the first few pages of your book..."
              rows={8}
            />
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-ink-900 flex items-center gap-3">
            <Sparkle weight="duotone" className="h-7 w-7 text-accent-yellow" />
            AI Studio
          </h1>
          <p className="text-ink-600">
            Enhance your writing with AI-powered tools.
          </p>
        </div>
        <div className="card px-4 py-2 inline-flex items-center gap-3">
          <span className="text-sm text-ink-600">Credits:</span>
          {creditsAvailable ? (
            <>
              <span className="font-semibold text-ink-900">
                {remainingCredits}/{totalCredits}
              </span>
              <div className="w-20 h-2 bg-parchment-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-accent-yellow rounded-full"
                  style={{ width: `${totalCredits > 0 ? (remainingCredits / totalCredits) * 100 : 0}%` }}
                />
              </div>
            </>
          ) : (
            <span className="font-medium text-ink-500">Not available</span>
          )}
        </div>
      </div>

      {/* Tool Selection */}
      {!selectedTool ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {aiTools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setSelectedTool(tool.id)}
              disabled={!creditsAvailable || remainingCredits < tool.credits}
              className={cn(
                "card p-6 text-left transition-all group",
                creditsAvailable && remainingCredits >= tool.credits
                  ? "hover:border-ink-300 hover:shadow-lg"
                  : "opacity-60 cursor-not-allowed"
              )}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-accent-yellow/20 rounded-xl flex items-center justify-center group-hover:bg-accent-yellow/30 transition-colors">
                  <tool.icon weight="duotone" className="h-6 w-6 text-accent-warm" />
                </div>
                <span className="text-xs font-medium text-ink-500 bg-parchment-200 px-2 py-1 rounded-full">
                  {tool.credits} credits
                </span>
              </div>
              <h3 className="font-serif text-lg font-semibold text-ink-900 mb-2">
                {tool.name}
              </h3>
              <p className="text-ink-600 mb-4">{tool.description}</p>
              <span className="text-accent-warm font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
                Try it <ArrowRight weight="bold" className="h-4 w-4" />
              </span>
            </button>
          ))}
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                {(() => {
                  const tool = aiTools.find(t => t.id === selectedTool);
                  const Icon = tool?.icon || MagicWand;
                  return (
                    <>
                      <div className="w-10 h-10 bg-accent-yellow/20 rounded-lg flex items-center justify-center">
                        <Icon weight="duotone" className="h-5 w-5 text-accent-warm" />
                      </div>
                      <div>
                        <h2 className="font-serif font-semibold text-ink-900">
                          {tool?.name}
                        </h2>
                        <p className="text-sm text-ink-500">
                          {tool?.credits} credits per use
                        </p>
                      </div>
                    </>
                  );
                })()}
              </div>
              <button
                onClick={() => {
                  setSelectedTool(null);
                  setResult(null);
                }}
                className="text-sm text-ink-500 hover:text-ink-900"
              >
                Change tool
              </button>
            </div>

            {renderToolContent()}

            <div className="mt-6 flex gap-3">
              <Button
                variant="primary"
                onClick={handleProcess}
                disabled={isProcessing}
                className="flex-1"
              >
                {isProcessing ? (
                  <>
                    <CircleNotch className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Sparkle weight="duotone" className="mr-2 h-4 w-4" />
                    Generate
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Output Panel */}
          <div className="card p-6">
            <h2 className="font-serif font-semibold text-ink-900 mb-4">Result</h2>
            
            {isProcessing ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 bg-accent-yellow/20 rounded-full flex items-center justify-center mb-4 animate-pulse">
                  <Sparkle weight="duotone" className="h-8 w-8 text-accent-yellow" />
                </div>
                <p className="text-ink-600">AI is working its magic...</p>
                <p className="text-sm text-ink-500 mt-1">This may take a few seconds</p>
              </div>
            ) : result ? (
              <div>
                <div className="bg-parchment-100 rounded-lg p-4 mb-4">
                  <p className="text-ink-700 whitespace-pre-wrap">{result}</p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => navigator.clipboard.writeText(result)}>
                    <Copy weight="duotone" className="mr-2 h-4 w-4" />
                    Copy
                  </Button>
                  <Button variant="outline" onClick={handleProcess}>
                    <ArrowsClockwise weight="bold" className="mr-2 h-4 w-4" />
                    Regenerate
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 bg-parchment-200 rounded-full flex items-center justify-center mb-4">
                  <MagicWand weight="duotone" className="h-8 w-8 text-parchment-400" />
                </div>
                <p className="text-ink-500">Your AI-generated content will appear here</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tips Section */}
      <div className="card p-6 bg-accent-yellow/5 border-accent-yellow/20">
        <h3 className="font-serif font-semibold text-ink-900 mb-4 flex items-center gap-2">
          <Sparkle weight="duotone" className="h-5 w-5 text-accent-yellow" />
          Tips for Best Results
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <p className="font-medium text-ink-900 mb-1">Grammar Check</p>
            <p className="text-sm text-ink-600">
              Submit 500-2000 words at a time for the most accurate analysis.
            </p>
          </div>
          <div>
            <p className="font-medium text-ink-900 mb-1">Blurb Generator</p>
            <p className="text-sm text-ink-600">
              Include key plot points and your unique selling proposition.
            </p>
          </div>
          <div>
            <p className="font-medium text-ink-900 mb-1">Cover Design</p>
            <p className="text-sm text-ink-600">
              Be specific about mood and imagery for better results.
            </p>
          </div>
          <div>
            <p className="font-medium text-ink-900 mb-1">Audiobook</p>
            <p className="text-sm text-ink-600">
              Test different voices with your opening chapter first.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
