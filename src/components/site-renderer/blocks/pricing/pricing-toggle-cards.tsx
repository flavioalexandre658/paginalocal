"use client";

import { useState } from "react";
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

export function PricingToggleCards({ content, tokens, isDark }: Props) {
  const parsed = PricingContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  return <PricingToggleCardsInner data={c} tokens={tokens} isDark={isDark} />;
}

function PricingToggleCardsInner({
  data: c,
  tokens,
  isDark,
}: {
  data: ReturnType<typeof PricingContentSchema.parse>;
  tokens: DesignTokens;
  isDark?: boolean;
}) {
  const [isAnnual, setIsAnnual] = useState(false);

  const style = tokens.style ?? "industrial";
  const isBold = style === "bold";
  const isElegant = style === "elegant";
  const isMinimal = style === "minimal";

  const hasAnnualPrices = c.plans.some((p) => p.priceAnnual);
  const colCount = Math.min(c.plans.length, 3);

  return (
    <div className="relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 mb-10 md:mb-16 items-end">
          <StyledHeadline
            text={c.title}
            tokens={tokens}
            as="h2"
            className={cn(
              "pgl-fade-up text-3xl sm:text-4xl md:text-5xl leading-[1.1]",
              isDark ? "text-white" : undefined,
            )}
            data-pgl-path="title"
            data-pgl-edit="text"
          />
          {c.subtitle && (
            <p
              className="pgl-fade-up text-base md:text-lg leading-[1.6] font-light"
              style={{ color: isDark ? "rgba(255,255,255,0.5)" : tokens.palette.textMuted }}
              data-delay="1"
              data-pgl-path="subtitle"
              data-pgl-edit="text"
            >
              {c.subtitle}
            </p>
          )}
        </div>

        <div data-pgl-path="plans" data-pgl-edit="pricing" className="pt-4">
        {hasAnnualPrices && (
          <div className="pgl-fade-up flex items-center justify-center gap-4 mb-10 md:mb-14" data-delay="2">
            <span
              className={cn(
                "text-sm font-medium transition-colors",
                !isAnnual ? "opacity-100" : "opacity-50",
              )}
              style={{
                color: isDark ? "#fff" : tokens.palette.text,
                transition: `opacity var(--transition-speed, 0.4s)`,
              }}
            >
              Mensal
            </span>
            <button
              type="button"
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative inline-flex h-7 w-[52px] shrink-0 cursor-pointer items-center rounded-full p-0.5"
              style={{
                backgroundColor: isAnnual ? tokens.palette.accent : isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)",
                transition: `background-color var(--transition-speed, 0.4s)`,
              }}
              aria-label="Alternar entre mensal e anual"
            >
              <span
                className="pointer-events-none block h-5 w-5 rounded-full bg-white shadow-md"
                style={{
                  transform: isAnnual ? "translateX(26px)" : "translateX(2px)",
                  transition: `transform var(--transition-speed, 0.4s)`,
                }}
              />
            </button>
            <span
              className={cn(
                "text-sm font-medium transition-colors",
                isAnnual ? "opacity-100" : "opacity-50",
              )}
              style={{
                color: isDark ? "#fff" : tokens.palette.text,
                transition: `opacity var(--transition-speed, 0.4s)`,
              }}
            >
              Anual
            </span>
          </div>
        )}

        <div
          className={cn(
            "grid grid-cols-1 gap-4 md:gap-6 items-start pt-6",
            colCount === 2 && "md:grid-cols-2",
            colCount >= 3 && "md:grid-cols-2 lg:grid-cols-3",
          )}
        >
          {c.plans.map((plan, index) => {
            const displayPrice = isAnnual && plan.priceAnnual ? plan.priceAnnual : plan.price;

            return (
              <div
                key={index}
                className={cn(
                  "pgl-fade-up relative flex flex-col p-6 md:p-8",
                  isMinimal
                    ? "bg-transparent"
                    : plan.highlighted
                      ? "ring-2"
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
                  transition: `all var(--transition-speed, 0.4s)`,
                  ...(isMinimal
                    ? { borderBottom: `1px solid ${tokens.palette.text}0a` }
                    : plan.highlighted
                      ? {
                          boxShadow: `0 0 0 2px ${tokens.palette.accent}`,
                          backgroundColor: isDark ? tokens.palette.primary : "#fff",
                        }
                      : {
                          backgroundColor: isDark ? tokens.palette.primary : undefined,
                        }),
                }}
              >
                {plan.highlighted && !isMinimal && (
                  <span
                    className="absolute -top-3 left-1/2 -translate-x-1/2 text-[0.7rem] font-medium tracking-[0.08em] uppercase px-4 py-1.5 text-white whitespace-nowrap"
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
                    style={{ color: isDark ? "rgba(255,255,255,0.5)" : tokens.palette.textMuted }}
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
                      color: isDark ? "#fff" : tokens.palette.text,
                    }}
                  >
                    {displayPrice}
                  </p>
                  {plan.description && (
                    <p
                      className="text-sm leading-relaxed font-light"
                      style={{ color: isDark ? "rgba(255,255,255,0.5)" : tokens.palette.textMuted }}
                    >
                      {plan.description}
                    </p>
                  )}
                </div>

                <div
                  className="h-px mb-6"
                  style={{
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.08)"
                      : `${tokens.palette.text}0a`,
                  }}
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
                            style={{ color: isDark ? "rgba(255,255,255,0.25)" : `${tokens.palette.textMuted}66` }}
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
                              ? isDark
                                ? "rgba(255,255,255,0.3)"
                                : `${tokens.palette.textMuted}80`
                              : isDark
                                ? "rgba(255,255,255,0.8)"
                                : tokens.palette.text,
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
                  isDark={isDark}
                  className="w-full justify-center"
                >
                  {plan.ctaText}
                </PglButton>
              </div>
            );
          })}
        </div>
        </div>
      </div>
    </div>
  );
}
