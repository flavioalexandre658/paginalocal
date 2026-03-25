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

export function TeamFeatured({ content, tokens }: Props) {
  const parsed = TeamContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const [featured, ...rest] = c.members;

  const style = tokens.style ?? "industrial";
  const isIndustrial = style === "industrial";
  const isElegant = style === "elegant";
  const isWarm = style === "warm";
  const isBold = style === "bold";
  const isMinimal = style === "minimal";

  const imageRadius = isElegant || isWarm
    ? "9999px"
    : isIndustrial
      ? "0"
      : "var(--card-radius)";

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

        {/* Featured member */}
        <div
          className={cn(
            "pgl-fade-up flex flex-col md:flex-row gap-6 md:gap-8 mb-8 md:mb-12 p-6 md:p-8 transition-all duration-[400ms]",
            isMinimal
              ? "bg-transparent !p-0 border-b"
              : cn(
                  "bg-white border",
                  isElegant
                    ? "border-black/[0.08] shadow-sm"
                    : "border-black/[0.06]",
                ),
          )}
          data-delay="2"
          style={{
            borderRadius: isMinimal ? "0" : "var(--card-radius)",
            ...(isMinimal
              ? { borderColor: `${tokens.palette.text}0a` }
              : {}),
          }}
        >
          {/* Featured image / avatar */}
          <div className="relative shrink-0">
            {featured.image ? (
              <div className="relative">
                <div
                  className={cn(
                    "w-28 h-28 md:w-32 md:h-32 overflow-hidden",
                    isBold && "w-32 h-32 md:w-40 md:h-40",
                  )}
                  style={{
                    borderRadius: imageRadius,
                    ...(isElegant ? { boxShadow: `0 8px 30px ${tokens.palette.accent}15` } : {}),
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={featured.image}
                    alt={featured.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Decorative accent offset - only for industrial/default */}
                {(isIndustrial || (!isElegant && !isWarm && !isBold && !isMinimal)) && (
                  <div
                    className="absolute top-3 left-3 -right-3 -bottom-3 -z-10"
                    style={{
                      border: `1px solid ${tokens.palette.accent}`,
                      opacity: 0.15,
                      borderRadius: imageRadius,
                    }}
                  />
                )}
              </div>
            ) : (
              <div
                className={cn(
                  "w-28 h-28 md:w-32 md:h-32 flex items-center justify-center",
                  isBold && "w-32 h-32 md:w-40 md:h-40",
                )}
                style={{
                  backgroundColor: `${tokens.palette.primary}10`,
                  borderRadius: imageRadius,
                }}
              >
                <span
                  className={cn(
                    "font-semibold",
                    isBold ? "text-5xl" : "text-4xl",
                  )}
                  style={{ color: tokens.palette.primary, fontFamily: "var(--pgl-font-heading)" }}
                >
                  {featured.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Featured info */}
          <div className="flex-1 min-w-0">
            <h3
              className={cn(
                "text-[1.3rem] font-semibold tracking-[0.03em]",
                (isIndustrial || isBold) && "uppercase",
                isBold && "text-[1.5rem] !font-extrabold",
              )}
              style={{
                fontFamily: "var(--pgl-font-heading)",
                color: tokens.palette.text,
              }}
            >
              {featured.name}
            </h3>
            <p
              className={cn(
                "text-[0.7rem] font-medium tracking-[0.12em] mt-1",
                isIndustrial && "uppercase",
                isBold && "text-[0.75rem] !font-semibold inline-block px-2 py-0.5 mt-2",
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
              {featured.role}
            </p>
            {featured.bio && (
              <p
                className="text-[0.925rem] font-light leading-[1.85] mt-4 max-w-prose"
                style={{ color: tokens.palette.textMuted }}
              >
                {featured.bio}
              </p>
            )}
          </div>
        </div>

        {/* Rest of team */}
        {rest.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {rest.map((member, index) => (
              <div
                key={index}
                className={cn(
                  "pgl-fade-up transition-all duration-[400ms]",
                  isMinimal
                    ? "py-3 border-b last:border-b-0 flex items-center gap-3"
                    : cn(
                        "p-4 md:p-5 text-center",
                        "bg-white border hover:border-black/[0.12]",
                        isElegant
                          ? "border-black/[0.08] shadow-sm hover:shadow-md"
                          : "border-black/[0.06]",
                      ),
                  isIndustrial && "!rounded-none",
                )}
                data-delay={String(Math.min(index + 3, 7))}
                style={{
                  borderRadius: isMinimal ? "0" : "var(--card-radius)",
                  ...(isMinimal
                    ? { borderColor: `${tokens.palette.text}0a` }
                    : {}),
                }}
              >
                {isMinimal ? (
                  /* Minimal: inline compact layout */
                  <>
                    {member.image ? (
                      <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${tokens.palette.primary}10` }}
                      >
                        <span
                          className="text-sm font-semibold"
                          style={{ color: tokens.palette.primary, fontFamily: "var(--pgl-font-heading)" }}
                        >
                          {member.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3
                        className="text-[0.8rem] font-semibold tracking-[0.02em]"
                        style={{
                          fontFamily: "var(--pgl-font-heading)",
                          color: tokens.palette.text,
                        }}
                      >
                        {member.name}
                      </h3>
                      <p
                        className="text-[0.65rem] font-medium tracking-[0.08em] mt-0.5"
                        style={{ color: tokens.palette.accent }}
                      >
                        {member.role}
                      </p>
                    </div>
                  </>
                ) : (
                  /* Standard centered card */
                  <>
                    {member.image ? (
                      <div
                        className={cn(
                          "w-16 h-16 overflow-hidden mx-auto mb-3",
                          (isElegant || isWarm) && "rounded-full",
                          isIndustrial && "rounded-none",
                          isBold && "w-20 h-20 rounded-lg",
                          !(isElegant || isWarm || isIndustrial || isBold) && "rounded-full",
                        )}
                        style={{
                          border: isElegant
                            ? "none"
                            : `2px solid ${tokens.palette.accent}20`,
                          ...(isElegant ? { boxShadow: `0 4px 16px ${tokens.palette.accent}15` } : {}),
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
                          "w-16 h-16 flex items-center justify-center mx-auto mb-3",
                          (isElegant || isWarm) && "rounded-full",
                          isIndustrial && "rounded-none",
                          isBold && "w-20 h-20 rounded-lg",
                          !(isElegant || isWarm || isIndustrial || isBold) && "rounded-full",
                        )}
                        style={{
                          backgroundColor: `${tokens.palette.primary}10`,
                          border: `2px solid ${tokens.palette.accent}20`,
                        }}
                      >
                        <span
                          className={cn("font-semibold", isBold ? "text-2xl" : "text-xl")}
                          style={{ color: tokens.palette.primary, fontFamily: "var(--pgl-font-heading)" }}
                        >
                          {member.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}

                    <h3
                      className={cn(
                        "text-[0.85rem] font-semibold tracking-[0.03em]",
                        (isIndustrial || isBold) && "uppercase",
                        isBold && "text-[0.9rem] !font-bold",
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
                        "text-[0.65rem] font-medium tracking-[0.1em] mt-0.5",
                        isIndustrial && "uppercase",
                        isBold && "!font-semibold px-2 py-0.5 inline-block mt-1",
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
                        className="text-[0.8rem] font-light line-clamp-3 mt-2"
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
        )}
      </div>
    </div>
  );
}
