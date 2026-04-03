"use client";

import type { DesignTokens } from "@/types/ai-generation";
import { CtaContentSchema } from "@/types/ai-generation";
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

function InstaPhoto({
  url,
  idx,
  accent,
}: {
  url?: string;
  idx: number;
  accent: string;
}) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        paddingBottom: "100%",
        borderRadius: 12,
        overflow: "hidden",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        const overlay = e.currentTarget.querySelector<HTMLElement>("[data-insta-overlay]");
        const img = e.currentTarget.querySelector<HTMLElement>("[data-insta-img]");
        if (overlay) overlay.style.opacity = "1";
        if (img) img.style.transform = "scale(1.08)";
      }}
      onMouseLeave={(e) => {
        const overlay = e.currentTarget.querySelector<HTMLElement>("[data-insta-overlay]");
        const img = e.currentTarget.querySelector<HTMLElement>("[data-insta-img]");
        if (overlay) overlay.style.opacity = "0";
        if (img) img.style.transform = "scale(1)";
      }}
    >
      {/* Image via background on container */}
      <div
        data-insta-img=""
        data-pgl-path={`gallery.${idx}.url`}
        data-pgl-edit="image"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: url ? `url(${url})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: url ? undefined : `${accent}18`,
          transition: "transform 0.5s ease",
        }}
      />

      {/* Placeholder */}
      {!url && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="40" height="40" viewBox="0 0 48 48" fill="none" opacity="0.25">
            <rect x="6" y="6" width="36" height="36" rx="6" stroke="#fff" strokeWidth="2" />
            <circle cx="18" cy="18" r="4" stroke="#fff" strokeWidth="2" />
            <path d="M6 34l12-9 8 6 16-12" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      )}

      {/* Hover overlay with Instagram icon */}
      <div
        data-insta-overlay=""
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: `${accent}BB`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: 0,
          transition: "opacity 0.35s ease",
          zIndex: 2,
        }}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <rect x="2" y="2" width="20" height="20" rx="5" stroke="#fff" strokeWidth="1.5" />
          <circle cx="12" cy="12" r="5" stroke="#fff" strokeWidth="1.5" />
          <circle cx="17.5" cy="6.5" r="1" fill="#fff" />
        </svg>
      </div>
    </div>
  );
}

export function BellezzaInstagram({ content, tokens }: Props) {
  const parsed = CtaContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const accent = tokens.palette.accent || "#B8977E";
  const primary = tokens.palette.primary || "#1A1A1A";

  /* Gallery images from content or empty placeholders */
  const gallery = (content.gallery as { url?: string }[]) || [];
  const photoCount = Math.max(gallery.length, 6);
  const photos = Array.from({ length: photoCount }, (_, i) => gallery[i]?.url);

  return (
    <section
      id="instagram"
      style={{
        backgroundColor: primary,
        overflow: "hidden",
      }}
    >
      <div
        className="px-5 md:px-[30px] py-16 md:py-[100px]"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* ═══ Header ═══ */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: 20,
            marginBottom: 56,
            maxWidth: 600,
          }}
        >
          {/* Hashtag title */}
          <ScrollReveal delay={0}>
            <h2
              data-pgl-path="title"
              data-pgl-edit="text"
              style={{
                fontFamily: "var(--pgl-font-heading, 'Playfair Display'), system-ui, serif",
                fontSize: "clamp(28px, 4vw, 44px)",
                fontWeight: 700,
                fontStyle: "italic",
                letterSpacing: "0.02em",
                lineHeight: "1.2em",
                color: "#fff",
                margin: 0,
              }}
            >
              {renderAccentText(c.title, accent)}
            </h2>
          </ScrollReveal>

          {/* Description */}
          {c.subtitle && (
            <ScrollReveal delay={100}>
              <p
                data-pgl-path="subtitle"
                data-pgl-edit="text"
                style={{
                  fontFamily: "var(--pgl-font-body, 'Poppins'), system-ui, sans-serif",
                  fontSize: 16,
                  fontWeight: 400,
                  lineHeight: "1.7em",
                  color: "rgba(255,255,255,0.55)",
                  margin: 0,
                  maxWidth: 480,
                }}
              >
                {c.subtitle}
              </p>
            </ScrollReveal>
          )}

          {/* Follow Us CTA */}
          <ScrollReveal delay={200}>
            <a
              href="#"
              data-pgl-path="cta"
              data-pgl-edit="button"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "14px 36px",
                border: `1.5px solid ${accent}`,
                borderRadius: 100,
                backgroundColor: "transparent",
                textDecoration: "none",
                transition: "background-color 0.3s ease, transform 0.2s ease",
                marginTop: 8,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = accent;
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {/* Instagram icon */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="2" width="20" height="20" rx="5" stroke="#fff" strokeWidth="1.5" />
                <circle cx="12" cy="12" r="5" stroke="#fff" strokeWidth="1.5" />
                <circle cx="17.5" cy="6.5" r="1" fill="#fff" />
              </svg>
              <span
                style={{
                  fontFamily: "var(--pgl-font-body, 'Poppins'), system-ui, sans-serif",
                  fontSize: 15,
                  fontWeight: 500,
                  letterSpacing: "0.04em",
                  color: "#fff",
                  textTransform: "uppercase" as const,
                }}
              >
                Siga-nos
              </span>
            </a>
          </ScrollReveal>
        </div>

        {/* ═══ Desktop Grid — 6 photos (3x2) ═══ */}
        <div
          className="hidden md:grid w-full"
          style={{
            maxWidth: 1200,
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
          }}
        >
          {photos.slice(0, 6).map((url, idx) => (
            <ScrollReveal key={idx} delay={idx * 100}>
              <InstaPhoto url={url} idx={idx} accent={accent} />
            </ScrollReveal>
          ))}
        </div>

        {/* ═══ Mobile — 2x2 grid ═══ */}
        <div
          className="md:hidden grid grid-cols-2 gap-3 w-full"
        >
          {photos.slice(0, 4).map((url, idx) => (
            <ScrollReveal key={idx} delay={idx * 80}>
              <InstaPhoto url={url} idx={idx} accent={accent} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
