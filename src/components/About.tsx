"use client";

import {
  Reveal,
  staggerContainer,
  staggerItem,
} from "@/components/motion/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { card, section } from "@/lib/styles";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";
import { BookOpen, Globe2, Lightbulb, Shield } from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Rigorous Academics",
    desc: "IB, AP, and honors pathways with personalized learning plans.",
  },
  {
    icon: Lightbulb,
    title: "Innovation Labs",
    desc: "Robotics, AI, and maker spaces for hands-on discovery.",
  },
  {
    icon: Globe2,
    title: "Global Network",
    desc: "Exchange programs across 18 partner schools worldwide.",
  },
  {
    icon: Shield,
    title: "Student Wellbeing",
    desc: "Counseling, mentorship, and inclusive community programs.",
  },
];

export function About() {
  return (
    <section id="about" className={cn(section.wrap, "section-mesh relative")}>
      <div className={section.container}>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
          <Reveal>
            <SectionHeader
              label="About Nova"
              title={
                <>
                  Education designed for the{" "}
                  <span className="text-gradient">modern world</span>
                </>
              }
            />
            <p className="mt-5 text-base leading-relaxed text-slate-600 sm:text-lg">
              Founded in 1992, Nova Academy has grown into a leading institution
              where curiosity meets discipline. Our 45-acre campus blends
              cutting-edge facilities with a culture of empathy, creativity, and
              excellence.
            </p>
            <p className="mt-4 text-base leading-relaxed text-slate-600">
              Every student receives a dedicated advisor, access to university
              counselors from Grade 9, and opportunities to lead real-world
              projects that matter.
            </p>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="space-y-4">
              <motion.div
                whileHover={{ scale: 1.01 }}
                className="glow-ring relative overflow-hidden rounded-2xl shadow-xl shadow-indigo-500/10"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl">
                  <Image
                    src="/images.jpeg"
                    alt="Nova Academy campus"
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-sm font-semibold text-white">
                      45-acre campus · Austin, TX
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                className="grid grid-cols-2 gap-3 sm:gap-4"
              >
                {features.map((f, i) => (
                  <motion.div
                    key={f.title}
                    variants={staggerItem}
                    whileHover={{ y: -4 }}
                    className={cn(
                      card.base,
                      card.hover,
                      "glow-ring p-5 sm:p-6",
                      i === 0 && "col-span-2 sm:col-span-1"
                    )}
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/25">
                      <f.icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-4 font-semibold text-slate-900">{f.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                      {f.desc}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
