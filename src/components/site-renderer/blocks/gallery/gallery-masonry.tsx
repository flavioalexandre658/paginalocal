"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import type { DesignTokens } from "@/types/ai-generation";
import { GalleryContentSchema } from "@/types/ai-generation";
import { StyledHeadline } from "../../shared/styled-headline";

interface Props {
  content: Record<string, unknown>;
  tokens: DesignTokens;
  isDark?: boolean;
}

export function GalleryMasonry({ content, tokens }: Props) {
  const parsed = GalleryContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const style = tokens.style ?? "industrial";
  const isIndustrial = style === "industrial";
  const isBold = style === "bold";
  const isMinimal = style === "minimal";

  /* Gallery is always on light bg */
  const textColor = tokens.palette.text;
  const mutedColor = tokens.palette.textMuted;

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const closeLightbox = useCallback(() => setSelectedIndex(null), []);

  const goPrev = useCallback(() => {
    setSelectedIndex((prev) =>
      prev !== null ? (prev - 1 + c.images.length) % c.images.length : null
    );
  }, [c.images.length]);

  const goNext = useCallback(() => {
    setSelectedIndex((prev) =>
      prev !== null ? (prev + 1) % c.images.length : null
    );
  }, [c.images.length]);

  useEffect(() => {
    if (selectedIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedIndex, closeLightbox, goPrev, goNext]);

  /* ── style-based tokens ── */
  const gapClass = isIndustrial
    ? "gap-px"
    : isBold
      ? "gap-0"
      : isMinimal
        ? "gap-6"
        : "gap-4"; // elegant / warm / default

  const spaceYClass = isIndustrial
    ? "space-y-px"
    : isBold
      ? "space-y-0"
      : isMinimal
        ? "space-y-6"
        : "space-y-4";

  const hoverScale = isBold
    ? "group-hover:scale-[1.05]"
    : isMinimal
      ? ""
      : "group-hover:scale-[1.03]";

  const hoverOverlayColor = style === "warm"
    ? `${tokens.palette.accent}50`
    : `${tokens.palette.primary}60`;

  return (
    <div className="relative overflow-hidden">
      {/* Decorative background shape */}
      <div
        className="absolute -top-[200px] -left-[300px] w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{ backgroundColor: tokens.palette.accent, opacity: 0.02 }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16 items-end">
          <StyledHeadline
            text={c.title}
            tokens={tokens}
            className="pgl-fade-up text-3xl md:text-4xl lg:text-5xl leading-[1.05]"
            accentClassName="normal-case"
          />
          {c.subtitle && (
            <p
              className="pgl-fade-up text-[0.95rem] leading-[1.8] font-light"
              style={{ color: mutedColor }}
              data-delay="1"
            >
              {c.subtitle}
            </p>
          )}
        </div>

        {/* Masonry grid */}
        <div className={cn("columns-1 sm:columns-2 md:columns-3", gapClass, spaceYClass)}>
          {c.images.map((image, index) => (
            <div
              key={index}
              className="pgl-fade-up break-inside-avoid overflow-hidden cursor-pointer relative group"
              style={{
                borderRadius: "var(--card-radius)",
                border: "var(--card-border)",
              }}
              data-delay={((index % 6) + 1)}
              onClick={() => setSelectedIndex(index)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.url}
                alt={image.alt}
                className={cn(
                  "w-full h-auto block",
                  hoverScale
                )}
                style={{ transition: `transform var(--transition-speed)` }}
                loading="lazy"
              />
              {/* Hover overlay */}
              {!isMinimal && (
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-end"
                  style={{
                    backgroundColor: hoverOverlayColor,
                    transition: `opacity var(--transition-speed)`,
                  }}
                >
                  {image.caption && (
                    <div className="p-4 w-full">
                      <p
                        className={cn(
                          "text-white text-xs font-light uppercase tracking-[0.08em]",
                          isBold && "text-sm font-semibold"
                        )}
                      >
                        {image.caption}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
          style={{ backgroundColor: `${tokens.palette.primary}E6` }}
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-colors p-3 md:p-2"
            style={{ backgroundColor: `${textColor}20` }}
            onClick={closeLightbox}
            aria-label="Fechar"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>

          {/* Prev arrow */}
          <button
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-colors"
            style={{ backgroundColor: `${textColor}20` }}
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            aria-label="Anterior"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6" /></svg>
          </button>

          {/* Image */}
          <div
            className="max-h-[85vh] max-w-[90vw] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={c.images[selectedIndex].url}
              alt={c.images[selectedIndex].alt}
              className="max-h-[85vh] max-w-[90vw] object-contain"
              style={{ borderRadius: "var(--card-radius)" }}
            />
          </div>

          {/* Next arrow */}
          <button
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-colors"
            style={{ backgroundColor: `${textColor}20` }}
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            aria-label="Proximo"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6" /></svg>
          </button>

          {/* Caption + counter */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
            {c.images[selectedIndex].caption && (
              <p className="text-white/80 text-sm font-light">
                {c.images[selectedIndex].caption}
              </p>
            )}
            <span
              className="text-white/50 text-xs font-medium uppercase tracking-[0.1em] px-3 py-1 rounded-full"
              style={{ backgroundColor: `${textColor}15` }}
            >
              {selectedIndex + 1} / {c.images.length}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
