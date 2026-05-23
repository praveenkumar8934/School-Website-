"use client";

import { Reveal } from "@/components/motion/Reveal";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { IconBox } from "@/components/ui/IconBox";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Award, GraduationCap, Target, Users } from "lucide-react";

const stats = [
  {
    end: 5000,
    suffix: "+",
    label: "Students",
    icon: Users,
  },
  {
    end: 100,
    suffix: "+",
    label: "Teachers",
    icon: GraduationCap,
  },
  {
    end: 98,
    suffix: "%",
    label: "Results",
    icon: Target,
  },
  {
    end: 25,
    suffix: "+",
    label: "Years Excellence",
    icon: Award,
  },
];

export function StatsSection() {
  return (
    <section
      id="stats"
      aria-label="School statistics"
      className="relative z-20 -mt-8 px-4 pb-4 sm:-mt-12 sm:px-6 lg:px-8"
    >
      <div className="relative mx-auto max-w-6xl">
        <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-r from-blue-600/20 via-gold-500/10 to-blue-500/20 blur-2xl" />
        <Reveal>
          <div className="glass-dark glow-ring relative overflow-hidden rounded-2xl border border-white/15 p-6 shadow-elevated-lg sm:rounded-3xl sm:p-8 lg:p-10">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
            <div className="relative grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{
                    delay: i * 0.08,
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="card-interactive group flex flex-col items-center rounded-2xl border border-white/10 bg-white/5 p-5 text-center sm:p-6"
                >
                  <IconBox
                    icon={stat.icon}
                    variant="brand"
                    size="md"
                    className="mb-3 group-hover:shadow-[0_8px_24px_rgba(45,90,158,0.35)]"
                  />
                  <p className="font-heading text-3xl font-bold text-white sm:text-4xl">
                    <AnimatedCounter
                      end={stat.end}
                      suffix={stat.suffix}
                      duration={2.2}
                    />
                  </p>
                  <p className="text-on-dark-muted mt-1.5 text-sm font-medium">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
