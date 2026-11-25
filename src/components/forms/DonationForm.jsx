"use client";

import { useState } from "react";

const PRESETS = [10, 25, 50, 100];

/**
 * Humane-style donation form. Collects an amount + frequency and hands off to
 * Stripe Checkout via POST /api/donate. When Stripe keys are absent the API
 * returns 503 and we show a friendly "coming soon" notice instead of failing.
 */
export default function DonationForm({ campaign }) {
  const [frequency, setFrequency] = useState("once"); // once | monthly
  const [amount, setAmount] = useState(25);
  const [custom, setCustom] = useState("");
  const [status, setStatus] = useState("idle"); // idle | submitting | error
  const [message, setMessage] = useState("");

  const effectiveAmount = custom ? Number(custom) : Number(amount);

  async function onSubmit(e) {
    e.preventDefault();
    if (!Number.isFinite(effectiveAmount) || effectiveAmount < 1) {
      setStatus("error");
      setMessage("Please choose or enter a valid amount.");
      return;
    }
    setStatus("submitting");
    setMessage("");
    try {
      const res = await fetch("/api/donate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ amount: effectiveAmount, frequency, campaign }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.url) {
        window.location.href = data.url;
        return;
      }
      setStatus("error");
      setMessage(
        data.error === "not_configured"
          ? "Online donations are being set up. Please check back soon or contact us to give."
          : data.message || "We could not start your donation. Please try again.",
      );
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
      {/* Frequency toggle */}
      <div className="mb-5 grid grid-cols-2 gap-2 rounded-lg bg-rc-light p-1">
        {[
          { id: "once", label: "One-time" },
          { id: "monthly", label: "Monthly" },
        ].map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => setFrequency(opt.id)}
            aria-pressed={frequency === opt.id}
            className={`rounded-md py-2 text-sm font-semibold transition ${
              frequency === opt.id ? "bg-rc-red text-white shadow" : "text-neutral-600 hover:text-rc-red"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Preset amounts */}
      <div className="grid grid-cols-4 gap-2">
        {PRESETS.map((p) => {
          const active = !custom && Number(amount) === p;
          return (
            <button
              key={p}
              type="button"
              onClick={() => {
                setAmount(p);
                setCustom("");
              }}
              className={`rounded-md border py-3 text-sm font-bold transition ${
                active
                  ? "border-rc-red bg-rc-red text-white"
                  : "border-neutral-300 bg-white text-rc-navy hover:border-rc-red"
              }`}
            >
              £{p}
            </button>
          );
        })}
      </div>

      {/* Custom amount */}
      <label className="mt-4 block">
        <span className="text-sm font-medium text-neutral-700">Or enter another amount</span>
        <div className="mt-1 flex items-center rounded-md border border-neutral-300 focus-within:border-rc-red">
          <span className="px-3 text-neutral-500">£</span>
          <input
            type="number"
            min="1"
            step="1"
            inputMode="numeric"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            placeholder="Other amount"
            className="w-full py-2 pr-3 outline-none"
          />
        </div>
      </label>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-6 w-full rounded-md bg-rc-red py-3 text-base font-bold text-white transition hover:brightness-110 disabled:opacity-60"
      >
        {status === "submitting"
          ? "Redirecting…"
          : `Donate £${Number.isFinite(effectiveAmount) ? effectiveAmount : ""}${
              frequency === "monthly" ? " / month" : ""
            }`}
      </button>

      <p className="mt-3 text-center text-xs text-neutral-500">
        Secure payment powered by Stripe. Gift Aid eligible.
      </p>

      {status === "error" && message && (
        <p className="mt-3 rounded bg-rc-light px-3 py-2 text-center text-sm text-rc-red">{message}</p>
      )}
    </form>
  );
}
