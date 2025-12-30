'use client';

import Link from 'next/link';
import {
  ArrowRight,
  FileText,
  CheckCircle,
  DeviceTabletCamera,
  Monitor,
  BookOpen,
  Sparkle
} from '@phosphor-icons/react/dist/ssr';
import { cn } from '@/lib/utils';

const formatTypes = [
  {
    icon: DeviceTabletCamera,
    title: 'eBook Formatting',
    description: 'Optimized for all e-readers including Kindle, Kobo, and Apple Books',
    features: ['Reflowable text', 'Clickable TOC', 'Device optimization', 'Font embedding']
  },
  {
    icon: BookOpen,
    title: 'Print-Ready PDF',
    description: 'Professional layouts for paperback and hardcover printing',
    features: ['Bleed margins', 'Professional typography', 'Print presets', 'ISBN placement']
  },
  {
    icon: Monitor,
    title: 'Enhanced eBook',
    description: 'Rich media formats with interactive features',
    features: ['Multimedia support', 'Interactive elements', 'Fixed layouts', 'Enhanced navigation']
  },
];

const packages = [
  {
    name: 'Basic',
    price: '₹5,999',
    description: 'Standard formatting for simple manuscripts',
    features: ['Up to 80,000 words', 'Single eBook format', '1 revision round', '5-day delivery'],
    popular: false,
  },
  {
    name: 'Professional',
    price: '₹11,999',
    description: 'Complete formatting for serious authors',
    features: ['Unlimited words', 'eBook + Print PDF', '3 revision rounds', '3-day delivery', 'Priority support'],
    popular: true,
  },
  {
    name: 'Premium',
    price: '₹19,999',
    description: 'Full-service formatting with extras',
    features: ['Unlimited words', 'All formats', 'Unlimited revisions', '24-hour delivery', 'Custom design elements', 'Table/chart formatting'],
    popular: false,
  },
];

export default function FormattingServicePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-gradient-to-b from-orange-50 via-parchment-50 to-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-orange-200/30 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-amber-200/20 rounded-full blur-3xl animate-float animation-delay-500" />
        </div>
        
        <div className="container-editorial relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-700 text-sm font-semibold mb-6 animate-fade-down">
              <FileText className="h-4 w-4" weight="duotone" />
              Professional Service
            </div>
            
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-ink-900 mb-6 animate-fade-up">
              Book{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">Formatting</span>
            </h1>
            
            <p className="text-ink-600 text-xl mb-10 leading-relaxed animate-fade-up animation-delay-100">
              Transform your manuscript into professionally formatted eBooks and print-ready files. 
              Perfect typography, seamless compatibility, and stunning results.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 animate-fade-up animation-delay-200">
              <Link href="/signup?role=author" className="btn-primary btn-lg group bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600">
                Get Started
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" weight="bold" />
              </Link>
              <Link href="/services" className="btn-glass btn-lg">
                View All Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Format Types */}
      <section className="py-20 bg-white">
        <div className="container-editorial">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-ink-900 mb-4">Formatting Options</h2>
            <p className="text-xl text-ink-600 max-w-2xl mx-auto">
              Choose the format that best suits your distribution needs
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {formatTypes.map((format, index) => (
              <div
                key={format.title}
                className="rounded-2xl bg-parchment-50 border border-parchment-200 p-8 hover:shadow-elegant hover:-translate-y-1 transition-all duration-500 animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center mb-6">
                  <format.icon className="h-7 w-7 text-white" weight="duotone" />
                </div>
                <h3 className="font-serif text-xl font-bold text-ink-900 mb-2">{format.title}</h3>
                <p className="text-ink-600 mb-6">{format.description}</p>
                <ul className="space-y-3">
                  {format.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-ink-700">
                      <CheckCircle className="h-4 w-4 text-emerald-500" weight="fill" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-24 bg-gradient-to-b from-parchment-50 to-white">
        <div className="container-editorial">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-700 text-sm font-semibold mb-6">
                <Sparkle className="h-4 w-4" weight="duotone" />
                Simple Process
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-ink-900 mb-6">
                From Manuscript to Publication-Ready
              </h2>
              <p className="text-ink-600 text-lg mb-8 leading-relaxed">
                Our streamlined workflow ensures your book is formatted perfectly 
                for every platform, with quick turnaround and expert attention to detail.
              </p>
              
              <div className="space-y-4">
                {[
                  { step: '1', title: 'Upload', description: 'Submit your manuscript in any common format' },
                  { step: '2', title: 'Review', description: 'Our team analyzes your formatting needs' },
                  { step: '3', title: 'Format', description: 'Expert formatting with attention to detail' },
                  { step: '4', title: 'Deliver', description: 'Receive your files ready for publishing' },
                ].map((item, index) => (
                  <div key={item.step} className="flex items-center gap-4 animate-fade-up" style={{ animationDelay: `${index * 100}ms` }}>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 text-white font-bold flex items-center justify-center flex-shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="font-semibold text-ink-900">{item.title}</h3>
                      <p className="text-sm text-ink-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-orange-100 to-amber-50 p-10 flex items-center justify-center shadow-elegant-lg">
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg animate-gentle-pulse">
                    <FileText className="h-16 w-16 text-white" weight="duotone" />
                  </div>
                  <p className="font-serif text-2xl text-ink-700 mb-2">Expert Formatting</p>
                  <p className="text-ink-500">All devices, all platforms</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-white">
        <div className="container-editorial">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-ink-900 mb-4">Simple Pricing</h2>
            <p className="text-xl text-ink-600">Choose the package that fits your needs</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {packages.map((pkg, index) => (
              <div
                key={pkg.name}
                className={cn(
                  'rounded-2xl border p-8 relative animate-fade-up hover:shadow-elegant transition-all duration-500',
                  pkg.popular 
                    ? 'bg-gradient-to-b from-orange-50 to-amber-50 border-orange-300 scale-105' 
                    : 'bg-parchment-50 border-parchment-200'
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {pkg.popular && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-semibold">
                    Most Popular
                  </span>
                )}
                <h3 className="font-serif text-xl font-bold text-ink-900">{pkg.name}</h3>
                <div className="mt-4 mb-2">
                  <span className="text-4xl font-bold text-ink-900">{pkg.price}</span>
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
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600' 
                      : 'btn-outline'
                  )}
                >
                  Choose {pkg.name}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-amber-500 text-white">
        <div className="container-editorial text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            Ready to Format Your Book?
          </h2>
          <p className="text-orange-100 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of authors who trust us with their manuscript formatting.
          </p>
          <Link href="/signup?role=author" className="btn-lg bg-white text-orange-600 hover:bg-orange-50 inline-flex items-center gap-2 font-semibold">
            Start Formatting
            <ArrowRight className="h-5 w-5" weight="bold" />
          </Link>
        </div>
      </section>
    </>
  );
}
