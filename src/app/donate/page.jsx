import PageBand from "@/components/shared/PageBand";
import DonationForm from "@/components/forms/DonationForm";
import { getCampaignBySlug } from "@/lib/content/campaigns";
import { site } from "@/lib/site";

export const metadata = {
  title: "Donate",
  description:
    "Support the Rohingya community. Make a secure one-time or monthly donation to RCUK.",
};

export default async function DonatePage({ searchParams }) {
  const sp = await searchParams;
  const campaign = sp?.campaign ? getCampaignBySlug(sp.campaign) : null;

  return (
    <div className="page">
      <div className="page-content">
        <PageBand
          kicker="Support Us"
          title="Donate"
          subtitle="Your gift helps us rebuild communities and hope for Rohingya families in the UK and abroad."
        />

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            {campaign && (
              <div className="mb-4 rounded-lg border-l-4 border-rc-red bg-rc-light px-4 py-3 text-sm">
                Supporting campaign:{" "}
                <span className="font-semibold text-rc-navy">{campaign.title}</span>
              </div>
            )}
            <DonationForm campaign={campaign?.slug} />
          </div>

          <aside className="space-y-6">
            <div className="rounded-lg border border-neutral-200 bg-white p-6">
              <h2 className="text-lg font-bold text-rc-navy">Why donate?</h2>
              <ul className="mt-3 space-y-2 text-sm text-neutral-600">
                <li>• Funds education, advocacy and community projects.</li>
                <li>• Supports newly arrived Rohingya families across the UK.</li>
                <li>• 100% goes towards our charitable mission.</li>
              </ul>
            </div>

            <div className="rounded-lg border border-neutral-200 bg-white p-6">
              <h2 className="text-lg font-bold text-rc-navy">Gift Aid</h2>
              <p className="mt-2 text-sm text-neutral-600">
                As a registered body ({site.charityNumber}), we can reclaim tax on eligible UK
                donations at no extra cost to you. You can tick the Gift Aid box during checkout.
              </p>
            </div>

            <div className="rounded-lg border border-neutral-200 bg-rc-light p-6">
              <h2 className="text-lg font-bold text-rc-navy">Other ways to give</h2>
              <p className="mt-2 text-sm text-neutral-600">
                Bank transfer, membership or in-kind support — see{" "}
                <a href="/how-to-donate" className="font-semibold text-rc-red hover:underline">
                  How to Donate
                </a>{" "}
                or <a href="/contact-us" className="font-semibold text-rc-red hover:underline">contact us</a>.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
