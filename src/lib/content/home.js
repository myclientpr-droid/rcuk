import { readCollection } from "./_data";
import { getRecentPosts } from "./posts";
import { getCampaigns } from "./campaigns";
import { getAllEvents, getUpcomingEvents } from "./events";

function strip(html) {
  return (html || "")
    .replace(/<[^>]+>/g, "")
    .replace(/&#8217;|&#039;|&apos;|&#39;/g, "'")
    .replace(/&#8211;/g, "–")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getHomeHtml() {
  const home = readCollection("pages").find((p) => p.slug === "home");
  return home?.content || "";
}

/** Parse the header-slider slides out of the imported home HTML. */
export function getHomeSlides() {
  const html = getHomeHtml();
  const slides = [];
  const anchors = [...html.matchAll(/background-image:url\(([^)]+)\)"\s+class="item"/g)];
  anchors.forEach((m, i) => {
    const start = m.index;
    const end = anchors[i + 1] ? anchors[i + 1].index : start + 1200;
    const block = html.slice(start, end);
    const title = strip(block.match(/<h2[^>]*>([\s\S]*?)<\/h2>/)?.[1]);
    const text = strip(block.match(/<p[^>]*>([\s\S]*?)<\/p>/)?.[1]);
    const cta = block.match(/<a href="([^"]+)" class="slide-btn[^>]*>([\s\S]*?)<\/a>/);
    slides.push({
      image: m[1],
      title,
      text,
      href: cta ? cta[1] : "/get-involved",
      label: cta ? strip(cta[2]) : "Get Involved",
    });
  });
  return slides;
}

/** Curated service/section cards (mirrors home "Our Services and Opportunities"). */
export function getHomeServices() {
  return [
    {
      title: "Get Support",
      text: "Practical help for refugees and local communities — welfare, advice, language services and more.",
      href: "/get-support",
    },
    {
      title: "What We Do",
      text: "Advocacy, education, employment and community programmes advancing Rohingya rights.",
      href: "/what-we-do",
    },
    {
      title: "Get Involved",
      text: "Volunteer, partner, fundraise or campaign with the Rohingya Centre UK.",
      href: "/get-involved",
    },
  ];
}

/**
 * Parse the "In Collaboration With Our Partners" logo carousel out of the
 * imported home HTML. Returns unique local logo paths with names.
 */
export function getHomePartners() {
  const html = getHomeHtml();
  const idx = html.toLowerCase().indexOf("in collaboration");
  if (idx === -1) return [];
  // The logos are followed by an inline <style> for the carousel; stop there.
  let end = html.indexOf("<style", idx);
  if (end === -1 || end - idx > 8000) end = idx + 8000;
  const block = html.slice(idx, end);

  const seen = new Set();
  const partners = [];
  for (const tag of block.matchAll(/<img\b[^>]*>/gi)) {
    const t = tag[0];
    const src = (t.match(/\bsrc="([^"]+)"/i) || [])[1];
    const alt = (t.match(/\balt="([^"]*)"/i) || [])[1] || "";
    if (!src || !src.startsWith("/wp-media")) continue;
    if (seen.has(src)) continue;
    seen.add(src);
    let name = strip(alt);
    if (!name || /^images?$/i.test(name)) {
      name = src
        .split("/")
        .pop()
        .replace(/\.(png|jpe?g|gif|webp|svg)$/i, "")
        .replace(/[-_]/g, " ")
        .trim();
    }
    partners.push({ src, name });
  }
  return partners;
}

/**
 * The two intro feature cards from the home hero band
 * ("Supporting Local Communities" / "Advancing Rohingya Rights Through Advocacy").
 * Copy is the faithful migrated source text; links point to migrated routes.
 */
export function getHomeIntroCards() {
  return [
    {
      title: "Supporting Local Communities",
      text: "Helping refugees and local communities in the UK through social inclusion, education, housing, digital access, employment opportunities, and community support.",
      href: "/get-support",
      cta: "Get Support",
    },
    {
      title: "Advancing Rohingya Rights Through Advocacy",
      text: "Representing Rohingya voices globally through advocacy, partnerships, and systemic change for dignity and unity.",
      href: "/advocacy-human-rights",
      cta: "Join Our Advocacy",
    },
  ];
}

/** Current appeals — the campaign(s) RCUK is running, used on the home page. */
export function getHomeAppeals(limit = 3) {
  return getCampaigns().slice(0, limit);
}

/** Upcoming events, falling back to the most recent when nothing is scheduled. */
export function getHomeEvents(limit = 3) {
  const upcoming = getUpcomingEvents(limit);
  if (upcoming.length) return { events: upcoming.slice(0, limit), upcoming: true };
  const recent = [...getAllEvents()]
    .sort((a, b) => new Date(b.start) - new Date(a.start))
    .slice(0, limit);
  return { events: recent, upcoming: false };
}

/** Everything the home page needs, assembled from imported data. */
export function getHomeData() {
  return {
    slides: getHomeSlides(),
    intro: getHomeIntroCards(),
    services: getHomeServices(),
    appeals: getHomeAppeals(),
    events: getHomeEvents(),
    news: getRecentPosts(4),
    partners: getHomePartners(),
  };
}
