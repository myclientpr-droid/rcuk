import Link from "next/link";
import Image from "next/image";
import { processHtml } from "@/lib/content/html";

/**
 * Shared detail renderer for imported Projects and Campaigns.
 * Shows a title band, hero image (when present) and the builder HTML body.
 */
export default function ItemDetailPage({ item, base, backLabel, kicker }) {
  const body = processHtml(item.content);
  // Imported CPT items often carry the site logo as og:image; skip it as a hero.
  const hero = item.image && !/logo|cropped|icon/i.test(item.image) ? item.image : null;
  return (
    <div className="page">
      <div className="page-content">
        <section className="mb-8 overflow-hidden rounded-lg bg-rc-navy px-6 py-10 text-white sm:px-10 sm:py-14">
          <p className="text-xs font-semibold uppercase tracking-wider text-rc-gold">{kicker}</p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{item.title}</h1>
        </section>

        <article className="mx-auto max-w-4xl">
          <Link href={base} className="text-sm font-semibold text-rc-red hover:underline">
            ← Back to {backLabel}
          </Link>

          {hero && (
            <div className="relative mt-4 aspect-[16/9] w-full overflow-hidden rounded-lg bg-neutral-100">
              <Image
                src={hero}
                alt={item.title}
                fill
                sizes="(max-width: 896px) 100vw, 896px"
                className="object-cover"
              />
            </div>
          )}

          {body ? (
            <div className="wp-content mt-8" dangerouslySetInnerHTML={{ __html: body }} />
          ) : (
            <div className="mt-8 rounded-lg border border-neutral-200 bg-neutral-50 p-10 text-center text-neutral-500">
              Content for this page is being migrated.
            </div>
          )}
        </article>
      </div>
    </div>
  );
}
