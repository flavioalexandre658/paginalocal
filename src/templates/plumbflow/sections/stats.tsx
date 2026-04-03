"use client";

import { useEffect, useRef, useState } from "react";
import type { DesignTokens } from "@/types/ai-generation";
import { StatsContentSchema } from "@/types/ai-generation";
import { ScrollReveal } from "./scroll-reveal";

interface Props {
  content: Record<string, unknown>;
  tokens: DesignTokens;
  isDark?: boolean;
}

/**
 * Parse a stat value like "25+", "98%", "67+", "24/7" into
 * { number, suffix } so we can animate the number part.
 */
function parseStatValue(val: string): { number: number; suffix: string; prefix: string } {
  // Handle "24/7" style
  if (val.includes("/")) return { number: 0, suffix: val, prefix: "" };

  const match = val.match(/^([^\d]*)(\d+)(.*)$/);
  if (!match) return { number: 0, suffix: val, prefix: "" };
  return { prefix: match[1], number: parseInt(match[2], 10), suffix: match[3] };
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
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isVisible || hasAnimated.current || parsed.number === 0) return;
    hasAnimated.current = true;

    const target = parsed.number;
    const duration = 1800; // ms
    const steps = 40;
    const stepTime = duration / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += target / steps;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isVisible, parsed.number]);

  // For non-numeric values like "24/7", just show as-is
  if (parsed.number === 0) {
    return <span style={style} {...rest}>{value}</span>;
  }

  const displayValue = isVisible
    ? `${parsed.prefix}${count}${parsed.suffix}`
    : `${parsed.prefix}0${parsed.suffix}`;

  return <span style={style} {...rest}>{displayValue}</span>;
}

export function PlumbflowStats({ content, tokens }: Props) {
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
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const parsed = StatsContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const primary = tokens.palette.primary;

  return (
    <section
      id="stats"
      ref={sectionRef}
      style={{ backgroundColor: "var(--pgl-background)" }}
    >
      <div
        className="px-6 py-16 md:px-[30px] md:py-[80px]"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-0 w-full"
          style={{ maxWidth: 1296, justifyItems: "center" }}
        >
          {c.items.map((item, idx) => (
            <ScrollReveal key={idx} delay={idx * 150}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <AnimatedCounter
                  value={item.value}
                  isVisible={isVisible}
                  style={{
                    fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                    fontSize: "clamp(42px, 5vw, 64px)",
                    fontWeight: 700,
                    letterSpacing: "-2px",
                    lineHeight: "1.1em",
                    color: primary,
                    textAlign: "center",
                    fontFeatureSettings: "'zero' on, 'tnum' on",
                  }}
                  data-pgl-path={`items.${idx}.value`}
                  data-pgl-edit="text"
                />

                <span
                  style={{
                    fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                    fontSize: "clamp(14px, 1.5vw, 18px)",
                    fontWeight: 400,
                    letterSpacing: "0px",
                    lineHeight: "1.4em",
                    color: "var(--pgl-text-muted)",
                    textAlign: "center",
                  }}
                  data-pgl-path={`items.${idx}.label`}
                  data-pgl-edit="text"
                >
                  {item.label}
                </span>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
