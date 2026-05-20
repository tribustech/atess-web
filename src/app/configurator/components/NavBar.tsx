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
  const showBackButton = !nav.hideBack;
  const aloneNext = nav.hasNext && !showBackButton;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-bg-base pb-safe"
      style={{
        transform: "translateZ(0)",
        visibility: isEmpty ? "hidden" : "visible",
      }}
      aria-hidden={isEmpty}
    >
      <div className="mx-auto flex w-full max-w-2xl items-center gap-3 px-4 py-3 sm:gap-4 sm:px-6 sm:py-4">
        {showBackButton && (
          <Button
            variant="ghost"
            size="md"
            onClick={() => navStore.current().onBack?.()}
            disabled={!showBack}
            className="h-11 px-5 text-sm sm:h-11 sm:px-6 sm:text-base"
          >
            Înapoi
          </Button>
        )}
        {nav.hasNext && (
          <Button
            variant="primary"
            size="md"
            onClick={() => navStore.current().onNext?.()}
            disabled={nav.nextDisabled}
            className={
              aloneNext
                ? "h-11 w-full px-6 text-sm sm:h-11 sm:text-base"
                : "ml-auto h-11 px-5 text-sm sm:h-11 sm:px-6 sm:text-base"
            }
          >
            {nav.nextLabel ?? "Continuă"}
          </Button>
        )}
      </div>
    </div>
  );
}
