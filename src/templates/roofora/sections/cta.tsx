"use client";

import { useState } from "react";
import type { DesignTokens } from "@/types/ai-generation";
import { CtaContentSchema } from "@/types/ai-generation";
import { useSubmitFormLead } from "@/hooks/use-submit-form-lead";
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

export function RooforaCta({ content, tokens }: Props) {
  const parsed = CtaContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const accent = tokens.palette.accent || "#CDF660";
  const dark = tokens.palette.primary || "#0E1201";

  const { submit, isSubmitting, submitted } = useSubmitFormLead();
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    submit({ name: email.trim(), email: email.trim() });
  };

  return (
    <section
      id="cta"
      style={{
        backgroundColor: dark,
        fontFamily: "var(--pgl-font-body, 'Urbanist'), system-ui, sans-serif",
      }}
    >
      <div
        className="mx-auto max-w-[1200px] px-5 md:px-10 py-16 md:py-24"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: 32,
        }}
      >
        {/* ═══ Subtitulo ═══ */}
        {c.subtitle && (
          <ScrollReveal delay={0}>
            <p
              data-pgl-path="subtitle"
              data-pgl-edit="text"
              style={{
                fontFamily: "var(--pgl-font-body, 'Urbanist'), system-ui, sans-serif",
                fontSize: 14,
                fontWeight: 500,
                letterSpacing: "0.05em",
                lineHeight: "1.6em",
                color: "rgba(252,255,245,0.6)",
                margin: 0,
                textTransform: "uppercase",
              }}
            >
              {c.subtitle}
            </p>
          </ScrollReveal>
        )}

        {/* ═══ Titulo ═══ */}
        <ScrollReveal delay={100}>
          <h2
            data-pgl-path="title"
            data-pgl-edit="text"
            style={{
              fontFamily: "var(--pgl-font-heading, 'Urbanist'), system-ui, sans-serif",
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 700,
              letterSpacing: "-1px",
              lineHeight: "1.15em",
              color: "#fff",
              margin: 0,
              maxWidth: 600,
            }}
          >
            {renderAccentText(c.title, accent)}
          </h2>
        </ScrollReveal>

        {/* ═══ Formulario ═══ */}
        <ScrollReveal delay={200} className="w-full">
          <div style={{ maxWidth: 520, margin: "0 auto", width: "100%" }}>
            {submitted ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 16,
                  padding: "24px 0",
                }}
              >
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <circle cx="24" cy="24" r="20" fill={accent} />
                  <path
                    d="M16 24l6 6 10-10"
                    stroke={dark}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span
                  style={{
                    fontFamily: "var(--pgl-font-heading, 'Urbanist'), system-ui, sans-serif",
                    fontSize: 20,
                    fontWeight: 700,
                    color: "#fff",
                  }}
                >
                  Inscrito com sucesso!
                </span>
                <span
                  style={{
                    fontFamily: "var(--pgl-font-body, 'Urbanist'), system-ui, sans-serif",
                    fontSize: 16,
                    fontWeight: 400,
                    color: "rgba(252,255,245,0.6)",
                  }}
                >
                  Entraremos em contato em breve.
                </span>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* Desktop: pill container with input + button inline */}
                <div
                  className="hidden sm:flex"
                  style={{
                    borderRadius: 100,
                    border: "1px solid rgba(252,255,245,0.15)",
                    backgroundColor: "rgba(255,255,255,0.06)",
                    overflow: "hidden",
                    alignItems: "center",
                  }}
                >
                  <input
                    type="email"
                    name="email"
                    placeholder="Seu melhor e-mail"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 min-w-0"
                    style={{
                      padding: "16px 24px",
                      backgroundColor: "transparent",
                      border: "none",
                      fontFamily: "var(--pgl-font-body, 'Urbanist'), system-ui, sans-serif",
                      fontSize: 16,
                      fontWeight: 400,
                      color: "#fff",
                      outline: "none",
                    }}
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      padding: "14px 32px",
                      margin: 4,
                      backgroundColor: accent,
                      border: "none",
                      borderRadius: 100,
                      fontFamily: "var(--pgl-font-heading, 'Urbanist'), system-ui, sans-serif",
                      fontSize: 16,
                      fontWeight: 600,
                      color: dark,
                      cursor: isSubmitting ? "wait" : "pointer",
                      opacity: isSubmitting ? 0.7 : 1,
                      transition: "opacity 0.2s",
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                    }}
                  >
                    {isSubmitting ? "Enviando..." : "Inscrever-se"}
                  </button>
                </div>

                {/* Mobile: stacked input + button */}
                <div
                  className="flex sm:hidden flex-col"
                  style={{ gap: 12 }}
                >
                  <input
                    type="email"
                    name="email-mobile"
                    placeholder="Seu melhor e-mail"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      padding: "16px 20px",
                      backgroundColor: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(252,255,245,0.15)",
                      borderRadius: 12,
                      fontFamily: "var(--pgl-font-body, 'Urbanist'), system-ui, sans-serif",
                      fontSize: 16,
                      fontWeight: 400,
                      color: "#fff",
                      outline: "none",
                      width: "100%",
                    }}
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      padding: "16px 32px",
                      backgroundColor: accent,
                      border: "none",
                      borderRadius: 100,
                      fontFamily: "var(--pgl-font-heading, 'Urbanist'), system-ui, sans-serif",
                      fontSize: 16,
                      fontWeight: 600,
                      color: dark,
                      cursor: isSubmitting ? "wait" : "pointer",
                      opacity: isSubmitting ? 0.7 : 1,
                      transition: "opacity 0.2s",
                      width: "100%",
                    }}
                  >
                    {isSubmitting ? "Enviando..." : "Inscrever-se"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
