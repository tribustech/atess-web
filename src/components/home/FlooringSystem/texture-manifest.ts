/**
 * Texture key → PBR file path manifest.
 *
 * Maps the 8 stable `texture` keys used in flooring-systems.ts to concrete
 * asset paths under /public/textures/flooring/. Task 4 (material loader
 * refactor) imports this record to resolve a FlooringLayer's `texture` field
 * to actual TextureLoader URLs.
 *
 * Files marked PLACEHOLDER are temporary copies of an existing map. When Teo
 * supplies the real PBR scans, replace only the file — no code change needed.
 * See public/textures/flooring/PLACEHOLDERS.md for sourcing guidance.
 */

const BASE = '/textures/flooring' as const;

export interface PbrMaps {
  /** Diffuse / albedo (sRGB). */
  map: string;
  /** Tangent-space normal map. */
  normalMap: string;
  /** Roughness map (greyscale, linear). */
  roughnessMap: string;
}

/** All 8 texture keys referenced by flooring-systems.ts. */
export type TextureKey =
  | 'asphalt'
  | 'concrete'
  | 'epdm'
  | 'grass'
  | 'polyurethane'
  | 'primer'
  | 'resin-stone'
  | 'sbr';

/**
 * Manifest mapping each TextureKey to its three PBR map paths.
 *
 * REAL entries: asphalt, epdm, sbr — sourced from actual PBR scans.
 * PLACEHOLDER entries: concrete, grass, polyurethane, primer, resin-stone —
 *   copied from a visually similar REAL map so the 3D scene loads end-to-end.
 *   Replace the files at the paths listed here when real maps are available.
 */
export const TEXTURE_MANIFEST: Record<TextureKey, PbrMaps> = {
  // --- REAL ---
  asphalt: {
    map:          `${BASE}/asphalt_diff.jpg`,
    normalMap:    `${BASE}/asphalt_normal.png`,
    roughnessMap: `${BASE}/asphalt_rough.png`,
  },
  epdm: {
    map:          `${BASE}/epdm_diff.jpg`,
    normalMap:    `${BASE}/epdm_normal.png`,
    roughnessMap: `${BASE}/epdm_rough.png`,
  },
  sbr: {
    map:          `${BASE}/sbr_diff.jpg`,
    normalMap:    `${BASE}/sbr_normal.png`,
    roughnessMap: `${BASE}/sbr_rough.png`,
  },

  // --- PLACEHOLDER (copy of asphalt) ---
  concrete: {
    map:          `${BASE}/concrete_diff.jpg`,
    normalMap:    `${BASE}/concrete_normal.png`,
    roughnessMap: `${BASE}/concrete_rough.png`,
  },

  // --- PLACEHOLDER (copy of epdm, green tint applied in material) ---
  grass: {
    map:          `${BASE}/grass_diff.jpg`,
    normalMap:    `${BASE}/grass_normal.png`,
    roughnessMap: `${BASE}/grass_rough.png`,
  },

  // --- PLACEHOLDER (copy of epdm — smooth coating) ---
  polyurethane: {
    map:          `${BASE}/polyurethane_diff.jpg`,
    normalMap:    `${BASE}/polyurethane_normal.png`,
    roughnessMap: `${BASE}/polyurethane_rough.png`,
  },

  // --- PLACEHOLDER (copy of sbr — thin binding coat) ---
  primer: {
    map:          `${BASE}/primer_diff.jpg`,
    normalMap:    `${BASE}/primer_normal.png`,
    roughnessMap: `${BASE}/primer_rough.png`,
  },

  // --- PLACEHOLDER (copy of sbr — granular aggregate) ---
  'resin-stone': {
    map:          `${BASE}/resin-stone_diff.jpg`,
    normalMap:    `${BASE}/resin-stone_normal.png`,
    roughnessMap: `${BASE}/resin-stone_rough.png`,
  },
};

/** Resolve a FlooringLayer texture key to its PBR map paths. */
export function resolveTexture(key: TextureKey): PbrMaps {
  return TEXTURE_MANIFEST[key];
}
