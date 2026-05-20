"use client";

import { motion } from "framer-motion";
import { Clock, MapPin, ShieldCheck } from "lucide-react";
import { SITE_CONTACT } from "@/lib/site-contact";

const ITEMS = [
  {
    icon: <Clock strokeWidth={1.4} className="h-5 w-5" />,
    label: "Program",
    value: SITE_CONTACT.hours,
    sub: "Telefon ridicat în maxim 3 sonerii.",
  },
  {
    icon: <MapPin strokeWidth={1.4} className="h-5 w-5" />,
    label: "Bază",
    value: `${SITE_CONTACT.city}, ${SITE_CONTACT.region}`,
    sub: SITE_CONTACT.coverage,
  },
  {
    icon: <ShieldCheck strokeWidth={1.4} className="h-5 w-5" />,
    label: "Garanție răspuns",
    value: SITE_CONTACT.responseWindow,
    sub: "În zilele lucrătoare. Weekend-uri tratate luni dimineață.",
  },
];

export function ContactMeta() {
  return (
    <section className="border-t border-border bg-bg-elevated">
      <div className="mx-auto w-full max-w-7xl px-6 py-16 md:px-10 md:py-20">
        <div className="grid gap-10 md:grid-cols-3 md:gap-12">
          {ITEMS.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mb-4 flex items-center gap-3 text-accent-primary">
                {item.icon}
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-text-muted">
                  {item.label}
                </span>
              </div>
              <p className="text-xl font-semibold text-text-primary md:text-2xl">
                {item.value}
              </p>
              <p className="mt-2 text-sm text-text-muted">{item.sub}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
