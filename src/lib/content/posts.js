import { readCollection } from "./_data";

export function getAllPosts() {
  // newest first
  return [...readCollection("posts")].sort((a, b) =>
    String(b.date).localeCompare(String(a.date))
  );
}

export function getPostBySlug(slug) {
  return getAllPosts().find((p) => p.slug === slug) || null;
}

export function getPostSlugs() {
  return getAllPosts().map((p) => p.slug).filter(Boolean);
}

export function getRecentPosts(limit = 4) {
  return getAllPosts().slice(0, limit);
}

/** Posts whose category slug matches (used for the Announcements section). */
export function getPostsByCategory(categorySlug) {
  return getAllPosts().filter((p) =>
    (p.categories || []).some((c) => c.slug === categorySlug)
  );
}

/** Same-category posts, excluding the current one. */
export function getRelatedPosts(post, limit = 3) {
  if (!post) return [];
  const catIds = new Set((post.categories || []).map((c) => c.id));
  return getAllPosts()
    .filter((p) => p.slug !== post.slug && (p.categories || []).some((c) => catIds.has(c.id)))
    .slice(0, limit);
}

export function getAllCategories() {
  return readCollection("categories");
}
