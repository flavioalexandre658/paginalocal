"use client";

import type { DesignTokens } from "@/types/ai-generation";
import { ScrollReveal } from "./scroll-reveal";
import { FaqContentSchema } from "@/types/ai-generation";

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

export function FolioxaFaq({ content, tokens }: Props) {
  const parsed = FaqContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const accent = tokens.palette.accent;

  return (
    <section id="faq" style={{ backgroundColor: "var(--pgl-background)" }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .folioxa-faq-item {
          border-bottom: 1px solid var(--pgl-border, rgba(0,0,0,0.08));
          transition: background-color 0.3s ease;
        }
        .folioxa-faq-item:last-child {
          border-bottom: none;
        }
        .folioxa-faq-item[open] {
          background-color: rgba(0,0,0,0.015);
        }
        .folioxa-faq-icon {
          transition: transform 0.3s ease;
        }
        .folioxa-faq-item[open] .folioxa-faq-icon {
          transform: rotate(45deg);
        }
      `}} />

      <div
        className="px-5 py-16 md:px-[80px] md:py-[100px]"
        style={{ maxWidth: 1200, margin: "0 auto" }}
      >
        {/* Cabecalho */}
        <ScrollReveal>
          <div className="text-center mb-12 md:mb-16">
            {/* Tag */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 20px",
                borderRadius: 14,
                border: "1px solid var(--pgl-border, rgba(0,0,0,0.08))",
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: accent,
                }}
              />
              <span
                style={{
                  fontFamily: "var(--pgl-font-body, 'Outfit'), system-ui, sans-serif",
                  fontSize: 13,
                  fontWeight: 500,
                  color: "var(--pgl-text-muted)",
                  letterSpacing: "0.02em",
                }}
              >
                Perguntas Frequentes
              </span>
            </div>

            {/* Titulo */}
            <h2
              style={{
                fontFamily: "var(--pgl-font-heading, 'Outfit'), system-ui, sans-serif",
                fontSize: "clamp(28px, 5vw, 44px)",
                fontWeight: 600,
                letterSpacing: "-0.03em",
                lineHeight: "1.15em",
                color: "var(--pgl-text)",
                margin: 0,
              }}
              data-pgl-path="title"
              data-pgl-edit="text"
            >
              {renderAccentText(c.title, accent)}
            </h2>

            {c.subtitle && (
              <p
                style={{
                  fontFamily: "var(--pgl-font-body, 'Outfit'), system-ui, sans-serif",
                  fontSize: 17,
                  fontWeight: 400,
                  lineHeight: "1.6em",
                  color: "var(--pgl-text-muted)",
                  margin: "16px auto 0",
                  maxWidth: 560,
                }}
                data-pgl-path="subtitle"
                data-pgl-edit="text"
              >
                {c.subtitle}
              </p>
            )}
          </div>
        </ScrollReveal>

        {/* Accordion */}
        <ScrollReveal delay={100}>
          <div
            className="mx-auto"
            style={{
              maxWidth: 780,
              backgroundColor: "var(--pgl-surface, #fff)",
              borderRadius: 24,
              border: "1px solid var(--pgl-border, rgba(0,0,0,0.06))",
              boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
              overflow: "hidden",
            }}
          >
            {c.items.map((item, idx) => (
              <details
                key={idx}
                className="folioxa-faq-item"
                {...(idx === 0 ? { open: true } : {})}
              >
                <summary
                  className="list-none [&::-webkit-details-marker]:hidden cursor-pointer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 16,
                    padding: "24px 28px",
                  }}
                >
                  {/* Pergunta */}
                  <h6
                    style={{
                      fontFamily: "var(--pgl-font-heading, 'Outfit'), system-ui, sans-serif",
                      fontSize: 17,
                      fontWeight: 600,
                      letterSpacing: "-0.02em",
                      lineHeight: "1.4em",
                      color: "var(--pgl-text)",
                      margin: 0,
                    }}
                    data-pgl-path={`items.${idx}.question`}
                    data-pgl-edit="text"
                  >
                    {item.question}
                  </h6>

                  {/* Icone + que rotaciona para X */}
                  <svg
                    className="folioxa-faq-icon shrink-0"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={accent}
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </summary>

                {/* Resposta */}
                <div style={{ padding: "0 28px 24px 28px" }}>
                  <p
                    style={{
                      fontFamily: "var(--pgl-font-body, 'Outfit'), system-ui, sans-serif",
                      fontSize: 15,
                      fontWeight: 400,
                      lineHeight: "1.7em",
                      color: "var(--pgl-text-muted)",
                      margin: 0,
                      maxWidth: "92%",
                    }}
                    data-pgl-path={`items.${idx}.answer`}
                    data-pgl-edit="text"
                  >
                    {item.answer}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
