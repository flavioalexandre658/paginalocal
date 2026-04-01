"use client";

import type { DesignTokens } from "@/types/ai-generation";
import { ScrollReveal } from "./scroll-reveal";

interface Props {
  content: Record<string, unknown>;
  tokens: DesignTokens;
  isDark?: boolean;
  navigation?: { label: string; href: string; isExternal?: boolean }[];
}

function FacebookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M18 10a8 8 0 10-9.25 7.9v-5.59H6.72V10h2.03V8.16c0-2 1.2-3.1 3.02-3.1.87 0 1.79.16 1.79.16v1.97h-1.01c-1 0-1.3.62-1.3 1.25V10h2.22l-.35 2.31h-1.87v5.6A8 8 0 0018 10z" fill="currentColor" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M17.5 4.92a6.7 6.7 0 01-1.92.53 3.35 3.35 0 001.47-1.85 6.7 6.7 0 01-2.12.81A3.34 3.34 0 009.2 7.46 9.48 9.48 0 013.6 4.56a3.34 3.34 0 001.03 4.46 3.3 3.3 0 01-1.51-.42v.04a3.34 3.34 0 002.68 3.27 3.34 3.34 0 01-1.51.06 3.34 3.34 0 003.12 2.32A6.7 6.7 0 012.5 15.6a9.44 9.44 0 005.12 1.5c6.14 0 9.5-5.09 9.5-9.5l-.01-.43a6.78 6.78 0 001.67-1.73l-.28-.02z" fill="currentColor" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="3" y="3" width="14" height="14" rx="4" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="10" cy="10" r="3.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="14.5" cy="5.5" r="1" fill="currentColor" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M17.8 6.4s-.2-1.2-.7-1.7c-.7-.7-1.4-.7-1.8-.8C13 3.8 10 3.8 10 3.8s-3 0-5.3.1c-.4.1-1.1.1-1.8.8-.5.5-.7 1.7-.7 1.7S2 7.8 2 9.2v1.3c0 1.4.2 2.8.2 2.8s.2 1.2.7 1.7c.7.7 1.5.7 1.9.8 1.4.1 5.2.2 5.2.2s3 0 5.3-.2c.4 0 1.1-.1 1.8-.8.5-.5.7-1.7.7-1.7s.2-1.4.2-2.8V9.2c0-1.4-.2-2.8-.2-2.8z" fill="currentColor" />
      <path d="M8.5 12.5V7.5l4.5 2.5-4.5 2.5z" fill="white" />
    </svg>
  );
}

export function PlumbflowFooter({ content, tokens, navigation }: Props) {
  const primary = tokens.palette.primary || "#142F45";
  const accent = tokens.palette.accent || "#FF5E15";

  const copyrightText = typeof content.copyrightText === "string" ? content.copyrightText : "";
  const storeName = typeof content.storeName === "string" ? content.storeName : "";
  const phone = typeof content.phone === "string" ? content.phone : "";
  const email = typeof content.email === "string" ? content.email : "";
  const address = typeof content.address === "string" ? content.address : "";

  const navItems = navigation || [];

  const linkStyle: React.CSSProperties = {
    fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
    fontSize: 16, fontWeight: 400, letterSpacing: "0px",
    lineHeight: "2.2em", color: "rgba(241,242,250,0.7)",
    textDecoration: "none", transition: "color 0.2s",
  };

  const headingStyle: React.CSSProperties = {
    fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
    fontSize: 22, fontWeight: 700, letterSpacing: "0px",
    lineHeight: "1.4em", color: "#fff", margin: "0 0 20px",
  };

  return (
    <footer
      data-pgl-edit="footer"
      data-pgl-path="copyrightText"
      style={{ backgroundColor: primary }}
    >
      {/* ═══ Main content ═══ */}
      <div
        className="px-5 md:px-[30px] pt-16 md:pt-[80px] pb-10"
        style={{ maxWidth: 1296, margin: "0 auto" }}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-16">
          {/* Col 1 — Logo + description */}
          <ScrollReveal delay={0 * 100}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <span style={{
                fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                fontSize: 24, fontWeight: 700, color: "#fff",
              }}>
                {storeName || "PlumbFlow"}
              </span>
              <p style={{
                fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                fontSize: 16, fontWeight: 400, lineHeight: "1.6em",
                color: "rgba(241,242,250,0.6)", margin: 0,
              }}>
                {storeName || "Seu parceiro local de confiança."}
              </p>

              {/* Social icons */}
              <div style={{ display: "flex", flexDirection: "row", gap: 12, marginTop: 8 }}>
                {[FacebookIcon, TwitterIcon, InstagramIcon, YoutubeIcon].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    style={{
                      width: 40, height: 40, borderRadius: "50%",
                      backgroundColor: "rgba(255,255,255,0.1)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "rgba(241,242,250,0.7)", textDecoration: "none",
                      transition: "background-color 0.2s",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = accent; e.currentTarget.style.color = "#fff"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "rgba(241,242,250,0.7)"; }}
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Col 2 — Quick Links */}
          <ScrollReveal delay={1 * 100}>
            <div>
              <h4 style={headingStyle}>Links</h4>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    style={linkStyle}
                    onMouseEnter={(e) => { e.currentTarget.style.color = accent; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(241,242,250,0.7)"; }}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Col 3 — Service Areas */}
          <ScrollReveal delay={2 * 100}>
            <div>
              <h4 style={headingStyle}>Nossos Serviços</h4>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {navItems.map((item) => (
                  <a
                    key={`svc-${item.href}`}
                    href={item.href}
                    style={linkStyle}
                    onMouseEnter={(e) => { e.currentTarget.style.color = accent; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(241,242,250,0.7)"; }}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Col 4 — Contact */}
          <ScrollReveal delay={3 * 100}>
          <div>
            <h4 style={headingStyle}>Contato</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {address && (
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0, marginTop: 3 }}>
                    <path d="M9 1.5a5.25 5.25 0 015.25 5.25c0 3.94-5.25 9.75-5.25 9.75s-5.25-5.81-5.25-9.75A5.25 5.25 0 019 1.5z" stroke="rgba(241,242,250,0.6)" strokeWidth="1.2" />
                    <circle cx="9" cy="6.75" r="1.5" stroke="rgba(241,242,250,0.6)" strokeWidth="1.2" />
                  </svg>
                  <span style={{ ...linkStyle, lineHeight: "1.5em" }}>{address}</span>
                </div>
              )}
              {email && (
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
                    <rect x="2" y="4" width="14" height="10" rx="2" stroke="rgba(241,242,250,0.6)" strokeWidth="1.2" />
                    <path d="M2 6l7 4.5L16 6" stroke="rgba(241,242,250,0.6)" strokeWidth="1.2" />
                  </svg>
                  <a href={`mailto:${email}`} style={linkStyle}
                    onMouseEnter={(e) => { e.currentTarget.style.color = accent; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(241,242,250,0.7)"; }}
                  >{email}</a>
                </div>
              )}
              {phone && (
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
                    <path d="M16 12.7v1.8a1.2 1.2 0 01-1.3 1.2 11.9 11.9 0 01-5.2-1.8 11.7 11.7 0 01-3.6-3.6A11.9 11.9 0 014 5.1 1.2 1.2 0 015.2 3.8h1.8a1.2 1.2 0 011.2 1c.1.6.2 1.2.4 1.7a1.2 1.2 0 01-.3 1.3l-.7.7a9.6 9.6 0 003.6 3.6l.7-.7a1.2 1.2 0 011.3-.3c.5.2 1.1.3 1.7.4a1.2 1.2 0 011 1.2z" stroke="rgba(241,242,250,0.6)" strokeWidth="1.2" />
                  </svg>
                  <a href={`tel:${phone}`} style={linkStyle}
                    onMouseEnter={(e) => { e.currentTarget.style.color = accent; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(241,242,250,0.7)"; }}
                  >{phone}</a>
                </div>
              )}
            </div>
          </div>
          </ScrollReveal>
        </div>

        {/* ═══ Divider + Copyright ═══ */}
        <ScrollReveal delay={400}>
          <div
            style={{
              borderTop: "1px solid rgba(241,242,250,0.1)",
              marginTop: 48,
              paddingTop: 24,
              textAlign: "center",
            }}
          >
            <p style={{
              fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
              fontSize: 14, fontWeight: 400, color: "rgba(241,242,250,0.5)", margin: 0,
            }}>
              {copyrightText || `© ${new Date().getFullYear()} PlumbFlow. All Rights Reserved.`}
            </p>
          </div>
        </ScrollReveal>
      </div>
    </footer>
  );
}
