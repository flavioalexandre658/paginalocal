"use client";

import { cn } from "@/lib/utils";
import type { DesignTokens } from "@/types/ai-generation";
import { AboutContentSchema } from "@/types/ai-generation";
import { StyledHeadline } from "../../shared/styled-headline";
import { ImageFrame } from "../../shared/image-frame";
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

export function AboutStoryBlock({ content, tokens }: Props) {
  const parsed = AboutContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const style = tokens.style;
  const isMinimal = style === "minimal";
  const isBold = style === "bold";

  /* SELF_BG: about controls its own background */
  const selfDark = style === "industrial" || style === "bold";
  const bgColor = selfDark ? tokens.palette.primary : getAboutLightBg(tokens);
  const textColor = selfDark ? "#fff" : tokens.palette.text;
  const mutedColor = selfDark ? "rgba(255,255,255,0.5)" : tokens.palette.textMuted;
  const subtitleColor = selfDark ? "rgba(255,255,255,0.45)" : tokens.palette.textMuted;
  const lineColor = selfDark ? "rgba(255,255,255,0.06)" : `${tokens.palette.text}0a`;
  const highlightLabelColor = selfDark ? "rgba(255,255,255,0.3)" : tokens.palette.textMuted;

  return (
    <div
      className="relative overflow-hidden py-24 md:py-32"
      style={{ backgroundColor: bgColor }}
    >
      {/* Background pattern for dark styles */}
      {selfDark && <SectionPattern tokens={tokens} />}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-11 gap-6 md:gap-10 lg:gap-20 items-center">
          {/* Image: 5 cols */}
          <div className="lg:col-span-5 pgl-fade-left" data-delay="2">
            {c.image ? (
              <ImageFrame
                src={c.image}
                alt={c.title.replace(/\*/g, "")}
                tokens={tokens}
              />
            ) : (
              <div
                className="aspect-[4/5]"
                style={{
                  backgroundColor: selfDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                  borderRadius: "var(--card-radius, 4px)",
                }}
              />
            )}
          </div>

          {/* Text: 6 cols */}
          <div className="lg:col-span-6">
            {/* Label with extending line */}
            <div className="pgl-fade-up flex items-center gap-3 mb-5">
              <span
                className="text-[0.7rem] font-medium tracking-[0.15em] uppercase"
                style={{ color: tokens.palette.accent }}
              >
                Quem somos
              </span>
              <span
                className="flex-1 h-px"
                style={{ backgroundColor: lineColor }}
              />
            </div>

            {/* Minimal: accent left border */}
            <div
              className={cn(isMinimal && "border-l-2 pl-6")}
              style={isMinimal ? { borderColor: tokens.palette.accent } : undefined}
            >
              <div style={{ color: textColor }}>
                <StyledHeadline
                  text={c.title}
                  tokens={tokens}
                  className="pgl-fade-up text-2xl md:text-3xl lg:text-[2.8rem] leading-[1.08]"
                  accentClassName="normal-case"
                />
              </div>

              {/* Subtitle */}
              {c.subtitle && (
                <p
                  className="pgl-fade-up mt-4 text-[0.95rem] leading-[1.8] font-light"
                  style={{ color: subtitleColor }}
                  data-delay="1"
                >
                  {c.subtitle}
                </p>
              )}

              {/* Paragraphs */}
              <div className="mt-7 space-y-4 pgl-fade-up" data-delay="2">
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

            {/* Highlights */}
            {c.highlights && c.highlights.length > 0 && (
              <div
                className="pgl-fade-up grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mt-8 md:mt-10 pt-6 md:pt-8"
                style={{ borderTop: `1px solid ${lineColor}` }}
                data-delay="3"
              >
                {c.highlights.map((h, i) => (
                  <div key={i}>
                    <div
                      className="text-xl font-semibold"
                      style={{
                        fontFamily: "var(--pgl-font-heading)",
                        color: textColor,
                      }}
                    >
                      {h.value}
                    </div>
                    <div
                      className="mt-1 text-[0.65rem] uppercase tracking-[0.1em] font-normal"
                      style={{ color: highlightLabelColor, opacity: 0.6 }}
                    >
                      {h.label}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
