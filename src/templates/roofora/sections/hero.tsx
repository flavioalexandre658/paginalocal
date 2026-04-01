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

/* ── Feature badge icons ── */
function ShieldIcon({ color = "#CDF660" }: { color?: string }) {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path d="M16 3L5 8v7c0 7.73 4.66 14.96 11 17 6.34-2.04 11-9.27 11-17V8L16 3z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11 16l3 3 7-7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ToolIcon({ color = "#CDF660" }: { color?: string }) {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path d="M19.5 12.5L28 4l-4-1-1 4-4 1 1-4-1-1-8.5 8.5a5 5 0 1 0 7 7L26 10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="20" r="3" stroke={color} strokeWidth="2" />
    </svg>
  );
}

function ClockIcon({ color = "#CDF660" }: { color?: string }) {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="12" stroke={color} strokeWidth="2" />
      <path d="M16 8v8l5 3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const featureIcons = [ShieldIcon, ToolIcon, ClockIcon];

export function RooforaHero({ content, tokens }: Props) {
  const parsed = HeroContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const accent = tokens.palette.accent || "#CDF660";
  const primary = tokens.palette.primary || "#0E1201";

  /* Build feature badges from brands array or use defaults */
  const defaultBadges = [
    { title: "Garantia Total", description: "Servico com garantia completa em todos os projetos" },
    { title: "Equipe Especializada", description: "Profissionais certificados e experientes" },
    { title: "Atendimento Rapido", description: "Resposta em ate 24 horas apos o contato" },
  ];
  const badges = (c.brands && c.brands.length >= 3)
    ? c.brands.slice(0, 3).map((b) => ({ title: b.name, description: b.logoUrl || "" }))
    : defaultBadges;

  return (
    <section
      id="hero"
      style={{
        width: "100%",
        position: "relative",
        overflow: "hidden",
        backgroundColor: primary,
      }}
    >
      {/* ═══ Background image ═══ */}
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
              background: `linear-gradient(135deg, ${primary} 0%, #1a2006 40%, ${primary} 100%)`,
            }}
          />
        )}
        {/* Dark overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: `rgba(14,18,1,${c.overlayOpacity ?? 0.6})`,
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
        <div
          style={{
            width: "100%",
            maxWidth: 1296,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          {/* ── Main content area ── */}
          <div
            className="w-full items-center"
            style={{
              display: "flex",
              flexDirection: "column",
              paddingTop: 120,
              paddingBottom: 40,
            }}
          >
            {/* Tagline */}
            {c.tagline && (
              <ScrollReveal delay={0}>
                <p
                  style={{
                    fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                    fontSize: 14,
                    fontWeight: 500,
                    letterSpacing: "0.1em",
                    lineHeight: "1.5em",
                    color: accent,
                    margin: 0,
                    textTransform: "uppercase",
                  }}
                  data-pgl-path="tagline"
                  data-pgl-edit="text"
                >
                  {c.tagline}
                </p>
              </ScrollReveal>
            )}

            {/* H1 title — Urbanist 100px/52px weight 500, tracking -0.04em */}
            <ScrollReveal delay={100}>
              <h1
                style={{
                  fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                  fontSize: "clamp(42px, 7vw, 100px)",
                  fontWeight: 500,
                  letterSpacing: "-0.04em",
                  lineHeight: "1.05em",
                  color: "#fff",
                  margin: 0,
                  marginTop: 24,
                  maxWidth: 960,
                }}
                data-pgl-path="headline"
                data-pgl-edit="text"
              >
                {renderAccentText(c.headline, accent)}
              </h1>
            </ScrollReveal>

            {/* Subtitle — Urbanist 18px/14px, white/60% */}
            <ScrollReveal delay={200}>
              <p
                style={{
                  fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                  fontSize: "clamp(14px, 1.2vw, 18px)",
                  fontWeight: 400,
                  letterSpacing: "0em",
                  lineHeight: "1.6em",
                  color: "rgba(255,255,255,0.6)",
                  margin: 0,
                  marginTop: 24,
                  maxWidth: 580,
                }}
                data-pgl-path="subheadline"
                data-pgl-edit="text"
              >
                {c.subheadline}
              </p>
            </ScrollReveal>

            {/* Buttons — lime pill + white outline */}
            <ScrollReveal delay={300}>
              <div
                className="flex-col sm:flex-row"
                style={{ display: "flex", gap: 16, marginTop: 40, alignItems: "center" }}
              >
                {/* Primary CTA — lime green pill, dark text */}
                <a
                  href={c.ctaLink || "#contato"}
                  data-pgl-path="ctaText"
                  data-pgl-edit="button"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    padding: "16px 36px",
                    backgroundColor: accent,
                    borderRadius: 100,
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
                      fontWeight: 600,
                      letterSpacing: "-0.01em",
                      color: primary,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {c.ctaText}
                  </span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                    <path d="M3 8h10M9 4l4 4-4 4" stroke={primary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>

                {/* Secondary CTA — white outline pill */}
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
                      padding: "16px 36px",
                      backgroundColor: "transparent",
                      border: "1px solid rgba(255,255,255,0.4)",
                      borderRadius: 100,
                      textDecoration: "none",
                      transition: "background-color 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.08)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                        fontSize: 16,
                        fontWeight: 600,
                        letterSpacing: "-0.01em",
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
          </div>

          {/* ═══ Feature badges row ═══ */}
          <ScrollReveal delay={400}>
            <div
              className="flex-col md:flex-row"
              style={{
                display: "flex",
                width: "100%",
                maxWidth: 1296,
                borderTop: "1px solid rgba(252,255,245,0.15)",
                paddingTop: 40,
                paddingBottom: 60,
                gap: 0,
              }}
            >
              {badges.map((badge, idx) => {
                const IconComp = featureIcons[idx] || ShieldIcon;
                return (
                  <div
                    key={idx}
                    className="flex-1"
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "flex-start",
                      gap: 16,
                      padding: "20px 24px",
                      borderRight: idx < badges.length - 1 ? "1px solid rgba(252,255,245,0.15)" : "none",
                    }}
                  >
                    <div style={{ flexShrink: 0, marginTop: 2 }}>
                      <IconComp color={accent} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      <span
                        data-pgl-path={`brands.${idx}.name`}
                        data-pgl-edit="text"
                        style={{
                          fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                          fontSize: 18,
                          fontWeight: 600,
                          letterSpacing: "-0.02em",
                          lineHeight: "1.3em",
                          color: "#fff",
                        }}
                      >
                        {badge.title}
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                          fontSize: 14,
                          fontWeight: 400,
                          lineHeight: "1.5em",
                          color: "rgba(255,255,255,0.5)",
                        }}
                      >
                        {badge.description}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
