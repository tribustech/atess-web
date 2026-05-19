"use client";

import { useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { GalleryEntry } from "@/lib/gallery";

interface LightboxProps {
  entries: GalleryEntry[];
  index: number | null;
  onClose: () => void;
  onIndexChange: (next: number) => void;
}

export function Lightbox({ entries, index, onClose, onIndexChange }: LightboxProps) {
  const open = index !== null;
  const current = open ? entries[index] : null;
  const dialogRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  const goPrev = useCallback(() => {
    if (index === null) return;
    onIndexChange((index - 1 + entries.length) % entries.length);
  }, [index, entries.length, onIndexChange]);

  const goNext = useCallback(() => {
    if (index === null) return;
    onIndexChange((index + 1) % entries.length);
  }, [index, entries.length, onIndexChange]);

  // Capture previously-focused element on open; restore it on close.
  useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    return () => {
      previouslyFocused.current?.focus?.();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const trapFocus = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const dialog = dialogRef.current;
      if (!dialog) return;
      const focusables = dialog.querySelectorAll<HTMLElement>(
        'button, [href], [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "ArrowRight") goNext();
      else if (e.key === "Home") onIndexChange(0);
      else if (e.key === "End") onIndexChange(entries.length - 1);
      else trapFocus(e);
    };

    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose, goPrev, goNext, onIndexChange, entries.length]);

  return (
    <AnimatePresence>
      {open && current ? (
        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={current.alt}
          tabIndex={-1}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 outline-none"
          onClick={onClose}
          onTouchStart={(e) => {
            touchStartX.current = e.touches[0]?.clientX ?? null;
          }}
          onTouchEnd={(e) => {
            if (touchStartX.current === null) return;
            const dx = (e.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
            if (Math.abs(dx) > 50) {
              if (dx < 0) goNext();
              else goPrev();
            }
            touchStartX.current = null;
          }}
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative flex max-h-full max-w-6xl flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              key={current.id}
              src={current.src}
              alt={current.alt}
              width={current.width}
              height={current.height}
              sizes="100vw"
              className="h-auto max-h-[80vh] w-auto object-contain"
              priority
            />
            {current.caption ? (
              <p className="mt-4 text-sm text-text-muted">{current.caption}</p>
            ) : null}

            <button
              type="button"
              onClick={onClose}
              aria-label="Închide"
              className="absolute -top-3 -right-3 grid h-10 w-10 place-items-center rounded-full bg-bg-base text-text-primary"
            >
              <X size={18} />
            </button>
            <button
              type="button"
              onClick={goPrev}
              aria-label="Imaginea anterioară"
              className="absolute left-2 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-bg-base/70 text-text-primary"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Imaginea următoare"
              className="absolute right-2 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-bg-base/70 text-text-primary"
            >
              <ChevronRight size={22} />
            </button>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
