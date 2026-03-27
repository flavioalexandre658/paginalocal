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

export function HeaderSolid({ content, tokens, navigation }: Props) {
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
      style={{ backgroundColor: tokens.palette.primary }}
      role="banner"
    >
      <nav
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between"
        role="navigation"
        aria-label="Navegacao principal"
      >
        {/* Logo / Store Name */}
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
              style={{ fontFamily: "var(--pgl-font-heading)", color: "#fff" }}
            >
              {storeName}
            </span>
          )}
        </Link>

        {/* Desktop nav */}
        <ul className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="text-sm font-medium uppercase tracking-wider text-white/80 hover:text-white transition-colors duration-200 underline-offset-4 hover:underline decoration-white/30"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        {ctaText && (
          <div className="hidden lg:block">
            <PglButton href={ctaLink} tokens={tokens} isDark>
              {ctaText}
            </PglButton>
          </div>
        )}

        {/* Hamburger — mobile */}
        <button
          className="lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
        >
          <span
            className={cn(
              "block w-6 h-px bg-white transition-all duration-300 origin-center",
              menuOpen && "rotate-45 translate-y-[3.5px]"
            )}
          />
          <span
            className={cn(
              "block w-6 h-px bg-white transition-all duration-300",
              menuOpen && "opacity-0"
            )}
          />
          <span
            className={cn(
              "block w-6 h-px bg-white transition-all duration-300 origin-center",
              menuOpen && "-rotate-45 -translate-y-[3.5px]"
            )}
          />
        </button>
      </nav>

      {/* Mobile dropdown menu */}
      <div
        className={cn(
          "lg:hidden overflow-hidden transition-all duration-300",
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
        style={{ backgroundColor: tokens.palette.primary }}
      >
        <ul className="flex flex-col items-center gap-4 py-6">
          {navItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="text-base font-medium uppercase tracking-wider text-white/90 hover:text-white transition-colors"
              >
                {item.label}
              </a>
            </li>
          ))}
          {ctaText && (
            <li className="mt-2">
              <PglButton href={ctaLink} tokens={tokens} isDark>
                {ctaText}
              </PglButton>
            </li>
          )}
        </ul>
      </div>
    </header>
  );
}
