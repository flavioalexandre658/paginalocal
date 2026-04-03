"use client";

import type { DesignTokens } from "@/types/ai-generation";
import { PricingContentSchema } from "@/types/ai-generation";
import { ScrollReveal } from "./scroll-reveal";

interface Props {
  content: Record<string, unknown>;
  tokens: DesignTokens;
  isDark?: boolean;
}

function renderAccentText(text: string, accentColor: string) {
  return text.split(/\*([^*]+)\*/).map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} style={{ color: accentColor }}>{part}</span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export function StratexPricing({ content, tokens }: Props) {
  const parsed = PricingContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const accent = tokens.palette.accent;
  const subtitle = (content.subtitle as string) || "";

  return (
    <section
      id="pricing"
      style={{ backgroundColor: "var(--pgl-background)", padding: "80px 0" }}
    >
      <div className="px-[25px]" style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* ═══ Header ═══ */}
        <ScrollReveal>
          <div style={{ display: "flex", flexDirection: "column", gap: 20, alignItems: "center", marginBottom: 56 }}>
            {subtitle && (
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <div style={{ width: 8, height: 8, borderRadius: 1000, backgroundColor: accent, flexShrink: 0 }} />
                <span
                  style={{ fontFamily: "var(--pgl-font-heading), Georgia, serif", fontSize: 16, fontWeight: 400, color: accent }}
                  data-pgl-path="subtitle"
                  data-pgl-edit="text"
                >
                  {subtitle}
                </span>
              </div>
            )}
            <h2
              style={{
                fontFamily: "var(--pgl-font-heading), Georgia, serif",
                fontSize: "clamp(30px, 4vw, 48px)",
                fontWeight: 400,
                letterSpacing: "-0.02em",
                lineHeight: "1.15em",
                color: "var(--pgl-text)",
                margin: 0,
                textAlign: "center",
                maxWidth: 700,
              }}
              data-pgl-path="title"
              data-pgl-edit="text"
            >
              {renderAccentText(c.title, accent)}
            </h2>
          </div>
        </ScrollReveal>

        {/* ═══ Grid 2x — Pricing cards ═══ */}
        <div
          className="grid grid-cols-1 md:grid-cols-2"
          style={{ gap: 20, maxWidth: 960, margin: "0 auto" }}
          data-pgl-path="plans"
          data-pgl-edit="pricing"
        >
          {c.plans.map((plan, idx) => {
            const isHighlighted = plan.highlighted || idx === c.plans.length - 1;
            const rawPlans = (content.plans as Record<string, unknown>[]) || [];
            const rawPlan = rawPlans[idx] || {};
            const period = (rawPlan.period as string) || "/mes";

            return (
              <ScrollReveal key={idx} delay={idx * 100}>
                <div
                  style={{
                    borderRadius: 24,
                    border: "1px solid rgba(0,0,0,0.08)",
                    padding: "40px 36px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 0,
                    position: "relative",
                    overflow: "hidden",
                    backgroundColor: "var(--pgl-background)",
                  }}
                >
                  {/* Gradient Layer — decorative gradient in top corner */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      width: isHighlighted ? 300 : 200,
                      height: isHighlighted ? 300 : 200,
                      background: isHighlighted
                        ? `radial-gradient(circle at 100% 0%, ${accent}20 0%, ${accent}08 40%, transparent 70%)`
                        : `radial-gradient(circle at 100% 0%, rgba(0,0,0,0.02) 0%, transparent 60%)`,
                      pointerEvents: "none",
                    }}
                  />

                  {/* ── Text wrapper ── */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 16, position: "relative" }}>
                    {/* Heading row: name + Popular tag */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <h4
                        style={{
                          fontFamily: "var(--pgl-font-heading), Georgia, serif",
                          fontSize: 26,
                          fontWeight: 400,
                          letterSpacing: "-0.02em",
                          lineHeight: "1.3em",
                          color: "var(--pgl-text)",
                          margin: 0,
                        }}
                        data-pgl-path={`plans.${idx}.name`}
                        data-pgl-edit="text"
                      >
                        {plan.name}
                      </h4>

                      {/* Popular tag — only on highlighted plan */}
                      {isHighlighted && (
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "6px 14px",
                            borderRadius: 1000,
                            backgroundColor: accent,
                          }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                          <span
                            style={{
                              fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                              fontSize: 13,
                              fontWeight: 500,
                              color: "#fff",
                            }}
                          >
                            Popular
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    <p
                      style={{
                        fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                        fontSize: 15,
                        fontWeight: 400,
                        lineHeight: "1.55em",
                        color: "var(--pgl-text-muted)",
                        margin: 0,
                      }}
                      data-pgl-path={`plans.${idx}.description`}
                      data-pgl-edit="text"
                    >
                      {plan.description}
                    </p>

                    {/* Price row: $99 /Month */}
                    <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginTop: 8 }}>
                      <span
                        style={{
                          fontFamily: "var(--pgl-font-heading), Georgia, serif",
                          fontSize: "clamp(36px, 4vw, 48px)",
                          fontWeight: 400,
                          letterSpacing: "-0.02em",
                          lineHeight: "1.1em",
                          color: "var(--pgl-text)",
                        }}
                        data-pgl-path={`plans.${idx}.price`}
                        data-pgl-edit="text"
                      >
                        {plan.price}
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                          fontSize: 15,
                          fontWeight: 400,
                          color: "var(--pgl-text-muted)",
                        }}
                      >
                        {period}
                      </span>
                    </div>

                    {/* CTA Button — full width
                         Standard: outline (border, bg transparent, dark text)
                         Premium: filled (bg accent, white text, white border 15%)
                    */}
                    <a
                      href="#contato"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                        padding: "16px 24px",
                        borderRadius: 999,
                        fontFamily: "var(--pgl-font-heading), Georgia, serif",
                        fontSize: 16,
                        fontWeight: 400,
                        textDecoration: "none",
                        marginTop: 16,
                        transition: "opacity 0.2s",
                        ...(isHighlighted
                          ? {
                              backgroundColor: accent,
                              color: "#fff",
                              border: "1px solid rgba(255,255,255,0.15)",
                            }
                          : {
                              backgroundColor: "transparent",
                              color: "var(--pgl-text)",
                              border: "1px solid rgba(0,0,0,0.12)",
                            }),
                      }}
                      data-pgl-path={`plans.${idx}.ctaText`}
                      data-pgl-edit="button"
                    >
                      {plan.ctaText}
                    </a>
                  </div>

                  {/* ── Points / Features list ── */}
                  {plan.features && plan.features.length > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 32 }}>
                      {plan.features.map((feat, fi) => (
                        <div
                          key={fi}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                          }}
                        >
                          {/* Checkmark icon — accent fill */}
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill={accent}
                            style={{ flexShrink: 0 }}
                          >
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                          </svg>
                          <span
                            style={{
                              fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                              fontSize: 15,
                              fontWeight: 400,
                              lineHeight: "1.4em",
                              color: "var(--pgl-text-muted)",
                            }}
                            data-pgl-path={`plans.${idx}.features.${fi}`}
                            data-pgl-edit="text"
                          >
                            {feat}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
