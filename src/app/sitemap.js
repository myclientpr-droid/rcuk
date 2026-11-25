import { getAllPages } from "@/lib/content/pages";
import { getAllPosts } from "@/lib/content/posts";
import { getAllEvents } from "@/lib/content/events";
import { getProjects } from "@/lib/content/projects";
import { getCampaigns } from "@/lib/content/campaigns";

const BASE = (process.env.NEXT_PUBLIC_SITE_URL || "https://rcuk.org.uk").replace(/\/+$/, "");

export default function sitemap() {
  const now = new Date();

  const staticRoutes = [
    "",
    "/news",
    "/events",
    "/campaigns",
    "/projects",
    "/donate",
    "/contact-us",
  ].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  const pages = getAllPages()
    .filter((p) => p.slug && p.slug !== "home" && p.slug !== "default")
    .map((p) => ({
      url: `${BASE}/${p.slug}`,
      lastModified: p.modified ? new Date(p.modified) : now,
      changeFrequency: "monthly",
      priority: 0.6,
    }));

  const posts = getAllPosts().map((p) => ({
    url: `${BASE}/news/${p.slug}`,
    lastModified: p.date ? new Date(p.date) : now,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  const events = getAllEvents().map((e) => ({
    url: `${BASE}/events/${e.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  const projects = getProjects().map((p) => ({
    url: `${BASE}/projects/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const campaigns = getCampaigns().map((c) => ({
    url: `${BASE}/campaigns/${c.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...pages, ...posts, ...events, ...projects, ...campaigns];
}
