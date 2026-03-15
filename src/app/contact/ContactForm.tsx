"use client";

import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="bg-warm-white rounded-xl p-12 text-center">
        <CheckCircle className="h-12 w-12 text-success mx-auto mb-4" />
        <h3 className="font-serif text-xl font-bold text-soft-black mb-2">
          Message Sent!
        </h3>
        <p className="text-gallery-gray">
          Thank you for reaching out. I&apos;ll get back to you within 24-48
          hours.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm font-medium text-accent hover:text-accent-dark transition-colors underline underline-offset-4"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-soft-black mb-2"
          >
            Name
          </label>
          <input
            id="name"
            type="text"
            required
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            className="w-full rounded-lg border border-warm-white bg-white px-4 py-3 text-sm text-soft-black placeholder:text-gallery-gray/50 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
            placeholder="Your name"
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-soft-black mb-2"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full rounded-lg border border-warm-white bg-white px-4 py-3 text-sm text-soft-black placeholder:text-gallery-gray/50 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="subject"
          className="block text-sm font-medium text-soft-black mb-2"
        >
          Subject
        </label>
        <select
          id="subject"
          required
          value={formData.subject}
          onChange={(e) =>
            setFormData({ ...formData, subject: e.target.value })
          }
          className="w-full rounded-lg border border-warm-white bg-white px-4 py-3 text-sm text-soft-black focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
        >
          <option value="">Select a subject</option>
          <option value="artwork-inquiry">Artwork Inquiry</option>
          <option value="commission">Commission Request</option>
          <option value="shipping">Shipping Question</option>
          <option value="collaboration">Collaboration</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-soft-black mb-2"
        >
          Message
        </label>
        <textarea
          id="message"
          required
          rows={6}
          value={formData.message}
          onChange={(e) =>
            setFormData({ ...formData, message: e.target.value })
          }
          className="w-full rounded-lg border border-warm-white bg-white px-4 py-3 text-sm text-soft-black placeholder:text-gallery-gray/50 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors resize-none"
          placeholder="Tell me about your inquiry..."
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-error">
          Something went wrong. Please try again or email directly.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="flex items-center gap-2 rounded-lg bg-soft-black px-8 py-3.5 text-sm font-semibold text-white hover:bg-charcoal disabled:opacity-50 transition-colors"
      >
        <Send className="h-4 w-4" />
        {status === "loading" ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
