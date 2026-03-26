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

export function TestimonialsGrid({ content, tokens }: Props) {
  const parsed = TestimonialsContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const serifFont = getSerifFont(tokens.fontPairing);
  const style = tokens.style;

  /* -- style-dependent card rendering -- */
  const isGapPx = style === "industrial";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header: centered */}
      <div className="text-center mb-16 pgl-fade-up">
        <StyledHeadline
          text={c.title}
          tokens={tokens}
          className="text-3xl md:text-4xl lg:text-5xl"
          data-pgl-path="title"
          data-pgl-edit="text"
        />
        {c.subtitle && (
          <p
            className="mt-4 text-[0.95rem] leading-[1.8] font-light max-w-2xl mx-auto"
            style={{ color: tokens.palette.textMuted }}
            data-pgl-path="subtitle"
            data-pgl-edit="text"
          >
            {c.subtitle}
          </p>
        )}
      </div>

      {/* Grid of cards */}
      <div
        className={cn(
          "grid",
          isGapPx ? "gap-px" : "gap-4 md:gap-6",
          "grid-cols-1",
          c.items.length === 2 && "md:grid-cols-2",
          c.items.length >= 3 && "md:grid-cols-2 lg:grid-cols-3",
          isGapPx && "overflow-hidden",
        )}
        style={
          isGapPx
            ? {
                backgroundColor: `${tokens.palette.text}08`,
                borderRadius: "var(--card-radius, 0px)",
              }
            : undefined
        }
      >
        {c.items.map((item, i) => {
          /* -- per-style card wrapper -- */
          const cardStyle: React.CSSProperties = {
            borderRadius: "var(--card-radius, 0px)",
            transition: `all var(--transition-speed, 0.4s)`,
            ...(style === "elegant"
              ? {
                  backgroundColor: tokens.palette.background,
                  boxShadow: `0 2px 16px ${tokens.palette.text}06`,
                }
              : style === "warm"
                ? {
                    backgroundColor: `${tokens.palette.primary}05`,
                  }
                : style === "bold"
                  ? {
                      border: `2px solid ${tokens.palette.text}10`,
                    }
                  : style === "minimal"
                    ? { borderRadius: "0px" }
                    : { /* industrial -- white bg inside gap-px grid */ }),
          };

          return (
            <div
              key={i}
              className={cn(
                "pgl-fade-up",
                style === "industrial" && "p-6 md:p-10 lg:p-12",
                style === "elegant" && "p-4 md:p-8 lg:p-10",
                style === "warm" && "p-4 md:p-8 lg:p-10",
                style === "bold" && "p-4 md:p-8 lg:p-10",
                style === "minimal" && "py-4 md:py-6",
              )}
              style={{
                ...cardStyle,
                ...(style === "industrial"
                  ? { backgroundColor: tokens.palette.background }
                  : {}),
              }}
              data-delay={i + 1}
            >
              {/* Decorative quote -- industrial / warm */}
              {(style === "industrial" || style === "warm") && (
                <span
                  className="block text-5xl leading-none select-none pointer-events-none mb-4"
                  style={{
                    fontFamily: serifFont,
                    color: tokens.palette.accent,
                    opacity: 0.12,
                  }}
                >
                  &ldquo;
                </span>
              )}

              {/* Bold -- large accent quote marks */}
              {style === "bold" && (
                <span
                  className="block text-6xl leading-none select-none pointer-events-none mb-2"
                  style={{
                    fontFamily: serifFont,
                    color: tokens.palette.accent,
                    opacity: 0.3,
                  }}
                >
                  &ldquo;
                </span>
              )}

              <blockquote
                className={cn(
                  "mb-8",
                  style === "minimal"
                    ? "text-[0.95rem] leading-[1.8] font-normal border-l-2 pl-4"
                    : "text-[0.95rem] leading-[1.8] font-medium",
                )}
                style={{
                  fontFamily: style === "minimal" ? "var(--pgl-font-body)" : serifFont,
                  fontStyle: style === "minimal" || style === "bold" ? "normal" : "italic",
                  color: tokens.palette.text,
                  ...(style === "minimal"
                    ? { borderColor: `${tokens.palette.accent}40` }
                    : {}),
                }}
                data-pgl-path={`items.${i}.text`}
                data-pgl-edit="text"
              >
                {item.text}
              </blockquote>

              <div className="flex items-center gap-3">
                {style !== "minimal" && (
                  item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.image}
                      alt={item.author}
                      className="w-10 h-10 rounded-full object-cover shrink-0"
                      data-pgl-path={`items.${i}.image`}
                      data-pgl-edit="image"
                    />
                  ) : (
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-medium shrink-0"
                      style={{
                        backgroundColor: tokens.palette.primary,
                        color: "#fff",
                        fontFamily: "var(--pgl-font-heading)",
                      }}
                      data-pgl-path={`items.${i}.image`}
                      data-pgl-edit="image"
                    >
                      {getInitials(item.author)}
                    </div>
                  )
                )}
                <div className="min-w-0">
                  <div
                    className="text-[0.8rem] font-semibold"
                    style={{
                      fontFamily: "var(--pgl-font-heading)",
                      color: tokens.palette.text,
                      textTransform: "var(--label-transform, uppercase)" as unknown as undefined,
                      letterSpacing: "var(--label-tracking, 0.05em)" as unknown as undefined,
                    }}
                    data-pgl-path={`items.${i}.author`}
                    data-pgl-edit="text"
                  >
                    {item.author}
                  </div>
                  {item.role && (
                    <div
                      className="text-xs mt-0.5"
                      style={{ color: tokens.palette.textMuted }}
                      data-pgl-path={`items.${i}.role`}
                      data-pgl-edit="text"
                    >
                      {item.role}
                    </div>
                  )}
                </div>
                {/* Rating dots */}
                {item.rating != null && item.rating > 0 && (
                  <div className="flex gap-1 ml-auto">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <div
                        key={j}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          backgroundColor:
                            j < Math.round(item.rating!)
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
          );
        })}
      </div>
    </div>
  );
}
