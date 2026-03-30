"use client";

import { cn } from "@/lib/utils";
import { StyledHeadline } from "../../shared/styled-headline";
import type { DesignTokens } from "@/types/ai-generation";
import { FaqContentSchema } from "@/types/ai-generation";

interface FaqItemProps {
  item: { question: string; answer: string };
  tokens: DesignTokens;
  isElegant: boolean;
  isWarm: boolean;
  isBold: boolean;
  originalIndex: number;
}

function FaqItem({ item, tokens, isElegant, isWarm, isBold, originalIndex }: FaqItemProps) {
  if (isElegant) {
    return (
      <div
        className="p-6 space-y-3"
        style={{
          backgroundColor: `${tokens.palette.surface}80`,
          borderRadius: "var(--card-radius, 12px)",
          border: `1px solid ${tokens.palette.text}08`,
        }}
      >
        <h3
          className="text-base font-bold tracking-tight uppercase leading-[1.1]"
          style={{ color: tokens.palette.text }}
          data-pgl-path={`items.${originalIndex}.question`}
          data-pgl-edit="text"
        >
          {item.question}
        </h3>
        <p
          className="text-sm leading-relaxed font-light max-w-[540px]"
          style={{ color: tokens.palette.textMuted }}
          data-pgl-path={`items.${originalIndex}.answer`}
          data-pgl-edit="text"
        >
          {item.answer}
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn("space-y-3", isWarm && "pl-4")}
      style={
        isWarm
          ? { borderLeft: `3px solid ${tokens.palette.accent}` }
          : undefined
      }
    >
      <h3
        className={cn(
          "font-bold tracking-tight uppercase leading-[1.1]",
          isBold ? "text-base md:text-lg" : "text-base",
        )}
        style={{ color: tokens.palette.text }}
        data-pgl-path={`items.${originalIndex}.question`}
        data-pgl-edit="text"
      >
        {item.question}
      </h3>
      <p
        className="text-sm leading-relaxed font-light max-w-[540px]"
        style={{ color: tokens.palette.textMuted }}
        data-pgl-path={`items.${originalIndex}.answer`}
        data-pgl-edit="text"
      >
        {item.answer}
      </p>
    </div>
  );
}

interface Props {
  content: Record<string, unknown>;
  tokens: DesignTokens;
  isDark?: boolean;
}

export function FaqTwoColumns({ content, tokens }: Props) {
  const parsed = FaqContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const style = tokens.style;
  const isElegant = style === "elegant";
  const isWarm = style === "warm";
  const isBold = style === "bold";

  const leftItems = c.items.filter((_, i) => i % 2 === 0);
  const rightItems = c.items.filter((_, i) => i % 2 !== 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-12 md:mb-16 pgl-fade-up">
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

      <div
        className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 lg:gap-x-20 gap-y-10 pgl-fade-up"
        data-delay="1"
      >
        <div className={cn("space-y-10", isElegant && "space-y-4")}>
          {leftItems.map((item, index) => (
            <FaqItem key={index} item={item} tokens={tokens} isElegant={isElegant} isWarm={isWarm} isBold={isBold} originalIndex={index * 2} />
          ))}
        </div>
        <div className={cn("space-y-10", isElegant && "space-y-4")}>
          {rightItems.map((item, index) => (
            <FaqItem key={index} item={item} tokens={tokens} isElegant={isElegant} isWarm={isWarm} isBold={isBold} originalIndex={index * 2 + 1} />
          ))}
        </div>
      </div>
    </div>
  );
}
