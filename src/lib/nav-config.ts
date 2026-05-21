export type NavLink = {
  label: string;
  href: string;
  sectionId: string;
};

export const NAV_LINKS: NavLink[] = [
  { label: "About", href: "#about", sectionId: "about" },
  { label: "Courses", href: "#courses", sectionId: "courses" },
  { label: "Faculty", href: "#faculty", sectionId: "faculty" },
  { label: "Testimonials", href: "#testimonials", sectionId: "testimonials" },
  { label: "Gallery", href: "#gallery", sectionId: "gallery" },
  { label: "Contact", href: "#contact", sectionId: "contact" },
];

export const NAV_SECTION_IDS = [
  "home",
  ...NAV_LINKS.map((l) => l.sectionId),
] as const;
