"use client";

import type { DesignTokens } from "@/types/ai-generation";
import { ScrollReveal } from "./scroll-reveal";

interface Props {
  content: Record<string, unknown>;
  tokens: DesignTokens;
  isDark?: boolean;
  navigation?: { label: string; href: string; isExternal?: boolean }[];
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

export function StratexFooter({ content, tokens, navigation }: Props) {
  const accent = tokens.palette.accent;
  const storeName = (content.storeName as string) || "";
  const tagline = (content.tagline as string) || "";
  const copyrightText = (content.copyrightText as string) || "";
  const navLinks = navigation || [];

  // Split nav into 3 columns
  const third = Math.ceil(navLinks.length / 3);
  const cols = [
    { title: "Links", items: navLinks.slice(0, third) },
    { title: "Empresa", items: navLinks.slice(third, third * 2) },
    { title: "Contato", items: navLinks.slice(third * 2) },
  ].filter((c) => c.items.length > 0);

  return (
    <footer
      data-pgl-edit="footer"
      data-pgl-path="copyrightText"
      style={{
        backgroundColor: "var(--pgl-background)",
        padding: "60px 0 32px",
      }}
    >
      <div className="px-[25px]" style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Top area — 4-col grid: Brand + 3 link columns */}
        <ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-4" style={{ gap: 40, marginBottom: 60 }}>
            {/* Brand column */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Logo */}
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    backgroundColor: accent,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "rgba(0,0,0,0.07) 0px 0px 12px 0px, rgba(255,255,255,0.25) 0px 2px 4px 0px inset",
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 2 7 12 12 22 7 12 2" />
                    <polyline points="2 17 12 22 22 17" />
                    <polyline points="2 12 12 17 22 12" />
                  </svg>
                </div>
                <span
                  style={{
                    fontFamily: "var(--pgl-font-heading), Georgia, serif",
                    fontSize: 20,
                    fontWeight: 400,
                    letterSpacing: "-0.02em",
                    color: "var(--pgl-text)",
                  }}
                >
                  {storeName}
                </span>
              </div>
              {/* Tagline */}
              {tagline && (
                <p
                  style={{
                    fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                    fontSize: 15,
                    fontWeight: 400,
                    lineHeight: "1.5em",
                    color: "var(--pgl-text-muted)",
                    margin: 0,
                  }}
                  data-pgl-path="tagline"
                  data-pgl-edit="text"
                >
                  {tagline}
                </p>
              )}
              {/* Social icons */}
              <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                {["facebook", "instagram", "twitter"].map((social) => (
                  <a
                    key={social}
                    href="#"
                    aria-label={social}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      border: "1px solid rgba(0,0,0,0.08)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "background-color 0.2s",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.04)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--pgl-text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {social === "facebook" && <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />}
                      {social === "instagram" && <><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></>}
                      {social === "twitter" && <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />}
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {/* Link columns */}
            {cols.map((col, colIdx) => (
              <div key={colIdx} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <p
                  style={{
                    fontFamily: "var(--pgl-font-heading), Georgia, serif",
                    fontSize: 17,
                    fontWeight: 400,
                    color: "var(--pgl-text)",
                    margin: 0,
                    marginBottom: 4,
                  }}
                >
                  {col.title}
                </p>
                {col.items.map((link, linkIdx) => (
                  <a
                    key={linkIdx}
                    href={link.href}
                    style={{
                      fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                      fontSize: 15,
                      fontWeight: 400,
                      color: "var(--pgl-text-muted)",
                      textDecoration: "none",
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "var(--pgl-text)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "var(--pgl-text-muted)"; }}
                    {...(link.isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: "1px solid rgba(0,0,0,0.08)",
            paddingTop: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p
            style={{
              fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
              fontSize: 14,
              fontWeight: 400,
              color: "var(--pgl-text-muted)",
              margin: 0,
            }}
            data-pgl-path="copyrightText"
            data-pgl-edit="text"
          >
            {copyrightText || `\u00A9 ${new Date().getFullYear()} ${storeName}. Todos os direitos reservados.`}
          </p>
        </div>
      </div>
    </footer>
  );
}
