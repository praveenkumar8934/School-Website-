"use client";

import { Reveal } from "@/components/motion/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionShell } from "@/components/ui/SectionShell";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowUpRight, Atom, Code2, Palette, TrendingUp } from "lucide-react";

const courses = [
  {
    icon: Atom,
    title: "STEM Excellence",
    level: "Grades 6–12",
    desc: "Advanced physics, chemistry, robotics, and research mentorship.",
    color: "from-blue-500 to-cyan-500",
    tag: "Popular",
  },
  {
    icon: Code2,
    title: "Computer Science",
    level: "Grades 4–12",
    desc: "Full-stack development, cybersecurity, and AI fundamentals.",
    color: "from-navy-700 to-blue-600",
    tag: "New",
  },
  {
    icon: Palette,
    title: "Arts & Design",
    level: "All Grades",
    desc: "Visual arts, music production, theater, and digital media.",
    color: "from-fuchsia-500 to-pink-500",
    tag: null,
  },
  {
    icon: TrendingUp,
    title: "Business & Leadership",
    level: "Grades 9–12",
    desc: "Entrepreneurship, economics, and student-led ventures.",
    color: "from-gold-600 to-gold-500",
    tag: null,
  },
];

export function Courses() {
  return (
    <SectionShell
      id="courses"
      tone="dark"
      prominence
      transitionFrom="muted"
      aria-labelledby="courses-heading"
    >
      <Reveal className="text-center">
        <SectionHeader
          id="courses-heading"
          label="Academics"
          title="Courses that shape future leaders"
          description="Structured pathways with flexible electives — every program is designed to challenge, inspire, and prepare."
          align="center"
          variant="dark"
        />
      </Reveal>

      <div className="mt-14 grid gap-5 sm:grid-cols-2 sm:gap-6 lg:mt-16 lg:gap-7">
        {courses.map((course, i) => (
          <Reveal key={course.title} delay={i * 0.07}>
            <motion.article
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className="card-interactive group glow-ring relative h-full overflow-hidden rounded-2xl border border-white/15 bg-navy-900/50 p-6 shadow-elevated-lg backdrop-blur-md sm:p-8"
            >
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-blue-600/10 blur-2xl transition-opacity group-hover:opacity-100" />
              {course.tag && (
                <span className="absolute right-4 top-4 rounded-full border border-gold-400/50 bg-gold-600/30 px-2.5 py-0.5 text-xs font-semibold text-gold-100 backdrop-blur-sm">
                  {course.tag}
                </span>
              )}
              <span
                className={cn(
                  "relative inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg transition-transform duration-300 group-hover:scale-110",
                  course.color
                )}
                aria-hidden
              >
                <course.icon className="h-6 w-6" strokeWidth={2} />
              </span>
              <p className="relative mt-6 text-xs font-semibold uppercase tracking-wider text-gold-300">
                {course.level}
              </p>
              <h3 className="font-heading relative mt-1.5 text-xl font-bold text-white sm:text-2xl">
                {course.title}
              </h3>
              <p className="relative mt-3 text-sm leading-relaxed text-slate-300">
                {course.desc}
              </p>
              <motion.a
                href="#contact"
                whileHover={{ x: 2 }}
                className="relative mt-7 inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-gold-200 transition-colors hover:border-gold-400/45 hover:bg-white/15 hover:text-gold-100"
              >
                View syllabus
                <ArrowUpRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden
                />
              </motion.a>
            </motion.article>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}
