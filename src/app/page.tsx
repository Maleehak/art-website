import Link from "next/link";
import { ArrowRight, Palette } from "lucide-react";
import { ArtworkGrid } from "@/components/ArtworkGrid";
import { CollectionCard } from "@/components/CollectionCard";
import { NewsletterForm } from "@/components/NewsletterForm";
import { FlashSaleBanner } from "@/components/FlashSaleBanner";
import { getFeaturedArtworks, getCollections, getActiveSales } from "@/lib/sanity";
import { getSaleEndTime } from "@/types";

export const revalidate = 60;

export default async function HomePage() {
  const [featuredArtworks, collections, activeSales] = await Promise.all([
    getFeaturedArtworks(),
    getCollections(),
    getActiveSales(),
  ]);

  const flashSaleArtwork = activeSales[0] ?? null;
  const flashSaleEndTime = flashSaleArtwork
    ? getSaleEndTime(flashSaleArtwork)
    : null;

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

      {/* Flash Sale */}
      {flashSaleArtwork && flashSaleEndTime && (
        <FlashSaleBanner
          artwork={flashSaleArtwork}
          saleEndTime={flashSaleEndTime}
        />
      )}

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

      {/* Commission */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-accent/10 mb-6">
            <Palette className="h-7 w-7 text-accent" />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-soft-black">
            Commission a Custom Piece
          </h2>
          <p className="mt-4 text-gallery-gray leading-relaxed max-w-xl mx-auto">
            Have a vision for a one-of-a-kind painting? Share your ideas and
            I&apos;ll bring them to life on canvas — tailored to your space,
            style, and story.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/commission"
              className="inline-flex items-center gap-2 rounded-lg bg-soft-black text-white px-8 py-3.5 text-sm font-semibold hover:bg-charcoal transition-colors"
            >
              Start Your Commission
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-lg border border-warm-white px-8 py-3.5 text-sm font-semibold text-soft-black hover:border-accent/50 transition-colors"
            >
              Ask a Question
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
