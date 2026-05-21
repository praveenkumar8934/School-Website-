"use client";

import { motion, type Variants } from "framer-motion";
import { ArrowRight, Play, Sparkles } from "lucide-react";

const stats = [
  { value: "2,400+", label: "Active Students" },
  { value: "98%", label: "University Placement" },
  { value: "120+", label: "Expert Faculty" },
];

const container: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

const statCard: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: 0.35 + i * 0.1, duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  }),
};

export function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-[min(100vh,920px)] flex-col justify-center overflow-hidden pt-24 pb-16 sm:min-h-screen sm:pt-28 sm:pb-24"
    >
      <div
        className="absolute inset-0 scale-105 bg-cover bg-center bg-no-repeat transition-transform duration-[2s] hover:scale-100"
        style={{ backgroundImage: "url('/images.jpeg')" }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-slate-900/55" aria-hidden />
      <div
        className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-900/50 to-slate-900/85"
        aria-hidden
      />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="mx-auto w-full max-w-3xl text-center"
        >
          <motion.span
            variants={item}
            className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white shadow-sm backdrop-blur-md transition hover:border-white/40 hover:bg-white/20"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-200" />
            Admissions Open 2026–27
          </motion.span>

          <motion.h1
            variants={item}
            className="mt-6 font-[family-name:var(--font-display)] text-[clamp(2.25rem,5.5vw,3.75rem)] font-bold leading-[1.08] tracking-tight text-white"
          >
            Where ambitious minds{" "}
            <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-blue-300 bg-clip-text text-transparent">
              build tomorrow
            </span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-200 sm:mt-6 sm:text-lg"
          >
            Nova Academy blends rigorous academics, design thinking, and global
            leadership programs — preparing students for top universities and
            meaningful careers.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:mt-10 sm:flex-row sm:items-center sm:gap-4"
          >
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-3.5 text-sm font-semibold text-white shadow-xl shadow-indigo-500/40 transition-shadow hover:shadow-indigo-500/55"
            >
              Start Application
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </motion.a>
            <motion.button
              type="button"
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="group inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white shadow-sm backdrop-blur-md transition-colors hover:border-white/50 hover:bg-white/20"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white transition-transform duration-300 group-hover:scale-110">
                <Play className="h-3.5 w-3.5 fill-current" />
              </span>
              Watch Campus Tour
            </motion.button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto mt-12 w-full max-w-4xl sm:mt-16 lg:mt-20"
        >
          <div className="absolute -inset-3 rounded-3xl bg-gradient-to-r from-indigo-500/25 via-violet-500/20 to-blue-500/25 blur-2xl sm:-inset-4" />
          <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br from-slate-900/95 via-indigo-950/95 to-violet-950/95 p-6 shadow-2xl backdrop-blur-sm sm:rounded-3xl sm:p-10 lg:p-12">
            <div className="grid gap-4 sm:grid-cols-3 sm:gap-6">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  custom={i}
                  variants={statCard}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center backdrop-blur-sm transition-colors hover:border-indigo-400/30 hover:bg-white/10"
                >
                  <p className="font-[family-name:var(--font-display)] text-2xl font-bold text-white sm:text-3xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm text-indigo-200">{stat.label}</p>
                </motion.div>
              ))}
            </div>
            <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:mt-8 sm:flex-row sm:pt-8">
              <p className="text-center text-sm text-indigo-200 sm:text-left">
                Ranked Top 5% nationally for STEM & Liberal Arts
              </p>
              <div className="flex -space-x-2">
                {["AK", "JM", "SR", "PL"].map((initials, i) => (
                  <motion.span
                    key={initials}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.06 }}
                    whileHover={{ y: -3, zIndex: 10 }}
                    className="flex h-9 w-9 cursor-default items-center justify-center rounded-full border-2 border-indigo-950 bg-indigo-500 text-xs font-bold text-white transition-shadow hover:shadow-lg"
                  >
                    {initials}
                  </motion.span>
                ))}
                <motion.span
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.84 }}
                  className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-indigo-950 bg-violet-600 text-xs font-bold text-white"
                >
                  +2k
                </motion.span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
