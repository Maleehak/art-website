"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Collection } from "@/types";
import { PlaceholderImage } from "./PlaceholderImage";
import { urlFor } from "@/lib/sanity";

interface CollectionCardProps {
  collection: Collection;
  index?: number;
}

export function CollectionCard({ collection, index = 0 }: CollectionCardProps) {
  const hasImage = collection.image?.asset?._ref;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
    >
      <Link href={`/collections/${collection.slug}`} className="group block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-warm-white">
          {hasImage ? (
            <Image
              src={urlFor(collection.image).width(600).height(750).url()}
              alt={collection.image.alt || collection.title}
              width={600}
              height={750}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <PlaceholderImage
              title={collection.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h3 className="font-serif text-2xl font-bold text-white">
              {collection.title}
            </h3>
            {collection.description && (
              <p className="text-sm text-white/80 mt-1">
                {collection.description}
              </p>
            )}
            <p className="text-xs text-white/60 mt-2 uppercase tracking-wider">
              {collection.artworkCount}{" "}
              {collection.artworkCount === 1 ? "piece" : "pieces"}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
