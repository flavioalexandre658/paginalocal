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

export function PlumbflowCta({ content, tokens }: Props) {
  const parsed = CtaContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const accent = tokens.palette.accent || "#FF5E15";
  const primary = tokens.palette.primary || "#142F45";

  const { submit, isSubmitting, submitted } = useSubmitFormLead();

  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    submit({
      name: formData.name.trim(),
      email: formData.email.trim() || undefined,
      phone: formData.phone.trim() || undefined,
      message: formData.message.trim() || undefined,
    });
  };

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    height: 51,
    padding: "12px 24px",
    backgroundColor: "var(--pgl-surface, #F1F2FA)",
    border: "1px solid rgba(20,47,69,0.1)",
    borderRadius: 56,
    fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
    fontSize: 16, fontWeight: 400,
    color: "var(--pgl-text, #2C282B)",
    outline: "none",
  };

  return (
    <section id="cta" style={{ position: "relative" }}>
      {/* ═══ Dark banner with bg image ═══ */}
      <div
        style={{
          width: "100%",
          position: "relative",
          overflow: "hidden",
          paddingBottom: 200,
        }}
      >
        <div style={{
          position: "absolute", inset: 0,
          background: `linear-gradient(135deg, ${primary} 0%, ${primary}dd 50%, ${primary}bb 100%)`,
        }} />
        <div
          className="px-5 md:px-[30px] pt-16 md:pt-[120px]"
          style={{
            position: "relative", zIndex: 1,
            display: "flex", flexDirection: "column",
            alignItems: "center", textAlign: "center",
          }}
        >
          <div style={{ maxWidth: 715, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
            {c.subtitle && (
              <ScrollReveal delay={0}>
                <p style={{
                  fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                  fontSize: 16, fontWeight: 700, letterSpacing: "0.3px",
                  lineHeight: "1.7em", color: accent, margin: 0, textTransform: "uppercase",
                }} data-pgl-path="subtitle" data-pgl-edit="text">
                  {c.subtitle}
                </p>
              </ScrollReveal>
            )}
            <ScrollReveal delay={100}>
              <h2 style={{
                fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700,
                letterSpacing: "-1.5px", lineHeight: "1.2em", color: "#fff", margin: 0,
              }} data-pgl-path="title" data-pgl-edit="text">
                {renderAccentText(c.title, accent)}
              </h2>
            </ScrollReveal>
          </div>
        </div>
      </div>

      {/* ═══ Content area — overlaps the banner ═══ */}
      <div style={{ backgroundColor: "var(--pgl-surface, #F1F2FA)" }}>
        <div
          className="flex flex-col px-5 md:px-[30px]"
          style={{
            maxWidth: 1296,
            margin: "0 auto",
            alignItems: "center",
            marginTop: -160,
            position: "relative",
            zIndex: 2,
            paddingBottom: 80,
          }}
        >
          {/* Form card (overlaps banner) */}
          <ScrollReveal delay={200} className="w-full md:max-w-[600px] mx-auto">
          <div style={{
            backgroundColor: "#fff", borderRadius: 24,
            padding: "40px 36px",
            display: "flex", flexDirection: "column", gap: 24,
            boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          }}>
            <h3 style={{
              fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
              fontSize: 24, fontWeight: 700, letterSpacing: "-0.5px",
              lineHeight: "1.3em", color: primary, margin: 0, textAlign: "center",
            }} data-pgl-path="ctaText" data-pgl-edit="text">
              {c.ctaText}
            </h3>

            {submitted ? (
              <div style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                gap: 16, padding: "32px 0",
              }}>
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <circle cx="24" cy="24" r="20" fill={accent} />
                  <path d="M16 24l6 6 10-10" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span style={{
                  fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                  fontSize: 22, fontWeight: 700, color: primary,
                }}>
                  Mensagem enviada!
                </span>
                <span style={{
                  fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                  fontSize: 16, fontWeight: 400, color: "var(--pgl-text-muted, #4B5554)",
                  textAlign: "center",
                }}>
                  Entraremos em contato em breve.
                </span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <input type="text" placeholder="Seu nome completo" required value={formData.name} onChange={update("name")} style={inputStyle} />
                <input type="email" placeholder="Seu e-mail" value={formData.email} onChange={update("email")} style={inputStyle} />
                <input type="tel" placeholder="Seu telefone" value={formData.phone} onChange={update("phone")} style={inputStyle} />
                <textarea
                  placeholder="Sua mensagem"
                  value={formData.message}
                  onChange={update("message")}
                  rows={4}
                  style={{ ...inputStyle, height: "auto", minHeight: 120, borderRadius: 20, resize: "vertical" }}
                />
                <button type="submit" disabled={isSubmitting} style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  padding: "14px 32px", backgroundColor: accent,
                  borderRadius: 58, boxShadow: "rgba(255,255,255,0.4) 0px 4px 7px 0px inset",
                  border: "none", width: "100%", cursor: isSubmitting ? "wait" : "pointer",
                  opacity: isSubmitting ? 0.7 : 1, transition: "opacity 0.2s",
                }}>
                  <span style={{
                    fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                    fontSize: 16, fontWeight: 700, letterSpacing: "0.3px", color: "#fff",
                  }}>
                    {isSubmitting ? "Enviando..." : "Enviar mensagem"}
                  </span>
                </button>
              </form>
            )}
          </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
