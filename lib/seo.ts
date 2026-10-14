import type { Metadata } from "next";
import { decodeEntities } from "./links";
import type { YoastHead } from "@/types/wp";

/**
 * Map Yoast SEO data from the WordPress REST API to Next.js metadata.
 * `path` is the page's URL on this site (e.g. "/blog/my-post/"): it becomes the
 * canonical URL, so search engines never index the WordPress (backend) address.
 */
export function yoastToMetadata(y: YoastHead | undefined, fallbackTitle?: string, path?: string): Metadata {
  const title = y?.title ? decodeEntities(y.title) : fallbackTitle;
  const description = y?.description ? decodeEntities(y.description) : undefined;
  const image = y?.og_image?.[0];
  const isArticle = y?.og_type === "article";
  return {
    title,
    description,
    alternates: path ? { canonical: path } : undefined,
    robots: y?.robots
      ? { index: y.robots.index !== "noindex", follow: y.robots.follow !== "nofollow" }
      : undefined,
    openGraph: {
      title: y?.og_title ? decodeEntities(y.og_title) : title,
      description: y?.og_description ? decodeEntities(y.og_description) : description,
      url: path,
      siteName: y?.og_site_name ? decodeEntities(y.og_site_name) : undefined,
      locale: y?.og_locale,
      type: isArticle ? "article" : "website",
      ...(isArticle
        ? { publishedTime: y?.article_published_time, modifiedTime: y?.article_modified_time }
        : {}),
      images: image ? [{ url: image.url, width: image.width, height: image.height }] : undefined,
    },
    twitter: { card: "summary_large_image" },
  };
}
