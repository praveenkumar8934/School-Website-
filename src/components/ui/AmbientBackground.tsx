"use client";

import { cn } from "@/lib/utils";

type AmbientBackgroundProps = {
  variant?: "light" | "muted" | "dark";
  className?: string;
};

export function AmbientBackground({
  variant = "light",
  className,
}: AmbientBackgroundProps) {
  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden
    >
      <div
        className={cn(
          "animate-float absolute -left-20 top-[12%] h-56 w-56 rounded-full blur-[90px] sm:h-72 sm:w-72 sm:blur-[110px]",
          variant === "dark"
            ? "bg-blue-600/20"
            : "bg-blue-500/14"
        )}
      />
      <div
        className={cn(
          "animate-float-delayed absolute -right-16 bottom-[18%] h-64 w-64 rounded-full blur-[100px] sm:h-80 sm:w-80",
          variant === "dark"
            ? "bg-gold-500/12"
            : "bg-gold-400/10"
        )}
      />
      <div
        className={cn(
          "absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]",
          variant === "dark"
            ? "bg-blue-800/20 opacity-40"
            : "bg-blue-400/8 opacity-60"
        )}
      />
      {variant !== "dark" && (
        <div className="mesh-gradient absolute inset-0 opacity-40" />
      )}
    </div>
  );
}
