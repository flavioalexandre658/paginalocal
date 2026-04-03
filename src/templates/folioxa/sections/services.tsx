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

/* ── Service Icons ── */
function ServiceIcon({ index }: { index: number }) {
  const icons = [
    // Layout / Landing page
    <svg key="0" width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="3" stroke="#fff" strokeWidth="1.75" />
      <path d="M3 9h18M9 9v12" stroke="#fff" strokeWidth="1.75" />
    </svg>,
    // Code / Development
    <svg key="1" width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M8 17l-4-5 4-5M16 7l4 5-4 5" stroke="#fff" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 4l-4 16" stroke="#fff" strokeWidth="1.75" strokeLinecap="round" />
    </svg>,
    // Pen / Copywriting
    <svg key="2" width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M12 20h9M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4L16.5 3.5z" stroke="#fff" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>,
    // Diamond / Brand Identity
    <svg key="3" width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M6 3h12l4 6-10 12L2 9l4-6z" stroke="#fff" strokeWidth="1.75" strokeLinejoin="round" />
      <path d="M2 9h20" stroke="#fff" strokeWidth="1.75" />
      <path d="M10 3l-2 6 4 12 4-12-2-6" stroke="#fff" strokeWidth="1.75" strokeLinejoin="round" />
    </svg>,
    // Chat / Consultation
    <svg key="4" width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z" stroke="#fff" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 10h8M8 14h4" stroke="#fff" strokeWidth="1.75" strokeLinecap="round" />
    </svg>,
  ];
  return icons[index % icons.length];
}

export function FolioxaServices({ content, tokens }: Props) {
  const parsed = ServicesContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const accent = tokens.palette.accent;
  const primary = tokens.palette.primary;

  /* Tech stack logos — decorative marquee on left column */
  const techLogos = ["React", "Next.js", "Figma", "Node.js", "Tailwind", "Vercel"];

  return (
    <section
      id="services"
      style={{ backgroundColor: "var(--pgl-background)", overflow: "hidden" }}
    >
      <div
        className="px-5 md:px-10 py-16 md:py-[100px]"
        style={{ maxWidth: 1310, margin: "0 auto" }}
      >
        {/* ═══ Two-column layout ═══ */}
        <div className="flex flex-col md:flex-row" style={{ gap: 20 }}>

          {/* LEFT — Sticky info column */}
          <ScrollReveal delay={0} className="w-full md:w-[420px] md:flex-shrink-0">
            <div className="md:sticky" style={{ top: 100 }}>
              {/* Double-layer card */}
              <div style={{
                backgroundColor: "#fff",
                borderRadius: 28,
                boxShadow: "0 0 14px rgba(0,0,0,0.05)",
                padding: 4,
              }}>
                <div style={{
                  background: "linear-gradient(180deg, #fff 52%, var(--pgl-surface, #fafbf8) 100%)",
                  borderRadius: 24,
                  border: "1px solid var(--pgl-border, #edeff3)",
                  padding: 30,
                  display: "flex",
                  flexDirection: "column",
                  gap: 20,
                }}>
                  {/* Tag badge */}
                  {c.subtitle && (
                    <div style={{
                      display: "inline-flex", alignItems: "center",
                      padding: "8px 16px",
                      backgroundColor: "var(--pgl-surface, #f7f7f7)",
                      border: "1px solid var(--pgl-border, #edeff3)",
                      borderRadius: 8,
                      width: "fit-content",
                    }}>
                      <span
                        style={{
                          fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                          fontSize: 14, fontWeight: 500, color: "var(--pgl-text)",
                        }}
                        data-pgl-path="subtitle"
                        data-pgl-edit="text"
                      >
                        {c.subtitle}
                      </span>
                    </div>
                  )}

                  {/* Title */}
                  <h2
                    style={{
                      fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                      fontSize: "clamp(28px, 3.5vw, 40px)",
                      fontWeight: 500,
                      letterSpacing: "-1.5px",
                      lineHeight: "1.1em",
                      color: "var(--pgl-text)",
                      margin: 0,
                    }}
                    data-pgl-path="title"
                    data-pgl-edit="text"
                  >
                    {renderAccentText(c.title, accent)}
                  </h2>

                  {/* Description */}
                  {c.items[0]?.description && (
                    <p style={{
                      fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                      fontSize: 16, fontWeight: 400, lineHeight: "1.6em",
                      color: "var(--pgl-text-muted)", margin: 0,
                    }}>
                      Soluções profissionais para elevar seu negócio ao próximo nível.
                    </p>
                  )}

                  {/* CTA button — dark pill */}
                  <a
                    href="#contato"
                    style={{
                      display: "inline-flex", alignItems: "center",
                      gap: 4, height: 48, padding: 6,
                      backgroundColor: primary, borderRadius: 10,
                      boxShadow: "0px 1px 2px rgba(23,24,28,0.24), 0px 6px 12px -8px rgba(23,24,28,0.7), 0px 12px 32px -8px rgba(23,24,28,0.4)",
                      textDecoration: "none", transition: "opacity 0.2s",
                      width: "fit-content",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.9"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
                  >
                    <div style={{ padding: "4px 12px", display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{
                        fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                        fontSize: 15, fontWeight: 500, color: "#fff",
                      }}>
                        Solicitar Orçamento
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

                  {/* Tech stack marquee */}
                  <div style={{ overflow: "hidden", width: "100%", marginTop: 8 }}>
                    <div style={{
                      display: "flex", gap: 8, alignItems: "center",
                      animation: "folioxa-services-marquee 15s linear infinite",
                      width: "max-content",
                    }}>
                      {[...techLogos, ...techLogos, ...techLogos].map((logo, i) => (
                        <div key={i} style={{
                          display: "inline-flex", alignItems: "center",
                          padding: "6px 14px",
                          backgroundColor: "#fff",
                          border: "1px solid var(--pgl-border, #edeff3)",
                          borderRadius: 12,
                          whiteSpace: "nowrap",
                        }}>
                          <span style={{
                            fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                            fontSize: 13, fontWeight: 500, color: "var(--pgl-text)",
                            opacity: 0.6,
                          }}>
                            {logo}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <style dangerouslySetInnerHTML={{ __html: `
                    @keyframes folioxa-services-marquee {
                      0% { transform: translateX(0); }
                      100% { transform: translateX(-33.333%); }
                    }
                  `}} />
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* RIGHT — Scrolling service cards */}
          <div className="flex-1 flex flex-col" style={{ gap: 20 }}>
            {c.items.map((item, idx) => (
              <ScrollReveal key={idx} delay={100 + idx * 80}>
                {/* Outer wrapper — double-layer card */}
                <div
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: 28,
                    boxShadow: "0 0 14px rgba(0,0,0,0.05)",
                    padding: 4,
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 0 14px rgba(0,0,0,0.05)";
                  }}
                >
                  {/* Inner container */}
                  <div style={{
                    background: "linear-gradient(180deg, #fff 52%, var(--pgl-surface, #fafbf8) 100%)",
                    borderRadius: 24,
                    border: "1px solid var(--pgl-border, #edeff3)",
                    padding: 30,
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                  }}>
                    {/* Top row — icon + title + arrow */}
                    <div style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        {/* Icon — dark radial gradient bg */}
                        <div style={{
                          width: 40, height: 40, borderRadius: 10,
                          background: "radial-gradient(75% 75% at 50% 50%, #000 37%, #454545 100%)",
                          boxShadow: "0px 1px 0px 1px rgba(30,30,30,0.9), 0px 0px 0px 1px rgba(30,30,30,0.9), inset 0px 0.5px 0px rgba(200,200,200,0.3)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          flexShrink: 0,
                        }}>
                          <ServiceIcon index={idx} />
                        </div>
                        <h3 style={{
                          fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                          fontSize: 20, fontWeight: 500,
                          letterSpacing: "-0.5px", lineHeight: "1.3em",
                          color: "var(--pgl-text)", margin: 0,
                        }}
                          data-pgl-path={`items.${idx}.name`}
                          data-pgl-edit="text"
                        >
                          {item.name}
                        </h3>
                      </div>
                      {/* Arrow icon */}
                      <div style={{
                        width: 36, height: 36, borderRadius: 10,
                        border: "1px solid var(--pgl-border, #edeff3)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                      }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--pgl-text)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="7" y1="17" x2="17" y2="7" />
                          <polyline points="7 7 17 7 17 17" />
                        </svg>
                      </div>
                    </div>

                    {/* Description */}
                    <p style={{
                      fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                      fontSize: 15, fontWeight: 400, lineHeight: "1.6em",
                      color: "var(--pgl-text-muted)", margin: 0,
                    }}
                      data-pgl-path={`items.${idx}.description`}
                      data-pgl-edit="text"
                    >
                      {item.description}
                    </p>

                    {/* Separator */}
                    <div style={{
                      height: 1, width: "100%",
                      background: "linear-gradient(90deg, var(--pgl-border, #edeff3), var(--pgl-surface, #f3f3f1))",
                    }} />

                    {/* Bottom row — price or CTA */}
                    <div style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                    }}>
                      {item.price && (
                        <span style={{
                          fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                          fontSize: 18, fontWeight: 600, color: accent,
                        }}>
                          {item.price}
                        </span>
                      )}
                      <a
                        href={item.ctaLink || "#contato"}
                        data-pgl-path={`items.${idx}.ctaText`}
                        data-pgl-edit="button"
                        style={{
                          display: "inline-flex", alignItems: "center", gap: 6,
                          padding: "8px 16px",
                          backgroundColor: "var(--pgl-surface, #f7f7f7)",
                          border: "1px solid var(--pgl-border, #edeff3)",
                          borderRadius: 8,
                          textDecoration: "none",
                          transition: "background-color 0.2s",
                          marginLeft: "auto",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--pgl-border, #edeff3)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "var(--pgl-surface, #f7f7f7)"; }}
                      >
                        <span style={{
                          fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                          fontSize: 14, fontWeight: 500, color: "var(--pgl-text)",
                        }}>
                          {item.ctaText || "Saiba mais"}
                        </span>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M3 7h8M8 4l3 3-3 3" stroke="var(--pgl-text)" strokeWidth="1.2" strokeLinecap="round" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
