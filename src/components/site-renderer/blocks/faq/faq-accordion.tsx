"use client";

import { useState } from "react";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { StyledHeadline } from "../../shared/styled-headline";
import { PglButton } from "../../shared/pgl-button";
import type { DesignTokens } from "@/types/ai-generation";
import { FaqContentSchema } from "@/types/ai-generation";

interface Props {
  content: Record<string, unknown>;
  tokens: DesignTokens;
  isDark?: boolean;
}

interface InnerProps {
  c: z.infer<typeof FaqContentSchema>;
  tokens: DesignTokens;
}

function FaqAccordionInner({ c, tokens }: InnerProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const style = tokens.style;

  const isMinimal = style === "minimal";
  const isElegant = style === "elegant";
  const isWarm = style === "warm";
  const isBold = style === "bold";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div
        className={cn(
          isMinimal
            ? "flex flex-col"
            : "grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-20 items-start",
        )}
      >
        {/* Left: header + CTA (hidden for minimal) */}
        {!isMinimal && (
          <div className="lg:col-span-2 pgl-fade-up">
            <StyledHeadline
              text={c.title}
              tokens={tokens}
              className="text-3xl md:text-4xl lg:text-5xl leading-[1.1]"
              data-pgl-path="title"
              data-pgl-edit="text"
            />
            {c.subtitle && (
              <p
                className="mt-4 text-base md:text-lg leading-[1.6] font-light"
                style={{ color: tokens.palette.textMuted }}
                data-pgl-path="subtitle"
                data-pgl-edit="text"
              >
                {c.subtitle}
              </p>
            )}
            <PglButton
              href="#contact"
              tokens={tokens}
              className={cn("mt-8", isBold && "w-full")}
            >
              Falar no WhatsApp
            </PglButton>
          </div>
        )}

        {/* Minimal: full-width heading above accordion */}
        {isMinimal && (
          <div className="mb-10 pgl-fade-up">
            <StyledHeadline
              text={c.title}
              tokens={tokens}
              className="text-3xl md:text-4xl lg:text-5xl leading-[1.1]"
              data-pgl-path="title"
              data-pgl-edit="text"
            />
            {c.subtitle && (
              <p
                className="mt-4 text-base md:text-lg leading-[1.6] font-light max-w-2xl"
                style={{ color: tokens.palette.textMuted }}
                data-pgl-path="subtitle"
                data-pgl-edit="text"
              >
                {c.subtitle}
              </p>
            )}
          </div>
        )}

        {/* Right: accordion */}
        <div
          className={cn(
            "pgl-fade-up",
            isMinimal ? "w-full" : "lg:col-span-3",
          )}
          data-delay="1"
        >
          {c.items.map((item, i) => {
            const isOpen = openIndex === i;

            /* Elegant: card-per-item */
            if (isElegant) {
              return (
                <div
                  key={i}
                  className="mb-3 overflow-hidden transition-all duration-[400ms]"
                  style={{
                    backgroundColor: isOpen
                      ? `${tokens.palette.surface}`
                      : `${tokens.palette.surface}80`,
                    borderRadius: "var(--card-radius, 12px)",
                    border: `1px solid ${tokens.palette.text}08`,
                  }}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-5 px-6 py-5 text-left group"
                  >
                    <span
                      className="text-base font-medium tracking-tight transition-colors duration-[400ms] group-hover:!text-[--accent]"
                      style={
                        {
                          color: tokens.palette.text,
                          "--accent": tokens.palette.accent,
                        } as React.CSSProperties
                      }
                      data-pgl-path={`items.${i}.question`}
                      data-pgl-edit="text"
                    >
                      {item.question}
                    </span>
                    <span
                      className="w-7 h-7 rounded-full border flex items-center justify-center flex-shrink-0 transition-all duration-[400ms]"
                      style={{
                        borderColor: `${tokens.palette.text}10`,
                        transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                      }}
                    >
                      <Plus
                        className="w-3 h-3"
                        style={{ color: tokens.palette.textMuted }}
                      />
                    </span>
                  </button>
                  <div
                    className={cn(
                      "grid transition-all duration-[400ms]",
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0",
                    )}
                  >
                    <div className="overflow-hidden">
                      <p
                        className="px-6 pb-6 text-sm leading-relaxed font-light max-w-[540px]"
                        style={{ color: tokens.palette.textMuted }}
                        data-pgl-path={`items.${i}.answer`}
                        data-pgl-edit="text"
                      >
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            }

            /* Default / industrial / warm / bold / minimal */
            return (
              <div
                key={i}
                className={cn("border-b", isBold && "border-b-2")}
                style={{
                  borderColor: isWarm && isOpen
                    ? tokens.palette.accent
                    : `${tokens.palette.text}08`,
                  transition: `border-color var(--transition-speed, 0.4s)`,
                }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-5 px-4 py-5 text-left group"
                >
                  <span
                    className={cn(
                      "font-medium tracking-tight transition-colors duration-[400ms]",
                      "group-hover:!text-[--accent]",
                      isBold
                        ? "text-base md:text-lg font-bold"
                        : "text-base",
                    )}
                    style={
                      {
                        color: isWarm && isOpen
                          ? tokens.palette.accent
                          : tokens.palette.text,
                        "--accent": tokens.palette.accent,
                      } as React.CSSProperties
                    }
                    data-pgl-path={`items.${i}.question`}
                    data-pgl-edit="text"
                  >
                    {item.question}
                  </span>
                  <span
                    className="w-7 h-7 rounded-full border flex items-center justify-center flex-shrink-0 transition-all duration-[400ms]"
                    style={{
                      borderColor: `${tokens.palette.text}10`,
                      transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                    }}
                  >
                    <Plus
                      className="w-3 h-3"
                      style={{ color: tokens.palette.textMuted }}
                    />
                  </span>
                </button>
                <div
                  className={cn(
                    "grid transition-all duration-[400ms]",
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  <div className="overflow-hidden">
                    <p
                      className="px-4 pb-6 text-sm leading-relaxed font-light max-w-[540px]"
                      style={{ color: tokens.palette.textMuted }}
                      data-pgl-path={`items.${i}.answer`}
                      data-pgl-edit="text"
                    >
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function FaqAccordion({ content, tokens }: Props) {
  const parsed = FaqContentSchema.safeParse(content);
  if (!parsed.success) return null;
  return <FaqAccordionInner c={parsed.data} tokens={tokens} />;
}
