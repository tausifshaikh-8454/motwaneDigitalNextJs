import type { NextConfig } from "next";

const wpBase = new URL(process.env.WP_BASE_URL ?? "https://example.com");

const isDev = process.env.NODE_ENV === "development";

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

  /** Old WordPress (Yoast) URLs that search engines may still request. */
  async redirects() {
    return [
      { source: "/sitemap_index.xml", destination: "/sitemap.xml", permanent: true },
      { source: "/:type(post|page|webinars)-sitemap.xml", destination: "/sitemap.xml", permanent: true },
      { source: "/author/:slug*", destination: "/", permanent: true },
    ];
  },

  /** Basic security headers for every page. */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
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
