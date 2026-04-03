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

function StarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff">
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );
}

export function StratexHero({ content, tokens }: Props) {
  const parsed = HeroContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const accent = tokens.palette.accent;
  const secondaryCtaText = (content.secondaryCtaText as string) || "";
  const secondaryCtaLink = (content.secondaryCtaLink as string) || "#";

  return (
    <header style={{ backgroundColor: "var(--pgl-background)" }}>
      {/*
        Outer wrapper: max-width 1200, centered, horizontal padding 25px.
        The green card sits INSIDE this wrapper.
      */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 25px" }}>
        {/*
          Green card container.
          From Framer: 1150×612, bg #1F514C, border-radius 40px.
          Uses CSS Grid to place text-column and image-column side by side.
          Padding 33px wraps the content; image sits flush-right but
          inset by the padding so it gets rounded corners from overflow:hidden.
        */}
        <div
          className="rounded-[24px] md:rounded-[40px]"
          style={{
            backgroundColor: accent,
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            className="flex flex-col md:flex-row p-[16px]"
            style={{ minHeight: 540 }}
          >
            {/* ═══ Left column: text content ═══ */}
            <div
              className="flex-1 flex flex-col justify-center px-6 pt-10 pb-8 md:pl-[66px] md:pr-[40px] md:py-[80px]"
              style={{
                gap: 28,
                zIndex: 2,
                maxWidth: 620,
              }}
            >
              {/* Stars + rating */}
              <ScrollReveal>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ display: "flex", gap: 2 }}>
                    {Array.from({ length: 5 }).map((_, i) => <StarIcon key={i} />)}
                  </div>
                  {c.tagline && (
                    <span
                      style={{
                        fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                        fontSize: 15,
                        fontWeight: 400,
                        color: "#fff",
                      }}
                      data-pgl-path="tagline"
                      data-pgl-edit="text"
                    >
                      {c.tagline}
                    </span>
                  )}
                </div>
              </ScrollReveal>

              {/* H1 + subtitle */}
              <ScrollReveal delay={100}>
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <h1
                    style={{
                      fontFamily: "var(--pgl-font-heading), Georgia, serif",
                      fontSize: "clamp(32px, 5vw, 56px)",
                      fontWeight: 400,
                      letterSpacing: "-0.02em",
                      lineHeight: "1.08em",
                      color: "#fff",
                      margin: 0,
                    }}
                    data-pgl-path="headline"
                    data-pgl-edit="text"
                  >
                    {renderAccentText(c.headline, "#fff")}
                  </h1>
                  {c.subheadline && (
                    <p
                      style={{
                        fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                        fontSize: "clamp(15px, 1.4vw, 18px)",
                        fontWeight: 400,
                        lineHeight: "1.6em",
                        color: "#fff",
                        opacity: 0.8,
                        margin: 0,
                        maxWidth: 480,
                      }}
                      data-pgl-path="subheadline"
                      data-pgl-edit="text"
                    >
                      {c.subheadline}
                    </p>
                  )}
                </div>
              </ScrollReveal>

              {/* Buttons */}
              <ScrollReveal delay={200}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center" style={{ gap: 20 }}>
                  {c.ctaText && (
                    <a
                      href={c.ctaLink || "#"}
                      data-pgl-path="ctaText"
                      data-pgl-edit="button"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 10,
                        height: 52,
                        padding: "0 6px 0 22px",
                        backgroundColor: "#fff",
                        borderRadius: 1000,
                        textDecoration: "none",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                          fontSize: 15,
                          fontWeight: 500,
                          color: "var(--pgl-text)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {c.ctaText}
                      </span>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 40,
                          height: 40,
                          borderRadius: 1000,
                          backgroundColor: accent,
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </span>
                    </a>
                  )}
                  {secondaryCtaText && (
                    <a
                      href={secondaryCtaLink}
                      style={{
                        fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                        fontSize: 15,
                        fontWeight: 500,
                        color: "#fff",
                        textDecoration: "none",
                      }}
                    >
                      {secondaryCtaText}
                    </a>
                  )}
                </div>
              </ScrollReveal>
            </div>

            {/* ═══ Right column: image ═══
                 The image sits flush with the right/top/bottom edges of the
                 green card, but with ~10px inset so the card's border-radius
                 clips it into a rounded shape. On mobile it stacks below.
            ═══ */}
            <div
              className="hidden md:block"
              style={{
                flex: "0 0 42%",
                position: "relative",
              }}
              data-pgl-path="backgroundImage"
              data-pgl-edit="image"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {c.backgroundImage ? (
                <img
                  src={c.backgroundImage}
                  alt=""
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center",
                    borderRadius: "20px 20px 20px 20px",
                  }}
                />
              ) : (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                    background: "linear-gradient(160deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.03) 100%)",
                    borderRadius: "20px 20px 20px 20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </div>
              )}
            </div>

            {/* Mobile: image below text */}
            <div
              className="md:hidden"
              style={{ padding: "0 12px 12px" }}
              data-pgl-path="backgroundImage"
              data-pgl-edit="image"
            >
              <div style={{ borderRadius: 16, overflow: "hidden", height: 320 }}>
                {c.backgroundImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.backgroundImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={{ width: "100%", height: "100%", background: "linear-gradient(160deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.03) 100%)" }} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
