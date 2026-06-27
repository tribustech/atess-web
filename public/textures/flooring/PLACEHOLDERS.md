# Flooring PBR textures — source map

The 3D flooring systems (`src/components/home/FlooringSystem/flooring-systems.ts`) reference the
PBR maps below via `texture-manifest.ts`. **All keys now resolve to real textures** — no more
copy-of-another-map placeholders. Maps are 512px, 8-bit (diffuse `*_diff.jpg`, OpenGL normal
`*_normal.png`, roughness `*_rough.png`). Replacing a file (same name) needs no code change.

| Texture key | Used by layer(s) | Source |
| --- | --- | --- |
| `concrete`     | Bază de beton | Poly Haven **concrete_floor_02** (CC0) |
| `primer`       | Amorsă (thin bonding coat) | Poly Haven **smooth_concrete_floor** (CC0) |
| `sbr`          | Strat SBR (black rubber crumb) | ambientCG **Rubber001** (CC0) — real black rubber-crumb scan |
| `polyurethane` | Straturi PU / liant (smooth resin coat) | Poly Haven **smooth_concrete_floor** (CC0) |
| `epdm`         | Suprafață EPDM (red rubber granules) | ambientCG **Rubber003** (CC0) coarse rubber-crumb relief, diffuse colorized red |
| `resin-stone`  | Mortar piatră + rășină | Poly Haven **gravel_floor** (CC0) |
| `asphalt`      | Subbază / piatră spartă (gazon sintetic) | Poly Haven asphalt scan (CC0) |
| `grass`        | Gazon sintetic surface | Poly Haven **leafy_grass** (CC0) |

## Notes
- **EPDM / SBR** are modelled to match real two-layer rubber sports tiles (red EPDM granule top
  over black SBR crumb base). They share the same granular normal/roughness relief so both read
  as 3D rubber crumb; only the diffuse colour differs. To swap in a photographed EPDM granule
  scan later, drop `epdm_diff.jpg` (+ optional `epdm_normal.png` / `epdm_rough.png`) in place.
- All Poly Haven and ambientCG assets are **CC0** (public domain) — safe under the
  no-scraping-competitor-photos rule in `feedback/CHANGE-PLAN.md` §11.

## PBR map channels expected per key
- `*_diff.jpg` — diffuse / albedo (sRGB)
- `*_normal.png` — OpenGL tangent-space normal
- `*_rough.png` — roughness (greyscale, linear)
- `*_disp.png` — height / displacement (greyscale, linear) — drives **real geometry
  relief**. Layer meshes are subdivided (`LayerStack` `segments`) and each material
  applies `displacementMap` + per-key `displacementScale` (see `useLayerMaterials.ts`),
  so granular layers (EPDM, SBR, gravel) physically bump up into crumb and the slab
  edges crumble. EPDM/SBR heights come from the ambientCG rubber scans; the rest are
  derived from each key's diffuse luminance.
