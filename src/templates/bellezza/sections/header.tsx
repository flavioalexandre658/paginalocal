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

export function BellezzaHeader({ content, tokens, navigation }: Props) {
  const navItems = navigation || [];
  const [menuOpen, setMenuOpen] = useState(false);

  const storeName =
    typeof content.storeName === "string" ? content.storeName : "";
  const logoUrl =
    typeof content.logoUrl === "string" && content.logoUrl
      ? content.logoUrl
      : null;

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
          backgroundColor: "var(--pgl-surface, #fff)",
          borderBottom: "1px solid rgba(0,0,0,0.04)",
        }}
      >
        <nav
          role="navigation"
          aria-label="Navegacao principal"
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 36px",
            width: "100%",
            maxWidth: 1200,
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
              <img
                src={logoUrl}
                alt="Logo"
                style={{ height: 32, width: "auto", objectFit: "contain" }}
              />
            ) : (
              <span
                style={{
                  fontFamily: "var(--pgl-font-heading), serif",
                  fontSize: 28,
                  fontWeight: 400,
                  letterSpacing: "-0.02em",
                  lineHeight: "1.6",
                  color: tokens.palette.primary,
                }}
                data-pgl-path="storeName"
                data-pgl-edit="text"
              >
                {storeName}
              </span>
            )}
          </Link>

          {/* Desktop nav links */}
          <div
            className="hidden md:flex"
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 24,
              padding: "16px 0",
            }}
          >
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                style={{
                  fontFamily: "var(--pgl-font-body), sans-serif",
                  fontSize: 14,
                  fontWeight: 400,
                  letterSpacing: "0em",
                  lineHeight: "1.2em",
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

          {/* Desktop right icons — search + cart */}
          <div
            className="hidden md:flex"
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
          >
            {/* Search icon */}
            <button
              aria-label="Buscar"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 48,
                height: 48,
                borderRadius: 60,
                border: "none",
                backgroundColor: "transparent",
                cursor: "pointer",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--pgl-background, rgba(0,0,0,0.04))";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="7" stroke="var(--pgl-text)" strokeWidth="1.5" />
                <path d="M16 16l4 4" stroke="var(--pgl-text)" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>

            {/* Cart icon with badge */}
            <button
              aria-label="Carrinho"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 48,
                height: 48,
                borderRadius: 60,
                border: "none",
                backgroundColor: "transparent",
                cursor: "pointer",
                position: "relative",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--pgl-background, rgba(0,0,0,0.04))";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="var(--pgl-text)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3 6h18" stroke="var(--pgl-text)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M16 10a4 4 0 01-8 0" stroke="var(--pgl-text)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {/* Badge */}
              <span
                style={{
                  position: "absolute",
                  top: 6,
                  right: 6,
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  backgroundColor: tokens.palette.accent,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--pgl-font-body), sans-serif",
                  fontSize: 10,
                  fontWeight: 600,
                  color: "#fff",
                }}
              >
                0
              </span>
            </button>
          </div>

          {/* Mobile hamburger button */}
          <button
            className="md:hidden flex items-center"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
            style={{
              gap: 8,
              height: 40,
              padding: "8px 12px 8px 16px",
              backgroundColor: tokens.palette.primary,
              color: "#fff",
              borderRadius: 40,
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--pgl-font-body), sans-serif",
              fontSize: 14,
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
            backgroundColor: "var(--pgl-surface, #fff)",
            boxShadow: "0px 4px 24px rgba(0,0,0,0.08)",
          }}
        >
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              style={{
                padding: "10px 4px",
                fontFamily: "var(--pgl-font-body), sans-serif",
                fontSize: 16,
                fontWeight: 400,
                color: "var(--pgl-text)",
                textDecoration: "none",
              }}
            >
              {item.label}
            </a>
          ))}
        </div>
      </header>
    </>
  );
}
