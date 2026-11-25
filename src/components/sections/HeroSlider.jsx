"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Hero slider recreating the humane "header-slider": full-bleed background
 * images with an overlaid heading, copy and CTA. Auto-advances with arrows and
 * dot navigation.
 */
export default function HeroSlider({ slides }) {
  const [index, setIndex] = useState(0);
  const count = slides.length;

  const go = useCallback(
    (n) => setIndex((n + count) % count),
    [count]
  );

  useEffect(() => {
    if (count <= 1) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % count), 6000);
    return () => clearInterval(t);
  }, [count]);

  if (count === 0) return null;

  return (
    <section className="relative h-[70vh] min-h-[440px] w-full overflow-hidden bg-rc-navy">
      {slides.map((slide, i) => (
        <div
          key={i}
          aria-hidden={i !== index}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={slide.image}
            alt=""
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/45" />
          <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-4 lg:px-8">
            <div className="max-w-2xl text-white">
              {slide.title && (
                <h1 className="text-3xl font-bold leading-tight sm:text-5xl">
                  {slide.title}
                </h1>
              )}
              {slide.text && (
                <p className="mt-4 text-base leading-relaxed text-white/90 sm:text-lg">
                  {slide.text}
                </p>
              )}
              {slide.href && (
                <Link
                  href={slide.href}
                  className="mt-6 inline-flex items-center rounded bg-rc-red px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:brightness-95"
                >
                  {slide.label}
                </Link>
              )}
            </div>
          </div>
        </div>
      ))}

      {count > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => go(index - 1)}
            className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur transition hover:bg-white/30"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => go(index + 1)}
            className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur transition hover:bg-white/30"
          >
            <ChevronRight size={22} />
          </button>
          <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => go(i)}
                className={`h-2.5 w-2.5 rounded-full transition ${
                  i === index ? "bg-white" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
