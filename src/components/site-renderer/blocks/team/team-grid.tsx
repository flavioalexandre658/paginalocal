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

export function TeamGrid({ content, tokens }: Props) {
  const parsed = TeamContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const style = tokens.style ?? "industrial";
  const isIndustrial = style === "industrial";
  const isElegant = style === "elegant";
  const isBold = style === "bold";
  const isMinimal = style === "minimal";

  const imageSize = isBold
    ? "w-24 h-24 md:w-28 md:h-28"
    : isMinimal
      ? "w-14 h-14"
      : "w-20 h-20";

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

        {/* Team grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {c.members.map((member, index) => (
            <div
              key={index}
              className={cn(
                "pgl-fade-up transition-all duration-[400ms]",
                isMinimal
                  ? "py-4 border-b last:border-b-0"
                  : cn(
                      "p-6 md:p-8 text-center",
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
              {/* Minimal: horizontal layout */}
              {isMinimal ? (
                <div className="flex items-center gap-4">
                  {member.image ? (
                    <div
                      className={cn(imageSize, "rounded-full overflow-hidden shrink-0")}
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
                      className={cn(imageSize, "rounded-full flex items-center justify-center shrink-0")}
                      style={{ backgroundColor: `${tokens.palette.primary}10` }}
                    >
                      <span
                        className="text-lg font-semibold"
                        style={{ color: tokens.palette.primary, fontFamily: "var(--pgl-font-heading)" }}
                      >
                        {member.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3
                      className="text-[0.875rem] font-semibold tracking-[0.02em]"
                      style={{
                        fontFamily: "var(--pgl-font-heading)",
                        color: tokens.palette.text,
                      }}
                    >
                      {member.name}
                    </h3>
                    <p
                      className="text-[0.7rem] font-medium tracking-[0.08em] mt-0.5"
                      style={{ color: tokens.palette.accent }}
                    >
                      {member.role}
                    </p>
                  </div>
                </div>
              ) : (
                /* Standard centered layout */
                <>
                  {member.image ? (
                    <div
                      className={cn(
                        imageSize, "rounded-full overflow-hidden mx-auto mb-4",
                        isIndustrial && "!rounded-none",
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
                        imageSize, "rounded-full flex items-center justify-center mx-auto mb-4",
                        isIndustrial && "!rounded-none",
                      )}
                      style={{
                        backgroundColor: `${tokens.palette.primary}10`,
                        border: `2px solid ${tokens.palette.accent}20`,
                      }}
                    >
                      <span
                        className={cn(
                          "font-semibold",
                          isBold ? "text-3xl" : "text-2xl",
                        )}
                        style={{ color: tokens.palette.primary, fontFamily: "var(--pgl-font-heading)" }}
                      >
                        {member.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}

                  <h3
                    className={cn(
                      "text-[0.9rem] font-semibold tracking-[0.03em]",
                      (isIndustrial || isBold) && "uppercase",
                      isBold && "text-[1rem] !font-bold",
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
                      "text-[0.7rem] font-medium tracking-[0.1em] mt-1",
                      isIndustrial && "uppercase",
                      isBold && "text-[0.75rem] !font-semibold px-2 py-0.5 inline-block mt-2",
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
                      className="text-[0.8rem] font-light line-clamp-3 mt-3"
                      style={{ color: tokens.palette.textMuted }}
                    >
                      {member.bio}
                    </p>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
