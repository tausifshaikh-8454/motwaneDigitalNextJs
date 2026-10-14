"use client";

import { useEffect, useState } from "react";
import { ChevronUp } from "@/components/ui/Icons";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="Scroll to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed bottom-14 right-5 z-[9998] flex h-[31px] w-[31px] items-center justify-center bg-primary text-white transition-opacity hover:bg-primary-bright ${visible ? "opacity-100" : "pointer-events-none opacity-0"}`}
    >
      <ChevronUp className="h-5 w-5" />
    </button>
  );
}
