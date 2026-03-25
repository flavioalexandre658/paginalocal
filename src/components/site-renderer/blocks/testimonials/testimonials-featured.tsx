"use client";

import { cn } from "@/lib/utils";
import { StyledHeadline } from "../../shared/styled-headline";
import type { DesignTokens } from "@/types/ai-generation";
import { TestimonialsContentSchema } from "@/types/ai-generation";

interface Props {
  content: Record<string, unknown>;
  tokens: DesignTokens;
  isDark?: boolean;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getSerifFont(fontPairing: string): string {
  const serifs: Record<string, string> = {
    "oswald+roboto": "'Playfair Display', serif",
    "montserrat+opensans": "'Playfair Display', serif",
    "inter+merriweather": "'Merriweather', serif",
    "poppins+lora": "'Lora', serif",
    "playfair+source-sans": "'Playfair Display', serif",
    "dm-sans+dm-serif": "'DM Serif Display', serif",
    "raleway+roboto": "'Playfair Display', serif",
    "space-grotesk+inter": "'DM Serif Display', serif",
  };
  return serifs[fontPairing] || "'Playfair Display', serif";
}

export function TestimonialsFeatured({ content, tokens }: Props) {
  const parsed = TestimonialsContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const featured = c.items[0];
  const serifFont = getSerifFont(tokens.fontPairing);
  const style = tokens.style;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header: centered */}
      <div className="text-center mb-16 pgl-fade-up">
        <StyledHeadline
          text={c.title}
          tokens={tokens}
          className="text-3xl md:text-4xl lg:text-5xl"
        />
      </div>

      {/* Featured quote */}
      {featured && (
        <div
          className={cn(
            "max-w-[800px] mx-auto pgl-fade-up",
            style === "elegant" || style === "warm"
              ? "p-4 md:p-8 lg:p-12"
              : "text-center",
          )}
          data-delay="1"
          style={{
            borderRadius: "var(--card-radius, 0px)",
            transition: `all var(--transition-speed, 0.4s)`,
            ...(style === "elegant"
              ? {
                  backgroundColor: tokens.palette.background,
                  boxShadow: `0 4px 24px ${tokens.palette.text}08`,
                  textAlign: "center" as const,
                }
              : style === "warm"
                ? {
                    backgroundColor: `${tokens.palette.primary}05`,
                    textAlign: "center" as const,
                  }
                : {}),
          }}
        >
          {/* Giant decorative quote -- industrial, bold, warm */}
          {(style === "industrial" || style === "warm") && (
            <span
              className="block text-[6rem] md:text-[8rem] leading-none select-none pointer-events-none -mb-8 md:-mb-10"
              style={{
                fontFamily: serifFont,
                color: tokens.palette.accent,
                opacity: 0.08,
              }}
            >
              &ldquo;
            </span>
          )}

          {/* Bold style -- large quote marks flanking */}
          {style === "bold" && (
            <span
              className="block text-[6rem] md:text-[8rem] leading-none select-none pointer-events-none -mb-6 md:-mb-8"
              style={{
                fontFamily: serifFont,
                color: tokens.palette.accent,
                opacity: 0.25,
              }}
            >
              &ldquo;
            </span>
          )}

          {/* Elegant style -- subtle decorative line */}
          {style === "elegant" && (
            <div
              className="w-12 h-px mx-auto mb-6"
              style={{ backgroundColor: tokens.palette.accent }}
            />
          )}

          <blockquote
            className={cn(
              "leading-[1.7] font-bold",
              style === "minimal"
                ? "text-lg md:text-xl lg:text-2xl border-l-2 pl-6 text-left"
                : "text-lg md:text-xl lg:text-2xl",
            )}
            style={{
              fontFamily: style === "minimal" ? "var(--pgl-font-body)" : serifFont,
              fontStyle: style === "minimal" || style === "bold" ? "normal" : "italic",
              color: tokens.palette.text,
              fontWeight: style === "bold" ? 800 : style === "minimal" ? 400 : 700,
              ...(style === "minimal"
                ? { borderColor: `${tokens.palette.accent}40` }
                : {}),
            }}
          >
            {featured.text}
          </blockquote>

          {/* Bold style -- closing quote */}
          {style === "bold" && (
            <span
              className="block text-[4rem] md:text-[6rem] leading-none select-none pointer-events-none -mt-2 text-right"
              style={{
                fontFamily: serifFont,
                color: tokens.palette.accent,
                opacity: 0.25,
              }}
            >
              &rdquo;
            </span>
          )}

          <div className={cn(
            "mt-8 flex items-center gap-4",
            style === "minimal" ? "justify-start pl-6" : "justify-center",
          )}>
            {/* Avatar initials */}
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium"
              style={{
                backgroundColor: tokens.palette.primary,
                color: "#fff",
                fontFamily: "var(--pgl-font-heading)",
              }}
            >
              {getInitials(featured.author)}
            </div>
            <div className="text-left">
              <div
                className="text-[0.9rem] font-semibold"
                style={{
                  fontFamily: "var(--pgl-font-heading)",
                  color: tokens.palette.text,
                  textTransform: "var(--label-transform, uppercase)" as unknown as undefined,
                  letterSpacing: "var(--label-tracking, 0.05em)" as unknown as undefined,
                }}
              >
                {featured.author}
              </div>
              {featured.role && (
                <div className="text-xs mt-0.5" style={{ color: tokens.palette.textMuted }}>
                  {featured.role}
                </div>
              )}
            </div>
            {/* Rating dots */}
            {featured.rating != null && featured.rating > 0 && (
              <div className="flex gap-1 ml-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor:
                        i < Math.round(featured.rating!)
                          ? tokens.palette.accent
                          : `${tokens.palette.text}15`,
                      transition: `background-color var(--transition-speed, 0.4s)`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
