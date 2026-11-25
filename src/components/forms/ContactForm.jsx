"use client";

import { useState } from "react";

const FIELD =
  "mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-rc-red";

/**
 * Contact enquiry form → POST /api/contact. Includes a honeypot field for
 * spam deterrence and inline validation surfaced from the API.
 */
export default function ContactForm() {
  const [values, setValues] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | submitting | ok | error
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  function update(key) {
    return (e) => setValues((v) => ({ ...v, [key]: e.target.value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setStatus("submitting");
    setErrors({});
    setMessage("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setStatus("ok");
        setValues({ name: "", email: "", phone: "", subject: "", message: "" });
        return;
      }
      if (data.error === "validation") {
        setErrors(data.fields || {});
        setStatus("error");
      } else {
        setStatus("error");
        setMessage(data.message || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  if (status === "ok") {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center">
        <p className="text-lg font-semibold text-green-800">Thank you — your message has been sent.</p>
        <p className="mt-1 text-sm text-green-700">We'll get back to you as soon as we can.</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-4 text-sm font-semibold text-rc-red hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-neutral-700">Full name *</span>
          <input className={FIELD} value={values.name} onChange={update("name")} required />
          {errors.name && <span className="mt-1 block text-xs text-rc-red">{errors.name}</span>}
        </label>
        <label className="block">
          <span className="text-sm font-medium text-neutral-700">Email *</span>
          <input type="email" className={FIELD} value={values.email} onChange={update("email")} required />
          {errors.email && <span className="mt-1 block text-xs text-rc-red">{errors.email}</span>}
        </label>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-neutral-700">Phone</span>
          <input className={FIELD} value={values.phone} onChange={update("phone")} />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-neutral-700">Subject</span>
          <input className={FIELD} value={values.subject} onChange={update("subject")} />
        </label>
      </div>

      <label className="mt-4 block">
        <span className="text-sm font-medium text-neutral-700">Message *</span>
        <textarea rows={5} className={FIELD} value={values.message} onChange={update("message")} required />
        {errors.message && <span className="mt-1 block text-xs text-rc-red">{errors.message}</span>}
      </label>

      {/* Honeypot (hidden from humans) */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
        onChange={() => {}}
      />

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-6 w-full rounded-md bg-rc-red py-3 text-base font-bold text-white transition hover:brightness-110 disabled:opacity-60 sm:w-auto sm:px-10"
      >
        {status === "submitting" ? "Sending…" : "Send message"}
      </button>

      {status === "error" && message && (
        <p className="mt-3 rounded bg-rc-light px-3 py-2 text-sm text-rc-red">{message}</p>
      )}
    </form>
  );
}
