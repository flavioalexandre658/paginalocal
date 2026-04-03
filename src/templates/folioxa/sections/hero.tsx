"use client";

import type { DesignTokens } from "@/types/ai-generation";
import { HeroContentSchema } from "@/types/ai-generation";
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

export function FolioxaHero({ content, tokens }: Props) {
  const parsed = HeroContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const accent = tokens.palette.accent;
  const primary = tokens.palette.primary;
  const secondary = tokens.palette.secondary;

  return (
    <section
      id="hero"
      style={{ backgroundColor: "var(--pgl-background)", overflow: "hidden" }}
    >
      <div
        className="px-5 md:px-10 pt-8 md:pt-12 pb-16"
        style={{ maxWidth: 1310, margin: "0 auto" }}
      >
        {/* ═══ Two-card layout ═══ */}
        <div
          className="flex flex-col md:flex-row md:items-stretch"
          style={{ gap: 16, marginBottom: 48 }}
        >
          {/* LEFT — Profile card (double-layer: outer wrapper + inner container) */}
          <ScrollReveal delay={0} className="w-full md:w-[380px]">
            {/* Outer wrapper — white bg, 4px padding, shadow */}
            <div style={{
              backgroundColor: "#fff",
              borderRadius: 28,
              boxShadow: "0 0 14px rgba(0,0,0,0.05)",
              padding: 4,
              height: "100%",
            }}>
            {/* Inner container — gradient bg, border, 20px padding */}
            <div
              style={{
                background: "linear-gradient(180deg, #fff 52%, var(--pgl-surface, #fafbf8) 100%)",
                borderRadius: 24,
                border: "1px solid var(--pgl-border, #edeff3)",
                padding: 20,
                display: "flex",
                flexDirection: "column",
                gap: 24,
                height: "100%",
              }}
            >
              {/* Profile photo */}
              <div
                style={{
                  width: "100%",
                  aspectRatio: "0.85",
                  borderRadius: 16,
                  overflow: "hidden",
                  backgroundColor: "var(--pgl-surface)",
                }}
                data-pgl-path="backgroundImage"
                data-pgl-edit="image"
              >
                {c.backgroundImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={c.backgroundImage}
                    alt="Profile"
                    style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}
                  />
                ) : (
                  <div style={{
                    width: "100%", height: "100%",
                    background: `linear-gradient(135deg, var(--pgl-surface), ${accent}11)`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" opacity="0.2">
                      <circle cx="24" cy="16" r="8" stroke="var(--pgl-text)" strokeWidth="1.5" />
                      <path d="M8 40c0-7 7-12 16-12s16 5 16 12" stroke="var(--pgl-text)" strokeWidth="1.5" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Name + role + send icon */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <h3
                    style={{
                      fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                      fontSize: 18, fontWeight: 600, color: "var(--pgl-text)", margin: 0,
                    }}
                    data-pgl-path="tagline"
                    data-pgl-edit="text"
                  >
                    {c.tagline || ""}
                  </h3>
                  <p style={{
                    fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                    fontSize: 14, fontWeight: 400, color: "var(--pgl-text-muted)", margin: "4px 0 0",
                  }}>
                    {c.badgeText || ""}
                  </p>
                </div>
                <div style={{
                  width: 40, height: 40, borderRadius: 12,
                  border: "1px solid rgba(0,0,0,0.08)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer",
                }}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M16 2L8 10M16 2l-5 14-2.5-6.5L2 7z" stroke="var(--pgl-text)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>
            </div>
          </ScrollReveal>

          {/* RIGHT — Main content card (double-layer) */}
          <ScrollReveal delay={100} className="flex-1">
            {/* Outer wrapper */}
            <div style={{
              backgroundColor: "#fff",
              borderRadius: 28,
              boxShadow: "0 0 14px rgba(0,0,0,0.05)",
              padding: 4,
              height: "100%",
            }}>
            {/* Inner container */}
            <div
              style={{
                background: "linear-gradient(180deg, #fff 52%, var(--pgl-surface, #fafbf8) 100%)",
                borderRadius: 24,
                border: "1px solid var(--pgl-border, #edeff3)",
                padding: "32px 36px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: 24,
                height: "100%",
              }}
            >
              {/* Green dot badge — "Available" */}
              <div style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "8px 16px",
                backgroundColor: "var(--pgl-surface)",
                borderRadius: 14,
                width: "fit-content",
              }}>
                <div style={{
                  width: 8, height: 8, borderRadius: "50%",
                  backgroundColor: secondary,
                  boxShadow: `0 0 0 3px ${secondary}33`,
                }} />
                <span style={{
                  fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                  fontSize: 13, fontWeight: 500, color: "var(--pgl-text)",
                }}
                  data-pgl-path="badgeText"
                  data-pgl-edit="text"
                >
                  {c.badgeText || "Disponivel"}
                </span>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 7h8M8 4l3 3-3 3" stroke="var(--pgl-text)" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              </div>

              {/* Main heading — large */}
              <h1
                style={{
                  fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                  fontSize: "clamp(32px, 4vw, 50px)",
                  fontWeight: 600,
                  lineHeight: "1em",
                  color: "var(--pgl-text)",
                  margin: 0,
                }}
                data-pgl-path="headline"
                data-pgl-edit="text"
              >
                {renderAccentText(c.headline, accent)}
              </h1>

              {/* Subtitle / bio */}
              <p
                style={{
                  fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                  fontSize: 17, fontWeight: 400, lineHeight: "1.3em",
                  color: "var(--pgl-text-muted)", margin: 0, maxWidth: 520,
                }}
                data-pgl-path="subheadline"
                data-pgl-edit="text"
              >
                {c.subheadline}
              </p>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row" style={{ gap: 12 }}>
                {/* Primary CTA — dark pill */}
                <a
                  href={c.ctaLink || "#contato"}
                  data-pgl-path="ctaText"
                  data-pgl-edit="button"
                  style={{
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    gap: 4, height: 48, padding: "6px",
                    backgroundColor: primary, borderRadius: 10,
                    boxShadow: "0px 1px 2px rgba(23,24,28,0.24), 0px 6px 12px -8px rgba(23,24,28,0.7), 0px 12px 32px -8px rgba(23,24,28,0.4)",
                    textDecoration: "none", transition: "opacity 0.2s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.9"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
                >
                  <div style={{ padding: "4px 12px", display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{
                      fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                      fontSize: 15, fontWeight: 500, color: "#fff",
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
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6h8M7 3l3 3-3 3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                </a>

                {/* Secondary CTA — outline */}
                {c.secondaryCtaText && (
                  <a
                    href={c.secondaryCtaLink || "#projetos"}
                    data-pgl-path="secondaryCtaText"
                    data-pgl-edit="button"
                    style={{
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      gap: 8, height: 48, padding: "0 28px",
                      backgroundColor: "transparent",
                      border: "1.5px solid rgba(0,0,0,0.12)",
                      borderRadius: 14,
                      textDecoration: "none", transition: "background-color 0.2s",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.03)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                  >
                    <span style={{
                      fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                      fontSize: 15, fontWeight: 500, color: "var(--pgl-text)",
                    }}>
                      {c.secondaryCtaText}
                    </span>
                  </a>
                )}
              </div>
            </div>
            </div>
          </ScrollReveal>
        </div>

        {/* ═══ Proudly worked with — marquee ticker ═══ */}
        {c.brands && c.brands.length > 0 && (
          <ScrollReveal delay={200}>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <p style={{
                fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                fontSize: 13, fontWeight: 400, color: "var(--pgl-text-muted)", marginBottom: 20,
              }}>
                Trabalhou com:
              </p>
              <div style={{ overflow: "hidden", width: "100%", position: "relative" }}>
                {/* Fade edges */}
                <div style={{
                  position: "absolute", top: 0, bottom: 0, left: 0, width: 60, zIndex: 1,
                  background: "linear-gradient(90deg, var(--pgl-background, #f7f7f7), transparent)",
                }} />
                <div style={{
                  position: "absolute", top: 0, bottom: 0, right: 0, width: 60, zIndex: 1,
                  background: "linear-gradient(270deg, var(--pgl-background, #f7f7f7), transparent)",
                }} />
                {/* Marquee track */}
                <div style={{
                  display: "flex", gap: 48, alignItems: "center",
                  animation: "folioxa-marquee 20s linear infinite",
                  width: "max-content",
                }}>
                  {[...c.brands, ...c.brands, ...c.brands].map((brand, i) => (
                    <span key={i} style={{
                      fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                      fontSize: 16, fontWeight: 500, color: "var(--pgl-text)",
                      opacity: 0.35, whiteSpace: "nowrap",
                    }}>
                      {brand.name}
                    </span>
                  ))}
                </div>
              </div>
              <style dangerouslySetInnerHTML={{ __html: `
                @keyframes folioxa-marquee {
                  0% { transform: translateX(0); }
                  100% { transform: translateX(-33.333%); }
                }
              `}} />
            </div>
          </ScrollReveal>
        )}

        {/* Scroll indicator */}
        <ScrollReveal delay={300}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, opacity: 0.4 }}>
            <span style={{ fontFamily: "var(--pgl-font-body)", fontSize: 13, color: "var(--pgl-text)" }}>
              Role para baixo
            </span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="7" y="3" width="6" height="10" rx="3" stroke="var(--pgl-text)" strokeWidth="1.2" />
              <line x1="10" y1="6" x2="10" y2="8" stroke="var(--pgl-text)" strokeWidth="1.2" strokeLinecap="round" />
              <path d="M6 15l4 3 4-3" stroke="var(--pgl-text)" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            <span style={{ fontFamily: "var(--pgl-font-body)", fontSize: 13, color: "var(--pgl-text)" }}>
              para ver projetos
            </span>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
