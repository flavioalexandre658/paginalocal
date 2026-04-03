"use client";

import { useState } from "react";
import type { DesignTokens } from "@/types/ai-generation";
import { ScrollReveal } from "./scroll-reveal";
import { ServicesContentSchema } from "@/types/ai-generation";

interface Props {
  content: Record<string, unknown>;
  tokens: DesignTokens;
  isDark?: boolean;
}

export function GroviaFeatures({ content, tokens }: Props) {
  const [activeIdx, setActiveIdx] = useState(0);
  const parsed = ServicesContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;
  const activeItem = c.items[activeIdx] || c.items[0];

  return (
    <section id="services" style={{ backgroundColor: "var(--pgl-background)" }}>
      {/* Container */}
      <div
        className="px-6 py-12 md:px-[80px] md:py-[80px]"
        style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}
      >
        {/* Header — centered */}
        <div className="text-center" style={{ maxWidth: 700 }}>
          <h2
            style={{
              fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
              fontSize: "clamp(28px, 5vw, 36px)",
              fontWeight: 400,
              letterSpacing: "-0.05em",
              lineHeight: "1.1em",
              color: "var(--pgl-text)",
              margin: 0,
            }}
            data-pgl-path="title"
            data-pgl-edit="text"
          >
            {c.title.split(/\*([^*]+)\*/).map((part, i) =>
              i % 2 === 1 ? (
                <span key={i} style={{ color: tokens.palette.accent }}>{part}</span>
              ) : (
                <span key={i}>{part}</span>
              )
            )}
          </h2>
          {c.subtitle && (
            <p
              style={{
                fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                fontSize: 18,
                fontWeight: 400,
                letterSpacing: "-0.03em",
                lineHeight: "1.4em",
                color: "var(--pgl-text-muted)",
                margin: "16px 0 0",
              }}
              data-pgl-path="subtitle"
              data-pgl-edit="text"
            >
              {c.subtitle}
            </p>
          )}
        </div>

        {/* Feature card area */}
        <div className="w-full" style={{ maxWidth: 1040, display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Tabs — column on mobile, row on desktop */}
          <div
            className="flex flex-col md:flex-row overflow-x-auto scrollbar-hide"
            style={{
              backgroundColor: "var(--pgl-surface)",
              borderRadius: 40,
              padding: 8,
              gap: 4,
            }}
          >
            {c.items.map((item, idx) => {
              const isActive = idx === activeIdx;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveIdx(idx)}
                  style={{
                    padding: "12px 16px",
                    borderRadius: 32,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    cursor: "pointer",
                    border: "none",
                    opacity: isActive ? 1 : 0.5,
                    backgroundColor: isActive ? "rgba(255,255,255,0.8)" : "transparent",
                    boxShadow: isActive ? "0px 4px 10px 0px rgba(0,0,0,0.1)" : "none",
                    transition: "all 0.3s ease",
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                      fontSize: 14,
                      fontWeight: 500,
                      letterSpacing: "-0.03em",
                      lineHeight: "1.4em",
                      color: "var(--pgl-text)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Feature content card — column on mobile, row on desktop */}
          <div
            className="flex flex-col md:flex-row"
            style={{
              backgroundColor: "var(--pgl-surface)",
              borderRadius: 24,
              overflow: "hidden",
              minHeight: 300,
            }}
          >
            {/* Image side */}
            <div
              className="w-full md:w-[50%] aspect-[1.6] md:aspect-auto"
              style={{
                position: "relative",
                backgroundColor: "rgba(0,0,0,0.9)",
                borderRadius: 16,
                margin: 8,
                overflow: "hidden",
                flexShrink: 0,
              }}
            >
              {activeItem.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={activeItem.image}
                  alt={activeItem.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    mask: "linear-gradient(0deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.95) 100%)",
                    WebkitMaskImage: "linear-gradient(0deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.95) 100%)",
                  }}
                  data-pgl-path={`items.${activeIdx}.image`}
                  data-pgl-edit="image"
                />
              ) : (
                <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", padding: 24, gap: 16, justifyContent: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                    <div style={{ width: 100, height: 14, borderRadius: 7, backgroundColor: "rgba(255,255,255,0.15)" }} />
                    <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
                      <div style={{ width: 60, height: 10, borderRadius: 5, backgroundColor: "rgba(255,255,255,0.1)" }} />
                    </div>
                  </div>
                  {[1, 2, 3, 4].map(i => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "10px 12px",
                        borderRadius: 12,
                        backgroundColor: i === 1 ? tokens.palette.accent + "22" : "rgba(255,255,255,0.05)",
                      }}
                    >
                      <div style={{ width: 28, height: 28, borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.12)" }} />
                      <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
                        <div style={{ width: "50%", height: 9, borderRadius: 4, backgroundColor: "rgba(255,255,255,0.15)" }} />
                        <div style={{ width: "35%", height: 7, borderRadius: 3, backgroundColor: "rgba(255,255,255,0.08)" }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Content side */}
            <div
              className="w-full md:w-[430px] p-6 md:p-[60px]"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: 24,
                flexShrink: 0,
              }}
            >
              {/* Label */}
              <span
                style={{
                  fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                  fontSize: 12,
                  fontWeight: 500,
                  letterSpacing: "-0.03em",
                  lineHeight: "1.2em",
                  color: "var(--pgl-text)",
                  textTransform: "uppercase",
                }}
              >
                {activeItem.name}
              </span>

              {/* H3 */}
              <h3
                style={{
                  fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                  fontSize: "clamp(24px, 4vw, 36px)",
                  fontWeight: 400,
                  letterSpacing: "-0.05em",
                  lineHeight: "1.3em",
                  color: "var(--pgl-text)",
                  margin: 0,
                }}
                data-pgl-path={`items.${activeIdx}.name`}
                data-pgl-edit="text"
              >
                {activeItem.description?.split(".")[0] || activeItem.name}
              </h3>

              {/* Description */}
              <p
                style={{
                  fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                  fontSize: 16,
                  fontWeight: 400,
                  letterSpacing: "-0.03em",
                  lineHeight: "1.4em",
                  color: "var(--pgl-text-muted)",
                  margin: 0,
                }}
                data-pgl-path={`items.${activeIdx}.description`}
                data-pgl-edit="text"
              >
                {activeItem.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
