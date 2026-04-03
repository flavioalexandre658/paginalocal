"use client";

import { useRef, useState, useCallback } from "react";
import type { DesignTokens } from "@/types/ai-generation";
import { CatalogContentSchema } from "@/types/ai-generation";
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

export function BellezzaCatalog({ content, tokens }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  const scroll = useCallback((direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = 260;
    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
    setTimeout(updateScrollState, 350);
  }, [updateScrollState]);

  const parsed = CatalogContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const accent = tokens.palette.accent;
  const primary = tokens.palette.primary;

  return (
    <section
      id="categories"
      style={{
        backgroundColor: "var(--pgl-surface, #fff)",
        overflow: "hidden",
      }}
    >
      <div
        className="flex flex-col px-6 py-12 md:px-[56px] md:py-[80px]"
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          gap: 48,
          alignItems: "center",
        }}
      >
        {/* Section header */}
        <ScrollReveal delay={0}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
              textAlign: "center",
            }}
          >
            {/* H2 — Playfair Display, uppercase, centered */}
            <h2
              style={{
                fontFamily: "var(--pgl-font-heading), serif",
                fontSize: "clamp(36px, 3.5vw, 52px)",
                fontWeight: 500,
                letterSpacing: "0em",
                lineHeight: "1.2em",
                color: "var(--pgl-text)",
                margin: 0,
                textTransform: "uppercase",
              }}
              data-pgl-path="title"
              data-pgl-edit="text"
            >
              {renderAccentText(c.title, accent)}
            </h2>
            {c.subtitle && (
              <p
                style={{
                  fontFamily: "var(--pgl-font-body), sans-serif",
                  fontSize: 16,
                  fontWeight: 400,
                  lineHeight: "1.5em",
                  color: "var(--pgl-text-muted)",
                  margin: 0,
                  maxWidth: 520,
                }}
                data-pgl-path="subtitle"
                data-pgl-edit="text"
              >
                {c.subtitle}
              </p>
            )}
          </div>
        </ScrollReveal>

        {/* Scrollable categories row with nav arrows */}
        <div style={{ position: "relative", width: "100%" }}>
          {/* Left arrow */}
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              aria-label="Anterior"
              className="hidden md:flex"
              style={{
                position: "absolute",
                left: -20,
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 3,
                width: 44,
                height: 44,
                borderRadius: "50%",
                border: "1px solid rgba(0,0,0,0.08)",
                backgroundColor: "var(--pgl-surface, #fff)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-50%) scale(1.05)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(-50%) scale(1)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
              }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M11 4L6 9l5 5" stroke="var(--pgl-text)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}

          {/* Right arrow */}
          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              aria-label="Proximo"
              className="hidden md:flex"
              style={{
                position: "absolute",
                right: -20,
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 3,
                width: 44,
                height: 44,
                borderRadius: "50%",
                border: "1px solid rgba(0,0,0,0.08)",
                backgroundColor: "var(--pgl-surface, #fff)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-50%) scale(1.05)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(-50%) scale(1)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
              }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M7 4l5 5-5 5" stroke="var(--pgl-text)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}

          {/* Scrollable row */}
          <div
            ref={scrollRef}
            onScroll={updateScrollState}
            className="flex flex-row gap-4 md:gap-5 overflow-x-auto"
            style={{
              scrollSnapType: "x mandatory",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              paddingBottom: 4,
              justifyContent: c.categories.length <= 4 ? "center" : "flex-start",
            }}
          >
            {c.categories.map((cat, idx) => (
              <ScrollReveal key={idx} delay={100 + idx * 80}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 16,
                    width: 224,
                    flexShrink: 0,
                    scrollSnapAlign: "start",
                    cursor: "pointer",
                    transition: "transform 0.3s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  {/* Category image — square with very rounded corners */}
                  <div
                    style={{
                      width: "100%",
                      aspectRatio: "0.996",
                      borderRadius: 60,
                      overflow: "hidden",
                      position: "relative",
                    }}
                    data-pgl-path={`categories.${idx}.image`}
                    data-pgl-edit="image"
                  >
                    {cat.image ? (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          backgroundImage: `url(${cat.image})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          transition: "transform 0.4s",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          background: `linear-gradient(135deg, ${accent}18, ${primary}08)`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" opacity="0.25">
                          <rect x="4" y="4" width="32" height="32" rx="6" stroke={primary} strokeWidth="1.5" />
                          <circle cx="15" cy="15" r="4" stroke={primary} strokeWidth="1.5" />
                          <path d="M4 28l10-8 8 5 14-11" stroke={primary} strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Category name — Poppins 18px */}
                  <span
                    style={{
                      fontFamily: "var(--pgl-font-body), sans-serif",
                      fontSize: 18,
                      fontWeight: 400,
                      letterSpacing: "0em",
                      lineHeight: "1.4em",
                      color: "var(--pgl-text)",
                      textAlign: "center",
                    }}
                    data-pgl-path={`categories.${idx}.name`}
                    data-pgl-edit="text"
                  >
                    {cat.name}
                  </span>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>

      {/* Hide scrollbar */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            [style*="scroll-snap-type"]::-webkit-scrollbar { display: none; }
          `,
        }}
      />
    </section>
  );
}
