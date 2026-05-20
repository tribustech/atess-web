import partnersData from "@/data/partners.json";

const stockmeier = partnersData.find((p) => p.slug === "stockmeier");

export function PartnerPanel() {
  if (!stockmeier) return null;

  return (
    <section className="bg-bg-base">
      <div className="mx-auto w-full max-w-7xl px-6 py-24 md:px-10 md:py-32">
        <div className="grid gap-12 border border-border bg-bg-elevated p-10 md:grid-cols-[0.7fr_1.3fr] md:items-center md:gap-16 md:p-16">
          <div className="flex items-center justify-center bg-bg-base p-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={stockmeier.logo}
              alt={stockmeier.name}
              className="h-20 w-auto max-w-[260px] object-contain"
            />
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent-primary">
              Partener certificat
            </p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight md:text-4xl">
              Stockmeier — liderul mondial în sisteme poliuretanice sportive.
            </h2>
            <p className="mt-6 text-lg text-text-muted">
              Suntem aplicator certificat în România. Toate sistemele pe care le
              turnăm vin cu fișă tehnică originală, test report și garanția
              producătorului — nu cu un email scris de noi. Dacă semnezi cu noi,
              ai în spate o companie care livrează stadioane în toată lumea.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
