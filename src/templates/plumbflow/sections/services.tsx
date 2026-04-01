"use client";

import { useState } from "react";
import type { DesignTokens } from "@/types/ai-generation";
import { ServicesContentSchema } from "@/types/ai-generation";
import { ScrollReveal } from "./scroll-reveal";

interface Props {
  content: Record<string, unknown>;
  tokens: DesignTokens;
  isDark?: boolean;
}

function ArrowIcon({ color = "#142F45" }: { color?: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" style={{ flexShrink: 0 }}>
      <path d="M6 14h16M16 8l6 6-6 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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

export function PlumbflowServices({ content, tokens }: Props) {
  const parsed = ServicesContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const accent = tokens.palette.accent || "#FF5E15";
  const primary = tokens.palette.primary || "#142F45";
  const [activeIdx, setActiveIdx] = useState(0);
  const activeItem = c.items[activeIdx];

  return (
    <section
      id="services"
      style={{ backgroundColor: "var(--pgl-surface, #F1F2FA)", overflow: "hidden" }}
    >
      <div
        className="px-5 md:px-[30px] py-16 md:py-[120px]"
        style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        {/* ═══ Top row: Title + CTA ═══ */}
        <div
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 w-full"
          style={{ maxWidth: 1296, marginBottom: 64 }}
        >
          {/* Left: Tag + H2 */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {c.subtitle && (
              <ScrollReveal delay={0}>
                <p
                  style={{
                    fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                    fontSize: 16,
                    fontWeight: 700,
                    letterSpacing: "0.3px",
                    lineHeight: "1.7em",
                    color: accent,
                    margin: 0,
                  }}
                  data-pgl-path="subtitle"
                  data-pgl-edit="text"
                >
                  {c.subtitle}
                </p>
              </ScrollReveal>
            )}
            <ScrollReveal delay={100}>
            <h2
              style={{
                fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                fontSize: "clamp(28px, 4vw, 42px)",
                fontWeight: 700,
                letterSpacing: "-1.5px",
                lineHeight: "1.2em",
                color: primary,
                margin: 0,
                maxWidth: 675,
              }}
              data-pgl-path="title"
              data-pgl-edit="text"
            >
              {renderAccentText(c.title, accent)}
            </h2>
            </ScrollReveal>
          </div>

          {/* Right: CTA pill */}
          {c.items[0]?.ctaText && (
            <ScrollReveal delay={200}>
              <a
                href="#services"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "12px 24px",
                  backgroundColor: accent,
                  borderRadius: 58,
                  boxShadow: "rgba(255,255,255,0.4) 0px 4px 7px 0px inset",
                  textDecoration: "none",
                  flexShrink: 0,
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.9"; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
              >
                <span
                  style={{
                    fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                    fontSize: 16,
                    fontWeight: 700,
                    letterSpacing: "0.3px",
                    color: "#fff",
                    whiteSpace: "nowrap",
                  }}
                >
                  {c.items[0]?.ctaText || "Ver todos"}
                </span>
              </a>
            </ScrollReveal>
          )}
        </div>

        {/* ═══ Content row: Service list + Card ═══ */}
        <div
          className="flex flex-col md:flex-row w-full"
          style={{ maxWidth: 1296, gap: 0, justifyContent: "space-between", alignItems: "center" }}
        >
          {/* LEFT — Service names list */}
          <div
            className="w-full md:max-w-[280px] mb-8 md:mb-0"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 48,
            }}
          >
            {c.items.map((item, idx) => (
              <ScrollReveal key={idx} delay={idx * 100}>
                <button
                  onClick={() => setActiveIdx(idx)}
                  style={{
                    cursor: "pointer",
                    background: "none",
                    border: "none",
                    padding: 0,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                    transition: "color 0.2s",
                  }}
                >
                  <ArrowIcon color={activeIdx === idx ? accent : primary} />
                  <span
                    style={{
                      fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                      fontSize: 22,
                      fontWeight: 700,
                      letterSpacing: "0px",
                      lineHeight: "1.4em",
                      color: activeIdx === idx ? accent : primary,
                      whiteSpace: "nowrap",
                      textAlign: "left",
                    }}
                    data-pgl-path={`items.${idx}.name`}
                    data-pgl-edit="text"
                  >
                    {item.name}
                  </span>
                </button>
              </ScrollReveal>
            ))}
          </div>

          {/* RIGHT — Service card with image + description */}
          <ScrollReveal delay={200} className="w-full md:flex-1 md:max-w-[883px] md:aspect-[1.66]">
          <div
            style={{
              minHeight: 380,
              borderRadius: 16,
              overflow: "hidden",
              position: "relative",
            }}
          >
            {/* Image */}
            <div
              style={{ position: "absolute", inset: 0 }}
              data-pgl-path={`items.${activeIdx}.image`}
              data-pgl-edit="image"
            >
              {activeItem?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={activeItem.image}
                  alt={activeItem.name}
                  style={{
                    display: "block",
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    background: `linear-gradient(135deg, ${primary} 0%, ${primary}cc 100%)`,
                  }}
                />
              )}
            </div>

            {/* Dark gradient overlay bottom */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.85) 100%)",
              }}
            />

            {/* Bottom content — description + CTA */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: "32px",
                display: "flex",
                flexDirection: "column",
                gap: 20,
              }}
            >
              <p
                style={{
                  fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                  fontSize: 18,
                  fontWeight: 400,
                  letterSpacing: "0px",
                  lineHeight: "1.4em",
                  color: "rgba(255,255,255,0.9)",
                  margin: 0,
                  maxWidth: 600,
                }}
                data-pgl-path={`items.${activeIdx}.description`}
                data-pgl-edit="text"
              >
                {activeItem?.description || ""}
              </p>

              {activeItem?.ctaText && (
                <a
                  href={activeItem.ctaLink || "#contact"}
                  data-pgl-path={`items.${activeIdx}.ctaText`}
                  data-pgl-edit="button"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "12px 24px",
                    backgroundColor: accent,
                    borderRadius: 58,
                    boxShadow: "rgba(255,255,255,0.4) 0px 4px 7px 0px inset",
                    textDecoration: "none",
                    width: "fit-content",
                    transition: "opacity 0.2s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.9"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
                >
                  <span
                    style={{
                      fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                      fontSize: 16,
                      fontWeight: 700,
                      letterSpacing: "0.3px",
                      color: "#fff",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {activeItem.ctaText}
                  </span>
                </a>
              )}
            </div>
          </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
