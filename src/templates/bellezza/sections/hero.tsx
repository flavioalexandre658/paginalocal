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

export function BellezzaHero({ content, tokens }: Props) {
  const parsed = HeroContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const accent = tokens.palette.accent;
  const primary = tokens.palette.primary;

  return (
    <section
      style={{
        backgroundColor: "var(--pgl-background)",
        overflow: "hidden",
        minHeight: "100vh",
      }}
    >
      {/* Container — flex row on desktop, column on mobile */}
      <div
        className="flex flex-col md:flex-row"
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Left — Text column */}
        <div
          className="flex flex-col items-center md:items-start text-center md:text-left px-5 pt-32 pb-8 md:pl-[120px] md:pr-0 md:pt-[150px] md:pb-[30px]"
          style={{
            gap: 40,
            width: "100%",
            maxWidth: 600,
            zIndex: 2,
          }}
        >
          <ScrollReveal delay={0}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* H1 — Playfair Display 64px / 700 / 1em line-height */}
              <h1
                style={{
                  fontFamily: "var(--pgl-font-heading), serif",
                  fontSize: "clamp(48px, 5vw, 64px)",
                  fontWeight: 700,
                  letterSpacing: "0em",
                  lineHeight: "1em",
                  color: "var(--pgl-text)",
                  margin: 0,
                }}
                data-pgl-path="headline"
                data-pgl-edit="text"
              >
                {renderAccentText(c.headline, accent)}
              </h1>

              {/* Subtitle — Poppins 16px / 400 / #4D4D4D */}
              <p
                style={{
                  fontFamily: "var(--pgl-font-body), sans-serif",
                  fontSize: 16,
                  fontWeight: 400,
                  letterSpacing: "0em",
                  lineHeight: "1.5em",
                  color: "var(--pgl-text-muted)",
                  margin: 0,
                  maxWidth: 452,
                }}
                data-pgl-path="subheadline"
                data-pgl-edit="text"
              >
                {c.subheadline}
              </p>
            </div>
          </ScrollReveal>

          {/* CTA Button — pill 70px radius, primary bg */}
          <ScrollReveal delay={150}>
            <a
              href={c.ctaLink || "#"}
              data-pgl-path="ctaText"
              data-pgl-edit="button"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                height: 56,
                padding: "0 32px",
                backgroundColor: primary,
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
                {c.ctaText}
              </span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                <path d="M3 8h10M9 4l4 4-4 4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </ScrollReveal>

          {/* Stats badge — "0K+ Happy customers" */}
          <ScrollReveal delay={300}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 20px",
                backgroundColor: "var(--pgl-surface, #fff)",
                borderRadius: 16,
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              }}
            >
              {/* Stacked avatars placeholder */}
              <div style={{ display: "flex", marginRight: -4 }}>
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      backgroundColor: `${accent}${30 + i * 15}`,
                      border: "2px solid var(--pgl-surface, #fff)",
                      marginLeft: i > 0 ? -8 : 0,
                    }}
                  />
                ))}
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span
                  style={{
                    fontFamily: "var(--pgl-font-heading), serif",
                    fontSize: 16,
                    fontWeight: 700,
                    color: "var(--pgl-text)",
                    lineHeight: "1.2em",
                  }}
                  data-pgl-path="badgeText"
                  data-pgl-edit="text"
                >
                  {c.badgeText}
                </span>
                <span
                  style={{
                    fontFamily: "var(--pgl-font-body), sans-serif",
                    fontSize: 12,
                    fontWeight: 400,
                    color: "var(--pgl-text-muted)",
                    lineHeight: "1.4em",
                  }}
                >
                  Clientes satisfeitos
                </span>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Right — Hero image with capsule/arch shape + grid pattern */}
        <div
          className="relative w-full md:w-auto px-5 md:px-0 pb-8 md:pb-[30px]"
          style={{ flexShrink: 0 }}
        >
          {/* Grid lines pattern behind image — with fade edges */}
          <div
            className="hidden md:block"
            style={{
              position: "absolute",
              top: -80,
              left: -120,
              width: 750,
              height: 850,
              zIndex: 0,
              opacity: 0.35,
              backgroundImage: `linear-gradient(${primary}20 1px, transparent 1px), linear-gradient(90deg, ${primary}20 1px, transparent 1px)`,
              backgroundSize: "64px 64px",
              mask: "radial-gradient(ellipse 70% 70% at 55% 50%, black 30%, transparent 70%)",
              WebkitMask: "radial-gradient(ellipse 70% 70% at 55% 50%, black 30%, transparent 70%)",
            }}
          />

          {/* Decorative star SVG */}
          <svg
            className="hidden md:block"
            width="20" height="20" viewBox="0 0 20 20" fill="none"
            style={{ position: "absolute", bottom: 40, right: 80, zIndex: 3 }}
          >
            <path d="M10 0l2.5 7.5L20 10l-7.5 2.5L10 20l-2.5-7.5L0 10l7.5-2.5z" fill={primary} />
          </svg>

          <ScrollReveal delay={200}>
            <div
              className="w-full md:w-[468px]"
              style={{
                position: "relative",
                zIndex: 1,
                height: "auto",
                aspectRatio: "0.712",
                maxHeight: 657,
                borderTopLeftRadius: 999,
                borderTopRightRadius: 999,
                borderBottomLeftRadius: 40,
                borderBottomRightRadius: 40,
                overflow: "hidden",
              }}
              data-pgl-path="backgroundImage"
              data-pgl-edit="image"
            >
              {c.backgroundImage ? (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundImage: `url(${c.backgroundImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    background: `linear-gradient(135deg, ${accent}22, ${primary}11, ${accent}11)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg width="80" height="80" viewBox="0 0 80 80" fill="none" opacity="0.2">
                    <rect x="10" y="10" width="60" height="60" rx="12" stroke={primary} strokeWidth="2" />
                    <circle cx="30" cy="30" r="8" stroke={primary} strokeWidth="2" />
                    <path d="M10 56l20-16 16 10 24-20" stroke={primary} strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
