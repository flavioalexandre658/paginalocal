"use client";

import type { DesignTokens } from "@/types/ai-generation";

interface Props {
  content: Record<string, unknown>;
  tokens: DesignTokens;
  isDark?: boolean;
}

export function StratexPartners({ content, tokens }: Props) {
  const rawItems = (content.items as { value: string; label: string; image?: string }[]) || [];
  if (rawItems.length === 0) return null;

  const c = {
    title: (content.title as string) || "",
    items: rawItems,
  };

  // Triple the items for seamless loop
  const allItems = [...c.items, ...c.items, ...c.items];

  return (
    <section
      style={{
        backgroundColor: "var(--pgl-background)",
        padding: "48px 25px",
        overflow: "hidden",
        maxWidth: 1200,
        margin: "0 auto",
      }}
    >
      {/* Title */}
      {c.title && (
        <p
          style={{
            fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
            fontSize: 16,
            fontWeight: 500,
            lineHeight: "1.5em",
            color: "var(--pgl-text)",
            margin: "0 0 28px 0",
            textAlign: "center",
          }}
          data-pgl-path="title"
          data-pgl-edit="text"
        >
          {c.title}
        </p>
      )}

      {/* Marquee container with fade edges */}
      <div
        style={{
          width: "100%",
          overflow: "hidden",
          maskImage: "linear-gradient(to right, transparent 0%, black 12.5%, black 87.5%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 12.5%, black 87.5%, transparent 100%)",
        }}
      >
        <div className="stratex-marquee-track">
          {allItems.map((item, idx) => (
            <div
              key={idx}
              style={{
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: 40,
                minWidth: 120,
                opacity: 0.6,
              }}
              {...(idx < c.items.length
                ? { "data-pgl-path": `items.${idx}.image`, "data-pgl-edit": "image" as const }
                : { "aria-hidden": true as const })}
            >
              {item.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.image}
                  alt={item.value}
                  style={{
                    display: "block",
                    height: 30,
                    width: "auto",
                    maxWidth: 160,
                    objectFit: "contain",
                    filter: "grayscale(100%)",
                  }}
                />
              ) : (
                <span
                  style={{
                    fontFamily: "var(--pgl-font-heading), Georgia, serif",
                    fontSize: 18,
                    fontWeight: 600,
                    letterSpacing: "-0.02em",
                    color: "var(--pgl-text)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.value}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Keyframes + track styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        .stratex-marquee-track {
          display: flex;
          align-items: center;
          gap: 52px;
          width: max-content;
          animation: stratex-scroll 30s linear infinite;
        }
        @keyframes stratex-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-100% / 3)); }
        }
      `}} />
    </section>
  );
}
