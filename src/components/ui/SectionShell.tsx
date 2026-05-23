"use client";

import { AmbientBackground } from "@/components/ui/AmbientBackground";
import { SectionTransition } from "@/components/ui/SectionTransition";
import { section, type SectionTone } from "@/lib/styles";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type SectionShellProps = {
  id: string;
  children: ReactNode;
  tone?: SectionTone;
  className?: string;
  /** Stronger visual weight for key sections */
  prominence?: boolean;
  showTransition?: boolean;
  transitionFrom?: SectionTone;
  "aria-labelledby"?: string;
};

const toneClasses: Record<SectionTone, string> = {
  light: "section-mesh-light",
  muted: "section-mesh-muted",
  dark: "section-mesh-dark",
  accent: "section-mesh-accent",
};

const dividerClasses: Record<SectionTone, string> = {
  light: "section-divider",
  muted: "section-divider",
  dark: "section-divider-dark",
  accent: "section-divider",
};

export function SectionShell({
  id,
  children,
  tone = "light",
  className,
  prominence = false,
  showTransition = true,
  transitionFrom,
  "aria-labelledby": labelledBy,
}: SectionShellProps) {
  const ambientVariant = tone === "dark" ? "dark" : tone === "muted" ? "muted" : "light";

  return (
    <>
      {showTransition && (
        <SectionTransition
          from={transitionFrom ?? (tone === "dark" ? "light" : "muted")}
          to={tone === "dark" ? "dark" : tone}
        />
      )}
      <section
        id={id}
        aria-labelledby={labelledBy ?? `${id}-heading`}
        className={cn(
          section.wrap,
          "relative overflow-hidden",
          dividerClasses[tone],
          toneClasses[tone],
          prominence &&
            (tone === "dark" ? "section-prominent-dark" : "section-prominent"),
          className
        )}
      >
        <AmbientBackground variant={ambientVariant} />
        <div className={cn(section.container, "relative z-[1]")}>{children}</div>
      </section>
    </>
  );
}
