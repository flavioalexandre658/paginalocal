"use client";

import { useState } from "react";
import type { DesignTokens } from "@/types/ai-generation";

interface Props {
  content: Record<string, unknown>;
  tokens: DesignTokens;
  isDark?: boolean;
  navigation?: { label: string; href: string; isExternal?: boolean }[];
}

/* ── Arrow icon (Larko arrow rotated -45deg) ── */
function ArrowIcon({ color }: { color: string }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 14 13"
      fill="none"
      style={{ display: "block", transform: "rotate(-45deg)" }}
    >
      <path
        d="M1 6.5h12M8 1l5 5.5L8 12"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LarkoHeader({ content, tokens, navigation }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  const storeName =
    typeof content.storeName === "string" ? content.storeName : "";
  const ctaText =
    typeof content.ctaText === "string" ? content.ctaText : "Fale conosco";
  const ctaLink =
    typeof content.ctaLink === "string" ? content.ctaLink : "#contato";

  const primary = tokens.palette.primary;
  const accent = tokens.palette.accent;

  const navLinks = navigation || [];

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        width: "100%",
        backgroundColor: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      {/* Nav bar — padding 15px 0 */}
      <div
        style={{
          padding: "15px 0",
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {/* Base container — max-width 1440, padding 0 55px */}
        <div
          className="px-5 md:px-[55px]"
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            maxWidth: 1440,
          }}
        >
          {/* ── Logo ── */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              width: 100,
            }}
            data-pgl-path="storeName"
            data-pgl-edit="text"
          >
            {/* Leaf icon */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-3A12 12 0 0 0 21 9c0-1-1-2-2-2h-2z"
                fill={accent}
              />
            </svg>
            <span
              style={{
                fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                fontSize: 20,
                fontWeight: 600,
                color: primary,
                whiteSpace: "nowrap",
              }}
            >
              {storeName}
            </span>
          </div>

          {/* ── Nav Links — desktop ── */}
          <nav
            className="hidden md:flex"
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 60,
            }}
          >
            {navLinks.map((link, i) => (
              <a
                key={i}
                href={link.href}
                style={{
                  fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                  fontSize: 16,
                  fontWeight: 500,
                  lineHeight: "1.5em",
                  letterSpacing: "0em",
                  color: "var(--pgl-text)",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = accent; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "var(--pgl-text)"; }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* ── CTA Button — pill, dark green bg ── */}
          <div className="hidden md:flex" style={{ alignItems: "center" }}>
            <a
              href={ctaLink}
              data-pgl-path="ctaText"
              data-pgl-edit="button"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0,
                backgroundColor: primary,
                borderRadius: 50,
                padding: "6px 6px 6px 20px",
                textDecoration: "none",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.9"; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
            >
              <span
                style={{
                  fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                  fontSize: 16,
                  fontWeight: 500,
                  lineHeight: "1.5em",
                  color: "#fff",
                }}
              >
                {ctaText}
              </span>
              {/* Icon circle — white bg with dark arrow */}
              <div style={{
                padding: 13,
                backgroundColor: "#fff",
                borderRadius: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginLeft: 10,
              }}>
                <ArrowIcon color={primary} />
              </div>
            </a>
          </div>

          {/* ── Mobile hamburger ── */}
          <button
            className="flex md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 8,
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-label="Menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={primary} strokeWidth="2" strokeLinecap="round">
              {menuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* ── Mobile menu dropdown ── */}
      {menuOpen && (
        <div
          className="md:hidden"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
            padding: "20px",
            backgroundColor: "#fff",
            borderTop: "1px solid var(--pgl-border, #f1f1f1)",
          }}
        >
          {navLinks.map((link, i) => (
            <a
              key={i}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                fontSize: 16,
                fontWeight: 500,
                color: "var(--pgl-text)",
                textDecoration: "none",
              }}
            >
              {link.label}
            </a>
          ))}
          <a
            href={ctaLink}
            onClick={() => setMenuOpen(false)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              backgroundColor: primary,
              borderRadius: 50,
              padding: "10px 24px",
              textDecoration: "none",
              color: "#fff",
              fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
              fontSize: 16,
              fontWeight: 500,
            }}
          >
            {ctaText}
          </a>
        </div>
      )}
    </header>
  );
}
