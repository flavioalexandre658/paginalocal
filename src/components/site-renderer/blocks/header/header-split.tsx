"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { PglButton } from "../../shared/pgl-button";
import type { DesignTokens } from "@/types/ai-generation";

interface Props {
  content: Record<string, unknown>;
  tokens: DesignTokens;
  isDark?: boolean;
  navigation?: { label: string; href: string; isExternal?: boolean }[];
}

export function HeaderSplit({ content, tokens, navigation }: Props) {
  const navItems = navigation || [];
  const [menuOpen, setMenuOpen] = useState(false);

  const storeName =
    typeof content.storeName === "string" ? content.storeName : "";
  const logoUrl =
    typeof content.logoUrl === "string" && content.logoUrl ? content.logoUrl : null;
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
    <header
      data-pgl-edit="nav"
      data-pgl-path="nav"
      className="relative z-40 py-4"
      style={{ backgroundColor: tokens.palette.background }}
      role="banner"
    >
      <nav
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between"
        role="navigation"
        aria-label="Navegacao principal"
      >
        {/* Left: Logo / Store Name */}
        <Link href="/" className="shrink-0">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoUrl}
              alt="Logo"
              className="max-h-10 w-auto object-contain"
            />
          ) : (
            <span
              className="text-lg font-bold tracking-tight"
              style={{ fontFamily: "var(--pgl-font-heading)", color: tokens.palette.text }}
            >
              {storeName}
            </span>
          )}
        </Link>

        {/* Center: Nav links — desktop */}
        <ul className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          {navItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="text-sm font-medium uppercase tracking-wider transition-colors duration-200 underline-offset-4 hover:underline"
                style={{
                  color: `${tokens.palette.text}cc`,
                  textDecorationColor: `${tokens.palette.accent}50`,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = tokens.palette.text)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = `${tokens.palette.text}cc`)
                }
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Right: CTA — desktop */}
        <div className="hidden lg:flex items-center">
          {ctaText ? (
            <PglButton href={ctaLink} tokens={tokens}>
              {ctaText}
            </PglButton>
          ) : (
            /* Spacer to keep logo left-aligned when no CTA */
            <div className="w-10" />
          )}
        </div>

        {/* Hamburger — mobile */}
        <button
          className="lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
        >
          <span
            className={cn(
              "block w-6 h-px transition-all duration-300 origin-center",
              menuOpen && "rotate-45 translate-y-[3.5px]"
            )}
            style={{ backgroundColor: tokens.palette.text }}
          />
          <span
            className={cn(
              "block w-6 h-px transition-all duration-300",
              menuOpen && "opacity-0"
            )}
            style={{ backgroundColor: tokens.palette.text }}
          />
          <span
            className={cn(
              "block w-6 h-px transition-all duration-300 origin-center",
              menuOpen && "-rotate-45 -translate-y-[3.5px]"
            )}
            style={{ backgroundColor: tokens.palette.text }}
          />
        </button>
      </nav>

      {/* Mobile dropdown */}
      <div
        className={cn(
          "lg:hidden overflow-hidden transition-all duration-300",
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
        style={{ backgroundColor: tokens.palette.background }}
      >
        <ul className="flex flex-col items-center gap-4 py-6">
          {navItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="text-base font-medium uppercase tracking-wider transition-colors"
                style={{ color: `${tokens.palette.text}cc` }}
              >
                {item.label}
              </a>
            </li>
          ))}
          {ctaText && (
            <li className="mt-2">
              <PglButton href={ctaLink} tokens={tokens}>
                {ctaText}
              </PglButton>
            </li>
          )}
        </ul>
      </div>
    </header>
  );
}
