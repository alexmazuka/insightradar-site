import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const isGitHubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isGitHubPages ? "/insightradar-site" : "",
  assetPrefix: isGitHubPages ? "/insightradar-site/" : "",
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: ".",
  },
};

export default withNextIntl(nextConfig);
