import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://atess.ro";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1.0,
    },
    // Coming Soon routes intentionally excluded (they're noindex).
    // Add /servicii, /proiecte, /configurator, /invata, /despre, /contact when they become real pages.
  ];
}
