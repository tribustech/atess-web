import { Info, AlertTriangle, Lightbulb, Quote } from "lucide-react";
import type { AcademySection } from "@/lib/academy";

interface ArticleRendererProps {
  sections: AcademySection[];
}

const CALLOUT_STYLES = {
  info: {
    border: "border-accent-primary/40",
    bg: "bg-accent-primary/[0.06]",
    iconColor: "text-accent-primary",
    Icon: Info,
  },
  warn: {
    border: "border-amber-500/40",
    bg: "bg-amber-500/[0.06]",
    iconColor: "text-amber-400",
    Icon: AlertTriangle,
  },
  tip: {
    border: "border-emerald-500/40",
    bg: "bg-emerald-500/[0.06]",
    iconColor: "text-emerald-400",
    Icon: Lightbulb,
  },
} as const;

export function ArticleRenderer({ sections }: ArticleRendererProps) {
  return (
    <div className="article-prose flex flex-col gap-6">
      {sections.map((section, idx) => {
        switch (section.type) {
          case "p":
            return (
              <p
                key={idx}
                className="text-base leading-relaxed text-text-primary/90 md:text-lg md:leading-[1.75]"
              >
                {section.text}
              </p>
            );

          case "h2":
            return (
              <h2
                key={idx}
                className="mt-8 text-2xl font-semibold tracking-tight text-text-primary md:text-3xl"
              >
                {section.text}
              </h2>
            );

          case "h3":
            return (
              <h3
                key={idx}
                className="mt-4 text-xl font-semibold tracking-tight text-text-primary md:text-2xl"
              >
                {section.text}
              </h3>
            );

          case "list":
            return (
              <ul
                key={idx}
                className="my-2 ml-1 flex flex-col gap-3 text-base text-text-primary/90 md:text-lg"
              >
                {section.items.map((item, i) => (
                  <li key={i} className="relative pl-6">
                    <span className="absolute left-0 top-[0.65em] h-1.5 w-1.5 rounded-full bg-accent-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            );

          case "ordered":
            return (
              <ol
                key={idx}
                className="my-2 ml-1 flex flex-col gap-3 text-base text-text-primary/90 md:text-lg"
              >
                {section.items.map((item, i) => (
                  <li key={i} className="relative pl-10">
                    <span className="absolute left-0 top-0 inline-flex h-7 w-7 items-center justify-center border border-accent-primary/40 font-mono text-xs text-accent-primary">
                      {i + 1}
                    </span>
                    {item}
                  </li>
                ))}
              </ol>
            );

          case "quote":
            return (
              <figure
                key={idx}
                className="my-4 flex gap-4 border-l-2 border-accent-primary bg-bg-elevated/40 p-6 md:p-8"
              >
                <Quote
                  size={20}
                  className="mt-1 shrink-0 text-accent-primary"
                />
                <blockquote className="flex flex-col gap-3">
                  <p className="text-lg italic text-text-primary md:text-xl">
                    {section.text}
                  </p>
                  {section.attribution && (
                    <footer className="font-mono text-xs uppercase tracking-wider text-text-muted">
                      — {section.attribution}
                    </footer>
                  )}
                </blockquote>
              </figure>
            );

          case "callout": {
            const style = CALLOUT_STYLES[section.tone];
            const { Icon } = style;
            return (
              <aside
                key={idx}
                className={`my-2 flex gap-4 border ${style.border} ${style.bg} p-5 md:p-6`}
              >
                <Icon
                  size={20}
                  className={`mt-0.5 shrink-0 ${style.iconColor}`}
                />
                <div className="flex flex-col gap-2">
                  {section.title && (
                    <p
                      className={`font-mono text-[11px] uppercase tracking-[0.2em] ${style.iconColor}`}
                    >
                      {section.title}
                    </p>
                  )}
                  <p className="text-sm leading-relaxed text-text-primary/95 md:text-base">
                    {section.text}
                  </p>
                </div>
              </aside>
            );
          }

          default:
            return null;
        }
      })}
    </div>
  );
}
