"use client";

import { useState } from "react";
import type { DesignTokens } from "@/types/ai-generation";
import { useSubmitFormLead } from "@/hooks/use-submit-form-lead";
import { ScrollReveal } from "./scroll-reveal";

interface Props {
  content: Record<string, unknown>;
  tokens: DesignTokens;
  isDark?: boolean;
}

export function BellezzaFooter({ content, tokens }: Props) {
  const storeName = (content.storeName as string) || "Bellezza";
  const tagline = content.tagline as string | undefined;
  const navLinks = (content.navLinks as { label: string; href: string }[]) || [];
  const categories = (content.services as string[]) || [];
  const address = content.address as string | undefined;
  const phone = content.phone as string | undefined;
  const email = content.email as string | undefined;
  const copyrightText = content.copyrightText as string | undefined;
  const showSocial = content.showSocial as boolean | undefined;

  const accent = tokens.palette.accent || "#B8977E";
  const primary = tokens.palette.primary || "#1A1A1A";

  const { submit, isSubmitting, submitted } = useSubmitFormLead();
  const [newsletterEmail, setNewsletterEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    submit({ name: newsletterEmail.trim(), email: newsletterEmail.trim() });
  };

  const linkStyle: React.CSSProperties = {
    fontFamily: "var(--pgl-font-body, 'Poppins'), system-ui, sans-serif",
    fontSize: 14,
    fontWeight: 400,
    lineHeight: "2.2em",
    color: `${primary}88`,
    textDecoration: "none",
    transition: "color 0.2s ease",
  };

  const columnTitleStyle: React.CSSProperties = {
    fontFamily: "var(--pgl-font-heading, 'Playfair Display'), system-ui, serif",
    fontSize: 18,
    fontWeight: 700,
    color: primary,
    margin: 0,
    marginBottom: 20,
    lineHeight: "1.4em",
  };

  return (
    <footer
      data-pgl-edit="footer"
      data-pgl-path="copyrightText"
      style={{
        backgroundColor: `color-mix(in srgb, var(--pgl-background, #FFFAF5) 96%, ${accent} 4%)`,
        fontFamily: "var(--pgl-font-body, 'Poppins'), system-ui, sans-serif",
      }}
    >
      <div className="mx-auto max-w-[1200px] px-5 md:px-10 py-16 md:py-24">
        {/* ═══ Topo: Logo + Tagline + Newsletter ═══ */}
        <div
          className="flex flex-col md:flex-row md:items-end md:justify-between"
          style={{
            gap: 32,
            paddingBottom: 48,
            borderBottom: `1px solid ${primary}12`,
            marginBottom: 48,
          }}
        >
          {/* Logo + tagline */}
          <ScrollReveal delay={0}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 340 }}>
              <div
                data-pgl-path="storeName"
                data-pgl-edit="text"
                style={{
                  fontFamily: "var(--pgl-font-heading, 'Playfair Display'), system-ui, serif",
                  fontSize: 32,
                  fontWeight: 700,
                  fontStyle: "italic",
                  color: primary,
                  letterSpacing: "-0.02em",
                  lineHeight: "1.2em",
                }}
              >
                {storeName}
              </div>
              {tagline && (
                <p
                  data-pgl-path="tagline"
                  data-pgl-edit="text"
                  style={{
                    fontFamily: "var(--pgl-font-body, 'Poppins'), system-ui, sans-serif",
                    fontSize: 15,
                    fontWeight: 400,
                    lineHeight: "1.7em",
                    color: `${primary}70`,
                    margin: 0,
                  }}
                >
                  {tagline}
                </p>
              )}
            </div>
          </ScrollReveal>

          {/* Newsletter */}
          <ScrollReveal delay={100}>
            <div style={{ maxWidth: 420, width: "100%" }}>
              <p
                style={{
                  fontFamily: "var(--pgl-font-body, 'Poppins'), system-ui, sans-serif",
                  fontSize: 14,
                  fontWeight: 500,
                  color: primary,
                  margin: "0 0 12px",
                  letterSpacing: "0.02em",
                }}
              >
                Receba nossas novidades
              </p>

              {submitted ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "14px 0",
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 48 48" fill="none">
                    <circle cx="24" cy="24" r="20" fill={accent} />
                    <path d="M16 24l6 6 10-10" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span
                    style={{
                      fontFamily: "var(--pgl-font-body, 'Poppins'), system-ui, sans-serif",
                      fontSize: 15,
                      fontWeight: 500,
                      color: primary,
                    }}
                  >
                    Inscrito com sucesso!
                  </span>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {/* Desktop: inline pill */}
                  <div
                    className="hidden sm:flex"
                    style={{
                      borderRadius: 100,
                      border: `1px solid ${primary}18`,
                      backgroundColor: "var(--pgl-background, #FFFAF5)",
                      overflow: "hidden",
                      alignItems: "center",
                    }}
                  >
                    <input
                      type="email"
                      name="email"
                      placeholder="Seu melhor e-mail"
                      required
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      className="flex-1 min-w-0"
                      style={{
                        padding: "14px 20px",
                        backgroundColor: "transparent",
                        border: "none",
                        fontFamily: "var(--pgl-font-body, 'Poppins'), system-ui, sans-serif",
                        fontSize: 14,
                        fontWeight: 400,
                        color: primary,
                        outline: "none",
                      }}
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      style={{
                        padding: "12px 28px",
                        margin: 4,
                        backgroundColor: accent,
                        border: "none",
                        borderRadius: 100,
                        fontFamily: "var(--pgl-font-body, 'Poppins'), system-ui, sans-serif",
                        fontSize: 14,
                        fontWeight: 600,
                        color: "#fff",
                        cursor: isSubmitting ? "wait" : "pointer",
                        opacity: isSubmitting ? 0.7 : 1,
                        transition: "opacity 0.2s, transform 0.2s",
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                      }}
                      onMouseEnter={(e) => {
                        if (!isSubmitting) e.currentTarget.style.transform = "translateY(-1px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                      }}
                    >
                      {isSubmitting ? "Enviando..." : "Enviar"}
                    </button>
                  </div>

                  {/* Mobile: stacked */}
                  <div className="flex sm:hidden flex-col" style={{ gap: 10 }}>
                    <input
                      type="email"
                      name="email-mobile"
                      placeholder="Seu melhor e-mail"
                      required
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      style={{
                        padding: "14px 18px",
                        backgroundColor: "var(--pgl-background, #FFFAF5)",
                        border: `1px solid ${primary}18`,
                        borderRadius: 12,
                        fontFamily: "var(--pgl-font-body, 'Poppins'), system-ui, sans-serif",
                        fontSize: 14,
                        fontWeight: 400,
                        color: primary,
                        outline: "none",
                        width: "100%",
                      }}
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      style={{
                        padding: "14px 28px",
                        backgroundColor: accent,
                        border: "none",
                        borderRadius: 100,
                        fontFamily: "var(--pgl-font-body, 'Poppins'), system-ui, sans-serif",
                        fontSize: 14,
                        fontWeight: 600,
                        color: "#fff",
                        cursor: isSubmitting ? "wait" : "pointer",
                        opacity: isSubmitting ? 0.7 : 1,
                        transition: "opacity 0.2s",
                        width: "100%",
                      }}
                    >
                      {isSubmitting ? "Enviando..." : "Enviar"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </ScrollReveal>
        </div>

        {/* ═══ Colunas: Links, Categorias, Contato ═══ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
          {/* Coluna 1: Links Rapidos */}
          <ScrollReveal delay={0}>
            <div>
              <h4
                data-pgl-path="quickLinksTitle"
                data-pgl-edit="text"
                style={columnTitleStyle}
              >
                Links
              </h4>
              <nav style={{ display: "flex", flexDirection: "column" }}>
                {navLinks.length > 0
                  ? navLinks.map((link, i) => (
                      <a
                        key={i}
                        href={link.href}
                        data-pgl-path={`navLinks.${i}.label`}
                        data-pgl-edit="text"
                        style={linkStyle}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.color = accent;
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.color = `${primary}88`;
                        }}
                      >
                        {link.label}
                      </a>
                    ))
                  : ["Inicio", "Sobre", "Produtos", "Contato"].map((label, i) => (
                      <a
                        key={i}
                        href={`#${label.toLowerCase()}`}
                        data-pgl-path={`navLinks.${i}.label`}
                        data-pgl-edit="text"
                        style={linkStyle}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.color = accent;
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.color = `${primary}88`;
                        }}
                      >
                        {label}
                      </a>
                    ))}
              </nav>
            </div>
          </ScrollReveal>

          {/* Coluna 2: Categorias */}
          <ScrollReveal delay={100}>
            <div>
              <h4
                data-pgl-path="servicesTitle"
                data-pgl-edit="text"
                style={columnTitleStyle}
              >
                Categorias
              </h4>
              <nav style={{ display: "flex", flexDirection: "column" }}>
                {(categories.length > 0
                  ? categories
                  : ["Skincare", "Maquiagem", "Fragancias", "Cabelos"]
                ).map((label, i) => (
                  <span
                    key={i}
                    data-pgl-path={`services.${i}`}
                    data-pgl-edit="text"
                    style={linkStyle}
                  >
                    {label}
                  </span>
                ))}
              </nav>
            </div>
          </ScrollReveal>

          {/* Coluna 3: Contato */}
          <ScrollReveal delay={200}>
            <div>
              <h4
                data-pgl-path="contactTitle"
                data-pgl-edit="text"
                style={columnTitleStyle}
              >
                Contato
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {address && (
                  <div
                    data-pgl-path="address"
                    data-pgl-edit="text"
                    style={{ display: "flex", alignItems: "flex-start", gap: 10 }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1118 0z" stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="12" cy="10" r="3" stroke={accent} strokeWidth="1.5" />
                    </svg>
                    <span style={{ ...linkStyle, lineHeight: "1.5em" }}>{address}</span>
                  </div>
                )}

                {email && (
                  <a
                    href={`mailto:${email}`}
                    data-pgl-path="email"
                    data-pgl-edit="text"
                    style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}
                    onMouseEnter={(e) => {
                      const span = e.currentTarget.querySelector("span");
                      if (span) span.style.color = accent;
                    }}
                    onMouseLeave={(e) => {
                      const span = e.currentTarget.querySelector("span");
                      if (span) span.style.color = `${primary}88`;
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                      <rect x="2" y="4" width="20" height="16" rx="2" stroke={accent} strokeWidth="1.5" />
                      <path d="M22 7l-10 7L2 7" stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span style={linkStyle}>{email}</span>
                  </a>
                )}

                {phone && (
                  <a
                    href={`tel:${phone.replace(/\D/g, "")}`}
                    data-pgl-path="phone"
                    data-pgl-edit="text"
                    style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}
                    onMouseEnter={(e) => {
                      const span = e.currentTarget.querySelector("span");
                      if (span) span.style.color = accent;
                    }}
                    onMouseLeave={(e) => {
                      const span = e.currentTarget.querySelector("span");
                      if (span) span.style.color = `${primary}88`;
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                      <path
                        d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"
                        stroke={accent}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span style={linkStyle}>{phone}</span>
                  </a>
                )}

                {/* Social icons: Instagram, YouTube, WhatsApp */}
                {showSocial !== false && (
                  <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
                    {/* Instagram */}
                    <a
                      href="#"
                      aria-label="Instagram"
                      data-pgl-path="socialInstagram"
                      data-pgl-edit="text"
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        border: `1px solid ${primary}20`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "border-color 0.2s ease, background-color 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = accent;
                        e.currentTarget.style.backgroundColor = accent;
                        const svg = e.currentTarget.querySelector("svg");
                        if (svg) svg.querySelectorAll("[stroke]").forEach(el => el.setAttribute("stroke", "#fff"));
                        const fills = svg?.querySelectorAll("[fill]:not([fill='none'])");
                        fills?.forEach(el => el.setAttribute("fill", "#fff"));
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = `${primary}20`;
                        e.currentTarget.style.backgroundColor = "transparent";
                        const svg = e.currentTarget.querySelector("svg");
                        if (svg) svg.querySelectorAll("[stroke]").forEach(el => el.setAttribute("stroke", primary));
                        const fills = svg?.querySelectorAll("[fill]:not([fill='none'])");
                        fills?.forEach(el => el.setAttribute("fill", primary));
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <rect x="2" y="2" width="20" height="20" rx="5" stroke={primary} strokeWidth="1.5" />
                        <circle cx="12" cy="12" r="5" stroke={primary} strokeWidth="1.5" />
                        <circle cx="17.5" cy="6.5" r="1" fill={primary} />
                      </svg>
                    </a>

                    {/* YouTube */}
                    <a
                      href="#"
                      aria-label="YouTube"
                      data-pgl-path="socialYoutube"
                      data-pgl-edit="text"
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        border: `1px solid ${primary}20`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "border-color 0.2s ease, background-color 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = accent;
                        e.currentTarget.style.backgroundColor = accent;
                        const paths = e.currentTarget.querySelectorAll("svg path, svg rect");
                        paths.forEach(el => { if (el.getAttribute("stroke")) el.setAttribute("stroke", "#fff"); });
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = `${primary}20`;
                        e.currentTarget.style.backgroundColor = "transparent";
                        const paths = e.currentTarget.querySelectorAll("svg path, svg rect");
                        paths.forEach(el => { if (el.getAttribute("stroke")) el.setAttribute("stroke", primary); });
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <rect x="2" y="4" width="20" height="16" rx="4" stroke={primary} strokeWidth="1.5" />
                        <path d="M10 9l5 3-5 3V9z" stroke={primary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </a>

                    {/* WhatsApp */}
                    <a
                      href="#"
                      aria-label="WhatsApp"
                      data-pgl-path="socialWhatsapp"
                      data-pgl-edit="text"
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        border: `1px solid ${primary}20`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "border-color 0.2s ease, background-color 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = accent;
                        e.currentTarget.style.backgroundColor = accent;
                        const paths = e.currentTarget.querySelectorAll("svg path");
                        paths.forEach(el => { if (el.getAttribute("stroke")) el.setAttribute("stroke", "#fff"); });
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = `${primary}20`;
                        e.currentTarget.style.backgroundColor = "transparent";
                        const paths = e.currentTarget.querySelectorAll("svg path");
                        paths.forEach(el => { if (el.getAttribute("stroke")) el.setAttribute("stroke", primary); });
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"
                          stroke={primary}
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* ═══ Copyright ═══ */}
        <div
          style={{
            borderTop: `1px solid ${primary}10`,
            marginTop: 48,
            paddingTop: 24,
          }}
        >
          <ScrollReveal delay={300}>
            <div
              className="flex flex-col sm:flex-row justify-between items-center gap-4"
              style={{
                fontSize: 13,
                fontWeight: 400,
                color: `${primary}50`,
              }}
            >
              <span
                data-pgl-path="copyrightText"
                data-pgl-edit="text"
              >
                {copyrightText ||
                  `\u00a9 ${new Date().getFullYear()} ${storeName}. Todos os direitos reservados.`}
              </span>

              <span style={{ color: `${primary}30` }}>
                Desenvolvido por Decolou
              </span>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </footer>
  );
}
