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
      <span key={i} style={{ color: accentColor }}>
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

/* ─────────── Star icon ─────────── */
function StarIcon({ filled, color }: { filled: boolean; color: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill={filled ? color : "var(--pgl-border, rgb(229,234,236))"}
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

/* ─────────── Decorative background shape ─────────── */
function DecoShape({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 600 400"
      fill="none"
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "80%",
        height: "auto",
        opacity: 0.06,
        pointerEvents: "none",
      }}
    >
      <ellipse cx="300" cy="200" rx="280" ry="180" fill={color} />
    </svg>
  );
}

export function CleanlyTestimonials({ content, tokens }: Props) {
  const parsed = TestimonialsContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const accent = tokens.palette.accent;

  return (
    <section
      id="testimonials"
      style={{
        backgroundColor: "var(--pgl-surface, #f2f7f9)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <DecoShape color={accent} />

      <div
        className="px-5 md:px-8"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          paddingTop: 80,
          paddingBottom: 80,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 48,
          position: "relative",
        }}
      >
        {/* ═══ Header ═══ */}
        <ScrollReveal delay={0}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
              textAlign: "center",
            }}
          >
            {c.subtitle && (
              <span
                style={{
                  fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                  fontSize: 14,
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: accent,
                }}
                data-pgl-path="subtitle"
                data-pgl-edit="text"
              >
                {c.subtitle}
              </span>
            )}

            <h2
              style={{
                fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                fontSize: "clamp(28px, 4vw, 44px)",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
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

        {/* ═══ Carousel ═══ */}
        <ScrollReveal delay={100}>
          <TestimonialsCarousel items={c.items} accent={accent} />
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
      const card = el.children[clamped] as HTMLElement | undefined;
      if (card) {
        el.scrollTo({ left: card.offsetLeft - 16, behavior: "smooth" });
      }
      setActiveIndex(clamped);
    },
    [total]
  );

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleScroll = () => {
      const children = Array.from(el.children) as HTMLElement[];
      const center = el.scrollLeft + el.clientWidth / 2;
      let closest = 0;
      let minDist = Infinity;
      children.forEach((child, i) => {
        const dist = Math.abs(child.offsetLeft + child.offsetWidth / 2 - center);
        if (dist < minDist) {
          minDist = dist;
          closest = i;
        }
      });
      setActiveIndex(closest);
    };
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [total]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 32,
        width: "100%",
      }}
    >
      {/* Scrollable track */}
      <div
        ref={scrollRef}
        style={{
          display: "flex",
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          paddingBottom: 8,
        }}
        className="gap-5 md:gap-6 [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, idx) => (
          <div
            key={idx}
            className="min-w-[85vw] sm:min-w-[360px] md:min-w-[380px]"
            style={{
              flex: "0 0 auto",
              maxWidth: 420,
              scrollSnapAlign: "start",
              display: "flex",
              flexDirection: "column",
              gap: 24,
              padding: "28px 24px",
              borderRadius: 16,
              border: "1px solid var(--pgl-border, rgb(229,234,236))",
              backgroundColor: "var(--pgl-surface, #f2f7f9)",
              transition: "box-shadow 0.25s ease",
            }}
          >
            {/* Star rating */}
            {item.rating != null && item.rating > 0 && (
              <div style={{ display: "flex", gap: 3 }}>
                {Array.from({ length: 5 }).map((_, si) => (
                  <StarIcon key={si} filled={si < item.rating!} color={accent} />
                ))}
              </div>
            )}

            {/* Quote text */}
            <p
              style={{
                fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                fontSize: 15,
                fontWeight: 400,
                lineHeight: 1.7,
                color: "var(--pgl-muted, rgb(91,89,85))",
                margin: 0,
                flex: 1,
              }}
              data-pgl-path={`items.${idx}.text`}
              data-pgl-edit="text"
            >
              {item.text}
            </p>

            {/* Author info */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                borderTop: "1px solid var(--pgl-border, rgb(229,234,236))",
                paddingTop: 20,
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  overflow: "hidden",
                  flexShrink: 0,
                  background: `linear-gradient(135deg, ${accent}55, ${accent}22)`,
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
                        fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                        fontSize: 18,
                        fontWeight: 600,
                        color: accent,
                      }}
                    >
                      {item.author.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Name + role */}
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <span
                  style={{
                    fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                    fontSize: 15,
                    fontWeight: 600,
                    lineHeight: 1.3,
                    color: "var(--pgl-text)",
                  }}
                  data-pgl-path={`items.${idx}.author`}
                  data-pgl-edit="text"
                >
                  {item.author}
                </span>
                {item.role && (
                  <span
                    style={{
                      fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                      fontSize: 13,
                      fontWeight: 400,
                      color: "var(--pgl-muted, rgb(91,89,85))",
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
              borderRadius: "50%",
              border: "1px solid var(--pgl-border, rgb(229,234,236))",
              backgroundColor: "var(--pgl-background)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: activeIndex === 0 ? 0.4 : 1,
              transition: "opacity 0.2s, background-color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--pgl-surface, #f2f7f9)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "var(--pgl-background)";
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
                    activeIndex === idx ? accent : "var(--pgl-border, rgb(229,234,236))",
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
              borderRadius: "50%",
              border: "1px solid var(--pgl-border, rgb(229,234,236))",
              backgroundColor: "var(--pgl-background)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: activeIndex === total - 1 ? 0.4 : 1,
              transition: "opacity 0.2s, background-color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--pgl-surface, #f2f7f9)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "var(--pgl-background)";
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
