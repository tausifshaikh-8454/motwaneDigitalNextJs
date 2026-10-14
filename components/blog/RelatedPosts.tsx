"use client";

import { useRef, type ReactNode } from "react";

/** Horizontal carousel with previous/next buttons (used for "Our Blogs"). */
export function RelatedCarousel({ heading, children }: { heading: string; children: ReactNode }) {
  const track = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>(":scope > *");
    el.scrollBy({ left: dir * ((card?.offsetWidth ?? 300) + 20), behavior: "smooth" });
  };
  const btn =
    "flex h-11 w-11 items-center justify-center rounded border border-primary text-primary transition-colors hover:bg-primary hover:text-white";
  return (
    <section className="container-site py-12 lg:py-[60px]">
      <div className="flex items-center justify-between gap-4">
        {heading && <h2 className="text-2xl font-medium leading-[1.4] text-primary lg:text-[30px]">{heading}</h2>}
        <div className="flex gap-2">
          <button type="button" aria-label="Previous" className={btn} onClick={() => scroll(-1)}>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="m15 6-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button type="button" aria-label="Next" className={btn} onClick={() => scroll(1)}>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
      <div
        ref={track}
        className="-mx-2.5 mt-6 flex snap-x snap-mandatory gap-5 overflow-x-auto px-2.5 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>
    </section>
  );
}
