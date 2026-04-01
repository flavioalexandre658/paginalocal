"use client";

import type { DesignTokens } from "@/types/ai-generation";
import { ScrollReveal } from "./scroll-reveal";
import { FaqContentSchema } from "@/types/ai-generation";

interface Props {
  content: Record<string, unknown>;
  tokens: DesignTokens;
  isDark?: boolean;
}

export function GroviaFaq({ content, tokens }: Props) {
  const parsed = FaqContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  return (
    <section
      id="faq"
      style={{ backgroundColor: "var(--pgl-background)" }}
    >
      {/* Container — exact: max-w 1200, padding 80px, flex row, space-between */}
      <div
        className="flex flex-col md:flex-row md:justify-between md:items-start px-6 py-12 md:px-[80px] md:py-[80px] gap-10 md:gap-10"
        style={{ maxWidth: 1200, margin: "0 auto" }}
      >
        {/* Left panel */}
        <div
          className="w-full md:w-[33%] md:max-w-[600px] md:sticky md:top-28 md:self-start"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
            flexShrink: 0,
          }}
        >
          {/* H2 — Albert Sans 36px, weight 400, tracking -0.05em, leading 1.1 */}
          <h2
            style={{
              fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
              fontSize: 36,
              fontWeight: 400,
              letterSpacing: "-0.05em",
              lineHeight: "1.1em",
              color: "var(--pgl-text)",
              margin: 0,
            }}
            data-pgl-path="title"
            data-pgl-edit="text"
          >
            {c.title.split(/\*([^*]+)\*/).map((part, i) =>
              i % 2 === 1 ? (
                <span key={i} style={{ color: tokens.palette.accent }}>{part}</span>
              ) : (
                <span key={i}>{part}</span>
              )
            )}
          </h2>

          {/* Subtitle — Geist 18px, weight 400, tracking -0.03em, leading 1.4 */}
          {c.subtitle && (
            <p
              style={{
                fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                fontSize: 18,
                fontWeight: 400,
                letterSpacing: "-0.03em",
                lineHeight: "1.4em",
                color: "var(--pgl-text-muted)",
                margin: 0,
              }}
              data-pgl-path="subtitle"
              data-pgl-edit="text"
            >
              {c.subtitle}
            </p>
          )}

        </div>

        {/* Right — Accordion: width 58%, bg surface, radius 24px, padding 8px, gap 8px */}
        <style dangerouslySetInnerHTML={{ __html: `
          .grovia-faq-item {
            background: rgba(255,255,255,0.7);
            border: 2px solid transparent;
            box-shadow: none;
            border-radius: 20px;
            overflow: hidden;
            transition: background-color 0.3s, box-shadow 0.3s, border-color 0.3s;
          }
          .grovia-faq-item[open] {
            background: rgba(255,255,255,0.9);
            border-color: rgba(255,255,255,1);
            box-shadow: rgba(0,0,0,0.1) 0px 8px 20px 0px;
          }
        `}} />
        <div
          className="w-full md:w-[58%]"
          style={{
            backgroundColor: "var(--pgl-surface)",
            borderRadius: 24,
            padding: 8,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {c.items.map((item, idx) => (
            <details
              key={idx}
              className="group grovia-faq-item"
              {...(idx === 0 ? { open: true } : {})}
            >
              <summary
                className="list-none [&::-webkit-details-marker]:hidden cursor-pointer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 16,
                  padding: 32,
                }}
              >
                {/* Question — 20px, weight 400, tracking -0.04em, leading 1.3 */}
                <h6
                  style={{
                    fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                    fontSize: 20,
                    fontWeight: 400,
                    letterSpacing: "-0.04em",
                    lineHeight: "1.3em",
                    color: "var(--pgl-text)",
                    margin: 0,
                  }}
                  data-pgl-path={`items.${idx}.question`}
                  data-pgl-edit="text"
                >
                  {item.question}
                </h6>

                {/* Plus → X on open: rgb(174,174,174) */}
                <svg
                  className="shrink-0 transition-transform duration-200 group-open:rotate-45"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="rgb(174, 174, 174)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </summary>

              {/* Answer — 16px, weight 400, tracking -0.03em, leading 1.4 */}
              <div style={{ padding: "0 32px 32px 32px" }}>
                <p
                  style={{
                    fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                    fontSize: 16,
                    fontWeight: 400,
                    letterSpacing: "-0.03em",
                    lineHeight: "1.4em",
                    color: "var(--pgl-text-muted)",
                    margin: 0,
                    maxWidth: "89%",
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
      </div>
    </section>
  );
}
