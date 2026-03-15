import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Instagram } from "lucide-react";
import { getArtist } from "@/lib/sanity";
import { urlFor } from "@/lib/sanity";
import { PlaceholderImage } from "@/components/PlaceholderImage";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "About the Artist",
  description:
    "Learn about the artist, their journey, process, and creative philosophy.",
};

export default async function AboutPage() {
  const artist = await getArtist();

  const name = artist?.name || "The Artist";
  const bio =
    artist?.bio ||
    "With a passion for capturing the ephemeral qualities of light and atmosphere, I create paintings that invite viewers into a world of quiet contemplation.";
  const statement =
    artist?.statement ||
    "I paint to understand the world. Each canvas is a question, and the act of painting is my way of searching for answers.";
  const instagramUrl = artist?.socialLinks?.instagram || "https://instagram.com";

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      {/* Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-24">
        <div className="aspect-[4/5] rounded-xl overflow-hidden bg-warm-white">
          {artist?.photo ? (
            <Image
              src={urlFor(artist.photo).width(800).height(1000).url()}
              alt={artist.photo.alt || name}
              width={800}
              height={1000}
              className="h-full w-full object-cover"
              priority
            />
          ) : (
            <PlaceholderImage
              title="Artist Portrait"
              className="h-full w-full object-cover"
            />
          )}
        </div>
        <div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-soft-black mb-6">
            About {name}
          </h1>
          <div className="space-y-4 text-gallery-gray leading-relaxed">
            {bio.split("\n").map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
          <div className="mt-8 flex gap-4">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent-dark transition-colors"
            >
              <Instagram className="h-4 w-4" />
              Follow on Instagram
            </a>
          </div>
        </div>
      </div>

      {/* Artist Statement */}
      <section className="max-w-3xl mx-auto text-center mb-24">
        <h2 className="font-serif text-3xl font-bold text-soft-black mb-8">
          Artist Statement
        </h2>
        <blockquote className="font-serif text-xl sm:text-2xl text-charcoal leading-relaxed italic">
          &ldquo;{statement}&rdquo;
        </blockquote>
      </section>

      {/* Studio Section */}
      {artist?.studioPhotos && artist.studioPhotos.length > 0 && (
        <section className="mb-24">
          <h2 className="font-serif text-3xl font-bold text-soft-black mb-8 text-center">
            The Studio
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {artist.studioPhotos.map((photo, i) => (
              <div
                key={i}
                className="aspect-square rounded-lg overflow-hidden bg-warm-white"
              >
                <Image
                  src={urlFor(photo).width(600).height(600).url()}
                  alt={photo.alt || `Studio photo ${i + 1}`}
                  width={600}
                  height={600}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="text-center bg-warm-white rounded-2xl p-12 sm:p-16">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-soft-black mb-4">
          Commission a Piece
        </h2>
        <p className="text-gallery-gray max-w-md mx-auto mb-8">
          Interested in a custom painting? I welcome commissions and would love
          to create something meaningful for your space.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 rounded-lg bg-soft-black text-white px-8 py-3.5 text-sm font-semibold hover:bg-charcoal transition-colors"
        >
          Get in Touch
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
}
