"use client";

import { useCountUp } from "@/hooks/useCountUp";
import { cn } from "@/lib/utils";
import { motion, useMotionValueEvent, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

type AnimatedCounterProps = {
  end: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
};

export function AnimatedCounter({
  end,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 2,
  className,
}: AnimatedCounterProps) {
  const reduceMotion = useReducedMotion();
  const { ref, rounded, inView } = useCountUp({
    end,
    duration: reduceMotion ? 0 : duration,
    decimals,
    enabled: !reduceMotion,
  });
  const [display, setDisplay] = useState(
    decimals > 0 ? (0).toFixed(decimals) : "0"
  );

  useEffect(() => {
    if (reduceMotion && inView) {
      setDisplay(
        decimals > 0 ? end.toFixed(decimals) : Math.round(end).toString()
      );
    }
  }, [reduceMotion, inView, end, decimals]);

  useMotionValueEvent(rounded, "change", (v) => {
    if (!reduceMotion) setDisplay(String(v));
  });

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {prefix}
      <motion.span>{display}</motion.span>
      {suffix}
    </span>
  );
}
