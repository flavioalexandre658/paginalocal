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

export function GroviaHeader({ content, tokens, navigation }: Props) {
  const navItems = navigation || [];
  const [menuOpen, setMenuOpen] = useState(false);

  const storeName =
    typeof content.storeName === "string" ? content.storeName : "";
  const logoUrl =
    typeof content.logoUrl === "string" && content.logoUrl
      ? content.logoUrl
      : null;
  const ctaText =
    typeof content.ctaText === "string" ? content.ctaText : null;
  const ctaLink =
    typeof content.ctaLink === "string" ? content.ctaLink : "#contato";

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
      {/* Header wrapper — fixed, centered on desktop, full-width padded on mobile */}
      <header
        data-pgl-edit="nav"
        data-pgl-path="nav"
        role="banner"
        className="sticky top-0 left-0 right-0 z-50 flex justify-center"
        style={{ padding: "24px 16px 0" }}
      >
        {/* Nav pill */}
        <nav
          role="navigation"
          aria-label="Navegacao principal"
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "8px 12px",
            backgroundColor: "var(--pgl-surface, rgb(255,255,255))",
            borderRadius: 58,
            boxShadow: "rgba(224, 215, 198, 0.5) 0px 1px 20px 0px",
            width: "100%",
            maxWidth: 900,
          }}
        >
          {/* Logo — always visible */}
          <Link
            href="/"
            className="shrink-0"
            style={{ display: "flex", alignItems: "center", gap: 8, paddingLeft: 8 }}
          >
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt="Logo" style={{ height: 28, width: "auto", objectFit: "contain" }} />
            ) : (
              <span
                style={{
                  fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                  fontSize: 18,
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                  color: "var(--pgl-text)",
                }}
                data-pgl-path="storeName"
                data-pgl-edit="text"
              >
                {storeName}
              </span>
            )}
          </Link>

          {/* Desktop nav links — hidden on mobile */}
          <div
            className="hidden md:flex"
            style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 4, padding: "0 8px" }}
          >
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                style={{
                  padding: 4,
                  fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                  fontSize: 16,
                  fontWeight: 500,
                  letterSpacing: "-0.03em",
                  lineHeight: "1.4em",
                  color: "var(--pgl-text)",
                  textDecoration: "none",
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.6"; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
                {...(item.isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Desktop CTA — hidden on mobile */}
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
                gap: 12,
                height: 44,
                padding: "8px 8px 8px 16px",
                backgroundColor: "var(--pgl-text, rgb(0,0,0))",
                borderRadius: 32,
                boxShadow: "0px 5px 15px 0px rgba(0,0,0,0.2)",
                textDecoration: "none",
              }}
            >
              <span style={{ fontFamily: "var(--pgl-font-body)", fontSize: 16, fontWeight: 500, letterSpacing: "-0.03em", color: "#fff", whiteSpace: "nowrap" }}>
                {ctaText}
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: 40, backgroundColor: "#fff", flexShrink: 0 }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8M8 4l3 3-3 3" stroke="var(--pgl-text,#000)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
            </a>
          )}

          {/* Mobile "Menu" pill button — black pill with text + hamburger */}
          <button
            className="md:hidden flex items-center"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
            style={{
              gap: 8,
              height: 40,
              padding: "8px 12px 8px 16px",
              backgroundColor: "var(--pgl-text)",
              color: "#fff",
              borderRadius: 32,
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
              fontSize: 14,
              fontWeight: 500,
              whiteSpace: "nowrap",
            }}
          >
            <span>{menuOpen ? "Fechar" : "Menu"}</span>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
              {menuOpen ? (
                <>
                  <line x1="4" y1="4" x2="14" y2="14" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="14" y1="4" x2="4" y2="14" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
                </>
              ) : (
                <>
                  <line x1="3" y1="5" x2="15" y2="5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="3" y1="9" x2="15" y2="9" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="3" y1="13" x2="15" y2="13" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
                </>
              )}
            </svg>
          </button>
        </nav>

        {/* Mobile dropdown */}
        <div
          className={cn(
            "md:hidden transition-all duration-300 absolute top-full left-4 right-4 mt-2",
            menuOpen
              ? "opacity-100 pointer-events-auto translate-y-0"
              : "opacity-0 pointer-events-none -translate-y-2"
          )}
          style={{
            borderRadius: 20,
            padding: 24,
            display: "flex",
            flexDirection: "column",
            gap: 8,
            backgroundColor: "var(--pgl-surface, rgb(255,255,255))",
            boxShadow: "rgba(224, 215, 198, 0.5) 0px 1px 20px 0px",
          }}
        >
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              style={{
                padding: "8px 4px",
                fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                fontSize: 16,
                fontWeight: 500,
                letterSpacing: "-0.03em",
                color: "var(--pgl-text)",
                textDecoration: "none",
              }}
            >
              {item.label}
            </a>
          ))}
          {ctaText && (
            <a
              href={ctaLink}
              onClick={() => setMenuOpen(false)}
              style={{
                marginTop: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                height: 44,
                padding: "8px 16px",
                backgroundColor: "var(--pgl-text, rgb(0,0,0))",
                borderRadius: 32,
                fontFamily: "var(--pgl-font-body)",
                fontSize: 16,
                fontWeight: 500,
                color: "#fff",
                textDecoration: "none",
              }}
            >
              {ctaText}
            </a>
          )}
        </div>
      </header>
    </>
  );
}
