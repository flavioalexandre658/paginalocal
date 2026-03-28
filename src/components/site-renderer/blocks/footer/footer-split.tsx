"use client";

import { cn } from "@/lib/utils";
import type { DesignTokens } from "@/types/ai-generation";

interface Props {
  content: Record<string, unknown>;
  tokens: DesignTokens;
  isDark?: boolean;
}

export function FooterSplit({ content, tokens }: Props) {
  const storeName = (content.storeName as string) || "Empresa";
  const tagline = content.tagline as string | undefined;
  const navLinks = (content.navLinks as { label: string; href: string }[]) || [];
  const address = content.address as string | undefined;
  const phone = content.phone as string | undefined;
  const email = content.email as string | undefined;
  const copyrightText = content.copyrightText as string | undefined;

  return (
    <footer
      data-pgl-edit="footer"
      data-pgl-path="footer"
      className="relative overflow-hidden"
      style={{ backgroundColor: tokens.palette.primary }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        {/* Top: split layout */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 mb-14">
          {/* Left side: brand + description */}
          <div className="lg:max-w-sm flex-shrink-0">
            <div
              className="text-base font-semibold text-white/90 uppercase mb-3"
              style={{
                fontFamily: "var(--pgl-font-heading)",
                letterSpacing: "var(--label-tracking, 0.1em)",
                textTransform: "var(--heading-transform, uppercase)" as never,
              }}
            >
              {storeName}
            </div>
            {tagline && (
              <p className="text-sm leading-relaxed text-white/25 font-light max-w-xs">
                {tagline}
              </p>
            )}

            {/* Accent line */}
            <div
              className="mt-6 w-10 h-0.5 rounded-full"
              style={{ backgroundColor: `${tokens.palette.accent}50` }}
            />
          </div>

          {/* Right side: 2 sub-columns */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-10">
            {/* Sub-col 1: Navigation */}
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
              <nav className="space-y-2.5">
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

            {/* Sub-col 2: Contact */}
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
              <div className="space-y-2.5 text-sm text-white/25 font-light">
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
        </div>

        {/* Bottom: full-width copyright bar */}
        <div
          className="pt-8 flex flex-col sm:flex-row justify-between gap-3 text-xs text-white/15"
          style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
        >
          <span>
            {copyrightText ||
              `\u00a9 ${new Date().getFullYear()} ${storeName}. Todos os direitos reservados.`}
          </span>
          <span>Desenvolvido por Decolou</span>
        </div>
      </div>
    </footer>
  );
}
