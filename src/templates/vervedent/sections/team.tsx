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
    i % 2 === 1 ? <span key={i} style={{ color: accentColor }}>{part}</span> : <span key={i}>{part}</span>
  );
}

export function VerveTeam({ content, tokens }: Props) {
  const parsed = ServicesContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const accent = tokens.palette.accent;
  const secondary = tokens.palette.secondary;

  return (
    <section
      id="team"
      style={{ backgroundColor: "var(--pgl-background)", overflow: "hidden" }}
    >
      <div
        className="px-6 py-16 md:px-12 md:py-[100px]"
        style={{ maxWidth: 1200, margin: "0 auto" }}
      >
        {/* Header — centered */}
        <div style={{ textAlign: "center", marginBottom: 64, maxWidth: 700, margin: "0 auto 64px" }}>
          {c.subtitle && (
            <ScrollReveal delay={0}>
              <p
                style={{
                  fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                  fontSize: 16, fontWeight: 600, color: secondary,
                  margin: "0 0 16px", lineHeight: "1.4em",
                }}
                data-pgl-path="subtitle"
                data-pgl-edit="text"
              >
                {c.subtitle}
              </p>
            </ScrollReveal>
          )}
          <ScrollReveal delay={50}>
            <h2
              style={{
                fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 600,
                lineHeight: "1.1em", color: "var(--pgl-text)", margin: "0 0 20px",
              }}
              data-pgl-path="title"
              data-pgl-edit="text"
            >
              {renderAccentText(c.title, secondary)}
            </h2>
          </ScrollReveal>
          {c.items[0]?.description && (
            <ScrollReveal delay={100}>
              <p
                style={{
                  fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                  fontSize: 16, fontWeight: 300, lineHeight: "1.4em",
                  color: "var(--pgl-text-muted)", margin: 0,
                }}
              >
                {c.items[0]?.description}
              </p>
            </ScrollReveal>
          )}
        </div>

        {/* Team grid — 3 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: 48 }}>
          {c.items.map((member, idx) => (
            <ScrollReveal key={idx} delay={150 + idx * 100}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                {/* Photo with dot pattern behind */}
                <div style={{ position: "relative", marginBottom: 24 }}>
                  {/* Dot pattern — left side behind photo */}
                  <div
                    style={{
                      position: "absolute",
                      top: "10%",
                      left: -30,
                      width: 120,
                      height: "80%",
                      zIndex: 0,
                      backgroundImage: `radial-gradient(${accent} 1.5px, transparent 1.5px)`,
                      backgroundSize: "14px 14px",
                      opacity: 0.5,
                    }}
                  />

                  {/* Circular photo */}
                  <div
                    style={{
                      position: "relative",
                      zIndex: 1,
                      width: 240,
                      height: 240,
                      borderRadius: "50%",
                      overflow: "hidden",
                      backgroundColor: "var(--pgl-surface, #f5f5f5)",
                    }}
                    data-pgl-path={`items.${idx}.image`}
                    data-pgl-edit="image"
                  >
                    {member.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={member.image}
                        alt={member.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}
                      />
                    ) : (
                      <div style={{
                        width: "100%", height: "100%",
                        background: `linear-gradient(135deg, var(--pgl-surface) 0%, ${accent}11 100%)`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" opacity="0.2">
                          <circle cx="24" cy="16" r="8" stroke="var(--pgl-text)" strokeWidth="1.5" />
                          <path d="M8 40c0-7 7-12 16-12s16 5 16 12" stroke="var(--pgl-text)" strokeWidth="1.5" />
                        </svg>
                      </div>
                    )}

                    {/* Hover overlay */}
                    <div
                      className="opacity-0 hover:opacity-100 transition-opacity duration-300"
                      style={{
                        position: "absolute", inset: 0, borderRadius: "50%",
                        backgroundColor: `${secondary}88`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}
                    />
                  </div>
                </div>

                {/* Name */}
                <h4
                  style={{
                    fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                    fontSize: 18, fontWeight: 600, lineHeight: "1.2em",
                    color: "var(--pgl-text)", margin: "0 0 6px",
                  }}
                  data-pgl-path={`items.${idx}.name`}
                  data-pgl-edit="text"
                >
                  {member.name}
                </h4>

                {/* Specialty/Role */}
                <p
                  style={{
                    fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                    fontSize: 14, fontWeight: 300, lineHeight: "1.4em",
                    color: "var(--pgl-text-muted)", margin: "0 0 16px",
                  }}
                  data-pgl-path={`items.${idx}.description`}
                  data-pgl-edit="text"
                >
                  {member.description || ""}
                </p>

                {/* Social icons — LinkedIn + Instagram */}
                <div style={{ display: "flex", gap: 8 }}>
                  {["linkedin", "instagram"].map((social) => (
                    <div
                      key={social}
                      style={{
                        width: 36, height: 36,
                        border: `1px solid var(--pgl-border, #e6e6e6)`,
                        borderRadius: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer",
                        transition: "border-color 0.2s",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = secondary; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--pgl-border, #e6e6e6)"; }}
                    >
                      {social === "linkedin" ? (
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M4 6v6M4 3.5v.01M7 12V8.5a2 2 0 014 0V12M11 6v6" stroke={secondary} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <rect x="2" y="2" width="12" height="12" rx="3" stroke={secondary} strokeWidth="1.2" />
                          <circle cx="8" cy="8" r="3" stroke={secondary} strokeWidth="1.2" />
                          <circle cx="11.5" cy="4.5" r="0.8" fill={secondary} />
                        </svg>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
