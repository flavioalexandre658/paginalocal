"use client";

import { cn } from "@/lib/utils";
import { StyledHeadline } from "../../shared/styled-headline";
import { PglButton } from "../../shared/pgl-button";
import { SectionPattern } from "../../shared/section-pattern";
import type { DesignTokens } from "@/types/ai-generation";
import { CtaContentSchema } from "@/types/ai-generation";

interface Props {
  content: Record<string, unknown>;
  tokens: DesignTokens;
  isDark?: boolean;
}

export function CtaCardFloating({ content, tokens }: Props) {
  const parsed = CtaContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const style = tokens.style;
  const isBold = style === "bold";
  const isElegant = style === "elegant";
  const isWarm = style === "warm";

  const ctaHref =
    c.ctaType === "whatsapp"
      ? `https://wa.me/${(c.ctaLink ?? "").replace(/\D/g, "")}`
      : c.ctaLink ?? "#";

  const overlayGradient = (() => {
    if (isElegant) return `linear-gradient(135deg, ${tokens.palette.primary}cc, ${tokens.palette.primary}99)`;
    if (isWarm) return `linear-gradient(180deg, ${tokens.palette.primary}dd, ${tokens.palette.accent}88)`;
    return `linear-gradient(135deg, ${tokens.palette.primary}ee, ${tokens.palette.primary}cc)`;
  })();

  return (
    <div className="relative overflow-hidden">
      {/* Dark background with overlay */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: tokens.palette.primary }}
      />
      <div
        className="absolute inset-0"
        style={{ background: overlayGradient }}
      />

      {/* Style-driven pattern */}
      <SectionPattern tokens={tokens} />

      <div className="relative z-10 py-16 md:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="relative max-w-2xl mx-auto p-8 md:p-14 text-center overflow-hidden pgl-fade-up"
          style={{
            backgroundColor: `${tokens.palette.background}08`,
            border: `1px solid rgba(255,255,255,0.08)`,
            borderRadius: "var(--card-radius, 8px)",
          }}
        >
          {/* Decorative bar at top */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 rounded-b-full"
            style={{ backgroundColor: tokens.palette.accent }}
            aria-hidden="true"
          />

          <StyledHeadline
            text={c.title}
            tokens={tokens}
            className="text-2xl md:text-3xl lg:text-4xl text-white leading-[1.1]"
            accentClassName="normal-case"
            data-pgl-path="title"
            data-pgl-edit="text"
          />
          {c.subtitle && (
            <p
              className="mt-4 text-sm md:text-base leading-[1.6] text-white/50 font-light"
              data-pgl-path="subtitle"
              data-pgl-edit="text"
            >
              {c.subtitle}
            </p>
          )}
          <PglButton
            href={ctaHref}
            tokens={tokens}
            isDark
            className={cn(
              "mt-7 md:mt-9 text-white",
              isBold && "w-full",
            )}
            data-pgl-path="ctaText"
            data-pgl-edit="button"
          >
            {c.ctaText}
          </PglButton>
        </div>
      </div>
    </div>
  );
}
