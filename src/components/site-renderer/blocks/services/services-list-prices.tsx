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

export function ServicesListPrices({ content, tokens }: Props) {
  const parsed = ServicesContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const style = tokens.style;
  const isMinimal = style === "minimal";
  const isElegant = style === "elegant";
  const isWarm = style === "warm";
  const isBold = style === "bold";

  /* Services are always on light bg */
  const textColor = tokens.palette.text;
  const mutedColor = tokens.palette.textMuted;

  return (
    <div className="relative overflow-hidden">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-10 md:mb-16 items-end">
          <StyledHeadline
            text={c.title}
            tokens={tokens}
            className="pgl-fade-up text-2xl md:text-3xl lg:text-5xl leading-[1.1]"
            accentClassName="normal-case"
            data-pgl-path="title"
            data-pgl-edit="text"
          />
          {c.subtitle && (
            <p
              className="pgl-fade-up text-base md:text-lg leading-[1.6] font-light"
              style={{ color: mutedColor }}
              data-delay="1"
              data-pgl-path="subtitle"
              data-pgl-edit="text"
            >
              {c.subtitle}
            </p>
          )}
        </div>

        {/* List items */}
        <div>
          {c.items.map((item, i) => (
            <div
              key={i}
              className={cn(
                "group pgl-fade-up flex flex-col sm:flex-row items-start justify-between gap-4 sm:gap-8 py-5 md:py-7",
                i < c.items.length - 1 && !isElegant && !isWarm && "border-b",
                isElegant && "p-4 md:p-6 mb-3 border",
                isWarm && "p-4 md:p-6 mb-3",
              )}
              style={{
                borderColor: isElegant
                  ? `${textColor}0f`
                  : `${textColor}0a`,
                ...(isWarm
                  ? { backgroundColor: `${tokens.palette.primary}06` }
                  : {}),
                borderRadius: isElegant
                  ? "var(--card-radius, 12px)"
                  : isWarm
                    ? "var(--card-radius, 8px)"
                    : undefined,
                transition: `all var(--transition-speed, 0.4s)`,
                animationDelay: `${(i + 1) * 0.1}s`,
              }}
              data-delay={i + 1}
            >
              <div className="min-w-0 flex-1">
                {/* Number + Title row */}
                <div className="flex items-center gap-4 mb-2">
                  {isMinimal ? (
                    <div
                      className="w-1 h-5 shrink-0"
                      style={{ backgroundColor: tokens.palette.accent }}
                    />
                  ) : (
                    <span
                      className="text-xs font-medium tracking-[0.1em] uppercase"
                      style={{ color: tokens.palette.accent }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  )}
                  <h3
                    className={cn(
                      "text-lg font-semibold tracking-[0.03em] group-hover:text-[--hover-c]",
                      (style === "industrial" || isBold) && "uppercase",
                      isBold && "!font-extrabold",
                    )}
                    style={
                      {
                        fontFamily: "var(--pgl-font-heading)",
                        color: textColor,
                        "--hover-c": tokens.palette.accent,
                        transition: `color var(--transition-speed, 0.4s)`,
                      } as React.CSSProperties
                    }
                    data-pgl-path={`items.${i}.name`}
                    data-pgl-edit="text"
                  >
                    {item.name}
                  </h3>
                </div>

                {/* Accent line */}
                {!isMinimal && (
                  <div
                    className="w-6 h-0.5 mb-3 ml-9"
                    style={{ backgroundColor: tokens.palette.accent }}
                  />
                )}

                <p
                  className={cn(
                    "text-sm leading-relaxed font-light",
                    !isMinimal && "ml-9",
                  )}
                  style={{ color: mutedColor }}
                  data-pgl-path={`items.${i}.description`}
                  data-pgl-edit="text"
                >
                  {item.description}
                </p>

                {item.ctaLink && (
                  <div className={cn("mt-2", !isMinimal && "ml-9")}>
                    <PglButton
                      href={item.ctaLink}
                      variant="secondary"
                      tokens={tokens}
                      className="text-sm opacity-0 group-hover:opacity-100"
                      data-pgl-path={`items.${i}.ctaText`}
                      data-pgl-edit="button"
                    >
                      {item.ctaText ?? "Saiba mais"}
                    </PglButton>
                  </div>
                )}
              </div>

              {item.price && (
                <span
                  className="text-xl font-semibold tabular-nums whitespace-nowrap shrink-0"
                  style={{
                    fontFamily: "var(--pgl-font-heading)",
                    color: tokens.palette.accent,
                  }}
                  data-pgl-path={`items.${i}.price`}
                  data-pgl-edit="text"
                >
                  {item.price}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
