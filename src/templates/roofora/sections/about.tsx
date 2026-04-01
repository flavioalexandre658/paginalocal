"use client";

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
      <span key={i} style={{ color: accentColor }}>{part}</span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

/* ── Feature icons for highlights ── */
function TrustIcon({ color = "#CDF660" }: { color?: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path d="M14 3L4 8v6c0 7 4.2 13.5 10 15.4C19.8 27.5 24 21 24 14V8L14 3z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.5 14l3 3 6-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SkillIcon({ color = "#CDF660" }: { color?: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path d="M10 4h8l4 6-8 14-8-14 4-6z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 10h16" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M14 10v14" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function SpeedIcon({ color = "#CDF660" }: { color?: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path d="M15 3l-9 13h8l-1 9 9-13h-8l1-9z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const highlightIcons = [TrustIcon, SkillIcon, SpeedIcon];

export function RooforaAbout({ content, tokens }: Props) {
  const parsed = AboutContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const accent = tokens.palette.accent || "#CDF660";

  return (
    <section
      id="about"
      style={{ backgroundColor: "var(--pgl-background, #fff)", overflow: "hidden" }}
    >
      <div
        className="flex flex-col md:flex-row px-5 py-16 md:px-[30px] md:py-[100px]"
        style={{ maxWidth: 1296, margin: "0 auto", gap: 64, alignItems: "center" }}
      >
        {/* ── Left — Image with rounded corners ── */}
        <ScrollReveal delay={0} className="w-full md:flex-1 md:max-w-[560px]">
          <div
            style={{
              aspectRatio: "0.9",
              borderRadius: 20,
              overflow: "hidden",
              position: "relative",
              flexShrink: 0,
            }}
            data-pgl-path="image"
            data-pgl-edit="image"
          >
            {c.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={c.image}
                alt="Sobre nos"
                style={{
                  display: "block",
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background: `linear-gradient(135deg, #0E120122, ${accent}11, #0E120111)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none" opacity="0.3">
                  <rect x="8" y="8" width="48" height="48" rx="8" stroke="#0E1201" strokeWidth="2" />
                  <circle cx="24" cy="24" r="6" stroke="#0E1201" strokeWidth="2" />
                  <path d="M8 44l16-12 12 8 20-16" stroke="#0E1201" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
            )}
          </div>
        </ScrollReveal>

        {/* ── Right — Content ── */}
        <div
          className="w-full md:flex-1"
          style={{ display: "flex", flexDirection: "column", gap: 0 }}
        >
          {/* Tag "Sobre Nos" */}
          {c.subtitle && (
            <ScrollReveal delay={100}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 16px",
                  backgroundColor: `${accent}15`,
                  borderRadius: 100,
                  width: "fit-content",
                  marginBottom: 20,
                }}
              >
                <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: accent }} />
                <span
                  style={{
                    fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                    fontSize: 14,
                    fontWeight: 600,
                    letterSpacing: "0.05em",
                    lineHeight: "1.5em",
                    color: accent,
                    textTransform: "uppercase",
                  }}
                  data-pgl-path="subtitle"
                  data-pgl-edit="text"
                >
                  {c.subtitle}
                </span>
              </div>
            </ScrollReveal>
          )}

          {/* H2 title with accent words */}
          <ScrollReveal delay={200}>
            <h2
              style={{
                fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                fontSize: "clamp(28px, 3.5vw, 44px)",
                fontWeight: 600,
                letterSpacing: "-0.03em",
                lineHeight: "1.15em",
                color: "var(--pgl-text, #000)",
                margin: 0,
              }}
              data-pgl-path="title"
              data-pgl-edit="text"
            >
              {renderAccentText(c.title, accent)}
            </h2>
          </ScrollReveal>

          {/* Description paragraph */}
          {c.paragraphs[0] && (
            <ScrollReveal delay={300}>
              <p
                style={{
                  fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                  fontSize: 16,
                  fontWeight: 400,
                  letterSpacing: "0em",
                  lineHeight: "1.7em",
                  color: "rgba(0,0,0,0.6)",
                  margin: 0,
                  marginTop: 20,
                  maxWidth: 520,
                }}
                data-pgl-path="paragraphs.0"
                data-pgl-edit="text"
              >
                {c.paragraphs[0]}
              </p>
            </ScrollReveal>
          )}

          {/* ── 3 Feature items in a column ── */}
          {c.highlights && c.highlights.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 0, marginTop: 32 }}>
              {c.highlights.map((highlight, idx) => {
                const IconComp = highlightIcons[idx] || TrustIcon;
                return (
                  <ScrollReveal key={idx} delay={350 + idx * 100}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 16,
                        padding: "16px 0",
                        borderBottom: idx < (c.highlights?.length ?? 0) - 1 ? "1px solid rgba(0,0,0,0.08)" : "none",
                      }}
                    >
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 12,
                          backgroundColor: "#0E1201",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <IconComp color={accent} />
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <span
                          style={{
                            fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                            fontSize: 16,
                            fontWeight: 600,
                            letterSpacing: "-0.01em",
                            lineHeight: "1.4em",
                            color: "var(--pgl-text, #000)",
                          }}
                          data-pgl-path={`highlights.${idx}.label`}
                          data-pgl-edit="text"
                        >
                          {highlight.label}
                        </span>
                        {highlight.value && (
                          <span
                            style={{
                              fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                              fontSize: 14,
                              fontWeight: 400,
                              lineHeight: "1.5em",
                              color: "rgba(0,0,0,0.5)",
                            }}
                            data-pgl-path={`highlights.${idx}.value`}
                            data-pgl-edit="text"
                          >
                            {highlight.value}
                          </span>
                        )}
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          )}

          {/* CTA link at bottom */}
          <ScrollReveal delay={650}>
            <a
              href="#contato"
              data-pgl-path="paragraphs.1"
              data-pgl-edit="button"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                marginTop: 32,
                padding: "14px 32px",
                backgroundColor: accent,
                borderRadius: 100,
                textDecoration: "none",
                maxWidth: "100%",
                transition: "opacity 0.2s, transform 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.9";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <span
                style={{
                  fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                  fontSize: 16,
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                  color: "#0E1201",
                  whiteSpace: "nowrap",
                }}
              >
                {c.paragraphs[1] || "Saiba Mais"}
              </span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                <path d="M3 8h10M9 4l4 4-4 4" stroke="#0E1201" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
