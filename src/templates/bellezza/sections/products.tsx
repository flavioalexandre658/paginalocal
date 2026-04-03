"use client";

import type { DesignTokens } from "@/types/ai-generation";
import { FeaturedProductsContentSchema } from "@/types/ai-generation";
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

export function BellezzaProducts({ content, tokens }: Props) {
  const parsed = FeaturedProductsContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const accent = tokens.palette.accent;
  const primary = tokens.palette.primary;

  return (
    <section
      id="products"
      style={{
        backgroundColor: "var(--pgl-background)",
        overflow: "hidden",
      }}
    >
      <div
        className="px-5 md:px-16 py-16 md:py-[100px]"
        style={{ maxWidth: 1440, margin: "0 auto" }}
      >
        {/* ═══ Header row: title + CTA ═══ */}
        <div
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{ marginBottom: 48 }}
        >
          <ScrollReveal delay={0}>
            <h2
              style={{
                fontFamily: "var(--pgl-font-heading), serif",
                fontSize: "clamp(32px, 4vw, 52px)",
                fontWeight: 500,
                letterSpacing: "0em",
                lineHeight: "1.2em",
                color: primary,
                textTransform: "capitalize",
                margin: 0,
              }}
              data-pgl-path="title"
              data-pgl-edit="text"
            >
              {renderAccentText(c.title, accent)}
            </h2>
          </ScrollReveal>

          {/* Show More pill button */}
          <ScrollReveal delay={100}>
            <a
              href="#contato"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                fontFamily: "var(--pgl-font-body), sans-serif",
                fontSize: 14,
                fontWeight: 500,
                color: "#fff",
                backgroundColor: primary,
                borderRadius: 70,
                padding: "12px 28px",
                height: 40,
                textDecoration: "none",
                whiteSpace: "nowrap",
                transition: "background-color 0.3s ease, transform 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = accent;
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = primary;
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <span>Ver Mais</span>
              <svg width="16" height="16" viewBox="0 0 256 256" fill="none">
                <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z" fill="currentColor" />
              </svg>
            </a>
          </ScrollReveal>
        </div>

        {/* ═══ Product grid — 4 columns ═══ */}
        <div
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
          style={{ gap: 20 }}
        >
          {c.items.map((item, idx) => (
            <ScrollReveal key={idx} delay={80 + idx * 60}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  backgroundColor: "#fff",
                  borderRadius: 16,
                  overflow: "hidden",
                  transition: "box-shadow 0.3s ease, transform 0.3s ease",
                  cursor: "pointer",
                  height: "100%",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.08)";
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {/* Image */}
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "4 / 5",
                    borderRadius: 16,
                    overflow: "hidden",
                    backgroundColor: "#f5f3f0",
                  }}
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      data-pgl-path={`items.${idx}.image`}
                      data-pgl-edit="image"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.45s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "scale(1.04)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <svg width="40" height="40" viewBox="0 0 48 48" fill="none">
                        <rect x="8" y="12" width="32" height="24" rx="4" stroke={accent} strokeWidth="1.5" />
                        <circle cx="18" cy="22" r="3" stroke={accent} strokeWidth="1.5" />
                        <path d="M8 30l10-8 6 5 8-6 8 6" stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  )}

                  {/* Badge */}
                  {item.badge && (
                    <span
                      style={{
                        position: "absolute",
                        top: 10,
                        left: 10,
                        fontFamily: "var(--pgl-font-body), sans-serif",
                        fontSize: 11,
                        fontWeight: 500,
                        letterSpacing: "0.04em",
                        color: "#fff",
                        backgroundColor: accent,
                        borderRadius: 40,
                        padding: "4px 12px",
                        textTransform: "uppercase",
                      }}
                      data-pgl-path={`items.${idx}.badge`}
                      data-pgl-edit="text"
                    >
                      {item.badge}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div style={{ padding: "14px 14px 10px", display: "flex", flexDirection: "column", gap: 4 }}>
                  {/* Category */}
                  {item.description && (
                    <span
                      style={{
                        fontFamily: "var(--pgl-font-body), sans-serif",
                        fontSize: 11,
                        fontWeight: 400,
                        color: "var(--pgl-text-muted)",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                      data-pgl-path={`items.${idx}.description`}
                      data-pgl-edit="text"
                    >
                      {item.description}
                    </span>
                  )}

                  {/* Name */}
                  <h3
                    style={{
                      fontFamily: "var(--pgl-font-body), sans-serif",
                      fontSize: 14,
                      fontWeight: 500,
                      lineHeight: "1.3em",
                      color: primary,
                      margin: 0,
                    }}
                    data-pgl-path={`items.${idx}.name`}
                    data-pgl-edit="text"
                  >
                    {item.name}
                  </h3>

                  {/* Price */}
                  {item.price && (
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 1 }}>
                      <span
                        style={{
                          fontFamily: "var(--pgl-font-body), sans-serif",
                          fontSize: 13,
                          fontWeight: 500,
                          color: primary,
                        }}
                        data-pgl-path={`items.${idx}.price`}
                        data-pgl-edit="text"
                      >
                        {item.price}
                      </span>
                      {item.originalPrice && (
                        <span
                          style={{
                            fontFamily: "var(--pgl-font-body), sans-serif",
                            fontSize: 12,
                            fontWeight: 400,
                            color: "var(--pgl-text-muted)",
                            textDecoration: "line-through",
                          }}
                          data-pgl-path={`items.${idx}.originalPrice`}
                          data-pgl-edit="text"
                        >
                          {item.originalPrice}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
