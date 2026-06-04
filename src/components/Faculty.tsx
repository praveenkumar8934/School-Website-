"use client";

import {
  Reveal,
  staggerContainer,
  staggerItem,
} from "@/components/motion/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionShell } from "@/components/ui/SectionShell";
import { btn, card } from "@/lib/styles";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";

const MotionLink = motion(Link);

const faculty = [
  {
    name: "Dr. Elena Vasquez",
    role: "Head of Sciences",
    exp: "PhD MIT · 18 yrs",
    hue: "210",
  },
  {
    name: "James Okonkwo",
    role: "Director of Arts",
    exp: "MFA Yale · 14 yrs",
    hue: "280",
  },
  {
    name: "Priya Sharma",
    role: "Computer Science Lead",
    exp: "MS Stanford · 12 yrs",
    hue: "160",
  },
  {
    name: "Michael Chen",
    role: "Dean of Students",
    exp: "EdD Harvard · 20 yrs",
    hue: "35",
  },
];

export function Faculty() {
  return (
    <SectionShell
      id="faculty"
      tone="light"
      transitionFrom="dark"
      aria-labelledby="faculty-heading"
    >
      <Reveal className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-end">
        <SectionHeader
          id="faculty-heading"
          label="Our Faculty"
          title="Learn from world-class educators"
          description="85% of our faculty hold advanced degrees from top universities and bring real industry experience into every classroom."
        />
        <MotionLink
          href="/faculty"
          whileHover={{ y: -2, scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className={cn(btn.outline, "link-underline shrink-0")}
        >
          Meet all faculty →
        </MotionLink>
      </Reveal>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="mt-14 grid gap-6 sm:grid-cols-2 sm:gap-7 lg:grid-cols-4"
      >
        {faculty.map((member) => (
          <motion.article
            key={member.name}
            variants={staggerItem}
            whileHover={{ y: -8 }}
            className={cn(
              card.base,
              card.hover,
              "glow-ring group overflow-hidden p-0"
            )}
          >
            <div className="relative h-48 overflow-hidden sm:h-52">
              <div
                className="img-zoom absolute inset-0 scale-100 bg-cover bg-center"
                style={{
                  backgroundImage: `linear-gradient(160deg, hsl(${member.hue} 45% 42%) 0%, hsl(${member.hue} 55% 28%) 100%)`,
                }}
                role="img"
                aria-label={`Portrait placeholder for ${member.name}`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-80 transition-opacity group-hover:opacity-90" />
              <span
                className="absolute bottom-4 left-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/20 text-xl font-bold text-white backdrop-blur-md"
                aria-hidden
              >
                {member.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
            </div>
            <div className="border-t border-slate-100/80 bg-white/90 p-5 backdrop-blur-sm sm:p-6">
              <h3 className="font-heading font-bold text-navy-900">
                {member.name}
              </h3>
              <p className="mt-1 text-sm font-medium text-blue-600">
                {member.role}
              </p>
              <p className="mt-2 text-xs text-foreground-muted">{member.exp}</p>
            </div>
          </motion.article>
        ))}
      </motion.div>
    </SectionShell>
  );
}
