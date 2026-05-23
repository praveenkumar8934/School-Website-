"use client";

import {
  Reveal,
  staggerContainer,
  staggerItem,
} from "@/components/motion/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionShell } from "@/components/ui/SectionShell";
import { cn } from "@/lib/utils";
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
    <SectionShell
      id="gallery"
      tone="light"
      transitionFrom="muted"
      aria-labelledby="gallery-heading"
    >
      <Reveal className="text-center">
        <SectionHeader
          id="gallery-heading"
          label="Campus Life"
          title="A campus built for discovery"
          description="Explore our state-of-the-art facilities where students learn, create, compete, and grow every day."
          align="center"
        />
      </Reveal>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="mt-14 grid auto-rows-[minmax(150px,1fr)] grid-cols-2 gap-4 sm:auto-rows-[170px] sm:gap-5 lg:grid-cols-4 lg:mt-16"
        role="list"
        aria-label="Campus photo gallery"
      >
        {images.map((img) => (
          <motion.div
            key={img.title}
            variants={staggerItem}
            role="listitem"
            className={cn("min-h-[150px]", img.span)}
          >
            <motion.figure
              whileHover={{ scale: 1.02 }}
              className="card-interactive group relative h-full w-full overflow-hidden rounded-2xl shadow-elevated ring-1 ring-border transition-shadow duration-300 hover:shadow-elevated-lg"
            >
              <div
                className="img-zoom absolute inset-0 scale-100"
                style={{
                  background: `linear-gradient(160deg, hsl(${img.hue} 50% 45%) 0%, hsl(${img.hue} 60% 30%) 100%)`,
                }}
                role="img"
                aria-label={`${img.title} at Nova Academy campus`}
              />
              <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/25" />
              <figcaption className="absolute inset-x-0 bottom-0 translate-y-1 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4 transition-transform duration-300 group-hover:translate-y-0 sm:p-5">
                <p className="font-semibold text-white">{img.title}</p>
                <p className="mt-1 text-xs text-white/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  Explore campus →
                </p>
              </figcaption>
            </motion.figure>
          </motion.div>
        ))}
      </motion.div>
    </SectionShell>
  );
}
