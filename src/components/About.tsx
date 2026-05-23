"use client";

import {
  Reveal,
  staggerContainer,
  staggerItem,
} from "@/components/motion/Reveal";
import { IconBox } from "@/components/ui/IconBox";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionShell } from "@/components/ui/SectionShell";
import { card } from "@/lib/styles";
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
    <SectionShell
      id="about"
      tone="light"
      showTransition
      transitionFrom="dark"
      aria-labelledby="about-heading"
    >
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-24">
        <Reveal>
          <SectionHeader
            id="about-heading"
            label="About Nova"
            title={
              <>
                Education designed for the{" "}
                <span className="text-gradient">modern world</span>
              </>
            }
          />
          <p className="mt-6 text-base leading-[1.75] text-foreground-muted sm:text-lg">
            Founded in 1992, Nova Academy has grown into a leading institution
            where curiosity meets discipline. Our 45-acre campus blends
            cutting-edge facilities with a culture of empathy, creativity, and
            excellence.
          </p>
          <p className="mt-5 text-base leading-relaxed text-foreground-muted">
            Every student receives a dedicated advisor, access to university
            counselors from Grade 9, and opportunities to lead real-world
            projects that matter.
          </p>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="space-y-5">
            <motion.div
              whileHover={{ y: -4 }}
              className="glow-ring card-interactive group relative overflow-hidden rounded-2xl shadow-elevated-lg"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl">
                <Image
                  src="/images.jpeg"
                  alt="Nova Academy campus aerial view with modern buildings"
                  fill
                  priority
                  className="img-zoom object-cover"
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
              className="grid grid-cols-2 gap-4 sm:gap-5"
            >
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  variants={staggerItem}
                  whileHover={{ y: -4 }}
                  className={cn(
                    card.base,
                    card.hover,
                    "glow-ring",
                    i === 0 && "col-span-2 sm:col-span-1"
                  )}
                >
                  <IconBox icon={f.icon} size="md" className="mb-4" />
                  <h3 className="font-heading font-bold text-navy-900">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-foreground-muted">
                    {f.desc}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </Reveal>
      </div>
    </SectionShell>
  );
}
