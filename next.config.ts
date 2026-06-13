import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// Custom domain (insightradar.info) via CNAME → no basePath needed.
// Keep USE_BASE_PATH=true fallback in case we ever revert to github.io subpath.
const useBasePath = process.env.USE_BASE_PATH === "true";

// Payments (Monobank) need server-side API routes, so the default build is a
// server app for Vercel. Set STATIC_EXPORT=true only for the legacy GitHub
// Pages static export (which cannot accept payments).
const staticExport = process.env.STATIC_EXPORT === "true";

const nextConfig: NextConfig = {
  ...(staticExport ? { output: "export" as const } : {}),
  basePath: useBasePath ? "/insightradar-site" : "",
  assetPrefix: useBasePath ? "/insightradar-site/" : "",
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: ".",
  },
};

export default withNextIntl(nextConfig);
