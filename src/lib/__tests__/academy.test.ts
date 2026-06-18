import { describe, it, expect } from "vitest";
import {
  getAllArticles,
  getPublishedArticles,
  getArticleBySlug,
  getArticlesGroupedByCategory,
  getFeaturedArticles,
  getRelatedArticles,
} from "../academy";

const DRAFT_SLUG = "capcana-poliuretanilor-colorati";

describe("academy query API", () => {
  it("keeps the draft article in getAllArticles but not in published", () => {
    expect(getAllArticles().some((a) => a.slug === DRAFT_SLUG)).toBe(true);
    expect(getPublishedArticles().some((a) => a.slug === DRAFT_SLUG)).toBe(false);
  });

  it("publishes exactly 11 of 12 articles", () => {
    expect(getAllArticles()).toHaveLength(12);
    expect(getPublishedArticles()).toHaveLength(11);
  });

  it("still resolves the draft article by slug (for its own page)", () => {
    expect(getArticleBySlug(DRAFT_SLUG)?.status).toBe("draft");
  });

  it("fans an article into every one of its categories", () => {
    const grouped = getArticlesGroupedByCategory();
    const fundamente = grouped.find((g) => g.category === "fundamente");
    const decizii = grouped.find((g) => g.category === "decizii");
    expect(fundamente?.articles.some((a) => a.slug === "public-vs-privat")).toBe(true);
    expect(decizii?.articles.some((a) => a.slug === "public-vs-privat")).toBe(true);
  });

  it("never groups the draft article", () => {
    const grouped = getArticlesGroupedByCategory();
    const allGrouped = grouped.flatMap((g) => g.articles.map((a) => a.slug));
    expect(allGrouped).not.toContain(DRAFT_SLUG);
  });

  it("returns featured published articles capped at the limit", () => {
    const featured = getFeaturedArticles(3);
    expect(featured).toHaveLength(3);
    expect(featured.every((a) => a.featured && a.status === "published")).toBe(true);
    expect(featured.some((a) => a.slug === DRAFT_SLUG)).toBe(false);
  });

  it("excludes the draft from related articles", () => {
    const related = getRelatedArticles("grosimile-reale", 5);
    expect(related.some((a) => a.slug === DRAFT_SLUG)).toBe(false);
  });

  it("respects the limit=2 cap on getFeaturedArticles", () => {
    expect(getFeaturedArticles(2)).toHaveLength(2);
  });

  it("getFeaturedArticles default limit is 3", () => {
    expect(getFeaturedArticles()).toHaveLength(3);
  });

  it("getRelatedArticles excludes the article itself", () => {
    const related = getRelatedArticles("grosimile-reale", 5);
    expect(related.some((a) => a.slug === "grosimile-reale")).toBe(false);
  });
});
