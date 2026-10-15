"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import type { GlobalSettings } from "@/types/wp";
import { Drawer } from "./Drawer";
import { PopupForm } from "@/components/forms/PopupForm";

type ModalRequest =
  | { type: "get_in_touch" }
  | { type: "brochure"; productName?: string; brochureUrl?: string }
  | { type: "recap"; webinarTitle?: string };

interface ModalContextValue {
  open: (req: ModalRequest) => void;
  close: () => void;
}

const ModalContext = createContext<ModalContextValue | null>(null);

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used inside <ModalProvider>");
  return ctx;
}

/**
 * Two popups stay mounted all the time so they can animate in and out:
 * - the Get in Touch panel slides in/out from the right
 * - Request Brochure / Request Recap open as a centred dialog
 * The last request is kept while closing, so content doesn't flash away mid-animation.
 */
export function ModalProvider({ settings, children }: { settings: GlobalSettings | null; children: ReactNode }) {
  const [sideOpen, setSideOpen] = useState(false);
  const [sideKey, setSideKey] = useState(0);
  const [centerOpen, setCenterOpen] = useState(false);
  const [centerReq, setCenterReq] = useState<Exclude<ModalRequest, { type: "get_in_touch" }> | null>(null);
  const [centerKey, setCenterKey] = useState(0);

  const open = useCallback((req: ModalRequest) => {
    if (req.type === "get_in_touch") {
      setCenterOpen(false);
      setSideKey((k) => k + 1);
      setSideOpen(true);
    } else {
      setSideOpen(false);
      setCenterReq(req);
      setCenterKey((k) => k + 1);
      setCenterOpen(true);
    }
  }, []);

  const close = useCallback(() => {
    setSideOpen(false);
    setCenterOpen(false);
  }, []);

  const side = settings?.get_in_touch_popup;
  const center =
    centerReq?.type === "brochure" ? settings?.brochure_popup : centerReq?.type === "recap" ? settings?.recap_popup : null;

  const hidden: Record<string, string> = {};
  if (centerReq?.type === "brochure" && centerReq.productName) hidden["product-name"] = centerReq.productName;
  if (centerReq?.type === "recap" && centerReq.webinarTitle) hidden["webinar-title"] = centerReq.webinarTitle;

  return (
    <ModalContext.Provider value={{ open, close }}>
      {children}

      <Drawer open={sideOpen} onClose={close} title={side?.title ?? ""} variant="side">
        {side && (
          <PopupForm key={sideKey} formType="get_in_touch" intro={side.intro} successMessage={side.success_message} />
        )}
      </Drawer>

      <Drawer open={centerOpen} onClose={close} title={center?.title ?? ""} variant="center">
        {centerReq && center && (
          <PopupForm
            key={centerKey}
            formType={centerReq.type}
            intro={center.intro}
            successMessage={center.success_message}
            hidden={hidden}
            downloadUrl={centerReq.type === "brochure" ? centerReq.brochureUrl : undefined}
          />
        )}
      </Drawer>
    </ModalContext.Provider>
  );
}
