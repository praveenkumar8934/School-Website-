/** Shared Tailwind class groups for consistent UI across sections */

export const section = {
  wrap: "py-20 sm:py-28 lg:py-32",
  container: "mx-auto max-w-6xl px-4 sm:px-6 lg:px-8",
};

export const sectionHeader = {
  label:
    "inline-flex items-center rounded-full border border-indigo-200/80 bg-indigo-50/80 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-600",
  labelDark:
    "inline-flex items-center rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-300",
  title:
    "mt-4 font-[family-name:var(--font-display)] text-[clamp(1.75rem,4vw,2.5rem)] font-bold leading-tight tracking-tight text-slate-900",
  titleLight:
    "mt-4 font-[family-name:var(--font-display)] text-[clamp(1.75rem,4vw,2.5rem)] font-bold leading-tight tracking-tight text-white",
  desc: "mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg",
  descLight: "mt-4 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg",
};

export const card = {
  base: "rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300",
  hover:
    "hover:-translate-y-1 hover:border-indigo-200/80 hover:shadow-lg hover:shadow-indigo-500/10",
  glass:
    "rounded-2xl border border-white/60 bg-white/80 shadow-lg shadow-slate-200/40 backdrop-blur-md",
  dark: "rounded-2xl border border-white/10 bg-white/5 shadow-xl backdrop-blur-md transition-all duration-300",
};

export const input =
  "mt-2 w-full rounded-xl border border-slate-200/90 bg-white/80 px-4 py-3 text-sm text-slate-900 outline-none transition-[border-color,box-shadow,background-color] duration-200 placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:shadow-[0_0_0_3px_rgba(99,102,241,0.15)] focus:ring-0";

export const btn = {
  primary:
    "inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-indigo-500/40 hover:brightness-110",
  outline:
    "inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-300 hover:text-indigo-600 hover:shadow-md",
};
