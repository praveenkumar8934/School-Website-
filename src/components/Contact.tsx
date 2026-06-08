"use client";

import { Reveal } from "@/components/motion/Reveal";
import { IconBox } from "@/components/ui/IconBox";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionShell } from "@/components/ui/SectionShell";
import { btn, input } from "@/lib/styles";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, MapPin, Phone, Send, CheckCircle } from "lucide-react";
import { FormEvent, useState, useEffect } from "react";
import { ShieldAlert } from "lucide-react";

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
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focused, setFocused] = useState<string | null>(null);
  const [captcha, setCaptcha] = useState<{question: string; token: string} | null>(null);
  const [securityAnswer, setSecurityAnswer] = useState("");

  const generateCaptcha = async () => {
    try {
      const res = await fetch("/api/auth/captcha");
      const data = await res.json();
      setCaptcha(data);
      setSecurityAnswer("");
    } catch (err) {
      console.error("Failed to load captcha");
    }
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    if (!securityAnswer) {
      setError("Please solve the captcha.");
      return;
    }
    
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        ...Object.fromEntries(formData.entries()),
        securityAnswer,
        captchaToken: captcha?.token
      };

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to send message");
      }
      setSubmitted(true);
      form.reset();
      setSecurityAnswer("");
      generateCaptcha();
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err: any) {
      console.error("Contact error:", err);
      setError(err.message || "Failed to send message. Please try again.");
      generateCaptcha();
    } finally {
      setSubmitting(false);
    }
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
            className="glass-card glow-ring card-interactive rounded-3xl p-6 sm:p-8 lg:p-10 relative overflow-hidden"
          >
            {/* Success Overlay */}
            <AnimatePresence>
              {submitted && !error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-10 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center"
                >
                  <motion.div
                    initial={{ scale: 0.3, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", damping: 15 }}
                    className="h-20 w-20 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 border border-emerald-100 mb-6"
                  >
                    <CheckCircle className="h-10 w-10" />
                  </motion.div>
                  
                  <motion.h3
                    initial={{ y: 12, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="font-heading text-2xl font-bold text-navy-900"
                  >
                    Message Sent!
                  </motion.h3>

                  <motion.p
                    initial={{ y: 12, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mt-3 text-slate-600 font-medium"
                  >
                    Thank you for reaching out. Our admissions team will be in touch shortly.
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
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

            <div className="mt-5 rounded-xl border border-white/10 bg-slate-900/5 p-4">
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wider text-foreground-muted">
                  Security Check *
                </span>
                <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex items-center gap-3 bg-slate-900 border border-white/10 rounded-lg px-4 py-2 shadow-inner">
                    <ShieldAlert className="h-5 w-5 text-blue-400" />
                    <span className="font-mono text-lg font-bold text-white tracking-widest">
                      {captcha ? captcha.question : "Loading..."}
                    </span>
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      required
                      value={securityAnswer}
                      onChange={(e) => setSecurityAnswer(e.target.value)}
                      placeholder="Enter answer"
                      className={cn(fieldClass(focused === "securityAnswer"), "w-full")}
                      onFocus={() => setFocused("securityAnswer")}
                      onBlur={() => setFocused(null)}
                    />
                  </div>
                </div>
              </label>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-100 text-red-700 text-sm rounded-lg border border-red-200">
                {error}
              </div>
            )}

            <motion.button
              type="submit"
              whileHover={{ y: -2, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              disabled={submitting || submitted}
              aria-live="polite"
              className={cn(btn.accent, "mt-8 w-full text-base disabled:opacity-80")}
            >
              {submitting ? (
                "Sending..."
              ) : submitted ? (
                "Message Sent"
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
