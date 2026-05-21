"use client";

import { Reveal } from "@/components/motion/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { btn, input, section } from "@/lib/styles";
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
    focused && "border-indigo-400 shadow-[0_0_0_3px_rgba(99,102,241,0.15)]"
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
    <section id="contact" className={cn(section.wrap, "section-mesh bg-slate-50")}>
      <div className={section.container}>
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 xl:gap-20">
          <Reveal>
            <SectionHeader
              label="Get in Touch"
              title="Start your journey with Nova"
              description="Schedule a campus tour, request a brochure, or speak with our admissions team. We respond within one business day."
            />

            <ul className="mt-8 space-y-3 sm:mt-10">
              {contactItems.map((item) => (
                <motion.li
                  key={item.text}
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-4 rounded-xl border border-transparent p-2 transition-colors hover:border-indigo-100 hover:bg-white/60"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/20">
                    <item.icon className="h-4 w-4" />
                  </span>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-sm text-slate-600 transition hover:text-indigo-600 sm:text-base"
                    >
                      {item.text}
                    </a>
                  ) : (
                    <span className="text-sm text-slate-600 sm:text-base">
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
              className="glass-card glow-ring rounded-3xl p-6 sm:p-8 lg:p-10"
            >
              <h3 className="text-lg font-semibold text-slate-900 sm:text-xl">
                Request Information
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Fill out the form and we&apos;ll be in touch shortly.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {[
                  { name: "firstName", label: "First Name", placeholder: "Jane" },
                  { name: "lastName", label: "Last Name", placeholder: "Smith" },
                ].map((field) => (
                  <label key={field.name} className="block">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      {field.label}
                    </span>
                    <input
                      required
                      type="text"
                      name={field.name}
                      placeholder={field.placeholder}
                      onFocus={() => setFocused(field.name)}
                      onBlur={() => setFocused(null)}
                      className={fieldClass(focused === field.name)}
                    />
                  </label>
                ))}
              </div>

              <label className="mt-4 block">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Email
                </span>
                <input
                  required
                  type="email"
                  name="email"
                  placeholder="jane@email.com"
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                  className={fieldClass(focused === "email")}
                />
              </label>

              <label className="mt-4 block">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
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

              <label className="mt-4 block">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
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
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                disabled={submitted}
                className={cn(btn.primary, "mt-6 w-full disabled:opacity-80")}
              >
                {submitted ? (
                  "Message sent — thank you!"
                ) : (
                  <>
                    Send Message
                    <Send className="h-4 w-4" />
                  </>
                )}
              </motion.button>
            </motion.form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
