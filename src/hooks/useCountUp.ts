"use client";

import { animate, useInView, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

type UseCountUpOptions = {
  end: number;
  duration?: number;
  decimals?: number;
  enabled?: boolean;
};

export function useCountUp({
  end,
  duration = 2,
  decimals = 0,
  enabled = true,
}: UseCountUpOptions) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (v) =>
    decimals > 0 ? v.toFixed(decimals) : Math.round(v).toString()
  );

  useEffect(() => {
    if (!enabled || !inView) return;
    const controls = animate(motionValue, end, {
      duration,
      ease: [0.22, 1, 0.36, 1],
    });
    return () => controls.stop();
  }, [inView, end, duration, enabled, motionValue]);

  return { ref, rounded, inView };
}
