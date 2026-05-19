export type LayerId = 'base' | 'binder' | 'sbr' | 'epdm';

export type LayerConfig = {
  id: LayerId;
  label: string;
  description: string;
  size: [number, number]; // x, z footprint
  thickness: number;
  order: number; // 0 = bottom
  explodeOffset: number; // additive Y offset at progress=1
  textures?: {
    map?: string;
    normalMap?: string;
    roughnessMap?: string;
  };
  tint?: string;
  tiling?: [number, number];
  roughness?: number;
  normalScale?: number;
};

export const LAYERS: LayerConfig[] = [
  {
    id: 'base',
    label: 'Bază de beton',
    description: 'Fundație de asfalt sau beton care asigură suport structural.',
    size: [4.2, 4.2],
    thickness: 0.6,
    order: 0,
    explodeOffset: 0,
    textures: {
      map: '/textures/flooring/asphalt_diff.jpg',
      normalMap: '/textures/flooring/asphalt_normal.png',
      roughnessMap: '/textures/flooring/asphalt_rough.png',
    },
    tiling: [2, 2],
    roughness: 0.95,
    normalScale: 1,
  },
  {
    id: 'binder',
    label: 'Strat de legătură',
    description: 'Liant poliuretanic care fixează stratul amortizor de bază.',
    size: [4.05, 4.05],
    thickness: 0.1,
    order: 1,
    explodeOffset: 0.5,
    // No diffuse — solid color. Reuse asphalt normal for tactile micro-variation.
    textures: {
      normalMap: '/textures/flooring/asphalt_normal.png',
    },
    tint: '#1a1410',
    tiling: [4, 4],
    roughness: 0.4,
    normalScale: 0.15,
  },
  {
    id: 'sbr',
    label: 'Strat amortizor SBR',
    description: 'Granule SBR reciclate care absorb impactul și vibrațiile.',
    size: [4.0, 4.0],
    thickness: 0.35,
    order: 2,
    explodeOffset: 1.1,
    textures: {
      map: '/textures/flooring/sbr_diff.jpg',
      normalMap: '/textures/flooring/sbr_normal.png',
      roughnessMap: '/textures/flooring/sbr_rough.png',
    },
    tiling: [2.5, 2.5],
    roughness: 0.9,
    normalScale: 1,
  },
  {
    id: 'epdm',
    label: 'Suprafață EPDM',
    description: 'Strat de uzură din cauciuc EPDM colorat, rezistent la UV și intemperii.',
    size: [3.95, 3.95],
    thickness: 0.2,
    order: 3,
    explodeOffset: 1.8,
    textures: {
      map: '/textures/flooring/epdm_diff.jpg',
      normalMap: '/textures/flooring/epdm_normal.png',
      roughnessMap: '/textures/flooring/epdm_rough.png',
    },
    tint: '#b23a2a',
    tiling: [2.5, 2.5],
    roughness: 0.85,
    normalScale: 1,
  },
];

// Collapsed-state Y center for a layer, given cumulative thickness of layers below.
export function collapsedCenterY(index: number): number {
  let y = 0;
  for (let i = 0; i < index; i++) y += LAYERS[i].thickness;
  y += LAYERS[index].thickness / 2;
  // Offset so bottom of base sits at ~ -0.4 (matches ContactShadows)
  return y - 0.4;
}
