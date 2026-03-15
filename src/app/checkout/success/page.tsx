"use client";

import { useEffect } from "react";
import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CheckoutSuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <CheckCircle className="h-16 w-16 text-success mx-auto mb-6" />
      <h1 className="font-serif text-3xl sm:text-4xl font-bold text-soft-black mb-4">
        Thank You for Your Purchase!
      </h1>
      <p className="text-lg text-gallery-gray mb-3">
        Your order has been confirmed and you&apos;ll receive a confirmation
        email shortly.
      </p>
      <p className="text-sm text-gallery-gray mb-10">
        We&apos;ll carefully package your artwork and ship it within 2-3
        business days. You&apos;ll receive tracking information via email.
      </p>

      <div className="bg-warm-white rounded-xl p-8 mb-8">
        <h2 className="text-sm font-semibold text-soft-black uppercase tracking-wider mb-3">
          What Happens Next?
        </h2>
        <ol className="text-sm text-gallery-gray space-y-2 text-left max-w-md mx-auto">
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent text-white text-xs font-bold flex items-center justify-center">
              1
            </span>
            Order confirmation email sent to your inbox
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent text-white text-xs font-bold flex items-center justify-center">
              2
            </span>
            Artwork is carefully packaged with protective materials
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent text-white text-xs font-bold flex items-center justify-center">
              3
            </span>
            Shipped with tracking — you&apos;ll get an email with the tracking number
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent text-white text-xs font-bold flex items-center justify-center">
              4
            </span>
            Delivered to your door in 5-10 business days
          </li>
        </ol>
      </div>

      <Link
        href="/collections"
        className="inline-flex items-center gap-2 rounded-lg bg-soft-black text-white px-8 py-3.5 text-sm font-semibold hover:bg-charcoal transition-colors"
      >
        Continue Browsing
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
