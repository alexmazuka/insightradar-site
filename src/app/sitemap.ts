import { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://insightradar.info";
  const locales = ["uk", "en"];

  const staticPages = ["", "/pricing", "/about", "/contact", "/blog"];
  const blogSlugs = [
    "what-is-insightradar",
    "western-media-analysis",
    "ai-media-intelligence",
  ];
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const page of staticPages) {
      entries.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date("2026-04-15"),
        changeFrequency: page === "/blog" ? "daily" : "weekly",
        priority: page === "" ? 1 : 0.8,
      });
    }

    for (const slug of blogSlugs) {
      entries.push({
        url: `${baseUrl}/${locale}/blog/${slug}`,
        lastModified: new Date("2026-04-10"),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  return entries;
}
