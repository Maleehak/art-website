"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ShoppingBag, Check, Heart } from "lucide-react";
import { motion } from "framer-motion";
import type { Artwork } from "@/types";
import { isArtworkOnSale, getSaleEndTime } from "@/types";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { ImageZoom } from "@/components/ImageZoom";
import { PlaceholderImage } from "@/components/PlaceholderImage";
import { SaleCountdown } from "@/components/SaleCountdown";
import { urlFor } from "@/lib/sanity";

interface ArtworkDetailProps {
  artwork: Artwork;
}

export function ArtworkDetail({ artwork }: ArtworkDetailProps) {
  const router = useRouter();
  const { addItem, isInCart, openCart } = useCart();
  const { format } = useCurrency();
  const inCart = isInCart(artwork._id);
  const [wishlisted, setWishlisted] = useState(false);

  const pollStatus = useCallback(async () => {
    try {
      const res = await fetch(`/api/artwork-status?id=${artwork._id}`);
      const data = await res.json();
      if (data.status && data.status !== artwork.status) {
        router.refresh();
      }
    } catch {}
  }, [artwork._id, artwork.status, router]);

  useEffect(() => {
    if (artwork.status !== "reserved") return;
    const interval = setInterval(pollStatus, 15000);
    return () => clearInterval(interval);
  }, [artwork.status, pollStatus]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("wishlist") || "[]");
      setWishlisted(saved.some((a: Artwork) => a._id === artwork._id));
    } catch {}
  }, [artwork._id]);

  function toggleWishlist() {
    try {
      const saved: Artwork[] = JSON.parse(
        localStorage.getItem("wishlist") || "[]"
      );
      const exists = saved.some((a) => a._id === artwork._id);
      const updated = exists
        ? saved.filter((a) => a._id !== artwork._id)
        : [...saved, artwork];
      localStorage.setItem("wishlist", JSON.stringify(updated));
      setWishlisted(!exists);
    } catch {}
  }

  function handleAddToCart() {
    if (inCart) {
      openCart();
      return;
    }
    addItem(artwork);
    openCart();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
      <Link
        href={`/collections/${artwork.collection.slug}`}
        className="inline-flex items-center gap-2 text-sm text-gallery-gray hover:text-soft-black transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        {artwork.collection.title}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <ImageZoom className="rounded-xl overflow-hidden bg-warm-white aspect-square">
            {artwork.image?.asset?._ref ? (
              <Image
                src={urlFor(artwork.image).width(1200).height(1200).quality(90).url()}
                alt={artwork.image.alt || artwork.title}
                width={1200}
                height={1200}
                className="h-full w-full object-cover"
                priority
              />
            ) : (
              <PlaceholderImage
                title={artwork.title}
                className="h-full w-full object-cover"
              />
            )}
          </ImageZoom>
        </motion.div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col"
        >
          <div className="flex-1">
            <div className="flex items-start justify-between gap-4">
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-soft-black">
                &ldquo;{artwork.title}&rdquo;
              </h1>
              <button
                onClick={toggleWishlist}
                className={`flex-shrink-0 p-2 rounded-full transition-colors ${
                  wishlisted
                    ? "text-error bg-error/10"
                    : "text-gallery-gray hover:text-error hover:bg-error/5"
                }`}
                aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart
                  className="h-5 w-5"
                  fill={wishlisted ? "currentColor" : "none"}
                />
              </button>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex justify-between py-2 border-b border-warm-white">
                <span className="text-sm text-gallery-gray">Medium</span>
                <span className="text-sm font-medium text-soft-black">
                  {artwork.medium}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-warm-white">
                <span className="text-sm text-gallery-gray">Dimensions</span>
                <span className="text-sm font-medium text-soft-black">
                  {artwork.dimensions}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-warm-white">
                <span className="text-sm text-gallery-gray">Year</span>
                <span className="text-sm font-medium text-soft-black">
                  {artwork.year}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-warm-white">
                <span className="text-sm text-gallery-gray">Status</span>
                <span
                  className={`text-sm font-medium capitalize ${
                    artwork.status === "sold"
                      ? "text-sold"
                      : artwork.status === "reserved"
                      ? "text-accent"
                      : "text-success"
                  }`}
                >
                  {artwork.status}
                </span>
              </div>
            </div>

            {artwork.description && (
              <div className="mt-8">
                <h2 className="text-sm font-semibold text-soft-black uppercase tracking-wider mb-2">
                  About This Piece
                </h2>
                <p className="text-gallery-gray leading-relaxed">
                  {artwork.description}
                </p>
              </div>
            )}
          </div>

          {/* Price & Add to Cart */}
          <div className="mt-10 pt-8 border-t border-warm-white">
            {artwork.status === "sold" ? (
              <div>
                <p className="text-2xl font-bold text-sold">Sold</p>
                <p className="mt-2 text-sm text-gallery-gray">
                  This piece has found its home. Browse our{" "}
                  <Link
                    href="/collections"
                    className="text-accent hover:text-accent-dark underline underline-offset-2"
                  >
                    collections
                  </Link>{" "}
                  for available works.
                </p>
              </div>
            ) : artwork.status === "reserved" ? (
              <div>
                <p className="text-2xl font-bold text-accent">Reserved</p>
                <p className="mt-2 text-sm text-gallery-gray">
                  This piece is currently reserved for another buyer. Browse our{" "}
                  <Link
                    href="/collections"
                    className="text-accent hover:text-accent-dark underline underline-offset-2"
                  >
                    collections
                  </Link>{" "}
                  for available works.
                </p>
              </div>
            ) : (
              <div>
                {isArtworkOnSale(artwork) ? (
                  <div>
                    <div className="flex items-baseline gap-3">
                      <p className="text-3xl font-bold text-red-600">
                        {format(artwork.salePrice!)}
                      </p>
                      <p className="text-xl text-gallery-gray line-through">
                        {format(artwork.price)}
                      </p>
                      <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded">
                        -{Math.round(((artwork.price - artwork.salePrice!) / artwork.price) * 100)}%
                      </span>
                    </div>
                    <div className="mt-3">
                      <SaleCountdown endTime={getSaleEndTime(artwork)!} size="md" />
                    </div>
                  </div>
                ) : (
                  <p className="text-3xl font-bold text-soft-black">
                    {format(artwork.price)}
                  </p>
                )}
                <p className="mt-1 text-xs text-gallery-gray">
                  Free shipping on all original paintings
                </p>
                <button
                  onClick={handleAddToCart}
                  className={`mt-6 w-full flex items-center justify-center gap-2 rounded-lg py-3.5 text-sm font-semibold transition-colors ${
                    inCart
                      ? "bg-success text-white"
                      : "bg-soft-black text-white hover:bg-charcoal"
                  }`}
                >
                  {inCart ? (
                    <>
                      <Check className="h-4 w-4" />
                      In Cart — View Cart
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="h-4 w-4" />
                      Add to Cart
                    </>
                  )}
                </button>
                <Link
                  href="/contact"
                  className="mt-3 block text-center text-sm text-gallery-gray hover:text-soft-black transition-colors underline underline-offset-4"
                >
                  Inquire about this piece
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
