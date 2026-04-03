"use client";

import { useState } from "react";
import type { DesignTokens } from "@/types/ai-generation";
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

export function StratexContact({ content, tokens }: Props) {
  const accent = tokens.palette.accent;
  const title = (content.title as string) || "";
  const subtitle = (content.subtitle as string) || "";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const { submit, isSubmitting, submitted: isSuccess } = useSubmitFormLead();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    submit({ name, email, message });
  }

  const inputStyle = {
    width: "100%",
    padding: "14px 18px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.15)",
    backgroundColor: "rgba(255,255,255,0.06)",
    fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
    fontSize: 16,
    fontWeight: 400,
    color: "#fff",
    outline: "none",
    transition: "border-color 0.2s",
  } as const;

  return (
    <section
      id="contato"
      style={{
        backgroundColor: accent,
        padding: "80px 0",
      }}
    >
      <div className="px-[25px]" style={{ maxWidth: 700, margin: "0 auto" }}>
        <ScrollReveal>
          <div style={{ display: "flex", flexDirection: "column", gap: 20, alignItems: "center", marginBottom: 48 }}>
            {subtitle && (
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <div style={{ width: 8, height: 8, borderRadius: 1000, backgroundColor: "#fff", flexShrink: 0 }} />
                <span
                  style={{
                    fontFamily: "var(--pgl-font-heading), Georgia, serif",
                    fontSize: 16,
                    fontWeight: 400,
                    letterSpacing: "-0.03em",
                    lineHeight: "1em",
                    color: "#fff",
                  }}
                  data-pgl-path="subtitle"
                  data-pgl-edit="text"
                >
                  {subtitle}
                </span>
              </div>
            )}
            <h2
              style={{
                fontFamily: "var(--pgl-font-heading), Georgia, serif",
                fontSize: "clamp(28px, 4vw, 42px)",
                fontWeight: 400,
                letterSpacing: "-0.03em",
                lineHeight: "1.2em",
                color: "#fff",
                margin: 0,
                textAlign: "center",
              }}
              data-pgl-path="title"
              data-pgl-edit="text"
            >
              {renderAccentText(title, "#fff")}
            </h2>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={150}>
          {isSuccess ? (
            <div
              style={{
                textAlign: "center",
                padding: "48px 24px",
                borderRadius: 20,
                backgroundColor: "rgba(255,255,255,0.08)",
              }}
            >
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: "0 auto 16px" }}>
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <p style={{ fontFamily: "var(--pgl-font-heading), Georgia, serif", fontSize: 22, fontWeight: 400, color: "#fff", margin: 0 }}>
                Mensagem enviada!
              </p>
              <p style={{ fontFamily: "var(--pgl-font-body)", fontSize: 15, color: "rgba(255,255,255,0.7)", marginTop: 8 }}>
                Entraremos em contato em breve.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: 20 }}
            >
              <div>
                <label
                  style={{
                    fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                    fontSize: 14,
                    fontWeight: 500,
                    color: "rgba(255,255,255,0.7)",
                    display: "block",
                    marginBottom: 8,
                  }}
                >
                  Seu nome
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome completo"
                  required
                  style={inputStyle}
                />
              </div>
              <div>
                <label
                  style={{
                    fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                    fontSize: 14,
                    fontWeight: 500,
                    color: "rgba(255,255,255,0.7)",
                    display: "block",
                    marginBottom: 8,
                  }}
                >
                  Seu e-mail
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  style={inputStyle}
                />
              </div>
              <div>
                <label
                  style={{
                    fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                    fontSize: 14,
                    fontWeight: 500,
                    color: "rgba(255,255,255,0.7)",
                    display: "block",
                    marginBottom: 8,
                  }}
                >
                  Sua mensagem
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Como podemos ajudar?"
                  rows={4}
                  style={{ ...inputStyle, resize: "vertical", minHeight: 120 }}
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: "100%",
                  padding: "16px 24px",
                  borderRadius: 1000,
                  border: "none",
                  backgroundColor: "#fff",
                  color: accent,
                  fontFamily: "var(--pgl-font-heading), Georgia, serif",
                  fontSize: 17,
                  fontWeight: 400,
                  cursor: isSubmitting ? "wait" : "pointer",
                  opacity: isSubmitting ? 0.7 : 1,
                  transition: "opacity 0.2s",
                }}
              >
                {isSubmitting ? "Enviando..." : "Enviar mensagem"}
              </button>
            </form>
          )}
        </ScrollReveal>
      </div>
    </section>
  );
}
