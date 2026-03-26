"use client";

import { cn } from "@/lib/utils";
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

export function StatsCounters({ content, tokens }: Props) {
  const parsed = StatsContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const validItems = c.items
    .map((item, idx) => ({ ...item, _idx: idx }))
    .filter((item) => isValidStat(item.value));
  if (validItems.length < 2) return null;

  const style = tokens.style;

  /* -- elegant: inline text, no trust bar -- */
  if (style === "elegant") {
    return (
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 pgl-scale-in" data-delay="3">
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
          {validItems.map((item, i) => (
            <span key={i} className="text-center whitespace-nowrap">
              <span
                className="text-xl md:text-2xl font-semibold tracking-tight tabular-nums"
                style={{
                  fontFamily: "var(--pgl-font-heading)",
                  color: tokens.palette.primary,
                }}
                data-pgl-path={`items.${item._idx}.value`}
                data-pgl-edit="text"
              >
                {item.value}
              </span>
              <span
                className="ml-2 font-normal"
                style={{
                  color: tokens.palette.textMuted,
                  fontSize: "var(--label-size, 0.75rem)",
                  textTransform: "var(--label-transform, uppercase)" as unknown as undefined,
                  letterSpacing: "var(--label-tracking, 0.08em)" as unknown as undefined,
                }}
                data-pgl-path={`items.${item._idx}.label`}
                data-pgl-edit="text"
              >
                {item.label}
              </span>
            </span>
          ))}
        </div>
      </div>
    );
  }

  /* -- minimal: subtle inline -- */
  if (style === "minimal") {
    return (
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 pgl-scale-in" data-delay="3">
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-3">
          {validItems.map((item, i) => (
            <span key={i} className="text-center whitespace-nowrap">
              <span
                className="text-lg md:text-xl font-medium tabular-nums"
                style={{
                  fontFamily: "var(--pgl-font-heading)",
                  color: tokens.palette.text,
                }}
                data-pgl-path={`items.${item._idx}.value`}
                data-pgl-edit="text"
              >
                {item.value}
              </span>
              <span
                className="ml-1.5 font-normal"
                style={{
                  color: tokens.palette.textMuted,
                  fontSize: "var(--label-size, 0.7rem)",
                  letterSpacing: "var(--label-tracking, 0.06em)" as unknown as undefined,
                }}
                data-pgl-path={`items.${item._idx}.label`}
                data-pgl-edit="text"
              >
                {item.label}
              </span>
            </span>
          ))}
        </div>
      </div>
    );
  }

  /* -- warm: rounded cards -- */
  if (style === "warm") {
    return (
      <div className="relative z-10 -mt-10 mb-0">
        <div
          className="pgl-scale-in max-w-[900px] mx-auto"
          data-delay="3"
        >
          <div
            className={cn(
              "grid gap-4 md:gap-6",
              "grid-cols-1 sm:grid-cols-2",
              validItems.length === 3 && "sm:grid-cols-3",
              validItems.length >= 4 && "sm:grid-cols-2 md:grid-cols-4",
            )}
          >
            {validItems.map((item, i) => (
              <div
                key={i}
                className="py-6 px-6 text-center"
                style={{
                  backgroundColor: `${tokens.palette.primary}08`,
                  borderRadius: "var(--card-radius, 12px)",
                  transition: `all var(--transition-speed, 0.35s)`,
                }}
              >
                <div
                  className="text-2xl font-semibold tracking-tight tabular-nums"
                  style={{
                    fontFamily: "var(--pgl-font-heading)",
                    color: tokens.palette.primary,
                  }}
                  data-pgl-path={`items.${item._idx}.value`}
                  data-pgl-edit="text"
                >
                  {item.value}
                </div>
                <div
                  className="mt-1 font-normal"
                  style={{
                    color: tokens.palette.textMuted,
                    fontSize: "var(--label-size, 0.7rem)",
                    textTransform: "var(--label-transform, uppercase)" as unknown as undefined,
                    letterSpacing: "var(--label-tracking, 0.08em)" as unknown as undefined,
                  }}
                  data-pgl-path={`items.${item._idx}.label`}
                  data-pgl-edit="text"
                >
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* -- bold: accent-colored numbers -- */
  if (style === "bold") {
    return (
      <div className="relative z-10 -mt-10 mb-0">
        <div
          className="pgl-scale-in max-w-[900px] mx-auto"
          style={{
            borderRadius: "var(--card-radius, 4px)",
            backgroundColor: tokens.palette.background,
            boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
          }}
          data-delay="3"
        >
          <div
            className={cn(
              "grid",
              "grid-cols-1 sm:grid-cols-3",
              validItems.length === 2 && "sm:grid-cols-2",
              validItems.length >= 4 && "sm:grid-cols-2 md:grid-cols-4",
            )}
            style={{
              // @ts-expect-error -- CSS custom property
              "--divide-color": `${tokens.palette.text}08`,
            }}
          >
            {validItems.map((item, i) => (
              <div
                key={i}
                className="py-7 px-8 text-center"
                style={{
                  borderRight:
                    i < validItems.length - 1
                      ? `1px solid ${tokens.palette.text}08`
                      : "none",
                }}
              >
                <div
                  className="text-2xl md:text-3xl font-bold tracking-tight tabular-nums"
                  style={{
                    fontFamily: "var(--pgl-font-heading)",
                    color: tokens.palette.accent,
                  }}
                  data-pgl-path={`items.${item._idx}.value`}
                  data-pgl-edit="text"
                >
                  {item.value}
                </div>
                <div
                  className="mt-1 font-semibold"
                  style={{
                    color: tokens.palette.text,
                    fontSize: "var(--label-size, 0.7rem)",
                    textTransform: "var(--label-transform, uppercase)" as unknown as undefined,
                    letterSpacing: "var(--label-tracking, 0.08em)" as unknown as undefined,
                  }}
                  data-pgl-path={`items.${item._idx}.label`}
                  data-pgl-edit="text"
                >
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* -- industrial (default): trust bar float, decorative dots, uppercase labels -- */
  return (
    <div className="relative z-10 -mt-10 mb-0">
      <div
        className="pgl-scale-in max-w-[900px] mx-auto"
        style={{
          borderRadius: "var(--card-radius, 0px)",
          backgroundColor: tokens.palette.background,
          boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
        }}
        data-delay="3"
      >
        <div
          className={cn(
            "grid",
            "grid-cols-1 sm:grid-cols-3",
            validItems.length === 2 && "sm:grid-cols-2",
            validItems.length >= 4 && "sm:grid-cols-2 md:grid-cols-4",
          )}
        >
          {validItems.map((item, i) => (
            <div
              key={i}
              className="py-7 px-8 text-center"
              style={{
                borderRight:
                  i < validItems.length - 1
                    ? `1px solid ${tokens.palette.text}08`
                    : "none",
              }}
            >
              <div
                className="text-2xl font-semibold tracking-tight tabular-nums"
                style={{
                  fontFamily: "var(--pgl-font-heading)",
                  color: tokens.palette.primary,
                }}
                data-pgl-path={`items.${item._idx}.value`}
                data-pgl-edit="text"
              >
                {item.value}
              </div>
              <div
                className="mt-1 font-normal"
                style={{
                  color: tokens.palette.textMuted,
                  fontSize: "var(--label-size, 0.7rem)",
                  textTransform: "var(--label-transform, uppercase)" as unknown as undefined,
                  letterSpacing: "var(--label-tracking, 0.08em)" as unknown as undefined,
                }}
                data-pgl-path={`items.${item._idx}.label`}
                data-pgl-edit="text"
              >
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
