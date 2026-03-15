import type { Metadata } from "next";
import { CollectionCard } from "@/components/CollectionCard";
import { getCollections } from "@/lib/sanity";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Collections",
  description: "Explore our curated collections of original paintings and artwork.",
};

export default async function CollectionsPage() {
  const collections = await getCollections();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div className="text-center mb-16">
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-soft-black">
          Collections
        </h1>
        <p className="mt-4 text-lg text-gallery-gray max-w-2xl mx-auto">
          Browse our curated groupings of original work, organized by theme,
          style, and inspiration.
        </p>
      </div>

      {collections.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((collection, index) => (
            <CollectionCard
              key={collection._id}
              collection={collection}
              index={index}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gallery-gray text-lg py-12">
          Collections coming soon.
        </p>
      )}
    </div>
  );
}
