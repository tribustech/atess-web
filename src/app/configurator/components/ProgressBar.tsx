"use client";
import { motion } from "framer-motion";

type Props = {
  current: number;
  total: number;
};

export function ProgressBar({ current, total }: Props) {
  const ratio = Math.min(1, Math.max(0, current / Math.max(total, 1)));
  return (
    <div className="fixed inset-x-0 top-0 z-30 h-1 bg-bg-elevated">
      <motion.div
        className="h-full bg-accent-primary"
        animate={{ scaleX: ratio }}
        style={{ originX: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        initial={false}
      />
    </div>
  );
}
