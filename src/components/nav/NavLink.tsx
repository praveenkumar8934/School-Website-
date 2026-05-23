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
            ? "bg-blue-50 text-blue-700"
            : "text-navy-800 hover:bg-background-muted hover:text-blue-600"
        )}
      >
        {active && (
          <motion.span
            layoutId="mobile-nav-active"
            className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-full bg-gradient-to-b from-gold-500 to-gold-400"
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
        "link-underline relative rounded-md px-1 py-2 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
        scrolled
          ? active
            ? "text-blue-600"
            : "text-foreground-muted hover:text-blue-600"
          : active
            ? "text-gold-300"
            : "text-white/90 hover:text-white"
      )}
    >
      {link.label}
      {active && (
        <motion.span
          layoutId="desktop-nav-indicator"
          className={cn(
            "absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full",
            scrolled
              ? "bg-gradient-to-r from-blue-600 to-blue-500"
              : "bg-gradient-to-r from-gold-400 to-gold-300"
          )}
          transition={{ type: "spring", stiffness: 400, damping: 32 }}
        />
      )}
    </a>
  );
}
