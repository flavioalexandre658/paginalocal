"use client";

import { cn } from "@/lib/utils";
import { MapPin } from "lucide-react";
import { StyledHeadline } from "../../shared/styled-headline";
import type { DesignTokens } from "@/types/ai-generation";
import { LocationContentSchema } from "@/types/ai-generation";

interface Props {
  content: Record<string, unknown>;
  tokens: DesignTokens;
  isDark?: boolean;
}

export function LocationMapFull({ content, tokens }: Props) {
  const parsed = LocationContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const style = tokens.style ?? "industrial";
  const isBold = style === "bold";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="pgl-fade-up mb-12 md:mb-16">
        <StyledHeadline
          text={c.title}
          tokens={tokens}
          className={cn(
            "leading-[1.1] mb-4",
            isBold
              ? "text-4xl md:text-5xl lg:text-6xl"
              : "text-3xl md:text-4xl lg:text-5xl"
          )}
          data-pgl-path="title"
          data-pgl-edit="text"
        />
      </div>

      <div className="pgl-fade-up relative" data-delay="1">
        <div
          className="overflow-hidden"
          style={{ borderRadius: "var(--card-radius)" }}
        >
          <iframe
            className="w-full h-80 md:h-96 block"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://maps.google.com/maps?q=${encodeURIComponent(c.address)}&output=embed`}
            title="Mapa de localização"
          />
        </div>

        {/* Info overlay - absolute on desktop, static on mobile */}
        <div
          className="max-w-xs p-5 shadow-[0_20px_60px_rgba(0,0,0,0.06)] relative mt-4 lg:absolute lg:bottom-6 lg:left-6 lg:mt-0"
          style={{
            backgroundColor: tokens.palette.background,
            borderRadius: "var(--card-radius)",
            border: `1px solid ${tokens.palette.text}08`,
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-9 h-9 md:w-11 md:h-11 rounded-full flex items-center justify-center flex-shrink-0",
                isBold && "ring-2 ring-current"
              )}
              style={{ backgroundColor: `${tokens.palette.accent}0a` }}
            >
              <MapPin
                className="w-4 h-4"
                style={{ color: tokens.palette.accent }}
              />
            </div>
            <div>
              <div
                className="text-[0.7rem] uppercase tracking-[0.08em] mb-0.5"
                style={{ color: tokens.palette.textMuted }}
              >
                Endereço
              </div>
              <div
                className="text-sm font-normal"
                style={{ color: tokens.palette.text }}
                data-pgl-path="address"
                data-pgl-edit="text"
              >
                {c.address}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pgl-fade-up mt-6 flex justify-end" data-delay="2">
        <a
          href={`https://maps.google.com/maps?q=${encodeURIComponent(c.address)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium tracking-[0.04em] hover:opacity-70"
          style={{
            color: tokens.palette.accent,
            transition: `opacity var(--transition-speed)`,
          }}
        >
          Ver no Google Maps
        </a>
      </div>
    </div>
  );
}
