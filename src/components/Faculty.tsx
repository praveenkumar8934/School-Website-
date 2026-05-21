"use client";

import { Reveal } from "@/components/motion/Reveal";
import { motion } from "framer-motion";

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
    <section id="faculty" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <span className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
              Our Faculty
            </span>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Learn from world-class educators
            </h2>
            <p className="mt-3 max-w-xl text-slate-600">
              85% of our faculty hold advanced degrees from top universities and
              bring real industry experience into every classroom.
            </p>
          </div>
          <a
            href="#contact"
            className="shrink-0 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-300 hover:text-indigo-600"
          >
            Meet all faculty →
          </a>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {faculty.map((member, i) => (
            <Reveal key={member.name} delay={i * 0.07}>
              <motion.div
                whileHover={{ y: -6 }}
                className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition hover:shadow-xl hover:shadow-indigo-500/10"
              >
                <div
                  className="flex h-44 items-end p-5"
                  style={{
                    background: `linear-gradient(160deg, hsl(${member.hue} 45% 42%) 0%, hsl(${member.hue} 55% 28%) 100%)`,
                  }}
                >
                  <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-2xl font-bold text-white backdrop-blur-sm">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-slate-900">{member.name}</h3>
                  <p className="text-sm text-indigo-600">{member.role}</p>
                  <p className="mt-2 text-xs text-slate-500">{member.exp}</p>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
