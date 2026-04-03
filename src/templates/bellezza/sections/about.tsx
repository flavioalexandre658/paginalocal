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

export function BellezzaAbout({ content, tokens }: Props) {
  // Normalize paragraphs
  if (Array.isArray(content.paragraphs)) {
    content.paragraphs = (content.paragraphs as unknown[]).map((p) =>
      typeof p === "string"
        ? p
        : typeof p === "object" && p !== null && "text" in p
          ? String((p as Record<string, unknown>).text)
          : String(p)
    );
  }

  const parsed = AboutContentSchema.safeParse(content);
  if (!parsed.success) {
    console.error("[BellezzaAbout] Schema validation FAILED:", JSON.stringify(parsed.error.issues, null, 2));
    return null;
  }
  const c = parsed.data;

  const accent = tokens.palette.accent;
  const primary = tokens.palette.primary;

  return (
    <section
      id="about"
      style={{ backgroundColor: "var(--pgl-background, #fff)", overflow: "hidden" }}
    >
      <div
        className="flex flex-col md:flex-row px-5 py-16 md:px-[64px] md:py-[100px]"
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          gap: 64,
          alignItems: "center",
        }}
      >
        {/* Left — Large showcase image with rounded corners */}
        <div className="w-full md:flex-1 md:max-w-[600px]" style={{ flexShrink: 0 }}>
          <ScrollReveal delay={0}>
            <div
              style={{
                aspectRatio: "0.85",
                borderRadius: 32,
                overflow: "hidden",
                position: "relative",
              }}
              data-pgl-path="image"
              data-pgl-edit="image"
            >
              {c.image ? (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundImage: `url(${c.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    background: `linear-gradient(135deg, ${primary}15, ${accent}11, ${primary}08)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" opacity="0.25">
                    <rect x="8" y="8" width="48" height="48" rx="8" stroke={primary} strokeWidth="2" />
                    <circle cx="24" cy="24" r="6" stroke={primary} strokeWidth="2" />
                    <path d="M8 44l16-12 12 8 20-16" stroke={primary} strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
              )}
            </div>
          </ScrollReveal>
        </div>

        {/* Right — Content */}
        <div
          className="w-full md:flex-1"
          style={{ display: "flex", flexDirection: "column", gap: 0 }}
        >
          {/* Subtitle tag */}
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
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    backgroundColor: accent,
                  }}
                />
                <span
                  style={{
                    fontFamily: "var(--pgl-font-body), sans-serif",
                    fontSize: 13,
                    fontWeight: 500,
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

          {/* H2 title — Playfair Display 52px / 500 / 1.2em */}
          <ScrollReveal delay={200}>
            <h2
              style={{
                fontFamily: "var(--pgl-font-heading), serif",
                fontSize: "clamp(28px, 3.5vw, 52px)",
                fontWeight: 500,
                letterSpacing: "0em",
                lineHeight: "1.2em",
                color: "var(--pgl-text)",
                margin: 0,
                textTransform: "capitalize",
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
                  fontFamily: "var(--pgl-font-body), sans-serif",
                  fontSize: 16,
                  fontWeight: 400,
                  letterSpacing: "0em",
                  lineHeight: "1.7em",
                  color: "var(--pgl-text-muted)",
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

          {/* Additional paragraph */}
          {c.paragraphs[1] && (
            <ScrollReveal delay={350}>
              <p
                style={{
                  fontFamily: "var(--pgl-font-body), sans-serif",
                  fontSize: 16,
                  fontWeight: 400,
                  lineHeight: "1.7em",
                  color: "var(--pgl-text-muted)",
                  margin: 0,
                  marginTop: 12,
                  maxWidth: 520,
                }}
                data-pgl-path="paragraphs.1"
                data-pgl-edit="text"
              >
                {c.paragraphs[1]}
              </p>
            </ScrollReveal>
          )}

          {/* Highlights — feature items */}
          {c.highlights && c.highlights.length > 0 && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 0,
                marginTop: 32,
              }}
            >
              {c.highlights.map((highlight, idx) => (
                <ScrollReveal key={idx} delay={400 + idx * 100}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 16,
                      padding: "16px 0",
                      borderBottom:
                        idx < (c.highlights?.length ?? 0) - 1
                          ? "1px solid rgba(0,0,0,0.06)"
                          : "none",
                    }}
                  >
                    {/* Icon circle */}
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        backgroundColor: `${accent}15`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path
                          d="M7 10l2 2 4-4"
                          stroke={accent}
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <circle cx="10" cy="10" r="7" stroke={accent} strokeWidth="1.5" />
                      </svg>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <span
                        style={{
                          fontFamily: "var(--pgl-font-heading), serif",
                          fontSize: 16,
                          fontWeight: 600,
                          letterSpacing: "-0.01em",
                          lineHeight: "1.4em",
                          color: "var(--pgl-text)",
                        }}
                        data-pgl-path={`highlights.${idx}.label`}
                        data-pgl-edit="text"
                      >
                        {highlight.label}
                      </span>
                      {highlight.value && (
                        <span
                          style={{
                            fontFamily: "var(--pgl-font-body), sans-serif",
                            fontSize: 14,
                            fontWeight: 400,
                            lineHeight: "1.5em",
                            color: "var(--pgl-text-muted)",
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
              ))}
            </div>
          )}

          {/* CTA button — pill, accent bg */}
          <ScrollReveal delay={700}>
            <a
              href={c.ctaLink || "#contato"}
              data-pgl-path="ctaText"
              data-pgl-edit="button"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                marginTop: 32,
                padding: "14px 32px",
                backgroundColor: accent,
                borderRadius: 70,
                textDecoration: "none",
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
                  fontFamily: "var(--pgl-font-body), sans-serif",
                  fontSize: 16,
                  fontWeight: 500,
                  color: "#fff",
                  whiteSpace: "nowrap",
                }}
              >
                {c.ctaText || "Saiba mais"}
              </span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                <path d="M3 8h10M9 4l4 4-4 4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
