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

/* ── Check Icon — Phosphor bold checkmark (exact Framer SVG) ── */
function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 256 256" fill="none" style={{ flexShrink: 0 }}>
      <g>
        <path
          d="M232.49,80.49l-128,128a12,12,0,0,1-17,0l-56-56a12,12,0,1,1,17-17L96,183,215.51,63.51a12,12,0,0,1,17,17Z"
          fill="rgb(152,152,151)"
        />
      </g>
    </svg>
  );
}

export function FolioxaPricing({ content, tokens }: Props) {
  const parsed = PricingContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const accent = tokens.palette.accent;
  const primary = tokens.palette.primary;

  return (
    <section
      id="pricing"
      style={{ backgroundColor: "var(--pgl-background)", overflow: "hidden" }}
    >
      <div
        className="px-5 md:px-10 py-16 md:py-[100px]"
        style={{ maxWidth: 1310, margin: "0 auto" }}
      >
        {/* ═══ Header ═══ */}
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          gap: 16, marginBottom: 56,
        }}>
          {c.subtitle && (
            <ScrollReveal delay={0}>
              <div style={{
                display: "inline-flex", alignItems: "center",
                padding: "8px 16px",
                backgroundColor: "var(--pgl-surface, #f7f7f7)",
                border: "1px solid var(--pgl-border, #edeff3)",
                borderRadius: 8,
                backdropFilter: "blur(12px)",
              }}>
                <span style={{
                  fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                  fontSize: 16, fontWeight: 400, color: "var(--pgl-text)",
                }}
                  data-pgl-path="subtitle"
                  data-pgl-edit="text"
                >
                  {c.subtitle}
                </span>
              </div>
            </ScrollReveal>
          )}
          <ScrollReveal delay={50}>
            <h2 style={{
              fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
              fontSize: "clamp(28px, 3.5vw, 40px)",
              fontWeight: 500,
              lineHeight: "1.2em",
              color: "var(--pgl-text)",
              margin: 0,
              textAlign: "center",
            }}
              data-pgl-path="title"
              data-pgl-edit="text"
            >
              {renderAccentText(c.title, accent)}
            </h2>
          </ScrollReveal>
        </div>

        {/* ═══ Pricing Cards — 3-column grid ═══ */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          style={{ gap: 20 }}
          data-pgl-path="plans"
          data-pgl-edit="pricing"
        >
          {c.plans.map((plan, idx) => {
            const isDark = plan.highlighted;

            return (
              <ScrollReveal key={idx} delay={100 + idx * 100}>
                {/* ══ OUTER WRAPPER — double-layer card ══ */}
                <div style={{
                  backgroundColor: isDark ? primary : "#fff",
                  borderRadius: 20,
                  boxShadow: "rgba(0,0,0,0.05) 0px 0px 14px 0px",
                  padding: 4,
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  height: "100%",
                }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 16px 48px rgba(0,0,0,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "rgba(0,0,0,0.05) 0px 0px 14px 0px";
                  }}
                >
                  {/* ══ INNER CONTAINER ══ */}
                  <div style={{
                    background: isDark
                      ? `linear-gradient(180deg, ${primary} 0%, var(--pgl-text, #111) 46%)`
                      : "linear-gradient(180deg, #fff 52%, var(--pgl-surface, #fafaf7) 100%)",
                    borderRadius: 16,
                    border: isDark
                      ? "1px solid rgba(255,255,255,0.08)"
                      : "1px solid var(--pgl-border, #edeff3)",
                    padding: "28px 24px",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                  }}>
                    {/* ── Price Info ── */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      {/* Plan name */}
                      <p style={{
                        fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                        fontSize: 15, fontWeight: 500,
                        color: isDark ? "#fff" : "var(--pgl-text)",
                        margin: 0,
                      }}
                        data-pgl-path={`plans.${idx}.name`}
                        data-pgl-edit="text"
                      >
                        {plan.name}
                      </p>

                      {/* Price + description */}
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        <h2 style={{
                          fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                          fontSize: "clamp(36px, 5vw, 48px)",
                          fontWeight: 500,
                          letterSpacing: "-2px",
                          lineHeight: "1em",
                          color: isDark ? "#fff" : "var(--pgl-text)",
                          margin: 0,
                        }}
                          data-pgl-path={`plans.${idx}.price`}
                          data-pgl-edit="text"
                        >
                          {plan.price}
                        </h2>
                        <p style={{
                          fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                          fontSize: 15, fontWeight: 400,
                          lineHeight: "1.5em",
                          color: isDark ? "#fff" : "var(--pgl-text-muted)",
                          margin: 0,
                        }}
                          data-pgl-path={`plans.${idx}.description`}
                          data-pgl-edit="text"
                        >
                          {plan.description}
                        </p>
                      </div>

                      {/* ── CTA Button ── */}
                      {isDark ? (
                        /* Dark card → White button with outline, dark text */
                        <a
                          href="#contato"
                          data-pgl-path={`plans.${idx}.ctaText`}
                          data-pgl-edit="button"
                          style={{
                            display: "inline-flex", alignItems: "center",
                            gap: 4, height: 48, padding: 6,
                            backgroundColor: "#fff",
                            border: "1px solid var(--pgl-border, #edeff3)",
                            borderRadius: 10,
                            boxShadow: "none",
                            textDecoration: "none",
                            transition: "opacity 0.2s",
                            width: "fit-content",
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.9"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
                        >
                          <div style={{ padding: "4px 12px", display: "flex", alignItems: "center" }}>
                            <span style={{
                              fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                              fontSize: 15, fontWeight: 500,
                              color: "rgb(50,55,69)",
                            }}>
                              {plan.ctaText}
                            </span>
                          </div>
                          <div style={{
                            width: 32, height: 32, borderRadius: 8,
                            backgroundColor: "var(--pgl-surface, #f7f7f7)",
                            border: "1px solid var(--pgl-border, #edeff3)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                              <path d="M5 12h14m-6 6l6-6m-6-6l6 6" stroke="var(--pgl-text, #212121)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                        </a>
                      ) : (
                        /* White card → Black solid button, white text */
                        <a
                          href="#contato"
                          data-pgl-path={`plans.${idx}.ctaText`}
                          data-pgl-edit="button"
                          style={{
                            display: "inline-flex", alignItems: "center",
                            gap: 4, height: 48, padding: 6,
                            backgroundColor: primary,
                            border: "none",
                            borderRadius: 10,
                            boxShadow: "0px 1px 2px rgba(23,24,28,0.24), 0px 6px 12px -8px rgba(23,24,28,0.7), 0px 12px 32px -8px rgba(23,24,28,0.4)",
                            textDecoration: "none",
                            transition: "opacity 0.2s",
                            width: "fit-content",
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.9"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
                        >
                          <div style={{ padding: "4px 12px", display: "flex", alignItems: "center" }}>
                            <span style={{
                              fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                              fontSize: 15, fontWeight: 500,
                              color: "#fff",
                            }}>
                              {plan.ctaText}
                            </span>
                          </div>
                          <div style={{
                            width: 32, height: 32, borderRadius: 8,
                            backgroundColor: "var(--pgl-text, #212121)",
                            border: "1px solid var(--pgl-text-muted, #666)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                              <path d="M5 12h14m-6 6l6-6m-6-6l6 6" stroke="#fff" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                        </a>
                      )}
                    </div>

                    {/* ── Divider ── */}
                    <div style={{
                      width: "100%", height: 1,
                      backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "var(--pgl-border, #edeff3)",
                      margin: "20px 0",
                    }} />

                    {/* ── Features list ── */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      <p style={{
                        fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                        fontSize: 16, fontWeight: 400,
                        color: isDark ? "#fff" : "var(--pgl-text)",
                        margin: "0 0 8px",
                      }}>
                        Recursos inclusos:
                      </p>
                      {plan.features.map((feature, fIdx) => (
                        <div key={fIdx} style={{
                          display: "flex", alignItems: "center", gap: 10,
                          padding: "5px 0",
                        }}>
                          <CheckIcon />
                          <span style={{
                            fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                            fontSize: 15, fontWeight: 400,
                            lineHeight: "1.5em",
                            color: isDark ? "#fff" : "var(--pgl-text, #111)",
                          }}>
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
