import { readCollection } from "./_data";

function byStartDesc(list) {
  return [...list].sort((a, b) => String(b.start).localeCompare(String(a.start)));
}

export function getAllEvents() {
  return byStartDesc(readCollection("events"));
}

export function getEventBySlug(slug) {
  return getAllEvents().find((e) => e.slug === slug) || null;
}

export function getEventSlugs() {
  return getAllEvents().map((e) => e.slug).filter(Boolean);
}

export function getUpcomingEvents(limit = 50) {
  const now = new Date().toISOString();
  return getAllEvents()
    .filter((e) => String(e.start) >= now)
    .sort((a, b) => String(a.start).localeCompare(String(b.start)))
    .slice(0, limit);
}

export function getPastEvents(limit = 50) {
  const now = new Date().toISOString();
  return getAllEvents()
    .filter((e) => String(e.start) < now)
    .slice(0, limit);
}
