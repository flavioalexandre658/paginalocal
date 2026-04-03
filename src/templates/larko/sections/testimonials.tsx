"use client";

import { useState, useCallback } from "react";
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

function renderHighlightedQuote(text: string, primaryColor: string) {
  return text.split(/\*([^*]+)\*/).map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} style={{ color: primaryColor, fontWeight: 600 }}>
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

/* ── Quote icon SVG ── */
function QuoteIcon({ color }: { color: string }) {
  return (
    <svg
      width="65"
      height="60"
      viewBox="0 0 113 103"
      fill="none"
      style={{ display: "block" }}
    >
      <path
        d="M0 63.3C0 36.9 15.8 14.3 46.2 0L51.8 10.5C34.4 20.2 24.6 34.6 22.4 52.8H46.2V103H0V63.3ZM61.6 63.3C61.6 36.9 77.4 14.3 107.8 0L113 10.5C95.6 20.2 86.2 34.6 84 52.8H107.8V103H61.6V63.3Z"
        fill={color}
      />
    </svg>
  );
}

/* ── Arrow icon for nav buttons ── */
function ArrowIcon({ color = "currentColor" }: { color?: string }) {
  return (
    <svg
      width="14"
      height="13"
      viewBox="0 0 14 13"
      fill="none"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="1" y1="6.5" x2="13" y2="6.5" />
      <polyline points="7.5 1 13 6.5 7.5 12" />
    </svg>
  );
}

/* ── CTA Arrow icon (circle + arrow) ── */
function CtaArrowIcon({ bgColor, arrowColor }: { bgColor: string; arrowColor: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 40,
        height: 40,
        borderRadius: "50%",
        backgroundColor: bgColor,
        flexShrink: 0,
      }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        stroke={arrowColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="2" y1="8" x2="14" y2="8" />
        <polyline points="9 3 14 8 9 13" />
      </svg>
    </div>
  );
}

const CSS = `
  /* ── Section ── */
  .pgl-larko-testimonials-section {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: 130px 0;
    position: relative;
    overflow: hidden;
  }
  @media (max-width: 1279px) {
    .pgl-larko-testimonials-section {
      padding: 80px 0;
    }
  }
  @media (max-width: 991px) {
    .pgl-larko-testimonials-section {
      padding: 60px 0;
    }
  }

  /* ── Base container ── */
  .pgl-larko-testimonials-base {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 100px;
    max-width: 1440px;
    width: 100%;
    padding: 0 55px;
    position: relative;
  }
  @media (max-width: 1279px) {
    .pgl-larko-testimonials-base {
      padding: 0 20px;
    }
  }
  @media (max-width: 991px) {
    .pgl-larko-testimonials-base {
      padding: 0 20px;
      gap: 60px;
    }
  }

  /* ── Top wrapper (white card) ── */
  .pgl-larko-testimonials-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    padding: 0;
    background-color: #ffffff;
    border: 1px solid var(--pgl-border, #f1f1f1);
    border-radius: 10px;
    overflow: visible;
    position: relative;
  }

  /* ── Content + Image row ── */
  .pgl-larko-testimonials-top {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 80px;
    width: 100%;
    padding: 20px 20px 20px 80px;
    position: relative;
  }
  @media (max-width: 1279px) {
    .pgl-larko-testimonials-top {
      gap: 60px;
      padding: 20px 20px 20px 60px;
    }
  }
  @media (max-width: 991px) {
    .pgl-larko-testimonials-top {
      flex-direction: column;
      gap: 40px;
      padding: 20px;
    }
  }

  /* ── Content side ── */
  .pgl-larko-testimonials-content {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
    align-self: stretch;
    align-items: flex-start;
    justify-content: space-between;
    max-width: 45%;
    padding: 40px 0;
    position: relative;
    gap: 0;
  }
  @media (max-width: 991px) {
    .pgl-larko-testimonials-content {
      flex: none;
      width: 100%;
      max-width: 100%;
      align-self: unset;
      justify-content: center;
      gap: 40px;
      padding: 0;
      order: 1;
    }
  }

  /* ── Image wrapper ── */
  .pgl-larko-testimonials-img-wrap {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    overflow: hidden;
    position: relative;
  }
  .pgl-larko-testimonials-img-wrap img {
    display: block;
    width: 100%;
    height: 650px;
    object-fit: cover;
    object-position: 65% 50%;
    border-radius: inherit;
  }
  @media (max-width: 1279px) {
    .pgl-larko-testimonials-img-wrap img {
      height: 540px;
    }
  }
  @media (max-width: 991px) {
    .pgl-larko-testimonials-img-wrap {
      flex: none;
      width: 100%;
      order: 0;
    }
    .pgl-larko-testimonials-img-wrap img {
      height: 400px;
    }
  }

  /* ── Carousel area ── */
  .pgl-larko-testimonials-carousel {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 1170px;
    max-width: 100%;
    padding: 120px 0 0;
    border-top: 1px solid var(--pgl-border, #f1f1f1);
    position: relative;
    overflow: visible;
  }
  @media (max-width: 991px) {
    .pgl-larko-testimonials-carousel {
      width: 100%;
      padding: 60px 0 0;
    }
  }

  /* ── Slides row ── */
  .pgl-larko-testimonials-slides {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 80px;
    width: 100%;
    padding: 0 20px 0 90px;
    position: relative;
  }
  @media (max-width: 991px) {
    .pgl-larko-testimonials-slides {
      flex-direction: column;
      gap: 20px;
      padding: 0 20px;
    }
  }

  /* ── Testimonial item ── */
  .pgl-larko-testimonials-item {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 30px;
    padding: 40px 0;
    position: relative;
    overflow: hidden;
  }
  @media (max-width: 991px) {
    .pgl-larko-testimonials-item {
      flex: none;
      width: 100%;
    }
  }

  /* ── Author wrapper ── */
  .pgl-larko-testimonials-author {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 12px;
    width: 100%;
    position: relative;
  }

  /* ── Author image ── */
  .pgl-larko-testimonials-author-img {
    flex-shrink: 0;
    width: 70px;
    height: 70px;
    border-radius: 6px;
    overflow: hidden;
    position: relative;
  }
  .pgl-larko-testimonials-author-img img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    border-radius: inherit;
  }

  /* ── Author text ── */
  .pgl-larko-testimonials-author-text {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
    align-items: flex-start;
    justify-content: center;
    gap: 6px;
  }

  /* ── Nav buttons wrapper ── */
  .pgl-larko-testimonials-nav {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100%;
  }

  /* ── Nav button base ── */
  .pgl-larko-testimonials-nav-btn {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex: 1;
    min-width: 0;
    padding: 28px;
    border: 1px solid var(--pgl-border, #f1f1f1);
    background-color: #ffffff;
    cursor: pointer;
    transition: background-color 0.2s ease;
    position: relative;
  }
  .pgl-larko-testimonials-nav-btn:hover {
    background-color: var(--pgl-border, #f1f1f1);
  }
  .pgl-larko-testimonials-nav-btn--prev {
    border-radius: 0 0 0 10px;
  }
  .pgl-larko-testimonials-nav-btn--next {
    border-radius: 0 0 10px 0;
    border-left: none;
  }
  @media (max-width: 991px) {
    .pgl-larko-testimonials-nav-btn {
      padding: 16px 16px 16px 24px;
    }
    .pgl-larko-testimonials-nav-btn--next {
      padding: 16px 24px 16px 16px;
    }
  }

  /* ── Icon block inside nav ── */
  .pgl-larko-testimonials-icon-block {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 14px 29px;
    border-radius: 6px;
    border: 1px solid var(--pgl-border, #f1f1f1);
    background-color: #ffffff;
    position: relative;
    overflow: hidden;
  }
  .pgl-larko-testimonials-icon-block-bg {
    position: absolute;
    inset: 0;
    background-color: #f3f3f3;
    border-radius: inherit;
    opacity: 0;
    transition: opacity 0.2s ease;
    z-index: 1;
  }
  .pgl-larko-testimonials-nav-btn:hover .pgl-larko-testimonials-icon-block-bg {
    opacity: 1;
  }

  /* ── Quote icon position ── */
  .pgl-larko-testimonials-quote {
    position: absolute;
    top: -40px;
    left: 20px;
    z-index: 1;
    width: 65px;
    height: 65px;
    overflow: hidden;
  }
  @media (max-width: 991px) {
    .pgl-larko-testimonials-quote {
      position: relative;
      top: unset;
      left: unset;
      margin-bottom: 10px;
      margin-left: 20px;
    }
  }
`;

export function LarkoTestimonials({ content, tokens }: Props) {
  const [page, setPage] = useState(0);

  const parsed = TestimonialsContentSchema.safeParse(content);
  const items = parsed.success ? parsed.data.items : [];
  const itemsPerPage = 2;
  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));

  const goPrev = useCallback(() => {
    setPage((p) => (p > 0 ? p - 1 : totalPages - 1));
  }, [totalPages]);

  const goNext = useCallback(() => {
    setPage((p) => (p < totalPages - 1 ? p + 1 : 0));
  }, [totalPages]);

  if (!parsed.success) return null;
  const c = parsed.data;

  const primary = tokens.palette.primary;
  const accent = tokens.palette.accent;
  const textMuted = tokens.palette.textMuted;
  const secondary = tokens.palette.secondary;
  const surface = tokens.palette.surface;

  const visibleItems = c.items.slice(
    page * itemsPerPage,
    page * itemsPerPage + itemsPerPage
  );

  return (
    <section
      id="testimonials"
      className="pgl-larko-testimonials-section"
      style={{
        backgroundColor: surface,
        borderTop: "1px solid var(--pgl-border, #f1f1f1)",
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="pgl-larko-testimonials-base">
        {/* ── Top wrapper (white card) ── */}
        <ScrollReveal delay={0}>
          <div className="pgl-larko-testimonials-card">
            {/* ── Content + Image row ── */}
            <div className="pgl-larko-testimonials-top">
              {/* LEFT - Content */}
              <div className="pgl-larko-testimonials-content">
                {/* Subtitle italic text */}
                {c.subtitle && (
                  <p
                    style={{
                      fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                      fontStyle: "italic",
                      fontSize: "clamp(20px, 2vw, 25px)",
                      fontWeight: 500,
                      lineHeight: "1.2em",
                      letterSpacing: "0em",
                      color: primary,
                      maxWidth: 350,
                      margin: 0,
                    }}
                    data-pgl-path="subtitle"
                    data-pgl-edit="text"
                  >
                    {renderAccentText(c.subtitle, accent)}
                  </p>
                )}

                {/* Text wrapper: Title + Body */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: 40,
                    width: "100%",
                  }}
                >
                  {/* Title */}
                  <h2
                    style={{
                      fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                      fontSize: "clamp(32px, 4vw, 50px)",
                      fontWeight: 500,
                      lineHeight: "1.2em",
                      letterSpacing: "0em",
                      color: primary,
                      margin: 0,
                      width: "100%",
                    }}
                    data-pgl-path="title"
                    data-pgl-edit="text"
                  >
                    {renderAccentText(c.title, accent)}
                  </h2>

                  {/* Body text */}
                  {c.items[0]?.text && (
                    <p
                      style={{
                        fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                        fontSize: 18,
                        fontWeight: 300,
                        lineHeight: "1.5em",
                        letterSpacing: "0em",
                        color: textMuted,
                        maxWidth: 580,
                        margin: 0,
                      }}
                    >
                      {c.items[0].text.replace(/\*/g, "")}
                    </p>
                  )}
                </div>

                {/* CTA Button - lime pill */}
                <a
                  href="#contact"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0,
                    padding: "6px 6px 6px 20px",
                    borderRadius: 50,
                    backgroundColor: secondary,
                    textDecoration: "none",
                    transition: "opacity 0.2s ease",
                    cursor: "pointer",
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
                    Ver depoimentos
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
              </div>

              {/* RIGHT - Image */}
              <div
                className="pgl-larko-testimonials-img-wrap"
                data-pgl-path="items.0.image"
                data-pgl-edit="image"
              >
                {c.items[0]?.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={c.items[0].image}
                    alt={c.title.replace(/\*/g, "")}
                  />
                ) : (
                  <div style={{
                    width: "100%",
                    height: 650,
                    background: `linear-gradient(135deg, ${surface}, ${accent}11)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "inherit",
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

            {/* ── Testimonials carousel ── */}
            <ScrollReveal delay={100}>
              <div className="pgl-larko-testimonials-carousel">
                {/* Quote icon */}
                <div className="pgl-larko-testimonials-quote">
                  <QuoteIcon color={accent} />
                </div>

                {/* Slides row */}
                <div className="pgl-larko-testimonials-slides">
                  {visibleItems.map((item, idx) => {
                    const globalIdx = page * itemsPerPage + idx;
                    return (
                      <div
                        key={globalIdx}
                        className="pgl-larko-testimonials-item"
                      >
                        {/* Quote text */}
                        <div
                          style={{
                            fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                            fontSize: "clamp(26px, 3vw, 40px)",
                            fontWeight: 500,
                            lineHeight: "1.4em",
                            letterSpacing: "0em",
                            color: textMuted,
                            width: "100%",
                            margin: 0,
                          }}
                          data-pgl-path={`items.${globalIdx}.text`}
                          data-pgl-edit="text"
                        >
                          {renderHighlightedQuote(item.text, primary)}
                        </div>

                        {/* Author row */}
                        <div className="pgl-larko-testimonials-author">
                          <div
                            className="pgl-larko-testimonials-author-img"
                            data-pgl-path={`items.${globalIdx}.image`}
                            data-pgl-edit="image"
                          >
                            {item.image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={item.image}
                                alt={item.author}
                              />
                            ) : (
                              <div style={{
                                width: "100%",
                                height: "100%",
                                background: `linear-gradient(135deg, ${surface}, ${accent}22)`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: "inherit",
                              }}>
                                <span style={{
                                  fontFamily: "var(--pgl-font-heading)",
                                  fontSize: 22,
                                  fontWeight: 600,
                                  color: accent,
                                }}>
                                  {item.author.charAt(0)}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="pgl-larko-testimonials-author-text">
                            <h5
                              style={{
                                fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                                fontSize: 22,
                                fontWeight: 500,
                                lineHeight: "1.2em",
                                letterSpacing: "0em",
                                color: accent,
                                margin: 0,
                              }}
                              data-pgl-path={`items.${globalIdx}.author`}
                              data-pgl-edit="text"
                            >
                              {item.author}
                            </h5>

                            {item.role && (
                              <p
                                style={{
                                  fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                                  fontSize: 18,
                                  fontWeight: 300,
                                  lineHeight: "1.4em",
                                  letterSpacing: "0em",
                                  color: textMuted,
                                  margin: 0,
                                }}
                                data-pgl-path={`items.${globalIdx}.role`}
                                data-pgl-edit="text"
                              >
                                {item.role}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* ── Navigation row ── */}
                {c.items.length > itemsPerPage && (
                  <div className="pgl-larko-testimonials-nav">
                    <button
                      type="button"
                      className="pgl-larko-testimonials-nav-btn pgl-larko-testimonials-nav-btn--prev"
                      onClick={goPrev}
                      aria-label="Anterior"
                    >
                      <span
                        style={{
                          fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                          fontSize: 16,
                          fontWeight: 500,
                          lineHeight: "1.4em",
                          letterSpacing: "0em",
                          color: primary,
                          textAlign: "center",
                          flex: 1,
                          minWidth: 0,
                        }}
                      >
                        Anterior
                      </span>
                      <div
                        className="pgl-larko-testimonials-icon-block"
                        style={{ transform: "rotate(180deg)" }}
                      >
                        <div className="pgl-larko-testimonials-icon-block-bg" />
                        <ArrowIcon color={primary} />
                      </div>
                    </button>

                    <button
                      type="button"
                      className="pgl-larko-testimonials-nav-btn pgl-larko-testimonials-nav-btn--next"
                      onClick={goNext}
                      aria-label="Próximo"
                    >
                      <span
                        style={{
                          fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                          fontSize: 16,
                          fontWeight: 500,
                          lineHeight: "1.4em",
                          letterSpacing: "0em",
                          color: primary,
                          textAlign: "center",
                          flex: 1,
                          minWidth: 0,
                        }}
                      >
                        Próximo
                      </span>
                      <div className="pgl-larko-testimonials-icon-block">
                        <div className="pgl-larko-testimonials-icon-block-bg" />
                        <ArrowIcon color={primary} />
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </ScrollReveal>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
