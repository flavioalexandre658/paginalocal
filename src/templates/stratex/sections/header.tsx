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

export function StratexHeader({ content, tokens, navigation }: Props) {
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

  /* Arrow icon pointing top-right (used in CTA button) */
  const ArrowIcon = ({ color = "#fff", size = 14 }: { color?: string; size?: number }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      style={{ flexShrink: 0 }}
    >
      <path
        d="M1.5 12.5L12.5 1.5M12.5 1.5H4.5M12.5 1.5V9.5"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <>
      <header
        data-pgl-edit="nav"
        data-pgl-path="nav"
        role="banner"
        className="sticky top-0 left-0 right-0 z-50 flex justify-center"
        style={{
          backgroundColor: "var(--pgl-background)",
          padding: "18px 0",
        }}
      >
        {/* Nav container — max-width 1200px */}
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
          {/* Logo — green square icon + serif brand name */}
          <Link
            href="/"
            className="shrink-0"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              textDecoration: "none",
            }}
          >
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoUrl}
                alt="Logo"
                style={{ height: 38, width: "auto", objectFit: "contain" }}
              />
            ) : (
              <>
                {/* Green square icon wrapper */}
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 38,
                    height: 38,
                    backgroundColor: accent,
                    borderRadius: 10,
                    boxShadow:
                      "rgba(0,0,0,0.07) 0px 0px 12px, rgba(255,255,255,0.25) 0px 2px 4px inset",
                    flexShrink: 0,
                  }}
                >
                  {/* Simple "S" letter as logo icon */}
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    style={{ flexShrink: 0 }}
                  >
                    <path
                      d="M6 6.5C6 5.12 7.34 4 9 4h2c1.66 0 3 1.12 3 2.5S12.66 9 11 9H9C7.34 9 6 10.12 6 11.5S7.34 14 9 14h2c1.66 0 3-1.12 3-2.5"
                      stroke="#fff"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <line
                      x1="10"
                      y1="2.5"
                      x2="10"
                      y2="4"
                      stroke="#fff"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                    <line
                      x1="10"
                      y1="14"
                      x2="10"
                      y2="15.5"
                      stroke="#fff"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>

                {/* Brand name — serif */}
                <span
                  style={{
                    fontFamily: "var(--pgl-font-heading), Georgia, serif",
                    fontSize: 22,
                    fontWeight: 400,
                    letterSpacing: "-0.01em",
                    color: "var(--pgl-text)",
                  }}
                  data-pgl-path="storeName"
                  data-pgl-edit="text"
                >
                  {storeName}
                </span>
              </>
            )}
          </Link>

          {/* Desktop nav links */}
          <div
            className="hidden md:flex"
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 0,
            }}
          >
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
                    padding: "8px 16px",
                    fontFamily: "var(--pgl-font-heading), Georgia, serif",
                    fontSize: 16,
                    fontWeight: 400,
                    lineHeight: "1.4em",
                    color: "var(--pgl-text)",
                    textDecoration: "none",
                    transition: "opacity 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = "0.55";
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

            {/* CTA Button — white pill with text + green circle arrow */}
            {ctaText && (
              <a
                href={ctaLink}
                data-pgl-path="ctaText"
                data-pgl-edit="button"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 6px 6px 20px",
                  backgroundColor: "var(--pgl-background)",
                  border: "1px solid rgba(0,0,0,0.1)",
                  borderRadius: 1000,
                  textDecoration: "none",
                  marginLeft: 16,
                  transition: "border-color 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(0,0,0,0.2)";
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--pgl-font-heading), Georgia, serif",
                    fontSize: 15,
                    fontWeight: 400,
                    color: "var(--pgl-text)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {ctaText}
                </span>
                {/* Green circle with arrow */}
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 34,
                    height: 34,
                    backgroundColor: accent,
                    borderRadius: 1000,
                    flexShrink: 0,
                  }}
                >
                  <ArrowIcon color="#fff" size={13} />
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
              padding: "6px 6px 6px 16px",
              backgroundColor: "var(--pgl-background)",
              border: "1px solid rgba(0,0,0,0.1)",
              color: "var(--pgl-text)",
              borderRadius: 1000,
              cursor: "pointer",
              fontFamily: "var(--pgl-font-heading), Georgia, serif",
              fontSize: 15,
              fontWeight: 400,
              whiteSpace: "nowrap",
            }}
          >
            <span>{menuOpen ? "Fechar" : "Menu"}</span>
            {/* Green circle with hamburger/close icon */}
            <span
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 32,
                height: 32,
                backgroundColor: accent,
                borderRadius: 1000,
                flexShrink: 0,
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                style={{ flexShrink: 0 }}
              >
                {menuOpen ? (
                  <>
                    <line x1="4" y1="4" x2="12" y2="12" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="12" y1="4" x2="4" y2="12" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
                  </>
                ) : (
                  <>
                    <line x1="3" y1="4.5" x2="13" y2="4.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="3" y1="8" x2="13" y2="8" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="3" y1="11.5" x2="13" y2="11.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
                  </>
                )}
              </svg>
            </span>
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
                fontFamily: "var(--pgl-font-heading), Georgia, serif",
                fontSize: 18,
                fontWeight: 400,
                lineHeight: "1.4em",
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
                gap: 8,
                padding: "10px 20px 10px 24px",
                backgroundColor: "var(--pgl-background)",
                border: "1px solid rgba(0,0,0,0.1)",
                borderRadius: 1000,
                fontFamily: "var(--pgl-font-heading), Georgia, serif",
                fontSize: 16,
                fontWeight: 400,
                color: "var(--pgl-text)",
                textDecoration: "none",
              }}
            >
              <span>{ctaText}</span>
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 32,
                  height: 32,
                  backgroundColor: accent,
                  borderRadius: 1000,
                  flexShrink: 0,
                }}
              >
                <ArrowIcon color="#fff" size={12} />
              </span>
            </a>
          )}
        </div>
      </header>
    </>
  );
}
