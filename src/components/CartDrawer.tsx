"use client";

import { X, Trash2, ShoppingBag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { isArtworkOnSale, getEffectivePrice } from "@/types";
import { PlaceholderImage } from "./PlaceholderImage";
import { urlFor } from "@/lib/sanity";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, totalPrice, totalItems } =
    useCart();
  const { format } = useCurrency();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50"
            onClick={closeCart}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-cream shadow-2xl"
          >
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-warm-white px-6 py-4">
                <h2 className="font-serif text-lg font-semibold text-soft-black">
                  Cart ({totalItems})
                </h2>
                <button
                  onClick={closeCart}
                  className="p-1 text-gallery-gray hover:text-soft-black transition-colors"
                  aria-label="Close cart"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {items.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center px-6">
                  <ShoppingBag className="h-12 w-12 text-warm-white mb-4" />
                  <p className="text-gallery-gray text-center">
                    Your cart is empty
                  </p>
                  <button
                    onClick={closeCart}
                    className="mt-6 text-sm font-medium text-accent hover:text-accent-dark transition-colors underline underline-offset-4"
                  >
                    Continue browsing
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                    {items.map((item) => (
                      <div
                        key={item.artwork._id}
                        className="flex gap-4 rounded-lg bg-warm-white p-3"
                      >
                        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
                          {item.artwork.image?.asset?._ref ? (
                            <Image
                              src={urlFor(item.artwork.image).width(160).height(160).quality(80).url()}
                              alt={item.artwork.image.alt || item.artwork.title}
                              width={160}
                              height={160}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <PlaceholderImage
                              title={item.artwork.title}
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-serif text-sm font-medium text-soft-black truncate">
                            &ldquo;{item.artwork.title}&rdquo;
                          </h3>
                          <p className="text-xs text-gallery-gray mt-0.5">
                            {item.artwork.medium}
                          </p>
                          {isArtworkOnSale(item.artwork) ? (
                            <div className="mt-1 flex items-center gap-2">
                              <span className="text-sm font-bold text-red-600">
                                {format(item.artwork.salePrice!)}
                              </span>
                              <span className="text-xs text-gallery-gray line-through">
                                {format(item.artwork.price)}
                              </span>
                            </div>
                          ) : (
                            <p className="text-sm font-medium text-soft-black mt-1">
                              {format(item.artwork.price)}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => removeItem(item.artwork._id)}
                          className="self-start p-1 text-gallery-gray hover:text-error transition-colors"
                          aria-label={`Remove ${item.artwork.title}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-warm-white px-6 py-4 space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gallery-gray">Subtotal</span>
                      <span className="font-medium text-soft-black">
                        {format(totalPrice)}
                      </span>
                    </div>
                    <p className="text-xs text-gallery-gray">
                      Shipping calculated at checkout
                    </p>
                    <Link
                      href="/checkout"
                      onClick={closeCart}
                      className="block w-full rounded-lg bg-soft-black py-3 text-center text-sm font-medium text-white hover:bg-charcoal transition-colors"
                    >
                      Proceed to Checkout
                    </Link>
                    <button
                      onClick={closeCart}
                      className="block w-full text-center text-sm text-gallery-gray hover:text-soft-black transition-colors"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
