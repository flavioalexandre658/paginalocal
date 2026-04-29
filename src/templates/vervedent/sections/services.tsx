"use client";

import type { DesignTokens } from "@/types/ai-generation";
import { ServicesContentSchema } from "@/types/ai-generation";
import { ScrollReveal } from "./scroll-reveal";
import { IconRenderer } from "@/components/ui/icon-renderer";

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

/* ── Dental/healthcare service icons ── */
function ServiceIcon({ index, color }: { index: number; color: string }) {
  const icons = [
    /* Tooth / dental exam */
    <svg key="0" width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path d="M16 4c-4 0-7 2-8 5s-1 7 0 10c.7 2 1.5 4.5 2.5 7 .6 1.5 1.5 2 2.5 2s1.8-1 2-2.5l1-4.5 1 4.5c.2 1.5 1 2.5 2 2.5s1.9-.5 2.5-2c1-2.5 1.8-5 2.5-7 1-3 1-7 0-10s-4-5-8-5z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>,
    /* Cleaning / sparkle */
    <svg key="1" width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path d="M16 4v4M16 24v4M4 16h4M24 16h4" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M7.5 7.5l2.8 2.8M21.7 21.7l2.8 2.8M24.5 7.5l-2.8 2.8M10.3 21.7l-2.8 2.8" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="16" cy="16" r="5" stroke={color} strokeWidth="1.8" />
    </svg>,
    /* X-ray / diagnostics */
    <svg key="2" width="32" height="32" viewBox="0 0 32 32" fill="none">
      <rect x="5" y="5" width="22" height="22" rx="0" stroke={color} strokeWidth="1.8" />
      <circle cx="16" cy="14" r="5" stroke={color} strokeWidth="1.5" />
      <path d="M13 20h6M16 14v8" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>,
    /* Whitening / smile */
    <svg key="3" width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path d="M8 18c0 4.4 3.6 8 8 8s8-3.6 8-8" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 18v-2M16 18v-3M20 18v-2" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="11" cy="10" r="2" stroke={color} strokeWidth="1.5" />
      <circle cx="21" cy="10" r="2" stroke={color} strokeWidth="1.5" />
    </svg>,
    /* Veneers / cosmetic */
    <svg key="4" width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path d="M10 6c-3 0-5 2.5-5 6s2 6 5 8c2 1.3 4 3 6 5 2-2 4-3.7 6-5 3-2 5-4 5-8s-2-6-5-6c-2 0-4 1-6 3-2-2-4-3-6-3z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>,
    /* Shield / protection */
    <svg key="5" width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path d="M16 4L6 9v7c0 7 4.3 13.6 10 15.3 5.7-1.7 10-8.3 10-15.3V9L16 4z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11 16l3 3 7-7" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>,
  ];
  return icons[index % icons.length];
}

export function VerveServices({ content, tokens }: Props) {
  const parsed = ServicesContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const accent = tokens.palette.accent;
  const secondary = tokens.palette.secondary;
  const primary = tokens.palette.primary;

  return (
    <section
      id="services"
      style={{
        backgroundColor: "var(--pgl-background)",
        overflow: "hidden",
      }}
    >
      <div
        className="px-5 md:px-12 py-16 md:py-[120px]"
        style={{
          maxWidth: 1296,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* ═══ Heading area (left-aligned) ═══ */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 56, maxWidth: 600 }}>
          {c.subtitle && (
            <ScrollReveal delay={0}>
              <span
                style={{
                  fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                  fontSize: 14,
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  lineHeight: "1.7em",
                  color: secondary,
                  textTransform: "uppercase",
                }}
                data-pgl-path="subtitle"
                data-pgl-edit="text"
              >
                {c.subtitle}
              </span>
            </ScrollReveal>
          )}

          <ScrollReveal delay={100}>
            <h2
              style={{
                fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                fontSize: "clamp(28px, 4vw, 44px)",
                fontWeight: 600,
                letterSpacing: "-0.03em",
                lineHeight: "1.15em",
                color: primary,
                margin: 0,
                marginBottom: 12,
              }}
              data-pgl-path="title"
              data-pgl-edit="text"
            >
              {renderAccentText(c.title, accent)}
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={150}>
            <p
              style={{
                fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                fontSize: 16,
                fontWeight: 400,
                lineHeight: "1.7em",
                color: "var(--pgl-text-muted)",
                margin: 0,
              }}
            >
              {c.items[0]?.ctaText ||
                "Transforme seu sorriso com nossos servicos de odontologia geral e estetica. Cuidado completo para um sorriso confiante e radiante."}
            </p>
          </ScrollReveal>
        </div>

        {/* ═══ Service cards grid — 2 columns ═══ */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 w-full"
          style={{ gap: 24 }}
        >
          {c.items.map((item, idx) => (
            <ScrollReveal key={idx} delay={100 + idx * 80}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: 32,
                  borderRadius: 0,
                  border: "1px solid #e6e6e6",
                  backgroundColor: "#fff",
                  transition: "border-color 0.3s, box-shadow 0.3s, transform 0.3s",
                  cursor: "pointer",
                  height: "100%",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = secondary;
                  e.currentTarget.style.boxShadow = `0 8px 32px rgba(0,0,0,0.08)`;
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#e6e6e6";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {/* Icon area */}
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 0,
                    backgroundColor: `${secondary}14`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 24,
                    flexShrink: 0,
                  }}
                >
                  <div data-pgl-path={`items.${idx}.icon`} data-pgl-edit="icon">
                    {item.icon ? (
                      <IconRenderer
                        icon={item.icon}
                        size={32}
                        color={secondary}
                        strokeWidth={2}
                        ariaLabel={item.name}
                      />
                    ) : (
                      <ServiceIcon index={idx} color={secondary} />
                    )}
                  </div>
                </div>

                {/* Title */}
                <h3
                  style={{
                    fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                    fontSize: 20,
                    fontWeight: 600,
                    letterSpacing: "-0.02em",
                    lineHeight: "1.3em",
                    color: primary,
                    margin: 0,
                    marginBottom: 10,
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
                    color: "var(--pgl-text-muted)",
                    margin: 0,
                    flex: 1,
                  }}
                  data-pgl-path={`items.${idx}.description`}
                  data-pgl-edit="text"
                >
                  {item.description}
                </p>

                {/* Learn more link */}
                <a
                  href={item.ctaLink || "#contato"}
                  data-pgl-path={`items.${idx}.ctaText`}
                  data-pgl-edit="button"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    marginTop: 20,
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
                      fontSize: 14,
                      fontWeight: 600,
                      letterSpacing: "-0.01em",
                      color: secondary,
                    }}
                  >
                    {item.ctaText || "Saiba Mais"}
                  </span>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M4 9h10M10 5l4 4-4 4" stroke={secondary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
