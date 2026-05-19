export type GalleryCategory =
  | "piste-atletism"
  | "multisport"
  | "locuri-joaca"
  | "educational"
  | "interioare";

export const GALLERY_CATEGORIES: { slug: GalleryCategory; label: string }[] = [
  { slug: "piste-atletism", label: "Piste atletism" },
  { slug: "multisport", label: "Multisport" },
  { slug: "locuri-joaca", label: "Locuri de joacă" },
  { slug: "educational", label: "Educațional" },
  { slug: "interioare", label: "Interioare" },
];

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
