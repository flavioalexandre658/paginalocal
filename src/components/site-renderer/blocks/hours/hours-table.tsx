"use client";

import { cn } from "@/lib/utils";
import { StyledHeadline } from "../../shared/styled-headline";
import type { DesignTokens } from "@/types/ai-generation";
import { HoursContentSchema } from "@/types/ai-generation";

const DAY_ORDER = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

interface Props {
  content: Record<string, unknown>;
  tokens: DesignTokens;
  isDark?: boolean;
}

export function HoursTable({ content, tokens }: Props) {
  const parsed = HoursContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const style = tokens.style;

  const today = new Date()
    .toLocaleDateString("pt-BR", { weekday: "long" })
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  const isClosed = (hours: string) =>
    hours.toLowerCase().includes("fechado") || hours.toLowerCase().includes("closed");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-12 md:mb-16 pgl-fade-up">
        <StyledHeadline
          text={c.title}
          tokens={tokens}
          className="text-3xl md:text-4xl lg:text-5xl"
          data-pgl-path="title"
          data-pgl-edit="text"
        />
      </div>

      <div className="max-w-md w-full pgl-fade-up" data-delay="1">
        <div
          className="overflow-hidden w-full"
          style={{
            borderRadius: "var(--card-radius, 0px)",
            transition: `all var(--transition-speed, 0.4s)`,
            border:
              style === "minimal" || style === "elegant"
                ? "none"
                : `1px solid ${tokens.palette.text}08`,
            ...(style === "elegant"
              ? {
                  boxShadow: `0 2px 16px ${tokens.palette.text}06`,
                  backgroundColor: tokens.palette.background,
                }
              : {}),
          }}
        >
          {DAY_ORDER.filter(d => c.schedule[d] !== undefined).map((day, i) => {
            const hours = c.schedule[day];
            const normalizedDay = day
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "");
            const isToday = normalizedDay === today || today.startsWith(normalizedDay);
            const closed = isClosed(hours);

            return (
              <div
                key={day}
                className={cn(
                  "flex justify-between items-center py-4 px-4 md:px-6 pgl-fade-up",
                  i > 0 && style !== "minimal" && "border-t",
                  i > 0 && style === "minimal" && "mt-1",
                  isToday && style !== "minimal" && "bg-[--highlight]",
                )}
                style={{
                  borderColor: `${tokens.palette.text}08`,
                  // @ts-ignore
                  "--highlight": `${tokens.palette.primary}08`,
                  ...(style === "elegant" && isToday
                    ? { borderLeft: `3px solid ${tokens.palette.accent}` }
                    : style === "elegant"
                      ? { borderLeft: `3px solid transparent` }
                      : {}),
                }}
                data-delay={i + 2}
              >
                <span
                  className="text-[0.85rem] capitalize"
                  style={{
                    fontFamily: "var(--pgl-font-heading)",
                    fontWeight: "var(--label-weight, 500)" as unknown as undefined,
                    letterSpacing: "var(--label-tracking, 0.02em)" as unknown as undefined,
                    color: isToday ? tokens.palette.primary : tokens.palette.text,
                  }}
                >
                  {day}
                  {isToday && (
                    <span
                      className="ml-2 font-normal"
                      style={{
                        color: tokens.palette.accent,
                        fontSize: "var(--label-size, 0.65rem)",
                        textTransform: "var(--label-transform, uppercase)" as unknown as undefined,
                        letterSpacing: "var(--label-tracking, 0.06em)" as unknown as undefined,
                      }}
                    >
                      hoje
                    </span>
                  )}
                </span>
                <span
                  className="text-[0.85rem] tabular-nums"
                  style={{
                    color: closed ? tokens.palette.textMuted : tokens.palette.text,
                    fontStyle: closed ? "italic" : "normal",
                    opacity: closed ? 0.5 : 1,
                  }}
                >
                  {hours}
                </span>
              </div>
            );
          })}
        </div>

        {c.note && (
          <p
            className="mt-5 text-xs leading-[1.7] font-light pgl-fade-up"
            style={{ color: tokens.palette.textMuted }}
            data-delay="5"
            data-pgl-path="note"
            data-pgl-edit="text"
          >
            {c.note}
          </p>
        )}
      </div>
    </div>
  );
}
