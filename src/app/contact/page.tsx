import type { Metadata } from "next";
import { Mail, MapPin, Instagram } from "lucide-react";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch about commissions, inquiries, or collaborations.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div className="text-center mb-16">
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-soft-black">
          Get in Touch
        </h1>
        <p className="mt-4 text-lg text-gallery-gray max-w-2xl mx-auto">
          Have a question about a piece, interested in a commission, or want to
          discuss a collaboration? I&apos;d love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
        {/* Contact Info */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h2 className="font-serif text-xl font-bold text-soft-black mb-6">
              Contact Information
            </h2>
            <div className="space-y-5">
              <div className="flex gap-4">
                <Mail className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-soft-black">Email</p>
                  <a
                    href="mailto:maleehakhalidart@gmail.com"
                    className="text-sm text-gallery-gray hover:text-accent transition-colors"
                  >
                    maleehakhalidart@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex gap-4">
                <MapPin className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-soft-black">Studio</p>
                  <p className="text-sm text-gallery-gray">
                    Lahore, Pakistan
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <Instagram className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-soft-black">Social</p>
                  <a
                    href="https://www.instagram.com/maleehakhalid_art/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gallery-gray hover:text-accent transition-colors"
                  >
                    @maleehakhalid_art
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-warm-white rounded-xl p-6">
            <h3 className="text-sm font-semibold text-soft-black uppercase tracking-wider mb-3">
              Commissions
            </h3>
            <p className="text-sm text-gallery-gray leading-relaxed">
              Custom commissions are welcome. Please include details about your
              desired size, color palette, subject matter, and budget. Typical
              turnaround is 4-8 weeks depending on complexity.
            </p>
          </div>

          <div className="bg-warm-white rounded-xl p-6">
            <h3 className="text-sm font-semibold text-soft-black uppercase tracking-wider mb-3">
              Shipping
            </h3>
            <p className="text-sm text-gallery-gray leading-relaxed">
              All original paintings are carefully packaged and shipped
              worldwide with full insurance. Free shipping on purchases over
              $500 USD. Typical delivery takes 5-10 business days depending on
              your location.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-3">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
