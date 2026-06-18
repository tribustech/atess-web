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
        return [maps.map, maps.normalMap, maps.roughnessMap];
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
        roughness: 0.9,
        metalness: 0,
      });

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
          mat.normalScale.set(1, 1);
        }

        const roughTex = byUrl.get(maps.roughnessMap);
        if (roughTex) {
          const tex = roughTex.clone();
          configureTexture(tex, tiling, false, aniso);
          mat.roughnessMap = tex;
        }
      }

      mat.needsUpdate = true;
      out[String(idx)] = mat;
    }

    return out;
  }, [textures, gl, system, urls]);
}
