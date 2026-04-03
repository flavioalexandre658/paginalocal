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

export function BellezzaBestsellers({ content, tokens }: Props) {
  const parsed = FeaturedProductsContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const accent = tokens.palette.accent;
  const primary = tokens.palette.primary;

  return (
    <section
      id="bestsellers"
      style={{
        backgroundColor: "var(--pgl-background)",
        overflow: "hidden",
      }}
    >
      <div
        className="px-5 md:px-16 py-16 md:py-[100px]"
        style={{ maxWidth: 1440, margin: "0 auto" }}
      >
        {/* ═══ Title ═══ */}
        <ScrollReveal delay={0}>
          <h2
            style={{
              fontFamily: "var(--pgl-font-heading), serif",
              fontSize: "clamp(32px, 4vw, 52px)",
              fontWeight: 500,
              letterSpacing: "0em",
              lineHeight: "1.2em",
              color: primary,
              textAlign: "center",
              textTransform: "capitalize",
              margin: 0,
              marginBottom: 16,
            }}
            data-pgl-path="title"
            data-pgl-edit="text"
          >
            {renderAccentText(c.title, accent)}
          </h2>
        </ScrollReveal>

        {c.subtitle && (
          <ScrollReveal delay={80}>
            <p
              style={{
                fontFamily: "var(--pgl-font-body), sans-serif",
                fontSize: 16,
                fontWeight: 400,
                lineHeight: "1.4em",
                color: "var(--pgl-text-muted)",
                textAlign: "center",
                margin: 0,
                marginBottom: 48,
                maxWidth: 560,
                marginLeft: "auto",
                marginRight: "auto",
              }}
              data-pgl-path="subtitle"
              data-pgl-edit="text"
            >
              {c.subtitle}
            </p>
          </ScrollReveal>
        )}

        {/* ═══ Product grid — 3-4 columns ═══ */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          style={{ gap: 24, marginTop: c.subtitle ? 0 : 48 }}
        >
          {c.items.map((item, idx) => (
            <ScrollReveal key={idx} delay={100 + idx * 80}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  backgroundColor: "#fff",
                  borderRadius: 16,
                  overflow: "hidden",
                  transition: "box-shadow 0.35s ease, transform 0.35s ease",
                  cursor: "pointer",
                  height: "100%",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.10)";
                  e.currentTarget.style.transform = "translateY(-6px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {/* Image container */}
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
                        transition: "transform 0.5s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "scale(1.05)";
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
                      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
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
                        top: 12,
                        left: 12,
                        fontFamily: "var(--pgl-font-body), sans-serif",
                        fontSize: 12,
                        fontWeight: 500,
                        letterSpacing: "0.04em",
                        color: "#fff",
                        backgroundColor: accent,
                        borderRadius: 40,
                        padding: "5px 14px",
                        textTransform: "uppercase",
                      }}
                      data-pgl-path={`items.${idx}.badge`}
                      data-pgl-edit="text"
                    >
                      {item.badge}
                    </span>
                  )}

                  {/* Quick-view icon overlay */}
                  <div
                    style={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      width: 38,
                      height: 38,
                      borderRadius: 38,
                      backgroundColor: primary,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      opacity: 0,
                      transition: "opacity 0.3s ease",
                      pointerEvents: "none",
                    }}
                    className="group-hover:opacity-100"
                  >
                    <svg width="18" height="18" viewBox="0 0 256 256" fill="none">
                      <path d="M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,168a40,40,0,1,1,40-40A40,40,0,0,1,128,168Z" fill="#fff" />
                    </svg>
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: "16px 16px 12px", display: "flex", flexDirection: "column", gap: 6 }}>
                  {/* Category tag */}
                  {item.description && (
                    <span
                      style={{
                        fontFamily: "var(--pgl-font-body), sans-serif",
                        fontSize: 12,
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

                  {/* Product name */}
                  <h3
                    style={{
                      fontFamily: "var(--pgl-font-body), sans-serif",
                      fontSize: 15,
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
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2 }}>
                      <span
                        style={{
                          fontFamily: "var(--pgl-font-body), sans-serif",
                          fontSize: 14,
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
                            fontSize: 13,
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
