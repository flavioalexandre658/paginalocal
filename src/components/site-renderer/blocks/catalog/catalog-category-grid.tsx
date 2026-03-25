"use client";

import { cn } from "@/lib/utils";
import type { DesignTokens } from "@/types/ai-generation";
import { CatalogContentSchema } from "@/types/ai-generation";
import { StyledHeadline } from "../../shared/styled-headline";

interface Props {
  content: Record<string, unknown>;
  tokens: DesignTokens;
  isDark?: boolean;
}

export function CatalogCategoryGrid({ content, tokens, isDark }: Props) {
  const parsed = CatalogContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const isBold = tokens.style === "bold";

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

        {/* Category grid */}
        <div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[2px] overflow-hidden"
          style={{
            borderRadius: "var(--card-radius)",
            backgroundColor: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
          }}
        >
          {c.categories.map((category, index) => (
            <div
              key={index}
              className="pgl-fade-up relative aspect-[4/3] overflow-hidden cursor-pointer group"
              style={{
                backgroundColor: isDark ? tokens.palette.primary : "#fff",
                transition: `all var(--transition-speed, 0.4s)`,
              }}
              data-delay={String(Math.min(index + 1, 7))}
            >
              {category.image ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={category.image}
                    alt={category.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03]"
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
                    className="text-6xl font-bold opacity-10"
                    style={{ fontFamily: "var(--pgl-font-heading)", color: tokens.palette.primary }}
                  >
                    {category.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                <h3
                  className={cn(
                    "text-[1.1rem] font-semibold text-white uppercase tracking-[0.03em]",
                    isBold && "!font-extrabold",
                  )}
                  style={{ fontFamily: "var(--pgl-font-heading)" }}
                  data-pgl-path={`categories.${index}.name`}
                  data-pgl-edit="text"
                >
                  {category.name}
                </h3>
                {category.description && (
                  <p
                    className="text-sm md:text-base text-white/60 font-light line-clamp-2 mt-1"
                    data-pgl-path={`categories.${index}.description`}
                    data-pgl-edit="text"
                  >
                    {category.description}
                  </p>
                )}
                {category.productCount !== undefined && (
                  <p className="text-[0.7rem] text-white/40 uppercase tracking-[0.08em] font-normal mt-2 tabular-nums">
                    {category.productCount} produtos
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
