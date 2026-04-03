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

export function RealesticHeader({ content, tokens, navigation }: Props) {
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

  const accent = tokens.palette.accent;

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
        className="sticky top-0 left-0 right-0 z-50 flex justify-center"
        style={{
          backgroundColor: "var(--pgl-background)",
          padding: "20px 0",
        }}
      >
        {/* Nav container — max-width 1200px, flat style (no pill) */}
        <nav
          role="navigation"
          aria-label="Navegacao principal"
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: 1200,
            padding: "0 25px",
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            className="shrink-0"
            style={{ display: "flex", alignItems: "center", textDecoration: "none" }}
          >
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoUrl}
                alt="Logo"
                style={{ height: 32, width: "auto", objectFit: "contain" }}
              />
            ) : (
              <span
                style={{
                  fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                  fontSize: 24,
                  fontWeight: 500,
                  letterSpacing: "-0.03em",
                  color: "var(--pgl-text)",
                }}
                data-pgl-path="storeName"
                data-pgl-edit="text"
              >
                {storeName}
              </span>
            )}
          </Link>

          {/* Desktop nav links + CTA */}
          <div
            className="hidden md:flex"
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 0,
            }}
          >
            {/* Nav links */}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
              }}
            >
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  style={{
                    padding: "8px 14px",
                    fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                    fontSize: 18,
                    fontWeight: 500,
                    letterSpacing: "-0.03em",
                    lineHeight: "1.3em",
                    color: "var(--pgl-text)",
                    textDecoration: "none",
                    transition: "opacity 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = "0.6";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = "1";
                  }}
                  {...(item.isExternal
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  {item.label}
                </a>
              ))}
            </div>

            {/* CTA Button — accent pill */}
            {ctaText && (
              <a
                href={ctaLink}
                data-pgl-path="ctaText"
                data-pgl-edit="button"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  padding: "14px 26px",
                  backgroundColor: accent,
                  borderRadius: 1000,
                  textDecoration: "none",
                  marginLeft: 16,
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = "0.9";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "1";
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                    fontSize: 16,
                    fontWeight: 500,
                    letterSpacing: "-0.03em",
                    color: "#fff",
                    whiteSpace: "nowrap",
                  }}
                >
                  {ctaText}
                </span>
              </a>
            )}
          </div>

          {/* Mobile hamburger button */}
          <button
            className="md:hidden flex items-center"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
            style={{
              gap: 8,
              height: 44,
              padding: "10px 16px",
              backgroundColor: "var(--pgl-text)",
              color: "#fff",
              borderRadius: 1000,
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
              fontSize: 15,
              fontWeight: 500,
              whiteSpace: "nowrap",
            }}
          >
            <span>{menuOpen ? "Fechar" : "Menu"}</span>
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              style={{ flexShrink: 0 }}
            >
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

        {/* Mobile dropdown overlay */}
        <div
          className={cn(
            "md:hidden transition-all duration-300 absolute top-full left-0 right-0",
            menuOpen
              ? "opacity-100 pointer-events-auto translate-y-0"
              : "opacity-0 pointer-events-none -translate-y-2"
          )}
          style={{
            padding: "16px 25px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 4,
            backgroundColor: "var(--pgl-background)",
            borderBottom: "1px solid rgba(0,0,0,0.06)",
          }}
        >
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              style={{
                padding: "10px 0",
                fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                fontSize: 18,
                fontWeight: 500,
                letterSpacing: "-0.03em",
                lineHeight: "1.3em",
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
                marginTop: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "14px 26px",
                backgroundColor: accent,
                borderRadius: 1000,
                fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
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
