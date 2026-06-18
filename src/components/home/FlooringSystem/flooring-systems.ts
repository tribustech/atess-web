/**
 * FlooringSystem data-type contract and systems data module.
 *
 * This is the canonical cross-plan contract for the 3-D flooring section.
 * Later tasks (3-D scene, UI components) import from here — do NOT change
 * exported names without updating all consumers.
 *
 * Layer stacks are ordered bottom → top.
 * Layer count is DERIVED from the `layers` array — never hard-coded elsewhere.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type FlooringSystemId =
  | 'sport-outdoor'
  | 'sport-indoor'
  | 'locuri-joaca'
  | 'pardoseli-piatra'
  | 'gazon-sintetic';

export interface FlooringLayer {
  /** User-facing Romanian label, professional register. */
  label: string;
  /** Nominal thickness in millimetres (placeholder — Teo will tune). */
  thicknessMm: number;
  /** Stable texture key / path; real PBR maps arrive in Task 3. */
  texture: string;
}

export interface FlooringSystem {
  id: FlooringSystemId;
  /** User-facing system name, Romanian. */
  title: string;
  /** Ordered bottom → top. Layer count is DERIVED from this array. */
  layers: FlooringLayer[];
}

// ---------------------------------------------------------------------------
// Systems data
// ---------------------------------------------------------------------------

const SPORT_OUTDOOR: FlooringSystem = {
  id: 'sport-outdoor',
  title: 'Sistem sport exterior (spray PU + EPDM)',
  layers: [
    { label: 'Bază de beton',               thicknessMm: 100, texture: 'concrete'   },
    { label: 'Amorsă',                       thicknessMm:   1, texture: 'concrete'   },
    { label: 'Strat SBR',                    thicknessMm:  10, texture: 'sbr'        },
    { label: 'Strat poliuretan',             thicknessMm:   2, texture: 'sbr'        },
    { label: 'Strat poliuretan',             thicknessMm:   2, texture: 'sbr'        },
    { label: 'Suprafață EPDM',               thicknessMm:   6, texture: 'epdm'       },
  ],
};

const SPORT_INDOOR: FlooringSystem = {
  id: 'sport-indoor',
  title: 'Sistem sport interior (PU)',
  layers: [
    { label: 'Bază de beton',                thicknessMm: 100, texture: 'concrete'   },
    { label: 'Amorsă',                        thicknessMm:   1, texture: 'concrete'   },
    { label: 'Strat elastic SBR',             thicknessMm:  10, texture: 'sbr'        },
    { label: 'Strat poliuretan',              thicknessMm:   2, texture: 'sbr'        },
    { label: 'Strat de uzură poliuretan (cu marcaje)', thicknessMm: 3, texture: 'sbr' },
  ],
};

const LOCURI_JOACA: FlooringSystem = {
  id: 'locuri-joaca',
  title: 'Pardoseală loc de joacă (SBR + EPDM)',
  layers: [
    { label: 'Bază de beton',               thicknessMm: 100, texture: 'concrete'    },
    { label: 'Amorsă',                       thicknessMm:   1, texture: 'concrete'    },
    { label: 'Strat de bază SBR',            thicknessMm:  40, texture: 'sbr'         },
    { label: 'Suprafață EPDM colorată',      thicknessMm:  13, texture: 'epdm'        },
  ],
};

const PARDOSELI_PIATRA: FlooringSystem = {
  id: 'pardoseli-piatra',
  title: 'Pardoseală de piatră legată cu rășină',
  layers: [
    { label: 'Bază de beton',               thicknessMm: 100, texture: 'concrete'    },
    { label: 'Amorsă',                       thicknessMm:   1, texture: 'concrete'    },
    { label: 'Mortar piatră + rășină',       thicknessMm:  18, texture: 'resin-stone' },
  ],
};

const GAZON_SINTETIC: FlooringSystem = {
  id: 'gazon-sintetic',
  title: 'Gazon sintetic cu plută',
  layers: [
    { label: 'Trasament balast compactat',          thicknessMm: 150, texture: 'asphalt' },
    { label: 'Piatră spartă 0–63 compactată',       thicknessMm: 100, texture: 'asphalt' },
    { label: 'Gazon sintetic + umplutură (granule plută)', thicknessMm: 40, texture: 'grass' },
  ],
};

// ---------------------------------------------------------------------------
// Registry and helpers
// ---------------------------------------------------------------------------

export const FLOORING_SYSTEMS: Record<FlooringSystemId, FlooringSystem> = {
  'sport-outdoor':    SPORT_OUTDOOR,
  'sport-indoor':     SPORT_INDOOR,
  'locuri-joaca':     LOCURI_JOACA,
  'pardoseli-piatra': PARDOSELI_PIATRA,
  'gazon-sintetic':   GAZON_SINTETIC,
};

export const FLOORING_SYSTEM_LIST: FlooringSystem[] = Object.values(FLOORING_SYSTEMS);

export const DEFAULT_FLOORING_SYSTEM_ID: FlooringSystemId = 'sport-outdoor';

export function getFlooringSystem(id: FlooringSystemId): FlooringSystem {
  return FLOORING_SYSTEMS[id];
}
