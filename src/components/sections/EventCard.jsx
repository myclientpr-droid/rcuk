import Link from "next/link";
import Image from "next/image";
import { MapPin, Clock } from "lucide-react";
import { eventDateParts } from "@/lib/content/format";

export default function EventCard({ event }) {
  const d = eventDateParts(event.start);
  const where = event.venue || event.city || "United Kingdom";
  return (
    <article className="flex overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm transition hover:shadow-md">
      {/* Date badge */}
      <div className="flex w-20 shrink-0 flex-col items-center justify-center bg-rc-navy px-2 py-4 text-center text-white">
        <span className="text-2xl font-bold leading-none">{d?.day || "—"}</span>
        <span className="mt-1 text-xs font-semibold uppercase">{d?.month || ""}</span>
        <span className="text-[11px] text-white/60">{d?.year}</span>
      </div>

      <div className="flex flex-1 gap-3 p-4">
        {event.image && (
          <div className="relative hidden h-24 w-32 shrink-0 overflow-hidden rounded bg-neutral-100 sm:block">
            <Image src={event.image} alt={event.title} fill sizes="128px" className="object-cover" />
          </div>
        )}
        <div className="min-w-0">
          <Link href={event.path} className="hover:text-rc-red">
            <h3 className="line-clamp-2 font-semibold text-rc-navy">{event.title}</h3>
          </Link>
          <div className="mt-2 space-y-1 text-sm text-neutral-500">
            <p className="flex items-center gap-1.5">
              <Clock size={14} className="text-rc-red" /> {d?.time || "All day"}
            </p>
            <p className="flex items-center gap-1.5">
              <MapPin size={14} className="text-rc-red" /> {where}
            </p>
          </div>
          {event.cost && (
            <span className="mt-2 inline-block rounded bg-rc-light px-2 py-0.5 text-xs font-medium text-neutral-600">
              {event.cost}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
