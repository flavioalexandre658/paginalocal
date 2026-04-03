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

function CheckIcon({ accent }: { accent: string }) {
  return (
    <div
      style={{
        width: 28,
        height: 28,
        borderRadius: "50%",
        backgroundColor: accent,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20 6L9 17L4 12"
          stroke="var(--pgl-text)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export function CleanlyAbout({ content, tokens }: Props) {
  const parsed = ServicesContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const accent = tokens.palette.accent;

  const backgroundImage =
    (content.backgroundImage as string) ||
    (content.image as string) ||
    "";

  return (
    <section
      id="about"
      style={{
        backgroundColor: "var(--pgl-background)",
        padding: 0,
        width: "100%",
        overflow: "hidden",
      }}
    >
      <div
        className="py-[60px] px-[20px] md:py-[80px] md:px-[30px] lg:py-[120px] lg:px-[30px]"
        style={{
          maxWidth: 1272,
          margin: "0 auto",
          display: "flex",
          width: "100%",
        }}
      >
        {/* ═══ 2-col layout: image left + content right ═══ */}
        <div
          className="flex-col md:flex-row gap-[24px] md:gap-[60px] lg:gap-[80px]"
          style={{
            display: "flex",
            width: "100%",
            alignItems: "center",
          }}
        >
          {/* ── Left: Image ── */}
          <ScrollReveal delay={0} className="w-full md:w-1/2">
            <div
              data-pgl-path="backgroundImage"
              data-pgl-edit="image"
              className="h-[320px] md:h-[420px] lg:h-[520px]"
              style={{
                borderRadius: 20,
                overflow: "hidden",
                position: "relative",
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
          </ScrollReveal>

          {/* ── Right: Content ── */}
          <div
            className="w-full md:w-1/2"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 32,
            }}
          >
            {/* Subtitle badge */}
            {c.subtitle && (
              <ScrollReveal delay={80}>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
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
                        "var(--pgl-font-heading), Inter, system-ui, sans-serif",
                      fontSize: 14,
                      fontWeight: 600,
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                      lineHeight: "1em",
                      color: "var(--pgl-text)",
                    }}
                    data-pgl-path="subtitle"
                    data-pgl-edit="text"
                  >
                    {c.subtitle}
                  </span>
                </div>
              </ScrollReveal>
            )}

            {/* H2 Title */}
            <ScrollReveal delay={120}>
              <h2
                style={{
                  fontFamily:
                    "var(--pgl-font-heading), Inter, system-ui, sans-serif",
                  fontSize: "clamp(28px, 3.5vw, 42px)",
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.2,
                  color: "var(--pgl-text)",
                  margin: 0,
                }}
                data-pgl-path="title"
                data-pgl-edit="text"
              >
                {renderAccentText(c.title, accent)}
              </h2>
            </ScrollReveal>

            {/* Description — use first item's description as main paragraph */}
            {c.items[0]?.description && (
              <ScrollReveal delay={160}>
                <p
                  style={{
                    fontFamily:
                      "var(--pgl-font-body), Inter, system-ui, sans-serif",
                    fontSize: 16,
                    fontWeight: 400,
                    lineHeight: 1.7,
                    color: "var(--pgl-text-muted)",
                    margin: 0,
                    maxWidth: 540,
                  }}
                  data-pgl-path="items.0.description"
                  data-pgl-edit="text"
                >
                  {c.items[0].description}
                </p>
              </ScrollReveal>
            )}

            {/* Feature list */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 20,
              }}
            >
              {c.items.slice(1).map((item, idx) => {
                const realIdx = idx + 1;
                return (
                  <ScrollReveal key={realIdx} delay={200 + idx * 60}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 16,
                        alignItems: "flex-start",
                      }}
                    >
                      <CheckIcon accent={accent} />

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 4,
                          flex: 1,
                          paddingTop: 2,
                        }}
                      >
                        <p
                          style={{
                            fontFamily:
                              "var(--pgl-font-heading), Inter, system-ui, sans-serif",
                            fontSize: 17,
                            fontWeight: 600,
                            letterSpacing: "-0.01em",
                            lineHeight: 1.4,
                            color: "var(--pgl-text)",
                            margin: 0,
                          }}
                          data-pgl-path={`items.${realIdx}.name`}
                          data-pgl-edit="text"
                        >
                          {item.name}
                        </p>
                        {item.description && (
                          <p
                            style={{
                              fontFamily:
                                "var(--pgl-font-body), Inter, system-ui, sans-serif",
                              fontSize: 15,
                              fontWeight: 400,
                              lineHeight: 1.6,
                              color: "var(--pgl-text-muted)",
                              margin: 0,
                            }}
                            data-pgl-path={`items.${realIdx}.description`}
                            data-pgl-edit="text"
                          >
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
