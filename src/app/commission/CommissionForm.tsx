"use client";

import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";

export function CommissionForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    description: "",
    budget: "",
    preferredSize: "",
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
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: "Commission Request",
          message: `
Phone: ${formData.phone}
Preferred Size: ${formData.preferredSize}
Budget: ${formData.budget}

Description:
${formData.description}
          `.trim(),
        }),
      });

      if (res.ok) {
        setStatus("success");
        setFormData({
          name: "",
          email: "",
          phone: "",
          description: "",
          budget: "",
          preferredSize: "",
        });
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
          Request Submitted!
        </h3>
        <p className="text-gallery-gray">
          Thank you for your interest in a commission. I&apos;ll review your
          request and get back to you within 48 hours to discuss details.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm font-medium text-accent hover:text-accent-dark transition-colors underline underline-offset-4"
        >
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="c-name" className="block text-sm font-medium text-soft-black mb-2">
            Name
          </label>
          <input
            id="c-name"
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full rounded-lg border border-warm-white bg-white px-4 py-3 text-sm text-soft-black placeholder:text-gallery-gray/50 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="c-email" className="block text-sm font-medium text-soft-black mb-2">
            Email
          </label>
          <input
            id="c-email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full rounded-lg border border-warm-white bg-white px-4 py-3 text-sm text-soft-black placeholder:text-gallery-gray/50 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="c-phone" className="block text-sm font-medium text-soft-black mb-2">
          Phone
        </label>
        <input
          id="c-phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full rounded-lg border border-warm-white bg-white px-4 py-3 text-sm text-soft-black placeholder:text-gallery-gray/50 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
          placeholder="+92 300 1234567"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="c-size" className="block text-sm font-medium text-soft-black mb-2">
            Preferred Size
          </label>
          <select
            id="c-size"
            required
            value={formData.preferredSize}
            onChange={(e) =>
              setFormData({ ...formData, preferredSize: e.target.value })
            }
            className="w-full rounded-lg border border-warm-white bg-white px-4 py-3 text-sm text-soft-black focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
          >
            <option value="">Select size</option>
            <option value='small'>Small (up to 18&quot;)</option>
            <option value='medium'>Medium (18-36&quot;)</option>
            <option value='large'>Large (36&quot;+)</option>
            <option value='custom'>Custom / Not sure</option>
          </select>
        </div>
        <div>
          <label htmlFor="c-budget" className="block text-sm font-medium text-soft-black mb-2">
            Budget Range
          </label>
          <select
            id="c-budget"
            required
            value={formData.budget}
            onChange={(e) =>
              setFormData({ ...formData, budget: e.target.value })
            }
            className="w-full rounded-lg border border-warm-white bg-white px-4 py-3 text-sm text-soft-black focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
          >
            <option value="">Select budget</option>
            <option value="500-1000">$500 - $1,000</option>
            <option value="1000-2500">$1,000 - $2,500</option>
            <option value="2500-5000">$2,500 - $5,000</option>
            <option value="5000+">$5,000+</option>
            <option value="flexible">Flexible / Discuss</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="c-desc" className="block text-sm font-medium text-soft-black mb-2">
          Describe Your Vision
        </label>
        <textarea
          id="c-desc"
          required
          rows={6}
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="w-full rounded-lg border border-warm-white bg-white px-4 py-3 text-sm text-soft-black placeholder:text-gallery-gray/50 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors resize-none"
          placeholder="Tell me about what you're envisioning — subject matter, color palette, mood, where it will hang, and any reference images or inspirations..."
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
        {status === "loading" ? "Submitting..." : "Submit Commission Request"}
      </button>
    </form>
  );
}
