"use client";

import type { DesignTokens } from "@/types/ai-generation";
import { ServicesContentSchema } from "@/types/ai-generation";
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

export function RealesticFeatures({ content, tokens }: Props) {
  const parsed = ServicesContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const accent = tokens.palette.accent;
  const iconBg = accent + "18";

  return (
    <section
      id="features"
      style={{
        backgroundColor: "var(--pgl-background)",
        padding: "34px 25px",
      }}
    >
      {/* ═══ Rounded Card Container ═══ */}
      <div
        style={{
          backgroundColor: "var(--pgl-surface, #fcfcfc)",
          borderRadius: 34,
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 100,
          padding: "48px 36px",
        }}
      >
        {/* ═══ Header Area ═══ */}
        <ScrollReveal delay={0}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 24,
              alignItems: "center",
            }}
          >
            {/* Dot + label row */}
            {c.subtitle && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 9,
                }}
              >
                {/* Accent dot */}
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: accent,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                    fontSize: 17,
                    fontWeight: 500,
                    letterSpacing: "-0.03em",
                    lineHeight: "1em",
                    color: "var(--pgl-text)",
                  }}
                  data-pgl-path="subtitle"
                  data-pgl-edit="text"
                >
                  {c.subtitle}
                </span>
              </div>
            )}

            {/* H2 Title */}
            <h2
              style={{
                fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                fontSize: "clamp(32px, 4vw, 46px)",
                fontWeight: 500,
                letterSpacing: "-0.03em",
                lineHeight: "1.15em",
                color: "var(--pgl-text)",
                margin: 0,
                textAlign: "center",
              }}
              data-pgl-path="title"
              data-pgl-edit="text"
            >
              {renderAccentText(c.title, accent)}
            </h2>
          </div>
        </ScrollReveal>

        {/* ═══ Features Grid ═══ */}
        <div
          className="grid grid-cols-1 md:grid-cols-3"
          style={{ gap: 56 }}
        >
          {c.items.slice(0, 6).map((item, idx) => (
            <ScrollReveal key={idx} delay={idx * 100}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 36,
                  paddingBottom: 18,
                }}
              >
                {/* Icon container — accent-light bg */}
                <div
                  style={{
                    backgroundColor: iconBg,
                    borderRadius: 14,
                    padding: 8,
                    width: "fit-content",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  data-pgl-path={`items.${idx}.image`}
                  data-pgl-edit="image"
                >
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: 30,
                        height: 30,
                        objectFit: "contain",
                      }}
                    />
                  ) : (
                    <svg
                      width="30"
                      height="30"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={accent}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 2L2 7l10 5 10-5-10-5z" />
                      <path d="M2 17l10 5 10-5" />
                      <path d="M2 12l10 5 10-5" />
                    </svg>
                  )}
                </div>

                {/* Content */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 18,
                  }}
                >
                  <p
                    style={{
                      fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                      fontSize: 26,
                      fontWeight: 500,
                      letterSpacing: "-0.03em",
                      lineHeight: "1.55em",
                      color: "var(--pgl-text)",
                      margin: 0,
                    }}
                    data-pgl-path={`items.${idx}.name`}
                    data-pgl-edit="text"
                  >
                    {item.name}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                      fontSize: 20,
                      fontWeight: 500,
                      letterSpacing: "-0.02em",
                      lineHeight: "1.5em",
                      color: "var(--pgl-text-muted)",
                      margin: 0,
                    }}
                    data-pgl-path={`items.${idx}.description`}
                    data-pgl-edit="text"
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
