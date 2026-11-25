import { readCollection } from "./_data";

export function getCampaigns() {
  return readCollection("campaigns");
}
export function getCampaignBySlug(slug) {
  return getCampaigns().find((c) => c.slug === slug) || null;
}
export function getCampaignSlugs() {
  return getCampaigns().map((c) => c.slug).filter(Boolean);
}
