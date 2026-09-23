export const SITE_CONTACT = {
  phone: {
    display: "0766 684 441",
    tel: "+40766684441",
    waNumber: "40766684441",
  },
  email: "teo.neagu@atessproject.ro",
  city: "București",
  region: "România",
  hours: "Luni–Vineri · 09:00–18:00",
  responseWindow: "Răspundem în < 24h",
  coverage: "Acoperire națională · proiecte în 30+ județe",
} as const;

export const WA_DEFAULT_MESSAGE =
  "Bună ziua! Sunt interesat(ă) de o pardoseală profesională ATESS. Putem discuta?";

export function waLink(message: string = WA_DEFAULT_MESSAGE): string {
  return `https://wa.me/${SITE_CONTACT.phone.waNumber}?text=${encodeURIComponent(message)}`;
}
