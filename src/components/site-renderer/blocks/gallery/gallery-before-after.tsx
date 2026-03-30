"use client";

import { useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import type { DesignTokens } from "@/types/ai-generation";
import { GalleryContentSchema } from "@/types/ai-generation";
import { StyledHeadline } from "../../shared/styled-headline";

interface Props {
  content: Record<string, unknown>;
  tokens: DesignTokens;
  isDark?: boolean;
}

interface BeforeAfterSliderProps {
  before: { url: string; alt: string };
  after: { url: string; alt: string };
  tokens: DesignTokens;
}

function BeforeAfterSlider({ before, after, tokens }: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.min(100, Math.max(0, (x / rect.width) * 100));
    setPosition(pct);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    updatePosition(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    updatePosition(e.clientX);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    isDragging.current = true;
    updatePosition(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    updatePosition(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
  };

  return (
    <div
      ref={containerRef}
      className="relative aspect-video overflow-hidden select-none cursor-ew-resize"
      style={{
        borderRadius: "var(--card-radius)",
        border: "var(--card-border)",
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* After image (full, behind) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={after.url}
        alt={after.alt}
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
      />

      {/* Before image (clipped) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={before.url}
          alt={before.alt}
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />
      </div>

      {/* Drag handle line */}
      <div
        className="absolute top-0 bottom-0 w-[2px] z-10 flex items-center justify-center cursor-ew-resize"
        style={{
          left: `${position}%`,
          transform: "translateX(-50%)",
          backgroundColor: tokens.palette.accent,
        }}
      >
        {/* Handle circle */}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center select-none pointer-events-none"
          style={{
            backgroundColor: tokens.palette.accent,
            boxShadow: `0 0 0 4px ${tokens.palette.accent}30`,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <path d="M8 4l-6 8 6 8" />
            <path d="M16 4l6 8-6 8" />
          </svg>
        </div>
      </div>

      {/* Labels */}
      <div
        className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs md:text-xs font-medium uppercase tracking-[0.1em] pointer-events-none text-white"
        style={{ backgroundColor: `${tokens.palette.primary}90` }}
      >
        Antes
      </div>
      <div
        className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs md:text-xs font-medium uppercase tracking-[0.1em] pointer-events-none text-white"
        style={{ backgroundColor: `${tokens.palette.accent}` }}
      >
        Depois
      </div>
    </div>
  );
}

export function GalleryBeforeAfter({ content, tokens }: Props) {
  const parsed = GalleryContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const style = tokens.style ?? "industrial";
  const isIndustrial = style === "industrial";
  const isBold = style === "bold";
  const isMinimal = style === "minimal";

  /* Gallery is always on light bg */
  const mutedColor = tokens.palette.textMuted;

  const images = c.images;

  /* ── style-based tokens ── */
  const extraGridGap = isIndustrial
    ? "gap-px"
    : isBold
      ? "gap-0"
      : isMinimal
        ? "gap-6"
        : "gap-3"; // elegant / warm / default

  const hoverScale = isBold
    ? "group-hover:scale-[1.05]"
    : isMinimal
      ? ""
      : "group-hover:scale-[1.03]";

  return (
    <div className="relative overflow-hidden">
      {/* Decorative background shape */}
      <div
        className="absolute -bottom-[200px] -left-[200px] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ backgroundColor: tokens.palette.accent, opacity: 0.02 }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16 items-end">
          <StyledHeadline
            text={c.title}
            tokens={tokens}
            className="pgl-fade-up text-3xl md:text-4xl lg:text-5xl leading-[1.1]"
            accentClassName="normal-case"
            data-pgl-path="title"
            data-pgl-edit="text"
          />
          {c.subtitle && (
            <p
              className="pgl-fade-up text-base leading-[1.6] font-light"
              style={{ color: mutedColor }}
              data-delay="1"
              data-pgl-path="subtitle"
              data-pgl-edit="text"
            >
              {c.subtitle}
            </p>
          )}
        </div>

        {images.length >= 2 ? (
          <>
            {/* Primary before/after slider */}
            <div className="pgl-fade-up" data-delay="2">
              <BeforeAfterSlider
                before={images[0]}
                after={images[1]}
                tokens={tokens}
              />
            </div>

            {/* Additional pairs */}
            {images.length > 2 && (
              <div className="mt-8">
                {images.length >= 4 && images.length % 2 === 0 ? (
                  <div className={cn("grid grid-cols-1 md:grid-cols-2", extraGridGap)}>
                    {Array.from({
                      length: Math.floor((images.length - 2) / 2),
                    }).map((_, pairIndex) => {
                      const beforeIdx = 2 + pairIndex * 2;
                      const afterIdx = beforeIdx + 1;
                      if (afterIdx >= images.length) return null;
                      return (
                        <div
                          key={pairIndex}
                          className="pgl-fade-up"
                          data-delay={pairIndex + 3}
                        >
                          <BeforeAfterSlider
                            before={images[beforeIdx]}
                            after={images[afterIdx]}
                            tokens={tokens}
                          />
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className={cn("grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4", extraGridGap)}>
                    {images.slice(2).map((image, index) => (
                      <div
                        key={index}
                        className="pgl-fade-up relative aspect-square overflow-hidden group"
                        style={{
                          borderRadius: "var(--card-radius)",
                          border: "var(--card-border)",
                        }}
                        data-delay={index + 3}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={image.url}
                          alt={image.alt}
                          className={cn(
                            "w-full h-full object-cover",
                            hoverScale
                          )}
                          style={{ transition: `transform var(--transition-speed)` }}
                          loading="lazy"
                          data-pgl-path={`images.${index + 2}.url`}
                          data-pgl-edit="image"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          /* Single image fallback */
          <div className="pgl-fade-up" data-delay="2">
            {images.map((image, index) => (
              <div
                key={index}
                className="relative aspect-video overflow-hidden group"
                style={{
                  borderRadius: "var(--card-radius)",
                  border: "var(--card-border)",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.url}
                  alt={image.alt}
                  className={cn(
                    "w-full h-full object-cover",
                    hoverScale
                  )}
                  style={{ transition: `transform var(--transition-speed)` }}
                  data-pgl-path={`images.${index}.url`}
                  data-pgl-edit="image"
                />
                {image.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-6 py-5">
                    <p
                      className={cn(
                        "text-white text-sm font-light",
                        isBold && "text-base font-semibold"
                      )}
                      data-pgl-path={`images.${index}.caption`}
                      data-pgl-edit="text"
                    >
                      {image.caption}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
