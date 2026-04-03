"use client";

import { useEffect, useRef, useState } from "react";
import type { DesignTokens } from "@/types/ai-generation";
import { ScrollReveal } from "./scroll-reveal";

interface Props {
  content: Record<string, unknown>;
  tokens: DesignTokens;
  isDark?: boolean;
}

/* ── Manual parse — StatsContentSchema max 4 is too restrictive ── */
interface StatItem {
  value: string;
  label: string;
  icon?: string;
  image?: string;
}

function parseStats(content: Record<string, unknown>) {
  const title = (content.title as string) || "";
  const rawItems = content.items;
  if (!Array.isArray(rawItems) || rawItems.length === 0) return null;

  const items: StatItem[] = rawItems
    .filter(
      (it: unknown): it is Record<string, unknown> =>
        typeof it === "object" && it !== null && "value" in it && "label" in it
    )
    .map((it) => ({
      value: String(it.value ?? ""),
      label: String(it.label ?? ""),
      icon: it.icon ? String(it.icon) : undefined,
      image: it.image ? String(it.image) : undefined,
    }));

  if (items.length === 0) return null;
  return { title, items };
}

/* ── Counter animation helpers ── */
function parseStatValue(val: string): {
  number: number;
  suffix: string;
  prefix: string;
} {
  if (val.includes("/")) return { number: 0, suffix: val, prefix: "" };
  const match = val.match(/^([^\d]*)(\d[\d,.]*)(.*)$/);
  if (!match) return { number: 0, suffix: val, prefix: "" };
  const num = parseFloat(match[2].replace(",", ""));
  const isDecimal = match[2].includes(".");
  return {
    prefix: match[1],
    number: isNaN(num) ? 0 : num,
    suffix: match[3],
  };
}

function AnimatedCounter({
  value,
  isVisible,
  style,
  ...rest
}: {
  value: string;
  isVisible: boolean;
  style: React.CSSProperties;
} & React.HTMLAttributes<HTMLSpanElement>) {
  const parsed = parseStatValue(value);
  const isDecimal = value.includes(".");
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isVisible || hasAnimated.current || parsed.number === 0) return;
    hasAnimated.current = true;

    const target = parsed.number;
    const duration = 1800;
    const steps = 45;
    const stepTime = duration / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += target / steps;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(isDecimal ? Math.round(current * 10) / 10 : Math.floor(current));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isVisible, parsed.number, isDecimal]);

  if (parsed.number === 0) {
    return (
      <span style={style} {...rest}>
        {value}
      </span>
    );
  }

  const displayNum = isVisible
    ? isDecimal
      ? count.toFixed(1)
      : String(count)
    : isDecimal
      ? "0.0"
      : "0";

  return (
    <span style={style} {...rest}>
      {parsed.prefix}
      {displayNum}
      {parsed.suffix}
    </span>
  );
}

/* ── Section ── */
export function CleanlyStats({ content, tokens }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const c = parseStats(content);
  if (!c) return null;

  const accent = tokens.palette.accent;

  return (
    <section
      id="stats"
      ref={sectionRef}
      style={{
        backgroundColor: "var(--pgl-surface)",
        overflow: "hidden",
      }}
    >
      <div
        className="px-5 md:px-[30px] py-14 md:py-[80px]"
        style={{ maxWidth: 1280, margin: "0 auto" }}
      >
        {/* ═══ Optional title ═══ */}
        {c.title && (
          <ScrollReveal delay={0}>
            <p
              style={{
                fontFamily: "var(--pgl-font-body), Inter, system-ui, sans-serif",
                fontSize: 14,
                fontWeight: 500,
                lineHeight: 1.5,
                color: "var(--pgl-muted)",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                textAlign: "center",
                margin: "0 0 48px 0",
              }}
              data-pgl-path="title"
              data-pgl-edit="text"
            >
              {c.title}
            </p>
          </ScrollReveal>
        )}

        {/* ═══ Stats grid ═══ */}
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-6 md:gap-0 w-full"
          style={{ justifyItems: "center" }}
        >
          {c.items.map((item, idx) => {
            const isLast = idx === c.items.length - 1;
            return (
              <ScrollReveal key={idx} delay={idx * 120}>
                <div
                  className="flex flex-col items-center md:items-center"
                  style={{
                    position: "relative",
                    paddingRight:
                      !isLast && idx < c.items.length - 1 ? undefined : undefined,
                  }}
                >
                  {/* Large number */}
                  <AnimatedCounter
                    value={item.value}
                    isVisible={isVisible}
                    style={{
                      fontFamily:
                        "var(--pgl-font-heading), Inter, system-ui, sans-serif",
                      fontSize: "clamp(36px, 5vw, 56px)",
                      fontWeight: 700,
                      letterSpacing: "-0.03em",
                      lineHeight: 1.1,
                      color: accent,
                      textAlign: "center",
                      fontFeatureSettings: "'zero' on, 'tnum' on",
                    }}
                    data-pgl-path={`items.${idx}.value`}
                    data-pgl-edit="text"
                  />

                  {/* Label */}
                  <span
                    style={{
                      fontFamily:
                        "var(--pgl-font-body), Inter, system-ui, sans-serif",
                      fontSize: "clamp(13px, 1.3vw, 16px)",
                      fontWeight: 400,
                      lineHeight: 1.5,
                      color: "var(--pgl-muted)",
                      textAlign: "center",
                      marginTop: 6,
                    }}
                    data-pgl-path={`items.${idx}.label`}
                    data-pgl-edit="text"
                  >
                    {item.label}
                  </span>
                </div>

                {/* Vertical divider — hidden on last item & mobile */}
                {!isLast && (
                  <div
                    className="hidden md:block"
                    style={{
                      position: "absolute",
                      right: 0,
                      top: "15%",
                      bottom: "15%",
                      width: 1,
                      backgroundColor: "var(--pgl-border)",
                    }}
                    aria-hidden
                  />
                )}
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
