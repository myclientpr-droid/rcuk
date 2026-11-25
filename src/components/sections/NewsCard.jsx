import Link from "next/link";
import Image from "next/image";
import { formatDate, plainSummary, itemImage } from "@/lib/content/format";

/** A single news/announcement card (humane "news-style-two" recreation). */
export default function NewsCard({ post }) {
  const image = itemImage(post);
  const category = post.categories?.[0];
  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm transition hover:shadow-md">
      <Link href={`/news/${post.slug}`} className="relative block aspect-[16/10] bg-neutral-100">
        {image ? (
          <Image
            src={image}
            alt={post.featuredAlt || post.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <span className="flex h-full items-center justify-center bg-rc-navy text-4xl font-bold text-white/70">
            RCUK
          </span>
        )}
        {category && (
          <span className="absolute left-3 top-3 rounded bg-rc-red px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
            {category.name}
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs text-neutral-500">{formatDate(post.date)}</p>
        <h3 className="mt-1 line-clamp-3 text-base font-semibold leading-snug text-rc-navy">
          <Link href={`/news/${post.slug}`} className="hover:text-rc-red">
            {post.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-3 text-sm text-neutral-600">{plainSummary(post)}</p>
        <Link
          href={`/news/${post.slug}`}
          className="mt-4 inline-block text-sm font-semibold text-rc-red hover:underline"
        >
          Read more →
        </Link>
      </div>
    </article>
  );
}
