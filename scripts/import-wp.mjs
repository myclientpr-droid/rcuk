#!/usr/bin/env node
/**
 * One-time WordPress → static JSON importer for rcuk.org.uk.
 *
 * Pulls pages, posts, categories and media from the public WP REST API,
 * downloads every referenced image into public/wp-media/**, rewrites the
 * rendered HTML to use local asset paths + local internal links, and writes
 * typed JSON into src/data/**.
 *
 * Usage:
 *   node scripts/import-wp.mjs            # default: pages + posts
 *   node scripts/import-wp.mjs pages posts categories
 *
 * Safe to re-run (idempotent): media files are skipped if already downloaded.
 */
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const BASE = "https://rcuk.org.uk";
const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, "src", "data");
const MEDIA_DIR = path.join(ROOT, "public", "wp-media");

const args = process.argv.slice(2);
const targets = args.length ? args : ["pages", "posts"];

let downloads = 0;
let errors = 0;

/** Fetch JSON, following X-WP-TotalPages to collect every item. */
async function fetchAllREST(endpoint, params = {}) {
  const all = [];
  let page = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const url = new URL(`${BASE}/wp-json/wp/v2/${endpoint}`);
    url.searchParams.set("per_page", "100");
    url.searchParams.set("page", String(page));
    url.searchParams.set("_locale", "en");
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

    const res = await fetch(url, { headers: { accept: "application/json" } });
    if (!res.ok) {
      console.warn(`  ! ${url.pathname} -> HTTP ${res.status}`);
      errors++;
      break;
    }
    const json = await res.json();
    if (!Array.isArray(json) || json.length === 0) break;
    all.push(...json);
    const totalPages = Number(res.headers.get("x-wp-totalpages") || 1);
    console.log(`  ${endpoint} page ${page}/${totalPages} (+${json.length})`);
    if (page >= totalPages) break;
    page++;
  }
  return all;
}

/** Map a source_url to a local path string (or null). */
function localFromSourceUrl(sourceUrl) {
  const mapped = toLocalMediaPath(sourceUrl);
  return mapped ? mapped.local : null;
}
function toLocalMediaPath(absoluteUrl) {
  const clean = absoluteUrl.split("?")[0].split("#")[0];
  const marker = "/wp-content/uploads/";
  const idx = clean.indexOf(marker);
  if (idx === -1) return null;
  const rel = clean.slice(idx + marker.length); // e.g. 2024/01/foo.jpeg
  return { rel, local: `/wp-media/${rel}`, disk: path.join(MEDIA_DIR, rel) };
}

/** Find all uploads URLs embedded in an HTML string (http/https/protocol-relative). */
function findMediaUrls(html) {
  const set = new Set();
  if (!html) return set;
  const re = /(?:https?:)?\/\/rcuk\.org\.uk\/wp-content\/uploads\/[^\s"')]+\.(?:jpe?g|png|gif|webp|svg)/gi;
  let m;
  while ((m = re.exec(html))) set.add(m[0]);
  return set;
}

async function downloadMedia(urls) {
  const list = [...urls];
  const queue = [...list];
  const workers = Array.from({ length: 6 }, async () => {
    while (queue.length) {
      const u = queue.shift();
      const mapped = toLocalMediaPath(u);
      if (!mapped) continue;
      await mkdir(path.dirname(mapped.disk), { recursive: true });
      if (existsSync(mapped.disk)) continue;
      try {
        const res = await fetch(u);
        if (!res.ok) {
          console.warn(`  media ${u} -> HTTP ${res.status}`);
          errors++;
          continue;
        }
        const buf = Buffer.from(await res.arrayBuffer());
        await writeFile(mapped.disk, buf);
        downloads++;
        if (downloads % 25 === 0) console.log(`  ...downloaded ${downloads} media files`);
      } catch (e) {
        console.warn(`  media error ${u}: ${e.message}`);
        errors++;
      }
    }
  });
  await Promise.all(workers);
}

/** Rewrite an HTML string to local assets + local internal links. */
function rewriteHtml(html) {
  if (!html) return "";
  let out = html;
  // 1. Absolute uploads -> local /wp-media paths
  out = out.replace(/https?:\/\/rcuk\.org\.uk\/wp-content\/uploads\//g, "/wp-media/");
  // 2. Protocol-relative uploads -> local
  out = out.replace(/\/\/rcuk\.org\.uk\/wp-content\/uploads\//g, "/wp-media/");
  // 3. Strip srcset/sizes so only the (localized) src is used
  out = out.replace(/\s+srcset="[^"]*"/gi, "");
  out = out.replace(/\s+sizes="[^"]*"/gi, "");
  // 4. Internal absolute links -> root-relative (preserves migrated routes)
  out = out.replace(/href="https?:\/\/rcuk\.org\.uk(\/[^"]*)?"/gi, (_m, p1) => `href="${p1 || "/"}"`);
  // 5. Remove emoji/plugin junk classes are left intact for styling hooks
  return out;
}

/** Strip HTML tags to get plain text (for titles). */
function stripTags(html) {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .trim();
}

/** Derive the site path from an absolute WP permalink. */
function pathFromLink(link) {
  try {
    const u = new URL(link);
    return u.pathname.replace(/\/index\.html$/, "");
  } catch {
    return "/";
  }
}

/** Fetch a URL as text. */
async function fetchText(url) {
  const res = await fetch(url, { headers: { accept: "text/html,*/*" } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

/** Read a <meta property|name> content value. */
function metaContent(html, key) {
  const re = new RegExp(
    `<meta[^>]+(?:property|name)="${key}"[^>]+content="([^"]*)"`,
    "i"
  );
  const m = html.match(re) || html.match(new RegExp(`content="([^"]*)"[^>]+(?:property|name)="${key}"`, "i"));
  return m ? m[1] : "";
}

/** First <h1> text. */
function extractH1(html) {
  const m = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  return m ? stripTags(m[1]) : "";
}

/** Pick the largest <article> block (main body) from a rendered page. */
function extractArticle(html) {
  const matches = [...html.matchAll(/<article[^>]*>([\s\S]*?)<\/article>/gi)].map((m) => m[1]);
  if (matches.length === 0) {
    const main = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
    return main ? main[1] : "";
  }
  return matches.sort((a, b) => b.length - a.length)[0];
}

/** Last path segment as slug. */
function lastSegment(u) {
  try {
    const p = new URL(u).pathname.replace(/\/+$/, "");
    return p.split("/").pop();
  } catch {
    return "";
  }
}

/** Import events from The Events Calendar REST API. */
async function importEvents(allMedia) {
  console.log("Importing events (Tribe REST)...");
  const events = [];
  let page = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const url = new URL(`${BASE}/wp-json/tribe/events/v1/events`);
    url.searchParams.set("start_date", "2015-01-01");
    url.searchParams.set("end_date", "2031-12-31");
    url.searchParams.set("per_page", "50");
    url.searchParams.set("page", String(page));
    url.searchParams.set("status", "publish");
    const res = await fetch(url, { headers: { accept: "application/json" } });
    if (!res.ok) {
      console.warn(`  events page ${page} -> HTTP ${res.status}`);
      errors++;
      break;
    }
    const j = await res.json();
    const evs = j.events || [];
    if (!evs.length) break;
    for (const e of evs) {
      const descRaw = e.description?.html || e.excerpt?.html || "";
      findMediaUrls(descRaw).forEach((u) => allMedia.add(u));
      let image = null;
      if (e.image?.url) {
        allMedia.add(e.image.url);
        image = localFromSourceUrl(e.image.url);
      }
      events.push({
        slug: lastSegment(e.url),
        wpId: e.id,
        title: stripTags(e.title || ""),
        path: `/events/${lastSegment(e.url)}`,
        link: e.url,
        start: e.dates?.start?.date || e.start_date,
        end: e.dates?.end?.date || e.end_date,
        timezone: e.dates?.timeline?.timezone || e.timezone,
        cost: e.cost || "",
        venue: e.venue?.venue || "",
        address: e.venue?.address || "",
        city: e.venue?.city || "",
        description: rewriteHtml(descRaw),
        image,
        categories: (e.categories || []).map((c) => ({ name: c.name, slug: c.slug })),
      });
    }
    console.log(`  events page ${page}/${j.total_pages}`);
    if (page >= (j.total_pages || 1)) break;
    page++;
  }
  await writeFile(path.join(DATA_DIR, "events.json"), JSON.stringify(events, null, 2));
  console.log(`events: ${events.length}`);
}

/** Import projects (xt_project) + campaigns by scraping detail HTML. */
async function importProjectsAndCampaigns(allMedia) {
  async function scrapeSet(sitemapUrl, filterRe, kind) {
    const sm = await fetchText(sitemapUrl).catch(() => "");
    const urls = [...new Set((sm.match(new RegExp("https://rcuk\\.org\\.uk/[^<\\s]+", "gi")) || []))]
      .map((u) => u.replace(/\]\]>.*$/, "").replace(/\/+$/, "/"))
      .filter((u) => filterRe.test(u));
    const out = [];
    for (const u of urls) {
      const slug = lastSegment(u);
      if (!slug || slug === kind) continue; // skip the archive index (e.g. /campaigns/)
      try {
        const html = await fetchText(u);
        const article = extractArticle(html);
        findMediaUrls(article).forEach((x) => allMedia.add(x));
        const og = metaContent(html, "og:image");
        let image = null;
        if (og) {
          allMedia.add(og);
          image = toLocalMediaPath(og)?.local || null;
        }
        out.push({
          slug,
          title: extractH1(html) || slug,
          path: `/${kind}/${slug}`,
          link: u,
          excerpt: metaContent(html, "og:description"),
          content: rewriteHtml(article),
          image,
        });
        console.log(`  ${kind}/${slug} ok`);
      } catch (e) {
        console.warn(`  ${kind}/${slug} FAILED ${e.message}`);
        errors++;
      }
    }
    await writeFile(path.join(DATA_DIR, `${kind}.json`), JSON.stringify(out, null, 2));
    console.log(`${kind}: ${out.length}`);
  }

  console.log("Importing projects...");
  await scrapeSet(`${BASE}/xt_project-sitemap.xml`, /\/xt_project\//, "projects");

  console.log("Importing campaigns...");
  await scrapeSet(`${BASE}/campaign-sitemap.xml`, /\/campaigns\//, "campaigns");
}


async function main() {
  await mkdir(DATA_DIR, { recursive: true });
  await mkdir(MEDIA_DIR, { recursive: true });

  let categories = [];
  if (targets.includes("categories") || targets.includes("posts")) {
    categories = await fetchAllREST("categories");
    await writeFile(path.join(DATA_DIR, "categories.json"), JSON.stringify(categories, null, 2));
    console.log(`categories: ${categories.length}`);
  }

  const allMedia = new Set();

  if (targets.includes("pages")) {
    console.log("Importing pages...");
    const raw = await fetchAllREST("pages", { _embed: "1" });
    const pages = raw.map((p) => {
      // collect media from the ORIGINAL html before rewriting
      findMediaUrls(p.content?.rendered || "").forEach((u) => allMedia.add(u));
      findMediaUrls(p.excerpt?.rendered || "").forEach((u) => allMedia.add(u));
      const content = rewriteHtml(p.content?.rendered || "");
      const excerpt = rewriteHtml(p.excerpt?.rendered || "");
      const media = p._embedded?.["wp:featuredmedia"]?.[0];
      let featured = null;
      let featuredAlt = "";
      if (media?.source_url) {
        allMedia.add(media.source_url);
        featured = localFromSourceUrl(media.source_url);
        featuredAlt = stripTags(media.alt_text || "");
      }
      return {
        slug: p.slug,
        wpId: p.id,
        title: stripTags(p.title?.rendered || ""),
        path: pathFromLink(p.link),
        link: p.link,
        date: p.date,
        modified: p.modified,
        excerpt,
        content,
        featuredMediaId: p.featured_media || 0,
        featured,
        featuredAlt,
      };
    });
    await writeFile(path.join(DATA_DIR, "pages.json"), JSON.stringify(pages, null, 2));
    console.log(`pages: ${pages.length}`);
  }

  if (targets.includes("posts")) {
    console.log("Importing posts...");
    const raw = await fetchAllREST("posts", { _embed: "1" });
    const catById = new Map(categories.map((c) => [c.id, { id: c.id, name: c.name, slug: c.slug, link: pathFromLink(c.link) }]));
    const posts = raw.map((p) => {
      findMediaUrls(p.content?.rendered || "").forEach((u) => allMedia.add(u));
      findMediaUrls(p.excerpt?.rendered || "").forEach((u) => allMedia.add(u));
      const content = rewriteHtml(p.content?.rendered || "");
      const excerpt = rewriteHtml(p.excerpt?.rendered || "");
      // featured image from _embedded if present
      const media = p._embedded?.["wp:featuredmedia"]?.[0];
      let featuredLocal = null;
      let featuredAlt = "";
      if (media?.source_url) {
        allMedia.add(media.source_url);
        featuredLocal = localFromSourceUrl(media.source_url);
        featuredAlt = stripTags(media.alt_text || media.title?.rendered || "");
      }
      return {
        slug: p.slug,
        wpId: p.id,
        title: stripTags(p.title?.rendered || ""),
        path: pathFromLink(p.link),
        link: p.link,
        date: p.date,
        modified: p.modified,
        excerpt,
        content,
        categories: (p.categories || []).map((id) => catById.get(id)).filter(Boolean),
        featuredMediaId: p.featured_media || 0,
        featured: featuredLocal,
        featuredAlt,
      };
    });
    await writeFile(path.join(DATA_DIR, "posts.json"), JSON.stringify(posts, null, 2));
    console.log(`posts: ${posts.length}`);
  }

  if (targets.includes("events")) {
    await importEvents(allMedia);
  }

  if (targets.includes("projects") || targets.includes("campaigns")) {
    await importProjectsAndCampaigns(allMedia);
  }

  console.log(`Downloading ${allMedia.size} unique media files...`);
  await downloadMedia(allMedia);

  // Resolve any featured images not covered by _embed (pages / posts w/o embed)
  console.log("Done.");
  console.log(`media downloaded: ${downloads}, errors: ${errors}`);
}

main().catch((e) => {
  console.error("IMPORT FAILED:", e);
  process.exit(1);
});
