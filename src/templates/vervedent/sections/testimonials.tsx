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
    i % 2 === 1 ? <span key={i} style={{ color: accentColor }}>{part}</span> : <span key={i}>{part}</span>
  );
}

export function VerveTestimonials({ content, tokens }: Props) {
  const [current, setCurrent] = useState(0);

  const parsed = TestimonialsContentSchema.safeParse(content);
  const items = parsed.success ? parsed.data.items : [];
  const total = items.length || 1;

  const next = useCallback(() => setCurrent((p) => (p + 1) % total), [total]);
  const prev = useCallback(() => setCurrent((p) => (p - 1 + total) % total), [total]);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  if (!parsed.success) return null;
  const c = parsed.data;

  const accent = tokens.palette.accent;
  const secondary = tokens.palette.secondary;

  const getIdx = (offset: number) => (current + offset + total) % total;

  return (
    <section
      id="testimonials"
      style={{ backgroundColor: "var(--pgl-background)", overflow: "hidden" }}
    >
      <div className="px-6 py-16 md:py-[100px]" style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 56, maxWidth: 700, margin: "0 auto 56px" }}>
          {c.subtitle && (
            <ScrollReveal delay={0}>
              <p style={{
                fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                fontSize: 16, fontWeight: 600, color: secondary, margin: "0 0 16px",
              }} data-pgl-path="subtitle" data-pgl-edit="text">
                {c.subtitle}
              </p>
            </ScrollReveal>
          )}
          <ScrollReveal delay={50}>
            <h2 style={{
              fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
              fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 600,
              lineHeight: "1.1em", color: "var(--pgl-text)", margin: "0 0 16px",
            }} data-pgl-path="title" data-pgl-edit="text">
              {renderAccentText(c.title, secondary)}
            </h2>
          </ScrollReveal>
        </div>

        {/* Carousel — 3 cards visible: left peek, center active, right peek */}
        <ScrollReveal delay={150}>
          <div style={{ position: "relative" }}>
            <div
              className="flex items-center justify-center"
              style={{ gap: 24, minHeight: 380, position: "relative" }}
            >
              {/* Left peek card */}
              <div className="hidden md:block" style={{ flex: "0 0 280px", opacity: 0.3, transform: "scale(0.9)", transition: "all 0.4s ease" }}>
                <TestimonialCard item={c.items[getIdx(-1)]} idx={getIdx(-1)} secondary={secondary} accent={accent} />
              </div>

              {/* Center active card */}
              <div style={{
                flex: "0 0 min(100%, 560px)", transition: "all 0.4s ease",
                boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
                border: "1px solid var(--pgl-border, #e6e6e6)",
                borderRadius: 0, padding: "48px 40px", backgroundColor: "#fff",
                display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
              }}>
                {/* Quote icon */}
                <svg width="40" height="32" viewBox="0 0 40 32" fill="none" style={{ marginBottom: 24 }}>
                  <path d="M0 32V19.2C0 12.8 1.6 8 4.8 4.8S12.8 0 19.2 0v6.4c-3.2 0-5.6.8-7.2 2.4S9.6 12.8 9.6 16h9.6V32H0zm21.6 0V19.2c0-6.4 1.6-11.2 4.8-14.4S30.4 0 36.8 0v6.4c-3.2 0-5.6.8-7.2 2.4S27.2 12.8 27.2 16h9.6V32H21.6z" fill={secondary} />
                </svg>

                {/* Quote text */}
                <p
                  style={{
                    fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                    fontSize: 16, fontWeight: 300, fontStyle: "italic",
                    lineHeight: "1.6em", color: "var(--pgl-text-muted)", margin: "0 0 32px",
                    maxWidth: 460,
                  }}
                  data-pgl-path={`items.${current}.text`}
                  data-pgl-edit="text"
                >
                  {c.items[current].text}
                </p>

                {/* Author photo */}
                <div
                  style={{
                    width: 72, height: 72, borderRadius: "50%", overflow: "hidden",
                    marginBottom: 12, backgroundColor: "var(--pgl-surface, #f5f5f5)",
                  }}
                  data-pgl-path={`items.${current}.image`}
                  data-pgl-edit="image"
                >
                  {c.items[current].image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.items[current].image} alt={c.items[current].author}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={{
                      width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center",
                      background: `linear-gradient(135deg, ${accent}22, var(--pgl-surface))`,
                    }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" opacity="0.3">
                        <circle cx="12" cy="8" r="4" stroke="var(--pgl-text)" strokeWidth="1.5" />
                        <path d="M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6" stroke="var(--pgl-text)" strokeWidth="1.5" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Author name */}
                <span
                  style={{
                    fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                    fontSize: 16, fontWeight: 600, color: "var(--pgl-text)",
                  }}
                  data-pgl-path={`items.${current}.author`}
                  data-pgl-edit="text"
                >
                  {c.items[current].author}
                </span>
              </div>

              {/* Right peek card */}
              <div className="hidden md:block" style={{ flex: "0 0 280px", opacity: 0.3, transform: "scale(0.9)", transition: "all 0.4s ease" }}>
                <TestimonialCard item={c.items[getIdx(1)]} idx={getIdx(1)} secondary={secondary} accent={accent} />
              </div>
            </div>

            {/* Navigation arrows */}
            <button
              onClick={prev}
              className="hidden md:flex"
              style={{
                position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)",
                width: 40, height: 40, borderRadius: "50%",
                border: `1px solid var(--pgl-border, #e6e6e6)`, backgroundColor: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", zIndex: 3, transition: "border-color 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = secondary; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--pgl-border, #e6e6e6)"; }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 4l-4 4 4 4" stroke={secondary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              onClick={next}
              className="hidden md:flex"
              style={{
                position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)",
                width: 40, height: 40, borderRadius: "50%",
                border: `1px solid var(--pgl-border, #e6e6e6)`, backgroundColor: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", zIndex: 3, transition: "border-color 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = secondary; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--pgl-border, #e6e6e6)"; }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 4l4 4-4 4" stroke={secondary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </ScrollReveal>

        {/* Dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 32 }}>
          {c.items.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              style={{
                width: i === current ? 24 : 8, height: 8,
                borderRadius: 4, border: "none", cursor: "pointer",
                backgroundColor: i === current ? secondary : `${secondary}33`,
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({
  item, idx, secondary, accent,
}: {
  item: { text: string; author: string; image?: string };
  idx: number;
  secondary: string;
  accent: string;
}) {
  return (
    <div style={{
      padding: "32px 24px", backgroundColor: "#fff",
      border: "1px solid var(--pgl-border, #e6e6e6)", borderRadius: 0,
      display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
    }}>
      <svg width="24" height="20" viewBox="0 0 40 32" fill="none" style={{ marginBottom: 16 }}>
        <path d="M0 32V19.2C0 12.8 1.6 8 4.8 4.8S12.8 0 19.2 0v6.4c-3.2 0-5.6.8-7.2 2.4S9.6 12.8 9.6 16h9.6V32H0zm21.6 0V19.2c0-6.4 1.6-11.2 4.8-14.4S30.4 0 36.8 0v6.4c-3.2 0-5.6.8-7.2 2.4S27.2 12.8 27.2 16h9.6V32H21.6z" fill={`${secondary}44`} />
      </svg>
      <p style={{
        fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
        fontSize: 13, fontWeight: 300, fontStyle: "italic",
        lineHeight: "1.5em", color: "var(--pgl-text-muted)", margin: "0 0 20px",
      }}>
        {item.text.substring(0, 120)}...
      </p>
      <div style={{
        width: 48, height: 48, borderRadius: "50%", overflow: "hidden",
        marginBottom: 8, backgroundColor: "var(--pgl-surface, #f5f5f5)",
      }}>
        {item.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.image} alt={item.author} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{
            width: "100%", height: "100%",
            background: `linear-gradient(135deg, ${accent}22, var(--pgl-surface))`,
          }} />
        )}
      </div>
      <span style={{
        fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
        fontSize: 13, fontWeight: 600, color: "var(--pgl-text-muted)",
      }}>
        {item.author}
      </span>
    </div>
  );
}
