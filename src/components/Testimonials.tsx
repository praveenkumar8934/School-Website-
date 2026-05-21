"use client";

import { Reveal } from "@/components/motion/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { section } from "@/lib/styles";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { useEffect, useState } from "react";

const testimonials = [
  {
    quote:
      "Nova gave our daughter the confidence to lead her robotics team and earn a full scholarship to MIT. The faculty truly invest in each student.",
    author: "Sarah Mitchell",
    role: "Parent · Class of 2025",
    rating: 5,
  },
  {
    quote:
      "The blend of academics and arts is unmatched. My son discovered filmmaking while excelling in AP Calculus — he's thriving in both.",
    author: "David Okonkwo",
    role: "Parent · Grade 10",
    rating: 5,
  },
  {
    quote:
      "As an alumna, I knew I wanted the same experience for my kids. Nova shaped who I am — and now it's shaping the next generation.",
    author: "Elena Ruiz '08",
    role: "Parent · Grade 4",
    rating: 5,
  },
];

export function Testimonials() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setIndex((i) => (i + 1) % testimonials.length),
      5500
    );
    return () => clearInterval(timer);
  }, []);

  const current = testimonials[index];

  const go = (dir: -1 | 1) =>
    setIndex((i) => (i + dir + testimonials.length) % testimonials.length);

  return (
    <section
      id="testimonials"
      className={cn(section.wrap, "relative bg-slate-50 section-mesh")}
    >
      <div className={section.container}>
        <Reveal className="text-center">
          <SectionHeader
            label="Testimonials"
            title="Trusted by families worldwide"
            align="center"
          />
        </Reveal>

        <Reveal delay={0.1} className="relative mx-auto mt-12 max-w-3xl lg:mt-14">
          <div className="absolute -inset-2 rounded-[1.75rem] bg-gradient-to-r from-indigo-500/25 via-violet-500/20 to-blue-500/25 blur-2xl" />
          <motion.div
            whileHover={{ y: -2 }}
            className="glass-card glow-ring relative overflow-hidden rounded-3xl p-6 sm:p-10 lg:p-12"
          >
            <div className="flex items-start justify-between gap-4">
              <Quote className="h-10 w-10 shrink-0 text-indigo-200 sm:h-12 sm:w-12" />
              <div className="flex gap-1">
                {Array.from({ length: current.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
            </div>

            <div className="relative mt-6 min-h-[140px] sm:min-h-[160px]">
              <AnimatePresence mode="wait">
                <motion.blockquote
                  key={index}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="text-lg leading-relaxed text-slate-700 sm:text-xl lg:text-2xl lg:leading-relaxed">
                    &ldquo;{current.quote}&rdquo;
                  </p>
                  <footer className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-6">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white">
                      {current.author.charAt(0)}
                    </span>
                    <cite className="not-italic">
                      <span className="block font-semibold text-slate-900">
                        {current.author}
                      </span>
                      <span className="text-sm text-slate-500">{current.role}</span>
                    </cite>
                  </footer>
                </motion.blockquote>
              </AnimatePresence>
            </div>

            <div className="mt-8 flex items-center justify-between gap-4">
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <motion.button
                    key={i}
                    type="button"
                    onClick={() => setIndex(i)}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label={`Show testimonial ${i + 1}`}
                    className={cn(
                      "h-2 rounded-full transition-all duration-300",
                      i === index
                        ? "w-8 bg-gradient-to-r from-indigo-600 to-violet-600"
                        : "w-2 bg-slate-300 hover:bg-indigo-300"
                    )}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <motion.button
                  type="button"
                  onClick={() => go(-1)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Previous testimonial"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-indigo-200 hover:text-indigo-600"
                >
                  <ChevronLeft className="h-4 w-4" />
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => go(1)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Next testimonial"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-indigo-200 hover:text-indigo-600"
                >
                  <ChevronRight className="h-4 w-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}
