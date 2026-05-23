import { sectionHeader } from "@/lib/styles";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type SectionHeaderProps = {
  label: string;
  title: ReactNode;
  description?: string;
  align?: "left" | "center";
  variant?: "light" | "dark";
  className?: string;
  id?: string;
};

export function SectionHeader({
  label,
  title,
  description,
  align = "left",
  variant = "light",
  className,
  id,
}: SectionHeaderProps) {
  const isDark = variant === "dark";
  const headingId = id ?? "section-heading";

  return (
    <header
      className={cn(
        align === "center" && "mx-auto max-w-3xl text-center",
        className
      )}
    >
      <span
        className={cn(
          isDark ? sectionHeader.labelDark : sectionHeader.label
        )}
      >
        {label}
      </span>
      <h2
        id={headingId}
        className={cn(
          isDark ? sectionHeader.titleLight : sectionHeader.title,
          isDark && "!text-white",
          align === "center" && "mx-auto"
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            isDark ? sectionHeader.descLight : sectionHeader.desc,
            isDark && "text-slate-300",
            align === "center" && "mx-auto"
          )}
        >
          {description}
        </p>
      )}
    </header>
  );
}
