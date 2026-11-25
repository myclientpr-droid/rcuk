import { notFound } from "next/navigation";
import ItemDetailPage from "@/components/shared/ItemDetailPage";
import { getCampaignBySlug, getCampaignSlugs } from "@/lib/content/campaigns";

export function generateStaticParams() {
  return getCampaignSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const campaign = getCampaignBySlug(slug);
  if (!campaign) return {};
  return {
    title: campaign.title,
    description: campaign.excerpt || campaign.title,
  };
}

export default async function CampaignDetail({ params }) {
  const { slug } = await params;
  const campaign = getCampaignBySlug(slug);
  if (!campaign) notFound();

  return (
    <ItemDetailPage
      item={campaign}
      base="/campaigns"
      backLabel="Campaigns"
      kicker="Campaign"
    />
  );
}
