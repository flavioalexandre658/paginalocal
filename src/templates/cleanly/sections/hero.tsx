"use client";

import type { DesignTokens } from "@/types/ai-generation";
import { HeroContentSchema } from "@/types/ai-generation";
import { ScrollReveal } from "./scroll-reveal";

interface Props {
  content: Record<string, unknown>;
  tokens: DesignTokens;
  isDark?: boolean;
}

function renderAccentText(text: string, accentColor: string) {
  return text.split(/\*([^*]+)\*/).map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} style={{ color: accentColor }}>
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

function StarIcon({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={color}>
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );
}

function AvatarGroup() {
  const avatarStyle = (index: number): React.CSSProperties => ({
    width: 36,
    height: 36,
    borderRadius: "50%",
    border: "2px solid rgba(255,255,255,0.3)",
    backgroundColor: "rgba(255,255,255,0.15)",
    marginLeft: index > 0 ? -10 : 0,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    position: "relative",
    zIndex: 3 - index,
  });

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={avatarStyle(i)}>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="rgba(255,255,255,0.4)"
          >
            <circle cx="12" cy="8" r="4" />
            <path d="M12 14c-6 0-8 3-8 5v1h16v-1c0-2-2-5-8-5z" />
          </svg>
        </div>
      ))}
    </div>
  );
}

export function CleanlyHero({ content, tokens }: Props) {
  const parsed = HeroContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const accent = tokens.palette.accent;

  return (
    <header
      style={{
        backgroundColor: "var(--pgl-text, rgb(23,18,6))",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
        <div
          className="flex flex-col md:flex-row"
          style={{
            minHeight: 640,
            position: "relative",
          }}
        >
          {/* ═══ Left column: content ═══ */}
          <div
            className="flex-1 flex flex-col justify-center py-16 md:py-24"
            style={{
              zIndex: 2,
              maxWidth: 640,
            }}
          >
            {/* Social proof: avatars + star rating */}
            <ScrollReveal>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  marginBottom: 32,
                }}
              >
                <AvatarGroup />

                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ display: "flex", gap: 2 }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <StarIcon key={i} color={accent} />
                    ))}
                  </div>
                  <span
                    style={{
                      fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#fff",
                    }}
                  >
                    4.7
                  </span>
                </div>

                {c.tagline && (
                  <span
                    style={{
                      fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                      fontSize: 13,
                      fontWeight: 400,
                      color: "rgba(255,255,255,0.6)",
                    }}
                    data-pgl-path="tagline"
                    data-pgl-edit="text"
                  >
                    {c.tagline}
                  </span>
                )}
              </div>
            </ScrollReveal>

            {/* H1 + subtitle */}
            <ScrollReveal delay={100}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 20,
                  marginBottom: 36,
                }}
              >
                <h1
                  style={{
                    fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                    fontSize: "clamp(36px, 5.5vw, 72px)",
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                    lineHeight: 1.05,
                    color: "#fff",
                    margin: 0,
                  }}
                  data-pgl-path="headline"
                  data-pgl-edit="text"
                >
                  {renderAccentText(c.headline, accent)}
                </h1>

                {c.subheadline && (
                  <p
                    style={{
                      fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                      fontSize: "clamp(15px, 1.4vw, 18px)",
                      fontWeight: 400,
                      lineHeight: 1.65,
                      color: "rgba(255,255,255,0.65)",
                      margin: 0,
                      maxWidth: 480,
                    }}
                    data-pgl-path="subheadline"
                    data-pgl-edit="text"
                  >
                    {c.subheadline}
                  </p>
                )}
              </div>
            </ScrollReveal>

            {/* CTA button */}
            <ScrollReveal delay={200}>
              {c.ctaText && (
                <a
                  href={c.ctaLink || "#"}
                  data-pgl-path="ctaText"
                  data-pgl-edit="button"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                    height: 56,
                    padding: "0 8px 0 28px",
                    backgroundColor: accent,
                    borderRadius: 1000,
                    textDecoration: "none",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                      fontSize: 15,
                      fontWeight: 600,
                      color: "var(--pgl-text)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {c.ctaText}
                  </span>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 40,
                      height: 40,
                      borderRadius: 1000,
                      backgroundColor: "rgba(0,0,0,0.15)",
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--pgl-text)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </span>
                </a>
              )}
            </ScrollReveal>
          </div>

          {/* ═══ Right column: hero image (desktop) ═══ */}
          <div
            className="hidden md:flex"
            style={{
              flex: "0 0 48%",
              position: "relative",
              alignItems: "stretch",
            }}
            data-pgl-path="backgroundImage"
            data-pgl-edit="image"
          >
            {/* Gradient overlay that blends image into dark bg */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                bottom: 0,
                width: 120,
                background:
                  "linear-gradient(to right, var(--pgl-background) 0%, transparent 100%)",
                zIndex: 1,
                pointerEvents: "none",
              }}
            />
            {c.backgroundImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={c.backgroundImage}
                alt=""
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                  minHeight: 540,
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  minHeight: 540,
                  background:
                    "linear-gradient(160deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>
            )}
          </div>

          {/* ═══ Mobile: image below text ═══ */}
          <div
            className="md:hidden"
            style={{ paddingBottom: 24 }}
            data-pgl-path="backgroundImage"
            data-pgl-edit="image"
          >
            <div
              style={{
                borderRadius: 16,
                overflow: "hidden",
                height: 300,
              }}
            >
              {c.backgroundImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={c.backgroundImage}
                  alt=""
                  style={{
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
                    background:
                      "linear-gradient(160deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
