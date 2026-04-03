"use client";

import { motion } from "framer-motion";
import type { DesignTokens } from "@/types/ai-generation";
import { HeroContentSchema } from "@/types/ai-generation";

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

export function RealesticHero({ content, tokens }: Props) {
  const parsed = HeroContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  return (
    <section
      style={{
        backgroundColor: "var(--pgl-background)",
        overflow: "hidden",
        paddingTop: 44,
        paddingBottom: 44,
      }}
    >
      {/* Container */}
      <div
        className="flex flex-col items-center px-6 md:px-[25px]"
        style={{ maxWidth: 1200, margin: "0 auto", gap: 94 }}
      >
        {/* Heading Wrap */}
        <motion.div
          className="flex flex-col items-center w-full"
          style={{ maxWidth: 650, gap: 18 }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Tag / Pill Badge */}
          {c.tagline && (
            <div
              style={{
                backgroundColor: tokens.palette.accent + "14",
                borderRadius: 1000,
                padding: "10px 18px",
              }}
              data-pgl-path="tagline"
              data-pgl-edit="text"
            >
              <p
                style={{
                  fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                  fontSize: 14,
                  fontWeight: 500,
                  letterSpacing: "-0.03em",
                  lineHeight: "1.4em",
                  color: tokens.palette.accent,
                  margin: 0,
                }}
              >
                {c.tagline}
              </p>
            </div>
          )}

          {/* H1 */}
          <h1
            style={{
              fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
              fontSize: "clamp(32px, 6vw, 60px)",
              fontWeight: 500,
              letterSpacing: "-0.04em",
              lineHeight: "1.1em",
              color: "var(--pgl-text)",
              margin: 0,
              textAlign: "center",
            }}
            data-pgl-path="headline"
            data-pgl-edit="text"
          >
            {renderAccentText(c.headline, tokens.palette.accent)}
          </h1>

          {/* Subheadline */}
          {c.subheadline && (
            <p
              style={{
                fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                fontSize: 17,
                fontWeight: 400,
                letterSpacing: "-0.02em",
                lineHeight: "1.5em",
                color: "var(--pgl-text-muted)",
                margin: 0,
                textAlign: "center",
              }}
              data-pgl-path="subheadline"
              data-pgl-edit="text"
            >
              {c.subheadline}
            </p>
          )}

          {/* CTA Button */}
          {c.ctaText && (
            <a
              href={c.ctaLink || "#"}
              data-pgl-path="ctaText"
              data-pgl-edit="button"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                marginTop: 8,
                height: 48,
                padding: "0 24px",
                backgroundColor: tokens.palette.accent,
                borderRadius: 1000,
                textDecoration: "none",
                boxShadow: `0 4px 14px ${tokens.palette.accent}33`,
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                  fontSize: 15,
                  fontWeight: 500,
                  letterSpacing: "-0.02em",
                  color: "#fff",
                  whiteSpace: "nowrap",
                }}
              >
                {c.ctaText}
              </span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
              >
                <path
                  d="M3 7h8M8 4l3 3-3 3"
                  stroke="#fff"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          )}
        </motion.div>

        {/* Cover Image */}
        <motion.div
          className="w-full"
          style={{
            borderRadius: 38,
            overflow: "hidden",
            minHeight: 400,
          }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
        >
          {c.backgroundImage ? (
            <div
              className="w-full"
              style={{
                borderRadius: 38,
                minHeight: 675,
                overflow: "hidden",
                position: "relative",
              }}
              data-pgl-path="backgroundImage"
              data-pgl-edit="image"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={c.backgroundImage}
                alt=""
                className="w-full md:min-h-[675px] min-h-[350px]"
                style={{
                  objectFit: "cover",
                  display: "block",
                  borderRadius: 38,
                }}
              />
            </div>
          ) : (
            /* Placeholder — gradient card when no image */
            <div
              className="w-full md:min-h-[675px] min-h-[350px]"
              style={{
                borderRadius: 38,
                background: `linear-gradient(135deg, ${tokens.palette.accent}18 0%, ${tokens.palette.accent}08 50%, var(--pgl-surface) 100%)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "28px 34px 48px",
              }}
              data-pgl-path="backgroundImage"
              data-pgl-edit="image"
            >
              {/* Decorative placeholder elements */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, opacity: 0.4 }}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--pgl-text-muted)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <span
                  style={{
                    fontFamily: "var(--pgl-font-body)",
                    fontSize: 14,
                    color: "var(--pgl-text-muted)",
                  }}
                >
                  Imagem de capa
                </span>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
