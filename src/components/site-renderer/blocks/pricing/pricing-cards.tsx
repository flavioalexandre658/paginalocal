"use client";

import { cn } from "@/lib/utils";
import type { DesignTokens } from "@/types/ai-generation";
import { PricingContentSchema } from "@/types/ai-generation";
import { StyledHeadline } from "../../shared/styled-headline";
import { PglButton } from "../../shared/pgl-button";
import { Check, X } from "lucide-react";

interface Props {
  content: Record<string, unknown>;
  tokens: DesignTokens;
  isDark?: boolean;
}

export function PricingCards({ content, tokens }: Props) {
  const parsed = PricingContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const style = tokens.style ?? "industrial";
  const isIndustrial = style === "industrial";
  const isElegant = style === "elegant";
  const isWarm = style === "warm";
  const isBold = style === "bold";
  const isMinimal = style === "minimal";

  const colCount = Math.min(c.plans.length, 3);

  return (
    <div className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 mb-10 md:mb-16 items-end">
          <StyledHeadline
            text={c.title}
            tokens={tokens}
            as="h2"
            className="pgl-fade-up text-3xl sm:text-4xl md:text-5xl leading-[1.05]"
          />
          {c.subtitle && (
            <p
              className="pgl-fade-up text-[0.95rem] leading-[1.8] font-light"
              style={{ color: tokens.palette.textMuted }}
              data-delay="1"
            >
              {c.subtitle}
            </p>
          )}
        </div>

        {/* Cards */}
        <div
          className={cn(
            "grid grid-cols-1 gap-4 md:gap-6 items-start",
            colCount === 2 && "md:grid-cols-2",
            colCount >= 3 && "md:grid-cols-2 lg:grid-cols-3",
          )}
        >
          {c.plans.map((plan, index) => (
            <div
              key={index}
              className={cn(
                "pgl-fade-up relative flex flex-col p-6 md:p-8 transition-all duration-[400ms] overflow-visible",
                plan.highlighted && "mt-4",
                isMinimal
                  ? "bg-transparent"
                  : plan.highlighted
                    ? cn(
                        isIndustrial && "ring-2",
                        isElegant && "shadow-xl",
                      )
                    : cn(
                        "bg-white border",
                        isElegant
                          ? "border-black/[0.08] shadow-sm hover:shadow-md"
                          : "border-black/[0.06]",
                      ),
              )}
              data-delay={String(Math.min(index + 1, 7))}
              style={{
                borderRadius: isMinimal ? "0" : "var(--card-radius)",
                ...(isMinimal
                  ? {
                      borderBottom: `1px solid ${tokens.palette.text}0a`,
                    }
                  : plan.highlighted
                    ? {
                        ...(isIndustrial
                          ? {
                              boxShadow: `0 0 0 2px ${tokens.palette.accent}`,
                              backgroundColor: "#fff",
                            }
                          : isElegant
                            ? {
                                boxShadow: `0 8px 40px ${tokens.palette.accent}18`,
                                border: `1px solid ${tokens.palette.accent}30`,
                                backgroundColor: "#fff",
                              }
                            : isWarm
                              ? {
                                  border: `2px solid ${tokens.palette.accent}40`,
                                  backgroundColor: "#fff",
                                }
                              : isBold
                                ? {
                                    boxShadow: `0 0 0 2px ${tokens.palette.accent}`,
                                    backgroundColor: "#fff",
                                  }
                                : {
                                    boxShadow: `0 0 0 2px ${tokens.palette.accent}`,
                                    backgroundColor: "#fff",
                                  }),
                      }
                    : {}),
              }}
            >
              {/* Popular badge */}
              {plan.highlighted && !isMinimal && (
                <span
                  className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10 text-[0.65rem] font-medium tracking-[0.08em] uppercase px-4 py-1.5 text-white whitespace-nowrap shadow-sm"
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
                  className="text-[0.7rem] font-medium uppercase tracking-[0.12em] mb-3"
                  style={{ color: tokens.palette.textMuted }}
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
                    color: tokens.palette.text,
                  }}
                >
                  {plan.price}
                </p>
                {plan.description && (
                  <p
                    className="text-[0.875rem] font-light"
                    style={{ color: tokens.palette.textMuted }}
                  >
                    {plan.description}
                  </p>
                )}
              </div>

              {/* Separator */}
              <div
                className="h-px mb-6"
                style={{ backgroundColor: `${tokens.palette.text}0a` }}
              />

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature, fIndex) => {
                  const isExcluded = feature.startsWith("~") && feature.endsWith("~");
                  const featureText = isExcluded ? feature.slice(1, -1) : feature;

                  return (
                    <li key={fIndex} className="flex items-start gap-3">
                      {isExcluded ? (
                        <X
                          className="w-4 h-4 shrink-0 mt-0.5"
                          style={{ color: `${tokens.palette.textMuted}66` }}
                        />
                      ) : (
                        <Check
                          className="w-4 h-4 shrink-0 mt-0.5"
                          style={{ color: tokens.palette.accent }}
                        />
                      )}
                      <span
                        className={cn(
                          "text-[0.875rem] font-light",
                          isExcluded && "line-through",
                        )}
                        style={{
                          color: isExcluded
                            ? `${tokens.palette.textMuted}80`
                            : tokens.palette.text,
                        }}
                      >
                        {featureText}
                      </span>
                    </li>
                  );
                })}
              </ul>

              {/* CTA */}
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
