import { siteUrl, json } from "@/lib/api-helpers";
import { site } from "@/lib/site";

/**
 * Creates a Stripe Checkout Session and returns its URL for redirect.
 * Uses Stripe's REST API directly (form-encoded) so no SDK dependency is
 * required. Requires STRIPE_SECRET_KEY; if absent, returns a clear
 * "not configured" response so the UI still builds and runs.
 *
 * body: { amount: number (major units, e.g. 25), frequency: "once"|"monthly", campaign?: string }
 */
export async function POST(req) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return json(
      { error: "not_configured", message: "Donations are not configured yet. Stripe keys are missing." },
      { status: 503 },
    );
  }

  let payload;
  try {
    payload = await req.json();
  } catch {
    return json({ error: "bad_request", message: "Invalid JSON body." }, { status: 400 });
  }

  const amount = Number(payload.amount);
  const frequency = payload.frequency === "monthly" ? "monthly" : "once";
  if (!Number.isFinite(amount) || amount < 1 || amount > 250000) {
    return json({ error: "bad_amount", message: "Please enter a valid donation amount." }, { status: 400 });
  }

  const pence = Math.round(amount * 100);
  const base = siteUrl(req);
  const description =
    frequency === "monthly"
      ? `Monthly donation to ${site.shortName}`
      : `One-time donation to ${site.shortName}`;

  // Build a form-encoded body (Stripe tokenization endpoint requires it).
  const form = new URLSearchParams();
  form.set("mode", frequency === "monthly" ? "subscription" : "payment");
  form.set("success_url", `${base}/donation-successful?session_id={CHECKOUT_SESSION_ID}`);
  form.set("cancel_url", `${base}/donate`);
  form.set(
    "line_items[0][price_data][currency]",
    "gbp",
  );
  form.set("line_items[0][price_data][product_data][name]", description);
  form.set("line_items[0][price_data][product_data][description]", site.name);
  form.set("line_items[0][quantity]", "1");

  if (frequency === "monthly") {
    form.set("line_items[0][price_data][unit_amount]", String(pence));
    form.set("line_items[0][price_data][recurring][interval]", "month");
  } else {
    form.set("line_items[0][price_data][unit_amount]", String(pence));
  }
  // Allow Gift Aid / larger donations via a name field on checkout.
  form.set("billing_address_collection", "auto");
  form.set("client_reference_id", payload.campaign ? `campaign:${payload.campaign}` : "rcuk");

  const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: form.toString(),
    cache: "no-store",
  });

  const session = await res.json();
  if (!res.ok || !session.url) {
    console.error("Stripe checkout session failed:", session?.error?.message);
    return json(
      { error: "stripe_error", message: "We could not start the donation. Please try again." },
      { status: 502 },
    );
  }

  return json({ url: session.url });
}
