"use client";

import { cn } from "@/lib/utils";
import type { DesignTokens } from "@/types/ai-generation";

interface Props {
  content: Record<string, unknown>;
  tokens: DesignTokens;
  isDark?: boolean;
}

export function FooterMinimal({ content, tokens }: Props) {
  const storeName = (content.storeName as string) || "Empresa";
  const navLinks = (content.navLinks as { label: string; href: string }[]) || [];
  const copyrightText = content.copyrightText as string | undefined;

  return (
    <footer
      data-pgl-edit="footer"
      data-pgl-path="footer"
      className="border-t"
      style={{ borderColor: `${tokens.palette.primary}10` }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6 md:py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Store name */}
          <div
            className="text-sm font-semibold tracking-wide uppercase"
            style={{
              fontFamily: "var(--pgl-font-heading)",
              color: tokens.palette.text,
              letterSpacing: "var(--label-tracking, 0.08em)",
              textTransform: "var(--heading-transform, uppercase)" as never,
            }}
          >
            {storeName}
          </div>

          {/* Inline nav links */}
          {navLinks.length > 0 && (
            <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {navLinks.map((link, i) => (
                <a
                  key={i}
                  href={link.href}
                  className={cn(
                    "text-sm transition-colors duration-200",
                    "underline-offset-4 decoration-transparent hover:decoration-current"
                  )}
                  style={{
                    color: tokens.palette.textMuted,
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = tokens.palette.accent)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = tokens.palette.textMuted)
                  }
                >
                  {link.label}
                </a>
              ))}
            </nav>
          )}

          {/* Copyright */}
          <div
            className="text-xs"
            style={{ color: tokens.palette.textMuted }}
          >
            <span>
              {copyrightText ||
                `\u00a9 ${new Date().getFullYear()} ${storeName}`}
            </span>
            <span className="mx-2" style={{ opacity: 0.3 }}>
              |
            </span>
            <span>Desenvolvido por Decolou</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
