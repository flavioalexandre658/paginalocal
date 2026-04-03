"use client";

import type { DesignTokens } from "@/types/ai-generation";

interface Props {
  content: Record<string, unknown>;
  tokens: DesignTokens;
  isDark?: boolean;
}

export function CleanlyPartners({ content, tokens }: Props) {
  const rawItems =
    (content.items as { value: string; label: string; image?: string }[]) || [];
  if (rawItems.length === 0) return null;

  const c = {
    title: (content.title as string) || "",
    items: rawItems,
  };

  // Triple items for seamless infinite scroll
  const allItems = [...c.items, ...c.items, ...c.items];

  return (
    <section
      style={{
        backgroundColor: "var(--pgl-surface)",
        padding: "56px 24px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        {/* Title */}
        {c.title && (
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
              margin: "0 0 32px 0",
            }}
            data-pgl-path="title"
            data-pgl-edit="text"
          >
            {c.title}
          </p>
        )}

        {/* Marquee with fade edges */}
        <div
          style={{
            width: "100%",
            overflow: "hidden",
            borderRadius: 12,
            maskImage:
              "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
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
                    height: 44,
                    minWidth: 140,
                  }}
                  {...(isOriginal
                    ? {
                        "data-pgl-path": `items.${idx}.image`,
                        "data-pgl-edit": "image" as const,
                      }
                    : { "aria-hidden": true as const })}
                >
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.image}
                      alt={item.value || item.label || ""}
                      style={{
                        display: "block",
                        height: 32,
                        width: "auto",
                        maxWidth: 160,
                        objectFit: "contain",
                        filter: "grayscale(100%)",
                        opacity: 0.45,
                        transition: "filter 0.35s ease, opacity 0.35s ease",
                      }}
                    />
                  ) : (
                    <span
                      style={{
                        fontFamily:
                          "var(--pgl-font-heading), Inter, system-ui, sans-serif",
                        fontSize: 17,
                        fontWeight: 600,
                        letterSpacing: "-0.01em",
                        color: "var(--pgl-text)",
                        opacity: 0.4,
                        whiteSpace: "nowrap",
                        transition: "opacity 0.35s ease",
                      }}
                    >
                      {item.value}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Keyframes + track styles */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .cleanly-marquee-track {
          display: flex;
          align-items: center;
          gap: 56px;
          width: max-content;
          animation: cleanly-scroll 35s linear infinite;
        }
        .cleanly-partner-item:hover img {
          filter: grayscale(0%) !important;
          opacity: 1 !important;
        }
        .cleanly-partner-item:hover span {
          opacity: 1 !important;
        }
        @keyframes cleanly-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-100% / 3)); }
        }
      `,
        }}
      />
    </section>
  );
}
