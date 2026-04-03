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
      <span key={i} style={{ color: accentColor }}>{part}</span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

/* ── Step Icons (centered watermark, ~184px, opacity 0.25) ── */
function StepWatermark({ index }: { index: number }) {
  const icons = [
    // Lightbulb / Idea
    <svg key="0" width="184" height="184" viewBox="0 0 184 184" fill="none">
      <circle cx="92" cy="72" r="40" stroke="var(--pgl-text)" strokeWidth="4" />
      <path d="M72 112h40M78 126h28M84 140h16" stroke="var(--pgl-text)" strokeWidth="4" strokeLinecap="round" />
      <path d="M76 72c0-8.837 7.163-16 16-16" stroke="var(--pgl-text)" strokeWidth="4" strokeLinecap="round" />
    </svg>,
    // Compass / Design & Build
    <svg key="1" width="180" height="180" viewBox="0 0 180 180" fill="none">
      <circle cx="90" cy="90" r="60" stroke="var(--pgl-text)" strokeWidth="4" />
      <circle cx="90" cy="90" r="6" fill="var(--pgl-text)" />
      <path d="M90 30v16M90 134v16M30 90h16M134 90h16" stroke="var(--pgl-text)" strokeWidth="4" strokeLinecap="round" />
      <path d="M70 110l8-28 28-8-8 28z" stroke="var(--pgl-text)" strokeWidth="4" strokeLinejoin="round" />
    </svg>,
    // Rocket / Launch & Care
    <svg key="2" width="184" height="184" viewBox="0 0 184 184" fill="none">
      <path d="M112 72a20 20 0 1 0-28.28-28.28A20 20 0 0 0 112 72z" stroke="var(--pgl-text)" strokeWidth="4" />
      <path d="M132 32s20 8 16 48c-2 20-20 40-20 40l-16-16M52 132l-16-16s16-18 36-22c40-6 52 16 52 16" stroke="var(--pgl-text)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M36 148l24-24M52 148l12-12M36 132l12-12" stroke="var(--pgl-text)" strokeWidth="4" strokeLinecap="round" />
    </svg>,
  ];
  return icons[index % icons.length];
}

/* Card rotations: -4deg, 0deg, +4deg */
const CARD_ROTATIONS = [-4, 0, 4];

export function FolioxaProcess({ content, tokens }: Props) {
  const parsed = ServicesContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const accent = tokens.palette.accent;

  return (
    <section
      id="process"
      style={{ backgroundColor: "var(--pgl-background)", overflow: "hidden" }}
    >
      <div
        className="px-5 md:px-10 py-16 md:py-[100px]"
        style={{ maxWidth: 1310, margin: "0 auto" }}
      >
        {/* ═══ Header ═══ */}
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          gap: 16, marginBottom: 56,
        }}>
          {c.subtitle && (
            <ScrollReveal delay={0}>
              <div style={{
                display: "inline-flex", alignItems: "center",
                padding: "8px 16px",
                backgroundColor: "var(--pgl-surface, #f7f7f7)",
                border: "1px solid var(--pgl-border, #edeff3)",
                borderRadius: 8,
              }}>
                <span style={{
                  fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                  fontSize: 16, fontWeight: 400, color: "var(--pgl-text)",
                }}
                  data-pgl-path="subtitle"
                  data-pgl-edit="text"
                >
                  {c.subtitle}
                </span>
              </div>
            </ScrollReveal>
          )}
          <ScrollReveal delay={50}>
            <h2 style={{
              fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
              fontSize: "clamp(28px, 3.5vw, 40px)",
              fontWeight: 500,
              lineHeight: "1.2em",
              color: "var(--pgl-text)",
              margin: 0,
              textAlign: "center",
            }}
              data-pgl-path="title"
              data-pgl-edit="text"
            >
              {renderAccentText(c.title, accent)}
            </h2>
          </ScrollReveal>
        </div>

        {/* ═══ Cards Row with Arrows ═══ */}
        <div style={{
          display: "flex", justifyContent: "center", position: "relative",
        }}>
          {/* Desktop: 3 cards inline with arrows */}
          <div className="hidden md:flex" style={{
            alignItems: "center", gap: 0, position: "relative",
          }}>
            {c.items.slice(0, 3).map((item, idx) => (
              <div key={idx} style={{ display: "flex", alignItems: "center" }}>
                <ScrollReveal delay={100 + idx * 120}>
                  {/* Card — outer wrapper */}
                  <div style={{
                    width: 320,
                    backgroundColor: "#fff",
                    borderRadius: 20,
                    boxShadow: "rgba(0,0,0,0.05) 0px 0px 14px 0px",
                    transform: `rotate(${CARD_ROTATIONS[idx]}deg)`,
                    transition: "transform 0.3s ease",
                  }}>
                    {/* Inner container */}
                    <div style={{
                      background: "linear-gradient(180deg, #fff 52%, var(--pgl-surface, #fafaf7) 100%)",
                      borderRadius: 16,
                      border: "1px solid var(--pgl-border, #edeff3)",
                      padding: "28px 24px",
                      display: "flex",
                      flexDirection: "column",
                      minHeight: 380,
                      position: "relative",
                      overflow: "hidden",
                    }}>
                      {/* Text section — top */}
                      <div style={{ position: "relative", zIndex: 2 }}>
                        {/* Step number */}
                        <h4 style={{
                          fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                          fontSize: 18, fontWeight: 400,
                          color: "var(--pgl-text-muted)",
                          margin: "0 0 8px",
                        }}>
                          {String(idx + 1).padStart(2, "0")}
                        </h4>
                        {/* Step title */}
                        <h3 style={{
                          fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                          fontSize: 24, fontWeight: 600,
                          lineHeight: "1.2em",
                          color: "var(--pgl-text)",
                          margin: 0,
                        }}
                          data-pgl-path={`items.${idx}.name`}
                          data-pgl-edit="text"
                        >
                          {item.name}
                        </h3>
                      </div>

                      {/* Watermark icon — centered, 25% opacity */}
                      <div style={{
                        position: "absolute",
                        top: "50%", left: "50%",
                        transform: "translate(-50%, -50%)",
                        opacity: 0.25,
                        zIndex: 1,
                        pointerEvents: "none",
                      }}>
                        <StepWatermark index={idx} />
                      </div>

                      {/* Spacer */}
                      <div style={{ flex: 1 }} />

                      {/* Separator line */}
                      <div style={{
                        height: 1, width: "100%",
                        backgroundColor: "var(--pgl-border, #edeff3)",
                        marginBottom: 16,
                        position: "relative", zIndex: 2,
                      }} />

                      {/* Description — bottom */}
                      <p style={{
                        fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                        fontSize: 15, fontWeight: 400,
                        lineHeight: "1.6em",
                        color: "var(--pgl-text)",
                        opacity: 0.7,
                        margin: 0,
                        position: "relative", zIndex: 2,
                      }}
                        data-pgl-path={`items.${idx}.description`}
                        data-pgl-edit="text"
                      >
                        {item.description}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>

                {/* Arrow connector between cards */}
                {idx < 2 && (
                  <div style={{
                    width: 81, height: 38,
                    flexShrink: 0,
                    margin: "0 -8px",
                    zIndex: 5,
                    transform: idx === 1 ? "rotate(-7deg)" : "none",
                  }}>
                    <svg width="81" height="38" viewBox="0 0 81 38" fill="none">
                      {idx === 0 ? (
                        /* Arrow 1: curves down then right */
                        <path
                          d="M 0 26.904 C 0 26.904 6.699 -12.45 72 10.904 M 62 0 L 73.5 11.5 L 59.5 14.5"
                          fill="transparent"
                          stroke="var(--pgl-text-muted, rgb(163,163,163))"
                          strokeWidth="2.4"
                          strokeLinecap="butt"
                          strokeLinejoin="miter"
                          strokeMiterlimit="4"
                          transform="translate(4 6)"
                        />
                      ) : (
                        /* Arrow 2: curves up then right */
                        <path
                          d="M 0 0 C 0 0 6.699 39.354 72 16 M 62 26.904 L 73.5 15.404 L 59.5 12.404"
                          fill="transparent"
                          stroke="var(--pgl-text-muted, rgb(163,163,163))"
                          strokeWidth="2.4"
                          strokeLinecap="butt"
                          strokeLinejoin="miter"
                          strokeMiterlimit="4"
                          transform="translate(4 6)"
                        />
                      )}
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile: stacked cards, no rotation, no arrows */}
          <div className="flex md:hidden flex-col" style={{ gap: 20, width: "100%" }}>
            {c.items.slice(0, 3).map((item, idx) => (
              <ScrollReveal key={idx} delay={100 + idx * 120}>
                {/* Card — outer wrapper */}
                <div style={{
                  backgroundColor: "#fff",
                  borderRadius: 20,
                  boxShadow: "rgba(0,0,0,0.05) 0px 0px 14px 0px",
                }}>
                  {/* Inner container */}
                  <div style={{
                    background: "linear-gradient(180deg, #fff 52%, var(--pgl-surface, #fafaf7) 100%)",
                    borderRadius: 16,
                    border: "1px solid var(--pgl-border, #edeff3)",
                    padding: "28px 24px",
                    display: "flex",
                    flexDirection: "column",
                    minHeight: 340,
                    position: "relative",
                    overflow: "hidden",
                  }}>
                    {/* Text section — top */}
                    <div style={{ position: "relative", zIndex: 2 }}>
                      <h4 style={{
                        fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                        fontSize: 18, fontWeight: 400,
                        color: "var(--pgl-text-muted)",
                        margin: "0 0 8px",
                      }}>
                        {String(idx + 1).padStart(2, "0")}
                      </h4>
                      <h3 style={{
                        fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                        fontSize: 24, fontWeight: 600,
                        lineHeight: "1.2em",
                        color: "var(--pgl-text)",
                        margin: 0,
                      }}
                        data-pgl-path={`items.${idx}.name`}
                        data-pgl-edit="text"
                      >
                        {item.name}
                      </h3>
                    </div>

                    {/* Watermark icon */}
                    <div style={{
                      position: "absolute",
                      top: "50%", left: "50%",
                      transform: "translate(-50%, -50%)",
                      opacity: 0.25,
                      zIndex: 1,
                      pointerEvents: "none",
                    }}>
                      <StepWatermark index={idx} />
                    </div>

                    <div style={{ flex: 1 }} />

                    {/* Separator */}
                    <div style={{
                      height: 1, width: "100%",
                      backgroundColor: "var(--pgl-border, #edeff3)",
                      marginBottom: 16,
                      position: "relative", zIndex: 2,
                    }} />

                    {/* Description */}
                    <p style={{
                      fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                      fontSize: 15, fontWeight: 400,
                      lineHeight: "1.6em",
                      color: "var(--pgl-text)",
                      opacity: 0.7,
                      margin: 0,
                      position: "relative", zIndex: 2,
                    }}
                      data-pgl-path={`items.${idx}.description`}
                      data-pgl-edit="text"
                    >
                      {item.description}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
