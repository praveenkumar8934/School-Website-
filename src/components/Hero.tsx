"use client";

import { AmbientBackground } from "@/components/ui/AmbientBackground";
import { btn } from "@/lib/styles";
import { cn } from "@/lib/utils";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const container: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.08 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const floatCard = (delay: number): Variants => ({
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { delay, duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
});

export function Hero() {
  const [admissionsOpen, setAdmissionsOpen] = useState(false);
  const [academicYear, setAcademicYear] = useState("2026–27");

  useEffect(() => {
    async function fetchSettings() {
      try {
        const { data } = await supabase.from("system_settings").select("admissions_open, current_academic_year").eq("id", 1).single();
        if (data) {
          setAdmissionsOpen(data.admissions_open);
          if (data.current_academic_year) setAcademicYear(data.current_academic_year);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchSettings();
  }, []);

  return (
    <section
      id="home"
      aria-label="Welcome to Nova Academy"
      className="relative flex min-h-[min(100dvh,960px)] flex-col justify-center overflow-hidden pt-24 pb-20 sm:min-h-screen sm:pt-28 sm:pb-28"
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images.jpeg')" }}
        role="img"
        aria-label="Nova Academy campus building"
      />
      <div className="absolute inset-0 bg-navy-950/80" aria-hidden />
      <div
        className="absolute inset-0 bg-gradient-to-b from-navy-950/90 via-navy-900/75 to-navy-950/95"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-navy-950/50 via-transparent to-blue-700/25"
        aria-hidden
      />
      <AmbientBackground variant="dark" />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={floatCard(0.5)}
        className="animate-float glass-dark absolute left-[4%] top-[28%] hidden max-w-[200px] rounded-2xl border border-white/10 p-4 shadow-elevated-lg lg:block xl:left-[8%]"
      >
        <p className="font-heading text-2xl font-bold text-white">98%</p>
        <p className="mt-0.5 text-xs font-medium text-gold-300">
          University placement rate
        </p>
      </motion.div>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={floatCard(0.65)}
        className="animate-float-delayed glass-dark absolute right-[4%] top-[32%] hidden max-w-[200px] rounded-2xl border border-white/10 p-4 shadow-elevated-lg lg:block xl:right-[8%]"
      >
        <p className="font-heading text-2xl font-bold text-white">IB · AP</p>
        <p className="text-on-dark-muted mt-0.5 text-xs font-medium">
          World-class curriculum
        </p>
      </motion.div>

      <div className="relative mx-auto flex w-full max-w-6xl flex-col px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="mx-auto w-full max-w-4xl text-center"
        >
          {admissionsOpen && (
            <motion.span
              variants={item}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white shadow-elevated backdrop-blur-md mb-6"
            >
              <Sparkles className="h-3.5 w-3.5 text-gold-400" aria-hidden />
              Admissions Open {academicYear}
            </motion.span>
          )}

          <motion.h1
            variants={item}
            className="font-heading mt-7 text-[clamp(2.25rem,6.5vw,4.5rem)] font-extrabold leading-[1.05] tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)] sm:mt-8"
          >
            <span className="text-white">Where ambitious minds </span>
            <span className="text-gradient-hero">build tomorrow</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="text-on-dark-muted mx-auto mt-6 max-w-2xl text-base leading-[1.8] sm:mt-8 sm:text-lg sm:leading-[1.75]"
          >
            Nova Academy blends rigorous academics, design thinking, and global
            leadership programs — preparing students for top universities and
            meaningful careers.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:mt-12 sm:flex-row sm:items-center sm:justify-center sm:gap-4"
          >
            {admissionsOpen && (
              <motion.a
                href="/admissions"
                whileHover={{ scale: 1.04, y: -3 }}
                whileTap={{ scale: 0.97 }}
                className={cn(btn.accent, "group w-full px-9 py-4 text-base sm:w-auto")}
              >
                Start Application
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden
                />
              </motion.a>
            )}
            <motion.button
              type="button"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              aria-label="Watch campus tour video"
              className={cn(
                btn.ghost,
                "group w-full gap-2.5 px-7 py-4 sm:w-auto"
              )}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white transition-transform duration-300 group-hover:scale-110 group-hover:bg-white/25">
                <Play className="h-4 w-4 fill-current" aria-hidden />
              </span>
              Watch Campus Tour
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
