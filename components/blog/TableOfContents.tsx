"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "@/components/ui/Icons";
import type { TocItem } from "@/lib/blog";

/** Collapsible "In This Blog" list that highlights the section being read. */
export function TableOfContents({ heading, items }: { heading: string; items: TocItem[] }) {
  const [open, setOpen] = useState(true);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter((e): e is HTMLElement => !!e);
    if (!els.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-100px 0px -60% 0px" },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  if (!items.length) return null;
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between border-b border-[#9da5ae] px-2 pb-3 text-lg font-medium text-ink"
      >
        {heading}
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <ol className="space-y-2 px-2 pt-5 text-sm">
          {items.map((i, idx) => (
            <li key={i.id} className={i.level === 3 && items.slice(0, idx).some((x) => x.level === 2) ? "pl-3" : ""}>
              <a
                href={`#${i.id}`}
                className={`line-clamp-1 transition-colors hover:text-primary ${active === i.id ? "text-primary underline" : "text-ink"}`}
              >
                {i.text}
              </a>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
