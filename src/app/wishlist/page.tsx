"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ArrowRight, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCurrency } from "@/context/CurrencyContext";
import { useCart } from "@/context/CartContext";
import { PlaceholderImage } from "@/components/PlaceholderImage";
import { urlFor } from "@/lib/sanity";
import type { Artwork } from "@/types";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<Artwork[]>([]);
  const { format } = useCurrency();
  const { addItem, isInCart } = useCart();

  useEffect(() => {
    try {
      const saved = localStorage.getItem("wishlist");
      if (saved) setWishlist(JSON.parse(saved));
    } catch {}
  }, []);

  function removeFromWishlist(artworkId: string) {
    const updated = wishlist.filter((a) => a._id !== artworkId);
    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
  }

  if (wishlist.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center">
        <Heart className="h-16 w-16 text-warm-white mx-auto mb-6" />
        <h1 className="font-serif text-3xl font-bold text-soft-black mb-3">
          Your Wishlist is Empty
        </h1>
        <p className="text-gallery-gray mb-8">
          Save your favorite pieces to revisit them later.
        </p>
        <Link
          href="/collections"
          className="inline-flex items-center gap-2 rounded-lg bg-soft-black text-white px-8 py-3.5 text-sm font-semibold hover:bg-charcoal transition-colors"
        >
          Browse Collections
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <h1 className="font-serif text-3xl font-bold text-soft-black mb-10">
        Wishlist ({wishlist.length})
      </h1>

      <div className="space-y-6">
        <AnimatePresence>
          {wishlist.map((artwork) => (
            <motion.div
              key={artwork._id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="flex gap-6 bg-warm-white rounded-xl p-4 sm:p-6"
            >
              <Link
                href={`/artwork/${artwork.slug}`}
                className="h-28 w-28 sm:h-36 sm:w-36 flex-shrink-0 overflow-hidden rounded-lg"
              >
                {artwork.image?.asset?._ref ? (
                  <Image
                    src={urlFor(artwork.image).width(288).height(288).quality(80).url()}
                    alt={artwork.image.alt || artwork.title}
                    width={288}
                    height={288}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <PlaceholderImage
                    title={artwork.title}
                    className="h-full w-full object-cover"
                  />
                )}
              </Link>
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <Link
                    href={`/artwork/${artwork.slug}`}
                    className="font-serif text-lg font-medium text-soft-black hover:text-accent transition-colors"
                  >
                    &ldquo;{artwork.title}&rdquo;
                  </Link>
                  <p className="text-sm text-gallery-gray mt-1">
                    {artwork.medium} &middot; {artwork.dimensions}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-4 gap-3">
                  <p className="text-lg font-semibold text-soft-black">
                    {artwork.status === "sold" ? (
                      <span className="text-sold">Sold</span>
                    ) : (
                      format(artwork.price)
                    )}
                  </p>
                  <div className="flex gap-2">
                    {artwork.status === "available" && (
                      <button
                        onClick={() => addItem(artwork)}
                        disabled={isInCart(artwork._id)}
                        className="text-xs font-medium px-4 py-2 rounded-lg bg-soft-black text-white hover:bg-charcoal disabled:opacity-50 transition-colors"
                      >
                        {isInCart(artwork._id) ? "In Cart" : "Add to Cart"}
                      </button>
                    )}
                    <button
                      onClick={() => removeFromWishlist(artwork._id)}
                      className="p-2 text-gallery-gray hover:text-error transition-colors"
                      aria-label="Remove from wishlist"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
