"use client";

import type { DesignTokens } from "@/types/ai-generation";
import { ScrollReveal } from "./scroll-reveal";
import { StatsContentSchema } from "@/types/ai-generation";

interface Props {
  content: Record<string, unknown>;
  tokens: DesignTokens;
  isDark?: boolean;
}

export function GroviaIntegrations({ content, tokens }: Props) {
  const parsed = StatsContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const iconColors = [
    tokens.palette.primary,
    tokens.palette.accent,
    tokens.palette.secondary,
    "#0099ff",
    tokens.palette.primary,
    "#e83043",
    tokens.palette.accent,
    "#84e6f6",
    tokens.palette.secondary,
    "#f7a49e",
  ];

  const shapes = [
    <circle key="s0" cx="24" cy="24" r="16" fill={iconColors[0]} fillOpacity="0.7" />,
    <rect key="s1" x="8" y="8" width="32" height="32" rx="10" fill={iconColors[1]} fillOpacity="0.6" />,
    <path key="s2" d="M24 6L42 24L24 42L6 24Z" fill={iconColors[2]} fillOpacity="0.7" />,
    <circle key="s3" cx="24" cy="24" r="14" fill="none" stroke={iconColors[3]} strokeWidth="5" opacity="0.6" />,
    <path key="s4" d="M24 8L40 38H8Z" fill={iconColors[4]} fillOpacity="0.5" />,
    <><circle key="s5a" cx="16" cy="16" r="8" fill={iconColors[5]} fillOpacity="0.6" /><circle cx="32" cy="32" r="8" fill={iconColors[5]} fillOpacity="0.4" /></>,
    <rect key="s6" x="8" y="8" width="32" height="32" rx="10" fill={iconColors[6]} fillOpacity="0.6" />,
    <circle key="s7" cx="24" cy="24" r="16" fill={iconColors[7]} fillOpacity="0.7" />,
    <path key="s8" d="M24 6l5 12h13l-10 8 4 13-12-8-12 8 4-13L6 18h13z" fill={iconColors[8]} fillOpacity="0.5" />,
    <circle key="s9" cx="24" cy="24" r="14" fill="none" stroke={iconColors[9]} strokeWidth="5" opacity="0.6" />,
  ];

  return (
    <section id="stats" style={{ backgroundColor: "var(--pgl-background)" }}>
      {/* Container — column on mobile, row on desktop */}
      <div
        className="flex flex-col md:flex-row px-6 py-12 md:px-[80px] md:py-[80px] gap-10 md:gap-10 items-start md:justify-between md:items-center"
        style={{ maxWidth: 1200, margin: "0 auto" }}
      >
        {/* Left column */}
        <div
          className="w-full md:w-[41%] md:max-w-[600px]"
          style={{ display: "flex", flexDirection: "column", gap: 48, flexShrink: 0 }}
        >
          {/* Heading block */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
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
              {(c.title || "").split(/\*([^*]+)\*/).map((part, i) =>
                i % 2 === 1 ? (
                  <span key={i} style={{ color: tokens.palette.accent }}>{part}</span>
                ) : (
                  <span key={i}>{part}</span>
                )
              )}
            </h2>

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
              data-pgl-path="items.0.label"
              data-pgl-edit="text"
            >
              {c.items[0]?.label || ""}
            </p>
          </div>

          {/* Divider + symbols */}
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            {[0, 1, 2, 3, 4].map(i => (
              <svg key={i} width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 3v10M3 8h10" stroke="rgba(0,0,0,0.15)" strokeWidth="1" strokeLinecap="round" />
              </svg>
            ))}
          </div>

          {/* Numbered steps */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: 16 }}
            data-pgl-path="items"
            data-pgl-edit="list"
          >
            {c.items.map((item, idx) => (
              <div key={idx} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span
                  style={{
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    width: 28, height: 28, borderRadius: "50%",
                    backgroundColor: tokens.palette.primary + "11",
                    fontFamily: "var(--pgl-font-heading)", fontSize: 12, fontWeight: 500,
                    letterSpacing: "-0.03em", color: "var(--pgl-text)", flexShrink: 0,
                  }}
                >
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <span
                  style={{ fontFamily: "var(--pgl-font-body)", fontSize: 18, fontWeight: 400, letterSpacing: "-0.03em", color: "var(--pgl-text-muted)" }}
                  data-pgl-path={`items.${idx}.label`}
                  data-pgl-edit="text"
                >
                  {item.label}
                </span>
                {item.value && (
                  <span
                    style={{ fontFamily: "var(--pgl-font-heading)", fontSize: 14, fontWeight: 600, letterSpacing: "-0.03em", color: "var(--pgl-text)" }}
                    data-pgl-path={`items.${idx}.value`}
                    data-pgl-edit="text"
                  >
                    {item.value}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right — logo grid with gradient mask */}
        <div
          className="w-full md:w-[50%] md:max-w-[500px]"
          style={{ position: "relative", height: 420, overflow: "hidden", flexShrink: 0 }}
        >
          {/* Gradient mask — fade top and bottom */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 2,
              pointerEvents: "none",
              background: "linear-gradient(180deg, var(--pgl-background) 0%, transparent 15%, transparent 85%, var(--pgl-background) 100%)",
            }}
          />

          {/* 2-column vertical scrolling logo grid */}
          <div className="flex gap-3" style={{ height: 420 }}>
            {/* Column 1 — scrolls up */}
            <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
              <div
                style={{
                  position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
                  background: "linear-gradient(180deg, var(--pgl-background) 0%, transparent 15%, transparent 85%, var(--pgl-background) 100%)",
                }}
              />
              <div style={{ animation: "aurora-scroll-up 20s linear infinite", display: "flex", flexDirection: "column", gap: 12 }}>
                {[...Array(2)].map((_, setIdx) => (
                  <div key={setIdx} className="flex flex-col gap-3">
                    {c.items.map((item, i) => (
                      <div
                        key={`${setIdx}-${i}`}
                        data-pgl-path={`items.${i}.image`}
                        data-pgl-edit="image"
                        style={{
                          display: "flex", alignItems: "center", justifyContent: "center",
                          flexDirection: "column", gap: 8,
                          backgroundColor: "var(--pgl-surface)", borderRadius: 20,
                          padding: 20, aspectRatio: "1",
                          overflow: "hidden",
                          position: "relative",
                        }}
                      >
                        {item.image ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={item.image}
                            alt={item.value}
                            style={{
                              position: "absolute", inset: 0,
                              width: "100%", height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <>
                            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                              {shapes[i % shapes.length]}
                            </svg>
                            <span
                              data-pgl-path={`items.${i}.value`}
                              data-pgl-edit="text"
                              style={{
                                fontFamily: "var(--pgl-font-body)",
                                fontSize: 12,
                                fontWeight: 500,
                                letterSpacing: "-0.03em",
                                color: "var(--pgl-text)",
                                opacity: 0.6,
                                textAlign: "center",
                              }}
                            >
                              {item.value}
                            </span>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2 — scrolls down (offset), reversed items */}
            <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
              <div
                style={{
                  position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
                  background: "linear-gradient(180deg, var(--pgl-background) 0%, transparent 15%, transparent 85%, var(--pgl-background) 100%)",
                }}
              />
              <div style={{ animation: "aurora-scroll-down 22s linear infinite", display: "flex", flexDirection: "column", gap: 12 }}>
                {[...Array(2)].map((_, setIdx) => (
                  <div key={setIdx} className="flex flex-col gap-3">
                    {[...c.items].reverse().map((item, i) => {
                      const origIdx = c.items.length - 1 - i;
                      return (
                        <div
                          key={`${setIdx}-${i}`}
                          data-pgl-path={`items.${origIdx}.image`}
                          data-pgl-edit="image"
                          style={{
                            display: "flex", alignItems: "center", justifyContent: "center",
                            flexDirection: "column", gap: 8,
                            backgroundColor: "var(--pgl-surface)", borderRadius: 20,
                            padding: 20, aspectRatio: "1",
                            overflow: "hidden",
                            position: "relative",
                          }}
                        >
                          {item.image ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={item.image}
                              alt={item.value}
                              style={{
                                position: "absolute", inset: 0,
                                width: "100%", height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          ) : (
                            <>
                              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                                {shapes[(origIdx + 5) % shapes.length]}
                              </svg>
                              <span
                                data-pgl-path={`items.${origIdx}.value`}
                                data-pgl-edit="text"
                                style={{
                                  fontFamily: "var(--pgl-font-body)",
                                  fontSize: 12,
                                  fontWeight: 500,
                                  letterSpacing: "-0.03em",
                                  color: "var(--pgl-text)",
                                  opacity: 0.6,
                                  textAlign: "center",
                                }}
                              >
                                {item.value}
                              </span>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes aurora-scroll-up {
              0% { transform: translateY(0); }
              100% { transform: translateY(-50%); }
            }
            @keyframes aurora-scroll-down {
              0% { transform: translateY(-50%); }
              100% { transform: translateY(0); }
            }
          `}} />
        </div>
      </div>
    </section>
  );
}
