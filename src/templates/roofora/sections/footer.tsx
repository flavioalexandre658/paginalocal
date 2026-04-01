"use client";

import type { DesignTokens } from "@/types/ai-generation";
import { ScrollReveal } from "./scroll-reveal";

interface Props {
  content: Record<string, unknown>;
  tokens: DesignTokens;
  isDark?: boolean;
}

export function RooforaFooter({ content, tokens }: Props) {
  const storeName = (content.storeName as string) || "Empresa";
  const tagline = content.tagline as string | undefined;
  const navLinks = (content.navLinks as { label: string; href: string }[]) || [];
  const services = (content.services as string[]) || [];
  const address = content.address as string | undefined;
  const phone = content.phone as string | undefined;
  const email = content.email as string | undefined;
  const copyrightText = content.copyrightText as string | undefined;
  const showSocial = content.showSocial as boolean | undefined;

  const accent = tokens.palette.accent || "#CDF660";
  const dark = tokens.palette.primary || "#0E1201";

  const linkStyle: React.CSSProperties = {
    fontFamily: "var(--pgl-font-body, 'Urbanist'), system-ui, sans-serif",
    fontSize: 15,
    fontWeight: 400,
    lineHeight: "2em",
    color: "rgba(252,255,245,0.6)",
    textDecoration: "none",
    transition: "color 0.2s ease",
  };

  const columnTitleStyle: React.CSSProperties = {
    fontFamily: "var(--pgl-font-heading, 'Urbanist'), system-ui, sans-serif",
    fontSize: 18,
    fontWeight: 600,
    color: "#fff",
    margin: 0,
    marginBottom: 20,
    lineHeight: "1.4em",
  };

  return (
    <footer
      data-pgl-edit="footer"
      data-pgl-path="copyrightText"
      style={{
        backgroundColor: dark,
        fontFamily: "var(--pgl-font-body, 'Urbanist'), system-ui, sans-serif",
      }}
    >
      <div className="mx-auto max-w-[1200px] px-5 md:px-10 py-16 md:py-20">
        {/* ═══ Topo: logo + colunas ═══ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Coluna 1: Marca + descricao + social */}
          <ScrollReveal delay={0}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div
                data-pgl-path="storeName"
                data-pgl-edit="text"
                style={{
                  fontFamily: "var(--pgl-font-heading, 'Urbanist'), system-ui, sans-serif",
                  fontSize: 24,
                  fontWeight: 700,
                  color: "#fff",
                  letterSpacing: "-0.5px",
                }}
              >
                {storeName}
              </div>

              {tagline && (
                <p
                  data-pgl-path="tagline"
                  data-pgl-edit="text"
                  style={{
                    fontSize: 15,
                    fontWeight: 400,
                    lineHeight: "1.7em",
                    color: "rgba(252,255,245,0.5)",
                    margin: 0,
                    maxWidth: 280,
                  }}
                >
                  {tagline}
                </p>
              )}

              {/* Redes sociais */}
              {showSocial !== false && (
                <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                  {/* Facebook */}
                  <a
                    href="#"
                    aria-label="Facebook"
                    data-pgl-path="socialFacebook"
                    data-pgl-edit="text"
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      border: "1px solid rgba(252,255,245,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "border-color 0.2s ease, background-color 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = accent;
                      e.currentTarget.style.backgroundColor = accent;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "rgba(252,255,245,0.2)";
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3V2z"
                        stroke="#fff"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>

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
                      border: "1px solid rgba(252,255,245,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "border-color 0.2s ease, background-color 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = accent;
                      e.currentTarget.style.backgroundColor = accent;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "rgba(252,255,245,0.2)";
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <rect x="2" y="2" width="20" height="20" rx="5" stroke="#fff" strokeWidth="1.5" />
                      <circle cx="12" cy="12" r="5" stroke="#fff" strokeWidth="1.5" />
                      <circle cx="17.5" cy="6.5" r="1" fill="#fff" />
                    </svg>
                  </a>

                  {/* LinkedIn */}
                  <a
                    href="#"
                    aria-label="LinkedIn"
                    data-pgl-path="socialLinkedin"
                    data-pgl-edit="text"
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      border: "1px solid rgba(252,255,245,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "border-color 0.2s ease, background-color 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = accent;
                      e.currentTarget.style.backgroundColor = accent;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "rgba(252,255,245,0.2)";
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6zM2 9h4v12H2V9zM4 6a2 2 0 100-4 2 2 0 000 4z"
                        stroke="#fff"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                </div>
              )}
            </div>
          </ScrollReveal>

          {/* Coluna 2: Links rapidos */}
          <ScrollReveal delay={100}>
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
                          (e.currentTarget as HTMLElement).style.color = "rgba(252,255,245,0.6)";
                        }}
                      >
                        {link.label}
                      </a>
                    ))
                  : ["Inicio", "Sobre", "Servicos", "Contato"].map((label, i) => (
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
                          (e.currentTarget as HTMLElement).style.color = "rgba(252,255,245,0.6)";
                        }}
                      >
                        {label}
                      </a>
                    ))}
              </nav>
            </div>
          </ScrollReveal>

          {/* Coluna 3: Servicos */}
          <ScrollReveal delay={200}>
            <div>
              <h4
                data-pgl-path="servicesTitle"
                data-pgl-edit="text"
                style={columnTitleStyle}
              >
                Servicos
              </h4>
              <nav style={{ display: "flex", flexDirection: "column" }}>
                {(services.length > 0
                  ? services
                  : ["Telhados", "Energia Solar", "Manutencao", "Reformas"]
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

          {/* Coluna 4: Contato */}
          <ScrollReveal delay={300}>
            <div>
              <h4
                data-pgl-path="contactTitle"
                data-pgl-edit="text"
                style={columnTitleStyle}
              >
                Contato
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {/* Endereco */}
                {address && (
                  <div
                    data-pgl-path="address"
                    data-pgl-edit="text"
                    style={{ display: "flex", alignItems: "flex-start", gap: 10 }}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      style={{ flexShrink: 0, marginTop: 2 }}
                    >
                      <path
                        d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1118 0z"
                        stroke={accent}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle cx="12" cy="10" r="3" stroke={accent} strokeWidth="1.5" />
                    </svg>
                    <span style={{ ...linkStyle, lineHeight: "1.5em" }}>{address}</span>
                  </div>
                )}

                {/* E-mail */}
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
                      if (span) span.style.color = "rgba(252,255,245,0.6)";
                    }}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      style={{ flexShrink: 0 }}
                    >
                      <rect x="2" y="4" width="20" height="16" rx="2" stroke={accent} strokeWidth="1.5" />
                      <path d="M22 7l-10 7L2 7" stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span style={linkStyle}>{email}</span>
                  </a>
                )}

                {/* Telefone */}
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
                      if (span) span.style.color = "rgba(252,255,245,0.6)";
                    }}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      style={{ flexShrink: 0 }}
                    >
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
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* ═══ Separador ═══ */}
        <div
          style={{
            borderTop: "1px solid rgba(252,255,245,0.1)",
            marginTop: 48,
            paddingTop: 24,
          }}
        >
          <ScrollReveal delay={400}>
            <div
              className="flex flex-col sm:flex-row justify-between items-center gap-4"
              style={{
                fontSize: 14,
                fontWeight: 400,
                color: "rgba(252,255,245,0.35)",
              }}
            >
              <span
                data-pgl-path="copyrightText"
                data-pgl-edit="text"
              >
                {copyrightText ||
                  `\u00a9 ${new Date().getFullYear()} ${storeName}. Todos os direitos reservados.`}
              </span>

              <span style={{ color: "rgba(252,255,245,0.2)" }}>
                Desenvolvido por Decolou
              </span>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </footer>
  );
}
