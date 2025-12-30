import Link from 'next/link';
import { 
  Palette, 
  ArrowRight, 
  CheckCircle, 
  Sparkle,
  MagicWand,
  Image,
  Stack,
  Download,
  Star
} from '@phosphor-icons/react/dist/ssr';

export const metadata = {
  title: 'Cover Design - Penstrike Inkworks',
  description: 'Professional book cover design services with AI-powered generation and human expertise.',
};

export default function CoverDesignPage() {
  const features = [
    {
      icon: MagicWand,
      title: 'AI Cover Generation',
      description: 'Describe your vision and our AI creates stunning unique designs in seconds.',
    },
    {
      icon: Image,
      title: 'Professional Designers',
      description: 'Work with experienced designers who understand book marketing.',
    },
    {
      icon: Stack,
      title: 'Multiple Concepts',
      description: 'Receive 3-5 unique concepts to choose from and refine.',
    },
    {
      icon: Download,
      title: 'All Formats Included',
      description: 'Get print-ready, eBook, and social media versions.',
    },
  ];

  const packages = [
    {
      name: 'AI Basic',
      price: '$49',
      description: 'AI-generated cover with basic customization',
      features: [
        '3 AI-generated concepts',
        '2 revision rounds',
        'eBook cover format',
        'Print cover format',
        '48-hour delivery',
      ],
      popular: false,
    },
    {
      name: 'Professional',
      price: '$299',
      description: 'Human designer with AI assistance',
      features: [
        '5 unique concepts',
        'Unlimited revisions',
        'All digital formats',
        'Print-ready files',
        'Social media kit',
        'Dedicated designer',
      ],
      popular: true,
    },
    {
      name: 'Premium',
      price: '$599',
      description: 'Full custom illustration & design',
      features: [
        'Custom illustration',
        '10+ concepts',
        'Unlimited revisions',
        'Complete brand package',
        'Marketing materials',
        'Rush delivery option',
        'Source files included',
      ],
      popular: false,
    },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-gradient-to-b from-pink-50 via-parchment-50 to-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-pink-200/30 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-rose-200/20 rounded-full blur-3xl animate-float animation-delay-500" />
        </div>
        
        <div className="container-editorial relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-100 text-pink-700 text-sm font-semibold mb-6 animate-fade-down">
              <Palette className="h-4 w-4" weight="duotone" />
              Cover Design Services
            </div>
            
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-ink-900 mb-6 animate-fade-up">
              Covers That{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-600">Sell Books</span>
            </h1>
            
            <p className="text-ink-600 text-xl mb-10 leading-relaxed animate-fade-up animation-delay-100">
              First impressions matter. Get professional cover designs that capture your story 
              and attract readers with our AI-powered and human design services.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 animate-fade-up animation-delay-200">
              <Link href="/signup?role=author" className="btn-primary btn-lg group bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700">
                Start Designing
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" weight="bold" />
              </Link>
              <Link href="/services" className="btn-glass btn-lg">
                View All Services
              </Link>
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
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-white" weight="duotone" />
                </div>
                <h3 className="font-serif text-lg font-bold text-ink-900 mb-2">{feature.title}</h3>
                <p className="text-ink-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 bg-gradient-to-b from-parchment-50 to-white">
        <div className="container-editorial">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-ink-900 mb-4">
              Choose Your Package
            </h2>
            <p className="text-ink-600 text-lg">
              Flexible options to fit your budget and needs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {packages.map((pkg, index) => (
              <div 
                key={index}
                className={`relative p-8 rounded-3xl border-2 transition-all duration-500 hover:-translate-y-2 animate-fade-up ${
                  pkg.popular 
                    ? 'bg-white border-pink-500 shadow-elegant-lg' 
                    : 'bg-white border-parchment-200 hover:border-pink-300'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 text-white text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="font-serif text-2xl font-bold text-ink-900 mb-2">{pkg.name}</h3>
                  <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-600 mb-2">
                    {pkg.price}
                  </p>
                  <p className="text-ink-600 text-sm">{pkg.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-ink-700">
                      <CheckCircle className="h-5 w-5 text-pink-500 flex-shrink-0" weight="fill" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link 
                  href="/signup?role=author" 
                  className={`block w-full py-3 rounded-xl font-semibold text-center transition-all duration-300 ${
                    pkg.popular
                      ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white hover:from-pink-600 hover:to-rose-700'
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
      <section className="py-20 bg-gradient-to-r from-pink-500 to-rose-600 text-white">
        <div className="container-editorial text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            Ready to Design Your Cover?
          </h2>
          <p className="text-pink-100 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of authors who have created stunning covers with Penstrike.
          </p>
          <Link href="/signup?role=author" className="btn-lg bg-white text-pink-600 hover:bg-pink-50 inline-flex items-center gap-2 font-semibold">
            Start Now
            <ArrowRight className="h-5 w-5" weight="bold" />
          </Link>
        </div>
      </section>
    </>
  );
}
