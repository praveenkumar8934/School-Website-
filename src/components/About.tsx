"use client";

import { Reveal } from "@/components/motion/Reveal";
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
    <section id="about" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <Reveal>
            <span className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
              About Nova
            </span>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Education designed for the{" "}
              <span className="text-gradient">modern world</span>
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-slate-600">
              Founded in 1992, Nova Academy has grown into a leading institution
              where curiosity meets discipline. Our 45-acre campus blends
              cutting-edge facilities with a culture of empathy, creativity, and
              excellence.
            </p>
            <p className="mt-4 text-slate-600 leading-relaxed">
              Every student receives a dedicated advisor, access to university
              counselors from Grade 9, and opportunities to lead real-world
              projects that matter.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="grid grid-cols-2 gap-4">
              {features.map((f, i) => (
                <div
                  key={f.title}
                  className={`rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md hover:shadow-indigo-500/5 ${
                    i === 0 ? "col-span-2 sm:col-span-1" : ""
                  }`}
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <f.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-semibold text-slate-900">{f.title}</h3>
                  <p className="mt-1.5 text-sm text-slate-600">{f.desc}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
