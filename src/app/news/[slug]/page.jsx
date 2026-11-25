import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import NewsCard from "@/components/sections/NewsCard";
import { decodeEntities, processHtml } from "@/lib/content/html";
import { formatDate, itemImage, plainSummary } from "@/lib/content/format";
import { getPostBySlug, getPostSlugs, getRelatedPosts } from "@/lib/content/posts";

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: plainSummary(post, 30),
  };
}

export default async function PostDetail({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const image = itemImage(post);
  const body = processHtml(post.content);
  const related = getRelatedPosts(post, 3);

  return (
    <div className="page">
      <div className="page-content">
        <article className="mx-auto max-w-3xl">
          <Link href="/news" className="text-sm font-semibold text-rc-red hover:underline">
            ← Back to News
          </Link>

          {post.categories?.[0] && (
            <span className="mt-4 inline-block rounded bg-rc-red px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
              {post.categories[0].name}
            </span>
          )}
          <h1 className="mt-3 text-3xl font-bold leading-tight text-rc-navy sm:text-4xl">
            {decodeEntities(post.title)}
          </h1>
          <p className="mt-3 text-sm text-neutral-500">{formatDate(post.date)}</p>

          {image && (
            <div className="relative mt-6 aspect-[16/9] w-full overflow-hidden rounded-lg bg-neutral-100">
              <Image
                src={image}
                alt={post.featuredAlt || post.title}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
              />
            </div>
          )}

          <div
            className="wp-content mt-8"
            dangerouslySetInnerHTML={{ __html: body }}
          />
        </article>

        {related.length > 0 && (
          <section className="mx-auto mt-16 max-w-7xl">
            <h2 className="mb-6 text-2xl font-bold text-rc-navy">Related articles</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <NewsCard key={r.slug} post={r} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
