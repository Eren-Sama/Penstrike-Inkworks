'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Envelope,
  Phone,
  MapPin,
  Clock,
  PaperPlaneTilt,
  ChatCircle,
  Users,
  BookOpen,
  Question,
  ArrowRight,
  CheckCircle,
  Buildings,
  GraduationCap,
  Globe,
  LinkedinLogo,
  TwitterLogo,
  InstagramLogo,
  WhatsappLogo,
  Headphones,
  EnvelopeSimple,
  CaretDown,
  Star,
  Lightning
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';

const contactMethods = [
  {
    icon: Phone,
    title: 'Call Us',
    value: '+91 70117 14520',
    subtext: 'Mon-Sat, 10AM-7PM IST',
    href: 'tel:+917011714520',
    color: 'from-emerald-500 to-teal-500',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-600'
  },
  {
    icon: Envelope,
    title: 'Email Us',
    value: 'penstrikeinkworks@gmail.com',
    subtext: 'We reply within 24 hours',
    href: 'mailto:penstrikeinkworks@gmail.com',
    color: 'from-blue-500 to-indigo-500',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600'
  },
  {
    icon: WhatsappLogo,
    title: 'WhatsApp',
    value: '+91 70117 14520',
    subtext: 'Quick responses',
    href: 'https://wa.me/917011714520',
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-50',
    textColor: 'text-green-600'
  },
  {
    icon: Headphones,
    title: 'Live Chat',
    value: 'Start a conversation',
    subtext: 'Available 24/7',
    href: '#',
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-600'
  },
];

const offices = [
  {
    type: 'Headquarters',
    icon: Buildings,
    address: '2/112, Nawabganj',
    city: 'Kanpur',
    state: 'Uttar Pradesh',
    pincode: '208002',
    country: 'India',
    phone: '+91 9876 543 210',
    email: 'hq@penstrikeinkworks.com',
    gradient: 'from-amber-500 to-orange-500',
    mapUrl: 'https://maps.google.com/?q=Nawabganj+Kanpur'
  },
  {
    type: 'Innovation Hub',
    icon: GraduationCap,
    address: 'Sec - 17A, Galgotias University, GIC RISE Block-B',
    city: 'Greater Noida',
    state: 'Uttar Pradesh',
    pincode: '203201',
    country: 'India',
    phone: '+91 9876 543 211',
    email: 'innovation@penstrikeinkworks.com',
    gradient: 'from-purple-500 to-indigo-500',
    mapUrl: 'https://maps.google.com/?q=Galgotias+University+Greater+Noida'
  },
];

const faqs = [
  {
    q: 'How do I submit my manuscript?',
    a: 'Create an author account, navigate to your dashboard, and click "Submit Manuscript". Our step-by-step process guides you through formatting, cover upload, and metadata.'
  },
  {
    q: 'What are the royalty rates?',
    a: 'Authors earn 70% on eBooks and 60% on print sales. Premium members enjoy rates up to 80%. Payments are processed monthly via bank transfer or PayPal.'
  },
  {
    q: 'How long does review take?',
    a: 'Our editorial team reviews manuscripts within 7-14 business days. You\'ll receive email updates at each stage of the review process.'
  },
  {
    q: 'Can I use AI tools for free?',
    a: 'New authors receive 50 free AI credits. Additional credits can be purchased or earned through our referral program and Pro membership.'
  },
  {
    q: 'Do you offer marketing support?',
    a: 'Yes! We provide marketing tools, promotional campaigns, and a dedicated author community. Pro members get access to personalized marketing consultations.'
  },
  {
    q: 'How do I track my sales?',
    a: 'Your author dashboard provides real-time sales analytics, reader demographics, and detailed royalty reports. Data updates every 24 hours.'
  },
];

const stats = [
  { value: '50K+', label: 'Authors' },
  { value: '2M+', label: 'Books Sold' },
  { value: '24hrs', label: 'Avg Response' },
  { value: '4.9/5', label: 'Satisfaction' },
];

export default function ContactPage() {
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    category: 'general',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-parchment-50 to-cream-100">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-ink-900 via-ink-800 to-ink-900" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-20 w-96 h-96 bg-accent-yellow/30 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-80 h-80 bg-purple-500/30 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className={`text-center max-w-3xl mx-auto transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white/90 text-sm font-medium mb-6">
              <ChatCircle weight="duotone" className="h-4 w-4" />
              We're Here to Help
            </div>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Get in Touch
            </h1>
            <p className="text-parchment-200 text-lg md:text-xl max-w-2xl mx-auto">
              Have questions about publishing, need support, or want to partner with us? 
              Our team is ready to assist you on your journey.
            </p>
          </div>

          {/* Stats */}
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-3xl mx-auto transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {stats.map((stat, i) => (
              <div key={i} className="text-center p-4 rounded-2xl bg-white/10 backdrop-blur-sm">
                <p className="text-2xl md:text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-parchment-300 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="container mx-auto px-4 -mt-8 relative z-20">
        <div className={`grid sm:grid-cols-2 lg:grid-cols-4 gap-4 transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {contactMethods.map((method, i) => (
            <a
              key={i}
              href={method.href}
              className="group bg-white rounded-2xl border border-parchment-200 p-6 shadow-card hover:shadow-elegant transition-all duration-300 hover:-translate-y-1"
            >
              <div className={cn('w-14 h-14 rounded-2xl flex items-center justify-center mb-4', method.bgColor)}>
                <method.icon weight="duotone" className={cn('h-7 w-7', method.textColor)} />
              </div>
              <h3 className="font-semibold text-ink-900 mb-1">{method.title}</h3>
              <p className="text-ink-700 font-medium text-sm group-hover:text-accent-warm transition-colors">{method.value}</p>
              <p className="text-ink-500 text-xs mt-1">{method.subtext}</p>
            </a>
          ))}
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-5 gap-10">
          {/* Contact Form */}
          <div className={`lg:col-span-3 transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="bg-white rounded-3xl border border-parchment-200 shadow-card overflow-hidden">
              {submitted ? (
                <div className="p-12 text-center">
                  <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle weight="fill" className="h-10 w-10 text-emerald-600" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-ink-900 mb-3">Message Sent!</h3>
                  <p className="text-ink-600 mb-8 max-w-md mx-auto">
                    Thank you for reaching out. We'll get back to you within 24 hours.
                  </p>
                  <Button onClick={() => setSubmitted(false)} variant="outline">
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <div className="p-8 md:p-10">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-yellow to-accent-amber flex items-center justify-center">
                      <PaperPlaneTilt weight="fill" className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h2 className="font-serif text-2xl font-bold text-ink-900">Send a Message</h2>
                      <p className="text-ink-500">Fill out the form below and we'll respond promptly</p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-ink-700 mb-2">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="John Doe"
                          className="w-full px-4 py-3.5 rounded-xl border border-parchment-200 focus:border-accent-yellow focus:ring-2 focus:ring-accent-yellow/20 outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-ink-700 mb-2">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="john@example.com"
                          className="w-full px-4 py-3.5 rounded-xl border border-parchment-200 focus:border-accent-yellow focus:ring-2 focus:ring-accent-yellow/20 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-ink-700 mb-2">Phone Number</label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+91 98765 43210"
                          className="w-full px-4 py-3.5 rounded-xl border border-parchment-200 focus:border-accent-yellow focus:ring-2 focus:ring-accent-yellow/20 outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-ink-700 mb-2">Category</label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="w-full px-4 py-3.5 rounded-xl border border-parchment-200 focus:border-accent-yellow focus:ring-2 focus:ring-accent-yellow/20 outline-none transition-all bg-white"
                        >
                          <option value="general">General Inquiry</option>
                          <option value="author">Author Support</option>
                          <option value="reader">Reader Support</option>
                          <option value="technical">Technical Issue</option>
                          <option value="billing">Billing & Payments</option>
                          <option value="partnership">Partnership</option>
                          <option value="media">Media & Press</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-ink-700 mb-2">Subject *</label>
                      <input
                        type="text"
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="How can we help you?"
                        className="w-full px-4 py-3.5 rounded-xl border border-parchment-200 focus:border-accent-yellow focus:ring-2 focus:ring-accent-yellow/20 outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-ink-700 mb-2">Message *</label>
                      <textarea
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Tell us more about your inquiry..."
                        rows={5}
                        className="w-full px-4 py-3.5 rounded-xl border border-parchment-200 focus:border-accent-yellow focus:ring-2 focus:ring-accent-yellow/20 outline-none transition-all resize-none"
                      />
                    </div>

                    <Button type="submit" size="lg" className="w-full btn-accent gap-2">
                      <PaperPlaneTilt weight="bold" className="h-5 w-5" />
                      Send Message
                    </Button>
                  </form>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className={`lg:col-span-2 space-y-6 transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {/* Office Locations */}
            {offices.map((office, i) => (
              <div key={i} className="bg-white rounded-2xl border border-parchment-200 shadow-card overflow-hidden">
                <div className={cn('p-4 bg-gradient-to-r text-white', office.gradient)}>
                  <div className="flex items-center gap-3">
                    <office.icon weight="fill" className="h-6 w-6" />
                    <span className="font-semibold">{office.type}</span>
                  </div>
                </div>
                <div className="p-5 space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin weight="duotone" className="h-5 w-5 text-ink-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-ink-800 font-medium text-sm">{office.address}</p>
                      <p className="text-ink-600 text-sm">{office.city}, {office.state} - {office.pincode}</p>
                      <p className="text-ink-500 text-xs">{office.country}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone weight="duotone" className="h-5 w-5 text-ink-400" />
                    <a href={`tel:${office.phone.replace(/\s/g, '')}`} className="text-ink-700 hover:text-accent-warm text-sm font-medium transition-colors">
                      {office.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Envelope weight="duotone" className="h-5 w-5 text-ink-400" />
                    <a href={`mailto:${office.email}`} className="text-ink-700 hover:text-accent-warm text-sm font-medium transition-colors truncate">
                      {office.email}
                    </a>
                  </div>
                  <a
                    href={office.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-accent-warm hover:text-accent-amber mt-2"
                  >
                    View on Map
                    <ArrowRight weight="bold" className="h-4 w-4" />
                  </a>
                </div>
              </div>
            ))}

            {/* Business Hours */}
            <div className="bg-gradient-to-br from-accent-yellow/10 to-accent-amber/10 rounded-2xl border border-accent-yellow/20 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Clock weight="duotone" className="h-6 w-6 text-accent-warm" />
                <h3 className="font-serif text-lg font-bold text-ink-900">Business Hours</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-ink-600">Monday - Friday</span>
                  <span className="font-medium text-ink-900">10:00 AM - 7:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-600">Saturday</span>
                  <span className="font-medium text-ink-900">10:00 AM - 5:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-600">Sunday</span>
                  <span className="font-medium text-red-600">Closed</span>
                </div>
              </div>
              <p className="text-xs text-ink-500 mt-4">All times are in IST (Indian Standard Time)</p>
            </div>

            {/* Social Links */}
            <div className="bg-white rounded-2xl border border-parchment-200 p-6">
              <h3 className="font-serif text-lg font-bold text-ink-900 mb-4">Follow Us</h3>
              <div className="flex gap-3">
                {[
                  { icon: TwitterLogo, href: '#', label: 'Twitter', color: 'hover:bg-blue-50 hover:text-blue-500' },
                  { icon: InstagramLogo, href: '#', label: 'Instagram', color: 'hover:bg-pink-50 hover:text-pink-500' },
                  { icon: LinkedinLogo, href: '#', label: 'LinkedIn', color: 'hover:bg-blue-50 hover:text-blue-600' },
                  { icon: WhatsappLogo, href: '#', label: 'WhatsApp', color: 'hover:bg-green-50 hover:text-green-500' },
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className={cn('w-12 h-12 rounded-xl bg-parchment-100 flex items-center justify-center text-ink-500 transition-all', social.color)}
                    aria-label={social.label}
                  >
                    <social.icon weight="fill" className="h-6 w-6" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 pb-20">
        <div className={`text-center mb-12 transition-all duration-700 delay-400 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-medium mb-4">
            <Question weight="duotone" className="h-4 w-4" />
            Common Questions
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-ink-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-ink-600 max-w-2xl mx-auto">
            Find quick answers to the most common questions about our platform
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`bg-white rounded-2xl border border-parchment-200 overflow-hidden transition-all duration-300 ${expandedFaq === i ? 'shadow-lg' : 'shadow-card hover:shadow-lg'}`}
            >
              <button
                onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="font-semibold text-ink-900 pr-4">{faq.q}</span>
                <CaretDown
                  weight="bold"
                  className={cn('h-5 w-5 text-ink-400 flex-shrink-0 transition-transform', expandedFaq === i && 'rotate-180')}
                />
              </button>
              <div className={cn('overflow-hidden transition-all duration-300', expandedFaq === i ? 'max-h-40' : 'max-h-0')}>
                <p className="px-5 pb-5 text-ink-600">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <p className="text-ink-600 mb-4">Still have questions?</p>
          <Link href="/help">
            <Button variant="outline" className="gap-2">
              Visit Help Center
              <ArrowRight weight="bold" className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
