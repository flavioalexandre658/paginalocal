"use client";

import { cn } from "@/lib/utils";
import { StyledHeadline } from "../../shared/styled-headline";
import { PglButton } from "../../shared/pgl-button";
import { SectionPattern } from "../../shared/section-pattern";
import { WatermarkText } from "../../shared/watermark-text";
import type { DesignTokens } from "@/types/ai-generation";
import { HeroContentSchema } from "@/types/ai-generation";

interface Props {
  content: Record<string, unknown>;
  tokens: DesignTokens;
  isDark?: boolean;
}

export function HeroSplitImage({ content, tokens }: Props) {
  const parsed = HeroContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const style = tokens.style ?? "industrial";
  const isIndustrial = style === "industrial";
  const isElegant = style === "elegant";
  const isWarm = style === "warm";
  const isBold = style === "bold";
  const isMinimal = style === "minimal";

  const radiusLg = isElegant
    ? "16px"
    : isWarm
      ? "12px"
      : tokens.borderRadius === "none"
        ? "0"
        : "4px";

  return (
    <section
      className="relative min-h-screen flex items-center pt-20 overflow-hidden"
      style={{ backgroundColor: tokens.palette.primary }}
    >
      {/* Pattern overlay (per-style) */}
      <SectionPattern tokens={tokens} />

      {/* Decorative circle shape — industrial & bold only */}
      {(isIndustrial || isBold) && (
        <div
          className="hidden lg:block absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 w-[500px] h-[500px] rounded-full border pointer-events-none"
          style={{ borderColor: `${tokens.palette.accent}12` }}
        >
          <div
            className="absolute inset-10 rounded-full border"
            style={{ borderColor: `${tokens.palette.accent}08` }}
          />
        </div>
      )}

      {/* Center line — not minimal */}
      {!isMinimal && (
        <div className="hidden lg:block absolute top-0 bottom-0 left-1/2 w-px bg-gradient-to-b from-transparent via-white/[0.04] to-transparent" />
      )}

      {/* Content: 50/50 grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Text — LEFT */}
          <div className="py-6 md:py-10">
            {/* Label */}
            <div
              className="pgl-fade-up inline-flex items-center gap-3 mb-8"
              style={{ color: tokens.palette.accent }}
            >
              <span
                className="block w-10 h-px"
                style={{ backgroundColor: tokens.palette.accent }}
              />
              <span
                className="text-[0.7rem] font-medium tracking-[0.1em] uppercase"
                data-pgl-path="tagline"
                data-pgl-edit="text"
              >
                {c.tagline}
              </span>
            </div>

            {/* Headline */}
            <StyledHeadline
              text={c.headline}
              tokens={tokens}
              as="h1"
              className="pgl-fade-up leading-[1.1] text-white text-3xl sm:text-4xl md:text-5xl lg:text-7xl"
              accentClassName={cn(
                (isIndustrial || isBold) && "normal-case",
                isElegant && "italic"
              )}
              data-pgl-path="headline"
              data-pgl-edit="text"
            />

            {/* Subheadline — always light on dark */}
            <p
              className={cn(
                "pgl-fade-up mt-6 text-base md:text-lg leading-[1.6] max-w-xl font-light",
                isElegant
                  ? "text-white/85"
                  : isWarm
                    ? "text-white/70"
                    : "text-white/55"
              )}
              data-delay="2"
              data-pgl-path="subheadline"
              data-pgl-edit="text"
            >
              {c.subheadline}
            </p>

            {/* CTAs */}
            <div className="pgl-fade-up mt-10 flex flex-wrap gap-4" data-delay="3">
              <PglButton href={c.ctaLink || "#contact"} tokens={tokens} isDark data-pgl-path="ctaText" data-pgl-edit="button">
                {c.ctaText}
              </PglButton>
              {c.secondaryCtaText && (
                <PglButton
                  href={c.secondaryCtaLink || "#services"}
                  variant="secondary"
                  tokens={tokens}
                  isDark
                  data-pgl-path="secondaryCtaText"
                  data-pgl-edit="button"
                >
                  {c.secondaryCtaText}
                </PglButton>
              )}
            </div>
          </div>

          {/* Image — RIGHT: equal 50/50, no floating */}
          <div className="pgl-fade-right" data-delay="4">
            {c.backgroundImage ? (
              <div className="relative">
                {/* Accent border offset — industrial/bold only */}
                {(isIndustrial || isBold) && (
                  <div
                    className="hidden lg:block absolute -top-4 -right-4 bottom-4 left-4 z-0"
                    style={{
                      border: `1px solid ${tokens.palette.accent}`,
                      opacity: 0.15,
                      borderRadius: radiusLg,
                    }}
                  />
                )}
                <div
                  className="relative w-full aspect-[4/5] overflow-hidden shadow-2xl z-10"
                  style={{ borderRadius: radiusLg }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={c.backgroundImage}
                    alt={c.headline.replace(/\*/g, "")}
                    className="w-full h-full object-cover"
                    data-pgl-path="backgroundImage"
                    data-pgl-edit="image"
                  />
                </div>
                {/* Decorative accent shape — industrial/bold only */}
                {(isIndustrial || isBold) && (
                  <div
                    className="hidden lg:block absolute -bottom-6 -right-6 w-24 h-24 z-0"
                    style={{
                      backgroundColor: tokens.palette.accent,
                      opacity: 0.08,
                    }}
                  />
                )}
              </div>
            ) : (
              <div
                className="w-full aspect-[4/5] z-10"
                style={{
                  backgroundColor: `${tokens.palette.accent}08`,
                  borderRadius: radiusLg,
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Watermark — industrial/bold only */}
      <WatermarkText text={c.headline.replace(/\*/g, "")} tokens={tokens} />

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-xs tracking-[0.1em] uppercase text-white/25">
          scroll
        </span>
        <div className="w-px h-10 bg-gradient-to-b from-white/25 to-transparent" />
      </div>
    </section>
  );
}
