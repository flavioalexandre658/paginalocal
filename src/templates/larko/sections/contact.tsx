"use client";

import { useState } from "react";
import type { DesignTokens } from "@/types/ai-generation";
import { ContactContentSchema } from "@/types/ai-generation";
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
      <span
        key={i}
        style={{
          fontFamily: "var(--pgl-font-heading), Georgia, serif",
          fontStyle: "italic",
          color: accentColor,
        }}
      >
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export function LarkoContact({ content, tokens }: Props) {
  const { submit, isSubmitting, submitted } = useSubmitFormLead();

  const [formData, setFormData] = useState({ name: "", lastName: "", email: "", message: "" });

  const parsed = ContactContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const primary = tokens.palette.primary;
  const accent = tokens.palette.accent;
  const secondary = tokens.palette.secondary;


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit({
      name: `${formData.name} ${formData.lastName}`.trim(),
      email: formData.email || undefined,
      message: formData.message || undefined,
    });
  };

  return (
    <section
      id="contato"
      style={{
        backgroundColor: primary,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        .lk-contact-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0;
          width: 100%;
          max-width: 1280px;
          padding: 130px 0;
          position: relative;
          overflow: hidden;
        }
        @media (max-width: 1279px) {
          .lk-contact-section { max-width: 992px; padding: 80px 0; }
        }
        @media (max-width: 991px) {
          .lk-contact-section { max-width: 768px; padding: 80px 0; }
        }

        /* Animated circles background */
        .lk-contact-circles {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
        }
        .lk-contact-circle {
          position: absolute;
          border-radius: 100%;
          background-color: rgba(127,165,142,0.2);
          box-shadow: rgba(99,171,68,0.3) 0px 0px 20px 0px;
          animation: lk-pulse 4s ease-in-out infinite alternate;
        }
        .lk-contact-circle-inner {
          width: 100%;
          height: 100%;
          border-radius: 100%;
        }
        @keyframes lk-pulse {
          0% { transform: scale(0.1); opacity: 1; }
          50% { transform: scale(0.55); opacity: 0.5; }
          100% { transform: scale(1); opacity: 0; }
        }

        /* Map image */
        .lk-contact-map {
          position: absolute;
          top: 50%;
          right: 0;
          transform: translateY(-50%);
          width: 55%;
          max-width: 800px;
          height: 100%;
          opacity: 0.15;
          pointer-events: none;
        }

        /* Base container */
        .lk-contact-base {
          z-index: 2;
          display: flex;
          flex-direction: row;
          align-items: flex-start;
          justify-content: space-between;
          gap: 80px;
          width: 100%;
          padding: 0 55px;
          position: relative;
        }
        @media (max-width: 1279px) {
          .lk-contact-base { gap: 60px; padding: 0 20px; }
        }
        @media (max-width: 991px) {
          .lk-contact-base { flex-direction: column; gap: 40px; padding: 0 20px; }
        }

        /* Text side */
        .lk-contact-text {
          max-width: 500px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        /* Form */
        .lk-contact-form {
          display: flex;
          flex-direction: column;
          gap: 40px;
          width: 100%;
          max-width: 530px;
          z-index: 1;
        }
        .lk-contact-fields {
          display: flex;
          flex-direction: column;
          gap: 30px;
          width: 100%;
        }
        .lk-contact-row {
          display: flex;
          flex-direction: row;
          gap: 20px;
          width: 100%;
        }
        @media (max-width: 991px) {
          .lk-contact-row { flex-wrap: wrap; }
        }
        .lk-contact-label {
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;
          min-width: 0;
        }
        .lk-contact-label-full {
          display: flex;
          flex-direction: column;
          gap: 8px;
          width: 100%;
        }
        .lk-contact-input {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 6px;
          padding: 14px 16px;
          color: #fff;
          font-family: var(--pgl-font-body), system-ui, sans-serif;
          font-size: 16px;
          font-weight: 400;
          line-height: 1.5em;
          outline: none;
          transition: border-color 0.2s;
          width: 100%;
        }
        .lk-contact-input::placeholder {
          color: rgba(255,255,255,0.4);
        }
        .lk-contact-input:focus {
          border-color: rgba(255,255,255,0.4);
        }
        .lk-contact-textarea {
          min-height: 120px;
          resize: vertical;
        }
        .lk-contact-submit {
          width: 100%;
          border-radius: 50px;
          border: none;
          padding: 18px 32px;
          cursor: pointer;
          font-family: var(--pgl-font-body), system-ui, sans-serif;
          font-size: 16px;
          font-weight: 500;
          line-height: 1.5em;
          transition: opacity 0.2s;
        }
        .lk-contact-submit:hover {
          opacity: 0.9;
        }
        .lk-contact-submit:disabled {
          opacity: 0.6;
          cursor: wait;
        }
      `}} />

      <div className="lk-contact-section">
        {/* ═══ Animated circles background ═══ */}
        <div className="lk-contact-circles">
          {[
            { top: "10%", left: "5%", size: 80, delay: "0s" },
            { top: "20%", left: "15%", size: 120, delay: "0.5s" },
            { top: "50%", left: "8%", size: 60, delay: "1s" },
            { top: "70%", left: "20%", size: 100, delay: "1.5s" },
            { top: "30%", left: "25%", size: 90, delay: "2s" },
          ].map((c, i) => (
            <div
              key={i}
              className="lk-contact-circle"
              style={{
                top: c.top,
                left: c.left,
                width: c.size,
                height: c.size,
                animationDelay: c.delay,
              }}
            >
              <div
                className="lk-contact-circle-inner"
                style={{ backgroundColor: `${accent}66` }}
              />
            </div>
          ))}
        </div>

        {/* ═══ Map background image placeholder ═══ */}
        <div className="lk-contact-map">
          <svg width="100%" height="100%" viewBox="0 0 400 300" fill="none" opacity="0.3">
            <circle cx="200" cy="150" r="80" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            <circle cx="200" cy="150" r="120" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
            <circle cx="200" cy="150" r="40" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
            <circle cx="200" cy="150" r="4" fill={accent} opacity="0.5" />
          </svg>
        </div>

        {/* ═══ Base Container ═══ */}
        <div className="lk-contact-base">
          {/* LEFT — Title + Body */}
          <div className="lk-contact-text">
            <ScrollReveal delay={0}>
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                <h2
                  style={{
                    fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                    fontSize: "clamp(32px, 4vw, 50px)",
                    fontWeight: 500,
                    lineHeight: "1.2em",
                    letterSpacing: "0em",
                    color: "#fff",
                    margin: 0,
                  }}
                  data-pgl-path="title"
                  data-pgl-edit="text"
                >
                  {renderAccentText(c.title, secondary)}
                </h2>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <p
                style={{
                  fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                  fontSize: 18,
                  fontWeight: 300,
                  lineHeight: "1.5em",
                  color: "#fff",
                  margin: 0,
                  maxWidth: 480,
                }}
                data-pgl-path="subtitle"
                data-pgl-edit="text"
              >
                {c.subtitle}
              </p>
            </ScrollReveal>
          </div>

          {/* RIGHT — Contact Form */}
          <ScrollReveal delay={200}>
            {submitted ? (
              <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 16,
                padding: "60px 40px",
                maxWidth: 530,
                width: "100%",
              }}>
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <circle cx="24" cy="24" r="20" fill={secondary} />
                  <path d="M16 24l5.5 5.5 9-9" stroke={primary} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span style={{
                  fontFamily: "var(--pgl-font-heading)",
                  fontSize: 22,
                  fontWeight: 500,
                  color: "#fff",
                }}>
                  Mensagem enviada com sucesso!
                </span>
              </div>
            ) : (
              <form className="lk-contact-form" onSubmit={handleSubmit}>
                <div className="lk-contact-fields">
                  {/* First Name + Last Name row */}
                  <div className="lk-contact-row">
                    <div className="lk-contact-label">
                      <span style={{
                        fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                        fontSize: 18,
                        fontWeight: 300,
                        lineHeight: "1.5em",
                        color: "#fff",
                      }}>
                        Nome*
                      </span>
                      <input
                        type="text"
                        required
                        name="name"
                        placeholder="Maria"
                        className="lk-contact-input"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div className="lk-contact-label">
                      <span style={{
                        fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                        fontSize: 18,
                        fontWeight: 300,
                        lineHeight: "1.5em",
                        color: "#fff",
                      }}>
                        Sobrenome
                      </span>
                      <input
                        type="text"
                        name="lastName"
                        placeholder="Silva"
                        className="lk-contact-input"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="lk-contact-label-full">
                    <span style={{
                      fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                      fontSize: 18,
                      fontWeight: 300,
                      lineHeight: "1.5em",
                      color: "#fff",
                    }}>
                      Email*
                    </span>
                    <input
                      type="email"
                      required
                      name="email"
                      placeholder="maria@exemplo.com"
                      className="lk-contact-input"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  {/* Message */}
                  <div className="lk-contact-label-full">
                    <span style={{
                      fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                      fontSize: 18,
                      fontWeight: 300,
                      lineHeight: "1.5em",
                      color: "#fff",
                    }}>
                      Mensagem
                    </span>
                    <textarea
                      name="message"
                      placeholder="Sua mensagem"
                      className="lk-contact-input lk-contact-textarea"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>
                </div>

                {/* Submit button — lime pill, full width */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="lk-contact-submit"
                  style={{
                    backgroundColor: secondary,
                    color: primary,
                  }}
                >
                  {isSubmitting ? "Enviando..." : "Vamos crescer juntos!"}
                </button>
              </form>
            )}
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
