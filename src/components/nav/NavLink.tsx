"use client";

import { motion } from "framer-motion";
import type { NavLink as NavLinkType } from "@/lib/nav-config";
import { cn } from "@/lib/utils";

type NavLinkProps = {
  link: NavLinkType;
  active: boolean;
  scrolled: boolean;
  variant?: "desktop" | "mobile";
  onNavigate?: () => void;
};

export function NavLink({
  link,
  active,
  scrolled,
  variant = "desktop",
  onNavigate,
}: NavLinkProps) {
  if (variant === "mobile") {
    return (
      <motion.a
        href={link.href}
        onClick={onNavigate}
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "relative flex items-center rounded-xl px-4 py-3 text-base font-medium transition-colors",
          active
            ? "bg-indigo-50 text-indigo-700"
            : "text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
        )}
      >
        {active && (
          <motion.span
            layoutId="mobile-nav-active"
            className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-full bg-gradient-to-b from-indigo-600 to-violet-600"
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
          />
        )}
        <span className={cn("pl-2", active && "pl-3")}>{link.label}</span>
      </motion.a>
    );
  }

  return (
    <a
      href={link.href}
      onClick={onNavigate}
      className={cn(
        "relative px-1 py-2 text-sm font-medium transition-colors duration-200",
        scrolled
          ? active
            ? "text-indigo-600"
            : "text-slate-600 hover:text-indigo-600"
          : active
            ? "text-white"
            : "text-white/85 hover:text-white"
      )}
    >
      {link.label}
      {active && (
        <motion.span
          layoutId="desktop-nav-indicator"
          className={cn(
            "absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full",
            scrolled
              ? "bg-gradient-to-r from-indigo-600 to-violet-600"
              : "bg-gradient-to-r from-indigo-200 to-violet-200"
          )}
          transition={{ type: "spring", stiffness: 400, damping: 32 }}
        />
      )}
    </a>
  );
}
