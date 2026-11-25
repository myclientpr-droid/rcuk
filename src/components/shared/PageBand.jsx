/**
 * Humane-style coloured page title band with optional subtitle + breadcrumb
 * kicker. Shared by listing and detail pages.
 */
export default function PageBand({ title, subtitle, kicker }) {
  return (
    <section className="mb-8 overflow-hidden rounded-lg bg-rc-navy px-6 py-10 text-white sm:px-10 sm:py-14">
      {kicker && (
        <p className="text-xs font-semibold uppercase tracking-wider text-rc-gold">{kicker}</p>
      )}
      <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{title}</h1>
      {subtitle && <p className="mt-3 max-w-2xl text-white/80">{subtitle}</p>}
    </section>
  );
}
