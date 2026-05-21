"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, GraduationCap } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const links = [
  { label: "About", href: "#about" },
  { label: "Courses", href: "#courses" },
  { label: "Faculty", href: "#faculty" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6">
      <nav
        className={cn(
          "mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-5 py-3 transition-all duration-300",
          scrolled
            ? "glass shadow-lg shadow-indigo-500/5"
            : "bg-transparent"
        )}
      >
        <a href="#" className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/30">
            <GraduationCap className="h-5 w-5" />
          </span>
          <span
            className={cn(
              "font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight transition-colors",
              scrolled ? "text-slate-900" : "text-white"
            )}
          >
            Nova{" "}
            <span className={scrolled ? "text-indigo-600" : "text-indigo-200"}>
              Academy
            </span>
          </span>
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors",
                  scrolled
                    ? "text-slate-600 hover:text-indigo-600"
                    : "text-white/90 hover:text-white"
                )}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href="#contact"
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition",
              scrolled
                ? "text-slate-600 hover:text-indigo-600"
                : "text-white/90 hover:text-white"
            )}
          >
            Log in
          </a>
          <a
            href="#contact"
            className="rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:shadow-indigo-500/40 hover:brightness-110"
          >
            Apply Now
          </a>
        </div>

        <button
          type="button"
          className={cn(
            "rounded-lg p-2 md:hidden",
            scrolled ? "text-slate-700" : "text-white"
          )}
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="glass mx-auto mt-2 max-w-6xl rounded-2xl p-4 shadow-xl md:hidden"
          >
            <ul className="flex flex-col gap-1">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="mt-3 block rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 py-3 text-center text-sm font-semibold text-white"
            >
              Apply Now
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
