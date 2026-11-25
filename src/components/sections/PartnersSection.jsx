import Image from "next/image";

/**
 * "In Collaboration With Our Partners" — a responsive grid of partner org
 * logos parsed from the imported home page. Logos show muted and colour on
 * hover, matching the humane carousel.
 */
export default function PartnersSection({ partners }) {
  if (!partners || partners.length === 0) return null;

  return (
    <section className="bg-white py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-rc-navy sm:text-3xl">
            In Collaboration <span className="text-rc-red">With Our Partners</span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-neutral-600">
            We work alongside civic, charitable and community organisations across Bradford and
            beyond to deliver our mission.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {partners.map((p) => (
            <div
              key={p.src}
              title={p.name}
              className="flex items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 p-4 transition hover:border-rc-red/30 hover:bg-white"
            >
              <div className="relative h-16 w-full max-w-[180px] opacity-80 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0">
                <Image
                  src={p.src}
                  alt={p.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 180px"
                  className="object-contain"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
