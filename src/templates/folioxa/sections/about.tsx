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

export function FolioxaAbout({ content, tokens }: Props) {
  if (Array.isArray(content.paragraphs)) {
    content.paragraphs = (content.paragraphs as unknown[]).map((p) =>
      typeof p === "string" ? p : typeof p === "object" && p !== null && "text" in p ? String((p as Record<string, unknown>).text) : String(p)
    );
  }

  const parsed = AboutContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const accent = tokens.palette.accent;
  const primary = tokens.palette.primary;

  const highlights = c.highlights || [];

  return (
    <section id="about" style={{ backgroundColor: "var(--pgl-background)", overflow: "hidden" }}>
      <div className="px-5 md:px-10 py-16 md:py-[80px]" style={{ maxWidth: 1310, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>

        {/* ═══ ROW 1 ═══ */}
        <ScrollReveal delay={0}>
          <div className="flex flex-col md:flex-row" style={{ gap: 20 }}>

            {/* LEFT — Info Card (gradient bg + photo) */}
            <div
              className="w-full md:flex-1 md:min-w-[400px] md:max-w-[650px]"
              style={{
                borderRadius: 30, height: 404, padding: 30,
                display: "flex", position: "relative", overflow: "hidden",
                background: `linear-gradient(135deg, ${accent}, ${accent}bb)`,
              }}
            >
              {/* Left text column */}
              <div style={{
                display: "flex", flexDirection: "column", justifyContent: "space-between",
                maxWidth: 250, height: "100%", zIndex: 2,
              }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <h2 style={{
                    fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                    fontSize: 28, fontWeight: 600, lineHeight: "1.4em", color: "#fff", margin: 0,
                  }} data-pgl-path="title" data-pgl-edit="text">
                    {renderAccentText(c.title, "#fff")}
                  </h2>
                  {c.subtitle && (
                    <p style={{
                      fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                      fontSize: 17, fontWeight: 500, lineHeight: "1.3em", color: "#fff", margin: 0,
                    }} data-pgl-path="subtitle" data-pgl-edit="text">
                      {c.subtitle}
                    </p>
                  )}
                  {/* Badge */}
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    padding: "6px 14px", backgroundColor: "rgba(255,255,255,0.2)",
                    borderRadius: 99, width: "fit-content",
                  }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#fff" }} />
                    <span style={{
                      fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                      fontSize: 14, fontWeight: 500, color: "#fff", textTransform: "uppercase",
                    }}>
                      Especialista
                    </span>
                  </div>
                </div>

                {/* CTA */}
                {c.ctaText && (
                  <a href="#contato" data-pgl-path="ctaText" data-pgl-edit="button" style={{
                    display: "inline-flex", alignItems: "center", gap: 4, padding: 6,
                    backgroundColor: "#fff", borderRadius: 10,
                    border: "1px solid var(--pgl-border, #edeff3)",
                    textDecoration: "none", width: "fit-content",
                  }}>
                    <div style={{ padding: "4px 12px" }}>
                      <span style={{ fontFamily: "var(--pgl-font-body)", fontSize: 15, fontWeight: 500, color: "var(--pgl-text)" }}>
                        {c.ctaText}
                      </span>
                    </div>
                    <div style={{
                      width: 32, height: 32, borderRadius: 8,
                      backgroundColor: "var(--pgl-surface, #f7f7f7)",
                      border: "1px solid var(--pgl-border, #edeff3)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--pgl-text)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M13 18l6-6M13 6l6 6" />
                      </svg>
                    </div>
                  </a>
                )}
              </div>

              {/* Right — profile photo (absolute, bottom-right) */}
              <div
                style={{
                  position: "absolute", bottom: -9, right: 0,
                  width: 339, height: 383, zIndex: 1,
                }}
                data-pgl-path="image"
                data-pgl-edit="image"
              >
                {c.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
                ) : (
                  <div style={{ width: "100%", height: "100%", background: `linear-gradient(180deg, transparent, ${accent}44)` }} />
                )}
              </div>
            </div>

            {/* RIGHT — Content column (Process + Stats) */}
            <div className="flex-1 flex flex-col md:flex-row" style={{ gap: 20, height: 404 }}>
              {/* Process card */}
              <div style={{
                flex: 1, borderRadius: 30, padding: 30,
                backgroundColor: "var(--pgl-surface, #f3f3f1)",
                display: "flex", flexDirection: "column", justifyContent: "space-between",
              }}>
                <h3 style={{
                  fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                  fontSize: 30, fontWeight: 500, lineHeight: "33px",
                  letterSpacing: "-1.2px", color: "var(--pgl-text)", margin: 0,
                }}>
                  {c.paragraphs[0] || "3 passos para o sucesso"}
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {(c.paragraphs.slice(1, 4).length > 0 ? c.paragraphs.slice(1, 4) : ["Criar Design", "Desenvolver", "Lançar"]).map((step, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 9 }}>
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <circle cx="9" cy="9" r="8" stroke={accent} strokeWidth="1.5" />
                        <path d="M5.5 9l2.5 2.5 4.5-4.5" stroke={accent} strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                      <span style={{
                        fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                        fontSize: 16, fontWeight: 400, color: "var(--pgl-text)",
                      }} data-pgl-path={`paragraphs.${i + 1}`} data-pgl-edit="text">
                        {step}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats card */}
              <div style={{
                flex: 1, borderRadius: 30, padding: 30,
                backgroundColor: "var(--pgl-surface, #f3f3f1)",
                display: "flex", flexDirection: "column",
              }}>
                {/* Stat number */}
                {highlights[0] && (
                  <div style={{ marginBottom: 4 }}>
                    <h2 style={{
                      fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                      fontSize: 28, fontWeight: 600, color: accent, margin: 0,
                    }} data-pgl-path="highlights.0.label" data-pgl-edit="text">
                      {highlights[0].label}
                    </h2>
                    <p style={{
                      fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                      fontSize: 17, fontWeight: 500, color: "var(--pgl-text)", margin: 0,
                    }} data-pgl-path="highlights.0.value" data-pgl-edit="text">
                      {highlights[0].value}
                    </p>
                  </div>
                )}
                {/* Separator line — gradient */}
                <div style={{
                  height: 1, width: "100%", margin: "12px 0",
                  background: "linear-gradient(90deg, var(--pgl-border, #cfcecc), var(--pgl-surface, #f3f3f1))",
                }} />
                {/* Checklist */}
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {highlights.slice(1).map((h, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                      <span style={{
                        fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                        fontSize: 16, fontWeight: 400, color: "var(--pgl-text)",
                      }} data-pgl-path={`highlights.${i + 1}.label`} data-pgl-edit="text">
                        {h.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* ═══ ROW 2 — 3 cards ═══ */}
        <ScrollReveal delay={150}>
          <div className="flex flex-col md:flex-row" style={{ gap: 20 }}>
            {/* Card 1 — Support (white bg, image top) */}
            <div style={{
              flex: 1, borderRadius: 30, padding: 30, backgroundColor: "#fff",
              display: "flex", flexDirection: "column", justifyContent: "flex-end",
              minHeight: 300, position: "relative", overflow: "hidden",
            }}>
              <h3 style={{
                fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                fontSize: 26, fontWeight: 500, lineHeight: "1.2em", color: "var(--pgl-text)", margin: "0 0 8px",
              }}>
                {c.paragraphs[4] || "Suporte 24h por E-mail"}
              </h3>
              <p style={{
                fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                fontSize: 16, fontWeight: 400, color: "var(--pgl-text-muted)", margin: 0,
              }}>
                {c.paragraphs[5] || "Entre em contato a qualquer momento e receba ajuda em até 24 horas."}
              </p>
            </div>

            {/* Card 2 — Dark stat (100% + stars) */}
            <div style={{
              flex: 1, borderRadius: 30, padding: 30, backgroundColor: primary,
              display: "flex", flexDirection: "column", justifyContent: "flex-end",
              minHeight: 300, position: "relative", overflow: "hidden",
            }}>
              <h3 style={{
                fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                fontSize: 26, fontWeight: 500, color: "#fff", margin: "0 0 4px",
              }}>
                {c.paragraphs[6] || "100%"}
              </h3>
              <p style={{
                fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                fontSize: 16, fontWeight: 400, color: "rgba(255,255,255,0.6)", margin: "0 0 12px",
              }}>
                {c.paragraphs[7] || "Clientes satisfeitos"}
              </p>
              <div style={{ display: "flex", gap: 4 }}>
                {[0,1,2,3,4].map(i => (
                  <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#fff">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" />
                  </svg>
                ))}
              </div>
            </div>

            {/* Card 3 — Dark feature (wide, with image bg) */}
            <div style={{
              flex: 1.5, borderRadius: 30, padding: 30, backgroundColor: primary,
              display: "flex", flexDirection: "column", justifyContent: "flex-end",
              minHeight: 300, position: "relative", overflow: "hidden",
            }}>
              <h3 style={{
                fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                fontSize: 26, fontWeight: 500, color: "#fff", lineHeight: "1.2em", margin: "0 0 8px",
              }}>
                {c.paragraphs[8] || "Construa e lance sites com confiança"}
              </h3>
              <p style={{
                fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                fontSize: 16, fontWeight: 400, color: "rgba(255,255,255,0.5)", margin: 0,
              }}>
                {c.paragraphs[9] || "Processo simplificado para criar, personalizar e publicar sites modernos."}
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
