"use client";

import { cn } from "@/lib/utils";
import { MapPin, Phone, Mail } from "lucide-react";
import { StyledHeadline } from "../../shared/styled-headline";
import { PglButton } from "../../shared/pgl-button";
import type { DesignTokens } from "@/types/ai-generation";
import { ContactContentSchema } from "@/types/ai-generation";

interface Props {
  content: Record<string, unknown>;
  tokens: DesignTokens;
  isDark?: boolean;
}

export function ContactMinimalCard({ content, tokens }: Props) {
  const parsed = ContactContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const style = tokens.style ?? "industrial";
  const isBold = style === "bold";

  const contactItems = [
    c.address && { icon: MapPin, label: "Endereço", value: c.address, field: "address" },
    c.phone && { icon: Phone, label: "Telefone", value: c.phone, field: "phone" },
    c.email && { icon: Mail, label: "E-mail", value: c.email, field: "email" },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ].filter(Boolean) as { icon: any; label: string; value: string; field: string }[];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div
        className="pgl-fade-up max-w-2xl mx-auto p-6 md:p-10 lg:p-14 shadow-[0_20px_60px_rgba(0,0,0,0.06)]"
        style={{
          borderRadius: "var(--card-radius)",
          backgroundColor: tokens.palette.surface,
          border: `1px solid ${tokens.palette.text}08`,
        }}
      >
        <div className="text-center mb-10">
          <StyledHeadline
            text={c.title}
            tokens={tokens}
            className={cn(
              "leading-[1.1] mb-4",
              isBold
                ? "text-4xl md:text-5xl"
                : "text-3xl md:text-4xl"
            )}
            data-pgl-path="title"
            data-pgl-edit="text"
          />
          {c.subtitle && (
            <p
              className="text-base leading-[1.6] font-light max-w-md mx-auto"
              style={{ color: tokens.palette.textMuted }}
              data-pgl-path="subtitle"
              data-pgl-edit="text"
            >
              {c.subtitle}
            </p>
          )}
        </div>

        {/* Contact items */}
        <div className="space-y-5 mb-10 pgl-fade-up" data-delay="1">
          {contactItems.map((item, i) => (
            <div key={i} className="flex items-center gap-4">
              <div
                className={cn(
                  "w-9 h-9 md:w-11 md:h-11 rounded-full flex items-center justify-center flex-shrink-0",
                  isBold && "ring-2 ring-current"
                )}
                style={{
                  backgroundColor: `${tokens.palette.accent}0a`,
                }}
              >
                <item.icon
                  className="w-4 h-4 md:w-[18px] md:h-[18px]"
                  style={{ color: tokens.palette.accent }}
                />
              </div>
              <div>
                <div
                  className="text-[0.7rem] uppercase tracking-[0.08em] mb-0.5"
                  style={{ color: tokens.palette.textMuted }}
                >
                  {item.label}
                </div>
                <div
                  className="text-sm font-normal"
                  style={{ color: tokens.palette.text }}
                  data-pgl-path={item.field}
                  data-pgl-edit="text"
                >
                  {item.value}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* WhatsApp CTA */}
        {c.whatsapp && (
          <div className="text-center mb-8 pgl-fade-up" data-delay="2">
            <PglButton
              href={`https://wa.me/${c.whatsapp.replace(/\D/g, "")}`}
              tokens={tokens}
              data-pgl-path="whatsapp"
              data-pgl-edit="text"
            >
              Falar no WhatsApp
            </PglButton>
          </div>
        )}

        {/* Divider + secondary contacts */}
        {(c.phone || c.email) && (
          <div
            className="pt-6 space-y-3 text-center pgl-fade-up"
            data-delay="3"
            style={{ borderTop: `1px solid ${tokens.palette.text}08` }}
          >
            {c.phone && (
              <a
                href={`tel:${c.phone.replace(/\D/g, "")}`}
                className="block text-sm font-medium tracking-[0.04em] hover:opacity-70"
                style={{
                  color: tokens.palette.text,
                  transition: `opacity var(--transition-speed)`,
                }}
                data-pgl-path="phone"
                data-pgl-edit="text"
              >
                {c.phone}
              </a>
            )}
            {c.email && (
              <a
                href={`mailto:${c.email}`}
                className="block text-sm font-light hover:opacity-70"
                style={{
                  color: tokens.palette.textMuted,
                  transition: `opacity var(--transition-speed)`,
                }}
                data-pgl-path="email"
                data-pgl-edit="text"
              >
                {c.email}
              </a>
            )}
          </div>
        )}

        {/* Map below card */}
        {c.showMap && c.address && (
          <div
            className="mt-8 overflow-hidden"
            style={{ borderRadius: "var(--card-radius)" }}
          >
            <iframe
              width="100%"
              height="250"
              className="block"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(c.address)}&output=embed`}
              title="Mapa de localização"
            />
          </div>
        )}
      </div>
    </div>
  );
}
