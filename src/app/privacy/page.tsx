import Link from 'next/link';
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  Database, 
  Bell, 
  Globe, 
  Trash as Trash2, 
  Envelope as Mail,
  ArrowRight,
  FileText,
  UserCheck
} from '@phosphor-icons/react/dist/ssr';

export const metadata = {
  title: 'Privacy Policy - Penstrike Inkworks',
  description: 'Learn how Penstrike Inkworks collects, uses, and protects your personal information.',
};

const sections = [
  {
    icon: Database,
    title: 'Information We Collect',
    color: 'from-blue-500 to-indigo-600',
    content: [
      'Account information (name, email, password)',
      'Profile details (bio, profile picture)',
      'Payment information (processed securely through our payment providers)',
      'Content you upload (manuscripts, cover images)',
      'Communications with our support team',
      'Device information, log data, and usage patterns',
    ],
  },
  {
    icon: Eye,
    title: 'How We Use Your Information',
    color: 'from-violet-500 to-purple-600',
    content: [
      'Provide, maintain, and improve our services',
      'Process transactions and send related information',
      'Send you technical notices, updates, and support messages',
      'Respond to your comments, questions, and requests',
      'Monitor and analyze trends, usage, and activities',
      'Detect, investigate, and prevent fraudulent transactions',
      'Personalize and improve your experience',
    ],
  },
  {
    icon: Globe,
    title: 'Information Sharing',
    color: 'from-cyan-500 to-teal-600',
    content: [
      'We do not sell your personal information',
      'With service providers who perform services on our behalf',
      'To comply with legal obligations',
      'To protect and defend our rights and property',
      'With your consent or at your direction',
      'Author profiles and published works are publicly visible',
    ],
  },
  {
    icon: Lock,
    title: 'Data Security',
    color: 'from-emerald-500 to-green-600',
    content: [
      'Encryption of data in transit and at rest',
      'Regular security assessments',
      'Access controls and authentication',
      'Secure data storage practices',
      'Continuous monitoring for threats',
    ],
  },
  {
    icon: Bell,
    title: 'Your Choices',
    color: 'from-amber-500 to-orange-600',
    content: [
      'Update or correct your account settings at any time',
      'Opt out of promotional emails via the unsubscribe link',
      'Refuse or delete cookies through your browser settings',
      'Request a copy of your personal data',
      'Request deletion of your account and associated data',
    ],
  },
  {
    icon: Trash2,
    title: 'Data Retention',
    color: 'from-rose-500 to-pink-600',
    content: [
      'We retain your information for as long as your account is active',
      'Data retained as necessary to comply with legal obligations',
      'Information kept to resolve disputes and enforce agreements',
      'Published works and royalty records retained for compliance',
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-b from-parchment-100 via-parchment-50 to-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-teal-400/10 rounded-full blur-3xl animate-float animation-delay-500" />
        </div>
        <div className="absolute inset-0 bg-grid opacity-30" />
        
        <div className="container-editorial relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-3 mb-8 animate-fade-down">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                <ShieldCheck className="h-8 w-8 text-white" />
              </div>
            </div>
            
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-ink-900 mb-6 animate-fade-up">
              Privacy{' '}
              <span className="text-gradient-gold">Policy</span>
            </h1>
            
            <p className="text-ink-600 text-lg sm:text-xl mb-6 leading-relaxed animate-fade-up animation-delay-100 max-w-2xl mx-auto">
              Your privacy matters to us. Learn how we collect, use, and protect your personal information.
            </p>
            
            <p className="text-ink-500 text-sm animate-fade-up animation-delay-200">
              Last updated: December 20, 2024
            </p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container-editorial">
          <div className="max-w-4xl mx-auto">
            <div className="rounded-3xl bg-gradient-to-br from-parchment-50 to-white border border-parchment-200 shadow-elegant p-8 lg:p-12 animate-fade-up">
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0 shadow-md">
                  <FileText className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl font-bold text-ink-900 mb-4">Our Commitment to Privacy</h2>
                  <p className="text-ink-600 text-lg leading-relaxed">
                    At Penstrike Inkworks, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our publishing platform. By using our services, you consent to the data practices described in this policy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sections Grid */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-white to-parchment-50">
        <div className="container-editorial">
          <div className="max-w-5xl mx-auto">
            <div className="grid gap-8">
              {sections.map((section, index) => (
                <div
                  key={section.title}
                  className="group rounded-3xl bg-white border border-parchment-200 shadow-card hover:shadow-elegant transition-all duration-500 overflow-hidden animate-fade-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex flex-col lg:flex-row">
                    {/* Icon Header */}
                    <div className={`lg:w-72 p-6 lg:p-8 bg-gradient-to-br ${section.color} flex flex-row lg:flex-col items-center lg:items-start gap-4`}>
                      <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <section.icon className="h-6 w-6 lg:h-7 lg:w-7 text-white" />
                      </div>
                      <h2 className="font-serif text-xl lg:text-2xl font-bold text-white">{section.title}</h2>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 p-6 lg:p-8">
                      <ul className="grid sm:grid-cols-2 gap-3">
                        {section.content.map((item, i) => (
                          <li key={i} className="flex items-start gap-3 text-ink-600">
                            <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            </div>
                            <span className="text-sm lg:text-base">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Legal Notices */}
      <section className="py-16 lg:py-24 bg-parchment-50">
        <div className="container-editorial">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl lg:text-4xl font-bold text-ink-900 mb-4">
                Regional Compliance
              </h2>
              <p className="text-ink-600 text-lg max-w-2xl mx-auto">
                We comply with data protection regulations worldwide.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* GDPR Notice */}
              <div className="rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 p-8 animate-fade-up">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
                    <Globe className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-blue-900">European Users (GDPR)</h3>
                </div>
                <p className="text-blue-700 leading-relaxed mb-4">
                  If you are located in the European Economic Area, you have additional rights under the General Data Protection Regulation (GDPR):
                </p>
                <ul className="space-y-2">
                  {['Right to access your data', 'Right to rectify inaccurate data', 'Right to data portability', 'Right to erasure', 'Right to restrict processing'].map((right, i) => (
                    <li key={i} className="flex items-center gap-2 text-blue-700 text-sm">
                      <UserCheck className="h-4 w-4 text-blue-500" />
                      {right}
                    </li>
                  ))}
                </ul>
              </div>

              {/* CCPA Notice */}
              <div className="rounded-3xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 p-8 animate-fade-up animation-delay-100">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-md">
                    <ShieldCheck className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-purple-900">California Residents (CCPA)</h3>
                </div>
                <p className="text-purple-700 leading-relaxed mb-4">
                  California residents have specific rights under the California Consumer Privacy Act (CCPA):
                </p>
                <ul className="space-y-2">
                  {['Right to know what data is collected', 'Right to request deletion', 'Right to opt-out of data sales', 'Right to non-discrimination', 'We do not sell personal information'].map((right, i) => (
                    <li key={i} className="flex items-center gap-2 text-purple-700 text-sm">
                      <UserCheck className="h-4 w-4 text-purple-500" />
                      {right}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-parchment-50 to-white">
        <div className="container-editorial">
          <div className="max-w-3xl mx-auto text-center">
            <div className="rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 p-8 lg:p-12 animate-fade-up">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <h2 className="font-serif text-2xl lg:text-3xl font-bold text-ink-900 mb-4">
                Questions About Privacy?
              </h2>
              <p className="text-ink-600 text-lg mb-8 max-w-xl mx-auto">
                If you have any questions about this Privacy Policy or our data practices, our Privacy Team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                <Link href="/contact" className="btn-accent btn-lg group shadow-glow-gold">
                  Contact Privacy Team
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              <div className="pt-6 border-t border-emerald-200">
                <p className="text-ink-600">
                  <strong>Email:</strong> privacy@penstrike.com
                </p>
                <p className="text-ink-500 text-sm mt-2">
                  Penstrike Inkworks Privacy Office<br />
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
