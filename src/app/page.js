import Link from "next/link";
import HeroSlider from "@/components/sections/HeroSlider";
import NewsCard from "@/components/sections/NewsCard";
import PartnersSection from "@/components/sections/PartnersSection";
import EventCard from "@/components/sections/EventCard";
import ItemCard from "@/components/sections/ItemCard";
import { getHomeData } from "@/lib/content/home";

function SectionHeading({ kicker, title, action }) {
  return (
    <div className="mb-8 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
      <div>
        {kicker && (
          <p className="text-sm font-semibold uppercase tracking-wider text-rc-red">{kicker}</p>
        )}
        <h2 className="mt-1 text-2xl font-bold text-rc-navy sm:text-3xl">{title}</h2>
      </div>
      {action && (
        <Link
          href={action.href}
          className="text-sm font-semibold text-rc-red hover:underline"
        >
          {action.label} →
        </Link>
      )}
    </div>
  );
}

export default function Home() {
  const { slides, intro, services, appeals, events, news, partners } = getHomeData();

  return (
    <div>
      <HeroSlider slides={slides} />

      {/* Two intro feature cards */}
      {intro.length > 0 && (
        <section className="bg-rc-navy py-14 text-white sm:py-16">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 lg:grid-cols-2 lg:px-8">
            {intro.map((card) => (
              <div
                key={card.title}
                className="flex flex-col rounded-lg bg-white/5 p-8 ring-1 ring-white/10"
              >
                <h2 className="text-xl font-bold sm:text-2xl">{card.title}</h2>
                <p className="mt-3 flex-1 leading-relaxed text-white/80">{card.text}</p>
                <Link
                  href={card.href}
                  className="mt-6 inline-flex w-fit items-center rounded bg-rc-red px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-white transition hover:brightness-95"
                >
                  {card.cta} →
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Welcome / mission */}
      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-rc-red">
            Welcome to Rohingya Centre UK
          </p>
          <h2 className="mt-3 text-3xl font-bold text-rc-navy sm:text-4xl">
            Supporting refugees and building inclusive communities
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-neutral-600">
            The Rohingya Centre UK (RCUK) works to advance Rohingya rights and support
            refugees and local communities across the UK through social inclusion,
            education, housing, digital access, employment and community support.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/donate"
              className="inline-flex items-center rounded bg-rc-red px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:brightness-95"
            >
              Donate
            </Link>
            <Link
              href="/get-support"
              className="inline-flex items-center rounded border border-rc-navy px-6 py-3 text-sm font-bold uppercase tracking-wide text-rc-navy transition hover:bg-rc-navy hover:text-white"
            >
              Get Support
            </Link>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="bg-rc-light py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <SectionHeading
            kicker="What We Do"
            title="Our Services and Opportunities"
            action={{ href: "/what-we-do", label: "Explore our work" }}
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <Link
                key={s.title}
                href={s.href}
                className="group rounded-lg border border-neutral-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="mb-4 h-1 w-12 rounded bg-rc-red" />
                <h3 className="text-lg font-semibold text-rc-navy group-hover:text-rc-red">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">{s.text}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Current Appeals */}
      {appeals.length > 0 && (
        <section className="bg-rc-light py-14 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <SectionHeading
              kicker="Get Involved"
              title="Current Appeals"
              action={{ href: "/campaigns", label: "All campaigns" }}
            />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {appeals.map((campaign) => (
                <ItemCard key={campaign.slug} item={campaign} base="/campaigns" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Upcoming / recent events */}
      {events.events.length > 0 && (
        <section className="py-14 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <SectionHeading
              kicker="What's On"
              title={events.upcoming ? "Upcoming Events" : "Recent Events"}
              action={{ href: "/events", label: "All events" }}
            />
            <div className="grid gap-6 lg:grid-cols-3">
              {events.events.map((event) => (
                <EventCard key={event.slug} event={event} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest news */}
      {news.length > 0 && (
        <section className="py-14 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <SectionHeading
              kicker="News & Updates"
              title="Latest News"
              action={{ href: "/news", label: "All news" }}
            />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {news.map((post) => (
                <NewsCard key={post.slug} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* In Collaboration With Our Partners */}
      <PartnersSection partners={partners} />

      {/* Support CTA band */}
      <section className="bg-rc-navy py-14 text-white sm:py-20">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 text-center sm:flex-row sm:text-left lg:px-8">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">Your support changes lives</h2>
            <p className="mt-2 max-w-xl text-white/80">
              Help us continue our advocacy, education and community programmes for the
              Rohingya people.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/donate"
              className="inline-flex items-center rounded bg-rc-gold px-6 py-3 text-sm font-bold uppercase tracking-wide text-rc-navy transition hover:brightness-105"
            >
              Donate Now
            </Link>
            <Link
              href="/get-involved"
              className="inline-flex items-center rounded border border-white/60 px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-white hover:text-rc-navy"
            >
              Get Involved
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
