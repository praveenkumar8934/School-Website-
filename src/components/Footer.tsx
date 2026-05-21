import { GraduationCap } from "lucide-react";

const footerLinks = {
  School: [
    { label: "About", href: "#about" },
    { label: "Courses", href: "#courses" },
    { label: "Faculty", href: "#faculty" },
    { label: "Gallery", href: "#gallery" },
  ],
  Admissions: [
    { label: "Apply Now", href: "#contact" },
    { label: "Tuition", href: "#contact" },
    { label: "Scholarships", href: "#contact" },
    { label: "FAQ", href: "#contact" },
  ],
  Resources: [
    { label: "Parent Portal", href: "#" },
    { label: "Calendar", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Alumni", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <a href="#" className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white">
                <GraduationCap className="h-5 w-5" />
              </span>
              <span className="font-[family-name:var(--font-display)] text-lg font-semibold">
                Nova <span className="text-indigo-600">Academy</span>
              </span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-500">
              Shaping future-ready leaders through excellence in education,
              innovation, and community since 1992.
            </p>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-slate-900">{title}</h4>
              <ul className="mt-4 space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-slate-500 transition hover:text-indigo-600"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-8 sm:flex-row">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} Nova Academy. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-slate-500">
            <a href="#" className="transition hover:text-indigo-600">
              Privacy
            </a>
            <a href="#" className="transition hover:text-indigo-600">
              Terms
            </a>
            <a href="#" className="transition hover:text-indigo-600">
              Accessibility
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
