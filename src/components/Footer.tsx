"use client";

import { btn, input } from "@/lib/styles";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { GraduationCap, Globe, Link2, Mail, Share2 } from "lucide-react";
import { FormEvent, useState } from "react";

const footerLinks = {
  School: [
    { label: "About", href: "#about" },
    { label: "Courses", href: "#courses" },
    { label: "Faculty", href: "#faculty" },
    { label: "Gallery", href: "#gallery" },
  ],
  Admissions: [
    { label: "Apply Now", href: "#contact" },
    { label: "Tuition", href: "#contact" },
    { label: "Scholarships", href: "#contact" },
    { label: "FAQ", href: "#contact" },
  ],
  Resources: [
    { label: "Parent Portal", href: "#" },
    { label: "Calendar", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Alumni", href: "#" },
  ],
};

const socials = [
  { icon: Share2, label: "Facebook", href: "#" },
  { icon: Globe, label: "Instagram", href: "#" },
  { icon: Link2, label: "LinkedIn", href: "#" },
  { icon: Mail, label: "Email", href: "mailto:admissions@novaacademy.edu" },
];

export function Footer() {
  const [subscribed, setSubscribed] = useState(false);

  function handleNewsletter(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubscribed(true);
    setTimeout(() => setSubscribed(false), 3500);
  }

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-slate-950 text-slate-300">
      <div
        className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950/80 to-slate-900"
        aria-hidden
      />
      <div className="mesh-gradient absolute inset-0 opacity-30" aria-hidden />

      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-6 lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-2">
            <motion.a
              href="#home"
              whileHover={{ scale: 1.02 }}
              className="inline-flex items-center gap-2.5"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/30">
                <GraduationCap className="h-5 w-5" />
              </span>
              <span className="font-[family-name:var(--font-display)] text-lg font-semibold text-white">
                Nova <span className="text-indigo-400">Academy</span>
              </span>
            </motion.a>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
              Shaping future-ready leaders through excellence in education,
              innovation, and community since 1992.
            </p>

            <div className="mt-6 flex gap-3">
              {socials.map((s) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  whileHover={{ y: -3, scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 backdrop-blur-sm transition-colors hover:border-indigo-400/40 hover:bg-indigo-500/20 hover:text-white"
                >
                  <s.icon className="h-4 w-4" />
                </motion.a>
              ))}
            </div>

            <motion.a
              href="#contact"
              whileHover={{ y: -2 }}
              className={cn(btn.primary, "mt-6 hidden sm:inline-flex")}
            >
              Apply Now
            </motion.a>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
                {title}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <motion.a
                      href={link.href}
                      whileHover={{ x: 3 }}
                      className="inline-block text-sm text-slate-400 transition-colors hover:text-indigo-300"
                    >
                      {link.label}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="sm:col-span-2 lg:col-span-2">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              Stay Updated
            </h4>
            <p className="mt-2 text-sm text-slate-400">
              Get news and events in your inbox.
            </p>
            <form
              onSubmit={handleNewsletter}
              className="mt-4 flex flex-col gap-2 sm:flex-row lg:flex-col xl:flex-row"
            >
              <input
                type="email"
                required
                placeholder="Your email"
                aria-label="Email for newsletter"
                className={cn(
                  input,
                  "mt-0 border-white/15 bg-white/5 text-white placeholder:text-slate-500 focus:border-indigo-400 focus:bg-white/10"
                )}
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="shrink-0 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25"
              >
                {subscribed ? "Done!" : "Subscribe"}
              </motion.button>
            </form>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} Nova Academy. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            {["Privacy", "Terms", "Accessibility"].map((item) => (
              <motion.a
                key={item}
                href="#"
                whileHover={{ y: -1 }}
                className="text-slate-500 transition hover:text-indigo-300"
              >
                {item}
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
