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

export function HeroGradientBold({ content, tokens }: Props) {
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
      style={{
        background: isMinimal
          ? tokens.palette.primary
          : `linear-gradient(135deg, ${tokens.palette.primary} 0%, ${tokens.palette.primary}cc 50%, ${tokens.palette.primary}88 100%)`,
      }}
    >
      {/* Pattern overlay (per-style) */}
      <SectionPattern tokens={tokens} />

      {/* Large decorative circles — not minimal/elegant */}
      {!isMinimal && !isElegant && (
        <>
          <div
            className="hidden lg:block absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full pointer-events-none"
            style={{ backgroundColor: tokens.palette.accent, opacity: 0.06 }}
          />
          <div
            className="hidden lg:block absolute bottom-[-15%] left-[-8%] w-[600px] h-[600px] rounded-full pointer-events-none"
            style={{ backgroundColor: tokens.palette.primary, opacity: 0.15 }}
          />
          <div
            className="hidden lg:block absolute top-[20%] left-[10%] w-[200px] h-[200px] rounded-full pointer-events-none"
            style={{ backgroundColor: tokens.palette.accent, opacity: 0.04 }}
          />
        </>
      )}

      {/* Decorative circle shape — industrial & bold only */}
      {(isIndustrial || isBold) && (
        <div
          className="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border pointer-events-none"
          style={{ borderColor: `${tokens.palette.accent}10` }}
        >
          <div
            className="absolute inset-20 rounded-full border"
            style={{ borderColor: `${tokens.palette.accent}08` }}
          />
        </div>
      )}

      {/* Center line — not minimal */}
      {!isMinimal && (
        <div className="hidden lg:block absolute top-0 bottom-0 left-1/2 w-px bg-gradient-to-b from-transparent via-white/[0.04] to-transparent" />
      )}

      {/* Content — centered */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
        <div className="max-w-4xl mx-auto py-6 md:py-10">
          {/* Label */}
          <div
            className="pgl-fade-up inline-flex items-center gap-3 mb-8 justify-center"
            style={{ color: tokens.palette.accent }}
          >
            <span
              className="block w-10 h-px"
              style={{ backgroundColor: tokens.palette.accent }}
            />
            <span className="text-[0.7rem] font-medium tracking-[0.15em] uppercase">
              Negocio local
            </span>
            <span
              className="block w-10 h-px"
              style={{ backgroundColor: tokens.palette.accent }}
            />
          </div>

          {/* Headline */}
          <StyledHeadline
            text={c.headline}
            tokens={tokens}
            as="h1"
            className="pgl-fade-up leading-[1.0] text-white text-3xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-8xl"
            accentClassName={cn(
              (isIndustrial || isBold) && "normal-case",
              isElegant && "italic"
            )}
          />

          {/* Subheadline — always light on dark */}
          <p
            className={cn(
              "pgl-fade-up mt-6 text-base md:text-lg leading-[1.75] max-w-[520px] mx-auto font-light",
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
          <div
            className="pgl-fade-up mt-10 flex flex-wrap gap-4 justify-center"
            data-delay="3"
          >
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

          {/* Background image as floating card (if available) */}
          {c.backgroundImage && (
            <div
              className="pgl-fade-up mt-16 mx-auto max-w-2xl overflow-hidden shadow-2xl"
              style={{
                borderRadius: isElegant
                  ? "16px"
                  : isWarm
                    ? "12px"
                    : tokens.borderRadius === "none"
                      ? "0"
                      : "8px",
              }}
              data-delay="4"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={c.backgroundImage}
                alt={c.headline.replace(/\*/g, "")}
                className="w-full h-auto object-cover"
              />
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
