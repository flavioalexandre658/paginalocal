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

function renderAccentText(text: string, accentColor: string) {
  return text.split(/\*([^*]+)\*/).map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} style={{ color: accentColor }}>{part}</span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export function StratexServices({ content, tokens }: Props) {
  const [active, setActive] = useState(0);

  const parsed = ServicesContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const accent = tokens.palette.accent;
  const total = c.items.length;

  const prev = () => setActive((a) => (a > 0 ? a - 1 : total - 1));
  const next = () => setActive((a) => (a < total - 1 ? a + 1 : 0));

  return (
    <section
      id="services"
      style={{ backgroundColor: "var(--pgl-background)", padding: "80px 0", overflow: "hidden" }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 25px" }}>
        <ScrollReveal>
          <div style={{ display: "flex", flexDirection: "column", gap: 20, alignItems: "center", marginBottom: 48 }}>
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
          </div>
        </ScrollReveal>
      </div>

      {/* ═══ Desktop: 3-card carousel with active center ═══ */}
      <div className="hidden md:block" style={{ position: "relative", height: 520, marginTop: 16 }}>
        {c.items.map((item, idx) => {
          const offset = idx - active;
          // Wrap around for circular navigation
          let adjustedOffset = offset;
          if (offset > total / 2) adjustedOffset = offset - total;
          if (offset < -total / 2) adjustedOffset = offset + total;

          const isCenter = adjustedOffset === 0;
          const isLeft = adjustedOffset === -1;
          const isRight = adjustedOffset === 1;
          const isVisible = Math.abs(adjustedOffset) <= 1;

          if (!isVisible) return null;

          const badge = ((content.items as Record<string, unknown>[])?.[idx]?.badge as string) || "";

          // Position: center card at 50%, left at ~15%, right at ~85%
          let left = "50%";
          let translateX = "-50%";
          let width = 580;
          let height = 480;
          let opacity = 1;
          let scale = 1;
          let zIndex = 3;

          if (isLeft) {
            left = "16%";
            translateX = "-50%";
            width = 420;
            height = 420;
            opacity = 0.6;
            scale = 0.9;
            zIndex = 1;
          } else if (isRight) {
            left = "84%";
            translateX = "-50%";
            width = 420;
            height = 420;
            opacity = 0.6;
            scale = 0.9;
            zIndex = 1;
          }

          return (
            <div
              key={idx}
              style={{
                position: "absolute",
                left,
                top: "50%",
                transform: `translate(${translateX}, -50%) scale(${scale})`,
                width,
                height,
                borderRadius: 24,
                overflow: "hidden",
                border: "1px solid rgba(0,0,0,0.05)",
                opacity,
                zIndex,
                transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                cursor: isCenter ? "default" : "pointer",
                boxShadow: isCenter
                  ? "rgba(0,0,0,0.12) 0px 1px 24px 0px, rgba(255,255,255,0.28) 0px 0px 4px 1px inset"
                  : "rgba(0,0,0,0.07) 0px 0px 12px 0px, rgba(255,255,255,0.25) 0px 2px 4px 0px inset",
              }}
              onClick={() => !isCenter && setActive(idx)}
            >
              {/* BG Image */}
              <div
                style={{ position: "absolute", inset: 0 }}
                data-pgl-path={`items.${idx}.image`}
                data-pgl-edit="image"
              >
                {item.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                ) : (
                  <div style={{ width: "100%", height: "100%", backgroundColor: `${accent}10` }} />
                )}
              </div>

              {/* Gradient */}
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 45%, transparent 70%)" }} />

              {/* Text */}
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 28 }}>
                {badge && (
                  <span style={{
                    display: "inline-block", fontFamily: "var(--pgl-font-body)", fontSize: 13, fontWeight: 500,
                    color: "#fff", backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 100, padding: "6px 14px",
                    marginBottom: 10, backdropFilter: "blur(8px)",
                  }}>
                    {badge}
                  </span>
                )}
                <h3
                  style={{
                    fontFamily: "var(--pgl-font-heading), Georgia, serif",
                    fontSize: isCenter ? 26 : 18,
                    fontWeight: 400,
                    letterSpacing: "-0.02em",
                    lineHeight: "1.25em",
                    color: "#fff",
                    margin: "0 0 8px 0",
                  }}
                  data-pgl-path={`items.${idx}.name`}
                  data-pgl-edit="text"
                >
                  {item.name}
                </h3>
                {isCenter && item.description && (
                  <p
                    style={{
                      fontFamily: "var(--pgl-font-body)", fontSize: 15, fontWeight: 400,
                      lineHeight: "1.5em", color: "rgba(255,255,255,0.85)", margin: 0, maxWidth: 440,
                    }}
                    data-pgl-path={`items.${idx}.description`}
                    data-pgl-edit="text"
                  >
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}

        {/* Nav arrows */}
        {total > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Anterior"
              style={{
                position: "absolute", left: "calc(50% - 310px)", top: "50%", transform: "translateY(-50%)",
                zIndex: 10, width: 44, height: 44, borderRadius: 1000, border: "none",
                backgroundColor: accent, cursor: "pointer", display: "flex", alignItems: "center",
                justifyContent: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
            </button>
            <button
              onClick={next}
              aria-label="Proximo"
              style={{
                position: "absolute", right: "calc(50% - 310px)", top: "50%", transform: "translateY(-50%)",
                zIndex: 10, width: 44, height: 44, borderRadius: 1000, border: "none",
                backgroundColor: accent, cursor: "pointer", display: "flex", alignItems: "center",
                justifyContent: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
            </button>
          </>
        )}
      </div>

      {/* ═══ Mobile: stack ═══ */}
      <div className="md:hidden flex flex-col gap-5 px-[25px]">
        {c.items.map((item, idx) => {
          const badge = ((content.items as Record<string, unknown>[])?.[idx]?.badge as string) || "";
          return (
            <div
              key={idx}
              style={{
                position: "relative", width: "100%", height: 380, borderRadius: 20,
                overflow: "hidden", border: "1px solid rgba(0,0,0,0.05)",
              }}
            >
              <div style={{ position: "absolute", inset: 0 }} data-pgl-path={`items.${idx}.image`} data-pgl-edit="image">
                {item.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                ) : (
                  <div style={{ width: "100%", height: "100%", backgroundColor: `${accent}10` }} />
                )}
              </div>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 45%, transparent 70%)" }} />
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 24 }}>
                {badge && (
                  <span style={{ display: "inline-block", fontSize: 13, fontWeight: 500, color: "#fff", backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 100, padding: "6px 14px", marginBottom: 10, backdropFilter: "blur(8px)" }}>
                    {badge}
                  </span>
                )}
                <h3 style={{ fontFamily: "var(--pgl-font-heading), Georgia, serif", fontSize: 22, fontWeight: 400, color: "#fff", margin: "0 0 8px 0" }} data-pgl-path={`items.${idx}.name`} data-pgl-edit="text">
                  {item.name}
                </h3>
                <p style={{ fontFamily: "var(--pgl-font-body)", fontSize: 15, fontWeight: 400, lineHeight: "1.5em", color: "rgba(255,255,255,0.85)", margin: 0 }} data-pgl-path={`items.${idx}.description`} data-pgl-edit="text">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
