"use client";

import { cn } from "@/lib/utils";
import { MapPin } from "lucide-react";
import { StyledHeadline } from "../../shared/styled-headline";
import { PglButton } from "../../shared/pgl-button";
import type { DesignTokens } from "@/types/ai-generation";
import { LocationContentSchema } from "@/types/ai-generation";

interface Props {
  content: Record<string, unknown>;
  tokens: DesignTokens;
  isDark?: boolean;
}

export function LocationMapDirections({ content, tokens }: Props) {
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-start">
        {/* Map */}
        <div className="pgl-fade-up" data-delay="1">
          <div
            className="overflow-hidden"
            style={{ borderRadius: "var(--card-radius)" }}
          >
            <iframe
              className="w-full h-64 md:h-80 block"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(c.address)}&output=embed`}
              title="Mapa de localização"
            />
          </div>
        </div>

        {/* Directions info */}
        <div className="pgl-fade-up" data-delay="2">
          <h3
            className="text-sm font-semibold uppercase tracking-[0.1em] mb-6"
            style={{
              color: tokens.palette.accent,
              fontFamily: "var(--pgl-font-heading)",
            }}
          >
            Como chegar
          </h3>

          <div className="flex items-center gap-4 mb-6">
            <div
              className={cn(
                "w-9 h-9 md:w-11 md:h-11 rounded-full flex items-center justify-center flex-shrink-0",
                isBold && "ring-2 ring-current"
              )}
              style={{ backgroundColor: `${tokens.palette.accent}0a` }}
            >
              <MapPin
                className="w-4 h-4 md:w-[18px] md:h-[18px]"
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

          {c.instructions && (
            <p
              className="text-base leading-[1.6] font-light mb-8"
              style={{ color: tokens.palette.textMuted }}
              data-pgl-path="instructions"
              data-pgl-edit="text"
            >
              {c.instructions}
            </p>
          )}

          <PglButton
            href={`https://maps.google.com/maps?q=${encodeURIComponent(c.address)}`}
            tokens={tokens}
          >
            Abrir no Google Maps
          </PglButton>
        </div>
      </div>
    </div>
  );
}
