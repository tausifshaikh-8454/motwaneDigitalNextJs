import type { WPMediaEmbed, WPPost } from "@/types/wp";
import { decodeEntities } from "./links";

/** "2026-10-12T10:00:00" → "October 12, 2026" (WordPress local date, no timezone shift). */
export function formatDate(wpDate: string): string {
  const d = new Date(`${wpDate.slice(0, 19)}Z`);
  return new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(d);
}

/** Featured Image of a post or webinar (requested with _embed=wp:featuredmedia). */
export function featuredImage(item: {
  title: { rendered: string };
  _embedded?: { "wp:featuredmedia"?: WPMediaEmbed[] };
}) {
  const m = item._embedded?.["wp:featuredmedia"]?.[0];
  if (!m?.source_url) return null;
  return {
    url: m.source_url,
    alt: m.alt_text || decodeEntities(item.title.rendered),
    width: m.media_details?.width ?? 1200,
    height: m.media_details?.height ?? 630,
  };
}

export function primaryCategory(post: WPPost) {
  const terms = post._embedded?.["wp:term"]?.flat() ?? [];
  return terms.find((t) => t.taxonomy === "category" && t.slug !== "uncategorized") ?? null;
}

function stripTags(html: string) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export function readingMinutes(html: string, wordsPerMinute = 200): number {
  const words = stripTags(html).split(" ").filter(Boolean).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

function slugify(text: string) {
  return decodeEntities(text)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

/** Adds ids to h2/h3 headings in post HTML and returns the table of contents. */
export function withHeadingIds(html: string): { html: string; toc: TocItem[] } {
  const toc: TocItem[] = [];
  const used = new Map<string, number>();
  const out = html.replace(/<h([23])([^>]*)>([\s\S]*?)<\/h\1>/g, (match, lvl: string, attrs: string, inner: string) => {
    const text = decodeEntities(stripTags(inner));
    if (!text) return match;
    const existing = /\sid="([^"]+)"/.exec(attrs)?.[1];
    let id = existing ?? (slugify(text) || "section");
    if (!existing) {
      const n = used.get(id) ?? 0;
      used.set(id, n + 1);
      if (n) id = `${id}-${n + 1}`;
    }
    toc.push({ id, text, level: Number(lvl) as 2 | 3 });
    return existing ? match : `<h${lvl}${attrs} id="${id}">${inner}</h${lvl}>`;
  });
  return { html: out, toc };
}

/** Rewrites absolute links to the WordPress site into internal paths. */
export function internalizeLinks(html: string): string {
  const base = process.env.WP_BASE_URL;
  if (!base) return html;
  const escaped = base.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return html.replace(new RegExp(`href="${escaped}(/(?!wp-content/)[^"]*)"`, "g"), 'href="$1"');
}
