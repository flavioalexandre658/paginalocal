"use client";

import { useState } from "react";
import type { DesignTokens } from "@/types/ai-generation";
import { AboutContentSchema } from "@/types/ai-generation";
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

/* Decorative SVG icons for highlights */
const HIGHLIGHT_ICONS = [
  /* Star/asterisk */
  <svg key="star" width="90" height="80" viewBox="0 0 90 80" fill="none">
    <path d="M45 5l8 25h26l-21 15 8 25-21-15-21 15 8-25L11 30h26z" stroke="currentColor" strokeWidth="2" fill="none" />
  </svg>,
  /* Triangles */
  <svg key="tri" width="90" height="80" viewBox="0 0 90 80" fill="none">
    <path d="M45 10L70 60H20z" stroke="currentColor" strokeWidth="2" fill="none" />
    <path d="M45 25L60 55H30z" stroke="currentColor" strokeWidth="2" fill="none" />
  </svg>,
  /* Squares */
  <svg key="sq" width="90" height="80" viewBox="0 0 90 80" fill="none">
    <rect x="20" y="15" width="50" height="50" stroke="currentColor" strokeWidth="2" fill="none" />
    <rect x="30" y="25" width="30" height="30" stroke="currentColor" strokeWidth="2" fill="none" />
  </svg>,
  /* Circles */
  <svg key="circ" width="90" height="80" viewBox="0 0 90 80" fill="none">
    <circle cx="45" cy="40" r="25" stroke="currentColor" strokeWidth="2" fill="none" />
    <circle cx="45" cy="40" r="15" stroke="currentColor" strokeWidth="2" fill="none" />
  </svg>,
];

export function LarkoAbout({ content, tokens }: Props) {
  const [slideIdx, setSlideIdx] = useState(0);

  const parsed = AboutContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const primary = tokens.palette.primary;
  const accent = tokens.palette.accent;
  const secondary = tokens.palette.secondary;
  const surface = tokens.palette.surface;

  const highlights = c.highlights || [];

  /* For the slider, cycle through paragraphs as "slides" */
  const slideTitle = c.title;
  const slideBody = c.paragraphs[slideIdx % c.paragraphs.length] || c.paragraphs[0];

  return (
    <section
      id="about"
      style={{
        backgroundColor: "var(--pgl-surface, #fbf9f5)",
        borderTop: "1px solid var(--pgl-border, #f1f1f1)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        overflow: "visible",
      }}
    >
      {/* Base Container */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 80,
          width: "100%",
          maxWidth: 1440,
          margin: "0 auto",
        }}
        className="larko-about-base"
      >
        {/* ═══ Main Card — white bg, border, border-radius 10px ═══ */}
        <ScrollReveal delay={0} className="larko-about-card-wrap">
          <div
            className="larko-about-card"
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 80,
              width: "100%",
              padding: "20px 80px 20px 20px",
              backgroundColor: "#fff",
              border: "1px solid var(--pgl-border, #f1f1f1)",
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            {/* LEFT — Image */}
            <div
              className="larko-about-img-wrap"
              style={{
                flex: 1,
                minWidth: 0,
                borderRadius: 8,
                overflow: "hidden",
                position: "relative",
              }}
              data-pgl-path="image"
              data-pgl-edit="image"
            >
              <div className="larko-about-img" style={{ width: "100%", height: 650, position: "relative", overflow: "hidden" }}>
                {c.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={c.image}
                    alt=""
                    style={{
                      display: "block",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "25% 50%",
                      borderRadius: "inherit",
                    }}
                  />
                ) : (
                  <div style={{
                    width: "100%",
                    height: "100%",
                    background: `linear-gradient(135deg, ${surface}, ${accent}11)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" opacity="0.15">
                      <rect x="8" y="8" width="32" height="32" rx="4" stroke="var(--pgl-text)" strokeWidth="1.5" />
                      <circle cx="20" cy="20" r="4" stroke="var(--pgl-text)" strokeWidth="1.5" />
                      <path d="M8 36l10-8 8 5 14-11" stroke="var(--pgl-text)" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT — Content: nav arrows + title + body + CTA */}
            <div
              className="larko-about-content"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignSelf: "stretch",
                alignItems: "flex-start",
              }}
            >
              {/* Nav arrows */}
              <div style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 16,
                width: "100%",
                marginBottom: 20,
              }}>
                <button
                  onClick={() => setSlideIdx((prev) => Math.max(0, prev - 1))}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "14px 29px",
                    backgroundColor: "#fff",
                    border: "1px solid var(--pgl-border, #f1f1f1)",
                    borderRadius: 6,
                    cursor: "pointer",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#f3f3f3"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#fff"; }}
                >
                  <svg width="12" height="12" viewBox="0 0 14 13" fill="none" style={{ transform: "rotate(180deg)" }}>
                    <path d="M1 6.5h12M8 1l5 5.5L8 12" stroke="var(--pgl-text)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  onClick={() => setSlideIdx((prev) => Math.min(c.paragraphs.length - 1, prev + 1))}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "14px 29px",
                    backgroundColor: "#fff",
                    border: "1px solid var(--pgl-border, #f1f1f1)",
                    borderRadius: 6,
                    cursor: "pointer",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#f3f3f3"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#fff"; }}
                >
                  <svg width="12" height="12" viewBox="0 0 14 13" fill="none">
                    <path d="M1 6.5h12M8 1l5 5.5L8 12" stroke="var(--pgl-text)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>

              {/* Title — Geist 50px + accent Newsreader italic */}
              <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 0,
                width: "100%",
              }}>
                <h2
                  style={{
                    fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                    fontSize: "clamp(32px, 3.5vw, 50px)",
                    fontWeight: 500,
                    fontStyle: "normal",
                    letterSpacing: "0em",
                    lineHeight: "1.2em",
                    color: primary,
                    margin: 0,
                  }}
                  data-pgl-path="title"
                  data-pgl-edit="text"
                >
                  {renderAccentText(slideTitle, accent)}
                </h2>
              </div>

              {/* Body — Inter 18px/300 */}
              <p
                style={{
                  fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                  fontSize: 18,
                  fontWeight: 300,
                  letterSpacing: "0em",
                  lineHeight: "1.5em",
                  color: "var(--pgl-text-muted, #2e4d3a)",
                  margin: "20px 0 0",
                  maxWidth: 480,
                }}
                data-pgl-path="paragraphs.0"
                data-pgl-edit="text"
              >
                {slideBody}
              </p>

              {/* CTA — lime pill button */}
              {c.ctaText && (
                <a
                  href={c.ctaLink || "#contato"}
                  data-pgl-path="ctaText"
                  data-pgl-edit="button"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0,
                    backgroundColor: secondary,
                    borderRadius: 50,
                    textDecoration: "none",
                    transition: "opacity 0.2s",
                    padding: "6px 6px 6px 20px",
                    marginTop: 24,
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.9"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
                >
                  <span style={{
                    fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                    fontSize: 16,
                    fontWeight: 500,
                    lineHeight: "1.5em",
                    color: primary,
                  }}>
                    {c.ctaText}
                  </span>
                  <div style={{
                    padding: 13,
                    backgroundColor: primary,
                    borderRadius: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginLeft: 10,
                  }}>
                    <svg width="12" height="12" viewBox="0 0 14 13" fill="none" style={{ transform: "rotate(-45deg)" }}>
                      <path d="M1 6.5h12M8 1l5 5.5L8 12" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </a>
              )}
            </div>
          </div>
        </ScrollReveal>

        {/* ═══ Advantages — 4 items in a row ═══ */}
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "60px 40px",
          width: "100%",
        }}>
          {highlights.slice(0, 4).map((hl, idx) => (
            <ScrollReveal key={idx} delay={100 + idx * 80}>
              <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 30,
                width: 300,
              }}>
                {/* Icon — 90x80, decorative SVG */}
                <div style={{
                  width: 90,
                  height: 80,
                  position: "relative",
                  overflow: "hidden",
                  color: secondary,
                }}>
                  {HIGHLIGHT_ICONS[idx % HIGHLIGHT_ICONS.length]}
                </div>

                {/* Title + description */}
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: 10,
                  width: "100%",
                }}>
                  <h5
                    style={{
                      fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                      fontSize: 22,
                      fontWeight: 500,
                      letterSpacing: "0em",
                      lineHeight: "1.2em",
                      color: primary,
                      margin: 0,
                    }}
                    data-pgl-path={`highlights.${idx}.label`}
                    data-pgl-edit="text"
                  >
                    {hl.label}
                  </h5>
                  <p
                    style={{
                      fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                      fontSize: 18,
                      fontWeight: 300,
                      letterSpacing: "0em",
                      lineHeight: "1.5em",
                      color: "var(--pgl-text-muted, #2e4d3a)",
                      margin: 0,
                      maxWidth: 305,
                    }}
                    data-pgl-path={`highlights.${idx}.value`}
                    data-pgl-edit="text"
                  >
                    {hl.value}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Responsive styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        .larko-about-base {
          padding: 130px 55px;
        }
        .larko-about-card-wrap {
          width: 100%;
          max-width: 1170px;
        }
        .larko-about-card {
          flex-direction: row;
          gap: 80px;
          padding: 20px 80px 20px 20px;
        }
        .larko-about-img-wrap {
          flex: 1;
          min-width: 0;
        }
        .larko-about-img {
          height: 650px;
        }
        .larko-about-content {
          flex: 1;
          min-width: 0;
          max-width: 45%;
          padding: 40px 0;
        }
        @media (max-width: 1279px) {
          .larko-about-base {
            padding: 100px 20px;
          }
          .larko-about-card {
            gap: 60px;
            padding: 20px 60px 20px 20px;
          }
          .larko-about-img {
            height: 540px;
          }
        }
        @media (max-width: 991px) {
          .larko-about-base {
            padding: 80px 20px;
          }
          .larko-about-card {
            flex-direction: column !important;
            gap: 40px !important;
            padding: 20px !important;
          }
          .larko-about-img-wrap {
            flex: none !important;
            width: 100% !important;
          }
          .larko-about-content {
            flex: none !important;
            max-width: 100% !important;
            width: 100% !important;
            padding: 0 !important;
            gap: 40px !important;
            justify-content: center !important;
          }
          .larko-about-img {
            height: 400px !important;
          }
        }
      `}} />
    </section>
  );
}
