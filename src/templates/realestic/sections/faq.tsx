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
      <span key={i} style={{ color: accentColor }}>
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export function RealesticFaq({ content, tokens }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  const parsed = FaqContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const accent = tokens.palette.accent;
  const backgroundImage = (content.backgroundImage as string) || "";


  return (
    <section
      id="faq"
      style={{
        backgroundColor: "var(--pgl-background)",
        padding: "44px 0",
      }}
    >
      <div
        className="px-[25px]"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        {/* ═══ Section Header — Tag + H2 ═══ */}
        <ScrollReveal delay={0}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 18,
              marginBottom: 48,
            }}
          >
            {/* Dot + label row */}
            {c.subtitle && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 9,
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: accent,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                    fontSize: 17,
                    fontWeight: 500,
                    letterSpacing: "-0.03em",
                    lineHeight: "1em",
                    color: "var(--pgl-text)",
                  }}
                  data-pgl-path="subtitle"
                  data-pgl-edit="text"
                >
                  {c.subtitle}
                </span>
              </div>
            )}

            {/* H2 Title */}
            <h2
              style={{
                fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                fontSize: "clamp(32px, 4vw, 46px)",
                fontWeight: 500,
                letterSpacing: "-0.03em",
                lineHeight: "1.15em",
                color: "var(--pgl-text)",
                margin: 0,
                maxWidth: 600,
              }}
              data-pgl-path="title"
              data-pgl-edit="text"
            >
              {renderAccentText(c.title, accent)}
            </h2>
          </div>
        </ScrollReveal>

        {/* ═══ Grid: Accordion Left + Image Right ═══ */}
        <div
          className="grid grid-cols-1 md:grid-cols-2"
          style={{ gap: 38, alignItems: "start" }}
        >
          {/* ── Left Column — Accordion Items ── */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 0,
            }}
          >
            {c.items.map((item, idx) => {
              const isActive = activeIndex === idx;
              return (
                <ScrollReveal key={idx} delay={idx * 80}>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => setActiveIndex(idx)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setActiveIndex(idx);
                      }
                    }}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: 20,
                      cursor: "pointer",
                      opacity: isActive ? 1 : 0.6,
                      transition: "opacity 0.3s ease",
                      padding: "24px 0",
                    }}
                  >
                    {/* Left accent line */}
                    <div
                      style={{
                        width: isActive ? 3 : 2,
                        minHeight: "100%",
                        borderRadius: 1000,
                        backgroundColor: isActive
                          ? accent
                          : "var(--pgl-text-muted)",
                        flexShrink: 0,
                        transition:
                          "background-color 0.3s ease, width 0.3s ease",
                      }}
                    />

                    {/* Content */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 0,
                        flex: 1,
                        overflow: "hidden",
                      }}
                    >
                      {/* Title */}
                      <p
                        style={{
                          fontFamily:
                            "var(--pgl-font-heading), system-ui, sans-serif",
                          fontSize: 26,
                          fontWeight: 500,
                          letterSpacing: "-0.03em",
                          lineHeight: "1.55em",
                          color: "var(--pgl-text)",
                          margin: 0,
                        }}
                        data-pgl-path={`items.${idx}.question`}
                        data-pgl-edit="text"
                      >
                        {item.question}
                      </p>

                      {/* Answer — animated height */}
                      <div
                        style={{
                          display: "grid",
                          gridTemplateRows: isActive ? "1fr" : "0fr",
                          transition: "grid-template-rows 0.35s ease",
                        }}
                      >
                        <div style={{ overflow: "hidden" }}>
                          <p
                            style={{
                              fontFamily:
                                "var(--pgl-font-body), system-ui, sans-serif",
                              fontSize: 20,
                              fontWeight: 500,
                              letterSpacing: "-0.02em",
                              lineHeight: "1.5em",
                              color: "var(--pgl-text-muted)",
                              margin: 0,
                              paddingTop: 10,
                            }}
                            data-pgl-path={`items.${idx}.answer`}
                            data-pgl-edit="text"
                          >
                            {item.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>

          {/* ── Right Column — Image ── */}
          <ScrollReveal delay={100}>
            <div
              style={{
                width: "100%",
                aspectRatio: "4 / 3",
                borderRadius: 8,
                overflow: "hidden",
                backgroundColor: "var(--pgl-surface)",
              }}
              data-pgl-path="backgroundImage"
              data-pgl-edit="image"
            >
              {backgroundImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={backgroundImage}
                  alt=""
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--pgl-text-muted)"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ opacity: 0.4 }}
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </div>
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
