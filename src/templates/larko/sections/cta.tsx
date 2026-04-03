"use client";

import type { DesignTokens } from "@/types/ai-generation";
import { CtaContentSchema } from "@/types/ai-generation";
import { ScrollReveal } from "./scroll-reveal";

interface Props {
  content: Record<string, unknown>;
  tokens: DesignTokens;
  isDark?: boolean;
}

function renderAccentText(text: string, accentColor: string) {
  return text.split(/\*([^*]+)\*/).map((part, i) =>
    i % 2 === 1 ? (
      <span
        key={i}
        style={{
          fontFamily: "var(--pgl-font-heading), Georgia, serif",
          fontStyle: "italic",
          color: accentColor,
        }}
      >
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export function LarkoCta({ content, tokens }: Props) {
  const parsed = CtaContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const primary = tokens.palette.primary;
  const secondary = tokens.palette.secondary;

  return (
    <section
      id="cta"
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        minHeight: 700,
        padding: "130px 0",
        overflow: "hidden",
      }}
    >
      {/* ═══ Background image — brightness 0.6 ═══ */}
      <div
        style={{
          position: "absolute",
          inset: "-40px 0",
          overflow: "hidden",
          filter: "brightness(0.6)",
        }}
        data-pgl-path="backgroundImage"
        data-pgl-edit="image"
      >
        <div style={{
          width: "100%",
          height: "100%",
          background: `linear-gradient(135deg, ${primary}, ${primary}dd)`,
        }} />
      </div>

      {/* ═══ Overlay 1 — solid primary at 55% ═══ */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundColor: primary,
        opacity: 0.55,
        zIndex: 1,
      }} />

      {/* ═══ Overlay 2 — diagonal gradient ═══ */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: `linear-gradient(124deg, transparent 0%, ${primary}ab 100%)`,
        zIndex: 1,
      }} />

      {/* ═══ Overlay 3 — bottom 50% gradient ═══ */}
      <div style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: "50%",
        background: "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.15) 100%)",
        zIndex: 1,
      }} />

      {/* ═══ Base Container ═══ */}
      <div
        className="larko-cta-container"
        style={{
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 160,
          width: "100%",
          maxWidth: 1440,
          padding: "0 55px",
          position: "relative",
        }}
      >
        {/* ── Top: Icon + Title ── */}
        <ScrollReveal delay={0}>
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 30,
            width: "100%",
          }}>
            {/* Decorative triangles */}
            <div style={{ width: 145, height: 145, position: "relative", overflow: "hidden" }}>
              <svg width="145" height="145" viewBox="0 0 120 160" fill="none">
                <path d="M10 80L60 10L110 80" stroke={secondary} strokeWidth="3" fill="none" opacity="0.8" />
                <path d="M30 80L60 30L90 80" stroke={secondary} strokeWidth="3" fill="none" opacity="0.6" />
                <path d="M10 80L60 150L110 80" stroke={primary} strokeWidth="3" fill="none" opacity="0.4" />
              </svg>
            </div>

            {/* Title Wrapper */}
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 0,
              width: "100%",
            }}>
              {/* Main title — Geist 85px/500 white */}
              <h2
                style={{
                  fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                  fontSize: "clamp(36px, 5.5vw, 85px)",
                  fontWeight: 500,
                  fontStyle: "normal",
                  letterSpacing: "0em",
                  lineHeight: "1.2em",
                  color: "#fff",
                  margin: 0,
                }}
                data-pgl-path="title"
                data-pgl-edit="text"
              >
                {renderAccentText(c.title, secondary)}
              </h2>
            </div>
          </div>
        </ScrollReveal>

        {/* ── Bottom: Divider + Subtitle + Slide + Arrows ── */}
        <div
          className="larko-cta-bottom"
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
            gap: 40,
            width: "100%",
            position: "relative",
          }}
        >
          {/* Divider line — absolute, top -80px */}
          <div style={{
            position: "absolute",
            top: -80,
            left: "-50%",
            width: "200%",
            height: 1,
            backgroundColor: "rgba(255,255,255,0.15)",
            zIndex: 1,
          }} />

          {/* Subtitle label */}
          <ScrollReveal delay={100}>
            <div
              className="larko-cta-subtitle"
              style={{ maxWidth: "25%", minWidth: 150 }}
            >
              <h6
                style={{
                  fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                  fontSize: 18,
                  fontWeight: 500,
                  lineHeight: "1.2em",
                  color: "#fff",
                  margin: 0,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
                data-pgl-path="subtitle"
                data-pgl-edit="text"
              >
                {c.subtitle}
              </h6>
            </div>
          </ScrollReveal>

          {/* Slide area — text + CTA link */}
          <ScrollReveal delay={200} className="larko-cta-slide">
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: 40,
              flex: 1,
              minWidth: 0,
            }}>
              {/* Slide text — Inter 30px/500 white */}
              <div
                style={{
                  fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                  fontSize: "clamp(20px, 2.2vw, 30px)",
                  fontWeight: 500,
                  lineHeight: "1.5em",
                  color: "#fff",
                }}
              >
                {c.subtitle || "Desbloqueie novas oportunidades para o crescimento do seu negócio"}
              </div>

              {/* CTA link with underline animation */}
              <a
                href={c.ctaLink || "#contato"}
                data-pgl-path="ctaText"
                data-pgl-edit="button"
                style={{
                  display: "inline-flex",
                  flexDirection: "column",
                  gap: 12,
                  textDecoration: "none",
                  width: "fit-content",
                }}
              >
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}>
                  <span style={{
                    fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                    fontSize: 16,
                    fontWeight: 500,
                    lineHeight: "1.5em",
                    color: "#fff",
                  }}>
                    {c.ctaText}
                  </span>
                  <svg width="12" height="12" viewBox="0 0 14 13" fill="none" style={{ transform: "rotate(-45deg)" }}>
                    <path d="M1 6.5h12M8 1l5 5.5L8 12" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                {/* Underline */}
                <div style={{
                  width: "100%",
                  height: 1,
                  backgroundColor: "rgba(255,255,255,0.15)",
                  position: "relative",
                  overflow: "hidden",
                }}>
                  <div className="larko-cta-hover-line" style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: 1,
                    backgroundColor: "#fff",
                    transform: "translateX(-100%)",
                    transition: "transform 0.4s ease",
                  }} />
                </div>
              </a>
            </div>
          </ScrollReveal>

          {/* Nav arrows */}
          <div style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
          }}>
            {[180, 0].map((rot, i) => (
              <button
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "14px 29px",
                  backgroundColor: "transparent",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: 6,
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                  transform: `rotate(${rot}deg)`,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.15)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
              >
                <svg width="12" height="12" viewBox="0 0 14 13" fill="none">
                  <path d="M1 6.5h12M8 1l5 5.5L8 12" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Responsive + hover styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        .larko-cta-container {
          gap: 160px;
          padding: 0 55px;
        }
        .larko-cta-bottom {
          flex-direction: row;
          gap: 40px;
        }
        .larko-cta-subtitle {
          max-width: 25%;
          min-width: 150px;
        }
        a:hover .larko-cta-hover-line {
          transform: translateX(0) !important;
        }
        @media (max-width: 1279px) {
          .larko-cta-container {
            gap: 120px !important;
            padding: 0 20px !important;
          }
        }
        @media (max-width: 991px) {
          .larko-cta-container {
            gap: 80px !important;
            padding: 0 20px !important;
          }
          .larko-cta-bottom {
            flex-direction: column !important;
            gap: 40px !important;
          }
          .larko-cta-subtitle {
            max-width: 100% !important;
          }
        }
      `}} />
    </section>
  );
}
