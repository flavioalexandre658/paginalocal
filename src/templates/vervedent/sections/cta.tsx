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

export function VerveCta({ content, tokens }: Props) {
  const { submit, isSubmitting, submitted } = useSubmitFormLead();

  const [email, setEmail] = useState("");

  const parsed = CtaContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const accent = tokens.palette.accent;
  const primary = tokens.palette.primary;
  const secondary = tokens.palette.secondary;


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    submit({ name: email.trim(), email: email.trim() });
  };

  return (
    <section
      id="cta"
      style={{
        backgroundColor: "var(--pgl-background)",
        overflow: "hidden",
      }}
    >
      <div
        className="px-5 md:px-12 py-16 md:py-[100px]"
        style={{
          maxWidth: 1296,
          margin: "0 auto",
        }}
      >
        <ScrollReveal delay={0}>
          <div
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 md:gap-12"
            style={{
              backgroundColor: secondary,
              borderRadius: 0,
              padding: "48px 48px",
              maxWidth: 900,
              margin: "0 auto",
            }}
          >
            {/* Left side: Title + Description */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                flex: 1,
                maxWidth: 480,
              }}
            >
              <h2
                style={{
                  fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                  fontSize: "clamp(24px, 3.5vw, 36px)",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  lineHeight: "1.2em",
                  color: "#fff",
                  margin: 0,
                }}
                data-pgl-path="title"
                data-pgl-edit="text"
              >
                {renderAccentText(c.title, accent)}
              </h2>

              <p
                style={{
                  fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                  fontSize: 16,
                  fontWeight: 400,
                  lineHeight: "1.7em",
                  color: "rgba(255,255,255,0.8)",
                  margin: 0,
                }}
                data-pgl-path="ctaText"
                data-pgl-edit="text"
              >
                {c.ctaText}
              </p>
            </div>

            {/* Right side: Form */}
            <div style={{ flex: 1, maxWidth: 400 }}>
              {submitted ? (
                <ScrollReveal delay={100}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "16px 24px",
                      backgroundColor: "rgba(255,255,255,0.15)",
                      borderRadius: 0,
                    }}
                  >
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                      <circle cx="11" cy="11" r="9" fill="#fff" />
                      <path d="M7 11l3 3 5-5" stroke={secondary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span
                      style={{
                        fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                        fontSize: 15,
                        fontWeight: 500,
                        color: "#fff",
                      }}
                    >
                      Inscrito com sucesso!
                    </span>
                  </div>
                </ScrollReveal>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                  }}
                >
                  <input
                    type="email"
                    placeholder="Seu melhor e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{
                      width: "100%",
                      padding: "14px 20px",
                      backgroundColor: "#fff",
                      border: "none",
                      borderRadius: 0,
                      fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                      fontSize: 15,
                      fontWeight: 400,
                      color: "var(--pgl-text)",
                      outline: "none",
                    }}
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      width: "100%",
                      padding: "14px 24px",
                      backgroundColor: primary,
                      borderRadius: 0,
                      border: "none",
                      cursor: isSubmitting ? "wait" : "pointer",
                      opacity: isSubmitting ? 0.7 : 1,
                      transition: "opacity 0.2s",
                      fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                      fontSize: 15,
                      fontWeight: 600,
                      color: "#fff",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {isSubmitting ? "Enviando..." : "Inscrever"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
