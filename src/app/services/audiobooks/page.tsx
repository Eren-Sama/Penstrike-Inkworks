import Link from 'next/link';
import { 
  Microphone, 
  ArrowRight, 
  CheckCircle, 
  Sparkle,
  Play,
  SpeakerHigh,
  Gear,
  Download,
  Headphones,
  Sliders
} from '@phosphor-icons/react/dist/ssr';

export const metadata = {
  title: 'AI Audiobook Creation - Penstrike Inkworks',
  description: 'Transform your book into an audiobook with natural AI narration.',
};

export default function AudiobooksPage() {
  const features = [
    {
      icon: SpeakerHigh,
      title: '50+ Voice Options',
      description: 'Choose from a diverse library of natural-sounding AI voices.',
    },
    {
      icon: Sliders,
      title: 'Emotional Control',
      description: 'Adjust tone, pacing, and emotion for each chapter.',
    },
    {
      icon: Headphones,
      title: 'Preview System',
      description: 'Listen to samples before committing to full production.',
    },
    {
      icon: Download,
      title: 'Instant Delivery',
      description: 'Get your audiobook files within hours, not weeks.',
    },
  ];

  const packages = [
    {
      name: 'Starter',
      price: '$99',
      pricePerHour: '$2.50/hour',
      description: 'Perfect for short books',
      features: [
        'Up to 40,000 words',
        '5 voice options',
        'Basic emotion control',
        'MP3 format',
        '2 revision rounds',
      ],
      popular: false,
    },
    {
      name: 'Professional',
      price: '$199',
      pricePerHour: '$2.00/hour',
      description: 'For full-length novels',
      features: [
        'Up to 100,000 words',
        '25 voice options',
        'Advanced emotion control',
        'MP3 & M4B formats',
        'Unlimited revisions',
        'Chapter markers',
      ],
      popular: true,
    },
    {
      name: 'Premium',
      price: '$399',
      pricePerHour: '$1.50/hour',
      description: 'For series & complex works',
      features: [
        'Unlimited words',
        '50+ voice options',
        'Full emotional range',
        'All audio formats',
        'Unlimited revisions',
        'Multiple narrators',
        'Sound effects option',
        'Priority support',
      ],
      popular: false,
    },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-gradient-to-b from-orange-50 via-parchment-50 to-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-orange-200/30 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-amber-200/20 rounded-full blur-3xl animate-float animation-delay-500" />
        </div>
        
        <div className="container-editorial relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-700 text-sm font-semibold mb-6 animate-fade-down">
              <Microphone className="h-4 w-4" weight="duotone" />
              AI Audiobook Creation
            </div>
            
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-ink-900 mb-6 animate-fade-up">
              Your Book,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-600">Narrated Beautifully</span>
            </h1>
            
            <p className="text-ink-600 text-xl mb-10 leading-relaxed animate-fade-up animation-delay-100">
              Transform your manuscript into a professionally narrated audiobook 
              with our AI-powered narration technology. Natural voices, emotional depth.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 animate-fade-up animation-delay-200">
              <Link href="/signup?role=author" className="btn-primary btn-lg group bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700">
                Create Audiobook
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" weight="bold" />
              </Link>
              <button className="btn-glass btn-lg">
                <Play className="h-5 w-5" weight="fill" />
                Listen to Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="container-editorial">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="p-6 rounded-2xl bg-parchment-50 border border-parchment-200 hover:shadow-elegant hover:-translate-y-1 transition-all duration-500 animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-white" weight="duotone" />
                </div>
                <h3 className="font-serif text-lg font-bold text-ink-900 mb-2">{feature.title}</h3>
                <p className="text-ink-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-gradient-to-b from-parchment-50 to-white">
        <div className="container-editorial">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-ink-900 mb-4">
              How It Works
            </h2>
            <p className="text-ink-600 text-lg">
              From manuscript to audiobook in three simple steps.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: '01', title: 'Upload', desc: 'Upload your manuscript in any format.' },
              { step: '02', title: 'Customize', desc: 'Select voice, adjust emotion, and preview.' },
              { step: '03', title: 'Download', desc: 'Get your audiobook files instantly.' },
            ].map((item, index) => (
              <div key={index} className="text-center animate-fade-up" style={{ animationDelay: `${index * 150}ms` }}>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-2xl font-bold text-white">
                  {item.step}
                </div>
                <h3 className="font-serif text-xl font-bold text-ink-900 mb-2">{item.title}</h3>
                <p className="text-ink-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 bg-white">
        <div className="container-editorial">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-ink-900 mb-4">
              Simple Pricing
            </h2>
            <p className="text-ink-600 text-lg">
              Affordable audiobook creation for every author.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {packages.map((pkg, index) => (
              <div 
                key={index}
                className={`relative p-8 rounded-3xl border-2 transition-all duration-500 hover:-translate-y-2 animate-fade-up ${
                  pkg.popular 
                    ? 'bg-white border-orange-500 shadow-elegant-lg' 
                    : 'bg-white border-parchment-200 hover:border-orange-300'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-orange-500 to-amber-600 text-white text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="font-serif text-2xl font-bold text-ink-900 mb-2">{pkg.name}</h3>
                  <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-600 mb-1">
                    {pkg.price}
                  </p>
                  <p className="text-ink-500 text-sm">{pkg.pricePerHour}</p>
                  <p className="text-ink-600 text-sm mt-2">{pkg.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-ink-700">
                      <CheckCircle className="h-5 w-5 text-orange-500 flex-shrink-0" weight="fill" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link 
                  href="/signup?role=author" 
                  className={`block w-full py-3 rounded-xl font-semibold text-center transition-all duration-300 ${
                    pkg.popular
                      ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white hover:from-orange-600 hover:to-amber-700'
                      : 'bg-parchment-100 text-ink-900 hover:bg-parchment-200'
                  }`}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-amber-600 text-white">
        <div className="container-editorial text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            Ready to Create Your Audiobook?
          </h2>
          <p className="text-orange-100 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of authors who have reached new audiences with AI audiobooks.
          </p>
          <Link href="/signup?role=author" className="btn-lg bg-white text-orange-600 hover:bg-orange-50 inline-flex items-center gap-2 font-semibold">
            Start Creating
            <ArrowRight className="h-5 w-5" weight="bold" />
          </Link>
        </div>
      </section>
    </>
  );
}
