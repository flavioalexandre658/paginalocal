"use client";

import type { DesignTokens } from "@/types/ai-generation";

interface Props {
  content: Record<string, unknown>;
  tokens: DesignTokens;
  isDark?: boolean;
}

export function CleanlyPartners({ content }: Props) {
  const rawItems =
    (content.items as { value: string; label: string; image?: string }[]) || [];
  if (rawItems.length === 0) return null;

  const c = {
    title: (content.title as string) || "",
    items: rawItems,
  };

  const allItems = [...c.items, ...c.items, ...c.items];

  return (
    <section
      style={{
        backgroundColor: "var(--pgl-surface)",
        padding: "56px 24px",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {c.title && (
          <p
            style={{
              fontFamily: "var(--pgl-font-body), Inter, system-ui, sans-serif",
              fontSize: 14,
              fontWeight: 500,
              lineHeight: 1.5,
              color: "var(--pgl-text-muted)",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              textAlign: "center",
              margin: "0 0 32px 0",
            }}
            data-pgl-path="title"
            data-pgl-edit="text"
          >
            {c.title}
          </p>
        )}

        <div
          style={{
            width: "100%",
            overflow: "hidden",
            borderRadius: 12,
            maskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
          }}
        >
          <div className="cleanly-marquee-track">
            {allItems.map((item, idx) => {
              const isOriginal = idx < c.items.length;
              return (
                <div
                  key={idx}
                  className="cleanly-partner-item"
                  style={{
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    height: 44,
                    minWidth: 80,
                    opacity: 0.55,
                    transition: "opacity 0.3s ease",
                  }}
                  {...(!isOriginal ? { "aria-hidden": true as const } : {})}
                >
                  {/* Optional icon — small, beside text */}
                  {item.image && (
                    <div
                      style={{ width: 28, height: 28, borderRadius: 6, overflow: "hidden", flexShrink: 0 }}
                      {...(isOriginal ? { "data-pgl-path": `items.${idx}.image`, "data-pgl-edit": "image" as const } : {})}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.image}
                        alt={item.value}
                        style={{ width: "100%", height: "100%", objectFit: "contain", filter: "grayscale(100%)" }}
                      />
                    </div>
                  )}

                  {/* Text — always shown */}
                  <span
                    style={{
                      fontFamily: "var(--pgl-font-heading), Inter, system-ui, sans-serif",
                      fontSize: 17,
                      fontWeight: 600,
                      letterSpacing: "-0.01em",
                      color: "var(--pgl-text)",
                      whiteSpace: "nowrap",
                    }}
                    {...(isOriginal ? { "data-pgl-path": `items.${idx}.value`, "data-pgl-edit": "text" as const } : {})}
                  >
                    {item.value}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .cleanly-marquee-track {
          display: flex;
          align-items: center;
          gap: 56px;
          width: max-content;
          animation: cleanly-scroll 35s linear infinite;
        }
        .cleanly-partner-item:hover { opacity: 1 !important; }
        @keyframes cleanly-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-100% / 3)); }
        }
      `}} />
    </section>
  );
}
