import { json, EMAIL_RE } from "@/lib/api-helpers";
import { sendMail } from "@/lib/mail";

/**
 * Newsletter signup. Persists nothing itself; logs the address and, when an
 * email transport is configured, sends a welcome note. Wire this to a real
 * list provider (Mailchimp/Resend Audiences/Brevo) by setting env keys.
 */
export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return json({ error: "bad_request", message: "Invalid request." }, { status: 400 });
  }

  if (body.website) return json({ ok: true }); // honeypot

  const email = String(body.email || "").trim();
  if (!email || !EMAIL_RE.test(email)) {
    return json({ error: "validation", fields: { email: "Please enter a valid email address." } }, { status: 422 });
  }

  console.log("[newsletter] subscribe:", email);

  try {
    await sendMail({
      to: email,
      subject: "You're subscribed to RCUK updates",
      text: "Thank you for subscribing to the Rohingya Centre UK newsletter.",
    });
  } catch {
    /* non-fatal */
  }

  return json({ ok: true });
}
