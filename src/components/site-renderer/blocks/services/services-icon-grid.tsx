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

export function ServicesIconGrid({ content, tokens }: Props) {
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
      {/* Decorative background shape */}
      {!isMinimal && (
        <div
          className="hidden lg:block absolute -top-[200px] -right-[300px] w-[700px] h-[700px] rounded-full pointer-events-none"
          style={{ backgroundColor: tokens.palette.accent, opacity: 0.02 }}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header: 2-column */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-10 lg:gap-16 mb-10 md:mb-16 items-end">
          <StyledHeadline
            text={c.title}
            tokens={tokens}
            className="pgl-fade-up text-2xl md:text-3xl lg:text-5xl leading-[1.05]"
            accentClassName="normal-case"
          />
          {c.subtitle && (
            <p
              className="pgl-fade-up text-[0.95rem] leading-[1.8] font-light"
              style={{ color: mutedColor }}
              data-delay="1"
            >
              {c.subtitle}
            </p>
          )}
        </div>

        {/* Service grid */}
        {isMinimal ? (
          /* Minimal: simple divided list */
          <div>
            {c.items.map((item, i) => (
              <div
                key={i}
                className={cn(
                  "pgl-fade-up py-6 md:py-8",
                  i < c.items.length - 1 && "border-b",
                )}
                style={{
                  borderColor: `${textColor}0a`,
                }}
                data-delay={i + 1}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-1 h-8 shrink-0 mt-1"
                    style={{ backgroundColor: tokens.palette.accent }}
                  />
                  <div className="flex-1 min-w-0">
                    <h3
                      className="text-lg font-semibold tracking-[0.02em] mb-2"
                      style={{
                        fontFamily: "var(--pgl-font-heading)",
                        color: textColor,
                      }}
                    >
                      {item.name}
                    </h3>
                    <p
                      className="text-[0.875rem] leading-[1.75] font-light"
                      style={{ color: mutedColor }}
                    >
                      {item.description}
                    </p>
                    {item.price && (
                      <div
                        className="mt-3 text-lg font-semibold tabular-nums"
                        style={{ color: tokens.palette.accent }}
                      >
                        {item.price}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Grid layout for other styles */
          <div
            className={cn(
              "grid grid-cols-1 md:grid-cols-2 gap-px overflow-hidden",
              isElegant && "gap-4 md:gap-6",
            )}
            style={{
              backgroundColor: isElegant ? "transparent" : `${textColor}08`,
              borderRadius: "var(--card-radius, 4px)",
            }}
          >
            {c.items.map((item, i) => (
              <div
                key={i}
                className={cn(
                  "group p-6 md:p-8 lg:p-12 cursor-default pgl-fade-up",
                  !isElegant && "bg-[--pgl-surface,#fff] hover:bg-[--hover-bg]",
                  isElegant &&
                    "bg-[--pgl-surface,#fff] border hover:shadow-md",
                  isWarm && "rounded-lg",
                )}
                style={
                  {
                    "--hover-bg": isWarm
                      ? `${tokens.palette.primary}0d`
                      : tokens.palette.primary,
                    ...(isElegant
                      ? { borderColor: `${textColor}0f` }
                      : {}),
                    borderRadius: isElegant ? "var(--card-radius, 12px)" : undefined,
                    transition: `all var(--transition-speed, 0.4s)`,
                    animationDelay: `${(i + 1) * 0.1}s`,
                  } as React.CSSProperties
                }
                data-delay={i + 1}
              >
                {/* Number */}
                <div
                  className={cn(
                    "font-bold leading-none mb-5",
                    isBold ? "text-6xl md:text-7xl" : "text-4xl md:text-5xl",
                  )}
                  style={{
                    fontFamily: "var(--pgl-font-heading)",
                    color: isBold
                      ? `${tokens.palette.accent}25`
                      : `${textColor}12`,
                    transition: `color var(--transition-speed, 0.4s)`,
                  }}
                >
                  <span
                    className={cn(
                      !isElegant && !isWarm && "group-hover:!text-[--accent-c]",
                    )}
                    style={
                      { "--accent-c": tokens.palette.accent } as React.CSSProperties
                    }
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* Title */}
                <h3
                  className={cn(
                    "text-lg font-semibold tracking-[0.03em] mb-3",
                    (style === "industrial" || isBold) && "uppercase",
                    !isElegant && !isWarm && "group-hover:text-white",
                    isBold && "!font-extrabold",
                  )}
                  style={{
                    fontFamily: "var(--pgl-font-heading)",
                    color: textColor,
                    transition: `color var(--transition-speed, 0.4s)`,
                  }}
                >
                  {item.name}
                </h3>

                {/* Accent line */}
                <div
                  className="w-8 h-0.5 mb-4"
                  style={{
                    backgroundColor: tokens.palette.accent,
                    transition: `background-color var(--transition-speed, 0.4s)`,
                  }}
                />

                {/* Description */}
                <p
                  className={cn(
                    "text-[0.875rem] leading-[1.75] font-light",
                    !isElegant && !isWarm && "group-hover:text-white/70",
                  )}
                  style={{
                    color: mutedColor,
                    transition: `color var(--transition-speed, 0.4s)`,
                  }}
                >
                  {item.description}
                </p>

                {/* Price if available */}
                {item.price && (
                  <div
                    className={cn(
                      "mt-4 text-lg font-semibold tabular-nums",
                      !isElegant && !isWarm && "group-hover:text-white",
                    )}
                    style={{
                      color: tokens.palette.accent,
                      transition: `color var(--transition-speed, 0.4s)`,
                    }}
                  >
                    {item.price}
                  </div>
                )}

                {/* CTA */}
                {item.ctaLink && (
                  <div className="mt-5">
                    <PglButton
                      href={item.ctaLink}
                      variant="secondary"
                      tokens={tokens}
                      className="text-[0.8rem]"
                    >
                      {item.ctaText ?? "Saiba mais"}
                    </PglButton>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
