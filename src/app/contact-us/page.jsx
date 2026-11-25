import PageBand from "@/components/shared/PageBand";
import ContactForm from "@/components/forms/ContactForm";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { site } from "@/lib/site";

export const metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the Rohingya Centre of United Kingdom. Questions, support and partnership enquiries.",
};

export default function ContactUsPage() {
  const { address } = site;
  return (
    <div className="page">
      <div className="page-content">
        <PageBand
          kicker="Get Involved"
          title="Get in Touch"
          subtitle="Thank you for reaching out to RCUK. Please complete the form below and we'll direct your query to the right team."
        />

        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          {/* Details */}
          <aside className="space-y-4">
            <div className="rounded-lg border border-neutral-200 bg-white p-6">
              <h2 className="text-lg font-bold text-rc-navy">Contact details</h2>
              <ul className="mt-4 space-y-4 text-sm text-neutral-700">
                <li className="flex gap-3">
                  <MapPin size={18} className="mt-0.5 shrink-0 text-rc-red" />
                  <span>
                    {address.line1}
                    <br />
                    {address.city}, {address.postcode}
                    <br />
                    {address.country}
                  </span>
                </li>
                <li className="flex gap-3">
                  <Mail size={18} className="mt-0.5 shrink-0 text-rc-red" />
                  <a href={`mailto:${site.email}`} className="hover:text-rc-red">
                    {site.email}
                  </a>
                </li>
                <li className="flex gap-3">
                  <Phone size={18} className="mt-0.5 shrink-0 text-rc-red" />
                  <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="hover:text-rc-red">
                    {site.phone}
                  </a>
                </li>
                <li className="flex gap-3">
                  <Clock size={18} className="mt-0.5 shrink-0 text-rc-red" />
                  <span>Mon–Fri, 9:30–16:30 (UK time)</span>
                </li>
              </ul>
            </div>

            <div className="rounded-lg border border-neutral-200 bg-rc-light p-6 text-sm text-neutral-700">
              <p className="font-semibold text-rc-navy">Safeguarding</p>
              <p className="mt-1">
                Concerns about the safety or wellbeing of a child or vulnerable adult? Report them
                through our{" "}
                <a href="/safeguarding-policy" className="font-semibold text-rc-red hover:underline">
                  Safeguarding Policy
                </a>
                .
              </p>
            </div>
          </aside>

          {/* Form */}
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
