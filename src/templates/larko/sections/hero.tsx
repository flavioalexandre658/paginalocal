"use client";

import type { DesignTokens } from "@/types/ai-generation";
import { HeroContentSchema } from "@/types/ai-generation";
import { ScrollReveal } from "./scroll-reveal";

interface Props {
  content: Record<string, unknown>;
  tokens: DesignTokens;
  isDark?: boolean;
}

/**
 * renderAccentText — wraps *word* in italic serif accent-colored spans
 * Matches Larko's Newsreader italic 62px for accent spans in hero title
 */
function renderAccentText(text: string, accentColor: string) {
  return text.split(/\*([^*]+)\*/).map((part, i) =>
    i % 2 === 1 ? (
      <span
        key={i}
        style={{
          fontFamily: "var(--pgl-font-heading), Georgia, 'Times New Roman', serif",
          fontStyle: "italic",
          color: accentColor,
        }}
      >
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export function LarkoHero({ content, tokens }: Props) {
  const parsed = HeroContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const primary = tokens.palette.primary;
  const accent = tokens.palette.accent;
  const secondary = tokens.palette.secondary;

  return (
    <section
      id="hero"
      style={{
        backgroundColor: "var(--pgl-surface, #fbf9f5)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 80,
        width: "100%",
        height: "100vh",
        minHeight: 750,
        paddingTop: 190,
        position: "relative",
        overflow: "visible",
      }}
    >
      {/* ═══ Image Wrapper — right half, absolute ═══ */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "center",
          width: "100%",
          position: "absolute",
          top: 0,
          bottom: 0,
          left: "0%",
          overflow: "hidden",
        }}
      >
        {/* Gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            background: "linear-gradient(161deg, rgba(255,246,245,0.7) 5%, rgba(255,246,245,0.27) 16%, rgba(255,245,244,0.05) 26.24%, rgba(255,242,240,0) 72%)",
            overflow: "clip",
          }}
        />

        {/* Background image — 50% right */}
        <div
          className="hidden md:block"
          style={{
            width: "50%",
            height: "100%",
            position: "relative",
            overflow: "hidden",
          }}
          data-pgl-path="backgroundImage"
          data-pgl-edit="image"
        >
          {c.backgroundImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={c.backgroundImage}
              alt=""
              style={{
                display: "block",
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center center",
              }}
            />
          ) : (
            <div style={{
              width: "100%",
              height: "100%",
              background: `linear-gradient(135deg, var(--pgl-surface, #fbf9f5), ${accent}11)`,
            }} />
          )}
        </div>
      </div>

      {/* ═══ Base Container — content area ═══ */}
      <div
        className="px-5 md:px-[55px]"
        style={{
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 90,
          width: "100%",
          maxWidth: 1440,
          height: "min-content",
          paddingBottom: 160,
          position: "relative",
          overflow: "visible",
        }}
      >
        {/* Banner Wrapper — constrained to left half so text doesn't overlap image */}
        <div className="larko-hero-banner" style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 30,
          height: "min-content",
        }}>
          {/* ── Avatar stack + badge ── */}
          <ScrollReveal delay={0}>
            <div className="hidden md:flex" style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 0,
              minWidth: 140,
            }}>
              {/* 3 avatar circles */}
              <div style={{ display: "flex", alignItems: "center" }}>
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    style={{
                      backgroundColor: "var(--pgl-surface, #fbf9f5)",
                      borderRadius: 100,
                      padding: 3,
                      marginLeft: i > 0 ? -14 : 0,
                      position: "relative",
                      zIndex: 3 - i,
                    }}
                  >
                    <div style={{
                      width: 54,
                      height: 54,
                      borderRadius: "100%",
                      overflow: "hidden",
                      backgroundColor: `${accent}22`,
                    }}>
                      <div style={{
                        width: "100%",
                        height: "100%",
                        background: `linear-gradient(135deg, ${accent}33, ${primary}33)`,
                      }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Badge text */}
              <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 0,
                marginLeft: 12,
              }}>
                {c.badgeText && (
                  <span
                    style={{
                      fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                      fontSize: 16,
                      fontWeight: 500,
                      lineHeight: "1.5em",
                      letterSpacing: "0em",
                      color: "var(--pgl-text)",
                    }}
                    data-pgl-path="badgeText"
                    data-pgl-edit="text"
                  >
                    {c.badgeText}
                  </span>
                )}
                {c.tagline && (
                  <span
                    style={{
                      fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                      fontSize: 16,
                      fontWeight: 300,
                      lineHeight: "1.5em",
                      letterSpacing: "0em",
                      color: "var(--pgl-text)",
                    }}
                    data-pgl-path="tagline"
                    data-pgl-edit="text"
                  >
                    {c.tagline}
                  </span>
                )}
              </div>
            </div>
          </ScrollReveal>

          {/* ── Title + Body ── */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 10,
            width: "100%",
          }}>
            {/* Title wrapper — headline + accent span */}
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 6,
              width: "100%",
            }}>
              <ScrollReveal delay={100}>
                <h1
                  style={{
                    fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                    fontSize: "clamp(36px, 4.3vw, 62px)",
                    fontWeight: 500,
                    fontStyle: "normal",
                    letterSpacing: "0em",
                    lineHeight: "1.2em",
                    color: primary,
                    margin: 0,
                  }}
                  data-pgl-path="headline"
                  data-pgl-edit="text"
                >
                  {renderAccentText(c.headline, accent)}
                </h1>
              </ScrollReveal>
            </div>

            {/* Body / subheadline */}
            <ScrollReveal delay={200}>
              <p
                style={{
                  fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                  fontSize: "clamp(15px, 1.25vw, 18px)",
                  fontWeight: 300,
                  letterSpacing: "0em",
                  lineHeight: "1.5em",
                  color: "var(--pgl-text-muted, #2e4d3a)",
                  margin: 0,
                  maxWidth: 480,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
                data-pgl-path="subheadline"
                data-pgl-edit="text"
              >
                {c.subheadline}
              </p>
            </ScrollReveal>
          </div>

          {/* ── CTA Button — lime pill ── */}
          <ScrollReveal delay={300}>
            <a
              href={c.ctaLink || "#contato"}
              data-pgl-path="ctaText"
              data-pgl-edit="button"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0,
                backgroundColor: secondary,
                borderRadius: 50,
                textDecoration: "none",
                transition: "opacity 0.2s",
                padding: "6px 6px 6px 20px",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.9"; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
            >
              <span
                style={{
                  fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                  fontSize: 16,
                  fontWeight: 500,
                  lineHeight: "1.5em",
                  letterSpacing: "0em",
                  color: primary,
                }}
              >
                {c.ctaText}
              </span>
              {/* Icon circle — dark green with white arrow */}
              <div style={{
                width: "min-content",
                height: "min-content",
                padding: 13,
                backgroundColor: primary,
                borderRadius: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginLeft: 10,
              }}>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 14 13"
                  fill="none"
                  style={{ display: "block", transform: "rotate(-45deg)" }}
                >
                  <path
                    d="M1 6.5h12M8 1l5 5.5L8 12"
                    stroke="#fff"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </a>
          </ScrollReveal>
        </div>
      </div>

      {/* ═══ Logos row — absolute bottom ═══ */}
      {c.brands && c.brands.length > 0 && (
        <div
          className="hidden md:flex"
          style={{
            zIndex: 1,
            flexFlow: "wrap",
            justifyContent: "flex-start",
            alignItems: "center",
            gap: 40,
            width: "100%",
            maxWidth: 1440,
            paddingLeft: 55,
            position: "absolute",
            bottom: 50,
            left: "50%",
            transform: "translateX(-50%)",
            overflow: "visible",
          }}
        >
          {c.brands.map((brand, i) => (
            <span
              key={i}
              style={{
                fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                fontSize: 16,
                fontWeight: 500,
                color: accent,
                opacity: 0.6,
                whiteSpace: "nowrap",
              }}
            >
              {brand.name}
            </span>
          ))}
        </div>
      )}

      {/* Responsive overrides */}
      <style dangerouslySetInnerHTML={{ __html: `
        .larko-hero-banner { width: 50%; min-width: 320px; }
        @media (max-width: 1279px) {
          #hero { height: min-content !important; padding-top: 160px !important; }
          #hero > div:nth-child(2) { padding-bottom: 100px !important; padding-left: 20px !important; padding-right: 20px !important; }
        }
        @media (max-width: 991px) {
          #hero { gap: 60px !important; height: min-content !important; padding-top: 120px !important; }
          #hero > div:nth-child(2) { align-items: center !important; gap: 60px !important; padding-left: 20px !important; padding-right: 20px !important; padding-bottom: 40px !important; }
          .larko-hero-banner { width: 100% !important; align-items: center !important; text-align: center !important; }
        }
      `}} />
    </section>
  );
}
