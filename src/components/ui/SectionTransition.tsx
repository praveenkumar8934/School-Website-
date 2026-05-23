"use client";

import { cn } from "@/lib/utils";

import type { SectionTone } from "@/lib/styles";

type SectionTransitionProps = {
  from?: SectionTone;
  to?: SectionTone;
};

const fadeMap: Record<SectionTone, string> = {
  light: "from-background/90",
  muted: "from-background-muted/90",
  dark: "from-navy-950/95",
  accent: "from-blue-50/90",
};

const glowMap: Record<SectionTone, string> = {
  light: "via-blue-500/8",
  muted: "via-blue-500/6",
  dark: "via-blue-600/12",
  accent: "via-blue-500/10",
};

export function SectionTransition({
  from = "light",
  to = "muted",
}: SectionTransitionProps) {
  return (
    <div
      className="pointer-events-none relative z-10 -mt-px h-16 w-full sm:h-20"
      aria-hidden
    >
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-b to-transparent",
          fadeMap[from]
        )}
      />
      <div
        className={cn(
          "absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent to-transparent",
          glowMap[to]
        )}
      />
      <div className="absolute inset-x-[10%] top-1/2 h-8 -translate-y-1/2 rounded-full bg-blue-500/10 blur-2xl" />
    </div>
  );
}
