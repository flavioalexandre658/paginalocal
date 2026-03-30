"use client";

import { cn } from "@/lib/utils";
import type { DesignTokens } from "@/types/ai-generation";
import { PricingContentSchema } from "@/types/ai-generation";
import { StyledHeadline } from "../../shared/styled-headline";
import { PglButton } from "../../shared/pgl-button";
import { Check, X } from "lucide-react";
import { isLightColor } from "@/lib/color-contrast";

interface Props {
  content: Record<string, unknown>;
  tokens: DesignTokens;
  isDark?: boolean;
}

export function PricingCards({ content, tokens, isDark }: Props) {
  const parsed = PricingContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const style = tokens.style ?? "industrial";
  const isIndustrial = style === "industrial";
  const isElegant = style === "elegant";
  const isWarm = style === "warm";
  const isBold = style === "bold";
  const isMinimal = style === "minimal";

  const pageBgDark = !isLightColor(tokens.palette.background);
  const onDark = isDark || pageBgDark;
  const textColor = onDark ? "#ffffff" : tokens.palette.text;
  const mutedColor = onDark ? "rgba(255,255,255,0.55)" : tokens.palette.textMuted;
  const dividerColor = onDark ? "rgba(255,255,255,0.08)" : `${tokens.palette.text}0a`;

  const colCount = Math.min(c.plans.length, 3);

  return (
    <div className="relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 mb-10 md:mb-16 items-end">
          <StyledHeadline
            text={c.title}
            tokens={tokens}
            as="h2"
            className="pgl-fade-up text-3xl sm:text-4xl md:text-5xl leading-[1.1]"
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

        <div
          className={cn(
            "grid grid-cols-1 gap-4 md:gap-6 items-start pt-8",
            colCount === 2 && "md:grid-cols-2",
            colCount >= 3 && "md:grid-cols-2 lg:grid-cols-3",
          )}
          data-pgl-path="plans"
          data-pgl-edit="pricing"
        >
          {c.plans.map((plan, index) => (
            <div
              key={index}
              className={cn(
                "pgl-fade-up relative flex flex-col p-6 md:p-8 transition-all duration-[400ms] overflow-visible",
                isMinimal
                  ? "bg-transparent"
                  : plan.highlighted
                    ? cn(
                        isIndustrial && "ring-2",
                        isElegant && "shadow-xl",
                      )
                    : cn(
                        "border",
                        !onDark && "hover:shadow-md",
                      ),
              )}
              data-delay={String(Math.min(index + 1, 7))}
              style={{
                borderRadius: isMinimal ? "0" : "var(--card-radius)",
                ...(isMinimal
                  ? { borderBottom: `1px solid ${dividerColor}` }
                  : plan.highlighted
                    ? {
                        boxShadow: isElegant
                          ? `0 8px 40px ${tokens.palette.accent}18`
                          : `0 0 0 2px ${tokens.palette.accent}`,
                        border: isElegant ? `1px solid ${tokens.palette.accent}30` : isWarm ? `2px solid ${tokens.palette.accent}40` : undefined,
                        backgroundColor: onDark ? "rgba(255,255,255,0.08)" : "#ffffff",
                      }
                    : {
                        backgroundColor: onDark ? "rgba(255,255,255,0.05)" : "#ffffff",
                        borderColor: onDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)",
                      }),
              }}
            >
              {plan.highlighted && !isMinimal && (
                <span
                  className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10 text-[0.7rem] font-medium tracking-[0.08em] uppercase px-4 py-1.5 text-white whitespace-nowrap shadow-sm"
                  style={{
                    backgroundColor: tokens.palette.accent,
                    borderRadius: "var(--btn-radius)",
                  }}
                >
                  Mais popular
                </span>
              )}

              <div className="mb-6">
                <p
                  className="text-[0.7rem] font-medium uppercase tracking-[0.1em] mb-3"
                  style={{ color: mutedColor }}
                >
                  {plan.name}
                </p>
                <p
                  className={cn(
                    "font-semibold tabular-nums mb-1",
                    isBold
                      ? "text-4xl md:text-5xl font-extrabold"
                      : "text-3xl md:text-4xl",
                  )}
                  style={{
                    fontFamily: "var(--pgl-font-heading)",
                    color: textColor,
                  }}
                >
                  {plan.price}
                </p>
                {plan.description && (
                  <p
                    className="text-sm leading-relaxed font-light"
                    style={{ color: mutedColor }}
                  >
                    {plan.description}
                  </p>
                )}
              </div>

              <div
                className="h-px mb-6"
                style={{ backgroundColor: dividerColor }}
              />

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature, fIndex) => {
                  const isExcluded = feature.startsWith("~") && feature.endsWith("~");
                  const featureText = isExcluded ? feature.slice(1, -1) : feature;

                  return (
                    <li key={fIndex} className="flex items-start gap-3">
                      {isExcluded ? (
                        <X
                          className="w-4 h-4 shrink-0 mt-0.5"
                          style={{ color: onDark ? "rgba(255,255,255,0.3)" : `${tokens.palette.textMuted}66` }}
                        />
                      ) : (
                        <Check
                          className="w-4 h-4 shrink-0 mt-0.5"
                          style={{ color: tokens.palette.accent }}
                        />
                      )}
                      <span
                        className={cn(
                          "text-sm leading-relaxed font-light",
                          isExcluded && "line-through",
                        )}
                        style={{
                          color: isExcluded
                            ? (onDark ? "rgba(255,255,255,0.35)" : `${tokens.palette.textMuted}80`)
                            : textColor,
                        }}
                      >
                        {featureText}
                      </span>
                    </li>
                  );
                })}
              </ul>

              <PglButton
                href={plan.ctaType === "whatsapp" ? "https://wa.me/" : "#"}
                variant={plan.highlighted || isBold ? "primary" : "secondary"}
                tokens={tokens}
                className="w-full justify-center"
              >
                {plan.ctaText}
              </PglButton>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
