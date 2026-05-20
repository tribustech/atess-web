import academyRaw from "@/data/academy.json";

export type AcademyCategory = "fundamente" | "decizii" | "tehnic" | "specializari";
export type AcademyLevel = "incepator" | "intermediar" | "avansat";
export type AcademyAudience = "arhitecti" | "beneficiari" | "antreprenori";

export type AcademySection =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "quote"; text: string; attribution?: string }
  | { type: "callout"; tone: "info" | "warn" | "tip"; title?: string; text: string }
  | { type: "list"; items: string[] }
  | { type: "ordered"; items: string[] };

export interface AcademyArticle {
  slug: string;
  title: string;
  dek: string;
  category: AcademyCategory;
  audience: AcademyAudience[];
  level: AcademyLevel;
  readingMin: number;
  tags: string[];
  featured: boolean;
  sections: AcademySection[];
}

const articles = academyRaw as AcademyArticle[];

export const CATEGORY_META: Record<
  AcademyCategory,
  { label: string; sub: string; order: number }
> = {
  fundamente: {
    label: "Bazele",
    sub: "Concepte fundamentale înainte de orice proiect",
    order: 1,
  },
  decizii: {
    label: "Ghiduri de decizie",
    sub: "Cum alegi corect în funcție de context",
    order: 2,
  },
  tehnic: {
    label: "Tehnic & mituri",
    sub: "Fișe tehnice, certificări și ce nu-ți spune marketingul",
    order: 3,
  },
  specializari: {
    label: "Specializări",
    sub: "Servicii și sisteme pe care le facem distinct",
    order: 4,
  },
};

export const LEVEL_LABEL: Record<AcademyLevel, string> = {
  incepator: "Începător",
  intermediar: "Intermediar",
  avansat: "Avansat",
};

export function getAllArticles(): AcademyArticle[] {
  return articles;
}

export function getArticleBySlug(slug: string): AcademyArticle | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getArticlesGroupedByCategory(): Array<{
  category: AcademyCategory;
  label: string;
  sub: string;
  articles: AcademyArticle[];
}> {
  const map = new Map<AcademyCategory, AcademyArticle[]>();
  for (const a of articles) {
    const list = map.get(a.category) ?? [];
    list.push(a);
    map.set(a.category, list);
  }
  return (Array.from(map.entries()) as Array<[AcademyCategory, AcademyArticle[]]>)
    .map(([category, list]) => ({
      category,
      label: CATEGORY_META[category].label,
      sub: CATEGORY_META[category].sub,
      articles: list,
    }))
    .sort((a, b) => CATEGORY_META[a.category].order - CATEGORY_META[b.category].order);
}

export function getRelatedArticles(slug: string, count = 3): AcademyArticle[] {
  const current = getArticleBySlug(slug);
  if (!current) return [];
  const scored = articles
    .filter((a) => a.slug !== slug)
    .map((a) => {
      const sameCat = a.category === current.category ? 2 : 0;
      const tagOverlap = a.tags.filter((t) => current.tags.includes(t)).length;
      return { article: a, score: sameCat + tagOverlap };
    })
    .sort((x, y) => y.score - x.score);
  return scored.slice(0, count).map((s) => s.article);
}
