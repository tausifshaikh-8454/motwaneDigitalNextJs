"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { CloseIcon } from "@/components/ui/Icons";

/**
 * Popup shell matching the live site:
 * - "side": slides in from the right (Get in Touch)
 * - "center": centred dialog (Request Brochure, Request Recap)
 */
export function Drawer({
  open,
  onClose,
  title,
  variant = "side",
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  variant?: "side" | "center";
  children: ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const center = variant === "center";
  const panel = center
    ? `relative max-h-[calc(100vh-40px)] w-full max-w-[500px] overflow-y-auto rounded-[10px] bg-white px-5 py-5 outline-none transition-all duration-300 sm:px-[30px] ${open ? "scale-100 opacity-100" : "scale-95 opacity-0"}`
    : `absolute right-0 top-0 h-full w-full max-w-[400px] overflow-y-auto bg-white px-5 py-[30px] outline-none transition-transform duration-500 ease-in-out ${open ? "translate-x-0" : "translate-x-full"}`;

  return (
    <div
      className={`fixed inset-0 z-[10000] transition-[visibility] ${open ? "visible" : "invisible delay-500"} ${center ? "flex items-center justify-center p-4" : ""}`}
      aria-hidden={!open}
    >
      <div
        className={`absolute inset-0 bg-black/60 transition-opacity duration-500 ${open ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />
      <div ref={panelRef} role="dialog" aria-modal="true" aria-label={title} tabIndex={-1} className={panel}>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className={`absolute text-ink transition-colors hover:text-primary ${center ? "right-5 top-7" : "right-5 top-6"}`}
        >
          <CloseIcon className="h-5 w-5" />
        </button>
        {title && (
          <h2 className={`pr-8 text-[30px] font-semibold leading-tight text-primary ${center ? "mb-2 mt-2" : "mb-5"}`}>{title}</h2>
        )}
        {children}
      </div>
    </div>
  );
}
