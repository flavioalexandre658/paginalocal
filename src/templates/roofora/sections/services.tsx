"use client";

import type { DesignTokens } from "@/types/ai-generation";
import { ServicesContentSchema } from "@/types/ai-generation";
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

/* ── Default service icons ── */
function ServiceIcon({ index, color = "#CDF660" }: { index: number; color?: string }) {
  const icons = [
    // Roof / home
    <svg key="0" width="36" height="36" viewBox="0 0 36 36" fill="none">
      <path d="M4 18L18 6l14 12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 16v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V16" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 30v-8h8v8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>,
    // Solar panel
    <svg key="1" width="36" height="36" viewBox="0 0 36 36" fill="none">
      <rect x="6" y="8" width="24" height="16" rx="2" stroke={color} strokeWidth="2" />
      <line x1="14" y1="8" x2="14" y2="24" stroke={color} strokeWidth="1.5" />
      <line x1="22" y1="8" x2="22" y2="24" stroke={color} strokeWidth="1.5" />
      <line x1="6" y1="16" x2="30" y2="16" stroke={color} strokeWidth="1.5" />
      <path d="M14 24l-2 6M22 24l2 6M12 30h12" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>,
    // Wrench / repair
    <svg key="2" width="36" height="36" viewBox="0 0 36 36" fill="none">
      <path d="M22 6a8 8 0 0 0-7.5 10.5l-8 8a2.83 2.83 0 1 0 4 4l8-8A8 8 0 1 0 22 6z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>,
    // Shield / protection
    <svg key="3" width="36" height="36" viewBox="0 0 36 36" fill="none">
      <path d="M18 4L6 10v8c0 8.84 5.12 17.1 12 19.2 6.88-2.1 12-10.36 12-19.2v-8L18 4z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 18l4 4 8-8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>,
    // Water / gutter
    <svg key="4" width="36" height="36" viewBox="0 0 36 36" fill="none">
      <path d="M18 4s-10 12-10 20a10 10 0 1 0 20 0C28 16 18 4 18 4z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>,
    // Building / commercial
    <svg key="5" width="36" height="36" viewBox="0 0 36 36" fill="none">
      <rect x="6" y="4" width="24" height="28" rx="2" stroke={color} strokeWidth="2" />
      <rect x="12" y="10" width="4" height="4" rx="1" stroke={color} strokeWidth="1.5" />
      <rect x="20" y="10" width="4" height="4" rx="1" stroke={color} strokeWidth="1.5" />
      <rect x="12" y="18" width="4" height="4" rx="1" stroke={color} strokeWidth="1.5" />
      <rect x="20" y="18" width="4" height="4" rx="1" stroke={color} strokeWidth="1.5" />
      <path d="M15 32v-6h6v6" stroke={color} strokeWidth="1.5" />
    </svg>,
  ];
  return icons[index % icons.length];
}

function ArrowRightIcon({ color = "#CDF660" }: { color?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M4 10h12M12 6l4 4-4 4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function RooforaServices({ content, tokens }: Props) {
  const parsed = ServicesContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const accent = tokens.palette.accent || "#CDF660";
  const primary = tokens.palette.primary || "#0E1201";

  return (
    <section
      id="services"
      style={{ backgroundColor: primary, overflow: "hidden" }}
    >
      <div
        className="px-5 md:px-[30px] py-16 md:py-[100px]"
        style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        {/* ═══ Top row: Tag + Title + CTA ═══ */}
        <div
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 w-full"
          style={{ maxWidth: 1296, marginBottom: 56 }}
        >
          {/* Left: Tag + H2 */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {c.subtitle && (
              <ScrollReveal delay={0}>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "6px 16px",
                    backgroundColor: `${accent}15`,
                    borderRadius: 100,
                    width: "fit-content",
                  }}
                >
                  <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: accent }} />
                  <span
                    style={{
                      fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                      fontSize: 14,
                      fontWeight: 600,
                      letterSpacing: "0.05em",
                      lineHeight: "1.5em",
                      color: accent,
                      textTransform: "uppercase",
                    }}
                    data-pgl-path="subtitle"
                    data-pgl-edit="text"
                  >
                    {c.subtitle}
                  </span>
                </div>
              </ScrollReveal>
            )}
            <ScrollReveal delay={100}>
              <h2
                style={{
                  fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                  fontSize: "clamp(28px, 3.5vw, 44px)",
                  fontWeight: 600,
                  letterSpacing: "-0.03em",
                  lineHeight: "1.15em",
                  color: "#fff",
                  margin: 0,
                  maxWidth: 550,
                }}
                data-pgl-path="title"
                data-pgl-edit="text"
              >
                {renderAccentText(c.title, accent)}
              </h2>
            </ScrollReveal>
          </div>

          {/* Right: "Explorar Mais Servicos" CTA */}
          <ScrollReveal delay={200}>
            <a
              href="#services"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                padding: "12px 28px",
                backgroundColor: accent,
                borderRadius: 100,
                textDecoration: "none",
                flexShrink: 0,
                transition: "opacity 0.2s, transform 0.2s",
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
                  whiteSpace: "nowrap",
                }}
              >
                Ver Todos os Servicos
              </span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                <path d="M3 8h10M9 4l4 4-4 4" stroke={primary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </ScrollReveal>
        </div>

        {/* ═══ Service cards grid — 3 columns ═══ */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full"
          style={{ maxWidth: 1296, gap: 24 }}
        >
          {c.items.map((item, idx) => (
            <ScrollReveal key={idx} delay={100 + idx * 80}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: 32,
                  borderRadius: 20,
                  border: "1px solid rgba(252,255,245,0.15)",
                  backgroundColor: "rgba(255,255,255,0.04)",
                  transition: "border-color 0.3s, box-shadow 0.3s",
                  cursor: "pointer",
                  height: "100%",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = accent;
                  e.currentTarget.style.boxShadow = `0 8px 32px rgba(0,0,0,0.3)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(252,255,245,0.15)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* Icon area */}
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 16,
                    backgroundColor: primary,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 24,
                    flexShrink: 0,
                  }}
                >
                  <ServiceIcon index={idx} color={accent} />
                </div>

                {/* Title */}
                <h3
                  style={{
                    fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                    fontSize: 20,
                    fontWeight: 600,
                    letterSpacing: "-0.02em",
                    lineHeight: "1.3em",
                    color: "#fff",
                    margin: 0,
                    marginBottom: 12,
                  }}
                  data-pgl-path={`items.${idx}.name`}
                  data-pgl-edit="text"
                >
                  {item.name}
                </h3>

                {/* Description */}
                <p
                  style={{
                    fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                    fontSize: 15,
                    fontWeight: 400,
                    lineHeight: "1.7em",
                    color: "rgba(255,255,255,0.5)",
                    margin: 0,
                    flex: 1,
                  }}
                  data-pgl-path={`items.${idx}.description`}
                  data-pgl-edit="text"
                >
                  {item.description}
                </p>

                {/* Arrow link */}
                <a
                  href={item.ctaLink || "#contato"}
                  data-pgl-path={`items.${idx}.ctaText`}
                  data-pgl-edit="button"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    marginTop: 24,
                    textDecoration: "none",
                    transition: "gap 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.gap = "12px";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.gap = "8px";
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                      fontSize: 15,
                      fontWeight: 600,
                      letterSpacing: "-0.01em",
                      color: "rgba(255,255,255,0.6)",
                    }}
                  >
                    {item.ctaText || "Saiba Mais"}
                  </span>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      backgroundColor: accent,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <ArrowRightIcon color={primary} />
                  </div>
                </a>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
