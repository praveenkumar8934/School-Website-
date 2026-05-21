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
};

export function SectionHeader({
  label,
  title,
  description,
  align = "left",
  variant = "light",
  className,
}: SectionHeaderProps) {
  const isDark = variant === "dark";

  return (
    <div
      className={cn(
        align === "center" && "mx-auto max-w-3xl text-center",
        className
      )}
    >
      <span className={isDark ? sectionHeader.labelDark : sectionHeader.label}>
        {label}
      </span>
      <h2 className={isDark ? sectionHeader.titleLight : sectionHeader.title}>
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            isDark ? sectionHeader.descLight : sectionHeader.desc,
            align === "center" && "mx-auto"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
