'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, TwitterLogo, InstagramLogo, LinkedinLogo, EnvelopeSimple, Heart, ArrowUpRight } from '@phosphor-icons/react';

export function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  // Hide footer on auth pages (login/signup)
  const isAuthPage = pathname === '/login' || pathname === '/signup';
  
  if (isAuthPage) {
    return null;
  }

  const footerLinks = {
    company: [
      { href: '/about', label: 'About Us' },
      { href: '/careers', label: 'Careers' },
      { href: '/contact', label: 'Contact' },
    ],
    services: [
      { href: '/services/editing', label: 'Editing' },
      { href: '/services/cover-design', label: 'Cover Design' },
      { href: '/services/audiobooks', label: 'AI Audiobooks' },
      { href: '/services/distribution', label: 'Distribution' },
      { href: '/services/formatting', label: 'Formatting' },
      { href: '/services/marketing', label: 'Marketing' },
    ],
    resources: [
      { href: '/community', label: 'Community' },
      { href: '/authors', label: 'Our Authors' },
      { href: '/help/faq', label: 'FAQ' },
      { href: '/help', label: 'Help Center' },
    ],
    legal: [
      { href: '/privacy', label: 'Privacy Policy' },
      { href: '/terms', label: 'Terms of Service' },
      { href: '/royalty', label: 'Royalty Policy' },
      { href: '/sustainability', label: 'Sustainability' },
    ],
  };

  const socialLinks = [
    { href: 'https://twitter.com/penstrike', icon: TwitterLogo, label: 'Twitter' },
    { href: 'https://instagram.com/penstrike', icon: InstagramLogo, label: 'Instagram' },
    { href: 'https://linkedin.com/company/penstrike', icon: LinkedinLogo, label: 'LinkedIn' },
    { href: 'mailto:hello@penstrike.com', icon: EnvelopeSimple, label: 'Email' },
  ];

  return (
    <footer className="bg-ink-950 text-parchment-100 relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-yellow/30 to-transparent" />
      
      {/* Newsletter Section */}
      <div className="border-b border-ink-800/50">
        <div className="container-editorial py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="font-serif text-2xl md:text-3xl font-bold text-white mb-4">
              Stay in the Loop
            </h3>
            <p className="text-parchment-400 mb-8 max-w-lg mx-auto">
              Get publishing tips, industry insights, and early access to new features delivered to your inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-5 py-3.5 rounded-xl bg-ink-900/80 border border-ink-700/50 text-white placeholder:text-ink-500 focus:border-accent-yellow/50 focus:outline-none focus:ring-2 focus:ring-accent-yellow/20 transition-all duration-300"
              />
              <button 
                type="submit"
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-accent-yellow to-accent-amber text-ink-900 font-semibold hover:from-accent-amber hover:to-accent-warm transition-all duration-300 hover:shadow-glow-gold"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-editorial py-12 md:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 sm:col-span-2 md:col-span-3 lg:col-span-2 mb-6 md:mb-0">
            <Link href="/" className="group inline-flex items-center gap-3 mb-4 md:mb-6">
              <div className="p-2 rounded-xl bg-gradient-to-br from-accent-yellow/20 to-accent-amber/10 group-hover:from-accent-yellow/30 group-hover:to-accent-amber/20 transition-all duration-300">
                <BookOpen weight="duotone" className="h-5 w-5 md:h-6 md:w-6 text-accent-yellow" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-lg md:text-xl font-bold text-white">
                  Penstrike
                </span>
                <span className="text-[10px] md:text-xs font-medium tracking-widest uppercase text-parchment-500">
                  Inkworks
                </span>
              </div>
            </Link>
            <p className="text-parchment-400 text-sm leading-relaxed mb-6 md:mb-8 max-w-xs">
              An author-first publishing platform. Create, edit, design, publish, 
              and sell your books while retaining 100% ownership of your work.
            </p>
            <div className="flex gap-2 md:gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 md:p-2.5 rounded-xl bg-ink-800/50 text-parchment-400 hover:bg-accent-yellow/10 hover:text-accent-yellow transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon weight="fill" className="h-4 w-4 md:h-5 md:w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-serif font-semibold text-white text-sm md:text-base mb-3 md:mb-5 flex items-center gap-2">
              Company
              <span className="w-6 md:w-8 h-px bg-accent-yellow/30" />
            </h4>
            <ul className="space-y-2 md:space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1 text-xs md:text-sm text-parchment-400 hover:text-white transition-colors duration-200"
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight weight="bold" className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-serif font-semibold text-white text-sm md:text-base mb-3 md:mb-5 flex items-center gap-2">
              Services
              <span className="w-6 md:w-8 h-px bg-accent-yellow/30" />
            </h4>
            <ul className="space-y-2 md:space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1 text-xs md:text-sm text-parchment-400 hover:text-white transition-colors duration-200"
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight weight="bold" className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-serif font-semibold text-white text-sm md:text-base mb-3 md:mb-5 flex items-center gap-2">
              Resources
              <span className="w-6 md:w-8 h-px bg-accent-yellow/30" />
            </h4>
            <ul className="space-y-2 md:space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1 text-xs md:text-sm text-parchment-400 hover:text-white transition-colors duration-200"
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight weight="bold" className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-serif font-semibold text-white text-sm md:text-base mb-3 md:mb-5 flex items-center gap-2">
              Legal
              <span className="w-6 md:w-8 h-px bg-accent-yellow/30" />
            </h4>
            <ul className="space-y-2 md:space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1 text-xs md:text-sm text-parchment-400 hover:text-white transition-colors duration-200"
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight weight="bold" className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-ink-800/50">
        <div className="container-editorial py-4 md:py-6">
          <div className="flex flex-col md:flex-row items-center justify-center md:justify-between gap-3 md:gap-4 text-xs md:text-sm text-parchment-500 text-center md:text-left">
            <p>
              &copy; {currentYear} Penstrike Inkworks. All rights reserved.
            </p>
            <p className="flex items-center gap-1.5">
              Made with <Heart weight="fill" className="h-3 w-3 md:h-4 md:w-4 text-red-400" /> for authors worldwide
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
