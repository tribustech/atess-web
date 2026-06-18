import Image from "next/image";
import { EQUIPMENT_ITEMS } from "@/data/equipment";

function spanClass(span?: "wide" | "tall") {
  if (span === "wide") return "sm:col-span-2";
  if (span === "tall") return "sm:row-span-2";
  return "";
}

export function EquipmentShowcase() {
  return (
    <section className="border-y border-border bg-bg-elevated">
      <div className="mx-auto w-full max-w-7xl px-6 py-24 md:px-10 md:py-32">
        <header className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent-primary">
            Utilaje &amp; echipă
          </p>
          <h2 className="mt-4 text-display-lg">Gama completă, oamenii reali.</h2>
          <p className="mt-5 text-lg text-text-muted">
            Aplicăm cu utilaje proprii, nu închiriate la zi. De la malaxoare și
            pompe până la duba de șantier și echipa care le ține în mână —
            capacitatea de execuție stă la noi.
          </p>
        </header>

        <div className="mt-14 grid auto-rows-[200px] grid-cols-2 gap-4 sm:grid-cols-3 md:auto-rows-[240px]">
          {EQUIPMENT_ITEMS.map((item) => (
            <figure
              key={item.id}
              className={`group relative overflow-hidden border border-border bg-bg-base ${spanClass(
                item.span
              )}`}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                unoptimized
                sizes="(max-width: 640px) 50vw, 33vw"
                className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                draggable={false}
              />
              {item.isPlaceholder ? (
                <figcaption className="absolute left-2 top-2 z-10 bg-black/60 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/80">
                  Placeholder
                </figcaption>
              ) : null}
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
