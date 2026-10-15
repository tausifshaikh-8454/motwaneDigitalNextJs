"use client";

import { useState } from "react";
import { LongArrowRight } from "@/components/ui/Icons";
import type { HomeAcf } from "@/types/wp";

type Item = NonNullable<HomeAcf["faqs"]>[number];

/** Two-column FAQ accordion; one answer open at a time. */
export function Faq({ items }: { items: Item[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const half = Math.ceil(items.length / 2);
  const columns = [items.slice(0, half), items.slice(half)];

  return (
    <div className="mt-10 grid gap-x-20 md:mt-[50px] md:grid-cols-2">
      {columns.map((col, c) => (
        <div key={c}>
          {col.map((item, i) => {
            const idx = c * half + i;
            const isOpen = open === idx;
            const panelId = `faq-panel-${idx}`;
            return (
              <div key={item.question} className="border-b border-[#86b5d9]">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpen(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between gap-5 py-[18px] md:gap-12 pr-2.5 text-left leading-[1.65] text-[#1f2124] transition-colors hover:text-primary"
                >
                  <span>{item.question}</span>
                  <LongArrowRight
                    className={`h-[15px] w-[27px] shrink-0 text-primary transition-transform duration-300 ${isOpen ? "rotate-90" : ""}`}
                  />
                </button>
                <div
                  id={panelId}
                  role="region"
                  className={`grid transition-[grid-template-rows] duration-300 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                >
                  <div className="overflow-hidden">
                    <div
                      className="pb-5 pt-2.5 text-body [&_a]:text-primary [&_a]:underline [&_ol]:list-decimal [&_ol]:pl-5 [&_p+p]:mt-3 [&_ul]:list-disc [&_ul]:pl-5"
                      dangerouslySetInnerHTML={{ __html: item.answer }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
