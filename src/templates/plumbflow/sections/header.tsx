"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { DesignTokens } from "@/types/ai-generation";

interface Props {
  content: Record<string, unknown>;
  tokens: DesignTokens;
  isDark?: boolean;
  navigation?: { label: string; href: string; isExternal?: boolean }[];
}

/* ────────────────────────────────────────────── SVG icons ─── */

function PhoneIcon({ color = "#fff", size = 16 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path
        d="M14.5 11.35v1.95a1.3 1.3 0 0 1-1.42 1.3 12.86 12.86 0 0 1-5.6-2 12.66 12.66 0 0 1-3.9-3.9 12.86 12.86 0 0 1-2-5.62A1.3 1.3 0 0 1 2.87 1.5H4.82a1.3 1.3 0 0 1 1.3 1.12c.08.63.23 1.25.44 1.84a1.3 1.3 0 0 1-.29 1.37l-.83.83a10.4 10.4 0 0 0 3.9 3.9l.83-.83a1.3 1.3 0 0 1 1.37-.29c.59.21 1.21.36 1.84.44a1.3 1.3 0 0 1 1.12 1.32Z"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MailIcon({ color = "#fff", size = 16 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <rect x="1.5" y="3" width="13" height="10" rx="2" stroke={color} strokeWidth="1.2" />
      <path d="M1.5 5l6.5 4 6.5-4" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ClockIcon({ color = "#fff", size = 16 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.5" stroke={color} strokeWidth="1.2" />
      <path d="M8 4.5V8l2.5 1.5" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ────────────────────────────────────────────── Component ─── */

export function PlumbflowHeader({ content, tokens, navigation }: Props) {
  const navItems = navigation || [];
  const [menuOpen, setMenuOpen] = useState(false);

  const storeName = typeof content.storeName === "string" ? content.storeName : "";
  const logoUrl = typeof content.logoUrl === "string" && content.logoUrl ? content.logoUrl : null;
  const ctaText = typeof content.ctaText === "string" ? content.ctaText : null;
  const ctaLink = typeof content.ctaLink === "string" ? content.ctaLink : "#contato";
  const phone = typeof content.phone === "string" ? content.phone : "";
  const email = typeof content.email === "string" ? content.email : "";
  const tagline = typeof content.tagline === "string" ? content.tagline : "";

  useEffect(() => {
    if (menuOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.overflow = "hidden";
    } else {
      const top = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.overflow = "";
      if (top) window.scrollTo(0, parseInt(top) * -1);
    }
    return () => {
      const top = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.overflow = "";
      if (top) window.scrollTo(0, parseInt(top) * -1);
    };
  }, [menuOpen]);

  return (
    <>
      <header
        data-pgl-edit="nav"
        data-pgl-path="nav"
        role="banner"
        className="sticky top-0 left-0 right-0 z-50"
        style={{ backgroundColor: "var(--pgl-primary, #142F45)" }}
      >
        {/* ═══ TOP BAR — só exibe se tem phone, email ou tagline ═══ */}
        {(phone || email || tagline) && (
        <div className="hidden md:flex" style={{ justifyContent: "center", borderBottom: "1px solid rgba(241,242,250,0.2)" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              width: "100%",
              maxWidth: 1200,
              padding: "8px 30px",
            }}
          >
            {/* Phone */}
            {phone && (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <PhoneIcon />
                <a
                  href={`tel:${phone}`}
                  style={{
                    fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                    fontSize: 14,
                    fontWeight: 500,
                    letterSpacing: "0px",
                    lineHeight: "1.7em",
                    color: "#fff",
                    textDecoration: "none",
                  }}
                >
                  {phone}
                </a>
              </div>
            )}

            {/* Divider */}
            {phone && email && (
              <div style={{ width: 1, height: 16, backgroundColor: "rgba(241,242,250,0.2)", margin: "0 16px" }} />
            )}

            {/* Email */}
            {email && (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <MailIcon />
                <a
                  href={`mailto:${email}`}
                  style={{
                    fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                    fontSize: 14,
                    fontWeight: 500,
                    letterSpacing: "0px",
                    lineHeight: "1.7em",
                    color: "#fff",
                    textDecoration: "none",
                  }}
                >
                  {email}
                </a>
              </div>
            )}

            {/* Divider */}
            {email && (
              <div style={{ width: 1, height: 16, backgroundColor: "rgba(241,242,250,0.2)", margin: "0 16px" }} />
            )}

            {/* Tagline / 24h */}
            {tagline && (
              <>
                <div style={{ width: 1, height: 16, backgroundColor: "rgba(241,242,250,0.2)", margin: "0 16px" }} />
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <ClockIcon />
                  <span
                    style={{
                      fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                      fontSize: 14,
                      fontWeight: 500,
                      letterSpacing: "0px",
                      lineHeight: "1.7em",
                      color: "#fff",
                    }}
                  >
                    {tagline}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
        )}

        {/* ═══ MAIN NAV ═══ */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <nav
            role="navigation"
            aria-label="Navegacao principal"
            className="px-5 md:px-[30px]"
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: 12,
              paddingBottom: 12,
              width: "100%",
              maxWidth: 1200,
              gap: 24,
            }}
          >
            {/* Logo */}
            <Link
              href="/"
              className="shrink-0"
              style={{ display: "flex", alignItems: "center", gap: 8 }}
            >
              {logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logoUrl} alt="Logo" style={{ height: 36, width: "auto", objectFit: "contain" }} />
              ) : (
                <span
                  style={{
                    fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                    fontSize: 20,
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                    color: "#fff",
                  }}
                >
                  {storeName}
                </span>
              )}
            </Link>

            {/* Desktop nav links */}
            <div
              className="hidden md:flex"
              style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 48 }}
            >
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  style={{
                    fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                    fontSize: 16,
                    fontWeight: 700,
                    letterSpacing: "0.3px",
                    lineHeight: "1.7em",
                    color: "#fff",
                    textDecoration: "none",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = tokens.palette.accent || "#FF5E15";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "#fff";
                  }}
                  {...(item.isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  {item.label}
                </a>
              ))}
            </div>

            {/* Desktop CTA button */}
            {ctaText && (
              <a
                href={ctaLink}
                className="hidden md:flex"
                data-pgl-path="ctaText"
                data-pgl-edit="button"
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  padding: "12px 24px",
                  backgroundColor: tokens.palette.accent || "#F96339",
                  borderRadius: 58,
                  boxShadow: "rgba(255,255,255,0.4) 0px 4px 7px 0px inset",
                  textDecoration: "none",
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
                <PhoneIcon color="#fff" size={16} />
                <span
                  style={{
                    fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                    fontSize: 16,
                    fontWeight: 700,
                    letterSpacing: "0.3px",
                    color: "#fff",
                    whiteSpace: "nowrap",
                  }}
                >
                  {ctaText}
                </span>
              </a>
            )}

            {/* Mobile hamburger — plain white icon, no background */}
            <button
              className="md:hidden flex items-center justify-center"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={menuOpen}
              style={{
                width: 40,
                height: 40,
                padding: 0,
                backgroundColor: "transparent",
                color: "#fff",
                border: "none",
                cursor: "pointer",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                {menuOpen ? (
                  <>
                    <line x1="5" y1="5" x2="19" y2="19" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                    <line x1="19" y1="5" x2="5" y2="19" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                  </>
                ) : (
                  <>
                    <line x1="4" y1="6" x2="20" y2="6" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                    <line x1="4" y1="12" x2="20" y2="12" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                    <line x1="4" y1="18" x2="20" y2="18" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                  </>
                )}
              </svg>
            </button>
          </nav>
        </div>

        {/* ═══ MOBILE DROPDOWN ═══ */}
        <div
          className={cn(
            "md:hidden transition-all duration-300 overflow-hidden",
            menuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          )}
          style={{
            backgroundColor: "rgba(20,47,69,0.98)",
            borderTop: "1px solid rgba(241,242,250,0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
              padding: "16px 30px 24px",
              maxWidth: 1200,
              margin: "0 auto",
            }}
          >
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  padding: "10px 0",
                  fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                  fontSize: 16,
                  fontWeight: 700,
                  letterSpacing: "0.3px",
                  color: "#fff",
                  textDecoration: "none",
                  borderBottom: "1px solid rgba(241,242,250,0.1)",
                }}
              >
                {item.label}
              </a>
            ))}

            {/* Mobile top bar info */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
              {phone && (
                <a
                  href={`tel:${phone}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                    fontSize: 14,
                    fontWeight: 500,
                    color: "rgba(255,255,255,0.7)",
                    textDecoration: "none",
                  }}
                >
                  <PhoneIcon color="rgba(255,255,255,0.7)" size={14} />
                  {phone}
                </a>
              )}
              {email && (
                <a
                  href={`mailto:${email}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                    fontSize: 14,
                    fontWeight: 500,
                    color: "rgba(255,255,255,0.7)",
                    textDecoration: "none",
                  }}
                >
                  <MailIcon color="rgba(255,255,255,0.7)" size={14} />
                  {email}
                </a>
              )}
            </div>

            {/* Mobile CTA */}
            {ctaText && (
              <a
                href={ctaLink}
                onClick={() => setMenuOpen(false)}
                style={{
                  marginTop: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  height: 48,
                  padding: "12px 24px",
                  backgroundColor: tokens.palette.accent || "#F96339",
                  borderRadius: 58,
                  boxShadow: "rgba(255,255,255,0.4) 0px 4px 7px 0px inset",
                  fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#fff",
                  textDecoration: "none",
                }}
              >
                <PhoneIcon color="#fff" size={16} />
                {ctaText}
              </a>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
