"use client";

import Link from "next/link";
import Image from "next/image";
import { Trash2, ShoppingBag, ArrowLeft, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { isArtworkOnSale, getEffectivePrice } from "@/types";
import { PlaceholderImage } from "@/components/PlaceholderImage";
import { urlFor } from "@/lib/sanity";

export default function CartPage() {
  const { items, removeItem, clearCart, totalPrice } = useCart();
  const { format } = useCurrency();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center">
        <ShoppingBag className="h-16 w-16 text-warm-white mx-auto mb-6" />
        <h1 className="font-serif text-3xl font-bold text-soft-black mb-3">
          Your Cart is Empty
        </h1>
        <p className="text-gallery-gray mb-8">
          Discover original paintings and add them to your cart.
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
      <div className="flex items-center justify-between mb-10">
        <h1 className="font-serif text-3xl font-bold text-soft-black">
          Shopping Cart
        </h1>
        <button
          onClick={clearCart}
          className="text-sm text-gallery-gray hover:text-error transition-colors"
        >
          Clear all
        </button>
      </div>

      <div className="space-y-6">
        <AnimatePresence>
          {items.map((item) => (
            <motion.div
              key={item.artwork._id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="flex gap-6 bg-warm-white rounded-xl p-4 sm:p-6"
            >
              <Link
                href={`/artwork/${item.artwork.slug}`}
                className="h-28 w-28 sm:h-36 sm:w-36 flex-shrink-0 overflow-hidden rounded-lg"
              >
                {item.artwork.image?.asset?._ref ? (
                  <Image
                    src={urlFor(item.artwork.image).width(288).height(288).quality(80).url()}
                    alt={item.artwork.image.alt || item.artwork.title}
                    width={288}
                    height={288}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <PlaceholderImage
                    title={item.artwork.title}
                    className="h-full w-full object-cover"
                  />
                )}
              </Link>
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <Link
                    href={`/artwork/${item.artwork.slug}`}
                    className="font-serif text-lg font-medium text-soft-black hover:text-accent transition-colors"
                  >
                    &ldquo;{item.artwork.title}&rdquo;
                  </Link>
                  <p className="text-sm text-gallery-gray mt-1">
                    {item.artwork.medium} &middot; {item.artwork.dimensions}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-4">
                  {isArtworkOnSale(item.artwork) ? (
                    <div className="flex items-baseline gap-2">
                      <p className="text-lg font-bold text-red-600">
                        {format(item.artwork.salePrice!)}
                      </p>
                      <p className="text-sm text-gallery-gray line-through">
                        {format(item.artwork.price)}
                      </p>
                    </div>
                  ) : (
                    <p className="text-lg font-semibold text-soft-black">
                      {format(item.artwork.price)}
                    </p>
                  )}
                  <button
                    onClick={() => removeItem(item.artwork._id)}
                    className="flex items-center gap-1 text-sm text-gallery-gray hover:text-error transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Summary */}
      <div className="mt-10 border-t border-warm-white pt-8 space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-gallery-gray">Subtotal</span>
          <span className="font-medium text-soft-black">
            {format(totalPrice)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gallery-gray">Shipping</span>
          <span className="text-sm text-gallery-gray">
            Calculated at checkout
          </span>
        </div>
        <div className="flex justify-between text-lg font-bold pt-4 border-t border-warm-white">
          <span className="text-soft-black">Total</span>
          <span className="text-soft-black">{format(totalPrice)}</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Link
            href="/collections"
            className="flex items-center justify-center gap-2 rounded-lg border border-warm-white px-6 py-3.5 text-sm font-medium text-soft-black hover:border-accent transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Link>
          <Link
            href="/checkout"
            className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-soft-black px-6 py-3.5 text-sm font-semibold text-white hover:bg-charcoal transition-colors"
          >
            Proceed to Checkout
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
