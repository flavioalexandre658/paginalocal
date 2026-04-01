"use client";

import { useState } from "react";
import type { DesignTokens } from "@/types/ai-generation";
import { ContactContentSchema } from "@/types/ai-generation";
import { useSubmitFormLead } from "@/hooks/use-submit-form-lead";

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

export function PlumbflowQuickForm({ content, tokens }: Props) {
  const parsed = ContactContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const accent = tokens.palette.accent || "#FF5E15";
  const { submit, isSubmitting, submitted } = useSubmitFormLead();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    submit({ name: name.trim(), phone: phone.trim() || undefined });
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    height: 51,
    padding: "12px 24px",
    backgroundColor: "#fff",
    border: "1px solid rgba(20,47,69,0.1)",
    borderRadius: 56,
    fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
    fontSize: 16,
    fontWeight: 400,
    color: "var(--pgl-text, #2C282B)",
    outline: "none",
  };

  return (
    <section
      id="quick-service"
      style={{ backgroundColor: "var(--pgl-background)" }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "60px 20px",
        }}
      >
        {/* Card */}
        <div
          style={{
            width: "100%",
            maxWidth: 1296,
            backgroundColor: "var(--pgl-surface, #F1F2FA)",
            border: "1px solid rgba(20,47,69,0.1)",
            borderRadius: 16,
            padding: "40px 32px",
          }}
        >
          <div
            className="flex flex-col md:flex-row md:items-center md:justify-between"
            style={{ gap: 24 }}
          >
            {/* Title — with accent parse */}
            <h3
              style={{
                fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                fontSize: "clamp(22px, 3vw, 28px)",
                fontWeight: 700,
                letterSpacing: "-1px",
                lineHeight: "1.3em",
                color: "var(--pgl-text, #142F45)",
                margin: 0,
                flexShrink: 0,
                maxWidth: 380,
              }}
              data-pgl-path="title"
              data-pgl-edit="text"
            >
              {renderAccentText(c.title, accent)}
            </h3>

            {/* Form or success */}
            {submitted ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 12,
                  padding: "16px 0",
                  flex: 1,
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill={accent} />
                  <path d="M8 12l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span style={{
                  fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                  fontSize: 18, fontWeight: 700, color: accent,
                }}>
                  Solicitação enviada!
                </span>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col md:flex-row"
                style={{ gap: 12, flex: 1, maxWidth: 650 }}
              >
                <input
                  type="text"
                  placeholder="Seu nome completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={{ ...inputStyle, flex: 1 }}
                />

                <input
                  type="tel"
                  placeholder="Seu telefone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{ ...inputStyle, flex: 1 }}
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: 51,
                    padding: "0 28px",
                    backgroundColor: accent,
                    borderRadius: 58,
                    boxShadow: "rgba(255,255,255,0.4) 0px 4px 7px 0px inset",
                    border: "none",
                    cursor: isSubmitting ? "wait" : "pointer",
                    opacity: isSubmitting ? 0.7 : 1,
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                    transition: "opacity 0.2s",
                  }}
                >
                  <span style={{
                    fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                    fontSize: 16, fontWeight: 700, letterSpacing: "0.3px", color: "#fff",
                  }}>
                    {isSubmitting ? "Enviando..." : "Solicitar orçamento"}
                  </span>
                </button>
              </form>
            )}
          </div>

          {/* Subtitle below — if exists, show as description */}
          {c.subtitle && (
            <p
              style={{
                fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                fontSize: 14,
                fontWeight: 400,
                color: "var(--pgl-text-muted, #4B5554)",
                margin: "16px 0 0",
                maxWidth: 600,
              }}
              data-pgl-path="subtitle"
              data-pgl-edit="text"
            >
              {c.subtitle}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
