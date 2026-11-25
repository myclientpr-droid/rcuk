import Link from "next/link";
import { processHtml } from "@/lib/content/html";

/**
 * Shared template for every migrated WordPress page.
 * Renders a humane-style coloured title band (with breadcrumb) followed by the
 * page-builder HTML body styled through the `.wp-content` layer.
 */
export default function PageTemplate({ title, breadcrumb = "About", html }) {
  const body = processHtml(html);
  return (
    <div className="page">
      <div className="page-content">
        {/* Title band */}
        <section className="mb-8 overflow-hidden rounded-lg bg-rc-navy px-6 py-10 text-white sm:px-10 sm:py-14">
          <p className="text-xs font-semibold uppercase tracking-wider text-rc-gold">
            {breadcrumb}
          </p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{title}</h1>
        </section>

        {/* Body */}
        {body ? (
          <article
            className="wp-content mx-auto max-w-4xl"
            dangerouslySetInnerHTML={{ __html: body }}
          />
        ) : (
          <div className="mx-auto max-w-3xl rounded-xl border border-neutral-200 bg-rc-light p-10 text-center">
            <div className="mx-auto mb-5 h-1 w-16 rounded bg-rc-red" />
            <h2 className="text-xl font-bold text-rc-navy">
              We&rsquo;re building this section
            </h2>
            <p className="mx-auto mt-3 max-w-xl leading-relaxed text-neutral-600">
              This page is part of our ongoing work to expand the information we share.
              Our team is on hand to help in the meantime — get in touch and we&rsquo;ll
              be glad to assist.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link
                href="/contact-us"
                className="inline-flex items-center rounded bg-rc-red px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:brightness-95"
              >
                Contact us
              </Link>
              <Link
                href="/donate"
                className="inline-flex items-center rounded border border-rc-navy px-6 py-3 text-sm font-bold uppercase tracking-wide text-rc-navy transition hover:bg-rc-navy hover:text-white"
              >
                Support our work
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
