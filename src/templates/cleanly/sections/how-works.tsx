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

export function CleanlyHowWorks({ content, tokens }: Props) {
  const parsed = ServicesContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const accent = tokens.palette.accent;
  const steps = c.items.slice(0, 3);

  return (
    <section
      id="how-it-works"
      style={{
        backgroundColor: "var(--pgl-background)",
        padding: "100px 0",
      }}
    >
      <div
        className="px-[20px] md:px-[30px]"
        style={{ maxWidth: 1280, margin: "0 auto" }}
      >
        {/* ═══ Section Header ═══ */}
        <ScrollReveal>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
              marginBottom: 72,
              textAlign: "center",
            }}
          >
            {c.subtitle && (
              <span
                style={{
                  fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                  fontSize: 14,
                  fontWeight: 500,
                  color: accent,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
                data-pgl-path="subtitle"
                data-pgl-edit="text"
              >
                {c.subtitle}
              </span>
            )}
            <h2
              style={{
                fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                fontSize: "clamp(30px, 4.5vw, 48px)",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                lineHeight: 1.15,
                color: "var(--pgl-text)",
                margin: 0,
                maxWidth: 600,
              }}
              data-pgl-path="title"
              data-pgl-edit="text"
            >
              {renderAccentText(c.title, accent)}
            </h2>
          </div>
        </ScrollReveal>

        {/* ═══ Steps — Desktop: 3-column horizontal row ═══ */}
        <div className="hidden md:block" style={{ marginBottom: 80 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 0,
              position: "relative",
            }}
          >
            {steps.map((item, idx) => {
              const stepNum = `${idx + 1}.`;
              const isLast = idx === steps.length - 1;

              return (
                <ScrollReveal key={idx} delay={idx * 120}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 0,
                      position: "relative",
                      padding: "0 32px",
                    }}
                  >
                    {/* Number + Title row */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: 12,
                        marginBottom: 16,
                      }}
                    >
                      <span
                        style={{
                          fontFamily:
                            "var(--pgl-font-heading), system-ui, sans-serif",
                          fontSize: "clamp(40px, 4vw, 56px)",
                          fontWeight: 700,
                          lineHeight: 1,
                          color: "var(--pgl-text)",
                          letterSpacing: "-0.03em",
                          flexShrink: 0,
                        }}
                      >
                        {stepNum}
                      </span>
                      <h3
                        style={{
                          fontFamily:
                            "var(--pgl-font-heading), system-ui, sans-serif",
                          fontSize: "clamp(18px, 2vw, 22px)",
                          fontWeight: 600,
                          lineHeight: 1.3,
                          color: "var(--pgl-text)",
                          margin: 0,
                          letterSpacing: "-0.01em",
                        }}
                        data-pgl-path={`items.${idx}.name`}
                        data-pgl-edit="text"
                      >
                        {item.name}
                      </h3>
                    </div>

                    {/* Description */}
                    <p
                      style={{
                        fontFamily:
                          "var(--pgl-font-body), system-ui, sans-serif",
                        fontSize: 15,
                        fontWeight: 400,
                        lineHeight: 1.65,
                        color: "var(--pgl-text-muted)",
                        margin: 0,
                        maxWidth: 320,
                      }}
                      data-pgl-path={`items.${idx}.description`}
                      data-pgl-edit="text"
                    >
                      {item.description}
                    </p>

                    {/* Progress line */}
                    <div
                      style={{
                        marginTop: 28,
                        height: 4,
                        borderRadius: 1000,
                        backgroundColor: `color-mix(in srgb, ${accent} 12%, transparent)`,
                        overflow: "hidden",
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          bottom: 0,
                          width: isLast ? "100%" : "60%",
                          borderRadius: 1000,
                          backgroundColor: accent,
                        }}
                      />
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>

        {/* ═══ Steps — Mobile: stacked vertical ═══ */}
        <div
          className="md:hidden flex flex-col"
          style={{
            gap: 36,
            marginBottom: 64,
          }}
        >
          {steps.map((item, idx) => {
            const stepNum = `${idx + 1}.`;

            return (
              <ScrollReveal key={idx} delay={idx * 100}>
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  {/* Number + Title */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: 10,
                      marginBottom: 12,
                    }}
                  >
                    <span
                      style={{
                        fontFamily:
                          "var(--pgl-font-heading), system-ui, sans-serif",
                        fontSize: 40,
                        fontWeight: 700,
                        lineHeight: 1,
                        color: "var(--pgl-text)",
                        letterSpacing: "-0.03em",
                        flexShrink: 0,
                      }}
                    >
                      {stepNum}
                    </span>
                    <h3
                      style={{
                        fontFamily:
                          "var(--pgl-font-heading), system-ui, sans-serif",
                        fontSize: 18,
                        fontWeight: 600,
                        lineHeight: 1.3,
                        color: "var(--pgl-text)",
                        margin: 0,
                      }}
                      data-pgl-path={`items.${idx}.name`}
                      data-pgl-edit="text"
                    >
                      {item.name}
                    </h3>
                  </div>

                  {/* Description */}
                  <p
                    style={{
                      fontFamily:
                        "var(--pgl-font-body), system-ui, sans-serif",
                      fontSize: 15,
                      fontWeight: 400,
                      lineHeight: 1.65,
                      color: "var(--pgl-text-muted)",
                      margin: 0,
                    }}
                    data-pgl-path={`items.${idx}.description`}
                    data-pgl-edit="text"
                  >
                    {item.description}
                  </p>

                  {/* Progress line */}
                  <div
                    style={{
                      marginTop: 20,
                      height: 4,
                      borderRadius: 1000,
                      backgroundColor: `color-mix(in srgb, ${accent} 12%, transparent)`,
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        bottom: 0,
                        width: "100%",
                        borderRadius: 1000,
                        backgroundColor: accent,
                      }}
                    />
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* ═══ Image + Stats Counter Section ═══ */}
        <ScrollReveal delay={200}>
          <div
            style={{
              position: "relative",
              borderRadius: 20,
              overflow: "hidden",
            }}
          >
            {/* Main image */}
            <div
              style={{
                width: "100%",
                aspectRatio: "16 / 7",
                minHeight: 300,
                backgroundColor: "var(--pgl-surface, #f5f5f5)",
                position: "relative",
              }}
              data-pgl-path="items.0.image"
              data-pgl-edit="image"
            >
              {steps[0]?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={steps[0].image}
                  alt={steps[0].name}
                  style={{
                    display: "block",
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "inherit",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background:
                      "linear-gradient(160deg, var(--pgl-surface, #f0f0f0) 0%, var(--pgl-background, #e8e8e8) 100%)",
                  }}
                >
                  <svg
                    width="56"
                    height="56"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--pgl-text-muted)"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ opacity: 0.25 }}
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </div>
              )}
            </div>

            {/* Stats counter bar — overlaid at bottom center */}
            <div
              className="flex flex-col md:flex-row"
              style={{
                position: "absolute",
                bottom: 20,
                left: "50%",
                transform: "translateX(-50%)",
                backgroundColor: accent,
                borderRadius: 16,
                padding: "20px 32px",
                gap: 0,
                width: "fit-content",
                maxWidth: "calc(100% - 40px)",
              }}
            >
              <StatItem
                value={(content.stat1Value as string) || "4.7"}
                label={(content.stat1Label as string) || c.items[0]?.name || ""}
                isLast={false}
              />
              <StatItem
                value={(content.stat2Value as string) || "1.2k+"}
                label={(content.stat2Label as string) || c.items[1]?.name || ""}
                isLast={false}
              />
              <StatItem
                value={(content.stat3Value as string) || "300+"}
                label={(content.stat3Label as string) || c.items[2]?.name || ""}
                isLast={true}
              />
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ── Stat counter sub-component ── */
function StatItem({
  value,
  label,
  isLast,
}: {
  value: string;
  label: string;
  isLast: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          padding: "4px 28px",
          minWidth: 100,
        }}
      >
        <span
          style={{
            fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
            fontSize: "clamp(24px, 3vw, 36px)",
            fontWeight: 700,
            lineHeight: 1.1,
            color: "#fff",
            letterSpacing: "-0.02em",
          }}
          data-pgl-edit="text"
        >
          {value}
        </span>
        <span
          style={{
            fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
            fontSize: 13,
            fontWeight: 400,
            lineHeight: 1.4,
            color: "rgba(255, 255, 255, 0.75)",
            whiteSpace: "nowrap",
          }}
          data-pgl-edit="text"
        >
          {label}
        </span>
      </div>
      {!isLast && (
        <div
          className="hidden md:block"
          style={{
            width: 1,
            height: 40,
            backgroundColor: "rgba(255, 255, 255, 0.25)",
            flexShrink: 0,
          }}
        />
      )}
    </div>
  );
}
