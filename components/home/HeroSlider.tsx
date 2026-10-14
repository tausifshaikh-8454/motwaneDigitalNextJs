"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { WpImage } from "@/components/ui/WpImage";
import { useModal } from "@/components/modals/ModalProvider";
import type { WPImage } from "@/types/wp";

export interface HeroSlide {
  key: string;
  image: WPImage | false | null;
  eyebrow: string;
  heading: string;
  subheading: string;
  meta?: { date?: string; location?: string };
  brochure?: { label: string; productName: string; fileUrl?: string };
  links: { label: string; href: string; external: boolean }[];
}

const AUTOPLAY_MS = 4000;
const TRANSITION_MS = 700;

const btn =
  "inline-block rounded border-2 border-white px-5 py-2.5 text-sm font-medium tracking-[1.2px] text-white transition-colors hover:bg-white hover:text-primary md:px-[30px] md:py-3 md:text-base";

export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const { open } = useModal();
  const count = slides.length;
  // Render a clone of the first slide at the end for a seamless infinite loop.
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const next = useCallback(() => {
    setAnimate(true);
    setIndex((i) => i + 1);
  }, []);

  useEffect(() => {
    if (count < 2 || paused) return;
    timer.current = setTimeout(next, AUTOPLAY_MS);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [index, paused, count, next]);

  function onTransitionEnd() {
    if (index >= count) {
      setAnimate(false);
      setIndex(0);
    }
  }

  if (!count) return null;
  const rendered = count > 1 ? [...slides, { ...slides[0], key: `${slides[0].key}-clone` }] : slides;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Highlights"
      className="relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="flex"
        style={{
          transform: `translateX(-${index * 100}%)`,
          transition: animate ? `transform ${TRANSITION_MS}ms ease` : "none",
        }}
        onTransitionEnd={onTransitionEnd}
      >
        {rendered.map((s, i) => (
          <div
            key={s.key}
            className="relative h-[420px] w-full shrink-0 md:h-[538px]"
            aria-hidden={i % count !== index % count}
            role="group"
            aria-roledescription="slide"
          >
            <WpImage image={s.image} fill priority={i === 0} sizes="100vw" className="object-cover" />
            <div className="absolute inset-0 bg-black/[0.063]" />
            <div className="container-site relative flex h-full flex-col justify-center text-white">
              {s.eyebrow && <p className="text-base font-medium leading-[1.4] lg:text-eyebrow">{s.eyebrow}</p>}
              {s.heading && (
                <h2 className="mt-3 text-xl font-medium leading-[1.4] tracking-[1.2px] md:mt-6 md:text-[34px] lg:text-h1">
                  {s.heading}
                </h2>
              )}
              {s.subheading && (
                <p className="mt-3 text-base font-medium leading-[1.4] tracking-[0.5px] md:mt-6 md:text-[22px] lg:text-eyebrow">{s.subheading}</p>
              )}
              {s.meta && (s.meta.date || s.meta.location) && (
                <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-base md:text-lg">
                  {s.meta.date && (
                    <li className="flex items-center gap-2">
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                        <rect x="3" y="5" width="18" height="16" rx="2" />
                        <path d="M3 10h18M8 3v4M16 3v4" strokeLinecap="round" />
                      </svg>
                      {s.meta.date}
                    </li>
                  )}
                  {s.meta.location && (
                    <li className="flex items-center gap-2">
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                        <path d="M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11z" />
                        <circle cx="12" cy="10" r="2.5" />
                      </svg>
                      {s.meta.location}
                    </li>
                  )}
                </ul>
              )}
              {(s.brochure || s.links.length > 0) && (
                <div className="mt-6 flex flex-wrap gap-4 md:mt-8 md:gap-5">
                  {s.brochure && (
                    <button
                      type="button"
                      className={btn}
                      tabIndex={i % count === index % count ? 0 : -1}
                      onClick={() =>
                        open({ type: "brochure", productName: s.brochure!.productName, brochureUrl: s.brochure!.fileUrl })
                      }
                    >
                      {s.brochure.label}
                    </button>
                  )}
                  {s.links.map((l) =>
                    l.external ? (
                      <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className={btn}>
                        {l.label}
                      </a>
                    ) : (
                      <Link key={l.href} href={l.href} className={btn} tabIndex={i % count === index % count ? 0 : -1}>
                        {l.label}
                      </Link>
                    ),
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
