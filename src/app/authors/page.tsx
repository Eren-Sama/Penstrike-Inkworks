import {
  BookOpen,
  Star,
  Trophy as Award,
  TrendUp as TrendingUp,
  MagnifyingGlass as Search,
  CaretRight as ChevronRight,
} from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { getFeaturedAuthors, type FeaturedAuthor } from '@/lib/data';
import { AuthorAvatarCard } from '@/components/authors/AuthorAvatar';
import { VerifiedBadge } from '@/components/authors/VerifiedBadge';

const genres = ['All', 'Fantasy', 'Romance', 'Thriller', 'Mystery', 'Science Fiction', 'Literary Fiction', 'Horror', 'Non-Fiction'];

export default async function AuthorsPage() {
  const featuredAuthors = await getFeaturedAuthors();
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
              <Award weight="duotone" className="h-4 w-4" />
              Our Authors
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-6 animate-fade-up" style={{ animationDelay: '100ms' }}>
              Meet the Storytellers
            </h1>
            <p className="text-xl text-parchment-200 mb-8 animate-fade-up" style={{ animationDelay: '200ms' }}>
              Discover talented authors who bring extraordinary stories to life
            </p>

            {/* Search */}
            <div className="relative max-w-xl mx-auto animate-fade-up" style={{ animationDelay: '300ms' }}>
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-ink-400" />
              <input
                type="text"
                placeholder="Search authors by name or genre..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-accent-yellow/50"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white border-b border-parchment-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-ink-600 font-medium">Filter by genre:</span>
            {genres.map((genre) => (
              <button
                key={genre}
                className={`px-4 py-2 rounded-full text-sm transition-all ${
                  genre === 'All'
                    ? 'bg-ink-900 text-white'
                    : 'bg-parchment-100 text-ink-600 hover:bg-parchment-200'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Authors Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {featuredAuthors.length === 0 ? (
            <div className="max-w-md mx-auto text-center py-16">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-parchment-100 flex items-center justify-center">
                <Award weight="duotone" className="h-10 w-10 text-parchment-400" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-ink-900 mb-3">No Authors Yet</h2>
              <p className="text-ink-600 mb-6">
                Be among the first to join our author community and share your stories with the world.
              </p>
              <Link href="/signup">
                <Button variant="primary" size="lg">
                  Become an Author
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {featuredAuthors.map((author, index) => (
                  <Link
                    key={author.id}
                    href={`/authors/${author.id}`}
                    className="group rounded-3xl bg-white border border-parchment-100 shadow-sm overflow-hidden hover:shadow-md hover:border-parchment-200 transition-all duration-300 animate-fade-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Header */}
                    <div className={`p-6 pb-8 bg-gradient-to-br ${author.gradient} relative`}>
                      {author.bestseller && (
                        <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-medium flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          Bestseller
                        </div>
                      )}
                      {/* Avatar */}
                      <div className="absolute -bottom-10 left-6">
                        <AuthorAvatarCard
                          authorId={author.id}
                          authorAvatar={author.avatarUrl}
                          authorName={author.name}
                          gradient={author.gradient}
                          size="md"
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 pt-14">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-serif text-xl font-bold text-ink-900 group-hover:text-ink-700 transition-colors">
                          {author.name}
                        </h3>
                        {author.isVerified && (
                          <VerifiedBadge size="sm" />
                        )}
                      </div>
                      {author.genre && author.genre !== 'Fiction' && (
                        <p className="text-sm text-ink-500 font-medium mb-3">{author.genre} Author</p>
                      )}
                      {(!author.genre || author.genre === 'Fiction') && (
                        <p className="text-sm text-ink-500 font-medium mb-3">Author</p>
                      )}
                      {author.bio && (
                        <p className="text-ink-600 text-sm mb-4 line-clamp-2">{author.bio}</p>
                      )}

                      {/* Stats */}
                      <div className="flex items-center gap-5 pt-4 border-t border-parchment-100">
                        <div className="flex items-center gap-1.5">
                          <BookOpen className="h-4 w-4 text-ink-400" />
                          <span className="text-sm text-ink-600">{author.books}</span>
                        </div>
                        {author.rating > 0 && (
                          <div className="flex items-center gap-1.5">
                            <Star weight="fill" className="h-4 w-4 text-accent-yellow" />
                            <span className="text-sm text-ink-600">{author.rating}</span>
                          </div>
                        )}
                        <div className="text-sm text-ink-500">{author.followers} followers</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Load More */}
              <div className="text-center mt-12">
                <Button variant="outline" size="lg">
                  Load More Authors
                </Button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Become an Author CTA */}
      <section className="py-20 bg-gradient-to-br from-ink-900 via-ink-800 to-ink-900">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Join Our Author Community?
            </h2>
            <p className="text-xl text-parchment-200 mb-8">
              Share your stories with the world and connect with readers everywhere
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button variant="accent" size="lg" className="gap-2">
                  Start Publishing
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
