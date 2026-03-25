"use client";

import { cn } from "@/lib/utils";
import type { DesignTokens } from "@/types/ai-generation";
import { CatalogContentSchema } from "@/types/ai-generation";
import { StyledHeadline } from "../../shared/styled-headline";
import { PglButton } from "../../shared/pgl-button";

interface Props {
  content: Record<string, unknown>;
  tokens: DesignTokens;
  isDark?: boolean;
}

export function CatalogProductGrid({ content, tokens, isDark }: Props) {
  const parsed = CatalogContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const isBold = tokens.style === "bold";

  const cardBorder = isDark
    ? `1px solid rgba(255,255,255,0.06)`
    : `1px solid ${tokens.palette.text}08`;

  return (
    <div className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 mb-10 md:mb-16 items-end">
          <StyledHeadline
            text={c.title}
            tokens={tokens}
            as="h2"
            className={cn(
              "pgl-fade-up text-3xl sm:text-4xl md:text-5xl leading-[1.05]",
              isDark ? "text-white" : undefined,
            )}
            data-pgl-path="title"
            data-pgl-edit="text"
          />
          {c.subtitle && (
            <p
              className="pgl-fade-up text-sm md:text-base leading-[1.8] font-light"
              style={{ color: isDark ? "rgba(255,255,255,0.5)" : tokens.palette.textMuted }}
              data-delay="1"
              data-pgl-path="subtitle"
              data-pgl-edit="text"
            >
              {c.subtitle}
            </p>
          )}
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
          {c.categories.map((category, index) => (
            <div
              key={index}
              className="pgl-fade-up group overflow-hidden"
              data-delay={String(Math.min(index + 1, 7))}
              style={{
                borderRadius: "var(--card-radius)",
                border: cardBorder,
                backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "#fff",
                boxShadow: isDark ? "none" : `0 2px 16px ${tokens.palette.text}06`,
                transition: `all var(--transition-speed, 0.4s)`,
              }}
            >
              <div className="relative aspect-[3/4] md:aspect-[4/5] overflow-hidden">
                {category.image ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-[1.03]"
                      style={{ transition: `transform var(--transition-speed, 0.4s)` }}
                      data-pgl-path={`categories.${index}.image`}
                      data-pgl-edit="image"
                    />
                  </>
                ) : (
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ backgroundColor: `${tokens.palette.primary}10` }}
                  >
                    <span
                      className="text-3xl font-bold opacity-15"
                      style={{ fontFamily: "var(--pgl-font-heading)", color: tokens.palette.primary }}
                    >
                      {category.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              <div className="p-4 md:p-6">
                <h3
                  className={cn(
                    "text-[0.85rem] font-semibold uppercase tracking-[0.03em]",
                    isBold && "!font-extrabold",
                  )}
                  style={{
                    fontFamily: "var(--pgl-font-heading)",
                    color: isDark ? "#fff" : tokens.palette.text,
                  }}
                  data-pgl-path={`categories.${index}.name`}
                  data-pgl-edit="text"
                >
                  {category.name}
                </h3>
                {category.description && (
                  <p
                    className="text-sm md:text-base font-light line-clamp-2 mt-1"
                    style={{ color: isDark ? "rgba(255,255,255,0.45)" : tokens.palette.textMuted }}
                    data-pgl-path={`categories.${index}.description`}
                    data-pgl-edit="text"
                  >
                    {category.description}
                  </p>
                )}
                {category.productCount !== undefined && (
                  <p
                    className={cn(
                      "text-[0.8rem] font-semibold tabular-nums mt-2",
                      isBold && "text-[0.9rem] !font-extrabold",
                    )}
                    style={{ color: tokens.palette.primary }}
                  >
                    {category.productCount} produtos
                  </p>
                )}
                <div className="mt-3 opacity-0 group-hover:opacity-100" style={{ transition: `opacity var(--transition-speed, 0.4s)` }}>
                  <PglButton
                    variant="secondary"
                    tokens={tokens}
                    isDark={isDark}
                    className="w-full"
                    data-pgl-path="ctaText"
                    data-pgl-edit="button"
                  >
                    {c.ctaText}
                  </PglButton>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
