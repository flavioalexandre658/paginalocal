"use client";

import { cn } from "@/lib/utils";
import type { DesignTokens } from "@/types/ai-generation";
import { TeamContentSchema } from "@/types/ai-generation";
import { StyledHeadline } from "../../shared/styled-headline";

interface Props {
  content: Record<string, unknown>;
  tokens: DesignTokens;
  isDark?: boolean;
}

export function TeamList({ content, tokens }: Props) {
  const parsed = TeamContentSchema.safeParse(content);
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
          />
          {c.subtitle && (
            <p
              className="pgl-fade-up text-[0.95rem] leading-[1.8] font-light"
              style={{ color: tokens.palette.textMuted }}
              data-delay="1"
            >
              {c.subtitle}
            </p>
          )}
        </div>

        {/* Team list */}
        <div className="space-y-3 md:space-y-4">
          {c.members.map((member, index) => (
            <div
              key={index}
              className={cn(
                "pgl-fade-up flex items-start gap-4 md:gap-6 p-4 md:p-6 transition-all duration-[400ms]",
                isMinimal
                  ? "bg-transparent border-b last:border-b-0 !rounded-none !p-0 !pb-4"
                  : cn(
                      "bg-white border hover:border-black/[0.12]",
                      isElegant
                        ? "border-black/[0.08] shadow-sm hover:shadow-md"
                        : "border-black/[0.06]",
                    ),
                isIndustrial && "!rounded-none",
              )}
              data-delay={String(Math.min(index + 1, 7))}
              style={{
                borderRadius: isMinimal ? "0" : "var(--card-radius)",
                ...(isMinimal
                  ? { borderColor: `${tokens.palette.text}0a` }
                  : {}),
              }}
            >
              {member.image ? (
                <div
                  className={cn(
                    "w-16 h-16 md:w-20 md:h-20 overflow-hidden shrink-0",
                    (isElegant || isWarm) && "rounded-full",
                    isIndustrial && "rounded-none",
                    isBold && "rounded-lg",
                    isMinimal && "rounded-full !w-12 !h-12 md:!w-14 md:!h-14",
                    !(isElegant || isWarm || isIndustrial || isBold || isMinimal) && "rounded-full",
                  )}
                  style={{
                    border: isElegant
                      ? "none"
                      : `2px solid ${tokens.palette.accent}20`,
                    ...(isElegant ? { boxShadow: `0 4px 20px ${tokens.palette.accent}15` } : {}),
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div
                  className={cn(
                    "w-16 h-16 md:w-20 md:h-20 flex items-center justify-center shrink-0",
                    (isElegant || isWarm) && "rounded-full",
                    isIndustrial && "rounded-none",
                    isBold && "rounded-lg",
                    isMinimal && "rounded-full !w-12 !h-12 md:!w-14 md:!h-14",
                    !(isElegant || isWarm || isIndustrial || isBold || isMinimal) && "rounded-full",
                  )}
                  style={{
                    backgroundColor: `${tokens.palette.primary}10`,
                    border: `2px solid ${tokens.palette.accent}20`,
                  }}
                >
                  <span
                    className={cn(
                      "font-semibold",
                      isBold ? "text-2xl" : "text-xl",
                      isMinimal && "!text-base",
                    )}
                    style={{ color: tokens.palette.primary, fontFamily: "var(--pgl-font-heading)" }}
                  >
                    {member.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}

              <div className="flex-1 min-w-0">
                <h3
                  className={cn(
                    "text-[0.95rem] font-semibold tracking-[0.03em]",
                    (isIndustrial || isBold) && "uppercase",
                    isBold && "text-[1.05rem] !font-bold",
                    isMinimal && "text-[0.875rem]",
                  )}
                  style={{
                    fontFamily: "var(--pgl-font-heading)",
                    color: tokens.palette.text,
                  }}
                >
                  {member.name}
                </h3>
                <p
                  className={cn(
                    "text-[0.7rem] font-medium tracking-[0.1em] mt-0.5",
                    isIndustrial && "uppercase",
                    isBold && "text-[0.75rem] !font-semibold inline-block px-2 py-0.5 mt-1",
                  )}
                  style={{
                    color: isBold ? "#fff" : tokens.palette.accent,
                    ...(isBold
                      ? {
                          backgroundColor: tokens.palette.accent,
                          borderRadius: "var(--btn-radius)",
                        }
                      : {}),
                  }}
                >
                  {member.role}
                </p>
                {member.bio && (
                  <p
                    className="text-[0.875rem] font-light leading-relaxed mt-2 max-w-prose"
                    style={{ color: tokens.palette.textMuted }}
                  >
                    {member.bio}
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
