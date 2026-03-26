"use client";

import { cn } from "@/lib/utils";
import type { DesignTokens } from "@/types/ai-generation";
import { ServicesContentSchema } from "@/types/ai-generation";
import { StyledHeadline } from "../../shared/styled-headline";
import { PglButton } from "../../shared/pgl-button";

interface Props {
  content: Record<string, unknown>;
  tokens: DesignTokens;
  isDark?: boolean;
}

export function ServicesAlternating({ content, tokens }: Props) {
  const parsed = ServicesContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const style = tokens.style;
  const isMinimal = style === "minimal";
  const isBold = style === "bold";

  /* Services are always on light bg */
  const textColor = tokens.palette.text;
  const mutedColor = tokens.palette.textMuted;

  return (
    <div className="relative overflow-hidden">
      {/* Decorative background shape */}
      {!isMinimal && (
        <div
          className="hidden lg:block absolute -top-[150px] -left-[200px] w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ backgroundColor: tokens.palette.accent, opacity: 0.02 }}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="mb-10 md:mb-16">
          <StyledHeadline
            text={c.title}
            tokens={tokens}
            className="pgl-fade-up text-2xl md:text-3xl lg:text-5xl leading-[1.05]"
            accentClassName="normal-case"
            data-pgl-path="title"
            data-pgl-edit="text"
          />
          {c.subtitle && (
            <p
              className="pgl-fade-up mt-5 text-[0.95rem] leading-[1.8] font-light max-w-xl"
              style={{ color: mutedColor }}
              data-delay="1"
              data-pgl-path="subtitle"
              data-pgl-edit="text"
            >
              {c.subtitle}
            </p>
          )}
        </div>

        {/* Alternating items */}
        <div className="space-y-0">
          {c.items.map((item, i) => {
            const isEven = i % 2 === 0;
            return (
              <div key={i}>
                {i > 0 && (
                  <div
                    className="h-px"
                    style={{ backgroundColor: `${textColor}0a` }}
                  />
                )}
                <div
                  className={cn(
                    "flex flex-col md:flex-row gap-6 md:gap-10 lg:gap-16 items-center py-8 md:py-14",
                    "pgl-fade-up",
                    !isEven && "md:flex-row-reverse",
                  )}
                  data-delay={i + 1}
                >
                  {/* Image / placeholder */}
                  <div className="w-full md:w-[40%] shrink-0">
                    {item.image ? (
                      <div
                        className="relative overflow-hidden group"
                        style={{
                          borderRadius: "var(--card-radius, 4px)",
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full aspect-[4/3] object-cover"
                          data-pgl-path={`items.${i}.image`}
                          data-pgl-edit="image"
                          style={{
                            transition: `transform var(--transition-speed, 0.4s)`,
                          }}
                          onMouseOver={(e) =>
                            (e.currentTarget.style.transform = "scale(1.03)")
                          }
                          onMouseOut={(e) =>
                            (e.currentTarget.style.transform = "scale(1)")
                          }
                        />
                      </div>
                    ) : (
                      <div
                        className="aspect-[4/3] flex items-center justify-center"
                        style={{
                          backgroundColor: `${tokens.palette.primary}0d`,
                          borderRadius: "var(--card-radius, 4px)",
                        }}
                      >
                        <span
                          className={cn(
                            "font-bold select-none",
                            isBold ? "text-7xl md:text-8xl" : "text-5xl md:text-6xl",
                          )}
                          style={{
                            fontFamily: "var(--pgl-font-heading)",
                            color: `${tokens.palette.primary}15`,
                          }}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Text content */}
                  <div className="flex-1 space-y-4">
                    {/* Number label */}
                    {!isMinimal && (
                      <span
                        className="text-[0.7rem] font-medium tracking-[0.15em] uppercase"
                        style={{ color: tokens.palette.accent }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    )}

                    {isMinimal && (
                      <div
                        className="w-1 h-6"
                        style={{ backgroundColor: tokens.palette.accent }}
                      />
                    )}

                    <h3
                      className={cn(
                        "text-xl md:text-2xl font-semibold tracking-[0.02em]",
                        (style === "industrial" || isBold) && "uppercase",
                        isBold && "!font-extrabold",
                      )}
                      style={{
                        fontFamily: "var(--pgl-font-heading)",
                        color: textColor,
                      }}
                      data-pgl-path={`items.${i}.name`}
                      data-pgl-edit="text"
                    >
                      {item.name}
                    </h3>

                    {/* Accent line */}
                    {!isMinimal && (
                      <div
                        className="w-8 h-0.5"
                        style={{ backgroundColor: tokens.palette.accent }}
                      />
                    )}

                    <p
                      className="text-[0.9rem] leading-[1.8] font-light max-w-md"
                      style={{ color: mutedColor }}
                      data-pgl-path={`items.${i}.description`}
                      data-pgl-edit="text"
                    >
                      {item.description}
                    </p>

                    {item.price && (
                      <div
                        className="text-lg font-semibold tabular-nums"
                        style={{ color: tokens.palette.accent }}
                        data-pgl-path={`items.${i}.price`}
                        data-pgl-edit="text"
                      >
                        {item.price}
                      </div>
                    )}

                    {item.ctaLink && (
                      <PglButton
                        href={item.ctaLink}
                        variant="secondary"
                        tokens={tokens}
                        className="text-[0.82rem]"
                        data-pgl-path={`items.${i}.ctaText`}
                        data-pgl-edit="button"
                      >
                        {item.ctaText ?? "Saiba mais"}
                      </PglButton>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
