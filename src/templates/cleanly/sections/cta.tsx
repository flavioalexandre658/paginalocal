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
      <span key={i} style={{ color: accentColor }}>
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export function CleanlyCta({ content, tokens }: Props) {
  const parsed = CtaContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const accent = tokens.palette.accent;
  const dark = "var(--pgl-text, rgb(23,18,6))";

  return (
    <section
      id="cta"
      style={{
        backgroundColor: tokens.palette.accent,
      }}
    >
      <div
        className="mx-auto max-w-[1200px] px-5 md:px-10"
        style={{
          paddingTop: 80,
          paddingBottom: 80,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: 32,
        }}
      >
        {/* ═══ Subtitle ═══ */}
        {c.subtitle && (
          <ScrollReveal delay={0}>
            <p
              data-pgl-path="subtitle"
              data-pgl-edit="text"
              style={{
                fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                lineHeight: "1.6em",
                color: "var(--pgl-text, rgb(23,18,6))",
                margin: 0,
                opacity: 0.7,
              }}
            >
              {c.subtitle}
            </p>
          </ScrollReveal>
        )}

        {/* ═══ Title ═══ */}
        <ScrollReveal delay={100}>
          <h2
            data-pgl-path="title"
            data-pgl-edit="text"
            style={{
              fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
              fontSize: "clamp(28px, 4.5vw, 48px)",
              fontWeight: 600,
              letterSpacing: "-0.02em",
              lineHeight: "1.15em",
              color: "var(--pgl-text, rgb(23,18,6))",
              margin: 0,
              maxWidth: 640,
            }}
          >
            {renderAccentText(c.title, accent)}
          </h2>
        </ScrollReveal>

        {/* ═══ CTA Button — yellow pill ═══ */}
        <ScrollReveal delay={200}>
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
              backgroundColor: "var(--pgl-text, rgb(23,18,6))",
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
                color: "#fff",
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
                backgroundColor: "rgba(255,255,255,0.15)",
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </span>
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
}
