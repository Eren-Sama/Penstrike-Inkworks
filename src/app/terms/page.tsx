import Link from 'next/link';
import { 
  FileText, 
  Users, 
  BookOpen, 
  Wallet, 
  MagicWand as Wand2, 
  Copyright, 
  XCircle, 
  Envelope as Mail,
  ArrowRight,
  CheckCircle,
  Scales as Scale,
  Warning as AlertTriangle
} from '@phosphor-icons/react/dist/ssr';

export const metadata = {
  title: 'Terms of Service - Penstrike Inkworks',
  description: 'Read the terms and conditions for using Penstrike Inkworks publishing platform.',
};

const sections = [
  {
    number: '01',
    icon: FileText,
    title: 'Acceptance of Terms',
    color: 'from-blue-500 to-indigo-600',
    content: 'By accessing and using Penstrike Inkworks ("the Platform"), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to abide by these terms, please do not use this Platform.',
    list: null,
  },
  {
    number: '02',
    icon: Users,
    title: 'Author Responsibilities',
    color: 'from-violet-500 to-purple-600',
    content: 'As an author on our Platform, you agree to:',
    list: [
      'Submit only original content that you have the legal right to publish',
      'Not upload content that infringes on copyrights, trademarks, or other intellectual property rights',
      'Provide accurate information about your identity and publications',
      'Comply with all applicable laws and regulations',
      'Maintain the confidentiality of your account credentials',
    ],
  },
  {
    number: '03',
    icon: AlertTriangle,
    title: 'Content Guidelines',
    color: 'from-amber-500 to-orange-600',
    content: 'Content submitted to Penstrike Inkworks must not:',
    list: [
      'Contain illegal, harmful, threatening, abusive, or defamatory material',
      'Promote discrimination based on race, gender, religion, or any protected characteristic',
      'Include unauthorized use of copyrighted material',
      'Contain malicious software or harmful code',
      'Violate any person\'s privacy or publicity rights',
    ],
  },
  {
    number: '04',
    icon: Wallet,
    title: 'Royalties and Payments',
    color: 'from-emerald-500 to-teal-600',
    content: 'Authors receive royalties as specified in our royalty structure. Standard rates are 70% for eBooks and 60% for print editions. Payments are processed monthly, with a minimum threshold of $50 for payout. We reserve the right to withhold payments in cases of suspected fraud or terms violation.',
    list: null,
  },
  {
    number: '05',
    icon: Wand2,
    title: 'AI Services',
    color: 'from-rose-500 to-pink-600',
    content: 'Our AI-powered services, including cover design and audiobook creation, are provided as tools to assist authors. Generated content is for use exclusively with publications on our Platform. AI credits are non-refundable and expire 12 months after purchase.',
    list: null,
  },
  {
    number: '06',
    icon: Copyright,
    title: 'Intellectual Property',
    color: 'from-cyan-500 to-blue-600',
    content: 'Authors retain all rights to their original content. By publishing on Penstrike Inkworks, you grant us a non-exclusive license to distribute, display, and promote your work on our Platform. The Penstrike Inkworks brand, logo, and Platform design remain our exclusive property.',
    list: null,
  },
  {
    number: '07',
    icon: XCircle,
    title: 'Termination',
    color: 'from-slate-500 to-gray-600',
    content: 'We reserve the right to terminate or suspend accounts that violate these terms. Authors may close their accounts at any time, subject to completion of any pending transactions. Upon termination, published works may be removed from the Platform.',
    list: null,
  },
];

export default function TermsPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-b from-parchment-100 via-parchment-50 to-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-400/10 rounded-full blur-3xl animate-float animation-delay-500" />
        </div>
        <div className="absolute inset-0 bg-grid opacity-30" />
        
        <div className="container-editorial relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-3 mb-8 animate-fade-down">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                <Scale className="h-8 w-8 text-white" />
              </div>
            </div>
            
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-ink-900 mb-6 animate-fade-up">
              Terms of{' '}
              <span className="text-gradient-gold">Service</span>
            </h1>
            
            <p className="text-ink-600 text-lg sm:text-xl mb-6 leading-relaxed animate-fade-up animation-delay-100 max-w-2xl mx-auto">
              Please read these terms carefully before using our platform.
            </p>
            
            <p className="text-ink-500 text-sm animate-fade-up animation-delay-200">
              Last updated: December 20, 2024
            </p>
          </div>
        </div>
      </section>

      {/* Quick Summary */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container-editorial">
          <div className="max-w-4xl mx-auto">
            <div className="rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 p-8 lg:p-12 animate-fade-up">
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-md">
                  <BookOpen className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl font-bold text-ink-900 mb-4">The Short Version</h2>
                  <p className="text-ink-600 text-lg leading-relaxed mb-6">
                    We want you to succeed. You keep 100% ownership of your work, earn industry-leading royalties, and can leave anytime. In return, we ask that you publish original content and treat others with respect.
                  </p>
                  <div className="grid sm:grid-cols-3 gap-4">
                    {[
                      { icon: Copyright, text: '100% Ownership' },
                      { icon: Wallet, text: 'Up to 80% Royalties' },
                      { icon: Users, text: 'Author-First' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-blue-700">
                        <item.icon className="h-5 w-5 text-blue-500" />
                        <span className="font-medium">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sections */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-white to-parchment-50">
        <div className="container-editorial">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {sections.map((section, index) => (
                <div
                  key={section.title}
                  className="group rounded-3xl bg-white border border-parchment-200 shadow-card hover:shadow-elegant transition-all duration-500 overflow-hidden animate-fade-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Section Number & Icon */}
                    <div className={`md:w-48 p-6 md:p-8 bg-gradient-to-br ${section.color} flex flex-row md:flex-col items-center md:items-start gap-4`}>
                      <span className="text-3xl md:text-4xl font-serif font-bold text-white/50">{section.number}</span>
                      <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <section.icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 p-6 md:p-8">
                      <h2 className="font-serif text-xl md:text-2xl font-bold text-ink-900 mb-4">{section.title}</h2>
                      <p className="text-ink-600 leading-relaxed">{section.content}</p>
                      
                      {section.list && (
                        <ul className="mt-4 space-y-2">
                          {section.list.map((item, i) => (
                            <li key={i} className="flex items-start gap-3 text-ink-600">
                              <CheckCircle weight="fill" className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Additional Terms */}
      <section className="py-16 lg:py-24 bg-parchment-50">
        <div className="container-editorial">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl lg:text-4xl font-bold text-ink-900 mb-4">
                Additional Information
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="rounded-3xl bg-white border border-parchment-200 shadow-card p-8 animate-fade-up">
                <h3 className="font-serif text-xl font-bold text-ink-900 mb-4">Limitation of Liability</h3>
                <p className="text-ink-600 leading-relaxed">
                  Penstrike Inkworks is provided &ldquo;as is&rdquo; without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from your use of the Platform.
                </p>
              </div>
              
              <div className="rounded-3xl bg-white border border-parchment-200 shadow-card p-8 animate-fade-up animation-delay-100">
                <h3 className="font-serif text-xl font-bold text-ink-900 mb-4">Governing Law</h3>
                <p className="text-ink-600 leading-relaxed">
                  These terms are governed by the laws of the State of New York. Any disputes will be resolved in the courts of New York County, New York.
                </p>
              </div>
              
              <div className="rounded-3xl bg-white border border-parchment-200 shadow-card p-8 animate-fade-up animation-delay-200">
                <h3 className="font-serif text-xl font-bold text-ink-900 mb-4">Changes to Terms</h3>
                <p className="text-ink-600 leading-relaxed">
                  We may update these terms from time to time. We will notify you of significant changes via email or through the Platform. Continued use constitutes acceptance of new terms.
                </p>
              </div>
              
              <div className="rounded-3xl bg-white border border-parchment-200 shadow-card p-8 animate-fade-up animation-delay-300">
                <h3 className="font-serif text-xl font-bold text-ink-900 mb-4">Dispute Resolution</h3>
                <p className="text-ink-600 leading-relaxed">
                  Before filing any legal claim, you agree to attempt to resolve disputes informally by contacting our support team. Many issues can be resolved quickly through direct communication.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-parchment-50 to-white">
        <div className="container-editorial">
          <div className="max-w-3xl mx-auto text-center">
            <div className="rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 p-8 lg:p-12 animate-fade-up">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <h2 className="font-serif text-2xl lg:text-3xl font-bold text-ink-900 mb-4">
                Questions About These Terms?
              </h2>
              <p className="text-ink-600 text-lg mb-8 max-w-xl mx-auto">
                Our legal team is here to clarify any questions you may have about our terms of service.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                <Link href="/contact" className="btn-accent btn-lg group shadow-glow-gold">
                  Contact Legal Team
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              <div className="pt-6 border-t border-blue-200">
                <p className="text-ink-600">
                  <strong>Email:</strong> legal@penstrike.com
                </p>
                <p className="text-ink-500 text-sm mt-2">
                  123 Publishing Lane, New York, NY 10001
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
