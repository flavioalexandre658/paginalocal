"use client";

import { useState } from "react";
import type { DesignTokens } from "@/types/ai-generation";
import { ScrollReveal } from "./scroll-reveal";
import { PricingContentSchema } from "@/types/ai-generation";

interface Props {
  content: Record<string, unknown>;
  tokens: DesignTokens;
  isDark?: boolean;
}

export function GroivaPricing({ content, tokens }: Props) {
  const [activeIdx, setActiveIdx] = useState(0);
  const parsed = PricingContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;
  const activePlan = c.plans[activeIdx] || c.plans[0];

  return (
    <section id="pricing" style={{ backgroundColor: "var(--pgl-background)" }}>
      {/* Outer wrap with padding */}
      <div className="px-1 md:px-5">
        {/* Section wrap — dark bg with rounded corners, image/gradient background */}
        <div
          style={{
            borderRadius: 32,
            overflow: "hidden",
            position: "relative",
            background: `linear-gradient(135deg, ${tokens.palette.text}ee 0%, ${tokens.palette.text}cc 50%, ${tokens.palette.text}dd 100%)`,
          }}
        >
          {/* Colorful decorative blobs */}
          <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
            <div style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", background: tokens.palette.accent, opacity: 0.15, filter: "blur(80px)", bottom: -50, right: "20%" }} />
            <div style={{ position: "absolute", width: 200, height: 200, borderRadius: "50%", background: "#e83043", opacity: 0.1, filter: "blur(60px)", top: "30%", right: "10%" }} />
            <div style={{ position: "absolute", width: 250, height: 250, borderRadius: "50%", background: "#84e6f6", opacity: 0.08, filter: "blur(70px)", bottom: "10%", left: "10%" }} />
          </div>

          {/* Content — column on mobile, row on desktop */}
          <div
            className="flex flex-col md:flex-row md:items-center md:justify-center px-6 py-12 md:px-[60px] md:py-[64px] gap-8 md:gap-16"
            style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto" }}
          >
            {/* Left side — title + plan list + rating */}
            <div className="flex flex-col gap-8 w-full md:w-auto md:min-w-[380px]" style={{ flexShrink: 0 }}>
              {/* H2 — white */}
              <h2
                style={{
                  fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                  fontSize: "clamp(28px, 5vw, 36px)",
                  fontWeight: 400,
                  letterSpacing: "-0.05em",
                  lineHeight: "1.1em",
                  color: "#fff",
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

              {/* Plan list — dark glass bg, radius 24, padding 8, gap 8 */}
              <div
                data-pgl-path="plans"
                data-pgl-edit="pricing"
                style={{
                  backgroundColor: "rgba(0,0,0,0.3)",
                  borderRadius: 24,
                  padding: 8,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                {c.plans.map((plan, idx) => {
                  const isActive = idx === activeIdx;
                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveIdx(idx)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "16px 20px",
                        borderRadius: 16,
                        backgroundColor: isActive ? "rgba(255,255,255,0.1)" : "transparent",
                        opacity: isActive ? 1 : 0.6,
                        border: "none",
                        cursor: "pointer",
                        transition: "all 0.3s",
                        width: "100%",
                      }}
                    >
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 4 }}>
                        {/* Plan name — 20px weight 400 white */}
                        <span
                          data-pgl-path={`plans.${idx}.name`}
                          data-pgl-edit="text"
                          style={{
                          fontFamily: "var(--pgl-font-heading)", fontSize: 20, fontWeight: 400,
                          letterSpacing: "-0.04em", lineHeight: "1.3em", color: "#fff",
                        }}>
                          {plan.name}
                        </span>
                        {/* Description — 14px, white 60% */}
                        <span
                          data-pgl-path={`plans.${idx}.description`}
                          data-pgl-edit="text"
                          style={{
                          fontFamily: "var(--pgl-font-body)", fontSize: 14, fontWeight: 400,
                          letterSpacing: "-0.03em", color: "rgba(255,255,255,0.6)",
                        }}>
                          {plan.description}
                        </span>
                      </div>
                      {/* Arrow — visible when active */}
                      {isActive && (
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
                          <circle cx="10" cy="10" r="10" fill="rgba(255,255,255,0.15)" />
                          <path d="M7 10h6M10.5 7.5l2.5 2.5-2.5 2.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>

            </div>

            {/* Right side — detail card: glassmorphism, 341px, padding 32px, gap 40px */}
            <div
              className="w-full md:w-[341px]"
              style={{
                backdropFilter: "blur(5px)",
                WebkitBackdropFilter: "blur(5px)",
                background: "linear-gradient(320deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.45) 100%)",
                borderRadius: 24,
                padding: 32,
                display: "flex",
                flexDirection: "column",
                gap: 40,
                flexShrink: 0,
              }}
            >
              {/* Plan header */}
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {/* Icon + name */}
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2l1.5 3.5L12 7l-3.5 1.5L7 12l-1.5-3.5L2 7l3.5-1.5Z" fill="rgba(255,255,255,0.7)" /></svg>
                  </div>
                  <span
                    data-pgl-path={`plans.${activeIdx}.name`}
                    data-pgl-edit="text"
                    style={{
                    fontFamily: "var(--pgl-font-heading)", fontSize: 26, fontWeight: 400,
                    letterSpacing: "-0.04em", lineHeight: "1.3em", color: "#fff",
                  }}>
                    {activePlan.name}
                  </span>
                </div>

                {/* Price — 36px */}
                <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                  <span
                    data-pgl-path={`plans.${activeIdx}.price`}
                    data-pgl-edit="text"
                    style={{
                    fontFamily: "var(--pgl-font-heading)", fontSize: 36, fontWeight: 400,
                    letterSpacing: "-0.05em", lineHeight: "1.1em", color: "#fff",
                  }}>
                    {activePlan.price}
                  </span>
                  <span style={{ fontFamily: "var(--pgl-font-body)", fontSize: 14, color: "rgba(255,255,255,0.6)" }}>
                    / mo
                  </span>
                </div>

                {/* Description — 14px */}
                <p
                  data-pgl-path={`plans.${activeIdx}.description`}
                  data-pgl-edit="text"
                  style={{
                  fontFamily: "var(--pgl-font-body)", fontSize: 14, fontWeight: 400,
                  letterSpacing: "-0.03em", lineHeight: "1.4em", color: "rgba(255,255,255,0.6)", margin: 0,
                }}>
                  {activePlan.description}
                </p>

                {/* CTA — accent bg, black text, pill */}
                <a
                  href="#contact"
                  data-pgl-path={`plans.${activeIdx}.ctaText`}
                  data-pgl-edit="button"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    alignSelf: "flex-start",
                    gap: 12,
                    height: 44,
                    padding: "8px 8px 8px 16px",
                    backgroundColor: tokens.palette.accent,
                    borderRadius: 32,
                    textDecoration: "none",
                  }}
                >
                  <span style={{
                    fontFamily: "var(--pgl-font-body)", fontSize: 16, fontWeight: 500,
                    letterSpacing: "-0.03em", color: "var(--pgl-text)", whiteSpace: "nowrap",
                  }}>
                    {activePlan.ctaText || "Schedule a demo"}
                  </span>
                  <span style={{
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    width: 28, height: 28, borderRadius: 40, backgroundColor: "rgba(0,0,0,0.15)", flexShrink: 0,
                  }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M3 7h8M8 4l3 3-3 3" stroke="var(--pgl-text,#000)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </a>
              </div>

              {/* Features list — checkmark + text white 80% */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {activePlan.features.map((feature, fi) => (
                  <div key={fi} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
                      <path d="M4 9l3.5 3.5L14 5" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span
                      data-pgl-path={`plans.${activeIdx}.features.${fi}`}
                      data-pgl-edit="text"
                      style={{
                      fontFamily: "var(--pgl-font-body)", fontSize: 14, fontWeight: 400,
                      letterSpacing: "-0.03em", lineHeight: "1.4em", color: "rgba(255,255,255,0.8)",
                    }}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
