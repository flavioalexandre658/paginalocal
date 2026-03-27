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

export function PricingComparison({ content, tokens }: Props) {
  const parsed = PricingContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const style = tokens.style ?? "industrial";
  const isIndustrial = style === "industrial";
  const isElegant = style === "elegant";
  const isWarm = style === "warm";
  const isBold = style === "bold";
  const isMinimal = style === "minimal";

  const allFeatures = Array.from(
    new Set(c.plans.flatMap((p) => p.features.map((f) => f.replace(/^~|~$/g, ""))))
  );

  return (
    <div className="relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 mb-10 md:mb-16 items-end">
          <StyledHeadline
            text={c.title}
            tokens={tokens}
            as="h2"
            className="pgl-fade-up text-3xl sm:text-4xl md:text-5xl leading-[1.05]"
            data-pgl-path="title"
            data-pgl-edit="text"
          />
          {c.subtitle && (
            <p
              className="pgl-fade-up text-[0.95rem] leading-[1.8] font-light"
              style={{ color: tokens.palette.textMuted }}
              data-delay="1"
              data-pgl-path="subtitle"
              data-pgl-edit="text"
            >
              {c.subtitle}
            </p>
          )}
        </div>

        <div data-pgl-path="plans" data-pgl-edit="pricing" className="pt-4">
        <div
          className={cn(
            "pgl-fade-up hidden md:block overflow-x-auto",
            isElegant && "rounded-xl border shadow-sm",
            isMinimal && "border-t",
          )}
          data-delay="2"
          style={{
            ...(isElegant
              ? { borderColor: `${tokens.palette.text}14` }
              : isMinimal
                ? { borderColor: `${tokens.palette.text}0a` }
                : {}),
          }}
        >
          <table className="w-full border-collapse">
            <thead>
              <tr
                style={{ borderBottom: `1px solid ${tokens.palette.text}0a` }}
              >
                <th
                  className="text-left py-5 pr-6 text-[0.7rem] font-medium uppercase tracking-[0.1em] w-1/3"
                  style={{ color: tokens.palette.textMuted }}
                >
                  Recurso
                </th>
                {c.plans.map((plan, index) => (
                  <th
                    key={index}
                    className={cn(
                      "text-center px-4",
                      plan.highlighted ? "pt-2 pb-5" : "py-5",
                    )}
                    style={
                      plan.highlighted
                        ? { backgroundColor: `${tokens.palette.accent}08` }
                        : undefined
                    }
                  >
                    {plan.highlighted && (
                      <span
                        className="mb-2 inline-block text-[0.6rem] font-medium tracking-[0.08em] uppercase px-3 py-1 text-white whitespace-nowrap"
                        style={{
                          backgroundColor: tokens.palette.accent,
                          borderRadius: "var(--btn-radius)",
                        }}
                      >
                        Mais popular
                      </span>
                    )}
                    <div
                      className={cn(
                        "text-[0.85rem] font-semibold tracking-[0.03em]",
                        (isIndustrial || isBold) && "uppercase",
                      )}
                      style={{
                        fontFamily: "var(--pgl-font-heading)",
                        color: tokens.palette.text,
                      }}
                    >
                      {plan.name}
                    </div>
                    <div
                      className={cn(
                        "font-semibold tabular-nums mt-1",
                        isBold ? "text-[1.4rem] font-extrabold" : "text-[1.15rem]",
                      )}
                      style={{ color: tokens.palette.primary }}
                    >
                      {plan.price}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allFeatures.map((feature, fIndex) => (
                <tr
                  key={fIndex}
                  className="border-b transition-colors duration-[400ms] hover:bg-black/[0.01]"
                  style={{ borderColor: `${tokens.palette.text}08` }}
                >
                  <td
                    className="py-3.5 pr-6 text-[0.875rem] font-light"
                    style={{ color: tokens.palette.text }}
                  >
                    {feature}
                  </td>
                  {c.plans.map((plan, pIndex) => {
                    const hasFeature = plan.features.some(
                      (f) => f.replace(/^~|~$/g, "") === feature && !f.startsWith("~")
                    );
                    return (
                      <td
                        key={pIndex}
                        className="py-3.5 px-4 text-center"
                        style={
                          plan.highlighted
                            ? { backgroundColor: `${tokens.palette.accent}08` }
                            : undefined
                        }
                      >
                        {hasFeature ? (
                          <Check
                            className="w-4 h-4 mx-auto"
                            style={{ color: tokens.palette.accent }}
                          />
                        ) : (
                          <X
                            className="w-4 h-4 mx-auto"
                            style={{ color: `${tokens.palette.textMuted}4d` }}
                          />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}

              <tr>
                <td className="py-6 pr-6" />
                {c.plans.map((plan, index) => (
                  <td
                    key={index}
                    className="py-6 px-4 text-center"
                    style={
                      plan.highlighted
                        ? { backgroundColor: `${tokens.palette.accent}08` }
                        : undefined
                    }
                  >
                    <PglButton
                      href={plan.ctaType === "whatsapp" ? "https://wa.me/" : "#"}
                      variant={plan.highlighted || isBold ? "primary" : "secondary"}
                      tokens={tokens}
                    >
                      {plan.ctaText}
                    </PglButton>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <div className="md:hidden space-y-4">
          {c.plans.map((plan, index) => (
            <div
              key={index}
              className={cn(
                "pgl-fade-up relative p-6 transition-all duration-[400ms]",
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
                          ? "border-black/[0.08] shadow-sm"
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
                              : {
                                  boxShadow: `0 0 0 2px ${tokens.palette.accent}`,
                                  backgroundColor: "#fff",
                                }),
                      }
                    : {}),
              }}
            >
              {plan.highlighted && !isMinimal && (
                <span
                  className="absolute -top-3 left-1/2 -translate-x-1/2 text-[0.6rem] font-medium tracking-[0.08em] uppercase px-3 py-1 text-white whitespace-nowrap"
                  style={{
                    backgroundColor: tokens.palette.accent,
                    borderRadius: "var(--btn-radius)",
                  }}
                >
                  Mais popular
                </span>
              )}

              <div className="flex items-start justify-between mb-4">
                <div>
                  <p
                    className="text-[0.7rem] font-medium uppercase tracking-[0.12em]"
                    style={{ color: tokens.palette.textMuted }}
                  >
                    {plan.name}
                  </p>
                  <p
                    className={cn(
                      "font-semibold tabular-nums mt-1",
                      isBold ? "text-3xl font-extrabold" : "text-2xl",
                    )}
                    style={{ color: tokens.palette.primary }}
                  >
                    {plan.price}
                  </p>
                </div>
              </div>

              <ul className="space-y-2.5 mb-5">
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
    </div>
  );
}
