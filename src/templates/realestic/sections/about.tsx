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
      <span key={i} style={{ color: accentColor }}>{part}</span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

function CheckIcon() {
  return (
    <svg
      width="25"
      height="25"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0 }}
    >
      <path
        d="M20 6L9 17L4 12"
        stroke="var(--pgl-text)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function RealesticAbout({ content, tokens }: Props) {
  const parsed = ServicesContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const accent = tokens.palette.accent;

  // backgroundImage from raw content (not in ServicesContentSchema)
  const backgroundImage =
    (content.backgroundImage as string) ||
    (content.image as string) ||
    "";

  return (
    <section
      id="about"
      style={{
        backgroundColor: "var(--pgl-background)",
        padding: "44px 0",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
        }}
        className="px-[25px]"
      >
        {/* ═══ Header ═══ */}
        <ScrollReveal delay={0}>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {/* Dot + label */}
            {c.subtitle && (
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
                    fontFamily:
                      "var(--pgl-font-heading), system-ui, sans-serif",
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
                maxWidth: 680,
              }}
              data-pgl-path="title"
              data-pgl-edit="text"
            >
              {renderAccentText(c.title, tokens.palette.accent)}
            </h2>
          </div>
        </ScrollReveal>

        {/* ═══ Image + Card overlay ═══
             Desktop: 650px image, card inside via flex justify-end, padding 58px
             Mobile: shorter image, card overlaps bottom-center, extends beyond image
        ═══ */}
        <ScrollReveal delay={120}>
          <div
            data-pgl-path="backgroundImage"
            data-pgl-edit="image"
            className="mt-[38px]"
            style={{
              position: "relative",
              width: "100%",
              overflow: "visible",
            }}
          >
            {/* ── Image block with rounded corners ── */}
            <div
              className="h-[420px] md:h-[650px]"
              style={{
                borderRadius: 24,
                position: "relative",
                overflow: "hidden",
                width: "100%",
              }}
            >
              {backgroundImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={backgroundImage}
                  alt={c.title}
                  style={{
                    display: "block",
                    width: "100%",
                    height: "100%",
                    objectPosition: "center",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "var(--pgl-surface)",
                  }}
                />
              )}
            </div>

            {/* ── White card — overlays the image ──
                 Desktop: absolute, bottom-right, inside padding area
                 Mobile: absolute, centered bottom, extends below image
            ── */}
            <div
              className="absolute bottom-[-80px] left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-[320px] md:bottom-[58px] md:right-[58px] md:left-auto md:translate-x-0 md:w-[365px] md:max-w-none"
              style={{
                backgroundColor: "#fff",
                borderRadius: 28,
                padding: "34px 28px",
                display: "flex",
                flexDirection: "column",
                gap: 30,
                zIndex: 2,
                boxShadow: "rgba(0,0,0,0.08) 0px 8px 30px",
              }}
              >
                {c.items.slice(0, 3).map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: 18,
                      alignItems: "flex-start",
                    }}
                  >
                    {/* Tick icon — 25px, fill black */}
                    <CheckIcon />

                    {/* Content — gap 3px */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 3,
                        flex: 1,
                      }}
                    >
                      <p
                        style={{
                          fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                          fontSize: 18,
                          fontWeight: 500,
                          letterSpacing: "-0.02em",
                          lineHeight: "1.5em",
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
                          fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                          fontSize: 15,
                          fontWeight: 500,
                          letterSpacing: "-0.02em",
                          lineHeight: "1.45em",
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
                ))}
              </div>
          </div>
        </ScrollReveal>

        {/* Spacer for mobile — card extends 80px below image */}
        <div className="h-[100px] md:h-0" />
      </div>
    </section>
  );
}
