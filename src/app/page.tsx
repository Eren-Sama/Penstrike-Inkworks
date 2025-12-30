'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ScrollAnimation, StaggerContainer, CountUp } from '@/components/ui';
import { 
  BookOpen, 
  MagicWand, 
  Wallet, 
  ShieldCheck, 
  Plant, 
  Headphones, 
  PenNib,
  ChartBar,
  ArrowRight,
  Quotes,
  Star,
  CheckCircle,
  PencilLine,
  Trophy,
  Globe,
  Lightning,
  NotePencil,
  Users,
  Clock,
  Heart,
  Crosshair,
  SquaresFour,
  Image,
  PaperPlaneTilt,
  Gauge
} from '@phosphor-icons/react';
import { useAuth } from '@/lib/auth/AuthContext';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // Small delay to ensure single mount
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      
      {/* ========================================
          HERO SECTION - Elegant & Immersive
          ======================================== */}
      <section className="relative h-[100svh] -mt-16 lg:-mt-20 flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-parchment-100 via-parchment-50 to-cream-100" />
        
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent-yellow/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-parchment-400/20 rounded-full blur-3xl animate-float animation-delay-300" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cream-300/30 rounded-full blur-3xl animate-gentle-pulse" />
        </div>

        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-grid opacity-30" />
        
        {/* Content */}
        <div className="container-editorial relative z-10 py-12">
          <div className="max-w-5xl mx-auto text-center">
            {/* Badge */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-parchment-200/50 shadow-card mb-8 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
              <MagicWand weight="duotone" className="h-4 w-4 text-accent-yellow" />
              <span className="text-sm font-medium text-ink-700">Author-First Publishing Platform</span>
            </div>

            {/* Headline */}
            <h1 className={`font-serif text-5xl md:text-6xl lg:text-7xl xl:text-[5.5rem] font-bold text-ink-900 mb-8 leading-[1.1] transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              Your Story.{' '}
              <span className="relative inline-block">
                <span className="text-gradient-gold">Your Terms.</span>
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
                  <path d="M2 6C50 2 150 2 198 6" stroke="url(#gold-gradient)" strokeWidth="3" strokeLinecap="round"/>
                  <defs>
                    <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#F4D03F"/>
                      <stop offset="100%" stopColor="#D4A017"/>
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </h1>

            {/* Subheadline */}
            <p className={`text-xl md:text-2xl text-ink-600 mb-12 max-w-3xl mx-auto leading-relaxed transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              Create, edit, design, publish, and sell your books while retaining{' '}
              <span className="font-semibold text-ink-900 relative">
                100% ownership
                <span className="absolute bottom-0 left-0 w-full h-1 bg-accent-yellow/30 -z-10"></span>
              </span>
              {' '}of your work.
            </p>
            
            {/* CTA Buttons */}
            <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              {user ? (
                // Logged in users - show role-specific CTA
                user.account_type === 'author' ? (
                  <>
                    <Link href="/author/manuscripts/new" className="group btn-accent btn-lg shadow-glow-gold hover:shadow-glow-gold hover:scale-105 transition-all duration-300">
                      <span>Start Publishing</span>
                      <ArrowRight weight="bold" className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                    <Link href="/author" className="btn-glass btn-lg hover:scale-105 transition-all duration-300">
                      <Gauge weight="duotone" className="h-5 w-5" />
                      <span>My Dashboard</span>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/bookstore" className="group btn-accent btn-lg shadow-glow-gold hover:shadow-glow-gold hover:scale-105 transition-all duration-300">
                      <span>Discover Books</span>
                      <ArrowRight weight="bold" className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                    <Link href="/authors" className="btn-glass btn-lg hover:scale-105 transition-all duration-300">
                      <Users weight="duotone" className="h-5 w-5" />
                      <span>Browse Authors</span>
                    </Link>
                  </>
                )
              ) : (
                // Not logged in - show signup CTA
                <>
                  <Link href="/signup?role=author" className="group btn-accent btn-lg shadow-glow-gold hover:shadow-glow-gold hover:scale-105 transition-all duration-300">
                    <span>Start Publishing</span>
                    <ArrowRight weight="bold" className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                  <Link href="/bookstore" className="btn-glass btn-lg hover:scale-105 transition-all duration-300">
                    <BookOpen weight="duotone" className="h-5 w-5" />
                    <span>Explore Books</span>
                  </Link>
                </>
              )}
            </div>

            {/* Trust Indicators */}
            <div className={`flex flex-wrap items-center justify-center gap-x-8 gap-y-4 transition-all duration-700 delay-[400ms] ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              {[
                { icon: Wallet, label: '70% Royalties' },
                { icon: MagicWand, label: 'AI-Powered Tools' },
                { icon: Plant, label: 'Sustainable Printing' },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-ink-600 hover:text-ink-900 transition-colors duration-300">
                  <div className="p-1.5 rounded-lg bg-emerald-100/80">
                    <CheckCircle weight="fill" className="h-4 w-4 text-emerald-600" />
                  </div>
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </section>

      {/* ========================================
          PROBLEMS SECTION - Fixed Visibility
          ======================================== */}
      <section className="relative py-24 lg:py-32 bg-gradient-to-b from-ink-900 via-ink-800 to-ink-900 text-white overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_rgba(244,208,63,0.1)_0%,_transparent_50%)]" />
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,_rgba(244,208,63,0.05)_0%,_transparent_50%)]" />
        </div>
        <div className="absolute inset-0 bg-dots opacity-20" />
        
        <div className="container-editorial relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <ScrollAnimation animation="zoom-in">
              <div className="w-12 h-1 bg-gradient-to-r from-accent-yellow to-accent-amber mx-auto mb-8 rounded-full" />
            </ScrollAnimation>
            <ScrollAnimation animation="fade-up">
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
                Traditional Publishing is{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-yellow via-accent-amber to-accent-warm">Broken</span>
              </h2>
            </ScrollAnimation>
            <ScrollAnimation animation="fade-up" delay={100}>
              <p className="text-parchment-200 text-lg md:text-xl">
                Authors deserve better. Here is what we are fixing.
              </p>
            </ScrollAnimation>
          </div>

          <StaggerContainer staggerDelay={100} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Wallet,
                problem: 'Low Royalties',
                description: 'Traditional publishers take 85-90% of your earnings.',
                stat: 85,
                statSuffix: '-90%',
                statLabel: 'taken by publishers'
              },
              {
                icon: ShieldCheck,
                problem: 'No Transparency',
                description: 'Opaque contracts and hidden fees eat into your profits.',
                stat: 0,
                statDisplay: '???',
                statLabel: 'hidden costs'
              },
              {
                icon: BookOpen,
                problem: 'Lost Control',
                description: 'Publishers own your work and make decisions without you.',
                stat: 0,
                statSuffix: '%',
                statLabel: 'creative control'
              },
              {
                icon: Plant,
                problem: 'Environmental Harm',
                description: 'Mass printing wastes paper and damages forests.',
                stat: 3,
                statSuffix: 'B+',
                statLabel: 'trees cut yearly'
              },
            ].map((item, index) => (
              <div
                key={index}
                className="group relative p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-accent-yellow/40 transition-all duration-500 hover:-translate-y-2 hover:bg-white/10"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-yellow/0 via-accent-yellow/60 to-accent-yellow/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-2xl" />
                
                <div className="w-14 h-14 mb-6 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-accent-yellow/20 group-hover:scale-110 transition-all duration-500">
                  <item.icon className="h-7 w-7 text-accent-yellow" />
                </div>
                
                <h3 className="font-serif text-xl font-semibold mb-3 text-white">{item.problem}</h3>
                <p className="text-parchment-300 text-sm leading-relaxed mb-6">{item.description}</p>
                
                <div className="pt-4 border-t border-white/10">
                  <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent-yellow to-accent-amber">
                    {item.statDisplay || <><CountUp end={item.stat} duration={1500} />{item.statSuffix}</>}
                  </span>
                  <span className="text-xs text-parchment-400 block mt-1">{item.statLabel}</span>
                </div>
              </div>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ========================================
          HOW IT WORKS - Animated Cards
          ======================================== */}
      <section className="py-24 lg:py-32 bg-gradient-to-b from-parchment-50 via-white to-parchment-50 relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-radial from-accent-yellow/5 to-transparent rounded-full" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-radial from-parchment-300/20 to-transparent rounded-full" />
        </div>
        
        <div className="container-editorial relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <ScrollAnimation animation="fade-down">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-yellow/10 border border-accent-yellow/20 text-accent-warm text-sm font-semibold mb-6">
                <SquaresFour weight="duotone" className="h-4 w-4" />
                How It Works
              </span>
            </ScrollAnimation>
            <ScrollAnimation animation="fade-up">
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-ink-900 mb-6">
                From Manuscript to{' '}
                <span className="text-gradient-gold">Bestseller</span>
              </h2>
            </ScrollAnimation>
            <ScrollAnimation animation="fade-up" delay={100}>
              <p className="text-ink-600 text-lg md:text-xl">
                A streamlined journey designed for authors, by people who understand publishing.
              </p>
            </ScrollAnimation>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                step: '01',
                title: 'Create & Upload',
                description: 'Upload your manuscript and access our powerful editing suite with AI-assisted tools for grammar, style, and clarity.',
                icon: PencilLine,
                gradient: 'from-blue-500 to-indigo-600',
                bgGradient: 'from-blue-50 to-indigo-50',
              },
              {
                step: '02',
                title: 'Design & Perfect',
                description: 'Use our intuitive design studio to create stunning covers and format your interior with professional templates.',
                icon: Image,
                gradient: 'from-rose-500 to-pink-600',
                bgGradient: 'from-rose-50 to-pink-50',
              },
              {
                step: '03',
                title: 'Publish & Earn',
                description: 'Go live in our bookstore and start earning 70% royalties on every sale with real-time analytics.',
                icon: ChartBar,
                gradient: 'from-emerald-500 to-teal-600',
                bgGradient: 'from-emerald-50 to-teal-50',
              },
            ].map((item, index) => (
              <ScrollAnimation 
                key={index} 
                animation="fade-up"
                delay={index * 150}
                className="relative group"
              >
                {/* Connection Line */}
                {index < 2 && (
                  <div className="hidden lg:block absolute top-24 left-full w-full h-0.5 z-0">
                    <div className="w-full h-full bg-gradient-to-r from-parchment-300 via-parchment-200 to-transparent" />
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-parchment-300" />
                  </div>
                )}
                
                <div className={`relative p-8 h-full rounded-3xl bg-gradient-to-br ${item.bgGradient} border border-white/50 shadow-elegant hover:shadow-elegant-lg transition-all duration-500 hover:-translate-y-2 overflow-hidden`}>
                  {/* Step Number Background */}
                  <span className="absolute top-4 right-4 text-[6rem] font-serif font-bold text-ink-900/5 select-none leading-none">
                    {item.step}
                  </span>
                  
                  <div className="relative z-10">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                      <item.icon className="h-8 w-8 text-white" />
                    </div>
                    
                    <h3 className="font-serif text-2xl font-bold text-ink-900 mb-4">
                      {item.title}
                    </h3>
                    <p className="text-ink-600 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================
          AI FEATURES - Modern Showcase
          ======================================== */}
      <section className="py-24 lg:py-32 bg-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-parchment-50/50 to-transparent" />
        
        <div className="container-editorial relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <ScrollAnimation animation="fade-right">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-yellow/10 border border-accent-yellow/20 text-accent-warm text-sm font-semibold mb-6">
                  <MagicWand weight="duotone" className="h-4 w-4" />
                  AI-Powered Publishing
                </span>
              </ScrollAnimation>
              <ScrollAnimation animation="fade-up" delay={100}>
                <h2 className="font-serif text-4xl md:text-5xl font-bold text-ink-900 mb-6">
                  Technology That Serves Your{' '}
                  <span className="text-gradient-gold">Creativity</span>
                </h2>
              </ScrollAnimation>
              <ScrollAnimation animation="fade-up" delay={200}>
                <p className="text-ink-600 text-lg mb-10 leading-relaxed">
                  Our AI tools are designed to assist, not replace. They enhance your work 
                  while you retain complete creative control.
                </p>
              </ScrollAnimation>

              <StaggerContainer staggerDelay={100} className="space-y-4">
                {[
                  {
                    icon: NotePencil,
                    title: 'Smart Editing',
                    description: 'Grammar, style, and clarity suggestions that learn your voice.',
                    color: 'from-violet-500 to-purple-600',
                    href: '/services/editing',
                  },
                  {
                    icon: Image,
                    title: 'Cover Generation',
                    description: 'Describe your vision and watch AI bring it to life.',
                    color: 'from-rose-500 to-pink-600',
                    href: '/services/cover-design',
                  },
                  {
                    icon: Headphones,
                    title: 'AI Audiobooks',
                    description: 'Natural narration in multiple voices with emotional depth.',
                    color: 'from-orange-500 to-amber-600',
                    href: '/services/audiobooks',
                  },
                ].map((feature, index) => (
                  <Link 
                    key={index} 
                    href={feature.href}
                    className="group flex gap-5 p-5 rounded-2xl bg-parchment-50/50 hover:bg-white border border-transparent hover:border-parchment-200 hover:shadow-elegant transition-all duration-500 cursor-pointer"
                  >
                    <div className={`flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-md`}>
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-ink-900 mb-1.5 text-lg group-hover:text-accent-warm transition-colors">{feature.title}</h3>
                      <p className="text-ink-600 text-sm leading-relaxed">{feature.description}</p>
                    </div>
                    <ArrowRight weight="bold" className="h-5 w-5 text-ink-300 group-hover:text-accent-warm group-hover:translate-x-1 transition-all duration-300 self-center ml-auto" />
                  </Link>
                ))}
              </StaggerContainer>
            </div>

            {/* AI Demo Visual */}
            <ScrollAnimation animation="fade-left" delay={200}>
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-parchment-100 via-cream-100 to-parchment-200 p-10 flex items-center justify-center overflow-hidden shadow-elegant-lg">
                <div className="absolute inset-0 bg-grid opacity-30" />
                
                {/* Floating Elements */}
                <div className="absolute top-8 left-8 w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg flex items-center justify-center animate-float-slow">
                  <NotePencil weight="duotone" className="h-9 w-9 text-white" />
                </div>
                <div className="absolute bottom-12 left-12 w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 shadow-lg flex items-center justify-center animate-float-reverse">
                  <Image weight="duotone" className="h-7 w-7 text-white" />
                </div>
                <div className="absolute top-12 right-8 w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 shadow-lg flex items-center justify-center animate-float-slow" style={{ animationDelay: '2s' }}>
                  <Headphones weight="duotone" className="h-7 w-7 text-white" />
                </div>
                
                <div className="relative text-center z-10">
                  <div className="w-32 h-32 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-accent-yellow via-accent-amber to-accent-warm shadow-glow-gold flex items-center justify-center animate-glow-pulse">
                    <MagicWand weight="duotone" className="h-14 w-14 text-white" />
                  </div>
                  <p className="font-serif text-2xl text-ink-700 mb-3">AI Assistant</p>
                  <p className="text-ink-500">Interactive demo coming soon</p>
                  <div className="mt-6 flex justify-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-accent-yellow animate-bounce-subtle" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-accent-amber animate-bounce-subtle" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-accent-warm animate-bounce-subtle" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* ========================================
          SERVICES PREVIEW
          ======================================== */}
      <section className="py-24 lg:py-32 bg-gradient-to-b from-parchment-100 via-parchment-50 to-white relative overflow-hidden">
        <div className="container-editorial relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <ScrollAnimation animation="fade-down">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-yellow/10 border border-accent-yellow/20 text-accent-warm text-sm font-semibold mb-6">
                <Crosshair weight="duotone" className="h-4 w-4" />
                Our Services
              </span>
            </ScrollAnimation>
            <ScrollAnimation animation="fade-up">
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-ink-900 mb-6">
                Everything You Need to{' '}
                <span className="text-gradient-gold">Succeed</span>
              </h2>
            </ScrollAnimation>
            <ScrollAnimation animation="fade-up" delay={100}>
              <p className="text-ink-600 text-lg">
                Professional publishing services tailored for independent authors.
              </p>
            </ScrollAnimation>
          </div>

          <StaggerContainer staggerDelay={80} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: NotePencil,
                title: 'Editing & Proofreading',
                description: 'Professional editing with AI assistance for flawless manuscripts.',
                href: '/services/editing',
                color: 'from-blue-500 to-indigo-600',
              },
              {
                icon: PenNib,
                title: 'Cover Design',
                description: 'Stunning covers that capture your story and attract readers.',
                href: '/services/cover-design',
                color: 'from-rose-500 to-pink-600',
              },
              {
                icon: Headphones,
                title: 'Audiobook Creation',
                description: 'AI-powered narration with natural, emotional voices.',
                href: '/services/audiobooks',
                color: 'from-orange-500 to-amber-600',
              },
              {
                icon: SquaresFour,
                title: 'Book Formatting',
                description: 'Professional interior layouts for print and digital.',
                href: '/services/formatting',
                color: 'from-emerald-500 to-teal-600',
              },
              {
                icon: PaperPlaneTilt,
                title: 'Distribution',
                description: 'Global reach with sustainable print-on-demand.',
                href: '/services/distribution',
                color: 'from-violet-500 to-purple-600',
              },
              {
                icon: ChartBar,
                title: 'Marketing',
                description: 'Strategic promotion to help your book find its audience.',
                href: '/services/marketing',
                color: 'from-cyan-500 to-blue-600',
              },
            ].map((service, index) => (
              <Link
                key={index}
                href={service.href}
                className="group relative p-6 rounded-2xl bg-white border border-parchment-200 hover:border-accent-yellow/30 shadow-card hover:shadow-elegant transition-all duration-500 hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-md`}>
                  <service.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-serif text-xl font-bold text-ink-900 mb-2 group-hover:text-accent-warm transition-colors">
                  {service.title}
                </h3>
                <p className="text-ink-600 text-sm leading-relaxed mb-4">{service.description}</p>
                <span className="inline-flex items-center text-sm font-medium text-accent-warm group-hover:text-accent-amber">
                  Learn more
                  <ArrowRight weight="bold" className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ))}
          </StaggerContainer>

          <ScrollAnimation animation="fade-up" delay={400} className="text-center mt-12">
            <Link href="/services" className="btn-primary btn-lg group">
              View All Services
              <ArrowRight weight="bold" className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </ScrollAnimation>
        </div>
      </section>

      {/* ========================================
          SUSTAINABILITY - Eco Section
          ======================================== */}
      <section className="py-24 lg:py-32 bg-gradient-to-b from-emerald-50/80 via-white to-parchment-50 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-200/20 rounded-full blur-3xl animate-float-slow" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-green-200/20 rounded-full blur-3xl animate-float-reverse" />
        </div>
        
        <div className="container-editorial relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Visual */}
            <ScrollAnimation animation="fade-right" className="order-2 lg:order-1">
              <div className="relative aspect-square rounded-3xl bg-gradient-to-br from-emerald-100 to-green-50 flex items-center justify-center overflow-hidden shadow-elegant-lg">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,_rgba(16,185,129,0.15)_0%,_transparent_50%)]" />
                
                {/* Floating Leaves */}
                <div className="absolute top-8 right-8 w-16 h-16 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg flex items-center justify-center animate-float-slow">
                  <Plant weight="duotone" className="h-8 w-8 text-emerald-500" />
                </div>
                <div className="absolute bottom-12 left-8 w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm shadow-lg flex items-center justify-center animate-float-reverse">
                  <Heart weight="fill" className="h-6 w-6 text-emerald-500" />
                </div>
                
                <div className="relative">
                  <div className="w-40 h-40 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center shadow-xl animate-morph">
                    <Plant weight="duotone" className="h-20 w-20 text-white" />
                  </div>
                  <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-emerald-200/50 animate-float-slow" />
                  <div className="absolute -bottom-6 -left-6 w-16 h-16 rounded-full bg-green-200/50 animate-float-reverse" />
                </div>
              </div>
            </ScrollAnimation>
            
            {/* Content */}
            <div className="order-1 lg:order-2">
              <ScrollAnimation animation="fade-left">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100/80 text-emerald-700 text-sm font-semibold mb-6">
                  <Plant weight="duotone" className="h-4 w-4" />
                  Sustainable Publishing
                </span>
              </ScrollAnimation>
              <ScrollAnimation animation="fade-up" delay={100}>
                <h2 className="font-serif text-4xl md:text-5xl font-bold text-ink-900 mb-6">
                  Cotton Paper.{' '}
                  <span className="text-emerald-600">Zero Waste.</span>
                </h2>
              </ScrollAnimation>
              <ScrollAnimation animation="fade-up" delay={200}>
                <p className="text-ink-600 text-lg mb-10 leading-relaxed">
                  Every book printed on Penstrike uses 100% cotton-based paper. 
                  No trees harmed. No waste. Just beautiful, lasting books that you can feel good about.
                </p>
              </ScrollAnimation>

              <StaggerContainer staggerDelay={100} className="grid grid-cols-3 gap-4">
                {[
                  { number: 0, label: 'Trees Cut', suffix: '' },
                  { number: 100, label: 'Cotton Paper', suffix: '%' },
                  { number: 50, label: 'Less Water', suffix: '%' },
                ].map((stat, index) => (
                  <div 
                    key={index} 
                    className="text-center p-5 rounded-2xl bg-white/80 backdrop-blur-sm border border-emerald-100 shadow-card hover:shadow-elegant hover:-translate-y-1 transition-all duration-300"
                  >
                    <p className="text-3xl md:text-4xl font-serif font-bold text-emerald-600">
                      <CountUp end={stat.number} duration={1500} /><span className="text-xl">{stat.suffix}</span>
                    </p>
                    <p className="text-sm text-ink-600 mt-1">{stat.label}</p>
                  </div>
                ))}
              </StaggerContainer>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          TESTIMONIALS - Social Proof
          ======================================== */}
      <section className="py-24 lg:py-32 bg-gradient-to-b from-parchment-50 via-parchment-100 to-parchment-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cream-100/30 to-transparent" />
        
        <div className="container-editorial relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <ScrollAnimation animation="fade-down">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-yellow/10 border border-accent-yellow/20 text-accent-warm text-sm font-semibold mb-6">
                <Users weight="duotone" className="h-4 w-4" />
                Testimonials
              </span>
            </ScrollAnimation>
            <ScrollAnimation animation="fade-up">
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-ink-900 mb-6">
                Authors Love{' '}
                <span className="text-gradient-gold">Penstrike</span>
              </h2>
            </ScrollAnimation>
            <ScrollAnimation animation="fade-up" delay={100}>
              <p className="text-ink-600 text-lg">
                Hear from writers who have transformed their publishing journey.
              </p>
            </ScrollAnimation>
          </div>

          <StaggerContainer staggerDelay={150} className="grid md:grid-cols-3 gap-8">
            {[
              {
                Quotes: "Finally, a platform that treats authors as partners, not products. The transparency is refreshing and the tools are incredible.",
                author: "Sarah Mitchell",
                title: "Fantasy Author",
                rating: 5,
                avatar: "SM"
              },
              {
                Quotes: "The AI audiobook feature saved me thousands. My readers love having audio versions of my books with such natural narration.",
                author: "James Chen",
                title: "Mystery Writer",
                rating: 5,
                avatar: "JC"
              },
              {
                Quotes: "70% royalties and full creative control? This is what publishing should have always been. I will never go back.",
                author: "Maria Santos",
                title: "Romance Novelist",
                rating: 5,
                avatar: "MS"
              },
            ].map((testimonial, index) => (
              <div 
                key={index} 
                className="group p-8 rounded-3xl bg-white border border-parchment-200 shadow-card hover:shadow-elegant transition-all duration-500 hover:-translate-y-2"
              >
                <div className="flex items-center gap-1 mb-6">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-accent-yellow text-accent-yellow" />
                  ))}
                </div>
                
                <Quotes weight="fill" className="h-10 w-10 text-accent-yellow/30 mb-4" />
                
                <p className="text-ink-700 mb-8 leading-relaxed italic text-lg">
                  &ldquo;{testimonial.Quotes}&rdquo;
                </p>
                
                <div className="flex items-center gap-4 pt-6 border-t border-parchment-200">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-yellow to-accent-amber flex items-center justify-center text-white font-semibold shadow-md">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-ink-900">{testimonial.author}</p>
                    <p className="text-sm text-ink-500">{testimonial.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ========================================
          CTA SECTION - Final Push
          ======================================== */}
      <section className="py-24 lg:py-32 bg-gradient-to-b from-ink-900 via-ink-800 to-ink-950 text-white relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent-yellow/10 rounded-full blur-3xl animate-float-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent-amber/10 rounded-full blur-3xl animate-float-reverse" />
        </div>
        <div className="absolute inset-0 bg-dots opacity-10" />
        
        <div className="container-editorial relative z-10 text-center">
          <div className="max-w-4xl mx-auto">
            <ScrollAnimation animation="fade-down">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 mb-8">
                <Trophy weight="duotone" className="h-4 w-4 text-accent-yellow" />
                <span className="text-sm font-medium text-parchment-200">Join <CountUp end={10000} duration={2000} suffix="+" /> Authors</span>
              </div>
            </ScrollAnimation>
            
            <ScrollAnimation animation="fade-up">
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight text-white">
                Ready to Publish on{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-yellow via-accent-amber to-accent-warm">Your Terms?</span>
              </h2>
            </ScrollAnimation>
            
            <ScrollAnimation animation="fade-up" delay={100}>
              <p className="text-parchment-200 text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
                Join thousands of authors who have taken control of their publishing journey. 
                Your story deserves to be told your way.
              </p>
            </ScrollAnimation>
            
            <ScrollAnimation animation="zoom-in" delay={200}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                {user ? (
                  // Logged in users - show role-specific CTA
                  user.role === 'admin' ? (
                    <Link href="/admin" className="group btn-accent btn-lg shadow-glow-gold animate-glow-pulse hover:scale-105 transition-all duration-300">
                      <span>Go to Admin Dashboard</span>
                      <ArrowRight weight="bold" className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  ) : user.account_type === 'author' ? (
                    <Link href="/author/manuscripts/new" className="group btn-accent btn-lg shadow-glow-gold animate-glow-pulse hover:scale-105 transition-all duration-300">
                      <span>Publish Your Next Book</span>
                      <ArrowRight weight="bold" className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  ) : (
                    <Link href="/bookstore" className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-accent-yellow to-accent-amber text-ink-900 font-semibold shadow-glow-gold hover:shadow-glow-gold hover:scale-105 transition-all duration-300 whitespace-nowrap">
                      <span>Discover New Reads</span>
                      <ArrowRight weight="bold" className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  )
                ) : (
                  // Not logged in - show signup CTA
                  <Link href="/signup?role=author" className="group btn-accent btn-lg shadow-glow-gold animate-glow-pulse hover:scale-105 transition-all duration-300">
                    <span>Create Your Author Account</span>
                    <ArrowRight weight="bold" className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                )}
                <Link href="/services" className="btn-ghost text-parchment-200 hover:bg-white/10 btn-lg hover:scale-105 transition-all duration-300">
                  <Globe weight="duotone" className="h-5 w-5" />
                  <span>Explore Services</span>
                </Link>
              </div>
            </ScrollAnimation>
            
            {/* Trust badges */}
            <ScrollAnimation animation="fade-up" delay={300}>
              <div className="mt-16 pt-16 border-t border-white/10">
                <div className="flex flex-wrap items-center justify-center gap-8 text-parchment-300 text-sm">
                  <div className="flex items-center gap-2 hover:text-white transition-colors">
                    <ShieldCheck weight="duotone" className="h-5 w-5" />
                    <span>Secure Payments</span>
                  </div>
                  <div className="flex items-center gap-2 hover:text-white transition-colors">
                    <Globe weight="duotone" className="h-5 w-5" />
                    <span>Global Distribution</span>
                  </div>
                  <div className="flex items-center gap-2 hover:text-white transition-colors">
                    <Lightning weight="duotone" className="h-5 w-5" />
                    <span>24/7 Support</span>
                  </div>
                  <div className="flex items-center gap-2 hover:text-white transition-colors">
                    <Clock weight="duotone" className="h-5 w-5" />
                    <span>Fast Publishing</span>
                  </div>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>
    </>
  );
}
