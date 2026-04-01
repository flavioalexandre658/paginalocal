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

function renderAccentText(text: string, accentColor: string) {
  return text.split(/\*([^*]+)\*/).map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} style={{ color: accentColor }}>{part}</span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

function StarIcon({ color }: { color: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <path
        d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.49L10 14.26l-4.94 2.44.94-5.49-4-3.9 5.53-.8L10 1.5z"
        fill={color}
      />
    </svg>
  );
}

export function RooforaTestimonials({ content, tokens }: Props) {
  const parsed = TestimonialsContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const accent = tokens.palette.accent || "#CDF660";
  const surface = tokens.palette.primary || "#0E1201";

  const [currentPage, setCurrentPage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const itemsPerPage = isMobile ? 1 : 2;
  const totalPages = Math.ceil(c.items.length / itemsPerPage);

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

  // Auto-advance every 5s
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
      style={{ backgroundColor: surface, overflow: "hidden" }}
    >
      <div
        className="px-5 md:px-[30px] py-16 md:py-[100px]"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* ═══ Header ═══ */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
            marginBottom: 64,
            textAlign: "center",
            maxWidth: 600,
          }}
        >
          {c.subtitle && (
            <ScrollReveal delay={0}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 16px",
                  borderRadius: 100,
                  border: "1px solid rgba(252,255,245,0.15)",
                  backgroundColor: "rgba(255,255,255,0.06)",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                    fontSize: 13,
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    lineHeight: "1.7em",
                    color: accent,
                    textTransform: "uppercase",
                  }}
                  data-pgl-path="subtitle"
                  data-pgl-edit="text"
                >
                  {c.subtitle}
                </span>
              </div>
            </ScrollReveal>
          )}
          <ScrollReveal delay={100}>
            <h2
              style={{
                fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                fontSize: "clamp(28px, 4vw, 42px)",
                fontWeight: 600,
                letterSpacing: "-0.04em",
                lineHeight: "1.15em",
                color: "#fff",
                margin: 0,
              }}
              data-pgl-path="title"
              data-pgl-edit="text"
            >
              {renderAccentText(c.title, accent)}
            </h2>
          </ScrollReveal>

          {/* Reviews badge */}
          <ScrollReveal delay={150}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 18px",
                borderRadius: 100,
                backgroundColor: accent,
                marginTop: 8,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                <path
                  d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.49L10 14.26l-4.94 2.44.94-5.49-4-3.9 5.53-.8L10 1.5z"
                  fill="#0E1201"
                />
              </svg>
              <span
                style={{
                  fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#0E1201",
                  letterSpacing: "-0.01em",
                }}
              >
                Avaliacoes
              </span>
            </div>
          </ScrollReveal>
        </div>

        {/* ═══ Cards ═══ */}
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
                    backgroundColor: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(252,255,245,0.4)",
                    borderRadius: 20,
                    padding: 32,
                    display: "flex",
                    flexDirection: "column",
                    gap: 32,
                    transition: "border-color 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = accent;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(252,255,245,0.4)";
                  }}
                >
                  {/* Stars */}
                  <div style={{ display: "flex", flexDirection: "row", gap: 3 }}>
                    {[...Array(item.rating || 5)].map((_, i) => (
                      <StarIcon key={i} color={accent} />
                    ))}
                  </div>

                  {/* Quote text */}
                  <p
                    style={{
                      fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                      fontSize: 16,
                      fontWeight: 400,
                      letterSpacing: "0px",
                      lineHeight: "1.6em",
                      color: "rgba(255,255,255,0.7)",
                      margin: 0,
                    }}
                    data-pgl-path={`items.${globalIdx}.text`}
                    data-pgl-edit="text"
                  >
                    &ldquo;{item.text}&rdquo;
                  </p>

                  {/* Author info */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 12,
                      marginTop: "auto",
                    }}
                  >
                    {/* Avatar */}
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: "50%",
                        overflow: "hidden",
                        flexShrink: 0,
                        backgroundImage: item.image ? `url(${item.image})` : undefined,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundColor: item.image ? undefined : "rgba(255,255,255,0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      data-pgl-path={`items.${globalIdx}.image`}
                      data-pgl-edit="image"
                    >
                      {!item.image && (
                        <span
                          style={{
                            fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                            fontSize: 20,
                            fontWeight: 700,
                            color: accent,
                          }}
                        >
                          {item.author.charAt(0)}
                        </span>
                      )}
                    </div>

                    {/* Name + Role */}
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span
                        style={{
                          fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                          fontSize: 16,
                          fontWeight: 600,
                          letterSpacing: "-0.01em",
                          lineHeight: "1.4em",
                          color: "#fff",
                        }}
                        data-pgl-path={`items.${globalIdx}.author`}
                        data-pgl-edit="text"
                      >
                        {item.author}
                      </span>
                      {item.role && (
                        <span
                          style={{
                            fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                            fontSize: 14,
                            fontWeight: 400,
                            letterSpacing: "0px",
                            lineHeight: "1.5em",
                            color: "rgba(255,255,255,0.5)",
                          }}
                          data-pgl-path={`items.${globalIdx}.role`}
                          data-pgl-edit="text"
                        >
                          {item.role}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* ═══ Dots indicator ═══ */}
        {totalPages > 1 && (
          <div style={{ display: "flex", flexDirection: "row", gap: 8, marginTop: 48 }}>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => goToPage(i)}
                aria-label={`Pagina ${i + 1}`}
                style={{
                  width: i === currentPage ? 28 : 10,
                  height: 10,
                  borderRadius: 100,
                  backgroundColor: i === currentPage ? accent : "rgba(255,255,255,0.2)",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
