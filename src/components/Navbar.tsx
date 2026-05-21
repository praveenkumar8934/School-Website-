"use client";

import { motion } from "framer-motion";
import { GraduationCap, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { MobileMenu } from "@/components/nav/MobileMenu";
import { NavLink } from "@/components/nav/NavLink";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { NAV_LINKS, NAV_SECTION_IDS } from "@/lib/nav-config";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const activeSection = useScrollSpy(NAV_SECTION_IDS);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setOpen(false);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
        <motion.nav
          layout
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
          className={cn(
            "mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-2xl border px-4 py-2.5 transition-[background,box-shadow,border-color,padding] duration-300 sm:px-5 sm:py-3",
            scrolled
              ? "glass border-white/70 shadow-lg shadow-indigo-500/10"
              : "glass-hero border-white/15 bg-transparent shadow-none"
          )}
        >
          <motion.a
            href="#home"
            onClick={closeMenu}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex shrink-0 items-center gap-2.5"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/30 transition-shadow duration-300 hover:shadow-indigo-500/45">
              <GraduationCap className="h-5 w-5" />
            </span>
            <span
              className={cn(
                "font-[family-name:var(--font-display)] text-base font-semibold tracking-tight transition-colors duration-300 sm:text-lg",
                scrolled ? "text-slate-900" : "text-white"
              )}
            >
              Nova{" "}
              <span className={scrolled ? "text-indigo-600" : "text-indigo-200"}>
                Academy
              </span>
            </span>
          </motion.a>

          <ul className="hidden items-center gap-6 lg:gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <NavLink
                  link={link}
                  active={activeSection === link.sectionId}
                  scrolled={scrolled}
                />
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-2 md:flex md:gap-3">
            <motion.a
              href="#contact"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200",
                scrolled
                  ? "text-slate-600 hover:text-indigo-600"
                  : "text-white/90 hover:text-white"
              )}
            >
              Log in
            </motion.a>
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              className="rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-shadow duration-300 hover:shadow-indigo-500/40"
            >
              Apply Now
            </motion.a>
          </div>

          <motion.button
            type="button"
            whileTap={{ scale: 0.92 }}
            className={cn(
              "relative flex h-10 w-10 items-center justify-center rounded-xl transition-colors md:hidden",
              scrolled
                ? "bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
                : "bg-white/15 text-white backdrop-blur-md hover:bg-white/25"
            )}
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </motion.button>
        </motion.nav>
      </header>

      <MobileMenu
        open={open}
        onClose={closeMenu}
        links={NAV_LINKS}
        activeSection={activeSection}
      />
    </>
  );
}
