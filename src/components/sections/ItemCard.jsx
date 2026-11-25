import Link from "next/link";
import Image from "next/image";
import { plainSummary } from "@/lib/content/format";

/**
 * Humane "cause / campaign / project" card recreation.
 * Used by both the Projects and Campaigns listings and the home page.
 */
export default function ItemCard({ item, base }) {
  const href = `${base}/${item.slug}`;
  const image = item.image && !/logo|cropped|icon/i.test(item.image) ? item.image : null;
  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm transition hover:shadow-md">
      <Link href={href} className="relative block aspect-[16/10] bg-neutral-100">
        {image ? (
          <Image
            src={image}
            alt={item.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <span className="flex h-full items-center justify-center bg-rc-navy text-4xl font-bold text-white/70">
            RCUK
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 text-base font-semibold leading-snug text-rc-navy">
          <Link href={href} className="hover:text-rc-red">
            {item.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm text-neutral-600">{plainSummary(item)}</p>
        <Link
          href={href}
          className="mt-4 inline-block text-sm font-semibold text-rc-red hover:underline"
        >
          Read more →
        </Link>
      </div>
    </article>
  );
}
