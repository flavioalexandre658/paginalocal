"use client";

import { useState } from "react";
import type { DesignTokens } from "@/types/ai-generation";
import { ServicesContentSchema } from "@/types/ai-generation";
import { ScrollReveal } from "./scroll-reveal";
import { IconRenderer } from "@/components/ui/icon-renderer";

interface Props {
  content: Record<string, unknown>;
  tokens: DesignTokens;
  isDark?: boolean;
}

function renderAccentText(text: string, accentColor: string) {
  return text.split(/\*([^*]+)\*/).map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} style={{ color: accentColor }}>
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

/* ── Benefit icons ── */
function BenefitIcon({ index, color }: { index: number; color: string }) {
  const icons = [
    /* Sparkle / clean */
    <svg key="0" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3z" />
    </svg>,
    /* Shield check */
    <svg key="1" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>,
    /* Clock */
    <svg key="2" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>,
    /* Users */
    <svg key="3" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>,
    /* Leaf / eco */
    <svg key="4" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75" />
    </svg>,
    /* Star */
    <svg key="5" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>,
    /* Droplet */
    <svg key="6" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
    </svg>,
    /* Check circle */
    <svg key="7" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>,
  ];
  return icons[index % icons.length];
}

/* ── Chevron icon ── */
function ChevronIcon({ open, color }: { open: boolean; color: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        transition: "transform 0.3s ease",
        transform: open ? "rotate(180deg)" : "rotate(0deg)",
        flexShrink: 0,
      }}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

/* ── Accordion Item ── */
function AccordionItem({
  item,
  idx,
  isOpen,
  onToggle,
  accent,
}: {
  item: { name: string; description: string; image?: string; icon?: string };
  idx: number;
  isOpen: boolean;
  onToggle: () => void;
  accent: string;
}) {
  return (
    <div
      style={{
        borderBottom: "1px solid var(--pgl-border)",
        overflow: "hidden",
      }}
    >
      {/* Header — clickable */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          width: "100%",
          padding: "20px 0",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          outline: "none",
        }}
      >
        {/* Icon wrapper */}
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            backgroundColor: isOpen ? accent : "var(--pgl-surface)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transition: "background-color 0.3s ease",
          }}
        >
          <div data-pgl-path={`items.${idx}.icon`} data-pgl-edit="icon">
            {item.icon ? (
              <IconRenderer
                icon={item.icon}
                size={24}
                color={isOpen ? "#fff" : accent}
                strokeWidth={2}
                ariaLabel={item.name}
              />
            ) : (
              <BenefitIcon
                index={idx}
                color={isOpen ? "#fff" : accent}
              />
            )}
          </div>
        </div>

        {/* Title */}
        <span
          style={{
            fontFamily: "var(--pgl-font-body), Inter, system-ui, sans-serif",
            fontSize: "clamp(16px, 1.4vw, 19px)",
            fontWeight: 600,
            lineHeight: 1.3,
            color: "var(--pgl-text)",
            flex: 1,
          }}
          data-pgl-path={`items.${idx}.name`}
          data-pgl-edit="text"
        >
          {item.name}
        </span>

        {/* Chevron */}
        <ChevronIcon open={isOpen} color="var(--pgl-muted)" />
      </button>

      {/* Expandable body */}
      <div
        style={{
          maxHeight: isOpen ? 300 : 0,
          opacity: isOpen ? 1 : 0,
          overflow: "hidden",
          transition: "max-height 0.35s ease, opacity 0.3s ease",
        }}
      >
        <p
          style={{
            fontFamily: "var(--pgl-font-body), Inter, system-ui, sans-serif",
            fontSize: 15,
            fontWeight: 400,
            lineHeight: 1.7,
            color: "var(--pgl-muted)",
            margin: 0,
            paddingLeft: 64,
            paddingBottom: 20,
          }}
          data-pgl-path={`items.${idx}.description`}
          data-pgl-edit="text"
        >
          {item.description}
        </p>
      </div>
    </div>
  );
}

/* ── Section ── */
export function CleanlyBenefits({ content, tokens }: Props) {
  const [openIndex, setOpenIndex] = useState(0);

  const parsed = ServicesContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const accent = tokens.palette.accent;

  return (
    <section
      id="benefits"
      style={{
        backgroundColor: "var(--pgl-background)",
        overflow: "hidden",
      }}
    >
      <div
        className="px-5 md:px-[30px] py-16 md:py-[100px]"
        style={{ maxWidth: 1280, margin: "0 auto" }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">
          {/* ═══ Left: title + subtitle ═══ */}
          <div style={{ position: "sticky", top: 100 }}>
            <ScrollReveal delay={0}>
              <h2
                style={{
                  fontFamily:
                    "var(--pgl-font-heading), Inter, system-ui, sans-serif",
                  fontSize: "clamp(28px, 4vw, 44px)",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.15,
                  color: "var(--pgl-text)",
                  margin: 0,
                  marginBottom: 16,
                }}
                data-pgl-path="title"
                data-pgl-edit="text"
              >
                {renderAccentText(c.title, accent)}
              </h2>
            </ScrollReveal>

            {c.subtitle && (
              <ScrollReveal delay={80}>
                <p
                  style={{
                    fontFamily:
                      "var(--pgl-font-body), Inter, system-ui, sans-serif",
                    fontSize: "clamp(15px, 1.3vw, 17px)",
                    fontWeight: 400,
                    lineHeight: 1.7,
                    color: "var(--pgl-muted)",
                    margin: 0,
                    maxWidth: 440,
                  }}
                  data-pgl-path="subtitle"
                  data-pgl-edit="text"
                >
                  {c.subtitle}
                </p>
              </ScrollReveal>
            )}

            {/* Decorative accent bar */}
            <ScrollReveal delay={150}>
              <div
                style={{
                  width: 48,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: accent,
                  marginTop: 28,
                }}
                aria-hidden
              />
            </ScrollReveal>
          </div>

          {/* ═══ Right: accordion list ═══ */}
          <div>
            {c.items.map((item, idx) => (
              <ScrollReveal key={idx} delay={100 + idx * 60}>
                <AccordionItem
                  item={item}
                  idx={idx}
                  isOpen={openIndex === idx}
                  onToggle={() =>
                    setOpenIndex(openIndex === idx ? -1 : idx)
                  }
                  accent={accent}
                />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
