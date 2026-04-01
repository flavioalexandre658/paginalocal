"use client";

import type { DesignTokens } from "@/types/ai-generation";
import { GalleryContentSchema } from "@/types/ai-generation";
import { ScrollReveal } from "./scroll-reveal";

function renderAccentText(text: string, accentColor: string) {
  return text.split(/\*([^*]+)\*/).map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} style={{ color: accentColor }}>{part}</span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

interface Props {
  content: Record<string, unknown>;
  tokens: DesignTokens;
  isDark?: boolean;
}

function GalleryCard({
  url,
  caption,
  idx,
  accent,
  primary,
  tall,
}: {
  url?: string;
  caption?: string;
  idx: number;
  accent: string;
  primary: string;
  tall?: boolean;
}) {
  return (
    <div
      style={{
        borderRadius: 24,
        overflow: "hidden",
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: tall ? 400 : 180,
      }}
      data-pgl-path={`images.${idx}.url`}
      data-pgl-edit="image"
    >
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt={caption || ""}
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            position: "absolute",
            inset: 0,
          }}
        />
      ) : (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(135deg, ${primary}22, ${accent}11, ${primary}15)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" opacity="0.2">
            <rect x="6" y="6" width="36" height="36" rx="6" stroke={primary} strokeWidth="2" />
            <circle cx="18" cy="18" r="4" stroke={primary} strokeWidth="2" />
            <path d="M6 34l12-9 8 6 16-12" stroke={primary} strokeWidth="2" strokeLinecap="round" />
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
          height: "40%",
          zIndex: 1,
          background: "linear-gradient(180deg, transparent 0%, rgba(47,34,29,0.75) 100%)",
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
        }}
      />

      {/* Caption */}
      {caption && (
        <div style={{ position: "absolute", bottom: 24, left: 24, right: 24, zIndex: 2 }}>
          <span
            style={{
              fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: "0px",
              lineHeight: "1.4em",
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

export function PlumbflowGallery({ content, tokens }: Props) {
  const parsed = GalleryContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const accent = tokens.palette.accent;
  const primary = tokens.palette.primary;

  const images = c.images || [];
  // Bento: [0] = tall (col 1, row-span 2), [1-2] = top right, [3-4] = bottom right

  return (
    <section
      id="gallery"
      style={{ backgroundColor: "var(--pgl-background)", overflow: "hidden" }}
    >
      <div
        className="px-5 md:px-[30px] py-16 md:py-[120px]"
        style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        {/* ═══ Header ═══ */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
            marginBottom: 56,
            textAlign: "center",
            maxWidth: 560,
          }}
        >
          {c.subtitle && (
            <ScrollReveal delay={0}>
              <p
                style={{
                  fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                  fontSize: 16,
                  fontWeight: 700,
                  letterSpacing: "0.3px",
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
                fontWeight: 700,
                letterSpacing: "-1.5px",
                lineHeight: "1.2em",
                color: primary,
                margin: 0,
              }}
              data-pgl-path="title"
              data-pgl-edit="text"
            >
              {renderAccentText(c.title, accent)}
            </h2>
          </ScrollReveal>
        </div>

        {/* ═══ Bento Grid — desktop: 3 cols, first item spans 2 rows ═══ */}

        {/* Desktop layout */}
        <div
          className="hidden md:grid w-full"
          style={{
            maxWidth: 1296,
            gridTemplateColumns: "1fr 1fr 1fr",
            gridTemplateRows: "1fr 1fr",
            gap: 24,
            height: 672,
          }}
        >
          {/* Tall card — col 1, spans both rows */}
          {images[0] && (
            <div style={{ gridColumn: "1", gridRow: "1 / 3", height: "100%" }}>
              <ScrollReveal delay={0 * 100}>
                <GalleryCard
                  url={images[0].url}
                  caption={images[0].caption}
                  idx={0}
                  accent={accent}
                  primary={primary}
                  tall
                />
              </ScrollReveal>
            </div>
          )}

          {/* Top-right cards */}
          {images[1] && (
            <div style={{ gridColumn: "2", gridRow: "1", height: "100%" }}>
              <ScrollReveal delay={1 * 100}>
                <GalleryCard url={images[1].url} caption={images[1].caption} idx={1} accent={accent} primary={primary} />
              </ScrollReveal>
            </div>
          )}
          {images[2] && (
            <div style={{ gridColumn: "3", gridRow: "1", height: "100%" }}>
              <ScrollReveal delay={2 * 100}>
                <GalleryCard url={images[2].url} caption={images[2].caption} idx={2} accent={accent} primary={primary} />
              </ScrollReveal>
            </div>
          )}

          {/* Bottom-right cards */}
          {images[3] && (
            <div style={{ gridColumn: "2", gridRow: "2", height: "100%" }}>
              <ScrollReveal delay={3 * 100}>
                <GalleryCard url={images[3].url} caption={images[3].caption} idx={3} accent={accent} primary={primary} />
              </ScrollReveal>
            </div>
          )}
          {images[4] && (
            <div style={{ gridColumn: "3", gridRow: "2", height: "100%" }}>
              <ScrollReveal delay={4 * 100}>
                <GalleryCard url={images[4].url} caption={images[4].caption} idx={4} accent={accent} primary={primary} />
              </ScrollReveal>
            </div>
          )}
        </div>

        {/* Mobile layout — simple stack */}
        <div
          className="md:hidden grid grid-cols-1 gap-4 w-full"
        >
          {images.map((img, idx) => (
            <div key={idx} style={{ height: 240 }}>
              <GalleryCard
                url={img.url}
                caption={img.caption}
                idx={idx}
                accent={accent}
                primary={primary}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
