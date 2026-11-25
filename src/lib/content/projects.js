import { readCollection } from "./_data";

export function getProjects() {
  return readCollection("projects");
}
export function getProjectBySlug(slug) {
  return getProjects().find((p) => p.slug === slug) || null;
}
export function getProjectSlugs() {
  return getProjects().map((p) => p.slug).filter(Boolean);
}
