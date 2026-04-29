"use client";

import type { DesignTokens } from "@/types/ai-generation";
import { TestimonialsContentSchema } from "@/types/ai-generation";
import { ScrollReveal } from "./scroll-reveal";

interface Props {
  content: Record<string, unknown>;
  tokens: DesignTokens;
  isDark?: boolean;
}

export function RealesticQuote({ content, tokens }: Props) {
  const parsed = TestimonialsContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const accent = tokens.palette.accent;
  const item = c.items[0];
  if (!item) return null;

  return (
    <section
      id="quote"
      style={{
        backgroundColor: "var(--pgl-background)",
        padding: "48px 0",
      }}
    >
      <div
        className="px-[25px]"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        {/* ═══ 2-col flex: image LEFT, text RIGHT — matching Framer original ═══ */}
        <div
          className="flex flex-col md:flex-row"
          style={{
            gap: 50,
            alignItems: "center",
          }}
        >
          {/* ── Left Column — Portrait Image ── */}
          <div
            className="w-full md:w-auto"
            style={{ flex: "1 0 0px", maxWidth: 460 }}
          >
            <ScrollReveal>
              <div
                data-pgl-path="items.0.image"
                data-pgl-edit="image"
                style={{
                  aspectRatio: "0.948 / 1",
                  borderRadius: 28,
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                {item.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.image}
                    alt={item.author || ""}
                    style={{
                      display: "block",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center",
                      borderRadius: "inherit",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      background: `linear-gradient(135deg, var(--pgl-surface) 0%, ${accent}12 100%)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg
                      width="64"
                      height="64"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--pgl-text-muted)"
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ opacity: 0.25 }}
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                )}
              </div>
            </ScrollReveal>
          </div>

          {/* ── Right Column — Quote Text + Signature ── */}
          <div
            className="w-full pr-0 md:pr-[78px]"
            style={{ flex: "1 0 0px" }}
          >
            <ScrollReveal delay={150}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 50,
                }}
              >
                {/* Quote text block */}
                <div>
                  {/* Intro line — dark/bold */}
                  {c.title && (
                    <span
                      style={{
                        fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                        fontSize: 22,
                        fontWeight: 500,
                        letterSpacing: "-0.03em",
                        lineHeight: "1.5em",
                        color: "var(--pgl-text)",
                      }}
                      data-pgl-path="title"
                      data-pgl-edit="text"
                    >
                      {c.title}
                    </span>
                  )}
                  {/* Quote body — muted */}
                  <br />
                  <span
                    style={{
                      fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                      fontSize: 22,
                      fontWeight: 500,
                      letterSpacing: "-0.03em",
                      lineHeight: "1.5em",
                      color: "var(--pgl-text-muted)",
                    }}
                    data-pgl-path="items.0.text"
                    data-pgl-edit="text"
                  >
                    {item.text}
                  </span>
                </div>

                {/* Signature squiggle + author */}
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {/* Editable signature: usuário pode subir uma foto da
                      assinatura. Fallback é o SVG decorativo. */}
                  <div
                    data-pgl-path="items.0.signatureUrl"
                    data-pgl-edit="image"
                    style={{
                      width: 152,
                      height: 88,
                      display: "inline-flex",
                      alignItems: "center",
                    }}
                  >
                    {item.signatureUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.signatureUrl}
                        alt="Assinatura"
                        style={{
                          maxWidth: "100%",
                          maxHeight: "100%",
                          objectFit: "contain",
                        }}
                      />
                    ) : (
                      <svg
                        width="152"
                        height="88"
                        viewBox="0 0 152 88"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path
                          d="M8 72C12 52 18 28 28 20C38 12 40 30 36 44C32 58 28 64 24 66C20 68 22 58 30 46C38 34 50 24 56 32C62 40 56 56 52 64C48 72 50 68 56 58C62 48 72 32 80 28C88 24 84 40 80 52C76 64 78 66 84 56C90 46 98 30 106 26C114 22 112 38 108 50C104 62 108 60 116 48C120 40 126 32 132 30C138 28 140 38 136 48C132 58 128 62 130 58C132 54 138 44 146 40"
                          stroke={accent}
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>

                  {/* Author name */}
                  {item.author && (
                    <span
                      style={{
                        fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                        fontSize: 16,
                        fontWeight: 600,
                        letterSpacing: "-0.02em",
                        lineHeight: "1.2em",
                        color: "var(--pgl-text)",
                      }}
                      data-pgl-path="items.0.author"
                      data-pgl-edit="text"
                    >
                      {item.author}
                    </span>
                  )}

                  {/* Role */}
                  {item.role && (
                    <span
                      style={{
                        fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                        fontSize: 14,
                        fontWeight: 400,
                        letterSpacing: "-0.02em",
                        lineHeight: "1.2em",
                        color: "var(--pgl-text-muted)",
                      }}
                      data-pgl-path="items.0.role"
                      data-pgl-edit="text"
                    >
                      {item.role}
                    </span>
                  )}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
