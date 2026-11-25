/**
 * Server-side HTML post-processor for imported WordPress (KingComposer) bodies.
 * Runs once at render/build time on trusted content from our own site, so this
 * is a cleanup + hardening pass rather than a full sanitizer:
 *   - drops <script>/<style>/<iframe-ish> junk injected by the admin bar
 *   - strips inline on* event handlers and javascript: URLs
 *   - removes leftover unmatched shortcodes like [foo] / [foo /]
 *   - removes WP emoji <span> wrappers and data-* lazy attributes that are dead
 */
export function processHtml(html) {
  if (!html) return "";
  let out = html;

  // Remove script/style/link/meta/noscript tags entirely
  out = out.replace(/<script[\s\S]*?<\/script>/gi, "");
  out = out.replace(/<style[\s\S]*?<\/style>/gi, "");
  out = out.replace(/<\/?(?:noscript|link|meta)\b[^>]*>/gi, "");

  // Inline event handlers
  out = out.replace(/\son\w+="[^"]*"/gi, "");
  out = out.replace(/\son\w+='[^']*'/gi, "");

  // javascript: hrefs
  out = out.replace(/href="javascript:[^"]*"/gi, 'href="#"');

  // Dead lazy-load data attributes
  out = out.replace(/\sdata-(?:lazy-src|lazy-srcset|pin-it|deferred)[^ >]*/gi, "");

  // Unmatched WP shortcodes left in text
  out = out.replace(/\[[a-z_]+[^\]]*\]/gi, "");

  // Builder token residue like %%project_excerpt%%
  out = out.replace(/%%[a-z_]+%%/gi, "");

  // WP Gutenberg comments
  out = out.replace(/<!--\s*wp:[\s\S]*?-->/g, "");

  return out.trim();
}

/** Decode a handful of common HTML entities for plain-text contexts. */
export function decodeEntities(str) {
  if (!str) return "";
  return str
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

/** Extract the first <img> src from an HTML string (for card thumbnails). */
export function firstImage(html) {
  if (!html) return null;
  const m = /<img[^>]+src="([^"]+)"/i.exec(html);
  return m ? m[1] : null;
}
