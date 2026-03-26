"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { PglButton } from "../../shared/pgl-button";
import type { DesignTokens } from "@/types/ai-generation";

interface Props {
  content: Record<string, unknown>;
  tokens: DesignTokens;
  isDark?: boolean;
  navigation?: { label: string; href: string; isExternal?: boolean }[];
}

export function HeaderCentered({ content, tokens, navigation }: Props) {
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

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top row: optional CTA right-aligned, logo centered */}
        <div className="relative flex items-center justify-center py-3">
          {/* Logo / Store Name — centered */}
          <a href="/" className="shrink-0">
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoUrl}
                alt="Logo"
                className="max-h-12 w-auto object-contain"
              />
            ) : (
              <span
                className="text-xl font-bold tracking-tight"
                style={{ fontFamily: "var(--pgl-font-heading)", color: tokens.palette.text }}
              >
                {storeName}
              </span>
            )}
          </a>

          {/* CTA — absolute right on desktop */}
          {ctaText && (
            <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2">
              <PglButton href={ctaLink} tokens={tokens}>
                {ctaText}
              </PglButton>
            </div>
          )}
        </div>

        {/* Bottom row: nav centered — desktop only */}
        <nav
          className="hidden md:block"
          role="navigation"
          aria-label="Navegacao principal"
        >
          <div
            className="border-t pt-3 mt-1"
            style={{ borderColor: `${tokens.palette.text}10` }}
          >
            <ul className="flex items-center justify-center gap-8">
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
          </div>
        </nav>

        {/* Hamburger — mobile */}
        <div className="md:hidden absolute top-4 right-4">
          <button
            className="w-10 h-10 flex flex-col items-center justify-center gap-1.5"
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
        </div>
      </div>

      {/* Mobile dropdown */}
      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-300",
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
