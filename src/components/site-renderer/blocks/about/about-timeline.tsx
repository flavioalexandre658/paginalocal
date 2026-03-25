"use client";

import { cn } from "@/lib/utils";
import type { DesignTokens } from "@/types/ai-generation";
import { AboutContentSchema } from "@/types/ai-generation";
import { StyledHeadline } from "../../shared/styled-headline";
import { SectionPattern } from "../../shared/section-pattern";

interface Props {
  content: Record<string, unknown>;
  tokens: DesignTokens;
  isDark?: boolean;
}

function getAboutLightBg(tokens: DesignTokens): string {
  switch (tokens.style) {
    case "elegant":
      return `${tokens.palette.accent}06`;
    case "warm":
      return `${tokens.palette.secondary}08`;
    case "minimal":
      return tokens.palette.surface;
    default:
      return tokens.palette.surface;
  }
}

export function AboutTimeline({ content, tokens }: Props) {
  const parsed = AboutContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const style = tokens.style;
  const isMinimal = style === "minimal";
  const isElegant = style === "elegant";
  const isWarm = style === "warm";
  const isBold = style === "bold";

  /* SELF_BG: about controls its own background */
  const selfDark = style === "industrial" || style === "bold";
  const bgColor = selfDark ? tokens.palette.primary : getAboutLightBg(tokens);
  const textColor = selfDark ? "#fff" : tokens.palette.text;
  const mutedColor = selfDark ? "rgba(255,255,255,0.5)" : tokens.palette.textMuted;
  const subtitleColor = selfDark ? "rgba(255,255,255,0.45)" : tokens.palette.textMuted;
  const lineColor = selfDark ? "rgba(255,255,255,0.06)" : `${tokens.palette.text}0a`;
  const highlightLabelColor = selfDark ? "rgba(255,255,255,0.35)" : tokens.palette.textMuted;
  const cardBorderColor = selfDark
    ? "rgba(255,255,255,0.06)"
    : `${tokens.palette.text}0a`;
  const cardBorderHover = selfDark
    ? "rgba(255,255,255,0.12)"
    : `${tokens.palette.text}18`;

  return (
    <div
      className="relative overflow-hidden py-24 md:py-32"
      style={{ backgroundColor: bgColor }}
    >
      {/* Background pattern for dark styles */}
      {selfDark && <SectionPattern tokens={tokens} />}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 mb-10 md:mb-16 items-end">
          <div>
            {/* Label with extending line */}
            <div className="pgl-fade-up flex items-center gap-3 mb-5">
              <span
                className="text-[0.7rem] font-medium tracking-[0.15em] uppercase"
                style={{ color: tokens.palette.accent }}
              >
                Nossa historia
              </span>
              <span
                className="flex-1 h-px"
                style={{ backgroundColor: lineColor }}
              />
            </div>

            <div style={{ color: textColor }}>
              <StyledHeadline
                text={c.title}
                tokens={tokens}
                className="pgl-fade-up text-2xl md:text-3xl lg:text-[2.8rem] leading-[1.08]"
                accentClassName="normal-case"
              />
            </div>

            {c.subtitle && (
              <p
                className="pgl-fade-up mt-4 text-[0.95rem] leading-[1.8] font-light"
                style={{ color: subtitleColor }}
                data-delay="1"
              >
                {c.subtitle}
              </p>
            )}
          </div>

          {/* Paragraphs on the right */}
          <div className="pgl-fade-up space-y-4" data-delay="2">
            {c.paragraphs.map((p, i) => (
              <p
                key={i}
                className="text-[0.925rem] leading-[1.85] font-light max-w-[500px]"
                style={{ color: mutedColor }}
              >
                {p}
              </p>
            ))}
          </div>
        </div>

        {/* Timeline */}
        {c.highlights && c.highlights.length > 0 && (
          <div className="relative mt-10 md:mt-16">
            {/* Vertical line: left-aligned on mobile, center on desktop */}
            <div
              className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px md:-translate-x-1/2"
              style={{ backgroundColor: lineColor }}
            />

            {c.highlights.map((h, i) => {
              const isEven = i % 2 === 0;
              return (
                <div
                  key={i}
                  className="pgl-fade-up relative flex flex-col md:flex-row gap-4 md:gap-0 mb-8 md:mb-12 last:mb-0"
                  data-delay={i + 1}
                >
                  {/* Marker dot: left on mobile, center on desktop */}
                  <div
                    className="absolute left-4 md:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full z-10 mt-1"
                    style={{ backgroundColor: tokens.palette.accent }}
                  />

                  {/* Spacer for left side on desktop */}
                  {isEven && <div className="hidden md:block md:w-[46%]" />}

                  {/* Content card */}
                  <div
                    className={cn(
                      "ml-10 md:ml-0 md:w-[46%] p-4 md:p-6 border",
                      isEven ? "md:ml-auto" : "md:mr-auto",
                      isElegant && "rounded-xl",
                      isWarm && "rounded-lg",
                      isMinimal && "border-l-2 border-t-0 border-r-0 border-b-0 rounded-none",
                    )}
                    style={{
                      borderColor: cardBorderColor,
                      borderRadius:
                        isElegant || isWarm || isMinimal
                          ? undefined
                          : "var(--card-radius, 4px)",
                      transition: `border-color var(--transition-speed, 0.4s)`,
                      ...(isMinimal
                        ? { borderLeftColor: tokens.palette.accent }
                        : {}),
                    }}
                    onMouseOver={(e) => {
                      if (!isMinimal)
                        e.currentTarget.style.borderColor = cardBorderHover;
                    }}
                    onMouseOut={(e) => {
                      if (!isMinimal)
                        e.currentTarget.style.borderColor = cardBorderColor;
                    }}
                  >
                    <div
                      className="text-xl md:text-2xl font-semibold tabular-nums"
                      style={{
                        fontFamily: "var(--pgl-font-heading)",
                        color: textColor,
                      }}
                    >
                      {h.value}
                    </div>
                    {/* Accent line */}
                    {!isMinimal && (
                      <div
                        className="w-6 h-0.5 my-3"
                        style={{ backgroundColor: tokens.palette.accent }}
                      />
                    )}
                    <div
                      className={cn(
                        "text-[0.75rem] uppercase tracking-[0.1em] font-normal leading-relaxed",
                        isMinimal && "mt-2",
                      )}
                      style={{ color: highlightLabelColor, opacity: 0.6 }}
                    >
                      {h.label}
                    </div>
                  </div>

                  {/* Spacer for right side on desktop */}
                  {!isEven && <div className="hidden md:block md:w-[46%]" />}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
