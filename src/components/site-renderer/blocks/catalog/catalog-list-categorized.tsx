"use client";

import { useState } from "react";
import { z } from "zod";
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

interface InnerProps {
  c: z.infer<typeof CatalogContentSchema>;
  tokens: DesignTokens;
  isDark?: boolean;
}

function CatalogListCategorizedInner({ c, tokens, isDark }: InnerProps) {
  const [activeTab, setActiveTab] = useState(c.categories[0]?.name ?? "");

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

        {/* Category tabs */}
        {c.categories.length > 1 && (
          <div className="pgl-fade-up flex flex-wrap gap-2 mb-10" data-delay="2">
            {c.categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setActiveTab(cat.name)}
                className={cn(
                  "text-sm font-medium tracking-[0.08em] uppercase px-5 py-2.5",
                  isBold && activeTab === cat.name && "!font-extrabold",
                )}
                style={{
                  backgroundColor: activeTab === cat.name ? tokens.palette.primary : "transparent",
                  color: activeTab === cat.name
                    ? "#fff"
                    : isDark ? "rgba(255,255,255,0.5)" : tokens.palette.textMuted,
                  border: activeTab === cat.name
                    ? `1px solid ${tokens.palette.primary}`
                    : isDark
                      ? "1px solid rgba(255,255,255,0.1)"
                      : `1px solid ${tokens.palette.text}15`,
                  borderRadius: "var(--btn-radius, 2px)",
                  transition: `all var(--transition-speed, 0.4s)`,
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {/* Active category content */}
        {c.categories.map((cat, catIndex) =>
          (c.categories.length !== 1 && cat.name !== activeTab) ? null : (
            <div key={catIndex}>
              {/* Featured row */}
              <div
                className="pgl-fade-up flex flex-col sm:flex-row overflow-hidden"
                data-delay="3"
                style={{
                  borderRadius: "var(--card-radius)",
                  border: cardBorder,
                  backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "#fff",
                  boxShadow: isDark ? "none" : `0 2px 16px ${tokens.palette.text}06`,
                  transition: `all var(--transition-speed, 0.4s)`,
                }}
              >
                {cat.image && (
                  <div className="relative h-40 sm:h-auto sm:w-48 shrink-0 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover"
                      data-pgl-path={`categories.${catIndex}.image`}
                      data-pgl-edit="image"
                    />
                  </div>
                )}
                <div className="p-4 md:p-6">
                  <h3
                    className={cn(
                      "text-[1.1rem] font-semibold uppercase tracking-[0.03em]",
                      isBold && "!font-extrabold",
                    )}
                    style={{
                      fontFamily: "var(--pgl-font-heading)",
                      color: isDark ? "#fff" : tokens.palette.text,
                    }}
                    data-pgl-path={`categories.${catIndex}.name`}
                    data-pgl-edit="text"
                  >
                    {cat.name}
                  </h3>
                  {cat.description && (
                    <p
                      className="text-sm md:text-base font-light leading-relaxed mt-2"
                      style={{ color: isDark ? "rgba(255,255,255,0.5)" : tokens.palette.textMuted }}
                      data-pgl-path={`categories.${catIndex}.description`}
                      data-pgl-edit="text"
                    >
                      {cat.description}
                    </p>
                  )}
                  {cat.productCount !== undefined && (
                    <p
                      className={cn(
                        "text-sm font-medium mt-3 tabular-nums",
                        isBold && "text-[0.9rem] !font-extrabold",
                      )}
                      style={{ color: tokens.palette.accent }}
                    >
                      {cat.productCount} produtos
                    </p>
                  )}
                  <div className="mt-4">
                    <PglButton
                      variant="secondary"
                      tokens={tokens}
                      isDark={isDark}
                      data-pgl-path="ctaText"
                      data-pgl-edit="button"
                    >
                      {c.ctaText}
                    </PglButton>
                  </div>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export function CatalogListCategorized({ content, tokens, isDark }: Props) {
  const parsed = CatalogContentSchema.safeParse(content);
  if (!parsed.success) return null;
  return <CatalogListCategorizedInner c={parsed.data} tokens={tokens} isDark={isDark} />;
}
