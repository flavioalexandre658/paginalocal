"use client";

import { cn } from "@/lib/utils";
import type { DesignTokens } from "@/types/ai-generation";
import { ScrollReveal } from "./scroll-reveal";

interface Props {
  content: Record<string, unknown>;
  tokens: DesignTokens;
  isDark?: boolean;
  navigation?: { label: string; href: string; isExternal?: boolean }[];
}

export function VerveFooter({ content, tokens, navigation }: Props) {
  const storeName = (content.storeName as string) || "Empresa";
  const tagline = content.tagline as string | undefined;
  const navLinks = (content.navLinks as { label: string; href: string }[]) || navigation || [];
  const address = content.address as string | undefined;
  const phone = content.phone as string | undefined;
  const email = content.email as string | undefined;
  const copyrightText = content.copyrightText as string | undefined;
  const showSocial = content.showSocial as boolean | undefined;

  const primary = tokens.palette.primary;
  const accent = tokens.palette.accent;

  // Split nav links into two columns
  const midpoint = Math.ceil(navLinks.length / 2);
  const navCol1 = navLinks.slice(0, midpoint);
  const navCol2 = navLinks.slice(midpoint);

  const socialIcons = [
    {
      name: "Instagram",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" />
          <circle cx="12" cy="12" r="5" />
          <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
        </svg>
      ),
    },
    {
      name: "Facebook",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" />
          <rect x="2" y="9" width="4" height="12" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      ),
    },
  ];

  return (
    <footer
      data-pgl-edit="footer"
      data-pgl-path="footer"
      style={{ backgroundColor: primary }}
    >
      <div
        className="px-6 md:px-[60px] py-16 md:py-20"
        style={{ maxWidth: 1296, margin: "0 auto" }}
      >
        {/* Top row: Logo + Social */}
        <ScrollReveal>
          <div
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-12"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}
          >
            {/* Logo / Store name */}
            <div>
              <span
                style={{
                  fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                  fontSize: 22,
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  color: "#fff",
                }}
                data-pgl-path="storeName"
                data-pgl-edit="text"
              >
                {storeName}
              </span>
              {tagline && (
                <p
                  style={{
                    fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                    fontSize: 14,
                    fontWeight: 400,
                    lineHeight: "1.5em",
                    color: "rgba(255,255,255,0.4)",
                    margin: "6px 0 0",
                    maxWidth: 300,
                  }}
                  data-pgl-path="tagline"
                  data-pgl-edit="text"
                >
                  {tagline}
                </p>
              )}
            </div>

            {/* Social icons */}
            {showSocial !== false && (
              <div className="flex items-center gap-3">
                {socialIcons.map(({ name, icon }) => (
                  <a
                    key={name}
                    href="#"
                    aria-label={name}
                    className="transition-colors duration-200"
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      backgroundColor: "rgba(255,255,255,0.08)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "rgba(255,255,255,0.5)",
                      transition: "background-color 0.2s, color 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = accent;
                      e.currentTarget.style.color = "#fff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.08)";
                      e.currentTarget.style.color = "rgba(255,255,255,0.5)";
                    }}
                  >
                    {icon}
                  </a>
                ))}
              </div>
            )}
          </div>
        </ScrollReveal>

        {/* Middle: Navigation + Contact columns */}
        <ScrollReveal delay={100}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 py-12">
            {/* Nav column 1 */}
            {navCol1.length > 0 && (
              <div>
                <h4
                  style={{
                    fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.4)",
                    marginBottom: 16,
                  }}
                >
                  Navegacao
                </h4>
                <nav className="space-y-3">
                  {navCol1.map((link, i) => (
                    <a
                      key={i}
                      href={link.href}
                      className={cn(
                        "block text-sm font-light",
                        "transition-colors duration-200"
                      )}
                      style={{ color: "rgba(255,255,255,0.55)" }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.55)"; }}
                    >
                      {link.label}
                    </a>
                  ))}
                </nav>
              </div>
            )}

            {/* Nav column 2 */}
            {navCol2.length > 0 && (
              <div>
                <h4
                  style={{
                    fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.4)",
                    marginBottom: 16,
                  }}
                >
                  Mais
                </h4>
                <nav className="space-y-3">
                  {navCol2.map((link, i) => (
                    <a
                      key={i}
                      href={link.href}
                      className={cn(
                        "block text-sm font-light",
                        "transition-colors duration-200"
                      )}
                      style={{ color: "rgba(255,255,255,0.55)" }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.55)"; }}
                    >
                      {link.label}
                    </a>
                  ))}
                </nav>
              </div>
            )}

            {/* Contact column */}
            <div>
              <h4
                style={{
                  fontFamily: "var(--pgl-font-heading), system-ui, sans-serif",
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.4)",
                  marginBottom: 16,
                }}
              >
                Contato
              </h4>
              <div className="space-y-3">
                {address && (
                  <p
                    style={{
                      fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                      fontSize: 14,
                      fontWeight: 400,
                      lineHeight: "1.5em",
                      color: "rgba(255,255,255,0.55)",
                      margin: 0,
                    }}
                  >
                    {address}
                  </p>
                )}
                {phone && (
                  <a
                    href={`tel:${phone.replace(/\D/g, "")}`}
                    className="block transition-colors duration-200"
                    style={{
                      fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                      fontSize: 14,
                      fontWeight: 400,
                      color: "rgba(255,255,255,0.55)",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = accent; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.55)"; }}
                  >
                    {phone}
                  </a>
                )}
                {email && (
                  <a
                    href={`mailto:${email}`}
                    className="block transition-colors duration-200"
                    style={{
                      fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                      fontSize: 14,
                      fontWeight: 400,
                      color: "rgba(255,255,255,0.55)",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = accent; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.55)"; }}
                  >
                    {email}
                  </a>
                )}
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Bottom: Copyright */}
        <ScrollReveal delay={200}>
          <div
            className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8"
            style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
          >
            <span
              style={{
                fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                fontSize: 13,
                fontWeight: 400,
                color: "rgba(255,255,255,0.25)",
              }}
              data-pgl-path="copyrightText"
              data-pgl-edit="text"
            >
              {copyrightText ||
                `\u00a9 ${new Date().getFullYear()} ${storeName}. Todos os direitos reservados.`}
            </span>
            <span
              style={{
                fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
                fontSize: 12,
                fontWeight: 400,
                color: "rgba(255,255,255,0.15)",
              }}
            >
              Desenvolvido por Decolou
            </span>
          </div>
        </ScrollReveal>
      </div>
    </footer>
  );
}
