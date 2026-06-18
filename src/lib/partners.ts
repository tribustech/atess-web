import { z } from "zod";
import partnersRaw from "@/data/partners.json";

// ---------------------------------------------------------------------------
// Zod schema
// ---------------------------------------------------------------------------

const PartnerSchema = z.object({
  slug: z.string(),
  name: z.string(),
  type: z.enum(["manufacturer", "client"]),
  logo: z.string(),
  description: z.string().optional(),
  url: z.string().optional(),
  rank: z.number().int().optional(),
  lead: z.boolean().optional(),
});

const PartnersArraySchema = z.array(PartnerSchema);

// Validate at module load — throws at startup if the JSON drifts from the schema.
const partners = PartnersArraySchema.parse(partnersRaw);

// ---------------------------------------------------------------------------
// TypeScript types (derived from the Zod schema + narrowed sub-types)
// ---------------------------------------------------------------------------

export type PartnerType = "manufacturer" | "client";

export interface Partner {
  slug: string;
  name: string;
  type: PartnerType;
  logo: string;
  description?: string;
  url?: string;
  rank?: number;
  lead?: boolean;
}

export interface Manufacturer extends Partner {
  type: "manufacturer";
  description: string;
  url: string;
  rank: number;
  lead: boolean;
}

export interface Client extends Partner {
  type: "client";
}

// ---------------------------------------------------------------------------
// Selectors
// ---------------------------------------------------------------------------

export function getManufacturers(): Manufacturer[] {
  return (partners as Partner[])
    .filter((p): p is Manufacturer => p.type === "manufacturer")
    .sort((a, b) => a.rank - b.rank);
}

export function getClients(): Client[] {
  return (partners as Partner[]).filter(
    (p): p is Client => p.type === "client",
  );
}

export function getLeadManufacturer(): Manufacturer {
  const manufacturers = getManufacturers();
  return manufacturers.find((m) => m.lead) ?? manufacturers[0];
}
