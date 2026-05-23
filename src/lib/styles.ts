/** Shared Tailwind class groups — navy / blue / gold system */

export type SectionTone = "light" | "muted" | "dark" | "accent";

export const section = {
  wrap: "py-24 sm:py-32 lg:py-36",
  container: "mx-auto max-w-6xl px-4 sm:px-6 lg:px-8",
};

export const sectionHeader = {
  label:
    "inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-blue-600",
  labelDark:
    "inline-flex items-center rounded-full border border-gold-400/55 bg-gold-500/25 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-gold-300 shadow-sm",
  title:
    "font-heading mt-5 text-[clamp(1.875rem,4.5vw,2.75rem)] font-bold leading-[1.1] tracking-tight text-navy-900",
  titleLight:
    "font-heading mt-5 text-[clamp(1.875rem,4.5vw,2.75rem)] font-bold leading-[1.1] tracking-tight text-white",
  desc: "mt-6 max-w-2xl text-base leading-[1.75] text-foreground-muted sm:text-lg",
  descLight:
    "mt-6 max-w-2xl text-base leading-[1.75] text-slate-300 sm:text-lg",
};

export const card = {
  base: "rounded-2xl border border-border bg-card p-6 shadow-elevated transition-all duration-300 ease-out sm:p-7",
  hover:
    "card-interactive hover:-translate-y-1.5 hover:border-blue-200 hover:shadow-elevated-lg",
  glass:
    "glass-card glow-ring rounded-2xl p-6 transition-all duration-300 ease-out sm:p-7",
  dark: "glass-dark glow-ring rounded-2xl shadow-elevated transition-all duration-300 ease-out",
};

export const input =
  "mt-2 min-h-[48px] w-full rounded-xl border border-border bg-card px-4 py-3.5 text-base leading-normal text-navy-900 outline-none transition-[border-color,box-shadow,background-color] duration-200 placeholder:text-foreground-muted/70 focus-visible:border-blue-500 focus-visible:bg-white focus-visible:shadow-[0_0_0_3px_rgba(45,90,158,0.15)] focus-visible:ring-0 sm:text-sm";

const btnBase =
  "font-heading inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 active:scale-[0.97]";

export const btn = {
  primary: `${btnBase} bg-gradient-to-r from-navy-800 via-blue-600 to-blue-500 px-7 py-3.5 text-white btn-glow hover:-translate-y-0.5 hover:scale-[1.03] hover:shadow-[0_12px_32px_rgba(45,90,158,0.35)]`,
  accent: `${btnBase} bg-gradient-to-r from-gold-600 to-gold-500 px-7 py-3.5 font-bold text-navy-950 btn-glow-gold hover:-translate-y-0.5 hover:scale-[1.03] hover:from-gold-500 hover:to-gold-400 hover:shadow-[0_12px_32px_rgba(184,148,47,0.4)]`,
  outline: `${btnBase} border border-border bg-card px-6 py-3 text-navy-800 shadow-elevated hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-600 hover:shadow-elevated-lg`,
  ghost: `${btnBase} border border-white/25 bg-white/10 px-6 py-3 text-white backdrop-blur-md hover:border-white/40 hover:bg-white/15 hover:shadow-elevated`,
};
