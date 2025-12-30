import {
  MagnifyingGlass,
  CheckCircle,
  WarningCircle,
  TrendUp,
  BookOpen,
  Star,
  Sparkle,
  Clock,
  Shield,
  ArrowRight,
  Lightbulb,
  Target,
  ChartBar
} from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';
import { Button } from '@/components/ui';

const evaluationAreas = [
  {
    title: 'Story Structure',
    description: 'Plot pacing, arc development, and narrative flow',
    icon: BookOpen,
    gradient: 'from-blue-500 to-indigo-600',
  },
  {
    title: 'Character Development',
    description: 'Depth, motivation, and believability of characters',
    icon: Star,
    gradient: 'from-purple-500 to-pink-600',
  },
  {
    title: 'Writing Quality',
    description: 'Prose style, voice consistency, and readability',
    icon: Sparkle,
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    title: 'Market Potential',
    description: 'Genre fit, target audience appeal, and commercial viability',
    icon: TrendUp,
    gradient: 'from-orange-500 to-amber-600',
  },
];

const packages = [
  {
    name: 'Quick Assessment',
    price: 99,
    description: 'Perfect for early-stage manuscripts',
    features: [
      'First 10,000 words reviewed',
      '2-page written feedback',
      'Overall score & rating',
      'Key improvement areas',
      '5-day turnaround',
    ],
    popular: false,
  },
  {
    name: 'Full Evaluation',
    price: 299,
    description: 'Comprehensive manuscript analysis',
    features: [
      'Complete manuscript review',
      '8-10 page detailed report',
      'Chapter-by-chapter notes',
      'Market positioning advice',
      'Revision priority list',
      '10-day turnaround',
    ],
    popular: true,
  },
  {
    name: 'Premium Report',
    price: 499,
    description: 'In-depth evaluation with consultation',
    features: [
      'Everything in Full Evaluation',
      'Comparative market analysis',
      '30-minute video consultation',
      'Query letter feedback',
      'Synopsis review',
      'Follow-up Q&A session',
      '14-day turnaround',
    ],
    popular: false,
  },
];

const process = [
  {
    step: '01',
    title: 'Submit Your Manuscript',
    description: 'Upload your manuscript and choose your evaluation package',
  },
  {
    step: '02',
    title: 'Expert Review',
    description: 'Our professional editors analyze your work thoroughly',
  },
  {
    step: '03',
    title: 'Detailed Report',
    description: 'Receive comprehensive feedback and actionable insights',
  },
  {
    step: '04',
    title: 'Improve & Publish',
    description: 'Apply the feedback to strengthen your manuscript',
  },
];

export default function EvaluationServicePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-ink-900 via-ink-800 to-ink-900" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-accent-yellow/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white/90 text-sm mb-6 animate-fade-up">
              <MagnifyingGlass className="h-4 w-4" weight="duotone" />
              Professional Service
            </div>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 animate-fade-up" style={{ animationDelay: '100ms' }}>
              Manuscript <span className="text-accent-yellow">Evaluation</span>
            </h1>
            <p className="text-xl text-parchment-200 mb-8 animate-fade-up" style={{ animationDelay: '200ms' }}>
              Get expert feedback from industry professionals before you publish. Understand your manuscript's strengths and discover areas for improvement.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up" style={{ animationDelay: '300ms' }}>
              <Button variant="accent" size="lg" className="gap-2">
                Get Your Evaluation
                <ArrowRight className="h-5 w-5" weight="bold" />
              </Button>
              <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                View Sample Report
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* What We Evaluate */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-ink-900 mb-4">
              What We Evaluate
            </h2>
            <p className="text-ink-600 max-w-2xl mx-auto">
              Our comprehensive evaluation covers every aspect of your manuscript
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {evaluationAreas.map((area, index) => (
              <div
                key={area.title}
                className="group p-6 rounded-2xl bg-white border border-parchment-200 shadow-card hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${area.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <area.icon className="h-7 w-7 text-white" weight="duotone" />
                </div>
                <h3 className="font-serif text-lg font-bold text-ink-900 mb-2">{area.title}</h3>
                <p className="text-ink-600 text-sm">{area.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-ink-900 mb-6">
                Why Get Your Manuscript Evaluated?
              </h2>
              <div className="space-y-6">
                {[
                  {
                    icon: Lightbulb,
                    title: 'Identify Blind Spots',
                    description: 'Fresh eyes catch issues you might have missed after countless revisions',
                  },
                  {
                    icon: Target,
                    title: 'Focus Your Revisions',
                    description: 'Know exactly where to invest your editing time for maximum impact',
                  },
                  {
                    icon: ChartBar,
                    title: 'Understand Market Fit',
                    description: 'Learn how your book positions against current market trends',
                  },
                  {
                    icon: Shield,
                    title: 'Publish with Confidence',
                    description: 'Launch knowing your manuscript meets professional standards',
                  },
                ].map((benefit, index) => (
                  <div key={benefit.title} className="flex gap-4 animate-fade-up" style={{ animationDelay: `${index * 100}ms` }}>
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="h-6 w-6 text-white" weight="duotone" />
                    </div>
                    <div>
                      <h3 className="font-bold text-ink-900 mb-1">{benefit.title}</h3>
                      <p className="text-ink-600 text-sm">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="rounded-2xl bg-gradient-to-br from-parchment-100 to-parchment-200 p-8 animate-fade-up">
                <div className="space-y-4">
                  {[
                    { label: 'Overall Score', value: '8.5/10', color: 'emerald' },
                    { label: 'Story Structure', value: '9/10', color: 'blue' },
                    { label: 'Character Development', value: '8/10', color: 'purple' },
                    { label: 'Writing Quality', value: '8.5/10', color: 'orange' },
                    { label: 'Market Potential', value: '8/10', color: 'pink' },
                  ].map((item, index) => (
                    <div key={item.label} className="flex items-center justify-between p-4 rounded-xl bg-white shadow-sm animate-fade-up" style={{ animationDelay: `${index * 100}ms` }}>
                      <span className="text-ink-700">{item.label}</span>
                      <span className={`font-bold text-${item.color}-600`}>{item.value}</span>
                    </div>
                  ))}
                </div>
                <p className="text-center text-sm text-ink-500 mt-4">Sample evaluation scores</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-ink-900 mb-4">How It Works</h2>
            <p className="text-ink-600">Simple steps to professional feedback</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {process.map((step, index) => (
              <div key={step.step} className="text-center animate-fade-up" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-ink-900 to-ink-700 flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                  {step.step}
                </div>
                <h3 className="font-serif text-lg font-bold text-ink-900 mb-2">{step.title}</h3>
                <p className="text-ink-600 text-sm">{step.description}</p>
                {index < process.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full">
                    <ArrowRight className="h-6 w-6 text-ink-300 mx-auto" weight="bold" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-ink-900 mb-4">
              Evaluation Packages
            </h2>
            <p className="text-ink-600 max-w-2xl mx-auto">
              Choose the level of feedback that fits your needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {packages.map((pkg, index) => (
              <div
                key={pkg.name}
                className={`relative rounded-2xl overflow-hidden animate-fade-up ${
                  pkg.popular
                    ? 'bg-gradient-to-br from-ink-900 to-ink-800 text-white shadow-elegant scale-105'
                    : 'bg-white border border-parchment-200 shadow-card'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {pkg.popular && (
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 rounded-full bg-accent-yellow text-ink-900 text-xs font-bold">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="p-8">
                  <h3 className={`font-serif text-xl font-bold mb-2 ${pkg.popular ? 'text-white' : 'text-ink-900'}`}>
                    {pkg.name}
                  </h3>
                  <p className={`text-sm mb-6 ${pkg.popular ? 'text-parchment-200' : 'text-ink-600'}`}>
                    {pkg.description}
                  </p>
                  <div className="mb-6">
                    <span className={`font-serif text-4xl font-bold ${pkg.popular ? 'text-white' : 'text-ink-900'}`}>
                      ${pkg.price}
                    </span>
                    <span className={pkg.popular ? 'text-parchment-300' : 'text-ink-500'}> / manuscript</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {pkg.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <CheckCircle className={`h-5 w-5 flex-shrink-0 ${pkg.popular ? 'text-accent-yellow' : 'text-emerald-500'}`} weight="fill" />
                        <span className={pkg.popular ? 'text-parchment-100' : 'text-ink-600'}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant={pkg.popular ? 'accent' : 'outline'}
                    className="w-full"
                  >
                    Select Package
                  </Button>
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
              Ready to Elevate Your Manuscript?
            </h2>
            <p className="text-xl text-parchment-200 mb-8">
              Get professional feedback and take your writing to the next level
            </p>
            <Button variant="accent" size="lg">
              Start Your Evaluation
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
