"use client";

import { useState } from "react";

type LogoNameBadgeProps = {
  name: string;
  logo: string;
  compact?: boolean;
};

function initialsFromName(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function LogoNameBadge({
  name,
  logo,
  compact = false,
}: LogoNameBadgeProps) {
  const [hasError, setHasError] = useState(false);
  const initials = initialsFromName(name);

  return (
    <div className={`flex items-center ${compact ? "gap-2" : "gap-3"}`}>
      {!hasError ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logo}
          alt={`${name} logo`}
          className={`${compact ? "h-9 w-9" : "h-12 w-12"} rounded-sm border border-border bg-bg-base object-contain p-1`}
          loading="lazy"
          decoding="async"
          onError={() => setHasError(true)}
        />
      ) : (
        <div
          className={`${compact ? "h-9 w-9 text-[10px]" : "h-12 w-12 text-xs"} grid place-items-center rounded-sm border border-accent-primary/40 bg-bg-base font-mono text-accent-primary`}
        >
          {initials}
        </div>
      )}
      <span
        className={`${compact ? "text-xs" : "text-sm"} font-medium text-text-primary`}
      >
        {name}
      </span>
    </div>
  );
}
