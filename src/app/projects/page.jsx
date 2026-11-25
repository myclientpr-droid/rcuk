import PageBand from "@/components/shared/PageBand";
import ItemCard from "@/components/sections/ItemCard";
import { getProjects } from "@/lib/content/projects";

export const metadata = {
  title: "Projects",
  description:
    "Community-led projects by the Rohingya Centre of UK supporting education, resilience and human rights.",
};

export default function ProjectsPage() {
  const projects = getProjects();

  return (
    <div className="page">
      <div className="page-content">
        <PageBand
          kicker="What We Do"
          title="Our Projects"
          subtitle="Community-led initiatives by RCUK supporting education, resilience and human rights."
        />

        {projects.length === 0 ? (
          <p className="py-10 text-center text-neutral-500">No projects listed yet.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <ItemCard key={p.slug} item={p} base="/projects" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
