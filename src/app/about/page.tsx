import Link from 'next/link';
import { 
  BookOpen, 
  Heart, 
  Target, 
  Users, 
  Lightbulb,
  ArrowRight,
  CheckCircle
} from '@phosphor-icons/react/dist/ssr';

export const metadata = {
  title: 'About Us',
  description: 'Learn about Penstrike Inkworks - our mission to revolutionize publishing and empower authors worldwide.',
};

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-parchment-100 to-parchment-50">
        <div className="container-editorial">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-accent-warm font-medium mb-4">Our Story</p>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-ink-900 mb-6">
              Built by Authors, for Authors
            </h1>
            <p className="text-xl text-ink-600">
              We believe every story deserves to be told, and every author deserves 
              to be treated fairly. That is why we built Penstrike Inkworks.
            </p>
          </div>
        </div>
      </section>

      {/* Origin Story */}
      <section className="section bg-white">
        <div className="container-editorial">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-serif text-3xl font-bold text-ink-900 mb-6">
                The Problem We Set Out to Solve
              </h2>
              <div className="prose-editorial">
                <p>
                  Traditional publishing has long been a gatekeepers game. Authors spend 
                  years crafting their work, only to give up most of their earnings and 
                  creative control to publishers who prioritize profit over passion.
                </p>
                <p>
                  Self-publishing opened doors, but it brought its own challenges: 
                  complex tools, hidden fees, and the overwhelming burden of doing 
                  everything alone.
                </p>
                <p>
                  We asked ourselves: <strong>What if there was a better way?</strong>
                </p>
                <p>
                  A platform that combines the support of traditional publishing with 
                  the freedom of self-publishing. Where technology serves creativity, 
                  not the other way around. Where authors are partners, not products.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-parchment-100 flex items-center justify-center">
                <BookOpen weight="duotone" className="h-32 w-32 text-accent-yellow" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="section bg-parchment-50">
        <div className="container-editorial">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-ink-900 mb-6">
              Our Mission and Values
            </h2>
            <p className="text-ink-600 text-lg">
              Everything we build is guided by these core principles.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card p-8">
              <div className="w-12 h-12 rounded-lg bg-accent-yellow/20 flex items-center justify-center mb-4">
                <Heart weight="duotone" className="h-6 w-6 text-accent-warm" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-ink-900 mb-3">
                Author-First
              </h3>
              <p className="text-ink-600">Every decision we make starts with one question: How does this benefit authors? Your success is our success.</p>
            </div>

            <div className="card p-8">
              <div className="w-12 h-12 rounded-lg bg-accent-yellow/20 flex items-center justify-center mb-4">
                <Target weight="duotone" className="h-6 w-6 text-accent-warm" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-ink-900 mb-3">
                Transparency
              </h3>
              <p className="text-ink-600">No hidden fees, no confusing contracts, no surprises. We believe trust is built through clarity.</p>
            </div>

            <div className="card p-8">
              <div className="w-12 h-12 rounded-lg bg-accent-yellow/20 flex items-center justify-center mb-4">
                <Users weight="duotone" className="h-6 w-6 text-accent-warm" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-ink-900 mb-3">
                Community
              </h3>
              <p className="text-ink-600">Publishing can be lonely. We are building a community where authors support and learn from each other.</p>
            </div>

            <div className="card p-8">
              <div className="w-12 h-12 rounded-lg bg-accent-yellow/20 flex items-center justify-center mb-4">
                <Lightbulb weight="duotone" className="h-6 w-6 text-accent-warm" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-ink-900 mb-3">
                Innovation
              </h3>
              <p className="text-ink-600">We embrace technology that empowers creativity, from AI editing to sustainable printing.</p>
            </div>

            <div className="card p-8">
              <div className="w-12 h-12 rounded-lg bg-accent-yellow/20 flex items-center justify-center mb-4">
                <BookOpen weight="duotone" className="h-6 w-6 text-accent-warm" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-ink-900 mb-3">
                Quality
              </h3>
              <p className="text-ink-600">We never compromise on quality. Every book that carries the Penstrike name meets our high standards.</p>
            </div>

            <div className="card p-8">
              <div className="w-12 h-12 rounded-lg bg-accent-yellow/20 flex items-center justify-center mb-4">
                <CheckCircle weight="fill" className="h-6 w-6 text-accent-warm" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-ink-900 mb-3">
                Sustainability
              </h3>
              <p className="text-ink-600">We are committed to environmentally responsible publishing. Cotton paper, minimal waste, lasting books.</p>
            </div>
          </div>
        </div>
      </section>

      {/* The Penstrike Difference */}
      <section className="section bg-ink-900 text-white">
        <div className="container-editorial">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
              The Penstrike Difference
            </h2>
            <p className="text-parchment-300 text-lg">
              Here is how we compare to traditional publishing and other platforms.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-ink-700">
                  <th className="text-left py-4 px-4 font-serif text-lg"></th>
                  <th className="text-center py-4 px-4 font-serif text-lg text-accent-yellow">Penstrike</th>
                  <th className="text-center py-4 px-4 font-serif text-lg text-parchment-400">Traditional</th>
                  <th className="text-center py-4 px-4 font-serif text-lg text-parchment-400">Self-Pub</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-ink-800">
                  <td className="py-4 px-4 text-parchment-200">Author Royalties</td>
                  <td className="py-4 px-4 text-center text-accent-yellow font-medium">70%</td>
                  <td className="py-4 px-4 text-center text-parchment-500">10-15%</td>
                  <td className="py-4 px-4 text-center text-parchment-500">35-70%</td>
                </tr>
                <tr className="border-b border-ink-800">
                  <td className="py-4 px-4 text-parchment-200">Creative Control</td>
                  <td className="py-4 px-4 text-center text-accent-yellow font-medium">100%</td>
                  <td className="py-4 px-4 text-center text-parchment-500">Limited</td>
                  <td className="py-4 px-4 text-center text-parchment-500">100%</td>
                </tr>
                <tr className="border-b border-ink-800">
                  <td className="py-4 px-4 text-parchment-200">Professional Editing</td>
                  <td className="py-4 px-4 text-center text-accent-yellow font-medium">Included</td>
                  <td className="py-4 px-4 text-center text-parchment-500">Included</td>
                  <td className="py-4 px-4 text-center text-parchment-500">Extra Cost</td>
                </tr>
                <tr className="border-b border-ink-800">
                  <td className="py-4 px-4 text-parchment-200">AI Tools</td>
                  <td className="py-4 px-4 text-center text-accent-yellow font-medium">Included</td>
                  <td className="py-4 px-4 text-center text-parchment-500">No</td>
                  <td className="py-4 px-4 text-center text-parchment-500">No</td>
                </tr>
                <tr className="border-b border-ink-800">
                  <td className="py-4 px-4 text-parchment-200">Cover Design</td>
                  <td className="py-4 px-4 text-center text-accent-yellow font-medium">Included</td>
                  <td className="py-4 px-4 text-center text-parchment-500">Included</td>
                  <td className="py-4 px-4 text-center text-parchment-500">Extra Cost</td>
                </tr>
                <tr className="border-b border-ink-800">
                  <td className="py-4 px-4 text-parchment-200">Distribution</td>
                  <td className="py-4 px-4 text-center text-accent-yellow font-medium">Global</td>
                  <td className="py-4 px-4 text-center text-parchment-500">Global</td>
                  <td className="py-4 px-4 text-center text-parchment-500">Limited</td>
                </tr>
                <tr className="border-b border-ink-800">
                  <td className="py-4 px-4 text-parchment-200">Transparent Reporting</td>
                  <td className="py-4 px-4 text-center text-accent-yellow font-medium">Real-time</td>
                  <td className="py-4 px-4 text-center text-parchment-500">Quarterly</td>
                  <td className="py-4 px-4 text-center text-parchment-500">Varies</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="section bg-parchment-100">
        <div className="container-editorial">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-ink-900 mb-6">
              Our Vision for the Future
            </h2>
            <div className="prose-editorial text-left">
              <p>
                We envision a world where every author regardless of their background, 
                connections, or resources has the tools and support they need to bring 
                their stories to life.
              </p>
              <p>
                In the coming years, we are expanding our AI capabilities, building a 
                global distribution network, and creating new ways for readers to 
                discover and support independent authors.
              </p>
              <p>
                We are not just building a platform. We are building a movement. A 
                community of creators who refuse to accept the status quo. A new era 
                of publishing that puts authors first.
              </p>
            </div>

            <div className="mt-12">
              <Link href="/signup?role=author" className="btn-primary btn-lg">
                Join the Movement
                <ArrowRight weight="bold" className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
