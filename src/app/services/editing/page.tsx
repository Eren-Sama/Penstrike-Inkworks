import Link from 'next/link';
import { 
  PencilLine, 
  ArrowRight, 
  CheckCircle, 
  Sparkle,
  FileText,
  Users,
  Lightning,
  ChatCircle
} from '@phosphor-icons/react/dist/ssr';

export const metadata = {
  title: 'Editing & Proofreading - Penstrike Inkworks',
  description: 'Professional editing services combining human expertise with AI precision for flawless manuscripts.',
};

export default function EditingPage() {
  const editingTypes = [
    {
      icon: FileText,
      title: 'Developmental Editing',
      description: 'Big-picture feedback on plot, pacing, characters, and structure.',
      price: 'From $0.03/word',
    },
    {
      icon: PencilLine,
      title: 'Line Editing',
      description: 'Sentence-level improvements for clarity, flow, and style.',
      price: 'From $0.02/word',
    },
    {
      icon: ChatCircle,
      title: 'Copyediting',
      description: 'Grammar, spelling, punctuation, and consistency fixes.',
      price: 'From $0.015/word',
    },
    {
      icon: Lightning,
      title: 'Proofreading',
      description: 'Final polish to catch any remaining errors before publication.',
      price: 'From $0.01/word',
    },
  ];

  const features = [
    'AI-powered initial analysis',
    'Human editor review',
    'Track changes & comments',
    'Style guide adherence',
    'Multiple revision rounds',
    'Direct communication with editor',
    'Quick turnaround options',
    'Satisfaction guaranteed',
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-gradient-to-b from-blue-50 via-parchment-50 to-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-200/30 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-200/20 rounded-full blur-3xl animate-float animation-delay-500" />
        </div>
        
        <div className="container-editorial relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-6 animate-fade-down">
              <PencilLine className="h-4 w-4" weight="duotone" />
              Editing Services
            </div>
            
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-ink-900 mb-6 animate-fade-up">
              Perfect Your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600">Manuscript</span>
            </h1>
            
            <p className="text-ink-600 text-xl mb-10 leading-relaxed animate-fade-up animation-delay-100">
              Combine the precision of AI with the insight of human editors 
              to polish your manuscript to perfection.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 animate-fade-up animation-delay-200">
              <Link href="/signup?role=author" className="btn-primary btn-lg group bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
                Get a Quote
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" weight="bold" />
              </Link>
              <Link href="/services" className="btn-glass btn-lg">
                View All Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Editing Types */}
      <section className="py-20 bg-white">
        <div className="container-editorial">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-ink-900 mb-4">
              Types of Editing
            </h2>
            <p className="text-ink-600 text-lg">
              Choose the level of editing that fits your manuscript's needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {editingTypes.map((type, index) => (
              <div 
                key={index}
                className="p-8 rounded-2xl bg-parchment-50 border border-parchment-200 hover:shadow-elegant hover:-translate-y-1 transition-all duration-500 animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <type.icon className="h-6 w-6 text-white" weight="duotone" />
                  </div>
                  <span className="text-blue-600 font-semibold">{type.price}</span>
                </div>
                <h3 className="font-serif text-xl font-bold text-ink-900 mb-2">{type.title}</h3>
                <p className="text-ink-600">{type.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-gradient-to-b from-parchment-50 to-white">
        <div className="container-editorial">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-6">
                <Sparkle className="h-4 w-4" weight="duotone" />
                AI + Human Expertise
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-ink-900 mb-6">
                The Best of Both Worlds
              </h2>
              <p className="text-ink-600 text-lg mb-8 leading-relaxed">
                Our editing process combines AI-powered analysis for consistency and grammar 
                with experienced human editors who understand storytelling and style.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-ink-700">
                    <CheckCircle className="h-5 w-5 text-blue-500 flex-shrink-0" weight="fill" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-blue-100 to-indigo-50 p-10 flex items-center justify-center shadow-elegant-lg">
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg animate-gentle-pulse">
                    <PencilLine className="h-16 w-16 text-white" weight="duotone" />
                  </div>
                  <p className="font-serif text-2xl text-ink-700 mb-2">Expert Editing</p>
                  <p className="text-ink-500">Precision meets creativity</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
        <div className="container-editorial text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            Ready to Polish Your Manuscript?
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Upload your manuscript and get a free sample edit to see the difference.
          </p>
          <Link href="/signup?role=author" className="btn-lg bg-white text-blue-600 hover:bg-blue-50 inline-flex items-center gap-2 font-semibold">
            Get Started
            <ArrowRight className="h-5 w-5" weight="bold" />
          </Link>
        </div>
      </section>
    </>
  );
}
