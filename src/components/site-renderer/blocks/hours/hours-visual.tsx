"use client";

import { cn } from "@/lib/utils";
import { StyledHeadline } from "../../shared/styled-headline";
import type { DesignTokens } from "@/types/ai-generation";
import { HoursContentSchema } from "@/types/ai-generation";

interface Props {
  content: Record<string, unknown>;
  tokens: DesignTokens;
  isDark?: boolean;
}

const DAY_ORDER = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

const DAY_ABBR: Record<string, string> = {
  segunda: "Seg",
  terca: "Ter",
  quarta: "Qua",
  quinta: "Qui",
  sexta: "Sex",
  sabado: "Sab",
  domingo: "Dom",
  monday: "Mon",
  tuesday: "Tue",
  wednesday: "Wed",
  thursday: "Thu",
  friday: "Fri",
  saturday: "Sat",
  sunday: "Sun",
};

function getDayAbbr(day: string): string {
  const normalized = day
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .slice(0, 6);
  return DAY_ABBR[normalized] ?? day.slice(0, 3);
}

function isClosed(hours: string): boolean {
  return (
    hours.toLowerCase().includes("fechado") ||
    hours.toLowerCase().includes("closed")
  );
}

/** Parse hours string to get a visual width percentage (rough estimate) */
function getBarWidth(hours: string): number {
  if (isClosed(hours)) return 0;
  // Try to extract hour ranges like "08:00 - 18:00"
  const match = hours.match(/(\d{1,2})[:\.]?(\d{2})?\s*[-\u2013a\u00e0]\s*(\d{1,2})[:\.]?(\d{2})?/);
  if (match) {
    const start = parseInt(match[1]);
    const end = parseInt(match[3]);
    const span = end > start ? end - start : 12;
    return Math.min(Math.max((span / 16) * 100, 20), 100);
  }
  return 60; // default
}

export function HoursVisual({ content, tokens }: Props) {
  const parsed = HoursContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const style = tokens.style;

  const today = new Date()
    .toLocaleDateString("pt-BR", { weekday: "long" })
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  const entries = DAY_ORDER
    .filter((d) => c.schedule[d] !== undefined)
    .map((d) => [d, c.schedule[d]] as [string, string]);

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

      <div className="max-w-md w-full space-y-3 pgl-fade-up" data-delay="1">
        {entries.map(([day, hours], i) => {
          const closed = isClosed(hours);
          const normalizedDay = day
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
          const isToday = normalizedDay === today || today.startsWith(normalizedDay);
          const barWidth = getBarWidth(hours);

          return (
            <div
              key={day}
              className={cn(
                "flex items-center gap-3 md:gap-4 pgl-fade-up",
                style === "elegant" && "py-1",
              )}
              style={{
                ...(style === "elegant" && isToday
                  ? { borderLeft: `3px solid ${tokens.palette.accent}`, paddingLeft: "8px" }
                  : style === "elegant"
                    ? { borderLeft: "3px solid transparent", paddingLeft: "8px" }
                    : {}),
              }}
              data-delay={i + 2}
            >
              <span
                className="w-10 shrink-0"
                style={{
                  fontFamily: "var(--pgl-font-heading)",
                  color: isToday ? tokens.palette.primary : tokens.palette.textMuted,
                  fontSize: "var(--label-size, 0.7rem)",
                  textTransform: "var(--label-transform, uppercase)" as unknown as undefined,
                  letterSpacing: "var(--label-tracking, 0.06em)" as unknown as undefined,
                  fontWeight: "var(--label-weight, 600)" as unknown as undefined,
                }}
              >
                {getDayAbbr(day)}
              </span>

              {closed ? (
                <span
                  className="text-[0.8rem] font-light"
                  style={{
                    color: tokens.palette.textMuted,
                    fontStyle: "italic",
                    opacity: 0.5,
                  }}
                >
                  Fechado
                </span>
              ) : (
                <div className="flex-1 flex items-center gap-3 min-w-0">
                  <div
                    className="h-2 shrink-0"
                    style={{
                      width: `${barWidth}%`,
                      backgroundColor: isToday
                        ? tokens.palette.accent
                        : tokens.palette.primary,
                      opacity: isToday ? 1 : style === "warm" ? 0.35 : 0.2,
                      borderRadius: "var(--card-radius, 0px)",
                      transition: `all var(--transition-speed, 0.4s)`,
                    }}
                  />
                  <span
                    className="text-[0.8rem] tabular-nums shrink-0"
                    style={{ color: tokens.palette.text }}
                  >
                    {hours}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {c.note && (
        <p
          className="mt-6 text-xs leading-[1.7] font-light max-w-md pgl-fade-up"
          style={{ color: tokens.palette.textMuted }}
          data-delay="5"
          data-pgl-path="note"
          data-pgl-edit="text"
        >
          {c.note}
        </p>
      )}
    </div>
  );
}
