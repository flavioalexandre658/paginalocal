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
      <span key={i} style={{ color: accentColor }}>
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

/* ── SVG Icons ── */

function LocationIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flexShrink: 0 }}
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function BedIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 4v16" />
      <path d="M2 8h18a2 2 0 0 1 2 2v10" />
      <path d="M2 17h20" />
      <path d="M6 8v9" />
    </svg>
  );
}

function BathIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 12h16a1 1 0 0 1 1 1v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-3a1 1 0 0 1 1-1z" />
      <path d="M6 12V5a2 2 0 0 1 2-2h3v2.25" />
    </svg>
  );
}

function AreaIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18" />
      <path d="M9 21V9" />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  );
}

const DETAIL_ICONS = [BedIcon, BathIcon, AreaIcon];

export function RealesticProperties({ content, tokens }: Props) {
  const parsed = ServicesContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const accent = tokens.palette.accent;

  // Extra fields not in ServicesContentSchema
  const ctaText = (content.ctaText as string) || "";
  const ctaLink = (content.ctaLink as string) || "#";

  // Raw items for badge / details fields
  const rawItems = (content.items as Array<Record<string, unknown>>) || [];

  return (
    <section
      id="properties"
      style={{
        backgroundColor: "var(--pgl-background)",
        padding: "48px 0",
      }}
    >
      {/* Container */}
      <div
        className="px-[25px]"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 64,
        }}
      >
        {/* ═══ Header Area ═══ */}
        <ScrollReveal delay={0}>
          <div
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 md:gap-8"
          >
            {/* Left — Text Wrap */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16, flex: 1 }}>
              {/* Section tag: accent dot + label */}
              {c.subtitle && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 9,
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: accent,
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                      fontSize: 17,
                      fontWeight: 500,
                      letterSpacing: "-0.03em",
                      lineHeight: "1em",
                      color: "var(--pgl-text)",
                    }}
                    data-pgl-path="subtitle"
                    data-pgl-edit="text"
                  >
                    {c.subtitle}
                  </span>
                </div>
              )}

              {/* H2 Title */}
              <h2
                style={{
                  fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                  fontSize: "clamp(32px, 4vw, 46px)",
                  fontWeight: 500,
                  letterSpacing: "-0.03em",
                  lineHeight: "1.15em",
                  color: "var(--pgl-text)",
                  margin: 0,
                }}
                data-pgl-path="title"
                data-pgl-edit="text"
              >
                {renderAccentText(c.title, accent)}
              </h2>
            </div>

            {/* Right — CTA button */}
            {ctaText && (
              <a
                href={ctaLink}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                  fontSize: 16,
                  fontWeight: 500,
                  letterSpacing: "-0.03em",
                  lineHeight: "1em",
                  color: "#fff",
                  backgroundColor: "var(--pgl-text)",
                  borderRadius: 1000,
                  padding: "14px 26px",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  transition: "opacity 0.2s ease",
                }}
                data-pgl-path="ctaText"
                data-pgl-edit="button"
              >
                {ctaText}
              </a>
            )}
          </div>
        </ScrollReveal>

        {/* ═══ Property Grid ═══ */}
        <div
          className="grid grid-cols-1 md:grid-cols-3"
          style={{ gap: 16 }}
        >
          {c.items.slice(0, 6).map((item, idx) => {
            const rawItem = rawItems[idx] || {};
            const badge = (rawItem.badge as string) || "";
            const details = (rawItem.details as string) || "";
            const detailParts = details
              ? details.split(/\s*[·•|]\s*/).filter(Boolean)
              : [];

            return (
              <ScrollReveal key={idx} delay={idx * 100}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 24,
                    paddingBottom: 24,
                  }}
                >
                  {/* ── Image Box ── */}
                  <div
                    className="h-[260px] md:h-[320px]"
                    style={{
                      borderRadius: 21,
                      overflow: "hidden",
                      position: "relative",
                      boxShadow:
                        "rgba(14,14,14,0.04) 0px 1px 1px 0px, rgba(211,211,211,0.06) 0px 4px 4px 0px",
                    }}
                    data-pgl-path={`items.${idx}.image`}
                    data-pgl-edit="image"
                  >
                    {item.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.image}
                        alt={item.name}
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
                          backgroundColor: accent + "12",
                        }}
                      />
                    )}

                    {/* Badge on image */}
                    {badge && (
                      <div
                        style={{
                          position: "absolute",
                          bottom: 18,
                          left: 18,
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 6,
                          backgroundColor: accent,
                          borderRadius: 30,
                          padding: "7px 14px",
                        }}
                      >
                        <TagIcon />
                        <span
                          style={{
                            fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                            fontSize: 14,
                            fontWeight: 500,
                            letterSpacing: "-0.03em",
                            color: "#fff",
                          }}
                          data-pgl-path={`items.${idx}.badge`}
                          data-pgl-edit="text"
                        >
                          {badge}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* ── Content Wrapper ── */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {/* Location row */}
                    {item.description && (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 8,
                          color: "var(--pgl-text-muted)",
                        }}
                      >
                        <LocationIcon />
                        <span
                          style={{
                            fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                            fontSize: 14,
                            fontWeight: 500,
                            letterSpacing: "-0.01em",
                            color: "var(--pgl-text-muted)",
                          }}
                          data-pgl-path={`items.${idx}.description`}
                          data-pgl-edit="text"
                        >
                          {item.description}
                        </span>
                      </div>
                    )}

                    {/* Property name */}
                    <h3
                      style={{
                        fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                        fontSize: 24,
                        fontWeight: 500,
                        letterSpacing: "-0.02em",
                        lineHeight: "1.5em",
                        color: "var(--pgl-text)",
                        margin: 0,
                      }}
                      data-pgl-path={`items.${idx}.name`}
                      data-pgl-edit="text"
                    >
                      {item.name}
                    </h3>

                    {/* Details row */}
                    {detailParts.length > 0 && (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 12,
                          opacity: 0.45,
                        }}
                      >
                        {detailParts.map((part, di) => {
                          const Icon = DETAIL_ICONS[di] || DETAIL_ICONS[0];
                          return (
                            <div key={di} style={{ display: "contents" }}>
                              {di > 0 && (
                                <div
                                  style={{
                                    width: 1,
                                    height: 14,
                                    backgroundColor: "rgba(0,0,0,0.42)",
                                    borderRadius: 1000,
                                    opacity: 0.5,
                                  }}
                                />
                              )}
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  alignItems: "center",
                                  gap: 6,
                                  color: "var(--pgl-text)",
                                }}
                              >
                                <Icon />
                                <span
                                  style={{
                                    fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                                    fontSize: 14,
                                    fontWeight: 500,
                                    letterSpacing: "-0.02em",
                                    color: "var(--pgl-text)",
                                  }}
                                >
                                  {part}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Fallback: render details as single text if no separator found */}
                    {details && detailParts.length === 0 && (
                      <p
                        style={{
                          fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                          fontSize: 14,
                          fontWeight: 500,
                          letterSpacing: "-0.02em",
                          color: "var(--pgl-text)",
                          opacity: 0.45,
                          margin: 0,
                        }}
                        data-pgl-path={`items.${idx}.details`}
                        data-pgl-edit="text"
                      >
                        {details}
                      </p>
                    )}
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
