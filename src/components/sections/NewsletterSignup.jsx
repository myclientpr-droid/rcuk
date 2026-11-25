"use client";

import { useState } from "react";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | submitting | ok | error

  async function onSubmit(e) {
    e.preventDefault();
    if (!email) return;
    setStatus("submitting");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setStatus(res.ok ? "ok" : "error");
      if (res.ok) setEmail("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-4 flex flex-col gap-2 sm:flex-row">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        className="flex-1 rounded border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/50 focus:border-rc-gold focus:outline-none"
      />
      <button
        type="submit"
        disabled={status === "submitting"}
        className="rounded bg-rc-gold px-4 py-2 text-sm font-semibold text-rc-navy transition hover:brightness-105 disabled:opacity-60"
      >
        {status === "submitting" ? "Joining…" : "Subscribe"}
      </button>
      {status === "ok" && <p className="text-xs text-white/70">Thanks for subscribing!</p>}
      {status === "error" && (
        <p className="text-xs text-white/70">Something went wrong. Please try again.</p>
      )}
    </form>
  );
}
