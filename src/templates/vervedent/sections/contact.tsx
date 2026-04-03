"use client";

import type { DesignTokens } from "@/types/ai-generation";
import { ContactContentSchema } from "@/types/ai-generation";
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

const HORARIOS = [
  { dia: "Segunda-feira", horario: "08:00 - 18:00" },
  { dia: "Terca-feira", horario: "08:00 - 18:00" },
  { dia: "Quarta-feira", horario: "08:00 - 18:00" },
  { dia: "Quinta-feira", horario: "08:00 - 18:00" },
  { dia: "Sexta-feira", horario: "08:00 - 18:00" },
  { dia: "Sabado", horario: "08:00 - 14:00" },
  { dia: "Domingo", horario: "Fechado" },
];

export function VerveContact({ content, tokens }: Props) {
  const parsed = ContactContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const accent = tokens.palette.accent;
  const secondary = tokens.palette.secondary;
  const primary = tokens.palette.primary;

  const whatsappLink = c.whatsapp
    ? `https://wa.me/${c.whatsapp.replace(/\D/g, "")}`
    : "#contato";

  return (
    <section
      id="contato"
      style={{
        backgroundColor: secondary,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        className="px-5 md:px-12 py-16 md:py-[120px]"
        style={{
          maxWidth: 1296,
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* ═══ Top area: Title + Description + Arrow decoration ═══ */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: 56,
          }}
        >
          <div style={{ maxWidth: 560 }}>
            <ScrollReveal delay={0}>
              <h2
                style={{
                  fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                  fontSize: "clamp(28px, 4vw, 44px)",
                  fontWeight: 600,
                  fontStyle: "italic",
                  letterSpacing: "-0.03em",
                  lineHeight: "1.15em",
                  color: "#fff",
                  margin: 0,
                  marginBottom: 16,
                }}
                data-pgl-path="title"
                data-pgl-edit="text"
              >
                {renderAccentText(c.title, accent)}
              </h2>
            </ScrollReveal>

            {c.subtitle && (
              <ScrollReveal delay={100}>
                <p
                  style={{
                    fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                    fontSize: 16,
                    fontWeight: 400,
                    lineHeight: "1.7em",
                    color: "rgba(255,255,255,0.75)",
                    margin: 0,
                    maxWidth: 440,
                  }}
                  data-pgl-path="subtitle"
                  data-pgl-edit="text"
                >
                  {c.subtitle}
                </p>
              </ScrollReveal>
            )}
          </div>

          {/* Curved arrow decoration */}
          <div
            className="hidden md:block"
            style={{ flexShrink: 0, opacity: 0.3 }}
          >
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <path d="M10 60C10 30 30 10 60 10" stroke={accent} strokeWidth="2" strokeLinecap="round" />
              <path d="M50 4l12 6-6 12" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* ═══ Bottom area: 2 columns ═══ */}
        <div
          className="flex flex-col lg:flex-row"
          style={{ gap: 0 }}
        >
          {/* LEFT: Working Program card */}
          <ScrollReveal delay={200} className="lg:w-5/12">
            <div
              style={{
                backgroundColor: primary,
                borderRadius: 0,
                padding: "40px 36px",
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                  fontSize: 22,
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                  lineHeight: "1.3em",
                  color: "#fff",
                  margin: 0,
                  marginBottom: 28,
                }}
              >
                Nosso Horario de Atendimento
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: 0, flex: 1 }}>
                {HORARIOS.map((h, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "14px 0",
                      borderBottom: "1px solid rgba(255,255,255,0.12)",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                        fontSize: 15,
                        fontWeight: 500,
                        color: "rgba(255,255,255,0.85)",
                      }}
                    >
                      {h.dia}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                        fontSize: 15,
                        fontWeight: 400,
                        color: h.horario === "Fechado" ? "rgba(255,255,255,0.4)" : accent,
                      }}
                    >
                      {h.horario}
                    </span>
                  </div>
                ))}
              </div>

              {/* Phone & Email at bottom */}
              {(c.phone || c.email) && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 24 }}>
                  {c.phone && (
                    <a
                      href={`tel:${c.phone}`}
                      data-pgl-path="phone"
                      data-pgl-edit="text"
                      style={{
                        fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                        fontSize: 15,
                        color: accent,
                        textDecoration: "none",
                      }}
                    >
                      {c.phone}
                    </a>
                  )}
                  {c.email && (
                    <a
                      href={`mailto:${c.email}`}
                      data-pgl-path="email"
                      data-pgl-edit="text"
                      style={{
                        fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                        fontSize: 15,
                        color: "rgba(255,255,255,0.7)",
                        textDecoration: "none",
                      }}
                    >
                      {c.email}
                    </a>
                  )}
                </div>
              )}
            </div>
          </ScrollReveal>

          {/* RIGHT: Image with overlay button */}
          <ScrollReveal delay={300} className="lg:w-7/12">
            <div
              style={{
                position: "relative",
                borderRadius: 0,
                overflow: "hidden",
                height: "100%",
                minHeight: 420,
                backgroundColor: `${primary}22`,
              }}
            >
              {/* Placeholder image — a dental/clinic visual */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: `linear-gradient(135deg, ${primary}44 0%, ${secondary}66 100%)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {/* Decorative tooth SVG as placeholder */}
                <svg width="120" height="120" viewBox="0 0 32 32" fill="none" style={{ opacity: 0.15 }}>
                  <path d="M16 4c-4 0-7 2-8 5s-1 7 0 10c.7 2 1.5 4.5 2.5 7 .6 1.5 1.5 2 2.5 2s1.8-1 2-2.5l1-4.5 1 4.5c.2 1.5 1 2.5 2 2.5s1.9-.5 2.5-2c1-2.5 1.8-5 2.5-7 1-3 1-7 0-10s-4-5-8-5z" stroke="#fff" strokeWidth="1" fill="rgba(255,255,255,0.05)" />
                </svg>
              </div>

              {/* Centered "Agendar Consulta" button overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 2,
                }}
              >
                <a
                  href={whatsappLink}
                  target={c.whatsapp ? "_blank" : undefined}
                  rel={c.whatsapp ? "noopener noreferrer" : undefined}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "16px 36px",
                    backgroundColor: "#fff",
                    borderRadius: 0,
                    border: "none",
                    textDecoration: "none",
                    cursor: "pointer",
                    transition: "transform 0.2s, box-shadow 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                      fontSize: 16,
                      fontWeight: 600,
                      letterSpacing: "-0.01em",
                      color: primary,
                    }}
                  >
                    Agendar Consulta
                  </span>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M4 9h10M10 5l4 4-4 4" stroke={primary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
