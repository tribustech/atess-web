import { useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import {
  Color,
  MeshStandardMaterial,
  RepeatWrapping,
  SRGBColorSpace,
  type Texture,
} from 'three';
import { LAYERS, type LayerConfig, type LayerId } from './layers.config';

// Collect all unique texture urls for a single useTexture call.
const TEXTURE_URLS = Array.from(
  new Set(
    LAYERS.flatMap((l) => [l.textures?.map, l.textures?.normalMap, l.textures?.roughnessMap])
      .filter((v): v is string => typeof v === 'string')
  )
);

// Preload so textures start fetching as soon as the module is imported.
useTexture.preload(TEXTURE_URLS);

function configureTexture(tex: Texture, tiling: [number, number], isColor: boolean, aniso: number) {
  tex.wrapS = RepeatWrapping;
  tex.wrapT = RepeatWrapping;
  tex.repeat.set(tiling[0], tiling[1]);
  tex.anisotropy = aniso;
  if (isColor) tex.colorSpace = SRGBColorSpace;
  tex.needsUpdate = true;
}

export function useLayerMaterials(): Record<LayerId, MeshStandardMaterial> {
  const textures = useTexture(TEXTURE_URLS) as Texture[];
  const gl = useThree((s) => s.gl);

  return useMemo(() => {
    const byUrl = new Map<string, Texture>();
    TEXTURE_URLS.forEach((url, i) => byUrl.set(url, textures[i]));

    const aniso = Math.min(gl.capabilities.getMaxAnisotropy(), 8);
    const out = {} as Record<LayerId, MeshStandardMaterial>;

    for (const layer of LAYERS) {
      const mat = new MeshStandardMaterial({
        roughness: layer.roughness ?? 0.9,
        metalness: 0,
      });

      if (layer.tint) mat.color = new Color(layer.tint);

      const tiling = layer.tiling ?? [1, 1];

      const mapUrl = layer.textures?.map;
      if (mapUrl) {
        const tex = byUrl.get(mapUrl)!.clone();
        configureTexture(tex, tiling, true, aniso);
        mat.map = tex;
      }

      const normalUrl = layer.textures?.normalMap;
      if (normalUrl) {
        const tex = byUrl.get(normalUrl)!.clone();
        configureTexture(tex, tiling, false, aniso);
        mat.normalMap = tex;
        mat.normalScale.set(layer.normalScale ?? 1, layer.normalScale ?? 1);
      }

      const roughUrl = layer.textures?.roughnessMap;
      if (roughUrl) {
        const tex = byUrl.get(roughUrl)!.clone();
        configureTexture(tex, tiling, false, aniso);
        mat.roughnessMap = tex;
      }

      mat.needsUpdate = true;
      out[layer.id] = mat;
    }

    return out;
  }, [textures, gl]);
}

export function getLayerByIndex(i: number): LayerConfig {
  return LAYERS[i];
}
