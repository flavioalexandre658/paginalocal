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

export function MenuCardsImages({ content, tokens }: Props) {
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
            <div className="flex items-center gap-3 mb-4 md:mb-6">
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
              <div
                className="flex-1 h-px"
                style={{ backgroundColor: `${tokens.palette.text}0a` }}
              />
            </div>

            {/* Cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {category.items.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  className={cn(
                    "flex flex-col overflow-hidden group transition-all duration-[400ms]",
                    isMinimal
                      ? "bg-transparent"
                      : cn(
                          "bg-white border hover:border-black/[0.12]",
                          isElegant
                            ? "border-black/[0.08] shadow-sm hover:shadow-md"
                            : "border-black/[0.06]",
                        ),
                    (isIndustrial || isBold) &&
                      "hover:bg-[--pgl-primary] hover:border-[--pgl-primary]",
                  )}
                  style={{ borderRadius: "var(--card-radius)" }}
                >
                  <div
                    className={cn(
                      "relative overflow-hidden",
                      "aspect-video md:aspect-[4/3]",
                    )}
                  >
                    {item.image ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          data-pgl-path={`categories.${catIndex}.items.${itemIndex}.image`}
                          data-pgl-edit="image"
                        />
                        {isWarm && (
                          <div
                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-[400ms]"
                            style={{ backgroundColor: `${tokens.palette.accent}10` }}
                          />
                        )}
                      </>
                    ) : (
                      <div
                        className="absolute inset-0 flex items-center justify-center"
                        style={{ backgroundColor: `${tokens.palette.primary}10` }}
                      >
                        <span
                          className="text-3xl font-bold opacity-10"
                          style={{ fontFamily: "var(--pgl-font-heading)", color: tokens.palette.primary }}
                        >
                          {item.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>

                  <div
                    className={cn(
                      "p-4 flex-1 flex flex-col",
                      isMinimal && "px-0",
                      (isIndustrial || isBold) &&
                        "group-hover:text-white transition-colors duration-[400ms]",
                    )}
                  >
                    <h3
                      className={cn(
                        "text-[0.85rem] font-semibold tracking-[0.03em]",
                        (isIndustrial || isBold) && "uppercase",
                        isBold && "text-[0.9rem] !font-bold",
                        (isIndustrial || isBold) &&
                          "group-hover:text-white transition-colors duration-[400ms]",
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
                    {item.description && (
                      <p
                        className={cn(
                          "text-[0.8rem] font-light line-clamp-2 flex-1 mt-1",
                          (isIndustrial || isBold) &&
                            "group-hover:text-white/70 transition-colors duration-[400ms]",
                        )}
                        style={{ color: tokens.palette.textMuted }}
                        data-pgl-path={`categories.${catIndex}.items.${itemIndex}.description`}
                        data-pgl-edit="text"
                      >
                        {item.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-3">
                      <span
                        className={cn(
                          "text-[0.9rem] font-semibold tabular-nums",
                          isBold && "text-[1rem] !font-bold",
                          (isIndustrial || isBold) &&
                            "group-hover:text-white transition-colors duration-[400ms]",
                        )}
                        style={{ color: tokens.palette.primary }}
                        data-pgl-path={`categories.${catIndex}.items.${itemIndex}.price`}
                        data-pgl-edit="text"
                      >
                        {item.price}
                      </span>
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
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
