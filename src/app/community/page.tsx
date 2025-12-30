import {
  Users,
  ChatCircle as MessageSquare,
  Heart,
  Trophy as Award,
  BookOpen,
  Star,
  ArrowRight,
  Plus
} from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';
import { Button } from '@/components/ui';
import {
  getCommunityStats,
  getCommunityCategories,
  getCommunityFeaturedMembers,
  getCommunitySuccessStories,
} from '@/lib/data';

// Icon mapping for dynamic rendering
const iconMap: Record<string, typeof Users> = {
  Users,
  MessageSquare,
  BookOpen,
  Award,
};

export default async function CommunityPage() {
  // Fetch data from data layer (mode-aware)
  const [stats, categories, featuredMembers, successStories] = await Promise.all([
    getCommunityStats(),
    getCommunityCategories(),
    getCommunityFeaturedMembers(),
    getCommunitySuccessStories(),
  ]);

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
              <Users weight="duotone" className="h-4 w-4" />
              Author Community
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-6 animate-fade-up" style={{ animationDelay: '100ms' }}>
              Connect. Create. Succeed.
            </h1>
            <p className="text-xl text-parchment-200 mb-8 animate-fade-up" style={{ animationDelay: '200ms' }}>
              Join thousands of authors sharing knowledge, supporting each other, and celebrating success together
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up" style={{ animationDelay: '300ms' }}>
              <Link href="/community/create">
                <Button variant="accent" size="lg" className="gap-2">
                  <Plus weight="bold" className="h-5 w-5" />
                  Create a Community
                </Button>
              </Link>
              <a href="#categories">
                <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                  Browse Discussions
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 -mt-8 relative z-20">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {stats.map((stat, index) => {
              const IconComponent = iconMap[stat.icon] || Users;
              return (
                <div
                  key={stat.label}
                  className="p-6 rounded-2xl bg-white border border-parchment-200 shadow-card text-center animate-fade-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-yellow to-accent-amber flex items-center justify-center mx-auto mb-3">
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <p className="font-serif text-2xl font-bold text-ink-900">{stat.value}</p>
                  <p className="text-ink-600 text-sm">{stat.label}</p>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-ink-900 mb-4">Discussion Categories</h2>
            <p className="text-ink-600 max-w-2xl mx-auto">
              Find your niche and connect with like-minded authors
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {categories.map((category, index) => (
              <Link
                key={category.name}
                href={`/community/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="group p-6 rounded-2xl bg-white border border-parchment-200 shadow-card hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.gradient} flex items-center justify-center mb-4`}>
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-serif text-lg font-bold text-ink-900 mb-2 group-hover:text-ink-700 transition-colors">
                  {category.name}
                </h3>
                <p className="text-ink-600 text-sm mb-4">{category.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-ink-500">{category.posts.toLocaleString()} posts</span>
                  <ArrowRight className="h-4 w-4 text-ink-400 group-hover:text-ink-600 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Members */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-2xl font-bold text-ink-900 mb-6 text-center">Featured Authors</h2>
            {featuredMembers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-parchment-300 mx-auto mb-3" />
                <p className="text-ink-500">No featured authors yet</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {featuredMembers.map((member) => (
                  <div
                    key={member.name}
                    className="flex items-center gap-4 p-4 rounded-xl bg-parchment-50 border border-parchment-200"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-yellow to-accent-amber flex items-center justify-center text-white font-bold">
                      {member.avatar}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-ink-900">{member.name}</p>
                      <p className="text-sm text-ink-500">{member.genre} • {member.books} books</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      Follow
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <div className="text-center mt-6">
              <Link href="/authors">
                <Button variant="outline">
                  View All Authors
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-ink-900 mb-4">Success Stories</h2>
            <p className="text-ink-600">Inspiring journeys from our community members</p>
          </div>

          {successStories.length === 0 ? (
            <div className="text-center py-8 max-w-5xl mx-auto">
              <Star className="h-12 w-12 text-parchment-300 mx-auto mb-3" />
              <p className="text-ink-500">Success stories coming soon</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {successStories.map((story, index) => (
              <div
                key={story.author}
                className="p-6 rounded-2xl bg-white border border-parchment-200 shadow-card animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} weight="fill" className="h-4 w-4 text-accent-yellow" />
                  ))}
                </div>
                <p className="text-ink-700 mb-4 italic">&quot;{story.quote}&quot;</p>
                <div className="border-t border-parchment-100 pt-4">
                  <p className="font-medium text-ink-900">{story.author}</p>
                  <p className="text-sm text-emerald-600">{story.achievement}</p>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-ink-900 via-ink-800 to-ink-900">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Join Our Community?
            </h2>
            <p className="text-xl text-parchment-200 mb-8">
              Connect with fellow authors, learn new skills, and accelerate your publishing journey
            </p>
            <Button variant="accent" size="lg">
              Get Started Today
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
