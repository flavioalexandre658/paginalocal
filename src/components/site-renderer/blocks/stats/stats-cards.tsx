"use client";

import { cn } from "@/lib/utils";
import { StyledHeadline } from "../../shared/styled-headline";
import type { DesignTokens } from "@/types/ai-generation";
import { StatsContentSchema } from "@/types/ai-generation";

interface Props {
  content: Record<string, unknown>;
  tokens: DesignTokens;
  isDark?: boolean;
}

/** Filter out zero/placeholder stat values */
function isValidStat(value: string): boolean {
  const num = parseInt(value.replace(/[^0-9]/g, ""), 10);
  return value.trim() !== "" && (isNaN(num) || num > 0);
}

export function StatsCards({ content, tokens }: Props) {
  const parsed = StatsContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const validItems = c.items
    .map((item, idx) => ({ ...item, _idx: idx }))
    .filter((item) => isValidStat(item.value));
  if (validItems.length < 2) return null;

  const style = tokens.style;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {c.title && (
        <div className="text-center mb-16 pgl-fade-up">
          <StyledHeadline
            text={c.title}
            tokens={tokens}
            className="text-3xl md:text-4xl lg:text-5xl"
            data-pgl-path="title"
            data-pgl-edit="text"
          />
        </div>
      )}

      <div
        className={cn(
          "grid gap-4 md:gap-6 pgl-fade-up",
          "grid-cols-1 sm:grid-cols-2",
          validItems.length === 3 && "md:grid-cols-3",
          validItems.length >= 4 && "md:grid-cols-4",
        )}
        data-delay="1"
      >
        {validItems.map((item, i) => {
          /* -- style-dependent card styles -- */
          const cardStyle: React.CSSProperties = {
            borderRadius: "var(--card-radius, 0px)",
            transition: `all var(--transition-speed, 0.4s)`,
            ...(style === "elegant"
              ? {
                  boxShadow: `0 2px 16px ${tokens.palette.text}06`,
                  backgroundColor: tokens.palette.background,
                  border: "none",
                }
              : style === "warm"
                ? {
                    backgroundColor: `${tokens.palette.primary}05`,
                    boxShadow: "none",
                    border: "none",
                  }
                : style === "bold"
                  ? {
                      boxShadow: "0 10px 40px rgba(0,0,0,0.04)",
                      border: `2px solid ${tokens.palette.accent}20`,
                    }
                  : style === "minimal"
                    ? {
                        borderRadius: "0px",
                        boxShadow: "none",
                        border: "none",
                        borderBottom: `1px solid ${tokens.palette.text}10`,
                      }
                    : {
                        /* industrial */
                        boxShadow: "0 10px 40px rgba(0,0,0,0.04)",
                        border: `1px solid ${tokens.palette.text}08`,
                      }),
          };

          return (
            <div
              key={i}
              className={cn(
                "pgl-scale-in p-6 md:p-8 text-center",
                style === "minimal" ? "bg-transparent" : "",
              )}
              style={{
                ...cardStyle,
                ...(style !== "minimal" && style !== "warm" && style !== "elegant"
                  ? { backgroundColor: tokens.palette.background }
                  : {}),
              }}
              data-delay={i + 1}
            >
              {/* Decorative dot -- industrial only */}
              {style === "industrial" && (
                <div
                  className="w-2 h-2 rounded-full mx-auto mb-5"
                  style={{ backgroundColor: tokens.palette.accent }}
                />
              )}

              {/* Elegant -- subtle line */}
              {style === "elegant" && (
                <div
                  className="w-8 h-px mx-auto mb-5"
                  style={{ backgroundColor: tokens.palette.accent }}
                />
              )}

              <div
                className={cn(
                  "text-3xl md:text-4xl font-semibold tracking-tight tabular-nums",
                  style === "bold" && "font-bold",
                )}
                style={{
                  fontFamily: "var(--pgl-font-heading)",
                  color:
                    style === "bold"
                      ? tokens.palette.accent
                      : style === "minimal"
                        ? tokens.palette.text
                        : tokens.palette.primary,
                }}
                data-pgl-path={`items.${item._idx}.value`}
                data-pgl-edit="text"
              >
                {item.value}
              </div>
              <div
                className="mt-2 font-normal"
                style={{
                  color: tokens.palette.textMuted,
                  fontSize: "var(--label-size, 0.7rem)",
                  textTransform: "var(--label-transform, uppercase)" as unknown as undefined,
                  letterSpacing: "var(--label-tracking, 0.08em)" as unknown as undefined,
                  ...(style === "minimal"
                    ? {
                        textTransform: "none" as const,
                        letterSpacing: "normal",
                        fontSize: "0.75rem",
                      }
                    : {}),
                }}
                data-pgl-path={`items.${item._idx}.label`}
                data-pgl-edit="text"
              >
                {item.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
