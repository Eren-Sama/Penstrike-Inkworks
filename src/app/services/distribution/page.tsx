'use client';

import Link from 'next/link';
import {
  ArrowRight,
  Globe,
  CheckCircle,
  BookOpen,
  ShoppingBag,
  Storefront,
  DeviceMobile,
  Books,
  TrendUp,
  CurrencyDollar,
  Users,
  Sparkle,
} from '@phosphor-icons/react/dist/ssr';
import type { IconProps } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';

type PhosphorIcon = React.ForwardRefExoticComponent<IconProps & React.RefAttributes<SVGSVGElement>>;

const platforms: { name: string; icon: PhosphorIcon; reach: string; color: string }[] = [
  { name: 'Amazon Kindle', icon: DeviceMobile, reach: '150M+ readers', color: 'from-orange-500 to-amber-500' },
  { name: 'Apple Books', icon: BookOpen, reach: '85M+ readers', color: 'from-gray-700 to-gray-900' },
  { name: 'Google Play Books', icon: BookOpen, reach: '75M+ readers', color: 'from-blue-500 to-green-500' },
  { name: 'Barnes & Noble', icon: Storefront, reach: '50M+ readers', color: 'from-emerald-600 to-emerald-700' },
  { name: 'Kobo', icon: BookOpen, reach: '30M+ readers', color: 'from-rose-500 to-pink-600' },
  { name: 'Libraries', icon: Books, reach: '10K+ libraries', color: 'from-indigo-500 to-purple-600' },
];

const features = [
  {
    icon: Globe,
    title: 'Global Reach',
    description: 'Distribute to readers in 190+ countries through major retailers and library networks worldwide.'
  },
  {
    icon: CurrencyDollar,
    title: 'Competitive Royalties',
    description: 'Earn up to 70% royalties on eBook sales. Track earnings in real-time through your dashboard.'
  },
  {
    icon: TrendUp,
    title: 'Sales Analytics',
    description: 'Detailed reporting on sales, rankings, and reader engagement across all platforms.'
  },
  {
    icon: ShoppingBag,
    title: 'Print on Demand',
    description: 'Professional paperback and hardcover printing with worldwide fulfillment. No inventory needed.'
  },
  {
    icon: Books,
    title: 'Library Distribution',
    description: 'Get your books into public and academic libraries through OverDrive and other networks.'
  },
  {
    icon: Users,
    title: 'Direct Sales',
    description: 'Sell directly to readers through your author page with higher margins and customer data.'
  },
];

const packages = [
  {
    name: 'Standard',
    price: 'Free',
    royalty: '60%',
    description: 'Basic distribution for new authors',
    features: ['Major eBook platforms', 'Standard royalty rate', 'Monthly reporting', 'Basic support'],
    popular: false,
  },
  {
    name: 'Professional',
    price: '₹4,999/year',
    royalty: '70%',
    description: 'Enhanced distribution for serious authors',
    features: ['All platforms + libraries', 'Higher royalty rate', 'Weekly reporting', 'Priority support', 'Print on demand'],
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '₹14,999/year',
    royalty: '80%',
    description: 'Full-service for established authors',
    features: ['Everything in Professional', 'Maximum royalties', 'Real-time analytics', 'Dedicated manager', 'Pre-order campaigns', 'Promotional tools'],
    popular: false,
  },
];

export default function DistributionServicePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-gradient-to-b from-blue-50 via-parchment-50 to-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-200/30 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-200/20 rounded-full blur-3xl animate-float animation-delay-500" />
        </div>
        
        <div className="container-editorial relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-6 animate-fade-down">
              <Globe className="h-4 w-4" weight="duotone" />
              Global Distribution
            </div>
            
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-ink-900 mb-6 animate-fade-up">
              Reach Readers{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600">Worldwide</span>
            </h1>
            
            <p className="text-ink-600 text-xl mb-10 leading-relaxed animate-fade-up animation-delay-100">
              Get your books in front of millions of readers across the globe. 
              We handle the logistics while you focus on writing.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 animate-fade-up animation-delay-200">
              <Link href="/signup?role=author" className="btn-primary btn-lg group bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
                Start Distribution
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" weight="bold" />
              </Link>
              <Link href="/services" className="btn-glass btn-lg">
                View All Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Platforms */}
      <section className="py-20 bg-white">
        <div className="container-editorial">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-ink-900 mb-4">Reach Readers Everywhere</h2>
            <p className="text-xl text-ink-600">Distribute to all major platforms with a single upload</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {platforms.map((platform, index) => {
              const IconComponent = platform.icon;
              return (
                <div
                  key={platform.name}
                  className="group rounded-2xl bg-parchment-50 border border-parchment-200 p-6 text-center hover:shadow-elegant hover:-translate-y-1 transition-all duration-500 animate-fade-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className={cn(
                    "w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br flex items-center justify-center",
                    platform.color,
                    "group-hover:scale-110 transition-transform duration-300"
                  )}>
                    <IconComponent className="h-7 w-7 text-white" weight="duotone" />
                  </div>
                  <h3 className="font-semibold text-ink-900 mb-1">{platform.name}</h3>
                  <p className="text-xs text-ink-500">{platform.reach}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-gradient-to-b from-parchment-50 to-white">
        <div className="container-editorial">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-6">
                <Sparkle className="h-4 w-4" weight="duotone" />
                Complete Solution
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-ink-900 mb-6">
                Everything You Need to Succeed
              </h2>
              <p className="text-ink-600 text-lg mb-8 leading-relaxed">
                From eBooks to print, from Amazon to libraries—we provide all the tools 
                and distribution channels to maximize your book's reach and revenue.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                {features.slice(0, 4).map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-ink-700">
                    <CheckCircle className="h-5 w-5 text-blue-500 flex-shrink-0" weight="fill" />
                    <span className="text-sm">{feature.title}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-blue-100 to-indigo-50 p-10 flex items-center justify-center shadow-elegant-lg">
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg animate-gentle-pulse">
                    <Globe className="h-16 w-16 text-white" weight="duotone" />
                  </div>
                  <p className="font-serif text-2xl text-ink-700 mb-2">Global Distribution</p>
                  <p className="text-ink-500">190+ Countries</p>
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
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-ink-900 mb-4">Distribution Plans</h2>
            <p className="text-xl text-ink-600">Choose the plan that matches your publishing goals</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {packages.map((pkg, index) => (
              <div
                key={pkg.name}
                className={cn(
                  'rounded-2xl border p-8 relative animate-fade-up hover:shadow-elegant transition-all duration-500',
                  pkg.popular 
                    ? 'bg-gradient-to-b from-blue-50 to-indigo-50 border-blue-300 scale-105' 
                    : 'bg-parchment-50 border-parchment-200'
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {pkg.popular && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-semibold">
                    Recommended
                  </span>
                )}
                <h3 className="font-serif text-xl font-bold text-ink-900">{pkg.name}</h3>
                <div className="mt-4 mb-2">
                  <span className="text-4xl font-bold text-ink-900">{pkg.price}</span>
                </div>
                <p className="text-emerald-600 font-semibold mb-4">{pkg.royalty} royalties</p>
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
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700' 
                      : 'btn-outline'
                  )}
                >
                  {pkg.price === 'Free' ? 'Get Started Free' : `Choose ${pkg.name}`}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
        <div className="container-editorial text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            Ready to Go Global?
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of authors who trust us to distribute their books worldwide.
          </p>
          <Link href="/signup?role=author" className="btn-lg bg-white text-blue-600 hover:bg-blue-50 inline-flex items-center gap-2 font-semibold">
            Start Distribution
            <ArrowRight className="h-5 w-5" weight="bold" />
          </Link>
        </div>
      </section>
    </>
  );
}
