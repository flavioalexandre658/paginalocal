"use client";

import type { DesignTokens } from "@/types/ai-generation";
import { ScrollReveal } from "./scroll-reveal";
import { CtaContentSchema } from "@/types/ai-generation";

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

export function FolioxaCta({ content, tokens }: Props) {
  const parsed = CtaContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const accent = tokens.palette.accent;
  const primary = tokens.palette.primary;
  const secondary = tokens.palette.secondary;

  return (
    <section
      id="cta"
      style={{ backgroundColor: "var(--pgl-background)", overflow: "hidden" }}
    >
      <div
        className="px-5 md:px-10 py-16 md:py-[100px]"
        style={{ maxWidth: 1310, margin: "0 auto" }}
      >
        {/* ═══ Outer wrapper — double-layer card ═══ */}
        <ScrollReveal delay={0}>
          <div style={{
            backgroundColor: "#fff",
            borderRadius: 20,
            boxShadow: "rgba(0,0,0,0.05) 0px 0px 14px 0px",
            padding: 4,
          }}>
            {/* Inner container */}
            <div style={{
              background: "linear-gradient(180deg, #fff 52%, var(--pgl-surface, #fafbf8) 100%)",
              borderRadius: 16,
              border: "1px solid var(--pgl-border, #edeff3)",
              padding: "60px 30px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: 20,
            }}>
              {/* ── Title + subtitle ── */}
              <div style={{
                display: "flex", flexDirection: "column",
                alignItems: "center", gap: 12,
              }}>
                <h2 style={{
                  fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                  fontSize: "clamp(28px, 3.5vw, 40px)",
                  fontWeight: 500,
                  lineHeight: "1.2em",
                  color: "var(--pgl-text)",
                  margin: 0,
                  maxWidth: 600,
                  textAlign: "center",
                }}
                  data-pgl-path="title"
                  data-pgl-edit="text"
                >
                  {renderAccentText(c.title, accent)}
                </h2>

                {c.subtitle && (
                  <p style={{
                    fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                    fontSize: 17, fontWeight: 400,
                    lineHeight: "1.5em",
                    color: "var(--pgl-text-muted)",
                    margin: 0,
                    textAlign: "center",
                  }}
                    data-pgl-path="subtitle"
                    data-pgl-edit="text"
                  >
                    {c.subtitle}
                  </p>
                )}
              </div>

              {/* ── CTA Button — dark pill with arrow icon ── */}
              <div style={{
                display: "flex", flexDirection: "column",
                alignItems: "center", gap: 12,
              }}>
                <a
                  href={c.ctaLink || "#contato"}
                  data-pgl-path="ctaText"
                  data-pgl-edit="button"
                  style={{
                    display: "inline-flex", alignItems: "center",
                    gap: 4, height: 48, padding: 6,
                    backgroundColor: primary,
                    borderRadius: 10,
                    boxShadow: "0px 1px 2px rgba(23,24,28,0.24), 0px 6px 12px -8px rgba(23,24,28,0.7), 0px 12px 32px -8px rgba(23,24,28,0.4)",
                    textDecoration: "none",
                    transition: "opacity 0.2s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.9"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
                >
                  <div style={{ padding: "4px 12px", display: "flex", alignItems: "center" }}>
                    <span style={{
                      fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                      fontSize: 15, fontWeight: 500,
                      color: "#fff",
                    }}>
                      {c.ctaText}
                    </span>
                  </div>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    backgroundColor: "var(--pgl-text, #212121)",
                    border: "1px solid var(--pgl-text-muted, #666)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12h14m-6 6l6-6m-6-6l6 6" stroke="#fff" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </a>

                {/* ── Availability badge — green pulsing dot ── */}
                <div style={{
                  display: "flex", alignItems: "center", gap: 8,
                  borderRadius: 99,
                }}>
                  <div style={{ position: "relative", width: 10, height: 10 }}>
                    {/* Pulse ring */}
                    <div style={{
                      position: "absolute", inset: -3,
                      borderRadius: "50%",
                      backgroundColor: secondary,
                      opacity: 0.25,
                      animation: "folioxa-cta-pulse 2s ease-in-out infinite",
                    }} />
                    {/* Dot */}
                    <div style={{
                      width: 10, height: 10, borderRadius: 99,
                      backgroundColor: secondary,
                      boxShadow: `0 0 0 2px ${secondary}40`,
                      position: "relative",
                    }} />
                  </div>
                  <span style={{
                    fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                    fontSize: 13, fontWeight: 400,
                    color: "var(--pgl-text-muted, rgb(55,49,47))",
                  }}>
                    Vagas limitadas disponíveis
                  </span>
                </div>
              </div>

              {/* ── Social links — X | Instagram | YouTube ── */}
              <div style={{
                display: "flex", alignItems: "center", gap: 0,
                marginTop: 8,
              }}>
                {/* X / Twitter */}
                <a href="#" style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  width: 44, height: 44,
                  textDecoration: "none",
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--pgl-text, #212121)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4l6.5 8L4 20h2l5.5-6.8L16 20h4l-6.8-8.5L19.5 4h-2l-5.2 6.3L8 4H4z" />
                  </svg>
                </a>

                {/* Separator */}
                <div style={{
                  width: 1, height: 20,
                  backgroundColor: "var(--pgl-border, #edeff3)",
                }} />

                {/* Instagram */}
                <a href="#" style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  width: 44, height: 44,
                  textDecoration: "none",
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--pgl-text, #212121)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <circle cx="12" cy="12" r="5" />
                    <circle cx="17.5" cy="6.5" r="1.5" fill="var(--pgl-text, #212121)" stroke="none" />
                  </svg>
                </a>

                {/* Separator */}
                <div style={{
                  width: 1, height: 20,
                  backgroundColor: "var(--pgl-border, #edeff3)",
                }} />

                {/* YouTube */}
                <a href="#" style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  width: 44, height: 44,
                  textDecoration: "none",
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--pgl-text, #212121)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="4" />
                    <path d="M10 9l5 3-5 3V9z" fill="var(--pgl-text, #212121)" stroke="none" />
                  </svg>
                </a>
              </div>

              {/* ── Email link ── */}
              <a
                href="mailto:contato@exemplo.com"
                style={{
                  fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                  fontSize: 17, fontWeight: 400,
                  color: "var(--pgl-text, #000)",
                  textDecoration: "none",
                  textAlign: "center",
                }}
              >
                contato@exemplo.com
              </a>
            </div>
          </div>
        </ScrollReveal>

        {/* Pulse animation */}
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes folioxa-cta-pulse {
            0%, 100% { transform: scale(1); opacity: 0.25; }
            50% { transform: scale(2.5); opacity: 0; }
          }
        `}} />
      </div>
    </section>
  );
}
