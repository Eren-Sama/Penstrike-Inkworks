import {
  BookOpen,
  Star,
  TrendUp as TrendingUp,
} from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import { getAuthorProfile, getAuthorBooks } from '@/lib/data';
import { notFound } from 'next/navigation';
import { 
  AuthorProfileClientWrapper, 
  AuthorInfoCard
} from '@/components/authors/AuthorProfileClient';

export default async function AuthorDetailPage({ params }: { params: { id: string } }) {
  // Fetch author data through the data layer (handles demo/real mode automatically)
  const [author, books] = await Promise.all([
    getAuthorProfile(params.id),
    getAuthorBooks(params.id)
  ]);

  // Handle case where author is not found (only possible in real mode)
  if (!author) {
    notFound();
  }

  // Prepare author data for client component (serializable)
  const authorForClient = {
    id: author.id,
    name: author.name,
    bio: author.bio,
    avatar: author.avatar,
    gradient: author.gradient,
    genre: author.genre,
    location: author.location,
    joinedDate: author.joinedDate,
    isVerified: author.isVerified,
    awards: author.awards,
    stats: {
      books: author.stats.books,
      followers: author.stats.followers,
      avgRating: author.stats.avgRating,
      reviews: author.stats.reviews,
    },
    socialLinks: author.socialLinks,
  };

  return (
    <div className="min-h-screen bg-parchment-50">
      {/* Client wrapper handles hero + follow state context */}
      <AuthorProfileClientWrapper author={authorForClient}>
        
        {/* Main Content Grid */}
        <section className="py-10 md:py-14">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="grid lg:grid-cols-3 gap-8 lg:gap-10">
                
                {/* Main Column - About + Books */}
                <div className="lg:col-span-2 space-y-10">
                  
                  {/* About Section */}
                  <div className="bg-white rounded-2xl border border-parchment-200 p-6 md:p-8 animate-fade-up">
                    <h2 className="text-lg font-semibold text-ink-900 mb-5">
                      About the Author
                    </h2>
                    <div className="prose prose-ink max-w-none">
                      {author.bio && author.bio.trim() ? (
                        author.bio.split('\n\n').map((paragraph, index) => (
                          <p key={index} className="text-ink-600 leading-relaxed mb-4 last:mb-0">
                            {paragraph}
                          </p>
                        ))
                      ) : (
                        <p className="text-ink-500 italic">No bio available yet.</p>
                      )}
                    </div>
                  </div>

                  {/* Published Works */}
                  {books.length > 0 && (
                    <div className="animate-fade-up" style={{ animationDelay: '100ms' }}>
                      <div className="flex items-center justify-between mb-5">
                        <h2 className="text-sm font-semibold text-ink-900">
                          Published Works
                        </h2>
                        <span className="text-ink-500 text-xs">{books.length} {books.length === 1 ? 'book' : 'books'}</span>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {books.map((book) => (
                          <Link
                            key={book.id}
                            href={`/bookstore/${book.id}`}
                            className="group flex gap-4 p-4 rounded-xl bg-white border border-parchment-200 hover:border-parchment-300 hover:shadow-sm transition-all duration-200"
                          >
                            {/* Cover */}
                            <div className={`w-16 h-24 rounded-lg bg-gradient-to-br ${book.coverColor} flex items-center justify-center flex-shrink-0`}>
                              <BookOpen weight="duotone" className="h-5 w-5 text-white/40" />
                            </div>

                            {/* Info */}
                            <div className="flex-1 flex flex-col min-w-0">
                              {book.bestseller && (
                                <span className="inline-flex items-center gap-1 text-xs font-medium text-accent-amber mb-1">
                                  <TrendingUp weight="fill" className="h-3 w-3" />
                                  Bestseller
                                </span>
                              )}
                              <h3 className="font-semibold text-ink-900 group-hover:text-ink-700 transition-colors truncate text-sm">
                                {book.title}
                              </h3>
                              <div className="flex items-center gap-1.5 mt-1.5 mb-auto">
                                <Star weight="fill" className="h-3.5 w-3.5 text-accent-yellow" />
                                <span className="text-xs text-ink-600">{book.rating}</span>
                                <span className="text-xs text-ink-400">({book.reviews.toLocaleString()})</span>
                              </div>
                              <p className="font-bold text-ink-900 text-sm mt-2">{formatCurrency(book.price)}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                      {books.length >= 4 && (
                        <div className="mt-5 text-center">
                          <Button variant="outline" size="sm" className="text-ink-600 hover:text-ink-900">
                            View All Books
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Empty state for books */}
                  {books.length === 0 && (
                    <div className="bg-white rounded-2xl border border-parchment-200 p-10 text-center animate-fade-up">
                      <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-parchment-100 flex items-center justify-center">
                        <BookOpen weight="duotone" className="h-8 w-8 text-ink-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-ink-900 mb-2">No Books Yet</h3>
                      <p className="text-ink-500">This author hasn&apos;t published any books yet. Check back soon!</p>
                    </div>
                  )}
                </div>

                {/* Sidebar */}
                <div className="space-y-5">
                  
                  {/* Author Info Card */}
                  <AuthorInfoCard 
                    joinedDate={author.joinedDate}
                    genre={author.genre}
                    socialLinks={author.socialLinks}
                    avgRating={author.stats.avgRating}
                    reviews={author.stats.reviews}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </AuthorProfileClientWrapper>
    </div>
  );
}