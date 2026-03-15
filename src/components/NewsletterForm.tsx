"use client";

import { useState } from "react";
import { Send } from "lucide-react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Newsletter Subscriber",
          email,
          subject: "Newsletter Signup",
          message: "New newsletter subscription request",
        }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p className="text-success text-sm font-medium">
        Thank you for subscribing! You&apos;ll hear from us soon.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        required
        className="flex-1 rounded-lg border border-warm-white bg-white px-4 py-2.5 text-sm text-soft-black placeholder:text-gallery-gray/50 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-dark disabled:opacity-50 transition-colors"
      >
        <Send className="h-4 w-4" />
        {status === "loading" ? "..." : "Subscribe"}
      </button>
      {status === "error" && (
        <p className="text-error text-xs mt-1">Something went wrong. Please try again.</p>
      )}
    </form>
  );
}
