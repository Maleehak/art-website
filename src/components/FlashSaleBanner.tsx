"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, ArrowRight } from "lucide-react";
import type { Artwork } from "@/types";
import { urlFor } from "@/lib/sanity";
import { useCurrency } from "@/context/CurrencyContext";

interface FlashSaleBannerProps {
  artwork: Artwork;
  saleEndTime: number;
}

function useCountdown(endTime: number) {
  const [mounted, setMounted] = useState(false);
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    setMounted(true);
    setRemaining(Math.max(0, endTime - Date.now()));
  }, [endTime]);

  useEffect(() => {
    if (!mounted || remaining <= 0) return;
    const timer = setInterval(() => {
      const left = Math.max(0, endTime - Date.now());
      setRemaining(left);
      if (left <= 0) clearInterval(timer);
    }, 1000);
    return () => clearInterval(timer);
  }, [endTime, mounted, remaining]);

  const totalSeconds = Math.floor(remaining / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { hours, minutes, seconds, expired: mounted && remaining <= 0, mounted };
}

function TimerBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-soft-black/80 backdrop-blur-sm rounded-lg px-3 py-2 sm:px-4 sm:py-3 min-w-[3.2rem] sm:min-w-[4rem]">
        <motion.span
          key={value}
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.25 }}
          className="block text-xl sm:text-2xl lg:text-3xl font-bold text-white tabular-nums text-center"
        >
          {String(value).padStart(2, "0")}
        </motion.span>
      </div>
      <span className="text-[10px] sm:text-xs text-accent-light uppercase tracking-widest mt-1.5 font-medium">
        {label}
      </span>
    </div>
  );
}

export function FlashSaleBanner({ artwork, saleEndTime }: FlashSaleBannerProps) {
  const router = useRouter();
  const { hours, minutes, seconds, expired, mounted } = useCountdown(saleEndTime);
  const { format } = useCurrency();
  const [currentStatus, setCurrentStatus] = useState(artwork.status);

  const pollStatus = useCallback(async () => {
    try {
      const res = await fetch(`/api/artwork-status?id=${artwork._id}`);
      const data = await res.json();
      if (data.status && data.status !== currentStatus) {
        setCurrentStatus(data.status);
        router.refresh();
      }
    } catch {}
  }, [artwork._id, currentStatus, router]);

  useEffect(() => {
    if (currentStatus !== "reserved") return;
    const interval = setInterval(pollStatus, 15000);
    return () => clearInterval(interval);
  }, [currentStatus, pollStatus]);

  if (expired) return null;

  const discount = Math.round(
    ((artwork.price - artwork.salePrice!) / artwork.price) * 100
  );

  const isClaimed = currentStatus === "reserved" || currentStatus === "sold";

  return (
    <AnimatePresence>
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden bg-soft-black"
      >
        {/* Background artwork image with heavy overlay */}
        {artwork.image?.asset?._ref && (
          <div className="absolute inset-0">
            <Image
              src={urlFor(artwork.image).width(1600).height(600).quality(40).url()}
              alt=""
              fill
              className="object-cover opacity-15 blur-sm scale-105"
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-soft-black via-soft-black/95 to-soft-black/80" />
          </div>
        )}

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 lg:gap-12 items-center py-10 sm:py-14 lg:py-16">

            {/* Left: Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center lg:text-left order-2 lg:order-1"
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-accent/20 border border-accent/30 rounded-full px-4 py-1.5 mb-5">
                <span className="relative flex h-2 w-2">
                  {isClaimed ? (
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white/40" />
                  ) : (
                    <>
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-light opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-light" />
                    </>
                  )}
                </span>
                <span className="text-xs sm:text-sm font-semibold text-accent-light uppercase tracking-wider">
                  {isClaimed ? "Sold Out" : "Limited Time Offer"}
                </span>
              </div>

              <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                &ldquo;{artwork.title}&rdquo;
              </h3>
              {artwork.medium && (
                <p className="mt-2 text-sm sm:text-base text-white/40">{artwork.medium}</p>
              )}

              {/* Pricing */}
              <div className="mt-5 flex items-end gap-4 justify-center lg:justify-start">
                <span className={`text-4xl sm:text-5xl font-bold ${isClaimed ? "text-white/40" : "text-white"}`}>
                  {format(artwork.salePrice!)}
                </span>
                <div className="flex flex-col items-start pb-1">
                  <span className="text-sm text-white/30 line-through">
                    {format(artwork.price)}
                  </span>
                  <span className="text-xs font-bold text-accent-light mt-0.5">
                    Save {discount}%
                  </span>
                </div>
              </div>

              {/* Timer */}
              <div className="mt-8">
                <div className="flex items-center gap-2 justify-center lg:justify-start mb-3">
                  <Clock className="h-3.5 w-3.5 text-accent-light" />
                  <span className="text-xs text-white/50 uppercase tracking-widest font-medium">
                    {isClaimed ? "Sale ends in" : "Offer ends in"}
                  </span>
                </div>
                <div className="flex items-start gap-2 sm:gap-3 justify-center lg:justify-start">
                  <TimerBlock value={mounted ? hours : 0} label="Hours" />
                  <span className="text-2xl lg:text-3xl text-white/20 font-light mt-2 sm:mt-3">:</span>
                  <TimerBlock value={mounted ? minutes : 0} label="Min" />
                  <span className="text-2xl lg:text-3xl text-white/20 font-light mt-2 sm:mt-3">:</span>
                  <TimerBlock value={mounted ? seconds : 0} label="Sec" />
                </div>
              </div>

              {isClaimed ? (
                <p className="mt-8 text-sm text-white/40">
                  This piece has been claimed. Browse our{" "}
                  <Link href="/collections" className="text-accent-light underline underline-offset-2 hover:text-accent">
                    collections
                  </Link>{" "}
                  for more artwork.
                </p>
              ) : (
                <Link
                  href={`/artwork/${artwork.slug}`}
                  className="mt-8 inline-flex items-center gap-2.5 rounded-lg bg-white text-soft-black px-8 py-3.5 text-sm font-bold hover:bg-warm-white transition-colors group"
                >
                  Shop This Deal
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              )}
            </motion.div>

            {/* Right: Artwork image */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex justify-center order-1 lg:order-2"
            >
              <Link
                href={`/artwork/${artwork.slug}`}
                className="relative group"
              >
                <div className={`relative w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 xl:w-96 xl:h-96 rounded-2xl overflow-hidden shadow-2xl shadow-black/50 ring-1 ring-white/10 group-hover:ring-white/20 transition-all duration-500 ${isClaimed ? "opacity-60" : ""}`}>
                  {artwork.image?.asset?._ref ? (
                    <Image
                      src={urlFor(artwork.image).width(800).height(800).quality(90).url()}
                      alt={artwork.image.alt || artwork.title}
                      width={800}
                      height={800}
                      className="h-full w-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                      priority
                    />
                  ) : (
                    <div className="h-full w-full bg-charcoal flex items-center justify-center text-white/30 font-serif text-lg">
                      {artwork.title}
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent" />
                  {isClaimed && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <span className="bg-white/90 text-soft-black text-sm font-bold uppercase tracking-widest px-5 py-2 rounded-md">
                        {artwork.status === "sold" ? "Sold" : "Reserved"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Discount badge */}
                <div className={`absolute -top-3 -right-3 text-white text-sm font-bold w-14 h-14 rounded-full flex items-center justify-center shadow-lg ${isClaimed ? "bg-gallery-gray shadow-gray-900/30" : "bg-accent shadow-accent/30"}`}>
                  -{discount}%
                </div>
              </Link>
            </motion.div>

          </div>
        </div>

        {/* Subtle top/bottom border */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
      </motion.section>
    </AnimatePresence>
  );
}
