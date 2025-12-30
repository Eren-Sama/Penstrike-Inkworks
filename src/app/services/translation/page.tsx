'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Translate,
  CheckCircle,
  Globe,
  Users,
  BookOpen,
  Trophy,
  Clock,
  Shield
} from '@phosphor-icons/react/dist/ssr';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';

const languages = [
  { name: 'Spanish', flag: '🇪🇸', readers: '500M+' },
  { name: 'German', flag: '🇩🇪', readers: '100M+' },
  { name: 'French', flag: '🇫🇷', readers: '280M+' },
  { name: 'Italian', flag: '🇮🇹', readers: '65M+' },
  { name: 'Portuguese', flag: '🇧🇷', readers: '250M+' },
  { name: 'Japanese', flag: '🇯🇵', readers: '125M+' },
  { name: 'Chinese', flag: '🇨🇳', readers: '1B+' },
  { name: 'Korean', flag: '🇰🇷', readers: '80M+' },
];

const process = [
  { step: 1, title: 'Analysis', description: 'We analyze your book and target markets to create a translation strategy' },
  { step: 2, title: 'Translation', description: 'Native-speaking professional translators work on your manuscript' },
  { step: 3, title: 'Editing', description: 'Bilingual editors ensure accuracy and cultural appropriateness' },
  { step: 4, title: 'Localization', description: 'Cover design and marketing materials adapted for each market' },
];

const packages = [
  {
    name: 'Single Language',
    price: 'From $0.08',
    unit: '/word',
    description: 'Professional translation into one language',
    features: ['Native translator', 'Editorial review', 'Formatting included', '30-day delivery', 'Single revision'],
    popular: false,
  },
  {
    name: 'Multi-Language',
    price: 'From $0.06',
    unit: '/word',
    description: 'Discount for multiple language translations',
    features: ['3+ languages', 'Native translators', 'Editorial review', 'Coordinated delivery', 'Market research', 'Cover localization'],
    popular: true,
  },
  {
    name: 'Full Localization',
    price: 'Custom',
    unit: 'quote',
    description: 'Complete market entry package',
    features: ['Translation + editing', 'Cover redesign', 'Marketing copy', 'Category research', 'Launch support', 'Ongoing consulting'],
    popular: false,
  },
];

export default function TranslationServicePage() {
  return (
    <div className="min-h-screen bg-parchment-50">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-20 right-20 w-72 h-72 rounded-full bg-white blur-3xl" />
        </div>
        <div className="container relative z-10">
          <Link 
            href="/services"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" weight="bold" />
            Back to Services
          </Link>
          <div className="max-w-3xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center animate-fade-up">
                <Translate className="h-8 w-8 text-white" weight="duotone" />
              </div>
              <span className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium animate-fade-up" style={{ animationDelay: '100ms' }}>
                Expansion Service
              </span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 animate-fade-up" style={{ animationDelay: '200ms' }}>
              Book Translation
            </h1>
            <p className="text-xl text-white/90 mb-8 animate-fade-up" style={{ animationDelay: '300ms' }}>
              Reach millions of new readers worldwide with professional book translations. 
              Native translators, cultural adaptation, and complete localization services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-up" style={{ animationDelay: '400ms' }}>
              <Button variant="primary" className="bg-white text-teal-600 hover:bg-white/90 gap-2">
                Get Quote
                <ArrowRight className="h-5 w-5" weight="bold" />
              </Button>
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                View Languages
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Languages */}
      <section className="container py-20">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-ink-900 mb-4">Available Languages</h2>
          <p className="text-xl text-ink-600">Professional translation in 40+ languages</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {languages.map((lang, index) => (
            <div
              key={lang.name}
              className="rounded-2xl bg-white border border-parchment-200 shadow-card p-4 text-center hover:shadow-elegant transition-all duration-500 hover:-translate-y-2 animate-fade-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <span className="text-3xl block mb-2">{lang.flag}</span>
              <h3 className="font-semibold text-ink-900 text-sm">{lang.name}</h3>
              <p className="text-xs text-ink-500">{lang.readers} readers</p>
            </div>
          ))}
        </div>
        <p className="text-center text-ink-500 mt-6">+ 32 more languages available</p>
      </section>

      {/* Process */}
      <section className="py-20 bg-gradient-to-b from-parchment-50 to-parchment-100">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-ink-900 mb-4">Our Process</h2>
            <p className="text-xl text-ink-600 max-w-2xl mx-auto">
              A thorough approach ensuring quality and cultural authenticity
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {process.map((item, index) => (
              <div key={item.step} className="text-center animate-fade-up" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 text-white text-2xl font-bold flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-serif text-lg font-bold text-ink-900 mb-2">{item.title}</h3>
                <p className="text-ink-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="container py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-ink-900 mb-6">
              Why Our Translations Stand Out
            </h2>
            <div className="space-y-6">
              {[
                { icon: Users, title: 'Native Translators', description: 'All translations done by native speakers who understand cultural nuances' },
                { icon: Trophy, title: 'Literary Specialists', description: 'Translators with experience in your genre for authentic voice preservation' },
                { icon: Shield, title: 'Quality Guarantee', description: 'Multiple rounds of editing and proofreading included' },
                { icon: Clock, title: 'Fast Turnaround', description: 'Efficient process without compromising on quality' },
              ].map((item, index) => (
                <div key={item.title} className="flex gap-4 animate-fade-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                    <item.icon className="h-6 w-6 text-white" weight="duotone" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-ink-900 mb-1">{item.title}</h3>
                    <p className="text-ink-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 p-8 text-white">
            <h3 className="font-serif text-2xl font-bold mb-6">Translation Stats</h3>
            <div className="grid grid-cols-2 gap-6">
              {[
                { value: '500+', label: 'Books Translated' },
                { value: '40+', label: 'Languages' },
                { value: '98%', label: 'Client Satisfaction' },
                { value: '100%', label: 'Native Translators' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-white/80">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-gradient-to-b from-parchment-50 to-parchment-100">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-ink-900 mb-4">Translation Packages</h2>
            <p className="text-xl text-ink-600">Transparent pricing for every budget</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {packages.map((pkg, index) => (
              <div
                key={pkg.name}
                className={cn(
                  'rounded-2xl border shadow-card p-8 relative animate-fade-up',
                  pkg.popular 
                    ? 'bg-gradient-to-b from-teal-50 to-cyan-50 border-teal-300 scale-105' 
                    : 'bg-white border-parchment-200'
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {pkg.popular && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-sm font-semibold">
                    Best Value
                  </span>
                )}
                <h3 className="font-serif text-xl font-bold text-ink-900">{pkg.name}</h3>
                <div className="mt-4 mb-2">
                  <span className="text-4xl font-bold text-ink-900">{pkg.price}</span>
                  <span className="text-ink-500 ml-1">{pkg.unit}</span>
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
                <Button 
                  variant={pkg.popular ? 'primary' : 'outline'} 
                  className={cn('w-full', pkg.popular && 'bg-gradient-to-r from-teal-500 to-cyan-500')}
                >
                  {pkg.price === 'Custom' ? 'Request Quote' : 'Get Started'}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container py-20">
        <div className="rounded-3xl bg-gradient-to-r from-teal-500 to-cyan-500 p-12 text-center">
          <h2 className="font-serif text-3xl font-bold text-white mb-4">Ready to Go Global?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Get a free quote and market analysis for your book
          </p>
          <Button variant="primary" className="bg-white text-teal-600 hover:bg-white/90 gap-2">
            Request Free Quote
            <ArrowRight className="h-5 w-5" weight="bold" />
          </Button>
        </div>
      </section>
    </div>
  );
}
