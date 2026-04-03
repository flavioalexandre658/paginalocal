"use client";

import type { DesignTokens } from "@/types/ai-generation";
import { FaqContentSchema } from "@/types/ai-generation";
import { ScrollReveal } from "./scroll-reveal";

interface Props {
  content: Record<string, unknown>;
  tokens: DesignTokens;
  isDark?: boolean;
}

function renderAccentText(text: string, accentColor: string) {
  return text.split(/\*([^*]+)\*/).map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} style={{ color: accentColor }}>
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export function CleanlyFaq({ content, tokens }: Props) {
  const parsed = FaqContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const accent = tokens.palette.accent;

  return (
    <section
      id="faq"
      style={{ backgroundColor: "var(--pgl-surface, #f2f7f9)" }}
    >
      <div
        className="flex flex-col md:flex-row md:justify-between md:items-start px-5 md:px-10"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          paddingTop: 80,
          paddingBottom: 80,
          gap: 48,
        }}
      >
        {/* ═══ Left: Title + Subtitle ═══ */}
        <div
          className="w-full md:w-[38%] md:sticky md:top-28 md:self-start"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            flexShrink: 0,
          }}
        >
          <ScrollReveal delay={0}>
            {c.subtitle && (
              <p
                style={{
                  fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                  fontSize: 14,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  lineHeight: "1.6em",
                  color: accent,
                  margin: 0,
                  marginBottom: 8,
                }}
                data-pgl-path="subtitle"
                data-pgl-edit="text"
              >
                {c.subtitle}
              </p>
            )}
            <h2
              style={{
                fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                fontSize: "clamp(28px, 4vw, 40px)",
                fontWeight: 600,
                letterSpacing: "-0.02em",
                lineHeight: "1.2em",
                color: "var(--pgl-text)",
                margin: 0,
              }}
              data-pgl-path="title"
              data-pgl-edit="text"
            >
              {renderAccentText(c.title, accent)}
            </h2>
          </ScrollReveal>
        </div>

        {/* ═══ Right: Accordion ═══ */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
          .cleanly-faq-item {
            border-bottom: 1px solid rgba(23,18,6,0.08);
            transition: background-color 0.2s ease;
          }
          .cleanly-faq-item:last-child {
            border-bottom: none;
          }
          .cleanly-faq-item summary::-webkit-details-marker {
            display: none;
          }
          .cleanly-faq-chevron {
            transition: transform 0.3s ease;
          }
          .cleanly-faq-item[open] .cleanly-faq-chevron {
            transform: rotate(180deg);
          }
        `,
          }}
        />
        <div className="w-full md:w-[58%]">
          {c.items.map((item, idx) => (
            <ScrollReveal key={idx} delay={idx * 80}>
              <details
                className="cleanly-faq-item"
                {...(idx === 0 ? { open: true } : {})}
              >
                <summary
                  className="list-none cursor-pointer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 16,
                    padding: "24px 0",
                  }}
                >
                  <h3
                    style={{
                      fontFamily:
                        "var(--pgl-font-heading), system-ui, sans-serif",
                      fontSize: 18,
                      fontWeight: 600,
                      letterSpacing: "-0.01em",
                      lineHeight: "1.4em",
                      color: "var(--pgl-text)",
                      margin: 0,
                    }}
                    data-pgl-path={`items.${idx}.question`}
                    data-pgl-edit="text"
                  >
                    {item.question}
                  </h3>

                  {/* Chevron */}
                  <svg
                    className="cleanly-faq-chevron shrink-0"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--pgl-text-muted, rgb(91,89,85))"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </summary>

                <div style={{ paddingBottom: 24 }}>
                  <p
                    style={{
                      fontFamily:
                        "var(--pgl-font-body), system-ui, sans-serif",
                      fontSize: 15,
                      fontWeight: 400,
                      lineHeight: "1.7em",
                      color: "var(--pgl-text-muted, rgb(91,89,85))",
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
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
