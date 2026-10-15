import type { NextConfig } from "next";

const wpBase = new URL(process.env.WP_BASE_URL ?? "https://example.com");

const isDev = process.env.NODE_ENV === "development";

/**
 * Content-Security-Policy: the browser may only load scripts, styles, fonts and
 * data from this site, and images from this site + the WordPress uploads host.
 * 'unsafe-inline' for scripts is needed because Next.js streams small inline
 * scripts into statically generated pages (nonces would force every page to be
 * rendered per request). WordPress HTML is sanitised server-side (lib/sanitize.ts),
 * so no CMS content can inject scripts.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: ${wpBase.origin}`,
  "font-src 'self' data:",
  `connect-src 'self'${isDev ? " ws: wss:" : ""}`,
  "media-src 'self'",
  "frame-src 'self'",
  "frame-ancestors 'self'",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const nextConfig: NextConfig = {
  cacheComponents: true,
  cacheLife: {
    /**
     * WordPress content.
     * - Production: served from cache and refreshed instantly when WordPress calls
     *   /api/revalidate on save (hourly refresh as a safety net).
     * - Development: re-checked in the background after 1 second, so a WordPress
     *   change shows after a reload (or two).
     * stale/expire stay at 5 minutes so pages can still be prerendered for instant
     * navigation (shorter lifetimes turn the whole page into a blocking dynamic route).
     */
    wordpress: isDev
      ? { stale: 300, revalidate: 1, expire: 300 }
      : { stale: 300, revalidate: 3600, expire: 86400 },
  },
  partialPrefetching: true,
  trailingSlash: true,
  poweredByHeader: false,

  /**
   * Build gently: WordPress is on shared hosting, which runs out of database
   * connections if too many pages are rendered at the same time.
   */
  experimental: {
    cpus: 2,
    staticGenerationMaxConcurrency: 2,
    staticGenerationRetryCount: 3,
  },

  /** Old WordPress (Yoast) URLs that search engines may still request. */
  async redirects() {
    return [
      { source: "/sitemap_index.xml", destination: "/sitemap.xml", permanent: true },
      { source: "/:type(post|page|webinars)-sitemap.xml", destination: "/sitemap.xml", permanent: true },
      { source: "/author/:slug*", destination: "/", permanent: true },
    ];
  },

  /** Security headers for every response (OWASP secure-headers recommendations). */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
          },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
          // Browsers only honour HSTS over HTTPS, so it is skipped in local development.
          ...(isDev ? [] : [{ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" }]),
        ],
      },
      {
        // API responses are private and must never be cached by a CDN or browser.
        source: "/api/:path*",
        headers: [{ key: "Cache-Control", value: "no-store" }],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: wpBase.protocol.replace(":", "") as "http" | "https",
        hostname: wpBase.hostname,
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
