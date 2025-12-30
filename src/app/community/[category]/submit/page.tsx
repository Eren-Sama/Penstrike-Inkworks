'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  CaretLeft,
  TextAa,
  Image,
  Link as LinkIcon,
  ListBullets,
  TextB,
  TextItalic,
  Code,
  Quotes,
  PaperPlaneRight,
  Info,
  SpinnerGap,
  CaretDown,
  Eye,
  X
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';
import { useAuth } from '@/lib/auth/AuthContext';
import { toast } from 'sonner';

const categoryInfo: Record<string, { name: string; gradient: string }> = {
  'writing-craft': { name: 'Writing Craft', gradient: 'from-blue-500 to-indigo-600' },
  'marketing-&-promotion': { name: 'Marketing & Promotion', gradient: 'from-purple-500 to-pink-600' },
  'cover-design': { name: 'Cover Design', gradient: 'from-emerald-500 to-teal-600' },
  'genre-discussions': { name: 'Genre Discussions', gradient: 'from-orange-500 to-amber-600' },
  'publishing-journey': { name: 'Publishing Journey', gradient: 'from-rose-500 to-red-600' },
  'feedback-&-critiques': { name: 'Feedback & Critiques', gradient: 'from-teal-500 to-cyan-600' },
};

const flairOptions = [
  { value: 'discussion', label: 'Discussion', color: 'bg-blue-100 text-blue-700' },
  { value: 'question', label: 'Question', color: 'bg-indigo-100 text-indigo-700' },
  { value: 'success-story', label: 'Success Story', color: 'bg-emerald-100 text-emerald-700' },
  { value: 'resources', label: 'Resources', color: 'bg-teal-100 text-teal-700' },
  { value: 'feedback-request', label: 'Feedback Request', color: 'bg-pink-100 text-pink-700' },
  { value: 'milestone', label: 'Milestone', color: 'bg-amber-100 text-amber-700' },
  { value: 'hot-take', label: 'Hot Take', color: 'bg-red-100 text-red-700' },
];

export default function SubmitPostPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const categorySlug = params.category as string;
  const category = categoryInfo[categorySlug] || { 
    name: categorySlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), 
    gradient: 'from-gray-500 to-gray-600' 
  };

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [flair, setFlair] = useState('');
  const [showFlairDropdown, setShowFlairDropdown] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/login?redirect=/community/${categorySlug}/submit`);
    }
  }, [user, authLoading, router, categorySlug]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error('Please add a title');
      return;
    }
    if (!content.trim()) {
      toast.error('Please add some content');
      return;
    }
    if (!flair) {
      toast.error('Please select a flair');
      return;
    }

    setSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success('Post created successfully!');
    router.push(`/community/${categorySlug}`);
  };

  const insertFormatting = (prefix: string, suffix: string = prefix) => {
    const textarea = document.getElementById('content') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newText = content.substring(0, start) + prefix + selectedText + suffix + content.substring(end);
    
    setContent(newText);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  const renderPreview = () => {
    let html = content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-parchment-100 px-1 rounded">$1</code>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold mt-4 mb-2">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-bold mt-3 mb-2">$1</h3>')
      .replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-parchment-300 pl-4 italic text-ink-600">$1</blockquote>')
      .replace(/^- (.*$)/gm, '<li class="ml-4">$1</li>')
      .replace(/\n/g, '<br />');
    
    return { __html: html };
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-parchment-50 to-cream-100 flex items-center justify-center">
        <SpinnerGap weight="bold" className="h-8 w-8 animate-spin text-accent-yellow" />
      </div>
    );
  }

  const selectedFlair = flairOptions.find(f => f.value === flair);

  return (
    <div className="min-h-screen bg-gradient-to-b from-parchment-50 to-cream-100">
      {/* Header */}
      <div className={cn('bg-gradient-to-br text-white', category.gradient)}>
        <div className="container mx-auto px-4 py-6">
          <div className={`transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <Link 
              href={`/community/${categorySlug}`}
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-3 transition-colors"
            >
              <CaretLeft weight="bold" className="h-4 w-4" />
              Back to {category.name}
            </Link>
            <h1 className="font-serif text-2xl md:text-3xl font-bold">
              Create a Post
            </h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Post Form */}
          <div className={`bg-white rounded-2xl border border-parchment-200 overflow-hidden transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {/* Title */}
            <div className="p-6 border-b border-parchment-200">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                maxLength={300}
                className="w-full text-xl font-serif font-bold text-ink-900 placeholder:text-ink-400 outline-none"
              />
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-ink-400">{title.length}/300</span>
                
                {/* Flair Selector */}
                <div className="relative">
                  <button
                    onClick={() => setShowFlairDropdown(!showFlairDropdown)}
                    className={cn(
                      'flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-all',
                      selectedFlair
                        ? cn(selectedFlair.color, 'border-transparent')
                        : 'border-parchment-300 text-ink-600 hover:border-ink-400'
                    )}
                  >
                    {selectedFlair ? selectedFlair.label : 'Add Flair'}
                    <CaretDown weight="bold" className="h-3 w-3" />
                  </button>
                  
                  {showFlairDropdown && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-parchment-200 p-2 z-10">
                      {flairOptions.map(option => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setFlair(option.value);
                            setShowFlairDropdown(false);
                          }}
                          className={cn(
                            'w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all',
                            flair === option.value ? option.color : 'hover:bg-parchment-100'
                          )}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-1 px-6 py-3 border-b border-parchment-200 bg-parchment-50">
              <button
                onClick={() => insertFormatting('**')}
                className="p-2 rounded-lg hover:bg-parchment-200 text-ink-600 transition-colors"
                title="Bold"
              >
                <TextB weight="bold" className="h-4 w-4" />
              </button>
              <button
                onClick={() => insertFormatting('*')}
                className="p-2 rounded-lg hover:bg-parchment-200 text-ink-600 transition-colors"
                title="Italic"
              >
                <TextItalic weight="bold" className="h-4 w-4" />
              </button>
              <button
                onClick={() => insertFormatting('`')}
                className="p-2 rounded-lg hover:bg-parchment-200 text-ink-600 transition-colors"
                title="Code"
              >
                <Code weight="bold" className="h-4 w-4" />
              </button>
              <button
                onClick={() => insertFormatting('\n> ', '')}
                className="p-2 rounded-lg hover:bg-parchment-200 text-ink-600 transition-colors"
                title="Quote"
              >
                <Quotes weight="bold" className="h-4 w-4" />
              </button>
              <button
                onClick={() => insertFormatting('\n- ', '')}
                className="p-2 rounded-lg hover:bg-parchment-200 text-ink-600 transition-colors"
                title="List"
              >
                <ListBullets weight="bold" className="h-4 w-4" />
              </button>
              <button
                onClick={() => insertFormatting('\n## ', '')}
                className="p-2 rounded-lg hover:bg-parchment-200 text-ink-600 transition-colors"
                title="Heading"
              >
                <TextAa weight="bold" className="h-4 w-4" />
              </button>
              
              <div className="flex-1" />
              
              <button
                onClick={() => setIsPreview(!isPreview)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                  isPreview 
                    ? 'bg-ink-900 text-white' 
                    : 'text-ink-600 hover:bg-parchment-200'
                )}
              >
                <Eye weight="bold" className="h-4 w-4" />
                Preview
              </button>
            </div>

            {/* Content Area */}
            <div className="p-6">
              {isPreview ? (
                <div 
                  className="min-h-[300px] prose prose-lg max-w-none prose-headings:font-serif prose-p:text-ink-700"
                  dangerouslySetInnerHTML={renderPreview()}
                />
              ) : (
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Share your thoughts, experiences, or questions with the community..."
                  className="w-full min-h-[300px] text-ink-700 placeholder:text-ink-400 outline-none resize-none leading-relaxed"
                />
              )}
            </div>

            {/* Submit */}
            <div className="flex items-center justify-between p-6 border-t border-parchment-200 bg-parchment-50">
              <div className="flex items-center gap-2 text-xs text-ink-500">
                <Info weight="fill" className="h-4 w-4" />
                <span>Markdown formatting is supported</span>
              </div>
              
              <div className="flex items-center gap-3">
                <Link href={`/community/${categorySlug}`}>
                  <Button variant="ghost">Cancel</Button>
                </Link>
                <Button 
                  onClick={handleSubmit}
                  disabled={submitting || !title.trim() || !content.trim()}
                >
                  {submitting ? (
                    <>
                      <SpinnerGap weight="bold" className="h-4 w-4 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    <>
                      <PaperPlaneRight weight="bold" className="h-4 w-4" />
                      Post
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className={`mt-6 bg-white rounded-2xl border border-parchment-200 p-6 transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <h3 className="font-serif text-lg font-bold text-ink-900 mb-4">Posting Tips</h3>
            <ul className="space-y-2 text-sm text-ink-600">
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 mt-0.5">✓</span>
                Write a clear, descriptive title that summarizes your post
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 mt-0.5">✓</span>
                Use appropriate flair to help others find relevant content
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 mt-0.5">✓</span>
                Be respectful and constructive in your posts
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 mt-0.5">✓</span>
                Format your post with headings and lists for readability
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 mt-0.5">✓</span>
                Engage with comments on your post
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
