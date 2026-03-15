import type { Metadata } from "next";
import { CommissionForm } from "./CommissionForm";

export const metadata: Metadata = {
  title: "Commission a Piece",
  description:
    "Request a custom painting commission. Share your vision and I'll bring it to life.",
};

export default function CommissionPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div className="text-center mb-16">
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-soft-black">
          Commission a Piece
        </h1>
        <p className="mt-4 text-lg text-gallery-gray max-w-2xl mx-auto">
          Have a vision for a custom painting? Share your ideas and
          I&apos;ll work with you to create something truly unique for your
          space.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Process Info */}
        <div className="space-y-8">
          <div className="bg-warm-white rounded-xl p-6">
            <h3 className="font-serif text-lg font-bold text-soft-black mb-3">
              How It Works
            </h3>
            <ol className="space-y-4 text-sm text-gallery-gray">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent text-white text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <span>
                  Share your vision — size, colors, subject, and any reference
                  images
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent text-white text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <span>
                  We discuss details and I provide a quote and timeline
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent text-white text-xs font-bold flex items-center justify-center">
                  3
                </span>
                <span>
                  I share progress photos as the piece develops
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent text-white text-xs font-bold flex items-center justify-center">
                  4
                </span>
                <span>
                  Finished painting is carefully shipped to you
                </span>
              </li>
            </ol>
          </div>

          <div className="bg-warm-white rounded-xl p-6">
            <h3 className="text-sm font-semibold text-soft-black uppercase tracking-wider mb-3">
              Pricing Guide
            </h3>
            <div className="space-y-2 text-sm text-gallery-gray">
              <div className="flex justify-between">
                <span>Small (up to 18&quot;)</span>
                <span className="font-medium text-soft-black">From $500</span>
              </div>
              <div className="flex justify-between">
                <span>Medium (18-36&quot;)</span>
                <span className="font-medium text-soft-black">From $1,200</span>
              </div>
              <div className="flex justify-between">
                <span>Large (36&quot;+)</span>
                <span className="font-medium text-soft-black">From $2,500</span>
              </div>
            </div>
            <p className="text-xs text-gallery-gray mt-3">
              Pricing varies based on complexity, medium, and size. A detailed
              quote will be provided after our initial conversation.
            </p>
          </div>

          <div className="bg-warm-white rounded-xl p-6">
            <h3 className="text-sm font-semibold text-soft-black uppercase tracking-wider mb-3">
              Timeline
            </h3>
            <p className="text-sm text-gallery-gray">
              Most commissions are completed within 4-8 weeks. Larger or more
              complex pieces may take longer. Rush orders can be accommodated
              for an additional fee.
            </p>
          </div>
        </div>

        {/* Commission Form */}
        <div className="lg:col-span-2">
          <CommissionForm />
        </div>
      </div>
    </div>
  );
}
