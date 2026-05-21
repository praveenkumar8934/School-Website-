"use client";

import { motion, type Variants } from "framer-motion";
import { type ReactNode } from "react";

const variants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
};

export function Reveal({
  children,
  className,
  delay = 0,
  duration = 0.55,
}: RevealProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}
