'use client';

import Link from 'next/link';
import {
  ArrowRight,
  Megaphone,
  CheckCircle,
  Target,
  Envelope,
  ShareNetwork,
  Star,
  Sparkle
} from '@phosphor-icons/react/dist/ssr';
import { cn } from '@/lib/utils';

const services = [
  {
    icon: Target,
    title: 'Amazon Advertising',
    description: 'Targeted ad campaigns on Amazon to boost visibility and sales',
    features: ['Keyword research', 'A/B testing', 'Budget optimization', 'Performance tracking']
  },
  {
    icon: ShareNetwork,
    title: 'Social Media Marketing',
    description: 'Build your author brand across social platforms',
    features: ['Content strategy', 'Audience growth', 'Engagement campaigns', 'Influencer outreach']
  },
  {
    icon: Envelope,
    title: 'Email Marketing',
    description: 'Build and nurture your reader community',
    features: ['List building', 'Newsletter design', 'Automation sequences', 'Reader engagement']
  },
  {
    icon: Star,
    title: 'Review Campaigns',
    description: 'Ethical strategies to generate authentic reviews',
    features: ['ARC management', 'Reviewer outreach', 'Review optimization', 'Social proof building']
  },
];

const packages = [
  {
    name: 'Launch',
    price: '₹24,999',
    period: 'one-time',
    description: 'Perfect for new book releases',
    features: ['Launch strategy', '2-week ad campaign', 'Social media kit', 'Email templates', '50 ARC copies'],
    popular: false,
  },
  {
    name: 'Growth',
    price: '₹39,999',
    period: '/month',
    description: 'Sustained marketing for serious authors',
    features: ['All Launch features', 'Ongoing ad management', 'Monthly content calendar', 'Reader newsletter', 'Performance reports', 'Strategy calls'],
    popular: true,
  },
  {
    name: 'Premium',
    price: '₹79,999',
    period: '/month',
    description: 'Full-service marketing management',
    features: ['Everything in Growth', 'Dedicated manager', 'PR & media outreach', 'Influencer partnerships', 'Custom landing pages', 'Audiobook promotion'],
    popular: false,
  },
];

const results = [
  { metric: 'Average Sales Increase', value: '340%', description: 'within first 90 days' },
  { metric: 'Average ROI', value: '5.2x', description: 'on ad spend' },
  { metric: 'Email Open Rate', value: '42%', description: 'vs 20% industry avg' },
  { metric: 'Review Generation', value: '85+', description: 'reviews per launch' },
];

export default function MarketingServicePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-gradient-to-b from-rose-50 via-parchment-50 to-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-rose-200/30 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-pink-200/20 rounded-full blur-3xl animate-float animation-delay-500" />
        </div>
        
        <div className="container-editorial relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-100 text-rose-700 text-sm font-semibold mb-6 animate-fade-down">
              <Megaphone className="h-4 w-4" weight="duotone" />
              Growth Service
            </div>
            
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-ink-900 mb-6 animate-fade-up">
              Book{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">Marketing</span>
            </h1>
            
            <p className="text-ink-600 text-xl mb-10 leading-relaxed animate-fade-up animation-delay-100">
              Get your book in front of the right readers. Data-driven marketing strategies 
              that deliver real results and grow your author career.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 animate-fade-up animation-delay-200">
              <Link href="/signup?role=author" className="btn-primary btn-lg group bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600">
                Get Marketing Plan
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" weight="bold" />
              </Link>
              <Link href="/services" className="btn-glass btn-lg">
                View All Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-16 bg-white">
        <div className="container-editorial">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {results.map((result, index) => (
              <div
                key={result.metric}
                className="rounded-2xl bg-parchment-50 border border-parchment-200 p-6 text-center hover:shadow-elegant transition-all duration-500 animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <p className="text-3xl font-bold text-rose-500 mb-2">{result.value}</p>
                <p className="font-semibold text-ink-900">{result.metric}</p>
                <p className="text-sm text-ink-500">{result.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-24 bg-gradient-to-b from-parchment-50 to-white">
        <div className="container-editorial">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-100 text-rose-700 text-sm font-semibold mb-6">
                <Sparkle className="h-4 w-4" weight="duotone" />
                Our Services
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-ink-900 mb-6">
                Marketing Solutions for Authors
              </h2>
              <p className="text-ink-600 text-lg mb-8 leading-relaxed">
                Comprehensive marketing strategies tailored specifically for authors. 
                From launch campaigns to long-term growth, we&apos;ve got you covered.
              </p>
              
              <div className="relative">
                <div className="aspect-square rounded-3xl bg-gradient-to-br from-rose-100 to-pink-50 p-10 flex items-center justify-center shadow-elegant-lg">
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-lg animate-gentle-pulse">
                      <Megaphone className="h-16 w-16 text-white" weight="duotone" />
                    </div>
                    <p className="font-serif text-2xl text-ink-700 mb-2">Grow Your Readership</p>
                    <p className="text-ink-500">Data-driven strategies</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {services.map((service, index) => (
                <div
                  key={service.title}
                  className="rounded-2xl bg-parchment-50 border border-parchment-200 p-6 hover:shadow-elegant hover:-translate-y-1 transition-all duration-500 animate-fade-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center flex-shrink-0">
                      <service.icon className="h-6 w-6 text-white" weight="duotone" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-serif text-lg font-bold text-ink-900 mb-1">{service.title}</h3>
                      <p className="text-ink-600 text-sm mb-3">{service.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {service.features.map((feature) => (
                          <span key={feature} className="inline-flex items-center gap-1 text-xs text-ink-700 bg-white px-2 py-1 rounded-full border border-parchment-200">
                            <CheckCircle className="h-3 w-3 text-emerald-500" weight="fill" />
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-white">
        <div className="container-editorial">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-ink-900 mb-4">Marketing Packages</h2>
            <p className="text-xl text-ink-600">Invest in your author career with proven strategies</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {packages.map((pkg, index) => (
              <div
                key={pkg.name}
                className={cn(
                  'rounded-2xl border p-8 relative animate-fade-up hover:shadow-elegant transition-all duration-500',
                  pkg.popular 
                    ? 'bg-gradient-to-b from-rose-50 to-pink-50 border-rose-300 scale-105' 
                    : 'bg-parchment-50 border-parchment-200'
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {pkg.popular && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white text-sm font-semibold">
                    Best Value
                  </span>
                )}
                <h3 className="font-serif text-xl font-bold text-ink-900">{pkg.name}</h3>
                <div className="mt-4 mb-2">
                  <span className="text-4xl font-bold text-ink-900">{pkg.price}</span>
                  <span className="text-ink-500 ml-1">{pkg.period}</span>
                </div>
                <p className="text-ink-600 mb-6">{pkg.description}</p>
                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-ink-700">
                      <CheckCircle className="h-4 w-4 text-emerald-500" weight="fill" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link 
                  href="/signup?role=author"
                  className={cn(
                    'btn w-full justify-center',
                    pkg.popular 
                      ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600' 
                      : 'btn-outline'
                  )}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-pink-500 to-rose-500 text-white">
        <div className="container-editorial text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            Ready to Grow Your Readership?
          </h2>
          <p className="text-rose-100 text-lg mb-8 max-w-2xl mx-auto">
            Book a free strategy call to discuss your marketing goals.
          </p>
          <Link href="/signup?role=author" className="btn-lg bg-white text-rose-600 hover:bg-rose-50 inline-flex items-center gap-2 font-semibold">
            Schedule Free Consultation
            <ArrowRight className="h-5 w-5" weight="bold" />
          </Link>
        </div>
      </section>
    </>
  );
}
