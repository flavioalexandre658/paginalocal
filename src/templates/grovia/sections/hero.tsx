"use client";

import type { DesignTokens } from "@/types/ai-generation";
import { HeroContentSchema } from "@/types/ai-generation";

interface Props {
  content: Record<string, unknown>;
  tokens: DesignTokens;
  isDark?: boolean;
}

export function GroviaHero({ content, tokens }: Props) {
  const parsed = HeroContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;
  const brands = c.brands || [];

  return (
    <section style={{ backgroundColor: "var(--pgl-background)", overflow: "hidden", paddingTop: 80, paddingBottom: 40 }}>
      {/* Container */}
      <div
        className="flex flex-col px-6 pt-20 md:px-[80px] md:pt-[100px]"
        style={{ maxWidth: 1200, margin: "0 auto", gap: 80 }}
      >
        {/* Main — column on mobile, row on desktop */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-12 md:gap-12">

          {/* Text Column */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-10 md:gap-11 w-full md:w-[41%] md:max-w-[600px]">
            {/* Heading block */}
            <div className="flex flex-col gap-6">
              {/* H1 */}
              <h1
                style={{
                  fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                  fontSize: "clamp(32px, 6vw, 50px)",
                  fontWeight: 400,
                  letterSpacing: "-0.05em",
                  lineHeight: "1.1em",
                  color: "var(--pgl-text)",
                  margin: 0,
                }}
                data-pgl-path="headline"
                data-pgl-edit="text"
              >
                {c.headline.split(/\*([^*]+)\*/).map((part, i) =>
                  i % 2 === 1 ? (
                    <span key={i} style={{ color: tokens.palette.accent }}>{part}</span>
                  ) : (
                    <span key={i}>{part}</span>
                  )
                )}
              </h1>

              {/* Subtitle */}
              <p
                style={{
                  fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                  fontSize: 18,
                  fontWeight: 400,
                  letterSpacing: "-0.03em",
                  lineHeight: "1.4em",
                  color: "var(--pgl-text-muted)",
                  margin: 0,
                }}
                data-pgl-path="subheadline"
                data-pgl-edit="text"
              >
                {c.subheadline}
              </p>
            </div>

            {/* Buttons — row on both mobile and desktop, centered on mobile */}
            <div className="flex flex-row flex-wrap justify-center md:justify-start gap-3">
              {/* Primary CTA */}
              <a
                href={c.ctaLink || "#"}
                data-pgl-path="ctaText"
                data-pgl-edit="button"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 12,
                  height: 44,
                  padding: "8px 8px 8px 16px",
                  backgroundColor: "var(--pgl-text, rgb(0,0,0))",
                  borderRadius: 32,
                  boxShadow: "0px 5px 15px 0px rgba(0,0,0,0.2)",
                  textDecoration: "none",
                }}
              >
                <span style={{ fontFamily: "var(--pgl-font-body)", fontSize: 16, fontWeight: 500, letterSpacing: "-0.03em", color: "#fff", whiteSpace: "nowrap" }}>
                  {c.ctaText}
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: 40, backgroundColor: "#fff", flexShrink: 0 }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8M8 4l3 3-3 3" stroke="var(--pgl-text,#000)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </span>
              </a>

              {/* Secondary CTA — outline pill */}
              {c.secondaryCtaText && (
                <a
                  href={c.secondaryCtaLink || "#"}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    height: 44,
                    padding: "8px 16px",
                    backgroundColor: "transparent",
                    border: "1px solid var(--pgl-text)",
                    borderRadius: 32,
                    textDecoration: "none",
                  }}
                  data-pgl-path="secondaryCtaText"
                  data-pgl-edit="button"
                >
                  <span style={{ fontFamily: "var(--pgl-font-body)", fontSize: 16, fontWeight: 500, letterSpacing: "-0.03em", color: "var(--pgl-text)", whiteSpace: "nowrap" }}>
                    {c.secondaryCtaText}
                  </span>
                </a>
              )}
            </div>
          </div>

          {/* Mockup / Image Area */}
          <div className="relative w-full md:w-[49%] h-[300px] md:h-[416px]" style={{ overflow: "visible", flexShrink: 0 }}>
            {c.backgroundImage ? (
              /* If image exists — show as single large rounded card */
              <div
                className="w-full h-full"
                style={{
                  borderRadius: "var(--pgl-radius, 20px)",
                  overflow: "hidden",
                  boxShadow: "-3px 15px 25px rgba(104,99,80,0.15)",
                  border: "2px solid rgba(255,255,255,1)",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.backgroundImage}
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  data-pgl-path="backgroundImage"
                  data-pgl-edit="image"
                />
              </div>
            ) : (
              /* No image — show skeleton cards */
              <>
                <div
                  className="absolute top-2 left-1 w-[85%] md:w-[460px] h-[240px] md:h-[340px]"
                  style={{
                    maxWidth: "100%",
                    backgroundColor: "var(--pgl-surface)",
                    border: "1px solid rgba(0,0,0,0.06)",
                    borderRadius: 20,
                    boxShadow: "-3px 15px 25px rgba(104,99,80,0.15)",
                    overflow: "hidden",
                    zIndex: 2,
                    transform: "rotate(2deg)",
                    padding: 24,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <div style={{ width: 120, height: 14, borderRadius: 8, backgroundColor: "rgba(0,0,0,0.08)" }} />
                    <div style={{ width: 80, height: 12, borderRadius: 6, backgroundColor: "rgba(0,0,0,0.05)" }} />
                  </div>
                  {[1, 2, 3].map(i => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 8px", borderRadius: 12, backgroundColor: i === 1 ? (tokens.palette.accent + "18") : "transparent", marginBottom: 4 }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", backgroundColor: "rgba(0,0,0,0.06)" }} />
                      <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
                        <div style={{ width: "60%", height: 10, borderRadius: 5, backgroundColor: "rgba(0,0,0,0.08)" }} />
                        <div style={{ width: "40%", height: 8, borderRadius: 4, backgroundColor: "rgba(0,0,0,0.04)" }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div
                  className="absolute w-[200px] md:w-[260px] h-[150px] md:h-[200px] bottom-[-10px] md:bottom-[-30px] right-0 md:right-[-10px]"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.95)",
                    border: "1px solid rgba(0,0,0,0.06)",
                    borderRadius: 20,
                    boxShadow: "0 4px 30px rgba(0,0,0,0.06)",
                    overflow: "hidden",
                    zIndex: 3,
                    transform: "rotate(-3deg)",
                    padding: 14,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <div style={{ width: 60, height: 7, borderRadius: 3, backgroundColor: "rgba(0,0,0,0.06)" }} />
                    <div style={{ padding: "2px 6px", borderRadius: 6, backgroundColor: tokens.palette.accent + "18" }}>
                      <span style={{ fontSize: 9, fontWeight: 500, color: tokens.palette.accent }}>+30%</span>
                    </div>
                  </div>
                  <div style={{ width: 80, height: 14, borderRadius: 5, backgroundColor: "rgba(0,0,0,0.08)", marginBottom: 10 }} />
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 60 }}>
                    {[45, 60, 40, 75, 55, 80, 50].map((h, i) => (
                      <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: 2, backgroundColor: i % 2 === 0 ? tokens.palette.accent + "44" : "rgba(0,0,0,0.06)" }} />
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Logo Marquee — editable brand list with infinite scroll */}
        {brands.length > 0 && (
          <div
            className="mt-12 md:mt-20 w-full"
            data-pgl-path="brands"
            data-pgl-edit="brands"
            style={{
              overflow: "hidden",
              mask: "linear-gradient(270deg, transparent 0%, black 10%, black 90%, transparent 100%)",
              WebkitMask: "linear-gradient(270deg, transparent 0%, black 10%, black 90%, transparent 100%)",
            }}
          >
            <div
              className="flex items-center gap-10"
              style={{
                animation: "aurora-marquee 25s linear infinite",
                width: "max-content",
              }}
            >
              {/* Duplicate for seamless loop */}
              {[...Array(2)].map((_, setIdx) => (
                <div key={setIdx} className="flex items-center gap-10 shrink-0">
                  {brands.map((brand, i) => (
                    <div
                      key={`${setIdx}-${i}`}
                      className="shrink-0 flex items-center gap-2"
                      style={{ opacity: 0.4, width: 145, height: 32 }}
                    >
                      {brand.logoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={brand.logoUrl}
                          alt={brand.name}
                          style={{ height: 24, width: "auto", objectFit: "contain" }}
                        />
                      ) : (
                        <div
                          style={{
                            width: 24,
                            height: 24,
                            borderRadius: 6,
                            backgroundColor: `${tokens.palette.primary}22`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <span style={{ fontSize: 12, fontWeight: 700, color: tokens.palette.primary + "55" }}>
                            {brand.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <span
                        style={{
                          fontFamily: "var(--pgl-font-body)",
                          fontSize: 14,
                          fontWeight: 500,
                          color: "var(--pgl-text)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {brand.name}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes aurora-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes aurora-fade-up {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </section>
  );
}
