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

export function RooforaHeader({ content, tokens, navigation }: Props) {
  const navItems = navigation || [];
  const [menuOpen, setMenuOpen] = useState(false);

  const storeName = typeof content.storeName === "string" ? content.storeName : "";
  const logoUrl = typeof content.logoUrl === "string" && content.logoUrl ? content.logoUrl : null;
  const ctaText = typeof content.ctaText === "string" ? content.ctaText : null;
  const ctaLink = typeof content.ctaLink === "string" ? content.ctaLink : "#contato";

  const accent = tokens.palette.accent || "#CDF660";

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
        style={{ backgroundColor: "#0E1201" }}
      >
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
              paddingTop: 20,
              paddingBottom: 20,
              width: "100%",
              maxWidth: 1296,
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
                  data-pgl-path="storeName"
                  data-pgl-edit="text"
                  style={{
                    fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                    fontSize: 24,
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
              style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 36 }}
            >
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  style={{
                    fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                    fontSize: 16,
                    fontWeight: 500,
                    letterSpacing: "-0.01em",
                    lineHeight: "1.5em",
                    color: "rgba(255,255,255,0.7)",
                    textDecoration: "none",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = accent;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "rgba(255,255,255,0.7)";
                  }}
                  {...(item.isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  {item.label}
                </a>
              ))}
            </div>

            {/* Desktop CTA button — lime green pill, dark text */}
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
                  padding: "12px 28px",
                  backgroundColor: accent,
                  borderRadius: 100,
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
                <span
                  style={{
                    fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                    fontSize: 16,
                    fontWeight: 600,
                    letterSpacing: "-0.01em",
                    color: "#0E1201",
                    whiteSpace: "nowrap",
                  }}
                >
                  {ctaText}
                </span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="#0E1201" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            )}

            {/* Mobile hamburger */}
            <button
              className="md:hidden flex items-center justify-center"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={menuOpen}
              style={{
                width: 44,
                height: 44,
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
            backgroundColor: "rgba(14,18,1,0.98)",
            borderTop: "1px solid rgba(252,255,245,0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
              padding: "16px 30px 24px",
              maxWidth: 1296,
              margin: "0 auto",
            }}
          >
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  padding: "12px 0",
                  fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                  fontSize: 16,
                  fontWeight: 500,
                  letterSpacing: "-0.01em",
                  color: "rgba(255,255,255,0.7)",
                  textDecoration: "none",
                  borderBottom: "1px solid rgba(252,255,245,0.1)",
                }}
              >
                {item.label}
              </a>
            ))}

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
                  padding: "12px 28px",
                  backgroundColor: accent,
                  borderRadius: 100,
                  fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                  fontSize: 16,
                  fontWeight: 600,
                  color: "#0E1201",
                  textDecoration: "none",
                }}
              >
                {ctaText}
              </a>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
