"use client";

import { Reveal } from "@/components/motion/Reveal";
import { motion } from "framer-motion";

const images = [
  { title: "Innovation Lab", span: "col-span-2 row-span-2", hue: "220" },
  { title: "Graduation Day", span: "", hue: "280" },
  { title: "Sports Complex", span: "", hue: "150" },
  { title: "Art Studio", span: "", hue: "330" },
  { title: "Library Hub", span: "col-span-2", hue: "40" },
];

export function Gallery() {
  return (
    <section id="gallery" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
            Campus Life
          </span>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            A campus built for discovery
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            Explore our state-of-the-art facilities where students learn, create,
            compete, and grow every day.
          </p>
        </Reveal>

        <div className="mt-12 grid auto-rows-[140px] grid-cols-2 gap-3 sm:auto-rows-[160px] lg:grid-cols-4">
          {images.map((img, i) => (
            <Reveal
              key={img.title}
              delay={i * 0.06}
              className={img.span}
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="group relative h-full min-h-[140px] overflow-hidden rounded-2xl"
                style={{
                  background: `linear-gradient(160deg, hsl(${img.hue} 50% 45%) 0%, hsl(${img.hue} 60% 30%) 100%)`,
                }}
              >
                <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/20" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <p className="font-semibold text-white">{img.title}</p>
                </div>
                <div className="absolute inset-0 opacity-0 transition group-hover:opacity-100">
                  <div className="shimmer-border absolute inset-x-0 top-0 h-px" />
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
