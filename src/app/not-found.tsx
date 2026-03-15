import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-24 text-center">
      <h1 className="font-serif text-6xl font-bold text-soft-black mb-4">
        404
      </h1>
      <p className="text-xl text-gallery-gray mb-8">
        This page doesn&apos;t exist — but there&apos;s plenty of art to
        discover.
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
