"use client";

import { Children, useCallback, useEffect, useRef, useState, type ReactNode } from "react";

const MAX_PER_VIEW = 3;
const AUTOPLAY_MS = 4500;
const SPEED_MS = 500;

/**
 * Looping card carousel with dots (1 / 2 / 3 cards per view at mobile / tablet / desktop),
 * autoplaying every 4.5s like the old site.
 */
export function WebinarCarousel({
  children,
  className = "",
  dots = true,
  arrows = false,
}: {
  children: ReactNode;
  className?: string;
  /** Dots under the cards */
  dots?: boolean;
  /** Previous/next buttons over the card image (used on mobile with one card per view) */
  arrows?: boolean;
}) {
  const items = Children.toArray(children);
  const count = items.length;
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);
  const touchX = useRef<number | null>(null);
  const loop = count > 1;

  const go = useCallback(
    (next: number) => {
      if (!loop) return;
      setAnimate(true);
      setIndex(next);
    },
    [loop],
  );

  // Autoplay
  useEffect(() => {
    if (!loop) return;
    const t = setInterval(() => {
      if (document.hidden) return;
      setAnimate(true);
      setIndex((i) => Math.min(i + 1, count));
    }, AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [loop, count]);

  // After sliding onto the cloned cards at the end (or before the start), jump back without animation.
  useEffect(() => {
    if (index >= 0 && index < count) return;
    const t = setTimeout(() => {
      setAnimate(false);
      setIndex((i) => ((i % count) + count) % count);
    }, SPEED_MS + 20);
    return () => clearTimeout(t);
  }, [index, count]);

  const clonesAfter = loop ? items.slice(0, Math.min(MAX_PER_VIEW, count)) : [];
  const clonesBefore = loop ? items.slice(-1) : [];
  const offset = index + clonesBefore.length;
  const active = ((index % count) + count) % count;

  return (
    <div className={`relative ${className}`}>
      <div
        className="overflow-hidden px-2.5 pb-4 pt-1 -mx-2.5 [--per:1] md:[--per:2] lg:[--per:3]"
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          touchX.current = null;
          if (Math.abs(dx) > 40) go(Math.max(-1, Math.min(count, index + (dx < 0 ? 1 : -1))));
        }}
      >
        <div
          className="flex gap-5"
          style={{
            transform: `translateX(calc(-${offset} * (100% + 20px) / var(--per)))`,
            transition: animate ? `transform ${SPEED_MS}ms ease` : "none",
          }}
        >
          {[...clonesBefore, ...items, ...clonesAfter].map((child, i) => {
            const real = i >= clonesBefore.length && i < clonesBefore.length + count;
            return (
              <div
                key={i}
                className="shrink-0 basis-[calc((100%-(var(--per)-1)*20px)/var(--per))]"
                aria-hidden={real ? undefined : true}
                inert={!real || undefined}
              >
                {child}
              </div>
            );
          })}
        </div>
      </div>
      {loop && arrows && (
        <div className="pointer-events-none absolute inset-x-0 top-1 flex aspect-[4/3] items-center justify-between">
          {([-1, 1] as const).map((dir) => (
            <button
              key={dir}
              type="button"
              aria-label={dir < 0 ? "Previous" : "Next"}
              onClick={() => go(Math.max(-1, Math.min(count, index + dir)))}
              className="pointer-events-auto flex h-[65px] w-[35px] items-center justify-center bg-white text-[#0d6cc2]"
            >
              <svg viewBox="0 0 24 24" className="h-[25px] w-[25px]" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path d={dir < 0 ? "m15 5-7 7 7 7" : "m9 5 7 7-7 7"} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          ))}
        </div>
      )}
      {loop && dots && (
        <div className="mt-4 flex justify-center">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === active}
              onClick={() => go(i)}
              className="p-1.5"
            >
              <span
                className={`block h-[7px] w-[7px] rounded-full bg-primary transition-opacity ${
                  i === active ? "opacity-100" : "opacity-20"
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
