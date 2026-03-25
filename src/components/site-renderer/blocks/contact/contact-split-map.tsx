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

export function ContactSplitMap({ content, tokens }: Props) {
  const parsed = ContactContentSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  const style = tokens.style ?? "industrial";
  const isBold = style === "bold";
  const isMinimal = style === "minimal";

  const contactItems = [
    c.address && { icon: MapPin, label: "Endereço", value: c.address, field: "address" },
    c.phone && { icon: Phone, label: "Telefone", value: c.phone, field: "phone" },
    c.email && { icon: Mail, label: "E-mail", value: c.email, field: "email" },
  ].filter(Boolean) as { icon: any; label: string; value: string; field: string }[];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-start">
        {/* Left: map */}
        <div className="pgl-fade-up" data-delay="0">
          {c.address ? (
            <div
              className="relative overflow-hidden"
              style={{ borderRadius: "var(--card-radius)" }}
            >
              <iframe
                width="100%"
                height="450"
                className="block"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(c.address)}&output=embed`}
                title="Mapa de localização"
                style={{ borderRadius: "var(--card-radius)" }}
              />
            </div>
          ) : (
            <div
              className="w-full h-[450px] flex items-center justify-center"
              style={{
                backgroundColor: tokens.palette.surface,
                borderRadius: "var(--card-radius)",
              }}
            >
              <p
                className="text-sm font-light"
                style={{ color: tokens.palette.textMuted }}
              >
                Endereço não informado
              </p>
            </div>
          )}
        </div>

        {/* Right: info + optional form */}
        <div className="pgl-fade-up" data-delay="2">
          <StyledHeadline
            text={c.title}
            tokens={tokens}
            className={cn(
              "leading-[1.05] mb-4",
              isBold
                ? "text-4xl md:text-5xl lg:text-6xl"
                : "text-3xl md:text-4xl lg:text-5xl"
            )}
            data-pgl-path="title"
            data-pgl-edit="text"
          />
          {c.subtitle && (
            <p
              className="text-[0.925rem] leading-[1.7] font-light mb-10"
              style={{ color: tokens.palette.textMuted }}
              data-pgl-path="subtitle"
              data-pgl-edit="text"
            >
              {c.subtitle}
            </p>
          )}

          <div className="space-y-5 mb-8">
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
                    className="text-[0.875rem] font-normal"
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

          {c.whatsapp && (
            <PglButton
              href={`https://wa.me/${c.whatsapp.replace(/\D/g, "")}`}
              tokens={tokens}
              data-pgl-path="whatsapp"
              data-pgl-edit="text"
            >
              Falar no WhatsApp
            </PglButton>
          )}

          {/* Inline form in elevated card */}
          {c.showForm && (
            <div
              className="mt-10 p-6 md:p-8 lg:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.06)]"
              style={{
                borderRadius: "var(--card-radius)",
                backgroundColor: tokens.palette.surface,
                border: `1px solid ${tokens.palette.text}08`,
              }}
            >
              <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                {c.formFields.includes("name") && (
                  <div>
                    <label
                      className="block text-[0.75rem] font-medium uppercase tracking-[0.08em] mb-2"
                      style={{ color: tokens.palette.text }}
                    >
                      Nome
                    </label>
                    <input
                      type="text"
                      placeholder="Seu nome"
                      className={cn(
                        "w-full px-4 py-3 md:py-3.5 text-[0.875rem] outline-none focus:border-current",
                        isMinimal
                          ? "border-b bg-transparent border-t-0 border-x-0"
                          : "border"
                      )}
                      style={{
                        borderColor: `${tokens.palette.text}${isMinimal ? "20" : "0c"}`,
                        backgroundColor: isMinimal ? "transparent" : tokens.palette.background,
                        borderRadius: isMinimal ? "0" : "var(--card-radius, 8px)",
                        color: tokens.palette.text,
                        transition: `border-color var(--transition-speed)`,
                      }}
                    />
                  </div>
                )}
                {c.formFields.includes("message") && (
                  <div>
                    <label
                      className="block text-[0.75rem] font-medium uppercase tracking-[0.08em] mb-2"
                      style={{ color: tokens.palette.text }}
                    >
                      Mensagem
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Descreva o que precisa..."
                      className={cn(
                        "w-full px-4 py-3 md:py-3.5 text-[0.875rem] outline-none resize-none focus:border-current",
                        isMinimal
                          ? "border-b bg-transparent border-t-0 border-x-0"
                          : "border"
                      )}
                      style={{
                        borderColor: `${tokens.palette.text}${isMinimal ? "20" : "0c"}`,
                        backgroundColor: isMinimal ? "transparent" : tokens.palette.background,
                        borderRadius: isMinimal ? "0" : "var(--card-radius, 8px)",
                        color: tokens.palette.text,
                        transition: `border-color var(--transition-speed)`,
                      }}
                    />
                  </div>
                )}
                <PglButton tokens={tokens} className="w-full">
                  Enviar mensagem
                </PglButton>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
