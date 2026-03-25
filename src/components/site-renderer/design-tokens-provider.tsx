"use client";

import { createContext, useContext, useMemo, useEffect } from "react";
import type { DesignTokens } from "@/types/ai-generation";

const DesignTokensContext = createContext<DesignTokens | null>(null);

export function useDesignTokens() {
  const ctx = useContext(DesignTokensContext);
  if (!ctx)
    throw new Error("useDesignTokens must be used within DesignTokensProvider");
  return ctx;
}

const FONT_URLS: Record<string, string> = {
  "inter+merriweather":
    "Inter:wght@300;400;500;600;700|Merriweather:wght@400;700",
  "poppins+lora": "Poppins:wght@300;400;500;600;700|Lora:wght@400;700",
  "montserrat+opensans":
    "Montserrat:wght@300;400;500;600;700|Open+Sans:wght@300;400;600",
  "playfair+source-sans":
    "Playfair+Display:ital,wght@0,400;0,700;1,700|Source+Sans+3:wght@300;400;600",
  "dm-sans+dm-serif":
    "DM+Sans:wght@300;400;500;700|DM+Serif+Display:wght@400",
  "raleway+roboto":
    "Raleway:wght@300;400;500;600;700|Roboto:wght@300;400;500",
  "oswald+roboto":
    "Oswald:wght@400;500;600;700|Roboto:wght@300;400;500|Playfair+Display:ital,wght@1,700",
  "space-grotesk+inter":
    "Space+Grotesk:wght@300;400;500;600;700|Inter:wght@300;400;500|DM+Serif+Display:ital,wght@0,400",
};

const FONT_FAMILIES: Record<
  string,
  { heading: string; body: string; accent: string }
> = {
  "inter+merriweather": {
    heading: "'Inter'",
    body: "'Merriweather'",
    accent: "'Merriweather', serif",
  },
  "poppins+lora": {
    heading: "'Poppins'",
    body: "'Lora'",
    accent: "'Lora', serif",
  },
  "montserrat+opensans": {
    heading: "'Montserrat'",
    body: "'Open Sans'",
    accent: "'Playfair Display', serif",
  },
  "playfair+source-sans": {
    heading: "'Playfair Display'",
    body: "'Source Sans 3'",
    accent: "'Playfair Display', serif",
  },
  "dm-sans+dm-serif": {
    heading: "'DM Sans'",
    body: "'DM Serif Display'",
    accent: "'DM Serif Display', serif",
  },
  "raleway+roboto": {
    heading: "'Raleway'",
    body: "'Roboto'",
    accent: "'Playfair Display', serif",
  },
  "oswald+roboto": {
    heading: "'Oswald'",
    body: "'Roboto'",
    accent: "'Playfair Display', serif",
  },
  "space-grotesk+inter": {
    heading: "'Space Grotesk'",
    body: "'Inter'",
    accent: "'DM Serif Display', serif",
  },
};

const BORDER_RADIUS_MAP: Record<DesignTokens["borderRadius"], string> = {
  none: "0px",
  sm: "4px",
  md: "8px",
  lg: "16px",
  full: "9999px",
};

const SPACING_MAP: Record<
  DesignTokens["spacing"],
  { section: string; inner: string }
> = {
  compact: { section: "5rem", inner: "2rem" },
  normal: { section: "6rem", inner: "2.5rem" },
  spacious: { section: "8rem", inner: "3rem" },
};

export function DesignTokensProvider({
  tokens,
  children,
}: {
  tokens: DesignTokens;
  children: React.ReactNode;
}) {
  const spacing = SPACING_MAP[tokens.spacing];
  const fonts = FONT_FAMILIES[tokens.fontPairing];
  const fontUrl = FONT_URLS[tokens.fontPairing];

  const cssVars = useMemo(
    () =>
      ({
        "--pgl-primary": tokens.palette.primary,
        "--pgl-secondary": tokens.palette.secondary,
        "--pgl-accent": tokens.palette.accent,
        "--pgl-background": tokens.palette.background,
        "--pgl-surface": tokens.palette.surface,
        "--pgl-text": tokens.palette.text,
        "--pgl-text-muted": tokens.palette.textMuted,
        "--pgl-font-heading": fonts?.heading ?? "'Inter'",
        "--pgl-font-body": fonts?.body ?? "'Inter'",
        "--pgl-font-accent": fonts?.accent ?? "'Playfair Display', serif",
        "--pgl-radius": BORDER_RADIUS_MAP[tokens.borderRadius],
        "--pgl-section-spacing": spacing.section,
        "--pgl-inner-spacing": spacing.inner,
      } as React.CSSProperties),
    [tokens, spacing, fonts]
  );

  useEffect(() => {
    if (!fontUrl) return;
    const href = `https://fonts.googleapis.com/css2?family=${fontUrl}&display=swap`;
    const existing = document.querySelector(`link[href="${href}"]`);
    if (existing) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
    return () => {
      link.remove();
    };
  }, [fontUrl]);

  return (
    <DesignTokensContext.Provider value={tokens}>
      <div
        data-style={tokens.style}
        data-radius={tokens.borderRadius}
        style={{
          ...cssVars,
          fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
          fontWeight: tokens.style === "bold" ? 400 : 300,
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale" as string,
        }}
      >
        {children}
      </div>
    </DesignTokensContext.Provider>
  );
}
