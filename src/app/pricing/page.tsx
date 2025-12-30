import {
  CheckCircle,
  Sparkle,
  Lightning,
  Crown,
  ArrowRight,
  Question
} from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';

const plans = [
  {
    name: 'Free',
    description: 'Perfect for getting started',
    price: 0,
    billing: 'forever',
    features: [
      'Publish 1 book',
      '70% royalties',
      'Basic formatting tools',
      'Email support',
      '10 AI credits',
      'Community access',
    ],
    notIncluded: [
      'Priority review',
      'Marketing tools',
      'Analytics dashboard',
      'Custom author page',
    ],
    cta: 'Get Started Free',
    popular: false,
  },
  {
    name: 'Author',
    description: 'For serious authors',
    price: 19,
    billing: 'per month',
    features: [
      'Publish unlimited books',
      '75% royalties',
      'Advanced formatting',
      'Priority support',
      '100 AI credits/month',
      'Marketing tools',
      'Analytics dashboard',
      'Custom author page',
      'Priority review queue',
    ],
    notIncluded: [
      'Dedicated account manager',
      'Custom distribution',
    ],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Professional',
    description: 'For full-time authors',
    price: 49,
    billing: 'per month',
    features: [
      'Everything in Author',
      '80% royalties',
      'Unlimited AI credits',
      'Dedicated account manager',
      'Custom distribution channels',
      'Advanced analytics',
      'Priority everything',
      'Early access to features',
      'Free professional editing (1/year)',
    ],
    notIncluded: [],
    cta: 'Start Free Trial',
    popular: false,
  },
];

const faqs = [
  {
    question: 'Can I change plans anytime?',
    answer: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect on your next billing cycle.',
  },
  {
    question: 'Is there a free trial?',
    answer: 'Yes, all paid plans come with a 14-day free trial. No credit card required to start.',
  },
  {
    question: 'What are AI credits?',
    answer: 'AI credits are used for our AI-powered tools like cover generation and audiobook creation. One cover costs 5 credits, and audiobooks cost approximately 1 credit per 1,000 words.',
  },
  {
    question: 'Do royalties change based on my plan?',
    answer: 'Yes! Higher tier plans receive better royalty rates. Free users get 70%, Author plan gets 75%, and Professional plan gets 80%.',
  },
  {
    question: 'Can I cancel anytime?',
    answer: 'Absolutely. There are no long-term contracts. Cancel anytime and you won\'t be charged again.',
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-ink-900 via-ink-800 to-ink-900" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-accent-yellow/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white/90 text-sm mb-6 animate-fade-up">
              <Sparkle weight="fill" className="h-4 w-4" />
              Simple, Transparent Pricing
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-6 animate-fade-up" style={{ animationDelay: '100ms' }}>
              Choose Your Publishing Journey
            </h1>
            <p className="text-xl text-parchment-200 animate-fade-up" style={{ animationDelay: '200ms' }}>
              Start free and scale as you grow. No hidden fees, just fair pricing.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 -mt-8 relative z-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl overflow-hidden animate-fade-up ${
                  plan.popular
                    ? 'bg-gradient-to-br from-ink-900 to-ink-800 text-white shadow-elegant scale-105 z-10'
                    : 'bg-white border border-parchment-200 shadow-card'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 px-4 py-1 bg-accent-yellow text-ink-900 text-xs font-bold rounded-bl-xl">
                    Most Popular
                  </div>
                )}
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    {plan.name === 'Free' && <Lightning weight="duotone" className={`h-6 w-6 ${plan.popular ? 'text-accent-yellow' : 'text-ink-600'}`} />}
                    {plan.name === 'Author' && <Sparkle weight="duotone" className={`h-6 w-6 ${plan.popular ? 'text-accent-yellow' : 'text-ink-600'}`} />}
                    {plan.name === 'Professional' && <Crown weight="duotone" className={`h-6 w-6 ${plan.popular ? 'text-accent-yellow' : 'text-ink-600'}`} />}
                    <h3 className={`font-serif text-xl font-bold ${plan.popular ? 'text-white' : 'text-ink-900'}`}>
                      {plan.name}
                    </h3>
                  </div>
                  <p className={`text-sm mb-6 ${plan.popular ? 'text-parchment-200' : 'text-ink-600'}`}>
                    {plan.description}
                  </p>
                  <div className="mb-6">
                    <span className={`font-serif text-5xl font-bold ${plan.popular ? 'text-white' : 'text-ink-900'}`}>
                      {formatCurrency(plan.price)}
                    </span>
                    <span className={plan.popular ? 'text-parchment-300' : 'text-ink-500'}>
                      /{plan.billing}
                    </span>
                  </div>
                  <Button
                    variant={plan.popular ? 'accent' : 'outline'}
                    className="w-full mb-8"
                  >
                    {plan.cta}
                  </Button>
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <CheckCircle weight="fill" className={`h-5 w-5 flex-shrink-0 ${plan.popular ? 'text-accent-yellow' : 'text-emerald-500'}`} />
                        <span className={plan.popular ? 'text-parchment-100' : 'text-ink-600'}>{feature}</span>
                      </li>
                    ))}
                    {plan.notIncluded.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 opacity-50">
                        <span className={`h-5 w-5 flex-shrink-0 flex items-center justify-center text-xs ${plan.popular ? 'text-parchment-400' : 'text-ink-400'}`}>—</span>
                        <span className={plan.popular ? 'text-parchment-300' : 'text-ink-400'}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-ink-900 mb-4">Compare All Features</h2>
            <p className="text-ink-600">See what's included in each plan</p>
          </div>

          <div className="max-w-5xl mx-auto">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-hidden rounded-2xl border border-parchment-200 shadow-card">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-ink-900 to-ink-800">
                    <th className="text-left py-5 px-6 font-serif font-bold text-white text-lg">Feature</th>
                    <th className="text-center py-5 px-4 font-serif font-bold text-white text-lg">
                      <div className="flex flex-col items-center">
                        <Lightning weight="duotone" className="h-5 w-5 mb-1 text-parchment-300" />
                        Free
                      </div>
                    </th>
                    <th className="text-center py-5 px-4 font-serif font-bold text-accent-yellow text-lg bg-ink-800/50">
                      <div className="flex flex-col items-center">
                        <Sparkle weight="fill" className="h-5 w-5 mb-1" />
                        Author
                        <span className="text-xs font-normal text-parchment-300 mt-0.5">Most Popular</span>
                      </div>
                    </th>
                    <th className="text-center py-5 px-4 font-serif font-bold text-white text-lg">
                      <div className="flex flex-col items-center">
                        <Crown weight="duotone" className="h-5 w-5 mb-1 text-parchment-300" />
                        Professional
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: 'Books Published', free: '1', author: 'Unlimited', pro: 'Unlimited', highlight: true },
                    { feature: 'Royalty Rate', free: '70%', author: '75%', pro: '80%', highlight: false },
                    { feature: 'AI Credits', free: '10 total', author: '100/month', pro: 'Unlimited', highlight: true },
                    { feature: 'Review Queue', free: 'Standard', author: 'Priority', pro: 'Priority+', highlight: false },
                    { feature: 'Analytics', free: 'Basic', author: 'Advanced', pro: 'Full Suite', highlight: true },
                    { feature: 'Support', free: 'Email', author: 'Priority', pro: 'Dedicated', highlight: false },
                    { feature: 'Marketing Tools', free: false, author: true, pro: true, highlight: true },
                    { feature: 'Custom Author Page', free: false, author: true, pro: true, highlight: false },
                    { feature: 'Custom Distribution', free: false, author: false, pro: true, highlight: true },
                  ].map((row, index) => (
                    <tr 
                      key={row.feature} 
                      className={`border-b border-parchment-100 ${row.highlight ? 'bg-parchment-50/50' : 'bg-white'} hover:bg-parchment-100/50 transition-colors`}
                    >
                      <td className="py-4 px-6 text-ink-800 font-medium">{row.feature}</td>
                      <td className="py-4 px-4 text-center">
                        {typeof row.free === 'boolean' ? (
                          row.free ? (
                            <CheckCircle weight="fill" className="h-5 w-5 text-emerald-500 mx-auto" />
                          ) : (
                            <span className="text-ink-300 text-lg">—</span>
                          )
                        ) : (
                          <span className="text-ink-600">{row.free}</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center bg-accent-yellow/5">
                        {typeof row.author === 'boolean' ? (
                          row.author ? (
                            <CheckCircle weight="fill" className="h-5 w-5 text-accent-amber mx-auto" />
                          ) : (
                            <span className="text-ink-300 text-lg">—</span>
                          )
                        ) : (
                          <span className="text-ink-900 font-semibold">{row.author}</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center">
                        {typeof row.pro === 'boolean' ? (
                          row.pro ? (
                            <CheckCircle weight="fill" className="h-5 w-5 text-emerald-500 mx-auto" />
                          ) : (
                            <span className="text-ink-300 text-lg">—</span>
                          )
                        ) : (
                          <span className="text-ink-600">{row.pro}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-6">
              {['Free', 'Author', 'Professional'].map((planName) => (
                <div 
                  key={planName} 
                  className={`rounded-2xl border overflow-hidden ${planName === 'Author' ? 'border-accent-yellow shadow-glow-gold' : 'border-parchment-200 shadow-card'}`}
                >
                  <div className={`px-4 py-3 ${planName === 'Author' ? 'bg-gradient-to-r from-accent-yellow to-accent-amber text-ink-900' : 'bg-ink-900 text-white'}`}>
                    <h3 className="font-serif font-bold text-lg text-center">{planName}</h3>
                    {planName === 'Author' && <p className="text-xs text-center opacity-80">Most Popular</p>}
                  </div>
                  <div className="divide-y divide-parchment-100">
                    {[
                      { feature: 'Books Published', free: '1', author: 'Unlimited', pro: 'Unlimited' },
                      { feature: 'Royalty Rate', free: '70%', author: '75%', pro: '80%' },
                      { feature: 'AI Credits', free: '10 total', author: '100/month', pro: 'Unlimited' },
                      { feature: 'Review Queue', free: 'Standard', author: 'Priority', pro: 'Priority+' },
                      { feature: 'Analytics', free: 'Basic', author: 'Advanced', pro: 'Full Suite' },
                      { feature: 'Support', free: 'Email', author: 'Priority', pro: 'Dedicated' },
                      { feature: 'Marketing Tools', free: false, author: true, pro: true },
                      { feature: 'Custom Author Page', free: false, author: true, pro: true },
                      { feature: 'Custom Distribution', free: false, author: false, pro: true },
                    ].map((row) => {
                      const value = planName === 'Free' ? row.free : planName === 'Author' ? row.author : row.pro;
                      return (
                        <div key={row.feature} className="flex items-center justify-between px-4 py-3">
                          <span className="text-ink-700 text-sm">{row.feature}</span>
                          {typeof value === 'boolean' ? (
                            value ? (
                              <CheckCircle weight="fill" className="h-5 w-5 text-emerald-500" />
                            ) : (
                              <span className="text-ink-300">—</span>
                            )
                          ) : (
                            <span className={`text-sm font-medium ${planName === 'Author' ? 'text-accent-warm' : 'text-ink-900'}`}>{value}</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-ink-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-ink-600">Got questions? We've got answers.</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={faq.question}
                className="p-6 rounded-2xl bg-white border border-parchment-200 shadow-card animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-4">
                  <Question weight="fill" className="h-5 w-5 text-accent-yellow flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-ink-900 mb-2">{faq.question}</h3>
                    <p className="text-ink-600">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-ink-900 via-ink-800 to-ink-900">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Start Your Publishing Journey?
            </h2>
            <p className="text-xl text-parchment-200 mb-8">
              Join thousands of authors who trust Penstrike Inkworks for their publishing needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="accent" size="lg">
                Get Started Free
              </Button>
              <Link href="/contact">
                <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                  Talk to Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
