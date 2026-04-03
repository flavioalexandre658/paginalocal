"use client";

import { useEffect, useRef, useState } from "react";
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

export function PlumbflowProcess({ content, tokens }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const handleScroll = () => {
      const rect = el.getBoundingClientRect();
      const windowH = window.innerHeight;
      const sectionTop = rect.top;
      const sectionH = rect.height;
      const start = windowH * 0.8;
      const end = -sectionH + windowH * 0.5;
      const raw = (start - sectionTop) / (start - end);
      setProgress(Math.max(0, Math.min(1, raw)));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const parsed = ServicesContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const accent = tokens.palette.accent;
  const primary = tokens.palette.primary;

  const totalSteps = c.items.length;

  return (
    <section
      id="process"
      style={{ backgroundColor: "var(--pgl-background)", overflow: "visible" }}
    >
      <div
        className="px-5 md:px-[30px] py-16 md:py-[120px]"
        style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        {/* ═══ Header ═══ */}
        <div
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 w-full"
          style={{ maxWidth: 1296, marginBottom: 64 }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {c.subtitle && (
              <ScrollReveal delay={0}>
                <p
                  style={{
                    fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                    fontSize: 16, fontWeight: 700, letterSpacing: "0.3px",
                    lineHeight: "1.7em", color: accent, margin: 0, textTransform: "uppercase",
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
                  fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700,
                  letterSpacing: "-1.5px", lineHeight: "1.2em",
                  color: primary, margin: 0, maxWidth: 600,
                }}
                data-pgl-path="title"
                data-pgl-edit="text"
              >
                {renderAccentText(c.title, accent)}
              </h2>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={200}>
            <a
              href="#contact"
              style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                gap: 10, padding: "12px 24px", backgroundColor: accent,
                borderRadius: 58, boxShadow: "rgba(255,255,255,0.4) 0px 4px 7px 0px inset",
                textDecoration: "none", flexShrink: 0, transition: "opacity 0.2s", width: "fit-content",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.9"; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
            >
              <span style={{
                fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                fontSize: 16, fontWeight: 700, letterSpacing: "0.3px", color: "#fff", whiteSpace: "nowrap",
              }}>
                {c.items[0]?.ctaText || "Solicitar orçamento"}
              </span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </ScrollReveal>
        </div>

        {/* ═══ Timeline ═══ */}
        <div ref={sectionRef} style={{ width: "100%", maxWidth: 1200, position: "relative" }}>
          {c.items.map((item, idx) => {
            const stepProgress = progress * totalSteps;
            const isActive = stepProgress >= idx;
            const isFilled = stepProgress >= idx + 1;
            const barFill = isFilled ? 1 : Math.max(0, stepProgress - idx);
            const isEven = idx % 2 === 0; // even = card RIGHT, odd = card LEFT

            const card = (
              <div
                className="flex-1"
                style={{ maxWidth: 530 }}
              >
                <div
                  style={{
                    backgroundColor: primary,
                    borderRadius: 16,
                    padding: "44px 48px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    opacity: isActive ? 1 : 0.4,
                    transform: isActive ? "none" : "translateY(8px)",
                    transition: "opacity 0.5s ease, transform 0.5s ease",
                  }}
                >
                  <span style={{
                    fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                    fontSize: "clamp(32px, 4vw, 42px)", fontWeight: 700,
                    letterSpacing: "-1.5px", lineHeight: "1.2em", color: accent,
                  }}>
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <h4 style={{
                    fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                    fontSize: 22, fontWeight: 700, letterSpacing: "0px",
                    lineHeight: "1.4em", color: "#fff", margin: 0,
                  }} data-pgl-path={`items.${idx}.name`} data-pgl-edit="text">
                    {item.name}
                  </h4>
                  <p style={{
                    fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                    fontSize: 16, fontWeight: 400, letterSpacing: "0px",
                    lineHeight: "1.5em", color: "rgba(255,255,255,0.7)", margin: "4px 0 0",
                  }} data-pgl-path={`items.${idx}.description`} data-pgl-edit="text">
                    {item.description || ""}
                  </p>
                </div>
              </div>
            );

            const spacer = <div className="flex-1" style={{ maxWidth: 530 }} />;

            const progressCol = (
              <div style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                width: 25, flexShrink: 0, zIndex: 3,
              }}>
                <div style={{
                  width: 25, height: 25, borderRadius: "50%",
                  backgroundColor: isActive ? accent : `${primary}26`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "background-color 0.4s ease", flexShrink: 0,
                }}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 6l2.5 2.5 4.5-5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                {idx < totalSteps - 1 && (
                  <div style={{
                    width: 3, flex: 1, minHeight: 60,
                    backgroundColor: `${primary}1a`,
                    position: "relative", overflow: "hidden",
                  }}>
                    <div style={{
                      position: "absolute", top: 0, left: 0, width: "100%",
                      height: `${barFill * 100}%`, backgroundColor: accent,
                      transition: "height 0.3s ease",
                    }} />
                  </div>
                )}
              </div>
            );

            return (
              <div key={idx}>
                {/* Desktop: alternating left/right */}
                <div
                  className="hidden md:flex"
                  style={{ gap: 40, marginBottom: idx < totalSteps - 1 ? 0 : 0 }}
                >
                  {isEven ? spacer : card}
                  {progressCol}
                  {isEven ? card : spacer}
                </div>

                {/* Mobile: line left, card right */}
                <div
                  className="flex md:hidden"
                  style={{ gap: 16, marginBottom: idx < totalSteps - 1 ? 0 : 0 }}
                >
                  {progressCol}
                  <div style={{ flex: 1 }}>{card}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
