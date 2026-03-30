"use client";

import { createContext, useContext, useMemo, useEffect } from "react";
import type { DesignTokens } from "@/types/ai-generation";
import { getFontBySlug } from "@/lib/fonts";
import { migrateFontPairing } from "@/lib/font-migration";

const DesignTokensContext = createContext<DesignTokens | null>(null);

export function useDesignTokens() {
  const ctx = useContext(DesignTokensContext);
  if (!ctx)
    throw new Error("useDesignTokens must be used within DesignTokensProvider");
  return ctx;
}

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
  tokens: rawTokens,
  children,
}: {
  tokens: DesignTokens;
  children: React.ReactNode;
}) {
  const tokens = useMemo(() => migrateFontPairing(rawTokens), [rawTokens]);
  const spacing = SPACING_MAP[tokens.spacing];

  const headingFont = getFontBySlug(tokens.headingFont);
  const bodyFont = getFontBySlug(tokens.bodyFont);

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
        "--pgl-font-heading": headingFont?.family ?? "'Inter'",
        "--pgl-font-body": bodyFont?.family ?? "'Inter'",
        "--pgl-font-accent": bodyFont?.family ?? "'Inter'",
        "--pgl-radius": BORDER_RADIUS_MAP[tokens.borderRadius],
        "--pgl-section-spacing": spacing.section,
        "--pgl-inner-spacing": spacing.inner,
      } as React.CSSProperties),
    [tokens, spacing, headingFont, bodyFont]
  );

  // Only load Google Fonts for non-local fonts
  useEffect(() => {
    const fontsToLoad = [headingFont, bodyFont].filter(
      (f) => f && f.source === "google"
    );

    fontsToLoad.forEach((font) => {
      if (!font) return;
      const family = font.name.replace(/\s+/g, "+");
      const weights = font.weights.join(";");
      const href = `https://fonts.googleapis.com/css2?family=${family}:wght@${weights}&display=swap`;
      const existing = document.querySelector(`link[href="${href}"]`);
      if (existing) return;
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      document.head.appendChild(link);
    });
  }, [headingFont, bodyFont]);

  return (
    <DesignTokensContext.Provider value={tokens}>
      <div
        data-style={tokens.style}
        data-radius={tokens.borderRadius}
        style={{
          ...cssVars,
          fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
          fontWeight: "var(--body-weight, 400)" as unknown as undefined,
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale" as string,
        }}
      >
        {children}
      </div>
    </DesignTokensContext.Provider>
  );
}
