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

function renderAccentText(text: string, accentColor: string) {
  return text.split(/\*([^*]+)\*/).map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} style={{ color: accentColor }}>{part}</span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

/**
 * Parse a stat value like "1250", "500+", "98%" into
 * { number, suffix, prefix } so we can animate the number part.
 */
function parseStatValue(val: string): { number: number; suffix: string; prefix: string } {
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
    const duration = 1800;
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

  if (parsed.number === 0) {
    return <span style={style} {...rest}>{value}</span>;
  }

  const displayValue = isVisible
    ? `${parsed.prefix}${count}${parsed.suffix}`
    : `${parsed.prefix}0${parsed.suffix}`;

  return <span style={style} {...rest}>{displayValue}</span>;
}

export function RooforaStats({ content, tokens }: Props) {
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

  const accent = tokens.palette.accent || "#CDF660";
  const surface = tokens.palette.primary || "#0E1201";

  return (
    <section
      id="stats"
      ref={sectionRef}
      style={{ backgroundColor: surface, overflow: "hidden" }}
    >
      <div
        className="px-5 md:px-[30px] py-16 md:py-[100px]"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* ═══ Header ═══ */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
            marginBottom: 72,
            textAlign: "center",
            maxWidth: 620,
          }}
        >
          {c.title && (
            <>
              <ScrollReveal delay={0}>
                <p
                  style={{
                    fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                    fontSize: 14,
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    lineHeight: "1.7em",
                    color: accent,
                    margin: 0,
                    textTransform: "uppercase",
                  }}
                  data-pgl-path="subtitle"
                  data-pgl-edit="text"
                >
                  {c.title}
                </p>
              </ScrollReveal>
              <ScrollReveal delay={100}>
                <h2
                  style={{
                    fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                    fontSize: "clamp(28px, 4vw, 42px)",
                    fontWeight: 600,
                    letterSpacing: "-0.04em",
                    lineHeight: "1.15em",
                    color: "#fff",
                    margin: 0,
                  }}
                  data-pgl-path="title"
                  data-pgl-edit="text"
                >
                  {renderAccentText(c.title, accent)}
                </h2>
              </ScrollReveal>
            </>
          )}
        </div>

        {/* ═══ Stat Counters ═══ */}
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
                  gap: 8,
                }}
              >
                <AnimatedCounter
                  value={item.value}
                  isVisible={isVisible}
                  style={{
                    fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                    fontSize: "clamp(40px, 5vw, 60px)",
                    fontWeight: 600,
                    letterSpacing: "-0.04em",
                    lineHeight: "1.1em",
                    color: accent,
                    textAlign: "center",
                    fontFeatureSettings: "'zero' on, 'tnum' on",
                  }}
                  data-pgl-path={`items.${idx}.value`}
                  data-pgl-edit="text"
                />

                <span
                  style={{
                    fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                    fontSize: "clamp(14px, 1.5vw, 16px)",
                    fontWeight: 400,
                    letterSpacing: "0px",
                    lineHeight: "1.5em",
                    color: "rgba(255,255,255,0.6)",
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
