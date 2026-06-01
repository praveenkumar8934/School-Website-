"use client";

import { btn, input } from "@/lib/styles";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { GraduationCap, Globe, Link2, Mail, Share2 } from "lucide-react";
import { FormEvent, useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const footerLinks = {
  School: [
    { label: "About", href: "#about" },
    { label: "Why Choose Us", href: "#why-us" },
    { label: "Courses", href: "#courses" },
    { label: "Faculty", href: "#faculty" },
    { label: "Gallery", href: "#gallery" },
  ],
  Admissions: [
    { label: "Apply Now", href: "/admissions" },
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
  const [admissionsOpen, setAdmissionsOpen] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const { data } = await supabase.from("system_settings").select("admissions_open").eq("id", 1).single();
        if (data) setAdmissionsOpen(data.admissions_open);
      } catch (err) {
        console.error(err);
      }
    }
    fetchSettings();
  }, []);

  function handleNewsletter(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubscribed(true);
    setTimeout(() => setSubscribed(false), 3500);
  }

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-navy-950 text-slate-200">
      <div
        className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800"
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
              <span className="icon-brand flex h-12 w-12 items-center justify-center rounded-2xl shadow-elevated-lg">
                <GraduationCap className="h-6 w-6" />
              </span>
              <span className="font-heading text-xl font-bold text-white">
                Nova <span className="text-gold-400">Academy</span>
              </span>
            </motion.a>
            <p className="text-on-dark-muted mt-5 max-w-sm text-sm leading-[1.7]">
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
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-blue-100/80 shadow-elevated backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-400/40 hover:bg-gold-500/15 hover:text-gold-300 hover:shadow-elevated-lg"
                >
                  <s.icon className="h-4 w-4" />
                </motion.a>
              ))}
            </div>


          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-white">
                {title}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {links
                  .filter((link) => admissionsOpen || link.label !== "Apply Now")
                  .map((link) => (
                    <li key={link.label}>
                      <motion.a
                        href={link.href}
                        whileHover={{ x: 3 }}
                        className="inline-block text-sm text-slate-300 transition-colors hover:text-gold-300"
                      >
                        {link.label}
                      </motion.a>
                    </li>
                  ))}
              </ul>
            </div>
          ))}

          <div className="sm:col-span-2 lg:col-span-2">
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-white">
              Stay Updated
            </h4>
            <p className="text-on-dark-muted mt-2 text-sm">
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
                  "mt-0 border-white/15 bg-white/5 text-white placeholder:text-blue-200/40 focus:border-gold-400/50 focus:bg-white/10"
                )}
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(btn.primary, "shrink-0 px-5 py-3 text-sm")}
              >
                {subscribed ? "Done!" : "Subscribe"}
              </motion.button>
            </form>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p
            suppressHydrationWarning
            className="text-on-dark-muted text-sm"
          >
            © {new Date().getFullYear()} Nova Academy. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            {["Privacy", "Terms", "Accessibility"].map((item) => (
              <motion.a
                key={item}
                href="#"
                whileHover={{ y: -1 }}
                className="text-slate-300 transition hover:text-gold-300"
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
