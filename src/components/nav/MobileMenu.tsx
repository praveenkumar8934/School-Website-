"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { NavLink } from "@/components/nav/NavLink";
import { btn } from "@/lib/styles";
import type { NavLink as NavLinkType } from "@/lib/nav-config";

const menuVariants = {
  closed: { opacity: 0 },
  open: { opacity: 1 },
};

const panelVariants = {
  closed: { x: "100%" },
  open: { x: 0 },
};

const listVariants = {
  open: {
    transition: { staggerChildren: 0.06, delayChildren: 0.08 },
  },
};

const itemVariants = {
  closed: { opacity: 0, x: 16 },
  open: { opacity: 1, x: 0 },
};

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
  links: NavLinkType[];
  activeSection: string;
};

export function MobileMenu({
  open,
  onClose,
  links,
  activeSection,
}: MobileMenuProps) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          variants={menuVariants}
          initial="closed"
          animate="open"
          exit="closed"
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-40 md:hidden"
        >
          <motion.button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-navy-950/55 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.aside
            id="mobile-menu"
            variants={panelVariants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            aria-label="Mobile navigation"
            className="glass absolute right-0 top-0 flex h-full w-[min(320px,88vw)] flex-col border-l border-border shadow-elevated-lg"
          >
            <div className="border-b border-border-subtle px-5 py-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-gold-600">
                Menu
              </p>
              <p className="font-heading mt-1 text-lg font-bold text-navy-900">
                Nova Academy
              </p>
            </div>

            <motion.nav
              variants={listVariants}
              initial="closed"
              animate="open"
              className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4"
            >
              {links.map((link) => (
                <motion.div key={link.href} variants={itemVariants}>
                  <NavLink
                    link={link}
                    active={activeSection === link.sectionId}
                    scrolled
                    variant="mobile"
                    onNavigate={onClose}
                  />
                </motion.div>
              ))}
            </motion.nav>

            <div className="space-y-3 border-t border-border-subtle p-4">
              <a
                href="#contact"
                onClick={onClose}
                className="flex min-h-[48px] items-center justify-center rounded-xl px-4 py-3 text-center text-sm font-medium text-foreground-muted transition hover:bg-background-muted hover:text-blue-600 focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                Log in
              </a>
              <motion.a
                href="#contact"
                onClick={onClose}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`${btn.accent} w-full`}
              >
                Apply Now
              </motion.a>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
