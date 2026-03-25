"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { DesignTokens } from "@/types/ai-generation";
import { MenuContentSchema } from "@/types/ai-generation";
import { StyledHeadline } from "../../shared/styled-headline";

interface Props {
  content: Record<string, unknown>;
  tokens: DesignTokens;
  isDark?: boolean;
}

export function MenuTabs({ content, tokens }: Props) {
  const parsed = MenuContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const [activeTab, setActiveTab] = useState(c.categories[0]?.name ?? "");

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

        {/* Tab buttons - scrollable on mobile */}
        <div
          className="pgl-fade-up overflow-x-auto mb-8 md:mb-10 -mx-4 px-4 sm:mx-0 sm:px-0"
          data-delay="2"
        >
          <div className="flex flex-nowrap gap-2 min-w-max sm:min-w-0 sm:flex-wrap">
            {c.categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setActiveTab(cat.name)}
                className={cn(
                  "text-[0.75rem] font-medium tracking-[0.08em] uppercase px-5 py-2.5 transition-all duration-[400ms] whitespace-nowrap shrink-0",
                  activeTab !== cat.name && "border hover:border-black/20",
                  isMinimal && activeTab === cat.name && "!bg-transparent !border-b-2 !rounded-none",
                  isMinimal && activeTab !== cat.name && "!border-0 !border-b-2 !border-transparent !rounded-none",
                )}
                style={{
                  borderRadius: isMinimal ? "0" : "var(--btn-radius)",
                  backgroundColor: activeTab === cat.name
                    ? isMinimal ? "transparent" : tokens.palette.primary
                    : "transparent",
                  borderColor: activeTab === cat.name
                    ? isMinimal ? tokens.palette.accent : tokens.palette.primary
                    : `${tokens.palette.text}1a`,
                  color: activeTab === cat.name
                    ? isMinimal ? tokens.palette.accent : "#fff"
                    : tokens.palette.textMuted,
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Active tab content */}
        {c.categories.map((category, catIndex) =>
          category.name !== activeTab ? null : (
            <div
              key={category.name}
              className="divide-y"
              style={{ borderColor: `${tokens.palette.text}08` }}
            >
              {category.items.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  className={cn(
                    "pgl-fade-up flex items-start justify-between gap-4 py-3 md:py-4 group transition-colors duration-[400ms]",
                    (isIndustrial || isBold) &&
                      "hover:bg-black/[0.03] -mx-4 px-4",
                    isElegant && "hover:bg-black/[0.01]",
                    isWarm && "hover:bg-black/[0.01]",
                  )}
                  data-delay={String(Math.min(itemIndex + 1, 7))}
                  style={{ borderColor: `${tokens.palette.text}08` }}
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
          )
        )}
      </div>
    </div>
  );
}
