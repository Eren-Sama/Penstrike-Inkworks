'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  UploadSimple,
  FileText,
  X,
  CaretLeft,
  CaretRight,
  Check,
  WarningCircle,
  Palette,
  Image,
  CurrencyDollar,
  Bank,
  Globe,
  Megaphone,
  Scales,
  CheckSquare,
  SpinnerGap,
  Info,
  Copyright,
  BookOpen,
  ShieldCheck
} from '@phosphor-icons/react';
import { cn, formatCurrency } from '@/lib/utils';
import { Button, Input, Textarea } from '@/components/ui';
import { createClient } from '@/lib/supabase/client';

type Step = 'manuscript' | 'design' | 'publishing' | 'pricing' | 'marketing' | 'legal';

const genres = [
  'Fantasy',
  'Science Fiction',
  'Romance',
  'Mystery',
  'Thriller',
  'Horror',
  'Historical Fiction',
  'Literary Fiction',
  'Young Adult',
  'Children\'s',
  'Non-Fiction',
  'Biography',
  'Self-Help',
  'Business',
  'Poetry',
];

const steps: { id: Step; label: string; icon: typeof FileText }[] = [
  { id: 'manuscript', label: 'Manuscript', icon: FileText },
  { id: 'design', label: 'Design', icon: Palette },
  { id: 'publishing', label: 'Publishing', icon: Globe },
  { id: 'pricing', label: 'Pricing', icon: CurrencyDollar },
  { id: 'marketing', label: 'Marketing', icon: Megaphone },
  { id: 'legal', label: 'Legal', icon: Scales },
];

export default function NewManuscriptPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>('manuscript');
  const [file, setFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isCoverDragging, setIsCoverDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'error' | null>(null);
  
  // Manuscript & Details
  const [formData, setFormData] = useState({
    // Manuscript
    title: '',
    description: '',
    genre: [] as string[],
    language: 'English',
    targetAudience: '',
    keywords: '',
    contentWarnings: '',
    wordCount: '',
    isOriginalWork: false,
    
    // Design
    coverOption: 'penstrike' as 'penstrike' | 'upload' | 'later',
    coverNotes: '',
    interiorStyle: 'modern' as 'modern' | 'classic' | 'minimal',
    trimSize: '5x8' as '5x8' | '5.5x8.5' | '6x9',
    
    // Publishing
    hasIsbn: false,
    isbn: '',
    wantsIsbn: true,
    copyrightYear: new Date().getFullYear().toString(),
    copyrightHolder: '',
    distributionScope: 'worldwide' as 'worldwide' | 'india' | 'custom',
    customTerritories: '',
    
    // Pricing
    suggestedMrp: '',
    ebookPrice: '',
    royaltyModel: 'standard' as 'standard' | 'premium',
    paymentMethod: 'bank' as 'bank' | 'upi',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    accountHolderName: '',
    upiId: '',
    
    // Marketing
    wantsMarketing: true,
    marketingBudget: 'basic' as 'basic' | 'standard' | 'premium',
    socialMediaHandles: '',
    authorWebsite: '',
    targetReadership: '',
    comparableTitles: '',
    
    // Legal
    originalityDeclaration: false,
    noInfringement: false,
    termsAccepted: false,
    privacyAccepted: false,
    rightsConfirmation: false,
  });

  // Auto-save effect
  useEffect(() => {
    const savedData = localStorage.getItem('manuscript-draft');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData(prev => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error('Failed to load draft:', e);
      }
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAutoSaveStatus('saving');
      localStorage.setItem('manuscript-draft', JSON.stringify(formData));
      setTimeout(() => setAutoSaveStatus('saved'), 500);
    }, 2000);
    return () => clearTimeout(timeout);
  }, [formData]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && isValidFile(droppedFile)) {
      setFile(droppedFile);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && isValidFile(selectedFile)) {
      setFile(selectedFile);
    }
  };

  const isValidFile = (file: File) => {
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    return validTypes.includes(file.type) || file.name.endsWith('.docx') || file.name.endsWith('.pdf');
  };

  const isValidCoverFile = (file: File) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    return validTypes.includes(file.type);
  };

  const handleCoverDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsCoverDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && isValidCoverFile(droppedFile)) {
      setCoverFile(droppedFile);
    }
  };

  const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && isValidCoverFile(selectedFile)) {
      setCoverFile(selectedFile);
    }
  };

  const handleGenreToggle = (genre: string) => {
    setFormData(prev => ({
      ...prev,
      genre: prev.genre.includes(genre)
        ? prev.genre.filter(g => g !== genre)
        : prev.genre.length < 3
          ? [...prev.genre, genre]
          : prev.genre,
    }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'manuscript':
        return file !== null && formData.title.trim() && formData.description.trim() && formData.genre.length > 0 && formData.isOriginalWork;
      case 'design':
        return formData.coverOption === 'penstrike' || formData.coverOption === 'later' || (formData.coverOption === 'upload' && coverFile !== null);
      case 'publishing':
        return formData.copyrightHolder.trim() && (!formData.hasIsbn || formData.isbn.trim());
      case 'pricing':
        return formData.suggestedMrp && (
          (formData.paymentMethod === 'bank' && formData.bankName && formData.accountNumber && formData.ifscCode && formData.accountHolderName) ||
          (formData.paymentMethod === 'upi' && formData.upiId)
        );
      case 'marketing':
        return true; // Marketing is optional
      case 'legal':
        return formData.originalityDeclaration && formData.noInfringement && formData.termsAccepted && formData.privacyAccepted && formData.rightsConfirmation;
      default:
        return true;
    }
  };

  const getStepIndex = (step: Step) => steps.findIndex(s => s.id === step);
  const currentStepIndex = getStepIndex(currentStep);

  const goToNextStep = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex].id);
    }
  };

  const goToPrevStep = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].id);
    }
  };

  const handleSubmit = async () => {
    if (!canProceed()) return;
    
    setIsSubmitting(true);
    try {
      // TODO: Implement actual upload logic with Supabase
      console.log('Submitting manuscript:', { file, coverFile, ...formData });
      
      // Clear the draft after successful submission
      localStorage.removeItem('manuscript-draft');
      
      // Redirect to manuscripts page after success
      router.push('/author/manuscripts?success=true');
    } catch (error) {
      console.error('Failed to submit:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* Back Link & Auto-save Status */}
      <div className="flex items-center justify-between mb-6">
        <Link 
          href="/author/manuscripts"
          className="inline-flex items-center gap-1 text-sm text-ink-600 hover:text-ink-900"
        >
          <CaretLeft weight="bold" className="h-4 w-4" />
          Back to Manuscripts
        </Link>
        {autoSaveStatus && (
          <span className={cn(
            "text-xs flex items-center gap-1",
            autoSaveStatus === 'saved' && "text-emerald-600",
            autoSaveStatus === 'saving' && "text-ink-400",
            autoSaveStatus === 'error' && "text-red-500"
          )}>
            {autoSaveStatus === 'saving' && <SpinnerGap weight="bold" className="h-3 w-3 animate-spin" />}
            {autoSaveStatus === 'saved' && <Check weight="bold" className="h-3 w-3" />}
            {autoSaveStatus === 'saving' ? 'Saving draft...' : autoSaveStatus === 'saved' ? 'Draft saved' : 'Save failed'}
          </span>
        )}
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-ink-900 mb-2">
          Publish Your Book
        </h1>
        <p className="text-ink-600">
          Complete all steps to submit your manuscript for publishing. Your progress is automatically saved.
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8 overflow-x-auto pb-2">
        <div className="flex items-center min-w-max gap-1">
          {steps.map((step, i) => {
            const StepIcon = step.icon;
            const isCompleted = currentStepIndex > i;
            const isCurrent = currentStep === step.id;
            
            return (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => isCompleted && setCurrentStep(step.id)}
                  disabled={!isCompleted && !isCurrent}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300",
                    isCurrent && "bg-ink-900 text-white",
                    isCompleted && "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 cursor-pointer",
                    !isCurrent && !isCompleted && "bg-parchment-100 text-ink-400 cursor-not-allowed"
                  )}
                >
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold",
                    isCurrent && "bg-white/20",
                    isCompleted && "bg-emerald-500 text-white",
                    !isCurrent && !isCompleted && "bg-parchment-200"
                  )}>
                    {isCompleted ? (
                      <Check weight="bold" className="h-3 w-3" />
                    ) : (
                      i + 1
                    )}
                  </div>
                  <span className="text-sm font-medium hidden sm:block">{step.label}</span>
                  <StepIcon weight="duotone" className="h-4 w-4 sm:hidden" />
                </button>
                {i < steps.length - 1 && (
                  <div className={cn(
                    "w-4 md:w-8 h-0.5 mx-1",
                    isCompleted ? "bg-emerald-300" : "bg-parchment-200"
                  )} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="card p-6 md:p-8">
        {/* Step 1: Manuscript Upload & Details */}
        {currentStep === 'manuscript' && (
          <div className="space-y-8">
            <div>
              <h2 className="font-serif text-xl font-semibold text-ink-900 mb-2">
                Upload Your Manuscript
              </h2>
              <p className="text-ink-600">
                Upload your final manuscript file and provide book details.
              </p>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-3">Manuscript File *</label>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                  'relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300',
                  isDragging && 'border-accent-yellow bg-accent-yellow/5 scale-[1.02]',
                  !isDragging && !file && 'border-parchment-300 hover:border-ink-400',
                  file && 'border-emerald-400 bg-emerald-50'
                )}
              >
                {file ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                        <FileText weight="duotone" className="h-6 w-6 text-emerald-600" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-ink-900">{file.name}</p>
                        <p className="text-sm text-ink-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setFile(null)}
                      className="p-2 text-ink-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X weight="bold" className="h-5 w-5" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <UploadSimple weight="duotone" className="h-10 w-10 text-parchment-400 mx-auto mb-3" />
                    <p className="font-medium text-ink-900 mb-1">Drop your manuscript here</p>
                    <p className="text-sm text-ink-500 mb-4">PDF or DOCX format, max 50MB</p>
                    <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-ink-900 text-white text-sm font-medium cursor-pointer hover:bg-ink-800 transition-colors">
                      <UploadSimple weight="bold" className="h-4 w-4" />
                      Browse Files
                      <input type="file" className="hidden" accept=".pdf,.docx" onChange={handleFileSelect} />
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Book Details */}
            <div className="grid gap-6">
              <Input
                label="Book Title *"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter your book title"
              />

              <Textarea
                label="Book Description / Synopsis *"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Write a compelling description that will appear on your book's page (200-500 words recommended)"
                rows={5}
              />

              <div>
                <label className="block text-sm font-medium text-ink-700 mb-2">Genre (select up to 3) *</label>
                <div className="flex flex-wrap gap-2">
                  {genres.map((genre) => (
                    <button
                      key={genre}
                      type="button"
                      onClick={() => handleGenreToggle(genre)}
                      className={cn(
                        'px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200',
                        formData.genre.includes(genre)
                          ? 'bg-ink-900 text-white scale-105'
                          : 'bg-parchment-100 text-ink-600 hover:bg-parchment-200'
                      )}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-ink-700 mb-2">Language</label>
                  <select
                    value={formData.language}
                    onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
                    className="input w-full"
                  >
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Tamil">Tamil</option>
                    <option value="Telugu">Telugu</option>
                    <option value="Bengali">Bengali</option>
                    <option value="Marathi">Marathi</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <Input
                  label="Word Count (approximate)"
                  value={formData.wordCount}
                  onChange={(e) => setFormData(prev => ({ ...prev, wordCount: e.target.value }))}
                  placeholder="e.g., 75,000"
                />
              </div>

              <Input
                label="Keywords (comma-separated)"
                value={formData.keywords}
                onChange={(e) => setFormData(prev => ({ ...prev, keywords: e.target.value }))}
                placeholder="e.g., mystery, detective, thriller, crime"
              />

              <Textarea
                label="Content Warnings (optional)"
                value={formData.contentWarnings}
                onChange={(e) => setFormData(prev => ({ ...prev, contentWarnings: e.target.value }))}
                placeholder="List any content warnings readers should be aware of"
                rows={2}
              />
            </div>

            {/* Originality Confirmation */}
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isOriginalWork}
                  onChange={(e) => setFormData(prev => ({ ...prev, isOriginalWork: e.target.checked }))}
                  className="mt-1 w-5 h-5 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                />
                <div>
                  <span className="font-medium text-amber-900">I confirm this is my original work *</span>
                  <p className="text-sm text-amber-700 mt-1">
                    By checking this box, you confirm that you are the original author of this manuscript or have legal rights to publish it.
                  </p>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* Step 2: Design Preferences */}
        {currentStep === 'design' && (
          <div className="space-y-8">
            <div>
              <h2 className="font-serif text-xl font-semibold text-ink-900 mb-2">
                Design Preferences
              </h2>
              <p className="text-ink-600">
                Choose how you want your book cover and interior designed.
              </p>
            </div>

            {/* Cover Design Option */}
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-3">Book Cover</label>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { id: 'penstrike', label: 'Penstrike Design', desc: 'Our designers create your cover', icon: Palette },
                  { id: 'upload', label: 'Upload My Cover', desc: 'I have my own cover design', icon: Image },
                  { id: 'later', label: 'Decide Later', desc: 'Skip for now', icon: FileText },
                ].map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, coverOption: option.id as any }))}
                    className={cn(
                      'p-4 rounded-xl border-2 text-left transition-all duration-300',
                      formData.coverOption === option.id
                        ? 'border-ink-900 bg-ink-900/5'
                        : 'border-parchment-200 hover:border-parchment-400'
                    )}
                  >
                    <option.icon weight="duotone" className={cn(
                      "h-6 w-6 mb-2",
                      formData.coverOption === option.id ? "text-ink-900" : "text-ink-400"
                    )} />
                    <p className="font-medium text-ink-900">{option.label}</p>
                    <p className="text-xs text-ink-500 mt-1">{option.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Upload Cover if selected */}
            {formData.coverOption === 'upload' && (
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-3">Upload Cover Image</label>
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsCoverDragging(true); }}
                  onDragLeave={(e) => { e.preventDefault(); setIsCoverDragging(false); }}
                  onDrop={handleCoverDrop}
                  className={cn(
                    'border-2 border-dashed rounded-xl p-6 text-center transition-all',
                    isCoverDragging && 'border-accent-yellow bg-accent-yellow/5',
                    !isCoverDragging && !coverFile && 'border-parchment-300',
                    coverFile && 'border-emerald-400 bg-emerald-50'
                  )}
                >
                  {coverFile ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Image weight="duotone" className="h-8 w-8 text-emerald-600" />
                        <div className="text-left">
                          <p className="font-medium text-ink-900">{coverFile.name}</p>
                          <p className="text-sm text-ink-500">{(coverFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <button onClick={() => setCoverFile(null)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg">
                        <X weight="bold" className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Image weight="duotone" className="h-8 w-8 text-parchment-400 mx-auto mb-2" />
                      <p className="text-sm text-ink-600 mb-2">JPG, PNG or WebP (min 1600x2400px)</p>
                      <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-parchment-200 text-ink-700 text-sm cursor-pointer hover:bg-parchment-300">
                        Browse
                        <input type="file" className="hidden" accept="image/jpeg,image/png,image/webp" onChange={handleCoverSelect} />
                      </label>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Cover Notes for Penstrike Design */}
            {formData.coverOption === 'penstrike' && (
              <Textarea
                label="Cover Design Notes (optional)"
                value={formData.coverNotes}
                onChange={(e) => setFormData(prev => ({ ...prev, coverNotes: e.target.value }))}
                placeholder="Describe your vision for the cover: colors, mood, imagery, or reference any book covers you like"
                rows={4}
              />
            )}

            {/* Interior Style */}
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-3">Interior Style</label>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { id: 'modern', label: 'Modern', desc: 'Clean, minimalist design' },
                  { id: 'classic', label: 'Classic', desc: 'Traditional book typography' },
                  { id: 'minimal', label: 'Minimal', desc: 'Simple and elegant' },
                ].map((style) => (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, interiorStyle: style.id as any }))}
                    className={cn(
                      'p-4 rounded-xl border-2 text-left transition-all',
                      formData.interiorStyle === style.id
                        ? 'border-ink-900 bg-ink-900/5'
                        : 'border-parchment-200 hover:border-parchment-400'
                    )}
                  >
                    <p className="font-medium text-ink-900">{style.label}</p>
                    <p className="text-xs text-ink-500 mt-1">{style.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Trim Size */}
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-2">Print Trim Size</label>
              <select
                value={formData.trimSize}
                onChange={(e) => setFormData(prev => ({ ...prev, trimSize: e.target.value as any }))}
                className="input w-full max-w-xs"
              >
                <option value="5x8">5" × 8" (Most common)</option>
                <option value="5.5x8.5">5.5" × 8.5"</option>
                <option value="6x9">6" × 9"</option>
              </select>
            </div>
          </div>
        )}

        {/* Step 3: Publishing & Rights */}
        {currentStep === 'publishing' && (
          <div className="space-y-8">
            <div>
              <h2 className="font-serif text-xl font-semibold text-ink-900 mb-2">
                Publishing & Rights
              </h2>
              <p className="text-ink-600">
                Configure ISBN, copyright, and distribution settings.
              </p>
            </div>

            {/* ISBN */}
            <div className="space-y-4">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.hasIsbn}
                  onChange={(e) => setFormData(prev => ({ ...prev, hasIsbn: e.target.checked }))}
                  className="w-5 h-5 rounded border-parchment-300 text-ink-900"
                />
                <span className="font-medium text-ink-900">I already have an ISBN</span>
              </label>
              
              {formData.hasIsbn ? (
                <Input
                  label="Your ISBN"
                  value={formData.isbn}
                  onChange={(e) => setFormData(prev => ({ ...prev, isbn: e.target.value }))}
                  placeholder="978-X-XXXX-XXXX-X"
                />
              ) : (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <div className="flex items-start gap-3">
                    <Info weight="duotone" className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-900">Free ISBN Assignment</p>
                      <p className="text-sm text-blue-700 mt-1">
                        We'll assign a free ISBN to your book. This ISBN will be owned by Penstrike Inkworks.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Copyright */}
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="Copyright Year"
                value={formData.copyrightYear}
                onChange={(e) => setFormData(prev => ({ ...prev, copyrightYear: e.target.value }))}
                placeholder={new Date().getFullYear().toString()}
              />
              <Input
                label="Copyright Holder *"
                value={formData.copyrightHolder}
                onChange={(e) => setFormData(prev => ({ ...prev, copyrightHolder: e.target.value }))}
                placeholder="Your legal name or pen name"
              />
            </div>

            {/* Distribution Scope */}
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-3">Distribution Scope</label>
              <div className="space-y-3">
                {[
                  { id: 'worldwide', label: 'Worldwide', desc: 'Distribute to all available markets globally' },
                  { id: 'india', label: 'India Only', desc: 'Restrict distribution to India' },
                  { id: 'custom', label: 'Custom Territories', desc: 'Select specific countries/regions' },
                ].map((scope) => (
                  <label key={scope.id} className={cn(
                    'flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all',
                    formData.distributionScope === scope.id
                      ? 'border-ink-900 bg-ink-900/5'
                      : 'border-parchment-200 hover:border-parchment-400'
                  )}>
                    <input
                      type="radio"
                      name="distribution"
                      checked={formData.distributionScope === scope.id}
                      onChange={() => setFormData(prev => ({ ...prev, distributionScope: scope.id as any }))}
                      className="mt-1"
                    />
                    <div>
                      <p className="font-medium text-ink-900">{scope.label}</p>
                      <p className="text-sm text-ink-500">{scope.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {formData.distributionScope === 'custom' && (
              <Textarea
                label="Specify Territories"
                value={formData.customTerritories}
                onChange={(e) => setFormData(prev => ({ ...prev, customTerritories: e.target.value }))}
                placeholder="List the countries or regions where you want your book distributed"
                rows={3}
              />
            )}
          </div>
        )}

        {/* Step 4: Pricing & Royalties */}
        {currentStep === 'pricing' && (
          <div className="space-y-8">
            <div>
              <h2 className="font-serif text-xl font-semibold text-ink-900 mb-2">
                Pricing & Royalties
              </h2>
              <p className="text-ink-600">
                Set your book price and payment details for royalty payouts.
              </p>
            </div>

            {/* Pricing */}
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="Suggested Print MRP (₹) *"
                value={formData.suggestedMrp}
                onChange={(e) => setFormData(prev => ({ ...prev, suggestedMrp: e.target.value }))}
                placeholder="e.g., 299"
                type="number"
              />
              <Input
                label="eBook Price (₹)"
                value={formData.ebookPrice}
                onChange={(e) => setFormData(prev => ({ ...prev, ebookPrice: e.target.value }))}
                placeholder="e.g., 149"
                type="number"
              />
            </div>

            {/* Royalty Model */}
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-3">Royalty Model</label>
              <div className="grid sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, royaltyModel: 'standard' }))}
                  className={cn(
                    'p-4 rounded-xl border-2 text-left transition-all',
                    formData.royaltyModel === 'standard'
                      ? 'border-ink-900 bg-ink-900/5'
                      : 'border-parchment-200 hover:border-parchment-400'
                  )}
                >
                  <p className="font-medium text-ink-900">Standard (60%)</p>
                  <p className="text-sm text-ink-500 mt-1">Basic distribution, free to join</p>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, royaltyModel: 'premium' }))}
                  className={cn(
                    'p-4 rounded-xl border-2 text-left transition-all',
                    formData.royaltyModel === 'premium'
                      ? 'border-accent-yellow bg-accent-yellow/10'
                      : 'border-parchment-200 hover:border-parchment-400'
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-ink-900">Premium (70%)</p>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-accent-yellow/20 text-accent-warm">Recommended</span>
                  </div>
                  <p className="text-sm text-ink-500">Enhanced distribution + marketing support</p>
                </button>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-3">Payment Method *</label>
              <div className="flex gap-4 mb-4">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'bank' }))}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all',
                    formData.paymentMethod === 'bank'
                      ? 'border-ink-900 bg-ink-900/5'
                      : 'border-parchment-200 hover:border-parchment-400'
                  )}
                >
                  <Bank weight="duotone" className="h-5 w-5" />
                  Bank Transfer
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'upi' }))}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all',
                    formData.paymentMethod === 'upi'
                      ? 'border-ink-900 bg-ink-900/5'
                      : 'border-parchment-200 hover:border-parchment-400'
                  )}
                >
                  <CurrencyDollar weight="duotone" className="h-5 w-5" />
                  UPI
                </button>
              </div>

              {formData.paymentMethod === 'bank' && (
                <div className="grid sm:grid-cols-2 gap-4 p-4 bg-parchment-50 rounded-xl">
                  <Input
                    label="Bank Name *"
                    value={formData.bankName}
                    onChange={(e) => setFormData(prev => ({ ...prev, bankName: e.target.value }))}
                    placeholder="e.g., State Bank of India"
                  />
                  <Input
                    label="Account Holder Name *"
                    value={formData.accountHolderName}
                    onChange={(e) => setFormData(prev => ({ ...prev, accountHolderName: e.target.value }))}
                    placeholder="As per bank records"
                  />
                  <Input
                    label="Account Number *"
                    value={formData.accountNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, accountNumber: e.target.value }))}
                    placeholder="Your account number"
                  />
                  <Input
                    label="IFSC Code *"
                    value={formData.ifscCode}
                    onChange={(e) => setFormData(prev => ({ ...prev, ifscCode: e.target.value }))}
                    placeholder="e.g., SBIN0001234"
                  />
                </div>
              )}

              {formData.paymentMethod === 'upi' && (
                <div className="p-4 bg-parchment-50 rounded-xl">
                  <Input
                    label="UPI ID *"
                    value={formData.upiId}
                    onChange={(e) => setFormData(prev => ({ ...prev, upiId: e.target.value }))}
                    placeholder="yourname@upi"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 5: Marketing */}
        {currentStep === 'marketing' && (
          <div className="space-y-8">
            <div>
              <h2 className="font-serif text-xl font-semibold text-ink-900 mb-2">
                Marketing & Promotion
              </h2>
              <p className="text-ink-600">
                Help us promote your book effectively (all fields optional).
              </p>
            </div>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.wantsMarketing}
                onChange={(e) => setFormData(prev => ({ ...prev, wantsMarketing: e.target.checked }))}
                className="w-5 h-5 rounded border-parchment-300 text-ink-900"
              />
              <span className="font-medium text-ink-900">I'm interested in marketing support</span>
            </label>

            {formData.wantsMarketing && (
              <>
                <div>
                  <label className="block text-sm font-medium text-ink-700 mb-3">Marketing Package</label>
                  <div className="grid sm:grid-cols-3 gap-4">
                    {[
                      { id: 'basic', label: 'Basic', price: 'Free', features: ['Social media kit', 'Author page'] },
                      { id: 'standard', label: 'Standard', price: '₹2,999', features: ['Everything in Basic', 'Email campaigns', 'Review outreach'] },
                      { id: 'premium', label: 'Premium', price: '₹9,999', features: ['Everything in Standard', 'Amazon ads', 'Influencer outreach'] },
                    ].map((pkg) => (
                      <button
                        key={pkg.id}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, marketingBudget: pkg.id as any }))}
                        className={cn(
                          'p-4 rounded-xl border-2 text-left transition-all',
                          formData.marketingBudget === pkg.id
                            ? 'border-ink-900 bg-ink-900/5'
                            : 'border-parchment-200 hover:border-parchment-400'
                        )}
                      >
                        <p className="font-medium text-ink-900">{pkg.label}</p>
                        <p className="text-accent-warm font-semibold">{pkg.price}</p>
                        <ul className="text-xs text-ink-500 mt-2 space-y-1">
                          {pkg.features.map(f => <li key={f}>• {f}</li>)}
                        </ul>
                      </button>
                    ))}
                  </div>
                </div>

                <Input
                  label="Social Media Handles"
                  value={formData.socialMediaHandles}
                  onChange={(e) => setFormData(prev => ({ ...prev, socialMediaHandles: e.target.value }))}
                  placeholder="e.g., @yourhandle (Instagram, Twitter)"
                />

                <Input
                  label="Author Website"
                  value={formData.authorWebsite}
                  onChange={(e) => setFormData(prev => ({ ...prev, authorWebsite: e.target.value }))}
                  placeholder="https://yourwebsite.com"
                />

                <Textarea
                  label="Target Readership"
                  value={formData.targetReadership}
                  onChange={(e) => setFormData(prev => ({ ...prev, targetReadership: e.target.value }))}
                  placeholder="Describe your ideal reader: age, interests, reading preferences..."
                  rows={3}
                />

                <Textarea
                  label="Comparable Titles"
                  value={formData.comparableTitles}
                  onChange={(e) => setFormData(prev => ({ ...prev, comparableTitles: e.target.value }))}
                  placeholder="List 2-3 similar books that readers of your book might enjoy"
                  rows={2}
                />
              </>
            )}
          </div>
        )}

        {/* Step 6: Legal Consent */}
        {currentStep === 'legal' && (
          <div className="space-y-8">
            <div>
              <h2 className="font-serif text-xl font-semibold text-ink-900 mb-2">
                Legal Declarations
              </h2>
              <p className="text-ink-600">
                Please review and accept the following to complete your submission.
              </p>
            </div>

            <div className="space-y-4">
              <label className={cn(
                'flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all',
                formData.originalityDeclaration ? 'border-emerald-400 bg-emerald-50' : 'border-parchment-200'
              )}>
                <input
                  type="checkbox"
                  checked={formData.originalityDeclaration}
                  onChange={(e) => setFormData(prev => ({ ...prev, originalityDeclaration: e.target.checked }))}
                  className="mt-1 w-5 h-5 rounded text-emerald-600"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <Copyright weight="duotone" className="h-5 w-5 text-ink-700" />
                    <span className="font-medium text-ink-900">Declaration of Originality *</span>
                  </div>
                  <p className="text-sm text-ink-600 mt-1">
                    I declare that this work is entirely my own original creation and has not been copied or plagiarized from any other source.
                  </p>
                </div>
              </label>

              <label className={cn(
                'flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all',
                formData.noInfringement ? 'border-emerald-400 bg-emerald-50' : 'border-parchment-200'
              )}>
                <input
                  type="checkbox"
                  checked={formData.noInfringement}
                  onChange={(e) => setFormData(prev => ({ ...prev, noInfringement: e.target.checked }))}
                  className="mt-1 w-5 h-5 rounded text-emerald-600"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck weight="duotone" className="h-5 w-5 text-ink-700" />
                    <span className="font-medium text-ink-900">No Copyright Infringement *</span>
                  </div>
                  <p className="text-sm text-ink-600 mt-1">
                    I confirm that this work does not infringe upon the intellectual property rights of any third party.
                  </p>
                </div>
              </label>

              <label className={cn(
                'flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all',
                formData.rightsConfirmation ? 'border-emerald-400 bg-emerald-50' : 'border-parchment-200'
              )}>
                <input
                  type="checkbox"
                  checked={formData.rightsConfirmation}
                  onChange={(e) => setFormData(prev => ({ ...prev, rightsConfirmation: e.target.checked }))}
                  className="mt-1 w-5 h-5 rounded text-emerald-600"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <BookOpen weight="duotone" className="h-5 w-5 text-ink-700" />
                    <span className="font-medium text-ink-900">Publishing Rights *</span>
                  </div>
                  <p className="text-sm text-ink-600 mt-1">
                    I confirm that I hold the necessary rights to publish this work and grant Penstrike Inkworks the non-exclusive right to distribute it.
                  </p>
                </div>
              </label>

              <label className={cn(
                'flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all',
                formData.termsAccepted ? 'border-emerald-400 bg-emerald-50' : 'border-parchment-200'
              )}>
                <input
                  type="checkbox"
                  checked={formData.termsAccepted}
                  onChange={(e) => setFormData(prev => ({ ...prev, termsAccepted: e.target.checked }))}
                  className="mt-1 w-5 h-5 rounded text-emerald-600"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <Scales weight="duotone" className="h-5 w-5 text-ink-700" />
                    <span className="font-medium text-ink-900">Terms of Service *</span>
                  </div>
                  <p className="text-sm text-ink-600 mt-1">
                    I have read and agree to the <Link href="/terms" className="text-accent-warm hover:underline">Terms of Service</Link> and <Link href="/author-agreement" className="text-accent-warm hover:underline">Author Agreement</Link>.
                  </p>
                </div>
              </label>

              <label className={cn(
                'flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all',
                formData.privacyAccepted ? 'border-emerald-400 bg-emerald-50' : 'border-parchment-200'
              )}>
                <input
                  type="checkbox"
                  checked={formData.privacyAccepted}
                  onChange={(e) => setFormData(prev => ({ ...prev, privacyAccepted: e.target.checked }))}
                  className="mt-1 w-5 h-5 rounded text-emerald-600"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <CheckSquare weight="duotone" className="h-5 w-5 text-ink-700" />
                    <span className="font-medium text-ink-900">Privacy Policy *</span>
                  </div>
                  <p className="text-sm text-ink-600 mt-1">
                    I have read and agree to the <Link href="/privacy" className="text-accent-warm hover:underline">Privacy Policy</Link>.
                  </p>
                </div>
              </label>
            </div>

            {/* Summary */}
            <div className="p-4 bg-parchment-50 rounded-xl">
              <h3 className="font-medium text-ink-900 mb-3">Submission Summary</h3>
              <div className="grid sm:grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-ink-500">Title:</span>
                  <span className="font-medium text-ink-900">{formData.title || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-500">Genre:</span>
                  <span className="font-medium text-ink-900">{formData.genre.join(', ') || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-500">Cover:</span>
                  <span className="font-medium text-ink-900 capitalize">{formData.coverOption}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-500">Print MRP:</span>
                  <span className="font-medium text-ink-900">{formData.suggestedMrp ? formatCurrency(parseFloat(formData.suggestedMrp)) : '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-500">Royalty:</span>
                  <span className="font-medium text-ink-900">{formData.royaltyModel === 'premium' ? '70%' : '60%'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-500">Distribution:</span>
                  <span className="font-medium text-ink-900 capitalize">{formData.distributionScope}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t border-parchment-200">
          {currentStepIndex > 0 ? (
            <Button variant="outline" onClick={goToPrevStep}>
              <CaretLeft weight="bold" className="mr-2 h-4 w-4" />
              Back
            </Button>
          ) : (
            <div />
          )}

          {currentStep === 'legal' ? (
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={!canProceed() || isSubmitting}
              className="gap-2"
            >
              {isSubmitting ? (
                <>
                  <SpinnerGap weight="bold" className="h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Manuscript
                  <Check weight="bold" className="h-4 w-4" />
                </>
              )}
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={goToNextStep}
              disabled={!canProceed()}
              className="gap-2"
            >
              Continue
              <CaretRight weight="bold" className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
