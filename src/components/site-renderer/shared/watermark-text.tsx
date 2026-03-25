"use client";

import type { DesignTokens } from "@/types/ai-generation";

interface Props {
  text: string;
  tokens: DesignTokens;
}

export function WatermarkText({ text, tokens }: Props) {
  if (tokens.style !== "industrial" && tokens.style !== "bold") return null;

  return (
    <div
      className="absolute left-0 right-0 overflow-hidden pointer-events-none select-none"
      style={{
        fontFamily: "var(--pgl-font-heading)",
        fontSize: "clamp(4rem, 12vw, 10rem)",
        fontWeight: 800,
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        color:
          tokens.style === "industrial"
            ? `${tokens.palette.text}03`
            : `${tokens.palette.accent}06`,
        lineHeight: 1,
        textAlign: "center",
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  );
}
