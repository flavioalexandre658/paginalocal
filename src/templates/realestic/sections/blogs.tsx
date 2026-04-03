"use client";

import type { DesignTokens } from "@/types/ai-generation";
import { StatsContentSchema } from "@/types/ai-generation";
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

export function RealesticBlogs({ content, tokens }: Props) {
  const parsed = StatsContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const accent = tokens.palette.accent;

  // subtitle lives outside the strict schema
  const subtitle = (content.subtitle as string) || "";

  return (
    <section
      id="blogs"
      style={{
        backgroundColor: "var(--pgl-background)",
        padding: "48px 0",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 25px",
          display: "flex",
          flexDirection: "column",
          gap: 48,
          alignItems: "center",
        }}
      >
        {/* ═══ Header ═══ */}
        <ScrollReveal>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 18,
              alignItems: "center",
              textAlign: "center",
              maxWidth: 720,
            }}
          >
            {/* Accent dot + section tag */}
            {subtitle && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 9,
                }}
              >
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
                  {subtitle}
                </span>
              </div>
            )}

            {/* H2 Title */}
            {c.title && (
              <h2
                style={{
                  fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                  fontSize: "clamp(32px, 4vw, 46px)",
                  fontWeight: 500,
                  letterSpacing: "-0.03em",
                  lineHeight: "1.15em",
                  color: "var(--pgl-text)",
                  margin: 0,
                }}
                data-pgl-path="title"
                data-pgl-edit="text"
              >
                {renderAccentText(c.title, tokens.palette.accent)}
              </h2>
            )}
          </div>
        </ScrollReveal>

        {/* ═══ Blog Grid ═══ */}
        <div
          className="grid grid-cols-1 md:grid-cols-3"
          style={{ gap: 20, width: "100%" }}
        >
          {c.items.slice(0, 3).map((item, idx) => (
            <ScrollReveal key={idx} delay={idx * 120}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 24,
                }}
              >
                {/* Blog Image */}
                <div
                  style={{
                    aspectRatio: "1.36 / 1",
                    borderRadius: 24,
                    overflow: "hidden",
                    backgroundColor: "var(--pgl-surface, #f0f0f0)",
                  }}
                  data-pgl-path={`items.${idx}.image`}
                  data-pgl-edit="image"
                >
                  {item.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.image}
                      alt={item.value}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  )}
                </div>

                {/* Text Wrap */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                  }}
                >
                  {/* Category Badge */}
                  <div>
                    <span
                      style={{
                        display: "inline-block",
                        fontFamily:
                          "var(--pgl-font-heading), system-ui, sans-serif",
                        fontSize: 15,
                        fontWeight: 500,
                        letterSpacing: "-0.03em",
                        lineHeight: "1em",
                        color: accent,
                        backgroundColor: `color-mix(in srgb, ${accent} 12%, transparent)`,
                        borderRadius: 50,
                        padding: "6px 14px",
                      }}
                      data-pgl-path={`items.${idx}.label`}
                      data-pgl-edit="text"
                    >
                      {item.label}
                    </span>
                  </div>

                  {/* Blog Title */}
                  <p
                    style={{
                      fontFamily:
                        "var(--pgl-font-heading), system-ui, sans-serif",
                      fontSize: 26,
                      fontWeight: 500,
                      letterSpacing: "-0.03em",
                      lineHeight: "1.35em",
                      color: "var(--pgl-text)",
                      margin: 0,
                    }}
                    data-pgl-path={`items.${idx}.value`}
                    data-pgl-edit="text"
                  >
                    {item.value}
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
