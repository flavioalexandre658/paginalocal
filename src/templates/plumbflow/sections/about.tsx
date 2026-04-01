"use client";

import { useState } from "react";
import type { DesignTokens } from "@/types/ai-generation";
import { AboutContentSchema } from "@/types/ai-generation";
import { ScrollReveal } from "./scroll-reveal";

interface Props {
  content: Record<string, unknown>;
  tokens: DesignTokens;
  isDark?: boolean;
}

function CheckIcon({ color = "#FF5E15" }: { color?: string }) {
  return (
    <svg width="20" height="21" viewBox="0 0 20 21" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="10" cy="10.5" r="9" stroke={color} strokeWidth="1.5" opacity="0.3" />
      <path d="M6 10.5l3 3 5-5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
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

export function PlumbflowAbout({ content, tokens }: Props) {
  const parsed = AboutContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const accent = tokens.palette.accent || "#FF5E15";
  const primary = tokens.palette.primary || "#142F45";

  // highlights = tabs (label = tab name, value = tab description)
  // paragraphs = bullet points for the checklist (same for all tabs)
  const hasTabs = c.highlights && c.highlights.length >= 2;
  const tabs = hasTabs
    ? c.highlights!.map((h) => ({ label: h.label, description: h.value }))
    : [];

  const bulletPoints = c.paragraphs;

  const [activeTab, setActiveTab] = useState(0);

  // Active tab description
  const activeDescription = hasTabs
    ? tabs[activeTab]?.description || ""
    : c.paragraphs[0] || "";

  // Bullet points in 2 columns
  const midpoint = Math.ceil(bulletPoints.length / 2);
  const col1 = bulletPoints.slice(0, midpoint);
  const col2 = bulletPoints.slice(midpoint);

  return (
    <section
      id="about"
      style={{ backgroundColor: "var(--pgl-background)", overflow: "hidden" }}
    >
      <div
        className="flex flex-col md:flex-row px-6 py-16 md:px-[30px] md:py-[80px]"
        style={{ maxWidth: 1296, margin: "0 auto", gap: 64, alignItems: "flex-start" }}
      >
        {/* ── Left — Image ── */}
        <ScrollReveal delay={0} className="w-full md:flex-1 md:max-w-[550px]">
          <div
            style={{
              aspectRatio: "1.036",
              borderRadius: 24,
              overflow: "hidden",
              position: "relative",
              flexShrink: 0,
            }}
            data-pgl-path="image"
            data-pgl-edit="image"
          >
            {c.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={c.image}
                alt="About"
                style={{
                  display: "block",
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background: `linear-gradient(135deg, ${primary}22, ${accent}11, ${primary}11)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none" opacity="0.3">
                  <rect x="8" y="8" width="48" height="48" rx="8" stroke={primary} strokeWidth="2" />
                  <circle cx="24" cy="24" r="6" stroke={primary} strokeWidth="2" />
                  <path d="M8 44l16-12 12 8 20-16" stroke={primary} strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
            )}
          </div>
        </ScrollReveal>

        {/* ── Right — Content ── */}
        <div
          className="w-full md:flex-1"
          style={{ display: "flex", flexDirection: "column", gap: 0 }}
        >
          {/* Tag "WHO WE ARE" */}
          {c.subtitle && (
            <ScrollReveal delay={100}>
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

          {/* H2 title */}
          <ScrollReveal delay={200}>
            <h2
              style={{
                fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                fontSize: "clamp(28px, 4vw, 42px)",
                fontWeight: 700,
                letterSpacing: "-1.5px",
                lineHeight: "1.2em",
                color: primary,
                margin: "16px 0 0",
              }}
              data-pgl-path="title"
              data-pgl-edit="text"
            >
              {renderAccentText(c.title, accent)}
            </h2>
          </ScrollReveal>

          {/* ── Tab buttons ── */}
          {hasTabs && (
            <ScrollReveal delay={300}>
              <div
                className="flex flex-col md:flex-row"
                style={{ gap: 0, width: "100%", marginTop: 32 }}
              >
                {tabs.map((tab, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveTab(i)}
                    className="w-full md:w-auto"
                    style={{
                      cursor: "pointer",
                      background: "none",
                      border: "none",
                      borderBottom: `2px solid ${activeTab === i ? accent : "#F1F2FA"}`,
                      padding: "14px 28px",
                      fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                      fontSize: 22,
                      fontWeight: 700,
                      letterSpacing: "0px",
                      lineHeight: "1.4em",
                      color: activeTab === i ? accent : primary,
                      transition: "color 0.2s, border-color 0.2s",
                      whiteSpace: "nowrap",
                      textAlign: "center",
                    }}
                    data-pgl-path={`highlights.${i}.label`}
                    data-pgl-edit="text"
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </ScrollReveal>
          )}

          {/* ── Tab description paragraph ── */}
          <ScrollReveal delay={300}>
            <p
              style={{
                fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                fontSize: 18,
                fontWeight: 400,
                letterSpacing: "0px",
                lineHeight: "1.4em",
                color: "var(--pgl-text-muted, #4B5554)",
                margin: 0,
                marginTop: 24,
              }}
              data-pgl-path={hasTabs ? `highlights.${activeTab}.value` : "paragraphs.0"}
              data-pgl-edit="text"
            >
              {activeDescription}
            </p>
          </ScrollReveal>

          {/* ── Checklist — 2 columns ── */}
          {bulletPoints.length > 0 && (
            <ScrollReveal delay={400}>
              <div
                className="grid grid-cols-1 md:grid-cols-2"
                style={{ gap: "16px 40px", marginTop: 32 }}
              >
                {/* Column 1 items */}
                {col1.map((item, i) => (
                  <div
                    key={`a-${i}`}
                    style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 8 }}
                  >
                    <CheckIcon color={accent} />
                    <span
                      style={{
                        fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                        fontSize: 18,
                        fontWeight: 400,
                        letterSpacing: "0px",
                        lineHeight: "1.4em",
                        color: "var(--pgl-text-muted, #4B5554)",
                      }}
                      data-pgl-path={`paragraphs.${i}`}
                      data-pgl-edit="text"
                    >
                      {item}
                    </span>
                  </div>
                ))}
                {/* Column 2 items */}
                {col2.map((item, i) => (
                  <div
                    key={`b-${i}`}
                    style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 8 }}
                  >
                    <CheckIcon color={accent} />
                    <span
                      style={{
                        fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                        fontSize: 18,
                        fontWeight: 400,
                        letterSpacing: "0px",
                        lineHeight: "1.4em",
                        color: "var(--pgl-text-muted, #4B5554)",
                      }}
                      data-pgl-path={`paragraphs.${midpoint + i}`}
                      data-pgl-edit="text"
                    >
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          )}
        </div>
      </div>
    </section>
  );
}
