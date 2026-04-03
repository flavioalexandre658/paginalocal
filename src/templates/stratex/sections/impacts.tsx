"use client";

import type { DesignTokens } from "@/types/ai-generation";
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

/*
  Stat Pill — from Framer HTML:
  - Item wrapper: bg rgb(250,250,250), border-radius 999px (full pill)
  - Tag inside: bg accent, border-radius 100px, white text (the value like "$7M+")
  - Label: dark text beside the tag (like "Revenue")
  - Line separator: bg dark, opacity 0.1
  - Layout: flex row, items center
*/
function StatPill({
  value,
  label,
  accent,
  align,
  valuePath,
  labelPath,
}: {
  value: string;
  label: string;
  accent: string;
  align: "left" | "right";
  valuePath?: string;
  labelPath?: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 0,
        backgroundColor: "rgb(250, 250, 250)",
        borderRadius: 999,
        padding: 4,
        width: "fit-content",
        ...(align === "right" ? { marginLeft: "auto" } : {}),
      }}
    >
      {/* Value tag — accent bg pill */}
      <div
        style={{
          backgroundColor: accent,
          borderRadius: 100,
          padding: "8px 16px",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
            fontSize: 15,
            fontWeight: 500,
            color: "#fff",
            whiteSpace: "nowrap",
          }}
          {...(valuePath ? { "data-pgl-path": valuePath, "data-pgl-edit": "text" as const } : {})}
        >
          {value}
        </span>
      </div>

      {/* Label text */}
      <span
        style={{
          fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
          fontSize: 15,
          fontWeight: 500,
          color: "var(--pgl-text)",
          padding: "0 16px",
          whiteSpace: "nowrap",
        }}
        {...(labelPath ? { "data-pgl-path": labelPath, "data-pgl-edit": "text" as const } : {})}
      >
        {label}
      </span>

      {/* Separator line */}
      <div
        style={{
          width: 60,
          height: 1,
          backgroundColor: "var(--pgl-text)",
          opacity: 0.1,
          flexShrink: 0,
        }}
      />
    </div>
  );
}

export function StratexImpacts({ content, tokens }: Props) {
  // Parse manually to allow more than 4 items (StatsContentSchema.max(4) is too restrictive)
  const rawItems = (content.items as { value: string; label: string }[]) || [];
  if (rawItems.length < 2) return null;

  const c = {
    title: (content.title as string) || "",
    items: rawItems,
  };

  const accent = tokens.palette.accent;
  const subtitle = (content.subtitle as string) || "";
  const description = (content.description as string) || "";
  const backgroundImage = (content.backgroundImage as string) || "";

  // Split items: left column (first half), right column (second half)
  const half = Math.ceil(c.items.length / 2);
  const leftItems = c.items.slice(0, half);
  const rightItems = c.items.slice(half);

  return (
    <section
      id="impacts"
      style={{ backgroundColor: "var(--pgl-background)", padding: "80px 0" }}
    >
      <div className="px-[25px]" style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* ═══ Header ═══ */}
        <ScrollReveal>
          <div style={{ display: "flex", flexDirection: "column", gap: 20, alignItems: "center", marginBottom: 56 }}>
            {subtitle && (
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <div style={{ width: 8, height: 8, borderRadius: 1000, backgroundColor: accent, flexShrink: 0 }} />
                <span
                  style={{ fontFamily: "var(--pgl-font-heading), Georgia, serif", fontSize: 16, fontWeight: 400, color: accent }}
                  data-pgl-path="subtitle"
                  data-pgl-edit="text"
                >
                  {subtitle}
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
              {renderAccentText(c.title || "", accent)}
            </h2>
            {description && (
              <p
                style={{
                  fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                  fontSize: 17,
                  fontWeight: 400,
                  lineHeight: "1.5em",
                  color: "var(--pgl-text-muted)",
                  margin: 0,
                  textAlign: "center",
                  maxWidth: 560,
                }}
              >
                {description}
              </p>
            )}
          </div>
        </ScrollReveal>

        {/* ═══ Desktop: 3-column layout — Stats Left | Image | Stats Right ═══ */}
        <ScrollReveal delay={100}>
          <div
            className="hidden md:grid"
            style={{
              gridTemplateColumns: "1fr auto 1fr",
              gap: 24,
              alignItems: "center",
              minHeight: 460,
            }}
          >
            {/* Left stats column */}
            <div style={{ display: "flex", flexDirection: "column", gap: 32, justifyContent: "center" }}>
              {leftItems.map((item, idx) => (
                <StatPill
                  key={idx}
                  value={item.value}
                  label={item.label}
                  accent={accent}
                  align="right"
                  valuePath={`items.${idx}.value`}
                  labelPath={`items.${idx}.label`}
                />
              ))}
            </div>

            {/* Center image */}
            <div
              style={{
                width: 340,
                height: 460,
                borderRadius: 20,
                overflow: "hidden",
                flexShrink: 0,
                position: "relative",
              }}
              data-pgl-path="backgroundImage"
              data-pgl-edit="image"
            >
              {backgroundImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={backgroundImage}
                  alt=""
                  style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "var(--pgl-surface, #f5f5f5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--pgl-text-muted)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3 }}>
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </div>
              )}
            </div>

            {/* Right stats column */}
            <div style={{ display: "flex", flexDirection: "column", gap: 32, justifyContent: "center" }}>
              {rightItems.map((item, idx) => {
                const realIdx = half + idx;
                return (
                  <StatPill
                    key={idx}
                    value={item.value}
                    label={item.label}
                    accent={accent}
                    align="left"
                    valuePath={`items.${realIdx}.value`}
                    labelPath={`items.${realIdx}.label`}
                  />
                );
              })}
            </div>
          </div>
        </ScrollReveal>

        {/* ═══ Mobile: pills grid + image below ═══ */}
        <div className="md:hidden">
          <ScrollReveal delay={100}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
                marginBottom: 32,
              }}
            >
              {c.items.map((item, idx) => (
                <StatPill
                  key={idx}
                  value={item.value}
                  label={item.label}
                  accent={accent}
                  align="left"
                  valuePath={`items.${idx}.value`}
                  labelPath={`items.${idx}.label`}
                />
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <div
              style={{ borderRadius: 20, overflow: "hidden", height: 360 }}
              data-pgl-path="backgroundImage"
              data-pgl-edit="image"
            >
              {backgroundImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={backgroundImage} alt="" style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{ width: "100%", height: "100%", backgroundColor: "var(--pgl-surface, #f5f5f5)" }} />
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
