import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CalendarDays, Clock, MapPin, Ticket } from "lucide-react";
import { processHtml } from "@/lib/content/html";
import { formatDate, eventDateParts } from "@/lib/content/format";
import { getEventBySlug, getEventSlugs } from "@/lib/content/events";

export function generateStaticParams() {
  return getEventSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) return {};
  return { title: event.title, description: event.title };
}

export default async function EventDetail({ params }) {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) notFound();

  const d = eventDateParts(event.start);
  const body = processHtml(event.description);

  return (
    <div className="page">
      <div className="page-content">
        <article className="mx-auto max-w-3xl">
          <Link href="/events" className="text-sm font-semibold text-rc-red hover:underline">
            ← Back to Events
          </Link>
          <h1 className="mt-4 text-3xl font-bold leading-tight text-rc-navy sm:text-4xl">
            {event.title}
          </h1>

          {event.image && (
            <div className="relative mt-6 aspect-[16/9] w-full overflow-hidden rounded-lg bg-neutral-100">
              <Image src={event.image} alt={event.title} fill sizes="(max-width:768px) 100vw, 768px" className="object-cover" />
            </div>
          )}

          <div className="mt-6 grid gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-5 sm:grid-cols-2">
            <p className="flex items-center gap-2 text-sm text-neutral-700">
              <CalendarDays size={16} className="text-rc-red" /> {formatDate(event.start)}
            </p>
            <p className="flex items-center gap-2 text-sm text-neutral-700">
              <Clock size={16} className="text-rc-red" /> {d?.time || "All day"}
            </p>
            {(event.venue || event.city) && (
              <p className="flex items-center gap-2 text-sm text-neutral-700">
                <MapPin size={16} className="text-rc-red" />{" "}
                {[event.venue, event.city].filter(Boolean).join(", ")}
              </p>
            )}
            {event.cost && (
              <p className="flex items-center gap-2 text-sm text-neutral-700">
                <Ticket size={16} className="text-rc-red" /> {event.cost}
              </p>
            )}
          </div>

          {event.categories?.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {event.categories.map((c) => (
                <span
                  key={c.slug || c.name}
                  className="rounded-full bg-rc-light px-3 py-1 text-xs font-medium text-neutral-600"
                >
                  {c.name}
                </span>
              ))}
            </div>
          )}

          {body ? (
            <div className="wp-content mt-8" dangerouslySetInnerHTML={{ __html: body }} />
          ) : (
            <p className="mt-8 text-neutral-500">
              More details for this event will be added soon.
            </p>
          )}
        </article>
      </div>
    </div>
  );
}
