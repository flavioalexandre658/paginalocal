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

function BlogCard({
  url,
  caption,
  idx,
  accent,
  primary,
}: {
  url?: string;
  caption?: string;
  idx: number;
  accent: string;
  primary: string;
}) {
  /* Simulated date for each card */
  const dates = ["15 Mar 2025", "08 Fev 2025", "22 Jan 2025", "10 Dez 2024", "28 Nov 2024", "14 Out 2024"];
  const excerpts = [
    "Descubra as tendencias que estao transformando o mundo da beleza nesta temporada.",
    "Dicas essenciais para manter sua pele radiante durante todas as estacoes do ano.",
    "Conhca os ingredientes naturais que revolucionam os cuidados com a pele.",
    "Rotinas de skincare noturnas para acordar com a pele renovada e luminosa.",
    "Os segredos de beleza que as especialistas recomendam para cada tipo de pele.",
    "Como criar uma rotina de autocuidado que realmente funciona no dia a dia.",
  ];

  return (
    <div
      style={{
        borderRadius: 16,
        overflow: "hidden",
        backgroundColor: "var(--pgl-surface, #FFFAF5)",
        transition: "box-shadow 0.4s ease, transform 0.4s ease",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 20px 60px rgba(0,0,0,0.12)";
        e.currentTarget.style.transform = "translateY(-4px)";
        const img = e.currentTarget.querySelector<HTMLElement>("[data-blog-img]");
        if (img) img.style.transform = "scale(1.06)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.04)";
        e.currentTarget.style.transform = "translateY(0)";
        const img = e.currentTarget.querySelector<HTMLElement>("[data-blog-img]");
        if (img) img.style.transform = "scale(1)";
      }}
    >
      {/* Image */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: 240,
          overflow: "hidden",
          borderRadius: "16px 16px 0 0",
        }}
      >
        <div
          data-blog-img=""
          data-pgl-path={`images.${idx}.url`}
          data-pgl-edit="image"
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: url ? `url(${url})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundColor: url ? undefined : `${accent}15`,
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
              background: `linear-gradient(135deg, ${primary}10, ${accent}20)`,
            }}
          >
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" opacity="0.3">
              <rect x="6" y="6" width="36" height="36" rx="6" stroke={accent} strokeWidth="2" />
              <circle cx="18" cy="18" r="4" stroke={accent} strokeWidth="2" />
              <path d="M6 34l12-9 8 6 16-12" stroke={accent} strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        )}

        {/* Date badge */}
        <div
          style={{
            position: "absolute",
            top: 16,
            left: 16,
            backgroundColor: accent,
            borderRadius: 8,
            padding: "6px 14px",
            zIndex: 2,
          }}
        >
          <span
            style={{
              fontFamily: "var(--pgl-font-body, 'Poppins'), system-ui, sans-serif",
              fontSize: 12,
              fontWeight: 600,
              color: "#fff",
              letterSpacing: "0.02em",
            }}
          >
            {dates[idx % dates.length]}
          </span>
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          padding: "24px 24px 28px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          flex: 1,
        }}
      >
        <h3
          data-pgl-path={`images.${idx}.caption`}
          data-pgl-edit="text"
          style={{
            fontFamily: "var(--pgl-font-heading, 'Playfair Display'), system-ui, serif",
            fontSize: 20,
            fontWeight: 700,
            lineHeight: "1.35em",
            letterSpacing: "-0.01em",
            color: primary,
            margin: 0,
          }}
        >
          {caption || `Artigo ${idx + 1}`}
        </h3>

        <p
          style={{
            fontFamily: "var(--pgl-font-body, 'Poppins'), system-ui, sans-serif",
            fontSize: 14,
            fontWeight: 400,
            lineHeight: "1.7em",
            color: `${primary}99`,
            margin: 0,
          }}
        >
          {excerpts[idx % excerpts.length]}
        </p>

        {/* Read more link */}
        <div style={{ marginTop: "auto", paddingTop: 8 }}>
          <span
            style={{
              fontFamily: "var(--pgl-font-body, 'Poppins'), system-ui, sans-serif",
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.04em",
              textTransform: "uppercase" as const,
              color: accent,
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            Ler Mais
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
}

export function BellezzaBlog({ content, tokens }: Props) {
  const parsed = GalleryContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const accent = tokens.palette.accent || "#B8977E";
  const primary = tokens.palette.primary || "#1A1A1A";
  const images = c.images || [];

  return (
    <section
      id="blog"
      style={{ backgroundColor: "var(--pgl-background)", overflow: "hidden" }}
    >
      <div
        className="px-5 md:px-[30px] py-16 md:py-[100px]"
        style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        {/* ═══ Header ═══ */}
        <div
          className="flex flex-col md:flex-row md:items-end md:justify-between w-full"
          style={{ maxWidth: 1200, marginBottom: 56, gap: 24 }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 560 }}>
            <ScrollReveal delay={0}>
              <h2
                data-pgl-path="title"
                data-pgl-edit="text"
                style={{
                  fontFamily: "var(--pgl-font-heading, 'Playfair Display'), system-ui, serif",
                  fontSize: "clamp(28px, 4vw, 42px)",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  lineHeight: "1.2em",
                  color: primary,
                  margin: 0,
                }}
              >
                {renderAccentText(c.title, accent)}
              </h2>
            </ScrollReveal>

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
                    color: `${primary}80`,
                    margin: 0,
                    maxWidth: 480,
                  }}
                >
                  {c.subtitle}
                </p>
              </ScrollReveal>
            )}
          </div>

          {/* Show More link */}
          <ScrollReveal delay={200}>
            <a
              href="#blog"
              data-pgl-path="cta"
              data-pgl-edit="button"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 28px",
                border: `1.5px solid ${accent}`,
                borderRadius: 100,
                backgroundColor: "transparent",
                textDecoration: "none",
                transition: "background-color 0.3s ease, color 0.3s ease, transform 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = accent;
                const span = e.currentTarget.querySelector<HTMLElement>("span");
                if (span) span.style.color = "#fff";
                const svg = e.currentTarget.querySelector<SVGElement>("svg path");
                if (svg) svg.setAttribute("stroke", "#fff");
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                const span = e.currentTarget.querySelector<HTMLElement>("span");
                if (span) span.style.color = accent;
                const svg = e.currentTarget.querySelector<SVGElement>("svg path");
                if (svg) svg.setAttribute("stroke", accent);
              }}
            >
              <span
                style={{
                  fontFamily: "var(--pgl-font-body, 'Poppins'), system-ui, sans-serif",
                  fontSize: 15,
                  fontWeight: 500,
                  letterSpacing: "0.02em",
                  color: accent,
                  transition: "color 0.3s ease",
                }}
              >
                Ver Todos
              </span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                <path d="M3 8h10M9 4l4 4-4 4" stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </ScrollReveal>
        </div>

        {/* ═══ Desktop Grid — 3 cols ═══ */}
        <div
          className="hidden md:grid w-full"
          style={{
            maxWidth: 1200,
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 28,
          }}
        >
          {images.slice(0, 6).map((img, idx) => (
            <ScrollReveal key={idx} delay={idx * 120}>
              <BlogCard
                url={img.url}
                caption={img.caption}
                idx={idx}
                accent={accent}
                primary={primary}
              />
            </ScrollReveal>
          ))}
        </div>

        {/* ═══ Mobile — stacked ═══ */}
        <div className="md:hidden grid grid-cols-1 gap-5 w-full">
          {images.slice(0, 4).map((img, idx) => (
            <ScrollReveal key={idx} delay={idx * 80}>
              <BlogCard
                url={img.url}
                caption={img.caption}
                idx={idx}
                accent={accent}
                primary={primary}
              />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
