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

export function HeaderMinimal({ content, tokens, navigation }: Props) {
  const navItems = navigation || [];
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const storeName =
    typeof content.storeName === "string" ? content.storeName : "";
  const logoUrl =
    typeof content.logoUrl === "string" && content.logoUrl ? content.logoUrl : null;
  const ctaText =
    typeof content.ctaText === "string" ? content.ctaText : null;
  const ctaLink =
    typeof content.ctaLink === "string" ? content.ctaLink : "#contato";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled ? "backdrop-blur-md py-3" : "py-5"
        )}
        style={{
          backgroundColor: scrolled
            ? `${tokens.palette.primary}f2`
            : "transparent",
        }}
        role="banner"
      >
        <nav
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between"
          role="navigation"
          aria-label="Navegacao principal"
        >
          {/* Logo / Store Name */}
          <Link href="/" className="relative z-50 shrink-0">
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

          {/* Hamburger button — visible on ALL breakpoints */}
          <button
            className="relative z-50 w-10 h-10 flex flex-col items-center justify-center gap-1.5"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
          >
            <span
              className={cn(
                "block w-6 h-px transition-all duration-300 origin-center",
                menuOpen ? "bg-white rotate-45 translate-y-[3.5px]" : "bg-white"
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
                "block w-6 h-px transition-all duration-300 origin-center",
                menuOpen
                  ? "bg-white -rotate-45 -translate-y-[3.5px]"
                  : "bg-white"
              )}
            />
          </button>
        </nav>
      </header>

      {/* Full-screen overlay menu */}
      <div
        className={cn(
          "fixed inset-0 z-40 flex flex-col items-center justify-center transition-all duration-500",
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
        style={{ backgroundColor: tokens.palette.primary }}
      >
        {/* Subtle decorative line */}
        <div
          className="absolute top-1/2 left-0 w-full h-px opacity-[0.04]"
          style={{ backgroundColor: tokens.palette.accent }}
        />

        <ul className="flex flex-col items-center gap-8">
          {navItems.map((item, i) => (
            <li
              key={item.href}
              className={cn(
                "pgl-fade-up",
                menuOpen ? "opacity-100" : "opacity-0"
              )}
              style={{
                animationDelay: menuOpen ? `${i * 0.08}s` : "0s",
              }}
            >
              <a
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="text-2xl md:text-3xl font-semibold tracking-tight text-white/90 hover:text-white transition-colors duration-200"
                style={{ textTransform: "var(--heading-transform, none)" as React.CSSProperties["textTransform"] }}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {ctaText && (
          <div className="mt-12 pgl-fade-up" data-delay="5">
            <PglButton href={ctaLink} tokens={tokens} isDark>
              {ctaText}
            </PglButton>
          </div>
        )}
      </div>
    </>
  );
}
