import type { WPWebinar } from "@/types/wp";
import { decodeEntities } from "./links";

/** "2026-06-19" → "Jun 19, 2026" (same format as the old site). */
export function formatWebinarDate(ymd: string | undefined | null): string {
  if (!ymd) return "";
  const m = /^(\d{4})-?(\d{2})-?(\d{2})/.exec(ymd);
  if (!m) return ymd;
  const d = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(d);
}

/** ISO date for <time dateTime>. */
export function webinarIsoDate(ymd: string | undefined | null): string | undefined {
  const m = ymd ? /^(\d{4})-?(\d{2})-?(\d{2})/.exec(ymd) : null;
  return m ? `${m[1]}-${m[2]}-${m[3]}` : undefined;
}

/** Card image = WordPress Featured Image. */
export function webinarCardImage(w: WPWebinar) {
  const m = w._embedded?.["wp:featuredmedia"]?.[0];
  if (!m?.source_url) return null;
  return {
    url: m.source_url,
    alt: m.alt_text || decodeEntities(w.title.rendered),
    width: m.media_details?.width ?? 800,
    height: m.media_details?.height ?? 600,
  };
}

export function isUpcoming(w: WPWebinar) {
  return /upcoming/i.test(w.acf?.webinar_status ?? "");
}
