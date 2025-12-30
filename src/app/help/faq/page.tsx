'use client';

import { useState } from 'react';
import {
  Question as HelpCircle,
  CaretDown as ChevronDown,
  MagnifyingGlass as Search,
  BookOpen,
  CreditCard,
  FileText,
  Sparkle as Sparkles,
  Globe,
  Shield
} from '@phosphor-icons/react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const categories = [
  { id: 'all', label: 'All Questions', icon: HelpCircle },
  { id: 'getting-started', label: 'Getting Started', icon: BookOpen },
  { id: 'publishing', label: 'Publishing', icon: FileText },
  { id: 'ai-tools', label: 'AI Tools', icon: Sparkles },
  { id: 'payments', label: 'Payments', icon: CreditCard },
  { id: 'distribution', label: 'Distribution', icon: Globe },
  { id: 'account', label: 'Account & Security', icon: Shield },
];

const faqs = [
  {
    category: 'getting-started',
    question: 'How do I create an author account?',
    answer: 'Creating an author account is easy! Click the "Start Publishing" button on our homepage, fill in your details, and verify your email address. Once verified, you can immediately start uploading your manuscripts and exploring our publishing tools.',
  },
  {
    category: 'getting-started',
    question: 'What file formats do you accept for manuscripts?',
    answer: 'We accept manuscripts in DOCX, DOC, PDF, EPUB, and plain text formats. For the best results with our formatting tools, we recommend uploading in DOCX format as it preserves formatting and allows for easier editing.',
  },
  {
    category: 'getting-started',
    question: 'How long does the review process take?',
    answer: 'Our review process typically takes 3-5 business days. During this time, our team checks for quality standards, formatting issues, and content guidelines. You\'ll receive email updates throughout the process, and you can track the status in your author dashboard.',
  },
  {
    category: 'publishing',
    question: 'What are the cover image requirements?',
    answer: 'Cover images should be at least 1600 x 2400 pixels (2:3 ratio) for optimal quality across all platforms. We accept JPEG, PNG, and TIFF formats. The file size should not exceed 50MB. Our AI Cover Generator can create professional covers that meet all these requirements.',
  },
  {
    category: 'publishing',
    question: 'Do I retain the copyright to my work?',
    answer: 'Absolutely! You retain 100% ownership of your copyright when publishing with Penstrike Inkworks. We only require a non-exclusive license to distribute your work through our platform and partner retailers. You\'re free to publish elsewhere simultaneously.',
  },
  {
    category: 'publishing',
    question: 'Can I update my book after publishing?',
    answer: 'Yes! You can update your manuscript, cover, description, and metadata at any time through your author dashboard. Updates typically go live within 24-48 hours across all distribution channels.',
  },
  {
    category: 'ai-tools',
    question: 'What are AI credits and how do they work?',
    answer: 'AI credits are used to access our AI-powered tools like Cover Generator and Audiobook Creator. New authors receive 50 free credits. One cover generation costs 5 credits, while audiobook creation costs vary based on book length (approximately 1 credit per 1,000 words).',
  },
  {
    category: 'ai-tools',
    question: 'Can I use AI-generated covers commercially?',
    answer: 'Yes! All covers generated through our AI Cover Generator come with full commercial rights. You own the output and can use it for your book on any platform without additional licensing fees.',
  },
  {
    category: 'ai-tools',
    question: 'How realistic are the AI-generated audiobook voices?',
    answer: 'Our AI voices are built on state-of-the-art neural text-to-speech technology, offering natural-sounding narration with proper pacing, emphasis, and emotional range. We offer 6 different voice styles to match your book\'s genre and tone.',
  },
  {
    category: 'payments',
    question: 'What royalty rate do authors receive?',
    answer: 'Authors receive 70% royalties on all sales through our platform. For sales through partner retailers, the rate varies from 50-70% depending on the platform and pricing tier. You can view detailed breakdowns in your royalties dashboard.',
  },
  {
    category: 'payments',
    question: 'When and how do I get paid?',
    answer: 'Royalty payments are processed monthly, with a minimum threshold of $25. We support direct bank deposits, PayPal, and wire transfers. Payments are typically processed within the first week of each month for the previous month\'s earnings.',
  },
  {
    category: 'payments',
    question: 'Are there any upfront costs to publish?',
    answer: 'Basic publishing is completely free! We only earn when you earn through our royalty model. Premium services like professional editing, marketing packages, and additional AI credits are available as optional paid upgrades.',
  },
  {
    category: 'distribution',
    question: 'Where will my book be available?',
    answer: 'Your book will be distributed to major platforms including Amazon Kindle, Apple Books, Barnes & Noble, Kobo, Google Play Books, and many more. We handle all the technical requirements and metadata formatting for each platform.',
  },
  {
    category: 'distribution',
    question: 'Can I sell print copies of my book?',
    answer: 'Yes! We offer print-on-demand services through our distribution network. Your book will be professionally printed and shipped directly to customers worldwide. There\'s no inventory to manage or upfront printing costs.',
  },
  {
    category: 'account',
    question: 'How do I enable two-factor authentication?',
    answer: 'Navigate to Settings > Account > Security in your dashboard. Click "Enable 2FA" and follow the prompts to set up authentication using your preferred method (authenticator app, SMS, or email). We highly recommend enabling 2FA to protect your account.',
  },
  {
    category: 'account',
    question: 'Can I have multiple pen names?',
    answer: 'Yes! You can create multiple pen names under a single account. Each pen name can have its own author profile, bio, and branding. This is perfect for authors who write in multiple genres.',
  },
];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-ink-900 via-ink-800 to-ink-900" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-accent-yellow/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white/90 text-sm mb-6 animate-fade-up">
              <HelpCircle className="h-4 w-4" />
              Frequently Asked Questions
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-6 animate-fade-up" style={{ animationDelay: '100ms' }}>
              Got Questions? We Have Answers
            </h1>
            <p className="text-xl text-parchment-200 mb-8 animate-fade-up" style={{ animationDelay: '200ms' }}>
              Find quick answers to the most common questions about publishing with Penstrike Inkworks
            </p>

            {/* Search */}
            <div className="relative max-w-xl mx-auto animate-fade-up" style={{ animationDelay: '300ms' }}>
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-ink-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-accent-yellow/50"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
            {/* Sidebar */}
            <div className="lg:w-64 flex-shrink-0">
              <div className="rounded-2xl bg-white border border-parchment-200 shadow-card p-4 sticky top-24">
                <p className="text-sm font-medium text-ink-500 mb-3 px-2">Categories</p>
                <nav className="space-y-1">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-300 text-sm',
                        activeCategory === cat.id
                          ? 'bg-ink-900 text-white'
                          : 'text-ink-600 hover:bg-parchment-100'
                      )}
                    >
                      <cat.icon className="h-4 w-4" />
                      {cat.label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* FAQ List */}
            <div className="flex-1">
              <div className="space-y-4">
                {filteredFaqs.length === 0 ? (
                  <div className="text-center py-12">
                    <HelpCircle className="h-12 w-12 text-ink-300 mx-auto mb-4" />
                    <p className="text-ink-600">No questions found matching your search.</p>
                  </div>
                ) : (
                  filteredFaqs.map((faq, index) => (
                    <div
                      key={index}
                      className="rounded-2xl bg-white border border-parchment-200 shadow-card overflow-hidden animate-fade-up"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <button
                        onClick={() => setOpenIndex(openIndex === index ? null : index)}
                        className="w-full flex items-center justify-between p-6 text-left"
                      >
                        <span className="font-medium text-ink-900 pr-4">{faq.question}</span>
                        <ChevronDown
                          className={cn(
                            'h-5 w-5 text-ink-400 flex-shrink-0 transition-transform duration-300',
                            openIndex === index && 'rotate-180'
                          )}
                        />
                      </button>
                      <div
                        className={cn(
                          'overflow-hidden transition-all duration-300',
                          openIndex === index ? 'max-h-96' : 'max-h-0'
                        )}
                      >
                        <div className="px-6 pb-6 text-ink-600 border-t border-parchment-100 pt-4">
                          {faq.answer}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-3xl font-bold text-ink-900 mb-4">
              Didn't Find What You're Looking For?
            </h2>
            <p className="text-ink-600 mb-8">
              Our support team is ready to help with any questions you might have
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-primary px-8 py-3">
                Contact Support
              </Link>
              <Link href="/help" className="btn-outline px-8 py-3">
                Browse Help Center
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
