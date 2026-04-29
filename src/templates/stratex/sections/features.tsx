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
      <span key={i} style={{ color: accentColor }}>{part}</span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

/*
  Framer Feature Card design (from HTML):
  - Icon wrapper: bg accent rgb(31,81,76), border-radius 16px,
    box-shadow: rgba(0,0,0,0.12) 0px 1px 24px 0px, rgba(255,255,255,0.28) 0px 0px 4px 1px inset
  - Icon inside: 22px SVG image, white fill
  - Title: preset mqbm9u (~18px 500), text-align center
  - Description: preset 1pod1b (~15px 400), text-align center, muted color
  - Grid: 3 columns, 6 items (3x2)
  - Each card: flex col, items center, gap between icon/title/desc
*/

export function StratexFeatures({ content, tokens }: Props) {
  const parsed = ServicesContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const accent = tokens.palette.accent;

  return (
    <section
      id="features"
      style={{
        backgroundColor: "var(--pgl-background)",
        padding: "80px 0",
      }}
    >
      <div className="px-[25px]" style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* ═══ Header: centered tag + H2 ═══ */}
        <ScrollReveal>
          <div style={{ display: "flex", flexDirection: "column", gap: 20, alignItems: "center", marginBottom: 64 }}>
            {c.subtitle && (
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <div style={{ width: 8, height: 8, borderRadius: 1000, backgroundColor: accent, flexShrink: 0 }} />
                <span
                  style={{
                    fontFamily: "var(--pgl-font-heading), Georgia, serif",
                    fontSize: 16,
                    fontWeight: 400,
                    color: accent,
                  }}
                  data-pgl-path="subtitle"
                  data-pgl-edit="text"
                >
                  {c.subtitle}
                </span>
              </div>
            )}
            <h2
              style={{
                fontFamily: "var(--pgl-font-heading), Georgia, serif",
                fontSize: "clamp(30px, 4vw, 48px)",
                fontWeight: 400,
                letterSpacing: "-0.02em",
                lineHeight: "1.15em",
                color: "var(--pgl-text)",
                margin: 0,
                textAlign: "center",
                maxWidth: 700,
              }}
              data-pgl-path="title"
              data-pgl-edit="text"
            >
              {renderAccentText(c.title, accent)}
            </h2>
          </div>
        </ScrollReveal>

        {/* ═══ Grid 3x — feature cards ═══ */}
        <div
          className="grid grid-cols-1 md:grid-cols-3"
          style={{ gap: 48 }}
        >
          {c.items.slice(0, 6).map((item, idx) => (
            <ScrollReveal key={idx} delay={idx * 80}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 16,
                }}
              >
                {/* Icon wrapper — accent bg, radius 16px, shadow with inset */}
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 16,
                    backgroundColor: accent,
                    boxShadow: "rgba(0, 0, 0, 0.12) 0px 1px 24px 0px, rgba(255, 255, 255, 0.28) 0px 0px 4px 1px inset",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    position: "relative",
                    overflow: "hidden",
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

                {/* Text wrapper — centered */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  {/* Title */}
                  <p
                    style={{
                      fontFamily: "var(--pgl-font-heading), Georgia, serif",
                      fontSize: 18,
                      fontWeight: 500,
                      letterSpacing: "-0.02em",
                      lineHeight: "1.4em",
                      color: "var(--pgl-text)",
                      margin: 0,
                      textAlign: "center",
                    }}
                    data-pgl-path={`items.${idx}.name`}
                    data-pgl-edit="text"
                  >
                    {item.name}
                  </p>

                  {/* Description */}
                  <p
                    style={{
                      fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                      fontSize: 15,
                      fontWeight: 400,
                      lineHeight: "1.55em",
                      color: "var(--pgl-text-muted)",
                      margin: 0,
                      textAlign: "center",
                      maxWidth: 280,
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
