import { equipmentItemsSchema, type EquipmentItem } from "./equipment.schema";

// PLACEHOLDER assets — toate imaginile sunt provizorii până trimite Teo
// foto reale (utilaje decupate, dubă, echipă). Schimbă `src` și pune
// `isPlaceholder: false` la fiecare item odată ce sosește fotografia.
const items: EquipmentItem[] = [
  {
    id: "machine-1",
    kind: "machine",
    src: "/images/placeholders/equipment-machine-1.svg",
    alt: "Utilaj de aplicare a pardoselilor poliuretanice",
    isPlaceholder: true,
  },
  {
    id: "machine-2",
    kind: "machine",
    src: "/images/placeholders/equipment-machine-2.svg",
    alt: "Malaxor pentru amestec de rășină și agregat",
    isPlaceholder: true,
  },
  {
    id: "machine-3",
    kind: "machine",
    src: "/images/placeholders/equipment-machine-3.svg",
    alt: "Mașină de șlefuit suprafețe de beton",
    isPlaceholder: true,
  },
  {
    id: "machine-4",
    kind: "machine",
    src: "/images/placeholders/equipment-machine-4.svg",
    alt: "Pompă pentru turnarea sistemelor sport",
    isPlaceholder: true,
  },
  {
    id: "machine-5",
    kind: "machine",
    src: "/images/placeholders/equipment-machine-5.svg",
    alt: "Echipament de pulverizare pentru strat EPDM",
    isPlaceholder: true,
  },
  {
    id: "machine-6",
    kind: "machine",
    src: "/images/placeholders/equipment-machine-6.svg",
    alt: "Utilaj de compactare pentru substrat",
    isPlaceholder: true,
  },
  {
    id: "duba",
    kind: "van",
    src: "/images/placeholders/equipment-duba.svg",
    alt: "Duba de transport echipamente ATESS",
    isPlaceholder: true,
    span: "wide",
  },
  {
    id: "team",
    kind: "team",
    src: "/images/placeholders/equipment-team.svg",
    alt: "Echipa ATESS pe șantier",
    isPlaceholder: true,
    span: "tall",
  },
];

export const EQUIPMENT_ITEMS: EquipmentItem[] = equipmentItemsSchema.parse(items);
