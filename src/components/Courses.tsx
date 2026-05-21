"use client";

import { Reveal } from "@/components/motion/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { section } from "@/lib/styles";
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
    color: "from-indigo-500 to-violet-500",
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
    color: "from-amber-500 to-orange-500",
    tag: null,
  },
];

export function Courses() {
  return (
    <section
      id="courses"
      className={cn(
        section.wrap,
        "relative overflow-hidden bg-slate-900"
      )}
    >
      <div className="mesh-gradient absolute inset-0 opacity-40" aria-hidden />
      <div className={cn(section.container, "relative")}>
        <Reveal className="text-center">
          <SectionHeader
            label="Academics"
            title="Courses that shape future leaders"
            description="Structured pathways with flexible electives — every program is designed to challenge, inspire, and prepare."
            align="center"
            variant="dark"
          />
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:mt-14 lg:gap-6">
          {courses.map((course, i) => (
            <Reveal key={course.title} delay={i * 0.07}>
              <motion.article
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="group glow-ring relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] p-6 shadow-xl shadow-black/20 backdrop-blur-md sm:p-7"
              >
                <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-indigo-500/10 blur-2xl transition-opacity group-hover:opacity-100" />
                {course.tag && (
                  <span className="absolute right-4 top-4 rounded-full border border-indigo-400/30 bg-indigo-500/20 px-2.5 py-0.5 text-xs font-semibold text-indigo-200 backdrop-blur-sm">
                    {course.tag}
                  </span>
                )}
                <span
                  className={cn(
                    "relative inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg transition-transform duration-300 group-hover:scale-110",
                    course.color
                  )}
                >
                  <course.icon className="h-6 w-6" />
                </span>
                <p className="relative mt-5 text-xs font-semibold uppercase tracking-wider text-indigo-300">
                  {course.level}
                </p>
                <h3 className="relative mt-1 text-xl font-semibold text-white sm:text-2xl">
                  {course.title}
                </h3>
                <p className="relative mt-2 text-sm leading-relaxed text-slate-400">
                  {course.desc}
                </p>
                <motion.a
                  href="#contact"
                  whileHover={{ x: 2 }}
                  className="relative mt-6 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-indigo-300 transition-colors hover:border-indigo-400/40 hover:bg-white/10 hover:text-white"
                >
                  View syllabus
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </motion.a>
              </motion.article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
