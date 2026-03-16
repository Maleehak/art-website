"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle, Loader2, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CheckoutSuccessPage() {
  const { clearCart } = useCart();
  const searchParams = useSearchParams();
  const intentId = searchParams.get("xpay_intent_id");
  const provider = searchParams.get("provider");
  const urlStatus = searchParams.get("status");
  const [status, setStatus] = useState<"loading" | "success" | "failed">(
    "loading"
  );

  useEffect(() => {
    if (provider === "easypaisa") {
      if (urlStatus === "failed") {
        setStatus("failed");
      } else {
        clearCart();
        setStatus("success");
      }
      return;
    }

    if (provider === "bank_transfer" || provider === "cod") {
      clearCart();
      setStatus("success");
      return;
    }

    if (!intentId) {
      clearCart();
      setStatus("success");
      return;
    }

    async function checkStatus() {
      try {
        const res = await fetch(
          `/api/payment-status?xpay_intent_id=${intentId}`
        );
        const data = await res.json();
        if (data.status === "SUCCESS") {
          clearCart();
          setStatus("success");
        } else if (data.status === "FAILED") {
          setStatus("failed");
        } else {
          clearCart();
          setStatus("success");
        }
      } catch {
        clearCart();
        setStatus("success");
      }
    }

    checkStatus();
  }, [intentId, provider, urlStatus, clearCart]);

  if (status === "loading") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <Loader2 className="h-16 w-16 text-accent mx-auto mb-6 animate-spin" />
        <h1 className="font-serif text-3xl font-bold text-soft-black mb-4">
          Confirming Your Payment...
        </h1>
        <p className="text-gallery-gray">
          Please wait while we verify your payment.
        </p>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <XCircle className="h-16 w-16 text-error mx-auto mb-6" />
        <h1 className="font-serif text-3xl font-bold text-soft-black mb-4">
          Payment Failed
        </h1>
        <p className="text-lg text-gallery-gray mb-8">
          Unfortunately, your payment could not be processed. Please try again
          or use a different payment method.
        </p>
        <Link
          href="/checkout"
          className="inline-flex items-center gap-2 rounded-lg bg-soft-black text-white px-8 py-3.5 text-sm font-semibold hover:bg-charcoal transition-colors"
        >
          Try Again
        </Link>
      </div>
    );
  }

  const isBankTransfer = provider === "bank_transfer";
  const isCod = provider === "cod";
  const isFlashSale = searchParams.get("sale") === "true";

  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <CheckCircle className="h-16 w-16 text-success mx-auto mb-6" />
      <h1 className="font-serif text-3xl sm:text-4xl font-bold text-soft-black mb-4">
        {isCod
          ? "Order Placed!"
          : isBankTransfer
          ? "Order Placed!"
          : "Thank You for Your Purchase!"}
      </h1>
      <p className="text-lg text-gallery-gray mb-3">
        {isCod
          ? "Your order is confirmed! You will pay in cash when your artwork is delivered."
          : isBankTransfer
          ? isFlashSale
            ? "Bank transfer details have been sent to your email. Please complete the transfer within 5 minutes to secure your flash sale item."
            : "Bank transfer details have been sent to your email. Please complete the transfer within 48 hours."
          : "Your order has been confirmed and you'll receive a confirmation email shortly."}
      </p>
      <p className="text-sm text-gallery-gray mb-10">
        {isCod
          ? "Please keep the exact amount ready. We'll contact you before delivery to confirm the schedule."
          : isBankTransfer
          ? isFlashSale
            ? "This is a flash sale — the item will be released to other buyers if payment is not received within 5 minutes."
            : "Once we receive your payment, we'll begin preparing your artwork for shipping."
          : "We'll carefully package your artwork and ship it within 2-3 business days. You'll receive tracking information via email."}
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
            Shipped with tracking — you&apos;ll get an email with the tracking
            number
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
