import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { getSitemapItems } from "@/lib/wp";

/** /sitemap.xml — generated from WordPress content (noindex items are left out). */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE_URL;
  const items = await getSitemapItems();
  return items.map((i) => ({
    url: `${base}${i.path}`,
    lastModified: i.modified ? new Date(`${i.modified}Z`) : undefined,
  }));
}
