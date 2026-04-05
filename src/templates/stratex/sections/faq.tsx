"use client";

import { useState } from "react";
import type { DesignTokens } from "@/types/ai-generation";
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

export function StratexFaq({ content, tokens }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  // Tolerant parse: accept question/answer OR name/description
  const title = (content.title as string) || "";
  const subtitle = (content.subtitle as string) || "";
  const rawItems = (content.items as Record<string, unknown>[]) || [];
  const items = rawItems.map((item) => ({
    question: (item.question as string) || (item.name as string) || "",
    answer: (item.answer as string) || (item.description as string) || "",
  })).filter((item) => item.question);

  if (items.length === 0) return null;

  const c = { title, subtitle, items };
  const accent = tokens.palette.accent;

  return (
    <section
      id="faq"
      style={{ backgroundColor: "var(--pgl-background)", padding: "80px 0" }}
    >
      <div className="px-[25px]" style={{ maxWidth: 800, margin: "0 auto" }}>
        {/* Header */}
        <ScrollReveal>
          <div style={{ display: "flex", flexDirection: "column", gap: 20, alignItems: "center", marginBottom: 56 }}>
            {c.subtitle && (
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <div style={{ width: 8, height: 8, borderRadius: 1000, backgroundColor: accent, flexShrink: 0 }} />
                <span
                  style={{
                    fontFamily: "var(--pgl-font-heading), Georgia, serif",
                    fontSize: 16,
                    fontWeight: 400,
                    letterSpacing: "-0.03em",
                    lineHeight: "1em",
                    color: accent,
                  }}
                  data-pgl-path="subtitle"
                  data-pgl-edit="text"
                >
                  {c.subtitle}
                </span>
              </div>
            )}
            <h2
              style={{
                fontFamily: "var(--pgl-font-heading), Georgia, serif",
                fontSize: "clamp(28px, 4vw, 42px)",
                fontWeight: 400,
                letterSpacing: "-0.03em",
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
          </div>
        </ScrollReveal>

        {/* FAQ Items */}
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {c.items.map((item, idx) => {
            const isOpen = activeIndex === idx;
            return (
              <ScrollReveal key={idx} delay={idx * 80}>
                <button
                  type="button"
                  onClick={() => setActiveIndex(isOpen ? null : idx)}
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    padding: "24px 0",
                    borderBottom: "1px solid rgba(0,0,0,0.08)",
                    background: "none",
                    border: "none",
                    borderBottomWidth: 1,
                    borderBottomStyle: "solid",
                    borderBottomColor: "rgba(0,0,0,0.08)",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  {/* Question row */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 16,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--pgl-font-heading), Georgia, serif",
                        fontSize: 20,
                        fontWeight: 400,
                        letterSpacing: "-0.02em",
                        lineHeight: "1.4em",
                        color: "var(--pgl-text)",
                      }}
                      data-pgl-path={`items.${idx}.question`}
                      data-pgl-edit="text"
                    >
                      {item.question}
                    </span>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--pgl-text)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{
                        flexShrink: 0,
                        transition: "transform 0.3s ease",
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      }}
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </div>

                  {/* Answer — animated height */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateRows: isOpen ? "1fr" : "0fr",
                      transition: "grid-template-rows 0.3s ease",
                    }}
                  >
                    <div style={{ overflow: "hidden" }}>
                      <p
                        style={{
                          fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                          fontSize: 16,
                          fontWeight: 400,
                          lineHeight: "1.6em",
                          color: "var(--pgl-text-muted)",
                          margin: 0,
                          paddingTop: 16,
                          paddingRight: 40,
                        }}
                        data-pgl-path={`items.${idx}.answer`}
                        data-pgl-edit="text"
                      >
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </button>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
