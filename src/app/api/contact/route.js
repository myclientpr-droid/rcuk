import { json, EMAIL_RE } from "@/lib/api-helpers";
import { sendMail } from "@/lib/mail";

/** Naive in-memory throttle to deter spam without extra infra. */
const recent = new Map();
function throttled(ip) {
  const now = Date.now();
  const last = recent.get(ip) || 0;
  if (now - last < 5000) return true; // < 1 submission / 5s / IP
  recent.set(ip, now);
  return false;
}

export async function POST(req) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  let body;
  try {
    body = await req.json();
  } catch {
    return json({ error: "bad_request", message: "Invalid request." }, { status: 400 });
  }

  // Honeypot: silently accept but do nothing if the hidden field is filled.
  if (body.website) return json({ ok: true });

  if (throttled(ip)) {
    return json({ error: "too_many", message: "Please wait a moment before submitting again." }, { status: 429 });
  }

  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim();
  const phone = String(body.phone || "").trim();
  const subject = String(body.subject || "").trim();
  const message = String(body.message || "").trim();

  const errors = {};
  if (!name) errors.name = "Please enter your name.";
  if (!email || !EMAIL_RE.test(email)) errors.email = "Please enter a valid email address.";
  if (!message || message.length < 5) errors.message = "Please enter a message.";
  if (Object.keys(errors).length) return json({ error: "validation", fields: errors }, { status: 422 });

  const text = `From: ${name} <${email}>\nPhone: ${phone || "n/a"}\nSubject: ${subject || "Website enquiry"}\n\n${message}`;
  console.log("[contact] new enquiry\n" + text);

  try {
    await sendMail({
      subject: `[RCUK Contact] ${subject || "Website enquiry"}`,
      text,
    });
  } catch {
    // Never fail the user-facing flow because email transport had an issue.
  }

  return json({ ok: true });
}
