"use client";

import type { DesignTokens } from "@/types/ai-generation";
import { GalleryContentSchema } from "@/types/ai-generation";
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

function GalleryCard({
  url,
  caption,
  idx,
  accent,
}: {
  url?: string;
  caption?: string;
  idx: number;
  accent: string;
}) {
  return (
    <div
      style={{
        borderRadius: 15,
        overflow: "hidden",
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: 280,
      }}
    >
      {/* Image via background on container */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: url ? `url(${url})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: url ? undefined : "rgba(255,255,255,0.06)",
          transition: "transform 0.5s ease",
        }}
        data-pgl-path={`images.${idx}.url`}
        data-pgl-edit="image"
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
        }}
      />

      {/* Placeholder when no image */}
      {!url && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: `linear-gradient(135deg, rgba(14,18,1,0.3), ${accent}11)`,
          }}
        >
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" opacity="0.25">
            <rect x="6" y="6" width="36" height="36" rx="6" stroke="#fff" strokeWidth="2" />
            <circle cx="18" cy="18" r="4" stroke="#fff" strokeWidth="2" />
            <path d="M6 34l12-9 8 6 16-12" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      )}

      {/* Dark gradient overlay at bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "45%",
          zIndex: 1,
          background: "linear-gradient(180deg, transparent 0%, rgba(14,18,1,0.8) 100%)",
          borderBottomLeftRadius: 15,
          borderBottomRightRadius: 15,
        }}
      />

      {/* Caption overlay */}
      {caption && (
        <div style={{ position: "absolute", bottom: 20, left: 20, right: 20, zIndex: 2 }}>
          <span
            style={{
              fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
              fontSize: 18,
              fontWeight: 600,
              letterSpacing: "-0.01em",
              lineHeight: "1.3em",
              color: "#fff",
            }}
            data-pgl-path={`images.${idx}.caption`}
            data-pgl-edit="text"
          >
            {caption}
          </span>
        </div>
      )}
    </div>
  );
}

export function RooforaGallery({ content, tokens }: Props) {
  const parsed = GalleryContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const accent = tokens.palette.accent || "#CDF660";
  const primary = tokens.palette.primary || "#0E1201";
  const images = c.images || [];

  return (
    <section
      id="gallery"
      style={{ backgroundColor: "var(--pgl-background)", overflow: "hidden" }}
    >
      <div
        className="px-5 md:px-[30px] py-16 md:py-[100px]"
        style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        {/* ═══ Header ═══ */}
        <div
          className="flex flex-col md:flex-row md:items-end md:justify-between w-full"
          style={{ maxWidth: 1296, marginBottom: 56, gap: 24 }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 560 }}>
            {c.subtitle && (
              <ScrollReveal delay={0}>
                <p
                  style={{
                    fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                    fontSize: 14,
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    lineHeight: "1.7em",
                    color: accent,
                    margin: 0,
                    textTransform: "uppercase",
                  }}
                  data-pgl-path="subtitle"
                  data-pgl-edit="text"
                >
                  {c.subtitle}
                </p>
              </ScrollReveal>
            )}
            <ScrollReveal delay={100}>
              <h2
                style={{
                  fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                  fontSize: "clamp(28px, 4vw, 42px)",
                  fontWeight: 600,
                  letterSpacing: "-0.04em",
                  lineHeight: "1.15em",
                  color: "var(--pgl-text)",
                  margin: 0,
                }}
                data-pgl-path="title"
                data-pgl-edit="text"
              >
                {renderAccentText(c.title, accent)}
              </h2>
            </ScrollReveal>
          </div>

          {/* CTA button */}
          <ScrollReveal delay={200}>
            <a
              href="#contato"
              data-pgl-path="cta"
              data-pgl-edit="button"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                padding: "14px 28px",
                backgroundColor: accent,
                borderRadius: 100,
                textDecoration: "none",
                transition: "opacity 0.2s, transform 0.2s",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.9";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <span
                style={{
                  fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                  fontSize: 16,
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                  color: primary,
                }}
              >
                Ver Todos
              </span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                <path d="M3 8h10M9 4l4 4-4 4" stroke={primary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </ScrollReveal>
        </div>

        {/* ═══ Desktop Grid — 3 cols ═══ */}
        <div
          className="hidden md:grid w-full"
          style={{
            maxWidth: 1296,
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 20,
          }}
        >
          {images.map((img, idx) => (
            <div key={idx} style={{ height: idx === 0 || idx === 3 ? 380 : 320 }}>
              <ScrollReveal delay={idx * 100}>
                <GalleryCard
                  url={img.url}
                  caption={img.caption}
                  idx={idx}
                  accent={accent}
                />
              </ScrollReveal>
            </div>
          ))}
        </div>

        {/* ═══ Mobile — stacked ═══ */}
        <div className="md:hidden grid grid-cols-1 gap-4 w-full">
          {images.map((img, idx) => (
            <div key={idx} style={{ height: 240 }}>
              <ScrollReveal delay={idx * 80}>
                <GalleryCard
                  url={img.url}
                  caption={img.caption}
                  idx={idx}
                  accent={accent}
                />
              </ScrollReveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
