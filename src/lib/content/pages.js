import { readCollection } from "./_data";

/**
 * Slugs handled by dedicated routes (not the generic [slug] page renderer).
 * These are excluded from generateStaticParams to avoid duplicate builds.
 */
export const RESERVED_PAGE_SLUGS = new Set([
  "home", // rendered by src/app/page.js
  "news-and-updates", // rendered by /news listing
  "events", // rendered by /events listing
  "campaigns", // rendered by /campaigns listing
  "contact-us", // rendered by /contact-us (form + details)
  "default", // empty WP helper page
]);

export function getAllPages() {
  return readCollection("pages");
}

export function getPageBySlug(slug) {
  return getAllPages().find((p) => p.slug === slug) || null;
}

export function getPageByPath(pathname) {
  const clean = `/${String(pathname || "").replace(/^\/+/, "").replace(/\/+$/, "")}`;
  return getAllPages().find((p) => p.path.replace(/\/+$/, "") === clean || p.path === clean) || null;
}

/** Slugs for static generation: every page except reserved ones. */
export function getPageSlugs() {
  return getAllPages()
    .filter((p) => p.slug && !RESERVED_PAGE_SLUGS.has(p.slug))
    .map((p) => p.slug);
}
