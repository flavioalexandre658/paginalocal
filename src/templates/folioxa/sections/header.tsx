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

export function FolioxaHeader({ content, tokens, navigation }: Props) {
  const navItems = navigation || [];
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const accent = tokens.palette.accent;
  const primary = tokens.palette.primary;

  const storeName = typeof content.storeName === "string" ? content.storeName : "";
  const logoUrl = typeof content.logoUrl === "string" && content.logoUrl ? content.logoUrl : null;
  const ctaText = typeof content.ctaText === "string" ? content.ctaText : "Contato";
  const ctaLink = typeof content.ctaLink === "string" ? content.ctaLink : "#contato";

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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-pgl-edit="nav"
      data-pgl-path="nav"
      role="banner"
      className="sticky top-0 left-0 right-0 z-50"
      style={{
        backgroundColor: "transparent",
        padding: "12px 20px 0",
      }}
    >
      <div style={{ display: "flex", justifyContent: "center" }}>
        <nav
          className="px-5 md:px-8"
          style={{
            display: "flex", flexDirection: "row", alignItems: "center",
            justifyContent: "space-between", width: "100%", maxWidth: 1200,
            paddingTop: 14, paddingBottom: 14,
            backgroundColor: "#fff",
            borderRadius: 16,
            backdropFilter: "blur(7px)",
            WebkitBackdropFilter: "blur(7px)",
            boxShadow: "rgba(0,0,0,0.03) 0px 1px 3px 0px, rgba(0,0,0,0.03) 0px 4px 15px 0px",
            border: "1px solid var(--pgl-border, #edeff3)",
          }}
        >
          {/* Logo — icon + name */}
          <Link href="/" className="shrink-0" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt="Logo" style={{ height: 28, width: "auto" }} />
            ) : (
              <>
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  backgroundColor: accent, display: "flex",
                  alignItems: "center", justifyContent: "center",
                }}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M3 3h12v4H9v8H3V3z" fill="#fff" />
                  </svg>
                </div>
                <span style={{
                  fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                  fontSize: 20, fontWeight: 600, color: primary,
                }}>
                  {storeName}
                </span>
              </>
            )}
          </Link>

          {/* Desktop nav links — dark text */}
          <div className="hidden md:flex" style={{ gap: 28, alignItems: "center" }}>
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                style={{
                  fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                  fontSize: 15, fontWeight: 400, color: "var(--pgl-text-muted)",
                  textDecoration: "none", transition: "color 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = primary; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "var(--pgl-text-muted)"; }}
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Desktop CTA — outline dark border, pill */}
          <a
            href={ctaLink}
            className="hidden md:flex"
            data-pgl-path="ctaText"
            data-pgl-edit="button"
            style={{
              alignItems: "center", justifyContent: "center",
              height: 40, padding: "10px 20px",
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
              fontSize: 15, fontWeight: 500, color: "var(--pgl-text)", whiteSpace: "nowrap",
            }}>
              {ctaText}
            </span>
          </a>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex items-center justify-center"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ width: 40, height: 40, background: "none", border: "none", cursor: "pointer" }}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              {menuOpen ? (
                <>
                  <line x1="4" y1="4" x2="18" y2="18" stroke={primary} strokeWidth="2" strokeLinecap="round" />
                  <line x1="18" y1="4" x2="4" y2="18" stroke={primary} strokeWidth="2" strokeLinecap="round" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="19" y2="6" stroke={primary} strokeWidth="2" strokeLinecap="round" />
                  <line x1="3" y1="11" x2="19" y2="11" stroke={primary} strokeWidth="2" strokeLinecap="round" />
                  <line x1="3" y1="16" x2="19" y2="16" stroke={primary} strokeWidth="2" strokeLinecap="round" />
                </>
              )}
            </svg>
          </button>
        </nav>
      </div>

      {/* Mobile dropdown */}
      <div
        className={cn(
          "md:hidden transition-all duration-300 overflow-hidden",
          menuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
        )}
        style={{ backgroundColor: "#fff", borderTop: "1px solid rgba(0,0,0,0.06)" }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 4, padding: "12px 20px 20px" }}>
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              style={{
                padding: "10px 0", fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                fontSize: 15, fontWeight: 400, color: primary,
                textDecoration: "none", borderBottom: "1px solid rgba(0,0,0,0.05)",
              }}
            >
              {item.label}
            </a>
          ))}
          <a
            href={ctaLink}
            onClick={() => setMenuOpen(false)}
            style={{
              marginTop: 8, display: "flex", alignItems: "center", justifyContent: "center",
              height: 42, border: `1.5px solid ${primary}`, borderRadius: 14,
              fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
              fontSize: 15, fontWeight: 500, color: primary, textDecoration: "none",
            }}
          >
            {ctaText}
          </a>
        </div>
      </div>
    </header>
  );
}
