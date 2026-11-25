/**
 * Shared helpers for the API routes.
 */

/** Absolute base URL for building Stripe redirect URLs. */
export function siteUrl(req) {
  const env = process.env.NEXT_PUBLIC_SITE_URL;
  if (env) return env.replace(/\/+$/, "");
  const host = req.headers.get("host") || "localhost:3000";
  const proto = req.headers.get("x-forwarded-proto") || "http";
  return `${proto}://${host}`.replace(/\/+$/, "");
}

export function json(data, init = {}) {
  return Response.json(data, init);
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
