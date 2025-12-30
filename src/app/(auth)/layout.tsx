'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, Sparkle } from '@phosphor-icons/react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle transition between login/signup
  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setDisplayChildren(children);
      setIsTransitioning(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [pathname, children]);

  return (
    <div 
      className={`min-h-screen z-[9999] flex bg-parchment-50 transition-opacity duration-500 ease-out ${
        mounted ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Left Panel - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[45%] relative overflow-hidden bg-ink-950 min-h-screen">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-ink-900 via-ink-950 to-ink-900" />
        
        {/* Decorative elements */}
        <div className={`absolute inset-0 transition-opacity duration-1000 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-yellow/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-amber/5 rounded-full blur-3xl animate-float animation-delay-300" />
        </div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
          {/* Logo */}
          <div className={`transition-all duration-500 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
            <Link href="/" className="group inline-flex items-center gap-3">
              <div className="p-2 rounded-xl bg-accent-yellow/10 group-hover:bg-accent-yellow/20 transition-all duration-300">
                <BookOpen weight="duotone" className="h-6 w-6 text-accent-yellow" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl font-bold text-white">Penstrike</span>
                <span className="text-xs font-medium tracking-widest uppercase text-parchment-500">Inkworks</span>
              </div>
            </Link>
          </div>
          
          {/* Main content */}
          <div className={`space-y-8 transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="space-y-4">
              <h1 className="font-serif text-4xl xl:text-5xl font-bold text-white leading-tight">
                Where Stories
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-yellow to-accent-amber">
                  Come to Life
                </span>
              </h1>
              <p className="text-parchment-300 text-lg max-w-md leading-relaxed">
                Join thousands of authors who have taken control of their publishing journey with Penstrike Inkworks.
              </p>
            </div>
            
            {/* Stats */}
            <div className="flex gap-8">
              <div>
                <div className="text-3xl font-bold text-accent-yellow">70%</div>
                <div className="text-sm text-parchment-400">Royalties</div>
              </div>
              <div className="w-px bg-ink-700" />
              <div>
                <div className="text-3xl font-bold text-accent-yellow">10K+</div>
                <div className="text-sm text-parchment-400">Authors</div>
              </div>
              <div className="w-px bg-ink-700" />
              <div>
                <div className="text-3xl font-bold text-accent-yellow">50K+</div>
                <div className="text-sm text-parchment-400">Books</div>
              </div>
            </div>
          </div>
          
          {/* Testimonial */}
          <div className={`space-y-4 transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Sparkle key={i} weight="fill" className="h-4 w-4 text-accent-yellow" />
              ))}
            </div>
            <blockquote className="text-parchment-200 text-lg italic">
              &ldquo;Finally, a platform that puts authors first. The tools are incredible and the support is unmatched.&rdquo;
            </blockquote>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-yellow to-accent-amber flex items-center justify-center text-ink-900 font-semibold text-sm">
                SM
              </div>
              <div>
                <div className="text-white font-medium">Sarah Mitchell</div>
                <div className="text-parchment-500 text-sm">Bestselling Fantasy Author</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Panel - Form */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Logo */}
        <div 
          className={`lg:hidden p-6 border-b border-parchment-200 transition-all duration-500 delay-100 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`}
        >
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-accent-yellow/10">
              <BookOpen weight="duotone" className="h-5 w-5 text-ink-900" />
            </div>
            <span className="font-serif text-xl font-bold text-ink-900">Penstrike</span>
          </Link>
        </div>
        
        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-gradient-to-b from-parchment-50 to-cream-100">
          <div 
            className={`w-full max-w-md transition-all duration-350 ease-out ${
              isTransitioning 
                ? 'opacity-0 -translate-x-8' 
                : 'opacity-100 translate-x-0'
            }`}
          >
            {displayChildren}
          </div>
        </div>
      </div>
    </div>
  );
}
