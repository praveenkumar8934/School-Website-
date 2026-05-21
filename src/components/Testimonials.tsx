"use client";

import { Reveal } from "@/components/motion/Reveal";
import { AnimatePresence, motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
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

  return (
    <section id="testimonials" className="bg-slate-50 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
            Testimonials
          </span>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Trusted by families worldwide
          </h2>
        </Reveal>

        <Reveal delay={0.1} className="relative mx-auto mt-14 max-w-3xl">
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-indigo-500/20 via-violet-500/20 to-blue-500/20 blur-xl" />
          <div className="relative rounded-3xl border border-slate-200/80 bg-white p-8 shadow-xl sm:p-12">
            <Quote className="h-10 w-10 text-indigo-200" />
            <div className="mt-2 flex gap-1">
              {Array.from({ length: current.rating }).map((_, i) => (
                <Star
                  key={i}
                  className="h-4 w-4 fill-amber-400 text-amber-400"
                />
              ))}
            </div>

            <div className="relative mt-6 min-h-[120px]">
              <AnimatePresence mode="wait">
                <motion.blockquote
                  key={index}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35 }}
                >
                  <p className="text-xl leading-relaxed text-slate-700 sm:text-2xl">
                    &ldquo;{current.quote}&rdquo;
                  </p>
                  <footer className="mt-6">
                    <cite className="not-italic">
                      <span className="font-semibold text-slate-900">
                        {current.author}
                      </span>
                      <span className="mt-0.5 block text-sm text-slate-500">
                        {current.role}
                      </span>
                    </cite>
                  </footer>
                </motion.blockquote>
              </AnimatePresence>
            </div>

            <div className="mt-8 flex justify-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Show testimonial ${i + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    i === index
                      ? "w-8 bg-indigo-600"
                      : "w-2 bg-slate-300 hover:bg-indigo-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
