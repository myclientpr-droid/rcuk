import { notFound } from "next/navigation";
import ItemDetailPage from "@/components/shared/ItemDetailPage";
import { getProjectBySlug, getProjectSlugs } from "@/lib/content/projects";
import { plainSummary } from "@/lib/content/format";

export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: plainSummary(project, 30),
  };
}

export default async function ProjectDetail({ params }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <ItemDetailPage
      item={project}
      base="/projects"
      backLabel="Projects"
      kicker="What We Do"
    />
  );
}
