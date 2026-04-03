"use client";

import type { DesignTokens } from "@/types/ai-generation";
import { ServicesContentSchema } from "@/types/ai-generation";
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
          color: accentColor,
          fontFamily: "var(--pgl-font-heading), Georgia, serif",
          fontStyle: "italic",
        }}
      >
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

/* ── Down-right arrow 10x10 ── */
function DownRightArrow({ color }: { color: string }) {
  return (
    <svg
      width={10}
      height={10}
      viewBox="0 0 10 10"
      fill="none"
      style={{ display: "block", flexShrink: 0 }}
    >
      <path
        d="M1 1l8 8M9 1v8H1"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ── Right arrow 12x12 ── */
function ArrowRight({ color, size = 12 }: { color: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 12 12"
      fill="none"
      style={{ display: "block" }}
    >
      <path
        d="M1 6h10M7 1l4.5 5L7 11"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LarkoSolutions({ content, tokens }: Props) {
  const parsed = ServicesContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const primary = tokens.palette.primary;
  const accent = tokens.palette.accent;
  const secondary = tokens.palette.secondary;
  const surface = tokens.palette.surface;
  const textMuted = tokens.palette.textMuted;

  const items = c.items.slice(0, 6);

  return (
    <section
      id="services"
      style={{
        display: "flex",
        flexFlow: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        padding: "130px 0",
        overflow: "hidden",
      }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
            /* ── Container ── */
            .lk-sol-base {
              display: flex;
              flex-direction: column;
              gap: 60px;
              max-width: 1440px;
              width: 100%;
              padding: 0 55px;
            }

            /* ── Top row ── */
            .lk-sol-top {
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              align-items: flex-start;
              width: 100%;
            }

            /* ── Bottom area ── */
            .lk-sol-bottom {
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              gap: 20px;
              width: 100%;
            }

            /* ── Cards stack ── */
            .lk-sol-cards {
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              width: 100%;
            }

            /* ── Single card ── */
            .lk-sol-card {
              cursor: pointer;
              display: flex;
              flex-direction: row;
              justify-content: flex-start;
              align-items: flex-start;
              gap: 70px;
              width: 100%;
              max-width: 1170px;
              padding: 80px 40px;
              text-decoration: none;
              position: relative;
              border-top: 1px solid var(--pgl-border, #f1f1f1);
            }

            /* ── Image wrapper ── */
            .lk-sol-card .lk-sol-img-wrap {
              flex: 1 1 0%;
              min-width: 0;
              border-radius: 6px;
              overflow: hidden;
            }
            .lk-sol-card .lk-sol-img-inner {
              width: 100%;
              height: 340px;
              position: relative;
              overflow: hidden;
              border-radius: 6px;
            }
            .lk-sol-card .lk-sol-img-inner img {
              display: block;
              width: 100%;
              height: 100%;
              object-fit: cover;
              border-radius: inherit;
              transition: transform 0.5s ease;
            }
            .lk-sol-card:hover .lk-sol-img-inner img {
              transform: scale(1.05);
            }

            /* ── Text wrapper ── */
            .lk-sol-card .lk-sol-text {
              display: flex;
              flex-direction: column;
              flex: 1 1 0%;
              min-width: 0;
              justify-content: space-between;
              align-self: stretch;
              align-items: flex-start;
              padding-left: 50px;
              border-left: 1px solid var(--pgl-border, #f1f1f1);
            }

            /* ── Tag row ── */
            .lk-sol-tags {
              display: flex;
              flex-direction: row;
              align-items: center;
              gap: 10px;
              width: 100%;
            }

            /* ── Tag pill ── */
            .lk-sol-tag {
              position: relative;
              display: flex;
              flex-direction: column;
              align-items: center;
              width: min-content;
              overflow: hidden;
            }
            .lk-sol-tag-def {
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 5px 10px;
              border-radius: 6px;
              border: 1px solid var(--pgl-border, #f1f1f1);
              background-color: #f3f3f3;
              white-space: nowrap;
              transition: transform 0.35s ease, opacity 0.35s ease;
            }
            .lk-sol-tag-hov {
              position: absolute;
              bottom: -40px;
              left: 0;
              width: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 5px 10px;
              border-radius: 6px;
              white-space: nowrap;
              z-index: 1;
              transition: transform 0.35s ease, opacity 0.35s ease;
            }
            .lk-sol-card:hover .lk-sol-tag-def {
              transform: translateY(-40px);
              opacity: 0;
            }
            .lk-sol-card:hover .lk-sol-tag-hov {
              transform: translateY(-40px);
            }

            /* ── Title area ── */
            .lk-sol-title-area {
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              gap: 20px;
              width: 100%;
            }

            /* ── Sliding title ── */
            .lk-sol-title-slide {
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              width: 100%;
              overflow: hidden;
              position: relative;
            }
            .lk-sol-title-main {
              transition: transform 0.4s ease, opacity 0.4s ease;
            }
            .lk-sol-title-dup {
              position: absolute;
              bottom: -100%;
              left: 0;
              width: 100%;
              z-index: 1;
              transition: transform 0.4s ease, opacity 0.4s ease;
            }
            .lk-sol-card:hover .lk-sol-title-main {
              transform: translateY(-100%);
              opacity: 0;
            }
            .lk-sol-card:hover .lk-sol-title-dup {
              transform: translateY(-100%);
            }

            /* ── Arrow button ── */
            .lk-sol-arrow-btn {
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 14px 29px;
              border-radius: 6px;
              border: 1px solid var(--pgl-border, #f1f1f1);
              background-color: #fff;
              position: relative;
              overflow: hidden;
              transition: background-color 0.35s ease;
            }
            .lk-sol-card:hover .lk-sol-arrow-btn {
              background-color: #f3f3f3;
            }
            .lk-sol-arrow-btn .lk-sol-btn-icon {
              position: relative;
              z-index: 1;
              display: flex;
              align-items: center;
              justify-content: center;
            }

            /* ── Accent line at bottom ── */
            .lk-sol-accent-line-wrap {
              position: absolute;
              bottom: 0;
              left: 0;
              right: 0;
              height: 2px;
              overflow: hidden;
              z-index: 1;
            }
            .lk-sol-accent-line {
              position: absolute;
              top: 0;
              bottom: 0;
              left: 0;
              width: 0%;
              transition: width 0.6s ease;
            }
            .lk-sol-card:hover .lk-sol-accent-line {
              width: 100%;
            }

            /* ── Bottom divider ── */
            .lk-sol-divider {
              width: 100%;
              height: 1px;
              background-color: var(--pgl-border, #f1f1f1);
              flex-shrink: 0;
            }

            /* ── CTA button ── */
            .lk-sol-cta {
              cursor: pointer;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              width: 100%;
              padding: 28px;
              border-radius: 6px;
              border: 1px solid var(--pgl-border, #f1f1f1);
              background-color: #fff;
              text-decoration: none;
              position: relative;
              overflow: hidden;
            }
            .lk-sol-cta-wrap {
              display: flex;
              flex-direction: column;
              align-items: center;
              width: min-content;
              overflow: hidden;
              position: relative;
            }
            .lk-sol-cta-def {
              white-space: nowrap;
              transition: transform 0.35s ease, opacity 0.35s ease;
            }
            .lk-sol-cta-hov {
              position: absolute;
              bottom: -30px;
              left: 0;
              right: 0;
              z-index: 1;
              white-space: nowrap;
              transition: transform 0.35s ease, opacity 0.35s ease;
            }
            .lk-sol-cta:hover .lk-sol-cta-def {
              transform: translateY(-30px);
              opacity: 0;
            }
            .lk-sol-cta:hover .lk-sol-cta-hov {
              transform: translateY(-30px);
            }

            /* ── Responsive: 1279px ── */
            @media (max-width: 1279px) {
              .lk-sol-card {
                max-width: 992px;
                padding: 60px 40px;
                gap: 60px;
              }
              .lk-sol-card .lk-sol-img-inner {
                height: 260px;
              }
            }

            /* ── Responsive: 991px ── */
            @media (max-width: 991px) {
              .lk-sol-card {
                flex-direction: column;
                max-width: 100%;
                padding: 40px 0;
                gap: 30px;
              }
              .lk-sol-card .lk-sol-img-inner {
                height: 350px;
              }
              .lk-sol-card .lk-sol-text {
                padding-left: 0;
                border-left: none;
                gap: 20px;
              }
            }

            /* ── Responsive: 767px ── */
            @media (max-width: 767px) {
              .lk-sol-base {
                gap: 32px;
                padding: 0 20px;
              }
              .lk-sol-top {
                flex-direction: column;
                gap: 20px;
              }
              section#services {
                padding: 80px 0;
              }
              .lk-sol-card .lk-sol-img-inner {
                height: 220px;
              }
            }
          `,
        }}
      />

      <div className="lk-sol-base">
        {/* ── Top row: subtitle left, title right ── */}
        <div className="lk-sol-top">
          <ScrollReveal delay={0}>
            {c.subtitle && (
              <h6
                style={{
                  fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                  fontSize: 18,
                  fontWeight: 500,
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
            )}
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <h2
              style={{
                fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                fontSize: "clamp(32px, 4vw, 50px)",
                fontWeight: 500,
                lineHeight: "1.2em",
                color: primary,
                margin: 0,
                maxWidth: 860,
                wordBreak: "break-word",
              }}
              data-pgl-path="title"
              data-pgl-edit="text"
            >
              {renderAccentText(c.title, textMuted)}
            </h2>
          </ScrollReveal>
        </div>

        {/* ── Bottom: label + cards + CTA ── */}
        <div className="lk-sol-bottom">
          {/* "Choose Growth" label */}
          <ScrollReveal delay={150}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
              }}
            >
              <h6
                style={{
                  fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                  fontSize: 18,
                  fontWeight: 500,
                  lineHeight: "1.2em",
                  color: primary,
                  margin: 0,
                  whiteSpace: "nowrap",
                }}
              >
                {c.subtitle || "Choose Growth"}
              </h6>
              <DownRightArrow color={primary} />
            </div>
          </ScrollReveal>

          {/* ── Cards ── */}
          <div className="lk-sol-cards">
            {items.map((item, idx) => {
              const categoryLabel = item.icon || item.name.split(" ")[0];
              const outputLabel = item.ctaText || item.name;

              return (
                <ScrollReveal key={idx} delay={200 + idx * 100}>
                  <div className="lk-sol-card">
                    {/* ── Left: Image ── */}
                    <div
                      className="lk-sol-img-wrap"
                      data-pgl-path={`items.${idx}.image`}
                      data-pgl-edit="image"
                    >
                      <div className="lk-sol-img-inner">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            loading="lazy"
                          />
                        ) : (
                          <div
                            style={{
                              width: "100%",
                              height: "100%",
                              backgroundColor: surface,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <span style={{ fontSize: 48, opacity: 0.3 }}>
                              {item.icon || ""}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* ── Right: Text ── */}
                    <div className="lk-sol-text">
                      {/* Tags row */}
                      <div className="lk-sol-tags">
                        {/* Category tag */}
                        <div className="lk-sol-tag">
                          <div className="lk-sol-tag-def">
                            <p
                              style={{
                                fontFamily:
                                  "var(--pgl-font-body), system-ui, sans-serif",
                                fontSize: 16,
                                fontWeight: 500,
                                lineHeight: "1.5em",
                                color: primary,
                                margin: 0,
                                whiteSpace: "nowrap",
                              }}
                            >
                              {categoryLabel}
                            </p>
                          </div>
                          <div
                            className="lk-sol-tag-hov"
                            style={{ backgroundColor: textMuted }}
                          >
                            <p
                              style={{
                                fontFamily:
                                  "var(--pgl-font-body), system-ui, sans-serif",
                                fontSize: 16,
                                fontWeight: 500,
                                lineHeight: "1.5em",
                                color: "#ffffff",
                                margin: 0,
                                whiteSpace: "nowrap",
                              }}
                            >
                              {categoryLabel}
                            </p>
                          </div>
                        </div>

                        {/* Output tag */}
                        <div className="lk-sol-tag">
                          <div className="lk-sol-tag-def">
                            <p
                              style={{
                                fontFamily:
                                  "var(--pgl-font-body), system-ui, sans-serif",
                                fontSize: 16,
                                fontWeight: 500,
                                lineHeight: "1.5em",
                                color: primary,
                                margin: 0,
                                whiteSpace: "nowrap",
                              }}
                            >
                              {outputLabel}
                            </p>
                          </div>
                          <div
                            className="lk-sol-tag-hov"
                            style={{ backgroundColor: textMuted }}
                          >
                            <p
                              style={{
                                fontFamily:
                                  "var(--pgl-font-body), system-ui, sans-serif",
                                fontSize: 16,
                                fontWeight: 500,
                                lineHeight: "1.5em",
                                color: "#ffffff",
                                margin: 0,
                                whiteSpace: "nowrap",
                              }}
                            >
                              {outputLabel}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Subtitle + sliding title */}
                      <div className="lk-sol-title-area">
                        <h6
                          style={{
                            fontFamily:
                              "var(--pgl-font-heading), system-ui, sans-serif",
                            fontSize: 18,
                            fontWeight: 500,
                            lineHeight: "1.2em",
                            color: primary,
                            margin: 0,
                          }}
                          data-pgl-path={`items.${idx}.description`}
                          data-pgl-edit="text"
                        >
                          {item.description}
                        </h6>

                        <div className="lk-sol-title-slide">
                          <h3
                            className="lk-sol-title-main"
                            style={{
                              fontFamily:
                                "var(--pgl-font-heading), system-ui, sans-serif",
                              fontSize: "clamp(24px, 2.5vw, 30px)",
                              fontWeight: 500,
                              lineHeight: "1.2em",
                              color: primary,
                              margin: 0,
                              width: "100%",
                            }}
                            data-pgl-path={`items.${idx}.name`}
                            data-pgl-edit="text"
                          >
                            {item.name}
                          </h3>
                          <h3
                            className="lk-sol-title-dup"
                            style={{
                              fontFamily:
                                "var(--pgl-font-heading), system-ui, sans-serif",
                              fontSize: "clamp(24px, 2.5vw, 30px)",
                              fontWeight: 500,
                              lineHeight: "1.2em",
                              color: accent,
                              margin: 0,
                              width: "100%",
                            }}
                          >
                            {item.name}
                          </h3>
                        </div>
                      </div>

                      {/* Arrow button */}
                      <div className="lk-sol-arrow-btn">
                        <div className="lk-sol-btn-icon">
                          <ArrowRight color={primary} size={12} />
                        </div>
                      </div>
                    </div>

                    {/* Accent line at bottom */}
                    <div className="lk-sol-accent-line-wrap">
                      <div
                        className="lk-sol-accent-line"
                        style={{ backgroundColor: accent }}
                      />
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>

          {/* Bottom divider */}
          <div className="lk-sol-divider" />

          {/* "Explore All Solutions" CTA */}
          <ScrollReveal delay={200 + items.length * 100}>
            <div className="lk-sol-cta">
              <div className="lk-sol-cta-wrap">
                <p
                  className="lk-sol-cta-def"
                  style={{
                    fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                    fontSize: 16,
                    fontWeight: 500,
                    lineHeight: "1.5em",
                    color: primary,
                    margin: 0,
                    textAlign: "center",
                  }}
                >
                  Explore All Solutions
                </p>
                <p
                  className="lk-sol-cta-hov"
                  style={{
                    fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                    fontSize: 16,
                    fontWeight: 500,
                    lineHeight: "1.5em",
                    color: accent,
                    margin: 0,
                    textAlign: "center",
                  }}
                >
                  Explore All Solutions
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
