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

export function PricingSimpleList({ content, tokens }: Props) {
  const parsed = PricingContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const style = tokens.style ?? "industrial";
  const isIndustrial = style === "industrial";
  const isElegant = style === "elegant";
  const isBold = style === "bold";

  return (
    <div className="relative overflow-hidden">
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
              style={{ color: tokens.palette.textMuted }}
              data-delay="1"
              data-pgl-path="subtitle"
              data-pgl-edit="text"
            >
              {c.subtitle}
            </p>
          )}
        </div>

        <div
          className="divide-y pt-4"
          style={{ borderColor: `${tokens.palette.text}0a` }}
          data-pgl-path="plans"
          data-pgl-edit="pricing"
        >
          {c.plans.map((plan, index) => (
            <div
              key={index}
              className={cn(
                "pgl-fade-up flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 md:gap-6 py-6 md:py-7",
                plan.highlighted && "relative pl-5",
                isElegant && plan.highlighted && "bg-black/[0.01] rounded-lg px-5",
              )}
              data-delay={String(Math.min(index + 1, 7))}
              style={{
                borderColor: `${tokens.palette.text}0a`,
              }}
            >
              {plan.highlighted && (
                <div
                  className="absolute left-0 top-4 bottom-4 w-[3px]"
                  style={{
                    backgroundColor: tokens.palette.accent,
                    borderRadius: isElegant ? "9999px" : "0",
                  }}
                />
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <p
                    className={cn(
                      "text-[1.05rem] font-semibold tracking-[0.03em]",
                      (isIndustrial || isBold) && "uppercase",
                      isBold && "text-[1.15rem] !font-extrabold",
                    )}
                    style={{
                      fontFamily: "var(--pgl-font-heading)",
                      color: tokens.palette.text,
                    }}
                  >
                    {plan.name}
                  </p>
                  {plan.highlighted && (
                    <span
                      className="text-[0.7rem] font-medium tracking-[0.08em] uppercase px-2.5 py-1 text-white"
                      style={{
                        backgroundColor: tokens.palette.accent,
                        borderRadius: "var(--btn-radius)",
                      }}
                    >
                      Popular
                    </span>
                  )}
                </div>
                {plan.description && (
                  <p
                    className="text-sm leading-relaxed font-light mt-1"
                    style={{ color: tokens.palette.textMuted }}
                  >
                    {plan.description}
                  </p>
                )}
                {plan.features.length > 0 && (
                  <div className="flex flex-wrap gap-3 mt-3">
                    {plan.features.map((feature, fIndex) => {
                      const isExcluded = feature.startsWith("~") && feature.endsWith("~");
                      const featureText = isExcluded ? feature.slice(1, -1) : feature;
                      return (
                        <span
                          key={fIndex}
                          className={cn(
                            "inline-flex items-center gap-1.5 text-sm font-light",
                            isExcluded && "line-through",
                          )}
                          style={{
                            color: isExcluded
                              ? `${tokens.palette.textMuted}80`
                              : tokens.palette.textMuted,
                          }}
                        >
                          {isExcluded ? (
                            <X
                              className="w-3 h-3 shrink-0"
                              style={{ color: `${tokens.palette.textMuted}4d` }}
                            />
                          ) : (
                            <Check className="w-3 h-3 shrink-0" style={{ color: tokens.palette.accent }} />
                          )}
                          {featureText}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 md:gap-5 shrink-0 w-full sm:w-auto">
                <span
                  className={cn(
                    "font-semibold tabular-nums",
                    isBold ? "text-3xl font-extrabold" : "text-2xl",
                  )}
                  style={{ color: tokens.palette.primary }}
                >
                  {plan.price}
                </span>
                <PglButton
                  href={plan.ctaType === "whatsapp" ? "https://wa.me/" : "#"}
                  variant={plan.highlighted || isBold ? "primary" : "secondary"}
                  tokens={tokens}
                  className={cn(isBold && "flex-1 sm:flex-none text-center")}
                >
                  {plan.ctaText}
                </PglButton>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
