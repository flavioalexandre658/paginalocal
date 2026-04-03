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

/* Decorative blob shape behind card image */
function DecorativeShape({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 320 260"
      fill="none"
      style={{
        position: "absolute",
        top: -16,
        right: -16,
        width: "75%",
        height: "auto",
        opacity: 0.15,
        pointerEvents: "none",
      }}
    >
      <path
        d="M280 20C310 50 320 110 300 160C280 210 230 250 170 255C110 260 50 230 20 190C-10 150 -10 90 20 50C50 10 110 -10 170 5C230 20 250 -10 280 20Z"
        fill={color}
      />
    </svg>
  );
}

export function CleanlyServices({ content, tokens }: Props) {
  const parsed = ServicesContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const accent = tokens.palette.accent;

  return (
    <section
      id="services"
      style={{
        backgroundColor: "var(--pgl-background)",
        overflow: "hidden",
      }}
    >
      <div
        className="px-5 md:px-8"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          paddingTop: 80,
          paddingBottom: 80,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 56,
        }}
      >
        {/* ═══ Header ═══ */}
        <ScrollReveal delay={0}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
              maxWidth: 640,
              textAlign: "center",
            }}
          >
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
                fontSize: "clamp(28px, 4vw, 44px)",
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
          </div>
        </ScrollReveal>

        {/* ═══ Services Grid ═══ */}
        <div
          className="grid grid-cols-1 md:grid-cols-3"
          style={{ gap: 28, width: "100%" }}
        >
          {c.items.slice(0, 6).map((item, idx) => (
            <ScrollReveal key={idx} delay={idx * 120}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 20,
                  overflow: "hidden",
                  backgroundColor: "var(--pgl-surface, #ffffff)",
                  boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
                  transition: "box-shadow 0.3s ease, transform 0.3s ease",
                  cursor: "pointer",
                  height: "100%",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.10)";
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 2px 16px rgba(0,0,0,0.06)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {/* Card Image */}
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "4/3",
                    overflow: "hidden",
                    backgroundColor: "var(--pgl-background)",
                  }}
                  data-pgl-path={`items.${idx}.image`}
                  data-pgl-edit="image"
                >
                  <DecorativeShape color={accent} />
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        display: "block",
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        position: "relative",
                        zIndex: 1,
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
                        position: "relative",
                        zIndex: 1,
                      }}
                    >
                      <svg
                        width="56"
                        height="56"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={accent}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ opacity: 0.5 }}
                      >
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <path d="M21 15l-5-5L5 21" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                    padding: "24px 24px 28px",
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                      fontSize: 20,
                      fontWeight: 600,
                      letterSpacing: "-0.01em",
                      lineHeight: "1.3em",
                      color: "var(--pgl-text)",
                      margin: 0,
                    }}
                    data-pgl-path={`items.${idx}.name`}
                    data-pgl-edit="text"
                  >
                    {item.name}
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                      fontSize: 15,
                      fontWeight: 400,
                      letterSpacing: "0",
                      lineHeight: "1.6em",
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
