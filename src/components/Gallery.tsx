"use client";

import {
  Reveal,
  staggerContainer,
  staggerItem,
} from "@/components/motion/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { section } from "@/lib/styles";
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
    <section id="gallery" className={section.wrap}>
      <div className={section.container}>
        <Reveal className="text-center">
          <SectionHeader
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
          className="mt-12 grid auto-rows-[minmax(140px,1fr)] grid-cols-2 gap-3 sm:auto-rows-[160px] sm:gap-4 lg:grid-cols-4"
        >
          {images.map((img) => (
            <motion.div
              key={img.title}
              variants={staggerItem}
              className={cn("min-h-[140px]", img.span)}
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="group relative h-full w-full overflow-hidden rounded-2xl shadow-lg shadow-slate-900/10 ring-1 ring-slate-200/50 transition-shadow duration-300 hover:shadow-xl hover:shadow-indigo-500/15"
              >
                <div
                  className="absolute inset-0 scale-100 transition-transform duration-700 group-hover:scale-110"
                  style={{
                    background: `linear-gradient(160deg, hsl(${img.hue} 50% 45%) 0%, hsl(${img.hue} 60% 30%) 100%)`,
                  }}
                />
                <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/25" />
                <div className="absolute inset-x-0 bottom-0 translate-y-1 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4 transition-transform duration-300 group-hover:translate-y-0 sm:p-5">
                  <p className="font-semibold text-white">{img.title}</p>
                  <p className="mt-1 text-xs text-white/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    Explore campus →
                  </p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
