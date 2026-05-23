"use client";

import { useScrollProgress } from "@/hooks/useScrollProgress";
import { motion, useSpring } from "framer-motion";

export function ScrollProgress() {
  const progress = useScrollProgress();
  const scaleX = useSpring(progress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <motion.div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
      aria-label="Page scroll progress"
      className="progress-glow pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-navy-800 via-blue-600 to-gold-400"
      style={{ scaleX }}
    />
  );
}
