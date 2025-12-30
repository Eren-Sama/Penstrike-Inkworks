import Link from 'next/link';
import { 
  Percent, 
  Calendar, 
  CreditCard, 
  BookOpen, 
  Headphones, 
  CheckCircle, 
  Question as HelpCircle,
  ArrowRight,
  Envelope as Mail,
  Wallet,
  TrendUp as TrendingUp,
  Trophy as Award,
  Globe
} from '@phosphor-icons/react/dist/ssr';

export const metadata = {
  title: 'Royalty Policy - Penstrike Inkworks',
  description: 'Transparent, competitive royalties that reward your creative work. Learn how you earn on every sale.',
};

const royaltyRates = [
  {
    type: 'eBooks',
    icon: BookOpen,
    rates: [
      { tier: 'Standard', rate: '60%', description: 'For books priced under $2.99' },
      { tier: 'Premium', rate: '70%', description: 'For books priced $2.99 - $9.99' },
      { tier: 'Enterprise', rate: '80%', description: 'For Enterprise plan members' },
    ],
    gradient: 'from-blue-500 to-indigo-600',
    bgGradient: 'from-blue-50 to-indigo-50',
  },
  {
    type: 'Print Books',
    icon: BookOpen,
    rates: [
      { tier: 'Paperback', rate: '55%', description: 'After printing costs' },
      { tier: 'Hardcover', rate: '50%', description: 'After printing costs' },
      { tier: 'Large Format', rate: '45%', description: 'After printing costs' },
    ],
    gradient: 'from-emerald-500 to-teal-600',
    bgGradient: 'from-emerald-50 to-teal-50',
  },
  {
    type: 'Audiobooks',
    icon: Headphones,
    rates: [
      { tier: 'Standard', rate: '40%', description: 'Per-sale royalty' },
      { tier: 'Subscription', rate: '25%', description: 'From subscription pools' },
      { tier: 'Direct Sales', rate: '60%', description: 'Through author page' },
    ],
    gradient: 'from-violet-500 to-purple-600',
    bgGradient: 'from-violet-50 to-purple-50',
  },
];

const paymentInfo = [
  {
    icon: Calendar,
    title: 'Payment Schedule',
    description: 'Royalties are calculated monthly and paid out 60 days after the end of each month to allow for returns processing.',
    color: 'from-blue-500 to-indigo-600',
  },
  {
    icon: CreditCard,
    title: 'Minimum Threshold',
    description: 'Payments are issued when your balance reaches $50. Balances below this threshold roll over to the next month.',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    icon: Wallet,
    title: 'Payment Methods',
    description: 'We support direct bank transfer (ACH/SEPA), PayPal, and Payoneer. Wire transfers available for balances over $500.',
    color: 'from-amber-500 to-orange-600',
  },
];

const faqs = [
  {
    question: 'How is the list price determined?',
    answer: 'You set the list price for your books. We recommend researching comparable titles in your genre. For print books, there is a minimum price based on printing costs.',
  },
  {
    question: 'Are there any deductions from royalties?',
    answer: 'Royalties are calculated on the net sale price (list price minus any discounts). Printing costs for print books and delivery costs for large eBooks are deducted before royalty calculation.',
  },
  {
    question: 'How are returns handled?',
    answer: 'If a customer returns a book, the royalty for that sale is deducted from your next payment. This is why we have a 60-day payment delay.',
  },
  {
    question: 'Can I track my earnings in real-time?',
    answer: 'Yes! Your author dashboard shows estimated earnings updated daily, with detailed reports available for download. Final monthly reports are available after the reconciliation period.',
  },
  {
    question: 'Do royalty rates differ by country?',
    answer: 'Royalty rates are generally consistent worldwide. However, in some territories where VAT or other taxes apply, these are deducted before royalty calculation.',
  },
];

const comparisonData = [
  { platform: 'Penstrike Inkworks', rate: '60-80%', highlight: true },
  { platform: 'Other Self-Publishing Platforms', rate: '35-70%', highlight: false },
  { platform: 'Traditional Publishing', rate: '10-25%', highlight: false },
  { platform: 'Hybrid Publishing', rate: '25-50%', highlight: false },
];

export default function RoyaltyPolicyPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-b from-parchment-100 via-parchment-50 to-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-orange-400/10 rounded-full blur-3xl animate-float animation-delay-500" />
        </div>
        <div className="absolute inset-0 bg-grid opacity-30" />
        
        <div className="container-editorial relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-3 mb-8 animate-fade-down">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                <Percent className="h-8 w-8 text-white" />
              </div>
            </div>
            
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-ink-900 mb-6 animate-fade-up">
              Royalty{' '}
              <span className="text-gradient-gold">Policy</span>
            </h1>
            
            <p className="text-ink-600 text-lg sm:text-xl mb-6 leading-relaxed animate-fade-up animation-delay-100 max-w-2xl mx-auto">
              Transparent, competitive royalties that reward your creative work. Learn how you earn on every sale.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-6 animate-fade-up animation-delay-200">
              {[
                { icon: TrendingUp, text: 'Up to 80% Royalties' },
                { icon: Globe, text: 'Global Sales' },
                { icon: Award, text: 'Industry Leading' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-ink-700">
                  <div className="w-8 h-8 rounded-lg bg-accent-yellow/20 flex items-center justify-center">
                    <item.icon className="h-4 w-4 text-accent-warm" />
                  </div>
                  <span className="font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Royalty Rates */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container-editorial">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl lg:text-4xl font-bold text-ink-900 mb-4">
              Royalty Rates by Format
            </h2>
            <p className="text-ink-600 text-lg max-w-2xl mx-auto">
              Our royalty rates are among the highest in the industry. Here&apos;s what you earn on each format.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {royaltyRates.map((category, index) => (
              <div
                key={category.type}
                className="group rounded-3xl bg-white border border-parchment-200 shadow-card hover:shadow-elegant transition-all duration-500 overflow-hidden animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Header */}
                <div className={`bg-gradient-to-br ${category.gradient} p-6 lg:p-8`}>
                  <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4">
                    <category.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-white">{category.type}</h3>
                </div>
                
                {/* Rates */}
                <div className="p-6 lg:p-8 space-y-6">
                  {category.rates.map((rate, i) => (
                    <div key={rate.tier} className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-ink-900">{rate.tier}</p>
                        <p className="text-sm text-ink-500">{rate.description}</p>
                      </div>
                      <span className="text-2xl lg:text-3xl font-bold text-emerald-600">{rate.rate}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-white to-parchment-50">
        <div className="container-editorial">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl lg:text-4xl font-bold text-ink-900 mb-4">
                How We Compare
              </h2>
              <p className="text-ink-600 text-lg">
                See how our royalty rates stack up against other publishing models.
              </p>
            </div>
            
            <div className="rounded-3xl bg-white border border-parchment-200 shadow-elegant overflow-hidden animate-fade-up">
              {/* Table Header */}
              <div className="bg-gradient-to-r from-ink-900 to-ink-800 p-6">
                <div className="grid grid-cols-2 gap-4">
                  <span className="font-semibold text-white">Publishing Model</span>
                  <span className="font-semibold text-white text-right">Typical Royalty Rate</span>
                </div>
              </div>
              
              {/* Table Body */}
              <div className="divide-y divide-parchment-200">
                {comparisonData.map((item, index) => (
                  <div 
                    key={item.platform}
                    className={`p-6 grid grid-cols-2 gap-4 items-center ${item.highlight ? 'bg-emerald-50' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      {item.highlight && <CheckCircle weight="fill" className="h-5 w-5 text-emerald-500" />}
                      <span className={`font-medium ${item.highlight ? 'text-emerald-700' : 'text-ink-700'}`}>
                        {item.platform}
                      </span>
                    </div>
                    <span className={`text-right text-xl lg:text-2xl font-bold ${item.highlight ? 'text-emerald-600' : 'text-ink-600'}`}>
                      {item.rate}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Info */}
      <section className="py-16 lg:py-24 bg-parchment-50">
        <div className="container-editorial">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl lg:text-4xl font-bold text-ink-900 mb-4">
              Payment Information
            </h2>
            <p className="text-ink-600 text-lg max-w-2xl mx-auto">
              Getting paid for your work should be simple and reliable.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {paymentInfo.map((info, index) => (
              <div
                key={info.title}
                className="rounded-3xl bg-white border border-parchment-200 shadow-card hover:shadow-elegant transition-all duration-500 p-8 animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${info.color} flex items-center justify-center mb-6 shadow-md`}>
                  <info.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="font-serif text-xl font-bold text-ink-900 mb-3">{info.title}</h3>
                <p className="text-ink-600 leading-relaxed">{info.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-parchment-50 to-white">
        <div className="container-editorial">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl lg:text-4xl font-bold text-ink-900 mb-4">
                Frequently Asked Questions
              </h2>
            </div>
            
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="rounded-2xl bg-white border border-parchment-200 shadow-card hover:shadow-elegant transition-all duration-300 p-6 lg:p-8 animate-fade-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-md">
                      <HelpCircle className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-bold text-ink-900 mb-2">{faq.question}</h3>
                      <p className="text-ink-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container-editorial">
          <div className="max-w-3xl mx-auto text-center">
            <div className="rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 p-8 lg:p-12 animate-fade-up">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <h2 className="font-serif text-2xl lg:text-3xl font-bold text-ink-900 mb-4">
                Have More Questions?
              </h2>
              <p className="text-ink-600 text-lg mb-8 max-w-xl mx-auto">
                Our author support team is here to help you understand your royalties and payments.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                <Link href="/contact" className="btn-accent btn-lg group shadow-glow-gold">
                  Contact Support
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              <div className="pt-6 border-t border-amber-200">
                <p className="text-ink-600">
                  <strong>Email:</strong> royalties@penstrike.com
                </p>
                <p className="text-ink-500 text-sm mt-2">
                  Phone: 1-800-PUBLISH
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
