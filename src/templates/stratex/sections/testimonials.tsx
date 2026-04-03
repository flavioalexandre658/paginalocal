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

function renderAccentText(text: string, accentColor: string) {
  return text.split(/\*([^*]+)\*/).map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} style={{ color: accentColor }}>{part}</span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

/* ─────────── Star Icon (dark fill for rating bar) ─────────── */
function StarIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="var(--pgl-text)"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );
}

/* ─────────── Main Export ─────────── */
export function StratexTestimonials({ content, tokens }: Props) {
  const parsed = TestimonialsContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const accent = tokens.palette.accent;

  return (
    <section
      id="testimonials"
      style={{
        backgroundColor: "var(--pgl-background)",
        padding: "100px 0",
        overflow: "hidden",
      }}
    >
      <div
        className="px-6 md:px-10"
        style={{ maxWidth: 1280, margin: "0 auto" }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 48,
          }}
        >
          {/* ═══ Rating bar ═══ */}
          <ScrollReveal>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                justifyContent: "center",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} />
                ))}
              </div>
              {c.subtitle && (
                <span
                  style={{
                    fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                    fontSize: 15,
                    fontWeight: 500,
                    letterSpacing: "0.01em",
                    lineHeight: "1.4em",
                    color: "var(--pgl-text)",
                  }}
                  data-pgl-path="subtitle"
                  data-pgl-edit="text"
                >
                  {c.subtitle}
                </span>
              )}
            </div>
          </ScrollReveal>

          {/* ═══ Section title ═══ */}
          <ScrollReveal delay={80}>
            <h2
              style={{
                fontFamily:
                  "var(--pgl-font-heading), 'Hedvig Letters Serif', serif",
                fontSize: "clamp(32px, 4.5vw, 56px)",
                fontWeight: 400,
                letterSpacing: "-0.02em",
                lineHeight: "1.12em",
                color: "var(--pgl-text)",
                margin: 0,
                textAlign: "center",
                maxWidth: 740,
              }}
              data-pgl-path="title"
              data-pgl-edit="text"
            >
              {renderAccentText(c.title, accent)}
            </h2>
          </ScrollReveal>

          {/* ═══ Testimonial Carousel ═══ */}
          <ScrollReveal delay={160}>
            <TestimonialsCarousel items={c.items} accent={accent} />
          </ScrollReveal>
        </div>
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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 40,
        width: "100%",
        maxWidth: 1280,
      }}
    >
      {/* Scrollable track */}
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
              padding: "0 16px",
            }}
          >
            {/* ── Dark Card ── */}
            <div
              style={{
                backgroundColor: "var(--pgl-text)",
                borderRadius: 24,
                padding: "48px 40px",
                display: "flex",
                flexDirection: "column",
                gap: 32,
                maxWidth: 800,
                width: "100%",
              }}
              className="!p-8 md:!p-12"
            >
              {/* Quote text — large serif */}
              <h3
                style={{
                  fontFamily:
                    "var(--pgl-font-heading), 'Hedvig Letters Serif', serif",
                  fontSize: "clamp(22px, 3vw, 32px)",
                  fontWeight: 400,
                  letterSpacing: "-0.01em",
                  lineHeight: "1.35em",
                  color: "var(--pgl-background)",
                  margin: 0,
                }}
                data-pgl-path={`items.${idx}.text`}
                data-pgl-edit="text"
              >
                {item.text}
              </h3>

              {/* User info row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  flexWrap: "wrap",
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
                    background: `linear-gradient(135deg, ${accent}, ${accent}99)`,
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
                          fontFamily:
                            "var(--pgl-font-heading), system-ui, sans-serif",
                          fontSize: 20,
                          fontWeight: 500,
                          color: "#fff",
                        }}
                      >
                        {item.author.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Name + role text wrapper */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  <span
                    style={{
                      fontFamily:
                        "var(--pgl-font-body), system-ui, sans-serif",
                      fontSize: 16,
                      fontWeight: 600,
                      letterSpacing: "-0.01em",
                      lineHeight: "1.4em",
                      color: "var(--pgl-background)",
                    }}
                    data-pgl-path={`items.${idx}.author`}
                    data-pgl-edit="text"
                  >
                    {item.author}
                  </span>
                  {item.role && (
                    <span
                      style={{
                        fontFamily:
                          "var(--pgl-font-body), system-ui, sans-serif",
                        fontSize: 14,
                        fontWeight: 400,
                        letterSpacing: "0em",
                        lineHeight: "1.4em",
                        color: accent,
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
              width: 44,
              height: 44,
              borderRadius: 1000,
              border: "1px solid color-mix(in srgb, var(--pgl-text) 20%, transparent)",
              backgroundColor: "transparent",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: activeIndex === 0 ? 0.3 : 1,
              transition: "opacity 0.2s, background-color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                "color-mix(in srgb, var(--pgl-text) 8%, transparent)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--pgl-text)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
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
                  backgroundColor:
                    activeIndex === idx
                      ? accent
                      : "color-mix(in srgb, var(--pgl-text) 25%, transparent)",
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
              width: 44,
              height: 44,
              borderRadius: 1000,
              border: "1px solid color-mix(in srgb, var(--pgl-text) 20%, transparent)",
              backgroundColor: "transparent",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: activeIndex === total - 1 ? 0.3 : 1,
              transition: "opacity 0.2s, background-color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                "color-mix(in srgb, var(--pgl-text) 8%, transparent)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--pgl-text)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
