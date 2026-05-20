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

  const showBack = nav.hasBack && nav.hideBack !== true;
  const showNext = nav.hasNext;
  const isEmpty = !showBack && !showNext;

  if (isEmpty) return null;

  const aloneNext = showNext && !showBack;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-bg-base pb-safe"
      aria-hidden={isEmpty}
    >
      <div className="mx-auto flex w-full max-w-2xl items-center gap-3 px-4 py-3 sm:gap-4 sm:px-6 sm:py-4">
        {showBack && (
          <Button
            variant="ghost"
            size="md"
            onClick={() => navStore.current().onBack?.()}
            className="h-11 px-5 text-sm sm:px-6 sm:text-base"
          >
            Înapoi
          </Button>
        )}
        {showNext && (
          <Button
            variant="primary"
            size="md"
            onClick={() => navStore.current().onNext?.()}
            disabled={nav.nextDisabled}
            className={
              aloneNext
                ? "h-11 w-full px-6 text-sm sm:text-base"
                : "ml-auto h-11 px-5 text-sm sm:px-6 sm:text-base"
            }
          >
            {nav.nextLabel ?? "Continuă"}
          </Button>
        )}
      </div>
    </div>
  );
}
