"use client";

import type { DesignTokens } from "@/types/ai-generation";
import { ScrollReveal } from "./scroll-reveal";
import { TestimonialsContentSchema } from "@/types/ai-generation";

interface Props {
  content: Record<string, unknown>;
  tokens: DesignTokens;
  isDark?: boolean;
}

export function GroviaTestimonials({ content, tokens }: Props) {
  const parsed = TestimonialsContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  // Split items: first half = case study cards, second half = testimonial quotes
  const midpoint = Math.ceil(c.items.length / 2);
  const caseItems = c.items.slice(0, Math.min(midpoint, 4));
  const testimonialItems = c.items.slice(midpoint, midpoint + 3);

  const yearLabels = ["2025", "2024", "2025", "2023"];

  return (
    <section id="testimonials" style={{ backgroundColor: "var(--pgl-background)" }}>
      {/* Container — max-w 1200, padding 80px, flex column center, gap 64px */}
      <div
        className="px-6 py-12 md:px-[80px] md:py-[80px]"
        style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 64 }}
      >
        {/* ═══ CASE STUDIES ═══ */}
        <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
          {/* Header — centered */}
          <div className="text-center" style={{ maxWidth: 700 }}>
            <h2
              style={{
                fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                fontSize: "clamp(28px, 5vw, 36px)",
                fontWeight: 400,
                letterSpacing: "-0.05em",
                lineHeight: "1.1em",
                color: "var(--pgl-text)",
                margin: 0,
              }}
              data-pgl-path="title"
              data-pgl-edit="text"
            >
              {c.title.split(/\*([^*]+)\*/).map((part, i) =>
                i % 2 === 1 ? (
                  <span key={i} style={{ color: tokens.palette.accent }}>{part}</span>
                ) : (
                  <span key={i}>{part}</span>
                )
              )}
            </h2>
            {c.subtitle && (
              <p
                style={{
                  fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                  fontSize: 18,
                  fontWeight: 400,
                  letterSpacing: "-0.03em",
                  lineHeight: "1.4em",
                  color: "var(--pgl-text-muted)",
                  margin: "16px 0 0",
                }}
                data-pgl-path="subtitle"
                data-pgl-edit="text"
              >
                {c.subtitle}
              </p>
            )}
          </div>

          {/* Case Study Grid — 2 cols desktop, 1 col mobile, surface bg, radius 24, padding 8, gap 8 */}
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full"
            style={{
              backgroundColor: "var(--pgl-surface)",
              borderRadius: 24,
              padding: 8,
            }}
          >
            {caseItems.map((item, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: "rgba(255,255,255,0.6)",
                  borderRadius: 20,
                  padding: 8,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  cursor: "pointer",
                  transition: "box-shadow 0.3s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.08)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; }}
              >
                {/* Image area — bg black, radius 16, aspect 1.6 */}
                <div
                  style={{
                    width: "100%",
                    aspectRatio: "1.6",
                    backgroundColor: "rgba(0,0,0,0.9)",
                    borderRadius: 16,
                    overflow: "hidden",
                    position: "relative",
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
                        width: "100%", height: "100%", objectFit: "cover",
                        mask: "linear-gradient(0deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.95) 100%)",
                        WebkitMaskImage: "linear-gradient(0deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.95) 100%)",
                      }}
                    />
                  ) : (
                    /* Gradient placeholder */
                    <div style={{
                      width: "100%", height: "100%",
                      background: `linear-gradient(135deg, ${tokens.palette.primary}44, ${tokens.palette.accent}33, ${tokens.palette.secondary || tokens.palette.primary}22)`,
                    }} />
                  )}
                  {/* Brand name overlay */}
                  <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 24, height: 24, borderRadius: 6, backgroundColor: "rgba(255,255,255,0.3)" }} />
                    <span style={{ fontFamily: "var(--pgl-font-heading)", fontSize: 20, fontWeight: 500, color: "#fff", textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>
                      {item.author}
                    </span>
                  </div>
                  {/* Year badge */}
                  <div style={{ position: "absolute", bottom: 12, right: 12 }}>
                    <span style={{
                      fontFamily: "var(--pgl-font-body)", fontSize: 12, fontWeight: 500,
                      color: "#fff", backgroundColor: "rgba(0,0,0,0.4)", borderRadius: 8, padding: "4px 10px",
                    }}>
                      {yearLabels[idx % yearLabels.length]}
                    </span>
                  </div>
                </div>

                {/* Text below image */}
                <div style={{ padding: "8px 8px 4px" }}>
                  {/* Name — Albert Sans 24px weight 400 */}
                  <h5
                    style={{
                      fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                      fontSize: 24,
                      fontWeight: 400,
                      letterSpacing: "-0.04em",
                      lineHeight: "1.3em",
                      color: "var(--pgl-text)",
                      margin: 0,
                    }}
                    data-pgl-path={`items.${idx}.author`}
                    data-pgl-edit="text"
                  >
                    {item.author}
                  </h5>
                  {/* Description — Geist 16px */}
                  <p
                    style={{
                      fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                      fontSize: 16,
                      fontWeight: 400,
                      letterSpacing: "-0.03em",
                      lineHeight: "1.4em",
                      color: "var(--pgl-text-muted)",
                      margin: "8px 0 0",
                    }}
                    data-pgl-path={`items.${idx}.text`}
                    data-pgl-edit="text"
                  >
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA removed — text should come from blueprint, not hardcoded */}
        </div>

        {/* ═══ DIVIDER — + symbols ═══ */}
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          {[0, 1, 2, 3, 4].map(i => (
            <svg key={i} width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 3v10M3 8h10" stroke="rgba(0,0,0,0.15)" strokeWidth="1" strokeLinecap="round" />
            </svg>
          ))}
        </div>

        {/* ═══ TESTIMONIALS ═══ */}
        {testimonialItems.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 w-full">
            {testimonialItems.map((item, idx) => (
              <div
                key={idx}
                className="p-6 md:p-8 min-h-[240px] md:min-h-[280px]"
                style={{
                  backgroundColor: "rgba(255,255,255,0.6)",
                  borderRadius: 20,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: 20,
                }}
              >
                {/* Quote */}
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {/* Quote mark */}
                  <svg width="32" height="24" viewBox="0 0 32 24" fill="none">
                    <path d="M0 24V14.4C0 9.6 1.2 6 3.6 3.6S9.6 0 14.4 0v4.8c-2.4 0-4.2.6-5.4 1.8S7.2 9.6 7.2 12H14.4v12H0zm17.6 0V14.4c0-4.8 1.2-8.4 3.6-10.8S24.8 0 29.6 0v4.8c-2.4 0-4.2.6-5.4 1.8S22.4 9.6 22.4 12H29.6v12H17.6z" fill="rgba(0,0,0,0.08)" />
                  </svg>

                  {/* Quote text — Geist 16px */}
                  <p
                    style={{
                      fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                      fontSize: 16,
                      fontWeight: 400,
                      letterSpacing: "-0.03em",
                      lineHeight: "1.4em",
                      color: "var(--pgl-text)",
                      margin: 0,
                    }}
                    data-pgl-path={`items.${midpoint + idx}.text`}
                    data-pgl-edit="text"
                  >
                    {item.text}
                  </p>
                </div>

                {/* Author — name + role + avatar */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <span
                      style={{
                        fontFamily: "var(--pgl-font-heading)", fontSize: 14, fontWeight: 500,
                        letterSpacing: "-0.03em", color: "var(--pgl-text)", display: "block",
                      }}
                      data-pgl-path={`items.${midpoint + idx}.author`}
                      data-pgl-edit="text"
                    >
                      {item.author}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--pgl-font-body)", fontSize: 14, fontWeight: 400,
                        letterSpacing: "-0.03em", color: "var(--pgl-text-muted)", display: "block", marginTop: 2,
                      }}
                      data-pgl-path={`items.${midpoint + idx}.role`}
                      data-pgl-edit="text"
                    >
                      {item.role}
                    </span>
                  </div>
                  {/* Avatar */}
                  <div
                    className="w-12 h-12 md:w-14 md:h-14"
                    style={{
                      borderRadius: 16, overflow: "hidden", flexShrink: 0,
                      background: `linear-gradient(135deg, ${tokens.palette.accent}44, ${tokens.palette.primary}33)`,
                    }}
                    data-pgl-path={`items.${midpoint + idx}.image`}
                    data-pgl-edit="image"
                  >
                    {item.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.image} alt={item.author} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontFamily: "var(--pgl-font-heading)", fontSize: 20, fontWeight: 600, color: "#fff" }}>
                          {item.author.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
