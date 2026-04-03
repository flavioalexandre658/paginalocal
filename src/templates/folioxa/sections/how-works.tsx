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

export function FolioxaHowWorks({ content, tokens }: Props) {
  const parsed = ServicesContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const accent = tokens.palette.accent || "#FF6E13";
  const primary = tokens.palette.primary || "#212121";
  const border = "rgba(237,239,243,1)";

  return (
    <section
      id="how-works"
      style={{ backgroundColor: "var(--pgl-background)", overflow: "hidden" }}
    >
      <div
        className="px-5 md:px-[30px] py-16 md:py-[100px]"
        style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        {/* ═══ Header ═══ */}
        <div
          className="flex flex-col items-center text-center"
          style={{ maxWidth: 1296, width: "100%", marginBottom: 56, gap: 16 }}
        >
          {c.subtitle && (
            <ScrollReveal delay={0}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "6px 16px",
                  backgroundColor: "rgba(247,247,247,1)",
                  borderRadius: 8,
                  border: `1px solid ${border}`,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                    fontSize: 14,
                    fontWeight: 500,
                    lineHeight: "1.5em",
                    color: primary,
                  }}
                  data-pgl-path="subtitle"
                  data-pgl-edit="text"
                >
                  {c.subtitle}
                </span>
              </div>
            </ScrollReveal>
          )}
          <ScrollReveal delay={100}>
            <h2
              style={{
                fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                fontSize: "clamp(28px, 4vw, 48px)",
                fontWeight: 500,
                letterSpacing: "-2px",
                lineHeight: "1.1em",
                color: primary,
                margin: 0,
                maxWidth: 640,
                textAlign: "center",
              }}
              data-pgl-path="title"
              data-pgl-edit="text"
            >
              {renderAccentText(c.title, accent)}
            </h2>
          </ScrollReveal>
        </div>

        {/* ═══ Step Cards ═══ */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 w-full"
          style={{ maxWidth: 1296, gap: 20 }}
        >
          {c.items.slice(0, 3).map((item, idx) => {
            const stepNum = String(idx + 1).padStart(2, "0");
            return (
              <ScrollReveal key={idx} delay={150 + idx * 120}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 20,
                    border: `1px solid ${border}`,
                    background: "linear-gradient(180deg, rgba(255,255,255,1) 52%, rgba(250,250,247,1) 100%)",
                    boxShadow: "0 0 14px rgba(0,0,0,0.05)",
                    overflow: "hidden",
                    transition: "border-color 0.3s, box-shadow 0.3s, transform 0.3s",
                    height: "100%",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = accent;
                    e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.08)";
                    e.currentTarget.style.transform = "translateY(-4px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = border;
                    e.currentTarget.style.boxShadow = "0 0 14px rgba(0,0,0,0.05)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  {/* Content */}
                  <div
                    style={{
                      padding: "28px 28px 24px",
                      display: "flex",
                      flexDirection: "column",
                      gap: 12,
                      flex: 1,
                    }}
                  >
                    {/* Step Number + Title Row */}
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      {/* Number Badge */}
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 12,
                          backgroundColor: `${accent}12`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                            fontSize: 16,
                            fontWeight: 600,
                            color: accent,
                            letterSpacing: "-0.5px",
                          }}
                        >
                          {stepNum}
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3
                      style={{
                        fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                        fontSize: 22,
                        fontWeight: 500,
                        letterSpacing: "-0.5px",
                        lineHeight: "1.25em",
                        color: primary,
                        margin: 0,
                      }}
                      data-pgl-path={`items.${idx}.name`}
                      data-pgl-edit="text"
                    >
                      {item.name}
                    </h3>

                    {/* Description */}
                    {item.description && (
                      <p
                        style={{
                          fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                          fontSize: 15,
                          fontWeight: 400,
                          lineHeight: "1.6em",
                          color: "rgba(102,102,102,1)",
                          margin: 0,
                        }}
                        data-pgl-path={`items.${idx}.description`}
                        data-pgl-edit="text"
                      >
                        {item.description}
                      </p>
                    )}
                  </div>

                  {/* Image Illustration */}
                  {item.image ? (
                    <div
                      style={{
                        width: "100%",
                        aspectRatio: "16/10",
                        overflow: "hidden",
                        position: "relative",
                      }}
                      data-pgl-path={`items.${idx}.image`}
                      data-pgl-edit="image"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    </div>
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        aspectRatio: "16/10",
                        backgroundColor: `${accent}06`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                      }}
                      data-pgl-path={`items.${idx}.image`}
                      data-pgl-edit="image"
                    >
                      {/* Decorative background icon */}
                      <div style={{ opacity: 0.15 }}>
                        <svg width="64" height="64" viewBox="0 0 48 48" fill="none">
                          <rect x="6" y="6" width="36" height="36" rx="6" stroke={primary} strokeWidth="2" />
                          <circle cx="18" cy="18" r="4" stroke={primary} strokeWidth="2" />
                          <path d="M6 34l12-9 8 6 16-12" stroke={primary} strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
