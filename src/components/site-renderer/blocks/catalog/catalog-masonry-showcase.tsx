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

export function CatalogMasonryShowcase({ content, tokens, isDark }: Props) {
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
              "pgl-fade-up text-3xl sm:text-4xl md:text-5xl leading-[1.1]",
              isDark ? "text-white" : undefined,
            )}
            data-pgl-path="title"
            data-pgl-edit="text"
          />
          {c.subtitle && (
            <p
              className="pgl-fade-up text-sm md:text-base leading-[1.6] font-light"
              style={{ color: isDark ? "rgba(255,255,255,0.5)" : tokens.palette.textMuted }}
              data-delay="1"
              data-pgl-path="subtitle"
              data-pgl-edit="text"
            >
              {c.subtitle}
            </p>
          )}
        </div>

        {/* Masonry grid */}
        <div className="columns-2 md:columns-3 gap-3 md:gap-4">
          {c.categories.map((category, index) => {
            const isFirst = index === 0;
            const isFeatured = isFirst;

            return (
              <div
                key={index}
                className={cn(
                  "pgl-fade-up break-inside-avoid mb-3 md:mb-4 relative overflow-hidden cursor-pointer group",
                  isFirst && "col-span-2",
                )}
                style={{
                  borderRadius: "var(--card-radius)",
                  transition: `all var(--transition-speed, 0.4s)`,
                  ...(isFeatured
                    ? { border: `2px solid ${tokens.palette.accent}` }
                    : {
                        border: isDark
                          ? "1px solid rgba(255,255,255,0.08)"
                          : "1px solid rgba(0,0,0,0.06)",
                      }),
                }}
                data-delay={String(Math.min(index + 1, 7))}
              >
                {/* Image */}
                <div
                  className={cn(
                    "relative overflow-hidden",
                    isFirst ? "aspect-[4/5]" : "aspect-[3/4]",
                  )}
                >
                  {category.image ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={category.image}
                        alt={category.name}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.05]"
                        style={{ transition: `transform var(--transition-speed, 0.4s)` }}
                        data-pgl-path={`categories.${index}.image`}
                        data-pgl-edit="image"
                      />
                    </>
                  ) : (
                    <div
                      className="absolute inset-0 flex items-center justify-center"
                      style={{
                        backgroundColor: isDark
                          ? `${tokens.palette.primary}20`
                          : `${tokens.palette.primary}10`,
                      }}
                    >
                      <span
                        className="text-7xl font-bold opacity-10"
                        style={{
                          fontFamily: "var(--pgl-font-heading)",
                          color: tokens.palette.primary,
                        }}
                      >
                        {category.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}

                  {/* Hover overlay */}
                  <div
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100"
                    style={{
                      backgroundColor: `${tokens.palette.accent}cc`,
                      transition: `opacity var(--transition-speed, 0.4s)`,
                    }}
                  >
                    <span
                      className={cn(
                        "text-white text-sm font-medium tracking-[0.08em] uppercase px-5 py-2.5",
                        isBold && "font-bold",
                      )}
                      style={{ borderRadius: "var(--btn-radius)" }}
                    >
                      Ver produto
                    </span>
                  </div>

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                    <h3
                      className={cn(
                        "text-white font-semibold tracking-[0.02em]",
                        isFirst ? "text-lg md:text-xl" : "text-sm md:text-base",
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
                        className={cn(
                          "text-white/60 font-light line-clamp-2 mt-1",
                          isFirst ? "text-sm" : "text-xs",
                        )}
                        data-pgl-path={`categories.${index}.description`}
                        data-pgl-edit="text"
                      >
                        {category.description}
                      </p>
                    )}
                    {category.productCount !== undefined && (
                      <p className="text-xs text-white/40 uppercase tracking-[0.08em] font-normal mt-2 tabular-nums">
                        {category.productCount} produtos
                      </p>
                    )}
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
