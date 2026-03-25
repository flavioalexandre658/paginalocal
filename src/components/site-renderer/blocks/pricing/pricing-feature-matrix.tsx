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

export function PricingFeatureMatrix({ content, tokens, isDark }: Props) {
  const parsed = PricingContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const style = tokens.style ?? "industrial";
  const isBold = style === "bold";

  // Collect all unique features across plans
  const allFeatures = Array.from(
    new Set(
      c.plans.flatMap((plan) =>
        plan.features.map((f) =>
          f.startsWith("~") && f.endsWith("~") ? f.slice(1, -1) : f,
        ),
      ),
    ),
  );

  // Build a lookup: for each plan, which features are included
  const planFeatureMap = c.plans.map((plan) => {
    const included = new Set<string>();
    const excluded = new Set<string>();
    for (const f of plan.features) {
      if (f.startsWith("~") && f.endsWith("~")) {
        excluded.add(f.slice(1, -1));
      } else {
        included.add(f);
      }
    }
    return { included, excluded };
  });

  return (
    <div className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 mb-10 md:mb-16 items-end">
          <StyledHeadline
            text={c.title}
            tokens={tokens}
            as="h2"
            className={cn(
              "pgl-fade-up text-3xl sm:text-4xl md:text-5xl leading-[1.05]",
              isDark ? "text-white" : undefined,
            )}
            data-pgl-path="title"
            data-pgl-edit="text"
          />
          {c.subtitle && (
            <p
              className="pgl-fade-up text-[0.95rem] leading-[1.8] font-light"
              style={{ color: isDark ? "rgba(255,255,255,0.5)" : tokens.palette.textMuted }}
              data-delay="1"
              data-pgl-path="subtitle"
              data-pgl-edit="text"
            >
              {c.subtitle}
            </p>
          )}
        </div>

        {/* Desktop: Feature matrix table */}
        <div className="pgl-fade-up hidden md:block overflow-x-auto" data-delay="2">
          <table className="w-full border-collapse">
            {/* Plan names header */}
            <thead>
              <tr>
                <th
                  className="text-left p-4 md:p-5"
                  style={{
                    borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : `${tokens.palette.text}0a`}`,
                  }}
                />
                {c.plans.map((plan, index) => (
                  <th
                    key={index}
                    className={cn(
                      "p-4 md:p-5 text-center relative",
                    )}
                    style={{
                      borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : `${tokens.palette.text}0a`}`,
                      ...(plan.highlighted
                        ? {
                            backgroundColor: `${tokens.palette.accent}08`,
                            boxShadow: `inset 0 2px 0 0 ${tokens.palette.accent}`,
                          }
                        : {}),
                    }}
                  >
                    {plan.highlighted && (
                      <span
                        className="absolute -top-3 left-1/2 -translate-x-1/2 text-[0.6rem] font-medium tracking-[0.08em] uppercase px-3 py-1 text-white whitespace-nowrap"
                        style={{
                          backgroundColor: tokens.palette.accent,
                          borderRadius: "var(--btn-radius)",
                        }}
                      >
                        Recomendado
                      </span>
                    )}
                    <p
                      className={cn(
                        "text-[0.7rem] font-medium uppercase tracking-[0.12em] mb-2",
                      )}
                      style={{ color: isDark ? "rgba(255,255,255,0.5)" : tokens.palette.textMuted }}
                      data-pgl-path={`plans.${index}.name`}
                      data-pgl-edit="text"
                    >
                      {plan.name}
                    </p>
                    <p
                      className={cn(
                        "font-semibold tabular-nums",
                        isBold ? "text-2xl font-extrabold" : "text-xl",
                      )}
                      style={{
                        fontFamily: "var(--pgl-font-heading)",
                        color: isDark ? "#fff" : tokens.palette.text,
                      }}
                      data-pgl-path={`plans.${index}.price`}
                      data-pgl-edit="text"
                    >
                      {plan.price}
                    </p>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Feature rows */}
            <tbody>
              {allFeatures.map((feature, fIndex) => (
                <tr key={fIndex}>
                  <td
                    className="p-4 md:p-5 text-[0.875rem] font-light"
                    style={{
                      color: isDark ? "rgba(255,255,255,0.7)" : tokens.palette.text,
                      borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : `${tokens.palette.text}06`}`,
                    }}
                  >
                    {feature}
                  </td>
                  {c.plans.map((plan, pIndex) => {
                    const hasFeature = planFeatureMap[pIndex].included.has(feature);
                    return (
                      <td
                        key={pIndex}
                        className="p-4 md:p-5 text-center"
                        style={{
                          borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : `${tokens.palette.text}06`}`,
                          ...(plan.highlighted
                            ? { backgroundColor: `${tokens.palette.accent}08` }
                            : {}),
                        }}
                      >
                        {hasFeature ? (
                          <Check
                            className="w-4 h-4 mx-auto"
                            style={{ color: tokens.palette.accent }}
                          />
                        ) : (
                          <X
                            className="w-4 h-4 mx-auto"
                            style={{
                              color: isDark
                                ? "rgba(255,255,255,0.15)"
                                : `${tokens.palette.textMuted}40`,
                            }}
                          />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>

            {/* CTA row */}
            <tfoot>
              <tr>
                <td className="p-4 md:p-5" />
                {c.plans.map((plan, index) => (
                  <td
                    key={index}
                    className="p-4 md:p-5 text-center"
                    style={{
                      ...(plan.highlighted
                        ? {
                            backgroundColor: `${tokens.palette.accent}08`,
                            borderRadius: "0 0 var(--card-radius) var(--card-radius)",
                          }
                        : {}),
                    }}
                  >
                    <PglButton
                      href={plan.ctaType === "whatsapp" ? "https://wa.me/" : "#"}
                      variant={plan.highlighted || isBold ? "primary" : "secondary"}
                      tokens={tokens}
                      isDark={isDark}
                      className="w-full justify-center"
                      data-pgl-path={`plans.${index}.ctaText`}
                      data-pgl-edit="button"
                    >
                      {plan.ctaText}
                    </PglButton>
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Mobile: Card view (one card per plan) */}
        <div className="md:hidden space-y-4">
          {c.plans.map((plan, index) => (
            <div
              key={index}
              className={cn(
                "pgl-fade-up relative flex flex-col p-6",
                plan.highlighted ? "ring-2" : "border",
              )}
              data-delay={String(Math.min(index + 1, 7))}
              style={{
                borderRadius: "var(--card-radius)",
                transition: `all var(--transition-speed, 0.4s)`,
                ...(plan.highlighted
                  ? {
                      boxShadow: `0 0 0 2px ${tokens.palette.accent}`,
                      backgroundColor: isDark ? tokens.palette.primary : "#fff",
                    }
                  : {
                      borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
                      backgroundColor: isDark ? tokens.palette.primary : "#fff",
                    }),
              }}
            >
              {/* Popular badge */}
              {plan.highlighted && (
                <span
                  className="absolute -top-3 left-1/2 -translate-x-1/2 text-[0.6rem] font-medium tracking-[0.08em] uppercase px-3 py-1 text-white whitespace-nowrap"
                  style={{
                    backgroundColor: tokens.palette.accent,
                    borderRadius: "var(--btn-radius)",
                  }}
                >
                  Recomendado
                </span>
              )}

              <div className="mb-5">
                <p
                  className="text-[0.7rem] font-medium uppercase tracking-[0.12em] mb-2"
                  style={{ color: isDark ? "rgba(255,255,255,0.5)" : tokens.palette.textMuted }}
                  data-pgl-path={`plans.${index}.name`}
                  data-pgl-edit="text"
                >
                  {plan.name}
                </p>
                <p
                  className={cn(
                    "font-semibold tabular-nums",
                    isBold ? "text-3xl font-extrabold" : "text-2xl",
                  )}
                  style={{
                    fontFamily: "var(--pgl-font-heading)",
                    color: isDark ? "#fff" : tokens.palette.text,
                  }}
                  data-pgl-path={`plans.${index}.price`}
                  data-pgl-edit="text"
                >
                  {plan.price}
                </p>
                {plan.description && (
                  <p
                    className="text-[0.8rem] font-light mt-1"
                    style={{ color: isDark ? "rgba(255,255,255,0.5)" : tokens.palette.textMuted }}
                    data-pgl-path={`plans.${index}.description`}
                    data-pgl-edit="text"
                  >
                    {plan.description}
                  </p>
                )}
              </div>

              {/* Separator */}
              <div
                className="h-px mb-5"
                style={{
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.08)"
                    : `${tokens.palette.text}0a`,
                }}
              />

              {/* Features list */}
              <ul className="space-y-3 mb-6 flex-1">
                {allFeatures.map((feature, fIndex) => {
                  const hasFeature = planFeatureMap[index].included.has(feature);
                  return (
                    <li key={fIndex} className="flex items-start gap-3">
                      {hasFeature ? (
                        <Check
                          className="w-4 h-4 shrink-0 mt-0.5"
                          style={{ color: tokens.palette.accent }}
                        />
                      ) : (
                        <X
                          className="w-4 h-4 shrink-0 mt-0.5"
                          style={{
                            color: isDark
                              ? "rgba(255,255,255,0.2)"
                              : `${tokens.palette.textMuted}40`,
                          }}
                        />
                      )}
                      <span
                        className={cn(
                          "text-[0.85rem] font-light",
                          !hasFeature && "line-through opacity-50",
                        )}
                        style={{
                          color: isDark ? "rgba(255,255,255,0.8)" : tokens.palette.text,
                        }}
                      >
                        {feature}
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
                isDark={isDark}
                className="w-full justify-center"
                data-pgl-path={`plans.${index}.ctaText`}
                data-pgl-edit="button"
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
