import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ArtworkGrid } from "@/components/ArtworkGrid";
import { CollectionCard } from "@/components/CollectionCard";
import { NewsletterForm } from "@/components/NewsletterForm";
import { getFeaturedArtworks, getCollections, getArtist } from "@/lib/sanity";

export const revalidate = 60;

export default async function HomePage() {
  const [featuredArtworks, collections, artist] = await Promise.all([
    getFeaturedArtworks(),
    getCollections(),
    getArtist(),
  ]);

  const statement =
    artist?.statement ||
    "Every painting begins as a conversation with color. I chase the moments between light and shadow, where reality softens and emotion takes form. My work is an invitation to pause and look deeper.";

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-soft-black text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-soft-black via-charcoal to-accent-dark opacity-90" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-28 sm:py-36 lg:py-44">
          <div className="max-w-2xl">
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
              Art That
              <br />
              <span className="text-accent-light">Speaks</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-white/70 leading-relaxed max-w-lg">
              Original paintings capturing the interplay of light, color, and
              emotion. Each piece is a unique, one-of-a-kind creation.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/collections"
                className="inline-flex items-center gap-2 rounded-lg bg-white text-soft-black px-8 py-3.5 text-sm font-semibold hover:bg-warm-white transition-colors"
              >
                View Collections
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-8 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
              >
                About the Artist
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Works */}
      {featuredArtworks.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-soft-black">
                Featured Works
              </h2>
              <p className="mt-2 text-gallery-gray">
                A curated selection of recent original paintings
              </p>
            </div>
            <Link
              href="/collections"
              className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-accent hover:text-accent-dark transition-colors"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <ArtworkGrid artworks={featuredArtworks} columns={3} />
          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/collections"
              className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:text-accent-dark transition-colors"
            >
              View all works
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      )}

      {/* Collections Preview */}
      {collections.length > 0 && (
        <section className="bg-warm-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-soft-black">
                Collections
              </h2>
              <p className="mt-2 text-gallery-gray max-w-md mx-auto">
                Explore curated groupings of work by theme and style
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {collections.map((collection, index) => (
                <CollectionCard
                  key={collection._id}
                  collection={collection}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Artist Statement */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-soft-black mb-8">
            From the Studio
          </h2>
          <blockquote className="font-serif text-xl sm:text-2xl text-charcoal leading-relaxed italic">
            &ldquo;{statement}&rdquo;
          </blockquote>
          <div className="mt-8">
            <Link
              href="/about"
              className="text-sm font-medium text-accent hover:text-accent-dark transition-colors underline underline-offset-4"
            >
              Read more about the artist
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-soft-black text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold mb-3">
              Stay Connected
            </h2>
            <p className="text-white/60 mb-8 text-sm">
              Be the first to know about new releases, studio updates, and
              exhibition news.
            </p>
            <NewsletterForm />
          </div>
        </div>
      </section>
    </>
  );
}
