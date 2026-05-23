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
import {
  Briefcase,
  Dumbbell,
  Laptop,
  Monitor,
  School,
  Users,
} from "lucide-react";

const features = [
  {
    icon: Monitor,
    title: "Smart Classrooms",
    desc: "Interactive boards, digital tools, and tech-enabled learning in every room.",
  },
  {
    icon: Users,
    title: "Expert Teachers",
    desc: "Dedicated educators with advanced degrees and real-world experience.",
  },
  {
    icon: Laptop,
    title: "Digital Learning",
    desc: "Online platforms, coding labs, and blended learning for modern skills.",
  },
  {
    icon: Dumbbell,
    title: "Sports Facilities",
    desc: "Olympic-standard courts, fields, and fitness programs for all students.",
  },
  {
    icon: School,
    title: "Modern Campus",
    desc: "45-acre grounds with science labs, arts studios, and collaborative spaces.",
  },
  {
    icon: Briefcase,
    title: "Career Guidance",
    desc: "Counselors, internships, and university prep from Grade 9 onward.",
  },
];

export function WhyChooseUs() {
  return (
    <SectionShell
      id="why-us"
      tone="muted"
      transitionFrom="light"
      aria-labelledby="why-us-heading"
    >
      <Reveal className="mx-auto max-w-3xl text-center">
        <SectionHeader
          id="why-us-heading"
          label="Why Choose Us"
          title={
            <>
              Everything your child needs to{" "}
              <span className="text-gradient">thrive</span>
            </>
          }
          description="A holistic education experience designed for academic excellence, personal growth, and future success."
          align="center"
        />
      </Reveal>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="mt-14 grid gap-5 sm:grid-cols-2 sm:gap-6 lg:mt-16 lg:grid-cols-3 lg:gap-7"
      >
        {features.map((f) => (
          <motion.article
            key={f.title}
            variants={staggerItem}
            whileHover={{ y: -6 }}
            className={cn(card.base, card.hover, card.glass, "glow-ring group")}
          >
            <IconBox icon={f.icon} size="lg" className="mb-5" />
            <h3 className="font-heading text-lg font-bold text-navy-900 sm:text-xl">
              {f.title}
            </h3>
            <p className="mt-3 text-sm leading-[1.7] text-foreground-muted sm:text-base">
              {f.desc}
            </p>
          </motion.article>
        ))}
      </motion.div>
    </SectionShell>
  );
}
