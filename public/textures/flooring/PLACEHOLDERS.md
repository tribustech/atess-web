# Flooring PBR textures — placeholder map

The 3D flooring systems (`src/components/home/FlooringSystem/flooring-systems.ts`) reference
the PBR maps below. Files marked **PLACEHOLDER** are temporary copies of an existing map so the
scene renders end-to-end. Teo builds the final 3D from raw PBR downloads; the developer's job is
to source the correct raw materials from Poly Haven / textures.com / 3dtextures.me and drop them
in at the exact filenames below (diffuse as `*_diff.jpg`, normal as `*_normal.png`, roughness as
`*_rough.png`). **No code change is needed when a real map replaces a placeholder.**

| Texture key | Filename prefix | Used by layer(s) | Status | Where the real map comes from |
| --- | --- | --- | --- | --- |
| `asphalt`      | `asphalt_*`       | Subbază balast, piatră spartă 0–63 (gazon sintetic) | REAL (existing) | — |
| `concrete`     | `concrete_*`      | Bază de beton (sport-outdoor, sport-indoor, locuri-joaca, pardoseli-piatra) | **PLACEHOLDER** (copy of asphalt) | Poly Haven "concrete_floor" / "concrete_bare" |
| `epdm`         | `epdm_*`          | Suprafață EPDM (sport-outdoor, locuri-joaca) | REAL (existing) | — |
| `grass`        | `grass_*`         | Gazon sintetic + umplutură granule plută (gazon-sintetic) | **PLACEHOLDER** (copy of epdm, green tint applied in material) | textures.com "artificial grass / turf" |
| `polyurethane` | `polyurethane_*`  | Straturi PU, liant poliuretanic (sport-outdoor, sport-indoor, locuri-joaca) | **PLACEHOLDER** (copy of epdm — smooth surface) | textures.com "smooth polyurethane coating" / Poly Haven "plastic" |
| `primer`       | `primer_*`        | Amorsă (sport-outdoor, sport-indoor, locuri-joaca, pardoseli-piatra) | **PLACEHOLDER** (copy of sbr — thin coat) | textures.com "paint primer" / solid near-black tint sufficient |
| `resin-stone`  | `resin-stone_*`   | Mortar piatră + rășină (pardoseli-piatra) | **PLACEHOLDER** (copy of sbr — granular) | textures.com "gravel / resin-bound aggregate" / "exposed aggregate" |
| `sbr`          | `sbr_*`           | Straturi SBR granule (sport-outdoor, sport-indoor, locuri-joaca) | REAL (existing) | — |

## Real materials Teo specifically asked to source

| Material | Used for |
| --- | --- |
| SBR granule (negru, mărun) | `sbr` layers — already have a placeholder; replace with real scan |
| EPDM granule (color) | `epdm` layers — already have a placeholder; replace with real scan |
| Asfalt drenant | `asphalt` — subbază gazon sintetic |
| Gazon sintetic / iarbă artificială | `grass` — gazon-sintetic surface layer |
| Piatră legată cu rășină (aggregate resin-bound) | `resin-stone` — pardoseli-piatra surface |

## PBR map channels expected per key

Each key needs three files:

- `*_diff.jpg` — diffuse / albedo (sRGB colour)
- `*_normal.png` — OpenGL tangent-space normal map
- `*_rough.png` — roughness (greyscale, linear)

Optional when available: `*_ao.png` (ambient occlusion), `*_disp.png` (displacement / height).
Task 4 material loader will pick up AO and displacement automatically if present alongside the
three required maps.
