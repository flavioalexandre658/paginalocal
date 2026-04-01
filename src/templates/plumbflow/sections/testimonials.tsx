"use client";

import { useState, useEffect, useCallback } from "react";
import type { DesignTokens } from "@/types/ai-generation";
import { TestimonialsContentSchema } from "@/types/ai-generation";
import { ScrollReveal } from "./scroll-reveal";

interface Props {
  content: Record<string, unknown>;
  tokens: DesignTokens;
  isDark?: boolean;
}

function StarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.49L10 14.26l-4.94 2.44.94-5.49-4-3.9 5.53-.8L10 1.5z"
        fill="#FF5E15"
      />
    </svg>
  );
}

function QuoteIcon() {
  return (
    <svg width="16" height="15" viewBox="0 0 16 15" fill="none">
      <path d="M6 0H0v6c0 5 3 8.5 6 9l1-2c-2-.5-4-3-4-5h3a2 2 0 002-2V0zm9 0H9v6c0 5 3 8.5 6 9l1-2c-2-.5-4-3-4-5h3a2 2 0 002-2V0z" fill="#fff" />
    </svg>
  );
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

export function PlumbflowTestimonials({ content, tokens }: Props) {
  const parsed = TestimonialsContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const accent = tokens.palette.accent || "#FF5E15";
  const primary = tokens.palette.primary || "#142F45";

  const [currentPage, setCurrentPage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const itemsPerPage = isMobile ? 1 : 2;
  const totalPages = Math.ceil(c.items.length / itemsPerPage);

  // Clamp currentPage when itemsPerPage changes
  useEffect(() => {
    if (currentPage >= totalPages) {
      setCurrentPage(Math.max(0, totalPages - 1));
    }
  }, [totalPages, currentPage]);

  const goToPage = useCallback(
    (page: number) => {
      if (page === currentPage) return;
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentPage(page);
        setIsTransitioning(false);
      }, 250);
    },
    [currentPage],
  );

  // Auto-advance every 5 seconds
  useEffect(() => {
    if (totalPages <= 1) return;
    const interval = setInterval(() => {
      goToPage(currentPage + 1 >= totalPages ? 0 : currentPage + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, [currentPage, totalPages, goToPage]);

  const visibleItems = c.items.slice(
    currentPage * itemsPerPage,
    currentPage * itemsPerPage + itemsPerPage,
  );

  return (
    <section
      id="testimonials"
      style={{
        backgroundColor: primary,
        overflow: "hidden",
      }}
    >
      <div
        className="px-5 md:px-[30px] py-16 md:py-[120px]"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingBottom: 100,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
            marginBottom: 72,
            textAlign: "center",
            maxWidth: 626,
          }}
        >
          {c.subtitle && (
            <ScrollReveal delay={0}>
              <p
                style={{
                  fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                  fontSize: 16, fontWeight: 700, letterSpacing: "0.3px",
                  lineHeight: "1.7em", color: accent, margin: 0,
                }}
                data-pgl-path="subtitle"
                data-pgl-edit="text"
              >
                {c.subtitle}
              </p>
            </ScrollReveal>
          )}
          <ScrollReveal delay={100}>
            <h2
              style={{
                fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700,
                letterSpacing: "-2px", lineHeight: "1.1em", color: "#fff", margin: 0,
              }}
              data-pgl-path="title"
              data-pgl-edit="text"
            >
              {renderAccentText(c.title, accent)}
            </h2>
          </ScrollReveal>
        </div>

        {/* Cards carousel */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full"
          style={{
            maxWidth: 1296,
            opacity: isTransitioning ? 0 : 1,
            transition: "opacity 0.25s ease-in-out",
          }}
        >
          {visibleItems.map((item, localIdx) => {
            const globalIdx = currentPage * itemsPerPage + localIdx;
            return (
              <ScrollReveal key={`${currentPage}-${localIdx}`} delay={localIdx * 150}>
                <div
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: 24,
                    padding: 35,
                    display: "flex",
                    flexDirection: "column",
                    gap: 50,
                  }}
                >
                  {/* Top: Stars + Quote */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                    {/* Stars */}
                    <div style={{ display: "flex", flexDirection: "row", gap: 4 }}>
                      {[...Array(item.rating || 5)].map((_, i) => (
                        <StarIcon key={i} />
                      ))}
                    </div>

                    {/* Quote text */}
                    <p
                      style={{
                        fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                        fontSize: 18, fontWeight: 400, letterSpacing: "0px",
                        lineHeight: "1.4em", color: "var(--pgl-text-muted, #4B5554)", margin: 0,
                      }}
                      data-pgl-path={`items.${globalIdx}.text`}
                      data-pgl-edit="text"
                    >
                      &ldquo;{item.text}&rdquo;
                    </p>
                  </div>

                  {/* Bottom: Avatar + Name/Role */}
                  <div style={{ display: "flex", flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between" }}>
                    {/* Avatar + info */}
                    <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 10 }}>
                      {/* Avatar with quote badge */}
                      <div style={{ position: "relative", flexShrink: 0 }}>
                        <div
                          style={{
                            width: 80, height: 80, borderRadius: "50%", overflow: "hidden",
                            background: `linear-gradient(135deg, ${accent}22, ${primary}33)`,
                          }}
                          data-pgl-path={`items.${globalIdx}.image`}
                          data-pgl-edit="image"
                        >
                          {item.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={item.image} alt={item.author} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          ) : (
                            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <span style={{ fontFamily: "var(--pgl-font-heading)", fontSize: 28, fontWeight: 700, color: primary }}>
                                {item.author.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>
                        {/* Orange quote badge */}
                        <div
                          style={{
                            position: "absolute", top: -6, right: -4,
                            width: 32, height: 32, borderRadius: "50%",
                            backgroundColor: accent,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            zIndex: 1,
                          }}
                        >
                          <QuoteIcon />
                        </div>
                      </div>

                      {/* Name + Role */}
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span
                          style={{
                            fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                            fontSize: 18, fontWeight: 700, letterSpacing: "0px",
                            lineHeight: "1.7em", color: primary,
                          }}
                          data-pgl-path={`items.${globalIdx}.author`}
                          data-pgl-edit="text"
                        >
                          {item.author}
                        </span>
                        <span
                          style={{
                            fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                            fontSize: 14, fontWeight: 500, letterSpacing: "0px",
                            lineHeight: "1.7em", color: "var(--pgl-text-muted, #4B5554)",
                          }}
                          data-pgl-path={`items.${globalIdx}.role`}
                          data-pgl-edit="text"
                        >
                          {item.role}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Dots indicator */}
        {totalPages > 1 && (
          <div style={{ display: "flex", flexDirection: "row", gap: 8, marginTop: 48 }}>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => goToPage(i)}
                aria-label={`Go to page ${i + 1}`}
                style={{
                  width: 10, height: 10, borderRadius: "50%",
                  backgroundColor: i === currentPage ? accent : "rgba(255,255,255,0.3)",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  transition: "background-color 0.3s ease",
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
