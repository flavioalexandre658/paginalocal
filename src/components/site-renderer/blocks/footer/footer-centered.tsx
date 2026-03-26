"use client";

import { cn } from "@/lib/utils";
import type { DesignTokens } from "@/types/ai-generation";

interface Props {
  content: Record<string, unknown>;
  tokens: DesignTokens;
  isDark?: boolean;
}

export function FooterCentered({ content, tokens }: Props) {
  const storeName = (content.storeName as string) || "Empresa";
  const tagline = content.tagline as string | undefined;
  const navLinks = (content.navLinks as { label: string; href: string }[]) || [];
  const copyrightText = content.copyrightText as string | undefined;
  const showSocial = content.showSocial as boolean | undefined;

  return (
    <footer
      data-pgl-edit="footer"
      data-pgl-path="footer"
      className="relative overflow-hidden"
      style={{ backgroundColor: tokens.palette.primary }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="flex flex-col items-center text-center">
          {/* Store name */}
          <div
            className="text-lg md:text-xl font-semibold text-white/90 mb-2"
            style={{
              fontFamily: "var(--pgl-font-heading)",
              letterSpacing: "var(--label-tracking, 0.1em)",
              textTransform: "var(--heading-transform, uppercase)" as never,
            }}
          >
            {storeName}
          </div>

          {/* Tagline */}
          {tagline && (
            <p className="text-sm text-white/25 font-light max-w-sm mb-8">
              {tagline}
            </p>
          )}

          {/* Decorative line */}
          <div
            className="w-8 h-px mb-8"
            style={{ backgroundColor: `${tokens.palette.accent}40` }}
          />

          {/* Nav links — horizontal, centered */}
          {navLinks.length > 0 && (
            <nav className="flex flex-wrap justify-center gap-x-7 gap-y-3 mb-8">
              {navLinks.map((link, i) => (
                <a
                  key={i}
                  href={link.href}
                  className={cn(
                    "text-sm text-white/30 font-light",
                    "transition-colors duration-200 hover:text-white/60"
                  )}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          )}

          {/* Social placeholders */}
          {showSocial && (
            <div className="flex items-center gap-6 mb-8">
              {["Instagram", "Facebook", "WhatsApp"].map((name) => (
                <span
                  key={name}
                  className={cn(
                    "text-xs font-light text-white/20 uppercase tracking-wider",
                    "transition-colors duration-200 cursor-pointer hover:text-white/45"
                  )}
                >
                  {name}
                </span>
              ))}
            </div>
          )}

          {/* Copyright */}
          <div
            className="pt-8 w-full text-center text-xs text-white/15"
            style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
          >
            <span>
              {copyrightText ||
                `\u00a9 ${new Date().getFullYear()} ${storeName}`}
            </span>
            <span className="mx-2 opacity-30">·</span>
            <span>Desenvolvido por Página Local</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
