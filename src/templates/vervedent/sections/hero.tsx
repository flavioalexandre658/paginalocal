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
    i % 2 === 1 ? (
      <span key={i} style={{ color: accentColor }}>{part}</span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export function VerveHero({ content, tokens }: Props) {
  const parsed = HeroContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const accent = tokens.palette.accent;
  const primary = tokens.palette.primary;
  const secondary = tokens.palette.secondary;

  return (
    <section
      id="hero"
      style={{
        backgroundColor: secondary,
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        className="flex flex-col md:flex-row w-full px-6 md:px-12"
        style={{
          maxWidth: 1200,
          alignItems: "center",
          gap: 48,
          paddingTop: 100,
          paddingBottom: 60,
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Left — text */}
        <div className="w-full md:flex-1" style={{ display: "flex", flexDirection: "column", gap: 48 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <ScrollReveal delay={0}>
              <h1
                style={{
                  fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                  fontSize: "clamp(28px, 4vw, 48px)",
                  fontWeight: 600,
                  lineHeight: "1em",
                  color: "rgba(255,255,255,0.7)",
                  margin: 0,
                }}
                data-pgl-path="headline"
                data-pgl-edit="text"
              >
                {renderAccentText(c.headline, "#fff")}
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <p
                style={{
                  fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                  fontSize: 18, fontWeight: 300, lineHeight: "1.4em",
                  color: "rgba(255,255,255,0.85)", margin: 0, maxWidth: 520,
                }}
                data-pgl-path="subheadline"
                data-pgl-edit="text"
              >
                {c.subheadline}
              </p>
            </ScrollReveal>
          </div>

          {/* Buttons — 8px radius, NOT pill */}
          <ScrollReveal delay={200}>
            <div className="flex flex-col sm:flex-row" style={{ gap: 12 }}>
              <a
                href={c.ctaLink || "#contato"}
                data-pgl-path="ctaText"
                data-pgl-edit="button"
                style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  height: 60, padding: "0 36px",
                  backgroundColor: primary, borderRadius: 0,
                  textDecoration: "none", transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.9"; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
              >
                <span style={{
                  fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                  fontSize: 18, fontWeight: 500, color: "#fff", whiteSpace: "nowrap",
                }}>
                  {c.ctaText}
                </span>
              </a>

              {c.secondaryCtaText && (
                <a
                  href={c.secondaryCtaLink || "#services"}
                  data-pgl-path="secondaryCtaText"
                  data-pgl-edit="button"
                  style={{
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    height: 60, padding: "0 36px",
                    backgroundColor: "#fff", borderRadius: 0,
                    textDecoration: "none", transition: "opacity 0.2s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.9"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
                >
                  <span style={{
                    fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                    fontSize: 18, fontWeight: 500, color: primary, whiteSpace: "nowrap",
                  }}>
                    {c.secondaryCtaText}
                  </span>
                </a>
              )}
            </div>
          </ScrollReveal>
        </div>

        {/* Right — hero image */}
        <div className="w-full md:flex-1" style={{ flexShrink: 0 }}>
          <ScrollReveal delay={200}>
            <div
              style={{
                aspectRatio: "0.667", borderRadius: 24, overflow: "hidden",
                position: "relative", maxHeight: 700,
              }}
              data-pgl-path="backgroundImage"
              data-pgl-edit="image"
            >
              {c.backgroundImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={c.backgroundImage}
                  alt="Hero"
                  style={{ display: "block", width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}
                />
              ) : (
                <div style={{
                  width: "100%", height: "100%", minHeight: 400,
                  background: `linear-gradient(135deg, ${primary}44, ${accent}22)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" opacity="0.3">
                    <rect x="8" y="8" width="48" height="48" rx="8" stroke="#fff" strokeWidth="2" />
                    <circle cx="24" cy="24" r="6" stroke="#fff" strokeWidth="2" />
                    <path d="M8 44l16-12 12 8 20-16" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Stat badges */}
      {c.brands && c.brands.length > 0 && (
        <div className="flex flex-wrap justify-center gap-6 px-6 pb-12" style={{ zIndex: 2 }}>
          {c.brands.map((brand, i) => (
            <ScrollReveal key={i} delay={300 + i * 80}>
              <div style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "10px 20px", backgroundColor: "rgba(255,255,255,0.1)",
                borderRadius: 0, backdropFilter: "blur(10px)",
              }}>
                <span style={{
                  fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                  fontSize: 16, fontWeight: 600, color: "#fff",
                }}>
                  {brand.name}
                </span>
              </div>
            </ScrollReveal>
          ))}
        </div>
      )}
    </section>
  );
}
