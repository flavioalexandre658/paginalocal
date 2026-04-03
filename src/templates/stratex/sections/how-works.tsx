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

export function StratexHowWorks({ content, tokens }: Props) {
  const parsed = ServicesContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const accent = tokens.palette.accent;
  const ctaText = (content.ctaText as string) || "";
  const ctaLink = (content.ctaLink as string) || "#contato";

  return (
    <section
      id="how-it-works"
      style={{ backgroundColor: "var(--pgl-background)", padding: "80px 0" }}
    >
      <div className="px-[25px]" style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* ═══ Header: centered tag + H2 + CTA button ═══ */}
        <ScrollReveal>
          <div style={{ display: "flex", flexDirection: "column", gap: 20, alignItems: "center", marginBottom: 64 }}>
            {c.subtitle && (
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <div style={{ width: 8, height: 8, borderRadius: 1000, backgroundColor: accent, flexShrink: 0 }} />
                <span
                  style={{ fontFamily: "var(--pgl-font-heading), Georgia, serif", fontSize: 16, fontWeight: 400, color: accent }}
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

            {/* Primary CTA button — accent bg + white circle arrow */}
            {ctaText && (
              <a
                href={ctaLink}
                data-pgl-path="ctaText"
                data-pgl-edit="button"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  height: 52,
                  padding: "0 6px 0 22px",
                  backgroundColor: accent,
                  borderRadius: 1000,
                  textDecoration: "none",
                  marginTop: 8,
                }}
              >
                <span style={{ fontFamily: "var(--pgl-font-body), system-ui, sans-serif", fontSize: 15, fontWeight: 500, color: "#fff", whiteSpace: "nowrap" }}>
                  {ctaText}
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 40, height: 40, borderRadius: 1000, backgroundColor: "#fff" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--pgl-text)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </span>
              </a>
            )}
          </div>
        </ScrollReveal>

        {/* ═══ Steps — Desktop: 3-col alternating timeline ═══ */}
        <div className="hidden md:block">
          {c.items.slice(0, 3).map((item, idx) => {
            const stepNum = String(idx + 1).padStart(2, "0");
            const isEven = idx % 2 === 1;
            const isLast = idx === Math.min(c.items.length, 3) - 1;

            return (
              <ScrollReveal key={idx} delay={idx * 100}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 40px 1fr",
                    gap: 40,
                    minHeight: 380,
                  }}
                >
                  {/* Left */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: isEven ? "flex-start" : "flex-end" }}>
                    {isEven ? (
                      <StepText item={item} idx={idx} accent={accent} />
                    ) : (
                      <StepImage item={item} idx={idx} />
                    )}
                  </div>

                  {/* Center timeline */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ width: 1, flex: 1, backgroundColor: "rgba(0,0,0,0.1)" }} />
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 1000,
                        backgroundColor: accent,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <span style={{ fontFamily: "var(--pgl-font-body)", fontSize: 14, fontWeight: 600, color: "#fff" }}>{stepNum}</span>
                    </div>
                    <div style={{ width: 1, flex: 1, backgroundColor: isLast ? "transparent" : "rgba(0,0,0,0.1)" }} />
                  </div>

                  {/* Right */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: isEven ? "flex-end" : "flex-start" }}>
                    {isEven ? (
                      <StepImage item={item} idx={idx} />
                    ) : (
                      <StepText item={item} idx={idx} accent={accent} />
                    )}
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* ═══ Steps — Mobile: stacked ═══ */}
        <div className="md:hidden flex flex-col" style={{ gap: 40 }}>
          {c.items.slice(0, 3).map((item, idx) => {
            const stepNum = String(idx + 1).padStart(2, "0");
            return (
              <ScrollReveal key={idx} delay={idx * 100}>
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <StepImage item={item} idx={idx} />
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 1000,
                        backgroundColor: accent,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <span style={{ fontFamily: "var(--pgl-font-body)", fontSize: 13, fontWeight: 600, color: "#fff" }}>{stepNum}</span>
                    </div>
                    <StepText item={item} idx={idx} accent={accent} />
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ── Step Image sub-component ── */
function StepImage({ item, idx }: { item: { name: string; image?: string }; idx: number }) {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 520,
        borderRadius: 16,
        overflow: "hidden",
        position: "relative",
        aspectRatio: "4 / 3",
      }}
      data-pgl-path={`items.${idx}.image`}
      data-pgl-edit="image"
    >
      {item.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.image}
          alt={item.name}
          style={{ display: "block", width: "100%", height: "100%", objectFit: "cover", borderRadius: "inherit" }}
        />
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            minHeight: 240,
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
  );
}

/* ── Step Text sub-component ── */
function StepText({ item, idx, accent }: { item: { name: string; description: string }; idx: number; accent: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 440 }}>
      <h4
        style={{
          fontFamily: "var(--pgl-font-heading), Georgia, serif",
          fontSize: 24,
          fontWeight: 500,
          letterSpacing: "-0.02em",
          lineHeight: "1.3em",
          color: "var(--pgl-text)",
          margin: 0,
        }}
        data-pgl-path={`items.${idx}.name`}
        data-pgl-edit="text"
      >
        {item.name}
      </h4>
      <p
        style={{
          fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
          fontSize: 16,
          fontWeight: 400,
          lineHeight: "1.6em",
          color: "var(--pgl-text-muted)",
          margin: 0,
        }}
        data-pgl-path={`items.${idx}.description`}
        data-pgl-edit="text"
      >
        {item.description}
      </p>
      {/* Link button: "Discover More →" */}
      <a
        href="#contato"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
          fontSize: 15,
          fontWeight: 500,
          color: "var(--pgl-text)",
          textDecoration: "none",
          marginTop: 4,
        }}
      >
        <span>Saiba mais</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </a>
    </div>
  );
}
