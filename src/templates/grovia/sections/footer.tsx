"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { DesignTokens } from "@/types/ai-generation";
import { useSubmitFormLead } from "@/hooks/use-submit-form-lead";

interface Props {
  content: Record<string, unknown>;
  tokens: DesignTokens;
  isDark?: boolean;
}

export function GroviaFooter({ content, tokens }: Props) {
  const storeName = (content.storeName as string) || "Empresa";
  const tagline = content.tagline as string | undefined;
  const navLinks = (content.navLinks as { label: string; href: string }[]) || [];
  const address = content.address as string | undefined;
  const phone = content.phone as string | undefined;
  const email = content.email as string | undefined;
  const copyrightText = content.copyrightText as string | undefined;
  const showSocial = content.showSocial as boolean | undefined;

  // Split nav links into two columns
  const midpoint = Math.ceil(navLinks.length / 2);
  const navCol1 = navLinks.slice(0, midpoint);
  const navCol2 = navLinks.slice(midpoint);

  return (
    <footer
      data-pgl-edit="footer"
      data-pgl-path="footer"
      className="relative overflow-hidden"
      style={{ backgroundColor: "var(--pgl-background)" }}
    >
      <div className="mx-auto max-w-[1200px] px-6 md:px-10 py-16 md:py-20">
        {/* Inner container with dark rounded bg — matches header CTA color */}
        <div
          className="rounded-3xl p-8 md:p-12 lg:p-16"
          style={{ backgroundColor: "var(--pgl-text, #1a1a1a)" }}
        >
          {/* Newsletter row */}
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start lg:items-center mb-14 pb-14"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
          >
            {/* Left: newsletter text */}
            <div className="lg:w-1/2">
              <p
                className="text-[0.7rem] font-medium tracking-[0.1em] uppercase mb-3"
                style={{ color: "rgba(255,255,255,0.45)" }}
              >
                Newsletter
              </p>
              <p
                className="text-sm leading-relaxed font-light max-w-sm"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                Fique por dentro das novidades e ofertas exclusivas.
              </p>
            </div>

            {/* Right: pill input + button */}
            <NewsletterForm accent={tokens.palette.accent} />
          </div>

          {/* 4-column grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-14">
            {/* Col 1: Brand */}
            <div>
              <div
                className="text-base font-semibold text-white/90 uppercase mb-3"
                style={{
                  fontFamily: "var(--pgl-font-heading)",
                  letterSpacing: "var(--label-tracking, 0.1em)",
                  textTransform: "var(--heading-transform, uppercase)" as never,
                }}
                data-pgl-path="storeName"
                data-pgl-edit="text"
              >
                {storeName}
              </div>
              {tagline && (
                <p
                  className="text-sm leading-relaxed text-white/30 font-light max-w-xs"
                  data-pgl-path="tagline"
                  data-pgl-edit="text"
                >
                  {tagline}
                </p>
              )}
            </div>

            {/* Col 2: Nav links (first half) */}
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
                {navCol1.map((link, i) => (
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

            {/* Col 3: Nav links (second half) or Resources */}
            <div>
              <h4
                className="text-xs font-semibold uppercase text-white/45 mb-4"
                style={{
                  fontFamily: "var(--pgl-font-heading)",
                  letterSpacing: "var(--label-tracking, 0.12em)",
                }}
              >
                {navCol2.length > 0 ? "Mais" : "Contato"}
              </h4>
              <nav className="space-y-2.5">
                {navCol2.length > 0 ? (
                  navCol2.map((link, i) => (
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
                  ))
                ) : (
                  <div className="space-y-2.5 text-sm text-white/30 font-light">
                    {address && <p>{address}</p>}
                    {phone && <p>{phone}</p>}
                    {email && <p>{email}</p>}
                  </div>
                )}
              </nav>
            </div>

            {/* Col 4: Contact */}
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

          {/* Bottom bar: copyright + social */}
          <div
            className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/20"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            <span
              data-pgl-path="copyrightText"
              data-pgl-edit="text"
            >
              {copyrightText ||
                `\u00a9 ${new Date().getFullYear()} ${storeName}. Todos os direitos reservados.`}
            </span>

            <div className="flex items-center gap-5">
              {showSocial !== false && (
                <>
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
                </>
              )}
              <span className="text-white/15">
                Desenvolvido por Decolou
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function NewsletterForm({ accent }: { accent: string }) {
  const { submit, isSubmitting, submitted } = useSubmitFormLead();
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    submit({ name: email.trim(), email: email.trim() });
  };

  if (submitted) {
    return (
      <div className="lg:w-1/2 w-full">
        <div
          className="flex items-center gap-3 rounded-full px-5 py-3"
          style={{ backgroundColor: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="8" fill={accent} />
            <path d="M6.5 10l2.5 2.5 4.5-4.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-sm font-light text-white/60" style={{ fontFamily: "var(--pgl-font-body)" }}>
            Inscrito com sucesso!
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:w-1/2 w-full">
      <form onSubmit={handleSubmit}>
        <div
          className="flex items-center gap-0 rounded-full overflow-hidden"
          style={{ backgroundColor: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <input
            type="email"
            placeholder="Seu melhor e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 bg-transparent px-5 py-3 text-sm font-light text-white/80 placeholder:text-white/25 outline-none min-w-0"
            style={{ fontFamily: "var(--pgl-font-body)" }}
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="shrink-0 px-6 py-3 text-sm font-medium text-white rounded-full mr-1 transition-opacity hover:opacity-90"
            style={{
              backgroundColor: accent,
              fontFamily: "var(--pgl-font-heading)",
              opacity: isSubmitting ? 0.7 : 1,
              cursor: isSubmitting ? "wait" : "pointer",
            }}
          >
            {isSubmitting ? "..." : "Inscrever"}
          </button>
        </div>
      </form>
    </div>
  );
}
