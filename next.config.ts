import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// Custom domain (insightradar.info) via CNAME → no basePath needed.
// Keep USE_BASE_PATH=true fallback in case we ever revert to github.io subpath.
const useBasePath = process.env.USE_BASE_PATH === "true";

const nextConfig: NextConfig = {
  output: "export",
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
