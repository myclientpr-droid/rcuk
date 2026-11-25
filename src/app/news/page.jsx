import Link from "next/link";
import PageBand from "@/components/shared/PageBand";
import NewsCard from "@/components/sections/NewsCard";
import { getAllPosts, getAllCategories } from "@/lib/content/posts";

export const metadata = {
  title: "News & Updates",
  description: "Latest news, statements and updates from the Rohingya Centre UK.",
};

const PER_PAGE = 12;

function Pager({ page, totalPages, category }) {
  if (totalPages <= 1) return null;
  const qs = (p) => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (p > 1) params.set("page", String(p));
    const s = params.toString();
    return `/news${s ? `?${s}` : ""}`;
  };
  return (
    <nav className="mt-10 flex items-center justify-center gap-2">
      {page > 1 && (
        <Link href={qs(page - 1)} className="rounded border px-3 py-2 text-sm hover:bg-neutral-50">
          ← Prev
        </Link>
      )}
      {Array.from({ length: totalPages }, (_, i) => i + 1)
        .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
        .map((p, idx, arr) => (
          <span key={p} className="flex items-center gap-2">
            {idx > 0 && arr[idx - 1] !== p - 1 && <span className="px-1 text-neutral-400">…</span>}
            <Link
              href={qs(p)}
              className={`min-w-9 rounded px-3 py-2 text-center text-sm ${
                p === page ? "bg-rc-red text-white" : "border hover:bg-neutral-50"
              }`}
            >
              {p}
            </Link>
          </span>
        ))}
      {page < totalPages && (
        <Link href={qs(page + 1)} className="rounded border px-3 py-2 text-sm hover:bg-neutral-50">
          Next →
        </Link>
      )}
    </nav>
  );
}

export default function NewsPage({ searchParams }) {
  const category = searchParams.category || "";
  const page = Math.max(1, Number.parseInt(searchParams.page || "1", 10));

  const all = getAllPosts();
  const filtered = category
    ? all.filter((p) => (p.categories || []).some((c) => c.slug === category))
    : all;

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const current = Math.min(page, totalPages || 1);
  const posts = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  const activeCategories = getAllCategories().filter((c) =>
    all.some((p) => (p.categories || []).some((pc) => pc.slug === c.slug))
  );

  return (
    <div className="page">
      <div className="page-content">
        <PageBand
          kicker="Get Informed"
          title="News & Updates"
          subtitle="Statements, press releases, community stories and campaign updates from RCUK."
        />

        {/* Category filter */}
        <div className="mb-8 flex flex-wrap gap-2">
          <Link
            href="/news"
            className={`rounded-full px-4 py-1.5 text-sm font-medium ${
              !category ? "bg-rc-navy text-white" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
            }`}
          >
            All
          </Link>
          {activeCategories.map((c) => (
            <Link
              key={c.slug}
              href={`/news?category=${c.slug}`}
              className={`rounded-full px-4 py-1.5 text-sm font-medium ${
                category === c.slug
                  ? "bg-rc-navy text-white"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              {c.name}
            </Link>
          ))}
        </div>

        {posts.length === 0 ? (
          <p className="py-16 text-center text-neutral-500">No articles found.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <NewsCard key={post.slug} post={post} />
            ))}
          </div>
        )}

        <Pager page={current} totalPages={totalPages} category={category} />
      </div>
    </div>
  );
}
