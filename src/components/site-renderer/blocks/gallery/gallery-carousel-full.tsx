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

export function GalleryCarouselFull({ content, tokens }: Props) {
  const parsed = GalleryContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const style = tokens.style ?? "industrial";
  const isBold = style === "bold";

  /* Gallery is always on light bg */
  const textColor = tokens.palette.text;
  const mutedColor = tokens.palette.textMuted;

  const [currentIndex, setCurrentIndex] = useState(0);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + c.images.length) % c.images.length);
  }, [c.images.length]);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % c.images.length);
  }, [c.images.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goPrev, goNext]);

  const current = c.images[currentIndex];

  return (
    <div className="relative overflow-hidden">
      {/* Decorative background shape */}
      <div
        className="absolute -top-[300px] right-[10%] w-[600px] h-[600px] rounded-full pointer-events-none"
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

        {/* Main image */}
        <div
          className="pgl-fade-up relative aspect-video w-full overflow-hidden"
          style={{
            borderRadius: "var(--card-radius)",
            border: "var(--card-border)",
          }}
          data-delay="2"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={current.url}
            alt={current.alt}
            className="w-full h-full object-cover"
            style={{ transition: `transform var(--transition-speed)` }}
            key={currentIndex}
          />

          {/* Counter badge */}
          <div
            className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-[0.1em] text-white/80"
            style={{ backgroundColor: `${tokens.palette.primary}80` }}
          >
            {currentIndex + 1} / {c.images.length}
          </div>

          {/* Navigation arrows */}
          {c.images.length > 1 && (
            <>
              <button
                onClick={goPrev}
                aria-label="Anterior"
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-colors"
                style={{ backgroundColor: `${tokens.palette.primary}60` }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6" /></svg>
              </button>
              <button
                onClick={goNext}
                aria-label="Proximo"
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-colors"
                style={{ backgroundColor: `${tokens.palette.primary}60` }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6" /></svg>
              </button>
            </>
          )}

          {/* Caption overlay */}
          {current.caption && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-6 py-5">
              <p
                className={cn(
                  "text-white text-sm font-light",
                  isBold && "text-base font-semibold"
                )}
              >
                {current.caption}
              </p>
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {c.images.length > 1 && (
          <div className="pgl-fade-up flex gap-1 md:gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide" data-delay="3">
            {c.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Ver imagem ${index + 1}`}
                className={cn(
                  "relative w-14 h-10 md:w-20 md:h-14 shrink-0 overflow-hidden",
                  index === currentIndex
                    ? "opacity-100"
                    : "opacity-40 hover:opacity-80"
                )}
                style={{
                  borderRadius: "var(--card-radius)",
                  border:
                    index === currentIndex
                      ? `2px solid ${tokens.palette.accent}`
                      : `1px solid ${textColor}15`,
                  transition: `all var(--transition-speed)`,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
