"use client";

import type { DesignTokens } from "@/types/ai-generation";
import { ScrollReveal } from "./scroll-reveal";
import { TestimonialsContentSchema } from "@/types/ai-generation";

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

/* ── Star Rating ── */
function StarRating({ color }: { color: string }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill={color}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

/* ── IMAGE CARD — full photo bg + blur overlay + white text ── */
function ImageCard({ item, idx, accent }: {
  item: { text: string; author: string; rating?: number; role?: string; image?: string };
  idx: number;
  accent: string;
}) {
  return (
    <div
      style={{
        position: "relative",
        borderRadius: 16,
        overflow: "hidden",
        height: "100%",
        minHeight: 380,
      }}
    >
      {/* Background image */}
      {item.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.image}
          alt={item.author}
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            objectFit: "cover", objectPosition: "center center",
            borderRadius: "inherit",
          }}
          data-pgl-path={`items.${idx}.image`}
          data-pgl-edit="image"
        />
      ) : (
        <div style={{
          position: "absolute", inset: 0,
          background: `linear-gradient(135deg, ${accent}44, ${accent}88)`,
          borderRadius: "inherit",
        }} />
      )}

      {/* Blur overlay — gradient mask from transparent top to black bottom */}
      <div style={{
        position: "absolute", inset: 0,
        backdropFilter: "blur(30px)",
        WebkitBackdropFilter: "blur(30px)",
        backgroundColor: "rgba(0,0,0,0.2)",
        WebkitMaskImage: "linear-gradient(rgba(0,0,0,0) 0%, rgb(0,0,0) 66.2162%)",
        maskImage: "linear-gradient(rgba(0,0,0,0) 0%, rgb(0,0,0) 66.2162%)",
        borderRadius: "inherit",
      }} />

      {/* Content — positioned at bottom */}
      <div style={{
        position: "relative", zIndex: 2,
        display: "flex", flexDirection: "column",
        justifyContent: "flex-end",
        height: "100%",
        padding: 24,
        gap: 10,
      }}>
        {/* Stars — white */}
        <StarRating color="#fff" />

        {/* Quote text — white */}
        <p style={{
          fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
          fontSize: 16, fontWeight: 400,
          lineHeight: "1.5em",
          color: "#fff",
          margin: 0,
        }}
          data-pgl-path={`items.${idx}.text`}
          data-pgl-edit="text"
        >
          &ldquo;{item.text}&rdquo;
        </p>

        {/* Author info — Name • Role */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{
            fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
            fontSize: 15, fontWeight: 600,
            color: "#fff",
          }}
            data-pgl-path={`items.${idx}.author`}
            data-pgl-edit="text"
          >
            {item.author}
          </span>
          {item.role && (
            <>
              <div style={{
                width: 4, height: 4, borderRadius: 999,
                backgroundColor: "#fff",
              }} />
              <span style={{
                fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                fontSize: 16, fontWeight: 400,
                color: "#fff",
              }}
                data-pgl-path={`items.${idx}.role`}
                data-pgl-edit="text"
              >
                {item.role}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── TEXT CARD — white bg + orange stars + avatar at bottom ── */
function TextCard({ item, idx, accent }: {
  item: { text: string; author: string; rating?: number; role?: string; image?: string };
  idx: number;
  accent: string;
}) {
  return (
    <div
      style={{
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 24,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: 380,
      }}
    >
      {/* Text wrapper — top section */}
      <div style={{
        display: "flex", flexDirection: "column", gap: 14,
        flex: 1,
      }}>
        {/* Quote text */}
        <p style={{
          fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
          fontSize: 16, fontWeight: 400,
          lineHeight: "1.5em",
          color: "var(--pgl-text, #212121)",
          opacity: 0.8,
          margin: 0,
        }}
          data-pgl-path={`items.${idx}.text`}
          data-pgl-edit="text"
        >
          &ldquo;{item.text}&rdquo;
        </p>

        {/* Stars — accent/orange */}
        <StarRating color={accent} />
      </div>

      {/* User info — bottom section */}
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        marginTop: 16,
      }}>
        {/* Avatar */}
        <div
          style={{
            width: 60, height: 60,
            borderRadius: 10,
            overflow: "hidden",
            flexShrink: 0,
            position: "relative",
            backgroundColor: "var(--pgl-surface, #f3f3f1)",
          }}
          data-pgl-path={`items.${idx}.image`}
          data-pgl-edit="image"
        >
          {item.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.image}
              alt={item.author}
              style={{
                display: "block", width: "100%", height: "100%",
                objectFit: "cover", objectPosition: "center center",
              }}
            />
          ) : (
            <div style={{
              width: "100%", height: "100%",
              background: `linear-gradient(135deg, ${accent}33, ${accent}66)`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{
                fontFamily: "var(--pgl-font-heading)",
                fontSize: 22, fontWeight: 600, color: "#fff",
              }}>
                {item.author.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* Name + Role */}
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span style={{
            fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
            fontSize: 15, fontWeight: 600,
            color: "var(--pgl-text, #000)",
          }}
            data-pgl-path={`items.${idx}.author`}
            data-pgl-edit="text"
          >
            {item.author}
          </span>
          {item.role && (
            <span style={{
              fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
              fontSize: 16, fontWeight: 400,
              color: "var(--pgl-text-muted, #666)",
              opacity: 0.8,
            }}
              data-pgl-path={`items.${idx}.role`}
              data-pgl-edit="text"
            >
              {item.role}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export function FolioxaTestimonials({ content, tokens }: Props) {
  const parsed = TestimonialsContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const accent = tokens.palette.accent;

  /* Bento pattern: alternating image/text cards in checkerboard
     Row 1: Image, Text, Image
     Row 2: Text, Image, Text
     Pattern by index: 0=img, 1=txt, 2=img, 3=txt, 4=img, 5=txt */
  const isImageCard = (idx: number) => idx % 2 === 0;

  return (
    <section id="testimonials" style={{ backgroundColor: "var(--pgl-background)", overflow: "hidden" }}>
      <div
        className="px-5 md:px-10 py-16 md:py-[100px]"
        style={{ maxWidth: 1310, margin: "0 auto" }}
      >
        {/* ═══ Header ═══ */}
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          gap: 16, marginBottom: 56,
        }}>
          {c.subtitle && (
            <ScrollReveal delay={0}>
              <div style={{
                display: "inline-flex", alignItems: "center",
                padding: "8px 16px",
                backgroundColor: "var(--pgl-surface, #f7f7f7)",
                border: "1px solid var(--pgl-border, #edeff3)",
                borderRadius: 8,
                backdropFilter: "blur(12px)",
              }}>
                <span style={{
                  fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                  fontSize: 16, fontWeight: 400, color: "var(--pgl-text)",
                }}
                  data-pgl-path="subtitle"
                  data-pgl-edit="text"
                >
                  {c.subtitle}
                </span>
              </div>
            </ScrollReveal>
          )}
          <ScrollReveal delay={50}>
            <h2 style={{
              fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
              fontSize: "clamp(28px, 3.5vw, 40px)",
              fontWeight: 500,
              lineHeight: "1.2em",
              color: "var(--pgl-text)",
              margin: 0,
              textAlign: "center",
            }}
              data-pgl-path="title"
              data-pgl-edit="text"
            >
              {renderAccentText(c.title, accent)}
            </h2>
          </ScrollReveal>
        </div>

        {/* ═══ Bento Grid — 3 columns ═══ */}
        <div
          className="grid grid-cols-1 md:grid-cols-3"
          style={{ gap: 20 }}
        >
          {c.items.slice(0, 6).map((item, idx) => (
            <ScrollReveal key={idx} delay={100 + idx * 80}>
              {isImageCard(idx) ? (
                <ImageCard item={item} idx={idx} accent={accent} />
              ) : (
                <TextCard item={item} idx={idx} accent={accent} />
              )}
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
