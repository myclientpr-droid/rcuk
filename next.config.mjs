import fs from "node:fs";
import path from "node:path";

/**
 * Legacy WordPress URLs that no longer match our route structure are redirected
 * to their Next.js equivalents. Post slugs are read from the imported data so
 * the old top-level `/<slug>` URLs (e.g. /icj-to-rule-on-...) keep working.
 */
function legacyPostRedirects() {
  try {
    const file = path.join(process.cwd(), "src", "data", "posts.json");
    const posts = JSON.parse(fs.readFileSync(file, "utf8"));
    return posts
      .filter((p) => p.slug)
      .map((p) => ({ source: `/${p.slug}`, destination: `/news/${p.slug}`, permanent: true }));
  } catch {
    return [];
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  async redirects() {
    return [
      // Archive/listing pages
      { source: "/news-and-updates", destination: "/news", permanent: true },
      // The Events Calendar single-event URLs -> our /events section
      { source: "/event/:slug", destination: "/events/:slug", permanent: true },
      { source: "/events/category/:rest*", destination: "/events", permanent: true },
      // xt_project custom post type -> /projects
      { source: "/xt_project/:slug", destination: "/projects/:slug", permanent: true },
      ...legacyPostRedirects(),
    ];
  },
};

export default nextConfig;
