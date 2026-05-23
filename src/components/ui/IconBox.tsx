"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

type IconBoxProps = {
  icon: LucideIcon;
  variant?: "brand" | "gold" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
};

const sizes = {
  sm: "h-9 w-9 rounded-lg [&_svg]:h-4 [&_svg]:w-4",
  md: "h-11 w-11 rounded-xl [&_svg]:h-5 [&_svg]:w-5",
  lg: "h-12 w-12 rounded-xl [&_svg]:h-6 [&_svg]:w-6",
};

export function IconBox({
  icon: Icon,
  variant = "brand",
  size = "md",
  className,
  label,
}: IconBoxProps) {
  return (
    <motion.span
      whileHover={{ scale: 1.08, rotate: 4 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 18 }}
      className={cn(
        "inline-flex shrink-0 items-center justify-center transition-shadow duration-300",
        sizes[size],
        variant === "brand" && "icon-brand",
        variant === "gold" && "icon-gold",
        variant === "ghost" &&
          "border border-border bg-card text-blue-600 shadow-elevated",
        className
      )}
      aria-hidden={!label}
      aria-label={label}
    >
      <Icon className="transition-transform duration-300" strokeWidth={2} />
    </motion.span>
  );
}
