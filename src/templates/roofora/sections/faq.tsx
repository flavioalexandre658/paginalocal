"use client";

import { useState } from "react";
import type { DesignTokens } from "@/types/ai-generation";
import { FaqContentSchema } from "@/types/ai-generation";
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

export function RooforaFaq({ content, tokens }: Props) {
  const parsed = FaqContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const accent = tokens.palette.accent || "#CDF660";
  const primary = tokens.palette.primary || "#0E1201";
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => {
    setOpenIndex((prev) => (prev === i ? null : i));
  };

  return (
    <section
      id="faq"
      style={{
        backgroundColor: "var(--pgl-background, #fff)",
        fontFamily: "var(--pgl-font-body, 'Urbanist'), system-ui, sans-serif",
      }}
    >
      <div
        className="mx-auto max-w-[1200px] px-5 md:px-10 py-16 md:py-24"
        style={{ display: "flex", flexDirection: "column", gap: 48 }}
      >
        {/* ═══ Cabecalho ═══ */}
        <div style={{ maxWidth: 600 }}>
          {c.subtitle && (
            <ScrollReveal delay={0}>
              <p
                data-pgl-path="subtitle"
                data-pgl-edit="text"
                style={{
                  fontFamily: "var(--pgl-font-body, 'Urbanist'), system-ui, sans-serif",
                  fontSize: 16,
                  fontWeight: 500,
                  lineHeight: "1.6em",
                  color: "var(--pgl-text)",
                  margin: 0,
                  marginBottom: 12,
                  opacity: 0.6,
                }}
              >
                {c.subtitle}
              </p>
            </ScrollReveal>
          )}
          <ScrollReveal delay={100}>
            <h2
              data-pgl-path="title"
              data-pgl-edit="text"
              style={{
                fontFamily: "var(--pgl-font-heading, 'Urbanist'), system-ui, sans-serif",
                fontSize: "clamp(28px, 4vw, 44px)",
                fontWeight: 700,
                letterSpacing: "-1px",
                lineHeight: "1.15em",
                color: "var(--pgl-text)",
                margin: 0,
              }}
            >
              {renderAccentText(c.title, accent)}
            </h2>
          </ScrollReveal>
        </div>

        {/* ═══ Accordion ═══ */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {c.items.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <ScrollReveal key={i} delay={150 + i * 80}>
                <div
                  data-pgl-path={`items.${i}`}
                  data-pgl-edit="text"
                  style={{
                    borderBottom: "1px solid var(--pgl-border, rgba(14,18,1,0.1))",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => toggle(i)}
                    aria-expanded={isOpen}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                      padding: "24px 0",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      gap: 16,
                      textAlign: "left",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--pgl-font-heading, 'Urbanist'), system-ui, sans-serif",
                        fontSize: "clamp(16px, 2vw, 20px)",
                        fontWeight: 600,
                        color: "var(--pgl-text)",
                        lineHeight: "1.4em",
                      }}
                    >
                      {item.question}
                    </span>

                    {/* Plus/X icon */}
                    <div
                      style={{
                        flexShrink: 0,
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        border: "2px solid var(--pgl-text)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "transform 0.3s ease, background-color 0.3s ease",
                        transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                        backgroundColor: isOpen ? accent : "transparent",
                        borderColor: isOpen ? accent : "var(--pgl-text)",
                      }}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        style={{ display: "block" }}
                      >
                        <line
                          x1="7" y1="0" x2="7" y2="14"
                          stroke={isOpen ? primary : "var(--pgl-text)"}
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        <line
                          x1="0" y1="7" x2="14" y2="7"
                          stroke={isOpen ? primary : "var(--pgl-text)"}
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </button>

                  {/* Resposta */}
                  <div
                    style={{
                      overflow: "hidden",
                      maxHeight: isOpen ? 400 : 0,
                      opacity: isOpen ? 1 : 0,
                      transition: "max-height 0.4s ease, opacity 0.3s ease",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "var(--pgl-font-body, 'Urbanist'), system-ui, sans-serif",
                        fontSize: 16,
                        fontWeight: 400,
                        lineHeight: "1.7em",
                        color: "var(--pgl-text-muted, rgba(0,0,0,0.6))",
                        margin: 0,
                        paddingBottom: 24,
                        maxWidth: 680,
                      }}
                    >
                      {item.answer}
                    </p>
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
