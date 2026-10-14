"use client";

import { useModal } from "@/components/modals/ModalProvider";

const btn =
  "inline-flex items-center justify-center rounded-[3px] bg-primary px-6 py-3 font-medium leading-[1.4] text-white transition-colors hover:bg-primary-bright";

/** "Request Recap" (past webinars) or "Register Now" (upcoming webinars). */
export function WebinarActions({
  upcoming,
  webinarTitle,
  registrationLink,
  recapLabel,
  registerLabel,
}: {
  upcoming: boolean;
  webinarTitle: string;
  registrationLink?: string;
  recapLabel: string;
  registerLabel: string;
}) {
  const { open } = useModal();
  if (upcoming) {
    if (!registerLabel) return null;
    return registrationLink ? (
      <a href={registrationLink} target="_blank" rel="noopener noreferrer" className={btn}>
        {registerLabel}
      </a>
    ) : (
      <button type="button" className={btn} onClick={() => open({ type: "get_in_touch" })}>
        {registerLabel}
      </button>
    );
  }
  if (!recapLabel) return null;
  return (
    <button type="button" className={btn} onClick={() => open({ type: "recap", webinarTitle })}>
      {recapLabel}
    </button>
  );
}
