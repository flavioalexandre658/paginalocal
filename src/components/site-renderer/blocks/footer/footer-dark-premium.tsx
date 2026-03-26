"use client";

import { cn } from "@/lib/utils";
import { SectionPattern } from "../../shared/section-pattern";
import type { DesignTokens } from "@/types/ai-generation";

interface Props {
  content: Record<string, unknown>;
  tokens: DesignTokens;
  isDark?: boolean;
}

export function FooterDarkPremium({ content, tokens }: Props) {
  const storeName = (content.storeName as string) || "Empresa";
  const tagline = content.tagline as string | undefined;
  const navLinks = (content.navLinks as { label: string; href: string }[]) || [];
  const address = content.address as string | undefined;
  const phone = content.phone as string | undefined;
  const email = content.email as string | undefined;
  const copyrightText = content.copyrightText as string | undefined;
  const showSocial = content.showSocial as boolean | undefined;

  return (
    <footer
      data-pgl-edit="footer"
      data-pgl-path="footer"
      className="relative overflow-hidden"
      style={{ backgroundColor: tokens.palette.primary }}
    >
      {/* Dot pattern overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <SectionPattern tokens={tokens} />
      </div>

      {/* Accent glow */}
      <div
        className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full blur-[120px] opacity-[0.06] pointer-events-none"
        style={{ backgroundColor: tokens.palette.accent }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
        {/* Large store name */}
        <div className="mb-14 md:mb-16">
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-white/90"
            style={{
              fontFamily: "var(--pgl-font-heading)",
              textTransform: "var(--heading-transform, none)" as never,
            }}
          >
            {storeName}
          </h2>
          {tagline && (
            <p className="mt-3 text-base md:text-lg text-white/30 font-light max-w-md">
              {tagline}
            </p>
          )}
        </div>

        {/* 3-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 mb-14">
          {/* Brand / about */}
          <div>
            <h4
              className="text-xs font-semibold uppercase text-white/45 mb-5"
              style={{
                fontFamily: "var(--pgl-font-heading)",
                letterSpacing: "var(--label-tracking, 0.12em)",
              }}
            >
              Sobre
            </h4>
            <p className="text-sm leading-relaxed text-white/25 font-light max-w-xs">
              {(content.description as string) ||
                tagline ||
                `${storeName} - qualidade e compromisso com nossos clientes.`}
            </p>
          </div>

          {/* Services / Navigation */}
          <div>
            <h4
              className="text-xs font-semibold uppercase text-white/45 mb-5"
              style={{
                fontFamily: "var(--pgl-font-heading)",
                letterSpacing: "var(--label-tracking, 0.12em)",
              }}
            >
              Navegação
            </h4>
            <nav className="space-y-3">
              {navLinks.map((link, i) => (
                <a
                  key={i}
                  href={link.href}
                  className={cn(
                    "block text-sm text-white/25 font-light",
                    "transition-colors duration-200 hover:text-white/60"
                  )}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4
              className="text-xs font-semibold uppercase text-white/45 mb-5"
              style={{
                fontFamily: "var(--pgl-font-heading)",
                letterSpacing: "var(--label-tracking, 0.12em)",
              }}
            >
              Contato
            </h4>
            <div className="space-y-3 text-sm text-white/25 font-light">
              {address && <p>{address}</p>}
              {phone && (
                <a
                  href={`tel:${phone.replace(/\D/g, "")}`}
                  className="block transition-colors duration-200 hover:text-white/60"
                >
                  {phone}
                </a>
              )}
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="block transition-colors duration-200 hover:text-white/60"
                >
                  {email}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Social links row */}
        {showSocial && (
          <div className="flex items-center gap-5 mb-10">
            {["Instagram", "Facebook", "WhatsApp"].map((name) => (
              <span
                key={name}
                className={cn(
                  "text-xs font-light text-white/20 uppercase tracking-wider",
                  "transition-colors duration-200 cursor-pointer hover:text-white/50"
                )}
              >
                {name}
              </span>
            ))}
          </div>
        )}

        {/* Bottom bar */}
        <div
          className="pt-8 flex flex-col sm:flex-row justify-between gap-3 text-xs text-white/15"
          style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
        >
          <span>
            {copyrightText ||
              `\u00a9 ${new Date().getFullYear()} ${storeName}. Todos os direitos reservados.`}
          </span>
          <span className="text-white/15">
            Desenvolvido por Página Local
          </span>
        </div>
      </div>
    </footer>
  );
}
