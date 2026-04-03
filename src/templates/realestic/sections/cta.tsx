"use client";

import type { DesignTokens } from "@/types/ai-generation";
import { CtaContentSchema } from "@/types/ai-generation";
import { ScrollReveal } from "./scroll-reveal";

interface Props {
  content: Record<string, unknown>;
  tokens: DesignTokens;
  isDark?: boolean;
}

function renderAccentText(text: string, accentColor: string) {
  return text.split(/\*([^*]+)\*/).map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} style={{ color: accentColor }}>
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export function RealesticCta({ content, tokens }: Props) {
  const parsed = CtaContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const accent = tokens.palette.accent;

  return (
    <section
      id="cta"
      style={{
        padding: "34px 0",
        backgroundColor: "var(--pgl-background)",
      }}
    >
      <div
        className="px-[25px]"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 50,
        }}
      >
        {/* ═══ CTA Card ═══ */}
        <ScrollReveal delay={0}>
          <div
            className="px-[25px] py-[60px] md:py-[94px]"
            style={{
              backgroundColor: accent,
              borderRadius: 34,
              display: "flex",
              flexDirection: "column",
              gap: 38,
              alignItems: "center",
            }}
          >
            {/* ═══ Content ═══ */}
            <div
              style={{
                maxWidth: 700,
                display: "flex",
                flexDirection: "column",
                gap: 22,
                alignItems: "center",
              }}
            >
              {/* Subtitle */}
              {c.subtitle && (
                <ScrollReveal delay={100}>
                  <p
                    style={{
                      fontFamily:
                        "var(--pgl-font-heading), system-ui, sans-serif",
                      fontSize: "clamp(18px, 2.5vw, 24px)",
                      fontWeight: 500,
                      letterSpacing: "-0.02em",
                      lineHeight: "1.5em",
                      color: "#fff",
                      margin: 0,
                      textAlign: "center",
                    }}
                    data-pgl-path="subtitle"
                    data-pgl-edit="text"
                  >
                    {c.subtitle}
                  </p>
                </ScrollReveal>
              )}

              {/* Title */}
              <ScrollReveal delay={200}>
                <h2
                  style={{
                    fontFamily:
                      "var(--pgl-font-heading), system-ui, sans-serif",
                    fontSize: "clamp(30px, 4.5vw, 50px)",
                    fontWeight: 500,
                    letterSpacing: "-0.03em",
                    lineHeight: "1.15em",
                    color: "#fff",
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

            {/* ═══ Button ═══ */}
            {c.ctaText && (
              <ScrollReveal delay={300}>
                <a
                  href={c.ctaLink || "#"}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    fontFamily:
                      "var(--pgl-font-heading), system-ui, sans-serif",
                    fontSize: 16,
                    fontWeight: 500,
                    letterSpacing: "-0.03em",
                    lineHeight: "1em",
                    color: "var(--pgl-text)",
                    backgroundColor: "#fff",
                    borderRadius: 1000,
                    padding: "14px 26px",
                    textDecoration: "none",
                    transition: "opacity 0.2s ease",
                  }}
                  data-pgl-path="ctaText"
                  data-pgl-edit="button"
                >
                  {c.ctaText}
                </a>
              </ScrollReveal>
            )}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
