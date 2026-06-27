import type { MetadataRoute } from "next";
import { getAllServices } from "@/lib/services";
import { getPublishedArticles } from "@/lib/academy";
import projectsData from "@/data/projects.json";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://atess.ro";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // ── Static routes ────────────────────────────────────────────────────────────
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/despre`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/configurator`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/servicii`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/proiecte`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/proiecte/harta`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/invata`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  // ── /servicii/[slug] — 8 categories ─────────────────────────────────────────
  const serviciiRoutes: MetadataRoute.Sitemap = getAllServices().map((cat) => ({
    url: `${SITE_URL}/servicii/${cat.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  // ── /invata/[slug] — published articles only (drafts excluded) ───────────────
  const invataRoutes: MetadataRoute.Sitemap = getPublishedArticles().map(
    (article) => ({
      url: `${SITE_URL}/invata/${article.slug}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    }),
  );

  // ── /proiecte/[slug] — all projects (auto-updates as projects.json grows) ────
  const proiecteRoutes: MetadataRoute.Sitemap = (
    projectsData as Array<{ slug: string }>
  ).map((project) => ({
    url: `${SITE_URL}/proiecte/${project.slug}`,
    lastModified: now,
    changeFrequency: "yearly" as const,
    priority: 0.65,
  }));

  // /flooring-preview and any noindex/coming-soon routes are intentionally excluded.
  return [
    ...staticRoutes,
    ...serviciiRoutes,
    ...invataRoutes,
    ...proiecteRoutes,
  ];
}
