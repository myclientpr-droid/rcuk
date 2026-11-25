import { notFound } from "next/navigation";
import PageTemplate from "@/components/shared/PageTemplate";
import { getPageBySlug, getPageSlugs } from "@/lib/content/pages";
import { plainSummary } from "@/lib/content/format";

/** Section label shown in the page title band, derived from the slug. */
const BREADCRUMBS = {
  "about-rcuk": "About RCUK",
  "what-we-do": "What We Do",
  "advocacy-human-rights": "What We Do",
  "get-support": "Support",
  "get-involved": "Get Involved",
  "volunteer-opportunities": "Get Involved",
  "become-a-member": "Get Involved",
  "become-a-friend-of-rohingya": "Get Involved",
  "affiliate-to-rcuk": "Get Involved",
  "history-of-the-rohingya": "About the Rohingya",
  "rohingya-culture": "About the Rohingya",
  "language-services": "What We Do",
  "governance-structure": "About RCUK",
  "rohingya-solidarity-campaign": "Campaigns",
  "rsc-guidelines": "Campaigns",
  "rsc-guide-to-strategic-campaigning-for-rohingyas-rights": "Campaigns",
  "help-us-educate-rohingya-children": "Campaigns",
  "visit-arakan-and-refugee-camps-in-bangladesh": "Get Involved",
  "take-action": "Get Involved",
  resources: "Resources",
  "how-to-donate": "Support",
  "donation-successful": "Support",
  faq: "Help",
  "contact-us": "Contact",
  "privacy-notice": "Legal",
  "terms-and-conditions": "Legal",
  "safeguarding-policy": "Legal",
  "complaints-policy": "Legal",
  "equal-opportunities-policy": "Legal",
  "health-and-safety-policy": "Legal",
};

export function generateStaticParams() {
  return getPageSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = getPageBySlug(slug);
  if (!page) return {};
  return {
    title: page.title,
    description: plainSummary(page, 30),
  };
}

export default async function Page({ params }) {
  const { slug } = await params;
  const page = getPageBySlug(slug);
  if (!page) notFound();

  return (
    <PageTemplate
      title={page.title}
      breadcrumb={BREADCRUMBS[slug] || "RCUK"}
      html={page.content}
    />
  );
}
