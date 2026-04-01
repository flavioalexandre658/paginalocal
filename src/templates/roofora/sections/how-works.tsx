"use client";

import type { DesignTokens } from "@/types/ai-generation";
import { ServicesContentSchema } from "@/types/ai-generation";
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

export function RooforaHowWorks({ content, tokens }: Props) {
  const parsed = ServicesContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const accent = tokens.palette.accent || "#CDF660";
  const surface = tokens.palette.primary || "#0E1201";

  // Use the first image from items that has one, or fallback
  const sideImage = c.items.find((item) => item.image)?.image;

  return (
    <section
      id="how-works"
      style={{ backgroundColor: surface, overflow: "hidden" }}
    >
      <div
        className="px-5 md:px-[30px] py-16 md:py-[100px]"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          className="flex flex-col md:flex-row w-full"
          style={{ maxWidth: 1296, gap: 60 }}
        >
          {/* ═══ Left Content ═══ */}
          <div
            className="w-full md:w-[55%]"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 48,
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {c.subtitle && (
                <ScrollReveal delay={0}>
                  <p
                    style={{
                      fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                      fontSize: 14,
                      fontWeight: 600,
                      letterSpacing: "0.06em",
                      lineHeight: "1.7em",
                      color: accent,
                      margin: 0,
                      textTransform: "uppercase",
                    }}
                    data-pgl-path="subtitle"
                    data-pgl-edit="text"
                  >
                    {c.subtitle}
                  </p>
                </ScrollReveal>
              )}
              <ScrollReveal delay={100}>
                <h2
                  style={{
                    fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                    fontSize: "clamp(28px, 4vw, 42px)",
                    fontWeight: 600,
                    letterSpacing: "-0.04em",
                    lineHeight: "1.15em",
                    color: "#fff",
                    margin: 0,
                    maxWidth: 520,
                  }}
                  data-pgl-path="title"
                  data-pgl-edit="text"
                >
                  {renderAccentText(c.title, accent)}
                </h2>
              </ScrollReveal>
            </div>

            {/* ═══ Numbered Steps ═══ */}
            <div
              className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6"
            >
              {c.items.slice(0, 3).map((item, idx) => {
                const stepNum = String(idx + 1).padStart(2, "0");
                return (
                  <ScrollReveal key={idx} delay={200 + idx * 150}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 16,
                      }}
                    >
                      {/* Step number */}
                      <span
                        style={{
                          fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                          fontSize: 48,
                          fontWeight: 700,
                          letterSpacing: "-0.04em",
                          lineHeight: "1em",
                          color: accent,
                          opacity: 0.9,
                        }}
                      >
                        {stepNum}
                      </span>

                      {/* Step title */}
                      <h3
                        style={{
                          fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                          fontSize: 20,
                          fontWeight: 600,
                          letterSpacing: "-0.02em",
                          lineHeight: "1.3em",
                          color: "#fff",
                          margin: 0,
                        }}
                        data-pgl-path={`items.${idx}.name`}
                        data-pgl-edit="text"
                      >
                        {item.name}
                      </h3>

                      {/* Step description */}
                      <p
                        style={{
                          fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                          fontSize: 15,
                          fontWeight: 400,
                          letterSpacing: "0px",
                          lineHeight: "1.6em",
                          color: "rgba(255,255,255,0.6)",
                          margin: 0,
                        }}
                        data-pgl-path={`items.${idx}.description`}
                        data-pgl-edit="text"
                      >
                        {item.description}
                      </p>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>

            {/* ═══ CTA Buttons ═══ */}
            <ScrollReveal delay={700}>
              <div
                className="flex flex-col sm:flex-row"
                style={{ gap: 12 }}
              >
                {/* Primary CTA — accent pill */}
                <a
                  href="#contato"
                  data-pgl-path="ctaPrimary"
                  data-pgl-edit="button"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    padding: "14px 28px",
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
                      color: surface,
                      whiteSpace: "nowrap",
                    }}
                  >
                    Fale Conosco
                  </span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                    <path d="M3 8h10M9 4l4 4-4 4" stroke={surface} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>

                {/* Secondary CTA — outline pill */}
                <a
                  href="#contato"
                  data-pgl-path="ctaSecondary"
                  data-pgl-edit="button"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    padding: "14px 28px",
                    backgroundColor: "transparent",
                    border: "1px solid rgba(252,255,245,0.4)",
                    borderRadius: 100,
                    textDecoration: "none",
                    transition: "background-color 0.2s, transform 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.06)";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.transform = "translateY(0)";
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
                    Agende Seu Servico
                  </span>
                </a>
              </div>
            </ScrollReveal>
          </div>

          {/* ═══ Right — Image ═══ */}
          <div
            className="w-full md:w-[45%]"
            style={{ display: "flex", alignItems: "stretch" }}
          >
            <ScrollReveal delay={300} className="w-full">
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  minHeight: 400,
                  borderRadius: 20,
                  overflow: "hidden",
                  backgroundImage: sideImage ? `url(${sideImage})` : undefined,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundColor: sideImage ? undefined : "rgba(255,255,255,0.06)",
                  border: sideImage ? "none" : "1px solid rgba(252,255,245,0.1)",
                }}
                data-pgl-path="sideImage"
                data-pgl-edit="image"
              >
                {!sideImage && (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg width="64" height="64" viewBox="0 0 48 48" fill="none" opacity="0.15">
                      <rect x="6" y="6" width="36" height="36" rx="6" stroke="#fff" strokeWidth="2" />
                      <circle cx="18" cy="18" r="4" stroke="#fff" strokeWidth="2" />
                      <path d="M6 34l12-9 8 6 16-12" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
