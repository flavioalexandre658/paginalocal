"use client";

import { cn } from "@/lib/utils";
import type { DesignTokens } from "@/types/ai-generation";

interface Props extends React.HTMLAttributes<HTMLHeadingElement> {
  text: string;
  tokens: DesignTokens;
  as?: "h1" | "h2" | "h3";
  className?: string;
  accentClassName?: string;
}

export function StyledHeadline({
  text,
  tokens,
  as: Tag = "h2",
  className,
  accentClassName,
  ...rest
}: Props) {
  const parts = text.split(/\*([^*]+)\*/);

  return (
    <Tag
      className={className}
      {...rest}
      style={{
        textTransform: "var(--heading-transform, uppercase)" as unknown as undefined,
        fontWeight: "var(--heading-weight, 700)" as unknown as undefined,
        letterSpacing: "var(--heading-tracking, -0.01em)" as unknown as undefined,
        fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
      }}
    >
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <AccentWord
            key={i}
            word={part}
            tokens={tokens}
            accentClassName={accentClassName}
          />
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </Tag>
  );
}

function AccentWord({
  word,
  tokens,
  accentClassName,
}: {
  word: string;
  tokens: DesignTokens;
  accentClassName?: string;
}) {
  const style = getAccentStyles(tokens);

  return (
    <em className={cn("not-italic", accentClassName)} style={style}>
      {word}
    </em>
  );
}

function getAccentStyles(tokens: DesignTokens): React.CSSProperties {
  const s = tokens.style;
  const accent = tokens.palette.accent;
  switch (s) {
    case "industrial":
      return {
        fontFamily: "var(--pgl-font-accent), serif",
        fontStyle: "italic",
        fontWeight: 700,
        color: accent,
        textTransform: "none" as const,
      };

    case "elegant":
      return {
        fontFamily: "var(--pgl-font-accent), serif",
        fontStyle: "normal",
        fontWeight: 700,
        color: accent,
        textDecorationLine: "underline",
        textDecorationStyle: "wavy" as const,
        textDecorationColor: accent,
        textUnderlineOffset: "6px",
        textDecorationThickness: "1.5px",
        textTransform: "none" as const,
      };

    case "warm":
      return {
        fontFamily: "inherit",
        fontStyle: "normal",
        fontWeight: 700,
        color: accent,
        textTransform: "none" as const,
      };

    case "bold":
      return {
        fontFamily: "inherit",
        fontStyle: "normal",
        fontWeight: 800,
        color: accent,
        textTransform: "uppercase" as const,
        textDecorationLine: "underline",
        textDecorationColor: accent,
        textUnderlineOffset: "4px",
        textDecorationThickness: "3px",
      };

    case "minimal":
      return {
        fontFamily: "inherit",
        fontStyle: "normal",
        fontWeight: 400,
        color: accent,
        borderBottom: `2px solid ${accent}`,
        paddingBottom: "2px",
        textTransform: "none" as const,
      };

    default:
      return { color: accent };
  }
}
