"use client";

import { cn } from "@/lib/utils";
import type { DesignTokens } from "@/types/ai-generation";
import { ServicesContentSchema } from "@/types/ai-generation";
import { StyledHeadline } from "../../shared/styled-headline";
import { PglButton } from "../../shared/pgl-button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Props {
  content: Record<string, unknown>;
  tokens: DesignTokens;
  isDark?: boolean;
}

export function ServicesAccordion({ content, tokens }: Props) {
  const parsed = ServicesContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const style = tokens.style;
  const isMinimal = style === "minimal";
  const isElegant = style === "elegant";
  const isWarm = style === "warm";
  const isBold = style === "bold";

  /* Services are always on light bg */
  const textColor = tokens.palette.text;
  const mutedColor = tokens.palette.textMuted;

  return (
    <div className="relative overflow-hidden">
      {/* Decorative background shape */}
      {!isMinimal && (
        <div
          className="hidden lg:block absolute -bottom-[200px] -right-[200px] w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ backgroundColor: tokens.palette.accent, opacity: 0.02 }}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header: 2-column layout like FAQ */}
        <div className="grid md:grid-cols-5 gap-6 md:gap-10 lg:gap-20">
          {/* Left: heading */}
          <div className="md:col-span-2">
            <StyledHeadline
              text={c.title}
              tokens={tokens}
              className="pgl-fade-up text-2xl md:text-3xl lg:text-5xl leading-[1.05]"
              accentClassName="normal-case"
            />
            {c.subtitle && (
              <p
                className="pgl-fade-up mt-5 text-[0.925rem] leading-[1.7] font-light"
                style={{ color: mutedColor }}
                data-delay="1"
              >
                {c.subtitle}
              </p>
            )}
          </div>

          {/* Right: accordion */}
          <div className="md:col-span-3">
            <Accordion type="multiple">
              {c.items.map((item, i) => (
                <AccordionItem
                  key={i}
                  value={`item-${i}`}
                  className={cn(
                    "pgl-fade-up border-b",
                    isElegant && "mb-3 border px-4",
                    isWarm && "mb-2",
                  )}
                  style={{
                    borderColor: isElegant
                      ? `${textColor}0f`
                      : `${textColor}0a`,
                    ...(isWarm
                      ? { backgroundColor: `${tokens.palette.primary}06` }
                      : {}),
                    borderRadius: isElegant
                      ? "var(--card-radius, 12px)"
                      : isWarm
                        ? "var(--card-radius, 8px)"
                        : undefined,
                    animationDelay: `${(i + 1) * 0.1}s`,
                  }}
                  data-delay={i + 1}
                >
                  <AccordionTrigger className="flex justify-between items-center w-full py-4 md:py-6 hover:no-underline group/trigger">
                    <div className="flex items-center justify-between w-full pr-4">
                      <div className="flex items-center gap-3 md:gap-4">
                        {isMinimal ? (
                          <div
                            className="w-1 h-4 shrink-0"
                            style={{ backgroundColor: tokens.palette.accent }}
                          />
                        ) : (
                          <span
                            className="text-[0.7rem] font-medium tracking-[0.12em] uppercase"
                            style={{ color: tokens.palette.accent }}
                          >
                            {String(i + 1).padStart(2, "0")}
                          </span>
                        )}
                        <h3
                          className={cn(
                            "text-[0.925rem] font-medium text-left group-hover/trigger:text-[--hover-c]",
                            isBold && "!font-bold",
                          )}
                          style={
                            {
                              color: textColor,
                              "--hover-c": tokens.palette.accent,
                              transition: `color var(--transition-speed, 0.4s)`,
                            } as React.CSSProperties
                          }
                        >
                          {item.name}
                        </h3>
                      </div>
                      {item.price && (
                        <span
                          className="text-sm font-semibold tabular-nums shrink-0 ml-4"
                          style={{ color: tokens.palette.accent }}
                        >
                          {item.price}
                        </span>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pb-4 md:pb-6 pl-7 md:pl-9">
                      {/* Accent line */}
                      {!isMinimal && (
                        <div
                          className="w-6 h-0.5 mb-3"
                          style={{ backgroundColor: tokens.palette.accent }}
                        />
                      )}
                      <p
                        className="text-[0.875rem] leading-[1.8] font-light max-w-[540px]"
                        style={{ color: mutedColor }}
                      >
                        {item.description}
                      </p>
                      {item.ctaLink && (
                        <div className="mt-3">
                          <PglButton
                            href={item.ctaLink}
                            variant="secondary"
                            tokens={tokens}
                            className="text-[0.8rem]"
                          >
                            {item.ctaText ?? "Saiba mais"}
                          </PglButton>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
}
