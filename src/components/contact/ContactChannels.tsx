"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Mail, MessageCircle, Phone } from "lucide-react";
import { SITE_CONTACT, waLink } from "@/lib/site-contact";

type Channel = {
  key: string;
  label: string;
  value: string;
  href: string;
  meta: string;
  icon: React.ReactNode;
  accent: "red" | "green" | "neutral";
};

const CHANNELS: Channel[] = [
  {
    key: "phone",
    label: "Telefon",
    value: SITE_CONTACT.phone.display,
    href: `tel:${SITE_CONTACT.phone.tel}`,
    meta: "Apasă să suni · răspunde Teo",
    icon: <Phone strokeWidth={1.4} className="h-6 w-6" />,
    accent: "red",
  },
  {
    key: "whatsapp",
    label: "WhatsApp",
    value: SITE_CONTACT.phone.display,
    href: waLink(),
    meta: "Chat rapid · poți trimite poze cu locația",
    icon: <MessageCircle strokeWidth={1.4} className="h-6 w-6" />,
    accent: "green",
  },
  {
    key: "email",
    label: "Email",
    value: SITE_CONTACT.email,
    href: `mailto:${SITE_CONTACT.email}`,
    meta: "Pentru cereri detaliate, atașamente, planuri",
    icon: <Mail strokeWidth={1.4} className="h-6 w-6" />,
    accent: "neutral",
  },
];

const accentBorder: Record<Channel["accent"], string> = {
  red: "hover:border-accent-primary",
  green: "hover:border-[#25D366]",
  neutral: "hover:border-text-primary/40",
};

const accentText: Record<Channel["accent"], string> = {
  red: "text-accent-primary",
  green: "text-[#25D366]",
  neutral: "text-text-primary",
};

const accentGlow: Record<Channel["accent"], string> = {
  red: "from-accent-primary/0 via-accent-primary/20 to-accent-primary/0",
  green: "from-[#25D366]/0 via-[#25D366]/20 to-[#25D366]/0",
  neutral: "from-text-primary/0 via-text-primary/10 to-text-primary/0",
};

export function ContactChannels() {
  return (
    <section className="border-b border-border bg-bg-base">
      <div className="mx-auto w-full max-w-7xl px-6 py-20 md:px-10 md:py-24">
        <div className="mb-12 flex items-end justify-between gap-6">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <span className="h-px w-8 bg-accent-primary" />
              <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-accent-primary">
                Canale directe
              </p>
            </div>
            <h2 className="text-display-lg">
              Alege cum
              <br />
              <span className="font-serif italic text-text-muted">
                vrei să ne găsești.
              </span>
            </h2>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3 md:gap-6">
          {CHANNELS.map((c, i) => (
            <motion.a
              key={c.key}
              href={c.href}
              target={c.key === "whatsapp" ? "_blank" : undefined}
              rel={c.key === "whatsapp" ? "noopener noreferrer" : undefined}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4 }}
              className={`group relative block overflow-hidden border border-border bg-bg-elevated p-8 transition-colors duration-300 ${accentBorder[c.accent]}`}
            >
              <span
                className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r ${accentGlow[c.accent]} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
              />

              <div className="flex items-start justify-between">
                <div className={`${accentText[c.accent]}`}>{c.icon}</div>
                <ArrowUpRight
                  strokeWidth={1.4}
                  className="h-5 w-5 text-text-faint transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-text-primary"
                />
              </div>

              <p className="mt-10 font-mono text-[10px] uppercase tracking-[0.3em] text-text-muted">
                {c.label}
              </p>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-text-primary md:text-3xl">
                {c.value}
              </p>
              <p className="mt-3 text-sm text-text-muted">{c.meta}</p>

              <div
                className={`mt-8 h-px w-full bg-border transition-colors duration-300 group-hover:bg-current ${accentText[c.accent]}`}
              />
              <p className="mt-4 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-text-muted transition-colors group-hover:text-text-primary">
                {c.key === "phone" && "Sună acum"}
                {c.key === "whatsapp" && "Deschide WhatsApp"}
                {c.key === "email" && "Trimite email"}
                <span aria-hidden>→</span>
              </p>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
