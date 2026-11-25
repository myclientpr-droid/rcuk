import Link from "next/link";
import PageBand from "@/components/shared/PageBand";
import ItemCard from "@/components/sections/ItemCard";
import { getCampaigns } from "@/lib/content/campaigns";

/** Static WordPress pages that belong to the campaigns section. */
const CAMPAIGN_PAGES = [
  { slug: "rohingya-solidarity-campaign", title: "Rohingya Solidarity Campaign" },
  { slug: "help-us-educate-rohingya-children", title: "Help Us Educate Rohingya Children" },
  { slug: "rsc-guidelines", title: "RSC Guidelines" },
  {
    slug: "rsc-guide-to-strategic-campaigning-for-rohingyas-rights",
    title: "RSC Guide to Strategic Campaigning for Rohingya's Rights",
  },
];

export const metadata = {
  title: "Campaigns",
  description: "RCUK campaigns advocating for the rights and recognition of the Rohingya people.",
};

export default function CampaignsPage() {
  const campaigns = getCampaigns();

  return (
    <div className="page">
      <div className="page-content">
        <PageBand
          kicker="Get Involved"
          title="Campaigns"
          subtitle="Advocacy campaigns fighting for justice, recognition and rights for the Rohingya people."
        />

        {campaigns.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((c) => (
              <ItemCard key={c.slug} item={c} base="/campaigns" />
            ))}
          </div>
        )}

        <section className="mt-12">
          <h2 className="mb-6 text-2xl font-bold text-rc-navy">Campaign Resources & Initiatives</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {CAMPAIGN_PAGES.map((p) => (
              <Link
                key={p.slug}
                href={`/${p.slug}`}
                className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm transition hover:border-rc-red hover:shadow-md"
              >
                <h3 className="font-semibold text-rc-navy">{p.title}</h3>
                <p className="mt-2 inline-block text-sm font-semibold text-rc-red">Read more →</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
