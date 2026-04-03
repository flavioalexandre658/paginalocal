"use client";

import type { DesignTokens } from "@/types/ai-generation";
import { GalleryContentSchema } from "@/types/ai-generation";
import { ScrollReveal } from "./scroll-reveal";

function renderAccentText(text: string, accentColor: string) {
  return text.split(/\*([^*]+)\*/).map((part, i) =>
    i % 2 === 1 ? <span key={i} style={{ color: accentColor }}>{part}</span> : <span key={i}>{part}</span>
  );
}

interface Props {
  content: Record<string, unknown>;
  tokens: DesignTokens;
  isDark?: boolean;
}

export function FolioxaGallery({ content, tokens }: Props) {
  const parsed = GalleryContentSchema.safeParse(content);
  if (!parsed.success) {
    console.error("[FolioxaGallery] Schema FAILED:", JSON.stringify(parsed.error.issues, null, 2));
    console.error("[FolioxaGallery] Content:", JSON.stringify(content).substring(0, 500));
    return null;
  }
  const c = parsed.data;

  const accent = tokens.palette.accent;

  return (
    <section id="projects" style={{ backgroundColor: "var(--pgl-background)", overflow: "hidden" }}>
      <div className="px-5 md:px-[50px] py-16 md:py-[100px]" style={{ maxWidth: 1310, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, marginBottom: 48 }}>
          {c.subtitle && (
            <ScrollReveal delay={0}>
              <div style={{
                display: "inline-flex", alignItems: "center", padding: "8px 16px",
                backgroundColor: "var(--pgl-surface, #f7f7f7)",
                border: "1px solid var(--pgl-border, #edeff3)",
                borderRadius: 8, backdropFilter: "blur(12px)",
              }}>
                <span style={{
                  fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                  fontSize: 16, fontWeight: 400, color: "var(--pgl-text)",
                }} data-pgl-path="subtitle" data-pgl-edit="text">
                  {c.subtitle}
                </span>
              </div>
            </ScrollReveal>
          )}
          <ScrollReveal delay={50}>
            <h2 style={{
              fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
              fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 500,
              lineHeight: "1.2em", color: "var(--pgl-text)", margin: 0, textAlign: "center",
            }} data-pgl-path="title" data-pgl-edit="text">
              {renderAccentText(c.title, accent)}
            </h2>
          </ScrollReveal>
        </div>

        {/* Project cards grid — 2 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 20, marginBottom: 40 }}>
          {(c.images || []).map((img, idx) => (
            <ScrollReveal key={idx} delay={100 + idx * 80}>
              <div
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 16,
                  boxShadow: "rgba(0,0,0,0.05) 0px 0px 14px 0px",
                  overflow: "hidden",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "rgba(0,0,0,0.08) 0px 8px 24px 0px";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "rgba(0,0,0,0.05) 0px 0px 14px 0px";
                }}
              >
                {/* Inner card */}
                <div style={{ borderRadius: 12, padding: 12 }}>
                  {/* Text row: title + year */}
                  <div style={{
                    display: "flex", alignItems: "baseline", justifyContent: "space-between",
                    marginBottom: 12, padding: "0 4px",
                  }}>
                    <span
                      style={{
                        fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                        fontSize: 17, fontWeight: 500, color: "var(--pgl-text)",
                        lineHeight: "1.3em",
                      }}
                      data-pgl-path={`images.${idx}.caption`}
                      data-pgl-edit="text"
                    >
                      {img.caption || ""}
                    </span>
                    <span style={{
                      fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                      fontSize: 14, fontWeight: 400, color: "var(--pgl-text-muted)",
                    }}>
                      /{new Date().getFullYear()}
                    </span>
                  </div>

                  {/* Image wrapper */}
                  <div
                    style={{
                      borderRadius: 12,
                      overflow: "hidden",
                      position: "relative",
                      aspectRatio: "1.5",
                    }}
                    data-pgl-path={`images.${idx}.url`}
                    data-pgl-edit="image"
                  >
                    {img.url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={img.url}
                        alt={img.caption || ""}
                        style={{
                          display: "block", width: "100%", height: "100%",
                          objectFit: "cover", transition: "transform 0.4s ease",
                        }}
                      />
                    ) : (
                      <div style={{
                        width: "100%", height: "100%",
                        background: `linear-gradient(135deg, var(--pgl-surface) 0%, ${accent}11 100%)`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" opacity="0.15">
                          <rect x="8" y="8" width="32" height="32" rx="4" stroke="var(--pgl-text)" strokeWidth="1.5" />
                          <circle cx="20" cy="20" r="4" stroke="var(--pgl-text)" strokeWidth="1.5" />
                          <path d="M8 36l10-8 8 5 14-11" stroke="var(--pgl-text)" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* "View All Projects" button — same style as original */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <ScrollReveal delay={300}>
            <a
              href="#projects"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "10px 20px",
                backgroundColor: "#fff",
                border: "0.5px solid var(--pgl-border, #edeff3)",
                borderRadius: 8,
                boxShadow: "0px 0px 0px -2.5px rgba(0,0,0,0.13), inset 0px -1px 4px 0px rgba(0,0,0,0.15), 0px 0px 0px 2px var(--pgl-surface, #f3f3f1)",
                textDecoration: "none",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--pgl-surface, #f7f7f7)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#fff"; }}
            >
              <span style={{
                fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                fontSize: 16, fontWeight: 500, color: "var(--pgl-text)",
              }}>
                Ver todos os projetos
              </span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--pgl-text)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </a>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
