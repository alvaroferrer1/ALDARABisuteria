"use client";

import { useState } from "react";

export function NewsletterPreferenceToggle({ email, initiallySubscribed }: { email: string; initiallySubscribed: boolean }) {
  const [subscribed, setSubscribed] = useState(initiallySubscribed);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    try {
      if (subscribed) {
        await fetch(`/api/newsletter?email=${encodeURIComponent(email)}`, { method: "DELETE" });
        setSubscribed(false);
      } else {
        await fetch("/api/newsletter", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        setSubscribed(true);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      aria-pressed={subscribed}
      className={`relative h-7 w-12 shrink-0 rounded-full transition-colors disabled:opacity-50 ${subscribed ? "bg-terracotta" : "bg-line"}`}
    >
      <span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-transform ${subscribed ? "translate-x-6" : "translate-x-1"}`} />
    </button>
  );
}
