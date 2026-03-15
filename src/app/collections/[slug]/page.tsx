import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ArtworkGrid } from "@/components/ArtworkGrid";
import { getCollection, getArtworksByCollection } from "@/lib/sanity";
import { notFound } from "next/navigation";

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getCollection(slug);
  return {
    title: collection?.title || "Collection",
    description: collection?.description || "Browse artworks in this collection.",
  };
}

export default async function CollectionPage({ params }: Props) {
  const { slug } = await params;
  const [collection, artworks] = await Promise.all([
    getCollection(slug),
    getArtworksByCollection(slug),
  ]);

  if (!collection) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <Link
        href="/collections"
        className="inline-flex items-center gap-2 text-sm text-gallery-gray hover:text-soft-black transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        All Collections
      </Link>

      <div className="mb-12">
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-soft-black">
          {collection.title}
        </h1>
        {collection.description && (
          <p className="mt-4 text-lg text-gallery-gray max-w-2xl">
            {collection.description}
          </p>
        )}
        <p className="mt-2 text-sm text-gallery-gray">
          {artworks.length} {artworks.length === 1 ? "piece" : "pieces"}
        </p>
      </div>

      <ArtworkGrid artworks={artworks} columns={3} />
    </div>
  );
}
