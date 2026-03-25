"use client";

import { cn } from "@/lib/utils";
import type { DesignTokens } from "@/types/ai-generation";

interface Props {
  src: string;
  alt: string;
  tokens: DesignTokens;
  className?: string;
  showOffset?: boolean;
}

const RADIUS_MAP: Record<string, string> = {
  industrial: "0px",
  elegant: "16px",
  warm: "12px",
  bold: "4px",
  minimal: "0px",
};

export function ImageFrame({
  src,
  alt,
  tokens,
  className,
  showOffset = true,
}: Props) {
  const s = tokens.style;
  const imageRadius = RADIUS_MAP[s] || "4px";

  const offsetStyles: Record<string, React.CSSProperties | null> = {
    industrial: {
      border: `1px solid ${tokens.palette.accent}25`,
      borderRadius: "0px",
    },
    elegant: {
      border: "none",
      borderRadius: "20px",
      boxShadow: `0 20px 60px ${tokens.palette.primary}15`,
    },
    warm: {
      border: `1px solid ${tokens.palette.accent}15`,
      borderRadius: "16px",
    },
    bold: {
      border: `2px solid ${tokens.palette.accent}`,
      borderRadius: "4px",
    },
    minimal: null,
  };

  const offset = offsetStyles[s] ?? null;

  const shapeRadius =
    s === "elegant" ? "50%" : s === "warm" ? "30%" : "0";

  return (
    <div className={cn("relative", className)}>
      {/* Offset border/shadow */}
      {showOffset && offset && (
        <div
          className="hidden lg:block absolute top-5 left-5 right-[-20px] bottom-[-20px] z-0"
          style={offset}
        />
      )}

      {/* Background shape */}
      {s !== "minimal" && (
        <div
          className="hidden lg:block absolute -bottom-8 -right-8 w-28 h-28 z-0"
          style={{
            backgroundColor: tokens.palette.accent,
            opacity: 0.08,
            borderRadius: shapeRadius,
          }}
        />
      )}

      {/* Image */}
      <div
        className="relative z-10 overflow-hidden"
        style={{ borderRadius: imageRadius }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="w-full h-auto" loading="lazy" />
      </div>
    </div>
  );
}
