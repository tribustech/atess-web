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
  /** Height / displacement map (greyscale, linear) — drives real geometry relief. */
  displacementMap: string;
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
 * All 8 keys now resolve to REAL CC0 PBR scans (1k → downscaled to 512, 8-bit).
 * Sources: Poly Haven (CC0). See PLACEHOLDERS.md for the asset-slug mapping.
 */
export const TEXTURE_MANIFEST: Record<TextureKey, PbrMaps> = {
  // asphalt — Poly Haven "asphalt" (drenant subbase, gazon sintetic)
  asphalt: {
    map:          `${BASE}/asphalt_diff.jpg`,
    normalMap:    `${BASE}/asphalt_normal.png`,
    roughnessMap: `${BASE}/asphalt_rough.png`,
    displacementMap: `${BASE}/asphalt_disp.png`,
  },
  // epdm — smooth coloured in-situ rubber sports surface
  epdm: {
    map:          `${BASE}/epdm_diff.jpg`,
    normalMap:    `${BASE}/epdm_normal.png`,
    roughnessMap: `${BASE}/epdm_rough.png`,
    displacementMap: `${BASE}/epdm_disp.png`,
  },
  // sbr — black rubber granule mat
  sbr: {
    map:          `${BASE}/sbr_diff.jpg`,
    normalMap:    `${BASE}/sbr_normal.png`,
    roughnessMap: `${BASE}/sbr_rough.png`,
    displacementMap: `${BASE}/sbr_disp.png`,
  },
  // concrete — Poly Haven "concrete_floor_02" (bază de beton)
  concrete: {
    map:          `${BASE}/concrete_diff.jpg`,
    normalMap:    `${BASE}/concrete_normal.png`,
    roughnessMap: `${BASE}/concrete_rough.png`,
    displacementMap: `${BASE}/concrete_disp.png`,
  },
  // grass — Poly Haven "leafy_grass" (gazon sintetic surface)
  grass: {
    map:          `${BASE}/grass_diff.jpg`,
    normalMap:    `${BASE}/grass_normal.png`,
    roughnessMap: `${BASE}/grass_rough.png`,
    displacementMap: `${BASE}/grass_disp.png`,
  },
  // polyurethane — Poly Haven "smooth_concrete_floor" (smooth resin coating)
  polyurethane: {
    map:          `${BASE}/polyurethane_diff.jpg`,
    normalMap:    `${BASE}/polyurethane_normal.png`,
    roughnessMap: `${BASE}/polyurethane_rough.png`,
    displacementMap: `${BASE}/polyurethane_disp.png`,
  },
  // primer — Poly Haven "smooth_concrete_floor" (thin amorsă bonding coat)
  primer: {
    map:          `${BASE}/primer_diff.jpg`,
    normalMap:    `${BASE}/primer_normal.png`,
    roughnessMap: `${BASE}/primer_rough.png`,
    displacementMap: `${BASE}/primer_disp.png`,
  },
  // resin-stone — Poly Haven "gravel_floor" (piatră legată cu rășină)
  'resin-stone': {
    map:          `${BASE}/resin-stone_diff.jpg`,
    normalMap:    `${BASE}/resin-stone_normal.png`,
    roughnessMap: `${BASE}/resin-stone_rough.png`,
    displacementMap: `${BASE}/resin-stone_disp.png`,
  },
};

/** Resolve a FlooringLayer texture key to its PBR map paths. */
export function resolveTexture(key: TextureKey): PbrMaps {
  return TEXTURE_MANIFEST[key];
}
