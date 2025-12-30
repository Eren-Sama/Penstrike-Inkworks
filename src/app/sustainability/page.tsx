import {
  Leaf,
  Tree as TreePine,
  Recycle,
  Globe,
  Lightning as Zap,
  Heart,
  Target,
  Trophy as Award,
  CheckCircle,
  ArrowRight,
  TrendUp as TrendingUp,
  BookOpen
} from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';
import { Button } from '@/components/ui';

const initiatives = [
  {
    icon: TreePine,
    title: 'One Book, One Tree',
    description: 'For every book sold through our platform, we plant a tree in partnership with global reforestation organizations.',
    stat: '125,000+',
    statLabel: 'Trees planted',
    gradient: 'from-emerald-500 to-green-600',
  },
  {
    icon: Recycle,
    title: 'Sustainable Printing',
    description: 'Our print-on-demand partners use recycled paper, soy-based inks, and carbon-neutral shipping options.',
    stat: '85%',
    statLabel: 'Recycled materials',
    gradient: 'from-teal-500 to-cyan-600',
  },
  {
    icon: Zap,
    title: 'Green Data Centers',
    description: 'Our servers run on 100% renewable energy, and we continuously optimize for energy efficiency.',
    stat: '100%',
    statLabel: 'Renewable energy',
    gradient: 'from-amber-500 to-yellow-600',
  },
  {
    icon: Globe,
    title: 'Carbon Offset',
    description: 'We offset our entire carbon footprint and invest in verified environmental projects worldwide.',
    stat: 'Net Zero',
    statLabel: 'Carbon emissions',
    gradient: 'from-blue-500 to-indigo-600',
  },
];

const goals = [
  {
    year: '2024',
    title: 'Achieved Carbon Neutrality',
    description: 'Offset 100% of our operational carbon emissions through verified projects.',
    completed: true,
  },
  {
    year: '2025',
    title: 'Sustainable Packaging',
    description: 'Transition to 100% plastic-free, biodegradable packaging for all shipments.',
    completed: false,
  },
  {
    year: '2026',
    title: '1 Million Trees',
    description: 'Reach our goal of planting 1 million trees through book sales.',
    completed: false,
  },
  {
    year: '2027',
    title: 'Zero Waste Operations',
    description: 'Achieve zero waste across all direct operations and office locations.',
    completed: false,
  },
];

const partners = [
  { name: 'One Tree Planted', focus: 'Reforestation' },
  { name: 'Climate Partner', focus: 'Carbon Offsetting' },
  { name: 'FSC', focus: 'Sustainable Forestry' },
  { name: 'Green Press Initiative', focus: 'Publishing Standards' },
];

export default function SustainabilityPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900" />
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-400/30 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-400/30 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-500/20 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white/90 text-sm mb-6 animate-fade-up">
              <Leaf className="h-4 w-4" />
              Our Commitment
            </div>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 animate-fade-up" style={{ animationDelay: '100ms' }}>
              Publishing with <span className="text-emerald-300">Purpose</span>
            </h1>
            <p className="text-xl text-emerald-100 mb-8 animate-fade-up" style={{ animationDelay: '200ms' }}>
              We believe great stories and environmental responsibility go hand in hand. 
              Discover how we're building a sustainable future for publishing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up" style={{ animationDelay: '300ms' }}>
              <Button variant="accent" size="lg" className="gap-2">
                Our Impact Report
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                Join Our Mission
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-8 bg-white border-b border-parchment-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '125K+', label: 'Trees Planted' },
              { value: '100%', label: 'Renewable Energy' },
              { value: 'Net Zero', label: 'Carbon Status' },
              { value: '85%', label: 'Recycled Materials' },
            ].map((stat, index) => (
              <div key={stat.label} className="animate-fade-up" style={{ animationDelay: `${index * 100}ms` }}>
                <p className="font-serif text-3xl font-bold text-emerald-600">{stat.value}</p>
                <p className="text-ink-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Initiatives */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-ink-900 mb-4">
              Our Green Initiatives
            </h2>
            <p className="text-ink-600 max-w-2xl mx-auto">
              Every decision we make considers its environmental impact. Here's how we're making a difference.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {initiatives.map((initiative, index) => (
              <div
                key={initiative.title}
                className="group rounded-2xl bg-white border border-parchment-200 shadow-card overflow-hidden hover:shadow-elegant transition-all duration-300 animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`p-6 bg-gradient-to-br ${initiative.gradient}`}>
                  <div className="flex items-center justify-between">
                    <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <initiative.icon className="h-7 w-7 text-white" />
                    </div>
                    <div className="text-right">
                      <p className="font-serif text-3xl font-bold text-white">{initiative.stat}</p>
                      <p className="text-white/80 text-sm">{initiative.statLabel}</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-xl font-bold text-ink-900 mb-2">{initiative.title}</h3>
                  <p className="text-ink-600">{initiative.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Goals */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-ink-900 mb-4">
              Our Sustainability Roadmap
            </h2>
            <p className="text-ink-600 max-w-2xl mx-auto">
              We've set ambitious goals to continuously improve our environmental impact
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            {goals.map((goal, index) => (
              <div
                key={goal.year}
                className="relative flex gap-6 pb-12 last:pb-0 animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Timeline line */}
                {index < goals.length - 1 && (
                  <div className="absolute left-[27px] top-14 bottom-0 w-0.5 bg-parchment-200" />
                )}
                
                {/* Year badge */}
                <div className={`flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center font-bold ${
                  goal.completed 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-parchment-100 text-ink-600 border-2 border-parchment-200'
                }`}>
                  {goal.completed ? <CheckCircle weight="fill" className="h-6 w-6" /> : goal.year.slice(2)}
                </div>

                {/* Content */}
                <div className={`flex-1 p-6 rounded-2xl ${
                  goal.completed 
                    ? 'bg-emerald-50 border border-emerald-200' 
                    : 'bg-parchment-50 border border-parchment-200'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-sm font-medium ${goal.completed ? 'text-emerald-600' : 'text-ink-500'}`}>
                      {goal.year}
                    </span>
                    {goal.completed && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-xs">
                        Achieved
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif text-lg font-bold text-ink-900 mb-1">{goal.title}</h3>
                  <p className="text-ink-600">{goal.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How You Help */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div className="animate-fade-up">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-ink-900 mb-6">
                Every Book Makes a Difference
              </h2>
              <p className="text-ink-600 mb-8">
                When you publish or purchase through Penstrike Inkworks, you're actively contributing to a greener future. Here's how your participation helps:
              </p>
              <div className="space-y-4">
                {[
                  { icon: TreePine, text: 'A tree is planted for every book sold' },
                  { icon: Recycle, text: 'Your books are printed on recycled paper' },
                  { icon: Zap, text: 'Digital delivery uses renewable energy' },
                  { icon: Heart, text: 'Part of proceeds go to environmental causes' },
                ].map((item, index) => (
                  <div key={item.text} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <span className="text-ink-700">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative animate-fade-up" style={{ animationDelay: '200ms' }}>
              <div className="rounded-2xl bg-white border border-parchment-200 shadow-elegant p-8">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-ink-900">Your Impact</h3>
                  <p className="text-ink-600">As a Penstrike author or reader</p>
                </div>
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                    <div className="flex items-center justify-between">
                      <span className="text-ink-700">Trees you've helped plant</span>
                      <span className="font-bold text-emerald-600">12</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-teal-50 border border-teal-200">
                    <div className="flex items-center justify-between">
                      <span className="text-ink-700">CO₂ offset (kg)</span>
                      <span className="font-bold text-teal-600">48</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                    <div className="flex items-center justify-between">
                      <span className="text-ink-700">Recycled paper saved (pages)</span>
                      <span className="font-bold text-blue-600">2,400</span>
                    </div>
                  </div>
                </div>
                <p className="text-center text-sm text-ink-500 mt-4">
                  Sign in to see your personal impact
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-ink-900 mb-4">
              Our Partners in Sustainability
            </h2>
            <p className="text-ink-600">Working with industry leaders to maximize our positive impact</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {partners.map((partner, index) => (
              <div
                key={partner.name}
                className="p-6 rounded-2xl bg-parchment-50 border border-parchment-200 text-center animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                  <Award weight="duotone" className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="font-bold text-ink-900 mb-1">{partner.name}</h3>
                <p className="text-sm text-ink-500">{partner.focus}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Leaf className="h-12 w-12 text-emerald-300 mx-auto mb-6" />
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-6">
              Join Us in Making Publishing Sustainable
            </h2>
            <p className="text-xl text-emerald-100 mb-8">
              Every story shared through Penstrike Inkworks helps build a greener future for generations of readers to come.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button variant="accent" size="lg">
                  Start Publishing Green
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                  Learn More About Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
