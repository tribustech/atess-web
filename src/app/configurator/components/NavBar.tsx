"use client";
import { useSyncExternalStore } from "react";
import { Button } from "@/components/shared/Button";
import { navStore } from "../nav-store";

export function NavBar() {
  const nav = useSyncExternalStore(
    navStore.subscribe,
    navStore.getSnapshot,
    navStore.getSnapshot,
  );

  const isEmpty = !nav.hasNext && !nav.hasBack;
  const showBack = nav.hasBack && !nav.hideBack;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-bg-base pb-safe"
      style={{
        transform: "translateZ(0)",
        visibility: isEmpty ? "hidden" : "visible",
      }}
      aria-hidden={isEmpty}
    >
      <div className="mx-auto flex w-full max-w-2xl items-center justify-between gap-3 px-5 py-3 sm:gap-4 sm:px-6 sm:py-4">
        {!nav.hideBack ? (
          <Button
            variant="ghost"
            size="md"
            onClick={() => navStore.current().onBack?.()}
            disabled={!showBack}
          >
            Înapoi
          </Button>
        ) : (
          <span />
        )}
        {nav.hasNext ? (
          <Button
            variant="primary"
            size="md"
            onClick={() => navStore.current().onNext?.()}
            disabled={nav.nextDisabled}
          >
            {nav.nextLabel ?? "Continuă"}
          </Button>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
