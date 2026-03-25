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

export function HeroMinimalText({ content, tokens }: Props) {
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
      className="relative min-h-screen flex items-end pb-20 md:pb-28 overflow-hidden"
      style={{ backgroundColor: tokens.palette.primary }}
    >
      {/* Pattern overlay (per-style) */}
      <SectionPattern tokens={tokens} />

      {/* Decorative circle shape — industrial & bold only */}
      {(isIndustrial || isBold) && (
        <div
          className="hidden lg:block absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/3 w-[600px] h-[600px] rounded-full border pointer-events-none"
          style={{ borderColor: `${tokens.palette.accent}08` }}
        >
          <div
            className="absolute inset-16 rounded-full border"
            style={{ borderColor: `${tokens.palette.accent}05` }}
          />
        </div>
      )}

      {/* Center line — not minimal */}
      {!isMinimal && (
        <div className="hidden lg:block absolute top-0 bottom-0 left-1/2 w-px bg-gradient-to-b from-transparent via-white/[0.04] to-transparent" />
      )}

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
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

        {/* Large headline — text-only, no image */}
        <StyledHeadline
          text={c.headline}
          tokens={tokens}
          as="h1"
          className="pgl-fade-up leading-[0.95] text-white max-w-5xl text-4xl sm:text-5xl md:text-6xl lg:text-8xl xl:text-9xl"
          accentClassName={cn(
            (isIndustrial || isBold) && "normal-case",
            isElegant && "italic"
          )}
        />

        {/* Subheadline — always light on dark */}
        <p
          className={cn(
            "pgl-fade-up mt-8 text-base md:text-lg leading-[1.75] max-w-[440px] font-light",
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
