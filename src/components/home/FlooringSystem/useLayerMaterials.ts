import { useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import {
  MeshStandardMaterial,
  RepeatWrapping,
  SRGBColorSpace,
  type Texture,
} from 'three';
import type { FlooringSystem } from './flooring-systems';
import { TEXTURE_MANIFEST, type TextureKey } from './texture-manifest';

// ---------------------------------------------------------------------------
// Per-material displacement strength (scene units).
//
// Drives real geometry relief on the subdivided layer mesh — granular rubber
// and aggregate bump up into 3-D crumb; smooth resin coats stay nearly flat.
// Keep modest relative to layer thickness so layers don't tear apart.
// ---------------------------------------------------------------------------
const DISPLACEMENT_SCALE: Record<TextureKey, number> = {
  epdm: 0.11, // chunky red EPDM granules — the hero surface
  sbr: 0.09, // black rubber crumb
  'resin-stone': 0.085, // resin-bound aggregate
  grass: 0.1, // turf
  asphalt: 0.05, // drenant subbase
  concrete: 0.03, // cast slab — subtle
  polyurethane: 0.012, // smooth resin coat
  primer: 0.01, // thin bonding coat
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Collect all unique texture URLs required by a system (deduplicated so
 * useTexture() receives a stable-length array per system identity).
 */
function textureUrlsFor(system: FlooringSystem): string[] {
  return Array.from(
    new Set(
      system.layers.flatMap((l) => {
        const maps = TEXTURE_MANIFEST[l.texture as TextureKey];
        if (!maps) return [];
        return [maps.map, maps.normalMap, maps.roughnessMap, maps.displacementMap];
      })
    )
  );
}

function configureTexture(
  tex: Texture,
  tiling: [number, number],
  isColor: boolean,
  aniso: number,
): void {
  tex.wrapS = RepeatWrapping;
  tex.wrapT = RepeatWrapping;
  tex.repeat.set(tiling[0], tiling[1]);
  tex.anisotropy = aniso;
  if (isColor) tex.colorSpace = SRGBColorSpace;
  tex.needsUpdate = true;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Derives one MeshStandardMaterial per layer in `system`.
 *
 * Return shape: Record<string, MeshStandardMaterial>
 *   Keys are layer indices as strings ("0", "1", …) — stable for the system's
 *   layer array. Tasks 5/6 consume this via index when they build the 3-D stack
 *   from a FlooringSystem instead of the legacy LayerConfig array.
 *
 * All textures are resolved through TEXTURE_MANIFEST (diff / normal / rough).
 * Default tiling: [2, 2]. Default roughness: 0.9. No tint applied by default.
 *
 * Must be called inside a <Canvas> (requires @react-three/fiber context).
 */
export function useLayerMaterials(
  system: FlooringSystem,
): Record<string, MeshStandardMaterial> {
  // Stable URL list — recomputed only when system identity changes.
  const urls = useMemo(() => textureUrlsFor(system), [system]);

  // Single batched texture fetch. useTexture returns Texture[] when given string[].
  const textures = useTexture(urls) as Texture[];
  const gl = useThree((s) => s.gl);

  return useMemo(() => {
    const byUrl = new Map<string, Texture>();
    urls.forEach((url, i) => byUrl.set(url, textures[i]));

    const aniso = Math.min(gl.capabilities.getMaxAnisotropy(), 8);
    const out: Record<string, MeshStandardMaterial> = {};

    for (let idx = 0; idx < system.layers.length; idx++) {
      const layer = system.layers[idx];
      const maps = TEXTURE_MANIFEST[layer.texture as TextureKey];

      const mat = new MeshStandardMaterial({
        roughness: 0.92,
        metalness: 0,
        // Soft reflection fill only — full env intensity washes the diffuse
        // colour out (rich red EPDM → pale pink) and tints the near-black SBR
        // layer slate-blue from the cool studio HDRI. Keep it minimal; the
        // directional key light does the shaping and reveals the granules.
        envMapIntensity: 0.12,
      });

      // Coarser tiling so the rubber crumb reads as chunky granules (like the
      // reference tile) rather than fine sandpaper.
      const tiling: [number, number] = [2, 2];

      if (maps) {
        const diffTex = byUrl.get(maps.map);
        if (diffTex) {
          const tex = diffTex.clone();
          configureTexture(tex, tiling, true, aniso);
          mat.map = tex;
        }

        const normalTex = byUrl.get(maps.normalMap);
        if (normalTex) {
          const tex = normalTex.clone();
          configureTexture(tex, tiling, false, aniso);
          mat.normalMap = tex;
          // Strong normal scale does the heavy lifting for the granular LOOK:
          // GPU displacement moves vertices but doesn't recompute normals, so
          // the per-pixel normal map (same crumb source + tiling as the
          // displacement) is what makes the top face self-shade as 3-D crumb.
          mat.normalScale.set(2.6, 2.6);
        }

        const roughTex = byUrl.get(maps.roughnessMap);
        if (roughTex) {
          const tex = roughTex.clone();
          configureTexture(tex, tiling, false, aniso);
          mat.roughnessMap = tex;
        }

        const dispTex = byUrl.get(maps.displacementMap);
        if (dispTex) {
          const tex = dispTex.clone();
          configureTexture(tex, tiling, false, aniso);
          mat.displacementMap = tex;
          const scale = DISPLACEMENT_SCALE[layer.texture as TextureKey] ?? 0;
          mat.displacementScale = scale;
          // Bias by -half so the relief pushes both up and down around the
          // original slab surface instead of inflating the layer's thickness.
          mat.displacementBias = -scale * 0.5;
        }
      }

      mat.needsUpdate = true;
      out[String(idx)] = mat;
    }

    return out;
  }, [textures, gl, system, urls]);
}
