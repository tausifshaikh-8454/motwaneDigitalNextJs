"use client";

import { useModal } from "@/components/modals/ModalProvider";

/** Vertical "Get in touch" tab fixed to the right edge on phones (as on the live site). */
export function SideEnquiryTab({ label }: { label: string }) {
  const { open } = useModal();
  if (!label) return null;
  return (
    <button
      type="button"
      onClick={() => open({ type: "get_in_touch" })}
      className="fixed right-0 top-1/2 z-[9990] -translate-y-1/2 rounded-l-md bg-white px-2 py-3 text-sm font-medium text-primary shadow-[0_0_10px_rgba(0,0,0,0.15)] [writing-mode:vertical-rl] rotate-180 md:hidden"
    >
      {label}
    </button>
  );
}
