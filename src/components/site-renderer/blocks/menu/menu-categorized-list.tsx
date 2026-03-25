"use client";

import { cn } from "@/lib/utils";
import type { DesignTokens } from "@/types/ai-generation";
import { MenuContentSchema } from "@/types/ai-generation";
import { StyledHeadline } from "../../shared/styled-headline";

interface Props {
  content: Record<string, unknown>;
  tokens: DesignTokens;
  isDark?: boolean;
}

export function MenuCategorizedList({ content, tokens }: Props) {
  const parsed = MenuContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const style = tokens.style ?? "industrial";
  const isIndustrial = style === "industrial";
  const isElegant = style === "elegant";
  const isWarm = style === "warm";
  const isBold = style === "bold";
  const isMinimal = style === "minimal";

  return (
    <div className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 mb-10 md:mb-16 items-end">
          <StyledHeadline
            text={c.title}
            tokens={tokens}
            as="h2"
            className="pgl-fade-up text-3xl sm:text-4xl md:text-5xl leading-[1.05]"
            data-pgl-path="title"
            data-pgl-edit="text"
          />
          {c.subtitle && (
            <p
              className="pgl-fade-up text-[0.95rem] leading-[1.8] font-light"
              style={{ color: tokens.palette.textMuted }}
              data-delay="1"
              data-pgl-path="subtitle"
              data-pgl-edit="text"
            >
              {c.subtitle}
            </p>
          )}
        </div>

        {/* Categories */}
        {c.categories.map((category, catIndex) => (
          <div
            key={catIndex}
            className="pgl-fade-up mb-10 md:mb-14 last:mb-0"
            data-delay={String(Math.min(catIndex + 2, 7))}
          >
            {/* Category label */}
            <div className="flex items-center gap-3 mb-4 md:mb-5">
              <span
                className={cn(
                  "text-[0.7rem] font-medium uppercase tracking-[0.15em]",
                  isBold && "text-[0.8rem] !font-bold",
                )}
                style={{ color: tokens.palette.accent }}
                data-pgl-path={`categories.${catIndex}.name`}
                data-pgl-edit="text"
              >
                {category.name}
              </span>
              {!isMinimal && (
                <div
                  className="flex-1 h-px"
                  style={{ backgroundColor: `${tokens.palette.text}0a` }}
                />
              )}
            </div>

            {/* Items */}
            <div
              className="divide-y"
              style={{ borderColor: `${tokens.palette.text}08` }}
            >
              {category.items.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  className={cn(
                    "flex items-start justify-between gap-4 py-3 md:py-4 group transition-colors duration-[400ms]",
                    (isIndustrial || isBold) &&
                      "hover:bg-black/[0.03] -mx-4 px-4",
                    isElegant && "hover:bg-black/[0.01]",
                    isWarm && "hover:bg-black/[0.01]",
                    isMinimal && "hover:bg-transparent",
                  )}
                  style={{
                    borderColor: `${tokens.palette.text}08`,
                    borderRadius:
                      (isIndustrial || isBold)
                        ? "var(--card-radius)"
                        : undefined,
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      {/* industrial/bold: numbered items */}
                      {(isIndustrial || isBold) && (
                        <span
                          className="text-[0.65rem] font-bold tabular-nums"
                          style={{ color: `${tokens.palette.text}26` }}
                        >
                          {String(itemIndex + 1).padStart(2, "0")}
                        </span>
                      )}
                      <h3
                        className={cn(
                          "text-[0.9rem] font-semibold tracking-[0.02em]",
                          (isIndustrial || isBold) && "uppercase",
                          isBold && "text-[0.95rem] !font-bold",
                        )}
                        style={{
                          fontFamily: "var(--pgl-font-heading)",
                          color: tokens.palette.text,
                        }}
                        data-pgl-path={`categories.${catIndex}.items.${itemIndex}.name`}
                        data-pgl-edit="text"
                      >
                        {item.name}
                      </h3>
                      {item.badge && (
                        <span
                          className="text-[0.6rem] font-medium tracking-[0.08em] uppercase px-2 py-0.5 text-white"
                          style={{
                            backgroundColor: tokens.palette.accent,
                            borderRadius: "var(--btn-radius)",
                          }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                    {item.description && (
                      <p
                        className="text-[0.8rem] font-light mt-0.5"
                        style={{ color: tokens.palette.textMuted }}
                        data-pgl-path={`categories.${catIndex}.items.${itemIndex}.description`}
                        data-pgl-edit="text"
                      >
                        {item.description}
                      </p>
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-[0.9rem] font-semibold tabular-nums shrink-0",
                      isBold && "text-[1rem] !font-bold",
                    )}
                    style={{ color: tokens.palette.primary }}
                    data-pgl-path={`categories.${catIndex}.items.${itemIndex}.price`}
                    data-pgl-edit="text"
                  >
                    {item.price}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
