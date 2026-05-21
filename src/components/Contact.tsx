"use client";

import { Reveal } from "@/components/motion/Reveal";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { FormEvent, useState } from "react";

export function Contact() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  }

  return (
    <section id="contact" className="bg-slate-50 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <span className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
              Get in Touch
            </span>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Start your journey with Nova
            </h2>
            <p className="mt-4 text-slate-600 leading-relaxed">
              Schedule a campus tour, request a brochure, or speak with our
              admissions team. We respond within one business day.
            </p>

            <ul className="mt-8 space-y-4">
              {[
                { icon: MapPin, text: "1200 Nova Drive, Austin, TX 78701" },
                { icon: Phone, text: "(512) 555-0142" },
                { icon: Mail, text: "admissions@novaacademy.edu" },
              ].map((item) => (
                <li key={item.text} className="flex items-center gap-3 text-slate-600">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <item.icon className="h-4 w-4" />
                  </span>
                  {item.text}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.12}>
            <motion.form
              onSubmit={handleSubmit}
              className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-8"
            >
              <h3 className="text-lg font-semibold text-slate-900">
                Request Information
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Fill out the form and we&apos;ll be in touch shortly.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    First Name
                  </span>
                  <input
                    required
                    type="text"
                    name="firstName"
                    placeholder="Jane"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Last Name
                  </span>
                  <input
                    required
                    type="text"
                    name="lastName"
                    placeholder="Smith"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </label>
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
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
                />
              </label>

              <label className="mt-4 block">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Student Grade
                </span>
                <select
                  required
                  name="grade"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
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
                  className="mt-1.5 w-full resize-none rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
                />
              </label>

              <button
                type="submit"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:brightness-110"
              >
                {submitted ? (
                  "Message sent — thank you!"
                ) : (
                  <>
                    Send Message
                    <Send className="h-4 w-4" />
                  </>
                )}
              </button>
            </motion.form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
