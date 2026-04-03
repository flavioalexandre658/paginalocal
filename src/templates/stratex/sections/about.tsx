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

/*
  Framer "Feature" row:
  - Padding top wrapper (framer-1lja76d) with icon wrapper inside
  - Icon wrapper: bg rgb(250,250,250) OR bg accent, border-radius 100px
  - Text wrapper: title (preset mqbm9u ~16-18px 500) + description (preset ti24tt ~14-15px 400)
  - Layout: flex row, gap between icon and text
*/

function FeatureRow({
  title,
  description,
  variant,
  accent,
  titlePath,
  descPath,
}: {
  title: string;
  description: string;
  variant: "white" | "green";
  accent: string;
  titlePath?: string;
  descPath?: string;
}) {
  const isGreen = variant === "green";
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: 16,
        alignItems: "flex-start",
        padding: "20px 0",
      }}
    >
      {/* Icon circle */}
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 100,
          backgroundColor: isGreen ? accent : "rgb(250, 250, 250)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          style={{
            width: 18,
            height: 18,
            fill: isGreen ? "rgb(250, 250, 250)" : accent,
            flexShrink: 0,
          }}
        >
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
        </svg>
      </div>

      {/* Text */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1, paddingTop: 4 }}>
        <p
          style={{
            fontFamily: "var(--pgl-font-heading), Georgia, serif",
            fontSize: 18,
            fontWeight: 500,
            letterSpacing: "-0.02em",
            lineHeight: "1.4em",
            color: "var(--pgl-text)",
            margin: 0,
          }}
          {...(titlePath ? { "data-pgl-path": titlePath, "data-pgl-edit": "text" as const } : {})}
        >
          {title}
        </p>
        {description && (
          <p
            style={{
              fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
              fontSize: 15,
              fontWeight: 400,
              lineHeight: "1.55em",
              color: "var(--pgl-text-muted)",
              margin: 0,
            }}
            {...(descPath ? { "data-pgl-path": descPath, "data-pgl-edit": "text" as const } : {})}
          >
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

export function StratexAbout({ content, tokens }: Props) {
  const parsed = ServicesContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const accent = tokens.palette.accent;

  // paragraphs[] = competitor items (left card). Can be strings or {name,description} objects
  const rawParagraphs = (content.paragraphs as unknown[]) || [];
  const competitorItems = rawParagraphs.map((p) => {
    if (typeof p === "string") return { name: p, description: "" };
    if (p && typeof p === "object" && "name" in p) return p as { name: string; description: string };
    if (p && typeof p === "object" && "text" in p) return { name: (p as { text: string }).text, description: "" };
    return { name: String(p), description: "" };
  });

  const competitorHeading = (content.competitorHeading as string) || "Outras empresas";
  const advantageHeading = (content.advantageHeading as string) || "";
  const storeName = (content.storeName as string) || "";

  return (
    <section
      id="about"
      style={{ backgroundColor: "var(--pgl-background)", padding: "100px 0" }}
    >
      <div className="px-[25px]" style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* ═══ Header ═══ */}
        <ScrollReveal>
          <div style={{ display: "flex", flexDirection: "column", gap: 20, alignItems: "center", marginBottom: 56 }}>
            {c.subtitle && (
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <div style={{ width: 8, height: 8, borderRadius: 1000, backgroundColor: accent, flexShrink: 0 }} />
                <span
                  style={{
                    fontFamily: "var(--pgl-font-heading), Georgia, serif",
                    fontSize: 16,
                    fontWeight: 400,
                    color: accent,
                  }}
                  data-pgl-path="subtitle"
                  data-pgl-edit="text"
                >
                  {c.subtitle}
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
              {renderAccentText(c.title, accent)}
            </h2>
          </div>
        </ScrollReveal>

        {/* ═══ Comparison Grid 2x ═══
             From Framer HTML: Grid 2x with data-border="true"
             - Outer wrapper: rounded, border 1px
             - Left card (framer-51n8vi): white bg, "Other Firms" heading, features with white icon circles
             - Right card (framer-1eeitvs): subtle green gradient bg, "With Stratex" heading, features with green icon circles
             - Each feature: icon circle (40px, radius 100px) + title + description
             - NO borders between items — just vertical gap/padding
        ═══ */}
        <ScrollReveal delay={120}>
          <div
            className="flex flex-col md:flex-row"
            style={{
              borderRadius: 24,
              border: "1px solid rgba(0,0,0,0.08)",
              overflow: "hidden",
            }}
          >
            {/* ── LEFT: Other Firms ── */}
            <div
              className="w-full md:w-1/2"
              style={{
                backgroundColor: "var(--pgl-background)",
                padding: "44px 40px",
              }}
            >
              {/* Heading */}
              <p
                style={{
                  fontFamily: "var(--pgl-font-heading), Georgia, serif",
                  fontSize: 24,
                  fontWeight: 400,
                  letterSpacing: "-0.02em",
                  lineHeight: "1.3em",
                  color: "var(--pgl-text)",
                  margin: "0 0 8px 0",
                }}
              >
                {competitorHeading}
              </p>

              {/* Feature list */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                {competitorItems.map((item, idx) => (
                  <FeatureRow
                    key={idx}
                    title={item.name}
                    description={item.description}
                    variant="white"
                    accent={accent}
                  />
                ))}
              </div>
            </div>

            {/* ── RIGHT: With [Company] ── */}
            <div
              className="w-full md:w-1/2"
              style={{
                background: `linear-gradient(170deg, var(--pgl-background) 0%, ${accent}06 30%, ${accent}12 100%)`,
                padding: "44px 40px",
                borderLeft: "1px solid rgba(0,0,0,0.06)",
              }}
            >
              {/* Heading */}
              <p
                style={{
                  fontFamily: "var(--pgl-font-heading), Georgia, serif",
                  fontSize: 24,
                  fontWeight: 400,
                  letterSpacing: "-0.02em",
                  lineHeight: "1.3em",
                  color: "var(--pgl-text)",
                  margin: "0 0 8px 0",
                }}
              >
                {advantageHeading || (storeName ? `Com ${storeName}` : "Nossa empresa")}
              </p>

              {/* Feature list */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                {c.items.map((item, idx) => (
                  <FeatureRow
                    key={idx}
                    title={item.name}
                    description={item.description}
                    variant="green"
                    accent={accent}
                    titlePath={`items.${idx}.name`}
                    descPath={`items.${idx}.description`}
                  />
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
