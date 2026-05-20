import type { Metadata } from "next";
import { ContactHero } from "@/components/contact/ContactHero";
import { ContactChannels } from "@/components/contact/ContactChannels";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactMeta } from "@/components/contact/ContactMeta";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Telefon, WhatsApp sau formular. Răspundem în mai puțin de 24 de ore lucrătoare. Aplicator certificat Stockmeier.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact | ATESS Project",
    description: "Telefon, WhatsApp, email — alege cum vrei să ne găsești.",
    url: "/contact",
  },
};

export default function ContactPage() {
  return (
    <main>
      <ContactHero />
      <ContactChannels />
      <ContactForm />
      <ContactMeta />
    </main>
  );
}
