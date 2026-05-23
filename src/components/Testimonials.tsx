"use client";

import { Reveal } from "@/components/motion/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionShell } from "@/components/ui/SectionShell";
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
    <SectionShell
      id="testimonials"
      tone="muted"
      transitionFrom="light"
      aria-labelledby="testimonials-heading"
    >
      <Reveal className="text-center">
        <SectionHeader
          id="testimonials-heading"
          label="Testimonials"
          title="Trusted by families worldwide"
          align="center"
        />
      </Reveal>

      <Reveal delay={0.1} className="relative mx-auto mt-14 max-w-3xl lg:mt-16">
        <div className="absolute -inset-2 rounded-[1.75rem] bg-gradient-to-r from-blue-600/20 via-gold-500/12 to-blue-500/18 blur-2xl" />
        <motion.div
          whileHover={{ y: -4 }}
          className="glass-card glow-ring card-interactive relative overflow-hidden rounded-3xl p-6 sm:p-10 lg:p-12"
        >
          <div className="flex items-start justify-between gap-4">
            <Quote
              className="h-10 w-10 shrink-0 text-blue-400 sm:h-12 sm:w-12"
              aria-hidden
            />
            <div
              className="flex gap-1"
              role="img"
              aria-label={`${current.rating} out of 5 stars`}
            >
              {Array.from({ length: current.rating }).map((_, i) => (
                <Star
                  key={i}
                  className="h-4 w-4 fill-amber-400 text-amber-400"
                  aria-hidden
                />
              ))}
            </div>
          </div>

          <div
            className="relative mt-8 min-h-[140px] sm:min-h-[160px]"
            aria-live="polite"
            aria-atomic="true"
          >
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
                <footer className="mt-8 flex items-center gap-4 border-t border-slate-100 pt-8">
                  <span
                    className="icon-brand flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold"
                    aria-hidden
                  >
                    {current.author.charAt(0)}
                  </span>
                  <cite className="not-italic">
                    <span className="block font-semibold text-navy-900">
                      {current.author}
                    </span>
                    <span className="text-sm text-foreground-muted">
                      {current.role}
                    </span>
                  </cite>
                </footer>
              </motion.blockquote>
            </AnimatePresence>
          </div>

          <div className="mt-10 flex items-center justify-between gap-4">
            <div
              className="flex gap-2"
              role="tablist"
              aria-label="Testimonial slides"
            >
              {testimonials.map((_, i) => (
                <motion.button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  onClick={() => setIndex(i)}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={`Show testimonial ${i + 1} of ${testimonials.length}`}
                  className={cn(
                    "min-h-[44px] min-w-[44px] rounded-full p-2 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-blue-500",
                    i === index
                      ? "w-8 bg-gradient-to-r from-blue-600 to-gold-500"
                      : "w-2 bg-border hover:bg-blue-300"
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
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-foreground-muted shadow-sm transition hover:border-blue-200 hover:text-blue-600 focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <ChevronLeft className="h-4 w-4" />
              </motion.button>
              <motion.button
                type="button"
                onClick={() => go(1)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Next testimonial"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-foreground-muted shadow-sm transition hover:border-blue-200 hover:text-blue-600 focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <ChevronRight className="h-4 w-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </Reveal>
    </SectionShell>
  );
}
