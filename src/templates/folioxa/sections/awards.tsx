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

/* ── Trophy / Award Icon ── */
function AwardIcon({ color }: { color: string }) {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
      <path d="M8 21h8M12 17v4M17 4V2H7v2M7 4h10a5 5 0 0 1-5 9 5 5 0 0 1-5-9z" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 4H4v2a3 3 0 0 0 3 3M17 4h3v2a3 3 0 0 1-3 3" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function FolioxaAwards({ content, tokens }: Props) {
  const parsed = StatsContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const accent = tokens.palette.accent || "#FF6E13";
  const primary = tokens.palette.primary || "#212121";
  const border = "rgba(237,239,243,1)";

  return (
    <section
      id="awards"
      style={{ backgroundColor: "var(--pgl-background)", overflow: "hidden" }}
    >
      <div
        className="px-5 md:px-[30px] py-16 md:py-[100px]"
        style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        {/* ═══ Header ═══ */}
        <div
          className="flex flex-col items-center text-center"
          style={{ maxWidth: 1296, width: "100%", marginBottom: 48, gap: 16 }}
        >
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
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                Awards
              </span>
            </div>
          </ScrollReveal>
          {c.title && (
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
                  maxWidth: 600,
                  textAlign: "center",
                }}
                data-pgl-path="title"
                data-pgl-edit="text"
              >
                {renderAccentText(c.title, accent)}
              </h2>
            </ScrollReveal>
          )}
        </div>

        {/* ═══ Award Cards ═══ */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full"
          style={{ maxWidth: 1296, gap: 16 }}
        >
          {c.items.map((item, idx) => (
            <ScrollReveal key={idx} delay={150 + idx * 100}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  padding: "32px 24px",
                  borderRadius: 20,
                  border: `1px solid ${border}`,
                  background: "linear-gradient(180deg, rgba(255,255,255,1) 52%, rgba(250,251,248,1) 100%)",
                  boxShadow: "0 0 14px rgba(0,0,0,0.05)",
                  transition: "transform 0.4s ease, box-shadow 0.3s",
                  cursor: "default",
                  height: "100%",
                  perspective: "1200px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 0 14px rgba(0,0,0,0.05)";
                }}
              >
                {/* Award Image or Icon */}
                {item.image ? (
                  <div
                    style={{
                      width: "100%",
                      height: 48,
                      marginBottom: 20,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    data-pgl-path={`items.${idx}.image`}
                    data-pgl-edit="image"
                  >
                    <img
                      src={item.image}
                      alt={item.value}
                      style={{
                        maxHeight: 48,
                        maxWidth: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 16,
                      backgroundColor: `${accent}10`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 20,
                    }}
                  >
                    <AwardIcon color={accent} />
                  </div>
                )}

                {/* Award Name (value) */}
                <h3
                  style={{
                    fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                    fontSize: 18,
                    fontWeight: 500,
                    letterSpacing: "-0.3px",
                    lineHeight: "1.3em",
                    color: primary,
                    margin: 0,
                    marginBottom: 6,
                  }}
                  data-pgl-path={`items.${idx}.value`}
                  data-pgl-edit="text"
                >
                  {item.value}
                </h3>

                {/* Year / Description (label) */}
                <p
                  style={{
                    fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                    fontSize: 14,
                    fontWeight: 400,
                    lineHeight: "1.5em",
                    color: "rgba(102,102,102,1)",
                    margin: 0,
                  }}
                  data-pgl-path={`items.${idx}.label`}
                  data-pgl-edit="text"
                >
                  {item.label}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
