"use client";

import { useCallback, useRef, useState, useEffect } from "react";
import type { DesignTokens } from "@/types/ai-generation";
import { ServicesContentSchema } from "@/types/ai-generation";
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

export function StratexTeam({ content, tokens }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const parsed = ServicesContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const accent = tokens.palette.accent;
  const total = c.items.length;

  const scrollToIndex = (index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(index, total - 1));
    const cardWidth = 300 + 20;
    el.scrollTo({ left: cardWidth * clamped, behavior: "smooth" });
    setActiveIndex(clamped);
  };

  return (
    <section
      id="team"
      style={{ backgroundColor: "var(--pgl-background)", padding: "80px 0" }}
    >
      <div className="px-[25px]" style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Header */}
        <ScrollReveal>
          <div style={{ display: "flex", flexDirection: "column", gap: 20, alignItems: "center", marginBottom: 48 }}>
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
                maxWidth: 600,
              }}
              data-pgl-path="title"
              data-pgl-edit="text"
            >
              {renderAccentText(c.title, accent)}
            </h2>
          </div>
        </ScrollReveal>

        {/* Team carousel */}
        <div style={{ position: "relative" }}>
          {/* Nav arrows */}
          {total > 3 && (
            <>
              <button
                onClick={() => scrollToIndex(activeIndex - 1)}
                aria-label="Previous"
                style={{
                  position: "absolute",
                  left: -16,
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 5,
                  width: 44,
                  height: 44,
                  borderRadius: 1000,
                  border: "1px solid rgba(0,0,0,0.1)",
                  backgroundColor: "#fff",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: activeIndex === 0 ? 0.3 : 1,
                  transition: "opacity 0.2s",
                }}
                className="hidden md:flex"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--pgl-text)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                onClick={() => scrollToIndex(activeIndex + 1)}
                aria-label="Next"
                style={{
                  position: "absolute",
                  right: -16,
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 5,
                  width: 44,
                  height: 44,
                  borderRadius: 1000,
                  border: "1px solid rgba(0,0,0,0.1)",
                  backgroundColor: "#fff",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: activeIndex >= total - 3 ? 0.3 : 1,
                  transition: "opacity 0.2s",
                }}
                className="hidden md:flex"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--pgl-text)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </>
          )}

          {/* Scrollable track */}
          <div
            ref={scrollRef}
            style={{
              display: "flex",
              gap: 20,
              overflowX: "auto",
              scrollSnapType: "x mandatory",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              padding: "0 0 24px 0",
            }}
            className="[&::-webkit-scrollbar]:hidden"
          >
            {c.items.map((item, idx) => (
              <div
                key={idx}
                style={{
                  flex: "0 0 300px",
                  scrollSnapAlign: "start",
                }}
              >
                <ScrollReveal delay={idx * 80}>
                  <div
                    style={{
                      borderRadius: 20,
                      overflow: "hidden",
                      position: "relative",
                      height: 380,
                    }}
                  >
                    {/* Photo */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: "inherit",
                      }}
                      data-pgl-path={`items.${idx}.image`}
                      data-pgl-edit="image"
                    >
                      {item.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            background: `linear-gradient(135deg, ${accent}22, var(--pgl-surface))`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <span
                            style={{
                              fontFamily: "var(--pgl-font-heading), Georgia, serif",
                              fontSize: 48,
                              fontWeight: 400,
                              color: accent,
                              opacity: 0.4,
                            }}
                          >
                            {item.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Gradient overlay + name/role */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: "48px 20px 20px",
                        background: "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.7) 100%)",
                      }}
                    >
                      <p
                        style={{
                          fontFamily: "var(--pgl-font-heading), Georgia, serif",
                          fontSize: 20,
                          fontWeight: 400,
                          color: "#fff",
                          margin: 0,
                          marginBottom: 4,
                        }}
                        data-pgl-path={`items.${idx}.name`}
                        data-pgl-edit="text"
                      >
                        {item.name}
                      </p>
                      <p
                        style={{
                          fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                          fontSize: 14,
                          fontWeight: 400,
                          color: "rgba(255,255,255,0.7)",
                          margin: 0,
                        }}
                        data-pgl-path={`items.${idx}.description`}
                        data-pgl-edit="text"
                      >
                        {item.description}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
