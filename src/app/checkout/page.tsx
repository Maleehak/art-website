"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Lock, CreditCard, Smartphone, Building2, Truck } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { PlaceholderImage } from "@/components/PlaceholderImage";
import { urlFor } from "@/lib/sanity";
import type { ShippingAddress } from "@/types";
import { getEffectivePrice, isArtworkOnSale } from "@/types";

type PaymentMethod = "card" | "jazzcash" | "easypaisa" | "bank_transfer" | "cod";

export default function CheckoutPage() {
  const { items, totalPrice } = useCart();
  const { format } = useCurrency();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("bank_transfer");
  const [isProcessing, setIsProcessing] = useState(false);
  const [address, setAddress] = useState<ShippingAddress>({
    fullName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "Pakistan",
    phone: "",
  });
  const [email, setEmail] = useState("");

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center">
        <h1 className="font-serif text-3xl font-bold text-soft-black mb-3">
          No Items to Checkout
        </h1>
        <p className="text-gallery-gray mb-8">
          Add some artworks to your cart first.
        </p>
        <Link
          href="/collections"
          className="inline-flex items-center gap-2 rounded-lg bg-soft-black text-white px-8 py-3.5 text-sm font-semibold hover:bg-charcoal transition-colors"
        >
          Browse Collections
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsProcessing(true);

    try {
      if (paymentMethod === "card") {
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: items.map((item) => ({
              artworkId: item.artwork._id,
              title: item.artwork.title,
              price: getEffectivePrice(item.artwork),
              quantity: item.quantity,
              isSale: isArtworkOnSale(item.artwork),
            })),
            email,
            shippingAddress: address,
          }),
        });

        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
          return;
        }
        if (data.error) {
          alert(data.error);
        }
      } else if (paymentMethod === "easypaisa") {
        if (!address.phone) {
          alert("Phone number is required for EasyPaisa payments.");
          return;
        }
        const res = await fetch("/api/easypaisa/initiate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: items.map((item) => ({
              artworkId: item.artwork._id,
              title: item.artwork.title,
              price: getEffectivePrice(item.artwork),
              quantity: item.quantity,
              isSale: isArtworkOnSale(item.artwork),
            })),
            email,
            phone: address.phone,
            shippingAddress: address,
          }),
        });

        const data = await res.json();
        if (data.url && data.params) {
          const form = document.createElement("form");
          form.method = "POST";
          form.action = data.url;
          form.target = "_self";

          for (const key in data.params) {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = key;
            input.value = data.params[key];
            form.appendChild(input);
          }

          document.body.appendChild(form);
          form.submit();
          return;
        }
        if (data.error) {
          alert(data.error);
        }
      } else if (paymentMethod === "bank_transfer") {
        const res = await fetch("/api/bank-transfer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: items.map((item) => ({
              artworkId: item.artwork._id,
              title: item.artwork.title,
              price: getEffectivePrice(item.artwork),
              quantity: item.quantity,
              isSale: isArtworkOnSale(item.artwork),
            })),
            email,
            shippingAddress: address,
          }),
        });

        const data = await res.json();
        if (data.success) {
          window.location.href = `/checkout/success?provider=bank_transfer&ref=${data.orderId}${hasFlashSaleItem ? "&sale=true" : ""}`;
          return;
        }
        if (data.error) {
          alert(data.error);
        }
      } else if (paymentMethod === "cod") {
        const res = await fetch("/api/cod", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: items.map((item) => ({
              artworkId: item.artwork._id,
              title: item.artwork.title,
              price: getEffectivePrice(item.artwork),
              quantity: item.quantity,
              isSale: isArtworkOnSale(item.artwork),
            })),
            email,
            shippingAddress: address,
          }),
        });

        const data = await res.json();
        if (data.success) {
          window.location.href = `/checkout/success?provider=cod&ref=${data.orderId}`;
          return;
        }
        if (data.error) {
          alert(data.error);
        }
      } else {
        alert(
          "JazzCash integration coming soon. Please use card payment, EasyPaisa, or bank transfer."
        );
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  }

  const isPakistan = address.country === "Pakistan";
  const hasFlashSaleItem = items.some((item) => isArtworkOnSale(item.artwork));

  const paymentMethods: {
    id: PaymentMethod;
    label: string;
    description: string;
    icon: React.ReactNode;
    available: boolean;
  }[] = [
    {
      id: "bank_transfer",
      label: "Bank Transfer",
      description: hasFlashSaleItem
        ? "Complete within 5 minutes for flash sale items"
        : "Direct bank deposit",
      icon: <Building2 className="h-5 w-5" />,
      available: true,
    },
    ...(isPakistan && !hasFlashSaleItem
      ? [
          {
            id: "cod" as PaymentMethod,
            label: "Cash on Delivery",
            description: "Pay when your artwork arrives",
            icon: <Truck className="h-5 w-5" />,
            available: true,
          },
        ]
      : []),
    {
      id: "card",
      label: "Credit / Debit Card",
      description: "Visa, Mastercard, Google Pay",
      icon: <CreditCard className="h-5 w-5" />,
      available: false,
    },
    {
      id: "easypaisa",
      label: "EasyPaisa",
      description: "Pay via EasyPaisa mobile account",
      icon: <Smartphone className="h-5 w-5" />,
      available: false,
    },
    {
      id: "jazzcash",
      label: "JazzCash",
      description: "Pay via JazzCash wallet",
      icon: <Smartphone className="h-5 w-5" />,
      available: false,
    },
  ];

  const inputClass =
    "w-full rounded-lg border border-warm-white bg-white px-4 py-3 text-sm text-soft-black placeholder:text-gallery-gray/50 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors";

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <Link
        href="/cart"
        className="inline-flex items-center gap-2 text-sm text-gallery-gray hover:text-soft-black transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Cart
      </Link>

      <h1 className="font-serif text-3xl font-bold text-soft-black mb-10">
        Checkout
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Left - Forms */}
          <div className="lg:col-span-3 space-y-10">
            {/* Contact */}
            <section>
              <h2 className="text-sm font-semibold text-soft-black uppercase tracking-wider mb-4">
                Contact Information
              </h2>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className={inputClass}
              />
            </section>

            {/* Shipping */}
            <section>
              <h2 className="text-sm font-semibold text-soft-black uppercase tracking-wider mb-4">
                Shipping Address
              </h2>
              <div className="space-y-4">
                <input
                  type="text"
                  required
                  value={address.fullName}
                  onChange={(e) =>
                    setAddress({ ...address, fullName: e.target.value })
                  }
                  placeholder="Full name"
                  className={inputClass}
                />
                <input
                  type="text"
                  required
                  value={address.addressLine1}
                  onChange={(e) =>
                    setAddress({ ...address, addressLine1: e.target.value })
                  }
                  placeholder="Address line 1"
                  className={inputClass}
                />
                <input
                  type="text"
                  value={address.addressLine2}
                  onChange={(e) =>
                    setAddress({ ...address, addressLine2: e.target.value })
                  }
                  placeholder="Address line 2 (optional)"
                  className={inputClass}
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    required
                    value={address.city}
                    onChange={(e) =>
                      setAddress({ ...address, city: e.target.value })
                    }
                    placeholder="City"
                    className={inputClass}
                  />
                  <input
                    type="text"
                    required
                    value={address.state}
                    onChange={(e) =>
                      setAddress({ ...address, state: e.target.value })
                    }
                    placeholder="State / Province"
                    className={inputClass}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    required
                    value={address.postalCode}
                    onChange={(e) =>
                      setAddress({ ...address, postalCode: e.target.value })
                    }
                    placeholder="Postal code"
                    className={inputClass}
                  />
                  <select
                    value={address.country}
                    onChange={(e) =>
                      setAddress({ ...address, country: e.target.value })
                    }
                    className={inputClass}
                  >
                    <option value="Pakistan">Pakistan</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="United Arab Emirates">UAE</option>
                    <option value="Canada">Canada</option>
                    <option value="Germany">Germany</option>
                    <option value="France">France</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <input
                  type="tel"
                  required
                  value={address.phone}
                  onChange={(e) =>
                    setAddress({ ...address, phone: e.target.value })
                  }
                  placeholder="Phone number (e.g. +92 300 1234567)"
                  className={inputClass}
                />
              </div>
            </section>

            {/* Payment Method */}
            <section>
              <h2 className="text-sm font-semibold text-soft-black uppercase tracking-wider mb-4">
                Payment Method
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => method.available && setPaymentMethod(method.id)}
                    className={`relative flex items-center gap-3 rounded-lg border p-4 text-left transition-colors ${
                      !method.available
                        ? "border-warm-white text-gallery-gray/50 cursor-not-allowed"
                        : paymentMethod === method.id
                        ? "border-accent bg-accent/5 text-soft-black"
                        : "border-warm-white text-gallery-gray hover:border-accent/50"
                    }`}
                  >
                    {method.icon}
                    <div>
                      <span className="text-sm font-medium block">
                        {method.label}
                      </span>
                      <span className="text-xs text-gallery-gray">
                        {method.description}
                      </span>
                    </div>
                    {!method.available && (
                      <span className="absolute top-2 right-2 text-[10px] bg-warm-white text-gallery-gray px-1.5 py-0.5 rounded-full">
                        Soon
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </section>
          </div>

          {/* Right - Order Summary */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 bg-warm-white rounded-xl p-6 space-y-6">
              <h2 className="text-sm font-semibold text-soft-black uppercase tracking-wider">
                Order Summary
              </h2>

              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.artwork._id} className="flex gap-3">
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                      {item.artwork.image?.asset?._ref ? (
                        <Image
                          src={urlFor(item.artwork.image).width(128).height(128).quality(80).url()}
                          alt={item.artwork.image.alt || item.artwork.title}
                          width={128}
                          height={128}
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
                      <p className="text-sm font-medium text-soft-black truncate">
                        {item.artwork.title}
                      </p>
                      <p className="text-xs text-gallery-gray">
                        {item.artwork.medium}
                      </p>
                    </div>
                    <div className="text-right">
                      {isArtworkOnSale(item.artwork) ? (
                        <>
                          <p className="text-sm font-bold text-red-600">
                            {format(item.artwork.salePrice!)}
                          </p>
                          <p className="text-xs text-gallery-gray line-through">
                            {format(item.artwork.price)}
                          </p>
                        </>
                      ) : (
                        <p className="text-sm font-medium text-soft-black">
                          {format(item.artwork.price)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-4 border-t border-cream">
                <div className="flex justify-between text-sm">
                  <span className="text-gallery-gray">Subtotal</span>
                  <span className="text-soft-black">{format(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gallery-gray">Shipping</span>
                  <span className="text-gallery-gray">
                    {totalPrice >= 500 ? "Free" : "Calculated next"}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-3 border-t border-cream">
                  <span className="text-soft-black">Total</span>
                  <span className="text-soft-black">{format(totalPrice)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-soft-black py-3.5 text-sm font-semibold text-white hover:bg-charcoal disabled:opacity-50 transition-colors"
              >
                <Lock className="h-4 w-4" />
                {isProcessing ? "Processing..." : "Place Order"}
              </button>

              <p className="text-xs text-gallery-gray text-center">
                Payments processed securely. Card and wallet details never
                touch our servers.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
