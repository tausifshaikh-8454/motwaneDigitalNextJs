/**
 * The public address of this website, from NEXT_PUBLIC_SITE_URL
 * (e.g. https://www.motwanedigital.com — the URL only, nothing else).
 * Used for canonical URLs, the sitemap, robots.txt and share links.
 *
 * If it is missing or not a valid URL, falls back to Vercel's production domain
 * (or localhost in development) and logs a warning instead of failing the build.
 */
function resolveSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (raw) {
    try {
      const url = new URL(raw);
      if (url.protocol === "https:" || url.protocol === "http:") return url.origin;
    } catch {
      /* invalid, handled below */
    }
    console.warn(`[site] NEXT_PUBLIC_SITE_URL is not a valid URL: "${raw}". Set it to just the address, e.g. https://example.com`);
  }
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

export const SITE_URL = resolveSiteUrl();
