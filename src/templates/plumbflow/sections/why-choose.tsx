"use client";

import type { DesignTokens } from "@/types/ai-generation";
import { ServicesContentSchema } from "@/types/ai-generation";
import { ScrollReveal } from "./scroll-reveal";

interface Props {
  content: Record<string, unknown>;
  tokens: DesignTokens;
  isDark?: boolean;
}

/* Feature icons — wrench, dollar, clock */
const featureIcons = [
  /* Wrench / certified */
  <svg key="wrench" width="48" height="48" viewBox="0 0 48 48" fill="none">
    <path d="M29.5 18.5l-11 11M14 30l4 4M18 26l4 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M34 14a8 8 0 0 0-11.3 0l-2.1 2.1 11.3 11.3 2.1-2.1A8 8 0 0 0 34 14z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
  /* Dollar / pricing */
  <svg key="dollar" width="48" height="48" viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="24" r="14" stroke="currentColor" strokeWidth="2.5" />
    <path d="M24 14v20M28 18.5c0-1.4-1.8-2.5-4-2.5s-4 1.1-4 2.5 1.8 2.5 4 2.5 4 1.1 4 2.5-1.8 2.5-4 2.5-4-1.1-4-2.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
  </svg>,
  /* Clock / 24-7 */
  <svg key="clock" width="48" height="48" viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="24" r="14" stroke="currentColor" strokeWidth="2.5" />
    <path d="M24 16v8l5 3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
];

function renderAccentText(text: string, accentColor: string) {
  return text.split(/\*([^*]+)\*/).map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} style={{ color: accentColor }}>{part}</span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export function PlumbflowWhyChoose({ content, tokens }: Props) {
  const parsed = ServicesContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const accent = tokens.palette.accent;
  const primary = tokens.palette.primary;

  return (
    <section
      style={{ backgroundColor: "var(--pgl-background)", overflow: "hidden" }}
    >
      <div
        className="px-5 md:px-[30px]"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingBottom: 80,
        }}
      >
        {/* ═══ Header ═══ */}
        <div
          style={{
            width: "100%",
            maxWidth: 1296,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
            marginBottom: 64,
            textAlign: "center",
          }}
        >
          {c.subtitle && (
            <ScrollReveal delay={0}>
              <p
                style={{
                  fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                  fontSize: 16,
                  fontWeight: 700,
                  letterSpacing: "0.3px",
                  lineHeight: "1.7em",
                  color: accent,
                  margin: 0,
                  textTransform: "uppercase",
                }}
                data-pgl-path="subtitle"
                data-pgl-edit="text"
              >
                {c.subtitle}
              </p>
            </ScrollReveal>
          )}
          <ScrollReveal delay={100}>
            <h2
              style={{
                fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                fontSize: "clamp(28px, 4vw, 42px)",
                fontWeight: 700,
                letterSpacing: "-1.5px",
                lineHeight: "1.2em",
                color: primary,
                margin: 0,
                maxWidth: 673,
              }}
              data-pgl-path="title"
              data-pgl-edit="text"
            >
              {renderAccentText(c.title, accent)}
            </h2>
          </ScrollReveal>
        </div>

        {/* ═══ Content: Image left + Cards right ═══ */}
        <div
          className="flex flex-col md:flex-row w-full"
          style={{ maxWidth: 1296, gap: 64, alignItems: "center" }}
        >
          {/* LEFT — Image */}
          <ScrollReveal delay={0} className="w-full md:flex-1 md:max-w-[636px]">
          <div
            style={{
              aspectRatio: "1.22",
              borderRadius: 24,
              overflow: "hidden",
              position: "relative",
              flexShrink: 0,
            }}
            data-pgl-path="items.0.image"
            data-pgl-edit="image"
          >
            {c.items[0]?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={c.items[0].image}
                alt="Why choose us"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background: `linear-gradient(135deg, ${primary}22, ${accent}11)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none" opacity="0.2">
                  <rect x="8" y="8" width="48" height="48" rx="8" stroke={primary} strokeWidth="2" />
                  <circle cx="24" cy="24" r="6" stroke={primary} strokeWidth="2" />
                  <path d="M8 44l16-12 12 8 20-16" stroke={primary} strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
            )}
          </div>
          </ScrollReveal>

          {/* RIGHT — Feature cards */}
          <div
            className="w-full md:flex-1 md:max-w-[550px]"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 56,
              paddingLeft: 0,
            }}
          >
            {c.items.map((item, idx) => (
              <ScrollReveal key={idx} delay={idx * 150}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "flex-start",
                    gap: 28,
                  }}
                >
                  {/* Icon circle */}
                  <div
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: "50%",
                      backgroundColor: `${accent}11`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      color: accent,
                    }}
                  >
                    {featureIcons[idx % featureIcons.length]}
                  </div>

                  {/* Text */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 390 }}>
                    <h4
                      style={{
                        fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                        fontSize: 22,
                        fontWeight: 700,
                        letterSpacing: "0px",
                        lineHeight: "1.4em",
                        color: primary,
                        margin: 0,
                      }}
                      data-pgl-path={`items.${idx}.name`}
                      data-pgl-edit="text"
                    >
                      {item.name}
                    </h4>
                    <p
                      style={{
                        fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                        fontSize: 18,
                        fontWeight: 400,
                        letterSpacing: "0px",
                        lineHeight: "1.4em",
                        color: "var(--pgl-text-muted)",
                        margin: 0,
                      }}
                      data-pgl-path={`items.${idx}.description`}
                      data-pgl-edit="text"
                    >
                      {item.description || ""}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
