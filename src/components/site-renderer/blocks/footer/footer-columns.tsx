"use client";

import { cn } from "@/lib/utils";
import type { DesignTokens } from "@/types/ai-generation";

interface Props {
  content: Record<string, unknown>;
  tokens: DesignTokens;
  isDark?: boolean;
}

export function FooterColumns({ content, tokens }: Props) {
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
        {/* Columns grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-14">
          {/* Col 1: Brand */}
          <div className="lg:col-span-1">
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
              <p className="text-sm leading-relaxed text-white/30 font-light max-w-xs">
                {tagline}
              </p>
            )}
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4
              className="text-xs font-semibold uppercase text-white/45 mb-4"
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
                    "block text-sm text-white/30 font-light",
                    "transition-colors duration-200 hover:text-white/70"
                  )}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Col 3: Contact */}
          <div>
            <h4
              className="text-xs font-semibold uppercase text-white/45 mb-4"
              style={{
                fontFamily: "var(--pgl-font-heading)",
                letterSpacing: "var(--label-tracking, 0.12em)",
              }}
            >
              Contato
            </h4>
            <div className="space-y-2.5 text-sm text-white/30 font-light">
              {address && <p>{address}</p>}
              {phone && <p>{phone}</p>}
              {email && <p>{email}</p>}
            </div>
          </div>

          {/* Col 4: Hours / extra */}
          <div>
            <h4
              className="text-xs font-semibold uppercase text-white/45 mb-4"
              style={{
                fontFamily: "var(--pgl-font-heading)",
                letterSpacing: "var(--label-tracking, 0.12em)",
              }}
            >
              Horário
            </h4>
            <div className="space-y-2.5 text-sm text-white/30 font-light">
              {content.hours ? (
                <p>{content.hours as string}</p>
              ) : (
                <>
                  <p>Seg - Sex, 08:00 - 18:00</p>
                  <p>Sáb, 08:00 - 12:00</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-8 flex flex-col sm:flex-row justify-between gap-3 text-xs text-white/20"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
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
