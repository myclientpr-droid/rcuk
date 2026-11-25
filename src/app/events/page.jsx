import PageBand from "@/components/shared/PageBand";
import EventCard from "@/components/sections/EventCard";
import { getAllEvents, getUpcomingEvents, getPastEvents } from "@/lib/content/events";

export const metadata = {
  title: "Events",
  description: "Events, commemorations and gatherings from the Rohingya Centre UK.",
};

export default function EventsPage() {
  const total = getAllEvents().length;
  const upcoming = getUpcomingEvents();
  const past = getPastEvents(total);

  return (
    <div className="page">
      <div className="page-content">
        <PageBand
          kicker="Get Involved"
          title="Events & Engagement"
          subtitle="Commemorations, celebrations, workshops and community gatherings."
        />

        {upcoming.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-rc-navy">Upcoming Events</h2>
            <div className="grid gap-4 lg:grid-cols-2">
              {upcoming.map((e) => (
                <EventCard key={e.slug} event={e} />
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="mb-6 text-2xl font-bold text-rc-navy">
            {upcoming.length > 0 ? "Past Events" : "All Events"}
          </h2>
          {past.length === 0 ? (
            <p className="py-10 text-center text-neutral-500">No events yet.</p>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {past.map((e) => (
                <EventCard key={e.slug} event={e} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
