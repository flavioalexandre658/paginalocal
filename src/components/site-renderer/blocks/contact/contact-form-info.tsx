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

export function ContactFormInfo({ content, tokens }: Props) {
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ].filter(Boolean) as { icon: any; label: string; value: string; field: string }[];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-start">
        {/* Left: info */}
        <div className="pgl-fade-up">
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
          {c.subtitle && (
            <p
              className="text-base md:text-lg leading-[1.6] font-light mb-10"
              style={{ color: tokens.palette.textMuted }}
              data-pgl-path="subtitle"
              data-pgl-edit="text"
            >
              {c.subtitle}
            </p>
          )}

          <div className="space-y-5">
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

          {c.whatsapp && (
            <div className="mt-9">
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
        </div>

        {/* Right: form */}
        {c.showForm && (
          <div
            className="pgl-fade-up p-6 md:p-10 lg:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.06)]"
            style={{
              borderRadius: "var(--card-radius)",
              backgroundColor: tokens.palette.surface,
              border: `1px solid ${tokens.palette.text}08`,
            }}
            data-delay="2"
          >
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {c.formFields.includes("name") && (
                  <div>
                    <label
                      className="block text-sm font-medium uppercase tracking-[0.08em] mb-2"
                      style={{ color: tokens.palette.text }}
                    >
                      Nome
                    </label>
                    <input
                      type="text"
                      placeholder="Seu nome"
                      className={cn(
                        "w-full px-4 py-3 md:py-3.5 text-base outline-none focus:border-current",
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
                {c.formFields.includes("phone") && (
                  <div>
                    <label
                      className="block text-sm font-medium uppercase tracking-[0.08em] mb-2"
                      style={{ color: tokens.palette.text }}
                    >
                      Telefone
                    </label>
                    <input
                      type="tel"
                      placeholder="(00) 00000-0000"
                      className={cn(
                        "w-full px-4 py-3 md:py-3.5 text-base outline-none focus:border-current",
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
              </div>
              {c.formFields.includes("email") && (
                <div>
                  <label
                    className="block text-sm font-medium uppercase tracking-[0.08em] mb-2"
                    style={{ color: tokens.palette.text }}
                  >
                    E-mail
                  </label>
                  <input
                    type="email"
                    placeholder="seu@email.com"
                    className={cn(
                      "w-full px-4 py-3 md:py-3.5 text-base outline-none focus:border-current",
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
                    className="block text-sm font-medium uppercase tracking-[0.08em] mb-2"
                    style={{ color: tokens.palette.text }}
                  >
                    Mensagem
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Descreva o que precisa..."
                    className={cn(
                      "w-full px-4 py-3 md:py-3.5 text-base outline-none resize-none focus:border-current",
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
  );
}
