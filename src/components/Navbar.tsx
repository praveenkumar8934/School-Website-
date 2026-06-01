"use client";

import { motion } from "framer-motion";
import { GraduationCap, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { MobileMenu } from "@/components/nav/MobileMenu";
import { NavLink } from "@/components/nav/NavLink";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { NAV_LINKS, NAV_SECTION_IDS } from "@/lib/nav-config";
import { btn } from "@/lib/styles";
import { cn } from "@/lib/utils";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [session, setSession] = useState<{ portal: string } | null>(null);
  const [admissionsOpen, setAdmissionsOpen] = useState(false);
  const activeSection = useScrollSpy(NAV_SECTION_IDS);

  useEffect(() => {
    // Check session securely
    async function checkSession() {
      try {
        const res = await fetch("/api/auth/session");
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setSession({ portal: data.user.role });
          }
        }
      } catch (e) {
        console.error("Session fetch error", e);
      }
    }
    checkSession();

    async function fetchSettings() {
      try {
        const { data } = await supabase.from("system_settings").select("admissions_open").eq("id", 1).single();
        if (data) setAdmissionsOpen(data.admissions_open);
      } catch (err) {
        console.error(err);
      }
    }
    fetchSettings();

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
          role="navigation"
          aria-label="Main navigation"
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
          className={cn(
            "mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-2xl border px-4 py-2.5 transition-[background,box-shadow,border-color,padding] duration-300 sm:px-5 sm:py-3",
            scrolled
              ? "glass border-border shadow-elevated"
              : "glass-hero border-white/15 shadow-none"
          )}
        >
          <motion.a
            href="#home"
            onClick={closeMenu}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex shrink-0 items-center gap-2.5"
          >
            <span className="icon-brand flex h-10 w-10 items-center justify-center rounded-xl">
              <GraduationCap className="h-5 w-5" />
            </span>
            <span
              className={cn(
                "font-heading text-base font-bold tracking-tight transition-colors duration-300 sm:text-lg",
                scrolled ? "text-navy-900" : "text-white"
              )}
            >
              Nova{" "}
              <span className={scrolled ? "text-blue-600" : "text-gold-300"}>
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
            {session ? (
              <motion.a
                href={
                  session.portal === "admin"
                    ? "/admin-dashboard"
                    : session.portal === "faculty"
                    ? "/teacher-dashboard"
                    : "/dashboard"
                }
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200",
                  scrolled
                    ? "text-foreground-muted hover:text-blue-600"
                    : "text-white/90 hover:text-gold-300"
                )}
              >
                Dashboard
              </motion.a>
            ) : (
              <motion.a
                href="/login"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200",
                  scrolled
                    ? "text-foreground-muted hover:text-blue-600"
                    : "text-white/90 hover:text-gold-300"
                )}
              >
                Log in
              </motion.a>
            )}
            {admissionsOpen && (
              <motion.a
                href="/admissions"
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
                className={cn(btn.accent, "px-5 py-2.5 text-sm")}
              >
                Apply Now
              </motion.a>
            )}
          </div>

          <motion.button
            type="button"
            whileTap={{ scale: 0.92 }}
            className={cn(
              "relative flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-xl transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 md:hidden",
              scrolled
                ? "bg-blue-50 text-navy-800 hover:bg-blue-100 hover:text-blue-600"
                : "bg-white/15 text-white backdrop-blur-md hover:bg-white/25"
            )}
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
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
        admissionsOpen={admissionsOpen}
      />
    </>
  );
}
