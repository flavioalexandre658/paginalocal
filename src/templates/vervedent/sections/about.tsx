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
    i % 2 === 1 ? <span key={i} style={{ color: accentColor }}>{part}</span> : <span key={i}>{part}</span>
  );
}

export function VerveAbout({ content, tokens }: Props) {
  if (Array.isArray(content.paragraphs)) {
    content.paragraphs = (content.paragraphs as unknown[]).map((p) =>
      typeof p === "string" ? p : typeof p === "object" && p !== null && "text" in p ? String((p as Record<string, unknown>).text) : String(p)
    );
  }

  const parsed = AboutContentSchema.safeParse(content);
  if (!parsed.success) {
    console.error("[VerveAbout] Schema validation FAILED:", JSON.stringify(parsed.error.issues, null, 2));
    return null;
  }
  const c = parsed.data;

  const accent = tokens.palette.accent;
  const primary = tokens.palette.primary;
  const secondary = tokens.palette.secondary;

  const address = c.highlights?.[0]?.value || "";

  const featureHighlights = c.highlights?.slice(address ? 1 : 0) || [];

  return (
    <section
      id="about"
      style={{ backgroundColor: "var(--pgl-background)", overflow: "hidden" }}
    >
      <div
        className="flex flex-col md:flex-row px-6 py-16 md:px-12 md:py-[120px]"
        style={{ maxWidth: 1200, margin: "0 auto", gap: 64, alignItems: "flex-start" }}
      >
        {/* ── Left — Image with dot pattern + address badge ── */}
        <div className="w-full md:flex-1" style={{ position: "relative", flexShrink: 0 }}>
          <ScrollReveal delay={0}>
            {/* Dot pattern — top-left behind image */}
            <div
              style={{
                position: "absolute",
                top: -20,
                left: -20,
                width: 140,
                height: 140,
                zIndex: 0,
                backgroundImage: `radial-gradient(${accent} 2px, transparent 2px)`,
                backgroundSize: "16px 16px",
                opacity: 0.7,
              }}
            />

            {/* Image */}
            <div
              style={{
                position: "relative",
                zIndex: 1,
                borderRadius: 0,
                overflow: "hidden",
                aspectRatio: "1.4",
              }}
              data-pgl-path="image"
              data-pgl-edit="image"
            >
              {c.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={c.image}
                  alt="About"
                  style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <div style={{
                  width: "100%", height: "100%", minHeight: 300,
                  background: `linear-gradient(135deg, ${primary}11, ${accent}08)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" opacity="0.15">
                    <rect x="8" y="8" width="48" height="48" rx="4" stroke="var(--pgl-text)" strokeWidth="2" />
                    <circle cx="24" cy="24" r="6" stroke="var(--pgl-text)" strokeWidth="2" />
                    <path d="M8 44l16-12 12 8 20-16" stroke="var(--pgl-text)" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
              )}

              {/* Address badge — bottom-right of image */}
              {address && (
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    backgroundColor: primary,
                    padding: "16px 28px",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    zIndex: 2,
                    borderRadius: 0,
                    maxWidth: 260,
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
                    <path d="M10 2a5.5 5.5 0 015.5 5.5c0 4-5.5 10.5-5.5 10.5S4.5 11.5 4.5 7.5A5.5 5.5 0 0110 2z" stroke={accent} strokeWidth="1.5" />
                    <circle cx="10" cy="7.5" r="1.5" stroke={accent} strokeWidth="1.5" />
                  </svg>
                  <span
                    style={{
                      fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                      fontSize: 14, fontWeight: 400, color: "#fff", lineHeight: "1.5em",
                      textAlign: "center",
                      whiteSpace: "pre-line",
                    }}
                    data-pgl-path="highlights.0.value"
                    data-pgl-edit="text"
                  >
                    {address}
                  </span>
                </div>
              )}
            </div>
          </ScrollReveal>
        </div>

        {/* ── Right — Content ── */}
        <div className="w-full md:flex-1" style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          {/* Tag */}
          {c.subtitle && (
            <ScrollReveal delay={100}>
              <span
                style={{
                  fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                  fontSize: 16, fontWeight: 600, color: secondary,
                  lineHeight: "1.4em",
                }}
                data-pgl-path="subtitle"
                data-pgl-edit="text"
              >
                {c.subtitle}
              </span>
            </ScrollReveal>
          )}

          {/* H2 */}
          <ScrollReveal delay={150}>
            <h2
              style={{
                fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 600,
                letterSpacing: "0em", lineHeight: "1.1em",
                color: "var(--pgl-text)", margin: 0,
              }}
              data-pgl-path="title"
              data-pgl-edit="text"
            >
              {renderAccentText(c.title, secondary)}
            </h2>
          </ScrollReveal>

          {/* Description */}
          {c.paragraphs[0] && (
            <ScrollReveal delay={200}>
              <p
                style={{
                  fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                  fontSize: 16, fontWeight: 300, lineHeight: "1.4em",
                  color: "var(--pgl-text-muted)", margin: 0, maxWidth: 480,
                }}
                data-pgl-path="paragraphs.0"
                data-pgl-edit="text"
              >
                {c.paragraphs[0]}
              </p>
            </ScrollReveal>
          )}

          {/* Highlight features — 2 columns */}
          {featureHighlights.length > 0 && (
            <div style={{ marginTop: 16 }}>
              {/* Top separator line */}
              <div style={{ height: 1, backgroundColor: "var(--pgl-border, #e6e6e6)" }} />

              <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 0 }}>
                {featureHighlights.map((h, idx) => {
                  const hlIdx = address ? idx + 1 : idx;
                  return (
                    <ScrollReveal key={idx} delay={250 + idx * 80}>
                      <div style={{ padding: "28px 24px 28px 0" }}>
                        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" style={{ marginBottom: 20 }}>
                          {idx % 2 === 0 ? (
                            /* Trophy icon */
                            <>
                              <path d="M12 6h12v8a6 6 0 01-12 0V6z" stroke={secondary} strokeWidth="1.5" fill="none" />
                              <path d="M12 10H8a2 2 0 000 4h4M24 10h4a2 2 0 010 4h-4" stroke={secondary} strokeWidth="1.5" />
                              <path d="M18 20v4M14 24h8" stroke={secondary} strokeWidth="1.5" strokeLinecap="round" />
                            </>
                          ) : (
                            /* Sparkle/star icon */
                            <>
                              <path d="M18 4l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" stroke={secondary} strokeWidth="1.5" fill="none" />
                              <circle cx="28" cy="8" r="2" stroke={secondary} strokeWidth="1" />
                              <circle cx="8" cy="28" r="1.5" stroke={secondary} strokeWidth="1" />
                            </>
                          )}
                        </svg>
                        <h4
                          style={{
                            fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                            fontSize: 18, fontWeight: 600, lineHeight: "1.2em",
                            color: "var(--pgl-text)", margin: "0 0 10px",
                          }}
                          data-pgl-path={`highlights.${hlIdx}.label`}
                          data-pgl-edit="text"
                        >
                          {h.label}
                        </h4>
                        <p
                          style={{
                            fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                            fontSize: 14, fontWeight: 300, lineHeight: "1.4em",
                            color: "var(--pgl-text-muted)", margin: 0,
                          }}
                          data-pgl-path={`highlights.${hlIdx}.value`}
                          data-pgl-edit="text"
                        >
                          {h.value}
                        </p>
                      </div>
                    </ScrollReveal>
                  );
                })}
              </div>

              {/* Bottom separator line */}
              <div style={{ height: 1, backgroundColor: "var(--pgl-border, #e6e6e6)" }} />
            </div>
          )}

          {/* CTA — outline, border-radius 0 (quadrado) */}
          {c.ctaText && (
            <ScrollReveal delay={400}>
              <a
                href="#services"
                data-pgl-path="ctaText"
                data-pgl-edit="button"
                style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  height: 52, padding: "0 32px",
                  backgroundColor: "transparent",
                  border: `1.5px solid ${secondary}`,
                  borderRadius: 0,
                  textDecoration: "none",
                  width: "fit-content",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = `${primary}08`; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
              >
                <span style={{
                  fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                  fontSize: 16, fontWeight: 400, color: secondary, whiteSpace: "nowrap",
                }}>
                  {c.ctaText}
                </span>
              </a>
            </ScrollReveal>
          )}
        </div>
      </div>
    </section>
  );
}
