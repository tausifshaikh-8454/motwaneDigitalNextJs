import type { Metadata } from "next";
import type { YoastHead } from "@/types/wp";

/** Map Yoast SEO data from the REST API to Next.js metadata. */
export function yoastToMetadata(y: YoastHead | undefined, fallbackTitle?: string): Metadata {
  if (!y) return fallbackTitle ? { title: fallbackTitle } : {};
  const image = y.og_image?.[0];
  return {
    title: y.title ?? fallbackTitle,
    description: y.description ?? y.og_description,
    robots: y.robots
      ? { index: y.robots.index !== "noindex", follow: y.robots.follow !== "nofollow" }
      : undefined,
    openGraph: {
      title: y.og_title ?? y.title,
      description: y.og_description ?? y.description,
      type: "website",
      images: image ? [{ url: image.url, width: image.width, height: image.height }] : undefined,
    },
    twitter: { card: "summary_large_image" },
  };
}
