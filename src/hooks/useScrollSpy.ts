"use client";

import { useEffect, useState } from "react";

const HOME_ID = "home";
const TOP_OFFSET = 96;

/** Stable section list for scroll-spy (pass from nav-config) */
export function useScrollSpy(sectionIds: readonly string[]) {
  const sectionKey = sectionIds.join(",");
  const [activeSection, setActiveSection] = useState(
    sectionIds[0] ?? HOME_ID
  );

  useEffect(() => {
    const ids = sectionKey.split(",").filter(Boolean);
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const updateFromScroll = () => {
      if (window.scrollY < TOP_OFFSET) {
        setActiveSection(HOME_ID);
        return;
      }

      let current = sections[0]?.id ?? HOME_ID;
      for (const section of sections) {
        const { top } = section.getBoundingClientRect();
        if (top <= TOP_OFFSET + 40) {
          current = section.id;
        }
      }
      setActiveSection(current);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (window.scrollY < TOP_OFFSET) {
          setActiveSection(HOME_ID);
          return;
        }

        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length > 0) {
          setActiveSection(visible[0].target.id);
        }
      },
      {
        rootMargin: "-15% 0px -60% 0px",
        threshold: [0, 0.1, 0.25, 0.4],
      }
    );

    sections.forEach((section) => observer.observe(section));
    window.addEventListener("scroll", updateFromScroll, { passive: true });
    updateFromScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updateFromScroll);
    };
  }, [sectionKey]);

  return activeSection;
}
