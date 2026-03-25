"use client";

import { cn } from "@/lib/utils";
import type { DesignTokens } from "@/types/ai-generation";

interface Props {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "secondary";
  tokens: DesignTokens;
  className?: string;
  isDark?: boolean;
}

export function PglButton({
  children,
  href,
  variant = "primary",
  tokens,
  className,
  isDark = false,
}: Props) {
  const s = tokens.style;
  const isPrimary = variant === "primary";

  const style: React.CSSProperties = {
    padding: "var(--btn-padding, 16px 36px)",
    fontSize: s === "bold" ? "0.85rem" : "0.82rem",
    fontWeight: parseInt(
      getComputedStyleFallback("--btn-weight", s === "bold" ? "600" : "500")
    ),
    letterSpacing: "var(--btn-tracking, 0.08em)",
    textTransform: (s === "industrial" || s === "bold" ? "uppercase" : "none") as "uppercase" | "none",
    borderRadius: "var(--btn-radius, 0px)",
    transition: `all var(--transition-speed, 0.4s)`,
    ...(isPrimary
      ? {
          backgroundColor:
            s === "minimal" ? "transparent" : tokens.palette.accent,
          color: s === "minimal" ? tokens.palette.text : "#fff",
          border:
            s === "minimal"
              ? `1px solid ${tokens.palette.text}`
              : "none",
        }
      : {
          backgroundColor: "transparent",
          color: isDark
            ? "rgba(255,255,255,0.8)"
            : s === "minimal"
              ? tokens.palette.textMuted
              : tokens.palette.accent,
          border: isDark
            ? "1px solid rgba(255,255,255,0.15)"
            : s === "bold"
              ? `2px solid ${tokens.palette.text}`
              : s === "minimal"
                ? "none"
                : `1px solid ${tokens.palette.accent}30`,
        }),
  };

  const Tag = href ? "a" : "button";

  return (
    <Tag
      href={href || undefined}
      className={cn(
        "inline-flex items-center justify-center",
        "hover:translate-y-[-1px]",
        s === "bold" && isPrimary && "sm:w-auto",
        className
      )}
      style={style}
    >
      {children}
      {s === "minimal" && variant === "secondary" && (
        <span className="ml-2 text-xs">→</span>
      )}
    </Tag>
  );
}

function getComputedStyleFallback(varName: string, fallback: string): string {
  return fallback;
}
