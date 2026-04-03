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

export function VerveHeader({ content, tokens, navigation }: Props) {
  const navItems = navigation || [];
  const [menuOpen, setMenuOpen] = useState(false);
  const accent = tokens.palette.accent;
  const primary = tokens.palette.primary;
  const secondary = tokens.palette.secondary;

  const [scrolled, setScrolled] = useState(false);

  const storeName = typeof content.storeName === "string" ? content.storeName : "";
  const logoUrl = typeof content.logoUrl === "string" && content.logoUrl ? content.logoUrl : null;
  const ctaText = typeof content.ctaText === "string" ? content.ctaText : "Agendar";
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
    const onScroll = () => setScrolled(window.scrollY > 20);
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
        backdropFilter: scrolled ? "blur(25px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(25px)" : "none",
        backgroundColor: scrolled ? "rgba(0,0,0,0.15)" : secondary,
        boxShadow: scrolled ? "rgba(0,0,0,0.1) 0px 2px 20px 0px" : "none",
        transition: "background-color 0.3s ease, backdrop-filter 0.3s ease, box-shadow 0.3s ease",
      }}
    >
      <div style={{ display: "flex", justifyContent: "center" }}>
        <nav
          className="px-6 md:px-6"
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: 1200,
            paddingTop: 24,
            paddingBottom: 24,
          }}
        >
          {/* Logo */}
          <Link href="/" className="shrink-0" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt="Logo" style={{ height: 32, width: "auto" }} />
            ) : (
              <>
                {/* Tooth/shield icon */}
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M16 2C10 2 6 6 6 10c0 4 2 8 4 12s4 8 6 8 4-4 6-8 4-8 4-12c0-4-4-8-10-8z" stroke="#fff" strokeWidth="2" fill="none" />
                  <path d="M13 10c0 2 1.5 3 3 3s3-1 3-3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <span style={{
                  fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                  fontSize: 20, fontWeight: 600, color: "#fff",
                }}>
                  {storeName}
                </span>
              </>
            )}
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex" style={{ gap: 32, alignItems: "center" }}>
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                style={{
                  fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                  fontSize: 16, fontWeight: 300, color: "#fff",
                  textDecoration: "none", transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.7"; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Desktop CTA — outline white, 8px radius (NOT pill) */}
          <a
            href={ctaLink}
            className="hidden md:flex"
            data-pgl-path="ctaText"
            data-pgl-edit="button"
            style={{
              alignItems: "center",
              justifyContent: "center",
              height: 48,
              padding: "0 28px",
              backgroundColor: "transparent",
              border: "1.5px solid rgba(255,255,255,0.8)",
              borderRadius: 0,
              textDecoration: "none",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
          >
            <span style={{
              fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
              fontSize: 16, fontWeight: 400, color: "#fff", whiteSpace: "nowrap",
            }}>
              {ctaText}
            </span>
          </a>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex items-center justify-center"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            style={{ width: 40, height: 40, background: "none", border: "none", cursor: "pointer" }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
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

      {/* Mobile dropdown */}
      <div
        className={cn(
          "md:hidden transition-all duration-300 overflow-hidden",
          menuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
        )}
        style={{ backgroundColor: secondary, borderTop: "1px solid rgba(255,255,255,0.1)" }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 4, padding: "16px 24px 24px" }}>
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              style={{
                padding: "10px 0",
                fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                fontSize: 16, fontWeight: 300, color: "#fff",
                textDecoration: "none", borderBottom: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              {item.label}
            </a>
          ))}
          <a
            href={ctaLink}
            onClick={() => setMenuOpen(false)}
            style={{
              marginTop: 12, display: "flex", alignItems: "center", justifyContent: "center",
              height: 48, padding: "0 28px",
              backgroundColor: primary, borderRadius: 0,
              fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
              fontSize: 16, fontWeight: 400, color: "#fff", textDecoration: "none",
            }}
          >
            {ctaText}
          </a>
        </div>
      </div>
    </header>
  );
}
