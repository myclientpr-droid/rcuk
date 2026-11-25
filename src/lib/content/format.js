import { decodeEntities, firstImage } from "./html";

/** "20 Nov 2026" */
export function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** { day, month, year, time } from a WP/tribe datetime string, for date badges. */
export function eventDateParts(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return {
    day: d.toLocaleDateString("en-GB", { day: "2-digit" }),
    month: d.toLocaleDateString("en-GB", { month: "short" }).toUpperCase(),
    year: String(d.getFullYear()),
    time: d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
  };
}

/** Plain-text summary from a post/page: excerpt → content → title. */
export function plainSummary(item, words = 28) {
  const source = item.excerpt || item.content || "";
  // strip leftover builder tokens like %%project_excerpt%% before tag removal
  let text = decodeEntities(source.replace(/%%[a-z_]+%%/gi, "").replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
  if (!text) text = item.title || "";
  const parts = text.split(" ");
  return parts.slice(0, words).join(" ") + (parts.length > words ? "…" : "");
}

/** Best available local image for a post/page. */
export function itemImage(item) {
  if (item?.featured) return item.featured;
  const fromContent = firstImage(item?.content || "");
  return fromContent || null;
}
