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

export function HeroCentered({ content, tokens }: Props) {
  const parsed = HeroContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const style = tokens.style ?? "industrial";
  const isIndustrial = style === "industrial";
  const isElegant = style === "elegant";
  const isWarm = style === "warm";
  const isBold = style === "bold";
  const isMinimal = style === "minimal";

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ backgroundColor: tokens.palette.primary }}
    >
      {/* Background image */}
      {c.backgroundImage && (
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={c.backgroundImage}
            alt=""
            className={cn(
              "w-full h-full object-cover",
              isMinimal ? "opacity-45" : "opacity-35"
            )}
            aria-hidden="true"
          />
        </div>
      )}

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: isMinimal
            ? `linear-gradient(180deg, ${tokens.palette.primary}44 0%, ${tokens.palette.primary}88 100%)`
            : isElegant
              ? `linear-gradient(180deg, ${tokens.palette.primary}cc 0%, ${tokens.palette.primary}aa 50%, ${tokens.palette.primary}66 100%)`
              : isWarm
                ? `linear-gradient(135deg, ${tokens.palette.primary}dd 0%, ${tokens.palette.primary}88 50%, ${tokens.palette.primary}55 100%)`
                : `linear-gradient(135deg, ${tokens.palette.primary}ee 0%, ${tokens.palette.primary}99 50%, ${tokens.palette.primary}44 100%)`,
        }}
      />

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

      {/* Content grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Text */}
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
              <span className="text-[0.7rem] font-medium tracking-[0.15em] uppercase">
                Negocio local
              </span>
            </div>

            {/* Headline with accent word */}
            <StyledHeadline
              text={c.headline}
              tokens={tokens}
              as="h1"
              className="pgl-fade-up leading-[1.0] text-white text-3xl sm:text-4xl md:text-5xl lg:text-7xl"
              accentClassName={cn(
                (isIndustrial || isBold) && "normal-case",
                isElegant && "italic"
              )}
            />

            {/* Subheadline — always light on dark */}
            <p
              className={cn(
                "pgl-fade-up mt-6 text-base md:text-lg leading-[1.75] max-w-[440px] font-light",
                isElegant
                  ? "text-white/85"
                  : isWarm
                    ? "text-white/70"
                    : "text-white/55"
              )}
              data-delay="2"
            >
              {c.subheadline}
            </p>

            {/* CTAs */}
            <div className="pgl-fade-up mt-10 flex flex-wrap gap-4" data-delay="3">
              <PglButton href={c.ctaLink || "#contact"} tokens={tokens} isDark>
                {c.ctaText}
              </PglButton>
              {c.secondaryCtaText && (
                <PglButton
                  href={c.secondaryCtaLink || "#services"}
                  variant="secondary"
                  tokens={tokens}
                  isDark
                >
                  {c.secondaryCtaText}
                </PglButton>
              )}
            </div>
          </div>

          {/* Floating image (desktop only) */}
          {c.backgroundImage && (
            <div
              className="hidden lg:flex justify-center items-center pgl-fade-right"
              data-delay="4"
            >
              <div className="relative">
                {/* Accent border offset — industrial/bold only */}
                {(isIndustrial || isBold) && (
                  <div
                    className="hidden lg:block absolute -top-6 -right-6 w-40 h-40 z-0"
                    style={{
                      border: `2px solid ${tokens.palette.accent}`,
                      opacity: 0.15,
                    }}
                  />
                )}
                {/* Main image */}
                <div
                  className="relative w-[400px] h-[480px] overflow-hidden shadow-2xl z-10"
                  style={{
                    borderRadius: isElegant
                      ? "12px"
                      : isWarm
                        ? "8px"
                        : tokens.borderRadius === "none"
                          ? "0"
                          : "4px",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={c.backgroundImage}
                    alt={c.headline.replace(/\*/g, "")}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Floating badge — not minimal/elegant */}
                {!isMinimal && !isElegant && (
                  <div
                    className="pgl-float absolute -bottom-5 -left-8 z-20 px-6 py-4 text-white text-[0.82rem] font-semibold tracking-[0.08em] uppercase shadow-xl"
                    style={{
                      backgroundColor: tokens.palette.accent,
                      fontFamily: "var(--pgl-font-heading)",
                      boxShadow: `0 12px 40px ${tokens.palette.accent}40`,
                      borderRadius: isWarm ? "8px" : tokens.borderRadius === "none" ? "0" : "2px",
                    }}
                  >
                    Resultado garantido
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Watermark — industrial/bold only */}
      <WatermarkText text={c.headline.replace(/\*/g, "")} tokens={tokens} />

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-[0.65rem] tracking-[0.15em] uppercase text-white/25">
          scroll
        </span>
        <div className="w-px h-10 bg-gradient-to-b from-white/25 to-transparent" />
      </div>
    </section>
  );
}
