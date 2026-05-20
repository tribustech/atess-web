export const SITE_CONTACT = {
  phone: {
    display: "+40 700 000 000",
    tel: "+40700000000",
    waNumber: "40700000000",
  },
  email: "contact@atess.ro",
  city: "București",
  region: "România",
  hours: "Luni–Vineri · 09:00–18:00",
  responseWindow: "Răspundem în < 24h",
  coverage: "Acoperire națională · proiecte în 30+ județe",
} as const;

export const WA_DEFAULT_MESSAGE =
  "Bună! Sunt interesat(ă) de o pardoseală sportivă ATESS. Putem discuta?";

export function waLink(message: string = WA_DEFAULT_MESSAGE): string {
  return `https://wa.me/${SITE_CONTACT.phone.waNumber}?text=${encodeURIComponent(message)}`;
}
