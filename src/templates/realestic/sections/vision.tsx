"use client";

import type { DesignTokens } from "@/types/ai-generation";
import { ServicesContentSchema } from "@/types/ai-generation";
import { ScrollReveal } from "./scroll-reveal";
import { IconRenderer } from "@/components/ui/icon-renderer";

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

export function RealesticVision({ content, tokens }: Props) {
  const parsed = ServicesContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const accent = tokens.palette.accent;

  // Section-level CTA from raw content (not in ServicesContentSchema)
  const ctaText = (content.ctaText as string) || "";
  const ctaLink = (content.ctaLink as string) || "#";

  return (
    <section
      id="vision"
      style={{
        backgroundColor: "var(--pgl-background)",
        padding: "44px 0",
      }}
    >
      <div
        className="grid grid-cols-1 md:grid-cols-2 px-[25px]"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          gap: 38,
        }}
      >
        {/* ═══ Left Column — Heading Wrap ═══ */}
        <ScrollReveal delay={0}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 36,
              alignItems: "flex-start",
            }}
          >
            {/* Tag group */}
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
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
                }}
                data-pgl-path="title"
                data-pgl-edit="text"
              >
                {renderAccentText(c.title, accent)}
              </h2>
            </div>

            {/* CTA Button — dark pill */}
            {ctaText && (
              <a
                href={ctaLink}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                  fontSize: 16,
                  fontWeight: 500,
                  letterSpacing: "-0.03em",
                  lineHeight: "1em",
                  color: "#fff",
                  backgroundColor: "var(--pgl-text)",
                  borderRadius: 1000,
                  padding: "14px 26px",
                  textDecoration: "none",
                  transition: "opacity 0.2s ease",
                }}
                data-pgl-path="ctaText"
                data-pgl-edit="button"
              >
                {ctaText}
              </a>
            )}
          </div>
        </ScrollReveal>

        {/* ═══ Right Column — 3 Feature Cards ═══ */}
        <div
          className="pt-0 md:pt-[10px] px-0 md:px-[32px]"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 42,
          }}
        >
          {c.items.slice(0, 3).map((item, idx) => (
            <ScrollReveal key={idx} delay={idx * 120}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 36,
                  alignItems: "flex-start",
                }}
              >
                {/* Icon container */}
                <div
                  style={{
                    backgroundColor: accent,
                    borderRadius: 12,
                    padding: 10,
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  data-pgl-path={`items.${idx}.icon`}
                  data-pgl-edit="icon"
                >
                  <IconRenderer
                    icon={item.icon}
                    size={22}
                    color="#fff"
                    strokeWidth={2}
                    ariaLabel={item.name}
                  />
                </div>

                {/* Content */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 14,
                    flex: 1,
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
