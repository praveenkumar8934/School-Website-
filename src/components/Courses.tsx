"use client";

import { Reveal } from "@/components/motion/Reveal";
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
    <section id="courses" className="bg-slate-900 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-indigo-400">
            Academics
          </span>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Courses that shape future leaders
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            Structured pathways with flexible electives — every program is
            designed to challenge, inspire, and prepare.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          {courses.map((course, i) => (
            <Reveal key={course.title} delay={i * 0.08}>
              <motion.article
                whileHover={{ y: -4 }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition hover:border-indigo-500/30"
              >
                {course.tag && (
                  <span className="absolute right-4 top-4 rounded-full bg-indigo-500/20 px-2.5 py-0.5 text-xs font-semibold text-indigo-300">
                    {course.tag}
                  </span>
                )}
                <span
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${course.color} text-white shadow-lg`}
                >
                  <course.icon className="h-6 w-6" />
                </span>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-indigo-400">
                  {course.level}
                </p>
                <h3 className="mt-1 text-xl font-semibold text-white">
                  {course.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {course.desc}
                </p>
                <a
                  href="#contact"
                  className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-indigo-400 transition group-hover:text-indigo-300"
                >
                  View syllabus
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </motion.article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
