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

export function CtaGradient({ content, tokens }: Props) {
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
    return `linear-gradient(135deg, ${tokens.palette.primary}dd, ${tokens.palette.primary}99)`;
  })();

  return (
    <div className="relative h-[320px] md:h-[480px] overflow-hidden">
      {/* Gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${tokens.palette.primary}, ${tokens.palette.secondary})`,
        }}
      />

      {/* Overlay for depth */}
      <div
        className="absolute inset-0"
        style={{ background: overlayGradient }}
      />

      {/* Style-driven pattern */}
      <SectionPattern tokens={tokens} />

      {/* Decorative blur circles */}
      <div
        className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none"
        style={{ backgroundColor: "rgba(255,255,255,0.07)" }}
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full blur-3xl pointer-events-none"
        style={{ backgroundColor: "rgba(0,0,0,0.1)" }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="text-center max-w-[600px] px-6 pgl-fade-up">
          <StyledHeadline
            text={c.title}
            tokens={tokens}
            className="text-2xl md:text-3xl lg:text-5xl text-white leading-[1.1]"
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
              isBold && "w-full max-w-md mx-auto",
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
