import { z } from "zod";

export const equipmentItemSchema = z.object({
  id: z.string().min(1),
  kind: z.enum(["machine", "van", "team"]),
  src: z.string().startsWith("/images/"),
  alt: z.string().min(8),
  isPlaceholder: z.boolean(),
  span: z.enum(["wide", "tall"]).optional(),
});

export const equipmentItemsSchema = z.array(equipmentItemSchema).min(1);

export type EquipmentItem = z.infer<typeof equipmentItemSchema>;
