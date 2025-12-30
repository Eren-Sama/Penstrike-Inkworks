import {
  BookOpen,
  FileText,
  Video,
  Question as HelpCircle,
  Download,
  ArrowSquareOut as ExternalLink,
  MagnifyingGlass as Search,
  CaretRight as ChevronRight,
  Sparkle as Sparkles,
  Palette,
  Globe,
  CurrencyDollar as DollarSign,
  BookBookmark as BookMarked,
  Headphones,
  ChatCircleDots,
  EnvelopeSimple,
  Clock,
  Users,
  Star,
  Lightning,
  Lifebuoy,
  Newspaper,
  GraduationCap,
  Trophy,
  Check,
  ArrowRight,
  Phone,
  Play
} from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';
import { Button } from '@/components/ui';

const categories = [
  {
    title: 'Getting Started',
    description: 'Everything you need to begin your publishing journey',
    icon: GraduationCap,
    gradient: 'from-emerald-500 to-teal-600',
    articles: [
      { title: 'Creating Your Author Account', slug: 'creating-account', readTime: '3 min' },
      { title: 'Uploading Your First Manuscript', slug: 'uploading-manuscript', readTime: '5 min' },
      { title: 'Understanding the Review Process', slug: 'review-process', readTime: '4 min' },
      { title: 'Setting Up Your Payment Method', slug: 'payment-setup', readTime: '3 min' },
    ],
  },
  {
    title: 'Publishing',
    description: 'Detailed guides for formatting and publishing',
    icon: FileText,
    gradient: 'from-blue-500 to-indigo-600',
    articles: [
      { title: 'Manuscript Formatting Guidelines', slug: 'formatting-guidelines', readTime: '8 min' },
      { title: 'Cover Design Requirements', slug: 'cover-requirements', readTime: '5 min' },
      { title: 'ISBN and Copyright Registration', slug: 'isbn-copyright', readTime: '6 min' },
      { title: 'Pre-Launch Checklist', slug: 'prelaunch-checklist', readTime: '4 min' },
    ],
  },
  {
    title: 'AI Tools',
    description: 'Master our AI-powered creative tools',
    icon: Sparkles,
    gradient: 'from-purple-500 to-pink-600',
    articles: [
      { title: 'Using AI Cover Generator', slug: 'ai-cover-guide', readTime: '6 min' },
      { title: 'Creating AI Audiobooks', slug: 'ai-audiobook-guide', readTime: '7 min' },
      { title: 'Understanding AI Credits', slug: 'ai-credits', readTime: '3 min' },
      { title: 'Best Practices for AI Tools', slug: 'ai-best-practices', readTime: '5 min' },
    ],
  },
  {
    title: 'Marketing & Sales',
    description: 'Grow your audience and increase sales',
    icon: Globe,
    gradient: 'from-orange-500 to-amber-600',
    articles: [
      { title: 'Marketing Your Book', slug: 'marketing-basics', readTime: '10 min' },
      { title: 'Understanding Royalties', slug: 'royalties-explained', readTime: '5 min' },
      { title: 'Pricing Strategies', slug: 'pricing-strategies', readTime: '6 min' },
      { title: 'Building Your Author Brand', slug: 'author-branding', readTime: '8 min' },
    ],
  },
];

const quickLinks = [
  { title: 'Video Tutorials', description: 'Step-by-step visual guides', icon: Video, href: '/help/videos', count: '24 videos', color: 'text-red-500 bg-red-50' },
  { title: 'Downloadable Guides', description: 'PDF resources to keep', icon: Download, href: '/help/downloads', count: '8 guides', color: 'text-emerald-500 bg-emerald-50' },
  { title: 'FAQ', description: 'Quick answers to common questions', icon: HelpCircle, href: '/help/faq', count: '45+ questions', color: 'text-blue-500 bg-blue-50' },
  { title: 'Community Forum', description: 'Connect with other authors', icon: Users, href: '/community', count: '12.5k members', color: 'text-purple-500 bg-purple-50' },
];

const popularArticles = [
  { title: 'How to format your manuscript for print and ebook', views: '12.3K', rating: 4.9 },
  { title: 'Getting your first 1000 readers: A complete guide', views: '9.8K', rating: 4.8 },
  { title: 'AI Cover Design: From concept to final cover', views: '8.5K', rating: 4.9 },
  { title: 'Royalty rates explained: What you actually earn', views: '7.2K', rating: 4.7 },
  { title: 'Building an email list before your book launch', views: '6.9K', rating: 4.8 },
];

const supportOptions = [
  { 
    title: 'Live Chat', 
    description: 'Chat with our support team', 
    icon: ChatCircleDots, 
    availability: 'Available 24/7',
    action: 'Start Chat',
    gradient: 'from-accent-yellow to-accent-amber',
    primary: true
  },
  { 
    title: 'Email Support', 
    description: 'Get help via email', 
    icon: EnvelopeSimple, 
    availability: 'Response within 24 hours',
    action: 'Send Email',
    gradient: 'from-blue-500 to-indigo-600',
    primary: false
  },
  { 
    title: 'Schedule a Call', 
    description: 'One-on-one consultation', 
    icon: Phone, 
    availability: 'Book a 30-min slot',
    action: 'Schedule',
    gradient: 'from-emerald-500 to-teal-600',
    primary: false
  },
];

export default function HelpCenterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-parchment-50 to-cream-100">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-ink-900 via-ink-800 to-ink-900" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-20 w-96 h-96 bg-accent-yellow/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white/90 text-sm mb-6 animate-fade-up">
              <Lifebuoy weight="duotone" className="h-4 w-4" />
              Penstrike Help Center
            </div>
            <h1 className="font-serif text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-up" style={{ animationDelay: '100ms' }}>
              How Can We Help You?
            </h1>
            <p className="text-xl text-parchment-200 mb-10 animate-fade-up max-w-2xl mx-auto" style={{ animationDelay: '200ms' }}>
              Find answers, tutorials, and resources to help you publish successfully
            </p>

            {/* Search */}
            <div className="relative max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: '300ms' }}>
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-ink-400" />
              <input
                type="text"
                placeholder="Search for articles, guides, or topics..."
                className="w-full pl-14 pr-6 py-5 rounded-2xl bg-white shadow-elegant-lg border border-parchment-200 text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-accent-yellow/50 text-lg"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Button size="sm" className="bg-ink-900 text-white hover:bg-ink-800">
                  Search
                </Button>
              </div>
            </div>

            {/* Popular searches */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-6 animate-fade-up" style={{ animationDelay: '400ms' }}>
              <span className="text-sm text-parchment-300">Popular:</span>
              {['Manuscript formatting', 'Royalties', 'AI covers', 'ISBN'].map((term) => (
                <Link 
                  key={term}
                  href={`/help/search?q=${encodeURIComponent(term)}`}
                  className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-sm text-white/80 hover:text-white transition-all"
                >
                  {term}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12 -mt-10 relative z-20">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {quickLinks.map((link, index) => (
              <Link
                key={link.title}
                href={link.href}
                className="group p-6 rounded-2xl bg-white border border-parchment-200 shadow-card hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl ${link.color} flex items-center justify-center flex-shrink-0`}>
                    <link.icon weight="duotone" className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-ink-900 group-hover:text-accent-warm transition-colors">{link.title}</p>
                    <p className="text-sm text-ink-500 mt-0.5">{link.description}</p>
                    <p className="text-xs text-ink-400 mt-2 font-medium">{link.count}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ink-100 text-ink-700 text-sm mb-4">
              <BookOpen weight="duotone" className="h-4 w-4" />
              Knowledge Base
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-ink-900 mb-4">Browse by Category</h2>
            <p className="text-ink-600 max-w-2xl mx-auto">
              Explore our comprehensive guides organized by topic
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {categories.map((category, index) => (
              <div
                key={category.title}
                className="rounded-3xl bg-white border border-parchment-200 shadow-card overflow-hidden hover:shadow-elegant transition-all duration-300 animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`p-6 bg-gradient-to-r ${category.gradient}`}>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <category.icon weight="duotone" className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h3 className="font-serif text-xl font-bold text-white">{category.title}</h3>
                      <p className="text-white/80 text-sm">{category.description}</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <ul className="space-y-0">
                    {category.articles.map((article) => (
                      <li key={article.slug}>
                        <Link
                          href={`/help/${article.slug}`}
                          className="flex items-center justify-between py-3 px-3 -mx-3 rounded-xl text-ink-700 hover:text-ink-900 hover:bg-parchment-50 transition-all group"
                        >
                          <span className="font-medium">{article.title}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-ink-400 flex items-center gap-1">
                              <Clock weight="regular" className="h-3 w-3" />
                              {article.readTime}
                            </span>
                            <ChevronRight className="h-4 w-4 text-ink-400 group-hover:text-accent-warm group-hover:translate-x-0.5 transition-all" />
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/help/category/${category.title.toLowerCase().replace(/\s+/g, '-')}`}
                    className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-accent-warm hover:text-accent-amber transition-colors"
                  >
                    View all {category.title.toLowerCase()} articles
                    <ArrowRight weight="bold" className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Articles */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-700 text-sm mb-4">
                  <Trophy weight="duotone" className="h-4 w-4" />
                  Most Popular
                </div>
                <h2 className="font-serif text-3xl font-bold text-ink-900">Trending Articles</h2>
                <p className="text-ink-600 mt-2">What other authors are reading</p>
              </div>
              <Link href="/help/popular" className="text-accent-warm hover:text-accent-amber font-semibold flex items-center gap-1">
                View all popular
                <ArrowRight weight="bold" className="h-4 w-4" />
              </Link>
            </div>

            <div className="space-y-3">
              {popularArticles.map((article, index) => (
                <Link
                  key={article.title}
                  href="#"
                  className="flex items-center justify-between p-5 rounded-2xl bg-parchment-50 border border-parchment-200 hover:bg-parchment-100 hover:border-parchment-300 transition-all group animate-fade-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-full bg-ink-100 text-ink-600 flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                    <span className="font-medium text-ink-900 group-hover:text-accent-warm transition-colors">
                      {article.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-ink-500">
                    <span className="flex items-center gap-1">
                      <Star weight="fill" className="h-4 w-4 text-amber-400" />
                      {article.rating}
                    </span>
                    <span>{article.views} views</span>
                    <ChevronRight className="h-4 w-4 text-ink-400 group-hover:text-accent-warm transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Video */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-100 text-red-700 text-sm mb-4">
                  <Video weight="duotone" className="h-4 w-4" />
                  Featured Tutorial
                </div>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-ink-900 mb-4">
                  Publishing Your First Book
                </h2>
                <p className="text-ink-600 text-lg mb-6">
                  Watch our comprehensive 15-minute guide that walks you through the entire publishing process, from manuscript upload to your first sale.
                </p>
                <ul className="space-y-3 mb-8">
                  {['Account setup and verification', 'Manuscript formatting', 'Cover design best practices', 'Pricing and distribution'].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-ink-700">
                      <Check weight="bold" className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/help/videos">
                  <Button size="lg" className="gap-2">
                    <Play weight="fill" className="h-5 w-5" />
                    Watch All Tutorials
                  </Button>
                </Link>
              </div>
              <div className="relative">
                <div className="aspect-video rounded-3xl bg-gradient-to-br from-ink-800 to-ink-900 overflow-hidden shadow-elegant-lg">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button className="w-20 h-20 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                      <Play weight="fill" className="h-8 w-8 text-ink-900 ml-1" />
                    </button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-ink-900 to-transparent">
                    <p className="text-white font-medium">Getting Started: Complete Guide</p>
                    <p className="text-white/70 text-sm">15:32 • 45K views</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support Options */}
      <section className="py-20 bg-gradient-to-br from-ink-900 via-ink-800 to-ink-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white/90 text-sm mb-4">
              <Lightning weight="duotone" className="h-4 w-4" />
              Need More Help?
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">
              Get in Touch With Our Team
            </h2>
            <p className="text-parchment-200 text-lg">
              Can't find what you're looking for? Our support team is here to help.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {supportOptions.map((option, index) => (
              <div
                key={option.title}
                className={`p-8 rounded-3xl ${option.primary ? 'bg-white' : 'bg-white/10 backdrop-blur-sm border border-white/20'} animate-fade-up`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${option.gradient} flex items-center justify-center mb-5`}>
                  <option.icon weight="duotone" className="h-7 w-7 text-white" />
                </div>
                <h3 className={`font-serif text-xl font-bold mb-2 ${option.primary ? 'text-ink-900' : 'text-white'}`}>
                  {option.title}
                </h3>
                <p className={`text-sm mb-4 ${option.primary ? 'text-ink-600' : 'text-white/70'}`}>
                  {option.description}
                </p>
                <p className={`text-xs font-medium mb-5 ${option.primary ? 'text-emerald-600' : 'text-emerald-400'}`}>
                  {option.availability}
                </p>
                <Button 
                  variant={option.primary ? 'primary' : 'outline'} 
                  className={`w-full ${!option.primary && 'border-white/30 text-white hover:bg-white/10'}`}
                >
                  {option.action}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-yellow/20 text-accent-warm text-sm mb-4">
              <Newspaper weight="duotone" className="h-4 w-4" />
              Stay Updated
            </div>
            <h2 className="font-serif text-3xl font-bold text-ink-900 mb-4">
              Subscribe to Publishing Tips
            </h2>
            <p className="text-ink-600 mb-8">
              Get weekly tips, industry news, and exclusive resources delivered to your inbox
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-5 py-3.5 rounded-xl border border-parchment-200 focus:border-accent-yellow focus:ring-2 focus:ring-accent-yellow/20 outline-none"
              />
              <Button size="lg" className="btn-accent">
                Subscribe
              </Button>
            </div>
            <p className="text-xs text-ink-400 mt-4">
              Join 25,000+ authors. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
