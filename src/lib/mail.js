import { site } from "@/lib/site";

/**
 * Best-effort email transport. Uses Resend's REST API when RESEND_API_KEY is
 * configured; otherwise it just logs to the server console so form flows work
 * end-to-end in dev and static previews without any third-party account.
 * Returns true if an email was actually sent.
 */
export async function sendMail({ to, subject, text, html }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.MAIL_FROM || `${site.shortName} <onboarding@resend.dev>`;
  const recipient = to || process.env.CONTACT_EMAIL || site.email;

  if (!apiKey) {
    console.log("[mail:not-configured] would send", { subject, to: recipient, text });
    return false;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to: [recipient], subject, text, html }),
    cache: "no-store",
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("[mail:error]", err);
    return false;
  }
  return true;
}
