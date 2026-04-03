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

export function CleanlyHeader({ content, tokens, navigation }: Props) {
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
  const phone =
    typeof content.phone === "string" ? content.phone : null;
  const email =
    typeof content.email === "string" ? content.email : null;

  const accent = tokens.palette.accent;
  const dark = tokens.palette.text;

  /* Scroll lock when mobile menu is open */
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

  /* Arrow icon pointing top-right */
  const ArrowIcon = ({
    color = "#fff",
    size = 14,
  }: {
    color?: string;
    size?: number;
  }) => (
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

  /* Phone icon */
  const PhoneIcon = ({ color = "#fff", size = 14 }: { color?: string; size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <path
        d="M6.09 7.41a8.67 8.67 0 0 0 2.5 2.5l.84-.84a.56.56 0 0 1 .56-.13 6.4 6.4 0 0 0 2 .32.56.56 0 0 1 .56.56v1.96a.56.56 0 0 1-.56.56A9.44 9.44 0 0 1 2.56 2.9a.56.56 0 0 1 .56-.56h1.96a.56.56 0 0 1 .56.56c0 .69.11 1.36.32 2a.56.56 0 0 1-.14.56l-.83.84Z"
        stroke={color}
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  /* Email icon */
  const EmailIcon = ({ color = "#fff", size = 14 }: { color?: string; size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <rect x="2" y="3.5" width="12" height="9" rx="1.5" stroke={color} strokeWidth="1.1" />
      <path d="M2.5 4.5L8 8.5l5.5-4" stroke={color} strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  return (
    <>
      <header
        data-pgl-edit="nav"
        data-pgl-path="nav"
        role="banner"
        className="sticky top-0 left-0 right-0 z-50"
        style={{ backgroundColor: dark }}
      >
        {/* ── Top info bar ── */}
        {(phone || email) && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <div
              className="hidden sm:flex"
              style={{
                width: "100%",
                maxWidth: 1200,
                padding: "8px 25px",
                flexDirection: "row",
                alignItems: "center",
                gap: 20,
                fontSize: 13,
                fontFamily: "var(--pgl-font-body), Inter, sans-serif",
                color: "rgba(255,255,255,0.7)",
              }}
            >
              {phone && (
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    color: "inherit",
                    textDecoration: "none",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "rgba(255,255,255,1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "rgba(255,255,255,0.7)";
                  }}
                >
                  <PhoneIcon color="rgba(255,255,255,0.7)" size={13} />
                  <span data-pgl-path="phone" data-pgl-edit="text">
                    {phone}
                  </span>
                </a>
              )}
              {email && (
                <a
                  href={`mailto:${email}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    color: "inherit",
                    textDecoration: "none",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "rgba(255,255,255,1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "rgba(255,255,255,0.7)";
                  }}
                >
                  <EmailIcon color="rgba(255,255,255,0.7)" size={13} />
                  <span data-pgl-path="email" data-pgl-edit="text">
                    {email}
                  </span>
                </a>
              )}
            </div>
          </div>
        )}

        {/* ── Main navigation row ── */}
        <div style={{ display: "flex", justifyContent: "center" }}>
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
              padding: "14px 25px",
            }}
          >
            {/* Logo */}
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
                  style={{ height: 36, width: "auto", objectFit: "contain" }}
                />
              ) : (
                <>
                  {/* Sparkle cleaning icon */}
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 36,
                      height: 36,
                      backgroundColor: accent,
                      borderRadius: 10,
                      flexShrink: 0,
                    }}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      style={{ flexShrink: 0 }}
                    >
                      <path
                        d="M10 2L11.5 7.5L17 6L12.5 10L17 14L11.5 12.5L10 18L8.5 12.5L3 14L7.5 10L3 6L8.5 7.5L10 2Z"
                        stroke={dark}
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                      />
                    </svg>
                  </span>

                  {/* Brand name */}
                  <span
                    style={{
                      fontFamily: "var(--pgl-font-heading), Inter, sans-serif",
                      fontSize: 20,
                      fontWeight: 600,
                      letterSpacing: "-0.01em",
                      color: "#fff",
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
                      fontFamily: "var(--pgl-font-body), Inter, sans-serif",
                      fontSize: 15,
                      fontWeight: 400,
                      lineHeight: "1.4em",
                      color: "rgba(255,255,255,0.85)",
                      textDecoration: "none",
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#fff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "rgba(255,255,255,0.85)";
                    }}
                    {...(item.isExternal
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    {item.label}
                  </a>
                ))}
              </div>

              {/* CTA Button — yellow pill with arrow */}
              {ctaText && (
                <a
                  href={ctaLink}
                  data-pgl-path="ctaText"
                  data-pgl-edit="button"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "10px 20px",
                    backgroundColor: accent,
                    borderRadius: 100,
                    textDecoration: "none",
                    marginLeft: 16,
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
                      fontFamily: "var(--pgl-font-body), Inter, sans-serif",
                      fontSize: 14,
                      fontWeight: 600,
                      color: dark,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {ctaText}
                  </span>
                  <ArrowIcon color={dark} size={12} />
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
                height: 42,
                padding: "6px 6px 6px 16px",
                backgroundColor: "transparent",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "#fff",
                borderRadius: 1000,
                cursor: "pointer",
                fontFamily: "var(--pgl-font-body), Inter, sans-serif",
                fontSize: 14,
                fontWeight: 500,
                whiteSpace: "nowrap",
              }}
            >
              <span>{menuOpen ? "Fechar" : "Menu"}</span>
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 30,
                  height: 30,
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
                      <line x1="4" y1="4" x2="12" y2="12" stroke={dark} strokeWidth="1.5" strokeLinecap="round" />
                      <line x1="12" y1="4" x2="4" y2="12" stroke={dark} strokeWidth="1.5" strokeLinecap="round" />
                    </>
                  ) : (
                    <>
                      <line x1="3" y1="4.5" x2="13" y2="4.5" stroke={dark} strokeWidth="1.5" strokeLinecap="round" />
                      <line x1="3" y1="8" x2="13" y2="8" stroke={dark} strokeWidth="1.5" strokeLinecap="round" />
                      <line x1="3" y1="11.5" x2="13" y2="11.5" stroke={dark} strokeWidth="1.5" strokeLinecap="round" />
                    </>
                  )}
                </svg>
              </span>
            </button>
          </nav>
        </div>

        {/* ── Mobile dropdown overlay ── */}
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
            backgroundColor: dark,
            borderBottom: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          {/* Phone + email in mobile menu */}
          {(phone || email) && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                paddingBottom: 12,
                marginBottom: 8,
                borderBottom: "1px solid rgba(255,255,255,0.1)",
                fontSize: 13,
                fontFamily: "var(--pgl-font-body), Inter, sans-serif",
                color: "rgba(255,255,255,0.6)",
              }}
            >
              {phone && (
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    color: "inherit",
                    textDecoration: "none",
                  }}
                >
                  <PhoneIcon color="rgba(255,255,255,0.6)" size={13} />
                  <span>{phone}</span>
                </a>
              )}
              {email && (
                <a
                  href={`mailto:${email}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    color: "inherit",
                    textDecoration: "none",
                  }}
                >
                  <EmailIcon color="rgba(255,255,255,0.6)" size={13} />
                  <span>{email}</span>
                </a>
              )}
            </div>
          )}

          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              style={{
                padding: "10px 0",
                fontFamily: "var(--pgl-font-body), Inter, sans-serif",
                fontSize: 17,
                fontWeight: 400,
                lineHeight: "1.4em",
                color: "rgba(255,255,255,0.85)",
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
                padding: "12px 24px",
                backgroundColor: accent,
                borderRadius: 100,
                fontFamily: "var(--pgl-font-body), Inter, sans-serif",
                fontSize: 15,
                fontWeight: 600,
                color: dark,
                textDecoration: "none",
              }}
            >
              <span>{ctaText}</span>
              <ArrowIcon color={dark} size={12} />
            </a>
          )}
        </div>
      </header>
    </>
  );
}
