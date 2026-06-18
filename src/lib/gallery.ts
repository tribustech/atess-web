export type ProjectCategory =
  | "piste-atletism"
  | "multisport"
  | "locuri-joaca"
  | "spatii-publice"
  | "interioare"
  | "constructii-cheie";

// Kept as an alias so existing gallery imports keep compiling.
export type GalleryCategory = ProjectCategory;

export const PROJECT_CATEGORIES: { slug: ProjectCategory; label: string }[] = [
  { slug: "piste-atletism", label: "Piste de atletism" },
  { slug: "multisport", label: "Terenuri multisport" },
  { slug: "locuri-joaca", label: "Locuri de joacă" },
  { slug: "spatii-publice", label: "Spații publice & gazon" },
  { slug: "interioare", label: "Pardoseli interioare" },
  { slug: "constructii-cheie", label: "Construcții la cheie" },
];

// Backwards-compatible alias for the gallery code that already imports GALLERY_CATEGORIES.
export const GALLERY_CATEGORIES = PROJECT_CATEGORIES;

export type GalleryEntry = {
  id: string;
  src: string;
  thumb: string;
  width: number;
  height: number;
  blurDataURL: string;
  alt: string;
  category: GalleryCategory;
  caption?: string;
  projectSlug?: string;
  featured?: boolean;
};

export function buildImageGalleryJsonLd(
  entries: GalleryEntry[],
  siteUrl: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: "Proiecte realizate — Atess Professional Flooring",
    url: `${siteUrl}/proiecte`,
    associatedMedia: entries.map((e) => ({
      "@type": "ImageObject",
      contentUrl: `${siteUrl}${e.src}`,
      thumbnailUrl: `${siteUrl}${e.thumb}`,
      name: e.caption ?? e.alt,
      caption: e.alt,
      width: e.width,
      height: e.height,
    })),
  };
}

export function assertAllAltsFilled(entries: GalleryEntry[]) {
  const missing = entries.filter((e) => !e.alt.trim());
  if (missing.length > 0) {
    throw new Error(
      `gallery.json: ${missing.length} entries have empty alt: ${missing
        .map((e) => e.id)
        .join(", ")}`,
    );
  }
}
