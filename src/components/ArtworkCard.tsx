"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Artwork } from "@/types";
import { useCurrency } from "@/context/CurrencyContext";
import { PlaceholderImage } from "./PlaceholderImage";
import { urlFor } from "@/lib/sanity";

interface ArtworkCardProps {
  artwork: Artwork;
  index?: number;
}

export function ArtworkCard({ artwork, index = 0 }: ArtworkCardProps) {
  const { format } = useCurrency();

  const hasImage = artwork.image?.asset?._ref;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/artwork/${artwork.slug}`} className="group block">
        <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-warm-white">
          {hasImage ? (
            <Image
              src={urlFor(artwork.image).width(600).height(800).url()}
              alt={artwork.image.alt || artwork.title}
              width={600}
              height={800}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <PlaceholderImage
              title={artwork.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          )}
          {artwork.status === "sold" && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="bg-sold text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-sm">
                Sold
              </span>
            </div>
          )}
          {artwork.status === "reserved" && (
            <div className="absolute top-3 right-3">
              <span className="bg-accent text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-sm">
                Reserved
              </span>
            </div>
          )}
        </div>
        <div className="mt-4 space-y-1">
          <h3 className="font-serif text-lg font-medium text-soft-black group-hover:text-accent transition-colors">
            &ldquo;{artwork.title}&rdquo;
          </h3>
          <p className="text-sm text-gallery-gray">{artwork.medium}</p>
          <p className="text-sm text-gallery-gray">{artwork.dimensions}</p>
          <p className="font-medium text-soft-black mt-1">
            {artwork.status === "sold" ? (
              <span className="text-sold">Sold</span>
            ) : (
              format(artwork.price)
            )}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
