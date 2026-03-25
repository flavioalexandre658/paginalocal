"use client";

import type { DesignTokens } from "@/types/ai-generation";

interface Props {
  tokens: DesignTokens;
  globalContent: {
    tagline?: string;
    footerText?: string;
  };
  navigation: { label: string; href: string }[];
  storeName: string;
}

export function FooterPremium({ tokens, globalContent, navigation, storeName }: Props) {
  return (
    <footer style={{ backgroundColor: tokens.palette.primary }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pb-8">
        {/* Grid */}
        <div className="grid md:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div
              className="text-base font-semibold text-white tracking-[0.1em] uppercase mb-4"
              style={{ fontFamily: "var(--pgl-font-heading)" }}
            >
              {storeName}
            </div>
            {globalContent.tagline && (
              <p className="text-[0.825rem] leading-[1.7] text-white/30 font-light max-w-xs">
                {globalContent.tagline}
              </p>
            )}
          </div>

          {/* Navigation */}
          <div>
            <h4
              className="text-[0.75rem] font-semibold tracking-[0.12em] uppercase text-white/45 mb-4"
              style={{ fontFamily: "var(--pgl-font-heading)" }}
            >
              Navega\u00e7\u00e3o
            </h4>
            <div className="space-y-2.5">
              {navigation.map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  className="block text-[0.825rem] text-white/30 font-light transition-colors duration-200 hover:text-white/70"
                  style={{ "--accent": tokens.palette.accent } as any}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          {/* Contact summary */}
          <div>
            <h4
              className="text-[0.75rem] font-semibold tracking-[0.12em] uppercase text-white/45 mb-4"
              style={{ fontFamily: "var(--pgl-font-heading)" }}
            >
              Contato
            </h4>
            <div className="space-y-2.5 text-[0.825rem] text-white/30 font-light">
              <p>WhatsApp dispon\u00edvel</p>
              <p>Seg - S\u00e1b, 07:10 - 18:00</p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div
          className="pt-8 flex flex-wrap justify-between gap-4 text-[0.72rem] text-white/20 tracking-[0.03em]"
          style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
        >
          <span>{globalContent.footerText || `\u00a9 ${new Date().getFullYear()} ${storeName}`}</span>
          <span>Desenvolvido por P\u00e1gina Local</span>
        </div>
      </div>
    </footer>
  );
}
