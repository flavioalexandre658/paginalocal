"use client";

import { cn } from "@/lib/utils";
import type { DesignTokens } from "@/types/ai-generation";
import { FeaturedProductsContentSchema } from "@/types/ai-generation";
import { StyledHeadline } from "../../shared/styled-headline";

interface Props {
  content: Record<string, unknown>;
  tokens: DesignTokens;
  isDark?: boolean;
}

export function FeaturedHighlightGrid({ content, tokens, isDark }: Props) {
  const parsed = FeaturedProductsContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const [featured, ...rest] = c.items;

  const isBold = tokens.style === "bold";

  const cardBorder = isDark
    ? `1px solid rgba(255,255,255,0.06)`
    : `1px solid ${tokens.palette.text}08`;

  const cardStyle: React.CSSProperties = {
    borderRadius: "var(--card-radius)",
    border: cardBorder,
    backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "#fff",
    boxShadow: isDark ? "none" : `0 2px 16px ${tokens.palette.text}06`,
    transition: `all var(--transition-speed, 0.4s)`,
  };

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
          />
          {c.subtitle && (
            <p
              className="pgl-fade-up text-sm md:text-base leading-[1.8] font-light"
              style={{ color: isDark ? "rgba(255,255,255,0.5)" : tokens.palette.textMuted }}
              data-delay="1"
            >
              {c.subtitle}
            </p>
          )}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 md:gap-6">
          {/* Featured item */}
          <div
            className={cn(
              "pgl-fade-up overflow-hidden group relative",
              c.items.length >= 4 && "md:row-span-2",
            )}
            data-delay="1"
            style={cardStyle}
          >
            <div
              className={cn(
                "relative overflow-hidden",
                c.items.length >= 4 ? "aspect-[3/4] md:aspect-[3/4]" : "aspect-[3/4] md:aspect-[4/5]",
              )}
            >
              {featured.image ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={featured.image}
                    alt={featured.name}
                    className="w-full h-full object-cover group-hover:scale-[1.03]"
                    style={{ transition: `transform var(--transition-speed, 0.4s)` }}
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
                    {featured.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}

              {featured.badge && (
                <span
                  className={cn(
                    "absolute top-4 left-4 text-[0.65rem] font-medium tracking-[0.08em] uppercase px-3 py-1.5 text-white",
                    isBold && "!font-bold px-4 py-2",
                  )}
                  style={{
                    backgroundColor: tokens.palette.accent,
                    borderRadius: "var(--btn-radius, 2px)",
                  }}
                >
                  {featured.badge}
                </span>
              )}
            </div>

            <div className="p-4 md:p-6">
              <h3
                className={cn(
                  "text-[1rem] font-semibold uppercase tracking-[0.03em]",
                  isBold && "!font-extrabold",
                )}
                style={{
                  fontFamily: "var(--pgl-font-heading)",
                  color: isDark ? "#fff" : tokens.palette.text,
                }}
              >
                {featured.name}
              </h3>
              {featured.description && (
                <p
                  className="text-sm md:text-base font-light line-clamp-2 mt-1"
                  style={{ color: isDark ? "rgba(255,255,255,0.5)" : tokens.palette.textMuted }}
                >
                  {featured.description}
                </p>
              )}
              <div className="mt-3 flex items-baseline gap-2">
                {featured.price && (
                  <span
                    className={cn(
                      "text-[1.15rem] font-semibold tabular-nums",
                      isBold && "text-[1.35rem] !font-extrabold",
                    )}
                    style={{ color: tokens.palette.primary }}
                  >
                    {featured.price}
                  </span>
                )}
                {featured.originalPrice && (
                  <span
                    className="text-[0.8rem] line-through tabular-nums"
                    style={{ color: isDark ? "rgba(255,255,255,0.35)" : tokens.palette.textMuted }}
                  >
                    {featured.originalPrice}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Rest of items */}
          {rest.map((item, index) => (
            <div
              key={index}
              className="pgl-fade-up overflow-hidden group relative"
              data-delay={String(Math.min(index + 2, 7))}
              style={cardStyle}
            >
              <div className="relative aspect-[3/4] md:aspect-[4/5] overflow-hidden">
                {item.image ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-[1.03]"
                      style={{ transition: `transform var(--transition-speed, 0.4s)` }}
                    />
                  </>
                ) : (
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ backgroundColor: `${tokens.palette.primary}10` }}
                  >
                    <span
                      className="text-4xl font-bold opacity-15"
                      style={{ fontFamily: "var(--pgl-font-heading)", color: tokens.palette.primary }}
                    >
                      {item.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}

                {item.badge && (
                  <span
                    className={cn(
                      "absolute top-3 left-3 text-[0.65rem] font-medium tracking-[0.08em] uppercase px-2.5 py-1 text-white",
                      isBold && "!font-bold px-3 py-1.5",
                    )}
                    style={{
                      backgroundColor: tokens.palette.accent,
                      borderRadius: "var(--btn-radius, 2px)",
                    }}
                  >
                    {item.badge}
                  </span>
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
                >
                  {item.name}
                </h3>
                {item.description && (
                  <p
                    className="text-sm md:text-base font-light line-clamp-2 mt-1"
                    style={{ color: isDark ? "rgba(255,255,255,0.45)" : tokens.palette.textMuted }}
                  >
                    {item.description}
                  </p>
                )}
                <div className="mt-2 flex items-baseline gap-2">
                  {item.price && (
                    <span
                      className={cn(
                        "text-[1rem] font-semibold tabular-nums",
                        isBold && "text-[1.15rem] !font-extrabold",
                      )}
                      style={{ color: tokens.palette.primary }}
                    >
                      {item.price}
                    </span>
                  )}
                  {item.originalPrice && (
                    <span
                      className="text-[0.75rem] line-through tabular-nums"
                      style={{ color: isDark ? "rgba(255,255,255,0.35)" : tokens.palette.textMuted }}
                    >
                      {item.originalPrice}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
