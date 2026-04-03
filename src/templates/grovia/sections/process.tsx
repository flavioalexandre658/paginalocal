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

export function GroviaProcess({ content, tokens }: Props) {
  const [activeIdx, setActiveIdx] = useState(0);

  const parsed = ServicesContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  return (
    <section id="services" style={{ backgroundColor: "var(--pgl-background)" }}>
      {/* Container */}
      <div
        className="px-6 py-12 md:px-[80px] md:py-[80px]"
        style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}
      >
        {/* Section header */}
        <ScrollReveal className="text-center mb-12" delay={0}><div style={{ maxWidth: 600, margin: "0 auto" }}>
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
                margin: "20px 0 0",
              }}
              data-pgl-path="subtitle"
              data-pgl-edit="text"
            >
              {c.subtitle}
            </p>
          )}
        </div></ScrollReveal>

        {/* Outer surface card */}
        <div
          className="w-full"
          style={{
            maxWidth: 1040,
            backgroundColor: "var(--pgl-surface)",
            borderRadius: 24,
            padding: 8,
            display: "flex",
            flexDirection: "column",
            gap: 8,
            overflow: "hidden",
          }}
        >
          {/* Dashboard / image — hidden on mobile */}
          <div
            className="hidden md:block"
            style={{
              width: "100%",
              aspectRatio: "1.43",
              maxHeight: 500,
              borderRadius: "var(--pgl-radius, 24px)",
              border: "1px solid rgba(0,0,0,0.06)",
              boxShadow: "0 2px 20px rgba(0,0,0,0.04)",
              overflow: "hidden",
              backgroundColor: "rgba(255,255,255,0.7)",
            }}
          >
            {/* Show first item image if available, otherwise skeleton */}
            {c.items[0]?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={c.items[0].image as string} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
            <div style={{ width: "100%", height: "100%", padding: 24, display: "flex", gap: 16 }}>
              <div style={{ width: 140, display: "flex", flexDirection: "column", gap: 12, paddingTop: 16 }}>
                {["Home", "Messages", "Tasks", "Members", "Settings"].map((label, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 14, height: 14, borderRadius: 4, backgroundColor: "rgba(0,0,0,0.08)" }} />
                    <div style={{ width: 60 + i * 5, height: 10, borderRadius: 5, backgroundColor: "rgba(0,0,0,0.06)" }} />
                  </div>
                ))}
                <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 6 }}>
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} style={{ padding: "6px 12px", borderRadius: 8, backgroundColor: i === 1 ? tokens.palette.accent + "22" : "transparent" }}>
                      <div style={{ width: 70, height: 8, borderRadius: 4, backgroundColor: i === 1 ? tokens.palette.accent + "44" : "rgba(0,0,0,0.06)" }} />
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ width: 140, height: 18, borderRadius: 6, backgroundColor: "rgba(0,0,0,0.1)" }} />
                  <div style={{ display: "flex", gap: 8 }}>
                    <div style={{ width: 60, height: 12, borderRadius: 6, backgroundColor: "rgba(0,0,0,0.05)" }} />
                    <div style={{ width: 60, height: 12, borderRadius: 6, backgroundColor: "rgba(0,0,0,0.05)" }} />
                  </div>
                </div>
                <div style={{ flex: 1, display: "flex", gap: 12 }}>
                  {["To Do", "In Progress", "Done"].map((col, ci) => (
                    <div key={ci} style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: ci === 0 ? tokens.palette.primary + "44" : ci === 1 ? tokens.palette.accent : "rgb(174,174,174)" }} />
                        <div style={{ width: 60, height: 8, borderRadius: 4, backgroundColor: "rgba(0,0,0,0.08)" }} />
                      </div>
                      {[1, 2].map(ri => (
                        <div key={ri} style={{ borderRadius: 12, padding: 12, backgroundColor: "rgba(255,255,255,0.7)", border: "1px solid rgba(0,0,0,0.04)", display: "flex", flexDirection: "column", gap: 8 }}>
                          <div style={{ width: "80%", height: 10, borderRadius: 5, backgroundColor: "rgba(0,0,0,0.08)" }} />
                          <div style={{ width: "60%", height: 8, borderRadius: 4, backgroundColor: "rgba(0,0,0,0.05)" }} />
                          <div style={{ width: "100%", height: 40, borderRadius: 8, backgroundColor: ci === 1 && ri === 1 ? tokens.palette.accent + "15" : "rgba(0,0,0,0.03)" }} />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            )}
          </div>

          {/* Step cards grid — 1 col mobile, 3 col desktop */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 w-full">
            {c.items.slice(0, 3).map((item, idx) => {
              const isActive = idx === activeIdx;
              const stepNum = String(idx + 1).padStart(2, "0");

              return (
                <div
                  key={idx}
                  onClick={() => setActiveIdx(idx)}
                  style={{
                    backgroundColor: isActive ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.7)",
                    border: isActive ? "2px solid rgba(255,255,255,1)" : "2px solid transparent",
                    borderRadius: 20,
                    boxShadow: isActive ? "rgba(0,0,0,0.1) 0px 8px 20px 0px" : "none",
                    padding: 24,
                    cursor: "pointer",
                    overflow: "hidden",
                    transition: "all 0.3s ease",
                  }}
                >
                  {/* Always column layout — text then image below */}
                  <div className="flex flex-col gap-4">
                    {/* Step number */}
                    <span
                      style={{
                        fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                        fontSize: 18,
                        fontWeight: 400,
                        letterSpacing: "-0.03em",
                        color: "rgb(174,174,174)",
                      }}
                    >
                      {stepNum}
                    </span>

                    {/* Title */}
                    <h5
                      style={{
                        fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                        fontSize: isActive ? 24 : 20,
                        fontWeight: 400,
                        letterSpacing: "-0.04em",
                        lineHeight: "1.3em",
                        color: "var(--pgl-text)",
                        margin: 0,
                      }}
                      data-pgl-path={`items.${idx}.name`}
                      data-pgl-edit="text"
                    >
                      {item.name}
                    </h5>

                    {/* Description — always visible */}
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
                        data-pgl-path={`items.${idx}.description`}
                        data-pgl-edit="text"
                      >
                        {item.description}
                      </p>

                    {/* Image — visible when active */}
                    {isActive && (
                      <div
                        className="w-full md:w-[50%] h-[200px] md:h-[250px]"
                        style={{
                          borderRadius: 16,
                          border: "2px solid rgba(255,255,255,1)",
                          boxShadow: "rgba(0,0,0,0.25) -2px 4px 15px 0px",
                          overflow: "hidden",
                          marginTop: 8,
                        }}
                      >
                        {item.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.image}
                            alt={item.name}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            data-pgl-path={`items.${idx}.image`}
                            data-pgl-edit="image"
                          />
                        ) : (
                          <div
                            style={{
                              width: "100%",
                              height: "100%",
                              backgroundColor: tokens.palette.primary + "08",
                              display: "flex",
                              flexDirection: "column",
                              padding: 16,
                              gap: 8,
                              justifyContent: "center",
                            }}
                          >
                            <div style={{ width: "70%", height: 10, borderRadius: 5, backgroundColor: tokens.palette.primary + "15" }} />
                            <div style={{ width: "50%", height: 8, borderRadius: 4, backgroundColor: "rgba(0,0,0,0.06)" }} />
                            <div style={{ width: "60%", height: 8, borderRadius: 4, backgroundColor: "rgba(0,0,0,0.06)" }} />
                            <div style={{ width: "40%", height: 24, borderRadius: 8, backgroundColor: tokens.palette.primary + "12", marginTop: 8 }} />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
