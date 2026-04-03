"use client";

import type { DesignTokens } from "@/types/ai-generation";
import { GalleryContentSchema } from "@/types/ai-generation";
import { ScrollReveal } from "./scroll-reveal";

interface Props {
  content: Record<string, unknown>;
  tokens: DesignTokens;
  isDark?: boolean;
}

/* ── Render accent text: *wrapped* parts get italic serif + accent color ── */
function renderAccentText(text: string, accentColor: string) {
  return text.split(/\*([^*]+)\*/).map((part, i) =>
    i % 2 === 1 ? (
      <span
        key={i}
        style={{
          color: accentColor,
          fontStyle: "italic",
          fontFamily: "var(--pgl-font-heading), Georgia, 'Times New Roman', serif",
        }}
      >
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

/* ── Arrow icon (diagonal arrow for the button) ── */
function ArrowIcon({ color }: { color: string }) {
  return (
    <svg
      width="14"
      height="13"
      viewBox="0 0 14 13"
      fill="none"
      style={{ display: "block", transform: "rotate(-45deg)" }}
    >
      <path
        d="M1 6.5h12M7.5 1l5.5 5.5L7.5 12"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ── Number formatting: 001, 002, 003... ── */
function formatNumber(idx: number): string {
  return String(idx + 1).padStart(3, "0");
}

export function LarkoGallery({ content, tokens }: Props) {
  const parsed = GalleryContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const primary = tokens.palette.primary;
  const accent = tokens.palette.accent;
  const textMuted = tokens.palette.textMuted;

  return (
    <section
      id="gallery"
      style={{
        display: "flex",
        flexFlow: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "min-content",
        padding: 0,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ── Responsive styles + hover interactions ── */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .pgl-larko-gallery-section {
              padding: 130px 0;
            }
            .pgl-larko-gallery-container {
              display: flex;
              flex-direction: column;
              flex: 1 1 0%;
              min-width: 0;
              justify-content: flex-start;
              align-items: flex-start;
              gap: 60px;
              max-width: 1440px;
              height: min-content;
              padding: 0 55px;
              position: relative;
              overflow: visible;
            }
            .pgl-larko-gallery-top {
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              align-items: center;
              width: 100%;
              height: min-content;
              padding: 0;
              position: relative;
            }
            .pgl-larko-gallery-title {
              flex: 1 1 0%;
              min-width: 0;
              max-width: 810px;
              height: auto;
              position: relative;
            }
            .pgl-larko-gallery-content {
              display: flex;
              flex-direction: column;
              justify-content: flex-start;
              align-items: flex-start;
              gap: 0;
              width: 100%;
              height: min-content;
              padding: 0;
              position: relative;
            }
            .pgl-larko-gallery-subtitle-row {
              display: flex;
              flex-direction: row;
              justify-content: flex-start;
              align-items: center;
              gap: 6px;
              width: 100%;
              height: min-content;
              padding: 0 0 20px 0;
              position: relative;
            }
            .pgl-larko-gallery-subtitle-border {
              position: absolute;
              bottom: 0;
              left: 0;
              right: 0;
              height: 1px;
              overflow: hidden;
            }
            .pgl-larko-gallery-items {
              display: flex;
              flex-direction: column;
              justify-content: flex-start;
              align-items: flex-start;
              gap: 0;
              width: 100%;
              height: min-content;
              padding: 0;
              position: relative;
            }
            .pgl-larko-gallery-item {
              cursor: pointer;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              gap: 60px;
              width: 100%;
              height: min-content;
              padding: 50px 0 0 0;
              text-decoration: none;
              position: relative;
            }
            .pgl-larko-gallery-item-row {
              display: flex;
              flex-direction: row;
              justify-content: center;
              align-items: center;
              gap: 60px;
              width: 100%;
              height: min-content;
              padding: 0;
              position: relative;
            }
            .pgl-larko-gallery-number-wrap {
              display: flex;
              flex-direction: column;
              justify-content: flex-start;
              align-items: flex-start;
              gap: 0;
              width: min-content;
              height: min-content;
              padding: 0;
              position: relative;
              overflow: hidden;
            }
            .pgl-larko-gallery-img-wrap {
              display: flex;
              flex-direction: row;
              justify-content: center;
              align-items: center;
              gap: 0;
              width: min-content;
              height: min-content;
              padding: 0;
              border-radius: 6px;
              position: relative;
              overflow: hidden;
            }
            .pgl-larko-gallery-img-inner {
              width: 190px;
              height: 210px;
              position: relative;
              overflow: hidden;
              transition: transform 0.4s ease;
            }
            .pgl-larko-gallery-item:hover .pgl-larko-gallery-img-inner {
              transform: scale(1.05);
            }
            .pgl-larko-gallery-img-inner img {
              display: block;
              width: 100%;
              height: 100%;
              object-fit: cover;
              object-position: center;
              border-radius: inherit;
            }
            .pgl-larko-gallery-title-wrap {
              display: flex;
              flex-direction: row;
              flex: 1 1 0%;
              min-width: 0;
              justify-content: flex-start;
              align-items: center;
              gap: 60px;
              height: min-content;
              padding: 0;
              position: relative;
            }
            .pgl-larko-gallery-item-title {
              flex: 1 1 0%;
              min-width: 0;
              max-width: 380px;
              height: auto;
              position: relative;
            }
            .pgl-larko-gallery-item-desc {
              flex: 1 1 0%;
              min-width: 0;
              height: auto;
              position: relative;
            }
            .pgl-larko-gallery-arrow-btn {
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 14px 29px;
              border-radius: 6px;
              border: 1px solid var(--pgl-border, #f1f1f1);
              background-color: #fff;
              cursor: pointer;
              position: relative;
              overflow: hidden;
              transition: background-color 0.3s ease;
            }
            .pgl-larko-gallery-arrow-btn:hover {
              background-color: #f3f3f3;
            }
            .pgl-larko-gallery-line-wrap {
              display: flex;
              flex-direction: row;
              justify-content: flex-start;
              align-items: center;
              gap: 0;
              width: 100%;
              height: min-content;
              min-height: 1px;
              padding: 0;
              position: relative;
              overflow: hidden;
            }
            .pgl-larko-gallery-line {
              width: 0%;
              position: absolute;
              top: 0;
              bottom: 0;
              left: 0;
              overflow: hidden;
              transition: width 0.5s ease;
            }
            .pgl-larko-gallery-item:hover .pgl-larko-gallery-line {
              width: 100%;
            }

            /* ── Responsive: Tablet ── */
            @media (max-width: 1199px) {
              .pgl-larko-gallery-section {
                padding: 80px 0;
              }
              .pgl-larko-gallery-container {
                padding: 0 20px;
                flex-wrap: wrap;
              }
              .pgl-larko-gallery-top {
                flex-direction: column;
                justify-content: flex-start;
                align-items: flex-start;
                gap: 40px;
              }
              .pgl-larko-gallery-title {
                max-width: 660px;
              }
            }

            /* ── Responsive: Mobile ── */
            @media (max-width: 767px) {
              .pgl-larko-gallery-section {
                padding: 80px 0;
              }
              .pgl-larko-gallery-container {
                padding: 0 20px;
                flex-wrap: wrap;
              }
              .pgl-larko-gallery-top {
                flex-direction: column;
                justify-content: flex-start;
                align-items: flex-start;
                gap: 40px;
              }
              .pgl-larko-gallery-title {
                flex: none;
                order: 1;
                width: 100%;
                max-width: 660px;
              }
              .pgl-larko-gallery-item {
                flex-flow: wrap;
                width: 100%;
                padding: 40px 0;
              }
              .pgl-larko-gallery-item-row {
                flex-direction: column;
                align-items: flex-start;
                gap: 30px;
              }
              .pgl-larko-gallery-number-wrap {
                flex-direction: row;
              }
              .pgl-larko-gallery-img-wrap {
                width: 100%;
              }
              .pgl-larko-gallery-img-inner {
                flex: 1 1 0%;
                min-width: 0;
                min-width: 280px;
                height: 350px;
              }
              .pgl-larko-gallery-title-wrap {
                flex-direction: column;
                flex: none;
                align-items: flex-start;
                gap: 10px;
                width: 100%;
              }
              .pgl-larko-gallery-item-title {
                flex: none;
                width: 100%;
                max-width: unset;
              }
              .pgl-larko-gallery-item-desc {
                flex: none;
                width: 100%;
                max-width: 460px;
              }
            }
          `,
        }}
      />

      <div className="pgl-larko-gallery-section" style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <div className="pgl-larko-gallery-container">
          {/* ── Top: Title row ── */}
          <ScrollReveal delay={0}>
            <div className="pgl-larko-gallery-top">
              <div className="pgl-larko-gallery-title">
                <h2
                  style={{
                    fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                    fontSize: "clamp(35px, 3.5vw, 50px)",
                    fontWeight: 500,
                    fontStyle: "normal",
                    letterSpacing: "0em",
                    lineHeight: "1.2em",
                    color: primary,
                    margin: 0,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                  data-pgl-path="title"
                  data-pgl-edit="text"
                >
                  {renderAccentText(c.title, textMuted)}
                </h2>
              </div>
            </div>
          </ScrollReveal>

          {/* ── Content: Subtitle + Portfolio items ── */}
          <div className="pgl-larko-gallery-content">
            {/* Subtitle row with border */}
            {c.subtitle && (
              <ScrollReveal delay={100}>
                <div className="pgl-larko-gallery-subtitle-row">
                  <h6
                    style={{
                      fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                      fontSize: 18,
                      fontWeight: 500,
                      letterSpacing: "0em",
                      lineHeight: "1.2em",
                      color: primary,
                      margin: 0,
                      whiteSpace: "pre",
                    }}
                    data-pgl-path="subtitle"
                    data-pgl-edit="text"
                  >
                    {c.subtitle}
                  </h6>
                  <div
                    className="pgl-larko-gallery-subtitle-border"
                    style={{ backgroundColor: "var(--pgl-border, #f1f1f1)" }}
                  />
                </div>
              </ScrollReveal>
            )}

            {/* Portfolio items list */}
            <div className="pgl-larko-gallery-items">
              {c.images.map((image, idx) => (
                <ScrollReveal key={idx} delay={150 + idx * 100}>
                  <div className="pgl-larko-gallery-item">
                    <div className="pgl-larko-gallery-item-row">
                      {/* Number */}
                      <div className="pgl-larko-gallery-number-wrap">
                        <p
                          style={{
                            fontFamily: "var(--pgl-font-body), 'Inter', system-ui, sans-serif",
                            fontSize: 18,
                            fontWeight: 300,
                            letterSpacing: "0em",
                            lineHeight: "1.5em",
                            color: accent,
                            margin: 0,
                            whiteSpace: "pre",
                          }}
                        >
                          {formatNumber(idx)}
                        </p>
                      </div>

                      {/* Image */}
                      <div className="pgl-larko-gallery-img-wrap">
                        <div className="pgl-larko-gallery-img-inner">
                          {image.url ? (
                            <img
                              src={image.url}
                              alt={image.alt || image.caption || ""}
                              loading="lazy"
                              data-pgl-path={`images.${idx}.url`}
                              data-pgl-edit="image"
                            />
                          ) : (
                            <div
                              style={{
                                width: "100%",
                                height: "100%",
                                backgroundColor: "var(--pgl-border, #f1f1f1)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                              data-pgl-path={`images.${idx}.url`}
                              data-pgl-edit="image"
                            >
                              <svg
                                width="48"
                                height="48"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke={textMuted}
                                strokeWidth="1"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                style={{ opacity: 0.4 }}
                              >
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                <circle cx="8.5" cy="8.5" r="1.5" />
                                <polyline points="21 15 16 10 5 21" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Title + Description wrapper */}
                      <div className="pgl-larko-gallery-title-wrap">
                        <div className="pgl-larko-gallery-item-title">
                          <h3
                            style={{
                              fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                              fontSize: "clamp(26px, 2.2vw, 30px)",
                              fontWeight: 500,
                              letterSpacing: "0em",
                              lineHeight: "1.2em",
                              color: primary,
                              margin: 0,
                              whiteSpace: "pre-wrap",
                              wordBreak: "break-word",
                            }}
                            data-pgl-path={`images.${idx}.caption`}
                            data-pgl-edit="text"
                          >
                            {image.caption || `Project ${formatNumber(idx)}`}
                          </h3>
                        </div>

                        {image.alt && (
                          <div className="pgl-larko-gallery-item-desc">
                            <p
                              style={{
                                fontFamily: "var(--pgl-font-body), 'Inter', system-ui, sans-serif",
                                fontSize: "clamp(16px, 1.3vw, 18px)",
                                fontWeight: 300,
                                letterSpacing: "0em",
                                lineHeight: "1.5em",
                                color: "var(--pgl-text-secondary, #2e4d3a)",
                                margin: 0,
                                whiteSpace: "pre-wrap",
                                wordBreak: "break-word",
                              }}
                              data-pgl-path={`images.${idx}.alt`}
                              data-pgl-edit="text"
                            >
                              {image.alt}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Arrow button */}
                      <button
                        className="pgl-larko-gallery-arrow-btn"
                        type="button"
                        tabIndex={0}
                        aria-label={`View ${image.caption || `project ${idx + 1}`}`}
                      >
                        <ArrowIcon color={primary} />
                      </button>
                    </div>

                    {/* Animated bottom border line */}
                    <div
                      className="pgl-larko-gallery-line-wrap"
                      style={{ backgroundColor: "var(--pgl-border, #f1f1f1)" }}
                    >
                      <div
                        className="pgl-larko-gallery-line"
                        style={{ backgroundColor: accent }}
                      />
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
