"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { DesignTokens } from "@/types/ai-generation";
import { TestimonialsContentSchema } from "@/types/ai-generation";
import { ScrollReveal } from "./scroll-reveal";

interface Props {
  content: Record<string, unknown>;
  tokens: DesignTokens;
  isDark?: boolean;
}

export function RealesticTestimonials({ content, tokens }: Props) {
  const parsed = TestimonialsContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const accent = tokens.palette.accent;

  return (
    <section
      id="testimonials"
      style={{
        backgroundColor: "var(--pgl-background)",
        padding: "34px 0",
      }}
    >
      <div className="px-[25px]" style={{ maxWidth: 1200, margin: "0 auto" }}>
        <ScrollReveal>
          <div
            style={{
              backgroundColor: "var(--pgl-text)",
              borderRadius: 38,
              display: "flex",
              flexDirection: "column",
              gap: 64,
              overflow: "hidden",
            }}
            className="py-12 px-6 md:py-[48px] md:px-[24px]"
          >
            {/* ═══ Header ═══ */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 20,
                alignItems: "center",
              }}
            >
              {/* Section tag */}
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
                      color: "var(--pgl-background)",
                    }}
                    data-pgl-path="subtitle"
                    data-pgl-edit="text"
                  >
                    {c.subtitle}
                  </span>
                </div>
              )}

              {/* H2 */}
              <h2
                style={{
                  fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                  fontSize: "clamp(28px, 4vw, 46px)",
                  fontWeight: 500,
                  letterSpacing: "-0.03em",
                  lineHeight: "1.15em",
                  color: "var(--pgl-background)",
                  margin: 0,
                  textAlign: "center",
                  maxWidth: 700,
                }}
                data-pgl-path="title"
                data-pgl-edit="text"
              >
                {c.title.split(/\*([^*]+)\*/).map((part, i) =>
                  i % 2 === 1 ? (
                    <span key={i} style={{ color: accent }}>
                      {part}
                    </span>
                  ) : (
                    <span key={i}>{part}</span>
                  )
                )}
              </h2>
            </div>

            {/* ═══ Carousel ═══ */}
            <TestimonialsCarousel items={c.items} accent={accent} />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ─────────── Carousel sub-component ─────────── */

interface CarouselProps {
  items: {
    text: string;
    author: string;
    role?: string;
    image?: string;
    rating?: number;
  }[];
  accent: string;
}

function TestimonialsCarousel({ items, accent }: CarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const total = items.length;

  const scrollToIndex = useCallback(
    (index: number) => {
      const el = scrollRef.current;
      if (!el) return;
      const clamped = Math.max(0, Math.min(index, total - 1));
      const slideWidth = el.scrollWidth / total;
      el.scrollTo({ left: slideWidth * clamped, behavior: "smooth" });
      setActiveIndex(clamped);
    },
    [total]
  );

  // Track scroll position for dot sync
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleScroll = () => {
      const slideWidth = el.scrollWidth / total;
      const idx = Math.round(el.scrollLeft / slideWidth);
      setActiveIndex(Math.max(0, Math.min(idx, total - 1)));
    };
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [total]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      {/* Scrollable track — no gap, each slide is exactly 100% width */}
      <div
        ref={scrollRef}
        style={{
          display: "flex",
          gap: 0,
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          padding: "0 0 32px 0",
        }}
        className="[&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, idx) => (
          <div
            key={idx}
            style={{
              flex: "0 0 100%",
              width: "100%",
              minWidth: "100%",
              scrollSnapAlign: "center",
              display: "flex",
              justifyContent: "center",
              padding: "0 22px",
            }}
          >
            {/* Card */}
            <div
              className="flex-col md:flex-row items-center md:items-start"
              style={{
                display: "flex",
                gap: 24,
                maxWidth: 680,
                width: "100%",
              }}
            >
              {/* Avatar */}
              <div
                className="w-[80px] h-[80px] md:w-[120px] md:h-[120px]"
                style={{
                  borderRadius: 1000,
                  overflow: "hidden",
                  flexShrink: 0,
                  background: `linear-gradient(135deg, ${accent}66, ${accent}33)`,
                }}
                data-pgl-path={`items.${idx}.image`}
                data-pgl-edit="image"
              >
                {item.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.image}
                    alt={item.author}
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
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--pgl-font-heading)",
                        fontSize: 36,
                        fontWeight: 600,
                        color: "#fff",
                      }}
                    >
                      {item.author.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Quote + author info */}
              <div
                className="text-center md:text-left"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 22,
                  maxWidth: 460,
                }}
              >
                {/* Star rating (optional) */}
                {item.rating && (
                  <div
                    style={{
                      display: "flex",
                      gap: 4,
                      justifyContent: "inherit",
                    }}
                  >
                    {Array.from({ length: 5 }).map((_, si) => (
                      <svg
                        key={si}
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill={si < item.rating! ? accent : "rgba(255,255,255,0.2)"}
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>
                )}

                {/* Quote text */}
                <p
                  style={{
                    fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                    fontSize: "clamp(18px, 3vw, 26px)",
                    fontWeight: 500,
                    letterSpacing: "-0.03em",
                    lineHeight: "1.55em",
                    color: "#fff",
                    margin: 0,
                  }}
                  data-pgl-path={`items.${idx}.text`}
                  data-pgl-edit="text"
                >
                  {item.text}
                </p>

                {/* Personal info */}
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span
                    style={{
                      fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                      fontSize: 20,
                      fontWeight: 500,
                      letterSpacing: "-0.02em",
                      lineHeight: "1.5em",
                      color: "#fff",
                    }}
                    data-pgl-path={`items.${idx}.author`}
                    data-pgl-edit="text"
                  >
                    {item.author}
                  </span>
                  {item.role && (
                    <span
                      style={{
                        fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                        fontSize: 15,
                        fontWeight: 400,
                        letterSpacing: "-0.02em",
                        color: "rgba(252,252,252,0.72)",
                      }}
                      data-pgl-path={`items.${idx}.role`}
                      data-pgl-edit="text"
                    >
                      {item.role}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ═══ Navigation: arrows + dots ═══ */}
      {total > 1 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
          }}
        >
          {/* Left arrow */}
          <button
            onClick={() => scrollToIndex(activeIndex - 1)}
            aria-label="Previous testimonial"
            style={{
              width: 40,
              height: 40,
              borderRadius: 1000,
              border: "1px solid rgba(255,255,255,0.2)",
              backgroundColor: "transparent",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: activeIndex === 0 ? 0.3 : 1,
              transition: "opacity 0.2s, background-color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          {/* Dots */}
          <div style={{ display: "flex", gap: 8 }}>
            {items.map((_, idx) => (
              <button
                key={idx}
                onClick={() => scrollToIndex(idx)}
                aria-label={`Go to testimonial ${idx + 1}`}
                style={{
                  width: activeIndex === idx ? 24 : 8,
                  height: 8,
                  borderRadius: 1000,
                  border: "none",
                  backgroundColor: activeIndex === idx ? accent : "rgba(255,255,255,0.3)",
                  cursor: "pointer",
                  padding: 0,
                  transition: "all 0.3s ease",
                }}
              />
            ))}
          </div>

          {/* Right arrow */}
          <button
            onClick={() => scrollToIndex(activeIndex + 1)}
            aria-label="Next testimonial"
            style={{
              width: 40,
              height: 40,
              borderRadius: 1000,
              border: "1px solid rgba(255,255,255,0.2)",
              backgroundColor: "transparent",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: activeIndex === total - 1 ? 0.3 : 1,
              transition: "opacity 0.2s, background-color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
