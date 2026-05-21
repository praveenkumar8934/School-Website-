"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play, Sparkles } from "lucide-react";

const stats = [
  { value: "2,400+", label: "Active Students" },
  { value: "98%", label: "University Placement" },
  { value: "120+", label: "Expert Faculty" },
];

export function Hero() {
  return (
    <section className="relative min-h-[92vh] overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-28">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images.jpeg')" }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-slate-900/55" aria-hidden />
      <div
        className="absolute inset-0 bg-gradient-to-b from-slate-900/30 via-slate-900/45 to-slate-900/80"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white shadow-sm backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-indigo-200" />
            Admissions Open 2026–27
          </span>

          <h1 className="mt-6 font-[family-name:var(--font-display)] text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Where ambitious minds{" "}
            <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-blue-300 bg-clip-text text-transparent">
              build tomorrow
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-200">
            Nova Academy blends rigorous academics, design thinking, and global
            leadership programs — preparing students for top universities and
            meaningful careers.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#contact"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-3.5 text-sm font-semibold text-white shadow-xl shadow-indigo-500/40 transition hover:brightness-110"
            >
              Start Application
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </a>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white shadow-sm backdrop-blur-md transition hover:bg-white/20"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white">
                <Play className="h-3.5 w-3.5 fill-current" />
              </span>
              Watch Campus Tour
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative mx-auto mt-16 max-w-4xl"
        >
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-indigo-500/20 via-violet-500/20 to-blue-500/20 blur-2xl" />
          <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-950 p-8 shadow-2xl sm:p-12">
            <div className="grid gap-6 sm:grid-cols-3">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center backdrop-blur-sm"
                >
                  <p className="font-[family-name:var(--font-display)] text-3xl font-bold text-white">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm text-indigo-200">{stat.label}</p>
                </motion.div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-8">
              <p className="text-sm text-indigo-200">
                Ranked Top 5% nationally for STEM & Liberal Arts
              </p>
              <div className="flex -space-x-2">
                {["AK", "JM", "SR", "PL"].map((initials) => (
                  <span
                    key={initials}
                    className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-indigo-950 bg-indigo-500 text-xs font-bold text-white"
                  >
                    {initials}
                  </span>
                ))}
                <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-indigo-950 bg-violet-600 text-xs font-bold text-white">
                  +2k
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
