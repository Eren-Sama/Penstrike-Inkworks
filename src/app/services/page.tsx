import Link from 'next/link';
import { 
  NotePencil, 
  PenNib, 
  Headphones, 
  PaperPlaneTilt,
  ChartBar,
  FileText,
  Wallet,
  ArrowRight,
  CheckCircle,
  MagicWand,
  SquaresFour,
  Globe,
  Users,
  Lightning,
  ShieldCheck,
  Star,
  Trophy
} from '@phosphor-icons/react/dist/ssr';

export const metadata = {
  title: 'Services - Penstrike Inkworks',
  description: 'Professional publishing services for authors - editing, cover design, AI audiobooks, distribution, and more.',
};

export default function ServicesPage() {
  const services = [
    {
      icon: FileText,
      title: 'Manuscript Evaluation',
      description: 'Get professional feedback on your manuscript before committing to the full publishing process.',
      features: [
        'Comprehensive story assessment',
        'Market positioning analysis',
        'Constructive feedback report',
        'Personalized improvement suggestions',
      ],
      price: 'From $299',
      href: '/services/evaluation',
      color: 'from-slate-500 to-gray-600',
    },
    {
      icon: NotePencil,
      title: 'Editing & Proofreading',
      description: 'Combine human expertise with AI precision for flawless manuscripts.',
      features: [
        'Developmental editing',
        'Line editing & copyediting',
        'AI-powered grammar & style checks',
        'Multiple revision rounds',
      ],
      price: 'From $0.02/word',
      href: '/services/editing',
      color: 'from-blue-500 to-indigo-600',
    },
    {
      icon: PenNib,
      title: 'Cover Design',
      description: 'Stunning covers that capture your story and attract readers.',
      features: [
        'Professional designer collaboration',
        'AI cover generation option',
        'Multiple concept variations',
        'Print and digital formats',
      ],
      price: 'From $199',
      href: '/services/cover-design',
      color: 'from-rose-500 to-pink-600',
    },
    {
      icon: Headphones,
      title: 'AI Audiobook Creation',
      description: 'Transform your book into an audiobook with emotional, natural-sounding AI narration.',
      features: [
        'Multiple voice options',
        'Emotional intensity control',
        'Chapter-by-chapter preview',
        'Professional quality output',
      ],
      price: 'From $99',
      href: '/services/audiobooks',
      color: 'from-orange-500 to-amber-600',
    },
    {
      icon: SquaresFour,
      title: 'Book Formatting',
      description: 'Professional interior layouts for print, eBook, and all digital formats.',
      features: [
        'Print-ready PDF layouts',
        'eBook formatting (EPUB, MOBI)',
        'Custom typography options',
        'Table of contents & index',
      ],
      price: 'From $149',
      href: '/services/formatting',
      color: 'from-emerald-500 to-teal-600',
    },
    {
      icon: PaperPlaneTilt,
      title: 'Printing & Distribution',
      description: 'Get your book into readers\' hands worldwide with sustainable printing.',
      features: [
        'Cotton-based sustainable paper',
        'Print-on-demand flexibility',
        'Global distribution network',
        'eBook & audiobook delivery',
      ],
      price: 'Included with publishing',
      href: '/services/distribution',
      color: 'from-violet-500 to-purple-600',
    },
    {
      icon: ChartBar,
      title: 'Marketing Support',
      description: 'Strategic guidance to help your book find its audience.',
      features: [
        'Launch strategy planning',
        'Social media templates',
        'Email marketing setup',
        'Book description optimization',
      ],
      price: 'From $499',
      href: '/services/marketing',
      color: 'from-cyan-500 to-blue-600',
    },
    {
      icon: Globe,
      title: 'Translation Services',
      description: 'Reach global audiences with professional translations.',
      features: [
        'Human translation quality',
        'Cultural adaptation',
        'Multiple language options',
        'Proof reading included',
      ],
      price: 'From $0.08/word',
      href: '/services/translation',
      color: 'from-teal-500 to-cyan-600',
    },
  ];

  const stats = [
    { number: '10,000+', label: 'Authors Served' },
    { number: '50,000+', label: 'Books Published' },
    { number: '70%', label: 'Author Royalties' },
    { number: '24/7', label: 'Support Available' },
  ];

  return (
    <>
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-b from-parchment-100 via-parchment-50 to-white overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent-yellow/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-parchment-400/20 rounded-full blur-3xl animate-float animation-delay-500" />
        </div>
        <div className="absolute inset-0 bg-grid opacity-30" />
        
        <div className="container-editorial relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-yellow/10 border border-accent-yellow/20 text-accent-warm text-sm font-semibold mb-6 animate-fade-down">
              <MagicWand weight="duotone" className="h-4 w-4" />
              Professional Publishing Services
            </span>
            
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-ink-900 mb-6 animate-fade-up">
              Everything You Need to{' '}
              <span className="text-gradient-gold">Publish Successfully</span>
            </h1>
            
            <p className="text-ink-600 text-xl mb-10 leading-relaxed animate-fade-up animation-delay-100">
              From manuscript to bestseller, we provide comprehensive services 
              tailored for independent authors who demand excellence.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 animate-fade-up animation-delay-200">
              <Link href="/signup?role=author" className="btn-accent btn-lg group shadow-glow-gold">
                Get Started
                <ArrowRight weight="bold" className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/contact" className="btn-glass btn-lg">
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 bg-ink-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-dots opacity-10" />
        <div className="container-editorial relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="text-center animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <p className="text-3xl md:text-4xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent-yellow to-accent-amber">
                  {stat.number}
                </p>
                <p className="text-parchment-300 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 lg:py-32 bg-gradient-to-b from-white via-parchment-50 to-white">
        <div className="container-editorial">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-ink-900 mb-4">
              Our Services
            </h2>
            <p className="text-ink-600 text-lg">
              Choose from our comprehensive suite of publishing services.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Link
                key={index}
                href={service.href}
                className="group relative p-8 rounded-3xl bg-white border border-parchment-200 hover:border-accent-yellow/30 shadow-card hover:shadow-elegant-lg transition-all duration-500 hover:-translate-y-2 animate-fade-up overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-md`}>
                      <service.icon className="h-6 w-6 text-white" />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-parchment-100 text-ink-700 text-sm font-semibold border border-parchment-200">
                      {service.price}
                    </span>
                  </div>
                  
                  <h3 className="font-serif text-2xl font-bold text-ink-900 mb-3 group-hover:text-accent-warm transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-ink-600 mb-6 leading-relaxed">{service.description}</p>
                  
                  <ul className="space-y-3 mb-6">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3 text-ink-700">
                        <CheckCircle weight="fill" className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <span className="inline-flex items-center text-accent-warm font-semibold group-hover:text-accent-amber">
                    Learn more
                    <ArrowRight weight="bold" className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 lg:py-32 bg-gradient-to-b from-parchment-100 via-parchment-50 to-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_rgba(244,208,63,0.1)_0%,_transparent_50%)]" />
        </div>
        
        <div className="container-editorial relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-yellow/10 border border-accent-yellow/20 text-accent-warm text-sm font-semibold mb-6">
              <Trophy weight="duotone" className="h-4 w-4" />
              Why Choose Us
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-ink-900 mb-4">
              The Penstrike Difference
            </h2>
            <p className="text-ink-600 text-lg">
              We are not just a service provider—we are your publishing partner.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Wallet,
                title: '70% Royalties',
                description: 'Keep more of what you earn with industry-leading royalty rates.',
                color: 'from-emerald-500 to-teal-600',
              },
              {
                icon: ShieldCheck,
                title: '100% Ownership',
                description: 'Your work remains yours. Full creative and legal control.',
                color: 'from-blue-500 to-indigo-600',
              },
              {
                icon: Users,
                title: 'Expert Support',
                description: '24/7 access to publishing experts who care about your success.',
                color: 'from-violet-500 to-purple-600',
              },
              {
                icon: Lightning,
                title: 'Fast Turnaround',
                description: 'From manuscript to published book in weeks, not months.',
                color: 'from-orange-500 to-amber-600',
              },
            ].map((item, index) => (
              <div
                key={index}
                className="text-center p-8 rounded-2xl bg-white border border-parchment-200 shadow-card hover:shadow-elegant hover:-translate-y-1 transition-all duration-500 animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-14 h-14 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-md`}>
                  <item.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="font-serif text-xl font-bold text-ink-900 mb-2">{item.title}</h3>
                <p className="text-ink-600 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 lg:py-32 bg-gradient-to-b from-ink-900 to-ink-950 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent-yellow/10 rounded-full blur-3xl animate-float" />
        </div>
        <div className="absolute inset-0 bg-dots opacity-10" />
        
        <div className="container-editorial relative z-10 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6 text-white animate-fade-up">
              Ready to Get Started?
            </h2>
            <p className="text-parchment-200 text-xl mb-10 leading-relaxed animate-fade-up animation-delay-100">
              Join thousands of authors who trust Penstrike with their publishing journey.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 animate-fade-up animation-delay-200">
              <Link href="/signup?role=author" className="btn-accent btn-lg group shadow-glow-gold">
                Create Author Account
                <ArrowRight weight="bold" className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/contact" className="btn-ghost text-parchment-200 hover:bg-white/10 btn-lg">
                Talk to an Expert
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
