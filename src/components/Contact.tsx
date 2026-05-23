"use client";

import { Reveal } from "@/components/motion/Reveal";
import { IconBox } from "@/components/ui/IconBox";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionShell } from "@/components/ui/SectionShell";
import { btn, input } from "@/lib/styles";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { FormEvent, useState } from "react";

const contactItems = [
  { icon: MapPin, text: "1200 Nova Drive, Austin, TX 78701" },
  { icon: Phone, text: "(512) 555-0142", href: "tel:+15125550142" },
  {
    icon: Mail,
    text: "admissions@novaacademy.edu",
    href: "mailto:admissions@novaacademy.edu",
  },
];

const fieldClass = (focused: boolean) =>
  cn(
    input,
    "transition-all duration-200",
    focused && "border-blue-500 shadow-[0_0_0_3px_rgba(45,90,158,0.15)]"
  );

export function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  }

  return (
    <SectionShell
      id="contact"
      tone="accent"
      prominence
      transitionFrom="light"
      aria-labelledby="contact-heading"
    >
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-24">
        <Reveal>
          <SectionHeader
            id="contact-heading"
            label="Get in Touch"
            title="Start your journey with Nova"
            description="Schedule a campus tour, request a brochure, or speak with our admissions team. We respond within one business day."
          />

          <ul className="mt-10 space-y-4" aria-label="Contact information">
            {contactItems.map((item) => (
              <motion.li
                key={item.text}
                whileHover={{ x: 4 }}
                className="flex items-center gap-4 rounded-xl border border-transparent p-2 transition-colors hover:border-blue-100 hover:bg-card"
              >
                <IconBox icon={item.icon} size="md" />
                {item.href ? (
                  <a
                    href={item.href}
                    className="link-underline text-sm text-foreground-muted transition hover:text-blue-600 sm:text-base"
                  >
                    {item.text}
                  </a>
                ) : (
                  <span className="text-sm text-foreground-muted sm:text-base">
                    {item.text}
                  </span>
                )}
              </motion.li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.1}>
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            aria-label="Admissions inquiry form"
            className="glass-card glow-ring card-interactive rounded-3xl p-6 sm:p-8 lg:p-10"
          >
            <h3 className="font-heading text-lg font-bold text-navy-900 sm:text-xl">
              Request Information
            </h3>
            <p className="mt-2 text-sm text-foreground-muted">
              Fill out the form and we&apos;ll be in touch shortly.
            </p>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {[
                { name: "firstName", label: "First Name", placeholder: "Jane" },
                { name: "lastName", label: "Last Name", placeholder: "Smith" },
              ].map((field) => (
                <label key={field.name} className="block">
                  <span className="text-xs font-semibold uppercase tracking-wider text-foreground-muted">
                    {field.label}
                  </span>
                  <input
                    required
                    type="text"
                    name={field.name}
                    autoComplete="given-name"
                    placeholder={field.placeholder}
                    onFocus={() => setFocused(field.name)}
                    onBlur={() => setFocused(null)}
                    className={fieldClass(focused === field.name)}
                  />
                </label>
              ))}
            </div>

            <label className="mt-5 block">
              <span className="text-xs font-semibold uppercase tracking-wider text-foreground-muted">
                Email
              </span>
              <input
                required
                type="email"
                name="email"
                autoComplete="email"
                placeholder="jane@email.com"
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused(null)}
                className={fieldClass(focused === "email")}
              />
            </label>

            <label className="mt-5 block">
              <span className="text-xs font-semibold uppercase tracking-wider text-foreground-muted">
                Student Grade
              </span>
              <select
                required
                name="grade"
                onFocus={() => setFocused("grade")}
                onBlur={() => setFocused(null)}
                className={fieldClass(focused === "grade")}
                defaultValue=""
              >
                <option value="" disabled>
                  Select grade
                </option>
                <option>Kindergarten</option>
                <option>Grades 1–5</option>
                <option>Grades 6–8</option>
                <option>Grades 9–12</option>
              </select>
            </label>

            <label className="mt-5 block">
              <span className="text-xs font-semibold uppercase tracking-wider text-foreground-muted">
                Message
              </span>
              <textarea
                name="message"
                rows={4}
                placeholder="Tell us about your student..."
                onFocus={() => setFocused("message")}
                onBlur={() => setFocused(null)}
                className={cn(fieldClass(focused === "message"), "resize-none")}
              />
            </label>

            <motion.button
              type="submit"
              whileHover={{ y: -2, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              disabled={submitted}
              aria-live="polite"
              className={cn(btn.accent, "mt-8 w-full text-base disabled:opacity-80")}
            >
              {submitted ? (
                "Message sent — thank you!"
              ) : (
                <>
                  Send Message
                  <Send className="h-4 w-4" aria-hidden />
                </>
              )}
            </motion.button>
          </motion.form>
        </Reveal>
      </div>
    </SectionShell>
  );
}
