"use client";

import type { DesignTokens } from "@/types/ai-generation";
import { HeroContentSchema } from "@/types/ai-generation";
import { ScrollReveal } from "./scroll-reveal";

interface Props {
  content: Record<string, unknown>;
  tokens: DesignTokens;
  isDark?: boolean;
}

export function PlumbflowHero({ content, tokens }: Props) {
  const parsed = HeroContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const accent = tokens.palette.accent || "#FF5E15";
  const primary = tokens.palette.primary || "#142F45";

  return (
    <section
      id="hero"
      style={{
        width: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ═══ Background image — covers full section ═══ */}
      <div
        style={{ position: "absolute", inset: 0 }}
        data-pgl-path="backgroundImage"
        data-pgl-edit="image"
      >
        {c.backgroundImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={c.backgroundImage}
            alt="Hero background"
            style={{
              display: "block",
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center top",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              background: `linear-gradient(135deg, ${primary} 0%, ${primary}dd 40%, ${primary}88 100%)`,
            }}
          />
        )}
        {/* Dark overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: `rgba(0,0,0,${c.overlayOpacity ?? 0.5})`,
          }}
        />
      </div>

      {/* ═══ Content container ═══ */}
      <div
        className="px-5 md:px-[30px]"
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          justifyContent: "center",
        }}
      >
        {/* Inner max-width wrapper — flex row so content stays LEFT */}
        <div
          style={{
            width: "100%",
            maxWidth: 1296,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {/* ── Left column — text content + badge ── */}
          <div
            className="w-full md:max-w-[596px] items-center md:items-start"
            style={{
              display: "flex",
              flexDirection: "column",
              paddingTop: 120,
              paddingBottom: 80,
            }}
          >
            {/* Text + Buttons group (gap 16 between tag and title, gap 48 between title block and buttons) */}
            <div
              className="items-center md:items-start text-center md:text-left"
              style={{ display: "flex", flexDirection: "column", gap: 16 }}
            >
              {/* Tagline */}
              {c.tagline && (
                <ScrollReveal delay={0}>
                  <p
                    style={{
                      fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                      fontSize: 18,
                      fontWeight: 700,
                      letterSpacing: "0px",
                      lineHeight: "1.7em",
                      color: accent,
                      margin: 0,
                    }}
                    data-pgl-path="tagline"
                    data-pgl-edit="text"
                  >
                    {c.tagline}
                  </p>
                </ScrollReveal>
              )}

              {/* Title + subtitle wrapper */}
              <div
                className="items-center md:items-start"
                style={{ display: "flex", flexDirection: "column", gap: 24 }}
              >
                <ScrollReveal delay={100}>
                  <h1
                    style={{
                      fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                      fontSize: "clamp(36px, 5vw, 64px)",
                      fontWeight: 700,
                      letterSpacing: "-2px",
                      lineHeight: "1.1em",
                      color: "#fff",
                      margin: 0,
                    }}
                    data-pgl-path="headline"
                    data-pgl-edit="text"
                  >
                    {c.headline.split(/\*([^*]+)\*/).map((part, i) =>
                      i % 2 === 1 ? (
                        <span key={i} style={{ color: accent }}>{part}</span>
                      ) : (
                        <span key={i}>{part}</span>
                      )
                    )}
                  </h1>
                </ScrollReveal>

                <ScrollReveal delay={200}>
                  <p
                    style={{
                      fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                      fontSize: 18,
                      fontWeight: 400,
                      letterSpacing: "0px",
                      lineHeight: "1.4em",
                      color: "rgba(241,242,250,0.9)",
                      margin: 0,
                      maxWidth: 532,
                    }}
                    data-pgl-path="subheadline"
                    data-pgl-edit="text"
                  >
                    {c.subheadline}
                  </p>
                </ScrollReveal>
              </div>
            </div>

            {/* Buttons — gap 48px from title block */}
            <ScrollReveal delay={300}>
              <div
                className="flex-col sm:flex-row w-full sm:w-auto"
                style={{ display: "flex", gap: 16, marginTop: 48 }}
              >
                {/* Primary CTA */}
                <a
                  href={c.ctaLink || "#contato"}
                  data-pgl-path="ctaText"
                  data-pgl-edit="button"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    padding: "14px 32px",
                    backgroundColor: accent,
                    borderRadius: 58,
                    boxShadow: "rgba(255,255,255,0.4) 0px 4px 7px 0px inset",
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
                      fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                      fontSize: 16,
                      fontWeight: 700,
                      letterSpacing: "0.3px",
                      color: "#fff",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {c.ctaText}
                  </span>
                </a>

                {/* Secondary CTA */}
                {c.secondaryCtaText && (
                  <a
                    href={c.secondaryCtaLink || "#contato"}
                    data-pgl-path="secondaryCtaText"
                    data-pgl-edit="button"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 10,
                      padding: "14px 32px",
                      backgroundColor: "transparent",
                      border: "1px solid rgba(255,255,255,0.7)",
                      borderRadius: 58,
                      textDecoration: "none",
                      transition: "background-color 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                        fontSize: 16,
                        fontWeight: 700,
                        letterSpacing: "0.3px",
                        color: "#fff",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {c.secondaryCtaText}
                    </span>
                  </a>
                )}
              </div>
            </ScrollReveal>

            {/* ── Glassmorphism client badge — BELOW buttons, desktop only ── */}
            {c.badgeText && (
              <ScrollReveal delay={400}>
                <div
                  className="hidden md:flex"
                  style={{
                    marginTop: 130,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 16,
                    padding: "12px 37px 12px 14px",
                    backgroundColor: "rgba(255,255,255,0.12)",
                    backdropFilter: "blur(24px)",
                    WebkitBackdropFilter: "blur(24px)",
                    border: "1px solid rgba(255,255,255,0.4)",
                    borderRadius: 40,
                  }}
                >
                {/* Stacked avatars — editable */}
                <div style={{ position: "relative", width: 128, height: 56, flexShrink: 0 }}>
                  {(c.brands || []).slice(0, 3).map((brand, i) => (
                    <div
                      key={i}
                      data-pgl-path={`brands.${i}.logoUrl`}
                      data-pgl-edit="image"
                      style={{
                        position: "absolute",
                        top: 0,
                        left: i * 36,
                        width: 56,
                        height: 56,
                        borderRadius: "50%",
                        border: `4px solid ${primary}`,
                        overflow: "hidden",
                        background: `linear-gradient(135deg, ${accent}44, ${primary}66)`,
                      }}
                    >
                      {brand.logoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={brand.logoUrl} alt={brand.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="8" r="4" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
                            <path d="M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" />
                          </svg>
                        </div>
                      )}
                    </div>
                  ))}
                  {/* Fallback if no brands */}
                  {(!c.brands || c.brands.length === 0) && [0, 1, 2].map((i) => (
                    <div
                      key={i}
                      style={{
                        position: "absolute", top: 0, left: i * 36,
                        width: 56, height: 56, borderRadius: "50%",
                        border: `4px solid ${primary}`, overflow: "hidden",
                        background: `linear-gradient(135deg, ${accent}44, ${primary}66)`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="8" r="4" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
                        <path d="M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </div>
                  ))}
                </div>

                {/* Badge text — ✦ prefix */}
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span
                    style={{
                      fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                      fontSize: 22,
                      fontWeight: 700,
                      letterSpacing: "0px",
                      lineHeight: "1.4em",
                      color: "#fff",
                    }}
                    data-pgl-path="badgeText"
                    data-pgl-edit="text"
                  >
                    ✦ {c.badgeText}
                  </span>
                </div>

                {/* Blue checkmark */}
                <div
                  style={{
                    position: "absolute",
                    top: -6,
                    right: -6,
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    backgroundColor: tokens.palette.secondary || "#35AAF3",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3 7l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
              </ScrollReveal>
            )}
          </div>
        </div>
      </div>

      {/* ═══ Recognition bar — absolute bottom-right, desktop only ═══ */}
      {c.brands && c.brands.length > 0 && (
        <ScrollReveal delay={200}>
          <div
            className="hidden md:flex"
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              zIndex: 2,
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 26,
              padding: "32px 72px 16px 32px",
              backgroundColor: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              border: "2px solid rgba(255,255,255,0.4)",
              borderTopLeftRadius: 24,
            }}
          >
          <span
            style={{
              fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: "0px",
              lineHeight: "1.4em",
              color: "#fff",
            }}
          >
            Recognized for Excellence in Plumbing Services!
          </span>
          <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 48 }}>
            {c.brands.map((brand, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: 48,
                  opacity: 0.8,
                }}
              >
                {brand.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={brand.logoUrl}
                    alt={brand.name}
                    style={{ height: 48, width: "auto", objectFit: "contain", filter: "brightness(0) invert(1)" }}
                  />
                ) : (
                  /* Badge/seal placeholder */
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: "50%",
                      border: "2px solid rgba(255,255,255,0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                        fontSize: 10,
                        fontWeight: 700,
                        color: "rgba(255,255,255,0.6)",
                        textAlign: "center",
                        lineHeight: "1.2em",
                      }}
                    >
                      {brand.name}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        </ScrollReveal>
      )}
    </section>
  );
}
