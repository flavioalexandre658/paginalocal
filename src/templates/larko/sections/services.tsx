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
      <span key={i} style={{ color: accentColor }}>
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

/* ── Decorative SVG patterns for card backgrounds ── */
function CirclesPattern({ color }: { color: string }) {
  return (
    <svg
      width="90"
      height="180"
      viewBox="0 0 90 180"
      fill="none"
      style={{
        position: "absolute",
        right: 30,
        bottom: 30,
        width: "50%",
        height: "auto",
        maxHeight: 170,
        opacity: 0.15,
      }}
    >
      <circle cx="45" cy="45" r="40" stroke={color} strokeWidth="1.5" fill="none" />
      <circle cx="45" cy="45" r="25" stroke={color} strokeWidth="1.5" fill="none" />
      <circle cx="45" cy="135" r="40" stroke={color} strokeWidth="1.5" fill="none" />
      <circle cx="45" cy="135" r="25" stroke={color} strokeWidth="1.5" fill="none" />
    </svg>
  );
}

function LinesPattern({ color }: { color: string }) {
  return (
    <svg
      width="230"
      height="289"
      viewBox="0 0 230 289"
      fill="none"
      style={{
        position: "absolute",
        left: 0,
        bottom: 0,
        width: "60%",
        maxWidth: 200,
        height: "100%",
        opacity: 0.12,
      }}
    >
      {Array.from({ length: 12 }).map((_, i) => (
        <line
          key={i}
          x1={0}
          y1={i * 25}
          x2={230}
          y2={i * 25 + 60}
          stroke={color}
          strokeWidth="1"
        />
      ))}
    </svg>
  );
}

function TrianglesPattern({ color }: { color: string }) {
  return (
    <svg
      width="136"
      height="158"
      viewBox="0 0 136 158"
      fill="none"
      style={{
        position: "absolute",
        right: 30,
        bottom: 30,
        width: "50%",
        height: "auto",
        maxHeight: 170,
        opacity: 0.15,
      }}
    >
      <polygon points="68,10 126,80 10,80" stroke={color} strokeWidth="1.5" fill="none" />
      <polygon points="68,50 116,110 20,110" stroke={color} strokeWidth="1.5" fill="none" />
      <polygon points="68,90 106,140 30,140" stroke={color} strokeWidth="1.5" fill="none" />
    </svg>
  );
}

function GridPattern({ color }: { color: string }) {
  return (
    <svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      style={{
        position: "absolute",
        right: 30,
        bottom: 30,
        width: "45%",
        height: "auto",
        maxHeight: 160,
        opacity: 0.15,
      }}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <line key={`h${i}`} x1={0} y1={i * 30} x2={120} y2={i * 30} stroke={color} strokeWidth="1" />
      ))}
      {Array.from({ length: 5 }).map((_, i) => (
        <line key={`v${i}`} x1={i * 30} y1={0} x2={i * 30} y2={120} stroke={color} strokeWidth="1" />
      ))}
    </svg>
  );
}

const PATTERNS = [CirclesPattern, LinesPattern, TrianglesPattern, GridPattern];

/* ── Arrow icon component ── */
function ArrowIcon({ color }: { color: string }) {
  return (
    <svg
      width="14"
      height="13"
      viewBox="0 0 14 13"
      fill="none"
      style={{
        display: "block",
        transform: "rotate(-45deg)",
      }}
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

export function LarkoServices({ content, tokens }: Props) {
  const parsed = ServicesContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const primary = tokens.palette.primary;
  const accent = tokens.palette.accent;
  const secondary = tokens.palette.secondary;

  const surface = tokens.palette.surface;

  /* Card backgrounds: dark, dark, cream, dark (matches original Framer) */
  const cardVariants = [
    { bg: primary, textColor: "#ffffff", patternColor: "rgba(255,255,255,0.6)" },
    { bg: primary, textColor: "#ffffff", patternColor: "rgba(255,255,255,0.6)" },
    { bg: surface, textColor: primary, patternColor: primary },
    { bg: primary, textColor: "#ffffff", patternColor: "rgba(255,255,255,0.6)" },
  ];

  return (
    <section
      id="services"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        height: "min-content",
        padding: 0,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Inline styles for responsive + hover */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .pgl-larko-services-header {
              display: flex;
              flex-direction: column;
              gap: 16px;
              max-width: 1200px;
              width: 100%;
              padding: 80px 40px 40px 40px;
            }
            @media (max-width: 767px) {
              .pgl-larko-services-header {
                padding: 60px 24px 32px 24px;
              }
            }
            .pgl-larko-services-grid {
              display: flex;
              flex-flow: row;
              flex: 1 1 0%;
              justify-content: flex-start;
              align-items: flex-start;
              gap: 0;
              width: 100%;
              min-height: 440px;
              padding: 0;
              position: relative;
            }
            .pgl-larko-service-card {
              flex: 1 1 0%;
              min-width: 280px;
              height: auto;
              position: relative;
            }
            .pgl-larko-card-inner {
              cursor: pointer;
              display: flex;
              flex-flow: column;
              justify-content: space-between;
              align-items: flex-start;
              width: 100%;
              min-height: 440px;
              padding: 40px 30px 30px 30px;
              position: relative;
              text-decoration: none;
              overflow: hidden;
              transition: box-shadow 0.35s ease, transform 0.35s ease;
            }
            .pgl-larko-card-inner:hover {
              box-shadow: 0 8px 32px rgba(0,0,0,0.12);
            }
            .pgl-larko-card-inner:hover .pgl-larko-arrow-circle {
              transform: scale(1.08);
            }
            .pgl-larko-arrow-circle {
              transition: transform 0.3s ease, background-color 0.3s ease;
            }
            @media (max-width: 1279px) {
              .pgl-larko-services-grid {
                flex-wrap: wrap;
                min-height: auto;
              }
              .pgl-larko-service-card {
                min-width: 280px;
                flex: 1 1 calc(50% - 0px);
              }
              .pgl-larko-card-inner {
                min-height: 380px;
              }
            }
            @media (max-width: 767px) {
              .pgl-larko-services-grid {
                flex-direction: column;
              }
              .pgl-larko-service-card {
                width: 100%;
                min-width: 0;
              }
              .pgl-larko-card-inner {
                min-height: 360px;
              }
            }
          `,
        }}
      />

      {/* ── Section Header ── */}
      <ScrollReveal delay={0}>
        <div className="pgl-larko-services-header">
          {/* Subtitle */}
          {c.subtitle && (
            <h6
              style={{
                fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                fontSize: 18,
                fontWeight: 500,
                letterSpacing: "0em",
                lineHeight: "1.4em",
                color: primary,
                margin: 0,
              }}
              data-pgl-path="subtitle"
              data-pgl-edit="text"
            >
              {c.subtitle}
            </h6>
          )}

          {/* Title */}
          <h2
            style={{
              fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
              fontSize: "clamp(32px, 4vw, 50px)",
              fontWeight: 500,
              fontStyle: "normal",
              letterSpacing: "0em",
              lineHeight: "1.15em",
              color: "var(--pgl-text)",
              margin: 0,
              maxWidth: 700,
            }}
            data-pgl-path="title"
            data-pgl-edit="text"
          >
            {renderAccentText(c.title, accent)}
          </h2>
        </div>
      </ScrollReveal>

      {/* ── Cards Grid ── */}
      <div className="pgl-larko-services-grid">
        {c.items.map((item, idx) => {
          const variant = cardVariants[idx % cardVariants.length];
          const isDarkCard = variant.bg === primary;
          const numberColor = isDarkCard ? "#ffffff" : accent;
          const subtitleColor = isDarkCard
            ? "rgba(255,255,255,0.85)"
            : "var(--pgl-text-secondary, rgba(0,0,0,0.6))";
          const borderColor = isDarkCard
            ? "transparent"
            : "rgb(241, 241, 241)";
          const PatternComponent = PATTERNS[idx % PATTERNS.length];

          return (
            <div key={idx} className="pgl-larko-service-card">
              <ScrollReveal delay={idx * 100}>
                <div
                  className="pgl-larko-card-inner"
                  style={{
                    backgroundColor: variant.bg,
                    borderLeft: idx > 0 ? `1px solid ${borderColor}` : "none",
                  }}
                >
                  {/* ── Decorative pattern ── */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      overflow: "hidden",
                      pointerEvents: "none",
                    }}
                  >
                    <PatternComponent color={variant.patternColor} />
                  </div>

                  {/* ── Top: Number label + Icon circle ── */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      width: "100%",
                      gap: 12,
                      zIndex: 1,
                    }}
                  >
                    {/* Number badge */}
                    <span
                      style={{
                        fontFamily: "var(--pgl-font-heading), Georgia, serif",
                        fontSize: 14,
                        fontWeight: 500,
                        fontStyle: "italic",
                        letterSpacing: "0.05em",
                        lineHeight: "1.4em",
                        color: numberColor,
                        opacity: 0.7,
                      }}
                    >
                      {formatNumber(idx)}
                    </span>

                    {/* Icon circle */}
                    {item.icon && (
                      <div
                        style={{
                          width: 52,
                          height: 52,
                          borderRadius: 100,
                          backgroundColor: secondary,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <span
                          style={{ fontSize: 24, lineHeight: 1 }}
                          role="img"
                          aria-label={item.name}
                        >
                          {item.icon}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* ── Bottom: Title + Description + Arrow button ── */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 6,
                      width: "100%",
                      zIndex: 1,
                    }}
                  >
                    {/* Title wrapper */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        gap: 6,
                        width: "100%",
                      }}
                    >
                      {/* Service name as large heading */}
                      <h3
                        style={{
                          fontFamily:
                            "var(--pgl-font-heading), Georgia, serif",
                          fontSize: "clamp(28px, 3vw, 50px)",
                          fontWeight: 500,
                          fontStyle: "italic",
                          letterSpacing: "0em",
                          lineHeight: "1.2em",
                          color: variant.textColor,
                          margin: 0,
                        }}
                        data-pgl-path={`items.${idx}.name`}
                        data-pgl-edit="text"
                      >
                        {item.name}
                      </h3>

                      {/* Description */}
                      {item.description && (
                        <p
                          style={{
                            fontFamily:
                              "var(--pgl-font-body), system-ui, sans-serif",
                            fontSize: "clamp(16px, 1.5vw, 18px)",
                            fontWeight: 300,
                            letterSpacing: "0em",
                            lineHeight: "1.4em",
                            color: subtitleColor,
                            margin: 0,
                            maxWidth: 280,
                          }}
                          data-pgl-path={`items.${idx}.description`}
                          data-pgl-edit="text"
                        >
                          {item.description}
                        </p>
                      )}
                    </div>

                    {/* Arrow button */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10,
                        marginTop: 14,
                      }}
                    >
                      <div
                        className="pgl-larko-arrow-circle"
                        style={{
                          width: "min-content",
                          height: "min-content",
                          padding: 13,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "100%",
                          border: `1px solid ${isDarkCard ? "rgba(255,255,255,0.4)" : primary}`,
                          overflow: "hidden",
                        }}
                      >
                        <ArrowIcon
                          color={isDarkCard ? "#ffffff" : primary}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          );
        })}
      </div>
    </section>
  );
}
