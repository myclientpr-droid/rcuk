import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail } from "lucide-react";
import NewsletterSignup from "@/components/sections/NewsletterSignup";
import { site, footerLinks } from "@/lib/site";

function LinkColumn({ title, links }) {
  return (
    <div>
      <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">{title}</h3>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.href + l.label}>
            <Link
              href={l.href}
              className="text-sm text-white/70 transition hover:text-rc-gold"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-rc-navy text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        {/* Brand + contact */}
        <div>
          <Link href="/" className="inline-flex items-center">
            <Image
              src="/logos/rcuk-logo.png"
              alt={site.name}
              width={160}
              height={56}
              className="h-12 w-auto rounded"
            />
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-white/70">
            {site.name} — {site.tagline}. Supporting refugees and advancing Rohingya rights
            across the United Kingdom.
          </p>
          <address className="mt-4 space-y-2 text-sm not-italic text-white/70">
            <p className="flex items-start gap-2">
              <MapPin size={16} className="mt-0.5 shrink-0 text-rc-gold" />
              <span>
                {site.address.line1}, {site.address.city} {site.address.postcode},{" "}
                {site.address.country}
              </span>
            </p>
            <p className="flex items-center gap-2">
              <Phone size={16} className="shrink-0 text-rc-gold" />
              <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="hover:text-rc-gold">
                {site.phone}
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Mail size={16} className="shrink-0 text-rc-gold" />
              <a href={`mailto:${site.email}`} className="hover:text-rc-gold">
                {site.email}
              </a>
            </p>
          </address>
          <div className="mt-4 flex flex-wrap gap-2">
            {site.socials.map((s) => (
              <a
                key={s.href}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                title={s.label}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs font-bold transition hover:bg-rc-gold hover:text-rc-navy"
              >
                {s.label.charAt(0)}
              </a>
            ))}
          </div>
        </div>

        <LinkColumn title="Explore" links={footerLinks.explore} />
        <LinkColumn title="Support Us" links={footerLinks.support} />

        {/* Newsletter + legal */}
        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">
            Stay Updated
          </h3>
          <p className="text-sm text-white/70">
            Subscribe for news, statements and events from RCUK.
          </p>
          <NewsletterSignup />
          <h3 className="mt-8 mb-3 text-sm font-bold uppercase tracking-wider text-white">
            Legal
          </h3>
          <ul className="space-y-2">
            {footerLinks.legal.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-white/70 hover:text-rc-gold">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-6 text-center text-xs text-white/60 lg:px-8">
          © {new Date().getFullYear()} {site.legalName} All rights reserved.
        </div>
      </div>
    </footer>
  );
}
